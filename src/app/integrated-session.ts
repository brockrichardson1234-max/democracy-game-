import { assertConfigurationIdentityCompatible, loadGovernmentConfiguration } from "../configuration/loader";
import type { GovernmentConfiguration, LegislativeRuntimeSeed } from "../configuration/types";
import {
  createIntegratedPartialRuntimeState,
  type IntegratedPartialRuntimeState,
  type IntegratedRuntimeArtifactBundle,
} from "../sim/integrated-runtime";
import {
  assertWeightedPopulationConservation,
  mergeWeightedPopulationCohorts,
  refineWeightedPopulationCohort,
  type PopulationRefinementRequest,
} from "../sim/population-core";
import { parseLegislativeRuntime, serializeLegislativeRuntime } from "./legislative-persistence";
import {
  createInitialLegislativeControlBinding,
  createLegislativeSessionForStateOwner,
  type LegislativeSession,
  type LegislativeControlBinding,
} from "./legislative-session";

export const INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION = 1 as const;

interface IntegratedPartialSaveEnvelope {
  readonly formatVersion: typeof INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION;
  readonly configuration: IntegratedPartialRuntimeState["configuration"];
  readonly artifactBindings: IntegratedPartialRuntimeState["artifactBindings"];
  readonly geographyArtifactIds: readonly string[];
  readonly legislativeRuntime: IntegratedPartialRuntimeState["legislative"];
  readonly controlBinding: LegislativeControlBinding;
  readonly population: IntegratedPartialRuntimeState["population"];
  readonly electoralTopology: IntegratedPartialRuntimeState["electoralTopology"];
}

const deepCopy = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export interface IntegratedPartialRuntimeSession {
  readonly getAuditState: () => IntegratedPartialRuntimeState;
  readonly getControlBindingAudit: () => LegislativeControlBinding;
  readonly getLegislativeAdministrationView: LegislativeSession["getAdministrationView"];
  readonly reviseAgenda: LegislativeSession["reviseAgenda"];
  readonly beginSponsorSearch: LegislativeSession["beginSponsorSearch"];
  readonly seekSponsorship: LegislativeSession["seekSponsorship"];
  readonly introduceBySponsor: LegislativeSession["introduceBySponsor"];
  readonly advanceIntroducedProposal: LegislativeSession["advanceIntroducedProposal"];
  readonly resolveConsiderationGate: LegislativeSession["resolveConsiderationGate"];
  readonly negotiateWithActor: LegislativeSession["negotiateWithActor"];
  readonly negotiateWithOrganization: LegislativeSession["negotiateWithOrganization"];
  readonly coordinateOrganization: LegislativeSession["coordinateOrganization"];
  readonly requestAmendment: LegislativeSession["requestAmendment"];
  readonly resolveAmendment: LegislativeSession["resolveAmendment"];
  readonly closeAmendmentRound: LegislativeSession["closeAmendmentRound"];
  readonly resolveFinalRollCall: LegislativeSession["resolveFinalRollCall"];
  readonly considerTextExchange: LegislativeSession["considerTextExchange"];
  readonly present: LegislativeSession["present"];
  readonly executiveAction: LegislativeSession["executiveAction"];
  readonly resolveOverride: LegislativeSession["resolveOverride"];
  readonly refinePopulation: (request: PopulationRefinementRequest) => IntegratedPartialRuntimeState;
  readonly mergePopulation: (cohortIds: readonly string[], causeKey: string) => IntegratedPartialRuntimeState;
  readonly save: () => string;
}

const serialize = (
  state: IntegratedPartialRuntimeState,
  controlBinding: LegislativeControlBinding,
): string => JSON.stringify({
  formatVersion: INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION,
  configuration: state.configuration,
  artifactBindings: state.artifactBindings,
  geographyArtifactIds: state.geography.artifactIds,
  legislativeRuntime: state.legislative,
  controlBinding,
  population: state.population,
  electoralTopology: state.electoralTopology,
} satisfies IntegratedPartialSaveEnvelope);

const artifactIdentity = (values: IntegratedPartialRuntimeState["artifactBindings"]): string =>
  JSON.stringify([...values].sort((left, right) => left.id.localeCompare(right.id)));

const requireExactArtifactState = (saved: unknown, baseline: unknown, label: string): void => {
  if (JSON.stringify(saved) !== JSON.stringify(baseline)) {
    throw new Error(`Integrated partial save ${label} differs from its pinned artifact authority.`);
  }
};

const cohortAuthoritySignature = (
  cohort: IntegratedPartialRuntimeState["population"]["cohorts"][number],
): string => JSON.stringify({
  residenceGeographyId: cohort.residenceGeographyId,
  stateControlId: cohort.stateControlId,
  materialExposureClass: cohort.materialExposureClass,
  catchmentClass: cohort.catchmentClass,
  projectLocatorGeographyId: cohort.projectLocatorGeographyId,
  eligibilityProjection: {
    projectionId: cohort.eligibilityProjection.projectionId,
    shareNumerator: cohort.eligibilityProjection.shareNumerator,
    shareDenominator: cohort.eligibilityProjection.shareDenominator,
    allocationPolicy: cohort.eligibilityProjection.allocationPolicy,
    classification: cohort.eligibilityProjection.classification,
  },
});

const cohortAuthorityAggregates = (
  cohorts: IntegratedPartialRuntimeState["population"]["cohorts"],
): Map<string, { representedWeight: number; eligibilityWeight: number }> => {
  const aggregates = new Map<string, { representedWeight: number; eligibilityWeight: number }>();
  for (const cohort of cohorts) {
    const signature = cohortAuthoritySignature(cohort);
    const aggregate = aggregates.get(signature) ?? { representedWeight: 0, eligibilityWeight: 0 };
    aggregate.representedWeight += cohort.representedWeight;
    aggregate.eligibilityWeight += cohort.eligibilityProjection.allocatedWeight;
    aggregates.set(signature, aggregate);
  }
  return aggregates;
};

const assertPopulationArtifactAuthority = (
  population: IntegratedPartialRuntimeState["population"],
  baseline: IntegratedPartialRuntimeState["population"],
): void => {
  requireExactArtifactState(population.controls, baseline.controls, "resident controls");
  requireExactArtifactState(population.eligibilityProxies, baseline.eligibilityProxies, "eligibility proxy controls");
  requireExactArtifactState(population.sourceArtifactIds, baseline.sourceArtifactIds, "Population artifact IDs");
  requireExactArtifactState(population.scaffoldVersion, baseline.scaffoldVersion, "Population scaffold version");
  requireExactArtifactState(
    population.refinementSemanticVersion,
    baseline.refinementSemanticVersion,
    "Population refinement semantic version",
  );
  const baselineAggregates = cohortAuthorityAggregates(baseline.cohorts);
  const savedAggregates = cohortAuthorityAggregates(population.cohorts);
  requireExactArtifactState(
    [...savedAggregates.entries()].sort(([left], [right]) => left.localeCompare(right)),
    [...baselineAggregates.entries()].sort(([left], [right]) => left.localeCompare(right)),
    "cohort immutable semantics",
  );
  const initialIds = new Set(baseline.cohorts.map((cohort) => cohort.id));
  for (const cohort of population.cohorts) {
    if (!baselineAggregates.has(cohortAuthoritySignature(cohort))) {
      throw new Error(`Integrated partial save cohort ${cohort.id} has unauthorized immutable semantics.`);
    }
    if (
      !Number.isSafeInteger(cohort.lineage.generation) ||
      cohort.lineage.generation < 0 ||
      cohort.lineage.causeKey.trim().length === 0 ||
      (cohort.lineage.generation === 0
        ? cohort.lineage.version !== baseline.scaffoldVersion || !initialIds.has(cohort.id)
        : cohort.lineage.version !== baseline.refinementSemanticVersion)
    ) throw new Error(`Integrated partial save cohort ${cohort.id} has invalid refinement authority.`);
  }
};

const parse = (
  serialized: string,
  configuration: GovernmentConfiguration<LegislativeRuntimeSeed>,
  artifacts: IntegratedRuntimeArtifactBundle,
): { readonly state: IntegratedPartialRuntimeState; readonly controlBinding: LegislativeControlBinding } => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(serialized) as unknown;
  } catch {
    throw new Error("Invalid integrated partial save: serialized data is not valid JSON.");
  }
  if (!isRecord(parsed) || parsed.formatVersion !== INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION) {
    throw new Error("Unsupported integrated partial save format version.");
  }
  if (
    !isRecord(parsed.configuration) ||
    !Array.isArray(parsed.artifactBindings) ||
    !Array.isArray(parsed.geographyArtifactIds) ||
    !isRecord(parsed.legislativeRuntime) ||
    !isRecord(parsed.controlBinding) ||
    !isRecord(parsed.population) ||
    !isRecord(parsed.electoralTopology)
  ) throw new Error("Invalid integrated partial save envelope.");
  const baseline = createIntegratedPartialRuntimeState(configuration, artifacts);
  assertConfigurationIdentityCompatible(
    configuration.identity,
    parsed.configuration as unknown as IntegratedPartialRuntimeState["configuration"],
  );
  const savedBindings = parsed.artifactBindings as unknown as IntegratedPartialRuntimeState["artifactBindings"];
  if (artifactIdentity(savedBindings) !== artifactIdentity(baseline.artifactBindings)) {
    throw new Error("Integrated partial save artifact identity mismatch.");
  }
  const geographyArtifactIds = parsed.geographyArtifactIds as unknown as readonly string[];
  if (JSON.stringify(geographyArtifactIds) !== JSON.stringify(baseline.geography.artifactIds)) {
    throw new Error("Integrated partial save Geography artifact mismatch.");
  }
  const legislativeRuntime = parsed.legislativeRuntime as unknown as IntegratedPartialRuntimeState["legislative"];
  const controlBinding = parsed.controlBinding as unknown as LegislativeControlBinding;
  const validatedLegislative = parseLegislativeRuntime(
    serializeLegislativeRuntime(legislativeRuntime, controlBinding),
    configuration.identity,
  );
  const population = parsed.population as unknown as IntegratedPartialRuntimeState["population"];
  assertWeightedPopulationConservation(population);
  assertPopulationArtifactAuthority(population, baseline.population);
  const electoralTopology = parsed.electoralTopology as unknown as IntegratedPartialRuntimeState["electoralTopology"];
  requireExactArtifactState(electoralTopology, baseline.electoralTopology, "electoral topology");
  return {
    state: {
      ...baseline,
      legislative: validatedLegislative.state,
      population,
      electoralTopology,
    },
    controlBinding: validatedLegislative.controlBinding,
  };
};

const createSession = (
  initialState: IntegratedPartialRuntimeState,
  initialBinding: LegislativeControlBinding,
  configuration: GovernmentConfiguration<LegislativeRuntimeSeed>,
): IntegratedPartialRuntimeSession => {
  let state = initialState;
  const controlBinding = initialBinding;
  const legislativeSession = createLegislativeSessionForStateOwner({
    getLegislativeState: () => state.legislative,
    setLegislativeState: (legislative) => { state = { ...state, legislative }; },
  }, {
    structure: configuration.structure,
    seed: configuration.runtimeSeed as LegislativeRuntimeSeed,
  }, controlBinding, configuration.calendar.epoch);
  return {
    getAuditState: () => deepCopy(state),
    getControlBindingAudit: () => deepCopy(controlBinding),
    getLegislativeAdministrationView: legislativeSession.getAdministrationView,
    reviseAgenda: legislativeSession.reviseAgenda,
    beginSponsorSearch: legislativeSession.beginSponsorSearch,
    seekSponsorship: legislativeSession.seekSponsorship,
    introduceBySponsor: legislativeSession.introduceBySponsor,
    advanceIntroducedProposal: legislativeSession.advanceIntroducedProposal,
    resolveConsiderationGate: legislativeSession.resolveConsiderationGate,
    negotiateWithActor: legislativeSession.negotiateWithActor,
    negotiateWithOrganization: legislativeSession.negotiateWithOrganization,
    coordinateOrganization: legislativeSession.coordinateOrganization,
    requestAmendment: legislativeSession.requestAmendment,
    resolveAmendment: legislativeSession.resolveAmendment,
    closeAmendmentRound: legislativeSession.closeAmendmentRound,
    resolveFinalRollCall: legislativeSession.resolveFinalRollCall,
    considerTextExchange: legislativeSession.considerTextExchange,
    present: legislativeSession.present,
    executiveAction: legislativeSession.executiveAction,
    resolveOverride: legislativeSession.resolveOverride,
    refinePopulation: (request) => {
      state = { ...state, population: refineWeightedPopulationCohort(state.population, request) };
      return deepCopy(state);
    },
    mergePopulation: (cohortIds, causeKey) => {
      state = { ...state, population: mergeWeightedPopulationCohorts(state.population, cohortIds, causeKey) };
      return deepCopy(state);
    },
    save: () => serialize(state, controlBinding),
  };
};

export const createIntegratedPartialRuntimeSession = (
  configuration: GovernmentConfiguration<LegislativeRuntimeSeed>,
  artifacts: IntegratedRuntimeArtifactBundle,
): IntegratedPartialRuntimeSession => {
  const loaded = loadGovernmentConfiguration(configuration);
  const state = createIntegratedPartialRuntimeState(loaded, artifacts);
  const binding = createInitialLegislativeControlBinding(state.legislative, {
    structure: loaded.structure,
    seed: loaded.runtimeSeed as LegislativeRuntimeSeed,
  });
  return createSession(state, binding, loaded);
};

export const createIntegratedPartialRuntimeSessionFromSave = (
  serialized: string,
  configuration: GovernmentConfiguration<LegislativeRuntimeSeed>,
  artifacts: IntegratedRuntimeArtifactBundle,
): IntegratedPartialRuntimeSession => {
  const loaded = loadGovernmentConfiguration(configuration);
  const restored = parse(serialized, configuration, artifacts);
  return createSession(restored.state, restored.controlBinding, loaded);
};

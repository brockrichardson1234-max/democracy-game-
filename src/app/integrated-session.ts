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
  if (JSON.stringify(population.sourceArtifactIds) !== JSON.stringify(baseline.population.sourceArtifactIds)) {
    throw new Error("Integrated partial save Population artifact mismatch.");
  }
  const electoralTopology = parsed.electoralTopology as unknown as IntegratedPartialRuntimeState["electoralTopology"];
  if (
    electoralTopology.sourceArtifactId !== baseline.electoralTopology.sourceArtifactId ||
    electoralTopology.totalElectors !== baseline.electoralTopology.totalElectors ||
    electoralTopology.ordinaryMajority !== baseline.electoralTopology.ordinaryMajority
  ) throw new Error("Integrated partial save electoral topology mismatch.");
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
): IntegratedPartialRuntimeSession => {
  let state = initialState;
  const controlBinding = initialBinding;
  return {
    getAuditState: () => deepCopy(state),
    getControlBindingAudit: () => deepCopy(controlBinding),
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
  return createSession(state, binding);
};

export const createIntegratedPartialRuntimeSessionFromSave = (
  serialized: string,
  configuration: GovernmentConfiguration<LegislativeRuntimeSeed>,
  artifacts: IntegratedRuntimeArtifactBundle,
): IntegratedPartialRuntimeSession => {
  loadGovernmentConfiguration(configuration);
  const restored = parse(serialized, configuration, artifacts);
  return createSession(restored.state, restored.controlBinding);
};

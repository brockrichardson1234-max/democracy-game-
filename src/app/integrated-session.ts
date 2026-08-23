import { assertConfigurationIdentityCompatible, loadGovernmentConfiguration } from "../configuration/loader";
import { sha256Hex } from "../configuration/sha256";
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
  resolvePopulationPoliticalState,
  type PopulationPoliticalResolution,
  type PopulationRefinementRequest,
} from "../sim/population-core";
import {
  advanceScheduledState,
  assertCalendarTimeState,
  nextConfiguredBoundary,
} from "../sim/calendar-time";
import {
  applyInstitutionalBoundary,
  assertInstitutionalRuntimeState,
  type InstitutionalRuntimeState,
} from "../sim/institutional-runtime";
import {
  currentEvaluatedProposal,
  startNewLegislativeProcedure,
} from "../sim/legislative-runtime";
import { rebuildPoliticalStateForAssignments } from "../sim/political";
import { parseLegislativeRuntime, serializeLegislativeRuntime } from "./legislative-persistence";
import {
  createInitialLegislativeControlBinding,
  createLegislativeSessionForStateOwner,
  LEGISLATIVE_ADMINISTRATION_DECISION_SURFACE,
  type LegislativeSession,
  type LegislativeControlBinding,
} from "./legislative-session";

export const INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION = 2 as const;

interface IntegratedPartialSaveEnvelope {
  readonly formatVersion: typeof INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION;
  readonly configuration: IntegratedPartialRuntimeState["configuration"];
  readonly artifactBindings: IntegratedPartialRuntimeState["artifactBindings"];
  readonly geographyArtifactIds: readonly string[];
  readonly legislativeRuntime: IntegratedPartialRuntimeState["legislative"];
  readonly controlBinding: LegislativeControlBinding;
  readonly controlBindingHistory: readonly LegislativeControlBinding[];
  readonly population: IntegratedPartialRuntimeState["population"];
  readonly electoralTopology: IntegratedPartialRuntimeState["electoralTopology"];
  readonly institutional: IntegratedPartialRuntimeState["institutional"];
}

const deepCopy = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export interface IntegratedPartialRuntimeSession {
  readonly getAuditState: () => IntegratedPartialRuntimeState;
  readonly getControlBindingAudit: () => LegislativeControlBinding;
  readonly getControlBindingHistoryAudit: () => readonly LegislativeControlBinding[];
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
  readonly startNewCongressAgenda: () => IntegratedPartialRuntimeState;
  readonly advanceTo: (instant: string) => IntegratedPartialRuntimeState;
  readonly advanceToNextBoundary: () => IntegratedPartialRuntimeState;
  readonly getPublicInstitutionalStatus: () => IntegratedInstitutionalPublicStatus;
  readonly save: () => string;
}

export interface IntegratedInstitutionalPublicStatus {
  readonly currentInstant: string;
  readonly currentTermLabel: string;
  readonly currentAdministrationId: string;
  readonly currentHeadActorId: string;
  readonly currentDeputyActorId: string;
  readonly controlBindingActive: boolean;
  readonly nextBoundary: { readonly id: string; readonly at: string; readonly kind: string } | null;
  readonly selectionStage: InstitutionalRuntimeState["selection"]["stage"];
  readonly popularResults: InstitutionalRuntimeState["selection"]["popularResults"];
  readonly attestations: InstitutionalRuntimeState["selection"]["attestations"];
  readonly appointments: InstitutionalRuntimeState["selection"]["appointments"];
  readonly certificates: InstitutionalRuntimeState["selection"]["certificates"];
  readonly declaration: InstitutionalRuntimeState["selection"]["declaration"];
  readonly entitlements: InstitutionalRuntimeState["selection"]["entitlements"];
  readonly currentExecutiveAssignments: readonly {
    readonly id: string;
    readonly officeId: string;
    readonly actorId: string;
    readonly effectiveFrom: string;
    readonly effectiveUntil: string | null;
  }[];
}

const serialize = (
  state: IntegratedPartialRuntimeState,
  controlBinding: LegislativeControlBinding,
  controlBindingHistory: readonly LegislativeControlBinding[],
): string => JSON.stringify({
  formatVersion: INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION,
  configuration: state.configuration,
  artifactBindings: state.artifactBindings,
  geographyArtifactIds: state.geography.artifactIds,
  legislativeRuntime: state.legislative,
  controlBinding,
  controlBindingHistory,
  population: state.population,
  electoralTopology: state.electoralTopology,
  institutional: state.institutional,
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
): {
  readonly state: IntegratedPartialRuntimeState;
  readonly controlBinding: LegislativeControlBinding;
  readonly controlBindingHistory: readonly LegislativeControlBinding[];
} => {
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
    !Array.isArray(parsed.controlBindingHistory) ||
    !isRecord(parsed.population) ||
    !isRecord(parsed.electoralTopology) ||
    !isRecord(parsed.institutional)
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
  const temporal = configuration.integratedRuntime?.temporal;
  const institutional = parsed.institutional as unknown as InstitutionalRuntimeState;
  if (temporal === undefined || baseline.institutional === null) {
    throw new Error("Integrated partial save supplies unsupported institutional time state.");
  }
  assertCalendarTimeState(institutional.calendar, configuration.calendar.epoch, temporal.boundaries);
  assertInstitutionalRuntimeState(institutional, temporal, electoralTopology);
  let expectedAssignments = baseline.legislative.activeAssignments.map((assignment) => ({ ...assignment }));
  for (const cycle of [...institutional.termCycles].sort(
    (left, right) => Date.parse(left.frozenAt) - Date.parse(right.frozenAt),
  )) {
    if (cycle.status !== "COMPLETE") {
      throw new Error("Integrated partial save contains a partially applied same-instant assignment cycle.");
    }
    const configuredCycle = temporal.assignmentCycles.find((candidate) => candidate.id === cycle.cycleId);
    if (configuredCycle === undefined) throw new Error("Integrated partial save contains an unknown assignment cycle.");
    const officeIds = new Set(configuredCycle.officeIds);
    const expectedEnded = expectedAssignments.filter((assignment) => officeIds.has(assignment.officeId))
      .map((assignment) => ({ ...assignment, effectiveUntil: cycle.frozenAt }));
    const expectedBegun = cycle.results.map((result) => ({
      id: result.successorAssignmentId,
      officeId: result.officeId,
      actorId: result.successorActorId,
      effectiveFrom: cycle.frozenAt,
      effectiveUntil: configuredCycle.nextBoundaryByOfficeId[result.officeId],
      classification: configuredCycle.classification,
    }));
    if (
      JSON.stringify(cycle.endedAssignments) !== JSON.stringify(expectedEnded) ||
      JSON.stringify(cycle.begunAssignments) !== JSON.stringify(expectedBegun)
    ) throw new Error("Integrated partial save assignment-cycle history contradicts its results.");
    expectedAssignments = [
      ...expectedAssignments.filter((assignment) => !officeIds.has(assignment.officeId)),
      ...expectedBegun,
    ];
  }
  if (institutional.selection.stage === "TRANSFERRED") {
    const executiveOfficeIds = new Set([
      temporal.selection.transfer.headOfficeId,
      temporal.selection.transfer.deputyOfficeId,
    ]);
    expectedAssignments = [
      ...expectedAssignments.filter((assignment) => !executiveOfficeIds.has(assignment.officeId)),
      ...institutional.selection.entitlements.map((entitlement) => ({
        id: `${temporal.selection.transfer.assignmentIdPrefix}${entitlement.officeId === temporal.selection.transfer.headOfficeId ? "head" : "deputy"}`,
        officeId: entitlement.officeId,
        actorId: entitlement.entitledActorId,
        effectiveFrom: temporal.selection.transfer.scheduledAt,
        effectiveUntil: null,
        classification: temporal.selection.classification,
      })),
    ];
  }
  if (JSON.stringify(validatedLegislative.state.activeAssignments) !== JSON.stringify(expectedAssignments)) {
    throw new Error("Integrated partial save active assignments contradict configured temporal transitions.");
  }
  const headAssignment = validatedLegislative.state.activeAssignments.find(
    (assignment) => assignment.officeId === temporal.selection.transfer.headOfficeId,
  );
  const deputyAssignment = validatedLegislative.state.activeAssignments.find(
    (assignment) => assignment.officeId === temporal.selection.transfer.deputyOfficeId,
  );
  if (
    headAssignment?.actorId !== institutional.currentAdministration.headActorId ||
    deputyAssignment?.actorId !== institutional.currentAdministration.deputyActorId
  ) throw new Error("Integrated partial save current administration contradicts active executive assignments.");
  const expectedActiveBinding = institutional.currentAdministration.headActorId ===
    temporal.selection.tickets.find((ticket) => ticket.id === temporal.selection.transfer.playerAlignedTicketId)
      ?.headCandidate.actorId;
  if (
    (expectedActiveBinding && validatedLegislative.controlBinding.status !== "ACTIVE") ||
    (!expectedActiveBinding && validatedLegislative.controlBinding.status !== "ENDED") ||
    (validatedLegislative.controlBinding.status === "ACTIVE" &&
      validatedLegislative.controlBinding.boundOfficeholderActorId !== headAssignment.actorId)
  ) throw new Error("Integrated partial save ControlBinding contradicts current administration authority.");
  const controlBindingHistory = parsed.controlBindingHistory as unknown as readonly LegislativeControlBinding[];
  const transferCompleted = institutional.selection.stage === "TRANSFERRED";
  const declaredTicket = institutional.selection.declaration === null
    ? null
    : temporal.selection.tickets.find(
        (ticket) => ticket.id === institutional.selection.declaration?.winningTicketId,
      ) ?? null;
  if (transferCompleted && declaredTicket === null) {
    throw new Error("Integrated partial save transfer lacks its configured declared ticket.");
  }
  const expectedInitialAdministration = {
    ...temporal.initialAdministration,
    sourceDeclarationId: null,
  };
  const expectedCurrentAdministration = transferCompleted && declaredTicket !== null
    ? {
        id: `${temporal.selection.transfer.administrationIdPrefix}${sha256Hex(declaredTicket.id).slice(0, 16)}`,
        headActorId: declaredTicket.headCandidate.actorId,
        deputyActorId: declaredTicket.deputyCandidate.actorId,
        effectiveFrom: temporal.selection.transfer.scheduledAt,
        effectiveUntil: null,
        sourceDeclarationId: institutional.selection.declaration!.id,
        classification: temporal.selection.classification,
      }
    : expectedInitialAdministration;
  if (
    JSON.stringify(institutional.currentAdministration) !== JSON.stringify(expectedCurrentAdministration) ||
    JSON.stringify(institutional.administrationHistory) !== JSON.stringify(
      transferCompleted
        ? [{ ...expectedInitialAdministration, effectiveUntil: temporal.selection.transfer.scheduledAt }]
        : [],
    )
  ) throw new Error("Integrated partial save current-administration history contradicts configured succession.");
  const expectedInitialBinding: LegislativeControlBinding = {
    id: `${configuration.identity.configurationId}.control-binding.legislative-administration`,
    decisionSurface: LEGISLATIVE_ADMINISTRATION_DECISION_SURFACE,
    executiveOfficeId: temporal.selection.transfer.headOfficeId,
    boundOfficeholderActorId: temporal.initialAdministration.headActorId,
    status: "ACTIVE",
    endedAt: null,
    endReason: null,
  };
  const expectedEndedBinding: LegislativeControlBinding = {
    ...expectedInitialBinding,
    status: "ENDED",
    endedAt: temporal.selection.transfer.scheduledAt,
    endReason: "TERM_ENDED",
  };
  const expectedCurrentBinding = transferCompleted &&
    institutional.selection.declaration?.winningTicketId === temporal.selection.transfer.playerAlignedTicketId
    ? {
        id: `${temporal.selection.transfer.bindingIdPrefix}${temporal.selection.transfer.playerAlignedTicketId}`,
        decisionSurface: LEGISLATIVE_ADMINISTRATION_DECISION_SURFACE,
        executiveOfficeId: temporal.selection.transfer.headOfficeId,
        boundOfficeholderActorId: headAssignment.actorId,
        status: "ACTIVE" as const,
        endedAt: null,
        endReason: null,
      }
    : transferCompleted ? expectedEndedBinding : expectedInitialBinding;
  if (
    controlBindingHistory.some((binding) => binding.status !== "ENDED" || binding.endReason !== "TERM_ENDED") ||
    (transferCompleted && controlBindingHistory.length !== 1) ||
    (!transferCompleted && controlBindingHistory.length !== 0) ||
    JSON.stringify(validatedLegislative.controlBinding) !== JSON.stringify(expectedCurrentBinding) ||
    (transferCompleted && JSON.stringify(controlBindingHistory[0]) !== JSON.stringify(expectedEndedBinding))
  ) throw new Error("Integrated partial save ControlBinding history contradicts authority transfer state.");
  return {
    state: {
      ...baseline,
      legislative: validatedLegislative.state,
      population,
      electoralTopology,
      institutional,
    },
    controlBinding: validatedLegislative.controlBinding,
    controlBindingHistory,
  };
};

const createSession = (
  initialState: IntegratedPartialRuntimeState,
  initialBinding: LegislativeControlBinding,
  configuration: GovernmentConfiguration<LegislativeRuntimeSeed>,
  initialControlBindingHistory: readonly LegislativeControlBinding[] = [],
): IntegratedPartialRuntimeSession => {
  let state = initialState;
  let controlBinding = initialBinding;
  let controlBindingHistory = [...initialControlBindingHistory];
  const temporal = configuration.integratedRuntime?.temporal;
  if (temporal === undefined || state.institutional === null) {
    throw new Error("Integrated session requires configured institutional time state.");
  }
  const legislativeSession = createLegislativeSessionForStateOwner({
    getLegislativeState: () => state.legislative,
    setLegislativeState: (legislative) => { state = { ...state, legislative }; },
  }, {
    structure: configuration.structure,
    seed: configuration.runtimeSeed as LegislativeRuntimeSeed,
  }, controlBinding, configuration.calendar.epoch, {
    getControlBinding: () => controlBinding,
    getAdministrationId: () => {
      if (state.institutional === null) throw new Error("Integrated session lost current administration state.");
      return state.institutional.currentAdministration.id;
    },
    getAuthoritativeInstant: () => {
      if (state.institutional === null) throw new Error("Integrated session lost canonical calendar state.");
      return state.institutional.calendar.current;
    },
  });
  const advanceTo = (target: string): IntegratedPartialRuntimeState => {
    if (state.institutional === null) throw new Error("Integrated session lacks institutional time state.");
    const advanced = advanceScheduledState(
      {
        institutional: state.institutional,
        legislative: state.legislative,
        controlBinding,
        controlBindingHistory,
      },
      state.institutional.calendar,
      configuration.calendar.epoch,
      target,
      temporal.boundaries,
      (value, genericBoundary) => {
        const boundary = genericBoundary as typeof temporal.boundaries[number];
        const result = applyInstitutionalBoundary(value.institutional, value.legislative, {
          temporal,
          structure: configuration.structure,
          legislativeSeed: configuration.runtimeSeed as LegislativeRuntimeSeed,
          population: state.population,
          topology: state.electoralTopology,
        }, boundary);
        let nextBinding = value.controlBinding;
        if (result.transferredTicket !== null) {
          const ended: LegislativeControlBinding = {
            ...value.controlBinding,
            status: "ENDED",
            endedAt: boundary.at,
            endReason: "TERM_ENDED",
          };
          nextBinding = result.transferredTicket.id === temporal.selection.transfer.playerAlignedTicketId
            ? {
                id: `${temporal.selection.transfer.bindingIdPrefix}${result.transferredTicket.id}`,
                decisionSurface: LEGISLATIVE_ADMINISTRATION_DECISION_SURFACE,
                executiveOfficeId: temporal.selection.transfer.headOfficeId,
                boundOfficeholderActorId: result.transferredTicket.headCandidate.actorId,
                status: "ACTIVE",
                endedAt: null,
                endReason: null,
              }
            : ended;
        }
        return {
          institutional: result.institutional,
          legislative: result.legislative,
          controlBinding: nextBinding,
          controlBindingHistory: result.transferredTicket === null
            ? value.controlBindingHistory
            : [...value.controlBindingHistory, {
                ...value.controlBinding,
                status: "ENDED" as const,
                endedAt: boundary.at,
                endReason: "TERM_ENDED" as const,
              }],
        };
      },
    );
    controlBinding = advanced.value.controlBinding;
    controlBindingHistory = [...advanced.value.controlBindingHistory];
    state = {
      ...state,
      legislative: advanced.value.legislative,
      institutional: { ...advanced.value.institutional, calendar: advanced.calendar },
    };
    return deepCopy(state);
  };
  return {
    getAuditState: () => deepCopy(state),
    getControlBindingAudit: () => deepCopy(controlBinding),
    getControlBindingHistoryAudit: () => deepCopy(controlBindingHistory),
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
    startNewCongressAgenda: () => {
      if (state.institutional === null) throw new Error("Integrated session lacks institutional time state.");
      if (controlBinding.status !== "ACTIVE") {
        throw new Error("No active ControlBinding: administration decision surface unavailable.");
      }
      const proposalId = `${temporal.newProcedureIdPrefix}${state.institutional.currentTermLabel}.${state.legislative.procedureHistory.length + 1}`;
      state = {
        ...state,
        legislative: startNewLegislativeProcedure(
          state.legislative,
          { structure: configuration.structure, seed: configuration.runtimeSeed as LegislativeRuntimeSeed },
          proposalId,
          state.institutional.calendar.current,
        ),
      };
      return deepCopy(state);
    },
    advanceTo,
    advanceToNextBoundary: () => {
      if (state.institutional === null) throw new Error("Integrated session lacks institutional time state.");
      const boundary = nextConfiguredBoundary(state.institutional.calendar, temporal.boundaries);
      return boundary === null ? deepCopy(state) : advanceTo(boundary.at);
    },
    getPublicInstitutionalStatus: () => {
      if (state.institutional === null) throw new Error("Integrated session lacks institutional time state.");
      const boundary = nextConfiguredBoundary(state.institutional.calendar, temporal.boundaries);
      const executiveOfficeIds = new Set([
        temporal.selection.transfer.headOfficeId,
        temporal.selection.transfer.deputyOfficeId,
      ]);
      return deepCopy({
        currentInstant: state.institutional.calendar.current,
        currentTermLabel: state.institutional.currentTermLabel,
        currentAdministrationId: state.institutional.currentAdministration.id,
        currentHeadActorId: state.institutional.currentAdministration.headActorId,
        currentDeputyActorId: state.institutional.currentAdministration.deputyActorId,
        controlBindingActive: controlBinding.status === "ACTIVE",
        nextBoundary: boundary === null ? null : { id: boundary.id, at: boundary.at, kind: boundary.kind },
        selectionStage: state.institutional.selection.stage,
        popularResults: state.institutional.selection.popularResults,
        attestations: state.institutional.selection.attestations,
        appointments: state.institutional.selection.appointments,
        certificates: state.institutional.selection.certificates,
        declaration: state.institutional.selection.declaration,
        entitlements: state.institutional.selection.entitlements,
        currentExecutiveAssignments: state.legislative.activeAssignments.filter(
          (assignment) => executiveOfficeIds.has(assignment.officeId),
        ),
      });
    },
    save: () => serialize(state, controlBinding, controlBindingHistory),
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

/** Audit/composition proof for future upstream Population state; not a player command surface. */
export const createIntegratedPartialRuntimeAuditSession = (
  configuration: GovernmentConfiguration<LegislativeRuntimeSeed>,
  artifacts: IntegratedRuntimeArtifactBundle,
  resolutions: readonly PopulationPoliticalResolution[],
  vacantOfficeIds: readonly string[] = [],
): IntegratedPartialRuntimeSession => {
  const loaded = loadGovernmentConfiguration(configuration);
  let state = createIntegratedPartialRuntimeState(loaded, artifacts);
  state = { ...state, population: resolvePopulationPoliticalState(state.population, resolutions) };
  if (vacantOfficeIds.length > 0) {
    const vacant = new Set(vacantOfficeIds);
    const activeAssignments = state.legislative.activeAssignments.filter(
      (assignment) => !vacant.has(assignment.officeId),
    );
    if (activeAssignments.length + vacant.size !== state.legislative.activeAssignments.length) {
      throw new Error("Audit vacancy composition references an unknown or already vacant office.");
    }
    const political = rebuildPoliticalStateForAssignments(
      state.legislative.political,
      loaded.structure,
      loaded.runtimeSeed as LegislativeRuntimeSeed,
      activeAssignments,
      currentEvaluatedProposal(state.legislative),
    );
    state = { ...state, legislative: { ...state.legislative, activeAssignments, political } };
  }
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
  return createSession(restored.state, restored.controlBinding, loaded, restored.controlBindingHistory);
};

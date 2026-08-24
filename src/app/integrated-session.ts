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
  applyPopulationInformationResponse,
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
import {
  admitEnactedFiscalAuthority,
  advanceAdministrativeDeadlines,
  approveFiscalControl,
  assertProgramImplementationState,
  directWaiverIntention,
  electRelationshipMember,
  establishBoundedRecipientAward,
  establishRecipientCommitment,
  executeEligiblePayment,
  openFutureWaiverRequest,
  requestFiscalControl,
  setupRecipientActivity,
  submitRecipientDrawRequest,
  supplySupplementalWaiverRecords,
  issueFinalRelationshipQualificationDetermination,
  type FutureWaiverRequestInput,
  type BoundedRecipientAwardRequest,
  type RecipientCommitmentRequest,
  type WaiverIntention,
} from "../sim/program-implementation";
import {
  admitValidatedMaterialInputs,
  advanceIntegratedMaterialHousing,
  assertIntegratedMaterialHousingState,
  type AcceptedMaterialInputReference,
} from "../sim/housing";
import {
  assertIntegratedInformationRuntimeState,
  captureIntegratedMeasurement,
  deliverIntegratedArtifact,
  recordIntegratedExposure,
  recordIntegratedPopulationResponse,
  releaseIntegratedClaim,
  releaseIntegratedMeasurement,
  type IntegratedInformationObservation,
} from "../sim/information";
import {
  applyLegalContestBoundary,
  assertIntegratedLegalContestRuntimeState,
  createIntegratedLegalContestRuntimeState,
  recordAdministrativeOrderResponse,
  requestSeparateStay,
  type AdministrativeOrderResponseRecord,
} from "../sim/legal-contest-runtime";
import { parseLegislativeRuntime, serializeLegislativeRuntime } from "./legislative-persistence";
import {
  createInitialLegislativeControlBinding,
  createLegislativeSessionForStateOwner,
  LEGISLATIVE_ADMINISTRATION_DECISION_SURFACE,
  type LegislativeSession,
  type LegislativeControlBinding,
} from "./legislative-session";

export const INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION = 7 as const;

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
  readonly implementation: IntegratedPartialRuntimeState["implementation"];
  readonly housing: IntegratedPartialRuntimeState["housing"];
  readonly information: IntegratedPartialRuntimeState["information"];
  readonly legalContest: IntegratedPartialRuntimeState["legalContest"];
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
  readonly getPublicImplementationStatus: () => IntegratedImplementationPublicStatus;
  readonly admitEnactedLawFiscalAuthority: (legalSourceId: string) => IntegratedPartialRuntimeState;
  readonly requestApportionment: (budgetAuthorityId: string) => IntegratedPartialRuntimeState;
  readonly approveApportionment: (budgetAuthorityId: string) => IntegratedPartialRuntimeState;
  readonly establishBoundedAward: (request: BoundedRecipientAwardRequest) => IntegratedPartialRuntimeState;
  readonly recordRecipientCommitment: (request: RecipientCommitmentRequest) => IntegratedPartialRuntimeState;
  readonly setUpRecipientActivity: (commitmentId: string) => IntegratedPartialRuntimeState;
  readonly submitRecipientDraw: (activityId: string, amountMinorUnits: number) => IntegratedPartialRuntimeState;
  readonly executeRecipientPayment: (drawRequestId: string) => IntegratedPartialRuntimeState;
  readonly openFutureWaiver: (request: FutureWaiverRequestInput) => IntegratedPartialRuntimeState;
  readonly directFutureWaiver: (requestId: string, intention: WaiverIntention) => IntegratedPartialRuntimeState;
  readonly supplyFutureWaiverRecords: (requestId: string, recordTypes: readonly string[]) => IntegratedPartialRuntimeState;
  readonly electConsortiumMemberParticipation: (
    relationshipId: string,
    memberId: string,
    election: "INCLUDE" | "EXCLUDE",
    causeKey: string,
  ) => IntegratedPartialRuntimeState;
  readonly getHousingAuditState: () => NonNullable<IntegratedPartialRuntimeState["housing"]>;
  readonly getInformationAuditState: () => NonNullable<IntegratedPartialRuntimeState["information"]>;
  readonly getPublicInformationStatus: () => {
    readonly releasedArtifacts: readonly { readonly id: string; readonly kind: string; readonly releasedAt: string }[];
    readonly completedDeliveryIds: readonly string[];
    readonly publicExposureCount: number;
  };
  readonly issueBoundedRelationshipRejection: () => IntegratedPartialRuntimeState;
  readonly respondToJudicialOrder: (
    action: AdministrativeOrderResponseRecord["action"],
  ) => IntegratedPartialRuntimeState;
  readonly requestJudicialStay: () => IntegratedPartialRuntimeState;
  readonly getLegalContestAuditState: () => NonNullable<IntegratedPartialRuntimeState["legalContest"]>;
  readonly save: () => string;
}

export interface IntegratedImplementationPublicStatus {
  readonly detailCoverage: string;
  readonly nationalBalance: string;
  readonly historicalBudgetAuthorityCount: number;
  readonly generatedBudgetAuthorities: readonly {
    readonly id: string;
    readonly status: string;
    readonly minorUnits: number;
  }[];
  readonly pendingWaiverRequestIds: readonly string[];
  readonly publicDeterminationIds: readonly string[];
  readonly relationshipStatuses: readonly { readonly id: string; readonly status: string }[];
  readonly materialInputKinds: readonly string[];
  readonly physicalHousingStatePresent: false;
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
  implementation: state.implementation,
  housing: state.housing,
  information: state.information,
  legalContest: state.legalContest,
} satisfies IntegratedPartialSaveEnvelope);

const materialInputReferences = (
  implementation: NonNullable<IntegratedPartialRuntimeState["implementation"]>,
): readonly AcceptedMaterialInputReference[] => implementation.materialInputs.map((input) => ({
  id: input.id,
  kind: input.kind,
  sourceOwnerId: input.sourceOwnerId,
  sourceRecordId: input.sourceRecordId,
  projectRef: input.projectRef,
  validatedAt: input.validatedAt,
  classification: input.classification,
}));

const reconstructHousingTo = (
  baseline: NonNullable<IntegratedPartialRuntimeState["housing"]>,
  implementation: NonNullable<IntegratedPartialRuntimeState["implementation"]>,
  epoch: string,
  target: string,
): NonNullable<IntegratedPartialRuntimeState["housing"]> => {
  let housing = baseline;
  let cursor = epoch;
  const groups = new Map<string, AcceptedMaterialInputReference[]>();
  for (const input of materialInputReferences(implementation)) {
    const group = groups.get(input.validatedAt) ?? [];
    group.push(input);
    groups.set(input.validatedAt, group);
  }
  for (const [at, inputs] of [...groups.entries()].filter(([at]) => Date.parse(at) <= Date.parse(target)).sort(([left], [right]) => Date.parse(left) - Date.parse(right) || left.localeCompare(right))) {
    if (Date.parse(at) < Date.parse(epoch)) throw new Error("Material input predates the configured scenario epoch.");
    housing = advanceIntegratedMaterialHousing(housing, cursor, at);
    housing = admitValidatedMaterialInputs(housing, inputs);
    cursor = at;
  }
  return advanceIntegratedMaterialHousing(housing, cursor, target);
};

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
    !isRecord(parsed.institutional) ||
    !isRecord(parsed.implementation) ||
    !isRecord(parsed.housing) ||
    !isRecord(parsed.information) ||
    !isRecord(parsed.legalContest)
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
  assertInstitutionalRuntimeState(institutional, temporal, electoralTopology, configuration.structure);
  const implementationConfiguration = configuration.integratedRuntime?.implementation;
  if (
    implementationConfiguration === undefined ||
    baseline.implementation === null ||
    artifacts.programInitialization === undefined
  ) throw new Error("Integrated partial save supplies unsupported implementation state.");
  const implementation = parsed.implementation as unknown as NonNullable<IntegratedPartialRuntimeState["implementation"]>;
  assertProgramImplementationState(implementation, implementationConfiguration, artifacts.programInitialization);
  for (const authority of implementation.publicFinance.generatedBudgetAuthorities) {
    const law = validatedLegislative.state.enactedLegalSources.find((entry) => entry.id === authority.sourceLegalId);
    if (law === undefined || baseline.implementation === null) {
      throw new Error(`Generated budget authority ${authority.id} lacks its enacted legal source.`);
    }
    const expectedState = admitEnactedFiscalAuthority(
      baseline.implementation,
      law,
      implementationConfiguration,
      authority.enactedAt,
    );
    const expectedAuthority = expectedState.publicFinance.generatedBudgetAuthorities[0];
    if (
      expectedAuthority === undefined ||
      JSON.stringify({ ...authority, status: "AUTHORITY_RECOGNIZED" }) !== JSON.stringify(expectedAuthority)
    ) throw new Error(`Generated budget authority ${authority.id} contradicts its enacted legal terms.`);
    const control = implementation.fiscalExecution.generatedControls.find(
      (entry) => entry.sourceBudgetAuthorityId === authority.id,
    );
    if (authority.status === "APPORTIONED") {
      if (control === undefined) throw new Error(`Apportioned authority ${authority.id} lacks its fiscal control.`);
      const expectedPending = requestFiscalControl(expectedState, authority.id);
      const expectedControlled = approveFiscalControl(
        expectedPending,
        authority.id,
        implementationConfiguration,
        control.approvalAt,
      );
      if (JSON.stringify(control) !== JSON.stringify(expectedControlled.fiscalExecution.generatedControls[0])) {
        throw new Error(`Generated fiscal control ${control.id} contradicts its source authority.`);
      }
    } else if (control !== undefined) {
      throw new Error(`Generated fiscal control ${control.id} precedes apportioned authority state.`);
    }
  }
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
        effectiveUntil: temporal.selection.transfer.successorTermEndsAt,
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
        effectiveUntil: temporal.selection.transfer.successorTermEndsAt,
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
  if (baseline.housing === null || artifacts.housingInitialization === undefined) {
    throw new Error("Integrated partial save supplies unsupported Material Housing state.");
  }
  const housing = parsed.housing as unknown as NonNullable<IntegratedPartialRuntimeState["housing"]>;
  assertIntegratedMaterialHousingState(housing);
  requireExactArtifactState(housing.controls, baseline.housing.controls, "Housing immutable controls");
  requireExactArtifactState(housing.sourceArtifactId, baseline.housing.sourceArtifactId, "Housing source artifact");
  requireExactArtifactState(housing.catchmentScaffoldVersion, baseline.housing.catchmentScaffoldVersion, "Housing catchment semantics");
  requireExactArtifactState(housing.materialCalibrationVersion, baseline.housing.materialCalibrationVersion, "Housing material semantics");
  requireExactArtifactState(housing.calibration, baseline.housing.calibration, "Housing calibration authority");
  const expectedHousing = reconstructHousingTo(
    baseline.housing,
    implementation,
    configuration.calendar.epoch,
    institutional.calendar.current,
  );
  requireExactArtifactState(housing, expectedHousing, "Housing deterministic material state");
  const informationConfiguration = configuration.integratedRuntime?.information;
  if (baseline.information === null || informationConfiguration === undefined) {
    throw new Error("Integrated partial save supplies unsupported Information state.");
  }
  const information = parsed.information as unknown as NonNullable<IntegratedPartialRuntimeState["information"]>;
  assertIntegratedInformationRuntimeState(information, informationConfiguration);
  const processed = new Set(institutional.calendar.processedBoundaryIds);
  for (const measurement of informationConfiguration.measurements) {
    const runtime = information.measurements.find((candidate) => candidate.id === measurement.id);
    const captured = processed.has(measurement.captureBoundaryId);
    const released = processed.has(measurement.releaseBoundaryId);
    if (
      runtime === undefined ||
      (released ? runtime.status !== "RELEASED" : captured ? runtime.status !== "CAPTURED" : runtime.status !== "SCHEDULED") ||
      information.artifacts.some((artifact) => artifact.id === measurement.artifactId) !== released
    ) throw new Error(`Integrated partial save measurement ${measurement.id} contradicts processed boundaries.`);
  }
  const claimReleased = processed.has(informationConfiguration.claim.releaseBoundaryId);
  const delivered = processed.has(informationConfiguration.delivery.boundaryId);
  const exposed = processed.has(informationConfiguration.exposure.boundaryId);
  const responded = processed.has(informationConfiguration.response.boundaryId);
  const claim = information.artifacts.find((artifact) => artifact.id === informationConfiguration.claim.id);
  if (
    information.artifacts.some((artifact) => artifact.id === informationConfiguration.claim.id) !== claimReleased ||
    information.deliveries.some((delivery) => delivery.id === informationConfiguration.delivery.id) !== delivered ||
    information.exposures.some((exposure) => exposure.id === informationConfiguration.exposure.id) !== exposed ||
    information.responses.some((response) => response.id === informationConfiguration.response.id) !== responded ||
    (claim !== undefined && claim.producerId !== temporal.initialAdministration.id) ||
    information.responses.some((response) => response.attribution !== temporal.initialAdministration.id)
  ) throw new Error("Integrated partial save Information stages contradict processed boundaries.");
  for (const response of information.responses) {
    const exposure = information.exposures.find((candidate) => candidate.id === response.exposureId);
    for (const cohortId of response.cohortIds) {
      const cohort = population.cohorts.find((candidate) => candidate.id === cohortId);
      if (
        exposure === undefined || cohort === undefined || !cohort.receivedInformationReferences.includes(exposure.id) ||
        cohort.politicalState.belief !== response.belief || cohort.politicalState.attribution !== response.attribution ||
        cohort.politicalState.salience !== response.salience ||
        cohort.politicalState.candidatePreference !== response.candidatePreference ||
        cohort.politicalState.turnoutDisposition !== response.turnoutDisposition
      ) throw new Error("Integrated partial save Population response contradicts its targeted exposure.");
    }
  }
  const legalContestConfiguration = configuration.integratedRuntime?.legalContest;
  if (baseline.legalContest === null || legalContestConfiguration === undefined) {
    throw new Error("Integrated partial save supplies unsupported legal-contest state.");
  }
  const legalContest = parsed.legalContest as unknown as NonNullable<IntegratedPartialRuntimeState["legalContest"]>;
  assertIntegratedLegalContestRuntimeState(
    legalContest,
    legalContestConfiguration,
    implementation.administrativeProgram.relationshipQualificationDeterminations,
  );
  const determination = implementation.administrativeProgram.relationshipQualificationDeterminations;
  if (
    determination.length > 1 ||
    determination.some((entry) =>
      entry.id !== legalContestConfiguration.trigger.determinationId ||
      entry.relationshipId !== legalContestConfiguration.relationshipId ||
      entry.claimantId !== legalContestConfiguration.claimantId ||
      entry.institutionId !== legalContestConfiguration.targetInstitutionId ||
      entry.outcome !== legalContestConfiguration.trigger.outcome ||
      entry.formulaDisposition !== legalContestConfiguration.trigger.formulaDisposition ||
      Date.parse(entry.issuedAt) >= Date.parse(
        temporal.boundaries.find((boundary) => boundary.id === legalContestConfiguration.claim.filingBoundaryId)!.at,
      ))
  ) throw new Error("Integrated partial save legal-contest trigger contradicts configured authority.");
  type LegalReplayEvent =
    | { readonly at: string; readonly order: number; readonly kind: "BOUNDARY"; readonly boundary: typeof temporal.boundaries[number] }
    | { readonly at: string; readonly order: number; readonly kind: "RESPONSE" }
    | { readonly at: string; readonly order: number; readonly kind: "STAY_REQUEST" };
  const legalEvents: LegalReplayEvent[] = temporal.boundaries
    .filter((boundary) => institutional.calendar.processedBoundaryIds.includes(boundary.id))
    .map((boundary) => ({
      at: boundary.at,
      order: boundary.phase * 1_000_000 + boundary.order,
      kind: "BOUNDARY" as const,
      boundary,
    }));
  const savedResponse = legalContest.administrativeResponses[0];
  if (savedResponse !== undefined) legalEvents.push({ at: savedResponse.respondedAt, order: 900_000_000, kind: "RESPONSE" });
  const savedStayRequest = legalContest.stayRequests[0];
  if (savedStayRequest !== undefined) legalEvents.push({ at: savedStayRequest.filedAt, order: 900_000_001, kind: "STAY_REQUEST" });
  legalEvents.sort((left, right) => Date.parse(left.at) - Date.parse(right.at) || left.order - right.order);
  let expectedLegalContest = createIntegratedLegalContestRuntimeState(legalContestConfiguration);
  for (const event of legalEvents) {
    if (event.kind === "BOUNDARY") {
      expectedLegalContest = applyLegalContestBoundary(
        expectedLegalContest,
        legalContestConfiguration,
        event.boundary,
        determination,
      );
    } else if (event.kind === "RESPONSE") {
      expectedLegalContest = recordAdministrativeOrderResponse(
        expectedLegalContest,
        legalContestConfiguration,
        savedResponse.administrationId,
        savedResponse.action,
        event.at,
      );
    } else {
      expectedLegalContest = requestSeparateStay(expectedLegalContest, legalContestConfiguration, event.at);
    }
  }
  requireExactArtifactState(legalContest, expectedLegalContest, "deterministic legal-contest state");
  return {
    state: {
      ...baseline,
      legislative: validatedLegislative.state,
      population,
      electoralTopology,
      institutional,
      implementation,
      housing,
      information,
      legalContest,
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
  const implementationConfiguration = configuration.integratedRuntime?.implementation;
  const informationConfiguration = configuration.integratedRuntime?.information;
  const legalContestConfiguration = configuration.integratedRuntime?.legalContest;
  if (
    temporal === undefined || implementationConfiguration === undefined || informationConfiguration === undefined ||
    legalContestConfiguration === undefined || state.institutional === null || state.implementation === null ||
    state.housing === null || state.information === null || state.legalContest === null
  ) {
    throw new Error("Integrated session requires configured institutional, implementation, Housing, Information, and legal-contest state.");
  }
  const synchronizeHousingInputs = (): void => {
    if (state.housing !== null && state.implementation !== null) {
      state = {
        ...state,
        housing: admitValidatedMaterialInputs(state.housing, materialInputReferences(state.implementation)),
      };
    }
  };
  const requireAdministrationAuthority = (): void => {
    if (controlBinding.status !== "ACTIVE" || state.institutional === null) {
      throw new Error("No active ControlBinding: administration decision surface unavailable.");
    }
    const headAssignment = state.legislative.activeAssignments.find(
      (assignment) => assignment.officeId === controlBinding.executiveOfficeId,
    );
    if (headAssignment?.actorId !== controlBinding.boundOfficeholderActorId) {
      throw new Error("ControlBinding does not resolve to the current executive assignment.");
    }
  };
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
  const advanceMaterialOwners = (
    implementation: NonNullable<IntegratedPartialRuntimeState["implementation"]>,
    housing: NonNullable<IntegratedPartialRuntimeState["housing"]>,
    from: string,
    to: string,
  ): {
    readonly implementation: NonNullable<IntegratedPartialRuntimeState["implementation"]>;
    readonly housing: NonNullable<IntegratedPartialRuntimeState["housing"]>;
  } => {
    const withExistingInputs = admitValidatedMaterialInputs(housing, materialInputReferences(implementation));
    const advancedHousing = advanceIntegratedMaterialHousing(withExistingInputs, from, to);
    const advancedImplementation = advanceAdministrativeDeadlines(implementation, to);
    return {
      implementation: advancedImplementation,
      housing: admitValidatedMaterialInputs(advancedHousing, materialInputReferences(advancedImplementation)),
    };
  };
  const captureObservations = (
    measurement: typeof informationConfiguration.measurements[number],
    implementation: NonNullable<IntegratedPartialRuntimeState["implementation"]>,
    housing: NonNullable<IntegratedPartialRuntimeState["housing"]>,
  ): readonly IntegratedInformationObservation[] => {
    if (measurement.measurementKind === "ADMINISTRATIVE_RECORD") {
      const referentId = measurement.referentIds[0];
      return [
        ["BUDGET_AUTHORITY_RECORD_COUNT", implementation.publicFinance.historicalBudgetAuthorities.length + implementation.publicFinance.generatedBudgetAuthorities.length],
        ["FISCAL_CONTROL_RECORD_COUNT", implementation.fiscalExecution.historicalControls.length + implementation.fiscalExecution.generatedControls.length],
        ["AWARD_RECORD_COUNT", implementation.fiscalExecution.historicalAwards.length + implementation.fiscalExecution.generatedAwards.length],
        ["PAYMENT_RECORD_COUNT", implementation.fiscalExecution.historicalPayments.length + implementation.fiscalExecution.generatedPayments.length],
        ["MATERIAL_INPUT_RECORD_COUNT", implementation.materialInputs.length],
      ].map(([measure, value]) => ({
        referentId,
        measure: measure as string,
        value: value as number,
        actualValue: value as number,
        method: "DIRECT_ADMINISTRATIVE_RECORD_CAPTURE",
        classification: "SIMULATION_GENERATED_DIRECT_RECORD",
      }));
    }
    return measurement.referentIds.flatMap((referentId) => {
      const region = housing.regions.find((candidate) => candidate.id === referentId);
      if (region === undefined) throw new Error(`Information measurement lacks material referent ${referentId}.`);
      const width = measurement.deterministicErrorBound * 2 + 1;
      const pressureError = measurement.deterministicErrorBound === 0
        ? 0
        : Number.parseInt(sha256Hex(`${measurement.id}|${referentId}|PRESSURE`).slice(0, 8), 16) % width - measurement.deterministicErrorBound;
      return [
        {
          referentId,
          measure: "HOUSING_STOCK_UNITS",
          value: region.housingStockUnits,
          actualValue: region.housingStockUnits,
          method: "BOUNDED_STATISTICAL_CAPTURE",
          classification: "SIMULATION_GENERATED_MEASUREMENT",
        },
        {
          referentId,
          measure: "VACANT_UNITS",
          value: region.vacantUnits,
          actualValue: region.vacantUnits,
          method: "BOUNDED_STATISTICAL_CAPTURE",
          classification: "SIMULATION_GENERATED_MEASUREMENT",
        },
        {
          referentId,
          measure: "AFFORDABILITY_PRESSURE_BASIS_POINTS",
          value: region.affordabilityPressureBasisPoints + pressureError,
          actualValue: region.affordabilityPressureBasisPoints,
          method: "DETERMINISTIC_BOUNDED_ERROR_MEASUREMENT",
          classification: "APPROXIMATED_SIMULATION_SCAFFOLD",
        },
      ];
    });
  };
  const advanceTo = (target: string): IntegratedPartialRuntimeState => {
    if (state.institutional === null) throw new Error("Integrated session lacks institutional time state.");
    const advanced = advanceScheduledState(
      {
        institutional: state.institutional,
        legislative: state.legislative,
        controlBinding,
        controlBindingHistory,
        implementation: state.implementation!,
        housing: state.housing!,
        information: state.information!,
        legalContest: state.legalContest!,
        population: state.population,
        lastInstant: state.institutional.calendar.current,
      },
      state.institutional.calendar,
      configuration.calendar.epoch,
      target,
      temporal.boundaries,
      (value, genericBoundary) => {
        const boundary = genericBoundary as typeof temporal.boundaries[number];
        const material = advanceMaterialOwners(value.implementation, value.housing, value.lastInstant, boundary.at);
        const result = applyInstitutionalBoundary(value.institutional, value.legislative, {
          temporal,
          structure: configuration.structure,
          legislativeSeed: configuration.runtimeSeed as LegislativeRuntimeSeed,
          population: value.population,
          topology: state.electoralTopology,
        }, boundary);
        let information = value.information;
        const legalContest = applyLegalContestBoundary(
          value.legalContest,
          legalContestConfiguration,
          boundary,
          material.implementation.administrativeProgram.relationshipQualificationDeterminations,
        );
        let population = value.population;
        const measurementCapture = informationConfiguration.measurements.find((measurement) => measurement.captureBoundaryId === boundary.id);
        const measurementRelease = informationConfiguration.measurements.find((measurement) => measurement.releaseBoundaryId === boundary.id);
        if (measurementCapture !== undefined) {
          information = captureIntegratedMeasurement(
            information,
            measurementCapture.id,
            captureObservations(measurementCapture, material.implementation, material.housing),
            boundary.at,
          );
        } else if (measurementRelease !== undefined) {
          information = releaseIntegratedMeasurement(information, measurementRelease.id, boundary.at);
        } else if (boundary.id === informationConfiguration.claim.releaseBoundaryId) {
          information = releaseIntegratedClaim(information, {
            id: informationConfiguration.claim.id,
            sourceArtifactIds: informationConfiguration.claim.sourceArtifactIds,
            producerId: result.institutional.currentAdministration.id,
            subject: informationConfiguration.claim.subject,
            assertion: informationConfiguration.claim.assertion,
            classification: informationConfiguration.classification,
          }, boundary.at);
        } else if (boundary.id === informationConfiguration.delivery.boundaryId) {
          information = deliverIntegratedArtifact(information, informationConfiguration.delivery, boundary.at);
        } else if (boundary.id === informationConfiguration.exposure.boundaryId) {
          const parent = population.cohorts.find((cohort) => cohort.id === informationConfiguration.exposure.parentCohortId);
          const parents = parent === undefined
            ? population.cohorts.filter((cohort) =>
                cohort.residenceGeographyId === informationConfiguration.exposure.stateGeographyId &&
                cohort.materialExposureClass === informationConfiguration.exposure.materialExposureClass &&
                cohort.catchmentClass === informationConfiguration.exposure.catchmentClass)
            : [parent];
          if (parents.length === 0 || parents.some((cohort) => cohort.residenceGeographyId !== informationConfiguration.exposure.stateGeographyId)) {
            throw new Error("Configured Information exposure lacks its canonical Population cohort scope.");
          }
          for (const candidate of parents) {
            const targetedWeight = Math.floor(
              candidate.representedWeight * informationConfiguration.exposure.targetNumerator /
              informationConfiguration.exposure.targetDenominator,
            );
            if (targetedWeight <= 0 || targetedWeight >= candidate.representedWeight) continue;
            population = refineWeightedPopulationCohort(population, {
              parentCohortId: candidate.id,
              targetedWeight,
              causeKey: informationConfiguration.exposure.id,
              association: { kind: "INFORMATION", referenceId: informationConfiguration.exposure.id },
            });
          }
          const targeted = population.cohorts.filter((cohort) =>
            cohort.receivedInformationReferences.includes(informationConfiguration.exposure.id));
          if (targeted.length === 0) throw new Error("Configured Information exposure could not target positive Population weight.");
          information = recordIntegratedExposure(information, {
            id: informationConfiguration.exposure.id,
            deliveryId: informationConfiguration.exposure.deliveryId,
            subjectCohortIds: targeted.map((cohort) => cohort.id),
          }, boundary.at);
        } else if (boundary.id === informationConfiguration.response.boundaryId) {
          const exposure = information.exposures.find((candidate) => candidate.id === informationConfiguration.response.exposureId);
          if (exposure === undefined) throw new Error("Population response lacks its prior targeted exposure.");
          const response = {
            cohortIds: exposure.subjectCohortIds,
            exposureId: exposure.id,
            belief: informationConfiguration.response.belief,
            attribution: result.institutional.currentAdministration.id,
            salience: informationConfiguration.response.salience,
            candidatePreference: informationConfiguration.response.candidatePreference,
            turnoutDisposition: informationConfiguration.response.turnoutDisposition,
            classification: informationConfiguration.classification,
          };
          population = applyPopulationInformationResponse(population, response);
          information = recordIntegratedPopulationResponse(information, {
            id: informationConfiguration.response.id,
            ...response,
            appliedAt: boundary.at,
          });
        }
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
          implementation: material.implementation,
          housing: material.housing,
          information,
          legalContest,
          population,
          lastInstant: boundary.at,
        };
      },
    );
    controlBinding = advanced.value.controlBinding;
    controlBindingHistory = [...advanced.value.controlBindingHistory];
    const material = advanceMaterialOwners(
      advanced.value.implementation,
      advanced.value.housing,
      advanced.value.lastInstant,
      advanced.calendar.current,
    );
    state = {
      ...state,
      legislative: advanced.value.legislative,
      institutional: { ...advanced.value.institutional, calendar: advanced.calendar },
      implementation: material.implementation,
      housing: material.housing,
      information: advanced.value.information,
      legalContest: advanced.value.legalContest,
      population: advanced.value.population,
    };
    return deepCopy(state);
  };
  return {
    getAuditState: () => {
      synchronizeHousingInputs();
      return deepCopy(state);
    },
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
    getPublicImplementationStatus: () => {
      if (state.implementation === null) throw new Error("Integrated session lacks implementation state.");
      const relationships = state.implementation.intergovernmental.historicalRelationships.map(
        (relationship) => ({ id: relationship.id, status: relationship.status }),
      );
      return deepCopy({
        detailCoverage: state.implementation.detailCoverage,
        nationalBalance: state.implementation.nationalBalance,
        historicalBudgetAuthorityCount: state.implementation.publicFinance.historicalBudgetAuthorities.length,
        generatedBudgetAuthorities: state.implementation.publicFinance.generatedBudgetAuthorities.map((authority) => ({
          id: authority.id,
          status: authority.status,
          minorUnits: authority.amount.minorUnits,
        })),
        pendingWaiverRequestIds: state.implementation.administrativeProgram.waiverRequests
          .filter((request) => request.reviewState !== "DETERMINED").map((request) => request.id),
        publicDeterminationIds: state.implementation.administrativeProgram.determinations.map((entry) => entry.id),
        relationshipStatuses: relationships,
        materialInputKinds: state.implementation.materialInputs.map((entry) => entry.kind),
        physicalHousingStatePresent: false as const,
      });
    },
    admitEnactedLawFiscalAuthority: (legalSourceId) => {
      requireAdministrationAuthority();
      if (state.implementation === null || state.institutional === null) throw new Error("Integrated implementation state unavailable.");
      const law = state.legislative.enactedLegalSources.find((entry) => entry.id === legalSourceId);
      if (law === undefined) throw new Error("Budget authority admission requires an actually enacted legal source.");
      state = { ...state, implementation: admitEnactedFiscalAuthority(
        state.implementation, law, implementationConfiguration, state.institutional.calendar.current,
      ) };
      return deepCopy(state);
    },
    requestApportionment: (budgetAuthorityId) => {
      requireAdministrationAuthority();
      if (state.implementation === null) throw new Error("Integrated implementation state unavailable.");
      state = { ...state, implementation: requestFiscalControl(state.implementation, budgetAuthorityId) };
      return deepCopy(state);
    },
    approveApportionment: (budgetAuthorityId) => {
      requireAdministrationAuthority();
      if (state.implementation === null || state.institutional === null) throw new Error("Integrated implementation state unavailable.");
      state = { ...state, implementation: approveFiscalControl(
        state.implementation, budgetAuthorityId, implementationConfiguration, state.institutional.calendar.current,
      ) };
      return deepCopy(state);
    },
    establishBoundedAward: (request) => {
      requireAdministrationAuthority();
      if (state.implementation === null || state.institutional === null) throw new Error("Integrated implementation state unavailable.");
      state = { ...state, implementation: establishBoundedRecipientAward(
        state.implementation, request, implementationConfiguration, state.institutional.calendar.current,
      ) };
      return deepCopy(state);
    },
    recordRecipientCommitment: (request) => {
      requireAdministrationAuthority();
      if (state.implementation === null || state.institutional === null) throw new Error("Integrated implementation state unavailable.");
      state = { ...state, implementation: establishRecipientCommitment(
        state.implementation, request, implementationConfiguration, state.institutional.calendar.current,
      ) };
      return deepCopy(state);
    },
    setUpRecipientActivity: (commitmentId) => {
      requireAdministrationAuthority();
      if (state.implementation === null || state.institutional === null) throw new Error("Integrated implementation state unavailable.");
      state = { ...state, implementation: setupRecipientActivity(
        state.implementation, commitmentId, implementationConfiguration, state.institutional.calendar.current,
      ) };
      return deepCopy(state);
    },
    submitRecipientDraw: (activityId, amountMinorUnits) => {
      requireAdministrationAuthority();
      if (state.implementation === null || state.institutional === null) throw new Error("Integrated implementation state unavailable.");
      state = { ...state, implementation: submitRecipientDrawRequest(
        state.implementation, activityId, amountMinorUnits, implementationConfiguration, state.institutional.calendar.current,
      ) };
      return deepCopy(state);
    },
    executeRecipientPayment: (drawRequestId) => {
      requireAdministrationAuthority();
      if (state.implementation === null || state.institutional === null) throw new Error("Integrated implementation state unavailable.");
      state = { ...state, implementation: executeEligiblePayment(
        state.implementation, drawRequestId, implementationConfiguration, state.institutional.calendar.current,
      ) };
      return deepCopy(state);
    },
    openFutureWaiver: (request) => {
      requireAdministrationAuthority();
      if (state.implementation === null || state.institutional === null) throw new Error("Integrated implementation state unavailable.");
      state = { ...state, implementation: openFutureWaiverRequest(
        state.implementation, request, implementationConfiguration, state.institutional.calendar.current,
      ) };
      return deepCopy(state);
    },
    directFutureWaiver: (requestId, intention) => {
      requireAdministrationAuthority();
      if (state.implementation === null || state.institutional === null) throw new Error("Integrated implementation state unavailable.");
      state = { ...state, implementation: directWaiverIntention(
        state.implementation, requestId, intention, implementationConfiguration, state.institutional.calendar.current,
      ) };
      return deepCopy(state);
    },
    supplyFutureWaiverRecords: (requestId, recordTypes) => {
      requireAdministrationAuthority();
      if (state.implementation === null) throw new Error("Integrated implementation state unavailable.");
      state = { ...state, implementation: supplySupplementalWaiverRecords(
        state.implementation, requestId, recordTypes,
      ) };
      return deepCopy(state);
    },
    electConsortiumMemberParticipation: (relationshipId, memberId, election, causeKey) => {
      requireAdministrationAuthority();
      if (state.implementation === null || state.institutional === null) throw new Error("Integrated implementation state unavailable.");
      state = { ...state, implementation: electRelationshipMember(
        state.implementation, relationshipId, memberId, election, causeKey,
        implementationConfiguration, state.institutional.calendar.current,
      ) };
      return deepCopy(state);
    },
    getHousingAuditState: () => {
      if (state.housing === null) throw new Error("Integrated session lacks Material Housing state.");
      synchronizeHousingInputs();
      return deepCopy(state.housing);
    },
    getInformationAuditState: () => {
      if (state.information === null) throw new Error("Integrated session lacks Information state.");
      return deepCopy(state.information);
    },
    getPublicInformationStatus: () => {
      if (state.information === null) throw new Error("Integrated session lacks Information state.");
      return deepCopy({
        releasedArtifacts: state.information.artifacts.map((artifact) => ({
          id: artifact.id,
          kind: artifact.kind,
          releasedAt: artifact.releasedAt,
        })),
        completedDeliveryIds: state.information.deliveries.map((delivery) => delivery.id),
        publicExposureCount: state.information.exposures.length,
      });
    },
    issueBoundedRelationshipRejection: () => {
      requireAdministrationAuthority();
      if (state.implementation === null || state.institutional === null) {
        throw new Error("Integrated implementation state unavailable.");
      }
      const filing = temporal.boundaries.find(
        (boundary) => boundary.id === legalContestConfiguration.claim.filingBoundaryId,
      );
      if (filing === undefined || Date.parse(state.institutional.calendar.current) >= Date.parse(filing.at)) {
        throw new Error("The bounded final determination must precede the configured filing boundary.");
      }
      state = {
        ...state,
        implementation: issueFinalRelationshipQualificationDetermination(
          state.implementation,
          {
            id: legalContestConfiguration.trigger.determinationId,
            relationshipId: legalContestConfiguration.relationshipId,
            claimantId: legalContestConfiguration.claimantId,
            writtenReasons: [
              "CONFIGURED_REQUALIFICATION_RECORD_REVIEWED",
              "ASSOCIATED_FORMULA_AMOUNT_DIRECTED_OUT_PENDING_EXECUTION",
            ],
          },
          state.institutional.calendar.current,
        ),
      };
      return deepCopy(state);
    },
    respondToJudicialOrder: (action) => {
      requireAdministrationAuthority();
      if (state.legalContest === null || state.institutional === null) {
        throw new Error("Integrated legal-contest state unavailable.");
      }
      state = {
        ...state,
        legalContest: recordAdministrativeOrderResponse(
          state.legalContest,
          legalContestConfiguration,
          state.institutional.currentAdministration.id,
          action,
          state.institutional.calendar.current,
        ),
      };
      return deepCopy(state);
    },
    requestJudicialStay: () => {
      requireAdministrationAuthority();
      if (state.legalContest === null || state.institutional === null) {
        throw new Error("Integrated legal-contest state unavailable.");
      }
      state = {
        ...state,
        legalContest: requestSeparateStay(
          state.legalContest,
          legalContestConfiguration,
          state.institutional.calendar.current,
        ),
      };
      return deepCopy(state);
    },
    getLegalContestAuditState: () => {
      if (state.legalContest === null) throw new Error("Integrated session lacks legal-contest state.");
      return deepCopy(state.legalContest);
    },
    save: () => {
      synchronizeHousingInputs();
      return serialize(state, controlBinding, controlBindingHistory);
    },
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

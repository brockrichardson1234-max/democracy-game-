import { deterministicUnit, sha256Hex } from "../configuration/sha256";
import type {
  AssignmentCycleConfiguration,
  GovernmentStructureDescriptor,
  InstitutionalBoundaryConfiguration,
  IntegratedSelectionConfiguration,
  IntegratedTemporalConfiguration,
  LegislativeRuntimeSeed,
  SelectionTicketConfiguration,
} from "../configuration/types";
import {
  createCalendarTimeState,
  deriveStrictMajority,
  type CalendarTimeState,
} from "./calendar-time";
import {
  currentEvaluatedProposal,
  expireLegislativeProcedureAtBoundary,
  type LegislativeRuntimeState,
} from "./legislative-runtime";
import {
  rebuildPoliticalStateForAssignments,
  type ActiveOfficeAssignmentState,
} from "./political";
import type { WeightedPopulationState } from "./population-core";

export interface StaticSelectionUnit {
  readonly id: string;
  readonly geographyId: string;
  readonly electorCount: number;
  readonly role: string;
  readonly electorateProjection: string;
}

export interface StaticSelectionAllocation {
  readonly id: string;
  readonly geographyId: string;
  readonly totalElectors: number;
  readonly method: string;
  readonly units: readonly StaticSelectionUnit[];
}

export interface StaticSelectionTopology {
  readonly applicableElection: number;
  readonly totalElectors: number;
  readonly ordinaryMajority: number;
  readonly allocations: readonly StaticSelectionAllocation[];
  readonly sourceArtifactId: string;
}

export interface TermPopulationSignalEntry {
  readonly cohortId: string;
  readonly residenceGeographyId: string;
  readonly eligibleProxyWeight: number;
  readonly canonicalPreference: string;
  readonly turnoutDisposition: string;
  readonly effectiveTicketId: string | null;
  readonly turnoutNumerator: number;
  readonly turnoutDenominator: number;
  readonly participatingWeight: number;
  readonly readinessClassification: "FALLBACK_SCAFFOLD" | "POPULATION_STATE";
}

export interface TermPopulationSignalSnapshot {
  readonly id: string;
  readonly cycleId: string;
  readonly stateGeographyId: string;
  readonly asOf: string;
  readonly signalVersion: string;
  readonly entries: readonly TermPopulationSignalEntry[];
  readonly signal: number;
  readonly causalInputHash: string;
}

export interface TermResultRecord {
  readonly officeId: string;
  readonly stateGeographyId: string;
  readonly outcome: "RETAIN" | "REPLACE";
  readonly outgoingAssignmentId: string | null;
  readonly outgoingActorId: string | null;
  readonly successorActorId: string;
  readonly successorAssignmentId: string;
  readonly populationSignalSnapshotId: string;
  readonly populationSignal: number;
  readonly deterministicIncumbencySignal: number;
  readonly causalInputHash: string;
}

export interface TermCycleRuntimeState {
  readonly cycleId: string;
  readonly termLabel: string;
  readonly frozenAt: string;
  readonly status: "FROZEN" | "PROCEDURE_EXPIRED" | "OUTGOING_ENDED" | "SUCCESSORS_BEGUN" | "AFFILIATIONS_REBUILT" | "COMPLETE";
  readonly populationSignals: readonly TermPopulationSignalSnapshot[];
  readonly results: readonly TermResultRecord[];
  readonly endedAssignments: readonly ActiveOfficeAssignmentState[];
  readonly begunAssignments: readonly ActiveOfficeAssignmentState[];
}

export interface ElectorateSnapshotEntry {
  readonly cohortId: string;
  readonly representedWeight: number;
  readonly eligibleProxyWeight: number;
  readonly residenceGeographyId: string;
  readonly candidatePreference: string;
  readonly turnoutDisposition: string;
  readonly effectiveTicketId: string | null;
  readonly turnoutNumerator: number;
  readonly turnoutDenominator: number;
  readonly readinessClassification: "POPULATION_STATE" | "FALLBACK_SCAFFOLD";
}

export interface StateElectorateSnapshot {
  readonly id: string;
  readonly geographyId: string;
  readonly asOf: string;
  readonly entries: readonly ElectorateSnapshotEntry[];
}

export interface WeightedBallotRecord {
  readonly id: string;
  readonly stateSnapshotId: string;
  readonly sourceCohortId: string;
  readonly ticketId: string | null;
  readonly eligibleProxyWeight: number;
  readonly participatingWeight: number;
}

export interface StatePopularResultRecord {
  readonly id: string;
  readonly geographyId: string;
  readonly snapshotId: string;
  readonly ballotIds: readonly string[];
  readonly ticketVoteWeights: Readonly<Record<string, number>>;
  readonly blankWeight: number;
  readonly totalEligibleProxyWeight: number;
  readonly totalParticipatingWeight: number;
  readonly winnerTicketId: string | null;
  readonly status: "RESOLVED" | "TIE_OR_UNRESOLVED";
  readonly resolvedAt: string;
}

export interface ResultAttestationRecord {
  readonly id: string;
  readonly geographyId: string;
  readonly resultId: string;
  readonly winnerTicketId: string;
  readonly completedAt: string;
  readonly timingClassification: string;
}

export interface DelegateAppointmentRecord {
  readonly id: string;
  readonly allocationId: string;
  readonly allocationUnitId: string;
  readonly geographyId: string;
  readonly electorCount: number;
  readonly ticketId: string;
  readonly sourceResultId: string;
  readonly sourceAttestationId: string;
  readonly method: string;
  readonly electorateProjection: string;
  readonly appointedAt: string;
}

export interface CountableCertificateRecord {
  readonly id: string;
  readonly appointmentId: string;
  readonly allocationUnitId: string;
  readonly officeRole: "HEAD" | "DEPUTY";
  readonly candidateActorId: string;
  readonly ticketId: string;
  readonly voteCount: number;
  readonly generatedAt: string;
}

export interface CollegiateDeclarationRecord {
  readonly id: string;
  readonly declaredAt: string;
  readonly countingTermLabel: string;
  readonly countingAssignmentIds: readonly string[];
  readonly countableCertificateIds: readonly string[];
  readonly headDenominator: number;
  readonly deputyDenominator: number;
  readonly requiredMajority: number;
  readonly headTallies: Readonly<Record<string, number>>;
  readonly deputyTallies: Readonly<Record<string, number>>;
  readonly winningHeadActorId: string;
  readonly winningDeputyActorId: string;
  readonly winningTicketId: string;
}

export interface SuccessorEntitlementRecord {
  readonly id: string;
  readonly officeId: string;
  readonly entitledActorId: string;
  readonly sourceDeclarationId: string;
  readonly sourceCertificateIds: readonly string[];
  readonly scheduledTransferAt: string;
  readonly createdAt: string;
}

export interface SelectionRuntimeState {
  readonly selectionId: string;
  readonly stage: "SCHEDULED" | "POPULAR_RESOLVED" | "ATTESTED_AND_APPOINTED" | "DELEGATES_ACTED" | "DECLARED" | "TRANSFERRED";
  readonly snapshots: readonly StateElectorateSnapshot[];
  readonly ballots: readonly WeightedBallotRecord[];
  readonly popularResults: readonly StatePopularResultRecord[];
  readonly attestations: readonly ResultAttestationRecord[];
  readonly appointments: readonly DelegateAppointmentRecord[];
  readonly certificates: readonly CountableCertificateRecord[];
  readonly declaration: CollegiateDeclarationRecord | null;
  readonly entitlements: readonly SuccessorEntitlementRecord[];
  readonly transferredAt: string | null;
}

export interface AdministrationTermState {
  readonly id: string;
  readonly headActorId: string;
  readonly deputyActorId: string;
  readonly effectiveFrom: string;
  readonly effectiveUntil: string | null;
  readonly sourceDeclarationId: string | null;
  readonly classification: string;
}

export interface InstitutionalOccurrence {
  readonly id: string;
  readonly boundaryId: string;
  readonly kind: string;
  readonly occurredAt: string;
  readonly ownerId: string;
  readonly recordIds: readonly string[];
}

export interface InstitutionalRuntimeState {
  readonly schemaVersion: number;
  readonly scheduleVersion: string;
  readonly parameterHash: string;
  readonly calendar: CalendarTimeState;
  readonly currentTermLabel: string;
  readonly termCycles: readonly TermCycleRuntimeState[];
  readonly selection: SelectionRuntimeState;
  readonly currentAdministration: AdministrationTermState;
  readonly administrationHistory: readonly AdministrationTermState[];
  readonly occurrences: readonly InstitutionalOccurrence[];
}

export interface InstitutionalTransitionContext {
  readonly temporal: IntegratedTemporalConfiguration;
  readonly structure: GovernmentStructureDescriptor;
  readonly legislativeSeed: LegislativeRuntimeSeed;
  readonly population: WeightedPopulationState;
  readonly topology: StaticSelectionTopology;
}

export interface InstitutionalTransitionResult {
  readonly institutional: InstitutionalRuntimeState;
  readonly legislative: LegislativeRuntimeState;
  readonly transferredTicket: SelectionTicketConfiguration | null;
}

const fraction = ({ numerator, denominator }: { readonly numerator: number; readonly denominator: number }): number => {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || denominator <= 0) {
    throw new Error("Configured fraction must contain safe integers and a positive denominator.");
  }
  return numerator / denominator;
};

const ticketById = (
  selection: IntegratedSelectionConfiguration,
  ticketId: string,
): SelectionTicketConfiguration => {
  const ticket = selection.tickets.find((candidate) => candidate.id === ticketId);
  if (ticket === undefined) throw new Error(`Unknown configured selection ticket ${ticketId}.`);
  return ticket;
};

const assertSelectionActorClosure = (
  structure: GovernmentStructureDescriptor,
  selection: IntegratedSelectionConfiguration,
): void => {
  for (const ticket of selection.tickets) {
    for (const actorId of [ticket.headCandidate.actorId, ticket.deputyCandidate.actorId]) {
      const matches = structure.actors.filter((actor) => actor.id === actorId);
      if (matches.length !== 1 || matches[0].role !== "EXECUTIVE") {
        throw new Error(`Configured selection candidate references non-canonical actor ${actorId}.`);
      }
    }
  }
};

const fallbackTicket = (
  selection: IntegratedSelectionConfiguration,
  cohortId: string,
  causalSuffix: string,
): string | null => {
  const unit = deterministicUnit(`${selection.populationScaffold.stableKey}|${causalSuffix}|${cohortId}|preference`);
  for (const threshold of selection.populationScaffold.fallbackPreferenceThresholds) {
    if (unit < fraction(threshold.cumulativeUpperBound)) return threshold.ticketId;
  }
  throw new Error("Population selection fallback thresholds do not cover the deterministic unit interval.");
};

const resolvedTicket = (
  selection: IntegratedSelectionConfiguration,
  cohortId: string,
  preference: string,
  causalSuffix: string,
): { readonly ticketId: string | null; readonly fallback: boolean } => {
  if (preference === selection.populationScaffold.unresolvedPreferenceValue) {
    return { ticketId: fallbackTicket(selection, cohortId, causalSuffix), fallback: true };
  }
  if (selection.tickets.some((ticket) => ticket.id === preference)) return { ticketId: preference, fallback: false };
  if (Object.prototype.hasOwnProperty.call(selection.populationScaffold.preferenceAliases, preference)) {
    return { ticketId: selection.populationScaffold.preferenceAliases[preference] ?? null, fallback: false };
  }
  throw new Error(`Resolved Population preference ${preference} has no configured ticket meaning.`);
};

const resolvedTurnout = (
  selection: IntegratedSelectionConfiguration,
  disposition: string,
): { readonly numerator: number; readonly denominator: number; readonly fallback: boolean } => {
  const configured = selection.populationScaffold.turnoutWeights[disposition];
  if (configured !== undefined) return { ...configured, fallback: false };
  if (disposition === selection.populationScaffold.unresolvedTurnoutValue) {
    return { ...selection.populationScaffold.fallbackTurnoutWeight, fallback: true };
  }
  throw new Error(`Resolved Population turnout disposition ${disposition} lacks a configured participation weight.`);
};

const signalFromTermEntries = (
  entries: readonly TermPopulationSignalEntry[],
  selection: IntegratedSelectionConfiguration,
): number => {
  const denominator = entries.reduce((total, entry) => total + entry.participatingWeight, 0);
  const signed = entries.reduce((total, entry) => total + (
    entry.effectiveTicketId === selection.transfer.playerAlignedTicketId
      ? entry.participatingWeight
      : entry.effectiveTicketId === null
        ? 0
        : -entry.participatingWeight
  ), 0);
  return denominator === 0 ? 0 : signed / denominator;
};

const populationSignalForGeography = (
  population: WeightedPopulationState,
  selection: IntegratedSelectionConfiguration,
  geographyId: string,
  causalSuffix: string,
): {
  readonly signal: number;
  readonly causalInputHash: string;
  readonly entries: readonly TermPopulationSignalEntry[];
} => {
  const entries = population.cohorts
    .filter((cohort) => cohort.residenceGeographyId === geographyId)
    .sort((left, right) => left.id.localeCompare(right.id))
    .map((cohort) => {
      const preference = resolvedTicket(selection, cohort.id, cohort.politicalState.candidatePreference, causalSuffix);
      const turnout = resolvedTurnout(selection, cohort.politicalState.turnoutDisposition);
      const participating = Math.floor(
        cohort.eligibilityProjection.allocatedWeight * turnout.numerator / turnout.denominator,
      );
      return {
        cohortId: cohort.id,
        residenceGeographyId: cohort.residenceGeographyId,
        eligibleProxyWeight: cohort.eligibilityProjection.allocatedWeight,
        canonicalPreference: cohort.politicalState.candidatePreference,
        turnoutDisposition: cohort.politicalState.turnoutDisposition,
        effectiveTicketId: preference.ticketId,
        turnoutNumerator: turnout.numerator,
        turnoutDenominator: turnout.denominator,
        participatingWeight: participating,
        readinessClassification: preference.fallback || turnout.fallback ? "FALLBACK_SCAFFOLD" as const : "POPULATION_STATE" as const,
      } satisfies TermPopulationSignalEntry;
    });
  if (entries.length === 0) throw new Error(`Configured institutional process lacks Population for ${geographyId}.`);
  return {
    signal: signalFromTermEntries(entries, selection),
    causalInputHash: sha256Hex(JSON.stringify(entries)),
    entries,
  };
};

const appendOccurrence = (
  state: InstitutionalRuntimeState,
  boundary: InstitutionalBoundaryConfiguration,
  recordIds: readonly string[],
): InstitutionalRuntimeState => ({
  ...state,
  occurrences: [...state.occurrences, {
    id: `occurrence:${boundary.id}`,
    boundaryId: boundary.id,
    kind: boundary.kind,
    occurredAt: boundary.at,
    ownerId: boundary.ownerId,
    recordIds,
  }],
});

export const createInstitutionalRuntimeState = (
  epoch: string,
  temporal: IntegratedTemporalConfiguration,
): InstitutionalRuntimeState => ({
  schemaVersion: temporal.schemaVersion,
  scheduleVersion: temporal.scheduleVersion,
  parameterHash: temporal.parameterHash,
  calendar: createCalendarTimeState(epoch, temporal.boundaries),
  currentTermLabel: temporal.initialTermLabel,
  termCycles: [],
  selection: {
    selectionId: temporal.selection.id,
    stage: "SCHEDULED",
    snapshots: [],
    ballots: [],
    popularResults: [],
    attestations: [],
    appointments: [],
    certificates: [],
    declaration: null,
    entitlements: [],
    transferredAt: null,
  },
  currentAdministration: {
    ...temporal.initialAdministration,
    sourceDeclarationId: null,
  },
  administrationHistory: [],
  occurrences: [],
});

const configuredCycle = (
  temporal: IntegratedTemporalConfiguration,
  ownerId: string,
): AssignmentCycleConfiguration => {
  const configured = temporal.assignmentCycles.find((cycle) => cycle.id === ownerId);
  if (configured === undefined) throw new Error(`Unknown configured assignment cycle ${ownerId}.`);
  return configured;
};

const runtimeCycle = (
  state: InstitutionalRuntimeState,
  cycleId: string,
): TermCycleRuntimeState => {
  const cycle = state.termCycles.find((candidate) => candidate.cycleId === cycleId);
  if (cycle === undefined) throw new Error(`Assignment cycle ${cycleId} has not frozen its result.`);
  return cycle;
};

const replaceRuntimeCycle = (
  state: InstitutionalRuntimeState,
  replacement: TermCycleRuntimeState,
): InstitutionalRuntimeState => ({
  ...state,
  termCycles: state.termCycles.map((cycle) => cycle.cycleId === replacement.cycleId ? replacement : cycle),
});

const snapshotTermResults = (
  institutional: InstitutionalRuntimeState,
  legislative: LegislativeRuntimeState,
  context: InstitutionalTransitionContext,
  boundary: InstitutionalBoundaryConfiguration,
): InstitutionalRuntimeState => {
  if (institutional.termCycles.some((cycle) => cycle.cycleId === boundary.ownerId)) {
    throw new Error("Assignment-cycle result snapshot cannot occur twice.");
  }
  const cycle = configuredCycle(context.temporal, boundary.ownerId);
  const stateGeographyIds = [...new Set(cycle.officeIds.map((officeId) => {
    const geographyId = cycle.stateGeographyByOfficeId[officeId];
    if (geographyId === undefined) throw new Error(`Assignment cycle ${cycle.id} lacks a Population geography.`);
    return geographyId;
  }))].sort();
  const populationSignals = stateGeographyIds.map((stateGeographyId): TermPopulationSignalSnapshot => {
    const population = populationSignalForGeography(
      context.population,
      context.temporal.selection,
      stateGeographyId,
      `${cycle.populationSignalVersion}|${cycle.stableKey}|${stateGeographyId}|ROLLOVER_POPULATION`,
    );
    return {
      id: `${cycle.populationSignalIdPrefix}${sha256Hex(`${cycle.id}|${stateGeographyId}`).slice(0, 20)}`,
      cycleId: cycle.id,
      stateGeographyId,
      asOf: boundary.at,
      signalVersion: cycle.populationSignalVersion,
      entries: population.entries,
      signal: population.signal,
      causalInputHash: population.causalInputHash,
    };
  });
  const results = cycle.officeIds.map((officeId): TermResultRecord => {
    const outgoing = legislative.activeAssignments.find((assignment) => assignment.officeId === officeId) ?? null;
    const stateGeographyId = cycle.stateGeographyByOfficeId[officeId];
    if (stateGeographyId === undefined) throw new Error(`Assignment cycle lacks Population geography for ${officeId}.`);
    const population = populationSignals.find((signal) => signal.stateGeographyId === stateGeographyId);
    if (population === undefined) throw new Error(`Assignment cycle lacks a frozen Population signal for ${officeId}.`);
    const incumbentActorState = outgoing === null
      ? null
      : legislative.political.actors.find((actor) => actor.actorId === outgoing.actorId) ?? null;
    const organizationState = legislative.political.organizations.find((organization) =>
      organization.memberships.some((membership) => membership.officeId === officeId)) ?? null;
    const boundedPoliticalInput = {
      actorId: outgoing?.actorId ?? null,
      actorState: incumbentActorState === null ? null : {
        supportPosture: incumbentActorState.supportPosture,
        negotiationMemory: incumbentActorState.negotiationMemory,
        commitmentIds: incumbentActorState.commitmentIds,
        lastDecision: incumbentActorState.lastDecision,
      },
      organizationState: organizationState === null ? null : {
        id: organizationState.id,
        negotiationPosture: organizationState.negotiationPosture,
        coordinationActions: organizationState.coordinationActions,
      },
    };
    const incumbency = deterministicUnit(
      `${cycle.stableKey}|${officeId}|${JSON.stringify(boundedPoliticalInput)}`,
    ) * 2 - 1;
    const score = population.signal * fraction(cycle.populationInfluence) +
      incumbency * fraction(cycle.incumbentInfluence);
    const outcome = outgoing !== null && score >= fraction(cycle.retainThreshold) ? "RETAIN" : "REPLACE";
    const digest = sha256Hex([
      cycle.scaffoldVersion,
      cycle.stableKey,
      officeId,
      outgoing?.id ?? "VACANT",
      outgoing?.actorId ?? "VACANT",
      population.causalInputHash,
      JSON.stringify(boundedPoliticalInput),
    ].join("|"));
    const successorActorId = outcome === "RETAIN"
      ? outgoing!.actorId
      : `${cycle.replacementActorIdPrefix}${sha256Hex(`${digest}|actor`).slice(0, 24)}`;
    return {
      officeId,
      stateGeographyId,
      outcome,
      outgoingAssignmentId: outgoing?.id ?? null,
      outgoingActorId: outgoing?.actorId ?? null,
      successorActorId,
      successorAssignmentId: `${cycle.assignmentIdPrefix}${sha256Hex(`${digest}|assignment`).slice(0, 24)}`,
      populationSignalSnapshotId: population.id,
      populationSignal: population.signal,
      deterministicIncumbencySignal: incumbency,
      causalInputHash: digest,
    };
  });
  const runtime: TermCycleRuntimeState = {
    cycleId: cycle.id,
    termLabel: cycle.termLabel,
    frozenAt: boundary.at,
    status: "FROZEN",
    populationSignals,
    results,
    endedAssignments: [],
    begunAssignments: [],
  };
  return appendOccurrence({ ...institutional, termCycles: [...institutional.termCycles, runtime] }, boundary, []);
};

const expireProcedure = (
  institutional: InstitutionalRuntimeState,
  legislative: LegislativeRuntimeState,
  boundary: InstitutionalBoundaryConfiguration,
): { readonly institutional: InstitutionalRuntimeState; readonly legislative: LegislativeRuntimeState } => {
  const cycle = runtimeCycle(institutional, boundary.ownerId);
  if (cycle.status !== "FROZEN") throw new Error("Procedure expiry violates configured assignment-cycle ordering.");
  const nextCycle = { ...cycle, status: "PROCEDURE_EXPIRED" as const };
  return {
    institutional: appendOccurrence(replaceRuntimeCycle(institutional, nextCycle), boundary, [legislative.agenda.proposalId]),
    legislative: expireLegislativeProcedureAtBoundary(legislative, boundary.at),
  };
};

const endOutgoingAssignments = (
  institutional: InstitutionalRuntimeState,
  legislative: LegislativeRuntimeState,
  boundary: InstitutionalBoundaryConfiguration,
): { readonly institutional: InstitutionalRuntimeState; readonly legislative: LegislativeRuntimeState } => {
  const cycle = runtimeCycle(institutional, boundary.ownerId);
  if (cycle.status !== "PROCEDURE_EXPIRED") throw new Error("Outgoing assignment end violates configured cycle ordering.");
  const officeIds = new Set(cycle.results.map((result) => result.officeId));
  const ended = legislative.activeAssignments
    .filter((assignment) => officeIds.has(assignment.officeId))
    .map((assignment) => ({ ...assignment, effectiveUntil: boundary.at }));
  const nextCycle = { ...cycle, status: "OUTGOING_ENDED" as const, endedAssignments: ended };
  return {
    institutional: appendOccurrence(replaceRuntimeCycle(institutional, nextCycle), boundary, ended.map((assignment) => assignment.id)),
    legislative: {
      ...legislative,
      activeAssignments: legislative.activeAssignments.filter((assignment) => !officeIds.has(assignment.officeId)),
    },
  };
};

const beginSuccessorAssignments = (
  institutional: InstitutionalRuntimeState,
  legislative: LegislativeRuntimeState,
  context: InstitutionalTransitionContext,
  boundary: InstitutionalBoundaryConfiguration,
): { readonly institutional: InstitutionalRuntimeState; readonly legislative: LegislativeRuntimeState } => {
  const runtime = runtimeCycle(institutional, boundary.ownerId);
  if (runtime.status !== "OUTGOING_ENDED") throw new Error("Successor assignment begin violates configured cycle ordering.");
  const cycle = configuredCycle(context.temporal, boundary.ownerId);
  const begun = runtime.results.map((result): ActiveOfficeAssignmentState => {
    const effectiveUntil = cycle.nextBoundaryByOfficeId[result.officeId];
    if (effectiveUntil === undefined) throw new Error(`Assignment cycle lacks successor interval for ${result.officeId}.`);
    return {
      id: result.successorAssignmentId,
      officeId: result.officeId,
      actorId: result.successorActorId,
      effectiveFrom: boundary.at,
      effectiveUntil,
      classification: cycle.classification,
    };
  });
  const all = [...legislative.activeAssignments, ...begun];
  if (
    new Set(all.map((assignment) => assignment.id)).size !== all.length ||
    new Set(all.map((assignment) => assignment.officeId)).size !== all.length ||
    new Set(all.map((assignment) => assignment.actorId)).size !== all.length
  ) throw new Error("Successor assignments violate canonical active-assignment uniqueness.");
  const nextCycle = { ...runtime, status: "SUCCESSORS_BEGUN" as const, begunAssignments: begun };
  return {
    institutional: appendOccurrence(replaceRuntimeCycle(institutional, nextCycle), boundary, begun.map((assignment) => assignment.id)),
    legislative: { ...legislative, activeAssignments: all },
  };
};

const rebuildAffiliations = (
  institutional: InstitutionalRuntimeState,
  legislative: LegislativeRuntimeState,
  context: InstitutionalTransitionContext,
  boundary: InstitutionalBoundaryConfiguration,
): { readonly institutional: InstitutionalRuntimeState; readonly legislative: LegislativeRuntimeState } => {
  const cycle = runtimeCycle(institutional, boundary.ownerId);
  if (cycle.status !== "SUCCESSORS_BEGUN") throw new Error("Affiliation rebuild violates configured cycle ordering.");
  const political = rebuildPoliticalStateForAssignments(
    legislative.political,
    context.structure,
    context.legislativeSeed,
    legislative.activeAssignments,
    currentEvaluatedProposal(legislative),
  );
  const nextCycle = { ...cycle, status: "AFFILIATIONS_REBUILT" as const };
  return {
    institutional: appendOccurrence(replaceRuntimeCycle(institutional, nextCycle), boundary, political.organizations.map((organization) => organization.id)),
    legislative: { ...legislative, political },
  };
};

const completeMembership = (
  institutional: InstitutionalRuntimeState,
  boundary: InstitutionalBoundaryConfiguration,
): InstitutionalRuntimeState => {
  const cycle = runtimeCycle(institutional, boundary.ownerId);
  if (cycle.status !== "AFFILIATIONS_REBUILT") throw new Error("Membership recompute violates configured cycle ordering.");
  const nextCycle = { ...cycle, status: "COMPLETE" as const };
  return appendOccurrence({
    ...replaceRuntimeCycle(institutional, nextCycle),
    currentTermLabel: cycle.termLabel,
  }, boundary, cycle.begunAssignments.map((assignment) => assignment.id));
};

export const resolveStatePopularSelection = (
  population: WeightedPopulationState,
  selection: IntegratedSelectionConfiguration,
  occurredAt: string,
): Pick<SelectionRuntimeState, "snapshots" | "ballots" | "popularResults"> => {
  const snapshots: StateElectorateSnapshot[] = [];
  const ballots: WeightedBallotRecord[] = [];
  const popularResults: StatePopularResultRecord[] = [];
  for (const geographyId of selection.stateGeographyIds) {
    const stateToken = sha256Hex(geographyId).slice(0, 16);
    const entries = population.cohorts
      .filter((cohort) => cohort.residenceGeographyId === geographyId)
      .sort((left, right) => left.id.localeCompare(right.id))
      .map((cohort): ElectorateSnapshotEntry => {
        const preference = resolvedTicket(selection, cohort.id, cohort.politicalState.candidatePreference, selection.id);
        const turnout = resolvedTurnout(selection, cohort.politicalState.turnoutDisposition);
        return {
          cohortId: cohort.id,
          representedWeight: cohort.representedWeight,
          eligibleProxyWeight: cohort.eligibilityProjection.allocatedWeight,
          residenceGeographyId: cohort.residenceGeographyId,
          candidatePreference: cohort.politicalState.candidatePreference,
          turnoutDisposition: cohort.politicalState.turnoutDisposition,
          effectiveTicketId: preference.ticketId,
          turnoutNumerator: turnout.numerator,
          turnoutDenominator: turnout.denominator,
          readinessClassification: preference.fallback || turnout.fallback ? "FALLBACK_SCAFFOLD" : "POPULATION_STATE",
        };
      });
    if (entries.length === 0) throw new Error(`Popular selection lacks Population entries for ${geographyId}.`);
    const snapshot: StateElectorateSnapshot = {
      id: `${selection.recordIds.snapshotPrefix}${stateToken}`,
      geographyId,
      asOf: occurredAt,
      entries,
    };
    snapshots.push(snapshot);
    const stateBallots = entries.map((entry): WeightedBallotRecord => ({
      id: `${selection.recordIds.ballotPrefix}${stateToken}.${sha256Hex(entry.cohortId).slice(0, 16)}`,
      stateSnapshotId: snapshot.id,
      sourceCohortId: entry.cohortId,
      ticketId: entry.effectiveTicketId,
      eligibleProxyWeight: entry.eligibleProxyWeight,
      participatingWeight: Math.floor(entry.eligibleProxyWeight * entry.turnoutNumerator / entry.turnoutDenominator),
    }));
    ballots.push(...stateBallots);
    const ticketVoteWeights = Object.fromEntries(selection.tickets.map((ticket) => [
      ticket.id,
      stateBallots.filter((ballot) => ballot.ticketId === ticket.id)
        .reduce((total, ballot) => total + ballot.participatingWeight, 0),
    ]));
    const ranked = Object.entries(ticketVoteWeights).sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]));
    const winnerTicketId = ranked.length > 0 && ranked[0][1] > (ranked[1]?.[1] ?? -1) ? ranked[0][0] : null;
    popularResults.push({
      id: `${selection.recordIds.resultPrefix}${stateToken}`,
      geographyId,
      snapshotId: snapshot.id,
      ballotIds: stateBallots.map((ballot) => ballot.id),
      ticketVoteWeights,
      blankWeight: stateBallots.filter((ballot) => ballot.ticketId === null)
        .reduce((total, ballot) => total + ballot.participatingWeight, 0),
      totalEligibleProxyWeight: entries.reduce((total, entry) => total + entry.eligibleProxyWeight, 0),
      totalParticipatingWeight: stateBallots.reduce((total, ballot) => total + ballot.participatingWeight, 0),
      winnerTicketId,
      status: winnerTicketId === null ? "TIE_OR_UNRESOLVED" : "RESOLVED",
      resolvedAt: occurredAt,
    });
  }
  return { snapshots, ballots, popularResults };
};

const resolvePopularBoundary = (
  institutional: InstitutionalRuntimeState,
  context: InstitutionalTransitionContext,
  boundary: InstitutionalBoundaryConfiguration,
): InstitutionalRuntimeState => {
  if (institutional.selection.stage !== "SCHEDULED") throw new Error("Popular selection boundary cannot run twice.");
  const resolved = resolveStatePopularSelection(context.population, context.temporal.selection, boundary.at);
  if (resolved.popularResults.length !== context.temporal.selection.stateGeographyIds.length) {
    throw new Error("Popular selection did not resolve every configured geography.");
  }
  const selection = { ...institutional.selection, ...resolved, stage: "POPULAR_RESOLVED" as const };
  return appendOccurrence({ ...institutional, selection }, boundary, resolved.popularResults.map((result) => result.id));
};

const attestAndAppoint = (
  institutional: InstitutionalRuntimeState,
  context: InstitutionalTransitionContext,
  boundary: InstitutionalBoundaryConfiguration,
): InstitutionalRuntimeState => {
  if (institutional.selection.stage !== "POPULAR_RESOLVED") throw new Error("Result attestation requires resolved popular results.");
  const resultByGeography = new Map(institutional.selection.popularResults.map((result) => [result.geographyId, result]));
  const attestations = context.temporal.selection.stateGeographyIds.map((geographyId): ResultAttestationRecord => {
    const result = resultByGeography.get(geographyId);
    if (result?.status !== "RESOLVED" || result.winnerTicketId === null) {
      throw new Error(`Result attestation cannot certify unresolved geography ${geographyId}.`);
    }
    return {
      id: `${context.temporal.selection.recordIds.attestationPrefix}${sha256Hex(geographyId).slice(0, 16)}`,
      geographyId,
      resultId: result.id,
      winnerTicketId: result.winnerTicketId,
      completedAt: boundary.at,
      timingClassification: context.temporal.selection.timingClassification,
    };
  });
  const attestationByGeography = new Map(attestations.map((attestation) => [attestation.geographyId, attestation]));
  const appointments = context.topology.allocations.flatMap((allocation) => {
    const result = resultByGeography.get(allocation.geographyId);
    const attestation = attestationByGeography.get(allocation.geographyId);
    if (result?.winnerTicketId === null || result === undefined || attestation === undefined) {
      throw new Error(`Delegate appointment lacks a valid attested result for ${allocation.id}.`);
    }
    return allocation.units.map((unit): DelegateAppointmentRecord => ({
      id: `${context.temporal.selection.recordIds.appointmentPrefix}${sha256Hex(unit.id).slice(0, 20)}`,
      allocationId: allocation.id,
      allocationUnitId: unit.id,
      geographyId: unit.geographyId,
      electorCount: unit.electorCount,
      ticketId: result.winnerTicketId!,
      sourceResultId: result.id,
      sourceAttestationId: attestation.id,
      method: allocation.method,
      electorateProjection: unit.electorateProjection,
      appointedAt: boundary.at,
    }));
  });
  const selection = {
    ...institutional.selection,
    stage: "ATTESTED_AND_APPOINTED" as const,
    attestations,
    appointments,
  };
  return appendOccurrence({ ...institutional, selection }, boundary, [
    ...attestations.map((attestation) => attestation.id),
    ...appointments.map((appointment) => appointment.id),
  ]);
};

const delegatesAct = (
  institutional: InstitutionalRuntimeState,
  context: InstitutionalTransitionContext,
  boundary: InstitutionalBoundaryConfiguration,
): InstitutionalRuntimeState => {
  if (institutional.selection.stage !== "ATTESTED_AND_APPOINTED") {
    throw new Error("Delegate action requires appointed delegate records.");
  }
  const certificates = institutional.selection.appointments.flatMap((appointment) => {
    const ticket = ticketById(context.temporal.selection, appointment.ticketId);
    return ([
      ["HEAD", ticket.headCandidate.actorId],
      ["DEPUTY", ticket.deputyCandidate.actorId],
    ] as const).map(([officeRole, candidateActorId]): CountableCertificateRecord => ({
      id: `${context.temporal.selection.recordIds.certificatePrefix}${sha256Hex(`${appointment.id}|${officeRole}`).slice(0, 24)}`,
      appointmentId: appointment.id,
      allocationUnitId: appointment.allocationUnitId,
      officeRole,
      candidateActorId,
      ticketId: ticket.id,
      voteCount: appointment.electorCount,
      generatedAt: boundary.at,
    }));
  });
  const selection = { ...institutional.selection, stage: "DELEGATES_ACTED" as const, certificates };
  return appendOccurrence({ ...institutional, selection }, boundary, certificates.map((certificate) => certificate.id));
};

const tallyCertificates = (
  certificates: readonly CountableCertificateRecord[],
  role: CountableCertificateRecord["officeRole"],
): { readonly denominator: number; readonly tallies: Readonly<Record<string, number>> } => {
  const selected = certificates.filter((certificate) => certificate.officeRole === role);
  const tallies: Record<string, number> = {};
  for (const certificate of selected) {
    tallies[certificate.candidateActorId] = (tallies[certificate.candidateActorId] ?? 0) + certificate.voteCount;
  }
  return {
    denominator: selected.reduce((total, certificate) => total + certificate.voteCount, 0),
    tallies,
  };
};

const majorityWinner = (tallies: Readonly<Record<string, number>>, majority: number): string => {
  const eligible = Object.entries(tallies).filter(([, count]) => count >= majority)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]));
  if (eligible.length !== 1) throw new Error("Configured ordinary collegiate declaration lacks a unique majority winner.");
  return eligible[0][0];
};

export const declareCountableCertificates = (
  certificates: readonly CountableCertificateRecord[],
): {
  readonly headDenominator: number;
  readonly deputyDenominator: number;
  readonly requiredMajority: number;
  readonly headTallies: Readonly<Record<string, number>>;
  readonly deputyTallies: Readonly<Record<string, number>>;
  readonly winningHeadActorId: string;
  readonly winningDeputyActorId: string;
} => {
  const head = tallyCertificates(certificates, "HEAD");
  const deputy = tallyCertificates(certificates, "DEPUTY");
  if (head.denominator !== deputy.denominator) throw new Error("Countable office-role certificate denominators differ.");
  const requiredMajority = deriveStrictMajority(head.denominator);
  return {
    headDenominator: head.denominator,
    deputyDenominator: deputy.denominator,
    requiredMajority,
    headTallies: head.tallies,
    deputyTallies: deputy.tallies,
    winningHeadActorId: majorityWinner(head.tallies, requiredMajority),
    winningDeputyActorId: majorityWinner(deputy.tallies, requiredMajority),
  };
};

const declareAndEntitle = (
  institutional: InstitutionalRuntimeState,
  legislative: LegislativeRuntimeState,
  context: InstitutionalTransitionContext,
  boundary: InstitutionalBoundaryConfiguration,
): InstitutionalRuntimeState => {
  if (institutional.selection.stage !== "DELEGATES_ACTED") throw new Error("Collegiate declaration requires countable certificates.");
  const requiredCycleId = [...context.temporal.boundaries]
    .filter((candidate) =>
      candidate.kind === "MEMBERSHIP_RECOMPUTE" && Date.parse(candidate.at) < Date.parse(boundary.at))
    .sort((left, right) => Date.parse(right.at) - Date.parse(left.at) || right.phase - left.phase)[0]?.ownerId;
  const latestCompleted = [...institutional.termCycles]
    .filter((cycle) => cycle.status === "COMPLETE" && Date.parse(cycle.frozenAt) < Date.parse(boundary.at))
    .sort((left, right) => Date.parse(right.frozenAt) - Date.parse(left.frozenAt))[0];
  if (latestCompleted === undefined || requiredCycleId === undefined || latestCompleted.cycleId !== requiredCycleId) {
    throw new Error("Collegiate declaration requires the configured active-term transition to be complete.");
  }
  const counted = declareCountableCertificates(institutional.selection.certificates);
  const winningTicket = context.temporal.selection.tickets.find((ticket) =>
    ticket.headCandidate.actorId === counted.winningHeadActorId &&
    ticket.deputyCandidate.actorId === counted.winningDeputyActorId,
  );
  if (winningTicket === undefined) throw new Error("Collegiate declaration winners do not form a configured ticket.");
  const legislativeOfficeIds = new Set(context.structure.offices
    .filter((office) => office.kind === "LEGISLATIVE_MEMBER")
    .map((office) => office.id));
  const countingAssignmentIds = legislative.activeAssignments
    .filter((assignment) => legislativeOfficeIds.has(assignment.officeId))
    .map((assignment) => assignment.id)
    .sort();
  const declaration: CollegiateDeclarationRecord = {
    id: `${context.temporal.selection.recordIds.declarationPrefix}${sha256Hex(boundary.id).slice(0, 16)}`,
    declaredAt: boundary.at,
    countingTermLabel: institutional.currentTermLabel,
    countingAssignmentIds,
    countableCertificateIds: institutional.selection.certificates.map((certificate) => certificate.id).sort(),
    ...counted,
    winningTicketId: winningTicket.id,
  };
  const entitlements = ([
    [context.temporal.selection.transfer.headOfficeId, counted.winningHeadActorId, "HEAD"],
    [context.temporal.selection.transfer.deputyOfficeId, counted.winningDeputyActorId, "DEPUTY"],
  ] as const).map(([officeId, entitledActorId, role]): SuccessorEntitlementRecord => ({
    id: `${context.temporal.selection.recordIds.entitlementPrefix}${role.toLowerCase()}`,
    officeId,
    entitledActorId,
    sourceDeclarationId: declaration.id,
    sourceCertificateIds: institutional.selection.certificates
      .filter((certificate) => certificate.officeRole === role && certificate.candidateActorId === entitledActorId)
      .map((certificate) => certificate.id),
    scheduledTransferAt: context.temporal.selection.transfer.scheduledAt,
    createdAt: boundary.at,
  }));
  const selection = {
    ...institutional.selection,
    stage: "DECLARED" as const,
    declaration,
    entitlements,
  };
  return appendOccurrence({ ...institutional, selection }, boundary, [declaration.id, ...entitlements.map((record) => record.id)]);
};

const transferAuthority = (
  institutional: InstitutionalRuntimeState,
  legislative: LegislativeRuntimeState,
  context: InstitutionalTransitionContext,
  boundary: InstitutionalBoundaryConfiguration,
): InstitutionalTransitionResult => {
  if (institutional.selection.stage !== "DECLARED" || institutional.selection.declaration === null) {
    throw new Error("Authority transfer requires a declared successor entitlement.");
  }
  if (Date.parse(boundary.at) !== Date.parse(context.temporal.selection.transfer.scheduledAt)) {
    throw new Error("Authority transfer does not match its configured instant.");
  }
  const declaration = institutional.selection.declaration;
  const ticket = ticketById(context.temporal.selection, declaration.winningTicketId);
  const officeIds = new Set([
    context.temporal.selection.transfer.headOfficeId,
    context.temporal.selection.transfer.deputyOfficeId,
  ]);
  const outgoing = legislative.activeAssignments.filter((assignment) => officeIds.has(assignment.officeId));
  if (outgoing.length !== officeIds.size) throw new Error("Authority transfer requires both outgoing executive assignments.");
  const incoming = institutional.selection.entitlements.map((entitlement): ActiveOfficeAssignmentState => ({
    id: `${context.temporal.selection.transfer.assignmentIdPrefix}${entitlement.officeId === context.temporal.selection.transfer.headOfficeId ? "head" : "deputy"}`,
    officeId: entitlement.officeId,
    actorId: entitlement.entitledActorId,
    effectiveFrom: boundary.at,
    effectiveUntil: context.temporal.selection.transfer.successorTermEndsAt,
    classification: context.temporal.selection.classification,
  }));
  const activeAssignments = [
    ...legislative.activeAssignments.filter((assignment) => !officeIds.has(assignment.officeId)),
    ...incoming,
  ];
  const priorAdministration = { ...institutional.currentAdministration, effectiveUntil: boundary.at };
  const currentAdministration: AdministrationTermState = {
    id: `${context.temporal.selection.transfer.administrationIdPrefix}${sha256Hex(ticket.id).slice(0, 16)}`,
    headActorId: ticket.headCandidate.actorId,
    deputyActorId: ticket.deputyCandidate.actorId,
    effectiveFrom: boundary.at,
    effectiveUntil: context.temporal.selection.transfer.successorTermEndsAt,
    sourceDeclarationId: declaration.id,
    classification: context.temporal.selection.classification,
  };
  const selection = { ...institutional.selection, stage: "TRANSFERRED" as const, transferredAt: boundary.at };
  const nextInstitutional = appendOccurrence({
    ...institutional,
    selection,
    currentAdministration,
    administrationHistory: [...institutional.administrationHistory, priorAdministration],
  }, boundary, [...outgoing.map((assignment) => assignment.id), ...incoming.map((assignment) => assignment.id)]);
  return {
    institutional: nextInstitutional,
    legislative: { ...legislative, activeAssignments },
    transferredTicket: ticket,
  };
};

export const applyInstitutionalBoundary = (
  institutional: InstitutionalRuntimeState,
  legislative: LegislativeRuntimeState,
  context: InstitutionalTransitionContext,
  boundary: InstitutionalBoundaryConfiguration,
): InstitutionalTransitionResult => {
  assertSelectionActorClosure(context.structure, context.temporal.selection);
  if (institutional.occurrences.some((occurrence) => occurrence.boundaryId === boundary.id)) {
    throw new Error(`Institutional boundary ${boundary.id} has already occurred.`);
  }
  switch (boundary.kind) {
    case "TERM_RESULT_SNAPSHOT":
      return { institutional: snapshotTermResults(institutional, legislative, context, boundary), legislative, transferredTicket: null };
    case "PROCEDURE_EXPIRY": {
      const result = expireProcedure(institutional, legislative, boundary);
      return { ...result, transferredTicket: null };
    }
    case "OUTGOING_ASSIGNMENT_END": {
      const result = endOutgoingAssignments(institutional, legislative, boundary);
      return { ...result, transferredTicket: null };
    }
    case "SUCCESSOR_ASSIGNMENT_BEGIN": {
      const result = beginSuccessorAssignments(institutional, legislative, context, boundary);
      return { ...result, transferredTicket: null };
    }
    case "AFFILIATION_REBUILD": {
      const result = rebuildAffiliations(institutional, legislative, context, boundary);
      return { ...result, transferredTicket: null };
    }
    case "MEMBERSHIP_RECOMPUTE":
      return { institutional: completeMembership(institutional, boundary), legislative, transferredTicket: null };
    case "POPULAR_SELECTION":
      return { institutional: resolvePopularBoundary(institutional, context, boundary), legislative, transferredTicket: null };
    case "RESULT_ATTESTATION":
      return { institutional: attestAndAppoint(institutional, context, boundary), legislative, transferredTicket: null };
    case "DELEGATE_ACTION":
      return { institutional: delegatesAct(institutional, context, boundary), legislative, transferredTicket: null };
    case "COLLEGIATE_DECLARATION":
      return { institutional: declareAndEntitle(institutional, legislative, context, boundary), legislative, transferredTicket: null };
    case "AUTHORITY_TRANSFER":
      return transferAuthority(institutional, legislative, context, boundary);
    case "OBSERVATION_CAPTURE":
    case "MEASUREMENT_CREATED":
    case "MEASUREMENT_RELEASED":
    case "CLAIM_RELEASED":
    case "INFORMATION_DELIVERED":
    case "POPULATION_EXPOSED":
    case "POPULATION_RESPONSE":
      return {
        institutional: appendOccurrence(institutional, boundary, []),
        legislative,
        transferredTicket: null,
      };
  }
};

export const assertInstitutionalRuntimeState = (
  state: InstitutionalRuntimeState,
  temporal: IntegratedTemporalConfiguration,
  topology: StaticSelectionTopology,
  structure: GovernmentStructureDescriptor,
): void => {
  assertSelectionActorClosure(structure, temporal.selection);
  if (
    state.schemaVersion !== temporal.schemaVersion ||
    state.scheduleVersion !== temporal.scheduleVersion ||
    state.parameterHash !== temporal.parameterHash ||
    state.selection.selectionId !== temporal.selection.id
  ) throw new Error("Institutional state contradicts configured temporal authority.");
  const configuredBoundaryIds = new Set(temporal.boundaries.map((boundary) => boundary.id));
  if (
    new Set(state.occurrences.map((occurrence) => occurrence.boundaryId)).size !== state.occurrences.length ||
    state.occurrences.some((occurrence) => !configuredBoundaryIds.has(occurrence.boundaryId)) ||
    state.occurrences.some((occurrence) => !state.calendar.processedBoundaryIds.includes(occurrence.boundaryId)) ||
    state.calendar.processedBoundaryIds.some((id) => !state.occurrences.some((occurrence) => occurrence.boundaryId === id)) ||
    JSON.stringify(state.occurrences.map((occurrence) => occurrence.boundaryId)) !==
      JSON.stringify(state.calendar.processedBoundaryIds)
  ) throw new Error("Institutional occurrence history contradicts processed boundaries.");
  if (topology.sourceArtifactId !== temporal.selection.staticTopologyArtifactId) {
    throw new Error("Institutional selection state references the wrong static topology authority.");
  }
  for (const cycle of state.termCycles) {
    const configured = temporal.assignmentCycles.find((candidate) => candidate.id === cycle.cycleId);
    const expectedSignalGeographies = configured === undefined
      ? []
      : [...new Set(configured.officeIds.map((officeId) => configured.stateGeographyByOfficeId[officeId]))].sort();
    if (
      configured === undefined ||
      cycle.termLabel !== configured.termLabel ||
      cycle.results.length !== configured.officeIds.length ||
      new Set(cycle.results.map((result) => result.officeId)).size !== cycle.results.length ||
      cycle.results.some((result) => !configured.officeIds.includes(result.officeId)) ||
      cycle.results.some((result) => result.stateGeographyId !== configured.stateGeographyByOfficeId[result.officeId]) ||
      cycle.results.some((result) => result.successorAssignmentId.trim().length === 0 || result.causalInputHash.length !== 64) ||
      cycle.results.some((result) => result.outcome === "RETAIN" && result.successorActorId !== result.outgoingActorId) ||
      cycle.results.some((result) => result.outcome === "REPLACE" && result.successorActorId === result.outgoingActorId) ||
      cycle.populationSignals.length !== expectedSignalGeographies.length ||
      new Set(cycle.populationSignals.map((signal) => signal.id)).size !== cycle.populationSignals.length ||
      new Set(cycle.populationSignals.map((signal) => signal.stateGeographyId)).size !== cycle.populationSignals.length
    ) throw new Error(`Institutional assignment cycle ${cycle.cycleId} contradicts its configured authority.`);
    for (const signal of cycle.populationSignals) {
      const expectedId = `${configured.populationSignalIdPrefix}${sha256Hex(`${configured.id}|${signal.stateGeographyId}`).slice(0, 20)}`;
      const signalCausalSuffix =
        `${configured.populationSignalVersion}|${configured.stableKey}|${signal.stateGeographyId}|ROLLOVER_POPULATION`;
      const invalidEntries = signal.entries.some((entry) => {
        const expectedPreference = resolvedTicket(
          temporal.selection,
          entry.cohortId,
          entry.canonicalPreference,
          signalCausalSuffix,
        );
        const expectedTurnout = resolvedTurnout(temporal.selection, entry.turnoutDisposition);
        return (
          entry.residenceGeographyId !== signal.stateGeographyId ||
          !Number.isSafeInteger(entry.eligibleProxyWeight) || entry.eligibleProxyWeight < 0 ||
          !Number.isSafeInteger(entry.participatingWeight) || entry.participatingWeight < 0 ||
          !Number.isSafeInteger(entry.turnoutNumerator) || entry.turnoutNumerator < 0 ||
          !Number.isSafeInteger(entry.turnoutDenominator) || entry.turnoutDenominator <= 0 ||
          entry.effectiveTicketId !== expectedPreference.ticketId ||
          entry.turnoutNumerator !== expectedTurnout.numerator ||
          entry.turnoutDenominator !== expectedTurnout.denominator ||
          entry.readinessClassification !== (
            expectedPreference.fallback || expectedTurnout.fallback ? "FALLBACK_SCAFFOLD" : "POPULATION_STATE"
          ) ||
          entry.participatingWeight !== Math.floor(
            entry.eligibleProxyWeight * entry.turnoutNumerator / entry.turnoutDenominator
          )
        );
      });
      if (
        !expectedSignalGeographies.includes(signal.stateGeographyId) ||
        signal.id !== expectedId ||
        signal.cycleId !== configured.id ||
        signal.asOf !== cycle.frozenAt ||
        signal.signalVersion !== configured.populationSignalVersion ||
        signal.entries.length === 0 ||
        new Set(signal.entries.map((entry) => entry.cohortId)).size !== signal.entries.length ||
        invalidEntries ||
        signal.causalInputHash !== sha256Hex(JSON.stringify(signal.entries)) ||
        signal.signal !== signalFromTermEntries(signal.entries, temporal.selection)
      ) throw new Error(`Institutional rollover Population signal ${signal.id} is invalid.`);
    }
    for (const result of cycle.results) {
      const signal = cycle.populationSignals.find((candidate) => candidate.id === result.populationSignalSnapshotId);
      if (
        signal?.stateGeographyId !== result.stateGeographyId ||
        signal.signal !== result.populationSignal
      ) throw new Error(`Institutional rollover result ${result.officeId} lacks its coherent Population signal.`);
    }
  }
  const latestCompleteCycle = [...state.termCycles]
    .filter((cycle) => cycle.status === "COMPLETE")
    .sort((left, right) => Date.parse(right.frozenAt) - Date.parse(left.frozenAt))[0];
  if (state.currentTermLabel !== (latestCompleteCycle?.termLabel ?? temporal.initialTermLabel)) {
    throw new Error("Institutional current term contradicts completed assignment cycles.");
  }
  if (state.selection.popularResults.length > 0) {
    if (
      state.selection.snapshots.length !== temporal.selection.stateGeographyIds.length ||
      state.selection.popularResults.length !== temporal.selection.stateGeographyIds.length
    ) throw new Error("Institutional popular-result state is incomplete.");
    for (const result of state.selection.popularResults) {
      const ballots = state.selection.ballots.filter((ballot) => result.ballotIds.includes(ballot.id));
      const snapshot = state.selection.snapshots.find((candidate) => candidate.id === result.snapshotId);
      const ticketVoteWeights = Object.fromEntries(temporal.selection.tickets.map((ticket) => [
        ticket.id,
        ballots.filter((ballot) => ballot.ticketId === ticket.id)
          .reduce((total, ballot) => total + ballot.participatingWeight, 0),
      ]));
      const ranked = Object.entries(ticketVoteWeights).sort(
        (left, right) => right[1] - left[1] || left[0].localeCompare(right[0]),
      );
      const winner = ranked.length > 0 && ranked[0][1] > (ranked[1]?.[1] ?? -1) ? ranked[0][0] : null;
      if (
        snapshot?.geographyId !== result.geographyId ||
        ballots.length !== result.ballotIds.length ||
        ballots.some((ballot) => ballot.stateSnapshotId !== result.snapshotId) ||
        ballots.reduce((total, ballot) => total + ballot.eligibleProxyWeight, 0) !== result.totalEligibleProxyWeight ||
        ballots.reduce((total, ballot) => total + ballot.participatingWeight, 0) !== result.totalParticipatingWeight ||
        ballots.filter((ballot) => ballot.ticketId === null)
          .reduce((total, ballot) => total + ballot.participatingWeight, 0) !== result.blankWeight ||
        JSON.stringify(ticketVoteWeights) !== JSON.stringify(result.ticketVoteWeights) ||
        winner !== result.winnerTicketId ||
        result.status !== (winner === null ? "TIE_OR_UNRESOLVED" : "RESOLVED")
      ) throw new Error(`Institutional popular result ${result.id} fails ballot conservation.`);
    }
  }
  if (state.selection.attestations.length > 0) {
    if (state.selection.attestations.length !== temporal.selection.stateGeographyIds.length) {
      throw new Error("Institutional result attestations are incomplete.");
    }
    for (const attestation of state.selection.attestations) {
      const result = state.selection.popularResults.find((candidate) => candidate.id === attestation.resultId);
      if (
        result?.status !== "RESOLVED" ||
        result.geographyId !== attestation.geographyId ||
        result.winnerTicketId !== attestation.winnerTicketId ||
        attestation.timingClassification !== temporal.selection.timingClassification
      ) throw new Error(`Institutional attestation ${attestation.id} contradicts its popular result.`);
    }
  }
  if (state.selection.appointments.length > 0) {
    const expectedUnits = topology.allocations.flatMap((allocation) => allocation.units.map((unit) => ({ allocation, unit })));
    if (state.selection.appointments.length !== expectedUnits.length) {
      throw new Error("Institutional delegate appointments do not cover the static topology.");
    }
    for (const appointment of state.selection.appointments) {
      const expected = expectedUnits.find(({ allocation, unit }) =>
        allocation.id === appointment.allocationId && unit.id === appointment.allocationUnitId);
      const result = state.selection.popularResults.find((candidate) => candidate.id === appointment.sourceResultId);
      const attestation = state.selection.attestations.find((candidate) => candidate.id === appointment.sourceAttestationId);
      if (
        expected === undefined ||
        expected.unit.geographyId !== appointment.geographyId ||
        expected.unit.electorCount !== appointment.electorCount ||
        expected.allocation.method !== appointment.method ||
        expected.unit.electorateProjection !== appointment.electorateProjection ||
        result?.geographyId !== expected.allocation.geographyId ||
        result.winnerTicketId !== appointment.ticketId ||
        attestation?.resultId !== result.id ||
        attestation.winnerTicketId !== appointment.ticketId
      ) throw new Error(`Institutional appointment ${appointment.id} contradicts static or attested authority.`);
    }
  }
  if (state.selection.certificates.length > 0) {
    const appointed = state.selection.appointments.reduce((total, record) => total + record.electorCount, 0);
    for (const role of ["HEAD", "DEPUTY"] as const) {
      const certified = state.selection.certificates
        .filter((certificate) => certificate.officeRole === role)
        .reduce((total, certificate) => total + certificate.voteCount, 0);
      if (certified !== appointed) throw new Error("Countable certificates do not conserve appointed delegate weight.");
    }
    for (const appointment of state.selection.appointments) {
      const ticket = ticketById(temporal.selection, appointment.ticketId);
      const records = state.selection.certificates.filter((certificate) => certificate.appointmentId === appointment.id);
      if (
        records.length !== 2 ||
        !records.some((certificate) => certificate.officeRole === "HEAD" &&
          certificate.candidateActorId === ticket.headCandidate.actorId && certificate.voteCount === appointment.electorCount) ||
        !records.some((certificate) => certificate.officeRole === "DEPUTY" &&
          certificate.candidateActorId === ticket.deputyCandidate.actorId && certificate.voteCount === appointment.electorCount)
      ) throw new Error(`Countable certificates contradict appointment ${appointment.id}.`);
    }
  }
  if (state.selection.declaration !== null) {
    const counted = declareCountableCertificates(state.selection.certificates);
    const declaredTicket = temporal.selection.tickets.find((ticket) =>
      ticket.id === state.selection.declaration!.winningTicketId &&
      ticket.headCandidate.actorId === counted.winningHeadActorId &&
      ticket.deputyCandidate.actorId === counted.winningDeputyActorId);
    if (
      counted.headDenominator !== state.selection.declaration.headDenominator ||
      counted.deputyDenominator !== state.selection.declaration.deputyDenominator ||
      counted.requiredMajority !== state.selection.declaration.requiredMajority ||
      counted.winningHeadActorId !== state.selection.declaration.winningHeadActorId ||
      counted.winningDeputyActorId !== state.selection.declaration.winningDeputyActorId ||
      JSON.stringify(counted.headTallies) !== JSON.stringify(state.selection.declaration.headTallies) ||
      JSON.stringify(counted.deputyTallies) !== JSON.stringify(state.selection.declaration.deputyTallies) ||
      declaredTicket === undefined
    ) throw new Error("Institutional declaration contradicts countable certificates.");
    const expectedEntitlements = declaredTicket === undefined ? [] : [
      { officeId: temporal.selection.transfer.headOfficeId, actorId: declaredTicket.headCandidate.actorId },
      { officeId: temporal.selection.transfer.deputyOfficeId, actorId: declaredTicket.deputyCandidate.actorId },
    ];
    if (
      state.selection.entitlements.length !== 2 ||
      state.selection.entitlements.some((entitlement) =>
        entitlement.sourceDeclarationId !== state.selection.declaration!.id ||
        entitlement.scheduledTransferAt !== temporal.selection.transfer.scheduledAt ||
        !expectedEntitlements.some((expected) =>
          expected.officeId === entitlement.officeId && expected.actorId === entitlement.entitledActorId))
    ) throw new Error("Institutional successor entitlements contradict the declaration.");
  }
};

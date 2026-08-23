import { sha256Hex } from "../configuration/sha256";
import type {
  ConfigurationIdentity,
  GovernmentStructureDescriptor,
  LegislativeChamberRuleConfiguration,
  LegislativeRuntimeSeed,
} from "../configuration/types";
import {
  applyActorVoteResolution,
  createPoliticalState,
  decidePoliticalActorVote,
  refreshPoliticalSupport,
  type CanonicalVoteChoice,
  type EvaluatedProposalVersion,
  type LegislativeDecisionKind,
  type PoliticalState,
} from "./political";
import { resolveConfiguredLegislativeThreshold } from "./legislative-procedure";

export type LegislativeRuntimeStage =
  | "DRAFT_AGENDA"
  | "SPONSOR_SOUGHT"
  | "INTRODUCED_IN_ORIGIN"
  | "ORIGIN_CONSIDERATION_GATE"
  | "ORIGIN_AMENDMENT"
  | "ORIGIN_FINAL_ROLL_CALL"
  | "OTHER_CHAMBER_CONSIDERATION_GATE"
  | "OTHER_CHAMBER_AMENDMENT"
  | "OTHER_CHAMBER_FINAL_ROLL_CALL"
  | "TEXT_EXCHANGE"
  | "IDENTICAL_TEXT"
  | "PRESENTED"
  | "SIGNED"
  | "VETOED"
  | "NO_SIGNATURE_PENDING"
  | "ENACTED"
  | "FAILED"
  | "EXPIRED_AT_END_OF_CONGRESS";

export interface ProposalVersion {
  readonly id: string;
  readonly proposalId: string;
  readonly version: number;
  readonly dimensions: Readonly<Record<string, number>>;
  readonly authorizationProvisions: readonly string[];
  readonly appropriation: { readonly amount: number; readonly purpose: string };
  readonly textHash: string;
  readonly createdBy: "AGENDA" | "AGENDA_REVISION" | "ADOPTED_AMENDMENT" | "TEXT_EXCHANGE";
  readonly previousVersion: number | null;
}

export interface LegislativeAgenda {
  readonly proposalId: string;
  readonly title: string;
  readonly versions: readonly ProposalVersion[];
  readonly currentVersion: number;
}

export interface SponsorshipState {
  readonly status: "NOT_SOUGHT" | "SOUGHT" | "ACCEPTED" | "INTRODUCED";
  readonly actorId: string | null;
  readonly officeId: string | null;
  readonly assignmentId: string | null;
  readonly proposalVersion: number | null;
}

export interface RecordedLegislativeVote {
  readonly opportunityId: string;
  readonly chamberId: string;
  readonly officeId: string;
  readonly assignmentId: string;
  readonly actorId: string;
  readonly proposalId: string;
  readonly proposalVersion: number;
  readonly kind: LegislativeDecisionKind;
  readonly choice: CanonicalVoteChoice;
  readonly statedReason: string;
  readonly tieBreaker: boolean;
}

export interface VoteTally {
  readonly eligibleMembership: number;
  readonly presentForQuorum: number;
  readonly yea: number;
  readonly nay: number;
  readonly present: number;
  readonly requiredForQuorum: number;
  readonly requiredYea: number;
  readonly quorumSatisfied: boolean;
  readonly passed: boolean;
}

export interface VoteOpportunity {
  readonly id: string;
  readonly chamberId: string;
  readonly proposalVersion: number;
  readonly kind: LegislativeDecisionKind;
  readonly votes: readonly RecordedLegislativeVote[];
  readonly tally: VoteTally;
  readonly result: "PASSED" | "FAILED" | "TIE_BREAK_PENDING";
}

export interface ConsiderationGateState {
  readonly chamberId: string;
  readonly status: "UNRESOLVED" | "OPEN" | "BLOCKED";
  readonly signalCount: number;
}

export interface AmendmentRecord {
  readonly id: string;
  readonly chamberId: string;
  readonly baseVersion: number;
  readonly proposedDimensions: Readonly<Record<string, number>>;
  readonly status: "PROPOSED" | "ADOPTED" | "REJECTED";
  readonly resultingVersion: number | null;
  readonly voteOpportunityId: string | null;
}

export interface PresentmentState {
  readonly proposalVersion: number;
  readonly executiveOfficeId: string;
  readonly executiveActorId: string | null;
  readonly executiveAssignmentId: string | null;
  readonly action: "NONE" | "SIGNED" | "VETOED" | "WITHHELD";
  readonly returnPrevented: boolean | null;
}

export interface EnactedLegislativeSource {
  readonly id: string;
  readonly sourceProposalId: string;
  readonly sourceProposalVersion: number;
  readonly textHash: string;
  readonly authorizationProvisions: readonly string[];
  readonly appropriation: { readonly amount: number; readonly purpose: string };
  readonly enactmentRoute: "SIGNATURE" | "NO_SIGNATURE" | "VETO_OVERRIDE";
}

export interface LegislativeProcedureState {
  readonly stage: LegislativeRuntimeStage;
  readonly currentChamberId: string | null;
  readonly currentProposalVersion: number;
  readonly sponsorship: SponsorshipState;
  readonly gates: readonly ConsiderationGateState[];
  readonly amendments: readonly AmendmentRecord[];
  readonly voteOpportunities: readonly VoteOpportunity[];
  readonly approvedVersionByChamber: Readonly<Record<string, number>>;
  readonly extendedDebateThreatChamberIds: readonly string[];
  readonly textExchangeCount: number;
  readonly presentment: PresentmentState | null;
  readonly overridePassedChamberIds: readonly string[];
  readonly terminalDisposition: "ENACTED" | "FAILED" | "EXPIRED_AT_END_OF_CONGRESS" | null;
  readonly failureReason: string | null;
}

export interface LegislativeRuntimeState {
  readonly schemaVersion: number;
  readonly configuration: ConfigurationIdentity;
  readonly agenda: LegislativeAgenda;
  readonly political: PoliticalState;
  readonly procedure: LegislativeProcedureState;
  readonly enactedLegalSources: readonly EnactedLegislativeSource[];
}

export interface LegislativeRuntimeContext {
  readonly structure: GovernmentStructureDescriptor;
  readonly seed: LegislativeRuntimeSeed;
}

const versionTextHash = (
  proposalId: string,
  version: number,
  dimensions: Readonly<Record<string, number>>,
  authorizationProvisions: readonly string[],
  appropriation: { readonly amount: number; readonly purpose: string },
): string =>
  sha256Hex(
    JSON.stringify({
      appropriation,
      authorizationProvisions,
      dimensions: Object.fromEntries(Object.entries(dimensions).sort(([left], [right]) => left.localeCompare(right))),
      proposalId,
      version,
    }),
  );

const makeVersion = (
  seed: LegislativeRuntimeSeed,
  version: number,
  dimensions: Readonly<Record<string, number>>,
  createdBy: ProposalVersion["createdBy"],
  previousVersion: number | null,
): ProposalVersion => ({
  id: `${seed.recordIds.proposalVersionPrefix}${seed.proposal.id}:${version}`,
  proposalId: seed.proposal.id,
  version,
  dimensions,
  authorizationProvisions: [...seed.proposal.authorizationProvisions],
  appropriation: { ...seed.proposal.appropriation },
  textHash: versionTextHash(
    seed.proposal.id,
    version,
    dimensions,
    seed.proposal.authorizationProvisions,
    seed.proposal.appropriation,
  ),
  createdBy,
  previousVersion,
});

const assertDimensions = (
  seed: LegislativeRuntimeSeed,
  dimensions: Readonly<Record<string, number>>,
): void => {
  const configured = new Set(seed.dimensions.map((dimension) => dimension.id));
  if (Object.keys(dimensions).length !== configured.size) throw new Error("Proposal must define every configured dimension exactly once.");
  for (const dimension of seed.dimensions) {
    const value = dimensions[dimension.id];
    if (!Number.isFinite(value) || value < dimension.minimum || value > dimension.maximum) {
      throw new Error(`Proposal dimension ${dimension.id} is outside its configured range.`);
    }
  }
  if (Object.keys(dimensions).some((id) => !configured.has(id))) throw new Error("Proposal contains an unknown dimension.");
};

const evaluated = (state: LegislativeRuntimeState, version = state.agenda.currentVersion): EvaluatedProposalVersion => {
  const record = state.agenda.versions.find((candidate) => candidate.version === version);
  if (record === undefined) throw new Error(`Unknown proposal version ${version}.`);
  return { proposalId: state.agenda.proposalId, version, dimensions: record.dimensions };
};

export const createLegislativeRuntimeState = (
  configuration: ConfigurationIdentity,
  context: LegislativeRuntimeContext,
): LegislativeRuntimeState => {
  assertDimensions(context.seed, context.seed.proposal.initialDimensions);
  const initialVersion = makeVersion(context.seed, 1, context.seed.proposal.initialDimensions, "AGENDA", null);
  let political = createPoliticalState(context.structure, context.seed);
  political = refreshPoliticalSupport(political, {
    proposalId: context.seed.proposal.id,
    version: initialVersion.version,
    dimensions: initialVersion.dimensions,
  });
  return {
    schemaVersion: context.seed.schemaVersion,
    configuration: { ...configuration },
    agenda: {
      proposalId: context.seed.proposal.id,
      title: context.seed.proposal.title,
      versions: [initialVersion],
      currentVersion: initialVersion.version,
    },
    political,
    procedure: {
      stage: "DRAFT_AGENDA",
      currentChamberId: null,
      currentProposalVersion: initialVersion.version,
      sponsorship: {
        status: "NOT_SOUGHT",
        actorId: null,
        officeId: null,
        assignmentId: null,
        proposalVersion: null,
      },
      gates: context.seed.procedure.chamberRules.map((rule) => ({
        chamberId: rule.chamberId,
        status: "UNRESOLVED",
        signalCount: 0,
      })),
      amendments: [],
      voteOpportunities: [],
      approvedVersionByChamber: {},
      extendedDebateThreatChamberIds: [],
      textExchangeCount: 0,
      presentment: null,
      overridePassedChamberIds: [],
      terminalDisposition: null,
      failureReason: null,
    },
    enactedLegalSources: [],
  };
};

const withCurrentProposal = (
  state: LegislativeRuntimeState,
  agenda: LegislativeAgenda,
  procedure: LegislativeProcedureState = state.procedure,
): LegislativeRuntimeState => {
  const proposal = evaluated({ ...state, agenda }, agenda.currentVersion);
  return {
    ...state,
    agenda,
    procedure: { ...procedure, currentProposalVersion: agenda.currentVersion },
    political: refreshPoliticalSupport(state.political, proposal),
  };
};

export const reviseLegislativeAgenda = (
  state: LegislativeRuntimeState,
  context: LegislativeRuntimeContext,
  dimensions: Readonly<Record<string, number>>,
): LegislativeRuntimeState => {
  if (state.procedure.stage !== "DRAFT_AGENDA" && state.procedure.stage !== "SPONSOR_SOUGHT") {
    throw new Error("Agenda terms are locked after introduction.");
  }
  assertDimensions(context.seed, dimensions);
  const nextNumber = state.agenda.versions.length + 1;
  const version = makeVersion(context.seed, nextNumber, dimensions, "AGENDA_REVISION", state.agenda.currentVersion);
  return withCurrentProposal(state, {
    ...state.agenda,
    versions: [...state.agenda.versions, version],
    currentVersion: version.version,
  }, {
    ...state.procedure,
    sponsorship: {
      status: "NOT_SOUGHT",
      actorId: null,
      officeId: null,
      assignmentId: null,
      proposalVersion: null,
    },
  });
};

export const beginSponsorSearch = (state: LegislativeRuntimeState): LegislativeRuntimeState => {
  if (state.procedure.stage !== "DRAFT_AGENDA" && state.procedure.stage !== "SPONSOR_SOUGHT") {
    throw new Error("Sponsor search is not available at this stage.");
  }
  return {
    ...state,
    procedure: {
      ...state.procedure,
      stage: "SPONSOR_SOUGHT",
      sponsorship: { ...state.procedure.sponsorship, status: "SOUGHT" },
    },
  };
};

const currentAssignmentForActor = (
  context: LegislativeRuntimeContext,
  actorId: string,
  requiredChamberId?: string,
) => {
  const assignment = context.structure.assignments.find(
    (candidate) => candidate.actorId === actorId && candidate.currentAtScenarioStart,
  );
  const office = assignment === undefined
    ? undefined
    : context.structure.offices.find((candidate) => candidate.id === assignment.officeId);
  if (
    assignment === undefined ||
    office === undefined ||
    office.kind !== "LEGISLATIVE_MEMBER" ||
    (requiredChamberId !== undefined && office.chamberId !== requiredChamberId)
  ) {
    throw new Error("Sponsorship requires a current eligible legislative office assignment.");
  }
  return { assignment, office };
};

export const seekMemberSponsorship = (
  state: LegislativeRuntimeState,
  context: LegislativeRuntimeContext,
  actorId: string,
): LegislativeRuntimeState => {
  if (state.procedure.stage !== "SPONSOR_SOUGHT") throw new Error("The agenda is not seeking sponsorship.");
  const { assignment, office } = currentAssignmentForActor(context, actorId, context.seed.procedure.originChamberId);
  const actor = state.political.actors.find((candidate) => candidate.actorId === actorId);
  if (actor === undefined) throw new Error("Sponsoring actor has no political state.");
  const sponsorshipDecision = decidePoliticalActorVote(
    state.political,
    context.seed,
    actorId,
    evaluated(state),
    `sponsorship:${state.agenda.proposalId}:${state.agenda.currentVersion}:${actorId}`,
    "SPONSORSHIP",
  );
  if (sponsorshipDecision.choice !== "YEA") {
    return state;
  }
  return {
    ...state,
    procedure: {
      ...state.procedure,
      sponsorship: {
        status: "ACCEPTED",
        actorId,
        officeId: office.id,
        assignmentId: assignment.id,
        proposalVersion: state.agenda.currentVersion,
      },
    },
  };
};

export const introduceSponsoredProposal = (
  state: LegislativeRuntimeState,
  context: LegislativeRuntimeContext,
  actorId: string,
  assignmentId: string,
): LegislativeRuntimeState => {
  const sponsorship = state.procedure.sponsorship;
  if (
    state.procedure.stage !== "SPONSOR_SOUGHT" ||
    sponsorship.status !== "ACCEPTED" ||
    sponsorship.actorId !== actorId ||
    sponsorship.assignmentId !== assignmentId ||
    sponsorship.proposalVersion !== state.agenda.currentVersion
  ) {
    throw new Error("Only the accepted sponsoring member may introduce this exact proposal version.");
  }
  currentAssignmentForActor(context, actorId, context.seed.procedure.originChamberId);
  return {
    ...state,
    procedure: {
      ...state.procedure,
      stage: "INTRODUCED_IN_ORIGIN",
      currentChamberId: context.seed.procedure.originChamberId,
      sponsorship: { ...sponsorship, status: "INTRODUCED" },
    },
  };
};

export const advanceIntroducedProposalToGate = (
  state: LegislativeRuntimeState,
  context: LegislativeRuntimeContext,
): LegislativeRuntimeState => {
  if (state.procedure.stage !== "INTRODUCED_IN_ORIGIN") throw new Error("Proposal is not newly introduced.");
  return {
    ...state,
    procedure: {
      ...state.procedure,
      stage: "ORIGIN_CONSIDERATION_GATE",
      currentChamberId: context.seed.procedure.originChamberId,
    },
  };
};

const considerationSignals = (
  state: LegislativeRuntimeState,
  chamberId: string,
): number => {
  const sponsorshipSignal =
    state.procedure.sponsorship.status === "INTRODUCED" &&
    state.political.organizations.some((organization) =>
      organization.memberships.some(
        (membership) =>
          membership.actorId === state.procedure.sponsorship.actorId && membership.chamberId === chamberId,
      ),
    )
      ? 1
      : 0;
  const organizationSignals = state.political.organizations.filter(
    (organization) =>
      organization.negotiationPosture === "OPEN" ||
      organization.coordinationActions.some(
        (action) => action.chamberId === chamberId && action.proposalVersion === state.agenda.currentVersion,
      ),
  ).length;
  return sponsorshipSignal + organizationSignals;
};

export const resolveConsiderationGate = (
  state: LegislativeRuntimeState,
  context: LegislativeRuntimeContext,
): LegislativeRuntimeState => {
  const stage = state.procedure.stage;
  const origin = stage === "ORIGIN_CONSIDERATION_GATE";
  if (!origin && stage !== "OTHER_CHAMBER_CONSIDERATION_GATE") throw new Error("No consideration gate is pending.");
  const chamberId = origin ? context.seed.procedure.originChamberId : context.seed.procedure.otherChamberId;
  const signals = considerationSignals(state, chamberId);
  const required = context.seed.procedure.considerationGateMinimumSignals[chamberId];
  if (!Number.isInteger(required) || required < 0) throw new Error("Invalid consideration-gate configuration.");
  const opened = signals >= required;
  const gates = state.procedure.gates.map((gate) =>
    gate.chamberId === chamberId
      ? { ...gate, status: opened ? ("OPEN" as const) : ("BLOCKED" as const), signalCount: signals }
      : gate,
  );
  return {
    ...state,
    procedure: {
      ...state.procedure,
      gates,
      currentChamberId: chamberId,
      stage: opened ? (origin ? "ORIGIN_AMENDMENT" : "OTHER_CHAMBER_AMENDMENT") : "FAILED",
      terminalDisposition: opened ? null : "FAILED",
      failureReason: opened ? null : `Consideration gate blocked in ${chamberId}.`,
    },
  };
};

const amendmentStageFor = (state: LegislativeRuntimeState, context: LegislativeRuntimeContext): string =>
  state.procedure.currentChamberId === context.seed.procedure.originChamberId
    ? "ORIGIN_AMENDMENT"
    : "OTHER_CHAMBER_AMENDMENT";

export const requestFormalAmendment = (
  state: LegislativeRuntimeState,
  context: LegislativeRuntimeContext,
  changes: Readonly<Record<string, number>>,
): LegislativeRuntimeState => {
  if (state.procedure.stage !== amendmentStageFor(state, context)) throw new Error("No amendment round is open.");
  const chamberId = state.procedure.currentChamberId;
  if (chamberId === null) throw new Error("Amendment has no chamber.");
  const priorRounds = state.procedure.amendments.filter((record) => record.chamberId === chamberId).length;
  if (priorRounds >= context.seed.procedure.maximumAmendmentRoundsPerChamber) {
    throw new Error("Configured amendment-round limit reached.");
  }
  const base = evaluated(state);
  const proposedDimensions = { ...base.dimensions, ...changes };
  assertDimensions(context.seed, proposedDimensions);
  return {
    ...state,
    procedure: {
      ...state.procedure,
      amendments: [
        ...state.procedure.amendments,
        {
          id: `${context.seed.recordIds.amendmentPrefix}${chamberId}:${state.procedure.amendments.length + 1}`,
          chamberId,
          baseVersion: base.version,
          proposedDimensions,
          status: "PROPOSED",
          resultingVersion: null,
          voteOpportunityId: null,
        },
      ],
    },
  };
};

const chamberRule = (context: LegislativeRuntimeContext, chamberId: string): LegislativeChamberRuleConfiguration => {
  const rule = context.seed.procedure.chamberRules.find((candidate) => candidate.chamberId === chamberId);
  if (rule === undefined) throw new Error(`No configured rule for chamber ${chamberId}.`);
  return rule;
};

const eligibleAssignments = (context: LegislativeRuntimeContext, chamberId: string) => {
  const officeIds = new Set(
    context.structure.offices.filter((office) => office.chamberId === chamberId).map((office) => office.id),
  );
  return context.structure.assignments.filter(
    (assignment) => assignment.currentAtScenarioStart && officeIds.has(assignment.officeId),
  );
};

const tallyVotes = (
  votes: readonly RecordedLegislativeVote[],
  eligibleMembership: number,
  rule: LegislativeChamberRuleConfiguration,
  kind: LegislativeDecisionKind,
): VoteTally => {
  const yea = votes.filter((vote) => vote.choice === "YEA").length;
  const nay = votes.filter((vote) => vote.choice === "NAY").length;
  const present = votes.filter((vote) => vote.choice === "PRESENT").length;
  const presentForQuorum = votes.length;
  const requiredForQuorum = resolveConfiguredLegislativeThreshold(eligibleMembership, rule.quorum);
  const ratio =
    kind === "CLOTURE"
      ? rule.extendedDebate.clotureThreshold
      : kind === "OVERRIDE"
        ? rule.overridePassage
        : kind === "AMENDMENT"
          ? rule.amendmentPassage
          : rule.ordinaryPassage.threshold;
  if (ratio === null) throw new Error("This chamber has no cloture rule.");
  const basis = kind === "FINAL_PASSAGE" || kind === "AMENDMENT" ? yea + nay : eligibleMembership;
  const requiredYea = resolveConfiguredLegislativeThreshold(basis, ratio);
  const quorumSatisfied = presentForQuorum >= requiredForQuorum;
  const tieFailure = kind === "FINAL_PASSAGE" && rule.ordinaryPassage.tieFails && yea === nay;
  return {
    eligibleMembership,
    presentForQuorum,
    yea,
    nay,
    present,
    requiredForQuorum,
    requiredYea,
    quorumSatisfied,
    passed: quorumSatisfied && yea >= requiredYea && !tieFailure,
  };
};

const resolveActorVotes = (
  state: LegislativeRuntimeState,
  context: LegislativeRuntimeContext,
  chamberId: string,
  proposal: EvaluatedProposalVersion,
  kind: LegislativeDecisionKind,
  sequence: number,
): { readonly political: PoliticalState; readonly opportunity: VoteOpportunity } => {
  const assignments = eligibleAssignments(context, chamberId);
  const id = `${context.seed.recordIds.voteOpportunityPrefix}${kind}:${chamberId}:${sequence}`;
  let political = state.political;
  const votes: RecordedLegislativeVote[] = [];
  for (const assignment of assignments) {
    const resolution = decidePoliticalActorVote(political, context.seed, assignment.actorId, proposal, id, kind);
    political = applyActorVoteResolution(political, resolution);
    votes.push({
      opportunityId: id,
      chamberId,
      officeId: assignment.officeId,
      assignmentId: assignment.id,
      actorId: assignment.actorId,
      proposalId: proposal.proposalId,
      proposalVersion: proposal.version,
      kind,
      choice: resolution.choice,
      statedReason: resolution.reason,
      tieBreaker: false,
    });
  }
  const tally = tallyVotes(votes, assignments.length, chamberRule(context, chamberId), kind);
  return {
    political,
    opportunity: { id, chamberId, proposalVersion: proposal.version, kind, votes, tally, result: tally.passed ? "PASSED" : "FAILED" },
  };
};

export const resolveFormalAmendment = (
  state: LegislativeRuntimeState,
  context: LegislativeRuntimeContext,
): LegislativeRuntimeState => {
  const pending = state.procedure.amendments.find((record) => record.status === "PROPOSED");
  if (pending === undefined || pending.chamberId !== state.procedure.currentChamberId) {
    throw new Error("No formal amendment proposal is pending in the current chamber.");
  }
  const candidateNumber = state.agenda.versions.length + 1;
  const candidate = makeVersion(context.seed, candidateNumber, pending.proposedDimensions, "ADOPTED_AMENDMENT", pending.baseVersion);
  const result = resolveActorVotes(
    state,
    context,
    pending.chamberId,
    { proposalId: candidate.proposalId, version: candidate.version, dimensions: candidate.dimensions },
    "AMENDMENT",
    state.procedure.voteOpportunities.length + 1,
  );
  const adopted = result.opportunity.tally.passed;
  const agenda = adopted
    ? { ...state.agenda, versions: [...state.agenda.versions, candidate], currentVersion: candidate.version }
    : state.agenda;
  const nextStage = pending.chamberId === context.seed.procedure.originChamberId
    ? "ORIGIN_FINAL_ROLL_CALL"
    : "OTHER_CHAMBER_FINAL_ROLL_CALL";
  return withCurrentProposal(
    { ...state, political: result.political },
    agenda,
    {
      ...state.procedure,
      stage: nextStage,
      amendments: state.procedure.amendments.map((record) =>
        record.id === pending.id
          ? {
              ...record,
              status: adopted ? ("ADOPTED" as const) : ("REJECTED" as const),
              resultingVersion: adopted ? candidate.version : null,
              voteOpportunityId: result.opportunity.id,
            }
          : record,
      ),
      voteOpportunities: [...state.procedure.voteOpportunities, result.opportunity],
    },
  );
};

export const closeAmendmentRound = (
  state: LegislativeRuntimeState,
  context: LegislativeRuntimeContext,
): LegislativeRuntimeState => {
  if (state.procedure.stage !== amendmentStageFor(state, context)) throw new Error("No amendment round is open.");
  const pending = state.procedure.amendments.some((record) => record.status === "PROPOSED");
  if (pending) throw new Error("A formal amendment must be resolved before advancing.");
  const origin = state.procedure.currentChamberId === context.seed.procedure.originChamberId;
  return {
    ...state,
    procedure: {
      ...state.procedure,
      stage: origin ? "ORIGIN_FINAL_ROLL_CALL" : "OTHER_CHAMBER_FINAL_ROLL_CALL",
    },
  };
};

export const recordExtendedDebateThreat = (
  state: LegislativeRuntimeState,
  context: LegislativeRuntimeContext,
  actorId: string,
): LegislativeRuntimeState => {
  const chamberId = state.procedure.currentChamberId;
  if (chamberId === null || !state.procedure.stage.endsWith("FINAL_ROLL_CALL")) {
    throw new Error("Extended debate may only be threatened before a final roll call.");
  }
  if (!chamberRule(context, chamberId).extendedDebate.available) throw new Error("Extended debate is not configured here.");
  currentAssignmentForActor(context, actorId, chamberId);
  if (state.procedure.extendedDebateThreatChamberIds.includes(chamberId)) return state;
  return {
    ...state,
    procedure: {
      ...state.procedure,
      extendedDebateThreatChamberIds: [...state.procedure.extendedDebateThreatChamberIds, chamberId],
    },
  };
};

const terminalFailure = (state: LegislativeRuntimeState, reason: string): LegislativeRuntimeState => ({
  ...state,
  procedure: {
    ...state.procedure,
    stage: "FAILED",
    terminalDisposition: "FAILED",
    failureReason: reason,
  },
});

const advanceAfterPassedRollCall = (
  state: LegislativeRuntimeState,
  context: LegislativeRuntimeContext,
  chamberId: string,
  version: number,
): LegislativeRuntimeState => {
  const approvedVersionByChamber = { ...state.procedure.approvedVersionByChamber, [chamberId]: version };
  if (chamberId === context.seed.procedure.originChamberId) {
    return {
      ...state,
      procedure: {
        ...state.procedure,
        approvedVersionByChamber,
        currentChamberId: context.seed.procedure.otherChamberId,
        stage: "OTHER_CHAMBER_CONSIDERATION_GATE",
      },
    };
  }
  const originVersion = approvedVersionByChamber[context.seed.procedure.originChamberId];
  return {
    ...state,
    procedure: {
      ...state.procedure,
      approvedVersionByChamber,
      currentChamberId: null,
      stage: originVersion === version ? "IDENTICAL_TEXT" : "TEXT_EXCHANGE",
    },
  };
};

export const resolveFinalRollCall = (
  state: LegislativeRuntimeState,
  context: LegislativeRuntimeContext,
): LegislativeRuntimeState => {
  if (
    state.procedure.stage !== "ORIGIN_FINAL_ROLL_CALL" &&
    state.procedure.stage !== "OTHER_CHAMBER_FINAL_ROLL_CALL"
  ) throw new Error("No final roll call is pending.");
  const chamberId = state.procedure.currentChamberId;
  if (chamberId === null) throw new Error("Final roll call has no chamber.");
  let next = state;
  if (state.procedure.extendedDebateThreatChamberIds.includes(chamberId)) {
    const cloture = resolveActorVotes(
      next,
      context,
      chamberId,
      evaluated(next),
      "CLOTURE",
      next.procedure.voteOpportunities.length + 1,
    );
    next = {
      ...next,
      political: cloture.political,
      procedure: {
        ...next.procedure,
        voteOpportunities: [...next.procedure.voteOpportunities, cloture.opportunity],
      },
    };
    if (!cloture.opportunity.tally.passed) return terminalFailure(next, `Cloture failed in ${chamberId}.`);
  }
  const passage = resolveActorVotes(
    next,
    context,
    chamberId,
    evaluated(next),
    "FINAL_PASSAGE",
    next.procedure.voteOpportunities.length + 1,
  );
  const rule = chamberRule(context, chamberId);
  const tied = passage.opportunity.tally.yea === passage.opportunity.tally.nay;
  const tiePending = tied && rule.tieBreakerOfficeId !== null && passage.opportunity.tally.quorumSatisfied;
  const opportunity = tiePending ? { ...passage.opportunity, result: "TIE_BREAK_PENDING" as const } : passage.opportunity;
  next = {
    ...next,
    political: passage.political,
    procedure: {
      ...next.procedure,
      voteOpportunities: [...next.procedure.voteOpportunities, opportunity],
    },
  };
  if (tiePending) return next;
  if (!opportunity.tally.passed) return terminalFailure(next, `Final passage failed in ${chamberId}.`);
  return advanceAfterPassedRollCall(next, context, chamberId, opportunity.proposalVersion);
};

export const castConfiguredTieBreakerVote = (
  state: LegislativeRuntimeState,
  context: LegislativeRuntimeContext,
  actorId: string,
  assignmentId: string,
  choice: "YEA" | "NAY",
): LegislativeRuntimeState => {
  const opportunity = state.procedure.voteOpportunities.at(-1);
  if (opportunity?.result !== "TIE_BREAK_PENDING") throw new Error("No tie-break vote is pending.");
  const rule = chamberRule(context, opportunity.chamberId);
  const assignment = context.structure.assignments.find(
    (candidate) => candidate.id === assignmentId && candidate.actorId === actorId && candidate.currentAtScenarioStart,
  );
  if (assignment === undefined || assignment.officeId !== rule.tieBreakerOfficeId) {
    throw new Error("Tie-break vote requires the configured office's current actor assignment.");
  }
  const vote: RecordedLegislativeVote = {
    opportunityId: opportunity.id,
    chamberId: opportunity.chamberId,
    officeId: assignment.officeId,
    assignmentId,
    actorId,
    proposalId: state.agenda.proposalId,
    proposalVersion: opportunity.proposalVersion,
    kind: "FINAL_PASSAGE",
    choice,
    statedReason: "configured executive-deputy tie decision",
    tieBreaker: true,
  };
  const votes = [...opportunity.votes, vote];
  const tally: VoteTally = {
    ...opportunity.tally,
    yea: opportunity.tally.yea + (choice === "YEA" ? 1 : 0),
    nay: opportunity.tally.nay + (choice === "NAY" ? 1 : 0),
    passed: choice === "YEA",
  };
  const resolved: VoteOpportunity = { ...opportunity, votes, tally, result: choice === "YEA" ? "PASSED" : "FAILED" };
  const next = {
    ...state,
    procedure: {
      ...state.procedure,
      voteOpportunities: state.procedure.voteOpportunities.map((candidate) =>
        candidate.id === opportunity.id ? resolved : candidate,
      ),
    },
  };
  return choice === "YEA"
    ? advanceAfterPassedRollCall(next, context, opportunity.chamberId, opportunity.proposalVersion)
    : terminalFailure(next, `Tie-break rejected final passage in ${opportunity.chamberId}.`);
};

export const considerTextExchange = (
  state: LegislativeRuntimeState,
  context: LegislativeRuntimeContext,
  chamberId: string,
  proposedVersion: number,
): LegislativeRuntimeState => {
  if (state.procedure.stage !== "TEXT_EXCHANGE") throw new Error("No bounded text exchange is pending.");
  if (state.procedure.textExchangeCount >= context.seed.procedure.maximumTextExchanges) {
    return terminalFailure(state, "Text-exchange limit exhausted without identical passage.");
  }
  const proposal = evaluated(state, proposedVersion);
  const result = resolveActorVotes(
    state,
    context,
    chamberId,
    proposal,
    "FINAL_PASSAGE",
    state.procedure.voteOpportunities.length + 1,
  );
  let next: LegislativeRuntimeState = {
    ...state,
    political: result.political,
    procedure: {
      ...state.procedure,
      textExchangeCount: state.procedure.textExchangeCount + 1,
      voteOpportunities: [...state.procedure.voteOpportunities, result.opportunity],
    },
  };
  if (!result.opportunity.tally.passed) return terminalFailure(next, `Text exchange failed in ${chamberId}.`);
  const approvals = { ...next.procedure.approvedVersionByChamber, [chamberId]: proposedVersion };
  const matches =
    approvals[context.seed.procedure.originChamberId] === approvals[context.seed.procedure.otherChamberId];
  next = {
    ...next,
    procedure: {
      ...next.procedure,
      approvedVersionByChamber: approvals,
      currentProposalVersion: proposedVersion,
      stage: matches ? "IDENTICAL_TEXT" : "TEXT_EXCHANGE",
    },
  };
  if (!matches && next.procedure.textExchangeCount >= context.seed.procedure.maximumTextExchanges) {
    return terminalFailure(next, "Text-exchange limit exhausted without identical passage.");
  }
  return next;
};

export const presentIdenticalText = (
  state: LegislativeRuntimeState,
  context: LegislativeRuntimeContext,
): LegislativeRuntimeState => {
  if (state.procedure.stage !== "IDENTICAL_TEXT") throw new Error("Only identical approved text may be presented.");
  const origin = state.procedure.approvedVersionByChamber[context.seed.procedure.originChamberId];
  const other = state.procedure.approvedVersionByChamber[context.seed.procedure.otherChamberId];
  if (origin === undefined || origin !== other) throw new Error("Chambers have not approved identical text.");
  return {
    ...state,
    procedure: {
      ...state.procedure,
      stage: "PRESENTED",
      presentment: {
        proposalVersion: origin,
        executiveOfficeId: context.seed.executive.headOfficeId,
        executiveActorId: null,
        executiveAssignmentId: null,
        action: "NONE",
        returnPrevented: null,
      },
    },
  };
};

const enact = (
  state: LegislativeRuntimeState,
  context: LegislativeRuntimeContext,
  route: EnactedLegislativeSource["enactmentRoute"],
): LegislativeRuntimeState => {
  const presentment = state.procedure.presentment;
  if (presentment === null) throw new Error("Enactment requires presentment state.");
  const version = state.agenda.versions.find((candidate) => candidate.version === presentment.proposalVersion);
  if (version === undefined) throw new Error("Presented proposal version does not exist.");
  const source: EnactedLegislativeSource = {
    id: `${context.seed.recordIds.lawPrefix}${state.agenda.proposalId}:v${version.version}`,
    sourceProposalId: state.agenda.proposalId,
    sourceProposalVersion: version.version,
    textHash: version.textHash,
    authorizationProvisions: [...version.authorizationProvisions],
    appropriation: { ...version.appropriation },
    enactmentRoute: route,
  };
  return {
    ...state,
    enactedLegalSources: [...state.enactedLegalSources, source],
    procedure: {
      ...state.procedure,
      stage: "ENACTED",
      terminalDisposition: "ENACTED",
      failureReason: null,
    },
  };
};

export const resolveExecutivePresentmentAction = (
  state: LegislativeRuntimeState,
  context: LegislativeRuntimeContext,
  actorId: string,
  assignmentId: string,
  action: "SIGN" | "VETO" | "WITHHOLD",
): LegislativeRuntimeState => {
  if (state.procedure.stage !== "PRESENTED" || state.procedure.presentment === null) {
    throw new Error("Executive action requires valid presentment.");
  }
  const assignment = context.structure.assignments.find(
    (candidate) => candidate.id === assignmentId && candidate.actorId === actorId && candidate.currentAtScenarioStart,
  );
  if (assignment === undefined || assignment.officeId !== context.seed.executive.headOfficeId) {
    throw new Error("Presentment action requires the current configured executive-head assignment.");
  }
  const next: LegislativeRuntimeState = {
    ...state,
    procedure: {
      ...state.procedure,
      stage: action === "SIGN" ? "SIGNED" : action === "VETO" ? "VETOED" : "NO_SIGNATURE_PENDING",
      presentment: {
        ...state.procedure.presentment,
        executiveActorId: actorId,
        executiveAssignmentId: assignmentId,
        action: action === "SIGN" ? "SIGNED" : action === "VETO" ? "VETOED" : "WITHHELD",
      },
    },
  };
  return action === "SIGN" ? enact(next, context, "SIGNATURE") : next;
};

export const resolveNoSignatureRoute = (
  state: LegislativeRuntimeState,
  context: LegislativeRuntimeContext,
  returnPrevented: boolean,
): LegislativeRuntimeState => {
  if (state.procedure.stage !== "NO_SIGNATURE_PENDING" || state.procedure.presentment === null) {
    throw new Error("No-signature resolution is not pending.");
  }
  const next = {
    ...state,
    procedure: {
      ...state.procedure,
      presentment: { ...state.procedure.presentment, returnPrevented },
    },
  };
  if (!returnPrevented && context.seed.procedure.noSignatureRule.enactWhenReturnNotPrevented) {
    return enact(next, context, "NO_SIGNATURE");
  }
  if (returnPrevented && context.seed.procedure.noSignatureRule.failWhenReturnPrevented) {
    return terminalFailure(next, "No-signature return-prevented route failed.");
  }
  throw new Error("Configured no-signature rule does not resolve this condition.");
};

export const resolveVetoOverrideRollCall = (
  state: LegislativeRuntimeState,
  context: LegislativeRuntimeContext,
  chamberId: string,
): LegislativeRuntimeState => {
  if (state.procedure.stage !== "VETOED" || state.procedure.presentment === null) {
    throw new Error("Override requires a vetoed presented measure.");
  }
  if (state.procedure.overridePassedChamberIds.includes(chamberId)) throw new Error("This chamber already passed override.");
  const result = resolveActorVotes(
    state,
    context,
    chamberId,
    evaluated(state, state.procedure.presentment.proposalVersion),
    "OVERRIDE",
    state.procedure.voteOpportunities.length + 1,
  );
  let next: LegislativeRuntimeState = {
    ...state,
    political: result.political,
    procedure: {
      ...state.procedure,
      voteOpportunities: [...state.procedure.voteOpportunities, result.opportunity],
    },
  };
  if (!result.opportunity.tally.passed) return terminalFailure(next, `Override failed in ${chamberId}.`);
  const passed = [...next.procedure.overridePassedChamberIds, chamberId];
  next = { ...next, procedure: { ...next.procedure, overridePassedChamberIds: passed } };
  const required = new Set([context.seed.procedure.originChamberId, context.seed.procedure.otherChamberId]);
  return [...required].every((id) => passed.includes(id)) ? enact(next, context, "VETO_OVERRIDE") : next;
};

export const expireLegislativeProcedure = (state: LegislativeRuntimeState): LegislativeRuntimeState => {
  if (["ENACTED", "FAILED", "EXPIRED_AT_END_OF_CONGRESS"].includes(state.procedure.stage)) {
    throw new Error("Terminal legislative procedure cannot expire again.");
  }
  return {
    ...state,
    procedure: {
      ...state.procedure,
      stage: "EXPIRED_AT_END_OF_CONGRESS",
      terminalDisposition: "EXPIRED_AT_END_OF_CONGRESS",
      failureReason: "Procedure expired at an externally supplied congress boundary.",
    },
  };
};

import {
  createFederalHousingAdministrationInstitution,
  createHousingGrantAwardForRelationship,
  establishHousingGrantProgramFromLaw,
  type AdministrativeInstitution,
  type HousingGrantAward,
  type HousingGrantProgram,
} from "./administration";
import {
  commitAvailablePublicFinance,
  createFiscalExecutionState,
  createFiscalObligation,
  createInitialPublicFinanceState,
  createPublicDisbursement,
  recognizePublicFinanceState,
  recordFiscalObligation,
  recordPublicDisbursement,
  type FiscalExecutionState,
  type FiscalObligation,
  type PublicDisbursement,
  type PublicFinanceState,
} from "./fiscal";
import { createHousingProjectFromDisbursement } from "./housing";
import {
  createDeterministicLegislatureFixture,
  decideActorVote,
  resolveSeatHolder,
  type Legislature,
  type ProposalTerms,
} from "./legislature";
import {
  createLegislativeProcedureInstance,
  resolveRequiredYeaVotes,
  type LegislativeProcedureInstance,
  type RecordedVote,
} from "./legislative-procedure";
import { appendOccurrence } from "./history";
import {
  type FederalApplicationDetermination,
  type IntergovernmentalProgramRelationship,
  type ProgramApplicationRecord,
  createDeterministicStateJurisdictions,
  createDeterministicStateProgramAdministrativeStates,
  type StateJurisdiction,
  type StateProgramAdministrativeState,
  type StateProgramDecisionState,
} from "./federalism";
import type { EnactedLaw, LegislativeProposal } from "./proposal";
import type { WorldState } from "./world";

export interface GovernanceState {
  readonly legislature: Legislature;
  readonly proposal: LegislativeProposal | null;
  readonly procedure: LegislativeProcedureInstance | null;
  readonly enactedLaws: readonly EnactedLaw[];
  /** Public-finance owner: recognition is explicit and does not occur at enactment. */
  readonly publicFinance: PublicFinanceState;
  /** Fiscal-execution owner: null until the recognition transition creates its zero-obligation state. */
  readonly fiscalExecution: FiscalExecutionState | null;
  /** Canonical federal administrative institution that can operate the program. */
  readonly administrativeInstitution: AdministrativeInstitution | null;
  /** Administrative/program owner: null until an explicit establishment transition runs. */
  readonly housingGrantProgram: HousingGrantProgram | null;
  /** Political/legal state jurisdiction identity only; no geography or population is implied. */
  readonly stateJurisdictions: readonly StateJurisdiction[];
  /** State-owned deterministic fixture behavior/capacity, separate from jurisdiction identity. */
  readonly stateProgramAdministrativeStates: readonly StateProgramAdministrativeState[];
  /** State-owned current decisions for the federal program offer. */
  readonly stateProgramDecisions: readonly StateProgramDecisionState[];
  /** State-originating application records owned by program administration. */
  readonly programApplications: readonly ProgramApplicationRecord[];
  /** Federal-owned application determinations. */
  readonly federalApplicationDeterminations: readonly FederalApplicationDetermination[];
  /** Relationship-owned active cross-jurisdiction participation facts. */
  readonly intergovernmentalProgramRelationships: readonly IntergovernmentalProgramRelationship[];
  /** Federal program/administrative-owned award records; distinct from fiscal obligation/disbursement. */
  readonly housingGrantAwards: readonly HousingGrantAward[];
}

export const createInitialGovernanceState = (): GovernanceState => ({
  legislature: createDeterministicLegislatureFixture(),
  proposal: null,
  procedure: null,
  enactedLaws: [],
  publicFinance: createInitialPublicFinanceState(),
  fiscalExecution: null,
  administrativeInstitution: createFederalHousingAdministrationInstitution(),
  housingGrantProgram: null,
  stateJurisdictions: createDeterministicStateJurisdictions(),
  stateProgramAdministrativeStates: createDeterministicStateProgramAdministrativeStates(),
  stateProgramDecisions: [],
  programApplications: [],
  federalApplicationDeterminations: [],
  intergovernmentalProgramRelationships: [],
  housingGrantAwards: [],
});

/**
 * The controlled executive administration's decision surface for this
 * increment. A fixed identity, not a player-owned actor: the player selects
 * intents through the bound ControlBinding, but the administration remains
 * the canonical originator of the resulting attempted action.
 */
const HOUSING_GRANT_ADMINISTRATION_ID = "gl0-federal-executive-administration";

const HOUSING_GRANT_PROPOSAL_ID = "gl0-housing-grant-proposal";

/**
 * GL0 synthetic fixture value: the smallest legally operative fiscal
 * provision this enacted law carries. Not a claim about real U.S. fiscal
 * policy and not a player-selected amount -- the accepted Commit-9 proposal
 * terms do not yet include a fiscal dimension. Owned here because governance
 * is what constructs the enacted legal source that carries it (see
 * `EnactedLaw.appropriation` in proposal.ts).
 */
export const HOUSING_GRANT_SYNTHETIC_APPROPRIATION_AMOUNT = 5_000_000_000;
export const HOUSING_GRANT_APPROPRIATION_PURPOSE = "gl0-housing-construction-grant-program";

/**
 * GL0 synthetic fixture value: the fixed amount awarded to any one state
 * with ACTIVE participation. Not a claim about real U.S. grant sizing and
 * deliberately independent of a state's administrative capacity -- capacity
 * does not yet drive award/fiscal/material outcomes (Commit 13 concern).
 * Two awards (State A + State C) total $2,000,000,000, well under the
 * $5,000,000,000 appropriation ceiling, so the arithmetic stays manually
 * inspectable and never approaches exhausting available public finance.
 */
export const HOUSING_GRANT_SYNTHETIC_AWARD_AMOUNT = 1_000_000_000;

/** Structural validity: malformed terms fail before any world mutation. */
const assertStructurallyValidTerms = (terms: ProposalTerms): void => {
  if (!Number.isFinite(terms.federalMatchRatePercent)) {
    throw new Error("Federal match rate must be a finite number.");
  }
  if (terms.federalMatchRatePercent < 0 || terms.federalMatchRatePercent > 100) {
    throw new Error("Federal match rate must be between 0 and 100.");
  }
  if (terms.participationCondition !== "strict" && terms.participationCondition !== "lenient") {
    throw new Error('Participation condition must be "strict" or "lenient".');
  }
  if (terms.reportingRequirement !== "standard" && terms.reportingRequirement !== "strengthened") {
    throw new Error('Reporting requirement must be "standard" or "strengthened".');
  }
};

/**
 * Administration intent -> canonical attempted proposal, plus the proceeding
 * that will govern it. This is the accepted simulation action boundary: it
 * admits only structurally valid input and never assigns actor votes or a
 * passage outcome itself.
 *
 * GL0 supports exactly one housing-grant proposal lifecycle. A proposal's id
 * is therefore only ever assigned once per world, so rejecting any second
 * submission -- passed, failed, or still pending -- keeps that id (and any
 * law/history it produced) stable instead of building a proposal registry
 * this increment does not need.
 */
export const submitHousingGrantProposal = (
  world: WorldState,
  terms: ProposalTerms,
): WorldState => {
  assertStructurallyValidTerms(terms);

  if (world.governance.proposal !== null) {
    throw new Error("A housing grant proposal already exists for this world.");
  }

  const proposal: LegislativeProposal = {
    id: HOUSING_GRANT_PROPOSAL_ID,
    sponsorAdministrationId: HOUSING_GRANT_ADMINISTRATION_ID,
    terms,
    status: "PENDING",
  };

  return {
    ...world,
    governance: {
      ...world.governance,
      proposal,
      procedure: createLegislativeProcedureInstance(proposal.id),
    },
    history: appendOccurrence(world.history, {
      type: "ProposalIntroduced",
      proposalId: proposal.id,
      terms,
      at: world.time.current,
    }),
  };
};

/**
 * A formal amendment attempt is admitted by the active proceeding, which
 * this fixture's procedure resolves deterministically (GL0 does not yet
 * model a contested amendment vote): only then does the pending proposal's
 * own provisions actually change, and an immutable occurrence records that
 * the amendment was accepted. Only legal while the proceeding is still
 * awaiting its vote.
 */
export const amendHousingGrantProposal = (
  world: WorldState,
  terms: ProposalTerms,
): WorldState => {
  assertStructurallyValidTerms(terms);

  const proposal = world.governance.proposal;
  const procedure = world.governance.procedure;
  if (proposal === null || procedure === null) throw new Error("No proposal is pending to amend.");
  if (procedure.stage !== "AWAITING_VOTE") {
    throw new Error("Only a proposal still awaiting its vote may be amended.");
  }

  const previousTerms = proposal.terms;
  const amendedProposal: LegislativeProposal = { ...proposal, terms };
  const amendedProcedure: LegislativeProcedureInstance = {
    ...procedure,
    amendmentsAdopted: procedure.amendmentsAdopted + 1,
  };

  return {
    ...world,
    governance: { ...world.governance, proposal: amendedProposal, procedure: amendedProcedure },
    history: appendOccurrence(world.history, {
      type: "AmendmentAccepted",
      proposalId: proposal.id,
      previousTerms,
      newTerms: terms,
      at: world.time.current,
    }),
  };
};

/**
 * Each seat's current office holder independently resolves its own vote from
 * the proposal terms currently before it. The proceeding then admits those
 * votes as its own recorded state and applies the passage rule configured on
 * it; it never reads or writes a global support scalar. Enactment creates a
 * new legal-order fact and stops there: no fiscal, administrative, state, or
 * material state exists yet for this to touch.
 */
export const resolveHousingGrantProposalVote = (world: WorldState): WorldState => {
  const proposal = world.governance.proposal;
  const procedure = world.governance.procedure;
  if (proposal === null || procedure === null) throw new Error("No proposal is pending for a vote.");
  if (procedure.stage !== "AWAITING_VOTE") {
    throw new Error("This proposal's vote has already been resolved.");
  }

  const votes: RecordedVote[] = world.governance.legislature.seats.map((seat) => {
    const holder = resolveSeatHolder(world.governance.legislature, seat.id);
    return {
      seatId: seat.id,
      actorId: holder.id,
      choice: decideActorVote(holder.decisionCriteria, proposal.terms),
    };
  });

  const yeaCount = votes.filter((vote) => vote.choice === "YEA").length;
  const requiredYeaVotes = resolveRequiredYeaVotes(procedure.rules, world.governance.legislature);
  const passed = yeaCount >= requiredYeaVotes;

  const resolvedProcedure: LegislativeProcedureInstance = {
    ...procedure,
    stage: "RESOLVED",
    votes,
  };
  const resolvedProposal: LegislativeProposal = {
    ...proposal,
    status: passed ? "PROCEDURE_PASSED" : "PROCEDURE_FAILED",
  };

  const historyWithVotes = votes.reduce(
    (history, vote) =>
      appendOccurrence(history, {
        type: "VoteCast",
        proposalId: proposal.id,
        seatId: vote.seatId,
        actorId: vote.actorId,
        choice: vote.choice,
        at: world.time.current,
      }),
    world.history,
  );

  const historyWithResolution = appendOccurrence(historyWithVotes, {
    type: "LegislativeProcedureResolved",
    proposalId: proposal.id,
    outcome: passed ? "PASSED" : "FAILED",
    yeaCount,
    requiredYeaVotes,
    at: world.time.current,
  });

  if (!passed) {
    return {
      ...world,
      governance: { ...world.governance, proposal: resolvedProposal, procedure: resolvedProcedure },
      history: historyWithResolution,
    };
  }

  const enactedLaw: EnactedLaw = {
    id: `gl0-law-for-${proposal.id}`,
    sourceProposalId: proposal.id,
    enactedTerms: proposal.terms,
    enactedAtSimulationTime: world.time.current,
    appropriation: {
      amount: HOUSING_GRANT_SYNTHETIC_APPROPRIATION_AMOUNT,
      purpose: HOUSING_GRANT_APPROPRIATION_PURPOSE,
    },
  };

  return {
    ...world,
    governance: {
      ...world.governance,
      proposal: resolvedProposal,
      procedure: resolvedProcedure,
      enactedLaws: [...world.governance.enactedLaws, enactedLaw],
    },
    history: appendOccurrence(historyWithResolution, {
      type: "LawEnacted",
      proposalId: proposal.id,
      lawId: enactedLaw.id,
      at: world.time.current,
    }),
  };
};

/** GL0 has exactly one housing-grant proposal lifecycle, so at most one law is ever enacted. */
const latestEnactedHousingGrantLaw = (world: WorldState): EnactedLaw | null => {
  const { enactedLaws } = world.governance;
  return enactedLaws.length > 0 ? enactedLaws[enactedLaws.length - 1] : null;
};

/**
 * Enacted legal appropriation -> explicit public-finance availability
 * recognition plus a zero-obligation fiscal-execution state.
 * This is a distinct downstream transition from enactment itself: a passed
 * law can exist for one or more simulation instants with no recognized
 * public-finance availability, because nothing calls this transition
 * automatically. Rejects recognizing twice against the same law so
 * availability is never double-counted.
 */
export const recognizeHousingGrantFiscalAuthority = (world: WorldState): WorldState => {
  const enactedLaw = latestEnactedHousingGrantLaw(world);
  if (enactedLaw === null) {
    throw new Error("Fiscal authority cannot be recognized without an enacted housing grant law.");
  }
  if (world.governance.publicFinance.housingGrant !== null) {
    throw new Error("Fiscal authority has already been recognized for this law.");
  }

  const publicFinance = recognizePublicFinanceState(enactedLaw, world.time.current);
  const fiscalExecution = createFiscalExecutionState(enactedLaw);

  return {
    ...world,
    governance: { ...world.governance, publicFinance, fiscalExecution },
    history: appendOccurrence(world.history, {
      type: "PublicFinanceAvailabilityRecognized",
      lawId: enactedLaw.id,
      availableAmount: publicFinance.housingGrant!.availableAmount,
      at: world.time.current,
    }),
  };
};

/**
 * Enacted law + recognized public-finance availability + canonical operator
 * institution -> operational federal program state. Establishment remains a
 * separate explicit transition and rejects duplicate establishment.
 */
export const establishHousingGrantProgram = (world: WorldState): WorldState => {
  const enactedLaw = latestEnactedHousingGrantLaw(world);
  if (enactedLaw === null) {
    throw new Error(
      "The housing grant program cannot be established without an enacted housing grant law.",
    );
  }

  const { fiscalExecution, publicFinance, administrativeInstitution } = world.governance;
  if (
    fiscalExecution === null ||
    fiscalExecution.sourceLawId !== enactedLaw.id ||
    publicFinance.housingGrant === null ||
    publicFinance.housingGrant.sourceLawId !== enactedLaw.id
  ) {
    throw new Error(
      "The housing grant program cannot be established before its fiscal authority is available.",
    );
  }

  if (administrativeInstitution === null) {
    throw new Error(
      "The housing grant program cannot be established without its administrative institution.",
    );
  }

  if (world.governance.housingGrantProgram !== null) {
    throw new Error("The housing grant program has already been established.");
  }

  const housingGrantProgram = establishHousingGrantProgramFromLaw(
    enactedLaw,
    publicFinance,
    administrativeInstitution,
  );

  return {
    ...world,
    governance: { ...world.governance, housingGrantProgram },
    history: appendOccurrence(world.history, {
      type: "HousingGrantProgramEstablished",
      programId: housingGrantProgram.id,
      lawId: enactedLaw.id,
      at: world.time.current,
    }),
  };
};

const requireHousingGrantProgram = (world: WorldState): HousingGrantProgram => {
  const program = world.governance.housingGrantProgram;
  if (program === null) {
    throw new Error("The housing grant program must be established before state participation can be resolved.");
  }
  return program;
};

const resolveStateJurisdiction = (world: WorldState, stateJurisdictionId: string): StateJurisdiction => {
  const state = world.governance.stateJurisdictions.find(
    (candidate) => candidate.id === stateJurisdictionId,
  );
  if (state === undefined) {
    throw new Error(`Unknown state jurisdiction: ${stateJurisdictionId}.`);
  }
  return state;
};

/**
 * The state's deterministic fixture behavior/capacity is a separate owner
 * from jurisdiction identity (see `StateProgramAdministrativeState` in
 * federalism.ts). Every fixture jurisdiction has exactly one such record, so
 * its absence indicates a fixture-construction defect rather than a normal
 * runtime precondition failure.
 */
const resolveStateProgramAdministrativeState = (
  world: WorldState,
  stateJurisdictionId: string,
): StateProgramAdministrativeState => {
  const administrativeState = world.governance.stateProgramAdministrativeStates.find(
    (candidate) => candidate.stateJurisdictionId === stateJurisdictionId,
  );
  if (administrativeState === undefined) {
    throw new Error(
      `State jurisdiction ${stateJurisdictionId} has no administrative fixture state.`,
    );
  }
  return administrativeState;
};

const resolveStateProgramDecision = (
  world: WorldState,
  programId: string,
  stateJurisdictionId: string,
): StateProgramDecisionState | null =>
  world.governance.stateProgramDecisions.find(
    (decision) =>
      decision.federalProgramId === programId &&
      decision.stateJurisdictionId === stateJurisdictionId,
  ) ?? null;

const resolveProgramApplication = (
  world: WorldState,
  programId: string,
  stateJurisdictionId: string,
): ProgramApplicationRecord | null =>
  world.governance.programApplications.find(
    (application) =>
      application.federalProgramId === programId &&
      application.stateJurisdictionId === stateJurisdictionId,
  ) ?? null;

const resolveFederalApplicationDetermination = (
  world: WorldState,
  programId: string,
  stateJurisdictionId: string,
): FederalApplicationDetermination | null =>
  world.governance.federalApplicationDeterminations.find(
    (determination) =>
      determination.federalProgramId === programId &&
      determination.stateJurisdictionId === stateJurisdictionId,
  ) ?? null;

/** State-owned decision stage. It never creates an application or federal result. */
export const resolveStateHousingGrantDecision = (
  world: WorldState,
  stateJurisdictionId: string,
): WorldState => {
  const program = requireHousingGrantProgram(world);
  const state = resolveStateJurisdiction(world, stateJurisdictionId);
  const administrativeState = resolveStateProgramAdministrativeState(world, state.id);
  if (resolveStateProgramDecision(world, program.id, state.id) !== null) {
    throw new Error(`State ${state.id} has already resolved its housing grant decision.`);
  }

  const decision: StateProgramDecisionState = {
    stateJurisdictionId: state.id,
    federalProgramId: program.id,
    decision: administrativeState.housingGrantDecisionRule,
    resolvedAtSimulationTime: world.time.current,
  };

  return {
    ...world,
    governance: {
      ...world.governance,
      stateProgramDecisions: [...world.governance.stateProgramDecisions, decision],
    },
    history: appendOccurrence(world.history, {
      type: "StateProgramDecisionResolved",
      programId: program.id,
      stateJurisdictionId: state.id,
      decision: decision.decision,
      at: world.time.current,
    }),
  };
};

/** State-originating application stage. Refusal cannot create an application. */
export const submitStateHousingGrantApplication = (
  world: WorldState,
  stateJurisdictionId: string,
): WorldState => {
  const program = requireHousingGrantProgram(world);
  const state = resolveStateJurisdiction(world, stateJurisdictionId);
  const decision = resolveStateProgramDecision(world, program.id, state.id);
  if (decision === null) {
    throw new Error(`State ${state.id} must resolve its housing grant decision before applying.`);
  }
  if (decision.decision !== "APPLY") {
    throw new Error(`State ${state.id} refused the housing grant program and cannot apply.`);
  }
  if (resolveProgramApplication(world, program.id, state.id) !== null) {
    throw new Error(`State ${state.id} has already submitted a housing grant application.`);
  }

  const application: ProgramApplicationRecord = {
    id: `gl0-application-${state.id}-for-${program.id}`,
    federalProgramId: program.id,
    stateJurisdictionId: state.id,
    status: "SUBMITTED",
    submittedAtSimulationTime: world.time.current,
  };

  return {
    ...world,
    governance: {
      ...world.governance,
      programApplications: [...world.governance.programApplications, application],
    },
    history: appendOccurrence(world.history, {
      type: "StateProgramApplicationSubmitted",
      applicationId: application.id,
      programId: program.id,
      stateJurisdictionId: state.id,
      at: world.time.current,
    }),
  };
};

/** Federal-owned determination stage. GL0 deterministically accepts submitted applications. */
export const resolveFederalHousingGrantApplication = (
  world: WorldState,
  stateJurisdictionId: string,
): WorldState => {
  const program = requireHousingGrantProgram(world);
  const state = resolveStateJurisdiction(world, stateJurisdictionId);
  const application = resolveProgramApplication(world, program.id, state.id);
  if (application === null) {
    throw new Error(`Federal determination cannot occur without a state application from ${state.id}.`);
  }
  const decision = resolveStateProgramDecision(world, program.id, state.id);
  if (decision === null || decision.decision !== "APPLY") {
    throw new Error(`Federal determination requires a state-owned APPLY decision from ${state.id}.`);
  }
  if (resolveFederalApplicationDetermination(world, program.id, state.id) !== null) {
    throw new Error(`Federal determination already exists for state ${state.id}.`);
  }

  const determination: FederalApplicationDetermination = {
    id: `gl0-determination-for-${application.id}`,
    federalProgramId: program.id,
    applicationId: application.id,
    stateJurisdictionId: state.id,
    outcome: "ACCEPTED",
    determinedAtSimulationTime: world.time.current,
  };

  return {
    ...world,
    governance: {
      ...world.governance,
      federalApplicationDeterminations: [
        ...world.governance.federalApplicationDeterminations,
        determination,
      ],
    },
    history: appendOccurrence(world.history, {
      type: "FederalProgramApplicationAccepted",
      determinationId: determination.id,
      applicationId: application.id,
      programId: program.id,
      stateJurisdictionId: state.id,
      at: world.time.current,
    }),
  };
};

/** Relationship-owned activation requires both state APPLY and federal ACCEPTED facts. */
export const activateIntergovernmentalHousingGrantParticipation = (
  world: WorldState,
  stateJurisdictionId: string,
): WorldState => {
  const program = requireHousingGrantProgram(world);
  const state = resolveStateJurisdiction(world, stateJurisdictionId);
  const decision = resolveStateProgramDecision(world, program.id, state.id);
  if (decision === null || decision.decision !== "APPLY") {
    throw new Error(`State ${state.id} must have a state-owned APPLY decision before participation can activate.`);
  }

  const application = resolveProgramApplication(world, program.id, state.id);
  if (application === null) {
    throw new Error(`State ${state.id} must submit an application before participation can activate.`);
  }

  const determination = resolveFederalApplicationDetermination(world, program.id, state.id);
  if (determination === null || determination.outcome !== "ACCEPTED") {
    throw new Error(`State ${state.id} must have federal acceptance before participation can activate.`);
  }

  const existingRelationship = world.governance.intergovernmentalProgramRelationships.find(
    (relationship) =>
      relationship.federalProgramId === program.id &&
      relationship.stateJurisdictionId === state.id,
  );
  if (existingRelationship !== undefined) {
    throw new Error(`Participation is already active for state ${state.id}.`);
  }

  const relationship: IntergovernmentalProgramRelationship = {
    id: `gl0-participation-${state.id}-for-${program.id}`,
    federalProgramId: program.id,
    stateJurisdictionId: state.id,
    stateApplicationId: application.id,
    federalDeterminationId: determination.id,
    status: "ACTIVE",
  };

  return {
    ...world,
    governance: {
      ...world.governance,
      intergovernmentalProgramRelationships: [
        ...world.governance.intergovernmentalProgramRelationships,
        relationship,
      ],
    },
    history: appendOccurrence(world.history, {
      type: "IntergovernmentalProgramRelationshipActivated",
      relationshipId: relationship.id,
      programId: program.id,
      stateJurisdictionId: state.id,
      applicationId: application.id,
      determinationId: determination.id,
      at: world.time.current,
    }),
  };
};

const resolveActiveIntergovernmentalRelationship = (
  world: WorldState,
  programId: string,
  stateJurisdictionId: string,
): IntergovernmentalProgramRelationship | null =>
  world.governance.intergovernmentalProgramRelationships.find(
    (relationship) =>
      relationship.federalProgramId === programId &&
      relationship.stateJurisdictionId === stateJurisdictionId &&
      relationship.status === "ACTIVE",
  ) ?? null;

const resolveHousingGrantAward = (
  world: WorldState,
  programId: string,
  stateJurisdictionId: string,
): HousingGrantAward | null =>
  world.governance.housingGrantAwards.find(
    (award) => award.federalProgramId === programId && award.stateJurisdictionId === stateJurisdictionId,
  ) ?? null;

const resolveFiscalObligationForAward = (world: WorldState, awardId: string): FiscalObligation | null =>
  (world.governance.fiscalExecution?.obligations ?? []).find(
    (obligation) => obligation.awardId === awardId,
  ) ?? null;

const resolvePublicDisbursementForObligation = (
  world: WorldState,
  obligationId: string,
): PublicDisbursement | null =>
  (world.governance.publicFinance.housingGrant?.disbursements ?? []).find(
    (disbursement) => disbursement.obligationId === obligationId,
  ) ?? null;

/**
 * Federal program-owned award stage. Requires ACTIVE intergovernmental
 * participation -- a state application or federal acceptance alone is not
 * enough, because the relationship is the accepted intergovernmental seam
 * (see `activateIntergovernmentalHousingGrantParticipation` above). Awarding
 * does not itself obligate or disburse money and creates no Housing project.
 */
export const createHousingGrantAward = (
  world: WorldState,
  stateJurisdictionId: string,
): WorldState => {
  const program = requireHousingGrantProgram(world);
  const state = resolveStateJurisdiction(world, stateJurisdictionId);

  const relationship = resolveActiveIntergovernmentalRelationship(world, program.id, state.id);
  if (relationship === null) {
    throw new Error(
      `State ${state.id} must have an ACTIVE intergovernmental participation relationship before an award can be created.`,
    );
  }

  if (resolveHousingGrantAward(world, program.id, state.id) !== null) {
    throw new Error(`An award already exists for state ${state.id}.`);
  }

  const availableAmount = world.governance.publicFinance.housingGrant?.availableAmount ?? 0;
  if (availableAmount < HOUSING_GRANT_SYNTHETIC_AWARD_AMOUNT) {
    throw new Error(`Awarding state ${state.id} would exceed currently available public-finance authority.`);
  }

  const award = createHousingGrantAwardForRelationship(
    program.id,
    relationship.id,
    state.id,
    HOUSING_GRANT_SYNTHETIC_AWARD_AMOUNT,
    world.time.current,
  );

  return {
    ...world,
    governance: {
      ...world.governance,
      housingGrantAwards: [...world.governance.housingGrantAwards, award],
    },
    history: appendOccurrence(world.history, {
      type: "HousingGrantAwardCreated",
      awardId: award.id,
      programId: program.id,
      relationshipId: relationship.id,
      stateJurisdictionId: state.id,
      awardedAmount: award.awardedAmount,
      at: world.time.current,
    }),
  };
};

/**
 * Fiscal-execution-owned obligation stage. Requires an actual award and
 * rejects committing beyond currently available public-finance authority.
 * Recording an obligation moves the committed amount out of "available" but
 * does not itself pay anyone -- see `disburseHousingGrantObligation` below.
 */
export const obligateHousingGrantAward = (
  world: WorldState,
  stateJurisdictionId: string,
): WorldState => {
  const program = requireHousingGrantProgram(world);
  const state = resolveStateJurisdiction(world, stateJurisdictionId);

  const award = resolveHousingGrantAward(world, program.id, state.id);
  if (award === null) {
    throw new Error(`State ${state.id} must have an award before it can be obligated.`);
  }

  if (resolveFiscalObligationForAward(world, award.id) !== null) {
    throw new Error(`An obligation already exists for award ${award.id}.`);
  }

  const { fiscalExecution, publicFinance } = world.governance;
  if (fiscalExecution === null || publicFinance.housingGrant === null) {
    throw new Error("Fiscal authority must be recognized before an award can be obligated.");
  }
  if (publicFinance.housingGrant.availableAmount < award.awardedAmount) {
    throw new Error(`Obligating award ${award.id} would exceed currently available public-finance authority.`);
  }

  const obligation = createFiscalObligation(
    fiscalExecution.sourceLawId,
    program.id,
    award.id,
    state.id,
    award.awardedAmount,
    world.time.current,
  );

  return {
    ...world,
    governance: {
      ...world.governance,
      fiscalExecution: recordFiscalObligation(fiscalExecution, obligation),
      publicFinance: commitAvailablePublicFinance(publicFinance, obligation.amount),
    },
    history: appendOccurrence(world.history, {
      type: "HousingGrantObligationRecorded",
      obligationId: obligation.id,
      awardId: award.id,
      stateJurisdictionId: state.id,
      amount: obligation.amount,
      at: world.time.current,
    }),
  };
};

/**
 * Public-finance-owned disbursement stage. Requires an existing obligation
 * and pays exactly its obligated amount in one transition (GL0 does not
 * model partial payment schedules). Disbursement never adjusts
 * `availableAmount` again -- that was already committed at obligation time.
 */
export const disburseHousingGrantObligation = (
  world: WorldState,
  stateJurisdictionId: string,
): WorldState => {
  const program = requireHousingGrantProgram(world);
  const state = resolveStateJurisdiction(world, stateJurisdictionId);

  const award = resolveHousingGrantAward(world, program.id, state.id);
  if (award === null) {
    throw new Error(`State ${state.id} has no award to disburse against.`);
  }

  const obligation = resolveFiscalObligationForAward(world, award.id);
  if (obligation === null) {
    throw new Error(`State ${state.id} must have an obligation before it can be disbursed.`);
  }

  if (resolvePublicDisbursementForObligation(world, obligation.id) !== null) {
    throw new Error(`A disbursement already exists for obligation ${obligation.id}.`);
  }

  const { publicFinance } = world.governance;
  if (publicFinance.housingGrant === null) {
    throw new Error("Public finance must be recognized before an obligation can be disbursed.");
  }

  const disbursement = createPublicDisbursement(obligation, world.time.current);
  if (disbursement.amount > obligation.amount) {
    throw new Error(`Disbursement for obligation ${obligation.id} cannot exceed its obligated amount.`);
  }

  return {
    ...world,
    governance: {
      ...world.governance,
      publicFinance: recordPublicDisbursement(publicFinance, disbursement),
    },
    history: appendOccurrence(world.history, {
      type: "HousingGrantDisbursementMade",
      disbursementId: disbursement.id,
      obligationId: obligation.id,
      stateJurisdictionId: state.id,
      amount: disbursement.amount,
      at: world.time.current,
    }),
  };
};

/**
 * Housing-owned material project stage. Requires an actual disbursement --
 * relationship, award, and obligation alone are not enough, so the strongest
 * possible proof that money movement and material state are distinct
 * transitions is preserved. Creates exactly one project per disbursement and
 * does not touch program/fiscal/administrative state.
 */
export const materializeHousingProjectFromDisbursement = (
  world: WorldState,
  stateJurisdictionId: string,
): WorldState => {
  const program = requireHousingGrantProgram(world);
  const state = resolveStateJurisdiction(world, stateJurisdictionId);

  const award = resolveHousingGrantAward(world, program.id, state.id);
  if (award === null) {
    throw new Error(`State ${state.id} has no award to materialize a Housing project from.`);
  }

  const obligation = resolveFiscalObligationForAward(world, award.id);
  if (obligation === null) {
    throw new Error(`State ${state.id} has no obligation to materialize a Housing project from.`);
  }

  const disbursement = resolvePublicDisbursementForObligation(world, obligation.id);
  if (disbursement === null) {
    throw new Error(`State ${state.id} must have an actual disbursement before a Housing project can be created.`);
  }

  if (world.housing.projects.some((project) => project.sourceDisbursementId === disbursement.id)) {
    throw new Error(`A Housing project already exists for disbursement ${disbursement.id}.`);
  }

  const project = createHousingProjectFromDisbursement(state.id, disbursement.id, world.time.current);

  return {
    ...world,
    housing: { ...world.housing, projects: [...world.housing.projects, project] },
    history: appendOccurrence(world.history, {
      type: "HousingProjectCreated",
      projectId: project.id,
      sourceDisbursementId: disbursement.id,
      stateJurisdictionId: state.id,
      at: world.time.current,
    }),
  };
};

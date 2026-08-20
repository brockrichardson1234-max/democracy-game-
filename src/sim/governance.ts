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
import type { EnactedLaw, LegislativeProposal } from "./proposal";
import type { WorldState } from "./world";

export interface GovernanceState {
  readonly legislature: Legislature;
  readonly proposal: LegislativeProposal | null;
  readonly procedure: LegislativeProcedureInstance | null;
  readonly enactedLaws: readonly EnactedLaw[];
}

export const createInitialGovernanceState = (): GovernanceState => ({
  legislature: createDeterministicLegislatureFixture(),
  proposal: null,
  procedure: null,
  enactedLaws: [],
});

/**
 * The controlled executive administration's decision surface for this
 * increment. A fixed identity, not a player-owned actor: the player selects
 * intents through the bound ControlBinding, but the administration remains
 * the canonical originator of the resulting attempted action.
 */
const HOUSING_GRANT_ADMINISTRATION_ID = "gl0-federal-executive-administration";

const HOUSING_GRANT_PROPOSAL_ID = "gl0-housing-grant-proposal";

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

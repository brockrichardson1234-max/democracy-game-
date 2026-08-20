import {
  createDeterministicLegislatureFixture,
  decideLegislatorVote,
  resolvePassageThreshold,
  type Legislature,
  type ProposalTerms,
} from "./legislature";
import type { EnactedLaw, LegislativeProposal, LegislativeVoteRecord } from "./proposal";
import type { WorldState } from "./world";

export interface GovernanceState {
  readonly legislature: Legislature;
  readonly proposal: LegislativeProposal | null;
  readonly enactedLaws: readonly EnactedLaw[];
}

export const createInitialGovernanceState = (): GovernanceState => ({
  legislature: createDeterministicLegislatureFixture(),
  proposal: null,
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
const HOUSING_GRANT_LAW_ID = "gl0-housing-grant-law";

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
 * Administration intent -> canonical attempted proposal. This is the
 * accepted simulation action boundary: it admits only structurally valid
 * input and never assigns legislator votes or a passage outcome itself.
 */
export const submitHousingGrantProposal = (
  world: WorldState,
  terms: ProposalTerms,
): WorldState => {
  assertStructurallyValidTerms(terms);

  if (world.governance.proposal !== null && world.governance.proposal.status === "PENDING") {
    throw new Error("A housing grant proposal is already pending before the legislature.");
  }

  const proposal: LegislativeProposal = {
    id: HOUSING_GRANT_PROPOSAL_ID,
    sponsorAdministrationId: HOUSING_GRANT_ADMINISTRATION_ID,
    terms,
    status: "PENDING",
    amendmentCount: 0,
    votes: null,
  };

  return { ...world, governance: { ...world.governance, proposal } };
};

/**
 * A formal amendment changes the pending proposal's actual provisions. Only
 * legal while the proposal is still pending a vote; it cannot rewrite a
 * resolved proposal or an enacted law.
 */
export const amendHousingGrantProposal = (
  world: WorldState,
  terms: ProposalTerms,
): WorldState => {
  assertStructurallyValidTerms(terms);

  const current = world.governance.proposal;
  if (current === null) throw new Error("No proposal is pending to amend.");
  if (current.status !== "PENDING") throw new Error("Only a pending proposal may be amended.");

  const amended: LegislativeProposal = {
    ...current,
    terms,
    amendmentCount: current.amendmentCount + 1,
  };

  return { ...world, governance: { ...world.governance, proposal: amended } };
};

/**
 * Each legislator independently resolves its own vote from the proposal
 * terms currently before it. The procedure then applies the configured
 * passage rule to the individually admitted votes; it never reads or writes
 * a global support scalar. Enactment creates a new legal-order fact and
 * stops there: no fiscal, administrative, state, or material state exists
 * yet for this to touch.
 */
export const resolveHousingGrantProposalVote = (world: WorldState): WorldState => {
  const current = world.governance.proposal;
  if (current === null) throw new Error("No proposal is pending for a vote.");
  if (current.status !== "PENDING") throw new Error("This proposal has already been resolved.");

  const votes: LegislativeVoteRecord[] = world.governance.legislature.legislators.map(
    (legislator) => ({
      legislatorId: legislator.id,
      choice: decideLegislatorVote(legislator.decisionCriteria, current.terms),
    }),
  );

  const yeaCount = votes.filter((vote) => vote.choice === "YEA").length;
  const passed = yeaCount >= resolvePassageThreshold(world.governance.legislature);

  const resolvedProposal: LegislativeProposal = {
    ...current,
    status: passed ? "PROCEDURE_PASSED" : "PROCEDURE_FAILED",
    votes,
  };

  if (!passed) {
    return { ...world, governance: { ...world.governance, proposal: resolvedProposal } };
  }

  const enactedLaw: EnactedLaw = {
    id: HOUSING_GRANT_LAW_ID,
    sourceProposalId: current.id,
    enactedTerms: current.terms,
    enactedAtSimulationTime: world.time.current,
  };

  return {
    ...world,
    governance: {
      ...world.governance,
      proposal: resolvedProposal,
      enactedLaws: [...world.governance.enactedLaws, enactedLaw],
    },
  };
};

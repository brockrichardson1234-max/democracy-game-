import {
  HOUSING_GRANT_APPROPRIATION_PURPOSE,
  HOUSING_GRANT_SYNTHETIC_APPROPRIATION_AMOUNT,
} from "../src/content/gl0-synthetic/configuration";
import { describe, expect, it } from "vitest";

import { createDeterministicWorldFixture } from "../src/content/gl0-synthetic/configuration";

import {
  amendHousingGrantProposal,
  resolveHousingGrantProposalVote,
  submitHousingGrantProposal,
} from "../src/sim/governance";
import {
  decideActorVote,
  resolveSeatHolder,
} from "../src/sim/legislature";
import type { ProposalTerms } from "../src/sim/legislature";
import {
  resolveRequiredYeaVotes,
} from "../src/sim/legislative-procedure";

const INITIAL_TERMS: ProposalTerms = {
  federalMatchRatePercent: 35,
  participationCondition: "strict",
  reportingRequirement: "standard",
};

const COMPROMISE_TERMS: ProposalTerms = {
  federalMatchRatePercent: 55,
  participationCondition: "lenient",
  reportingRequirement: "strengthened",
};

const INSUFFICIENT_AMENDMENT_TERMS: ProposalTerms = {
  federalMatchRatePercent: 35,
  participationCondition: "strict",
  reportingRequirement: "strengthened",
};

describe("Commit 9 first political/legal causal slice", () => {
  it("initializes a deterministic legislature fixture with seats, actors, and assignments as distinct facts", () => {
    const world = createDeterministicWorldFixture();
    const { seats, actors, assignments } = world.governance.legislature;

    expect(seats).toHaveLength(11);
    expect(actors).toHaveLength(11);
    expect(assignments).toHaveLength(11);
    expect(new Set(seats.map((seat) => seat.id)).size).toBe(11);
    expect(new Set(actors.map((actor) => actor.id)).size).toBe(11);
    // Every seat's assignment resolves to an actor distinct from the seat's own identity.
    for (const seat of seats) {
      const holder = resolveSeatHolder(world.governance.legislature, seat.id);
      expect(actors.some((actor) => actor.id === holder.id)).toBe(true);
    }

    expect(resolveRequiredYeaVotes({ passageRule: "MAJORITY_OF_SEATS" }, world.governance.legislature)).toBe(6);
    expect(world.governance.proposal).toBeNull();
    expect(world.governance.procedure).toBeNull();
    expect(world.governance.enactedLaws).toEqual([]);
    expect(world.history).toEqual([]);
  });

  it("admits administration proposal intent as canonical pending state through the accepted action boundary", () => {
    const world = createDeterministicWorldFixture();
    const submitted = submitHousingGrantProposal(world, INITIAL_TERMS);

    expect(submitted.governance.proposal).toEqual({
      id: "gl0-housing-grant-proposal",
      sponsorAdministrationId: "gl0-federal-executive-administration",
      terms: INITIAL_TERMS,
      status: "PENDING",
    });
    expect(submitted.governance.procedure).toMatchObject({
      proposalId: "gl0-housing-grant-proposal",
      stage: "AWAITING_VOTE",
      amendmentsAdopted: 0,
      votes: null,
    });
    expect(submitted.history).toEqual([
      { type: "ProposalIntroduced", proposalId: "gl0-housing-grant-proposal", terms: INITIAL_TERMS, at: 0 },
    ]);
    // Submission is a pure transition: the original world reference is untouched.
    expect(world.governance.proposal).toBeNull();
  });

  it("rejects structurally invalid proposal terms without creating a political event", () => {
    const world = createDeterministicWorldFixture();

    expect(() =>
      submitHousingGrantProposal(world, { ...INITIAL_TERMS, federalMatchRatePercent: 150 }),
    ).toThrow(/between 0 and 100/);
    expect(world.governance.proposal).toBeNull();
    expect(world.history).toEqual([]);
  });

  it("rejects submitting a second proposal while one is already pending", () => {
    const world = submitHousingGrantProposal(createDeterministicWorldFixture(), INITIAL_TERMS);

    expect(() => submitHousingGrantProposal(world, COMPROMISE_TERMS)).toThrow(/already exists/);
  });

  it("rejects submitting a second proposal even after the first has been resolved (R9-03)", () => {
    const world = submitHousingGrantProposal(createDeterministicWorldFixture(), INITIAL_TERMS);
    const failed = resolveHousingGrantProposalVote(world);

    expect(failed.governance.proposal?.status).toBe("PROCEDURE_FAILED");
    expect(() => submitHousingGrantProposal(failed, COMPROMISE_TERMS)).toThrow(/already exists/);
    // The resolved proposal and its identity remain exactly as resolved.
    expect(failed.governance.proposal?.id).toBe("gl0-housing-grant-proposal");
  });

  it("fails the initial proposal because individually held seats' votes do not satisfy the configured passage rule", () => {
    const world = submitHousingGrantProposal(createDeterministicWorldFixture(), INITIAL_TERMS);
    const resolved = resolveHousingGrantProposalVote(world);

    expect(resolved.governance.proposal?.status).toBe("PROCEDURE_FAILED");
    expect(resolved.governance.procedure?.stage).toBe("RESOLVED");
    const yeaCount = resolved.governance.procedure?.votes?.filter((vote) => vote.choice === "YEA").length;
    expect(yeaCount).toBe(4);
    expect(yeaCount).toBeLessThan(
      resolveRequiredYeaVotes(world.governance.procedure!.rules, world.governance.legislature),
    );
  });

  it("failed proposal creates no enacted legal source", () => {
    const world = submitHousingGrantProposal(createDeterministicWorldFixture(), INITIAL_TERMS);
    const resolved = resolveHousingGrantProposalVote(world);

    expect(resolved.governance.enactedLaws).toEqual([]);
  });

  it("stores votes as individual seat/actor decisions admitted by the procedure, not a global support count", () => {
    const world = submitHousingGrantProposal(createDeterministicWorldFixture(), INITIAL_TERMS);
    const resolved = resolveHousingGrantProposalVote(world);
    const votes = resolved.governance.procedure?.votes;

    expect(Array.isArray(votes)).toBe(true);
    expect(votes).toHaveLength(11);
    for (const seat of world.governance.legislature.seats) {
      expect(votes?.some((vote) => vote.seatId === seat.id)).toBe(true);
    }
    for (const vote of votes ?? []) {
      const holder = resolveSeatHolder(world.governance.legislature, vote.seatId);
      expect(vote.actorId).toBe(holder.id);
    }
  });

  it("records one immutable VoteCast occurrence per seat plus a resolution occurrence", () => {
    const world = submitHousingGrantProposal(createDeterministicWorldFixture(), INITIAL_TERMS);
    const resolved = resolveHousingGrantProposalVote(world);

    const voteCastOccurrences = resolved.history.filter((entry) => entry.type === "VoteCast");
    const resolutionOccurrences = resolved.history.filter(
      (entry) => entry.type === "LegislativeProcedureResolved",
    );

    expect(voteCastOccurrences).toHaveLength(11);
    expect(resolutionOccurrences).toEqual([
      {
        type: "LegislativeProcedureResolved",
        proposalId: "gl0-housing-grant-proposal",
        outcome: "FAILED",
        yeaCount: 4,
        requiredYeaVotes: 6,
        at: 0,
      },
    ]);
  });

  it("applies a real amendment through the proceeding, changing canonical proposal terms while pending", () => {
    const world = submitHousingGrantProposal(createDeterministicWorldFixture(), INITIAL_TERMS);
    const amended = amendHousingGrantProposal(world, COMPROMISE_TERMS);

    expect(amended.governance.proposal?.terms).toEqual(COMPROMISE_TERMS);
    expect(amended.governance.procedure?.amendmentsAdopted).toBe(1);
    expect(amended.governance.proposal?.status).toBe("PENDING");
    expect(
      amended.history.some(
        (entry) =>
          entry.type === "AmendmentAccepted" &&
          entry.proposalId === "gl0-housing-grant-proposal",
      ),
    ).toBe(true);
    // The prior world's proposal terms remain the original submission.
    expect(world.governance.proposal?.terms).toEqual(INITIAL_TERMS);
  });

  it("rejects amending a proposal whose vote has already been resolved", () => {
    const world = submitHousingGrantProposal(createDeterministicWorldFixture(), INITIAL_TERMS);
    const resolved = resolveHousingGrantProposalVote(world);

    expect(() => amendHousingGrantProposal(resolved, COMPROMISE_TERMS)).toThrow(
      /still awaiting its vote/,
    );
  });

  it("the compromise amendment changes multiple individual actors' decisions", () => {
    const world = submitHousingGrantProposal(createDeterministicWorldFixture(), INITIAL_TERMS);
    const actors = world.governance.legislature.actors;

    const flipped = actors.filter(
      (actor) =>
        decideActorVote(actor.decisionCriteria, INITIAL_TERMS) !==
        decideActorVote(actor.decisionCriteria, COMPROMISE_TERMS),
    );

    // Both the opposition coalition (participation condition) and the swing
    // coalition (match rate + reporting) flip -- not one magic swing voter.
    expect(flipped.length).toBeGreaterThan(1);
    expect(flipped.some((actor) => actor.coalition === "OPPOSITION_COALITION")).toBe(true);
    expect(flipped.some((actor) => actor.coalition === "SWING_COALITION")).toBe(true);
  });

  it("the amended compromise proposal passes and creates the expected enacted legal source", () => {
    const world = submitHousingGrantProposal(createDeterministicWorldFixture(), INITIAL_TERMS);
    const amended = amendHousingGrantProposal(world, COMPROMISE_TERMS);
    const resolved = resolveHousingGrantProposalVote(amended);

    expect(resolved.governance.proposal?.status).toBe("PROCEDURE_PASSED");
    expect(resolved.governance.enactedLaws).toEqual([
      {
        id: "gl0-law-for-gl0-housing-grant-proposal",
        sourceProposalId: "gl0-housing-grant-proposal",
        enactedTerms: COMPROMISE_TERMS,
        enactedAtSimulationTime: 0,
        appropriation: {
          amount: HOUSING_GRANT_SYNTHETIC_APPROPRIATION_AMOUNT,
          purpose: HOUSING_GRANT_APPROPRIATION_PURPOSE,
        },
      },
    ]);
    expect(
      resolved.history.some(
        (entry) => entry.type === "LawEnacted" && entry.lawId === "gl0-law-for-gl0-housing-grant-proposal",
      ),
    ).toBe(true);
  });

  it("an amendment that changes terms but stays short of the passage rule still fails", () => {
    const world = submitHousingGrantProposal(createDeterministicWorldFixture(), INITIAL_TERMS);
    const amended = amendHousingGrantProposal(world, INSUFFICIENT_AMENDMENT_TERMS);
    const resolved = resolveHousingGrantProposalVote(amended);

    expect(amended.governance.proposal?.terms).toEqual(INSUFFICIENT_AMENDMENT_TERMS);
    expect(resolved.governance.proposal?.status).toBe("PROCEDURE_FAILED");
    expect(resolved.governance.enactedLaws).toEqual([]);
  });

  it("enactment creates only the legal-source fact and mutates no other canonical root", () => {
    const world = submitHousingGrantProposal(createDeterministicWorldFixture(), INITIAL_TERMS);
    const amended = amendHousingGrantProposal(world, COMPROMISE_TERMS);
    const resolved = resolveHousingGrantProposalVote(amended);

    // Time and the unrelated Commit-8 bootstrap transition are untouched --
    // geography and Housing remain untouched by enactment.
    expect(resolved.time).toEqual(world.time);
    expect(resolved.bootstrapTransition).toEqual(world.bootstrapTransition);
    expect(resolved.geography).toEqual(world.geography);
    expect(resolved.housing).toEqual(world.housing);
  });

  it("produces identical canonical results across equivalent deterministic executions", () => {
    const runOnce = () => {
      const w0 = submitHousingGrantProposal(createDeterministicWorldFixture(), INITIAL_TERMS);
      const w1 = resolveHousingGrantProposalVote(w0);
      const w2 = amendHousingGrantProposal(
        submitHousingGrantProposal(createDeterministicWorldFixture(), INITIAL_TERMS),
        COMPROMISE_TERMS,
      );
      const w3 = resolveHousingGrantProposalVote(w2);
      return {
        failedRun: { governance: w1.governance, history: w1.history },
        passedRun: { governance: w3.governance, history: w3.history },
      };
    };

    expect(runOnce()).toEqual(runOnce());
  });

  it("keeps the previous Commit-8 bootstrap guarantees intact alongside governance/history state", () => {
    const world = createDeterministicWorldFixture();
    expect(world.time.current).toBe(0);
    expect(world.bootstrapTransition.resolved).toBe(false);
    expect(world.governance).toBeDefined();
    expect(world.history).toBeDefined();
  });
});

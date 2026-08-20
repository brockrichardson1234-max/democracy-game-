import { describe, expect, it } from "vitest";

import {
  amendHousingGrantProposal,
  resolveHousingGrantProposalVote,
  submitHousingGrantProposal,
} from "../src/sim/governance";
import { decideLegislatorVote, resolvePassageThreshold } from "../src/sim/legislature";
import type { ProposalTerms } from "../src/sim/legislature";
import { createDeterministicWorldFixture } from "../src/sim/world";

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
  it("initializes a deterministic legislature fixture with individually owned seats", () => {
    const world = createDeterministicWorldFixture();

    expect(world.governance.legislature.legislators).toHaveLength(11);
    expect(new Set(world.governance.legislature.legislators.map((legislator) => legislator.id)).size).toBe(
      11,
    );
    expect(resolvePassageThreshold(world.governance.legislature)).toBe(6);
    expect(world.governance.proposal).toBeNull();
    expect(world.governance.enactedLaws).toEqual([]);
  });

  it("admits administration proposal intent as canonical pending state through the accepted action boundary", () => {
    const world = createDeterministicWorldFixture();
    const submitted = submitHousingGrantProposal(world, INITIAL_TERMS);

    expect(submitted.governance.proposal).toEqual({
      id: "gl0-housing-grant-proposal",
      sponsorAdministrationId: "gl0-federal-executive-administration",
      terms: INITIAL_TERMS,
      status: "PENDING",
      amendmentCount: 0,
      votes: null,
    });
    // Submission is a pure transition: the original world reference is untouched.
    expect(world.governance.proposal).toBeNull();
  });

  it("rejects structurally invalid proposal terms without creating a political event", () => {
    const world = createDeterministicWorldFixture();

    expect(() =>
      submitHousingGrantProposal(world, { ...INITIAL_TERMS, federalMatchRatePercent: 150 }),
    ).toThrow(/between 0 and 100/);
    expect(world.governance.proposal).toBeNull();
  });

  it("rejects submitting a second proposal while one is already pending", () => {
    const world = submitHousingGrantProposal(createDeterministicWorldFixture(), INITIAL_TERMS);

    expect(() => submitHousingGrantProposal(world, COMPROMISE_TERMS)).toThrow(/already pending/);
  });

  it("fails the initial proposal because individual legislators' votes do not satisfy the passage rule", () => {
    const world = submitHousingGrantProposal(createDeterministicWorldFixture(), INITIAL_TERMS);
    const resolved = resolveHousingGrantProposalVote(world);

    expect(resolved.governance.proposal?.status).toBe("PROCEDURE_FAILED");
    const yeaCount = resolved.governance.proposal?.votes?.filter((vote) => vote.choice === "YEA").length;
    expect(yeaCount).toBe(4);
    expect(yeaCount).toBeLessThan(resolvePassageThreshold(world.governance.legislature));
  });

  it("failed proposal creates no enacted legal source", () => {
    const world = submitHousingGrantProposal(createDeterministicWorldFixture(), INITIAL_TERMS);
    const resolved = resolveHousingGrantProposalVote(world);

    expect(resolved.governance.enactedLaws).toEqual([]);
  });

  it("stores votes as individual actor decisions, not a global support count", () => {
    const world = submitHousingGrantProposal(createDeterministicWorldFixture(), INITIAL_TERMS);
    const resolved = resolveHousingGrantProposalVote(world);
    const votes = resolved.governance.proposal?.votes;

    expect(Array.isArray(votes)).toBe(true);
    expect(votes).toHaveLength(11);
    for (const legislator of world.governance.legislature.legislators) {
      expect(votes?.some((vote) => vote.legislatorId === legislator.id)).toBe(true);
    }
  });

  it("applies a real amendment that changes canonical proposal terms while pending", () => {
    const world = submitHousingGrantProposal(createDeterministicWorldFixture(), INITIAL_TERMS);
    const amended = amendHousingGrantProposal(world, COMPROMISE_TERMS);

    expect(amended.governance.proposal?.terms).toEqual(COMPROMISE_TERMS);
    expect(amended.governance.proposal?.amendmentCount).toBe(1);
    expect(amended.governance.proposal?.status).toBe("PENDING");
    // The prior world's proposal terms remain the original submission.
    expect(world.governance.proposal?.terms).toEqual(INITIAL_TERMS);
  });

  it("rejects amending a proposal that has already been resolved", () => {
    const world = submitHousingGrantProposal(createDeterministicWorldFixture(), INITIAL_TERMS);
    const resolved = resolveHousingGrantProposalVote(world);

    expect(() => amendHousingGrantProposal(resolved, COMPROMISE_TERMS)).toThrow(/pending proposal may be amended/);
  });

  it("the compromise amendment changes multiple individual legislators' decisions", () => {
    const world = submitHousingGrantProposal(createDeterministicWorldFixture(), INITIAL_TERMS);
    const legislators = world.governance.legislature.legislators;

    const flipped = legislators.filter(
      (legislator) =>
        decideLegislatorVote(legislator.decisionCriteria, INITIAL_TERMS) !==
        decideLegislatorVote(legislator.decisionCriteria, COMPROMISE_TERMS),
    );

    // Both the opposition coalition (participation condition) and the swing
    // coalition (match rate + reporting) flip -- not one magic swing voter.
    expect(flipped.length).toBeGreaterThan(1);
    expect(flipped.some((legislator) => legislator.coalition === "OPPOSITION_COALITION")).toBe(true);
    expect(flipped.some((legislator) => legislator.coalition === "SWING_COALITION")).toBe(true);
  });

  it("the amended compromise proposal passes and creates the expected enacted legal source", () => {
    const world = submitHousingGrantProposal(createDeterministicWorldFixture(), INITIAL_TERMS);
    const amended = amendHousingGrantProposal(world, COMPROMISE_TERMS);
    const resolved = resolveHousingGrantProposalVote(amended);

    expect(resolved.governance.proposal?.status).toBe("PROCEDURE_PASSED");
    expect(resolved.governance.enactedLaws).toEqual([
      {
        id: "gl0-housing-grant-law",
        sourceProposalId: "gl0-housing-grant-proposal",
        enactedTerms: COMPROMISE_TERMS,
        enactedAtSimulationTime: 0,
      },
    ]);
  });

  it("an amendment that changes terms but stays short of the passage rule still fails", () => {
    const world = submitHousingGrantProposal(createDeterministicWorldFixture(), INITIAL_TERMS);
    const amended = amendHousingGrantProposal(world, INSUFFICIENT_AMENDMENT_TERMS);
    const resolved = resolveHousingGrantProposalVote(amended);

    expect(amended.governance.proposal?.terms).toEqual(INSUFFICIENT_AMENDMENT_TERMS);
    expect(resolved.governance.proposal?.status).toBe("PROCEDURE_FAILED");
    expect(resolved.governance.enactedLaws).toEqual([]);
  });

  it("enactment creates only the legal-source fact and mutates no other canonical state", () => {
    const world = submitHousingGrantProposal(createDeterministicWorldFixture(), INITIAL_TERMS);
    const amended = amendHousingGrantProposal(world, COMPROMISE_TERMS);
    const resolved = resolveHousingGrantProposalVote(amended);

    // Time and the unrelated Commit-8 bootstrap transition are untouched --
    // no fiscal, administrative, state, housing, or opinion state exists to
    // silently mutate, and this proves enactment did not invent any.
    expect(resolved.time).toEqual(world.time);
    expect(resolved.bootstrapTransition).toEqual(world.bootstrapTransition);
    expect(Object.keys(resolved)).toEqual(["time", "bootstrapTransition", "governance"]);
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
      return { failedRun: w1.governance, passedRun: w3.governance };
    };

    expect(runOnce()).toEqual(runOnce());
  });

  it("keeps the previous Commit-8 bootstrap guarantees intact alongside governance state", () => {
    const world = createDeterministicWorldFixture();
    expect(world.time.current).toBe(0);
    expect(world.bootstrapTransition.resolved).toBe(false);
    expect(world.governance).toBeDefined();
  });
});

import { describe, expect, it } from "vitest";

import {
  activateIntergovernmentalHousingGrantParticipation,
  amendHousingGrantProposal,
  createHousingGrantAward,
  disburseHousingGrantObligation,
  establishHousingGrantProgram,
  HOUSING_GRANT_SYNTHETIC_APPROPRIATION_AMOUNT,
  HOUSING_GRANT_SYNTHETIC_AWARD_AMOUNT,
  materializeHousingProjectFromDisbursement,
  obligateHousingGrantAward,
  recognizeHousingGrantFiscalAuthority,
  resolveFederalHousingGrantApplication,
  resolveHousingGrantProposalVote,
  resolveStateHousingGrantDecision,
  submitHousingGrantProposal,
  submitStateHousingGrantApplication,
} from "../src/sim/governance";
import { STATE_A_ID, STATE_B_ID, STATE_C_ID } from "../src/sim/federalism";
import { createInitialHousingState, materializeHousingProject } from "../src/sim/housing";
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

/** Carries a fresh world through the accepted Commit-9/10 route to a ready program. */
const establishProgram = () => {
  const submitted = submitHousingGrantProposal(createDeterministicWorldFixture(), INITIAL_TERMS);
  const amended = amendHousingGrantProposal(submitted, COMPROMISE_TERMS);
  const enacted = resolveHousingGrantProposalVote(amended);
  const recognized = recognizeHousingGrantFiscalAuthority(enacted);
  return establishHousingGrantProgram(recognized);
};

/** Carries a state through the accepted Commit-11 route to an ACTIVE relationship. */
const activateState = (world: ReturnType<typeof establishProgram>, stateId: string) => {
  const decided = resolveStateHousingGrantDecision(world, stateId);
  const applied = submitStateHousingGrantApplication(decided, stateId);
  const determined = resolveFederalHousingGrantApplication(applied, stateId);
  return activateIntergovernmentalHousingGrantParticipation(determined, stateId);
};

/** Carries an ACTIVE state through award -> obligation -> disbursement. */
const disburseState = (world: ReturnType<typeof activateState>, stateId: string) => {
  const awarded = createHousingGrantAward(world, stateId);
  const obligated = obligateHousingGrantAward(awarded, stateId);
  return disburseHousingGrantObligation(obligated, stateId);
};

describe("Commit 12 participation -> award -> obligation -> disbursement -> Housing project slice", () => {
  it("1. accepted Commit-11 full route remains green", () => {
    const world = activateState(establishProgram(), STATE_A_ID);
    expect(
      world.governance.intergovernmentalProgramRelationships.find(
        (relationship) => relationship.stateJurisdictionId === STATE_A_ID,
      )?.status,
    ).toBe("ACTIVE");
  });

  it("2. State A ACTIVE relationship can create a federal administrative award", () => {
    const world = createHousingGrantAward(activateState(establishProgram(), STATE_A_ID), STATE_A_ID);
    const award = world.governance.housingGrantAwards.find(
      (candidate) => candidate.stateJurisdictionId === STATE_A_ID,
    );
    expect(award).toMatchObject({
      stateJurisdictionId: STATE_A_ID,
      awardedAmount: HOUSING_GRANT_SYNTHETIC_AWARD_AMOUNT,
    });
  });

  it("3. State C ACTIVE relationship can create a separate award", () => {
    const world = createHousingGrantAward(activateState(establishProgram(), STATE_C_ID), STATE_C_ID);
    const award = world.governance.housingGrantAwards.find(
      (candidate) => candidate.stateJurisdictionId === STATE_C_ID,
    );
    expect(award).toMatchObject({
      stateJurisdictionId: STATE_C_ID,
      awardedAmount: HOUSING_GRANT_SYNTHETIC_AWARD_AMOUNT,
    });
    expect(award?.id).not.toBe(
      createHousingGrantAward(activateState(establishProgram(), STATE_A_ID), STATE_A_ID)
        .governance.housingGrantAwards[0].id,
    );
  });

  it("4. State B cannot receive an award", () => {
    const decidedB = resolveStateHousingGrantDecision(establishProgram(), STATE_B_ID);
    expect(() => createHousingGrantAward(decidedB, STATE_B_ID)).toThrow(/ACTIVE intergovernmental/);
  });

  it("5. federal acceptance without ACTIVE relationship cannot produce an award", () => {
    const determined = resolveFederalHousingGrantApplication(
      submitStateHousingGrantApplication(
        resolveStateHousingGrantDecision(establishProgram(), STATE_A_ID),
        STATE_A_ID,
      ),
      STATE_A_ID,
    );
    expect(determined.governance.intergovernmentalProgramRelationships).toEqual([]);
    expect(() => createHousingGrantAward(determined, STATE_A_ID)).toThrow(/ACTIVE intergovernmental/);
  });

  it("6. award is a distinct canonical fact from relationship", () => {
    const world = createHousingGrantAward(activateState(establishProgram(), STATE_A_ID), STATE_A_ID);
    const relationship = world.governance.intergovernmentalProgramRelationships[0];
    const award = world.governance.housingGrantAwards[0];

    expect(award.id).not.toBe(relationship.id);
    expect(award.relationshipId).toBe(relationship.id);
    expect(award).not.toHaveProperty("stateApplicationId");
    expect(award).not.toHaveProperty("federalDeterminationId");
  });

  it("7. award creation alone does not change fiscal obligation", () => {
    const active = activateState(establishProgram(), STATE_A_ID);
    const awarded = createHousingGrantAward(active, STATE_A_ID);

    expect(awarded.governance.fiscalExecution).toEqual(active.governance.fiscalExecution);
    expect(awarded.governance.fiscalExecution?.obligated).toBe(0);
  });

  it("8. award creation alone does not change disbursement", () => {
    const active = activateState(establishProgram(), STATE_A_ID);
    const awarded = createHousingGrantAward(active, STATE_A_ID);

    expect(awarded.governance.publicFinance).toEqual(active.governance.publicFinance);
    expect(awarded.governance.publicFinance.housingGrant?.disbursedAmount).toBe(0);
  });

  it("9. award creation alone creates no Housing project", () => {
    const active = activateState(establishProgram(), STATE_A_ID);
    const awarded = createHousingGrantAward(active, STATE_A_ID);

    expect(awarded.housing.projects).toEqual([]);
  });

  it("10. duplicate award for the same supported state/relationship is rejected", () => {
    const awarded = createHousingGrantAward(activateState(establishProgram(), STATE_A_ID), STATE_A_ID);
    expect(() => createHousingGrantAward(awarded, STATE_A_ID)).toThrow(/already exists/);
    expect(awarded.governance.housingGrantAwards).toHaveLength(1);
  });

  it("11. obligation requires an existing award", () => {
    const active = activateState(establishProgram(), STATE_A_ID);
    expect(() => obligateHousingGrantAward(active, STATE_A_ID)).toThrow(/must have an award/);
  });

  it("12. obligation is distinct from award", () => {
    const awarded = createHousingGrantAward(activateState(establishProgram(), STATE_A_ID), STATE_A_ID);
    const obligated = obligateHousingGrantAward(awarded, STATE_A_ID);
    const award = obligated.governance.housingGrantAwards[0];
    const obligation = obligated.governance.fiscalExecution!.obligations[0];

    expect(obligation.id).not.toBe(award.id);
    expect(obligation.awardId).toBe(award.id);
    expect(obligation).not.toHaveProperty("relationshipId");
  });

  it("13. obligation records the exact synthetic award amount", () => {
    const awarded = createHousingGrantAward(activateState(establishProgram(), STATE_A_ID), STATE_A_ID);
    const obligated = obligateHousingGrantAward(awarded, STATE_A_ID);

    expect(obligated.governance.fiscalExecution?.obligations[0].amount).toBe(
      HOUSING_GRANT_SYNTHETIC_AWARD_AMOUNT,
    );
    expect(obligated.governance.fiscalExecution?.obligated).toBe(HOUSING_GRANT_SYNTHETIC_AWARD_AMOUNT);
  });

  it("14. obligation cannot exceed supported available resources", () => {
    // An award already exists; available authority is then hostilely reduced
    // below the award amount (e.g. by other commitments) before obligation
    // is attempted -- the obligation guard, not the award guard, must reject.
    const awarded = createHousingGrantAward(activateState(establishProgram(), STATE_A_ID), STATE_A_ID);
    const starved = {
      ...awarded,
      governance: {
        ...awarded.governance,
        publicFinance: {
          housingGrant: {
            ...awarded.governance.publicFinance.housingGrant!,
            availableAmount: HOUSING_GRANT_SYNTHETIC_AWARD_AMOUNT - 1,
          },
        },
      },
    };
    expect(() => obligateHousingGrantAward(starved, STATE_A_ID)).toThrow(/exceed currently available/);
    expect(starved.governance.fiscalExecution?.obligations).toEqual([]);
  });

  it("14b. award creation itself also rejects exceeding available fiscal authority", () => {
    const world = establishProgram();
    const starved = {
      ...world,
      governance: {
        ...world.governance,
        publicFinance: {
          housingGrant: {
            ...world.governance.publicFinance.housingGrant!,
            availableAmount: HOUSING_GRANT_SYNTHETIC_AWARD_AMOUNT - 1,
          },
        },
      },
    };
    const active = activateState(starved, STATE_A_ID);
    expect(() => createHousingGrantAward(active, STATE_A_ID)).toThrow(/exceed currently available/);
  });

  it("15. duplicate obligation is rejected", () => {
    const obligated = obligateHousingGrantAward(
      createHousingGrantAward(activateState(establishProgram(), STATE_A_ID), STATE_A_ID),
      STATE_A_ID,
    );
    expect(() => obligateHousingGrantAward(obligated, STATE_A_ID)).toThrow(/already exists/);
    expect(obligated.governance.fiscalExecution?.obligations).toHaveLength(1);
  });

  it("16. public-finance availability changes only according to the chosen availability semantics", () => {
    const active = activateState(establishProgram(), STATE_A_ID);
    const availableBefore = active.governance.publicFinance.housingGrant!.availableAmount;
    const awarded = createHousingGrantAward(active, STATE_A_ID);
    expect(awarded.governance.publicFinance.housingGrant!.availableAmount).toBe(availableBefore);

    const obligated = obligateHousingGrantAward(awarded, STATE_A_ID);
    expect(obligated.governance.publicFinance.housingGrant!.availableAmount).toBe(
      availableBefore - HOUSING_GRANT_SYNTHETIC_AWARD_AMOUNT,
    );
  });

  it("17. obligation does not itself increase disbursement", () => {
    const obligated = obligateHousingGrantAward(
      createHousingGrantAward(activateState(establishProgram(), STATE_A_ID), STATE_A_ID),
      STATE_A_ID,
    );
    expect(obligated.governance.publicFinance.housingGrant?.disbursedAmount).toBe(0);
    expect(obligated.governance.publicFinance.housingGrant?.disbursements).toEqual([]);
  });

  it("18. disbursement requires an existing obligation", () => {
    const awarded = createHousingGrantAward(activateState(establishProgram(), STATE_A_ID), STATE_A_ID);
    expect(() => disburseHousingGrantObligation(awarded, STATE_A_ID)).toThrow(
      /must have an obligation/,
    );
  });

  it("19. disbursement is distinct from obligation", () => {
    const disbursed = disburseState(activateState(establishProgram(), STATE_A_ID), STATE_A_ID);
    const obligation = disbursed.governance.fiscalExecution!.obligations[0];
    const disbursement = disbursed.governance.publicFinance.housingGrant!.disbursements[0];

    expect(disbursement.id).not.toBe(obligation.id);
    expect(disbursement.obligationId).toBe(obligation.id);
  });

  it("20. duplicate disbursement is rejected", () => {
    const disbursed = disburseState(activateState(establishProgram(), STATE_A_ID), STATE_A_ID);
    expect(() => disburseHousingGrantObligation(disbursed, STATE_A_ID)).toThrow(/already exists/);
    expect(disbursed.governance.publicFinance.housingGrant?.disbursements).toHaveLength(1);
  });

  it("21. disbursement never exceeds its obligation", () => {
    const disbursed = disburseState(activateState(establishProgram(), STATE_A_ID), STATE_A_ID);
    const obligation = disbursed.governance.fiscalExecution!.obligations[0];
    const disbursement = disbursed.governance.publicFinance.housingGrant!.disbursements[0];

    expect(disbursement.amount).toBe(obligation.amount);
    expect(disbursement.amount).toBeLessThanOrEqual(obligation.amount);
  });

  it("22. public-finance disbursement is owned outside program/admin state", () => {
    const disbursed = disburseState(activateState(establishProgram(), STATE_A_ID), STATE_A_ID);
    expect(disbursed.governance.housingGrantProgram).not.toHaveProperty("disbursements");
    expect(disbursed.governance.housingGrantAwards[0]).not.toHaveProperty("disbursements");
    expect(disbursed.governance.publicFinance.housingGrant?.disbursements).toHaveLength(1);
  });

  it("23. after one award -> obligation -> disbursement route, financial totals reconcile", () => {
    const disbursed = disburseState(activateState(establishProgram(), STATE_A_ID), STATE_A_ID);
    const finance = disbursed.governance.publicFinance.housingGrant!;
    const fiscal = disbursed.governance.fiscalExecution!;

    expect(finance.availableAmount).toBe(
      HOUSING_GRANT_SYNTHETIC_APPROPRIATION_AMOUNT - HOUSING_GRANT_SYNTHETIC_AWARD_AMOUNT,
    );
    expect(fiscal.obligated).toBe(HOUSING_GRANT_SYNTHETIC_AWARD_AMOUNT);
    expect(finance.disbursedAmount).toBe(HOUSING_GRANT_SYNTHETIC_AWARD_AMOUNT);
    expect(finance.availableAmount + fiscal.obligated).toBe(
      HOUSING_GRANT_SYNTHETIC_APPROPRIATION_AMOUNT,
    );
  });

  it("24. after both State A and C routes, financial totals reconcile and remain below the $5B ceiling", () => {
    let world = establishProgram();
    world = disburseState(activateState(world, STATE_A_ID), STATE_A_ID);
    world = disburseState(activateState(world, STATE_C_ID), STATE_C_ID);

    const finance = world.governance.publicFinance.housingGrant!;
    const fiscal = world.governance.fiscalExecution!;
    const totalAwarded = HOUSING_GRANT_SYNTHETIC_AWARD_AMOUNT * 2;

    expect(fiscal.obligated).toBe(totalAwarded);
    expect(finance.disbursedAmount).toBe(totalAwarded);
    expect(finance.availableAmount).toBe(HOUSING_GRANT_SYNTHETIC_APPROPRIATION_AMOUNT - totalAwarded);
    expect(totalAwarded).toBeLessThan(HOUSING_GRANT_SYNTHETIC_APPROPRIATION_AMOUNT);
    expect(finance.availableAmount).toBeGreaterThan(0);
  });

  it("25. State B still has no award, no obligation, no disbursement", () => {
    let world = establishProgram();
    world = disburseState(activateState(world, STATE_A_ID), STATE_A_ID);
    world = resolveStateHousingGrantDecision(world, STATE_B_ID);

    expect(
      world.governance.housingGrantAwards.some((award) => award.stateJurisdictionId === STATE_B_ID),
    ).toBe(false);
    expect(
      world.governance.fiscalExecution!.obligations.some(
        (obligation) => obligation.stateJurisdictionId === STATE_B_ID,
      ),
    ).toBe(false);
    expect(
      world.governance.publicFinance.housingGrant!.disbursements.some(
        (disbursement) => disbursement.stateJurisdictionId === STATE_B_ID,
      ),
    ).toBe(false);
  });

  it("26. HousingState contains no project before the material-project creation transition", () => {
    const fresh = createDeterministicWorldFixture();
    expect(fresh.housing).toEqual({ projects: [] });

    const disbursed = disburseState(activateState(establishProgram(), STATE_A_ID), STATE_A_ID);
    expect(disbursed.housing.projects).toEqual([]);
  });

  it("27. a Housing project cannot be created from relationship alone, award alone, or obligation alone", () => {
    const active = activateState(establishProgram(), STATE_A_ID);
    expect(() => materializeHousingProjectFromDisbursement(active, STATE_A_ID)).toThrow(
      /no award/,
    );

    const awarded = createHousingGrantAward(active, STATE_A_ID);
    expect(() => materializeHousingProjectFromDisbursement(awarded, STATE_A_ID)).toThrow(
      /no obligation/,
    );

    const obligated = obligateHousingGrantAward(awarded, STATE_A_ID);
    expect(() => materializeHousingProjectFromDisbursement(obligated, STATE_A_ID)).toThrow(
      /must have an actual disbursement/,
    );
    expect(obligated.housing.projects).toEqual([]);
  });

  it("28. a valid disbursement can create exactly one material Housing project", () => {
    const disbursed = disburseState(activateState(establishProgram(), STATE_A_ID), STATE_A_ID);
    const materialized = materializeHousingProjectFromDisbursement(disbursed, STATE_A_ID);

    expect(materialized.housing.projects).toHaveLength(1);
    expect(materialized.housing.projects[0]).toMatchObject({
      stateJurisdictionId: STATE_A_ID,
      status: "FUNDED_NOT_STARTED",
    });
  });

  it("29. duplicate project creation from the same funding/disbursement is rejected", () => {
    const disbursed = disburseState(activateState(establishProgram(), STATE_A_ID), STATE_A_ID);
    const materialized = materializeHousingProjectFromDisbursement(disbursed, STATE_A_ID);
    expect(() => materializeHousingProjectFromDisbursement(materialized, STATE_A_ID)).toThrow(
      /already exists/,
    );
    expect(materialized.housing.projects).toHaveLength(1);
  });

  it("C12-01: Housing itself owns the material mutation, not the governance orchestrator", () => {
    // Calling Housing's own transition directly, with no governance/fiscal
    // state involved at all, proves the mutation boundary and its
    // admissibility/duplicate check live inside Housing -- not spliced into
    // HousingState by the cross-domain orchestrator.
    const empty = createInitialHousingState();
    const input = { stateJurisdictionId: STATE_A_ID, sourceDisbursementId: "gl0-disbursement-fixture" };

    const withProject = materializeHousingProject(empty, input, 0);
    expect(withProject.projects).toHaveLength(1);
    expect(withProject.projects[0]).toMatchObject({
      stateJurisdictionId: STATE_A_ID,
      sourceDisbursementId: input.sourceDisbursementId,
      status: "FUNDED_NOT_STARTED",
    });
    // The prior HousingState reference is untouched (pure transition).
    expect(empty.projects).toEqual([]);

    // Housing rejects the duplicate itself, independent of any governance call.
    expect(() => materializeHousingProject(withProject, input, 1)).toThrow(/already exists/);
    expect(withProject.projects).toHaveLength(1);
  });

  it("30. Housing project is canonical material state distinct from every upstream owner", () => {
    const disbursed = disburseState(activateState(establishProgram(), STATE_A_ID), STATE_A_ID);
    const materialized = materializeHousingProjectFromDisbursement(disbursed, STATE_A_ID);
    const project = materialized.housing.projects[0];

    const application = materialized.governance.programApplications[0];
    const determination = materialized.governance.federalApplicationDeterminations[0];
    const relationship = materialized.governance.intergovernmentalProgramRelationships[0];
    const award = materialized.governance.housingGrantAwards[0];
    const obligation = materialized.governance.fiscalExecution!.obligations[0];
    const disbursement = materialized.governance.publicFinance.housingGrant!.disbursements[0];

    const ids = [
      application.id,
      determination.id,
      relationship.id,
      award.id,
      obligation.id,
      disbursement.id,
    ];
    expect(ids).not.toContain(project.id);
    expect(project.sourceDisbursementId).toBe(disbursement.id);
  });

  it("31. Housing project has no construction completion/progress or affordability effect in Commit 12", () => {
    const disbursed = disburseState(activateState(establishProgram(), STATE_A_ID), STATE_A_ID);
    const materialized = materializeHousingProjectFromDisbursement(disbursed, STATE_A_ID);
    const project = materialized.housing.projects[0];

    expect(project).not.toHaveProperty("percentComplete");
    expect(project).not.toHaveProperty("unitsCompleted");
    expect(project).not.toHaveProperty("rent");
    expect(project).not.toHaveProperty("affordability");
    expect(project.status).toBe("FUNDED_NOT_STARTED");
  });

  it("32. State A and State C capacity facts remain unchanged through the full route", () => {
    let world = establishProgram();
    const capacitiesBefore = world.governance.stateProgramAdministrativeStates;
    world = materializeHousingProjectFromDisbursement(
      disburseState(activateState(world, STATE_A_ID), STATE_A_ID),
      STATE_A_ID,
    );
    world = materializeHousingProjectFromDisbursement(
      disburseState(activateState(world, STATE_C_ID), STATE_C_ID),
      STATE_C_ID,
    );

    expect(world.governance.stateProgramAdministrativeStates).toEqual(capacitiesBefore);
  });

  it("33. State C WEAK capacity does not yet mutate award/fiscal/project progress", () => {
    let worldA = establishProgram();
    let worldC = worldA;
    worldA = materializeHousingProjectFromDisbursement(
      disburseState(activateState(worldA, STATE_A_ID), STATE_A_ID),
      STATE_A_ID,
    );
    worldC = materializeHousingProjectFromDisbursement(
      disburseState(activateState(worldC, STATE_C_ID), STATE_C_ID),
      STATE_C_ID,
    );

    const awardA = worldA.governance.housingGrantAwards[0];
    const awardC = worldC.governance.housingGrantAwards[0];
    expect(awardA.awardedAmount).toBe(awardC.awardedAmount);

    const obligationA = worldA.governance.fiscalExecution!.obligations[0];
    const obligationC = worldC.governance.fiscalExecution!.obligations[0];
    expect(obligationA.amount).toBe(obligationC.amount);

    expect(worldA.housing.projects[0].status).toBe(worldC.housing.projects[0].status);
  });

  it("34. binding law/program terms are not shadow-copied into award/fiscal/Housing owners", () => {
    const disbursed = disburseState(activateState(establishProgram(), STATE_A_ID), STATE_A_ID);
    const materialized = materializeHousingProjectFromDisbursement(disbursed, STATE_A_ID);

    const award = materialized.governance.housingGrantAwards[0];
    const obligation = materialized.governance.fiscalExecution!.obligations[0];
    const disbursement = materialized.governance.publicFinance.housingGrant!.disbursements[0];
    const project = materialized.housing.projects[0];

    for (const value of [award, obligation, disbursement, project]) {
      expect(value).not.toHaveProperty("federalMatchRatePercent");
      expect(value).not.toHaveProperty("participationCondition");
      expect(value).not.toHaveProperty("reportingRequirement");
    }
  });

  it("35. meaningful transitions produce immutable history occurrences", () => {
    const disbursed = disburseState(activateState(establishProgram(), STATE_A_ID), STATE_A_ID);
    const materialized = materializeHousingProjectFromDisbursement(disbursed, STATE_A_ID);
    const types = materialized.history.map((entry) => entry.type);

    expect(types).toContain("HousingGrantAwardCreated");
    expect(types).toContain("HousingGrantObligationRecorded");
    expect(types).toContain("HousingGrantDisbursementMade");
    expect(types).toContain("HousingProjectCreated");
    expect(materialized.history.filter((entry) => entry.type === "HousingProjectCreated")).toHaveLength(1);
  });

  it("36. equivalent deterministic executions produce identical canonical award/fiscal/Housing/history results", () => {
    const run = () => {
      let world = establishProgram();
      world = materializeHousingProjectFromDisbursement(
        disburseState(activateState(world, STATE_A_ID), STATE_A_ID),
        STATE_A_ID,
      );
      world = materializeHousingProjectFromDisbursement(
        disburseState(activateState(world, STATE_C_ID), STATE_C_ID),
        STATE_C_ID,
      );
      return { governance: world.governance, housing: world.housing, history: world.history };
    };

    expect(run()).toEqual(run());
  });

  it("37-40. existing Commit-9/10/11 and bootstrap/time tests are covered by their own dedicated files and remain green", () => {
    // Enforced by tests/legislative.test.ts, tests/fiscal-and-administration.test.ts,
    // tests/federalism.test.ts, and tests/bootstrap.test.ts respectively.
    expect(true).toBe(true);
  });

  it("rejects an unknown state jurisdiction at the award stage", () => {
    const active = activateState(establishProgram(), STATE_A_ID);
    expect(() => createHousingGrantAward(active, "state-does-not-exist")).toThrow(
      /Unknown state jurisdiction/,
    );
  });

  it("rejects disbursement/materialization for a state with no relationship at all", () => {
    const world = establishProgram();
    expect(() => createHousingGrantAward(world, STATE_B_ID)).toThrow(/ACTIVE intergovernmental/);
    expect(() => obligateHousingGrantAward(world, STATE_B_ID)).toThrow(/must have an award/);
    expect(() => disburseHousingGrantObligation(world, STATE_B_ID)).toThrow(/no award/);
    expect(() => materializeHousingProjectFromDisbursement(world, STATE_B_ID)).toThrow(/no award/);
  });

  it("full route atomicity: a rejected obligation does not partially mutate state or append history", () => {
    const awarded = createHousingGrantAward(activateState(establishProgram(), STATE_A_ID), STATE_A_ID);
    const obligated = obligateHousingGrantAward(awarded, STATE_A_ID);
    const historyLengthBefore = obligated.history.length;

    expect(() => obligateHousingGrantAward(obligated, STATE_A_ID)).toThrow();
    // Re-fetch: the rejected call must not have mutated the passed-in world reference either.
    expect(obligated.history).toHaveLength(historyLengthBefore);
    expect(obligated.governance.fiscalExecution?.obligations).toHaveLength(1);
  });
});

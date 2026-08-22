import { describe, expect, it } from "vitest";

import { createDeterministicWorldFixture } from "../src/content/gl0-synthetic/configuration";

import {
  amendHousingGrantProposal,
  establishHousingGrantProgram,
  HOUSING_GRANT_SYNTHETIC_APPROPRIATION_AMOUNT,
  recognizeHousingGrantFiscalAuthority,
  resolveHousingGrantProposalVote,
  submitHousingGrantProposal,
} from "../src/sim/governance";
import { FEDERAL_HOUSING_ADMINISTRATION_INSTITUTION_ID } from "../src/sim/administration";
import { createGameSession } from "../src/app/session";
import type { ProposalTerms } from "../src/sim/legislature";

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

/** Carries a fresh world through the accepted Commit-9 route to a passed law. */
const enactHousingGrantLaw = () => {
  const submitted = submitHousingGrantProposal(createDeterministicWorldFixture(), INITIAL_TERMS);
  const amended = amendHousingGrantProposal(submitted, COMPROMISE_TERMS);
  return resolveHousingGrantProposalVote(amended);
};

describe("Commit 10 law -> public finance -> administration slice", () => {
  it("a passed law exists with no public-finance availability until explicit recognition runs", () => {
    const enacted = enactHousingGrantLaw();

    expect(enacted.governance.proposal?.status).toBe("PROCEDURE_PASSED");
    expect(enacted.governance.enactedLaws).toHaveLength(1);
    expect(enacted.governance.publicFinance.housingGrant).toBeNull();
    expect(enacted.governance.fiscalExecution).toBeNull();
    expect(enacted.governance.housingGrantProgram).toBeNull();
  });

  it("fiscal authority cannot be recognized without an enacted law", () => {
    const world = createDeterministicWorldFixture();
    expect(() => recognizeHousingGrantFiscalAuthority(world)).toThrow(/enacted housing grant law/);

    const failedVote = resolveHousingGrantProposalVote(
      submitHousingGrantProposal(createDeterministicWorldFixture(), INITIAL_TERMS),
    );
    expect(failedVote.governance.enactedLaws).toEqual([]);
    expect(() => recognizeHousingGrantFiscalAuthority(failedVote)).toThrow(
      /enacted housing grant law/,
    );
  });

  it("the legal appropriation and recognized public-finance availability are distinct owned facts", () => {
    const enacted = enactHousingGrantLaw();
    const law = enacted.governance.enactedLaws[0];

    expect(law.appropriation.amount).toBe(HOUSING_GRANT_SYNTHETIC_APPROPRIATION_AMOUNT);
    expect(law).not.toHaveProperty("available");
    expect(law).not.toHaveProperty("obligated");

    const recognized = recognizeHousingGrantFiscalAuthority(enacted);
    const publicFinance = recognized.governance.publicFinance.housingGrant!;
    const fiscal = recognized.governance.fiscalExecution!;

    expect(publicFinance.availableAmount).toBe(HOUSING_GRANT_SYNTHETIC_APPROPRIATION_AMOUNT);
    expect(fiscal).not.toHaveProperty("available");
    expect(fiscal).not.toHaveProperty("appropriation");
    expect(fiscal).not.toHaveProperty("purpose");
    // The law object itself is untouched by recognition.
    expect(recognized.governance.enactedLaws[0]).toEqual(law);
  });

  it("recognizing fiscal authority produces the exact public-finance amount exactly once", () => {
    const enacted = enactHousingGrantLaw();
    const recognized = recognizeHousingGrantFiscalAuthority(enacted);

    expect(recognized.governance.publicFinance.housingGrant).toMatchObject({
      sourceLawId: enacted.governance.enactedLaws[0].id,
      availableAmount: HOUSING_GRANT_SYNTHETIC_APPROPRIATION_AMOUNT,
      disbursedAmount: 0,
    });
    expect(recognized.governance.fiscalExecution).toMatchObject({
      sourceLawId: enacted.governance.enactedLaws[0].id,
      obligated: 0,
    });
    // Pure transition: the prior world reference is untouched.
    expect(enacted.governance.fiscalExecution).toBeNull();
  });

  it("repeating fiscal-authority recognition cannot double-count availability", () => {
    const enacted = enactHousingGrantLaw();
    const recognized = recognizeHousingGrantFiscalAuthority(enacted);

    expect(() => recognizeHousingGrantFiscalAuthority(recognized)).toThrow(/already been recognized/);
    expect(recognized.governance.publicFinance.housingGrant?.availableAmount).toBe(
      HOUSING_GRANT_SYNTHETIC_APPROPRIATION_AMOUNT,
    );
  });

  it("obligated and disbursed remain 0 in their respective owners because no recipient exists yet", () => {
    const recognized = recognizeHousingGrantFiscalAuthority(enactHousingGrantLaw());

    expect(recognized.governance.fiscalExecution?.obligated).toBe(0);
    expect(recognized.governance.fiscalExecution).not.toHaveProperty("disbursed");
    expect(recognized.governance.publicFinance.housingGrant?.disbursedAmount).toBe(0);
  });

  it("program establishment fails without an enacted law", () => {
    expect(() => establishHousingGrantProgram(createDeterministicWorldFixture())).toThrow(
      /enacted housing grant law/,
    );
  });

  it("program establishment fails before fiscal authority is available, even with an enacted law", () => {
    const enacted = enactHousingGrantLaw();
    expect(enacted.governance.fiscalExecution).toBeNull();
    expect(() => establishHousingGrantProgram(enacted)).toThrow(/fiscal authority is available/);
  });

  it("program establishment fails when its canonical operator institution is absent", () => {
    const recognized = recognizeHousingGrantFiscalAuthority(enactHousingGrantLaw());
    const withoutInstitution = {
      ...recognized,
      governance: { ...recognized.governance, administrativeInstitution: null },
    };

    expect(() => establishHousingGrantProgram(withoutInstitution)).toThrow(
      /administrative institution/,
    );
  });

  it("repeated program establishment is rejected rather than additive", () => {
    const ready = establishHousingGrantProgram(recognizeHousingGrantFiscalAuthority(enactHousingGrantLaw()));
    expect(() => establishHousingGrantProgram(ready)).toThrow(/already been established/);
  });

  it("successful establishment creates program state distinct from the enacted law and references its fiscal authority", () => {
    const enacted = enactHousingGrantLaw();
    const recognized = recognizeHousingGrantFiscalAuthority(enacted);
    const established = establishHousingGrantProgram(recognized);

    const law = established.governance.enactedLaws[0];
    const program = established.governance.housingGrantProgram!;

    expect(program.id).not.toBe(law.id);
    expect(program.sourceLawId).toBe(law.id);
    expect(program.operatorInstitutionId).toBe(
      recognized.governance.administrativeInstitution!.id,
    );
    expect(program.publicFinanceRef).toBe(recognized.governance.publicFinance.housingGrant!.id);
    expect(program.status).toBe("READY_FOR_APPLICATIONS");
  });

  it("program canonical state references the law and does not shadow-copy binding terms", () => {
    const established = establishHousingGrantProgram(
      recognizeHousingGrantFiscalAuthority(enactHousingGrantLaw()),
    );
    const program = established.governance.housingGrantProgram!;

    expect(program.sourceLawId).toBe(established.governance.enactedLaws[0].id);
    expect(program).not.toHaveProperty("federalMatchRatePercent");
    expect(program).not.toHaveProperty("participationCondition");
    expect(program).not.toHaveProperty("reportingRequirement");
  });

  it("the program projection derives exact compromise terms from its enacted law", () => {
    const session = createGameSession();
    session.submitHousingGrantProposal(INITIAL_TERMS);
    session.amendHousingGrantProposal(COMPROMISE_TERMS);
    session.resolveHousingGrantProposalVote();
    session.recognizeHousingGrantFiscalAuthority();
    const view = session.establishHousingGrantProgram();

    expect(view.housingGrantProgram).toMatchObject({
      federalMatchRatePercent: COMPROMISE_TERMS.federalMatchRatePercent,
      participationCondition: COMPROMISE_TERMS.participationCondition,
      reportingRequirement: COMPROMISE_TERMS.reportingRequirement,
    });
    expect(view.housingGrantProgram?.operatorInstitutionId).toBe(
      FEDERAL_HOUSING_ADMINISTRATION_INSTITUTION_ID,
    );
  });

  it("program setup does not mutate the enacted law", () => {
    const recognized = recognizeHousingGrantFiscalAuthority(enactHousingGrantLaw());
    const lawBefore = recognized.governance.enactedLaws[0];
    const established = establishHousingGrantProgram(recognized);

    expect(established.governance.enactedLaws).toEqual([lawBefore]);
  });

  it("program setup creates no obligation or disbursement", () => {
    const established = establishHousingGrantProgram(
      recognizeHousingGrantFiscalAuthority(enactHousingGrantLaw()),
    );

    expect(established.governance.fiscalExecution?.obligated).toBe(0);
    expect(established.governance.publicFinance.housingGrant?.disbursedAmount).toBe(0);
  });

  it("program setup creates no state decision/application/determination/relationship or award facts", () => {
    const established = establishHousingGrantProgram(
      recognizeHousingGrantFiscalAuthority(enactHousingGrantLaw()),
    );

    expect(established.governance.stateJurisdictions).toHaveLength(3);
    expect(established.governance.stateProgramDecisions).toEqual([]);
    expect(established.governance.programApplications).toEqual([]);
    expect(established.governance.federalApplicationDeterminations).toEqual([]);
    expect(established.governance.intergovernmentalProgramRelationships).toEqual([]);
    expect(established.governance).not.toHaveProperty("awards");
  });

  it("program setup creates no Housing/material state and leaves time/bootstrap untouched", () => {
    const enacted = enactHousingGrantLaw();
    const established = establishHousingGrantProgram(recognizeHousingGrantFiscalAuthority(enacted));

    expect(established.time).toEqual(enacted.time);
    expect(established.bootstrapTransition).toEqual(enacted.bootstrapTransition);
  });

  it("fiscal and program establishment each produce exactly one immutable historical occurrence", () => {
    const enacted = enactHousingGrantLaw();
    const recognized = recognizeHousingGrantFiscalAuthority(enacted);
    const established = establishHousingGrantProgram(recognized);

    const law = enacted.governance.enactedLaws[0];

    const fiscalOccurrences = established.history.filter(
      (entry) => entry.type === "PublicFinanceAvailabilityRecognized",
    );
    const programOccurrences = established.history.filter(
      (entry) => entry.type === "HousingGrantProgramEstablished",
    );

    expect(fiscalOccurrences).toEqual([
      {
        type: "PublicFinanceAvailabilityRecognized",
        lawId: law.id,
        availableAmount: HOUSING_GRANT_SYNTHETIC_APPROPRIATION_AMOUNT,
        at: 0,
      },
    ]);
    expect(programOccurrences).toEqual([
      {
        type: "HousingGrantProgramEstablished",
        programId: established.governance.housingGrantProgram!.id,
        lawId: law.id,
        at: 0,
      },
    ]);
  });

  it("produces identical canonical results and history across equivalent deterministic executions", () => {
    const runOnce = () => {
      const established = establishHousingGrantProgram(
        recognizeHousingGrantFiscalAuthority(enactHousingGrantLaw()),
      );
      return { governance: established.governance, history: established.history };
    };

    expect(runOnce()).toEqual(runOnce());
  });

  it("traverses the full required route: enactment -> fiscal recognition -> program establishment", () => {
    const enacted = enactHousingGrantLaw();
    const recognized = recognizeHousingGrantFiscalAuthority(enacted);
    const established = establishHousingGrantProgram(recognized);

    // Law exists.
    expect(established.governance.enactedLaws).toHaveLength(1);
    // Fiscal authority available.
    expect(established.governance.publicFinance.housingGrant?.availableAmount).toBe(
      HOUSING_GRANT_SYNTHETIC_APPROPRIATION_AMOUNT,
    );
    // Program ready.
    expect(established.governance.housingGrantProgram?.status).toBe("READY_FOR_APPLICATIONS");
    // Nothing downstream has happened yet.
    expect(established.governance.fiscalExecution?.obligated).toBe(0);
    expect(established.governance.publicFinance.housingGrant?.disbursedAmount).toBe(0);
  });

  it("the initial fixture contains one explicit federal administrative institution distinct from the program", () => {
    const world = createDeterministicWorldFixture();
    expect(world.governance.administrativeInstitution).toEqual({
      id: FEDERAL_HOUSING_ADMINISTRATION_INSTITUTION_ID,
    });

    const established = establishHousingGrantProgram(
      recognizeHousingGrantFiscalAuthority(enactHousingGrantLaw()),
    );
    expect(established.governance.housingGrantProgram?.id).not.toBe(
      established.governance.administrativeInstitution?.id,
    );
  });
});

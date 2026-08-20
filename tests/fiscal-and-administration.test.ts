import { describe, expect, it } from "vitest";

import {
  amendHousingGrantProposal,
  establishHousingGrantProgram,
  HOUSING_GRANT_SYNTHETIC_APPROPRIATION_AMOUNT,
  recognizeHousingGrantFiscalAuthority,
  resolveHousingGrantProposalVote,
  submitHousingGrantProposal,
} from "../src/sim/governance";
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

/** Carries a fresh world through the accepted Commit-9 route to a passed law. */
const enactHousingGrantLaw = () => {
  const submitted = submitHousingGrantProposal(createDeterministicWorldFixture(), INITIAL_TERMS);
  const amended = amendHousingGrantProposal(submitted, COMPROMISE_TERMS);
  return resolveHousingGrantProposalVote(amended);
};

describe("Commit 10 law -> fiscal authority -> administration slice", () => {
  it("a passed law exists with no fiscal-execution availability until an explicit recognition transition runs", () => {
    const enacted = enactHousingGrantLaw();

    expect(enacted.governance.proposal?.status).toBe("PROCEDURE_PASSED");
    expect(enacted.governance.enactedLaws).toHaveLength(1);
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

  it("the legal appropriation and recognized fiscal-execution availability are distinct owned facts", () => {
    const enacted = enactHousingGrantLaw();
    const law = enacted.governance.enactedLaws[0];

    expect(law.appropriation.amount).toBe(HOUSING_GRANT_SYNTHETIC_APPROPRIATION_AMOUNT);
    expect(law).not.toHaveProperty("available");
    expect(law).not.toHaveProperty("obligated");

    const recognized = recognizeHousingGrantFiscalAuthority(enacted);
    const fiscal = recognized.governance.fiscalExecution!;

    expect(fiscal.available).toBe(HOUSING_GRANT_SYNTHETIC_APPROPRIATION_AMOUNT);
    expect(fiscal).not.toHaveProperty("appropriation");
    expect(fiscal).not.toHaveProperty("purpose");
    // The law object itself is untouched by recognition.
    expect(recognized.governance.enactedLaws[0]).toEqual(law);
  });

  it("recognizing fiscal authority produces the exact expected available amount exactly once", () => {
    const enacted = enactHousingGrantLaw();
    const recognized = recognizeHousingGrantFiscalAuthority(enacted);

    expect(recognized.governance.fiscalExecution).toMatchObject({
      sourceLawId: enacted.governance.enactedLaws[0].id,
      available: HOUSING_GRANT_SYNTHETIC_APPROPRIATION_AMOUNT,
      obligated: 0,
      disbursed: 0,
    });
    // Pure transition: the prior world reference is untouched.
    expect(enacted.governance.fiscalExecution).toBeNull();
  });

  it("repeating fiscal-authority recognition cannot double-count availability", () => {
    const enacted = enactHousingGrantLaw();
    const recognized = recognizeHousingGrantFiscalAuthority(enacted);

    expect(() => recognizeHousingGrantFiscalAuthority(recognized)).toThrow(/already been recognized/);
    expect(recognized.governance.fiscalExecution?.available).toBe(
      HOUSING_GRANT_SYNTHETIC_APPROPRIATION_AMOUNT,
    );
  });

  it("obligated and disbursed remain 0 through fiscal recognition, because no recipient exists yet", () => {
    const recognized = recognizeHousingGrantFiscalAuthority(enactHousingGrantLaw());

    expect(recognized.governance.fiscalExecution?.obligated).toBe(0);
    expect(recognized.governance.fiscalExecution?.disbursed).toBe(0);
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
    expect(program.fiscalAuthorityRef).toBe(recognized.governance.fiscalExecution!.sourceLawId);
    expect(program.status).toBe("READY_FOR_APPLICATIONS");
  });

  it("the program's operational terms exactly reflect the enacted compromise terms, not the original proposal", () => {
    const established = establishHousingGrantProgram(
      recognizeHousingGrantFiscalAuthority(enactHousingGrantLaw()),
    );
    const program = established.governance.housingGrantProgram!;

    expect(program.federalMatchRatePercent).toBe(COMPROMISE_TERMS.federalMatchRatePercent);
    expect(program.participationCondition).toBe(COMPROMISE_TERMS.participationCondition);
    expect(program.reportingRequirement).toBe(COMPROMISE_TERMS.reportingRequirement);
    // Never the pre-amendment original terms.
    expect(program.federalMatchRatePercent).not.toBe(INITIAL_TERMS.federalMatchRatePercent);
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
    expect(established.governance.fiscalExecution?.disbursed).toBe(0);
  });

  it("program setup creates no state participation/application/award facts and no new canonical roots", () => {
    const established = establishHousingGrantProgram(
      recognizeHousingGrantFiscalAuthority(enactHousingGrantLaw()),
    );

    expect(Object.keys(established.governance)).toEqual([
      "legislature",
      "proposal",
      "procedure",
      "enactedLaws",
      "fiscalExecution",
      "housingGrantProgram",
    ]);
    expect(Object.keys(established)).toEqual(["time", "bootstrapTransition", "governance", "history"]);
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
      (entry) => entry.type === "FiscalAuthorityMadeAvailable",
    );
    const programOccurrences = established.history.filter(
      (entry) => entry.type === "HousingGrantProgramEstablished",
    );

    expect(fiscalOccurrences).toEqual([
      {
        type: "FiscalAuthorityMadeAvailable",
        lawId: law.id,
        available: HOUSING_GRANT_SYNTHETIC_APPROPRIATION_AMOUNT,
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
    expect(established.governance.fiscalExecution?.available).toBe(
      HOUSING_GRANT_SYNTHETIC_APPROPRIATION_AMOUNT,
    );
    // Program ready.
    expect(established.governance.housingGrantProgram?.status).toBe("READY_FOR_APPLICATIONS");
    // Nothing downstream has happened yet.
    expect(established.governance.fiscalExecution?.obligated).toBe(0);
    expect(established.governance.fiscalExecution?.disbursed).toBe(0);
  });
});

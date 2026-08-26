import { describe, expect, it } from "vitest";

import {
  createIntegratedPartialRuntimeSession,
  createIntegratedPartialRuntimeSessionFromSave,
  INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION,
} from "../src/app/integrated-session";
import { US_V0_STRUCTURAL_CONFIGURATION } from "../src/content/us-v0/configuration";
import {
  US_V0_I9_APPELLATE_RULING,
  US_V0_I9_DOCKET,
  US_V0_I9_FILING,
  US_V0_I9_INTERIM_REQUEST,
  US_V0_I9_NOTICE,
  US_V0_I9_RULING,
  US_V0_I9_RUNTIME_ARTIFACTS,
  US_V0_I9_STAY_DECISION,
} from "../src/content/us-v0/i9";

const createSession = () => createIntegratedPartialRuntimeSession(
  US_V0_STRUCTURAL_CONFIGURATION,
  US_V0_I9_RUNTIME_ARTIFACTS,
);
const restore = (serialized: string) => createIntegratedPartialRuntimeSessionFromSave(
  serialized,
  US_V0_STRUCTURAL_CONFIGURATION,
  US_V0_I9_RUNTIME_ARTIFACTS,
);

const completedRoute = () => {
  const session = createSession();
  session.issueBoundedRelationshipRejection();
  session.advanceTo(US_V0_I9_NOTICE);
  session.respondToJudicialOrder("CONTEST");
  session.requestJudicialStay();
  session.advanceTo(US_V0_I9_APPELLATE_RULING);
  return session;
};

interface MutableI9Save {
  legalContest: {
    claims: { claimantId: string; respondentInstitutionId: string; challengedActRef: string; forumInstitutionId: string; filedAt: string; eligibility: { ruleVersion: string } }[];
    rulings: { disposition: string }[];
    interpretations: { proposition: string }[];
    orders: { targetInstitutionId: string; effectiveAt: string; scope: { programId: string; relationshipId: string } }[];
    stays: { status: string }[];
    appeals: { lowerRulingId: string; disposition: string }[];
    complianceStates: { targetInstitutionId: string; status: string; cause: string; recordedAt: string }[];
  };
  implementation: {
    administrativeProgram: {
      legalConstraints: { relationshipId: string }[];
      formulaDispositionResolutions: { outcome: string }[];
    };
  };
}

describe("I9 integrated persistence", () => {
  it("increments the accepted I8 save format and roundtrips deterministic continuation", () => {
    expect(INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION).toBe(10);
    const direct = createSession();
    direct.issueBoundedRelationshipRejection();
    direct.advanceTo(US_V0_I9_NOTICE);
    direct.respondToJudicialOrder("CONTEST");
    direct.requestJudicialStay();
    direct.advanceTo(US_V0_I9_STAY_DECISION);
    const restored = restore(direct.save());
    expect(restored.getAuditState()).toEqual(direct.getAuditState());
    restored.advanceTo(US_V0_I9_APPELLATE_RULING);
    direct.advanceTo(US_V0_I9_APPELLATE_RULING);
    expect(restored.getAuditState()).toEqual(direct.getAuditState());
  }, 45_000);

  it("makes one coarse advance equal fine advancement across legal, owner, Housing, and I8 boundaries", () => {
    const coarse = createSession();
    const fine = createSession();
    coarse.issueBoundedRelationshipRejection();
    fine.issueBoundedRelationshipRejection();
    coarse.advanceTo(US_V0_I9_NOTICE);
    for (const instant of [US_V0_I9_FILING, US_V0_I9_DOCKET, US_V0_I9_INTERIM_REQUEST, US_V0_I9_RULING, US_V0_I9_NOTICE]) {
      fine.advanceTo(instant);
    }
    expect(fine.getAuditState()).toEqual(coarse.getAuditState());
    coarse.respondToJudicialOrder("COMPLY");
    fine.respondToJudicialOrder("COMPLY");
    coarse.advanceTo(US_V0_I9_APPELLATE_RULING);
    while (fine.getPublicInstitutionalStatus().nextBoundary !== null &&
      Date.parse(fine.getPublicInstitutionalStatus().nextBoundary!.at) <= Date.parse(US_V0_I9_APPELLATE_RULING)) {
      fine.advanceToNextBoundary();
    }
    expect(fine.getAuditState()).toEqual(coarse.getAuditState());
  }, 45_000);

  it("rejects independent tampering across every behavior-driving judicial field", () => {
    const session = completedRoute();
    const mutations: readonly ((save: MutableI9Save) => void)[] = [
      (save) => { save.legalContest.claims[0].claimantId = "tampered"; },
      (save) => { save.legalContest.claims[0].respondentInstitutionId = "tampered"; },
      (save) => { save.legalContest.claims[0].challengedActRef = "tampered"; },
      (save) => { save.legalContest.claims[0].forumInstitutionId = "tampered"; },
      (save) => { save.legalContest.claims[0].filedAt = "2027-02-01T13:00:00-05:00"; },
      (save) => { save.legalContest.claims[0].eligibility.ruleVersion = "tampered"; },
      (save) => { save.legalContest.rulings[0].disposition = "RESPONDENT_PREVAILS"; },
      (save) => { save.legalContest.interpretations[0].proposition = "tampered"; },
      (save) => { save.legalContest.orders[0].targetInstitutionId = "tampered"; },
      (save) => { save.legalContest.orders[0].scope.relationshipId = "tampered"; },
      (save) => { save.legalContest.orders[0].effectiveAt = "2027-02-10T13:00:00-05:00"; },
      (save) => { save.legalContest.stays[0].status = "OPERATIVE"; },
      (save) => { save.legalContest.appeals[0].lowerRulingId = "tampered"; },
      (save) => { save.legalContest.appeals[0].disposition = "REVERSED"; },
      (save) => { save.legalContest.complianceStates[1].targetInstitutionId = "tampered"; },
      (save) => { save.legalContest.complianceStates[1].status = "COMPLIED"; },
      (save) => { save.legalContest.complianceStates[1].cause = "tampered"; },
      (save) => { save.legalContest.complianceStates[1].recordedAt = "2027-02-11T13:00:00-05:00"; },
    ];
    for (const mutate of mutations) {
      const save = JSON.parse(session.save()) as MutableI9Save;
      mutate(save);
      expect(() => restore(JSON.stringify(save))).toThrow();
    }
  }, 45_000);

  it("rejects scope broadening and cross-owner constraint tampering even with syntactically valid IDs", () => {
    const session = completedRoute();
    for (const mutate of [
      (save: MutableI9Save) => { save.legalContest.orders[0].scope.programId = "us.program.hud.home.other"; },
      (save: MutableI9Save) => { save.legalContest.orders[0].scope.relationshipId = "us.relationship.home.corpus-christi"; },
      (save: MutableI9Save) => { save.implementation.administrativeProgram.legalConstraints[0].relationshipId = "us.relationship.home.corpus-christi"; },
      (save: MutableI9Save) => { save.implementation.administrativeProgram.formulaDispositionResolutions[0].outcome = "WITHHELD_BY_COMPLIANCE"; },
    ]) {
      const save = JSON.parse(session.save()) as MutableI9Save;
      mutate(save);
      expect(() => restore(JSON.stringify(save))).toThrow();
    }
  }, 45_000);
});

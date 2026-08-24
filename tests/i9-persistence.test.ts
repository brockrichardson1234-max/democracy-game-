import { describe, expect, it } from "vitest";

import {
  createIntegratedPartialRuntimeSession,
  createIntegratedPartialRuntimeSessionFromSave,
  INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION,
} from "../src/app/integrated-session";
import { US_V0_STRUCTURAL_CONFIGURATION } from "../src/content/us-v0/configuration";
import {
  US_V0_I9_APPELLATE_RULING,
  US_V0_I9_NOTICE,
  US_V0_I9_RUNTIME_ARTIFACTS,
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

interface MutableLegalSave {
  implementation: {
    administrativeProgram: {
      relationshipQualificationDeterminations: { claimantId: string }[];
    };
  };
  legalContest: {
    rulings: { outcome: string }[];
    operativeOrders: { sourceRulingId: string }[];
    notices: { orderId: string }[];
    administrativeResponses: { action: string }[];
  };
}

describe("I9 integrated persistence", () => {
  it("roundtrips the bounded route and deterministic continuation", () => {
    expect(INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION).toBe(8);
    const direct = createSession();
    direct.issueBoundedRelationshipRejection();
    direct.advanceTo(US_V0_I9_NOTICE);
    direct.respondToJudicialOrder("SEEK_APPELLATE_REVIEW");
    direct.requestJudicialStay();
    const restored = restore(direct.save());
    expect(restored.getAuditState()).toEqual(direct.getAuditState());
    restored.advanceTo(US_V0_I9_APPELLATE_RULING);
    direct.advanceTo(US_V0_I9_APPELLATE_RULING);
    expect(restored.getAuditState()).toEqual(direct.getAuditState());
  }, 20_000);

  it("rejects tampered determination, ruling, order, notice, and response chains", () => {
    const session = createSession();
    session.issueBoundedRelationshipRejection();
    session.advanceTo(US_V0_I9_NOTICE);
    session.respondToJudicialOrder("COMPLY_PROSPECTIVELY");
    const mutations: ((save: MutableLegalSave) => void)[] = [
      (save) => { save.implementation.administrativeProgram.relationshipQualificationDeterminations[0].claimantId = "unknown"; },
      (save) => { save.legalContest.rulings[0].outcome = "DENIED"; },
      (save) => { save.legalContest.operativeOrders[0].sourceRulingId = "unknown"; },
      (save) => { save.legalContest.notices[0].orderId = "unknown"; },
      (save) => { save.legalContest.administrativeResponses[0].action = "SEEK_APPELLATE_REVIEW"; },
    ];
    for (const mutate of mutations) {
      const save = JSON.parse(session.save()) as MutableLegalSave;
      mutate(save);
      expect(() => restore(JSON.stringify(save))).toThrow();
    }
  }, 20_000);

  it("makes one large jump match fixed-boundary advancement and preserves exact-once state", () => {
    const coarse = createSession();
    const fine = createSession();
    coarse.issueBoundedRelationshipRejection();
    fine.issueBoundedRelationshipRejection();
    coarse.advanceTo(US_V0_I9_NOTICE);
    fine.advanceTo("2027-02-01T12:00:00-05:00");
    fine.advanceTo("2027-02-03T12:00:00-05:00");
    fine.advanceTo(US_V0_I9_NOTICE);
    expect(fine.getAuditState()).toEqual(coarse.getAuditState());
    const once = structuredClone(coarse.getLegalContestAuditState());
    coarse.advanceTo(US_V0_I9_NOTICE);
    expect(coarse.getLegalContestAuditState()).toEqual(once);
  }, 20_000);
});

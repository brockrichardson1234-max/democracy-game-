import { describe, expect, it } from "vitest";

import {
  createIntegratedPartialRuntimeSession,
  createIntegratedPartialRuntimeSessionFromSave,
  INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION,
} from "../src/app/integrated-session";
import { US_V0_STRUCTURAL_CONFIGURATION } from "../src/content/us-v0/configuration";
import {
  US_V0_I8_EXPOSURE,
  US_V0_I8_MATERIAL_CAPTURE,
  US_V0_I8_RESPONSE,
  US_V0_I8_RUNTIME_ARTIFACTS,
} from "../src/content/us-v0/i8";
import { US_V0_2029_TRANSFER } from "../src/content/us-v0/i5";

const createSession = () => createIntegratedPartialRuntimeSession(
  US_V0_STRUCTURAL_CONFIGURATION,
  US_V0_I8_RUNTIME_ARTIFACTS,
);
const restore = (serialized: string) => createIntegratedPartialRuntimeSessionFromSave(
  serialized,
  US_V0_STRUCTURAL_CONFIGURATION,
  US_V0_I8_RUNTIME_ARTIFACTS,
);

describe("I8 integrated persistence", () => {
  it("preserves the full information chain and Population response across save/restore", () => {
    expect(INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION).toBe(6);
    const session = createSession();
    session.advanceTo(US_V0_I8_RESPONSE);
    const restored = restore(session.save());
    expect(restored.getAuditState()).toEqual(session.getAuditState());
    restored.advanceTo(US_V0_2029_TRANSFER);
    session.advanceTo(US_V0_2029_TRANSFER);
    expect(restored.getAuditState()).toEqual(session.getAuditState());
  }, 20_000);

  it("makes coarse and fine advancement identical across every information boundary", () => {
    const coarse = createSession();
    const fine = createSession();
    coarse.advanceTo(US_V0_I8_RESPONSE);
    fine.advanceTo(US_V0_I8_MATERIAL_CAPTURE);
    fine.advanceTo(US_V0_I8_EXPOSURE);
    fine.advanceTo(US_V0_I8_RESPONSE);
    expect(fine.getAuditState()).toEqual(coarse.getAuditState());
  }, 20_000);

  it("rejects contradictory response ownership in a save", () => {
    const session = createSession();
    session.advanceTo(US_V0_I8_RESPONSE);
    const save = JSON.parse(session.save());
    save.information.responses[0].candidatePreference = "OPPOSITION";
    expect(() => restore(JSON.stringify(save))).toThrow(/Information response contradicts|Population response contradicts/);
  });
});

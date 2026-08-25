import { describe, expect, it } from "vitest";

import {
  createIntegratedPartialRuntimeSession,
  createIntegratedPartialRuntimeSessionFromSave,
  INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION,
} from "../src/app/integrated-session";
import { US_V0_STRUCTURAL_CONFIGURATION } from "../src/content/us-v0/configuration";
import { US_V0_I7_RUNTIME_ARTIFACTS } from "../src/content/us-v0/i7";

describe("I7 integrated persistence", () => {
  it("round-trips material progress and remains identical across coarse/fine advancement", () => {
    expect(INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION).toBe(8);
    const direct = createIntegratedPartialRuntimeSession(US_V0_STRUCTURAL_CONFIGURATION, US_V0_I7_RUNTIME_ARTIFACTS);
    const split = createIntegratedPartialRuntimeSession(US_V0_STRUCTURAL_CONFIGURATION, US_V0_I7_RUNTIME_ARTIFACTS);
    direct.advanceTo("2028-01-01T00:00:00-05:00");
    split.advanceTo("2026-10-05T00:00:00-04:00");
    const restored = createIntegratedPartialRuntimeSessionFromSave(
      split.save(), US_V0_STRUCTURAL_CONFIGURATION, US_V0_I7_RUNTIME_ARTIFACTS,
    );
    restored.advanceTo("2028-01-01T00:00:00-05:00");
    expect(restored.getAuditState()).toEqual(direct.getAuditState());
  }, 15_000);

  it("rejects edits to immutable controls or fabricated dynamic progress under the pinned artifact", () => {
    const session = createIntegratedPartialRuntimeSession(US_V0_STRUCTURAL_CONFIGURATION, US_V0_I7_RUNTIME_ARTIFACTS);
    session.advanceTo("2026-09-01T00:00:00-04:00");
    const save = JSON.parse(session.save());

    const controlTamper = structuredClone(save);
    controlTamper.housing.controls[0].housingStockUnits += 1;
    expect(() => createIntegratedPartialRuntimeSessionFromSave(
      JSON.stringify(controlTamper), US_V0_STRUCTURAL_CONFIGURATION, US_V0_I7_RUNTIME_ARTIFACTS,
    )).toThrow(/Housing immutable controls|stock aggregation contradicts control/);

    const progressTamper = structuredClone(save);
    progressTamper.housing.projects[0].physicalProgressUnits += 1;
    expect(() => createIntegratedPartialRuntimeSessionFromSave(
      JSON.stringify(progressTamper), US_V0_STRUCTURAL_CONFIGURATION, US_V0_I7_RUNTIME_ARTIFACTS,
    )).toThrow(/Housing deterministic material state/);
  });
});

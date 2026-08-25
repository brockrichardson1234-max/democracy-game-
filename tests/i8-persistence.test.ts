import { describe, expect, it } from "vitest";

import {
  createIntegratedPartialRuntimeSession,
  createIntegratedPartialRuntimeSessionFromSave,
  INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION,
} from "../src/app/integrated-session";
import { US_V0_STRUCTURAL_CONFIGURATION } from "../src/content/us-v0/configuration";
import { US_V0_2029_TRANSFER } from "../src/content/us-v0/i5";
import {
  US_V0_I8_POPULATION_RESPONSE,
  US_V0_I8_RUNTIME_ARTIFACTS,
} from "../src/content/us-v0/i8";

const createSession = () => createIntegratedPartialRuntimeSession(
  US_V0_STRUCTURAL_CONFIGURATION, US_V0_I8_RUNTIME_ARTIFACTS,
);

const restore = (serialized: string) => createIntegratedPartialRuntimeSessionFromSave(
  serialized, US_V0_STRUCTURAL_CONFIGURATION, US_V0_I8_RUNTIME_ARTIFACTS,
);

interface MutableEnvelope {
  information: {
    observations: {
      variables: { value: number | string | boolean | null }[];
      sourceMaterialReferences: string[];
      capturedAt: string;
    }[];
    releases: { releasedAt: string }[];
    claims: { evidenceArtifactIds: string[]; claimantId: string }[];
    exposures: { cohortIds: string[]; exposedAt: string }[];
    responses: {
      belief: { causeIds: string[] };
      attribution: { causeIds: string[] };
      salience: { causeIds: string[] };
      preference: { causeIds: string[] };
      turnout: { causeIds: string[] };
    }[];
  };
}

describe("I8 integrated persistence and tamper rejection", () => {
  it("uses save format 8 and preserves direct/save-load continuation", () => {
    expect(INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION).toBe(8);
    const direct = createSession();
    direct.advanceTo(US_V0_I8_POPULATION_RESPONSE);
    const restored = restore(direct.save());
    expect(restored.getAuditState()).toEqual(direct.getAuditState());
    direct.advanceTo(US_V0_2029_TRANSFER);
    restored.advanceTo(US_V0_2029_TRANSFER);
    expect(restored.getAuditState()).toEqual(direct.getAuditState());
  }, 45_000);

  it("rejects independent behavior-driving tampering across the complete I8 chain", () => {
    const session = createSession();
    session.advanceTo(US_V0_I8_POPULATION_RESPONSE);
    const serialized = session.save();
    const attacks: readonly [string, (envelope: MutableEnvelope) => void][] = [
      ["measurement observed value", (value) => {
        const observed = value.information.observations[0].variables[0];
        if (typeof observed.value !== "number") throw new Error("Expected numeric observed value.");
        observed.value += 1;
      }],
      ["measurement source Housing reference", (value) => {
        value.information.observations[0].sourceMaterialReferences[0] = "tampered-material-reference";
      }],
      ["measurement observation time", (value) => {
        value.information.observations[0].capturedAt = "2027-10-04T04:00:00.000Z";
      }],
      ["release timestamp", (value) => {
        value.information.releases[0].releasedAt = "2027-10-19T04:00:00.000Z";
      }],
      ["claim evidence reference", (value) => {
        value.information.claims[0].evidenceArtifactIds[0] = "tampered-evidence";
      }],
      ["claim claimant", (value) => { value.information.claims[0].claimantId = "tampered-claimant"; }],
      ["exposure target", (value) => { value.information.exposures[0].cohortIds[0] = "tampered-cohort"; }],
      ["exposure timestamp", (value) => {
        value.information.exposures[0].exposedAt = "2027-10-21T04:00:01.000Z";
      }],
      ["belief cause", (value) => { value.information.responses[0].belief.causeIds[0] = "tampered"; }],
      ["attribution cause", (value) => { value.information.responses[0].attribution.causeIds[0] = "tampered"; }],
      ["salience cause", (value) => { value.information.responses[0].salience.causeIds[0] = "tampered"; }],
      ["preference cause", (value) => { value.information.responses[0].preference.causeIds[0] = "tampered"; }],
      ["turnout cause", (value) => { value.information.responses[0].turnout.causeIds[0] = "tampered"; }],
    ];
    for (const [name, attack] of attacks) {
      const envelope = JSON.parse(serialized) as MutableEnvelope;
      attack(envelope);
      expect(() => restore(JSON.stringify(envelope)), name).toThrow();
    }
  }, 60_000);
});

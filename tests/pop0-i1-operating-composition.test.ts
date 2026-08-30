import { describe, expect, it } from "vitest";

import {
  createPresidentialOperatingProofSession,
} from "../src/app/presidential-operating-proof-session";
import {
  PRESIDENTIAL_OPERATING_SAVE_FORMAT_VERSION,
} from "../src/app/presidential-operating-persistence";
import {
  POP0_V0_EPOCH,
  POP0_V0_OPERATING_CONFIGURATION,
  POP0_V0_SCENARIO_ID,
} from "../src/content/pop0-v0/configuration";

const forbiddenLegacyShape = /IntegratedPartialRuntimeSession|ProductionGameView|availablePlayerActions|dispatchPlayerCommand|integratedPartialSave|i10Save/i;

describe("POP0-I1 clean operating composition", () => {
  it("boots one production-shaped proof state from its own authenticated identity", () => {
    const session = createPresidentialOperatingProofSession();
    const state = session.getOperatingState();
    expect(state).toEqual({
      schemaVersion: 1,
      operatingStateId: "pop0.operating-world.primary",
      configuration: POP0_V0_OPERATING_CONFIGURATION.identity,
      ownerStates: {
        calendar: {
          ownerId: "pop0.owner.calendar",
          state: {
            current: POP0_V0_EPOCH,
            processedBoundaryIds: [],
          },
        },
      },
    });
    expect(state.configuration.scenarioId).toBe(POP0_V0_SCENARIO_ID);
    expect(JSON.stringify(state)).not.toMatch(forbiddenLegacyShape);
  });

  it("serializes direct canonical owner state in a dedicated versioned envelope", () => {
    const session = createPresidentialOperatingProofSession();
    const parsed = JSON.parse(session.save()) as Record<string, unknown>;
    expect(parsed).toMatchObject({
      formatVersion: PRESIDENTIAL_OPERATING_SAVE_FORMAT_VERSION,
      configuration: POP0_V0_OPERATING_CONFIGURATION.identity,
      operatingState: session.getOperatingState(),
    });
    expect(Object.keys(parsed).sort()).toEqual(["configuration", "formatVersion", "operatingState"]);
    expect(JSON.stringify(parsed)).not.toMatch(forbiddenLegacyShape);
  });

  it("restores idempotently without sharing mutable shell state", () => {
    const original = createPresidentialOperatingProofSession();
    const saved = original.save();
    const firstRestore = createPresidentialOperatingProofSession(saved);
    const secondRestore = createPresidentialOperatingProofSession(firstRestore.save());
    expect(firstRestore.save()).toBe(saved);
    expect(secondRestore.save()).toBe(saved);
    expect(secondRestore.getOperatingState()).toEqual(original.getOperatingState());
    expect(secondRestore.getOperatingState()).not.toBe(original.getOperatingState());
    expect(secondRestore.getOperatingState().ownerStates.calendar.state.processedBoundaryIds)
      .not.toBe(original.getOperatingState().ownerStates.calendar.state.processedBoundaryIds);
  });

  it("rejects incompatible identities and unsupported save shapes", () => {
    const saved = JSON.parse(createPresidentialOperatingProofSession().save()) as Record<string, unknown>;
    const alteredIdentity = structuredClone(saved) as {
      configuration: { scenarioVersion: string };
    };
    alteredIdentity.configuration.scenarioVersion = "incompatible";
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(alteredIdentity)))
      .toThrow(/Configuration mismatch/);

    const nestedLegacy = structuredClone(saved) as Record<string, unknown>;
    nestedLegacy.i10Save = "opaque";
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(nestedLegacy)))
      .toThrow(/unsupported shape/);
  });
});

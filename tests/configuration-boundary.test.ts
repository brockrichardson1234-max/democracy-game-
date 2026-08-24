import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";

import { createGameSession, createGameSessionFromSave } from "../src/app/session";
import { canonicalConfigurationContent } from "../src/configuration/canonical";
import { bootstrapGovernmentConfiguration } from "../src/configuration/bootstrap";
import {
  assertConfigurationIdentityCompatible,
  assertDeclaredConfigurationHash,
  loadGovernmentConfiguration,
} from "../src/configuration/loader";
import type { GovernmentConfiguration } from "../src/configuration/types";
import {
  GL0_SYNTHETIC_CONFIGURATION,
  createDeterministicWorldFixture,
} from "../src/content/gl0-synthetic/configuration";
import { US_V0_STRUCTURAL_CONFIGURATION } from "../src/content/us-v0/configuration";
import { US_V0_I6_RUNTIME_ARTIFACTS } from "../src/content/us-v0/i6";
import {
  advanceWorldTo,
} from "../src/sim/world";

const sha256For = (configuration: GovernmentConfiguration): string =>
  createHash("sha256").update(canonicalConfigurationContent(configuration)).digest("hex");

describe("I1 production configuration boundary", () => {
  it("loads and hash-verifies the accepted synthetic configuration", () => {
    const loaded = loadGovernmentConfiguration(GL0_SYNTHETIC_CONFIGURATION);
    expect(loaded.loaded).toBe(true);
    expect(loaded.structure.chambers).toHaveLength(1);
    expect(loaded.structure.chambers[0]).toMatchObject({
      id: "gl0-single-chamber",
      seatCount: 11,
    });
    expect(loaded.structure.jurisdictions).toHaveLength(3);
    assertDeclaredConfigurationHash(loaded, sha256For(GL0_SYNTHETIC_CONFIGURATION));
  });

  it("boots the synthetic runtime through the production boundary and compatibility helper", () => {
    const bootstrap = bootstrapGovernmentConfiguration(GL0_SYNTHETIC_CONFIGURATION);
    expect(bootstrap.playable).toBe(true);
    expect(bootstrap.world).not.toBeNull();
    expect(bootstrap.world).toEqual(createDeterministicWorldFixture());
    expect(bootstrap.world?.configuration).toEqual(GL0_SYNTHETIC_CONFIGURATION.identity);
  });

  it("boots the non-full-world U.S. legislative slice through the same boundary", () => {
    const bootstrap = bootstrapGovernmentConfiguration(
      US_V0_STRUCTURAL_CONFIGURATION,
      US_V0_I6_RUNTIME_ARTIFACTS,
    );
    expect(bootstrap.configuration.structure.chambers).toHaveLength(2);
    expect(bootstrap.configuration.structure.chambers.map((chamber) => chamber.seatCount)).toEqual([
      435,
      100,
    ]);
    expect(bootstrap.configuration.calendar.kind).toBe("REAL_CALENDAR");
    expect(bootstrap.configuration.capability).toBe("INTEGRATED_PARTIAL_RUNTIME");
    expect(bootstrap.playable).toBe(false);
    expect(bootstrap.world).toBeNull();
    expect(bootstrap.configuration.runtimeSeed).not.toBeNull();
    expect(bootstrap.legislativeRuntimeAvailable).toBe(true);
    expect(bootstrap.legislativeRuntime?.political.actors).toHaveLength(535);
    expect(bootstrap.integratedRuntimeAvailable).toBe(true);
    expect(bootstrap.integratedRuntime?.legislative).toEqual(bootstrap.legislativeRuntime);
    assertDeclaredConfigurationHash(
      bootstrap.configuration,
      sha256For(US_V0_STRUCTURAL_CONFIGURATION),
    );
  });

  it("rejects duplicate structure, invalid hashes, callbacks, and unknown transitions", () => {
    const duplicateChamber = {
      ...US_V0_STRUCTURAL_CONFIGURATION,
      structure: {
        ...US_V0_STRUCTURAL_CONFIGURATION.structure,
        chambers: US_V0_STRUCTURAL_CONFIGURATION.structure.chambers.map((chamber) => ({
          ...chamber,
          id: "duplicate",
        })),
      },
    } satisfies GovernmentConfiguration<unknown>;
    expect(() => loadGovernmentConfiguration(duplicateChamber)).toThrow(/unique IDs/);

    const invalidHash = {
      ...US_V0_STRUCTURAL_CONFIGURATION,
      identity: { ...US_V0_STRUCTURAL_CONFIGURATION.identity, configurationHash: "not-a-hash" },
    } satisfies GovernmentConfiguration<unknown>;
    expect(() => loadGovernmentConfiguration(invalidHash)).toThrow(/SHA-256/);

    const callback = {
      ...GL0_SYNTHETIC_CONFIGURATION,
      runtimeSeed: {
        ...GL0_SYNTHETIC_CONFIGURATION.runtimeSeed,
        hiddenCountryEngine: () => "forbidden",
      },
    };
    expect(() => loadGovernmentConfiguration(callback)).toThrow(/executable or unsupported/);

    const unknownTransition = {
      ...GL0_SYNTHETIC_CONFIGURATION,
      transitions: [
        ...GL0_SYNTHETIC_CONFIGURATION.transitions,
        { id: "unknown", kind: "COUNTRY_CALLBACK", at: 2, order: 0 },
      ],
    } as unknown as GovernmentConfiguration;
    expect(() => loadGovernmentConfiguration(unknownTransition)).toThrow(/unknown kind/);
  });

  it("detects consumed configuration content changed without a new hash", () => {
    const changed = {
      ...GL0_SYNTHETIC_CONFIGURATION,
      structure: {
        ...GL0_SYNTHETIC_CONFIGURATION.structure,
        chambers: GL0_SYNTHETIC_CONFIGURATION.structure.chambers.map((chamber) => ({
          ...chamber,
          seatCount: 12,
        })),
      },
    } satisfies GovernmentConfiguration;
    expect(sha256For(changed)).not.toBe(GL0_SYNTHETIC_CONFIGURATION.identity.configurationHash);
    expect(() => assertDeclaredConfigurationHash(changed, sha256For(changed))).toThrow(
      /does not match consumed canonical content/,
    );
  });

  it("drives generic runtime boundaries from configuration data", () => {
    const shiftedWithoutHash = {
      ...GL0_SYNTHETIC_CONFIGURATION,
      identity: {
        ...GL0_SYNTHETIC_CONFIGURATION.identity,
        configurationVersion: "1.0.0-shifted-test",
        configurationHash: "0".repeat(64),
      },
      transitions: GL0_SYNTHETIC_CONFIGURATION.transitions.map((transition) =>
        transition.kind === "BOOTSTRAP_BOUNDARY" ? { ...transition, at: 2 } : transition,
      ),
    } satisfies GovernmentConfiguration;
    const shifted = {
      ...shiftedWithoutHash,
      identity: {
        ...shiftedWithoutHash.identity,
        configurationHash: sha256For(shiftedWithoutHash),
      },
    } satisfies GovernmentConfiguration;
    const bootstrap = bootstrapGovernmentConfiguration(shifted);
    expect(bootstrap.world).not.toBeNull();
    const day1 = advanceWorldTo(bootstrap.world!, 1);
    expect(day1.bootstrapTransition.resolved).toBe(false);
    expect(advanceWorldTo(day1, 2).bootstrapTransition.resolved).toBe(true);
  });

  it("pins saves to configuration identity and rejects both mismatch directions", () => {
    const save = createGameSession().save();
    const envelope = JSON.parse(save) as {
      configuration: { configurationHash: string };
      world: { configuration: { configurationHash: string } };
    };
    expect(envelope.configuration.configurationHash).toBe(
      GL0_SYNTHETIC_CONFIGURATION.identity.configurationHash,
    );
    expect(() =>
      createGameSessionFromSave(save, US_V0_STRUCTURAL_CONFIGURATION),
    ).toThrow(/Configuration mismatch/);
    expect(() =>
      assertConfigurationIdentityCompatible(
        GL0_SYNTHETIC_CONFIGURATION.identity,
        US_V0_STRUCTURAL_CONFIGURATION.identity,
      ),
    ).toThrow(/Configuration mismatch/);
    expect(() =>
      assertConfigurationIdentityCompatible(
        US_V0_STRUCTURAL_CONFIGURATION.identity,
        GL0_SYNTHETIC_CONFIGURATION.identity,
      ),
    ).toThrow(/Configuration mismatch/);

    envelope.configuration.configurationHash = "f".repeat(64);
    expect(() => createGameSessionFromSave(JSON.stringify(envelope))).toThrow(
      /Configuration mismatch/,
    );
  });
});

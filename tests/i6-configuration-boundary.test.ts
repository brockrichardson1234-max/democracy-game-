import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";

import { canonicalConfigurationContent } from "../src/configuration/canonical";
import { loadGovernmentConfiguration } from "../src/configuration/loader";
import type { GovernmentConfiguration, LegislativeRuntimeSeed } from "../src/configuration/types";
import { US_V0_STRUCTURAL_CONFIGURATION } from "../src/content/us-v0/configuration";
import {
  US_V0_I6_IMPLEMENTATION_CONFIGURATION,
  US_V0_I7_RUNTIME_ARTIFACTS,
} from "../src/content/us-v0/i7";

const sha256 = (value: string): string => createHash("sha256").update(value).digest("hex");

describe("I6 configuration and static authority boundary", () => {
  it("pins artifacts and every behavior-driving implementation parameter", () => {
    expect(US_V0_STRUCTURAL_CONFIGURATION.identity).toMatchObject({
      configurationVersion: "0.7.0-i7-reconciled",
      scenarioVersion: "0.7.0-i7-reconciled",
      configurationHash: "d71567db40f321f19b310c5f8ec20253c3455e95e9352d636f6a8b5833186d35",
    });
    expect(sha256(canonicalConfigurationContent(US_V0_STRUCTURAL_CONFIGURATION))).toBe(
      US_V0_STRUCTURAL_CONFIGURATION.identity.configurationHash,
    );
    expect(US_V0_I6_IMPLEMENTATION_CONFIGURATION.parameterHash).toBe(
      "b12da415061a25e2fd57bd2f1e153d6d7eaf5dd597c88993d70e822ebe50d35b",
    );
    expect(US_V0_STRUCTURAL_CONFIGURATION.integratedRuntime!.artifactBindings.find((binding) => binding.kind === "PROGRAM_INITIALIZATION")).toMatchObject({
      id: "us.i6.finance-home-initialization-v1",
      kind: "PROGRAM_INITIALIZATION",
      contentSha256: "69760b0516ada98fcde881fdf7189d28dd6808591bf113135446590e01383738",
      transformationVersion: "us-v0-i6-artifacts-v1",
    });
    expect(US_V0_I7_RUNTIME_ARTIFACTS.programInitialization!.metadata.rawSourceSha256s).toHaveLength(12);
  });

  it("rejects a behavior mutation whose nested parameter identity was not recomputed", () => {
    const implementation = US_V0_STRUCTURAL_CONFIGURATION.integratedRuntime!.implementation!;
    const alteredWithoutHash: GovernmentConfiguration<LegislativeRuntimeSeed> = {
      ...US_V0_STRUCTURAL_CONFIGURATION,
      identity: { ...US_V0_STRUCTURAL_CONFIGURATION.identity, configurationHash: "0".repeat(64) },
      integratedRuntime: {
        ...US_V0_STRUCTURAL_CONFIGURATION.integratedRuntime!,
        implementation: {
          ...implementation,
          administrativeCapacitySupport: {
            ...implementation.administrativeCapacitySupport,
            DEDICATED_CAPACITY_SUPPORT: {
              ...implementation.administrativeCapacitySupport.DEDICATED_CAPACITY_SUPPORT,
              processingLatencyDays: 11,
            },
          },
        },
      },
    };
    const altered = {
      ...alteredWithoutHash,
      identity: {
        ...alteredWithoutHash.identity,
        configurationHash: sha256(canonicalConfigurationContent(alteredWithoutHash)),
      },
    };
    expect(() => loadGovernmentConfiguration(altered)).toThrow(/implementation configuration/);
  });

  it("contains no physical project-state owner in the integrated I6 root", () => {
    const implementation = US_V0_I7_RUNTIME_ARTIFACTS.programInitialization!;
    expect(JSON.stringify(implementation)).not.toMatch(/physicalProgress|constructionProgress|completionPercent|usableUnits|occupancy|vacancyEffect|stockEffect/);
    expect(implementation.waivers.every((entry) => entry.physicalHousingEffect === null)).toBe(true);
    expect(implementation.recipientExpenditures.every((entry) => entry.physicalHousingEffect === null)).toBe(true);
  });
});

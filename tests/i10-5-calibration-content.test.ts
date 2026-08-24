import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";

import {
  createIntegratedPartialRuntimeAuditSession,
  createIntegratedPartialRuntimeSession,
  createIntegratedPartialRuntimeSessionFromSave,
} from "../src/app/integrated-session";
import { canonicalConfigurationContent } from "../src/configuration/canonical";
import { loadGovernmentConfiguration } from "../src/configuration/loader";
import type { GovernmentConfiguration } from "../src/configuration/types";
import { US_V0_STRUCTURAL_CONFIGURATION } from "../src/content/us-v0/configuration";
import {
  US_V0_I10_5_CALIBRATION_CONFIGURATION,
  US_V0_I10_5_RUNTIME_ARTIFACTS,
} from "../src/content/us-v0/i10-5";
import { US_V0_I6_IMPLEMENTATION_CONFIGURATION } from "../src/content/us-v0/i6";
import { US_V0_I7_HOUSING_CONFIGURATION } from "../src/content/us-v0/i7";
import { US_V0_I8_INFORMATION_CONFIGURATION, US_V0_I8_RESPONSE } from "../src/content/us-v0/i8";
import { US_V0_I9_LEGAL_CONTEST_CONFIGURATION, US_V0_I9_TEMPORAL_CONFIGURATION } from "../src/content/us-v0/i9";
import { US_V0_I10_COMPOSITION_CONFIGURATION } from "../src/content/us-v0/i10";
import {
  US_V0_2029_DECLARATION,
  US_V0_OPPOSITION_TICKET_ID,
  US_V0_PLAYER_TICKET_ID,
} from "../src/content/us-v0/i5";
import {
  assertIntegratedCalibrationConfiguration,
  perturbCalibrationValue,
} from "../src/sim/calibration";

const configurationHash = (configuration: GovernmentConfiguration): string =>
  createHash("sha256").update(canonicalConfigurationContent(configuration)).digest("hex");

const rehash = (configuration: GovernmentConfiguration): GovernmentConfiguration => {
  const unhashed = {
    ...configuration,
    identity: { ...configuration.identity, configurationHash: "0".repeat(64) },
  };
  return {
    ...unhashed,
    identity: { ...unhashed.identity, configurationHash: configurationHash(unhashed) },
  };
};

const resolutions = (ticketId: string) => US_V0_I10_5_RUNTIME_ARTIFACTS.populationCohorts.cohorts.map((cohort) => ({
  cohortId: cohort.id,
  candidatePreference: ticketId,
  turnoutDisposition: "HIGH",
  classification: "APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD",
  causeKey: `i10.5-robustness:${ticketId}`,
}));

describe("I10.5 calibration and content acceptance candidate", () => {
  it("pins every provisional numeric parameter to a canonical owner and explicit bounded classification", () => {
    expect(() => loadGovernmentConfiguration(US_V0_STRUCTURAL_CONFIGURATION)).not.toThrow();
    expect(() => assertIntegratedCalibrationConfiguration(US_V0_I10_5_CALIBRATION_CONFIGURATION)).not.toThrow();
    expect(US_V0_I10_5_CALIBRATION_CONFIGURATION).toMatchObject({
      version: "us-v0-calibration-content-audit-1",
      parameterHash: "d78524e9588fab41dbb4ff7da64c6fccadd5030a0abe45afbd9511cc8affb463",
      perturbationBasisPoints: 500,
    });
    expect(US_V0_I10_5_CALIBRATION_CONFIGURATION.ownerParameterHashes).toEqual([
      US_V0_I9_TEMPORAL_CONFIGURATION.parameterHash,
      US_V0_I6_IMPLEMENTATION_CONFIGURATION.parameterHash,
      US_V0_I7_HOUSING_CONFIGURATION.parameterHash,
      US_V0_I8_INFORMATION_CONFIGURATION.parameterHash,
      US_V0_I9_LEGAL_CONTEST_CONFIGURATION.parameterHash,
      US_V0_I10_COMPOSITION_CONFIGURATION.parameterHash,
    ]);
    expect(US_V0_I10_5_CALIBRATION_CONFIGURATION.entries.every((entry) =>
      entry.value >= entry.lowerBound && entry.value <= entry.upperBound &&
      entry.systemWideDirectOutcome === false && ["LOCAL", "OWNER_BOUNDED"].includes(entry.scope))).toBe(true);
    expect(new Set(US_V0_I10_5_CALIBRATION_CONFIGURATION.entries.map((entry) => entry.evidenceClass)))
      .toEqual(new Set(["APPROXIMATED", "SIMULATION_SCAFFOLD"]));
  });

  it("contains no contemporary political initialization and no direct winner or physical-result coefficient", () => {
    const serialized = JSON.stringify(US_V0_I10_5_CALIBRATION_CONFIGURATION);
    expect(serialized).not.toMatch(/poll|approval|democrat|republican|ideology|state partisan|forceWinner/i);
    expect(US_V0_I10_5_CALIBRATION_CONFIGURATION.entries.some((entry) =>
      /winner|completion outcome|statewide multiplier/i.test(entry.id))).toBe(false);
  });

  it("applies deterministic modest perturbations without escaping bounds or mutating canonical content", () => {
    const original = structuredClone(US_V0_I10_5_CALIBRATION_CONFIGURATION);
    for (const entry of US_V0_I10_5_CALIBRATION_CONFIGURATION.entries) {
      const down = perturbCalibrationValue(entry.value, entry.lowerBound, entry.upperBound, 500, "DOWN");
      const up = perturbCalibrationValue(entry.value, entry.lowerBound, entry.upperBound, 500, "UP");
      expect(down).toBeGreaterThanOrEqual(entry.lowerBound);
      expect(up).toBeLessThanOrEqual(entry.upperBound);
      expect(down).toBeLessThanOrEqual(entry.value);
      expect(up).toBeGreaterThanOrEqual(entry.value);
      expect(perturbCalibrationValue(entry.value, entry.lowerBound, entry.upperBound, 500, "UP")).toBe(up);
    }
    expect(US_V0_I10_5_CALIBRATION_CONFIGURATION).toEqual(original);
  });

  it("keeps information response targeted and Population weight conserved", () => {
    const session = createIntegratedPartialRuntimeSession(
      US_V0_STRUCTURAL_CONFIGURATION,
      US_V0_I10_5_RUNTIME_ARTIFACTS,
    );
    const parent = session.getAuditState().population.cohorts.find((cohort) =>
      cohort.id === US_V0_I8_INFORMATION_CONFIGURATION.exposure.parentCohortId)!;
    session.advanceTo(US_V0_I8_RESPONSE);
    const children = session.getAuditState().population.cohorts.filter((cohort) =>
      cohort.lineage.parentCohortId === parent.id);
    expect(children.reduce((sum, cohort) => sum + cohort.representedWeight, 0)).toBe(parent.representedWeight);
    expect(children.filter((cohort) => cohort.receivedInformationReferences.length > 0)).toHaveLength(1);
    expect(children.filter((cohort) => cohort.receivedInformationReferences.length === 0)).toHaveLength(1);
  });

  it("keeps selection driven by canonical Population and does not guarantee player victory", () => {
    const run = (ticketId: string) => {
      const session = createIntegratedPartialRuntimeAuditSession(
        US_V0_STRUCTURAL_CONFIGURATION,
        US_V0_I10_5_RUNTIME_ARTIFACTS,
        resolutions(ticketId),
      );
      session.advanceTo(US_V0_2029_DECLARATION);
      return session.getAuditState().institutional!.selection.declaration!.winningHeadActorId;
    };
    expect(run(US_V0_PLAYER_TICKET_ID)).not.toBe(run(US_V0_OPPOSITION_TICKET_ID));
  }, 60_000);

  it("roundtrips deterministically without a new save owner", () => {
    const direct = createIntegratedPartialRuntimeSession(
      US_V0_STRUCTURAL_CONFIGURATION,
      US_V0_I10_5_RUNTIME_ARTIFACTS,
    );
    direct.advanceTo(US_V0_I8_RESPONSE);
    const restored = createIntegratedPartialRuntimeSessionFromSave(
      direct.save(),
      US_V0_STRUCTURAL_CONFIGURATION,
      US_V0_I10_5_RUNTIME_ARTIFACTS,
    );
    expect(restored.getAuditState()).toEqual(direct.getAuditState());
    expect(JSON.parse(direct.save()).formatVersion).toBe(8);
  }, 30_000);

  it("rejects unpinned catalog edits and makes a lawfully rehashed calibration change alter configuration identity", () => {
    const mutated = structuredClone(US_V0_STRUCTURAL_CONFIGURATION) as GovernmentConfiguration;
    const calibration = mutated.integratedRuntime!.calibration!;
    (calibration.entries[0] as { value: number }).value += 1;
    const invalid = rehash(mutated);
    expect(() => loadGovernmentConfiguration(invalid)).toThrow(/calibration catalog/);

    const reowned = structuredClone(mutated) as GovernmentConfiguration;
    const nested = reowned.integratedRuntime!.calibration!;
    const withoutHash = structuredClone(nested) as { parameterHash?: string };
    delete withoutHash.parameterHash;
    (reowned.integratedRuntime!.calibration as { parameterHash: string }).parameterHash =
      createHash("sha256").update(JSON.stringify(withoutHash)).digest("hex");
    const lawful = rehash(reowned);
    expect(() => loadGovernmentConfiguration(lawful)).not.toThrow();
    expect(lawful.identity.configurationHash).not.toBe(US_V0_STRUCTURAL_CONFIGURATION.identity.configurationHash);
  });
});

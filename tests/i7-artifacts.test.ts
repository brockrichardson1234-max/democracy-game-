import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";

import { canonicalConfigurationContent } from "../src/configuration/canonical";
import { loadGovernmentConfiguration } from "../src/configuration/loader";
import { US_V0_STRUCTURAL_CONFIGURATION } from "../src/content/us-v0/configuration";
import {
  US_V0_I7_HOUSING_CONFIGURATION,
  US_V0_I7_RUNTIME_ARTIFACTS,
} from "../src/content/us-v0/i7";

const sha256 = (value: string): string => createHash("sha256").update(value).digest("hex");

describe("I7 authenticated Housing initialization", () => {
  it("pins the selected Housing controls and all behavior-driving material semantics", () => {
    expect(US_V0_STRUCTURAL_CONFIGURATION.identity).toMatchObject({
      configurationVersion: "0.8.0-i8-reconciled",
      scenarioVersion: "0.8.0-i8-reconciled",
      configurationHash: "215230ab26fa4fa1fc80d2778cfe7ada2f9fc8582894cc917d1ab8b8ec51cf54",
    });
    expect(sha256(canonicalConfigurationContent(US_V0_STRUCTURAL_CONFIGURATION))).toBe(
      US_V0_STRUCTURAL_CONFIGURATION.identity.configurationHash,
    );
    expect(US_V0_I7_HOUSING_CONFIGURATION.parameterHash).toBe(sha256(JSON.stringify({
      schemaVersion: US_V0_I7_HOUSING_CONFIGURATION.schemaVersion,
      initializationArtifactId: US_V0_I7_HOUSING_CONFIGURATION.initializationArtifactId,
      semanticsVersion: US_V0_I7_HOUSING_CONFIGURATION.semanticsVersion,
      catchmentScaffoldVersion: US_V0_I7_HOUSING_CONFIGURATION.catchmentScaffoldVersion,
      materialCalibrationVersion: US_V0_I7_HOUSING_CONFIGURATION.materialCalibrationVersion,
      physicalToUsableLagDays: US_V0_I7_HOUSING_CONFIGURATION.physicalToUsableLagDays,
      scopedReleaseSemanticVersion: US_V0_I7_HOUSING_CONFIGURATION.scopedReleaseSemanticVersion,
      materialInputBatchSemanticVersion: US_V0_I7_HOUSING_CONFIGURATION.materialInputBatchSemanticVersion,
      dependencyPhaseSemanticVersion: US_V0_I7_HOUSING_CONFIGURATION.dependencyPhaseSemanticVersion,
      effectiveMaterialRateSemanticVersion: US_V0_I7_HOUSING_CONFIGURATION.effectiveMaterialRateSemanticVersion,
      stageReadinessSemanticVersion: US_V0_I7_HOUSING_CONFIGURATION.stageReadinessSemanticVersion,
      delaySemanticVersion: US_V0_I7_HOUSING_CONFIGURATION.delaySemanticVersion,
      failureSemanticVersion: US_V0_I7_HOUSING_CONFIGURATION.failureSemanticVersion,
      housingBoundaryPhase: US_V0_I7_HOUSING_CONFIGURATION.housingBoundaryPhase,
      requiredGeneratedProjectInputKinds: US_V0_I7_HOUSING_CONFIGURATION.requiredGeneratedProjectInputKinds,
      activationInputKind: US_V0_I7_HOUSING_CONFIGURATION.activationInputKind,
      capacityPrior: US_V0_I7_HOUSING_CONFIGURATION.capacityPrior,
      expectedControlCount: US_V0_I7_HOUSING_CONFIGURATION.expectedControlCount,
      expectedRegionCount: US_V0_I7_HOUSING_CONFIGURATION.expectedRegionCount,
      expectedProjectCount: US_V0_I7_HOUSING_CONFIGURATION.expectedProjectCount,
      classification: US_V0_I7_HOUSING_CONFIGURATION.classification,
    })));
    expect(US_V0_I7_RUNTIME_ARTIFACTS.housingInitialization?.metadata).toMatchObject({
      artifactId: "us.i7.housing-initialization-v1",
      transformationVersion: "us-v0-i7-artifacts-v1",
      contentSha256: "65fba46fee4c82493cd8ebc744352067e958ee99ff1b8d94179e814f20c6857a",
    });
    expect(US_V0_I7_RUNTIME_ARTIFACTS.housingInitialization?.metadata.rawSourceSha256s).toHaveLength(8);
    expect(() => loadGovernmentConfiguration(US_V0_STRUCTURAL_CONFIGURATION)).not.toThrow();
  });

  it("loads 51 unequal official controls and conserves them across exactly 53 regions", () => {
    const artifact = US_V0_I7_RUNTIME_ARTIFACTS.housingInitialization!;
    expect(artifact.controls).toHaveLength(51);
    expect(artifact.regions).toHaveLength(53);
    expect(new Set(artifact.controls.map((control) => control.housingStock.estimate)).size).toBeGreaterThan(40);
    for (const control of artifact.controls) {
      const regions = artifact.regions.filter((region) => region.sourceControlId === control.id);
      expect(regions.reduce((sum, region) => sum + region.housingStockUnits, 0)).toBe(control.housingStock.estimate);
      expect(regions.reduce((sum, region) => sum + region.vacantUnits, 0)).toBe(control.vacancy.vacantEstimate);
    }
    expect(artifact.regions.filter((region) => region.kind === "PROJECT_CATCHMENT")).toHaveLength(2);
    expect(artifact.regions.filter((region) => region.kind === "STATE_REMAINDER")).toHaveLength(2);
    expect(artifact.regions.filter((region) => region.kind === "STATE_BACKGROUND")).toHaveLength(49);
  });

  it("keeps permits, planned dates, expenditures, waivers, and physical completion semantically separate", () => {
    const artifact = US_V0_I7_RUNTIME_ARTIFACTS.housingInitialization!;
    const palms = artifact.projects.find((project) => project.id === "us.project.palms-at-morris")!;
    const stables = artifact.projects.find((project) => project.id === "us.project.stables")!;
    expect(palms.acceptedGovernmentInputRefs).toEqual([
      "C226687", "C226685", "us.recipient-expenditure.corpus.palms.2025-09-17.117000",
    ]);
    expect(palms.completionEvidence).toBe("PLANNED_DATE_COMPLETION_UNPROVEN");
    expect(stables.acceptedGovernmentInputRefs).toEqual(["W-0000102"]);
    expect(stables.stage).toBe("ACTIVE");
    expect(stables.physicalProgressUnits).toBe(0);
    expect(JSON.stringify(artifact.projects)).not.toMatch(/occupancy|administrative completion/i);
  });
});

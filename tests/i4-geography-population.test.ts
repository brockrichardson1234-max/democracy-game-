import { describe, expect, it } from "vitest";

import {
  createIntegratedPartialRuntimeSession,
  createIntegratedPartialRuntimeSessionFromSave,
} from "../src/app/integrated-session";
import { canonicalConfigurationContent } from "../src/configuration/canonical";
import { sha256Hex } from "../src/configuration/sha256";
import { US_V0_STRUCTURAL_CONFIGURATION } from "../src/content/us-v0/configuration";
import { US_V0_I7_RUNTIME_ARTIFACTS } from "../src/content/us-v0/i7";
import districtIdentities from "../src/content/us-v0/artifacts/house-district-identities-119.json";
import cohortArtifact from "../src/content/us-v0/i4-artifacts/population-initial-cohorts-2026-08-22.json";
import populationArtifact from "../src/content/us-v0/i4-artifacts/resident-population-controls-2025.json";
import stateGeographyArtifact from "../src/content/us-v0/i4-artifacts/state-geography-2025.json";
import tenureArtifact from "../src/content/us-v0/i4-artifacts/tenure-exposure-input-acs2024.json";
import {
  assertWeightedPopulationConservation,
  mergeWeightedPopulationCohorts,
  refineWeightedPopulationCohort,
} from "../src/sim/population-core";

const createSession = () => createIntegratedPartialRuntimeSession(
  US_V0_STRUCTURAL_CONFIGURATION,
  US_V0_I7_RUNTIME_ARTIFACTS,
);

describe("I4 Geography and real-data initialization", () => {
  it("deepens the accepted I2 identities with 51 state/DC and 435 district polygons", () => {
    const state = createSession().getAuditState();
    const states = state.geography.features.filter((feature) => feature.sourceArtifactId === "us.i4.geography.states-2025-500k-v1");
    const districts = state.geography.features.filter((feature) => feature.sourceArtifactId === "us.i4.geography.cd119-2025-500k-v1");
    const locators = state.geography.features.filter((feature) => feature.kind === "PROJECT_LOCATOR");

    expect(states).toHaveLength(51);
    expect(districts).toHaveLength(435);
    expect(locators).toHaveLength(2);
    expect(states.every((feature) => feature.geometry?.rings.length)).toBe(true);
    expect(districts.every((feature) => feature.geometry?.rings.length)).toBe(true);
    expect(new Set(districts.map((feature) => feature.externalIdentifiers?.GEOID))).toEqual(
      new Set(districtIdentities.districts.map((district) => district.geoid)),
    );
    expect(districts.every((feature) => feature.parentGeographyId === `us.geography.state.${feature.externalIdentifiers?.STATEFP}`)).toBe(true);
    expect(districts.every((feature) => feature.effectiveLabel === "119th Congress / January 2025–January 2027")).toBe(true);
    expect(districts.every((feature) => feature.scenarioLabel?.includes("FROZEN DISTRICT GEOGRAPHY"))).toBe(true);
    expect(locators.map((feature) => feature.parentGeographyId).sort()).toEqual([
      "us.geography.state.08",
      "us.geography.state.48",
    ]);
    expect(stateGeographyArtifact.metadata.sourceCrs).toBe("NAD83 geographic coordinates (EPSG:4269)");
    expect(stateGeographyArtifact.metadata.runtimeCrs).toBe("NAD83 geographic coordinates (EPSG:4269)");
    expect(stateGeographyArtifact.metadata.coordinatePolicy).toContain("No simplification");
  });

  it("loads 51 unequal real resident controls and exactly conserves 106 joint cohorts", () => {
    const population = createSession().getAuditState().population;
    expect(population.controls).toHaveLength(51);
    expect(population.cohorts).toHaveLength(106);
    expect(new Set(population.controls.map((control) => control.representedWeight)).size).toBeGreaterThan(40);
    expect(population.controls.reduce((sum, control) => sum + control.representedWeight, 0)).toBe(341_784_857);
    expect(population.controls.find((control) => control.id.endsWith(".06"))?.representedWeight).toBe(39_355_309);
    expect(population.controls.find((control) => control.id.endsWith(".56"))?.representedWeight).toBe(588_753);

    for (const control of population.controls) {
      const cohorts = population.cohorts.filter((cohort) => cohort.stateControlId === control.id);
      expect(cohorts).toHaveLength(control.id.endsWith(".08") || control.id.endsWith(".48") ? 4 : 2);
      expect(cohorts.reduce((sum, cohort) => sum + cohort.representedWeight, 0)).toBe(control.representedWeight);
    }
    assertWeightedPopulationConservation(population);
    expect(population.cohorts.some((cohort) => cohort.residenceGeographyId.includes("cd119"))).toBe(false);
  });

  it("derives renter/remainder and Colorado/Texas joint catchments by exact documented arithmetic", () => {
    const population = createSession().getAuditState().population;
    const control = populationArtifact.controls.find((record) => record.stateFips === "08")!;
    const tenure = tenureArtifact.records.find((record) => record.stateFips === "08")!;
    const renterParent = Math.floor(
      control.residentWeight * tenure.renterShareNumerator / tenure.renterShareDenominator,
    );
    const colorado = population.cohorts.filter((cohort) => cohort.stateControlId === control.id);
    const renterCatchment = colorado.find((cohort) => cohort.materialExposureClass === "RENTER_EXPOSED" && cohort.catchmentClass === "PROJECT_CATCHMENT")!;
    const renterRemainder = colorado.find((cohort) => cohort.materialExposureClass === "RENTER_EXPOSED" && cohort.catchmentClass === "STATE_REMAINDER")!;

    expect(renterCatchment.representedWeight).toBe(Math.floor(renterParent * 0.001));
    expect(renterRemainder.representedWeight).toBe(renterParent - renterCatchment.representedWeight);
    expect(renterCatchment.projectLocatorGeographyId).toBe("us.geography.project-locator.stables");
    expect(renterRemainder.projectLocatorGeographyId).toBeNull();
    expect(cohortArtifact.classification).toContain("APPROXIMATED_NON_OBSERVED");
  });

  it("conservatively refines only the target and uses deterministic identities", () => {
    const initial = createSession().getAuditState().population;
    const parent = initial.cohorts.find((cohort) => cohort.stateControlId.endsWith(".08") && cohort.catchmentClass === "STATE_REMAINDER")!;
    const request = {
      parentCohortId: parent.id,
      targetedWeight: 101,
      causeKey: "test-material-distinction",
      association: { kind: "MATERIAL" as const, referenceId: "test.material.exposure" },
    };
    const refined = refineWeightedPopulationCohort(initial, request);
    const target = refined.cohorts.find((cohort) => cohort.lineage.parentCohortId === parent.id && cohort.id.endsWith(".targeted"))!;
    const remainder = refined.cohorts.find((cohort) => cohort.lineage.parentCohortId === parent.id && cohort.id.endsWith(".untargeted"))!;

    expect(target.representedWeight).toBe(101);
    expect(remainder.representedWeight).toBe(parent.representedWeight - 101);
    expect(target.materialExposureReferences).toContain("test.material.exposure");
    expect(remainder.materialExposureReferences).not.toContain("test.material.exposure");
    expect(refined.cohorts.filter((cohort) => cohort.lineage.parentCohortId !== parent.id)).toEqual(
      initial.cohorts.filter((cohort) => cohort.id !== parent.id),
    );
    expect(refineWeightedPopulationCohort(initial, request)).toEqual(refined);
    expect(() => refineWeightedPopulationCohort(initial, { ...request, targetedWeight: 0 })).toThrow();
    expect(() => refineWeightedPopulationCohort(initial, { ...request, targetedWeight: parent.representedWeight })).toThrow();
    assertWeightedPopulationConservation(refined);
  });

  it("merges only cohorts whose complete causal joint state is equal", () => {
    const initial = createSession().getAuditState().population;
    const parent = initial.cohorts.find((cohort) => cohort.stateControlId.endsWith(".48") && cohort.catchmentClass === "STATE_REMAINDER")!;
    const split = refineWeightedPopulationCohort(initial, {
      parentCohortId: parent.id,
      targetedWeight: 123,
      causeKey: "merge-round-trip",
    });
    const children = split.cohorts.filter((cohort) => cohort.lineage.parentCohortId === parent.id);
    const merged = mergeWeightedPopulationCohorts(split, children.map((cohort) => cohort.id), "merge-round-trip");
    expect(merged.cohorts.find((cohort) => cohort.lineage.mergedParentCohortIds)?.representedWeight).toBe(parent.representedWeight);

    const associated = refineWeightedPopulationCohort(initial, {
      parentCohortId: parent.id,
      targetedWeight: 123,
      causeKey: "merge-reject",
      association: { kind: "INFORMATION", referenceId: "test.information.receipt" },
    });
    const unequal = associated.cohorts.filter((cohort) => cohort.lineage.parentCohortId === parent.id);
    expect(() => mergeWeightedPopulationCohorts(associated, unequal.map((cohort) => cohort.id), "invalid"))
      .toThrow(/different causal joint state/);
  });

  it("keeps CVAP as a 51-record derived proxy and conserves largest-remainder allocations", () => {
    const population = createSession().getAuditState().population;
    expect(population.eligibilityProxies).toHaveLength(51);
    expect(population.eligibilityProxies.every((proxy) => proxy.classification.includes("PROXY"))).toBe(true);
    expect(population.eligibilityProxies.some((proxy) => proxy.representedWeight !== population.controls.find((control) => control.residenceGeographyId === proxy.residenceGeographyId)?.representedWeight)).toBe(true);
    for (const proxy of population.eligibilityProxies) {
      const allocated = population.cohorts
        .filter((cohort) => cohort.eligibilityProjection.projectionId === proxy.id)
        .reduce((sum, cohort) => sum + cohort.eligibilityProjection.allocatedWeight, 0);
      expect(allocated).toBe(proxy.representedWeight);
      expect(proxy.integerizationPolicy).toBe("ROUND_HALF_UP_EXACT_RATIONAL_V1");
    }
  });

  it("loads 538 static allocation units without creating election results", () => {
    const electoral = createSession().getAuditState().electoralTopology;
    expect(electoral.allocations).toHaveLength(51);
    expect(electoral.totalElectors).toBe(538);
    expect(electoral.ordinaryMajority).toBe(270);
    expect(electoral.allocations.reduce((sum, allocation) => sum + allocation.totalElectors, 0)).toBe(538);
    expect(electoral.allocations.find((allocation) => allocation.id.endsWith(".23"))?.units).toHaveLength(3);
    expect(electoral.allocations.find((allocation) => allocation.id.endsWith(".31"))?.units).toHaveLength(4);
    expect(JSON.stringify(electoral)).not.toMatch(/candidate|popularVote|certification|successor/i);
  });

  it("composes I3 canonically and round-trips refinements without polygon duplication", () => {
    const direct = createSession();
    const before = direct.getAuditState();
    expect(before.legislative.political.actors).toHaveLength(535);
    expect(before.legislative.activeAssignments).toHaveLength(537);
    expect(direct.getControlBindingAudit().status).toBe("ACTIVE");
    const parent = before.population.cohorts[0];
    direct.refinePopulation({
      parentCohortId: parent.id,
      targetedWeight: 17,
      causeKey: "persistence-proof",
      association: { kind: "INFORMATION", referenceId: "test.receipt" },
    });
    const saved = direct.save();
    expect(saved).not.toContain("POLYGON_RINGS");
    const restored = createIntegratedPartialRuntimeSessionFromSave(
      saved,
      US_V0_STRUCTURAL_CONFIGURATION,
      US_V0_I7_RUNTIME_ARTIFACTS,
    );
    expect(restored.getAuditState()).toEqual(direct.getAuditState());
    expect(restored.save()).toBe(saved);

    const incompatible = {
      ...US_V0_I7_RUNTIME_ARTIFACTS,
      populationControls: {
        ...US_V0_I7_RUNTIME_ARTIFACTS.populationControls,
        metadata: { ...US_V0_I7_RUNTIME_ARTIFACTS.populationControls.metadata, contentSha256: "0".repeat(64) },
      },
    };
    expect(() => createIntegratedPartialRuntimeSessionFromSave(saved, US_V0_STRUCTURAL_CONFIGURATION, incompatible)).toThrow();
  });

  it("pins all behavior-driving artifact identities in the configuration hash", () => {
    const original = sha256Hex(canonicalConfigurationContent(US_V0_STRUCTURAL_CONFIGURATION));
    const mutation = {
      ...US_V0_STRUCTURAL_CONFIGURATION,
      identity: { ...US_V0_STRUCTURAL_CONFIGURATION.identity, configurationHash: "0".repeat(64) },
      integratedRuntime: {
        ...US_V0_STRUCTURAL_CONFIGURATION.integratedRuntime!,
        population: {
          ...US_V0_STRUCTURAL_CONFIGURATION.integratedRuntime!.population,
          refinementSemanticVersion: "mutated-refinement-law",
        },
      },
    };
    expect(sha256Hex(canonicalConfigurationContent(mutation))).not.toBe(original);
  });
});

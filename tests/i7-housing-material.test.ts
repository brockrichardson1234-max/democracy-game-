import { describe, expect, it } from "vitest";

import { createIntegratedPartialRuntimeSession } from "../src/app/integrated-session";
import { US_V0_STRUCTURAL_CONFIGURATION } from "../src/content/us-v0/configuration";
import { US_V0_I7_RUNTIME_ARTIFACTS } from "../src/content/us-v0/i7";
import {
  admitValidatedMaterialInputs,
  advanceIntegratedMaterialHousing,
  createIntegratedMaterialHousingState,
  deriveMaterialHousingStateSummary,
} from "../src/sim/housing";

const seed = US_V0_I7_RUNTIME_ARTIFACTS.housingInitialization!;
const createHousing = () => createIntegratedMaterialHousingState(seed, {
  physicalToUsableLagDays: 7,
  expectedControlCount: 51,
  expectedRegionCount: 53,
  expectedProjectCount: 2,
});

describe("I7 canonical Housing material route", () => {
  it("treats validated administrative/fiscal records as inputs without direct physical mutation", () => {
    const initial = createHousing();
    const admitted = admitValidatedMaterialInputs(initial, [{
      id: "input:fiscal", kind: "VALID_FISCAL_RESOURCE_INPUT", sourceOwnerId: "finance",
      sourceRecordId: "payment:1", projectRef: "us.project.palms-at-morris",
      validatedAt: "2026-08-22T00:00:00-04:00", classification: "SIMULATION_GENERATED",
    }]);
    expect(admitted.regions).toEqual(initial.regions);
    expect(admitted.projects).toEqual(initial.projects);
    expect(admitted.acceptedInputs).toHaveLength(1);

    const held = admitValidatedMaterialInputs(admitted, [{
      id: "input:hold", kind: "COMPLIANCE_HOLD", sourceOwnerId: "program",
      sourceRecordId: "determination:deny", projectRef: "us.project.palms-at-morris",
      validatedAt: "2026-08-23T00:00:00-04:00", classification: "SIMULATION_GENERATED",
    }]);
    const after = advanceIntegratedMaterialHousing(held, "2026-08-23T00:00:00-04:00", "2027-08-23T00:00:00-04:00");
    expect(after.projects.find((project) => project.id === "us.project.palms-at-morris")).toMatchObject({
      stage: "BLOCKED", physicalProgressUnits: 0, usableUnitContribution: 0,
    });
    expect(after.regions).toEqual(held.regions);
  });

  it("resolves physical completion and usability independently, then adds exact local units once", () => {
    const initial = createHousing();
    const beforeUsable = advanceIntegratedMaterialHousing(
      initial, "2026-08-22T00:00:00-04:00", "2026-10-05T00:00:00-04:00",
    );
    expect(beforeUsable.projects.find((project) => project.id === "us.project.palms-at-morris")?.stage).toBe("PHYSICALLY_COMPLETE");
    expect(beforeUsable.projects.find((project) => project.id === "us.project.palms-at-morris")?.usableUnitContribution).toBe(0);

    const usable = advanceIntegratedMaterialHousing(
      beforeUsable, "2026-10-05T00:00:00-04:00", "2026-10-10T00:00:00-04:00",
    );
    const project = usable.projects.find((entry) => entry.id === "us.project.palms-at-morris")!;
    const initialRegion = initial.regions.find((region) => region.id === project.housingRegionId)!;
    const region = usable.regions.find((entry) => entry.id === project.housingRegionId)!;
    expect(project.stage).toBe("USABLE");
    expect(project.usableUnitContribution).toBe(72);
    expect(region.housingStockUnits - initialRegion.housingStockUnits).toBe(72);
    expect(usable.materialExposureReferences).toHaveLength(1);

    const exactOnce = advanceIntegratedMaterialHousing(usable, "2026-10-10T00:00:00-04:00", "2028-10-10T00:00:00-04:00");
    expect(exactOnce.regions.find((entry) => entry.id === project.housingRegionId)?.housingStockUnits).toBe(region.housingStockUnits);
  });

  it("keeps local project impact local and derives state change without a multiplier", () => {
    const initial = createHousing();
    const completed = advanceIntegratedMaterialHousing(
      initial, "2026-08-22T00:00:00-04:00", "2028-01-01T00:00:00-05:00",
    );
    const coBefore = deriveMaterialHousingStateSummary(initial, "us.geography.state.08");
    const coAfter = deriveMaterialHousingStateSummary(completed, "us.geography.state.08");
    const txBefore = deriveMaterialHousingStateSummary(initial, "us.geography.state.48");
    const txAfter = deriveMaterialHousingStateSummary(completed, "us.geography.state.48");
    expect(coAfter.housingStockUnits - coBefore.housingStockUnits).toBe(85);
    expect(txAfter.housingStockUnits - txBefore.housingStockUnits).toBe(72);
    expect(completed.regions.filter((region) => !["08", "48"].includes(region.sourceGeographyCode))).toEqual(
      initial.regions.filter((region) => !["08", "48"].includes(region.sourceGeographyCode)),
    );
  });

  it("advances Housing inside the same persistent I1-I6 run", () => {
    const session = createIntegratedPartialRuntimeSession(US_V0_STRUCTURAL_CONFIGURATION, US_V0_I7_RUNTIME_ARTIFACTS);
    const geography = session.getAuditState().geography;
    const population = session.getAuditState().population;
    session.advanceTo("2028-01-01T00:00:00-05:00");
    const state = session.getAuditState();
    expect(state.housing?.projects.every((project) => ["USABLE", "PRESERVATION_LOSS_AVOIDED"].includes(project.stage))).toBe(true);
    expect(state.geography).toEqual(geography);
    expect(state.population).toEqual(population);
    expect(state.implementation?.materialInputs.every((input) => input.physicalHousingMutation === false)).toBe(true);
  });
});

import { describe, expect, it } from "vitest";

import {
  createIntegratedPartialRuntimeAuditSession,
  createIntegratedPartialRuntimeSessionFromSave,
} from "../src/app/integrated-session";
import { US_V0_STRUCTURAL_CONFIGURATION } from "../src/content/us-v0/configuration";
import {
  US_V0_I7_HOUSING_CONFIGURATION,
  US_V0_I7_RUNTIME_ARTIFACTS,
} from "../src/content/us-v0/i7";
import {
  admitGeneratedMaterialHousingProject,
  admitValidatedMaterialInputs,
  advanceIntegratedMaterialHousing,
  applyMaterialHousingCondition,
  assertIntegratedMaterialHousingState,
  createIntegratedMaterialHousingState,
  deriveMaterialHousingBoundaries,
  finalizePendingMaterialHousingCompletions,
  type AcceptedMaterialInputReference,
  type IntegratedMaterialHousingState,
} from "../src/sim/housing";

const epoch = "2026-08-22T00:00:00-04:00";
const palmsId = "us.project.palms-at-morris";
const seed = US_V0_I7_RUNTIME_ARTIFACTS.housingInitialization!;
const createHousing = (): IntegratedMaterialHousingState =>
  createIntegratedMaterialHousingState(seed, US_V0_I7_HOUSING_CONFIGURATION);
const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const input = (
  id: string,
  kind: string,
  validatedAt: string,
  options: Partial<Pick<AcceptedMaterialInputReference,
    "projectRef" | "scopeKey" | "releaseOfInputId" | "causalPredecessorInputIds">> = {},
): AcceptedMaterialInputReference => ({
  id,
  kind,
  sourceOwnerId: "us.institution.material-owner.fixture",
  sourceRecordId: `owner-result:${id}`,
  projectRef: options.projectRef ?? palmsId,
  scopeKey: options.scopeKey ?? null,
  releaseOfInputId: options.releaseOfInputId ?? null,
  causalPredecessorInputIds: options.causalPredecessorInputIds ?? [],
  validatedAt,
  classification: "SIMULATION_GENERATED",
});

const project = (state: IntegratedMaterialHousingState, id = palmsId) =>
  state.projects.find((entry) => entry.id === id)!;

const permutations = <T>(values: readonly T[]): readonly (readonly T[])[] => {
  if (values.length <= 1) return [values];
  return values.flatMap((value, index) =>
    permutations(values.filter((_, candidate) => candidate !== index)).map((tail) => [value, ...tail]));
};

describe("I7 bounded repair proofs", () => {
  it("I7-REV-001 permits only an explicit scoped release, including deterministic same-instant causality", () => {
    const holdAt = "2026-08-23T00:00:00-04:00";
    const releaseAt = "2026-08-24T00:00:00-04:00";
    const hold = input("input:hold:x", "COMPLIANCE_HOLD", holdAt, { scopeKey: "constraint:X" });
    const unrelated = input("input:availability:y", "INPUT_AVAILABILITY", releaseAt, { scopeKey: "constraint:Y" });
    const held = admitValidatedMaterialInputs(createHousing(), [hold]);
    const stillHeld = admitValidatedMaterialInputs(held, [unrelated]);
    expect(project(stillHeld)).toMatchObject({ complianceHold: true, stage: "BLOCKED" });

    const release = input("input:release:x", "WAIVER_TERMS", releaseAt, {
      scopeKey: "constraint:X",
      releaseOfInputId: hold.id,
      causalPredecessorInputIds: [hold.id],
    });
    const released = admitValidatedMaterialInputs(stillHeld, [release]);
    expect(project(released)).toMatchObject({ complianceHold: false, stage: "ACTIVE" });

    const sameAt = "2026-08-25T12:00:00-04:00";
    const sameHold = input("input:same:hold", "COMPLIANCE_HOLD", sameAt, { scopeKey: "constraint:S" });
    const sameUnrelated = input("input:same:other", "INPUT_AVAILABILITY", sameAt, { scopeKey: "constraint:OTHER" });
    expect(project(admitValidatedMaterialInputs(createHousing(), [sameUnrelated, sameHold])).complianceHold).toBe(true);

    const sameRelease = input("input:same:release", "INPUT_AVAILABILITY", sameAt, {
      scopeKey: "constraint:S",
      releaseOfInputId: sameHold.id,
      causalPredecessorInputIds: [sameHold.id],
    });
    const forward = admitValidatedMaterialInputs(createHousing(), [sameHold, sameRelease]);
    const reverse = admitValidatedMaterialInputs(createHousing(), [sameRelease, sameHold]);
    expect(reverse).toEqual(forward);
    expect(project(forward).complianceHold).toBe(false);
    const restored = copy(forward);
    assertIntegratedMaterialHousingState(restored);
    expect(restored).toEqual(forward);
  });

  it("I7-REV-002 resolves every equal-time permutation and grouped/sequential presentation identically", () => {
    const at = "2026-09-01T09:30:00-04:00";
    const hold = input("input:batch:hold", "COMPLIANCE_HOLD", at, { scopeKey: "constraint:BATCH" });
    const release = input("input:batch:release", "WAIVER_TERMS", at, {
      scopeKey: "constraint:BATCH",
      releaseOfInputId: hold.id,
      causalPredecessorInputIds: [hold.id],
    });
    const readiness = input("input:batch:readiness", "RECIPIENT_READINESS", at);
    const grouped = admitValidatedMaterialInputs(createHousing(), [hold, release, readiness]);
    for (const order of permutations([hold, release, readiness])) {
      const sequential = order.reduce(
        (state, candidate) => admitValidatedMaterialInputs(state, [candidate]),
        createHousing(),
      );
      expect(sequential).toEqual(grouped);
      const restored = copy(sequential);
      assertIntegratedMaterialHousingState(restored);
      expect(restored).toEqual(grouped);
      expect(deriveMaterialHousingBoundaries(restored, at)).toEqual(deriveMaterialHousingBoundaries(grouped, at));
    }
    expect(project(grouped).history.filter((entry) => entry.occurredAt === at)).toHaveLength(1);
    expect(project(grouped).acceptedGovernmentInputRefs).toEqual([
      "input:batch:hold", "input:batch:readiness", "input:batch:release",
    ]);
  });

  it("I7-REV-003 applies an exact-completion upstream hold before physical completion", () => {
    const initial = createHousing();
    const completion = deriveMaterialHousingBoundaries(initial, epoch)
      .find((boundary) => boundary.ownerId === palmsId && boundary.kind === "HOUSING_PHYSICAL_COMPLETION")!;
    const before = new Date(Date.parse(completion.at) - 1).toISOString();
    const hold = input("input:completion:hold", "COMPLIANCE_HOLD", completion.at, { scopeKey: "constraint:COMPLETION" });

    let coarse = advanceIntegratedMaterialHousing(initial, epoch, completion.at, { deferCompletionsAtTarget: true });
    coarse = admitValidatedMaterialInputs(coarse, [hold]);
    coarse = finalizePendingMaterialHousingCompletions(coarse, completion.at);

    let fine = advanceIntegratedMaterialHousing(initial, epoch, before);
    fine = advanceIntegratedMaterialHousing(fine, before, completion.at, { deferCompletionsAtTarget: true });
    fine = admitValidatedMaterialInputs(fine, [hold]);
    fine = finalizePendingMaterialHousingCompletions(fine, completion.at);
    expect(fine).toEqual(coarse);
    expect(project(coarse)).toMatchObject({
      stage: "BLOCKED",
      complianceHold: true,
      physicalCompletionAt: null,
      pendingPhysicalCompletionAt: null,
    });
    expect(project(coarse).physicalProgressUnits).toBeLessThan(project(coarse).requiredProgressUnits);
    expect(deriveMaterialHousingBoundaries(coarse, completion.at).some((entry) => entry.ownerId === palmsId)).toBe(false);

    const restoredBefore = copy(initial);
    assertIntegratedMaterialHousingState(restoredBefore);
    let afterRestore = advanceIntegratedMaterialHousing(restoredBefore, epoch, completion.at, { deferCompletionsAtTarget: true });
    afterRestore = finalizePendingMaterialHousingCompletions(admitValidatedMaterialInputs(afterRestore, [hold]), completion.at);
    expect(afterRestore).toEqual(coarse);

    const releaseAt = new Date(Date.parse(completion.at) + 86_400_000).toISOString();
    const release = input("input:completion:release", "WAIVER_TERMS", releaseAt, {
      scopeKey: "constraint:COMPLETION",
      releaseOfInputId: hold.id,
      causalPredecessorInputIds: [hold.id],
    });
    const resumed = admitValidatedMaterialInputs(coarse, [release]);
    const rederived = deriveMaterialHousingBoundaries(resumed, releaseAt)
      .find((boundary) => boundary.ownerId === palmsId && boundary.kind === "HOUSING_PHYSICAL_COMPLETION")!;
    expect(Date.parse(rederived.at)).toBeGreaterThan(Date.parse(releaseAt));
  });

  it("I7-REV-004 makes bounded regional capacity causal in progress and completion prediction", () => {
    const initial = createHousing();
    const regionId = project(initial).housingRegionId;
    const withCapacity = (ratio: string): IntegratedMaterialHousingState => ({
      ...copy(initial),
      regions: initial.regions.map((region) => region.id === regionId
        ? { ...copy(region), annualPermittedUnits: 1, permitsPerThousandResidentsExact: ratio }
        : copy(region)),
    });
    const low = withCapacity("1/1");
    const high = withCapacity("10/1");
    assertIntegratedMaterialHousingState(low);
    assertIntegratedMaterialHousingState(high);
    const lowBoundary = deriveMaterialHousingBoundaries(low, epoch).find((entry) => entry.ownerId === palmsId)!;
    const highBoundary = deriveMaterialHousingBoundaries(high, epoch).find((entry) => entry.ownerId === palmsId)!;
    expect(Date.parse(lowBoundary.at)).toBeGreaterThan(Date.parse(highBoundary.at));

    const after = "2026-09-01T00:00:00-04:00";
    const lowAdvanced = advanceIntegratedMaterialHousing(low, epoch, after);
    const highAdvanced = advanceIntegratedMaterialHousing(high, epoch, after);
    expect(project(lowAdvanced).physicalProgressUnits).toBeLessThan(project(highAdvanced).physicalProgressUnits);
    expect(deriveMaterialHousingBoundaries(lowAdvanced, after)[0].at).toBe(lowBoundary.at);
    expect(deriveMaterialHousingBoundaries(highAdvanced, after)[0].at).toBe(highBoundary.at);

    const lowRestored = copy(low);
    assertIntegratedMaterialHousingState(lowRestored);
    expect(advanceIntegratedMaterialHousing(lowRestored, epoch, after)).toEqual(lowAdvanced);
    const zero = withCapacity("0/1");
    expect(project(advanceIntegratedMaterialHousing(zero, epoch, after)).physicalProgressUnits).toBe(0);
  });

  it("I7-REV-005 enforces generated readiness gates and deterministic DELAYED/FAILED routes", () => {
    const initial = createHousing();
    const regionId = initial.regions.find((region) => region.activeProjectIds.length === 0 && region.annualPermittedUnits > 0)!.id;
    let state = admitGeneratedMaterialHousingProject(initial, {
      housingRegionId: regionId,
      projectLocatorGeographyId: "us.geography.fixture.generated-project",
      relationshipId: "us.relationship.fixture.generated-project",
      activityType: "NEW_CONSTRUCTION",
      expectedUnits: 40,
      requiredProgressUnits: 1_000,
      baseProgressUnitsPerDay: 2,
      earliestTransitionAt: epoch,
      causeRef: "housing-owner-fixture:generated-project",
    });
    const generatedId = state.projects.find((entry) => entry.classification === "SIMULATION_GENERATED")!.id;
    const afterYear = advanceIntegratedMaterialHousing(state, epoch, "2027-08-22T00:00:00-04:00");
    expect(project(afterYear, generatedId)).toMatchObject({ stage: "PROPOSED", physicalProgressUnits: 0 });

    state = admitValidatedMaterialInputs(state, [input("input:generated:readiness", "RECIPIENT_READINESS", epoch, { projectRef: generatedId })]);
    expect(project(state, generatedId).stage).toBe("READY_FOR_COMMITMENT");
    state = admitValidatedMaterialInputs(state, [
      input("input:generated:fiscal", "VALID_FISCAL_RESOURCE_INPUT", epoch, { projectRef: generatedId }),
      input("input:generated:environment", "ENVIRONMENTAL_CLEARANCE_REFERENCE", epoch, { projectRef: generatedId }),
      input("input:generated:commitment", "COMMITMENT_REFERENCE", epoch, { projectRef: generatedId }),
    ]);
    expect(project(state, generatedId).stage).toBe("FUNDED_NOT_STARTED");
    expect(project(advanceIntegratedMaterialHousing(state, epoch, "2026-09-01T00:00:00-04:00"), generatedId).physicalProgressUnits).toBe(0);
    state = admitValidatedMaterialInputs(state, [input("input:generated:activation", "INPUT_AVAILABILITY", epoch, { projectRef: generatedId })]);
    expect(project(state, generatedId).stage).toBe("ACTIVE");

    const delayAt = "2026-09-01T00:00:00-04:00";
    const clearAt = "2026-09-11T00:00:00-04:00";
    state = advanceIntegratedMaterialHousing(state, epoch, delayAt);
    const progressBeforeDelay = project(state, generatedId).physicalProgressUnits;
    const activeBoundary = deriveMaterialHousingBoundaries(state, delayAt).find((entry) => entry.ownerId === generatedId)!;
    state = applyMaterialHousingCondition(state, generatedId, "MATERIAL_DELAY_STARTED", delayAt, "fixture:supply-delay");
    expect(project(state, generatedId).stage).toBe("DELAYED");
    const delayedBoundary = deriveMaterialHousingBoundaries(state, delayAt).find((entry) => entry.ownerId === generatedId)!;
    expect(Date.parse(delayedBoundary.at)).toBeGreaterThan(Date.parse(activeBoundary.at));
    state = advanceIntegratedMaterialHousing(state, delayAt, clearAt);
    expect(project(state, generatedId).physicalProgressUnits - progressBeforeDelay).toBe(5);
    const preserved = project(state, generatedId).physicalProgressUnits;
    state = applyMaterialHousingCondition(state, generatedId, "MATERIAL_DELAY_CLEARED", clearAt, "fixture:supply-restored");
    expect(project(state, generatedId)).toMatchObject({ stage: "ACTIVE", physicalProgressUnits: preserved });

    const failedAt = "2026-09-12T00:00:00-04:00";
    state = advanceIntegratedMaterialHousing(state, clearAt, failedAt);
    const stockBeforeFailure = state.regions.find((entry) => entry.id === regionId)!.housingStockUnits;
    state = applyMaterialHousingCondition(state, generatedId, "MATERIAL_PROJECT_FAILED", failedAt, "fixture:terminal-site-failure");
    const failed = project(state, generatedId);
    expect(failed.stage).toBe("FAILED");
    const farFuture = advanceIntegratedMaterialHousing(state, failedAt, "2036-09-12T00:00:00-04:00");
    expect(project(farFuture, generatedId)).toEqual(failed);
    expect(farFuture.regions.find((entry) => entry.id === regionId)!.housingStockUnits).toBe(stockBeforeFailure);
    expect(project(farFuture, generatedId)).toMatchObject({
      physicalCompletionAt: null, usableAt: null, usableUnitContribution: 0,
    });
  });

  it("round-trips repaired generated project and material-condition state and rejects semantic tampering", () => {
    const session = createIntegratedPartialRuntimeAuditSession(
      US_V0_STRUCTURAL_CONFIGURATION, US_V0_I7_RUNTIME_ARTIFACTS, [],
    );
    const regionId = session.getHousingAuditState().projects.find((entry) => entry.id === palmsId)!.housingRegionId;
    session.injectGeneratedHousingProject({
      housingRegionId: regionId,
      projectLocatorGeographyId: "us.geography.fixture.persisted-project",
      relationshipId: "us.relationship.fixture.persisted-project",
      activityType: "REHABILITATION",
      expectedUnits: 5,
      requiredProgressUnits: 50,
      baseProgressUnitsPerDay: 1,
      earliestTransitionAt: epoch,
      causeRef: "housing-owner-fixture:persisted-project",
    });
    session.injectHousingMaterialCondition(palmsId, "MATERIAL_DELAY_STARTED", "fixture:persisted-delay");
    const saved = session.save();
    const restored = createIntegratedPartialRuntimeSessionFromSave(
      saved, US_V0_STRUCTURAL_CONFIGURATION, US_V0_I7_RUNTIME_ARTIFACTS,
    );
    expect(restored.save()).toBe(saved);

    const tampered = JSON.parse(saved);
    tampered.housing.materialConditions[0].classification = "SOURCE_BACKED_HISTORICAL";
    expect(() => createIntegratedPartialRuntimeSessionFromSave(
      JSON.stringify(tampered), US_V0_STRUCTURAL_CONFIGURATION, US_V0_I7_RUNTIME_ARTIFACTS,
    )).toThrow(/condition|semantic|deterministic/i);
  });
});

import { describe, expect, it } from "vitest";

import {
  createIntegratedPartialRuntimeAuditSession,
  createIntegratedPartialRuntimeSession,
} from "../src/app/integrated-session";
import { canonicalConfigurationContent } from "../src/configuration/canonical";
import { sha256Hex } from "../src/configuration/sha256";
import type { GovernmentConfiguration, LegislativeRuntimeSeed } from "../src/configuration/types";
import { US_V0_STRUCTURAL_CONFIGURATION } from "../src/content/us-v0/configuration";
import { US_V0_2028_POPULAR_SELECTION } from "../src/content/us-v0/i5";
import {
  createUsV0I8RouteConfiguration,
  type UsV0I8RouteOptions,
  US_V0_I8_CLAIM_RELEASED,
  US_V0_I8_INFORMATION_CONFIGURATION,
  US_V0_I8_INFORMATION_DELIVERED,
  US_V0_I8_MEASUREMENT_CREATED,
  US_V0_I8_MEASUREMENT_RELEASED,
  US_V0_I8_OBSERVATION_CAPTURE,
  US_V0_I8_POPULATION_EXPOSED,
  US_V0_I8_POPULATION_RESPONSE,
  US_V0_I8_RUNTIME_ARTIFACTS,
} from "../src/content/us-v0/i8";
import { createUsV0I9RouteConfiguration } from "../src/content/us-v0/i9";

const configurationVariant = (
  options: UsV0I8RouteOptions,
): GovernmentConfiguration<LegislativeRuntimeSeed> => {
  const route = createUsV0I8RouteConfiguration(options);
  const i9Route = createUsV0I9RouteConfiguration({}, route.temporal);
  const unhashed: GovernmentConfiguration<LegislativeRuntimeSeed> = {
    ...US_V0_STRUCTURAL_CONFIGURATION,
    identity: { ...US_V0_STRUCTURAL_CONFIGURATION.identity, configurationHash: "0".repeat(64) },
    integratedRuntime: {
      ...US_V0_STRUCTURAL_CONFIGURATION.integratedRuntime!,
      temporal: i9Route.temporal,
      information: route.information,
      legalContest: i9Route.legalContest,
    },
  };
  return {
    ...unhashed,
    identity: {
      ...unhashed.identity,
      configurationHash: sha256Hex(canonicalConfigurationContent(unhashed)),
    },
  };
};

const createSession = (configuration = US_V0_STRUCTURAL_CONFIGURATION) =>
  createIntegratedPartialRuntimeSession(configuration, US_V0_I8_RUNTIME_ARTIFACTS);

const variables = (value: { readonly variables: readonly { readonly name: string; readonly value: unknown }[] }) =>
  Object.fromEntries(value.variables.map((entry) => [entry.name, entry.value]));

describe("I8 reconciled measurement, information, and public response", () => {
  it("preserves neutral, uncertain, approximated Day-0 political initialization", () => {
    const session = createSession();
    expect(session.getAuditState().population.cohorts.every((cohort) =>
      cohort.politicalState.belief === "UNCERTAIN_UNRESOLVED" &&
      cohort.politicalState.attribution === "NONE_UNKNOWN" &&
      cohort.politicalState.salience === "NEUTRAL_LOW" &&
      cohort.politicalState.candidatePreference === "UNRESOLVED" &&
      cohort.politicalState.turnoutDisposition === "UNRESOLVED" &&
      cohort.politicalState.classification.includes("APPROXIMATED") &&
      cohort.politicalState.classification.includes("NON_HISTORICAL"))).toBe(true);
    expect(JSON.stringify(US_V0_I8_INFORMATION_CONFIGURATION)).not.toMatch(
      /poll|approval|democrat|republican|ideology|party registration|2024 presidential/i,
    );
  });

  it("keeps every causal stage separate and ordinary projections non-omniscient", () => {
    const session = createSession();
    session.advanceTo(US_V0_I8_OBSERVATION_CAPTURE);
    expect(session.getInformationAuditState()).toMatchObject({
      measurementProcesses: [{ status: "OBSERVED" }],
      measurementArtifacts: [],
      releases: [],
      claims: [],
      deliveries: [],
      exposures: [],
      responses: [],
    });
    expect(session.getPublicInformationStatus()).toEqual({
      releasedMeasurements: [], releasedClaims: [], completedDeliveryIds: [], publicExposureCount: 0,
    });
    expect(session.getHousingAuditState().materialExposureReferences.length).toBeGreaterThan(0);

    session.advanceTo(US_V0_I8_MEASUREMENT_CREATED);
    const measured = session.getInformationAuditState();
    expect(measured.measurementArtifacts).toHaveLength(1);
    expect(measured.measurementArtifacts[0].measuredValues.some((entry) =>
      entry.approximation === "DETERMINISTIC_BOUNDED_APPROXIMATION")).toBe(true);
    expect(measured.measurementArtifacts[0].measuredValues.some((entry) => {
      const observation = measured.observations.find((candidate) => candidate.id === entry.sourceObservationId);
      const captured = observation?.variables.find((candidate) => candidate.name === entry.name);
      return captured !== undefined && captured.value !== entry.value;
    })).toBe(true);
    expect(session.getPublicInformationStatus().releasedMeasurements).toHaveLength(0);

    session.advanceTo(US_V0_I8_MEASUREMENT_RELEASED);
    expect(session.getInformationAuditState().releases).toHaveLength(1);
    expect(session.getPublicInformationStatus().releasedMeasurements).toHaveLength(1);
    expect(session.getPublicInformationStatus()).not.toHaveProperty("observations");
    expect(session.getPublicInformationStatus()).not.toHaveProperty("responses");

    session.advanceTo(US_V0_I8_CLAIM_RELEASED);
    expect(session.getInformationAuditState().claims[0]).toMatchObject({
      position: "PROGRAM_WORKING",
      evidenceArtifactIds: ["us.information-artifact.housing-material-report-2027"],
    });
    expect(session.getInformationAuditState().deliveries).toHaveLength(0);
    session.advanceTo(US_V0_I8_INFORMATION_DELIVERED);
    expect(session.getInformationAuditState().deliveries).toHaveLength(1);
    expect(session.getInformationAuditState().exposures).toHaveLength(0);
    session.advanceTo(US_V0_I8_POPULATION_EXPOSED);
    expect(session.getInformationAuditState().exposures).toHaveLength(1);
    expect(session.getInformationAuditState().responses).toHaveLength(0);
  }, 30_000);

  it("observes accepted I7 stage truth, including failure, delay, physical completion, and usability", () => {
    const normal = createSession();
    normal.advanceTo(US_V0_I8_OBSERVATION_CAPTURE);
    const normalObservation = normal.getInformationAuditState().observations.find((entry) =>
      entry.subjectRef === "us.project.stables")!;
    expect(variables(normalObservation)).toMatchObject({
      MATERIAL_STAGE: "USABLE",
      PHYSICAL_COMPLETION_AT: "2027-09-26T04:00:00.000Z",
      USABLE_AT: "2027-10-03T04:00:00.000Z",
      USABLE_UNIT_CONTRIBUTION: 85,
    });
    expect(normalObservation.sourceMaterialReferences.some((entry) => entry.startsWith("material-exposure:"))).toBe(true);

    const physicalConfiguration = configurationVariant({ observationAt: "2027-09-26T00:00:00-04:00" });
    const physical = createSession(physicalConfiguration);
    const physicalAt = physicalConfiguration.integratedRuntime!.information!.measurements[0].observationBoundaryId;
    const physicalBoundary = physicalConfiguration.integratedRuntime!.temporal!.boundaries.find((entry) => entry.id === physicalAt)!;
    physical.advanceTo(physicalBoundary.at);
    const physicalObservation = physical.getInformationAuditState().observations.find((entry) =>
      entry.subjectRef === "us.project.stables")!;
    expect(variables(physicalObservation)).toMatchObject({
      MATERIAL_STAGE: "PHYSICALLY_COMPLETE",
      USABLE_UNIT_CONTRIBUTION: 0,
    });
    expect(physicalObservation.sourceMaterialReferences.some((entry) => entry.startsWith("material-exposure:"))).toBe(false);

    const failed = createIntegratedPartialRuntimeAuditSession(
      US_V0_STRUCTURAL_CONFIGURATION, US_V0_I8_RUNTIME_ARTIFACTS, [],
    );
    failed.injectHousingMaterialCondition("us.project.stables", "MATERIAL_PROJECT_FAILED", "i8-failure-proof");
    failed.advanceTo(US_V0_I8_OBSERVATION_CAPTURE);
    expect(variables(failed.getInformationAuditState().observations.find((entry) =>
      entry.subjectRef === "us.project.stables")!)).toMatchObject({
      MATERIAL_STAGE: "FAILED", PHYSICAL_COMPLETION_AT: null, USABLE_AT: null,
    });

    const delayed = createIntegratedPartialRuntimeAuditSession(
      US_V0_STRUCTURAL_CONFIGURATION, US_V0_I8_RUNTIME_ARTIFACTS, [],
    );
    delayed.injectHousingMaterialCondition("us.project.stables", "MATERIAL_DELAY_STARTED", "i8-delay-proof");
    delayed.advanceTo(US_V0_I8_OBSERVATION_CAPTURE);
    expect(variables(delayed.getInformationAuditState().observations.find((entry) =>
      entry.subjectRef === "us.project.stables")!)).toMatchObject({
      MATERIAL_STAGE: "DELAYED", PHYSICAL_COMPLETION_AT: null, USABLE_AT: null,
    });
  }, 45_000);

  it("targets comparable cohort children, conserves weight, and separates direct experience from information", () => {
    const session = createSession();
    const before = session.getAuditState().population;
    const beforeWeight = before.cohorts.reduce((sum, cohort) => sum + cohort.representedWeight, 0);
    const parentStates = new Map(US_V0_I8_INFORMATION_CONFIGURATION.exposure.targets.map((target) => {
      const parent = before.cohorts.find((cohort) => cohort.id === target.parentCohortId)!;
      return [parent.id, { weight: parent.representedWeight, politicalState: parent.politicalState }];
    }));
    session.advanceTo(US_V0_I8_POPULATION_RESPONSE);
    const state = session.getAuditState();
    const exposure = state.information!.exposures[0];
    const targeted = state.population.cohorts.filter((cohort) => exposure.cohortIds.includes(cohort.id));
    const untargeted = state.population.cohorts.filter((cohort) =>
      cohort.lineage.causeKey === exposure.id && !exposure.cohortIds.includes(cohort.id));
    expect(targeted).toHaveLength(2);
    expect(untargeted).toHaveLength(2);
    expect(targeted.some((cohort) => cohort.materialExposureReferences.length > 0)).toBe(true);
    expect(targeted.some((cohort) => cohort.materialExposureReferences.length === 0)).toBe(true);
    expect(new Set(targeted.map((cohort) => cohort.politicalState.belief)).size).toBe(2);
    expect(untargeted.every((cohort) =>
      !cohort.receivedInformationReferences.includes(exposure.id) &&
      JSON.stringify(cohort.politicalState) === JSON.stringify(
        parentStates.get(cohort.lineage.parentCohortId!)!.politicalState,
      ))).toBe(true);
    for (const [parentId, parent] of parentStates) {
      expect(state.population.cohorts.filter((cohort) => cohort.lineage.parentCohortId === parentId)
        .reduce((sum, cohort) => sum + cohort.representedWeight, 0)).toBe(parent.weight);
    }
    expect(state.population.cohorts.reduce((sum, cohort) => sum + cohort.representedWeight, 0)).toBe(beforeWeight);
  }, 30_000);

  it("changes response timing with measurement lag without changing Housing", () => {
    const shortConfiguration = configurationVariant({ observationLagDays: 0 });
    const longConfiguration = configurationVariant({ observationLagDays: 30 });
    const short = createSession(shortConfiguration);
    const long = createSession(longConfiguration);
    const shortResponseAt = shortConfiguration.integratedRuntime!.temporal!.boundaries.find((entry) =>
      entry.kind === "POPULATION_RESPONSE")!.at;
    const longResponseAt = longConfiguration.integratedRuntime!.temporal!.boundaries.find((entry) =>
      entry.kind === "POPULATION_RESPONSE")!.at;
    short.advanceTo(shortResponseAt);
    long.advanceTo(shortResponseAt);
    expect(short.getInformationAuditState().responses).toHaveLength(2);
    expect(long.getInformationAuditState().responses).toHaveLength(0);
    expect(long.getHousingAuditState()).toEqual(short.getHousingAuditState());
    short.advanceTo(longResponseAt);
    long.advanceTo(longResponseAt);
    expect(long.getHousingAuditState()).toEqual(short.getHousingAuditState());
    expect(long.getInformationAuditState().responses).toHaveLength(2);
  }, 45_000);

  it("changes claim framing and Population response without changing measurement or Housing", () => {
    const workingConfiguration = configurationVariant({ claimPosition: "PROGRAM_WORKING" });
    const inadequateConfiguration = configurationVariant({ claimPosition: "PROGRAM_INADEQUATE" });
    const working = createSession(workingConfiguration);
    const inadequate = createSession(inadequateConfiguration);
    const workingAt = workingConfiguration.integratedRuntime!.temporal!.boundaries.find((entry) =>
      entry.kind === "POPULATION_RESPONSE")!.at;
    const inadequateAt = inadequateConfiguration.integratedRuntime!.temporal!.boundaries.find((entry) =>
      entry.kind === "POPULATION_RESPONSE")!.at;
    working.advanceTo(workingAt);
    inadequate.advanceTo(inadequateAt);
    expect(inadequate.getHousingAuditState()).toEqual(working.getHousingAuditState());
    expect(inadequate.getInformationAuditState().measurementArtifacts)
      .toEqual(working.getInformationAuditState().measurementArtifacts);
    expect(inadequate.getInformationAuditState().claims[0].position).not.toBe(
      working.getInformationAuditState().claims[0].position,
    );
    expect(inadequate.getInformationAuditState().responses.map((entry) => entry.preference.value))
      .not.toEqual(working.getInformationAuditState().responses.map((entry) => entry.preference.value));
  }, 45_000);

  it("orders same-instant Housing before observation independent of declaration order", () => {
    const forwardConfiguration = configurationVariant({ reverseDeclarationOrder: false });
    const reverseConfiguration = configurationVariant({ reverseDeclarationOrder: true });
    const forward = createSession(forwardConfiguration);
    const reverse = createSession(reverseConfiguration);
    const captureAt = forwardConfiguration.integratedRuntime!.temporal!.boundaries.find((entry) =>
      entry.kind === "OBSERVATION_CAPTURE")!.at;
    forward.advanceTo(captureAt);
    reverse.advanceTo(captureAt);
    expect(reverse.getHousingAuditState()).toEqual(forward.getHousingAuditState());
    expect(reverse.getInformationAuditState()).toEqual(forward.getInformationAuditState());
    expect(variables(forward.getInformationAuditState().observations.find((entry) =>
      entry.subjectRef === "us.project.stables")!).MATERIAL_STAGE).toBe("USABLE");
  }, 30_000);

  it("is coarse/fine invariant and only feeds election through Population political state", () => {
    const coarse = createSession();
    const fine = createSession();
    coarse.advanceTo(US_V0_I8_POPULATION_RESPONSE);
    for (const at of [
      US_V0_I8_OBSERVATION_CAPTURE,
      US_V0_I8_MEASUREMENT_CREATED,
      US_V0_I8_MEASUREMENT_RELEASED,
      US_V0_I8_CLAIM_RELEASED,
      US_V0_I8_INFORMATION_DELIVERED,
      US_V0_I8_POPULATION_EXPOSED,
      US_V0_I8_POPULATION_RESPONSE,
    ]) fine.advanceTo(at);
    expect(fine.getAuditState()).toEqual(coarse.getAuditState());
    expect(coarse.getAuditState().institutional!.selection.popularResults).toHaveLength(0);
    const responseCohorts = new Set(coarse.getInformationAuditState().responses.map((entry) => entry.cohortId));
    coarse.advanceTo(US_V0_2028_POPULAR_SELECTION);
    const electionEntries = coarse.getAuditState().institutional!.selection.snapshots
      .flatMap((snapshot) => snapshot.entries)
      .filter((entry) => responseCohorts.has(entry.cohortId));
    expect(electionEntries).toHaveLength(responseCohorts.size);
    expect(electionEntries.some((entry) => entry.candidatePreference === "PLAYER_ALIGNED")).toBe(true);
    expect(electionEntries.some((entry) => entry.candidatePreference === "UNRESOLVED")).toBe(true);
  }, 45_000);
});

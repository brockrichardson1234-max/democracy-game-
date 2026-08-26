import { describe, expect, it } from "vitest";

import {
  createIntegratedPartialRuntimeSession,
  createIntegratedPartialRuntimeSessionFromSave,
} from "../src/app/integrated-session";
import { canonicalConfigurationContent } from "../src/configuration/canonical";
import { sha256Hex } from "../src/configuration/sha256";
import type { GovernmentConfiguration, LegislativeRuntimeSeed } from "../src/configuration/types";
import { US_V0_STRUCTURAL_CONFIGURATION } from "../src/content/us-v0/configuration";
import { US_V0_2029_TRANSFER } from "../src/content/us-v0/i5";
import {
  createUsV0I8RouteConfiguration,
  type UsV0I8RouteOptions,
  US_V0_I8_RUNTIME_ARTIFACTS,
} from "../src/content/us-v0/i8";
import { createUsV0I9RouteConfiguration } from "../src/content/us-v0/i9";
import {
  approximateAffordabilityPressureBasisPoints,
  captureIntegratedHousingObservation,
  createIntegratedInformationRuntimeState,
} from "../src/sim/integrated-information";
import {
  allocatePopulationExposureTargetWeight,
  applyConfiguredPopulationInformationExposure,
  type WeightedPopulationState,
} from "../src/sim/population-core";

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
    identity: { ...unhashed.identity, configurationHash: sha256Hex(canonicalConfigurationContent(unhashed)) },
  };
};

const createSession = (configuration: GovernmentConfiguration<LegislativeRuntimeSeed>) =>
  createIntegratedPartialRuntimeSession(configuration, US_V0_I8_RUNTIME_ARTIFACTS);

const restore = (serialized: string, configuration: GovernmentConfiguration<LegislativeRuntimeSeed>) =>
  createIntegratedPartialRuntimeSessionFromSave(serialized, configuration, US_V0_I8_RUNTIME_ARTIFACTS);

const boundaryAt = (configuration: GovernmentConfiguration<LegislativeRuntimeSeed>, kind: string): string =>
  configuration.integratedRuntime!.temporal!.boundaries.find((boundary) => boundary.kind === kind)!.at;

describe("I8 bounded repair findings", () => {
  it("I8-REV-001 resolves post-succession claims identically across direct, save, coarse, and fine paths", () => {
    const configuration = configurationVariant({
      observationAt: US_V0_2029_TRANSFER,
      captureLagDays: 0,
      releaseLagDays: 0,
    });
    const claimAt = boundaryAt(configuration, "CLAIM_RELEASED");
    const direct = createSession(configuration);
    direct.advanceTo(claimAt);
    const successorId = direct.getAuditState().institutional!.currentAdministration.id;
    expect(direct.getInformationAuditState().claims[0].claimantId).toBe(successorId);

    const savedBeforeSuccession = createSession(configuration);
    savedBeforeSuccession.advanceTo("2029-01-20T16:59:59.000Z");
    const restoredBefore = restore(savedBeforeSuccession.save(), configuration);
    restoredBefore.advanceTo(claimAt);

    const savedAfterSuccession = createSession(configuration);
    savedAfterSuccession.advanceTo(US_V0_2029_TRANSFER);
    expect(savedAfterSuccession.getControlBindingAudit().status).toMatch(/ACTIVE|ENDED/);
    const restoredAfter = restore(savedAfterSuccession.save(), configuration);
    restoredAfter.advanceTo(claimAt);

    const fine = createSession(configuration);
    for (const boundary of configuration.integratedRuntime!.temporal!.boundaries
      .filter((entry) => Date.parse(entry.at) <= Date.parse(claimAt))) {
      fine.advanceTo(boundary.at);
    }
    expect(restoredBefore.getInformationAuditState().claims[0]).toEqual(direct.getInformationAuditState().claims[0]);
    expect(restoredAfter.getInformationAuditState().claims[0]).toEqual(direct.getInformationAuditState().claims[0]);
    expect(fine.getInformationAuditState().claims[0]).toEqual(direct.getInformationAuditState().claims[0]);
    expect(restore(direct.save(), configuration).getInformationAuditState().claims[0])
      .toEqual(direct.getInformationAuditState().claims[0]);
  }, 90_000);

  it("I8-REV-001 makes exact-transfer claimant authority explicit and declaration-order independent", () => {
    const common = {
      observationAt: "2029-01-19T12:00:00-05:00",
      captureLagDays: 0,
      releaseLagDays: 0,
    } as const;
    const outgoing = configurationVariant({ ...common, claimBoundaryPhase: -1 });
    const outgoingReverse = configurationVariant({ ...common, claimBoundaryPhase: -1, reverseDeclarationOrder: true });
    const successor = configurationVariant(common);
    const outgoingSession = createSession(outgoing);
    const outgoingReverseSession = createSession(outgoingReverse);
    const successorSession = createSession(successor);
    outgoingSession.advanceTo(US_V0_2029_TRANSFER);
    outgoingReverseSession.advanceTo(US_V0_2029_TRANSFER);
    successorSession.advanceTo(US_V0_2029_TRANSFER);
    expect(outgoingSession.getInformationAuditState().claims[0].claimantId)
      .toBe(outgoing.integratedRuntime!.temporal!.initialAdministration.id);
    expect(outgoingReverseSession.getInformationAuditState().claims[0])
      .toEqual(outgoingSession.getInformationAuditState().claims[0]);
    expect(successorSession.getInformationAuditState().claims[0].claimantId)
      .toBe(successorSession.getAuditState().institutional!.currentAdministration.id);
    expect(restore(outgoingSession.save(), outgoing).getInformationAuditState().claims[0])
      .toEqual(outgoingSession.getInformationAuditState().claims[0]);
  }, 60_000);

  it("I8-REV-002 defines deterministic, conservation-safe 1/2 targeting for weights 1, 2, and 3", () => {
    for (const representedWeight of [1, 2, 3]) {
      const state: WeightedPopulationState = {
        controls: [{
          id: "control", residenceGeographyId: "state", representedWeight,
          sourceArtifactId: "artifact", sourceField: "field", referenceDate: "2025-01-01",
          classification: "TEST",
        }],
        cohorts: [{
          id: "parent", representedWeight, residenceGeographyId: "state", stateControlId: "control",
          materialExposureClass: "CLASS", catchmentClass: "CATCHMENT", projectLocatorGeographyId: "project",
          materialExposureReferences: [], receivedInformationReferences: [],
          politicalState: {
            belief: "UNCERTAIN", attribution: "NONE", salience: "LOW",
            candidatePreference: "UNRESOLVED", turnoutDisposition: "UNRESOLVED", classification: "TEST",
          },
          eligibilityProjection: {
            projectionId: "proxy", allocatedWeight: representedWeight, shareNumerator: 1,
            shareDenominator: 1, allocationPolicy: "TEST", classification: "TEST",
          },
          lineage: { version: "scaffold", generation: 0, parentCohortId: null, causeKey: "initial" },
        }],
        eligibilityProxies: [{
          id: "proxy", residenceGeographyId: "state", sourceEstimate: 1, sourceDenominator: 1,
          sourceEstimateMoe: 0, sourceDenominatorMoe: 0, representedWeight,
          shareNumerator: 1, shareDenominator: 1, unroundedRational: String(representedWeight),
          integerizationPolicy: "TEST", transformationVersion: "TEST", classification: "TEST",
        }],
        scaffoldVersion: "scaffold", refinementSemanticVersion: "refinement", sourceArtifactIds: ["artifact"],
      };
      const input = {
        exposureId: "exposure",
        targets: [{
          stateGeographyId: "state", parentCohortId: "parent", projectLocatorGeographyId: "project",
          materialExposureClass: "CLASS", catchmentClass: "CATCHMENT",
        }],
        targetNumerator: 1,
        targetDenominator: 2,
      };
      const first = applyConfiguredPopulationInformationExposure(state, input);
      const reconstructed = applyConfiguredPopulationInformationExposure(structuredClone(state), input);
      expect(reconstructed).toEqual(first);
      expect(first.cohortWeights.reduce((sum, entry) => sum + entry.representedWeight, 0))
        .toBe(allocatePopulationExposureTargetWeight(representedWeight, 1, 2));
      expect(first.population.cohorts.reduce((sum, cohort) => sum + cohort.representedWeight, 0))
        .toBe(representedWeight);
      expect(first.population.cohorts.reduce((sum, cohort) =>
        sum + cohort.eligibilityProjection.allocatedWeight, 0)).toBe(representedWeight);
      if (representedWeight === 1) expect(first.population.cohorts).toHaveLength(1);
      else expect(first.population.cohorts.map((cohort) => cohort.representedWeight).sort()).toEqual(
        representedWeight === 2 ? [1, 1] : [1, 2],
      );
    }
  });

  it("I8-REV-002 rejects independent and coordinated canonical exposure-slice tampering", () => {
    const configuration = configurationVariant({});
    const session = createSession(configuration);
    session.advanceTo(boundaryAt(configuration, "POPULATION_RESPONSE"));
    const saved = session.save();
    type MutableCohort = {
      id: string;
      representedWeight: number;
      materialExposureReferences: string[];
      receivedInformationReferences: string[];
      eligibilityProjection: { allocatedWeight: number };
      lineage: { generation: number; causeKey: string };
    };
    type MutableEnvelope = {
      population: { cohorts: MutableCohort[] };
      information: { exposures: { representedWeight: number }[] };
    };
    const exposureId = configuration.integratedRuntime!.information!.exposure.id;
    const attack = (mutate: (targeted: MutableCohort, untargeted: MutableCohort, envelope: MutableEnvelope) => void) => {
      const envelope = JSON.parse(saved) as MutableEnvelope;
      const siblings = envelope.population.cohorts.filter((cohort) => cohort.lineage.causeKey === exposureId);
      const targeted = siblings.find((cohort) => cohort.receivedInformationReferences.includes(exposureId))!;
      const untargeted = siblings.find((cohort) => !cohort.receivedInformationReferences.includes(exposureId))!;
      mutate(targeted, untargeted, envelope);
      expect(() => restore(JSON.stringify(envelope), configuration)).toThrow();
    };
    const attacks = [
      (targeted: MutableCohort) => { targeted.id += ".tampered"; },
      (_targeted: MutableCohort, untargeted: MutableCohort) => { untargeted.id += ".tampered"; },
      (targeted: MutableCohort) => { targeted.representedWeight += 1; },
      (_targeted: MutableCohort, untargeted: MutableCohort) => { untargeted.representedWeight -= 1; },
      (targeted: MutableCohort) => { targeted.eligibilityProjection.allocatedWeight += 1; },
      (targeted: MutableCohort) => { targeted.lineage.generation += 1; },
      (targeted: MutableCohort) => { targeted.lineage.causeKey = "tampered"; },
      (targeted: MutableCohort) => { targeted.receivedInformationReferences[0] = "tampered"; },
      (targeted: MutableCohort) => { targeted.materialExposureReferences.push("tampered"); },
      (_targeted: MutableCohort, _untargeted: MutableCohort, envelope: MutableEnvelope) => {
        envelope.information.exposures[0].representedWeight += 1;
      },
    ] as const;
    for (const mutate of attacks) attack(mutate);
    attack((targeted, untargeted, envelope) => {
      targeted.representedWeight += 1;
      untargeted.representedWeight -= 1;
      targeted.eligibilityProjection.allocatedWeight += 1;
      untargeted.eligibilityProjection.allocatedWeight -= 1;
      envelope.information.exposures[0].representedWeight += 1;
    });
  }, 90_000);

  it("I8-REV-003 accepts every nonnegative zero-lag combination with stable dependency ordering", () => {
    for (const [captureLagDays, releaseLagDays] of [[0, 3], [3, 0], [0, 0]] as const) {
      const forwardConfiguration = configurationVariant({ captureLagDays, releaseLagDays });
      const reverseConfiguration = configurationVariant({ captureLagDays, releaseLagDays, reverseDeclarationOrder: true });
      const endAt = boundaryAt(forwardConfiguration, "POPULATION_RESPONSE");
      const coarse = createSession(forwardConfiguration);
      const fine = createSession(forwardConfiguration);
      const reverse = createSession(reverseConfiguration);
      coarse.advanceTo(endAt);
      for (const boundary of forwardConfiguration.integratedRuntime!.temporal!.boundaries
        .filter((entry) => entry.ownerId === forwardConfiguration.integratedRuntime!.information!.ownerId)) {
        fine.advanceTo(boundary.at);
      }
      reverse.advanceTo(endAt);
      expect(fine.getAuditState()).toEqual(coarse.getAuditState());
      expect(reverse.getInformationAuditState()).toEqual(coarse.getInformationAuditState());
      expect(coarse.getInformationAuditState().measurementProcesses[0].status).toBe("RELEASED");
      expect(restore(coarse.save(), forwardConfiguration).getAuditState()).toEqual(coarse.getAuditState());
    }
    for (const options of [
      { observationLagDays: -1 },
      { captureLagDays: -1 },
      { releaseLagDays: -1 },
    ]) {
      expect(() => createSession(configurationVariant(options))).toThrow(/invalid causal ownership|boundary semantics/);
    }
  }, 90_000);

  it("I8-REV-004 records endpoint-snapshot window semantics and rejects ambiguous provenance", () => {
    const configuration = configurationVariant({});
    const session = createSession(configuration);
    const observationAt = boundaryAt(configuration, "OBSERVATION_CAPTURE");
    session.advanceTo(observationAt);
    const housingA = session.getHousingAuditState();
    const housingB = {
      ...housingA,
      projects: housingA.projects.map((project, index) => index === 0
        ? { ...project, history: [...project.history].reverse() }
        : project),
    };
    expect(housingB.projects[0].history).not.toEqual(housingA.projects[0].history);
    const informationConfiguration = configuration.integratedRuntime!.information!;
    const temporal = configuration.integratedRuntime!.temporal!;
    const measurement = informationConfiguration.measurements[0];
    const observedA = captureIntegratedHousingObservation(
      createIntegratedInformationRuntimeState(informationConfiguration, temporal.boundaries),
      measurement, housingA, observationAt,
    );
    const observedB = captureIntegratedHousingObservation(
      createIntegratedInformationRuntimeState(informationConfiguration, temporal.boundaries),
      measurement, housingB, observationAt,
    );
    expect(observedB.observations).toEqual(observedA.observations);
    expect(observedA.observations.every((observation) =>
      observation.observationMode === "SNAPSHOT_AS_OF_OBSERVATION_END_OVER_DECLARED_WINDOW")).toBe(true);
    const changedEndpoint = {
      ...housingA,
      regions: housingA.regions.map((region) => region.id === measurement.housingRegionIds[0]
        ? { ...region, affordabilityPressureBasisPoints: region.affordabilityPressureBasisPoints + 1 }
        : region),
    };
    const observedChanged = captureIntegratedHousingObservation(
      createIntegratedInformationRuntimeState(informationConfiguration, temporal.boundaries),
      measurement, changedEndpoint, observationAt,
    );
    expect(observedChanged.observations).not.toEqual(observedA.observations);
    const envelope = JSON.parse(session.save()) as {
      information: { observations: { observationMode: string }[] };
    };
    envelope.information.observations[0].observationMode = "AMBIGUOUS_PERIOD_STATISTIC";
    expect(() => restore(JSON.stringify(envelope), configuration)).toThrow();
    const { parameterHash, ...withoutHash } = informationConfiguration;
    expect(parameterHash).toBe(sha256Hex(JSON.stringify(withoutHash)));
    expect(sha256Hex(JSON.stringify({ ...withoutHash, measurements: withoutHash.measurements.map((entry) => ({
      ...entry, observationSemanticVersion: `${entry.observationSemanticVersion}.changed`,
    })) }))).not.toBe(parameterHash);
  }, 45_000);

  it("I8-REV-005 keeps deterministic affordability approximation inside domain and error bounds", () => {
    const measurement = createUsV0I8RouteConfiguration().information.measurements[0];
    for (const canonicalValue of [0, 1, 24, 25, 9_975, 9_999, 10_000]) {
      for (const id of [measurement.id, `${measurement.id}.alternate`]) {
        for (const subjectRef of ["region-a", "region-b"]) {
          const configured = { ...measurement, id };
          const first = approximateAffordabilityPressureBasisPoints(configured, subjectRef, canonicalValue);
          const second = approximateAffordabilityPressureBasisPoints(configured, subjectRef, canonicalValue);
          expect(second).toBe(first);
          expect(first).toBeGreaterThanOrEqual(0);
          expect(first).toBeLessThanOrEqual(10_000);
          expect(Math.abs(first - canonicalValue)).toBeLessThanOrEqual(measurement.deterministicErrorBound);
        }
      }
      expect(approximateAffordabilityPressureBasisPoints(
        { ...measurement, deterministicErrorBound: 0 }, "region-zero-bound", canonicalValue,
      )).toBe(canonicalValue);
    }
    const configuration = configurationVariant({});
    const session = createSession(configuration);
    session.advanceTo(boundaryAt(configuration, "MEASUREMENT_CREATED"));
    const measuredValues = session.getInformationAuditState().measurementArtifacts[0].measuredValues;
    expect(measuredValues.filter((entry) => entry.approximation === "DETERMINISTIC_BOUNDED_APPROXIMATION")
      .every((entry) => entry.name === "AFFORDABILITY_PRESSURE_BASIS_POINTS")).toBe(true);
    expect(measuredValues.filter((entry) => entry.name !== "AFFORDABILITY_PRESSURE_BASIS_POINTS")
      .every((entry) => entry.approximation === "EXACT_CAPTURE")).toBe(true);
  });
});

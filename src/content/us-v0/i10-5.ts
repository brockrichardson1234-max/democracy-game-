import { sha256Hex } from "../../configuration/sha256";
import type { IntegratedCalibrationConfiguration } from "../../configuration/types";

import housingArtifact from "./i7-artifacts/housing-initialization.json";
import { US_V0_I6_IMPLEMENTATION_CONFIGURATION } from "./i6";
import { US_V0_I7_HOUSING_CONFIGURATION } from "./i7";
import { US_V0_I8_INFORMATION_CONFIGURATION } from "./i8";
import {
  US_V0_I9_LEGAL_CONTEST_CONFIGURATION,
  US_V0_I9_TEMPORAL_CONFIGURATION,
} from "./i9";
import { US_V0_I10_COMPOSITION_CONFIGURATION, US_V0_I10_RUNTIME_ARTIFACTS } from "./i10";

export const US_V0_I10_5_CALIBRATION_VERSION = "us-v0-calibration-content-audit-1";

const cycles = US_V0_I9_TEMPORAL_CONFIGURATION.assignmentCycles;
const selection = US_V0_I9_TEMPORAL_CONFIGURATION.selection;
const projects = housingArtifact.projects;
const material = housingArtifact.calibration;
const ownerParameterHashes = [
  US_V0_I9_TEMPORAL_CONFIGURATION.parameterHash,
  US_V0_I6_IMPLEMENTATION_CONFIGURATION.parameterHash,
  US_V0_I7_HOUSING_CONFIGURATION.parameterHash,
  US_V0_I8_INFORMATION_CONFIGURATION.parameterHash,
  US_V0_I9_LEGAL_CONTEST_CONFIGURATION.parameterHash,
  US_V0_I10_COMPOSITION_CONFIGURATION.parameterHash,
] as const;

type Entry = IntegratedCalibrationConfiguration["entries"][number];
const entry = (
  value: Omit<Entry, "systemWideDirectOutcome">,
): Entry => ({ ...value, systemWideDirectOutcome: false });

const entries: readonly Entry[] = [
  entry({ id: "rollover.population-influence-bps", ownerParameterHash: ownerParameterHashes[0], sourcePath: "temporal.assignmentCycles[*].populationInfluence", domain: "CONGRESSIONAL_ROLLOVER", value: cycles[0].populationInfluence.numerator * 10_000 / cycles[0].populationInfluence.denominator, lowerBound: 5_000, upperBound: 9_500, evidenceClass: "SIMULATION_SCAFFOLD", expectedDirection: "INCREASING", scope: "OWNER_BOUNDED" }),
  entry({ id: "rollover.incumbent-influence-bps", ownerParameterHash: ownerParameterHashes[0], sourcePath: "temporal.assignmentCycles[*].incumbentInfluence", domain: "CONGRESSIONAL_ROLLOVER", value: cycles[0].incumbentInfluence.numerator * 10_000 / cycles[0].incumbentInfluence.denominator, lowerBound: 500, upperBound: 5_000, evidenceClass: "SIMULATION_SCAFFOLD", expectedDirection: "INCREASING", scope: "OWNER_BOUNDED" }),
  entry({ id: "selection.low-turnout-bps", ownerParameterHash: ownerParameterHashes[0], sourcePath: "temporal.selection.populationScaffold.turnoutWeights.LOW", domain: "ELECTION_READINESS", value: selection.populationScaffold.turnoutWeights.LOW.numerator * 10_000 / selection.populationScaffold.turnoutWeights.LOW.denominator, lowerBound: 1_000, upperBound: 7_000, evidenceClass: "SIMULATION_SCAFFOLD", expectedDirection: "INCREASING", scope: "OWNER_BOUNDED" }),
  entry({ id: "selection.medium-turnout-bps", ownerParameterHash: ownerParameterHashes[0], sourcePath: "temporal.selection.populationScaffold.turnoutWeights.MEDIUM", domain: "ELECTION_READINESS", value: selection.populationScaffold.turnoutWeights.MEDIUM.numerator * 10_000 / selection.populationScaffold.turnoutWeights.MEDIUM.denominator, lowerBound: 2_000, upperBound: 9_000, evidenceClass: "SIMULATION_SCAFFOLD", expectedDirection: "INCREASING", scope: "OWNER_BOUNDED" }),
  entry({ id: "selection.high-turnout-bps", ownerParameterHash: ownerParameterHashes[0], sourcePath: "temporal.selection.populationScaffold.turnoutWeights.HIGH", domain: "ELECTION_READINESS", value: selection.populationScaffold.turnoutWeights.HIGH.numerator * 10_000 / selection.populationScaffold.turnoutWeights.HIGH.denominator, lowerBound: 4_000, upperBound: 10_000, evidenceClass: "SIMULATION_SCAFFOLD", expectedDirection: "INCREASING", scope: "OWNER_BOUNDED" }),
  entry({ id: "selection.unresolved-player-threshold-bps", ownerParameterHash: ownerParameterHashes[0], sourcePath: "temporal.selection.populationScaffold.fallbackPreferenceThresholds[0]", domain: "ELECTION_READINESS", value: selection.populationScaffold.fallbackPreferenceThresholds[0]!.cumulativeUpperBound.numerator * 10_000 / selection.populationScaffold.fallbackPreferenceThresholds[0]!.cumulativeUpperBound.denominator, lowerBound: 4_000, upperBound: 6_000, evidenceClass: "SIMULATION_SCAFFOLD", expectedDirection: "INCREASING", scope: "OWNER_BOUNDED" }),
  ...Object.entries(US_V0_I6_IMPLEMENTATION_CONFIGURATION.administrativeCapacitySupport).map(([key, value]) => entry({ id: `administration.${key.toLowerCase()}.latency-days`, ownerParameterHash: ownerParameterHashes[1], sourcePath: `implementation.administrativeCapacitySupport.${key}.processingLatencyDays`, domain: "ADMINISTRATIVE_CAPACITY", value: value.processingLatencyDays, lowerBound: 1, upperBound: 90, evidenceClass: "APPROXIMATED", expectedDirection: "DECREASING", scope: "OWNER_BOUNDED" })),
  entry({ id: "administration.waiver-return-delay-days", ownerParameterHash: ownerParameterHashes[1], sourcePath: "implementation.futureWaiver.returnReviewDelayDays", domain: "ADMINISTRATIVE_REVIEW", value: US_V0_I6_IMPLEMENTATION_CONFIGURATION.futureWaiver.returnReviewDelayDays, lowerBound: 1, upperBound: 60, evidenceClass: "APPROXIMATED", expectedDirection: "DECREASING", scope: "LOCAL" }),
  entry({ id: "housing.physical-to-usable-lag-days", ownerParameterHash: ownerParameterHashes[2], sourcePath: "housing.physicalToUsableLagDays", domain: "HOUSING_MATERIAL", value: US_V0_I7_HOUSING_CONFIGURATION.physicalToUsableLagDays, lowerBound: 1, upperBound: 60, evidenceClass: "APPROXIMATED", expectedDirection: "DECREASING", scope: "LOCAL" }),
  entry({ id: "housing.usable-vacancy-contribution-bps", ownerParameterHash: ownerParameterHashes[2], sourcePath: "housingInitialization.calibration.usableVacancyContribution", domain: "HOUSING_MATERIAL", value: material.usableVacancyContributionNumerator * 10_000 / material.usableVacancyContributionDenominator, lowerBound: 1_000, upperBound: 10_000, evidenceClass: "APPROXIMATED", expectedDirection: "INCREASING", scope: "LOCAL" }),
  entry({ id: "housing.delayed-progress-rate-bps", ownerParameterHash: ownerParameterHashes[2], sourcePath: "housingInitialization.calibration.delayedRate", domain: "HOUSING_MATERIAL", value: material.delayedRateNumerator * 10_000 / material.delayedRateDenominator, lowerBound: 1_000, upperBound: 9_000, evidenceClass: "APPROXIMATED", expectedDirection: "INCREASING", scope: "LOCAL" }),
  ...projects.map((project) => entry({ id: `housing.${project.id}.progress-units-per-day`, ownerParameterHash: ownerParameterHashes[2], sourcePath: `housingInitialization.projects.${project.id}.baseProgressUnitsPerDay`, domain: "HOUSING_MATERIAL", value: project.baseProgressUnitsPerDay, lowerBound: 1, upperBound: 1_000, evidenceClass: "SIMULATION_SCAFFOLD", expectedDirection: "INCREASING", scope: "LOCAL" })),
  entry({ id: "information.material-measurement-error-bound", ownerParameterHash: ownerParameterHashes[3], sourcePath: "information.measurements[MATERIAL_STATISTICAL].deterministicErrorBound", domain: "MEASUREMENT", value: US_V0_I8_INFORMATION_CONFIGURATION.measurements.find((measurement) => measurement.measurementKind === "MATERIAL_STATISTICAL")!.deterministicErrorBound, lowerBound: 0, upperBound: 100, evidenceClass: "APPROXIMATED", expectedDirection: "NEUTRAL_OR_CATEGORICAL", scope: "LOCAL" }),
  entry({ id: "information.targeted-exposure-share-bps", ownerParameterHash: ownerParameterHashes[3], sourcePath: "information.exposure.targetNumerator/targetDenominator", domain: "INFORMATION_EXPOSURE", value: US_V0_I8_INFORMATION_CONFIGURATION.exposure.targetNumerator * 10_000 / US_V0_I8_INFORMATION_CONFIGURATION.exposure.targetDenominator, lowerBound: 500, upperBound: 9_500, evidenceClass: "SIMULATION_SCAFFOLD", expectedDirection: "INCREASING", scope: "LOCAL" }),
];

const calibrationWithoutHash = {
  schemaVersion: 1,
  version: US_V0_I10_5_CALIBRATION_VERSION,
  ownerParameterHashes,
  perturbationBasisPoints: 500,
  entries,
};

export const US_V0_I10_5_CALIBRATION_CONFIGURATION: IntegratedCalibrationConfiguration = {
  ...calibrationWithoutHash,
  parameterHash: sha256Hex(JSON.stringify(calibrationWithoutHash)),
};

export const US_V0_I10_5_RUNTIME_ARTIFACTS = US_V0_I10_RUNTIME_ARTIFACTS;

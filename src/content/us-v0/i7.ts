import { sha256Hex } from "../../configuration/sha256";
import type { IntegratedHousingConfiguration } from "../../configuration/types";
import type { IntegratedRuntimeArtifactBundle } from "../../sim/integrated-runtime";

import housingArtifact from "./i7-artifacts/housing-initialization.json";
import housingManifest from "./i7-artifacts/i7-initialization-manifest.json";
import { US_V0_I6_RUNTIME_ARTIFACTS } from "./i6";
export { US_V0_I6_IMPLEMENTATION_CONFIGURATION } from "./i6";

export const US_V0_I7_HOUSING_SEMANTICS_VERSION = "us-v0-housing-material-route-2";
export const US_V0_I7_SCOPED_RELEASE_VERSION = "us-v0-housing-scoped-release-1";
export const US_V0_I7_INPUT_BATCH_VERSION = "us-v0-housing-material-input-batch-1";
export const US_V0_I7_DEPENDENCY_PHASE_VERSION = "us-v0-upstream-material-housing-phase-1";
export const US_V0_I7_EFFECTIVE_RATE_VERSION = "us-v0-housing-effective-material-rate-1";
export const US_V0_I7_STAGE_READINESS_VERSION = "us-v0-housing-stage-readiness-1";
export const US_V0_I7_DELAY_VERSION = "us-v0-housing-material-delay-1";
export const US_V0_I7_FAILURE_VERSION = "us-v0-housing-material-failure-1";

const housingWithoutHash = {
  schemaVersion: 1,
  initializationArtifactId: housingManifest.housing.initializationArtifactId,
  semanticsVersion: US_V0_I7_HOUSING_SEMANTICS_VERSION,
  catchmentScaffoldVersion: housingManifest.housing.catchmentScaffoldVersion,
  materialCalibrationVersion: housingManifest.housing.materialCalibrationVersion,
  physicalToUsableLagDays: 7,
  scopedReleaseSemanticVersion: US_V0_I7_SCOPED_RELEASE_VERSION,
  materialInputBatchSemanticVersion: US_V0_I7_INPUT_BATCH_VERSION,
  dependencyPhaseSemanticVersion: US_V0_I7_DEPENDENCY_PHASE_VERSION,
  effectiveMaterialRateSemanticVersion: US_V0_I7_EFFECTIVE_RATE_VERSION,
  stageReadinessSemanticVersion: US_V0_I7_STAGE_READINESS_VERSION,
  delaySemanticVersion: US_V0_I7_DELAY_VERSION,
  failureSemanticVersion: US_V0_I7_FAILURE_VERSION,
  housingBoundaryPhase: 1_000,
  requiredGeneratedProjectInputKinds: [
    "VALID_FISCAL_RESOURCE_INPUT",
    "RECIPIENT_READINESS",
    "ENVIRONMENTAL_CLEARANCE_REFERENCE",
    "COMMITMENT_REFERENCE",
  ],
  activationInputKind: "INPUT_AVAILABILITY",
  capacityPrior: {
    lowUpperPermitsPerThousandMilliUnits: 4_000,
    highLowerPermitsPerThousandMilliUnits: 8_000,
    lowRateNumerator: 1,
    lowRateDenominator: 2,
    normalRateNumerator: 1,
    normalRateDenominator: 1,
    highRateNumerator: 3,
    highRateDenominator: 2,
  },
  expectedControlCount: housingManifest.housing.controlCount,
  expectedRegionCount: housingManifest.housing.regionCount,
  expectedProjectCount: housingManifest.housing.projectCount,
  classification: "APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD" as const,
};

export const US_V0_I7_HOUSING_CONFIGURATION: IntegratedHousingConfiguration = {
  ...housingWithoutHash,
  parameterHash: sha256Hex(JSON.stringify(housingWithoutHash)),
};

export const US_V0_I7_RUNTIME_ARTIFACTS = {
  ...US_V0_I6_RUNTIME_ARTIFACTS,
  housingInitialization: housingArtifact,
} as unknown as IntegratedRuntimeArtifactBundle;

export const US_V0_I7_ARTIFACT_BINDING = housingManifest.artifactBindings[0];

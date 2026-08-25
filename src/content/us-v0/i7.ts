import { sha256Hex } from "../../configuration/sha256";
import type { IntegratedHousingConfiguration } from "../../configuration/types";
import type { IntegratedRuntimeArtifactBundle } from "../../sim/integrated-runtime";

import housingArtifact from "./i7-artifacts/housing-initialization.json";
import housingManifest from "./i7-artifacts/i7-initialization-manifest.json";
import { US_V0_I6_RUNTIME_ARTIFACTS } from "./i6";
export { US_V0_I6_IMPLEMENTATION_CONFIGURATION } from "./i6";

export const US_V0_I7_HOUSING_SEMANTICS_VERSION = "us-v0-housing-material-route-1";

const housingWithoutHash = {
  schemaVersion: 1,
  initializationArtifactId: housingManifest.housing.initializationArtifactId,
  semanticsVersion: US_V0_I7_HOUSING_SEMANTICS_VERSION,
  catchmentScaffoldVersion: housingManifest.housing.catchmentScaffoldVersion,
  materialCalibrationVersion: housingManifest.housing.materialCalibrationVersion,
  physicalToUsableLagDays: 7,
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

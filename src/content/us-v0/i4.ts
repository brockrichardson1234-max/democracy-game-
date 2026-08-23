import type { IntegratedRuntimeArtifactBundle } from "../../sim/integrated-runtime";

import cvapArtifact from "./i4-artifacts/cvap-proxy-state-2020-2024.json";
import districtGeographyArtifact from "./i4-artifacts/district-geography-cd119-2025.json";
import electoralArtifact from "./i4-artifacts/electoral-allocation-2028.json";
import cohortArtifact from "./i4-artifacts/population-initial-cohorts-2026-08-22.json";
import projectLocatorArtifact from "./i4-artifacts/project-locators.json";
import populationArtifact from "./i4-artifacts/resident-population-controls-2025.json";
import stateGeographyArtifact from "./i4-artifacts/state-geography-2025.json";
import tenureArtifact from "./i4-artifacts/tenure-exposure-input-acs2024.json";

/** Committed immutable content; runtime networking is neither needed nor permitted. */
export const US_V0_I4_RUNTIME_ARTIFACTS = {
  geography: [
    stateGeographyArtifact,
    districtGeographyArtifact,
    {
      metadata: projectLocatorArtifact.metadata,
      features: projectLocatorArtifact.records.map((record) => ({
        ...record,
        kind: "PROJECT_LOCATOR",
        jurisdictionId: record.stateFips === "08" ? "us.jurisdiction.state.08" : "us.jurisdiction.state.48",
        sourceArtifactId: projectLocatorArtifact.metadata.artifactId,
      })),
    },
  ],
  populationControls: populationArtifact,
  populationMeasurements: [tenureArtifact],
  eligibilityProxies: cvapArtifact,
  populationCohorts: cohortArtifact,
  electoralTopology: electoralArtifact,
} as unknown as IntegratedRuntimeArtifactBundle;

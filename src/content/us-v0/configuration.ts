import type {
  GovernmentConfiguration,
  LegislativeRuntimeSeed,
  RuntimeArtifactBinding,
} from "../../configuration/types";
import i4Manifest from "./i4-artifacts/i4-initialization-manifest.json";
import { US_V0_I5_STRUCTURE } from "./i5";
import {
  US_V0_I6_ARTIFACT_BINDING,
  US_V0_I6_IMPLEMENTATION_CONFIGURATION,
} from "./i6";
import { US_V0_I7_ARTIFACT_BINDING, US_V0_I7_HOUSING_CONFIGURATION } from "./i7";
import { US_V0_I8_INFORMATION_CONFIGURATION } from "./i8";
import { US_V0_I9_LEGAL_CONTEST_CONFIGURATION, US_V0_I9_TEMPORAL_CONFIGURATION } from "./i9";
import { US_V0_I10_COMPOSITION_CONFIGURATION } from "./i10";
import { US_V0_LEGISLATIVE_SEED } from "./legislative-owner-content";

export * from "./legislative-owner-content";

/** Accepted U.S. owners composed as the production game runtime. */
export const US_V0_STRUCTURAL_CONFIGURATION: GovernmentConfiguration<LegislativeRuntimeSeed> = {
  identity: {
    configurationId: "us-v0",
    configurationVersion: "0.10.1-i10-repair",
    scenarioId: "us-v0-2026-08-22",
    scenarioVersion: "0.10.1-i10-repair",
    configurationHash: "8f298a593166247f09906b091caf1ed13ba8fba193c475fac467a3b13d86be40",
  },
  capability: "INTEGRATED_PARTIAL_RUNTIME",
  calendar: { kind: "REAL_CALENDAR", epoch: "2026-08-22T00:00:00-04:00" },
  structure: US_V0_I5_STRUCTURE,
  transitions: [],
  runtimeSeed: US_V0_LEGISLATIVE_SEED,
  integratedRuntime: {
    schemaVersion: i4Manifest.schemaVersion,
    artifactBindings: [
      ...i4Manifest.artifactBindings,
      US_V0_I6_ARTIFACT_BINDING,
      US_V0_I7_ARTIFACT_BINDING,
    ] as readonly RuntimeArtifactBinding[],
    geography: i4Manifest.geography,
    population: i4Manifest.population,
    electoral: i4Manifest.electoral,
    temporal: US_V0_I9_TEMPORAL_CONFIGURATION,
    implementation: US_V0_I6_IMPLEMENTATION_CONFIGURATION,
    housing: US_V0_I7_HOUSING_CONFIGURATION,
    information: US_V0_I8_INFORMATION_CONFIGURATION,
    legalContest: US_V0_I9_LEGAL_CONTEST_CONFIGURATION,
    composition: US_V0_I10_COMPOSITION_CONFIGURATION,
  },
};

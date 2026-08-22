import type { GovernmentConfiguration } from "../../configuration/types";

/**
 * I1-only structural adversary. It is intentionally non-playable and contains
 * no U.S. Day-0 population, offices, geography, institutions, programs, or actors.
 */
export const US_V0_STRUCTURAL_CONFIGURATION: GovernmentConfiguration<never> = {
  identity: {
    configurationId: "us-v0-structural-proof",
    configurationVersion: "0.1.0-i1",
    scenarioId: "us-v0-i1-nonplayable-skeleton",
    scenarioVersion: "0.1.0-i1",
    configurationHash: "8d69798a0c993d413932dbb2f2536b391c0da1adbd811a66cc360a5bbc8f7b30",
  },
  capability: "STRUCTURAL_PROOF_ONLY",
  calendar: { kind: "REAL_CALENDAR", epoch: "2026-08-22" },
  structure: {
    legislatureId: "us-congress-structure-pending-i2",
    chambers: [
      { id: "us-house-structure-pending-i2", seatCount: null },
      { id: "us-senate-structure-pending-i2", seatCount: null },
    ],
    jurisdictionIds: ["us-national-jurisdiction-structure-pending-i2"],
  },
  transitions: [],
  runtimeSeed: null,
};

import type { GovernmentConfiguration } from "../../configuration/types";
import { US_V0_I2_STRUCTURE } from "./topology";

/**
 * I2 bounded governmental topology. It is intentionally non-playable and has
 * no Population, Housing, program, election, or causal-world seed.
 */
export const US_V0_STRUCTURAL_CONFIGURATION: GovernmentConfiguration<never> = {
  identity: {
    configurationId: "us-v0",
    configurationVersion: "0.2.0-i2",
    scenarioId: "us-v0-2026-08-22",
    scenarioVersion: "0.2.0-i2",
    configurationHash: "e1211bf5fe8107c16af57302d723faf88e19622ed61f0aa37428057b7052a2ce",
  },
  capability: "STRUCTURAL_PROOF_ONLY",
  calendar: { kind: "REAL_CALENDAR", epoch: "2026-08-22T00:00:00-04:00" },
  structure: US_V0_I2_STRUCTURE,
  transitions: [],
  runtimeSeed: null,
};

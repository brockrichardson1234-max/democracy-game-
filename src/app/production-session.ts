import {
  createIntegratedPartialRuntimeSession,
  createIntegratedPartialRuntimeSessionFromSave,
  type IntegratedPartialRuntimeSession,
} from "./integrated-session";
import { US_V0_STRUCTURAL_CONFIGURATION } from "../content/us-v0/configuration";
import { US_V0_I10_RUNTIME_ARTIFACTS } from "../content/us-v0/i10";
import type { GovernmentConfiguration, LegislativeRuntimeSeed } from "../configuration/types";
import type { IntegratedRuntimeArtifactBundle } from "../sim/integrated-runtime";

export type ProductionGameSession = IntegratedPartialRuntimeSession;

/**
 * The single normal application factory. Omit the save for a new accepted U.S. game.
 * Explicit configuration arguments support deterministic capability fixtures without runtime mutation.
 */
export const createProductionGameSession = (
  serializedSave?: string,
  configuration: GovernmentConfiguration<LegislativeRuntimeSeed> = US_V0_STRUCTURAL_CONFIGURATION,
  artifacts: IntegratedRuntimeArtifactBundle = US_V0_I10_RUNTIME_ARTIFACTS,
): ProductionGameSession =>
  serializedSave === undefined
    ? createIntegratedPartialRuntimeSession(configuration, artifacts)
    : createIntegratedPartialRuntimeSessionFromSave(
        serializedSave,
        configuration,
        artifacts,
      );

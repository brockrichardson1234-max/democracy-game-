import { sha256Hex } from "../../configuration/sha256";
import type { IntegratedCompositionConfiguration } from "../../configuration/types";
import { US_V0_I6_IMPLEMENTATION_CONFIGURATION } from "./i6";
import { US_V0_I7_HOUSING_CONFIGURATION } from "./i7";
import { US_V0_I8_INFORMATION_CONFIGURATION } from "./i8";
import {
  US_V0_I9_LEGAL_CONTEST_CONFIGURATION,
  US_V0_I9_RUNTIME_ARTIFACTS,
  US_V0_I9_TEMPORAL_CONFIGURATION,
} from "./i9";

export const US_V0_I10_COMPOSITION_SEMANTICS_VERSION = "us-v0-production-runtime-convergence-2";
export const US_V0_I10_PRODUCTION_PROJECTION_VERSION = "us-v0-production-game-projection-2";
export const US_V0_I10_AUTONOMOUS_OWNER_RESOLUTION_VERSION = "us-v0-normal-owner-resolution-2";

const compositionWithoutHash = {
  schemaVersion: 1 as const,
  semanticsVersion: US_V0_I10_COMPOSITION_SEMANTICS_VERSION,
  classification: "APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD" as const,
  productionProjectionVersion: US_V0_I10_PRODUCTION_PROJECTION_VERSION,
  autonomousOwnerResolutionVersion: US_V0_I10_AUTONOMOUS_OWNER_RESOLUTION_VERSION,
  ownerReferences: {
    implementationOwnerId: US_V0_I6_IMPLEMENTATION_CONFIGURATION.publicFinanceOwnerId,
    materialOwnerId: US_V0_I7_HOUSING_CONFIGURATION.semanticsVersion,
    informationOwnerId: US_V0_I8_INFORMATION_CONFIGURATION.ownerId,
    legalContestOwnerId: US_V0_I9_LEGAL_CONTEST_CONFIGURATION.ownerId,
    institutionalOwnerId: US_V0_I9_TEMPORAL_CONFIGURATION.scheduleVersion,
  },
  forbiddenShortcuts: [
    "ENACTMENT_DOES_NOT_DIRECTLY_CREATE_FISCAL_EXECUTION",
    "FISCAL_INPUT_DOES_NOT_DIRECTLY_SET_MATERIAL_RESULT",
    "MATERIAL_STATE_DOES_NOT_DIRECTLY_MUTATE_POPULATION",
    "INFORMATION_DOES_NOT_DIRECTLY_SET_SELECTION_WINNER",
    "JUDICIAL_STATE_DOES_NOT_DIRECTLY_REWRITE_PROGRAM_OR_MATERIAL_HISTORY",
    "PLAYER_DOES_NOT_SELECT_AUTONOMOUS_OWNER_OUTCOMES",
  ],
};

export const US_V0_I10_COMPOSITION_CONFIGURATION: IntegratedCompositionConfiguration = {
  ...compositionWithoutHash,
  parameterHash: sha256Hex(JSON.stringify(compositionWithoutHash)),
};

export const US_V0_I10_RUNTIME_ARTIFACTS = US_V0_I9_RUNTIME_ARTIFACTS;

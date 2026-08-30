import {
  computePresidentialOperatingConfigurationHash,
  PRESIDENTIAL_OPERATING_RUNTIME_SCHEMA_VERSION,
  type PresidentialOperatingRuntimeConfiguration,
} from "../../sim/presidential-operating-runtime";

export const POP0_V0_CONFIGURATION_ID = "presidential-operating-proof";
export const POP0_V0_CONFIGURATION_VERSION = "0.1.0-pop0-i1";
export const POP0_V0_SCENARIO_ID = "us-presidential-operating-proof-v0";
export const POP0_V0_SCENARIO_VERSION = "0.1.0-pop0-i1";
export const POP0_V0_CLASSIFICATION = "APPROXIMATED_NON_HISTORICAL_PRODUCT_PROOF";
export const POP0_V0_OPERATING_STATE_ID = "pop0.operating-world.primary";
export const POP0_V0_CALENDAR_OWNER_ID = "pop0.owner.calendar";
export const POP0_V0_EPOCH = "2029-02-05T08:00:00-05:00";

const configurationWithoutHash = {
  schemaVersion: PRESIDENTIAL_OPERATING_RUNTIME_SCHEMA_VERSION,
  identity: {
    configurationId: POP0_V0_CONFIGURATION_ID,
    configurationVersion: POP0_V0_CONFIGURATION_VERSION,
    scenarioId: POP0_V0_SCENARIO_ID,
    scenarioVersion: POP0_V0_SCENARIO_VERSION,
  },
  classification: POP0_V0_CLASSIFICATION,
  operatingStateId: POP0_V0_OPERATING_STATE_ID,
  calendar: {
    ownerId: POP0_V0_CALENDAR_OWNER_ID,
    epoch: POP0_V0_EPOCH,
    boundaries: [],
  },
} as const;

export const POP0_V0_OPERATING_CONFIGURATION: PresidentialOperatingRuntimeConfiguration = {
  ...configurationWithoutHash,
  identity: {
    ...configurationWithoutHash.identity,
    configurationHash: computePresidentialOperatingConfigurationHash(configurationWithoutHash),
  },
};

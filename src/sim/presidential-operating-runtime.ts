import { sha256Hex } from "../configuration/sha256";
import type { ConfigurationIdentity } from "../configuration/types";
import {
  assertCalendarTimeState,
  createCalendarTimeState,
  expectedProcessedBoundaryIds,
  type CalendarTimeState,
  type ConfiguredCalendarBoundary,
} from "./calendar-time";
import {
  assertPresidentialAdministrationConfiguration,
  assertPresidentialAdministrationOwnerStates,
  copyPresidentialAdministrationOwnerStates,
  createPresidentialAdministrationOwnerStates,
  type PresidentialAdministrationConfiguration,
  type PresidentialAdministrationOwnerStates,
} from "./presidential-office-information";
import {
  advancePresidentialInterventionTime,
  assertPresidentialInterventionConfiguration,
  assertPresidentialInterventionOwnerStates,
  copyPresidentialInterventionOwnerStates,
  createPresidentialInterventionOwnerStates,
  type PresidentialInterventionConfiguration,
  type PresidentialInterventionOwnerStates,
} from "./presidential-operating-intervention";

export const PRESIDENTIAL_OPERATING_RUNTIME_SCHEMA_VERSION = 3 as const;

export interface PresidentialOperatingRuntimeConfiguration {
  readonly schemaVersion: typeof PRESIDENTIAL_OPERATING_RUNTIME_SCHEMA_VERSION;
  readonly identity: ConfigurationIdentity;
  readonly classification: string;
  readonly operatingStateId: string;
  readonly calendar: {
    readonly ownerId: string;
    readonly epoch: string;
    readonly boundaries: readonly ConfiguredCalendarBoundary[];
  };
  readonly administration: PresidentialAdministrationConfiguration;
  readonly intervention: PresidentialInterventionConfiguration;
}

export interface PresidentialOperatingRuntimeState {
  readonly schemaVersion: typeof PRESIDENTIAL_OPERATING_RUNTIME_SCHEMA_VERSION;
  readonly operatingStateId: string;
  readonly configuration: ConfigurationIdentity;
  readonly ownerStates: {
    readonly calendar: {
      readonly ownerId: string;
      readonly state: CalendarTimeState;
    };
  } & PresidentialAdministrationOwnerStates & PresidentialInterventionOwnerStates;
}

const requireNonempty = (value: string, field: string): void => {
  if (value.trim().length === 0) throw new Error(`Presidential operating ${field} is required.`);
};

const configurationHashPayload = (
  configuration: Omit<PresidentialOperatingRuntimeConfiguration, "identity"> & {
    readonly identity: Omit<ConfigurationIdentity, "configurationHash">;
  },
): unknown => configuration;

export const computePresidentialOperatingConfigurationHash = (
  configuration: Omit<PresidentialOperatingRuntimeConfiguration, "identity"> & {
    readonly identity: Omit<ConfigurationIdentity, "configurationHash">;
  },
): string => sha256Hex(JSON.stringify(configurationHashPayload(configuration)));

export const assertPresidentialOperatingRuntimeConfiguration = (
  configuration: PresidentialOperatingRuntimeConfiguration,
): void => {
  if (configuration.schemaVersion !== PRESIDENTIAL_OPERATING_RUNTIME_SCHEMA_VERSION) {
    throw new Error("Unsupported presidential operating runtime schema version.");
  }
  requireNonempty(configuration.classification, "classification");
  requireNonempty(configuration.operatingStateId, "state identity");
  requireNonempty(configuration.calendar.ownerId, "calendar owner identity");
  for (const field of [
    "configurationId",
    "configurationVersion",
    "scenarioId",
    "scenarioVersion",
  ] as const) requireNonempty(configuration.identity[field], `configuration.${field}`);
  const expectedHash = computePresidentialOperatingConfigurationHash({
    schemaVersion: configuration.schemaVersion,
    identity: {
      configurationId: configuration.identity.configurationId,
      configurationVersion: configuration.identity.configurationVersion,
      scenarioId: configuration.identity.scenarioId,
      scenarioVersion: configuration.identity.scenarioVersion,
    },
    classification: configuration.classification,
    operatingStateId: configuration.operatingStateId,
    calendar: configuration.calendar,
    administration: configuration.administration,
    intervention: configuration.intervention,
  });
  if (configuration.identity.configurationHash !== expectedHash) {
    throw new Error(
      `Presidential operating configuration hash mismatch: declared ${configuration.identity.configurationHash}, computed ${expectedHash}.`,
    );
  }
  assertCalendarTimeState(
    createCalendarTimeState(configuration.calendar.epoch, configuration.calendar.boundaries),
    configuration.calendar.epoch,
    configuration.calendar.boundaries,
  );
  assertPresidentialAdministrationConfiguration(
    configuration.administration,
    configuration.calendar.epoch,
  );
  assertPresidentialInterventionConfiguration(
    configuration.intervention,
    configuration.administration,
    configuration.calendar.epoch,
  );
}

export const createPresidentialOperatingRuntimeState = (
  configuration: PresidentialOperatingRuntimeConfiguration,
): PresidentialOperatingRuntimeState => {
  assertPresidentialOperatingRuntimeConfiguration(configuration);
  const administration = createPresidentialAdministrationOwnerStates(
    configuration.administration,
    configuration.calendar.epoch,
  );
  const intervention = createPresidentialInterventionOwnerStates(
    configuration.intervention,
    configuration.administration,
    configuration.calendar.epoch,
  );
  return {
    schemaVersion: PRESIDENTIAL_OPERATING_RUNTIME_SCHEMA_VERSION,
    operatingStateId: configuration.operatingStateId,
    configuration: { ...configuration.identity },
    ownerStates: {
      calendar: {
        ownerId: configuration.calendar.ownerId,
        state: createCalendarTimeState(
          configuration.calendar.epoch,
          configuration.calendar.boundaries,
        ),
      },
      ...administration,
      ...intervention,
    },
  };
};

export const copyPresidentialOperatingRuntimeState = (
  state: PresidentialOperatingRuntimeState,
): PresidentialOperatingRuntimeState => {
  const administration = copyPresidentialAdministrationOwnerStates(state.ownerStates);
  const intervention = copyPresidentialInterventionOwnerStates(state.ownerStates);
  return {
    schemaVersion: state.schemaVersion,
    operatingStateId: state.operatingStateId,
    configuration: { ...state.configuration },
    ownerStates: {
      calendar: {
        ownerId: state.ownerStates.calendar.ownerId,
        state: {
          current: state.ownerStates.calendar.state.current,
          processedBoundaryIds: [...state.ownerStates.calendar.state.processedBoundaryIds],
        },
      },
      ...administration,
      ...intervention,
    },
  };
};

export const assertPresidentialOperatingRuntimeState = (
  state: PresidentialOperatingRuntimeState,
  configuration: PresidentialOperatingRuntimeConfiguration,
): void => {
  assertPresidentialOperatingRuntimeConfiguration(configuration);
  if (
    state.schemaVersion !== PRESIDENTIAL_OPERATING_RUNTIME_SCHEMA_VERSION ||
    state.operatingStateId !== configuration.operatingStateId ||
    state.ownerStates.calendar.ownerId !== configuration.calendar.ownerId
  ) throw new Error("Presidential operating state does not match its configured owners.");
  for (const field of [
    "configurationId",
    "configurationVersion",
    "scenarioId",
    "scenarioVersion",
    "configurationHash",
  ] as const) {
    if (state.configuration[field] !== configuration.identity[field]) {
      throw new Error(`Presidential operating state configuration mismatch at ${field}.`);
    }
  }
  assertCalendarTimeState(
    state.ownerStates.calendar.state,
    configuration.calendar.epoch,
    configuration.calendar.boundaries,
  );
  assertPresidentialAdministrationOwnerStates(
    state.ownerStates,
    configuration.administration,
    configuration.calendar.epoch,
    state.ownerStates.calendar.state.current,
  );
  assertPresidentialInterventionOwnerStates(
    state.ownerStates,
    configuration.administration,
    configuration.intervention,
    configuration.calendar.epoch,
    state.ownerStates.calendar.state.current,
  );
};

export const advancePresidentialOperatingRuntimeTime = (
  state: PresidentialOperatingRuntimeState,
  configuration: PresidentialOperatingRuntimeConfiguration,
  target: string,
): PresidentialOperatingRuntimeState => {
  assertPresidentialOperatingRuntimeState(state, configuration);
  const currentValue = Date.parse(state.ownerStates.calendar.state.current);
  const targetValue = Date.parse(target);
  if (!Number.isFinite(targetValue) || targetValue < currentValue) {
    throw new Error("Presidential operating time requires a valid nondecreasing target.");
  }
  const advancedOwners = advancePresidentialInterventionTime(
    state.ownerStates,
    configuration.administration,
    configuration.intervention,
    configuration.calendar.epoch,
    state.ownerStates.calendar.state.current,
    target,
  );
  const next: PresidentialOperatingRuntimeState = {
    ...state,
    ownerStates: {
      ...advancedOwners,
      calendar: {
        ...state.ownerStates.calendar,
        state: {
          current: target,
          processedBoundaryIds: expectedProcessedBoundaryIds(
            target,
            configuration.calendar.boundaries,
          ),
        },
      },
    },
  };
  assertPresidentialOperatingRuntimeState(next, configuration);
  return next;
};

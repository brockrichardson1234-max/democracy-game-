import { assertConfigurationIdentityCompatible } from "../configuration/loader";
import type { ConfigurationIdentity } from "../configuration/types";
import {
  assertPresidentialOperatingRuntimeState,
  copyPresidentialOperatingRuntimeState,
  PRESIDENTIAL_OPERATING_RUNTIME_SCHEMA_VERSION,
  type PresidentialOperatingRuntimeConfiguration,
  type PresidentialOperatingRuntimeState,
} from "../sim/presidential-operating-runtime";

export const PRESIDENTIAL_OPERATING_SAVE_FORMAT_VERSION = 1 as const;

export interface PresidentialOperatingSaveV1 {
  readonly formatVersion: typeof PRESIDENTIAL_OPERATING_SAVE_FORMAT_VERSION;
  readonly configuration: ConfigurationIdentity;
  readonly operatingState: PresidentialOperatingRuntimeState;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const requireRecord = (value: unknown, field: string): Record<string, unknown> => {
  if (!isRecord(value)) throw new Error(`Invalid presidential operating save: ${field} must be an object.`);
  return value;
};

const requireExactKeys = (
  value: Record<string, unknown>,
  field: string,
  expected: readonly string[],
): void => {
  const actual = Object.keys(value).sort();
  const sortedExpected = [...expected].sort();
  if (JSON.stringify(actual) !== JSON.stringify(sortedExpected)) {
    throw new Error(`Invalid presidential operating save: ${field} has an unsupported shape.`);
  }
};

const parseConfigurationIdentity = (value: unknown, field: string): ConfigurationIdentity => {
  const identity = requireRecord(value, field);
  requireExactKeys(identity, field, [
    "configurationId",
    "configurationVersion",
    "scenarioId",
    "scenarioVersion",
    "configurationHash",
  ]);
  for (const key of [
    "configurationId",
    "configurationVersion",
    "scenarioId",
    "scenarioVersion",
    "configurationHash",
  ] as const) {
    if (typeof identity[key] !== "string" || identity[key].length === 0) {
      throw new Error(`Invalid presidential operating save: ${field}.${key} is required.`);
    }
  }
  return {
    configurationId: identity.configurationId as string,
    configurationVersion: identity.configurationVersion as string,
    scenarioId: identity.scenarioId as string,
    scenarioVersion: identity.scenarioVersion as string,
    configurationHash: identity.configurationHash as string,
  };
};

const parseOperatingState = (value: unknown): PresidentialOperatingRuntimeState => {
  const state = requireRecord(value, "operatingState");
  requireExactKeys(state, "operatingState", [
    "schemaVersion",
    "operatingStateId",
    "configuration",
    "ownerStates",
  ]);
  if (
    state.schemaVersion !== PRESIDENTIAL_OPERATING_RUNTIME_SCHEMA_VERSION ||
    typeof state.operatingStateId !== "string" ||
    state.operatingStateId.length === 0
  ) throw new Error("Invalid presidential operating save: unsupported operatingState identity.");

  const ownerStates = requireRecord(state.ownerStates, "operatingState.ownerStates");
  requireExactKeys(ownerStates, "operatingState.ownerStates", ["calendar"]);
  const calendarOwner = requireRecord(ownerStates.calendar, "operatingState.ownerStates.calendar");
  requireExactKeys(calendarOwner, "operatingState.ownerStates.calendar", ["ownerId", "state"]);
  if (typeof calendarOwner.ownerId !== "string" || calendarOwner.ownerId.length === 0) {
    throw new Error("Invalid presidential operating save: calendar owner identity is required.");
  }
  const calendarState = requireRecord(calendarOwner.state, "operatingState.ownerStates.calendar.state");
  requireExactKeys(calendarState, "operatingState.ownerStates.calendar.state", [
    "current",
    "processedBoundaryIds",
  ]);
  if (
    typeof calendarState.current !== "string" ||
    !Array.isArray(calendarState.processedBoundaryIds) ||
    calendarState.processedBoundaryIds.some((id) => typeof id !== "string")
  ) throw new Error("Invalid presidential operating save: calendar state is invalid.");

  return {
    schemaVersion: PRESIDENTIAL_OPERATING_RUNTIME_SCHEMA_VERSION,
    operatingStateId: state.operatingStateId,
    configuration: parseConfigurationIdentity(state.configuration, "operatingState.configuration"),
    ownerStates: {
      calendar: {
        ownerId: calendarOwner.ownerId,
        state: {
          current: calendarState.current,
          processedBoundaryIds: [...calendarState.processedBoundaryIds] as string[],
        },
      },
    },
  };
};

export const serializePresidentialOperatingSave = (
  state: PresidentialOperatingRuntimeState,
  configuration: PresidentialOperatingRuntimeConfiguration,
): string => {
  assertPresidentialOperatingRuntimeState(state, configuration);
  return JSON.stringify({
    formatVersion: PRESIDENTIAL_OPERATING_SAVE_FORMAT_VERSION,
    configuration: { ...configuration.identity },
    operatingState: copyPresidentialOperatingRuntimeState(state),
  } satisfies PresidentialOperatingSaveV1);
};

export const parsePresidentialOperatingSave = (
  serializedSave: string,
  configuration: PresidentialOperatingRuntimeConfiguration,
): PresidentialOperatingRuntimeState => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(serializedSave) as unknown;
  } catch {
    throw new Error("Invalid presidential operating save: serialized data is not valid JSON.");
  }
  const envelope = requireRecord(parsed, "save envelope");
  requireExactKeys(envelope, "save envelope", ["formatVersion", "configuration", "operatingState"]);
  if (envelope.formatVersion !== PRESIDENTIAL_OPERATING_SAVE_FORMAT_VERSION) {
    throw new Error(
      `Unsupported presidential operating save format: ${String(envelope.formatVersion)}.`,
    );
  }
  const savedConfiguration = parseConfigurationIdentity(envelope.configuration, "configuration");
  assertConfigurationIdentityCompatible(configuration.identity, savedConfiguration);
  const state = parseOperatingState(envelope.operatingState);
  assertConfigurationIdentityCompatible(savedConfiguration, state.configuration);
  assertPresidentialOperatingRuntimeState(state, configuration);
  return copyPresidentialOperatingRuntimeState(state);
};

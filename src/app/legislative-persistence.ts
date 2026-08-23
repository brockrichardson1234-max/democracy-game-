import { assertConfigurationIdentityCompatible } from "../configuration/loader";
import type { ConfigurationIdentity } from "../configuration/types";
import type { LegislativeRuntimeState } from "../sim/legislative-runtime";

export const LEGISLATIVE_SAVE_FORMAT_VERSION = 1 as const;

interface LegislativeSaveEnvelope {
  readonly formatVersion: typeof LEGISLATIVE_SAVE_FORMAT_VERSION;
  readonly configuration: ConfigurationIdentity;
  readonly legislativeRuntime: LegislativeRuntimeState;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const serializeLegislativeRuntime = (state: LegislativeRuntimeState): string =>
  JSON.stringify({
    formatVersion: LEGISLATIVE_SAVE_FORMAT_VERSION,
    configuration: state.configuration,
    legislativeRuntime: state,
  } satisfies LegislativeSaveEnvelope);

export const parseLegislativeRuntime = (
  serialized: string,
  expectedConfiguration: ConfigurationIdentity,
): LegislativeRuntimeState => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(serialized) as unknown;
  } catch {
    throw new Error("Invalid legislative save: serialized data is not valid JSON.");
  }
  if (!isRecord(parsed) || parsed.formatVersion !== LEGISLATIVE_SAVE_FORMAT_VERSION) {
    throw new Error("Unsupported legislative save format version.");
  }
  if (!isRecord(parsed.configuration) || !isRecord(parsed.legislativeRuntime)) {
    throw new Error("Invalid legislative save envelope.");
  }
  const configuration = parsed.configuration as unknown as ConfigurationIdentity;
  assertConfigurationIdentityCompatible(expectedConfiguration, configuration);
  const state = parsed.legislativeRuntime as unknown as LegislativeRuntimeState;
  assertConfigurationIdentityCompatible(configuration, state.configuration);
  if (
    !Number.isInteger(state.schemaVersion) ||
    !Array.isArray(state.agenda?.versions) ||
    !Array.isArray(state.political?.actors) ||
    !Array.isArray(state.political?.organizations) ||
    !Array.isArray(state.political?.commitments) ||
    !Array.isArray(state.procedure?.voteOpportunities) ||
    !Array.isArray(state.enactedLegalSources)
  ) throw new Error("Invalid legislative save canonical state shape.");
  return state;
};

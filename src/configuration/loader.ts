import { canonicalConfigurationContent } from "./canonical";
import type {
  GovernmentConfiguration,
  LoadedGovernmentConfiguration,
  ScheduledTransitionDescriptor,
} from "./types";

const SHA_256_PATTERN = /^[a-f0-9]{64}$/;
const SUPPORTED_TRANSITION_KINDS = new Set<ScheduledTransitionDescriptor["kind"]>([
  "BOOTSTRAP_BOUNDARY",
  "INFORMATION_BOUNDARY",
  "CONTESTED_AUTHORITY_CHALLENGE",
  "CONTESTED_AUTHORITY_INTERIM_RELIEF",
  "CONTESTED_AUTHORITY_COMPLIANCE",
  "INFORMATION_ARTIFACT_EXPOSURE",
  "POLITICAL_CLAIM_RELEASE",
  "POPULATION_ELECTORAL_RESPONSE",
  "ELECTION_RESOLUTION",
  "ELECTION_CERTIFICATION",
  "SUCCESSOR_ENTITLEMENT",
  "EXECUTIVE_OFFICE_TRANSFER",
]);

const requireNonempty = (value: string, field: string): void => {
  if (value.trim().length === 0) throw new Error(`Configuration ${field} is required.`);
};

const requireUnique = (values: readonly string[], field: string): void => {
  values.forEach((value) => requireNonempty(value, field));
  if (new Set(values).size !== values.length) {
    throw new Error(`Configuration ${field} must contain unique IDs.`);
  }
};

export const loadGovernmentConfiguration = <TRuntimeSeed>(
  configuration: GovernmentConfiguration<TRuntimeSeed>,
): LoadedGovernmentConfiguration<TRuntimeSeed> => {
  requireNonempty(configuration.identity.configurationId, "configurationId");
  requireNonempty(configuration.identity.configurationVersion, "configurationVersion");
  requireNonempty(configuration.identity.scenarioId, "scenarioId");
  requireNonempty(configuration.identity.scenarioVersion, "scenarioVersion");
  if (!SHA_256_PATTERN.test(configuration.identity.configurationHash)) {
    throw new Error("Configuration configurationHash must be a lowercase SHA-256 value.");
  }
  requireNonempty(configuration.calendar.epoch, "calendar.epoch");
  requireNonempty(configuration.structure.legislatureId, "structure.legislatureId");
  requireUnique(configuration.structure.jurisdictionIds, "structure.jurisdictionIds");
  requireUnique(
    configuration.structure.chambers.map((chamber) => chamber.id),
    "structure.chambers",
  );
  if (configuration.structure.chambers.length === 0) {
    throw new Error("Configuration must declare at least one legislative chamber.");
  }
  for (const chamber of configuration.structure.chambers) {
    if (
      chamber.seatCount !== null &&
      (!Number.isInteger(chamber.seatCount) || chamber.seatCount <= 0)
    ) {
      throw new Error(`Configuration chamber ${chamber.id} has an invalid seat count.`);
    }
  }

  requireUnique(
    configuration.transitions.map((transition) => transition.id),
    "transitions",
  );
  for (const transition of configuration.transitions) {
    if (!SUPPORTED_TRANSITION_KINDS.has(transition.kind)) {
      throw new Error(`Configuration transition ${transition.id} has an unknown kind.`);
    }
    if (!Number.isFinite(transition.at) || transition.at < 0) {
      throw new Error(`Configuration transition ${transition.id} has an invalid boundary.`);
    }
    if (!Number.isInteger(transition.order) || transition.order < 0) {
      throw new Error(`Configuration transition ${transition.id} has an invalid order.`);
    }
  }
  const bootstrapCount = configuration.transitions.filter(
    (transition) => transition.kind === "BOOTSTRAP_BOUNDARY",
  ).length;
  if (configuration.capability === "PLAYABLE_CAUSAL_WORLD") {
    if (configuration.runtimeSeed === null) {
      throw new Error("Playable configuration requires a runtime seed.");
    }
    if (bootstrapCount !== 1) {
      throw new Error("Playable configuration requires exactly one bootstrap boundary.");
    }
  } else if (configuration.runtimeSeed !== null || configuration.transitions.length !== 0) {
    throw new Error("Structural-proof configuration cannot contain a runtime seed or schedule.");
  }

  // This traversal also rejects functions, undefined, symbols, bigint, and non-finite data.
  canonicalConfigurationContent(configuration);
  return { ...configuration, loaded: true };
};

export const assertConfigurationIdentityCompatible = (
  expected: GovernmentConfiguration["identity"],
  actual: GovernmentConfiguration["identity"],
): void => {
  if (
    expected.configurationId !== actual.configurationId ||
    expected.configurationVersion !== actual.configurationVersion ||
    expected.scenarioId !== actual.scenarioId ||
    expected.scenarioVersion !== actual.scenarioVersion ||
    expected.configurationHash !== actual.configurationHash
  ) {
    throw new Error(
      `Configuration mismatch: expected ${expected.configurationId}@${expected.configurationVersion} (${expected.configurationHash}), received ${actual.configurationId}@${actual.configurationVersion} (${actual.configurationHash}).`,
    );
  }
};

export const assertDeclaredConfigurationHash = (
  configuration: GovernmentConfiguration,
  computedSha256: string,
): void => {
  if (!SHA_256_PATTERN.test(computedSha256)) {
    throw new Error("Computed configuration hash must be a lowercase SHA-256 value.");
  }
  if (configuration.identity.configurationHash !== computedSha256) {
    throw new Error(
      `Declared configuration hash does not match consumed canonical content for ${configuration.identity.configurationId}: declared ${configuration.identity.configurationHash}, computed ${computedSha256}.`,
    );
  }
};

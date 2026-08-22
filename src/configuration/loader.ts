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

type TransitionPosition = Pick<ScheduledTransitionDescriptor, "id" | "at" | "order">;

const isStrictlyBefore = (left: TransitionPosition, right: TransitionPosition): boolean =>
  left.at < right.at || (left.at === right.at && left.order < right.order);

const requireBefore = (
  predecessor: TransitionPosition,
  successor: TransitionPosition,
  relationship: string,
): void => {
  if (!isStrictlyBefore(predecessor, successor)) {
    throw new Error(
      `Configuration causal order requires ${relationship}: ${predecessor.id} must precede ${successor.id}.`,
    );
  }
};

const transitionsOfKind = <TKind extends ScheduledTransitionDescriptor["kind"]>(
  transitions: readonly ScheduledTransitionDescriptor[],
  kind: TKind,
): readonly (ScheduledTransitionDescriptor & { readonly kind: TKind })[] =>
  transitions.filter(
    (transition): transition is ScheduledTransitionDescriptor & { readonly kind: TKind } =>
      transition.kind === kind,
  );

const requireAtMostOne = <T>(values: readonly T[], description: string): T | null => {
  if (values.length > 1) {
    throw new Error(`Configuration supports at most one ${description} transition.`);
  }
  return values[0] ?? null;
};

interface RuntimeSeedInformationSchedule {
  readonly information?: {
    readonly housingMeasurement?: {
      readonly reportArtifactId?: string;
      readonly observationEnd?: number;
      readonly scheduledReleaseAtSimulationTime?: number;
    };
    readonly artifacts?: readonly {
      readonly id?: string;
      readonly releasedAtSimulationTime?: number;
    }[];
  };
}

/** Accepted owner semantics constrain configuration-selected event times. */
const validateCausalSchedule = (
  configuration: GovernmentConfiguration<unknown>,
): void => {
  const transitions = configuration.transitions;

  const challenge = requireAtMostOne(
    transitionsOfKind(transitions, "CONTESTED_AUTHORITY_CHALLENGE"),
    "contested-authority challenge",
  );
  const relief = requireAtMostOne(
    transitionsOfKind(transitions, "CONTESTED_AUTHORITY_INTERIM_RELIEF"),
    "contested-authority interim-relief",
  );
  const compliance = requireAtMostOne(
    transitionsOfKind(transitions, "CONTESTED_AUTHORITY_COMPLIANCE"),
    "contested-authority compliance",
  );
  if (relief !== null && challenge === null) {
    throw new Error("Configuration interim relief requires a challenge transition.");
  }
  if (compliance !== null && (challenge === null || relief === null)) {
    throw new Error("Configuration compliance requires challenge and interim-relief transitions.");
  }
  if (challenge !== null && relief !== null) requireBefore(challenge, relief, "challenge → interim relief");
  if (relief !== null && compliance !== null) requireBefore(relief, compliance, "interim relief → compliance");

  const populationResponse = requireAtMostOne(
    transitionsOfKind(transitions, "POPULATION_ELECTORAL_RESPONSE"),
    "Population electoral-response",
  );
  const informationInputs = transitions.filter(
    (transition) =>
      transition.kind === "INFORMATION_ARTIFACT_EXPOSURE" ||
      transition.kind === "POLITICAL_CLAIM_RELEASE",
  );
  if (populationResponse !== null) {
    for (const input of informationInputs) {
      requireBefore(input, populationResponse, "information incorporation → Population response");
    }
  }

  const elections = transitionsOfKind(transitions, "ELECTION_RESOLUTION");
  const certifications = transitionsOfKind(transitions, "ELECTION_CERTIFICATION");
  const entitlements = transitionsOfKind(transitions, "SUCCESSOR_ENTITLEMENT");
  const transfers = transitionsOfKind(transitions, "EXECUTIVE_OFFICE_TRANSFER");
  if (populationResponse !== null) {
    for (const election of elections) {
      requireBefore(populationResponse, election, "Population response → election resolution");
    }
  }
  for (const election of elections) {
    const matches = certifications.filter((candidate) => candidate.contestId === election.contestId);
    if (matches.length !== 1) {
      throw new Error(`Configuration election contest ${election.contestId} requires exactly one certification.`);
    }
    requireBefore(election, matches[0], "election resolution → certification");
  }
  for (const certification of certifications) {
    if (!elections.some((election) => election.contestId === certification.contestId)) {
      throw new Error(`Configuration certification references unresolved contest ${certification.contestId}.`);
    }
  }
  for (const entitlement of entitlements) {
    const matchingCertification = certifications.filter(
      (certification) => certification.contestId === entitlement.contestId,
    );
    if (matchingCertification.length !== 1) {
      throw new Error(`Configuration entitlement references uncertified contest ${entitlement.contestId}.`);
    }
    requireBefore(matchingCertification[0], entitlement, "certification → successor entitlement");
    const matchingTransfers = transfers.filter((transfer) => transfer.at === entitlement.transferAt);
    if (matchingTransfers.length !== 1) {
      throw new Error(
        `Configuration entitlement transferAt ${entitlement.transferAt} must match exactly one office-transfer boundary.`,
      );
    }
    requireBefore(entitlement, matchingTransfers[0], "successor entitlement → office transfer");
  }
  if (transfers.length > 0 && entitlements.length === 0) {
    throw new Error("Configuration office transfer requires a successor-entitlement transition.");
  }

  const seed = configuration.runtimeSeed as RuntimeSeedInformationSchedule | null;
  const measurement = seed?.information?.housingMeasurement;
  if (
    typeof measurement?.observationEnd === "number" &&
    typeof measurement.scheduledReleaseAtSimulationTime === "number" &&
    measurement.scheduledReleaseAtSimulationTime < measurement.observationEnd
  ) {
    throw new Error("Configuration report release cannot precede its measurement observation end.");
  }
  const availability = new Map<string, TransitionPosition>();
  for (const artifact of seed?.information?.artifacts ?? []) {
    if (
      typeof artifact.id === "string" &&
      typeof artifact.releasedAtSimulationTime === "number"
    ) {
      availability.set(artifact.id, {
        id: `initial artifact ${artifact.id}`,
        at: artifact.releasedAtSimulationTime,
        order: -1,
      });
    }
  }
  if (
    typeof measurement?.reportArtifactId === "string" &&
    typeof measurement.scheduledReleaseAtSimulationTime === "number"
  ) {
    availability.set(measurement.reportArtifactId, {
      id: `scheduled report ${measurement.reportArtifactId}`,
      at: measurement.scheduledReleaseAtSimulationTime,
      order: -1,
    });
  }
  for (const claim of transitionsOfKind(transitions, "POLITICAL_CLAIM_RELEASE")) {
    const source = availability.get(claim.sourceArtifactId);
    if (source === undefined) {
      throw new Error(
        `Configuration claim ${claim.claimArtifactId} has no supported source-artifact availability path for ${claim.sourceArtifactId}.`,
      );
    }
    requireBefore(source, claim, "source artifact availability → political claim release");
    availability.set(claim.claimArtifactId, claim);
  }
  for (const exposure of transitionsOfKind(transitions, "INFORMATION_ARTIFACT_EXPOSURE")) {
    const source = availability.get(exposure.artifactId);
    if (source === undefined) {
      throw new Error(
        `Configuration exposure has no supported artifact-availability path for ${exposure.artifactId}.`,
      );
    }
    requireBefore(source, exposure, "artifact availability → exposure");
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
    validateCausalSchedule(configuration as GovernmentConfiguration<unknown>);
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

import { canonicalConfigurationContent } from "./canonical";
import { validateGovernmentStructure } from "./topology-validation";
import type {
  GovernmentConfiguration,
  LegislativeRuntimeSeed,
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

const validateRatio = (
  ratio: { readonly numerator: number; readonly denominator: number },
  field: string,
): void => {
  if (
    !Number.isInteger(ratio.numerator) ||
    !Number.isInteger(ratio.denominator) ||
    ratio.numerator <= 0 ||
    ratio.denominator <= 0 ||
    ratio.numerator > ratio.denominator
  ) throw new Error(`Configuration ${field} must be a positive bounded ratio.`);
};

const validateThresholdRatio = (
  ratio: { readonly numerator: number; readonly denominator: number; readonly rounding: string },
  field: string,
): void => {
  validateRatio(ratio, field);
  if (ratio.rounding !== "CEILING" && ratio.rounding !== "FLOOR_PLUS_ONE") {
    throw new Error(`Configuration ${field} has an unsupported rounding rule.`);
  }
};

const validateLegislativeRuntimeSeed = (
  seed: LegislativeRuntimeSeed,
  configuration: GovernmentConfiguration<unknown>,
): void => {
  if (!Number.isInteger(seed.schemaVersion) || seed.schemaVersion <= 0) {
    throw new Error("Legislative runtime seed requires a positive schema version.");
  }
  requireNonempty(seed.profileScaffold.version, "political profile scaffold version");
  requireNonempty(seed.profileScaffold.seed, "political profile scaffold seed");
  requireUnique(seed.dimensions.map((dimension) => dimension.id), "political dimensions");
  for (const dimension of seed.dimensions) {
    if (!Number.isFinite(dimension.minimum) || !Number.isFinite(dimension.maximum) || dimension.minimum >= dimension.maximum) {
      throw new Error(`Political dimension ${dimension.id} has an invalid range.`);
    }
  }
  requireUnique(seed.organizations.map((organization) => organization.id), "political organizations");
  requireUnique(seed.membershipScaffold.organizationOrder, "organization membership order");
  if (
    seed.membershipScaffold.organizationOrder.length !== seed.organizations.length ||
    seed.organizations.some((organization) => !seed.membershipScaffold.organizationOrder.includes(organization.id))
  ) throw new Error("Organization membership order must contain every configured organization exactly once.");
  if (seed.membershipScaffold.algorithm !== "SHA-256") throw new Error("Unsupported organization ranking algorithm.");
  requireUnique(seed.procedure.chamberRules.map((rule) => rule.chamberId), "political chamber rules");
  const chamberIds = new Set(configuration.structure.chambers.map((chamber) => chamber.id));
  if (!configuration.structure.legislatures.some((legislature) => legislature.id === seed.procedure.legislatureId)) {
    throw new Error("Legislative runtime references an unknown legislature.");
  }
  if (
    seed.procedure.originChamberId === seed.procedure.otherChamberId ||
    !chamberIds.has(seed.procedure.originChamberId) ||
    !chamberIds.has(seed.procedure.otherChamberId)
  ) throw new Error("Legislative runtime requires two distinct configured chambers.");
  for (const rule of seed.procedure.chamberRules) {
    if (!chamberIds.has(rule.chamberId)) throw new Error(`Political rule references unknown chamber ${rule.chamberId}.`);
    validateThresholdRatio(rule.quorum, `${rule.chamberId}.quorum`);
    validateThresholdRatio(rule.ordinaryPassage.threshold, `${rule.chamberId}.ordinaryPassage`);
    validateThresholdRatio(rule.amendmentPassage, `${rule.chamberId}.amendmentPassage`);
    validateThresholdRatio(rule.overridePassage, `${rule.chamberId}.overridePassage`);
    if (rule.extendedDebate.available !== (rule.extendedDebate.clotureThreshold !== null)) {
      throw new Error(`Political rule ${rule.chamberId} has inconsistent extended-debate configuration.`);
    }
    if (rule.extendedDebate.clotureThreshold !== null) {
      validateThresholdRatio(rule.extendedDebate.clotureThreshold, `${rule.chamberId}.clotureThreshold`);
    }
    const currentOfficeIds = new Set(
      configuration.structure.assignments.filter((assignment) => assignment.currentAtScenarioStart).map((assignment) => assignment.officeId),
    );
    const membership = configuration.structure.offices.filter(
      (office) => office.chamberId === rule.chamberId && currentOfficeIds.has(office.id),
    ).length;
    const quota = seed.organizations.reduce(
      (total, organization) => total + (organization.chamberQuotas[rule.chamberId] ?? -membership),
      0,
    );
    if (quota !== membership) throw new Error(`Organization quotas must cover chamber ${rule.chamberId}.`);
    if (seed.membershipScaffold.chamberRankTokens[rule.chamberId] === undefined) {
      throw new Error(`Organization scaffold omits chamber token ${rule.chamberId}.`);
    }
  }
  const dimensionIds = new Set(seed.dimensions.map((dimension) => dimension.id));
  for (const organization of seed.organizations) {
    if (
      Object.keys(organization.postureByDimension).length !== dimensionIds.size ||
      Object.keys(organization.postureByDimension).some((id) => !dimensionIds.has(id))
    ) throw new Error(`Organization ${organization.id} must define every proposal dimension exactly once.`);
  }
  if (
    Object.keys(seed.proposal.initialDimensions).length !== dimensionIds.size ||
    Object.keys(seed.proposal.initialDimensions).some((id) => !dimensionIds.has(id))
  ) throw new Error("Initial political proposal must define every configured dimension exactly once.");
  validateRatio(seed.decision.organizationBlend, "political organization blend");
  if (seed.procedure.maximumTextExchanges < 0 || seed.procedure.maximumAmendmentRoundsPerChamber < 0) {
    throw new Error("Political procedure limits must be nonnegative.");
  }
  const executiveOffice = configuration.structure.offices.find(
    (office) => office.id === seed.executive.headOfficeId && office.kind === "EXECUTIVE_HEAD",
  );
  if (executiveOffice === undefined) throw new Error("Political executive head office is unresolved.");
  if (
    seed.executive.deputyOfficeId !== null &&
    !configuration.structure.offices.some(
      (office) => office.id === seed.executive.deputyOfficeId && office.kind === "EXECUTIVE_DEPUTY",
    )
  ) throw new Error("Political executive deputy office is unresolved.");
  for (const value of [
    seed.decision.actorVariationRadius,
    seed.decision.reservationDistance,
    seed.decision.coordinationPressure,
    seed.decision.commitmentHonorCutoff,
    seed.decision.breachCutoff,
  ]) {
    if (!Number.isFinite(value) || value < 0) throw new Error("Political decision parameters must be finite and nonnegative.");
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
  for (const transfer of transfers) {
    const matchingEntitlements = entitlements.filter(
      (entitlement) => entitlement.transferAt === transfer.at,
    );
    if (matchingEntitlements.length !== 1) {
      throw new Error(
        `Configuration office transfer ${transfer.id} at ${transfer.at} must match exactly one successor-entitlement boundary.`,
      );
    }
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
  validateGovernmentStructure(configuration.structure);

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
  } else if (configuration.capability === "LEGISLATIVE_RUNTIME_SLICE") {
    if (configuration.runtimeSeed === null) {
      throw new Error("Legislative runtime slice requires a political runtime seed.");
    }
    if (configuration.transitions.length !== 0) {
      throw new Error("Legislative runtime slice cannot fabricate a full-world transition schedule.");
    }
    validateLegislativeRuntimeSeed(
      configuration.runtimeSeed as LegislativeRuntimeSeed,
      configuration as GovernmentConfiguration<unknown>,
    );
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

import { sha256Hex } from "../configuration/sha256";
import {
  assertEffectiveOfficeholder,
  assertPresidentialAdministrationOwnerStates,
  assessmentSemanticContentIsReceived,
  findArtifact,
  isEffectiveAt,
  type PresidentialAdministrationConfiguration,
  type PresidentialAdministrationOwnerStates,
  type PresidentialInformationArtifact,
} from "./presidential-office-information";
import {
  createOfficeWorkAssignment,
  transitionOfficeWorkAssignment,
  type CreateOfficeWorkAssignmentInput,
} from "./presidential-office-information-operations";
import type {
  AdministrationWorkstreamRecord,
  AdministrationWorkstreamStatus,
  AdministrationWorkstreamTransition,
  AdministrationWorkstreamView,
  AllowMonitoringDefaultOption,
  AnalysisRecipientCapabilityAuthority,
  CoordinationRecipientCapabilityAuthority,
  EscalationAttentionItem,
  EscalationLifecycleKind,
  EscalationLifecycleOccurrence,
  EscalationPresentationRecord,
  HistoricalRecordIndexEntry,
  InstrumentAssignmentAuthorizationBinding,
  InstrumentAssignmentAuthorizationScope,
  InstrumentAttachmentMetadata,
  InstrumentDispatchOutcome,
  InstrumentDispatchRecord,
  OfficeInstrumentReceipt,
  PresidentialAttentionItem,
  PresidentialDecisionRecord,
  PresidentialEscalationOption,
  PresidentialEscalationRecord,
  PresidentialHistoryViewEntry,
  PresidentialInstrumentPayload,
  PresidentialInstrumentPreview,
  PresidentialInstrumentRecord,
  PresidentialInterventionOwnerStates,
  PresidentialKnownPortion,
  RecipientCapabilityAuthority,
  RecipientConstraint,
  RecipientDispositionKind,
  RecipientInstrumentDisposition,
  RequestAnalysisAndCoordinationOption,
  RequestOfficeAnalysisPayload,
  RequestWorkstreamCoordinationPayload,
  ReservedPresidentialReviewRecord,
  ReservedReviewAttentionItem,
  ReservedReviewLifecycleKind,
  ReservedReviewLifecycleOccurrence,
  StaffOnlySourcePortion,
} from "./presidential-operating-intervention-types";

export type * from "./presidential-operating-intervention-types";

export const PRESIDENTIAL_OPERATING_DECISION_SURFACE =
  "PRESIDENTIAL_OPERATING_DECISION_SURFACE" as const;

export const POP0_I3_ESCALATION_PRESENTATION_SECTION_IDS = [
  "BASIS",
  "KNOWN_FACTS",
  "UNCERTAINTIES_AND_LIMITATIONS",
  "DECISION_REQUEST",
  "OPTIONS_AND_PREVIEWS",
  "DEFAULT",
  "DEADLINE",
  "DOWNSTREAM_RESOLVERS",
] as const;

export interface StandingCoordinationAuthority {
  readonly id: string;
  readonly officeId: string;
  readonly effectiveFrom: string;
  readonly effectiveUntil: string | null;
  readonly permittedWorkstreamIds: readonly string[];
  readonly permittedStatuses: readonly AdministrationWorkstreamStatus[];
  readonly authorityReference: string;
  readonly provenanceReference: string;
}

export interface EscalationEligibilityRule {
  readonly id: string;
  readonly initiatingOfficeId: string;
  readonly standingAuthorityId: string;
  readonly requiredBasisKind: "SYNTHESIS_CONFLICT";
  readonly requiredCommonPropositionId: string;
  readonly requiredShownSynthesisSectionCount: number;
  readonly requiredOptionKinds: readonly PresidentialEscalationOption["kind"][];
  readonly provenanceReference: string;
}

export interface ConfiguredWorkstreamDefinition {
  readonly id: string;
  readonly label: string;
  readonly adoptedObjective: string;
  readonly coordinatorOfficeId: string;
  readonly participatingOfficeIds: readonly string[];
}

export interface PresidentialInterventionConfiguration {
  readonly ownerIds: {
    readonly presidentialEscalations: string;
    readonly administrationWorkstreams: string;
    readonly presidentialDecisions: string;
    readonly presidentialInstruments: string;
    readonly instrumentDispatches: string;
    readonly historicalRecordIndex: string;
  };
  readonly historyId: string;
  readonly controlBinding: {
    readonly id: string;
    readonly decisionSurface: typeof PRESIDENTIAL_OPERATING_DECISION_SURFACE;
  };
  readonly standingCoordinationAuthorities: readonly StandingCoordinationAuthority[];
  readonly escalationEligibilityRules: readonly EscalationEligibilityRule[];
  readonly workstreamDefinition: ConfiguredWorkstreamDefinition;
  readonly provenanceReference: string;
}

export interface PresidentialControlBindingState {
  readonly id: string;
  readonly decisionSurface: typeof PRESIDENTIAL_OPERATING_DECISION_SURFACE;
  readonly executiveOfficeId: string;
  readonly boundOfficeholderActorId: string;
  readonly status: "ACTIVE" | "ENDED";
  readonly endedAt: string | null;
  readonly endReason: "BOUND_OFFICEHOLDER_CHANGED" | "TERM_ENDED" | null;
}

export type PresidentialInterventionState = PresidentialAdministrationOwnerStates &
  PresidentialInterventionOwnerStates;

const copyPlain = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const requireNonempty = (value: string, field: string): void => {
  if (value.trim().length === 0) throw new Error(`${field} is required.`);
};

const instant = (value: string, field: string): number => {
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) throw new Error(`${field} must be a valid instant.`);
  return parsed;
};

const requireUnique = (values: readonly string[], field: string): void => {
  if (new Set(values).size !== values.length) throw new Error(`${field} require unique values.`);
};

const requireNonemptyUnique = (values: readonly string[], field: string): void => {
  if (values.some((value) => value.trim().length === 0)) throw new Error(`${field} cannot be empty.`);
  requireUnique(values, field);
};

const requireExactKeys = (
  value: object,
  field: string,
  expected: readonly string[],
): void => {
  const actual = Object.keys(value).sort();
  if (JSON.stringify(actual) !== JSON.stringify([...expected].sort())) {
    throw new Error(`${field} has an unsupported shape.`);
  }
};

const sameOrdered = (left: readonly unknown[], right: readonly unknown[]): boolean =>
  JSON.stringify(left) === JSON.stringify(right);

const sameSet = (left: readonly string[], right: readonly string[]): boolean =>
  JSON.stringify([...left].sort()) === JSON.stringify([...right].sort());

const sortedByTimeAndId = <T>(
  values: readonly T[],
  timeOf: (value: T) => string,
  idOf: (value: T) => string,
): readonly T[] => [...values].sort((left, right) =>
  instant(timeOf(left), `${idOf(left)} ordering time`) -
    instant(timeOf(right), `${idOf(right)} ordering time`) ||
  idOf(left).localeCompare(idOf(right)));

const assertInterval = (
  effectiveFrom: string,
  effectiveUntil: string | null,
  field: string,
): void => {
  const start = instant(effectiveFrom, `${field}.effectiveFrom`);
  if (effectiveUntil !== null && instant(effectiveUntil, `${field}.effectiveUntil`) <= start) {
    throw new Error(`${field} requires a positive start-inclusive/end-exclusive interval.`);
  }
};

const canonicalAttachment = (
  attachment: InstrumentAttachmentMetadata,
): InstrumentAttachmentMetadata => {
  requireExactKeys(attachment, "Instrument attachment metadata", [
    "artifactId",
    "sectionIds",
    "shownToPresident",
  ]);
  requireNonempty(attachment.artifactId, "Instrument attachment artifact identity");
  requireNonemptyUnique(attachment.sectionIds, `${attachment.artifactId} attachment sections`);
  if (typeof attachment.shownToPresident !== "boolean") {
    throw new Error("Instrument attachment executive-recipient visibility flag is required.");
  }
  return {
    artifactId: attachment.artifactId,
    sectionIds: [...attachment.sectionIds],
    shownToPresident: attachment.shownToPresident,
  };
};

export const canonicalPresidentialInstrumentPayload = (
  payload: PresidentialInstrumentPayload,
): PresidentialInstrumentPayload => {
  const commonKeys = [
    "kind",
    "payloadVersion",
    "recipientOfficeId",
    "subjectScopeFamily",
    "requestedAct",
    "sourceReferenceIds",
    "attachmentMetadata",
    "authorityBasis",
    "requestedResponseDeadline",
  ] as const;
  if (payload.kind === "REQUEST_OFFICE_ANALYSIS") {
    requireExactKeys(payload, "REQUEST_OFFICE_ANALYSIS payload", [
      ...commonKeys,
      "requestedQuestion",
      "requestedProductKind",
      "evidenceArtifactId",
      "evidenceSectionIds",
      "knownAccessLimitation",
      "narrowingPermitted",
    ]);
    return {
      kind: payload.kind,
      payloadVersion: payload.payloadVersion,
      recipientOfficeId: payload.recipientOfficeId,
      subjectScopeFamily: payload.subjectScopeFamily,
      requestedAct: payload.requestedAct,
      sourceReferenceIds: [...payload.sourceReferenceIds],
      attachmentMetadata: payload.attachmentMetadata.map(canonicalAttachment),
      authorityBasis: payload.authorityBasis,
      requestedResponseDeadline: payload.requestedResponseDeadline,
      requestedQuestion: payload.requestedQuestion,
      requestedProductKind: payload.requestedProductKind,
      evidenceArtifactId: payload.evidenceArtifactId,
      evidenceSectionIds: [...payload.evidenceSectionIds],
      knownAccessLimitation: payload.knownAccessLimitation,
      narrowingPermitted: payload.narrowingPermitted,
    };
  }
  requireExactKeys(payload, "REQUEST_WORKSTREAM_COORDINATION payload", [
    ...commonKeys,
    "workstreamId",
    "coordinationObjective",
    "participatingOfficeIds",
    "requestedReviewAt",
    "permittedCoordinationActions",
  ]);
  return {
    kind: payload.kind,
    payloadVersion: payload.payloadVersion,
    recipientOfficeId: payload.recipientOfficeId,
    subjectScopeFamily: payload.subjectScopeFamily,
    requestedAct: payload.requestedAct,
    sourceReferenceIds: [...payload.sourceReferenceIds],
    attachmentMetadata: payload.attachmentMetadata.map(canonicalAttachment),
    authorityBasis: payload.authorityBasis,
    requestedResponseDeadline: payload.requestedResponseDeadline,
    workstreamId: payload.workstreamId,
    coordinationObjective: payload.coordinationObjective,
    participatingOfficeIds: [...payload.participatingOfficeIds],
    requestedReviewAt: payload.requestedReviewAt,
    permittedCoordinationActions: [...payload.permittedCoordinationActions],
  };
};

export const computePresidentialInstrumentPayloadHash = (
  payload: PresidentialInstrumentPayload,
): string => sha256Hex(JSON.stringify(canonicalPresidentialInstrumentPayload(payload)));

const assertInstrumentPayloadCommon = (
  payload: PresidentialInstrumentPayload,
  administration: PresidentialAdministrationConfiguration,
  current: string,
): void => {
  const canonical = canonicalPresidentialInstrumentPayload(payload);
  if (!sameOrdered([canonical], [payload])) {
    throw new Error("Presidential instrument payload is not byte-canonical in declared field order.");
  }
  if (payload.payloadVersion !== "1") throw new Error("Unsupported presidential instrument payload version.");
  if (!administration.offices.some((office) => office.id === payload.recipientOfficeId)) {
    throw new Error(`Presidential instrument references unknown recipient ${payload.recipientOfficeId}.`);
  }
  requireNonempty(payload.subjectScopeFamily, "Instrument subject-scope family");
  requireNonempty(payload.requestedAct, "Instrument requested act");
  requireNonemptyUnique(payload.sourceReferenceIds, "Instrument source references");
  requireNonempty(payload.authorityBasis, "Instrument authority basis");
  if (instant(payload.requestedResponseDeadline, "Instrument response deadline") <=
    instant(current, "Instrument source time")) {
    throw new Error("Presidential instrument response deadline must be strictly future.");
  }
  requireUnique(
    payload.attachmentMetadata.map((attachment) => attachment.artifactId),
    "Instrument attachment artifacts",
  );
  if (payload.kind === "REQUEST_OFFICE_ANALYSIS") {
    requireNonempty(payload.requestedQuestion, "Analysis question");
    requireNonempty(payload.requestedProductKind, "Analysis product kind");
    requireNonempty(payload.evidenceArtifactId, "Analysis evidence artifact");
    requireNonemptyUnique(payload.evidenceSectionIds, "Analysis evidence sections");
    if (payload.knownAccessLimitation !== null) {
      requireNonempty(payload.knownAccessLimitation, "Analysis access limitation");
    }
  } else {
    requireNonempty(payload.workstreamId, "Coordination workstream");
    requireNonempty(payload.coordinationObjective, "Coordination objective");
    requireNonemptyUnique(payload.participatingOfficeIds, "Coordination participating offices");
    requireNonemptyUnique(payload.permittedCoordinationActions, "Permitted coordination actions");
    if (instant(payload.requestedReviewAt, "Coordination review") <= instant(current, "Instrument source time")) {
      throw new Error("Coordination review must be strictly future.");
    }
  }
};

const analysisCapabilityFits = (
  capability: AnalysisRecipientCapabilityAuthority,
  payload: RequestOfficeAnalysisPayload,
): boolean => capability.recipientOfficeId === payload.recipientOfficeId &&
  capability.permittedSubjectScopeFamilies.includes(payload.subjectScopeFamily) &&
  capability.permittedProductKinds.includes(payload.requestedProductKind) &&
  payload.evidenceSectionIds.length <= capability.maximumSectionCount;

const coordinationCapabilityFits = (
  capability: CoordinationRecipientCapabilityAuthority,
  payload: RequestWorkstreamCoordinationPayload,
  issuedAt: string,
): boolean => capability.recipientOfficeId === payload.recipientOfficeId &&
  capability.permittedWorkstreamIds.includes(payload.workstreamId) &&
  payload.permittedCoordinationActions.every((action) =>
    capability.permittedCoordinationActionKinds.includes(action)) &&
  payload.participatingOfficeIds.length <= capability.maximumParticipatingOfficeCount &&
  instant(payload.requestedReviewAt, "Coordination review") - instant(issuedAt, "Instrument issue") <=
    capability.maximumReviewHorizonHours * 60 * 60 * 1000;

export const recipientCapabilityFitsInstrument = (
  capability: RecipientCapabilityAuthority,
  payload: PresidentialInstrumentPayload,
  issuedAt: string,
  at: string,
): boolean => isEffectiveAt(capability.effectiveFrom, capability.effectiveUntil, at) &&
  capability.instrumentKind === payload.kind &&
  (capability.kind === "ANALYSIS_CAPABILITY" && payload.kind === "REQUEST_OFFICE_ANALYSIS"
    ? analysisCapabilityFits(capability, payload)
    : capability.kind === "COORDINATION_CAPABILITY" &&
        payload.kind === "REQUEST_WORKSTREAM_COORDINATION" &&
        coordinationCapabilityFits(capability, payload, issuedAt));

export const assertPresidentialInterventionConfiguration = (
  configuration: PresidentialInterventionConfiguration,
  administration: PresidentialAdministrationConfiguration,
  epoch: string,
): void => {
  const ownerIds = Object.values(configuration.ownerIds);
  requireNonemptyUnique(ownerIds, "I3 owner identities");
  requireUnique(
    [...Object.values(administration.ownerIds), ...ownerIds],
    "POP owner identities",
  );
  requireNonempty(configuration.historyId, "I3 history identity");
  requireNonempty(configuration.provenanceReference, "I3 provenance root");
  if (
    configuration.controlBinding.decisionSurface !== PRESIDENTIAL_OPERATING_DECISION_SURFACE
  ) throw new Error("I3 ControlBinding has an unsupported decision surface.");
  requireNonempty(configuration.controlBinding.id, "I3 ControlBinding identity");
  requireNonemptyUnique(
    configuration.standingCoordinationAuthorities.map((entry) => entry.id),
    "Standing coordination authorities",
  );
  for (const authority of configuration.standingCoordinationAuthorities) {
    assertInterval(authority.effectiveFrom, authority.effectiveUntil, authority.id);
    if (!administration.offices.some((office) => office.id === authority.officeId)) {
      throw new Error(`Standing authority ${authority.id} references an unknown office.`);
    }
    requireNonemptyUnique(authority.permittedWorkstreamIds, `${authority.id} workstreams`);
    requireNonemptyUnique(authority.permittedStatuses, `${authority.id} statuses`);
    requireNonempty(authority.authorityReference, `${authority.id} authority`);
    requireNonempty(authority.provenanceReference, `${authority.id} provenance`);
  }
  requireNonemptyUnique(
    configuration.escalationEligibilityRules.map((entry) => entry.id),
    "Escalation eligibility rules",
  );
  for (const rule of configuration.escalationEligibilityRules) {
    if (
      !administration.offices.some((office) => office.id === rule.initiatingOfficeId) ||
      !configuration.standingCoordinationAuthorities.some(
        (authority) => authority.id === rule.standingAuthorityId &&
          authority.officeId === rule.initiatingOfficeId,
      ) ||
      rule.requiredBasisKind !== "SYNTHESIS_CONFLICT" ||
      !Number.isSafeInteger(rule.requiredShownSynthesisSectionCount) ||
      rule.requiredShownSynthesisSectionCount <= 0
    ) throw new Error(`Escalation rule ${rule.id} is invalid.`);
    requireNonempty(rule.requiredCommonPropositionId, `${rule.id} proposition`);
    if (!sameSet(rule.requiredOptionKinds, [
      "REQUEST_SCOPED_ANALYSIS_AND_COORDINATION",
      "RESERVE_PRESIDENTIAL_REVIEW",
      "ALLOW_MONITORING_DEFAULT",
    ])) throw new Error(`Escalation rule ${rule.id} requires the exact I3 option set.`);
    requireNonempty(rule.provenanceReference, `${rule.id} provenance`);
  }
  const definition = configuration.workstreamDefinition;
  requireNonempty(definition.id, "Configured workstream identity");
  requireNonempty(definition.label, "Configured workstream label");
  requireNonempty(definition.adoptedObjective, "Configured workstream objective");
  if (!administration.offices.some((office) => office.id === definition.coordinatorOfficeId)) {
    throw new Error("Configured workstream coordinator is unknown.");
  }
  requireNonemptyUnique(definition.participatingOfficeIds, "Configured workstream participants");
  if (definition.participatingOfficeIds.some(
    (officeId) => !administration.offices.some((office) => office.id === officeId),
  )) throw new Error("Configured workstream contains an unknown participating office.");
  if (!configuration.standingCoordinationAuthorities.some(
    (authority) => authority.officeId === definition.coordinatorOfficeId &&
      authority.permittedWorkstreamIds.includes(definition.id) &&
      isEffectiveAt(authority.effectiveFrom, authority.effectiveUntil, epoch),
  )) throw new Error("Configured workstream lacks standing coordination authority at the epoch.");
};

export const createPresidentialInterventionOwnerStates = (
  configuration: PresidentialInterventionConfiguration,
  administration: PresidentialAdministrationConfiguration,
  epoch: string,
): PresidentialInterventionOwnerStates => {
  assertPresidentialInterventionConfiguration(configuration, administration, epoch);
  return {
    presidentialEscalations: {
      ownerId: configuration.ownerIds.presidentialEscalations,
      state: {
        escalations: [],
        lifecycleOccurrences: [],
        defaultOccurrences: [],
        reservedReviews: [],
        reservedReviewLifecycleOccurrences: [],
      },
    },
    administrationWorkstreams: {
      ownerId: configuration.ownerIds.administrationWorkstreams,
      state: { workstreams: [], transitions: [] },
    },
    presidentialDecisions: {
      ownerId: configuration.ownerIds.presidentialDecisions,
      state: [],
    },
    presidentialInstruments: {
      ownerId: configuration.ownerIds.presidentialInstruments,
      state: [],
    },
    instrumentDispatches: {
      ownerId: configuration.ownerIds.instrumentDispatches,
      state: [],
    },
    historicalRecordIndex: {
      ownerId: configuration.ownerIds.historicalRecordIndex,
      state: { historyId: configuration.historyId, entries: [] },
    },
  };
};

export const copyPresidentialInterventionOwnerStates = (
  state: PresidentialInterventionOwnerStates,
): PresidentialInterventionOwnerStates => copyPlain(state);

const sourceOccurrenceTime = (
  state: PresidentialInterventionState,
  id: string,
): string | null => {
  const artifact = state.informationRoutes.state.artifacts.find((entry) => entry.id === id);
  if (artifact !== undefined) return artifact.createdAt;
  const routeRecords = [
    ...state.informationRoutes.state.institutionPossessions.map((entry) => [entry.id, entry.possessedAt] as const),
    ...state.informationRoutes.state.indexEntries.map((entry) => [entry.id, entry.createdAt] as const),
    ...state.informationRoutes.state.metadataNotices.map((entry) => [entry.id, entry.noticedAt] as const),
    ...state.informationRoutes.state.retrievals.map((entry) => [entry.id, entry.completedAt] as const),
    ...state.informationRoutes.state.receipts.map((entry) => [entry.id, entry.receivedAt] as const),
    ...state.presidentialPresentations.state.presentations.map((entry) => [entry.id, entry.presentedAt] as const),
    ...state.presidentialPresentations.state.escalationPresentations.map(
      (entry) => [entry.id, entry.presentedAt] as const,
    ),
    ...state.presidentialEscalations.state.escalations.map((entry) => [entry.id, entry.createdAt] as const),
    ...state.presidentialEscalations.state.lifecycleOccurrences.map((entry) => [entry.id, entry.occurredAt] as const),
    ...state.presidentialEscalations.state.defaultOccurrences.map((entry) => [entry.id, entry.occurredAt] as const),
    ...state.presidentialEscalations.state.reservedReviews.map((entry) => {
      const decision = state.presidentialDecisions.state.find((candidate) => candidate.id === entry.sourceDecisionId);
      return [entry.id, decision?.decidedAt ?? entry.reservedAt] as const;
    }),
    ...state.presidentialEscalations.state.reservedReviewLifecycleOccurrences.map(
      (entry) => [entry.id, entry.occurredAt] as const,
    ),
    ...state.administrationWorkstreams.state.workstreams.map((entry) => [entry.id, entry.createdAt] as const),
    ...state.administrationWorkstreams.state.transitions.map((entry) => [entry.id, entry.occurredAt] as const),
    ...state.presidentialDecisions.state.map((entry) => [entry.id, entry.decidedAt] as const),
    ...state.presidentialInstruments.state.map((entry) => [entry.id, entry.issuedAt] as const),
    ...state.instrumentDispatches.state.map((entry) => [entry.id, entry.attemptedAt] as const),
    ...state.officeOperations.state.flatMap((office) => [
      ...office.instrumentReceipts.map((entry) => [entry.id, entry.receivedAt] as const),
      ...office.instrumentDispositions.map((entry) => [entry.id, entry.dispositionAt] as const),
      ...office.assignments.map((entry) => [entry.id, entry.createdAt] as const),
    ]),
  ];
  return routeRecords.find(([candidate]) => candidate === id)?.[1] ?? null;
};

// History membership is deliberately global and noncognitive. These helpers
// are the separate authorization boundary for citing a record as office
// knowledge or exposing its identity in a presidentially visible preview.
const officeCanCiteOccurrence = (
  state: PresidentialInterventionState,
  officeId: string,
  occurrenceId: string,
  at: string,
): boolean => {
  const occurredAt = sourceOccurrenceTime(state, occurrenceId);
  if (occurredAt === null || instant(occurredAt, `${occurrenceId} occurrence`) > instant(at, "Office knowledge time")) {
    return false;
  }
  const artifact = findArtifact(state, occurrenceId);
  if (artifact !== undefined) {
    if (artifact.kind !== "SOURCE_EVIDENCE" && artifact.producingOfficeId === officeId) return true;
    return state.informationRoutes.state.receipts.some((receipt) =>
      receipt.recipientOfficeId === officeId &&
      receipt.artifactId === artifact.id &&
      artifact.sectionIds.every((sectionId) => receipt.receivedSectionIds.includes(sectionId)) &&
      instant(receipt.receivedAt, `${receipt.id} receipt`) <= instant(at, "Office knowledge time"));
  }
  if (state.informationRoutes.state.metadataNotices.some(
    (entry) => entry.id === occurrenceId && entry.recipientOfficeId === officeId,
  )) return true;
  if (state.informationRoutes.state.retrievals.some(
    (entry) => entry.id === occurrenceId && entry.requestingOfficeId === officeId,
  )) return true;
  if (state.informationRoutes.state.receipts.some(
    (entry) => entry.id === occurrenceId && entry.recipientOfficeId === officeId,
  )) return true;
  if (state.presidentialPresentations.state.presentations.some(
    (entry) => entry.id === occurrenceId && entry.presentingOfficeId === officeId,
  )) return true;
  if (state.presidentialPresentations.state.escalationPresentations.some(
    (entry) => entry.id === occurrenceId && entry.presentingOfficeId === officeId,
  )) return true;
  if (state.presidentialEscalations.state.escalations.some(
    (entry) => entry.id === occurrenceId && entry.escalatingOfficeId === officeId,
  )) return true;
  if (state.administrationWorkstreams.state.workstreams.some((entry) =>
    entry.id === occurrenceId && (
      entry.creatingOfficeId === officeId ||
      entry.coordinatorOfficeId === officeId ||
      entry.participatingOfficeIds.includes(officeId)
    ))) return true;
  if (state.administrationWorkstreams.state.transitions.some(
    (entry) => entry.id === occurrenceId && entry.actingOfficeId === officeId,
  )) return true;
  if (state.instrumentDispatches.state.some((entry) =>
    entry.id === occurrenceId &&
      (entry.dispatchingOfficeId === officeId || entry.recipientOfficeId === officeId))) return true;
  const operations = state.officeOperations.state.find((entry) => entry.officeId === officeId);
  return operations?.instrumentReceipts.some((entry) => entry.id === occurrenceId) === true ||
    operations?.instrumentDispositions.some((entry) => entry.id === occurrenceId) === true ||
    operations?.assignments.some((entry) => entry.id === occurrenceId) === true;
};

const presidentKnowsOccurrenceReference = (
  state: PresidentialInterventionState,
  occurrenceId: string,
  at: string,
): boolean => state.presidentialPresentations.state.presentations.some((presentation) =>
  instant(presentation.presentedAt, `${presentation.id} presentation`) <= instant(at, "Presidential knowledge time") &&
  (presentation.id === occurrenceId || presentation.shownPortions.some(
    (portion) => portion.artifactId === occurrenceId,
  )));

const indexEntry = (
  configuration: PresidentialInterventionConfiguration,
  occurrenceId: string,
  ownerId: string,
  recordKind: string,
  occurredAt: string,
  causalParentOccurrenceIds: readonly string[],
): HistoricalRecordIndexEntry => ({
  historyId: configuration.historyId,
  occurrenceId,
  ownerId,
  recordKind,
  occurredAt,
  ownerRecordId: occurrenceId,
  causalParentOccurrenceIds: [...causalParentOccurrenceIds],
});

const appendIndexEntries = (
  state: PresidentialInterventionState,
  entries: readonly HistoricalRecordIndexEntry[],
): PresidentialInterventionState => {
  const existing = state.historicalRecordIndex.state.entries;
  for (const entry of entries) {
    const duplicate = existing.find((candidate) =>
      candidate.occurrenceId === entry.occurrenceId ||
      (candidate.ownerId === entry.ownerId && candidate.ownerRecordId === entry.ownerRecordId));
    if (duplicate !== undefined) {
      if (!sameOrdered([duplicate], [entry])) throw new Error(`History entry ${entry.occurrenceId} conflicts.`);
      continue;
    }
  }
  return {
    ...state,
    historicalRecordIndex: {
      ...state.historicalRecordIndex,
      state: {
        ...state.historicalRecordIndex.state,
        entries: [...existing, ...entries.filter((entry) =>
          !existing.some((candidate) => candidate.occurrenceId === entry.occurrenceId))]
          .sort(compareHistoricalEntries),
      },
    },
  };
};

const officeHasArtifactPortion = (
  state: PresidentialInterventionState,
  officeId: string,
  portion: StaffOnlySourcePortion,
  at: string,
): boolean => {
  const artifact = findArtifact(state, portion.artifactId);
  if (artifact === undefined || !artifact.sectionIds.includes(portion.sectionId) ||
    instant(artifact.createdAt, `${artifact.id} creation`) > instant(at, "Portion query")) return false;
  if (artifact.kind !== "SOURCE_EVIDENCE" && artifact.producingOfficeId === officeId) return true;
  return state.informationRoutes.state.receipts.some((receipt) =>
    receipt.recipientOfficeId === officeId && receipt.artifactId === portion.artifactId &&
    receipt.receivedSectionIds.includes(portion.sectionId) &&
    instant(receipt.receivedAt, `${receipt.id} receipt`) <= instant(at, "Portion query"));
};

const findActiveEscalationLifecycle = (
  state: PresidentialInterventionState,
  escalationId: string,
): EscalationLifecycleOccurrence | undefined =>
  state.presidentialEscalations.state.lifecycleOccurrences.find(
    (entry) => entry.escalationId === escalationId,
  );

export const deriveEscalationStatus = (
  state: PresidentialInterventionState,
  escalationId: string,
): "ACTIVE" | "WITHDRAWN" | "RESOLVED_BY_DECISION" | "EXPIRED_TO_DEFAULT" | "SUPERSEDED" => {
  const lifecycle = findActiveEscalationLifecycle(state, escalationId);
  if (lifecycle === undefined) return "ACTIVE";
  const byKind: Record<EscalationLifecycleKind, ReturnType<typeof deriveEscalationStatus>> = {
    ESCALATION_WITHDRAWN: "WITHDRAWN",
    ESCALATION_RESOLVED_BY_DECISION: "RESOLVED_BY_DECISION",
    ESCALATION_EXPIRED_TO_DEFAULT: "EXPIRED_TO_DEFAULT",
    ESCALATION_SUPERSEDED: "SUPERSEDED",
  };
  return byKind[lifecycle.kind];
};

export const deriveReservedReviewStatus = (
  state: PresidentialInterventionState,
  reservationId: string,
  current: string,
): "SCHEDULED" | "DUE" | "COMPLETED" | "CANCELLED" | "SUPERSEDED" => {
  const reservation = state.presidentialEscalations.state.reservedReviews.find(
    (entry) => entry.id === reservationId,
  );
  if (reservation === undefined) throw new Error(`Unknown reserved review ${reservationId}.`);
  const lifecycle = state.presidentialEscalations.state.reservedReviewLifecycleOccurrences.find(
    (entry) => entry.reservationId === reservationId,
  );
  if (lifecycle !== undefined) {
    return lifecycle.kind === "RESERVED_REVIEW_COMPLETED"
      ? "COMPLETED"
      : lifecycle.kind === "RESERVED_REVIEW_CANCELLED"
        ? "CANCELLED"
        : "SUPERSEDED";
  }
  return instant(current, "Reserved-review current time") < instant(reservation.reservedAt, "Reserved-review time")
    ? "SCHEDULED"
    : "DUE";
};

const recordKindPhase: Readonly<Record<string, number>> = {
  ESCALATION_DEFAULT: 1,
  ESCALATION_EXPIRED_TO_DEFAULT: 2,
  RECIPIENT_NO_ACTION_BY_DEADLINE: 3,
  WORKSTREAM_CREATED: 5,
  WORKSTREAM_TRANSITION: 6,
  ESCALATION_CREATED: 5,
  ESCALATION_WITHDRAWN: 5,
  ESCALATION_RESOLVED_BY_DECISION: 8,
  ESCALATION_SUPERSEDED: 5,
  RESERVED_REVIEW_CREATED: 7,
  RESERVED_REVIEW_COMPLETED: 5,
  RESERVED_REVIEW_CANCELLED: 5,
  RESERVED_REVIEW_SUPERSEDED: 5,
  PRESIDENTIAL_DECISION: 5,
  PRESIDENTIAL_INSTRUMENT: 6,
  INSTRUMENT_DISPATCH: 5,
  OFFICE_INSTRUMENT_RECEIPT: 5,
  RECIPIENT_DISPOSITION: 5,
  INSTRUMENT_AUTHORIZED_OFFICE_ASSIGNMENT: 5,
};

const compareHistoricalEntries = (
  left: HistoricalRecordIndexEntry,
  right: HistoricalRecordIndexEntry,
): number => instant(left.occurredAt, `${left.occurrenceId} history time`) -
  instant(right.occurredAt, `${right.occurrenceId} history time`) ||
  (recordKindPhase[left.recordKind] ?? 99) - (recordKindPhase[right.recordKind] ?? 99) ||
  left.ownerId.localeCompare(right.ownerId) ||
  left.ownerRecordId.localeCompare(right.ownerRecordId) ||
  left.occurrenceId.localeCompare(right.occurrenceId);

const assertCanonicalOrder = <T>(
  values: readonly T[],
  timeOf: (value: T) => string,
  idOf: (value: T) => string,
  field: string,
): void => {
  const expected = sortedByTimeAndId(values, timeOf, idOf);
  if (!sameOrdered(values, expected)) throw new Error(`${field} is not in canonical time/identity order.`);
};

const assertPreview = (
  preview: PresidentialInstrumentPreview,
  state: PresidentialInterventionState,
  administration: PresidentialAdministrationConfiguration,
  presentingOfficeId: string,
  at: string,
): void => {
  requireExactKeys(preview, `Instrument preview ${preview.id}`, [
    "id",
    "payload",
    "payloadHash",
    "bundlePosition",
    "provenanceReference",
  ]);
  requireNonempty(preview.id, "Instrument preview identity");
  if (!Number.isSafeInteger(preview.bundlePosition) || preview.bundlePosition < 0) {
    throw new Error(`Instrument preview ${preview.id} has an invalid bundle position.`);
  }
  assertInstrumentPayloadCommon(preview.payload, administration, at);
  if (preview.payloadHash !== computePresidentialInstrumentPayloadHash(preview.payload)) {
    throw new Error(`Instrument preview ${preview.id} has a canonical payload-hash mismatch.`);
  }
  if (preview.payload.sourceReferenceIds.some((id) =>
    !officeCanCiteOccurrence(state, presentingOfficeId, id, at) ||
    !presidentKnowsOccurrenceReference(state, id, at))) {
    throw new Error(`Instrument preview ${preview.id} references records not authorized for presidential disclosure.`);
  }
  for (const attachment of preview.payload.attachmentMetadata) {
    const artifact = findArtifact(state, attachment.artifactId);
    if (
      artifact === undefined ||
      attachment.sectionIds.some((sectionId) => !artifact.sectionIds.includes(sectionId))
    ) throw new Error(`Instrument preview ${preview.id} has an invalid attachment scope.`);
  }
  if (preview.payload.kind === "REQUEST_OFFICE_ANALYSIS") {
    const artifact = findArtifact(state, preview.payload.evidenceArtifactId);
    if (
      artifact === undefined ||
      preview.payload.evidenceSectionIds.some((sectionId) => !artifact.sectionIds.includes(sectionId))
    ) throw new Error(`Instrument preview ${preview.id} has an invalid evidence scope.`);
  } else {
    const coordinationPayload = preview.payload;
    if (!state.administrationWorkstreams.state.workstreams.some(
      (workstream) => workstream.id === coordinationPayload.workstreamId,
    )) {
      throw new Error(`Instrument preview ${preview.id} references an unknown workstream.`);
    }
  }
  requireNonempty(preview.provenanceReference, `${preview.id} provenance`);
};

const assertEscalationOptions = (
  escalation: PresidentialEscalationRecord,
  state: PresidentialInterventionState,
  administration: PresidentialAdministrationConfiguration,
  rule: EscalationEligibilityRule,
): void => {
  requireNonemptyUnique(escalation.options.map((option) => option.id), `${escalation.id} options`);
  if (!sameSet(escalation.options.map((option) => option.kind), rule.requiredOptionKinds)) {
    throw new Error(`Escalation ${escalation.id} does not contain the configured local option set.`);
  }
  const request = escalation.options.find(
    (option): option is RequestAnalysisAndCoordinationOption =>
      option.kind === "REQUEST_SCOPED_ANALYSIS_AND_COORDINATION",
  );
  const reserve = escalation.options.find((option) => option.kind === "RESERVE_PRESIDENTIAL_REVIEW");
  const monitoring = escalation.options.find(
    (option): option is AllowMonitoringDefaultOption => option.kind === "ALLOW_MONITORING_DEFAULT",
  );
  if (request === undefined || reserve === undefined || monitoring === undefined) {
    throw new Error(`Escalation ${escalation.id} lacks an exact local option.`);
  }
  if (request.previews.length !== 2 || reserve.previews.length !== 0 || monitoring.previews.length !== 0) {
    throw new Error(`Escalation ${escalation.id} has an invalid visible instrument bundle.`);
  }
  requireNonemptyUnique(request.previews.map((preview) => preview.id), `${request.id} previews`);
  requireUnique(
    request.previews.map((preview) => String(preview.bundlePosition)),
    `${request.id} bundle positions`,
  );
  if (
    !sameOrdered(request.previews.map((preview) => preview.bundlePosition), [0, 1]) ||
    !sameOrdered(request.previews.map((preview) => preview.payload.kind), [
      "REQUEST_OFFICE_ANALYSIS",
      "REQUEST_WORKSTREAM_COORDINATION",
    ])
  ) throw new Error(`Escalation ${escalation.id} has a hidden, reordered, or unsupported bundle.`);
  for (const preview of request.previews) {
    assertPreview(preview, state, administration, escalation.escalatingOfficeId, escalation.createdAt);
  }
  if (
    instant(reserve.reservedAt, `${reserve.id} reserved time`) <=
      instant(escalation.createdAt, `${escalation.id} creation`)
  ) throw new Error(`Escalation ${escalation.id} has an invalid reserved-review option.`);
  requireNonempty(reserve.reviewQuestion, `${reserve.id} review question`);
  requireNonemptyUnique(reserve.expectedSourceReferenceIds, `${reserve.id} expected references`);
  const recipients = request.previews.map((preview) => preview.payload.recipientOfficeId);
  if (!sameSet(recipients, escalation.downstreamResolverOfficeIds)) {
    throw new Error(`Escalation ${escalation.id} downstream resolvers contradict its visible bundle.`);
  }
};

const assertSynthesisConflict = (
  artifact: PresidentialInformationArtifact,
  rule: EscalationEligibilityRule,
): void => {
  if (artifact.kind !== "SYNTHESIS") {
    throw new Error(`Escalation rule ${rule.id} requires a synthesis artifact.`);
  }
  const judgments = artifact.preservedAssessments.flatMap((entry) => entry.judgments)
    .filter((judgment) => judgment.propositionId === rule.requiredCommonPropositionId)
    .map((judgment) => judgment.judgment);
  if (judgments.length < 2 || new Set(judgments).size < 2) {
    throw new Error(`Escalation rule ${rule.id} requires preserved conflicting judgments.`);
  }
};

const assertPresidentialKnowledgePortion = (
  state: PresidentialInterventionState,
  portion: PresidentialKnownPortion,
  at: string,
): void => {
  const presentation = state.presidentialPresentations.state.presentations.find(
    (entry) => entry.id === portion.presentationId,
  );
  if (
    presentation === undefined ||
    instant(presentation.presentedAt, `${presentation.id} presentation`) > instant(at, "Knowledge query") ||
    !presentation.shownPortions.some((shown) =>
      shown.artifactId === portion.artifactId && shown.sectionId === portion.sectionId)
  ) throw new Error("Escalation cites a portion not presented to the executive recipient.");
};

const assertEscalationRecord = (
  escalation: PresidentialEscalationRecord,
  state: PresidentialInterventionState,
  administration: PresidentialAdministrationConfiguration,
  intervention: PresidentialInterventionConfiguration,
  current: string,
): void => {
  requireNonempty(escalation.id, "Escalation identity");
  requireNonempty(escalation.deduplicationIdentity, `${escalation.id} deduplication identity`);
  if (instant(escalation.createdAt, `${escalation.id} creation`) > instant(current, "Current time")) {
    throw new Error(`Escalation ${escalation.id} is future-dated.`);
  }
  assertEffectiveOfficeholder(
    state,
    escalation.escalatingOfficeholderAssignmentId,
    escalation.escalatingOfficeId,
    escalation.createdAt,
  );
  const rule = intervention.escalationEligibilityRules.find((candidate) =>
    candidate.initiatingOfficeId === escalation.escalatingOfficeId &&
    candidate.requiredBasisKind === escalation.basisKind);
  if (rule === undefined) throw new Error(`Escalation ${escalation.id} lacks configured eligibility.`);
  const authority = intervention.standingCoordinationAuthorities.find(
    (candidate) => candidate.id === rule.standingAuthorityId,
  );
  if (
    authority === undefined ||
    !isEffectiveAt(authority.effectiveFrom, authority.effectiveUntil, escalation.createdAt)
  ) throw new Error(`Escalation ${escalation.id} lacks effective initiating authority.`);
  const synthesis = findArtifact(state, escalation.basisSynthesisArtifactId);
  if (synthesis === undefined || synthesis.kind !== "SYNTHESIS" ||
    synthesis.producingOfficeId !== escalation.escalatingOfficeId ||
    instant(synthesis.createdAt, `${synthesis.id} creation`) > instant(escalation.createdAt, `${escalation.id} creation`)) {
    throw new Error(`Escalation ${escalation.id} lacks an office-owned source synthesis.`);
  }
  assertSynthesisConflict(synthesis, rule);
  if (synthesis.sourceAssessmentReceiptIds.some((receiptId) => {
    const receipt = state.informationRoutes.state.receipts.find((entry) => entry.id === receiptId);
    const source = receipt === undefined ? undefined : findArtifact(state, receipt.artifactId);
    return receipt === undefined || receipt.recipientOfficeId !== escalation.escalatingOfficeId ||
      source?.kind !== "ASSESSMENT" ||
      !assessmentSemanticContentIsReceived(source, receipt.receivedSectionIds);
  })) throw new Error(`Escalation ${escalation.id} lacks complete source-assessment receipt.`);
  requireNonemptyUnique(escalation.sourceRecordIds, `${escalation.id} source records`);
  if (
    !escalation.sourceRecordIds.includes(escalation.basisSynthesisArtifactId) ||
    escalation.sourceRecordIds.some((id) =>
      !officeCanCiteOccurrence(state, escalation.escalatingOfficeId, id, escalation.createdAt))
  ) throw new Error(`Escalation ${escalation.id} has unavailable source records.`);
  requireNonemptyUnique(
    escalation.presidentKnownPortions.map(
      (portion) => `${portion.presentationId}#${portion.artifactId}#${portion.sectionId}`,
    ),
    `${escalation.id} executive-recipient-known portions`,
  );
  escalation.presidentKnownPortions.forEach((portion) =>
    assertPresidentialKnowledgePortion(state, portion, escalation.createdAt));
  const shownSynthesisCount = escalation.presidentKnownPortions.filter(
    (portion) => portion.artifactId === synthesis.id,
  ).length;
  if (shownSynthesisCount < rule.requiredShownSynthesisSectionCount) {
    throw new Error(`Escalation ${escalation.id} lacks the configured bounded presidential presentation.`);
  }
  requireUnique(
    escalation.staffOnlySourcePortions.map((portion) => `${portion.artifactId}#${portion.sectionId}`),
    `${escalation.id} staff-only portions`,
  );
  for (const portion of escalation.staffOnlySourcePortions) {
    if (!officeHasArtifactPortion(state, escalation.escalatingOfficeId, portion, escalation.createdAt)) {
      throw new Error(`Escalation ${escalation.id} cites staff material the office does not possess.`);
    }
  }
  requireNonempty(escalation.requestedJudgment, `${escalation.id} requested judgment`);
  if (escalation.knownClaims.length === 0) throw new Error(`Escalation ${escalation.id} requires sourced claims.`);
  for (const claim of escalation.knownClaims) {
    requireNonempty(claim.claim, `${escalation.id} known claim`);
    requireNonemptyUnique(claim.sourceReferenceIds, `${escalation.id} claim sources`);
    if (claim.sourceReferenceIds.some((id) => !escalation.sourceRecordIds.includes(id))) {
      throw new Error(`Escalation ${escalation.id} has an unsupported claim source.`);
    }
  }
  requireNonemptyUnique(escalation.uncertainties, `${escalation.id} uncertainties`);
  requireNonemptyUnique(escalation.limitations, `${escalation.id} limitations`);
  requireNonemptyUnique(
    escalation.downstreamResolverOfficeIds,
    `${escalation.id} downstream resolver offices`,
  );
  if (escalation.downstreamResolverOfficeIds.some(
    (officeId) => !administration.offices.some((office) => office.id === officeId),
  )) throw new Error(`Escalation ${escalation.id} has an unknown resolver office.`);
  if (
    instant(escalation.expiresAt, `${escalation.id} expiration`) <=
      instant(escalation.createdAt, `${escalation.id} creation`) ||
    escalation.defaultRule.presidentialInstrumentOutcome !== "NO_NEW_PRESIDENTIAL_INSTRUMENT" ||
    escalation.defaultRule.officeMonitoringOutcome !== "CONTINUE_EXISTING_OFFICE_MONITORING"
  ) throw new Error(`Escalation ${escalation.id} has an invalid deadline/default.`);
  assertEscalationOptions(escalation, state, administration, rule);
  requireNonempty(escalation.provenanceReference, `${escalation.id} provenance`);
};

const expectedIndexEntries = (
  state: PresidentialInterventionState,
  configuration: PresidentialInterventionConfiguration,
): readonly HistoricalRecordIndexEntry[] => {
  const entries: HistoricalRecordIndexEntry[] = [];
  const add = (
    id: string,
    ownerId: string,
    kind: string,
    at: string,
    parents: readonly string[],
  ): void => {
    entries.push(indexEntry(configuration, id, ownerId, kind, at, parents));
  };
  for (const record of state.administrationWorkstreams.state.workstreams) {
    add(record.id, configuration.ownerIds.administrationWorkstreams, "WORKSTREAM_CREATED", record.createdAt,
      record.initialSourceReferenceIds);
  }
  for (const record of state.administrationWorkstreams.state.transitions) {
    add(record.id, configuration.ownerIds.administrationWorkstreams, "WORKSTREAM_TRANSITION", record.occurredAt,
      [record.workstreamId, ...(record.priorTransitionId === null ? [] : [record.priorTransitionId]),
        ...record.sourceOccurrenceIds]);
  }
  for (const record of state.presidentialEscalations.state.escalations) {
    add(record.id, configuration.ownerIds.presidentialEscalations, "ESCALATION_CREATED", record.createdAt,
      record.sourceRecordIds);
  }
  for (const record of state.presidentialEscalations.state.defaultOccurrences) {
    add(record.id, configuration.ownerIds.presidentialEscalations, "ESCALATION_DEFAULT", record.occurredAt,
      [record.escalationId]);
  }
  for (const record of state.presidentialEscalations.state.lifecycleOccurrences) {
    add(record.id, configuration.ownerIds.presidentialEscalations, record.kind, record.occurredAt,
      [record.escalationId, record.causeRecordId]);
  }
  for (const record of state.presidentialEscalations.state.reservedReviews) {
    const decision = state.presidentialDecisions.state.find((entry) => entry.id === record.sourceDecisionId);
    add(record.id, configuration.ownerIds.presidentialEscalations, "RESERVED_REVIEW_CREATED",
      decision?.decidedAt ?? record.reservedAt, [record.sourceEscalationId, record.sourceDecisionId]);
  }
  for (const record of state.presidentialEscalations.state.reservedReviewLifecycleOccurrences) {
    add(record.id, configuration.ownerIds.presidentialEscalations, record.kind, record.occurredAt,
      [record.reservationId, record.causeRecordId]);
  }
  for (const record of state.presidentialDecisions.state) {
    add(record.id, configuration.ownerIds.presidentialDecisions, "PRESIDENTIAL_DECISION", record.decidedAt,
      [record.sourceEscalationId, record.basisEscalationPresentationId]);
  }
  for (const record of state.presidentialInstruments.state) {
    add(record.id, configuration.ownerIds.presidentialInstruments, "PRESIDENTIAL_INSTRUMENT", record.issuedAt,
      [record.authorizingDecisionId]);
  }
  for (const record of state.instrumentDispatches.state) {
    add(record.id, configuration.ownerIds.instrumentDispatches, "INSTRUMENT_DISPATCH", record.attemptedAt,
      [record.instrumentId, ...(record.retryOfDispatchId === null ? [] : [record.retryOfDispatchId])]);
  }
  for (const office of state.officeOperations.state) {
    requireUnique(
      office.instrumentAssignmentAuthorizations.map((entry) => entry.assignmentId),
      `${office.officeId} instrument-assignment authority bindings`,
    );
    for (const record of office.instrumentReceipts) {
      add(record.id, state.officeOperations.ownerId, "OFFICE_INSTRUMENT_RECEIPT", record.receivedAt,
        [record.instrumentId, record.successfulDispatchId]);
    }
    for (const record of office.instrumentDispositions) {
      add(record.id, state.officeOperations.ownerId,
        record.kind === "NO_ACTION_BY_DEADLINE" ? "RECIPIENT_NO_ACTION_BY_DEADLINE" : "RECIPIENT_DISPOSITION",
        record.dispositionAt, [record.instrumentReceiptId]);
    }
    for (const assignment of office.assignments) {
      const disposition = office.instrumentDispositions.find(
        (entry) => entry.id === assignment.authorityReference,
      );
      if (disposition !== undefined) {
        add(assignment.id, state.officeOperations.ownerId, "INSTRUMENT_AUTHORIZED_OFFICE_ASSIGNMENT",
          assignment.createdAt, [disposition.id]);
      }
    }
  }
  return entries.sort(compareHistoricalEntries);
};

const assertControlBindingRecord = (
  binding: PresidentialControlBindingState,
  configuration: PresidentialInterventionConfiguration,
  administrationState: PresidentialAdministrationOwnerStates,
  at: string,
): void => {
  requireExactKeys(binding, "Presidential ControlBinding", [
    "id",
    "decisionSurface",
    "executiveOfficeId",
    "boundOfficeholderActorId",
    "status",
    "endedAt",
    "endReason",
  ]);
  const presidential = administrationState.administrationDirectory.state.presidentialRecipientBinding;
  if (
    binding.id !== configuration.controlBinding.id ||
    binding.decisionSurface !== configuration.controlBinding.decisionSurface ||
    binding.executiveOfficeId !== presidential.constitutionalOfficeId
  ) throw new Error("Presidential ControlBinding contradicts authenticated configuration.");
  if (binding.status === "ACTIVE") {
    if (
      binding.boundOfficeholderActorId !== presidential.actorId ||
      binding.endedAt !== null ||
      binding.endReason !== null ||
      !isEffectiveAt(presidential.effectiveFrom, presidential.effectiveUntil, at)
    ) throw new Error("Active presidential ControlBinding is stale or tampered.");
  } else {
    if (binding.endedAt === null || binding.endReason === null ||
      instant(binding.endedAt, "ControlBinding end") > instant(at, "ControlBinding save time")) {
      throw new Error("Ended presidential ControlBinding has invalid end evidence.");
    }
    if (binding.boundOfficeholderActorId !== presidential.actorId) {
      throw new Error("Ended presidential ControlBinding has a substituted actor identity.");
    }
  }
};

const assertRecipientConstraintSupport = (
  state: PresidentialInterventionState,
  administration: PresidentialAdministrationConfiguration,
  officeId: string,
  instrument: PresidentialInstrumentRecord,
  capability: RecipientCapabilityAuthority | undefined,
  kind: RecipientDispositionKind,
  constraintIds: readonly RecipientConstraint[],
  constraintSourceReferenceIds: readonly string[],
  at: string,
  nextReviewAt: string | null,
): void => {
  requireUnique(constraintIds, "Recipient disposition constraints");
  requireUnique(constraintSourceReferenceIds, "Recipient constraint source references");
  const relevant = administration.recipientCapabilities.filter((candidate) =>
    candidate.recipientOfficeId === officeId && candidate.instrumentKind === instrument.payload.kind);
  const effective = relevant.filter((candidate) =>
    isEffectiveAt(candidate.effectiveFrom, candidate.effectiveUntil, at));
  const fitting = effective.filter((candidate) => recipientCapabilityFitsInstrument(
    candidate,
    instrument.payload,
    instrument.issuedAt,
    at,
  ));
  const office = state.officeOperations.state.find((entry) => entry.officeId === officeId);
  if (office === undefined) throw new Error("Recipient constraint references an unknown office.");
  const queueSources = constraintSourceReferenceIds.filter((sourceId) =>
    office.activeQueueAssignmentIds.includes(sourceId) &&
    office.assignments.some((assignment) => assignment.id === sourceId));
  if (constraintSourceReferenceIds.some((sourceId) => !queueSources.includes(sourceId))) {
    throw new Error("Recipient constraint cites a record that is not an active recipient-owned queue condition.");
  }
  for (const constraint of constraintIds) {
    if (constraint === "NO_EFFECTIVE_RECIPIENT_CAPABILITY") {
      if (effective.length !== 0 || (capability !== undefined &&
        isEffectiveAt(capability.effectiveFrom, capability.effectiveUntil, at))) {
        throw new Error("NO_EFFECTIVE_RECIPIENT_CAPABILITY contradicts canonical capability state.");
      }
    } else if (constraint === "REQUEST_OUTSIDE_CAPABILITY") {
      if (effective.length === 0 || fitting.length !== 0 || capability === undefined ||
        !effective.some((candidate) => candidate.id === capability.id)) {
        throw new Error("REQUEST_OUTSIDE_CAPABILITY lacks an effective bounded capability reference.");
      }
    } else if (constraint === "MISSING_REQUIRED_EVIDENCE") {
      if (instrument.payload.kind !== "REQUEST_OFFICE_ANALYSIS") {
        throw new Error("MISSING_REQUIRED_EVIDENCE is unsupported for a coordination request.");
      }
      const analysisPayload = instrument.payload;
      const hasRequiredEvidence = state.informationRoutes.state.receipts.some((receipt) =>
        receipt.recipientOfficeId === officeId &&
        receipt.artifactId === analysisPayload.evidenceArtifactId &&
        analysisPayload.evidenceSectionIds.every((sectionId) =>
          receipt.receivedSectionIds.includes(sectionId)) &&
        instant(receipt.receivedAt, `${receipt.id} receipt`) <= instant(at, "Disposition time"));
      if (hasRequiredEvidence) {
        throw new Error("MISSING_REQUIRED_EVIDENCE contradicts the recipient's substantive receipts.");
      }
    } else if (constraint === "OFFICE_QUEUE_OR_DEADLINE_CONSTRAINT") {
      const atDeadline = kind === "NO_ACTION_BY_DEADLINE" &&
        instant(at, "Deadline disposition") ===
          instant(instrument.payload.requestedResponseDeadline, "Response deadline");
      if (!atDeadline && queueSources.length === 0) {
        throw new Error("OFFICE_QUEUE_OR_DEADLINE_CONSTRAINT lacks a concrete office queue/deadline source.");
      }
    } else if (constraint === "EFFECTIVE_AUTHORITY_NOT_YET_AVAILABLE") {
      const futureFits = capability !== undefined && relevant.some((candidate) =>
        candidate.id === capability.id &&
        instant(candidate.effectiveFrom, `${candidate.id} effective start`) > instant(at, "Disposition time") &&
        instant(candidate.effectiveFrom, `${candidate.id} effective start`) <
          instant(instrument.payload.requestedResponseDeadline, "Response deadline") &&
        recipientCapabilityFitsInstrument(
          candidate,
          instrument.payload,
          instrument.issuedAt,
          candidate.effectiveFrom,
        ));
      if (!futureFits || nextReviewAt === null || capability === undefined ||
        instant(nextReviewAt, "Recipient next review") <
          instant(capability.effectiveFrom, "Future capability effective start")) {
        throw new Error("EFFECTIVE_AUTHORITY_NOT_YET_AVAILABLE lacks future authority evidence.");
      }
    }
  }
};

const assertInstrumentAssignmentAuthorization = (
  state: PresidentialInterventionState,
  officeId: string,
  assignment: PresidentialInterventionState["officeOperations"]["state"][number]["assignments"][number],
  disposition: RecipientInstrumentDisposition,
  instrument: PresidentialInstrumentRecord,
  binding: InstrumentAssignmentAuthorizationBinding,
): void => {
  if (
    binding.assignmentId !== assignment.id ||
    binding.dispositionId !== disposition.id ||
    binding.instrumentId !== instrument.id ||
    binding.recipientOfficeId !== officeId ||
    binding.authorizedDeadline !== assignment.deadline ||
    binding.boundAt !== assignment.createdAt ||
    assignment.authorityReference !== disposition.id ||
    assignment.leadOfficeId !== disposition.recipientOfficeId ||
    !assignment.sourceReferenceIds.includes(disposition.id)
  ) throw new Error(`Instrument-authorized assignment ${assignment.id} has an invalid typed authority binding.`);
  if (disposition.nextReviewAt !== null &&
    instant(assignment.deadline, `${assignment.id} deadline`) >
      instant(disposition.nextReviewAt, `${disposition.id} review`)) {
    throw new Error(`Instrument-authorized assignment ${assignment.id} exceeds disposition timing.`);
  }
  const receipt = state.officeOperations.state
    .find((entry) => entry.officeId === officeId)?.instrumentReceipts
    .find((entry) => entry.id === disposition.instrumentReceiptId);
  const allowedReferences = new Set<string>([disposition.id]);
  if (receipt !== undefined) allowedReferences.add(receipt.id);
  if (instrument.payload.kind === "REQUEST_OFFICE_ANALYSIS") {
    for (const informationReceipt of state.informationRoutes.state.receipts) {
      if (
        informationReceipt.recipientOfficeId === officeId &&
        informationReceipt.artifactId === instrument.payload.evidenceArtifactId &&
        informationReceipt.receivedSectionIds.every((sectionId) =>
          disposition.acceptedSectionIds.includes(sectionId))
      ) allowedReferences.add(informationReceipt.id);
    }
  }
  if (assignment.sourceReferenceIds.some((sourceId) => !allowedReferences.has(sourceId))) {
    throw new Error(`Instrument-authorized assignment ${assignment.id} exceeds its typed source scope.`);
  }
  if (instrument.payload.kind === "REQUEST_OFFICE_ANALYSIS") {
    const analysisPayload = instrument.payload;
    if (
      binding.scope.kind !== "ANALYSIS_ASSIGNMENT_SCOPE" ||
      binding.scope.evidenceArtifactId !== analysisPayload.evidenceArtifactId ||
      !sameSet(binding.scope.evidenceSectionIds, disposition.acceptedSectionIds) ||
      binding.scope.productKind !== disposition.acceptedProductKind ||
      assignment.expectedProductKind !== binding.scope.productKind ||
      assignment.requiredConsultationOfficeIds.length !== 0
    ) throw new Error(`Instrument-authorized assignment ${assignment.id} exceeds accepted analysis scope.`);
  } else {
    const coordinationPayload = instrument.payload;
    if (
    binding.scope.kind !== "COORDINATION_ASSIGNMENT_SCOPE" ||
    binding.scope.workstreamId !== coordinationPayload.workstreamId ||
    !sameSet(binding.scope.coordinationActionKinds, disposition.acceptedCoordinationActions) ||
    assignment.expectedProductKind !== binding.scope.productKind ||
    assignment.requiredConsultationOfficeIds.some(
      (id) => !coordinationPayload.participatingOfficeIds.includes(id),
    )
    ) throw new Error(`Instrument-authorized assignment ${assignment.id} exceeds accepted coordination scope.`);
  }
};

export const assertPresidentialControlBinding = assertControlBindingRecord;

export const assertPresidentialInterventionOwnerStates = (
  state: PresidentialInterventionState,
  administration: PresidentialAdministrationConfiguration,
  configuration: PresidentialInterventionConfiguration,
  epoch: string,
  current: string,
): void => {
  assertPresidentialAdministrationOwnerStates(state, administration, epoch, current);
  assertPresidentialInterventionConfiguration(configuration, administration, epoch);
  const currentValue = instant(current, "Current I3 time");
  if (
    state.presidentialEscalations.ownerId !== configuration.ownerIds.presidentialEscalations ||
    state.administrationWorkstreams.ownerId !== configuration.ownerIds.administrationWorkstreams ||
    state.presidentialDecisions.ownerId !== configuration.ownerIds.presidentialDecisions ||
    state.presidentialInstruments.ownerId !== configuration.ownerIds.presidentialInstruments ||
    state.instrumentDispatches.ownerId !== configuration.ownerIds.instrumentDispatches ||
    state.historicalRecordIndex.ownerId !== configuration.ownerIds.historicalRecordIndex ||
    state.historicalRecordIndex.state.historyId !== configuration.historyId
  ) throw new Error("I3 owner or history identity contradicts authenticated configuration.");

  const escalationState = state.presidentialEscalations.state;
  for (const [field, values] of [
    ["Escalation", escalationState.escalations.map((entry) => entry.id)],
    ["Escalation lifecycle", escalationState.lifecycleOccurrences.map((entry) => entry.id)],
    ["Escalation default", escalationState.defaultOccurrences.map((entry) => entry.id)],
    ["Reserved review", escalationState.reservedReviews.map((entry) => entry.id)],
    ["Reserved-review lifecycle", escalationState.reservedReviewLifecycleOccurrences.map((entry) => entry.id)],
  ] as const) requireNonemptyUnique(values, `${field} identities`);
  requireNonemptyUnique(
    escalationState.escalations.map((entry) => entry.deduplicationIdentity),
    "Escalation deduplication identities",
  );
  requireNonemptyUnique(
    escalationState.lifecycleOccurrences.map((entry) => entry.deduplicationIdentity),
    "Escalation-lifecycle deduplication identities",
  );
  requireNonemptyUnique(
    escalationState.defaultOccurrences.map((entry) => entry.deduplicationIdentity),
    "Escalation-default deduplication identities",
  );
  requireNonemptyUnique(
    escalationState.reservedReviews.map((entry) => entry.deduplicationIdentity),
    "Reserved-review deduplication identities",
  );
  requireNonemptyUnique(
    escalationState.reservedReviewLifecycleOccurrences.map((entry) => entry.deduplicationIdentity),
    "Reserved-review lifecycle deduplication identities",
  );
  assertCanonicalOrder(escalationState.escalations, (entry) => entry.createdAt, (entry) => entry.id,
    "Escalations");
  assertCanonicalOrder(escalationState.lifecycleOccurrences, (entry) => entry.occurredAt, (entry) => entry.id,
    "Escalation lifecycle");
  assertCanonicalOrder(escalationState.defaultOccurrences, (entry) => entry.occurredAt, (entry) => entry.id,
    "Escalation defaults");
  for (const escalation of escalationState.escalations) {
    assertEscalationRecord(escalation, state, administration, configuration, current);
    const lifecycles = escalationState.lifecycleOccurrences.filter(
      (entry) => entry.escalationId === escalation.id,
    );
    if (lifecycles.length > 1) throw new Error(`Escalation ${escalation.id} has conflicting terminal lifecycle truth.`);
    const defaults = escalationState.defaultOccurrences.filter((entry) => entry.escalationId === escalation.id);
    const lifecycle = lifecycles[0];
    if (lifecycle !== undefined) {
      if (
        instant(lifecycle.occurredAt, `${lifecycle.id} occurrence`) <
          instant(escalation.createdAt, `${escalation.id} creation`) ||
        instant(lifecycle.occurredAt, `${lifecycle.id} occurrence`) > currentValue
      ) throw new Error(`Escalation lifecycle ${lifecycle.id} has invalid chronology.`);
      if ((lifecycle.actingOfficeId === null) !==
        (lifecycle.actingOfficeholderAssignmentId === null)) {
        throw new Error(`Escalation lifecycle ${lifecycle.id} has incomplete acting authority.`);
      }
      if (lifecycle.actingOfficeholderAssignmentId !== null && lifecycle.actingOfficeId !== null) {
        assertEffectiveOfficeholder(
          state,
          lifecycle.actingOfficeholderAssignmentId,
          lifecycle.actingOfficeId,
          lifecycle.occurredAt,
        );
      }
      if (lifecycle.kind === "ESCALATION_RESOLVED_BY_DECISION") {
        const decision = state.presidentialDecisions.state.find((entry) => entry.id === lifecycle.causeRecordId);
        if (decision?.sourceEscalationId !== escalation.id || decision.decidedAt !== lifecycle.occurredAt) {
          throw new Error(`Escalation lifecycle ${lifecycle.id} lacks its controlling decision.`);
        }
      } else if (lifecycle.kind === "ESCALATION_EXPIRED_TO_DEFAULT") {
        const occurrence = defaults.find((entry) => entry.id === lifecycle.causeRecordId);
        if (
          occurrence === undefined ||
          occurrence.occurredAt !== escalation.expiresAt ||
          lifecycle.occurredAt !== escalation.expiresAt ||
          lifecycle.actingOfficeId !== null
        ) throw new Error(`Escalation lifecycle ${lifecycle.id} lacks its deadline default.`);
      } else if (lifecycle.kind === "ESCALATION_SUPERSEDED") {
        const successor = escalationState.escalations.find((entry) => entry.id === lifecycle.causeRecordId);
        if (successor === undefined || successor.id === escalation.id ||
          instant(successor.createdAt, `${successor.id} creation`) <= instant(escalation.createdAt, `${escalation.id} creation`)) {
          throw new Error(`Escalation ${escalation.id} has invalid supersession.`);
        }
      } else {
        requireNonempty(lifecycle.causeRecordId, `${lifecycle.id} withdrawal cause`);
      }
      requireNonempty(lifecycle.provenanceReference, `${lifecycle.id} provenance`);
    }
    if (defaults.length > 1) throw new Error(`Escalation ${escalation.id} has duplicate default truth.`);
    for (const occurrence of defaults) {
      if (
        occurrence.occurredAt !== escalation.expiresAt ||
        occurrence.outcome !== "NO_NEW_PRESIDENTIAL_INSTRUMENT_CONTINUE_MONITORING"
      ) throw new Error(`Escalation default ${occurrence.id} is invalid.`);
      requireNonempty(occurrence.provenanceReference, `${occurrence.id} provenance`);
    }
    if (currentValue >= instant(escalation.expiresAt, `${escalation.id} expiration`) && lifecycle === undefined) {
      throw new Error(`Post-deadline escalation ${escalation.id} lacks deterministic closure.`);
    }
    if (lifecycle?.kind === "ESCALATION_EXPIRED_TO_DEFAULT" && defaults.length !== 1) {
      throw new Error(`Expired escalation ${escalation.id} lacks exactly one default occurrence.`);
    }
    if (lifecycle?.kind !== "ESCALATION_EXPIRED_TO_DEFAULT" && defaults.length !== 0) {
      throw new Error(`Nonexpired escalation ${escalation.id} cannot own a deadline default.`);
    }
  }
  const supersededEscalationIds = new Set<string>();
  for (const lifecycle of escalationState.lifecycleOccurrences.filter(
    (entry) => entry.kind === "ESCALATION_SUPERSEDED",
  )) {
    let successorId = lifecycle.causeRecordId;
    const seen = new Set([lifecycle.escalationId]);
    while (successorId !== "") {
      if (seen.has(successorId)) throw new Error("Escalation supersession graph is cyclic.");
      seen.add(successorId);
      const next = escalationState.lifecycleOccurrences.find(
        (entry) => entry.escalationId === successorId && entry.kind === "ESCALATION_SUPERSEDED",
      );
      if (next === undefined) break;
      successorId = next.causeRecordId;
    }
    supersededEscalationIds.add(lifecycle.escalationId);
  }
  void supersededEscalationIds;

  requireUnique(
    escalationState.reservedReviews.map((entry) => entry.sourceDecisionId),
    "Reserved-review source decisions",
  );
  for (const review of escalationState.reservedReviews) {
    const decision = state.presidentialDecisions.state.find((entry) => entry.id === review.sourceDecisionId);
    if (
      decision === undefined ||
      decision.sourceEscalationId !== review.sourceEscalationId ||
      decision.selectedOptionKind !== "RESERVE_PRESIDENTIAL_REVIEW" ||
      decision.reservedReviewId !== review.id ||
      instant(review.reservedAt, `${review.id} reserved time`) <= instant(decision.decidedAt, `${decision.id} decision`)
    ) throw new Error(`Reserved review ${review.id} lacks its authorizing decision.`);
    requireNonempty(review.reviewQuestion, `${review.id} question`);
    requireNonemptyUnique(review.priorPresentationIds, `${review.id} prior presentations`);
    if (review.priorPresentationIds.some((id) =>
      !state.presidentialPresentations.state.escalationPresentations.some((entry) => entry.id === id))) {
      throw new Error(`Reserved review ${review.id} cites unknown prior presentation.`);
    }
    requireUnique(review.expectedSourceReferenceIds, `${review.id} expected references`);
    requireNonempty(review.provenanceReference, `${review.id} provenance`);
    const lifecycles = escalationState.reservedReviewLifecycleOccurrences.filter(
      (entry) => entry.reservationId === review.id,
    );
    if (lifecycles.length > 1) throw new Error(`Reserved review ${review.id} has conflicting lifecycle truth.`);
    const lifecycle = lifecycles[0];
    if (lifecycle !== undefined) {
      if (instant(lifecycle.occurredAt, `${lifecycle.id} occurrence`) < instant(decision.decidedAt, `${decision.id} decision`) ||
        instant(lifecycle.occurredAt, `${lifecycle.id} occurrence`) > currentValue) {
        throw new Error(`Reserved-review lifecycle ${lifecycle.id} has invalid chronology.`);
      }
      assertEffectiveOfficeholder(
        state,
        lifecycle.actingOfficeholderAssignmentId,
        lifecycle.actingOfficeId,
        lifecycle.occurredAt,
      );
      if (lifecycle.kind === "RESERVED_REVIEW_SUPERSEDED") {
        const successor = escalationState.reservedReviews.find((entry) => entry.id === lifecycle.causeRecordId);
        const successorDecision = successor === undefined ? undefined : state.presidentialDecisions.state.find(
          (entry) => entry.id === successor.sourceDecisionId,
        );
        if (successor === undefined || successor.id === review.id || successorDecision === undefined ||
          instant(successorDecision.decidedAt, `${successorDecision.id} decision`) <=
            instant(decision.decidedAt, `${decision.id} decision`)) {
          throw new Error(`Reserved review ${review.id} has invalid supersession.`);
        }
      } else requireNonempty(lifecycle.causeRecordId, `${lifecycle.id} cause`);
      requireNonempty(lifecycle.provenanceReference, `${lifecycle.id} provenance`);
    }
  }
  for (const lifecycle of escalationState.reservedReviewLifecycleOccurrences) {
    if (!escalationState.reservedReviews.some((entry) => entry.id === lifecycle.reservationId)) {
      throw new Error(`Reserved-review lifecycle ${lifecycle.id} is dangling.`);
    }
  }
  for (const lifecycle of escalationState.reservedReviewLifecycleOccurrences.filter(
    (entry) => entry.kind === "RESERVED_REVIEW_SUPERSEDED",
  )) {
    let successorId = lifecycle.causeRecordId;
    const seen = new Set([lifecycle.reservationId]);
    while (successorId !== "") {
      if (seen.has(successorId)) throw new Error("Reserved-review supersession graph is cyclic.");
      seen.add(successorId);
      const next = escalationState.reservedReviewLifecycleOccurrences.find(
        (entry) => entry.reservationId === successorId && entry.kind === "RESERVED_REVIEW_SUPERSEDED",
      );
      if (next === undefined) break;
      successorId = next.causeRecordId;
    }
  }

  for (const presentation of state.presidentialPresentations.state.escalationPresentations) {
    const escalation = escalationState.escalations.find(
      (entry) => entry.id === presentation.sourceEscalationId,
    );
    if (
      escalation === undefined ||
      presentation.presentingOfficeId !== escalation.escalatingOfficeId ||
      instant(presentation.presentedAt, `${presentation.id} presentation`) <
        instant(escalation.createdAt, `${escalation.id} creation`) ||
      instant(presentation.presentedAt, `${presentation.id} presentation`) >=
        instant(escalation.expiresAt, `${escalation.id} expiration`) ||
      !sameSet(presentation.shownSectionIds, POP0_I3_ESCALATION_PRESENTATION_SECTION_IDS) ||
      !sameOrdered(presentation.shownOptionIds, escalation.options.map((option) => option.id))
    ) throw new Error(`Escalation presentation ${presentation.id} diverges from its source escalation.`);
    const previews = escalation.options.flatMap((option) => option.previews)
      .sort((left, right) => left.bundlePosition - right.bundlePosition);
    if (
      !sameOrdered(presentation.shownPreviewIds, previews.map((preview) => preview.id)) ||
      !sameOrdered(presentation.shownPreviewHashes, previews.map((preview) => preview.payloadHash))
    ) throw new Error(`Escalation presentation ${presentation.id} has stale/tampered preview evidence.`);
    for (const portion of presentation.referencedButNotShownSourcePortions) {
      if (
        !escalation.staffOnlySourcePortions.some((candidate) =>
          candidate.artifactId === portion.artifactId && candidate.sectionId === portion.sectionId) ||
        !officeHasArtifactPortion(state, presentation.presentingOfficeId, portion, presentation.presentedAt)
      ) throw new Error(`Escalation presentation ${presentation.id} references unavailable staff material.`);
    }
  }

  const workstreamState = state.administrationWorkstreams.state;
  requireNonemptyUnique(workstreamState.workstreams.map((entry) => entry.id), "Workstream identities");
  requireNonemptyUnique(workstreamState.transitions.map((entry) => entry.id), "Workstream-transition identities");
  requireNonemptyUnique(
    workstreamState.transitions.map((entry) => entry.deduplicationIdentity),
    "Workstream-transition deduplication identities",
  );
  assertCanonicalOrder(workstreamState.workstreams, (entry) => entry.createdAt, (entry) => entry.id,
    "Workstreams");
  assertCanonicalOrder(workstreamState.transitions, (entry) => entry.occurredAt, (entry) => entry.id,
    "Workstream transitions");
  for (const workstream of workstreamState.workstreams) {
    const definition = configuration.workstreamDefinition;
    if (
      workstream.id !== definition.id ||
      workstream.label !== definition.label ||
      workstream.adoptedObjective !== definition.adoptedObjective ||
      workstream.coordinatorOfficeId !== definition.coordinatorOfficeId ||
      !sameOrdered(workstream.participatingOfficeIds, definition.participatingOfficeIds)
    ) throw new Error(`Workstream ${workstream.id} contradicts the configured bounded objective.`);
    assertEffectiveOfficeholder(
      state,
      workstream.creatingOfficeholderAssignmentId,
      workstream.creatingOfficeId,
      workstream.createdAt,
    );
    const authority = configuration.standingCoordinationAuthorities.find(
      (entry) => entry.id === workstream.authorityReference && entry.officeId === workstream.creatingOfficeId &&
        entry.permittedWorkstreamIds.includes(workstream.id) &&
        isEffectiveAt(entry.effectiveFrom, entry.effectiveUntil, workstream.createdAt),
    );
    if (authority === undefined || workstream.creatingOfficeId !== workstream.coordinatorOfficeId) {
      throw new Error(`Workstream ${workstream.id} lacks configured creation authority.`);
    }
    requireNonemptyUnique(workstream.initialSourceReferenceIds, `${workstream.id} source references`);
    if (workstream.initialSourceReferenceIds.some((id) => sourceOccurrenceTime(state, id) === null)) {
      throw new Error(`Workstream ${workstream.id} references unavailable sources.`);
    }
    if (instant(workstream.initialReviewAt, `${workstream.id} review`) <=
      instant(workstream.createdAt, `${workstream.id} creation`)) {
      throw new Error(`Workstream ${workstream.id} has a nonfuture review.`);
    }
    requireNonempty(workstream.provenanceReference, `${workstream.id} provenance`);
    const transitions = workstreamState.transitions.filter((entry) => entry.workstreamId === workstream.id);
    if (transitions.length === 0 || transitions[0].priorTransitionId !== null ||
      transitions[0].status !== "MONITORED" || transitions[0].occurredAt !== workstream.createdAt) {
      throw new Error(`Workstream ${workstream.id} lacks its immutable monitored creation transition.`);
    }
    for (let index = 0; index < transitions.length; index += 1) {
      const transition = transitions[index];
      const expectedPrior = index === 0 ? null : transitions[index - 1].id;
      if (transition.priorTransitionId !== expectedPrior) {
        throw new Error(`Workstream transition ${transition.id} has a broken prior chain.`);
      }
      assertEffectiveOfficeholder(
        state,
        transition.actingOfficeholderAssignmentId,
        transition.actingOfficeId,
        transition.occurredAt,
      );
      if (transition.actingOfficeId !== workstream.coordinatorOfficeId ||
        instant(transition.occurredAt, `${transition.id} occurrence`) <
          instant(workstream.createdAt, `${workstream.id} creation`) ||
        instant(transition.occurredAt, `${transition.id} occurrence`) > currentValue) {
        throw new Error(`Workstream transition ${transition.id} violates coordinator ownership or time.`);
      }
      requireUnique(transition.sourceOccurrenceIds, `${transition.id} source occurrences`);
      for (const sourceId of transition.sourceOccurrenceIds) {
        const sourceTime = sourceOccurrenceTime(state, sourceId);
        if (sourceTime === null || instant(sourceTime, `${sourceId} source`) >
          instant(transition.occurredAt, `${transition.id} occurrence`)) {
          throw new Error(`Workstream transition ${transition.id} has an unavailable/future source.`);
        }
      }
      const effectiveAuthority = configuration.standingCoordinationAuthorities.find(
        (entry) => entry.officeId === transition.actingOfficeId &&
          entry.permittedWorkstreamIds.includes(workstream.id) &&
          entry.permittedStatuses.includes(transition.status) &&
          isEffectiveAt(entry.effectiveFrom, entry.effectiveUntil, transition.occurredAt),
      );
      if (effectiveAuthority === undefined) {
        throw new Error(`Workstream transition ${transition.id} lacks typed coordination authority.`);
      }
      requireNonempty(transition.reason, `${transition.id} reason`);
      requireNonempty(transition.provenanceReference, `${transition.id} provenance`);
    }
  }
  if (workstreamState.workstreams.length > 1) throw new Error("POP0-I3 permits one bounded workstream only.");

  requireNonemptyUnique(state.presidentialDecisions.state.map((entry) => entry.id), "Decision identities");
  requireNonemptyUnique(
    state.presidentialDecisions.state.map((entry) => entry.deduplicationIdentity),
    "Decision deduplication identities",
  );
  requireUnique(
    state.presidentialDecisions.state.map((entry) => entry.sourceEscalationId),
    "Controlling escalation decisions",
  );
  assertCanonicalOrder(state.presidentialDecisions.state, (entry) => entry.decidedAt, (entry) => entry.id,
    "Presidential decisions");
  for (const decision of state.presidentialDecisions.state) {
    const escalation = escalationState.escalations.find((entry) => entry.id === decision.sourceEscalationId);
    const presentation = state.presidentialPresentations.state.escalationPresentations.find(
      (entry) => entry.id === decision.basisEscalationPresentationId,
    );
    const option = escalation?.options.find((entry) => entry.id === decision.selectedOptionId);
    const lifecycle = escalationState.lifecycleOccurrences.find(
      (entry) => entry.escalationId === decision.sourceEscalationId,
    );
    if (
      escalation === undefined || presentation?.sourceEscalationId !== escalation.id ||
      option === undefined || decision.selectedOptionKind !== option.kind ||
      lifecycle?.kind !== "ESCALATION_RESOLVED_BY_DECISION" || lifecycle.causeRecordId !== decision.id ||
      decision.controlBindingId !== configuration.controlBinding.id ||
      decision.presidentActorId !== administration.presidentialRecipientBinding.actorId ||
      decision.constitutionalOfficeId !== administration.presidentialRecipientBinding.constitutionalOfficeId ||
      instant(decision.decidedAt, `${decision.id} decision`) < instant(presentation.presentedAt, `${presentation.id} presentation`) ||
      instant(decision.decidedAt, `${decision.id} decision`) >= instant(escalation.expiresAt, `${escalation.id} expiration`)
    ) throw new Error(`Presidential decision ${decision.id} lacks valid authority/presentation/escalation state.`);
    const previews = option.previews;
    const allPresentedPreviews = escalation.options.flatMap((candidate) => candidate.previews)
      .sort((left, right) => left.bundlePosition - right.bundlePosition);
    if (
      !sameOrdered(decision.previewIds, previews.map((preview) => preview.id)) ||
      !sameOrdered(decision.previewHashes, previews.map((preview) => preview.payloadHash)) ||
      !sameOrdered(allPresentedPreviews.map((preview) => preview.id), presentation.shownPreviewIds) ||
      !sameOrdered(allPresentedPreviews.map((preview) => preview.payloadHash), presentation.shownPreviewHashes) ||
      !sameSet(decision.acknowledgedUncertainties, escalation.uncertainties)
    ) throw new Error(`Presidential decision ${decision.id} diverges from its visible option/basis.`);
    const instruments = state.presidentialInstruments.state.filter(
      (entry) => entry.authorizingDecisionId === decision.id,
    ).sort((left, right) => {
      const leftPreview = previews.find((preview) => preview.id === left.sourcePreviewId);
      const rightPreview = previews.find((preview) => preview.id === right.sourcePreviewId);
      return (leftPreview?.bundlePosition ?? -1) - (rightPreview?.bundlePosition ?? -1);
    });
    if (!sameOrdered(decision.authorizedInstrumentIds, instruments.map((entry) => entry.id)) ||
      instruments.length !== previews.length) {
      throw new Error(`Presidential decision ${decision.id} materialized a hidden/missing instrument.`);
    }
    if (option.kind === "RESERVE_PRESIDENTIAL_REVIEW") {
      if (decision.reservedReviewId === null || decision.deliberateDefaultRuleReference !== null) {
        throw new Error(`Presidential decision ${decision.id} has invalid reserved-review evidence.`);
      }
    } else if (option.kind === "ALLOW_MONITORING_DEFAULT") {
      if (decision.reservedReviewId !== null || decision.deliberateDefaultRuleReference !== `${escalation.id}#default`) {
        throw new Error(`Presidential decision ${decision.id} has invalid monitoring-default evidence.`);
      }
    } else if (decision.reservedReviewId !== null || decision.deliberateDefaultRuleReference !== null) {
      throw new Error(`Presidential decision ${decision.id} has an invalid zero-instrument reference.`);
    }
    if (decision.supersedesDecisionId !== null) {
      const prior = state.presidentialDecisions.state.find((entry) => entry.id === decision.supersedesDecisionId);
      if (prior === undefined || instant(prior.decidedAt, `${prior.id} decision`) >=
        instant(decision.decidedAt, `${decision.id} decision`)) {
        throw new Error(`Presidential decision ${decision.id} has invalid supersession.`);
      }
    }
    requireNonempty(decision.provenanceReference, `${decision.id} provenance`);
  }

  requireNonemptyUnique(state.presidentialInstruments.state.map((entry) => entry.id), "Instrument identities");
  requireNonemptyUnique(
    state.presidentialInstruments.state.map((entry) => entry.deduplicationIdentity),
    "Instrument deduplication identities",
  );
  assertCanonicalOrder(state.presidentialInstruments.state, (entry) => entry.issuedAt, (entry) => entry.id,
    "Presidential instruments");
  for (const instrument of state.presidentialInstruments.state) {
    const decision = state.presidentialDecisions.state.find((entry) => entry.id === instrument.authorizingDecisionId);
    const escalation = decision === undefined ? undefined : escalationState.escalations.find(
      (entry) => entry.id === decision.sourceEscalationId,
    );
    const option = escalation?.options.find((entry) => entry.id === instrument.selectedOptionId);
    const preview = option?.previews.find((entry) => entry.id === instrument.sourcePreviewId);
    if (
      decision === undefined || preview === undefined ||
      instrument.sourcePreviewHash !== preview.payloadHash ||
      computePresidentialInstrumentPayloadHash(instrument.payload) !== preview.payloadHash ||
      !sameOrdered([canonicalPresidentialInstrumentPayload(instrument.payload)],
        [canonicalPresidentialInstrumentPayload(preview.payload)]) ||
      instrument.issuingPresidentActorId !== decision.presidentActorId ||
      instrument.issuingConstitutionalOfficeId !== decision.constitutionalOfficeId ||
      instrument.issuedAt !== decision.decidedAt
    ) throw new Error(`Presidential instrument ${instrument.id} diverges from its visible preview.`);
    assertInstrumentPayloadCommon(instrument.payload, administration, instrument.issuedAt);
    if (instrument.revisionOfInstrumentId !== null || instrument.supersedesInstrumentId !== null) {
      throw new Error(`POP0-I3 instrument ${instrument.id} cannot introduce unreviewed revision behavior.`);
    }
    requireNonempty(instrument.provenanceReference, `${instrument.id} provenance`);
  }

  requireNonemptyUnique(state.instrumentDispatches.state.map((entry) => entry.id), "Dispatch identities");
  requireNonemptyUnique(
    state.instrumentDispatches.state.map((entry) => entry.deduplicationIdentity),
    "Dispatch deduplication identities",
  );
  assertCanonicalOrder(state.instrumentDispatches.state, (entry) => entry.attemptedAt, (entry) => entry.id,
    "Instrument dispatches");
  for (const dispatch of state.instrumentDispatches.state) {
    const instrument = state.presidentialInstruments.state.find((entry) => entry.id === dispatch.instrumentId);
    if (
      instrument === undefined || dispatch.recipientOfficeId !== instrument.payload.recipientOfficeId ||
      instant(dispatch.attemptedAt, `${dispatch.id} attempt`) < instant(instrument.issuedAt, `${instrument.id} issue`) ||
      instant(dispatch.attemptedAt, `${dispatch.id} attempt`) > currentValue
    ) throw new Error(`Instrument dispatch ${dispatch.id} has an invalid route or chronology.`);
    if (!administration.offices.some((office) => office.id === dispatch.dispatchingOfficeId)) {
      throw new Error(`Instrument dispatch ${dispatch.id} has an unknown dispatching office.`);
    }
    requireNonempty(dispatch.dispatchPath, `${dispatch.id} path`);
    requireNonempty(dispatch.outcomeProvenanceReference, `${dispatch.id} outcome provenance`);
    if (dispatch.outcome === "DELIVERED_TO_OFFICE_BOUNDARY") {
      if (dispatch.deliveredAt === null || dispatch.failureReason !== null ||
        instant(dispatch.deliveredAt, `${dispatch.id} delivery`) < instant(dispatch.attemptedAt, `${dispatch.id} attempt`) ||
        instant(dispatch.deliveredAt, `${dispatch.id} delivery`) > currentValue) {
        throw new Error(`Delivered dispatch ${dispatch.id} has invalid delivery evidence.`);
      }
    } else if (dispatch.deliveredAt !== null || dispatch.failureReason === null) {
      throw new Error(`Failed/undelivered dispatch ${dispatch.id} has invalid failure evidence.`);
    }
    if (dispatch.failureReason !== null) requireNonempty(dispatch.failureReason, `${dispatch.id} failure reason`);
    if (dispatch.retryOfDispatchId !== null) {
      const prior = state.instrumentDispatches.state.find((entry) => entry.id === dispatch.retryOfDispatchId);
      if (prior === undefined || prior.instrumentId !== dispatch.instrumentId ||
        prior.outcome === "DELIVERED_TO_OFFICE_BOUNDARY" ||
        instant(prior.attemptedAt, `${prior.id} attempt`) >= instant(dispatch.attemptedAt, `${dispatch.id} attempt`)) {
        throw new Error(`Instrument dispatch ${dispatch.id} has invalid retry lineage.`);
      }
    }
  }

  for (const office of state.officeOperations.state) {
    for (const receipt of office.instrumentReceipts) {
      const instrument = state.presidentialInstruments.state.find((entry) => entry.id === receipt.instrumentId);
      const dispatch = state.instrumentDispatches.state.find((entry) => entry.id === receipt.successfulDispatchId);
      if (
        instrument === undefined || dispatch === undefined ||
        dispatch.instrumentId !== instrument.id || dispatch.outcome !== "DELIVERED_TO_OFFICE_BOUNDARY" ||
        dispatch.deliveredAt === null || receipt.recipientOfficeId !== instrument.payload.recipientOfficeId ||
        receipt.receivedPayloadVersion !== instrument.payload.payloadVersion ||
        instant(receipt.receivedAt, `${receipt.id} receipt`) < instant(dispatch.deliveredAt, `${dispatch.id} delivery`)
      ) throw new Error(`Office instrument receipt ${receipt.id} lacks valid delivery.`);
    }
    for (const disposition of office.instrumentDispositions) {
      const receipt = office.instrumentReceipts.find((entry) => entry.id === disposition.instrumentReceiptId);
      const instrument = receipt === undefined ? undefined : state.presidentialInstruments.state.find(
        (entry) => entry.id === receipt.instrumentId,
      );
      if (receipt === undefined || instrument === undefined || disposition.instrumentId !== instrument.id) {
        throw new Error(`Recipient disposition ${disposition.id} lacks a valid instrument receipt.`);
      }
      const deadline = instant(instrument.payload.requestedResponseDeadline, `${instrument.id} response deadline`);
      const dispositionTime = instant(disposition.dispositionAt, `${disposition.id} disposition`);
      const capability = disposition.capabilityAuthorityId === null ? undefined :
        administration.recipientCapabilities.find((entry) => entry.id === disposition.capabilityAuthorityId);
      requireUnique(disposition.constraintSourceReferenceIds, `${disposition.id} constraint sources`);
      if (disposition.constraintIds.some((constraint) => !allowedRecipientConstraints.includes(constraint))) {
        throw new Error(`Recipient disposition ${disposition.id} has an unsupported typed constraint.`);
      }
      if (disposition.kind === "NO_ACTION_BY_DEADLINE") {
        if (dispositionTime !== deadline ||
          instant(receipt.receivedAt, `${receipt.id} receipt`) >= deadline ||
          disposition.authoringOfficeholderAssignmentId !== null ||
          !sameOrdered(disposition.constraintIds, ["OFFICE_QUEUE_OR_DEADLINE_CONSTRAINT"])) {
          throw new Error(`Deadline-derived disposition ${disposition.id} is invalid.`);
        }
        if (capability !== undefined && !recipientCapabilityFitsInstrument(
          capability,
          instrument.payload,
          instrument.issuedAt,
          disposition.dispositionAt,
        )) throw new Error(`Deadline disposition ${disposition.id} cites an invalid capability.`);
      } else {
        if (dispositionTime >= deadline) throw new Error(`Recipient disposition ${disposition.id} missed its deadline.`);
        if (disposition.authoringOfficeholderAssignmentId === null) {
          throw new Error(`Recipient disposition ${disposition.id} lacks an effective author.`);
        }
        if (disposition.kind === "ACCEPTED_AS_REQUESTED" || disposition.kind === "NARROWED") {
          if (capability === undefined || !recipientCapabilityFitsInstrument(
            capability,
            instrument.payload,
            instrument.issuedAt,
            disposition.dispositionAt,
          )) throw new Error(`Recipient disposition ${disposition.id} lacks matching jurisdiction.`);
        }
      }
      assertRecipientConstraintSupport(
        state,
        administration,
        disposition.recipientOfficeId,
        instrument,
        capability,
        disposition.kind,
        disposition.constraintIds,
        disposition.constraintSourceReferenceIds,
        disposition.dispositionAt,
        disposition.nextReviewAt,
      );
      if (instrument.payload.kind === "REQUEST_OFFICE_ANALYSIS") {
        const analysisPayload = instrument.payload;
        if (disposition.kind === "ACCEPTED_AS_REQUESTED" && (
          disposition.acceptedProductKind !== analysisPayload.requestedProductKind ||
          !sameSet(disposition.acceptedSectionIds, analysisPayload.evidenceSectionIds)
        )) throw new Error(`Recipient disposition ${disposition.id} does not accept the exact request.`);
        if (disposition.kind === "NARROWED") {
          if (capability?.kind !== "ANALYSIS_CAPABILITY" || !capability.mayNarrow ||
            !analysisPayload.narrowingPermitted ||
            disposition.acceptedProductKind === null ||
            !capability.permittedProductKinds.includes(disposition.acceptedProductKind) ||
            (disposition.acceptedProductKind !== analysisPayload.requestedProductKind &&
              !capability.permittedLessClaimingProductKinds.includes(disposition.acceptedProductKind)) ||
            disposition.acceptedSectionIds.some((id) => !analysisPayload.evidenceSectionIds.includes(id)) ||
            (disposition.acceptedProductKind === analysisPayload.requestedProductKind &&
              disposition.acceptedSectionIds.length >= analysisPayload.evidenceSectionIds.length)) {
            throw new Error(`Recipient disposition ${disposition.id} is not a strict supported narrowing.`);
          }
        }
      } else {
        const coordinationPayload = instrument.payload;
        if (disposition.kind === "ACCEPTED_AS_REQUESTED" &&
          !sameSet(disposition.acceptedCoordinationActions, coordinationPayload.permittedCoordinationActions)) {
          throw new Error(`Recipient disposition ${disposition.id} does not accept exact coordination scope.`);
        }
        if (disposition.kind === "NARROWED" && (
          capability?.kind !== "COORDINATION_CAPABILITY" || !capability.mayNarrow ||
          disposition.acceptedCoordinationActions.length >= coordinationPayload.permittedCoordinationActions.length ||
          disposition.acceptedCoordinationActions.some(
            (action) => !coordinationPayload.permittedCoordinationActions.includes(action),
          )
        )) throw new Error(`Recipient disposition ${disposition.id} is not strict coordination narrowing.`);
      }
      if (["ACCEPTED_AS_REQUESTED", "NARROWED"].includes(disposition.kind) &&
        (disposition.constraintIds.length !== 0 || disposition.constraintSourceReferenceIds.length !== 0)) {
        throw new Error(`Accepted disposition ${disposition.id} cannot carry refusal/delay constraints.`);
      }
      if (["DELAYED", "REFUSED"].includes(disposition.kind) && disposition.constraintIds.length === 0) {
        throw new Error(`Recipient disposition ${disposition.id} requires typed constraints.`);
      }
      if (disposition.kind === "DELAYED" && disposition.nextReviewAt === null) {
        throw new Error(`Delayed disposition ${disposition.id} requires a future review.`);
      }
      if (disposition.kind === "REFUSED" && disposition.reason === null) {
        throw new Error(`Refused disposition ${disposition.id} requires a reason.`);
      }
    }
    for (const assignment of office.assignments) {
      const disposition = office.instrumentDispositions.find((entry) => entry.id === assignment.authorityReference);
      if (disposition === undefined) continue;
      const instrument = state.presidentialInstruments.state.find(
        (entry) => entry.id === disposition.instrumentId,
      );
      const authorization = office.instrumentAssignmentAuthorizations.find(
        (entry) => entry.assignmentId === assignment.id,
      );
      if (!["ACCEPTED_AS_REQUESTED", "NARROWED"].includes(disposition.kind) ||
        instrument === undefined || authorization === undefined) {
        throw new Error(`Instrument-authorized assignment ${assignment.id} exceeds its disposition.`);
      }
      assertInstrumentAssignmentAuthorization(
        state,
        office.officeId,
        assignment,
        disposition,
        instrument,
        authorization,
      );
      if (instrument?.payload.kind === "REQUEST_OFFICE_ANALYSIS" &&
        disposition.kind === "ACCEPTED_AS_REQUESTED") {
        const payload = instrument.payload;
        const hasSubstantiveScope = state.informationRoutes.state.receipts.some((receipt) =>
          receipt.recipientOfficeId === disposition.recipientOfficeId &&
          receipt.artifactId === payload.evidenceArtifactId &&
          payload.evidenceSectionIds.every((sectionId) =>
            receipt.receivedSectionIds.includes(sectionId)));
        if (!hasSubstantiveScope && (
          assignment.status !== "BLOCKED" ||
          assignment.resultArtifactIds.length !== 0 ||
          assignment.failureReason === null ||
          assignment.statusProvenanceReferenceId !== disposition.id
        )) {
          throw new Error(
            `Full-scope instrument assignment ${assignment.id} is represented as proceeding without substantive receipt.`,
          );
        }
      }
    }
    for (const authorization of office.instrumentAssignmentAuthorizations) {
      const assignment = office.assignments.find((entry) => entry.id === authorization.assignmentId);
      const disposition = office.instrumentDispositions.find(
        (entry) => entry.id === authorization.dispositionId,
      );
      if (assignment === undefined || disposition === undefined ||
        assignment.authorityReference !== disposition.id) {
        throw new Error(`Instrument assignment authority for ${authorization.assignmentId} is dangling.`);
      }
    }
  }
  for (const instrument of state.presidentialInstruments.state) {
    const receipt = state.officeOperations.state.flatMap((office) => office.instrumentReceipts)
      .find((entry) => entry.instrumentId === instrument.id);
    const disposition = state.officeOperations.state.flatMap((office) => office.instrumentDispositions)
      .find((entry) => entry.instrumentId === instrument.id);
    if (
      currentValue >= instant(instrument.payload.requestedResponseDeadline, `${instrument.id} response deadline`) &&
      receipt !== undefined &&
      instant(receipt.receivedAt, `${receipt.id} receipt`) <
        instant(instrument.payload.requestedResponseDeadline, `${instrument.id} response deadline`) &&
      disposition === undefined
    ) throw new Error(`Post-deadline instrument ${instrument.id} lacks deterministic recipient closure.`);
  }

  const expected = expectedIndexEntries(state, configuration);
  const actual = state.historicalRecordIndex.state.entries;
  requireNonemptyUnique(actual.map((entry) => entry.occurrenceId), "Historical occurrence identities");
  requireUnique(actual.map((entry) => `${entry.ownerId}#${entry.ownerRecordId}`), "Historical owner references");
  if (!sameOrdered(actual, [...actual].sort(compareHistoricalEntries))) {
    throw new Error("Historical record index is not in fixed time/phase/owner order.");
  }
  if (!sameOrdered(actual, expected)) {
    throw new Error("Historical record index is missing, duplicated, dangling, or substantively inconsistent.");
  }
  for (const entry of actual) {
    if (entry.historyId !== configuration.historyId || entry.occurrenceId !== entry.ownerRecordId ||
      recordKindPhase[entry.recordKind] === undefined) {
      throw new Error(`Historical entry ${entry.occurrenceId} has invalid identity/kind.`);
    }
    for (const parentId of entry.causalParentOccurrenceIds) {
      const parentTime = sourceOccurrenceTime(state, parentId);
      if (parentTime === null || instant(parentTime, `${parentId} parent`) > instant(entry.occurredAt, `${entry.occurrenceId} occurrence`)) {
        throw new Error(`Historical entry ${entry.occurrenceId} has an impossible causal parent.`);
      }
      if (instant(parentTime, `${parentId} parent`) === instant(entry.occurredAt, `${entry.occurrenceId} occurrence`)) {
        const parentEntry = actual.find((candidate) => candidate.occurrenceId === parentId);
        if (parentEntry !== undefined &&
          (recordKindPhase[parentEntry.recordKind] ?? 99) > (recordKindPhase[entry.recordKind] ?? -1)) {
          throw new Error(`Historical entry ${entry.occurrenceId} violates fixed same-instant phases.`);
        }
      }
    }
  }
};

const beginOperation = (
  state: PresidentialInterventionState,
  administration: PresidentialAdministrationConfiguration,
  intervention: PresidentialInterventionConfiguration,
  epoch: string,
  current: string,
): void => assertPresidentialInterventionOwnerStates(
  state,
  administration,
  intervention,
  epoch,
  current,
);

const finishOperation = (
  state: PresidentialInterventionState,
  administration: PresidentialAdministrationConfiguration,
  intervention: PresidentialInterventionConfiguration,
  epoch: string,
  current: string,
): PresidentialInterventionState => {
  assertPresidentialInterventionOwnerStates(
    state,
    administration,
    intervention,
    epoch,
    current,
  );
  return state;
};

const ensureNewRecord = <T extends { readonly id: string; readonly deduplicationIdentity: string }>(
  values: readonly T[],
  candidate: T,
  field: string,
): "CREATE" | "IDEMPOTENT" => {
  const byId = values.find((entry) => entry.id === candidate.id);
  const byDedupe = values.find((entry) =>
    entry.deduplicationIdentity === candidate.deduplicationIdentity);
  if (byId === undefined && byDedupe === undefined) return "CREATE";
  if (byId !== undefined && byDedupe === byId && sameOrdered([byId], [candidate])) return "IDEMPOTENT";
  throw new Error(`${field} conflicts with an existing identity or deduplication record.`);
};

const replaceOffice = (
  state: PresidentialInterventionState,
  officeId: string,
  update: (office: PresidentialInterventionState["officeOperations"]["state"][number]) =>
    PresidentialInterventionState["officeOperations"]["state"][number],
): PresidentialInterventionState => {
  if (!state.officeOperations.state.some((office) => office.officeId === officeId)) {
    throw new Error(`Unknown recipient office ${officeId}.`);
  }
  return {
    ...state,
    officeOperations: {
      ...state.officeOperations,
      state: state.officeOperations.state.map((office) =>
        office.officeId === officeId ? update(office) : office),
    },
  };
};

export interface CreateAdministrationWorkstreamInput {
  readonly id: string;
  readonly initialTransitionId: string;
  readonly initialTransitionDeduplicationIdentity: string;
  readonly creatingOfficeId: string;
  readonly creatingOfficeholderAssignmentId: string;
  readonly standingAuthorityId: string;
  readonly initialSourceReferenceIds: readonly string[];
  readonly initialReviewAt: string;
  readonly reason: string;
  readonly provenanceReference: string;
}

export const createAdministrationWorkstream = (
  state: PresidentialInterventionState,
  administration: PresidentialAdministrationConfiguration,
  intervention: PresidentialInterventionConfiguration,
  epoch: string,
  current: string,
  input: CreateAdministrationWorkstreamInput,
): PresidentialInterventionState => {
  beginOperation(state, administration, intervention, epoch, current);
  const definition = intervention.workstreamDefinition;
  if (input.id !== definition.id) throw new Error("POP0-I3 permits only its configured bounded workstream.");
  if (state.administrationWorkstreams.state.workstreams.some((entry) => entry.id === input.id)) {
    const existingTransition = state.administrationWorkstreams.state.transitions.find(
      (entry) => entry.id === input.initialTransitionId &&
        entry.deduplicationIdentity === input.initialTransitionDeduplicationIdentity,
    );
    if (existingTransition !== undefined) return state;
    throw new Error(`Workstream ${input.id} already exists with different creation evidence.`);
  }
  assertEffectiveOfficeholder(
    state,
    input.creatingOfficeholderAssignmentId,
    input.creatingOfficeId,
    current,
  );
  const authority = intervention.standingCoordinationAuthorities.find((candidate) =>
    candidate.id === input.standingAuthorityId &&
    candidate.officeId === input.creatingOfficeId &&
    candidate.permittedWorkstreamIds.includes(input.id) &&
    candidate.permittedStatuses.includes("MONITORED") &&
    isEffectiveAt(candidate.effectiveFrom, candidate.effectiveUntil, current));
  if (authority === undefined || input.creatingOfficeId !== definition.coordinatorOfficeId) {
    throw new Error(`Workstream ${input.id} lacks effective standing coordination authority.`);
  }
  requireNonemptyUnique(input.initialSourceReferenceIds, `${input.id} initial sources`);
  for (const sourceId of input.initialSourceReferenceIds) {
    const sourceTime = sourceOccurrenceTime(state, sourceId);
    if (sourceTime === null || instant(sourceTime, `${sourceId} source`) > instant(current, "Current time")) {
      throw new Error(`Workstream ${input.id} has an unavailable initial source.`);
    }
  }
  if (instant(input.initialReviewAt, `${input.id} review`) <= instant(current, "Current time")) {
    throw new Error(`Workstream ${input.id} review must be future.`);
  }
  requireNonempty(input.reason, `${input.initialTransitionId} reason`);
  requireNonempty(input.provenanceReference, `${input.id} provenance`);
  const workstream: AdministrationWorkstreamRecord = {
    id: input.id,
    label: definition.label,
    adoptedObjective: definition.adoptedObjective,
    creatingOfficeId: input.creatingOfficeId,
    creatingOfficeholderAssignmentId: input.creatingOfficeholderAssignmentId,
    authorityReference: authority.id,
    coordinatorOfficeId: definition.coordinatorOfficeId,
    participatingOfficeIds: [...definition.participatingOfficeIds],
    createdAt: current,
    provenanceReference: input.provenanceReference,
    initialSourceReferenceIds: [...input.initialSourceReferenceIds],
    initialReviewAt: input.initialReviewAt,
  };
  const transition: AdministrationWorkstreamTransition = {
    id: input.initialTransitionId,
    deduplicationIdentity: input.initialTransitionDeduplicationIdentity,
    workstreamId: input.id,
    priorTransitionId: null,
    status: "MONITORED",
    actingOfficeId: input.creatingOfficeId,
    actingOfficeholderAssignmentId: input.creatingOfficeholderAssignmentId,
    sourceOccurrenceIds: [...input.initialSourceReferenceIds],
    occurredAt: current,
    reason: input.reason,
    provenanceReference: input.provenanceReference,
  };
  let next: PresidentialInterventionState = {
    ...state,
    administrationWorkstreams: {
      ...state.administrationWorkstreams,
      state: {
        workstreams: [workstream],
        transitions: [transition],
      },
    },
  };
  next = appendIndexEntries(next, [
    indexEntry(
      intervention,
      workstream.id,
      intervention.ownerIds.administrationWorkstreams,
      "WORKSTREAM_CREATED",
      current,
      workstream.initialSourceReferenceIds,
    ),
    indexEntry(
      intervention,
      transition.id,
      intervention.ownerIds.administrationWorkstreams,
      "WORKSTREAM_TRANSITION",
      current,
      [workstream.id, ...transition.sourceOccurrenceIds],
    ),
  ]);
  return finishOperation(next, administration, intervention, epoch, current);
};

export interface TransitionAdministrationWorkstreamInput {
  readonly id: string;
  readonly deduplicationIdentity: string;
  readonly workstreamId: string;
  readonly priorTransitionId: string;
  readonly status: AdministrationWorkstreamStatus;
  readonly actingOfficeId: string;
  readonly actingOfficeholderAssignmentId: string;
  readonly sourceOccurrenceIds: readonly string[];
  readonly reason: string;
  readonly provenanceReference: string;
}

export const transitionAdministrationWorkstream = (
  state: PresidentialInterventionState,
  administration: PresidentialAdministrationConfiguration,
  intervention: PresidentialInterventionConfiguration,
  epoch: string,
  current: string,
  input: TransitionAdministrationWorkstreamInput,
): PresidentialInterventionState => {
  beginOperation(state, administration, intervention, epoch, current);
  const workstream = state.administrationWorkstreams.state.workstreams.find(
    (entry) => entry.id === input.workstreamId,
  );
  if (workstream === undefined) throw new Error(`Unknown workstream ${input.workstreamId}.`);
  const transitions = state.administrationWorkstreams.state.transitions.filter(
    (entry) => entry.workstreamId === workstream.id,
  );
  const latest = transitions[transitions.length - 1];
  if (latest?.id !== input.priorTransitionId) {
    throw new Error(`Workstream ${workstream.id} transition must cite its latest prior transition.`);
  }
  assertEffectiveOfficeholder(
    state,
    input.actingOfficeholderAssignmentId,
    input.actingOfficeId,
    current,
  );
  const authority = intervention.standingCoordinationAuthorities.find((candidate) =>
    candidate.officeId === input.actingOfficeId &&
    candidate.permittedWorkstreamIds.includes(input.workstreamId) &&
    candidate.permittedStatuses.includes(input.status) &&
    isEffectiveAt(candidate.effectiveFrom, candidate.effectiveUntil, current));
  if (authority === undefined || input.actingOfficeId !== workstream.coordinatorOfficeId) {
    throw new Error(`Workstream ${workstream.id} transition lacks coordinator authority.`);
  }
  if (["COMPLETED", "ABANDONED"].includes(latest.status)) {
    throw new Error(`Terminal workstream ${workstream.id} cannot transition again.`);
  }
  requireUnique(input.sourceOccurrenceIds, `${input.id} source occurrences`);
  for (const sourceId of input.sourceOccurrenceIds) {
    const sourceTime = sourceOccurrenceTime(state, sourceId);
    if (sourceTime === null || instant(sourceTime, `${sourceId} source`) > instant(current, "Current time")) {
      throw new Error(`Workstream transition ${input.id} cites an unavailable source.`);
    }
  }
  requireNonempty(input.reason, `${input.id} reason`);
  requireNonempty(input.provenanceReference, `${input.id} provenance`);
  const transition: AdministrationWorkstreamTransition = {
    ...input,
    sourceOccurrenceIds: [...input.sourceOccurrenceIds],
    occurredAt: current,
  };
  const disposition = ensureNewRecord(
    state.administrationWorkstreams.state.transitions,
    transition,
    `Workstream transition ${input.id}`,
  );
  if (disposition === "IDEMPOTENT") return state;
  let next: PresidentialInterventionState = {
    ...state,
    administrationWorkstreams: {
      ...state.administrationWorkstreams,
      state: {
        ...state.administrationWorkstreams.state,
        transitions: sortedByTimeAndId(
          [...state.administrationWorkstreams.state.transitions, transition],
          (entry) => entry.occurredAt,
          (entry) => entry.id,
        ),
      },
    },
  };
  next = appendIndexEntries(next, [indexEntry(
    intervention,
    transition.id,
    intervention.ownerIds.administrationWorkstreams,
    "WORKSTREAM_TRANSITION",
    current,
    [transition.workstreamId,
      ...(transition.priorTransitionId === null ? [] : [transition.priorTransitionId]),
      ...transition.sourceOccurrenceIds],
  )]);
  return finishOperation(next, administration, intervention, epoch, current);
};

export type CreatePresidentialEscalationInput = Omit<
  PresidentialEscalationRecord,
  "createdAt"
>;

export const createPresidentialEscalation = (
  state: PresidentialInterventionState,
  administration: PresidentialAdministrationConfiguration,
  intervention: PresidentialInterventionConfiguration,
  epoch: string,
  current: string,
  input: CreatePresidentialEscalationInput,
): PresidentialInterventionState => {
  beginOperation(state, administration, intervention, epoch, current);
  const escalation: PresidentialEscalationRecord = copyPlain({ ...input, createdAt: current });
  const disposition = ensureNewRecord(
    state.presidentialEscalations.state.escalations,
    escalation,
    `Escalation ${input.id}`,
  );
  if (disposition === "IDEMPOTENT") return state;
  const provisional: PresidentialInterventionState = {
    ...state,
    presidentialEscalations: {
      ...state.presidentialEscalations,
      state: {
        ...state.presidentialEscalations.state,
        escalations: sortedByTimeAndId(
          [...state.presidentialEscalations.state.escalations, escalation],
          (entry) => entry.createdAt,
          (entry) => entry.id,
        ),
      },
    },
  };
  assertEscalationRecord(escalation, provisional, administration, intervention, current);
  let next = appendIndexEntries(provisional, [indexEntry(
    intervention,
    escalation.id,
    intervention.ownerIds.presidentialEscalations,
    "ESCALATION_CREATED",
    current,
    escalation.sourceRecordIds,
  )]);
  next = finishOperation(next, administration, intervention, epoch, current);
  return next;
};

export interface RecordEscalationPresentationInput {
  readonly id: string;
  readonly deduplicationIdentity: string;
  readonly sourceEscalationId: string;
  readonly presentingOfficeId: string;
  readonly presenterOfficeholderAssignmentId: string;
  readonly shownSectionIds: readonly string[];
  readonly referencedButNotShownSourcePortions: readonly StaffOnlySourcePortion[];
  readonly purpose: string;
  readonly provenanceReference: string;
}

export const recordEscalationPresentation = (
  state: PresidentialInterventionState,
  administration: PresidentialAdministrationConfiguration,
  intervention: PresidentialInterventionConfiguration,
  epoch: string,
  current: string,
  input: RecordEscalationPresentationInput,
): PresidentialInterventionState => {
  beginOperation(state, administration, intervention, epoch, current);
  const escalation = state.presidentialEscalations.state.escalations.find(
    (entry) => entry.id === input.sourceEscalationId,
  );
  if (escalation === undefined || deriveEscalationStatus(state, escalation.id) !== "ACTIVE") {
    throw new Error(`Escalation ${input.sourceEscalationId} is unavailable for presentation.`);
  }
  if (instant(current, "Presentation time") >= instant(escalation.expiresAt, `${escalation.id} expiration`)) {
    throw new Error(`Escalation ${escalation.id} cannot be presented at/after expiration.`);
  }
  assertEffectiveOfficeholder(
    state,
    input.presenterOfficeholderAssignmentId,
    input.presentingOfficeId,
    current,
  );
  if (input.presentingOfficeId !== escalation.escalatingOfficeId ||
    !sameSet(input.shownSectionIds, POP0_I3_ESCALATION_PRESENTATION_SECTION_IDS)) {
    throw new Error(`Escalation presentation ${input.id} lacks exact office/section authority.`);
  }
  requireUnique(
    input.referencedButNotShownSourcePortions.map(
      (portion) => `${portion.artifactId}#${portion.sectionId}`,
    ),
    `${input.id} referenced portions`,
  );
  for (const portion of input.referencedButNotShownSourcePortions) {
    if (!escalation.staffOnlySourcePortions.some((candidate) =>
      candidate.artifactId === portion.artifactId && candidate.sectionId === portion.sectionId) ||
      !officeHasArtifactPortion(state, input.presentingOfficeId, portion, current)) {
      throw new Error(`Escalation presentation ${input.id} references unavailable staff material.`);
    }
  }
  const options = escalation.options;
  const previews = options.flatMap((option) => option.previews)
    .sort((left, right) => left.bundlePosition - right.bundlePosition);
  const binding = state.administrationDirectory.state.presidentialRecipientBinding;
  if (!isEffectiveAt(binding.effectiveFrom, binding.effectiveUntil, current)) {
    throw new Error("Presidential recipient binding is not effective for escalation presentation.");
  }
  requireNonempty(input.purpose, `${input.id} purpose`);
  requireNonempty(input.provenanceReference, `${input.id} provenance`);
  const presentation: EscalationPresentationRecord = {
    id: input.id,
    deduplicationIdentity: input.deduplicationIdentity,
    sourceEscalationId: input.sourceEscalationId,
    recipientBindingId: binding.id,
    recipientActorId: binding.actorId,
    constitutionalOfficeId: binding.constitutionalOfficeId,
    presentingOfficeId: input.presentingOfficeId,
    presenterOfficeholderAssignmentId: input.presenterOfficeholderAssignmentId,
    presentedAt: current,
    shownSectionIds: [...input.shownSectionIds],
    shownOptionIds: options.map((option) => option.id),
    shownPreviewIds: previews.map((preview) => preview.id),
    shownPreviewHashes: previews.map((preview) => preview.payloadHash),
    referencedButNotShownSourcePortions: copyPlain(input.referencedButNotShownSourcePortions),
    purpose: input.purpose,
    provenanceReference: input.provenanceReference,
  };
  const disposition = ensureNewRecord(
    state.presidentialPresentations.state.escalationPresentations,
    presentation,
    `Escalation presentation ${input.id}`,
  );
  if (disposition === "IDEMPOTENT") return state;
  const next: PresidentialInterventionState = {
    ...state,
    presidentialPresentations: {
      ...state.presidentialPresentations,
      state: {
        ...state.presidentialPresentations.state,
        escalationPresentations: sortedByTimeAndId(
          [...state.presidentialPresentations.state.escalationPresentations, presentation],
          (entry) => entry.presentedAt,
          (entry) => entry.id,
        ),
      },
    },
  };
  return finishOperation(next, administration, intervention, epoch, current);
};

const withEscalationLifecycle = (
  state: PresidentialInterventionState,
  administration: PresidentialAdministrationConfiguration,
  intervention: PresidentialInterventionConfiguration,
  epoch: string,
  current: string,
  lifecycle: EscalationLifecycleOccurrence,
): PresidentialInterventionState => {
  const existing = state.presidentialEscalations.state.lifecycleOccurrences;
  const disposition = ensureNewRecord(existing, lifecycle, `Escalation lifecycle ${lifecycle.id}`);
  if (disposition === "IDEMPOTENT") return state;
  if (existing.some((entry) => entry.escalationId === lifecycle.escalationId)) {
    throw new Error(`Escalation ${lifecycle.escalationId} already has terminal lifecycle truth.`);
  }
  let next: PresidentialInterventionState = {
    ...state,
    presidentialEscalations: {
      ...state.presidentialEscalations,
      state: {
        ...state.presidentialEscalations.state,
        lifecycleOccurrences: sortedByTimeAndId(
          [...existing, lifecycle],
          (entry) => entry.occurredAt,
          (entry) => entry.id,
        ),
      },
    },
  };
  next = appendIndexEntries(next, [indexEntry(
    intervention,
    lifecycle.id,
    intervention.ownerIds.presidentialEscalations,
    lifecycle.kind,
    lifecycle.occurredAt,
    [lifecycle.escalationId, lifecycle.causeRecordId],
  )]);
  return finishOperation(next, administration, intervention, epoch, current);
};

export interface RecordEscalationLifecycleInput {
  readonly id: string;
  readonly deduplicationIdentity: string;
  readonly escalationId: string;
  readonly kind: "ESCALATION_WITHDRAWN" | "ESCALATION_SUPERSEDED";
  readonly actingOfficeId: string;
  readonly actingOfficeholderAssignmentId: string;
  readonly causeRecordId: string;
  readonly provenanceReference: string;
}

export const recordEscalationLifecycle = (
  state: PresidentialInterventionState,
  administration: PresidentialAdministrationConfiguration,
  intervention: PresidentialInterventionConfiguration,
  epoch: string,
  current: string,
  input: RecordEscalationLifecycleInput,
): PresidentialInterventionState => {
  beginOperation(state, administration, intervention, epoch, current);
  const escalation = state.presidentialEscalations.state.escalations.find(
    (entry) => entry.id === input.escalationId,
  );
  if (escalation === undefined || deriveEscalationStatus(state, escalation.id) !== "ACTIVE") {
    throw new Error(`Escalation ${input.escalationId} is not active.`);
  }
  assertEffectiveOfficeholder(
    state,
    input.actingOfficeholderAssignmentId,
    input.actingOfficeId,
    current,
  );
  if (input.actingOfficeId !== escalation.escalatingOfficeId) {
    throw new Error(`Office ${input.actingOfficeId} cannot close escalation ${escalation.id}.`);
  }
  if (input.kind === "ESCALATION_SUPERSEDED") {
    const successor = state.presidentialEscalations.state.escalations.find(
      (entry) => entry.id === input.causeRecordId,
    );
    if (successor === undefined || successor.id === escalation.id ||
      instant(successor.createdAt, `${successor.id} creation`) <= instant(escalation.createdAt, `${escalation.id} creation`)) {
      throw new Error(`Escalation ${escalation.id} requires a strictly later successor.`);
    }
  } else requireNonempty(input.causeRecordId, `${input.id} withdrawal cause`);
  return withEscalationLifecycle(
    state,
    administration,
    intervention,
    epoch,
    current,
    { ...input, occurredAt: current },
  );
};

export interface RecordPresidentialDecisionInput {
  readonly id: string;
  readonly deduplicationIdentity: string;
  readonly sourceEscalationId: string;
  readonly selectedOptionId: string;
  readonly basisEscalationPresentationId: string;
  readonly acknowledgedUncertainties: readonly string[];
  readonly provenanceReference: string;
  readonly supersedesDecisionId: string | null;
}

export const recordPresidentialDecision = (
  state: PresidentialInterventionState,
  administration: PresidentialAdministrationConfiguration,
  intervention: PresidentialInterventionConfiguration,
  epoch: string,
  current: string,
  controlBinding: PresidentialControlBindingState,
  input: RecordPresidentialDecisionInput,
): PresidentialInterventionState => {
  beginOperation(state, administration, intervention, epoch, current);
  assertControlBindingRecord(controlBinding, intervention, state, current);
  if (controlBinding.status !== "ACTIVE") {
    throw new Error("No active presidential ControlBinding for decision.");
  }
  const populationLinkage = administration.populationLinkages.find(
    (entry) => entry.actorId === controlBinding.boundOfficeholderActorId,
  );
  if (
    populationLinkage === undefined || populationLinkage.populationWeight !== 0 ||
    populationLinkage.status !== "OUTSIDE_MODELED_ORDINARY_POPULATION_SCOPE" ||
    !isEffectiveAt(populationLinkage.effectiveFrom, populationLinkage.effectiveUntil, current)
  ) throw new Error("Presidential decision cannot infer an ordinary-Population identity.");
  const escalation = state.presidentialEscalations.state.escalations.find(
    (entry) => entry.id === input.sourceEscalationId,
  );
  if (escalation === undefined || deriveEscalationStatus(state, escalation.id) !== "ACTIVE") {
    throw new Error(`Escalation ${input.sourceEscalationId} is not active for decision.`);
  }
  if (instant(current, "Decision time") >= instant(escalation.expiresAt, `${escalation.id} expiration`)) {
    throw new Error(`Escalation ${escalation.id} has reached its deadline.`);
  }
  const presentation = state.presidentialPresentations.state.escalationPresentations.find(
    (entry) => entry.id === input.basisEscalationPresentationId &&
      entry.sourceEscalationId === escalation.id,
  );
  if (presentation === undefined || !sameSet(
    presentation.shownSectionIds,
    POP0_I3_ESCALATION_PRESENTATION_SECTION_IDS,
  )) throw new Error(`Decision ${input.id} lacks a complete bounded escalation presentation.`);
  const option = escalation.options.find((entry) => entry.id === input.selectedOptionId);
  if (option === undefined) throw new Error(`Decision ${input.id} selects an unknown local option.`);
  if (!sameSet(input.acknowledgedUncertainties, escalation.uncertainties)) {
    throw new Error(`Decision ${input.id} must acknowledge the presented uncertainty exactly.`);
  }
  const previews = [...option.previews].sort(
    (left, right) => left.bundlePosition - right.bundlePosition,
  );
  const allPresentedPreviews = escalation.options.flatMap((candidate) => candidate.previews)
    .sort((left, right) => left.bundlePosition - right.bundlePosition);
  if (
    !sameOrdered(presentation.shownOptionIds, escalation.options.map((entry) => entry.id)) ||
    !sameOrdered(presentation.shownPreviewIds, allPresentedPreviews.map((entry) => entry.id)) ||
    !sameOrdered(presentation.shownPreviewHashes, allPresentedPreviews.map((entry) => entry.payloadHash))
  ) throw new Error(`Decision ${input.id} does not match the presented preview bundle.`);
  for (const preview of previews) {
    assertPreview(preview, state, administration, escalation.escalatingOfficeId, current);
    for (const attachment of preview.payload.attachmentMetadata) {
      const shown = attachment.sectionIds.every((sectionId) =>
        escalation.presidentKnownPortions.some((portion) =>
          portion.artifactId === attachment.artifactId && portion.sectionId === sectionId));
      if (attachment.shownToPresident !== shown) {
        throw new Error(`Decision ${input.id} has inaccurate attachment-knowledge metadata.`);
      }
    }
  }
  requireNonempty(input.provenanceReference, `${input.id} provenance`);
  const instrumentRecords: PresidentialInstrumentRecord[] = previews.map((preview, index) => ({
    id: `${input.id}.instrument.${String(index + 1)}`,
    deduplicationIdentity: `${input.deduplicationIdentity}.instrument.${String(index + 1)}`,
    authorizingDecisionId: input.id,
    selectedOptionId: option.id,
    sourcePreviewId: preview.id,
    sourcePreviewHash: preview.payloadHash,
    issuingPresidentActorId: controlBinding.boundOfficeholderActorId,
    issuingConstitutionalOfficeId: controlBinding.executiveOfficeId,
    issuedAt: current,
    provenanceReference: input.provenanceReference,
    revisionOfInstrumentId: null,
    supersedesInstrumentId: null,
    payload: canonicalPresidentialInstrumentPayload(preview.payload),
  }));
  const reservedReviewId = option.kind === "RESERVE_PRESIDENTIAL_REVIEW"
    ? `${input.id}.reserved-review`
    : null;
  const decision: PresidentialDecisionRecord = {
    id: input.id,
    deduplicationIdentity: input.deduplicationIdentity,
    controlBindingId: controlBinding.id,
    presidentActorId: controlBinding.boundOfficeholderActorId,
    constitutionalOfficeId: controlBinding.executiveOfficeId,
    sourceEscalationId: escalation.id,
    selectedOptionId: option.id,
    selectedOptionKind: option.kind,
    previewIds: previews.map((preview) => preview.id),
    previewHashes: previews.map((preview) => preview.payloadHash),
    decidedAt: current,
    basisEscalationPresentationId: presentation.id,
    acknowledgedUncertainties: [...input.acknowledgedUncertainties],
    authorizedInstrumentIds: instrumentRecords.map((instrument) => instrument.id),
    reservedReviewId,
    deliberateDefaultRuleReference: option.kind === "ALLOW_MONITORING_DEFAULT"
      ? `${escalation.id}#default`
      : null,
    provenanceReference: input.provenanceReference,
    supersedesDecisionId: input.supersedesDecisionId,
  };
  const recordDisposition = ensureNewRecord(
    state.presidentialDecisions.state,
    decision,
    `Presidential decision ${input.id}`,
  );
  if (recordDisposition === "IDEMPOTENT") return state;
  if (state.presidentialDecisions.state.some((entry) => entry.sourceEscalationId === escalation.id)) {
    throw new Error(`Escalation ${escalation.id} already has a controlling decision.`);
  }
  const lifecycle: EscalationLifecycleOccurrence = {
    id: `${input.id}.resolution`,
    deduplicationIdentity: `${input.deduplicationIdentity}.resolution`,
    escalationId: escalation.id,
    kind: "ESCALATION_RESOLVED_BY_DECISION",
    occurredAt: current,
    actingOfficeId: null,
    actingOfficeholderAssignmentId: null,
    causeRecordId: decision.id,
    provenanceReference: input.provenanceReference,
  };
  let next: PresidentialInterventionState = {
    ...state,
    presidentialDecisions: {
      ...state.presidentialDecisions,
      state: sortedByTimeAndId(
        [...state.presidentialDecisions.state, decision],
        (entry) => entry.decidedAt,
        (entry) => entry.id,
      ),
    },
    presidentialInstruments: {
      ...state.presidentialInstruments,
      state: sortedByTimeAndId(
        [...state.presidentialInstruments.state, ...instrumentRecords],
        (entry) => entry.issuedAt,
        (entry) => entry.id,
      ),
    },
    presidentialEscalations: {
      ...state.presidentialEscalations,
      state: {
        ...state.presidentialEscalations.state,
        lifecycleOccurrences: sortedByTimeAndId(
          [...state.presidentialEscalations.state.lifecycleOccurrences, lifecycle],
          (entry) => entry.occurredAt,
          (entry) => entry.id,
        ),
      },
    },
  };
  const newEntries = [
    indexEntry(
      intervention,
      decision.id,
      intervention.ownerIds.presidentialDecisions,
      "PRESIDENTIAL_DECISION",
      current,
      [escalation.id, presentation.id],
    ),
    ...instrumentRecords.map((instrument) => indexEntry(
      intervention,
      instrument.id,
      intervention.ownerIds.presidentialInstruments,
      "PRESIDENTIAL_INSTRUMENT",
      current,
      [decision.id],
    )),
    indexEntry(
      intervention,
      lifecycle.id,
      intervention.ownerIds.presidentialEscalations,
      lifecycle.kind,
      current,
      [escalation.id, decision.id],
    ),
  ];
  if (option.kind === "RESERVE_PRESIDENTIAL_REVIEW" && reservedReviewId !== null) {
    const review: ReservedPresidentialReviewRecord = {
      id: reservedReviewId,
      deduplicationIdentity: `${input.deduplicationIdentity}.reserved-review`,
      sourceEscalationId: escalation.id,
      sourceDecisionId: decision.id,
      reservedAt: option.reservedAt,
      reviewQuestion: option.reviewQuestion,
      priorPresentationIds: [presentation.id],
      expectedSourceReferenceIds: [...option.expectedSourceReferenceIds],
      provenanceReference: input.provenanceReference,
    };
    next = {
      ...next,
      presidentialEscalations: {
        ...next.presidentialEscalations,
        state: {
          ...next.presidentialEscalations.state,
          reservedReviews: [...next.presidentialEscalations.state.reservedReviews, review],
        },
      },
    };
    newEntries.push(indexEntry(
      intervention,
      review.id,
      intervention.ownerIds.presidentialEscalations,
      "RESERVED_REVIEW_CREATED",
      current,
      [escalation.id, decision.id],
    ));
  }
  next = appendIndexEntries(next, newEntries);
  return finishOperation(next, administration, intervention, epoch, current);
};

export interface AttemptInstrumentDispatchInput {
  readonly id: string;
  readonly deduplicationIdentity: string;
  readonly instrumentId: string;
  readonly dispatchingOfficeId: string;
  readonly dispatchPath: string;
  readonly outcome: InstrumentDispatchOutcome;
  readonly failureReason: string | null;
  readonly outcomeProvenanceReference: string;
  readonly retryOfDispatchId: string | null;
}

export const attemptInstrumentDispatch = (
  state: PresidentialInterventionState,
  administration: PresidentialAdministrationConfiguration,
  intervention: PresidentialInterventionConfiguration,
  epoch: string,
  current: string,
  input: AttemptInstrumentDispatchInput,
): PresidentialInterventionState => {
  beginOperation(state, administration, intervention, epoch, current);
  const instrument = state.presidentialInstruments.state.find(
    (entry) => entry.id === input.instrumentId,
  );
  if (instrument === undefined) throw new Error(`Unknown presidential instrument ${input.instrumentId}.`);
  if (!administration.offices.some((office) => office.id === input.dispatchingOfficeId)) {
    throw new Error(`Unknown dispatching office ${input.dispatchingOfficeId}.`);
  }
  requireNonempty(input.dispatchPath, `${input.id} dispatch path`);
  requireNonempty(input.outcomeProvenanceReference, `${input.id} outcome provenance`);
  if (input.outcome === "DELIVERED_TO_OFFICE_BOUNDARY") {
    if (input.failureReason !== null) throw new Error(`Delivered dispatch ${input.id} cannot carry failure.`);
  } else {
    if (input.failureReason === null) throw new Error(`Failed dispatch ${input.id} requires a reason.`);
    requireNonempty(input.failureReason, `${input.id} failure reason`);
  }
  if (input.retryOfDispatchId !== null) {
    const prior = state.instrumentDispatches.state.find(
      (entry) => entry.id === input.retryOfDispatchId,
    );
    if (prior === undefined || prior.instrumentId !== instrument.id ||
      prior.outcome === "DELIVERED_TO_OFFICE_BOUNDARY" ||
      instant(prior.attemptedAt, `${prior.id} attempt`) >= instant(current, "Current time")) {
      throw new Error(`Dispatch ${input.id} has invalid retry lineage.`);
    }
  }
  const dispatch: InstrumentDispatchRecord = {
    ...input,
    recipientOfficeId: instrument.payload.recipientOfficeId,
    attemptedAt: current,
    deliveredAt: input.outcome === "DELIVERED_TO_OFFICE_BOUNDARY" ? current : null,
  };
  const disposition = ensureNewRecord(
    state.instrumentDispatches.state,
    dispatch,
    `Instrument dispatch ${input.id}`,
  );
  if (disposition === "IDEMPOTENT") return state;
  let next: PresidentialInterventionState = {
    ...state,
    instrumentDispatches: {
      ...state.instrumentDispatches,
      state: sortedByTimeAndId(
        [...state.instrumentDispatches.state, dispatch],
        (entry) => entry.attemptedAt,
        (entry) => entry.id,
      ),
    },
  };
  next = appendIndexEntries(next, [indexEntry(
    intervention,
    dispatch.id,
    intervention.ownerIds.instrumentDispatches,
    "INSTRUMENT_DISPATCH",
    current,
    [instrument.id, ...(dispatch.retryOfDispatchId === null ? [] : [dispatch.retryOfDispatchId])],
  )]);
  return finishOperation(next, administration, intervention, epoch, current);
};

export interface AdmitOfficeInstrumentReceiptInput {
  readonly id: string;
  readonly deduplicationIdentity: string;
  readonly instrumentId: string;
  readonly successfulDispatchId: string;
  readonly recipientOfficeId: string;
  readonly receiptPath: string;
  readonly receivingAuthorityReference: string;
  readonly provenanceReference: string;
}

export const admitOfficeInstrumentReceipt = (
  state: PresidentialInterventionState,
  administration: PresidentialAdministrationConfiguration,
  intervention: PresidentialInterventionConfiguration,
  epoch: string,
  current: string,
  input: AdmitOfficeInstrumentReceiptInput,
): PresidentialInterventionState => {
  beginOperation(state, administration, intervention, epoch, current);
  const instrument = state.presidentialInstruments.state.find((entry) => entry.id === input.instrumentId);
  const dispatch = state.instrumentDispatches.state.find((entry) => entry.id === input.successfulDispatchId);
  if (
    instrument === undefined || dispatch === undefined ||
    dispatch.instrumentId !== instrument.id ||
    dispatch.outcome !== "DELIVERED_TO_OFFICE_BOUNDARY" || dispatch.deliveredAt === null ||
    input.recipientOfficeId !== instrument.payload.recipientOfficeId ||
    instant(current, "Receipt time") < instant(dispatch.deliveredAt, `${dispatch.id} delivery`)
  ) throw new Error(`Instrument receipt ${input.id} lacks exact successful delivery.`);
  requireNonempty(input.receiptPath, `${input.id} receipt path`);
  requireNonempty(input.receivingAuthorityReference, `${input.id} receiving authority`);
  requireNonempty(input.provenanceReference, `${input.id} provenance`);
  const receipt: OfficeInstrumentReceipt = {
    ...input,
    receivedPayloadVersion: instrument.payload.payloadVersion,
    receivedAt: current,
  };
  const allReceipts = state.officeOperations.state.flatMap((office) => office.instrumentReceipts);
  const disposition = ensureNewRecord(allReceipts, receipt, `Instrument receipt ${input.id}`);
  if (disposition === "IDEMPOTENT") return state;
  if (allReceipts.some((entry) => entry.instrumentId === instrument.id)) {
    throw new Error(`Instrument ${instrument.id} already has an admitted recipient receipt.`);
  }
  let next = replaceOffice(state, input.recipientOfficeId, (office) => ({
    ...office,
    instrumentReceipts: sortedByTimeAndId(
      [...office.instrumentReceipts, receipt],
      (entry) => entry.receivedAt,
      (entry) => entry.id,
    ),
  }));
  next = appendIndexEntries(next, [indexEntry(
    intervention,
    receipt.id,
    state.officeOperations.ownerId,
    "OFFICE_INSTRUMENT_RECEIPT",
    current,
    [instrument.id, dispatch.id],
  )]);
  return finishOperation(next, administration, intervention, epoch, current);
};

export interface RecordRecipientDispositionInput {
  readonly id: string;
  readonly deduplicationIdentity: string;
  readonly recipientOfficeId: string;
  readonly instrumentReceiptId: string;
  readonly authoringOfficeholderAssignmentId: string;
  readonly capabilityAuthorityId: string | null;
  readonly kind: Exclude<RecipientDispositionKind, "NO_ACTION_BY_DEADLINE">;
  readonly acceptedProductKind: string | null;
  readonly acceptedSectionIds: readonly string[];
  readonly acceptedCoordinationActions: readonly string[];
  readonly constraintIds: readonly RecipientConstraint[];
  readonly constraintSourceReferenceIds: readonly string[];
  readonly reason: string | null;
  readonly limitations: readonly string[];
  readonly nextReviewAt: string | null;
  readonly provenanceReference: string;
}

const allowedRecipientConstraints: readonly RecipientConstraint[] = [
  "NO_EFFECTIVE_RECIPIENT_CAPABILITY",
  "REQUEST_OUTSIDE_CAPABILITY",
  "MISSING_REQUIRED_EVIDENCE",
  "OFFICE_QUEUE_OR_DEADLINE_CONSTRAINT",
  "EFFECTIVE_AUTHORITY_NOT_YET_AVAILABLE",
];

export const recordRecipientDisposition = (
  state: PresidentialInterventionState,
  administration: PresidentialAdministrationConfiguration,
  intervention: PresidentialInterventionConfiguration,
  epoch: string,
  current: string,
  input: RecordRecipientDispositionInput,
): PresidentialInterventionState => {
  beginOperation(state, administration, intervention, epoch, current);
  const office = state.officeOperations.state.find((entry) => entry.officeId === input.recipientOfficeId);
  const receipt = office?.instrumentReceipts.find((entry) => entry.id === input.instrumentReceiptId);
  const instrument = receipt === undefined ? undefined : state.presidentialInstruments.state.find(
    (entry) => entry.id === receipt.instrumentId,
  );
  if (office === undefined || receipt === undefined || instrument === undefined) {
    throw new Error(`Recipient disposition ${input.id} lacks exact office receipt.`);
  }
  if (instant(current, "Disposition time") >=
    instant(instrument.payload.requestedResponseDeadline, `${instrument.id} response deadline`)) {
    throw new Error(`Recipient disposition ${input.id} is at/after its deadline.`);
  }
  assertEffectiveOfficeholder(
    state,
    input.authoringOfficeholderAssignmentId,
    input.recipientOfficeId,
    current,
  );
  requireUnique(input.acceptedSectionIds, `${input.id} accepted sections`);
  requireUnique(input.acceptedCoordinationActions, `${input.id} accepted coordination actions`);
  requireUnique(input.constraintIds, `${input.id} constraints`);
  requireUnique(input.constraintSourceReferenceIds, `${input.id} constraint sources`);
  if (input.constraintIds.some((constraint) => !allowedRecipientConstraints.includes(constraint))) {
    throw new Error(`Recipient disposition ${input.id} has an unsupported typed constraint.`);
  }
  const capability = input.capabilityAuthorityId === null ? undefined :
    administration.recipientCapabilities.find((entry) => entry.id === input.capabilityAuthorityId);
  const capabilityFits = capability !== undefined && recipientCapabilityFitsInstrument(
    capability,
    instrument.payload,
    instrument.issuedAt,
    current,
  );
  if (["ACCEPTED_AS_REQUESTED", "NARROWED"].includes(input.kind) && !capabilityFits) {
    throw new Error(`Recipient disposition ${input.id} lacks an effective matching capability.`);
  }
  assertRecipientConstraintSupport(
    state,
    administration,
    input.recipientOfficeId,
    instrument,
    capability,
    input.kind,
    input.constraintIds,
    input.constraintSourceReferenceIds,
    current,
    input.nextReviewAt,
  );
  if (input.kind === "DELAYED") {
    if (input.nextReviewAt === null || input.constraintIds.length === 0 ||
      instant(input.nextReviewAt, `${input.id} next review`) <= instant(current, "Disposition time")) {
      throw new Error(`Delayed disposition ${input.id} lacks a future typed constraint.`);
    }
  }
  if (input.kind === "REFUSED") {
    if (input.reason === null || input.constraintIds.length === 0) {
      throw new Error(`Refused disposition ${input.id} requires typed reason/constraints.`);
    }
  }
  requireNonempty(input.provenanceReference, `${input.id} provenance`);
  const dispositionRecord: RecipientInstrumentDisposition = {
    ...copyPlain(input),
    instrumentId: instrument.id,
    dispositionAt: current,
  };
  const allDispositions = state.officeOperations.state.flatMap((entry) => entry.instrumentDispositions);
  const recordDisposition = ensureNewRecord(
    allDispositions,
    dispositionRecord,
    `Recipient disposition ${input.id}`,
  );
  if (recordDisposition === "IDEMPOTENT") return state;
  if (allDispositions.some((entry) => entry.instrumentReceiptId === receipt.id)) {
    throw new Error(`Instrument receipt ${receipt.id} already has a controlling disposition.`);
  }
  let next = replaceOffice(state, input.recipientOfficeId, (candidate) => ({
    ...candidate,
    instrumentDispositions: sortedByTimeAndId(
      [...candidate.instrumentDispositions, dispositionRecord],
      (entry) => entry.dispositionAt,
      (entry) => entry.id,
    ),
  }));
  next = appendIndexEntries(next, [indexEntry(
    intervention,
    dispositionRecord.id,
    state.officeOperations.ownerId,
    "RECIPIENT_DISPOSITION",
    current,
    [receipt.id],
  )]);
  return finishOperation(next, administration, intervention, epoch, current);
};

export interface CreateInstrumentAuthorizedAssignmentInput extends CreateOfficeWorkAssignmentInput {
  readonly dispositionId: string;
  readonly authorizationScope: InstrumentAssignmentAuthorizationScope;
}

export const createInstrumentAuthorizedAssignment = (
  state: PresidentialInterventionState,
  administration: PresidentialAdministrationConfiguration,
  intervention: PresidentialInterventionConfiguration,
  epoch: string,
  current: string,
  input: CreateInstrumentAuthorizedAssignmentInput,
): PresidentialInterventionState => {
  beginOperation(state, administration, intervention, epoch, current);
  const office = state.officeOperations.state.find((entry) => entry.officeId === input.leadOfficeId);
  const disposition = office?.instrumentDispositions.find((entry) => entry.id === input.dispositionId);
  if (office === undefined || disposition === undefined ||
    !["ACCEPTED_AS_REQUESTED", "NARROWED"].includes(disposition.kind)) {
    throw new Error(`Assignment ${input.id} lacks an accepting recipient disposition.`);
  }
  const instrument = state.presidentialInstruments.state.find(
    (entry) => entry.id === disposition.instrumentId,
  );
  if (instrument === undefined) throw new Error(`Assignment ${input.id} lacks its source instrument.`);
  if (
    input.authorityReference !== disposition.id ||
    !input.sourceReferenceIds.includes(disposition.id) ||
    input.leadOfficeId !== disposition.recipientOfficeId
  ) throw new Error(`Assignment ${input.id} exceeds its recipient-owned disposition.`);
  if (disposition.nextReviewAt !== null &&
    instant(input.deadline, `${input.id} deadline`) > instant(disposition.nextReviewAt, `${disposition.id} review`)) {
    throw new Error(`Assignment ${input.id} exceeds disposition timing.`);
  }
  const assignmentInput: CreateOfficeWorkAssignmentInput = {
    id: input.id,
    requesterId: input.requesterId,
    leadOfficeId: input.leadOfficeId,
    objective: input.objective,
    sourceReferenceIds: [...input.sourceReferenceIds],
    requiredConsultationOfficeIds: [...input.requiredConsultationOfficeIds],
    authorityReference: input.authorityReference,
    deadline: input.deadline,
    expectedProductKind: input.expectedProductKind,
  };
  const authorization: InstrumentAssignmentAuthorizationBinding = {
    assignmentId: input.id,
    dispositionId: disposition.id,
    instrumentId: instrument.id,
    recipientOfficeId: disposition.recipientOfficeId,
    authorizedDeadline: input.deadline,
    scope: copyPlain(input.authorizationScope),
    boundAt: current,
  };
  assertInstrumentAssignmentAuthorization(
    state,
    input.leadOfficeId,
    {
      ...assignmentInput,
      createdAt: current,
      status: "QUEUED",
      statusUpdatedAt: current,
      failureReason: null,
      statusProvenanceReferenceId: null,
      resultArtifactIds: [],
      supersededByAssignmentId: null,
    },
    disposition,
    instrument,
    authorization,
  );
  let administrationNext = createOfficeWorkAssignment(
    state,
    administration,
    epoch,
    current,
    assignmentInput,
  );
  const payload = instrument.payload;
  if (payload.kind === "REQUEST_OFFICE_ANALYSIS" &&
    disposition.kind === "ACCEPTED_AS_REQUESTED") {
    const hasSubstantiveScope = state.informationRoutes.state.receipts.some((receipt) =>
      receipt.recipientOfficeId === disposition.recipientOfficeId &&
      receipt.artifactId === payload.evidenceArtifactId &&
      payload.evidenceSectionIds.every((sectionId) =>
        receipt.receivedSectionIds.includes(sectionId)));
    if (!hasSubstantiveScope) {
      administrationNext = transitionOfficeWorkAssignment(
        administrationNext,
        administration,
        epoch,
        current,
        {
          officeId: input.leadOfficeId,
          assignmentId: input.id,
          status: "BLOCKED",
          reason: "Required substantive evidence has not been received by the recipient office.",
          statusProvenanceReferenceId: disposition.id,
          resultArtifactIds: [],
          supersededByAssignmentId: null,
        },
      );
    }
  }
  let next: PresidentialInterventionState = {
    ...state,
    ...administrationNext,
  };
  next = replaceOffice(next, input.leadOfficeId, (candidate) => {
    const existing = candidate.instrumentAssignmentAuthorizations.find(
      (entry) => entry.assignmentId === input.id,
    );
    if (existing !== undefined) {
      if (!sameOrdered([existing], [authorization])) {
        throw new Error(`Instrument assignment authority ${input.id} conflicts with an existing record.`);
      }
      return candidate;
    }
    return {
      ...candidate,
      instrumentAssignmentAuthorizations: [...candidate.instrumentAssignmentAuthorizations, authorization]
        .sort((left, right) => left.boundAt.localeCompare(right.boundAt) ||
          left.assignmentId.localeCompare(right.assignmentId)),
    };
  });
  next = appendIndexEntries(next, [indexEntry(
    intervention,
    input.id,
    state.officeOperations.ownerId,
    "INSTRUMENT_AUTHORIZED_OFFICE_ASSIGNMENT",
    current,
    [disposition.id],
  )]);
  return finishOperation(next, administration, intervention, epoch, current);
};

export interface RecordReservedReviewLifecycleInput {
  readonly id: string;
  readonly deduplicationIdentity: string;
  readonly reservationId: string;
  readonly kind: ReservedReviewLifecycleKind;
  readonly actingOfficeId: string;
  readonly actingOfficeholderAssignmentId: string;
  readonly causeRecordId: string;
  readonly provenanceReference: string;
}

export const recordReservedReviewLifecycle = (
  state: PresidentialInterventionState,
  administration: PresidentialAdministrationConfiguration,
  intervention: PresidentialInterventionConfiguration,
  epoch: string,
  current: string,
  input: RecordReservedReviewLifecycleInput,
): PresidentialInterventionState => {
  beginOperation(state, administration, intervention, epoch, current);
  const review = state.presidentialEscalations.state.reservedReviews.find(
    (entry) => entry.id === input.reservationId,
  );
  if (review === undefined || state.presidentialEscalations.state.reservedReviewLifecycleOccurrences.some(
    (entry) => entry.reservationId === review.id,
  )) throw new Error(`Reserved review ${input.reservationId} is unavailable for lifecycle transition.`);
  assertEffectiveOfficeholder(
    state,
    input.actingOfficeholderAssignmentId,
    input.actingOfficeId,
    current,
  );
  const decision = state.presidentialDecisions.state.find((entry) => entry.id === review.sourceDecisionId);
  const escalation = decision === undefined ? undefined : state.presidentialEscalations.state.escalations.find(
    (entry) => entry.id === decision.sourceEscalationId,
  );
  if (escalation === undefined || input.actingOfficeId !== escalation.escalatingOfficeId) {
    throw new Error(`Office ${input.actingOfficeId} cannot transition reserved review ${review.id}.`);
  }
  if (input.kind === "RESERVED_REVIEW_SUPERSEDED") {
    const successor = state.presidentialEscalations.state.reservedReviews.find(
      (entry) => entry.id === input.causeRecordId,
    );
    const successorDecision = successor === undefined ? undefined : state.presidentialDecisions.state.find(
      (entry) => entry.id === successor.sourceDecisionId,
    );
    if (successor === undefined || successorDecision === undefined || decision === undefined ||
      instant(successorDecision.decidedAt, `${successorDecision.id} decision`) <=
        instant(decision.decidedAt, `${decision.id} decision`)) {
      throw new Error(`Reserved review ${review.id} lacks a strictly later successor.`);
    }
  } else requireNonempty(input.causeRecordId, `${input.id} cause`);
  const lifecycle: ReservedReviewLifecycleOccurrence = { ...input, occurredAt: current };
  const disposition = ensureNewRecord(
    state.presidentialEscalations.state.reservedReviewLifecycleOccurrences,
    lifecycle,
    `Reserved-review lifecycle ${input.id}`,
  );
  if (disposition === "IDEMPOTENT") return state;
  let next: PresidentialInterventionState = {
    ...state,
    presidentialEscalations: {
      ...state.presidentialEscalations,
      state: {
        ...state.presidentialEscalations.state,
        reservedReviewLifecycleOccurrences: sortedByTimeAndId(
          [...state.presidentialEscalations.state.reservedReviewLifecycleOccurrences, lifecycle],
          (entry) => entry.occurredAt,
          (entry) => entry.id,
        ),
      },
    },
  };
  next = appendIndexEntries(next, [indexEntry(
    intervention,
    lifecycle.id,
    intervention.ownerIds.presidentialEscalations,
    lifecycle.kind,
    current,
    [review.id, lifecycle.causeRecordId],
  )]);
  return finishOperation(next, administration, intervention, epoch, current);
};

interface DynamicI3Boundary {
  readonly at: string;
  readonly phase: 1 | 3 | 4;
  readonly ownerId: string;
  readonly sourceId: string;
  readonly kind: "ESCALATION_DEADLINE" | "RECIPIENT_DEADLINE" | "RESERVED_REVIEW_DUE";
}

const applyEscalationDeadline = (
  state: PresidentialInterventionState,
  intervention: PresidentialInterventionConfiguration,
  escalation: PresidentialEscalationRecord,
): PresidentialInterventionState => {
  if (findActiveEscalationLifecycle(state, escalation.id) !== undefined) return state;
  const occurrence: PresidentialInterventionState["presidentialEscalations"]["state"]["defaultOccurrences"][number] = {
    id: `${escalation.id}.deadline-default`,
    deduplicationIdentity: `${escalation.deduplicationIdentity}.deadline-default`,
    escalationId: escalation.id,
    occurredAt: escalation.expiresAt,
    outcome: "NO_NEW_PRESIDENTIAL_INSTRUMENT_CONTINUE_MONITORING",
    provenanceReference: intervention.provenanceReference,
  };
  const lifecycle: EscalationLifecycleOccurrence = {
    id: `${escalation.id}.deadline-expiration`,
    deduplicationIdentity: `${escalation.deduplicationIdentity}.deadline-expiration`,
    escalationId: escalation.id,
    kind: "ESCALATION_EXPIRED_TO_DEFAULT",
    occurredAt: escalation.expiresAt,
    actingOfficeId: null,
    actingOfficeholderAssignmentId: null,
    causeRecordId: occurrence.id,
    provenanceReference: intervention.provenanceReference,
  };
  let next: PresidentialInterventionState = {
    ...state,
    presidentialEscalations: {
      ...state.presidentialEscalations,
      state: {
        ...state.presidentialEscalations.state,
        defaultOccurrences: sortedByTimeAndId(
          [...state.presidentialEscalations.state.defaultOccurrences, occurrence],
          (entry) => entry.occurredAt,
          (entry) => entry.id,
        ),
        lifecycleOccurrences: sortedByTimeAndId(
          [...state.presidentialEscalations.state.lifecycleOccurrences, lifecycle],
          (entry) => entry.occurredAt,
          (entry) => entry.id,
        ),
      },
    },
  };
  next = appendIndexEntries(next, [
    indexEntry(
      intervention,
      occurrence.id,
      intervention.ownerIds.presidentialEscalations,
      "ESCALATION_DEFAULT",
      occurrence.occurredAt,
      [escalation.id],
    ),
    indexEntry(
      intervention,
      lifecycle.id,
      intervention.ownerIds.presidentialEscalations,
      lifecycle.kind,
      lifecycle.occurredAt,
      [escalation.id, occurrence.id],
    ),
  ]);
  return next;
};

const applyRecipientDeadline = (
  state: PresidentialInterventionState,
  administration: PresidentialAdministrationConfiguration,
  intervention: PresidentialInterventionConfiguration,
  instrument: PresidentialInstrumentRecord,
): PresidentialInterventionState => {
  const office = state.officeOperations.state.find(
    (entry) => entry.officeId === instrument.payload.recipientOfficeId,
  );
  const receipt = office?.instrumentReceipts.find((entry) => entry.instrumentId === instrument.id);
  if (office === undefined || receipt === undefined ||
    instant(receipt.receivedAt, `${receipt.id} receipt`) >=
      instant(instrument.payload.requestedResponseDeadline, `${instrument.id} deadline`) ||
    office.instrumentDispositions.some((entry) => entry.instrumentId === instrument.id)) return state;
  const capability = administration.recipientCapabilities.find((candidate) =>
    recipientCapabilityFitsInstrument(
      candidate,
      instrument.payload,
      instrument.issuedAt,
      instrument.payload.requestedResponseDeadline,
    ));
  const disposition: RecipientInstrumentDisposition = {
    id: `${instrument.id}.deadline-no-action`,
    deduplicationIdentity: `${instrument.deduplicationIdentity}.deadline-no-action`,
    recipientOfficeId: instrument.payload.recipientOfficeId,
    instrumentReceiptId: receipt.id,
    instrumentId: instrument.id,
    authoringOfficeholderAssignmentId: null,
    capabilityAuthorityId: capability?.id ?? null,
    kind: "NO_ACTION_BY_DEADLINE",
    dispositionAt: instrument.payload.requestedResponseDeadline,
    acceptedProductKind: null,
    acceptedSectionIds: [],
    acceptedCoordinationActions: [],
    constraintIds: ["OFFICE_QUEUE_OR_DEADLINE_CONSTRAINT"],
    constraintSourceReferenceIds: [],
    reason: "No recipient-owned disposition was recorded before the end-exclusive response deadline.",
    limitations: [],
    nextReviewAt: null,
    provenanceReference: intervention.provenanceReference,
  };
  let next = replaceOffice(state, office.officeId, (candidate) => ({
    ...candidate,
    instrumentDispositions: sortedByTimeAndId(
      [...candidate.instrumentDispositions, disposition],
      (entry) => entry.dispositionAt,
      (entry) => entry.id,
    ),
  }));
  next = appendIndexEntries(next, [indexEntry(
    intervention,
    disposition.id,
    state.officeOperations.ownerId,
    "RECIPIENT_NO_ACTION_BY_DEADLINE",
    disposition.dispositionAt,
    [receipt.id],
  )]);
  return next;
};

export const advancePresidentialInterventionTime = (
  state: PresidentialInterventionState,
  administration: PresidentialAdministrationConfiguration,
  intervention: PresidentialInterventionConfiguration,
  epoch: string,
  previousCurrent: string,
  target: string,
): PresidentialInterventionState => {
  beginOperation(state, administration, intervention, epoch, previousCurrent);
  const previous = instant(previousCurrent, "Previous I3 time");
  const targetValue = instant(target, "Target I3 time");
  if (targetValue < previous) throw new Error("Presidential intervention time cannot move backwards.");
  const boundaries: DynamicI3Boundary[] = [
    ...state.presidentialEscalations.state.escalations.map((escalation): DynamicI3Boundary => ({
      at: escalation.expiresAt,
      phase: 1,
      ownerId: intervention.ownerIds.presidentialEscalations,
      sourceId: escalation.id,
      kind: "ESCALATION_DEADLINE",
    })),
    ...state.presidentialInstruments.state.map((instrument): DynamicI3Boundary => ({
      at: instrument.payload.requestedResponseDeadline,
      phase: 3,
      ownerId: instrument.payload.recipientOfficeId,
      sourceId: instrument.id,
      kind: "RECIPIENT_DEADLINE",
    })),
    ...state.presidentialEscalations.state.reservedReviews.map((review): DynamicI3Boundary => ({
      at: review.reservedAt,
      phase: 4,
      ownerId: intervention.ownerIds.presidentialEscalations,
      sourceId: review.id,
      kind: "RESERVED_REVIEW_DUE",
    })),
  ].filter((boundary) => {
    const at = instant(boundary.at, `${boundary.sourceId} boundary`);
    return at > previous && at <= targetValue;
  }).sort((left, right) =>
    instant(left.at, `${left.sourceId} boundary`) - instant(right.at, `${right.sourceId} boundary`) ||
    left.phase - right.phase || left.ownerId.localeCompare(right.ownerId) ||
    left.sourceId.localeCompare(right.sourceId));
  let next = state;
  for (const boundary of boundaries) {
    if (boundary.kind === "ESCALATION_DEADLINE") {
      const escalation = next.presidentialEscalations.state.escalations.find(
        (entry) => entry.id === boundary.sourceId,
      );
      if (escalation !== undefined) next = applyEscalationDeadline(next, intervention, escalation);
    } else if (boundary.kind === "RECIPIENT_DEADLINE") {
      const instrument = next.presidentialInstruments.state.find((entry) => entry.id === boundary.sourceId);
      if (instrument !== undefined) next = applyRecipientDeadline(next, administration, intervention, instrument);
    }
    // Reserved-review DUE is intentionally derived from calendar + immutable
    // reservation/lifecycle state. Phase 4 has no synthetic owner mutation.
  }
  return finishOperation(next, administration, intervention, epoch, target);
};

export interface PresidentialAttentionProjectionInput {
  readonly current: string;
  readonly escalationState: PresidentialInterventionOwnerStates["presidentialEscalations"]["state"];
  readonly presentations: PresidentialAdministrationOwnerStates["presidentialPresentations"]["state"];
  readonly decisions: readonly PresidentialDecisionRecord[];
}

export const derivePresidentialAttention = (
  input: PresidentialAttentionProjectionInput,
): readonly PresidentialAttentionItem[] => {
  const items: PresidentialAttentionItem[] = [];
  for (const escalation of input.escalationState.escalations) {
    if (input.escalationState.lifecycleOccurrences.some((entry) => entry.escalationId === escalation.id)) {
      continue;
    }
    const presentation = [...input.presentations.escalationPresentations]
      .filter((entry) => entry.sourceEscalationId === escalation.id &&
        instant(entry.presentedAt, `${entry.id} presentation`) <= instant(input.current, "Attention time"))
      .sort((left, right) => right.presentedAt.localeCompare(left.presentedAt) || right.id.localeCompare(left.id))[0];
    if (presentation === undefined) continue;
    const previews = escalation.options.flatMap((option) => option.previews)
      .sort((left, right) => left.bundlePosition - right.bundlePosition);
    const item: EscalationAttentionItem = {
      kind: "PRESENTED_ESCALATION",
      escalationId: escalation.id,
      escalationPresentationId: presentation.id,
      presentedAt: presentation.presentedAt,
      expiresAt: escalation.expiresAt,
      requestedJudgment: escalation.requestedJudgment,
      shownSectionIds: [...presentation.shownSectionIds],
      optionIds: [...presentation.shownOptionIds],
      previews: copyPlain(previews),
      uncertainties: [...escalation.uncertainties],
      limitations: [...escalation.limitations],
      downstreamResolverOfficeIds: [...escalation.downstreamResolverOfficeIds],
    };
    items.push(item);
  }
  for (const review of input.escalationState.reservedReviews) {
    if (instant(input.current, "Attention time") < instant(review.reservedAt, `${review.id} reserved time`) ||
      input.escalationState.reservedReviewLifecycleOccurrences.some(
        (entry) => entry.reservationId === review.id,
      )) continue;
    const decision = input.decisions.find((entry) => entry.id === review.sourceDecisionId);
    const escalation = input.escalationState.escalations.find(
      (entry) => entry.id === review.sourceEscalationId,
    );
    if (decision === undefined || escalation === undefined) continue;
    const separatelyPresented = review.expectedSourceReferenceIds.some((expectedId) =>
      input.presentations.presentations.some((presentation) =>
        instant(presentation.presentedAt, `${presentation.id} presentation`) <=
          instant(input.current, "Attention time") &&
        presentation.shownPortions.some((portion) => portion.artifactId === expectedId)));
    const item: ReservedReviewAttentionItem = {
      kind: "DUE_RESERVED_REVIEW",
      reservationId: review.id,
      reservedAt: review.reservedAt,
      reviewQuestion: review.reviewQuestion,
      priorDecisionId: decision.id,
      priorPresentedPortions: copyPlain(escalation.presidentKnownPortions),
      expectedProductPresented: separatelyPresented,
    };
    items.push(item);
  }
  return copyPlain(items.sort((left, right) => {
    const leftAt = left.kind === "PRESENTED_ESCALATION" ? left.expiresAt : left.reservedAt;
    const rightAt = right.kind === "PRESENTED_ESCALATION" ? right.expiresAt : right.reservedAt;
    const leftCreated = left.kind === "PRESENTED_ESCALATION" ? left.presentedAt : left.reservedAt;
    const rightCreated = right.kind === "PRESENTED_ESCALATION" ? right.presentedAt : right.reservedAt;
    const leftId = left.kind === "PRESENTED_ESCALATION" ? left.escalationId : left.reservationId;
    const rightId = right.kind === "PRESENTED_ESCALATION" ? right.escalationId : right.reservationId;
    return instant(leftAt, `${leftId} attention time`) - instant(rightAt, `${rightId} attention time`) ||
      instant(leftCreated, `${leftId} creation`) - instant(rightCreated, `${rightId} creation`) ||
      leftId.localeCompare(rightId);
  }));
};

export interface WorkstreamProjectionInput {
  readonly workstream: AdministrationWorkstreamRecord;
  readonly transitions: readonly AdministrationWorkstreamTransition[];
}

export const deriveAdministrationWorkstreamView = (
  input: WorkstreamProjectionInput,
): AdministrationWorkstreamView => {
  const transitions = [...input.transitions]
    .filter((entry) => entry.workstreamId === input.workstream.id)
    .sort((left, right) => instant(left.occurredAt, `${left.id} time`) -
      instant(right.occurredAt, `${right.id} time`) || left.id.localeCompare(right.id));
  const latest = transitions[transitions.length - 1];
  if (latest === undefined) throw new Error(`Workstream ${input.workstream.id} has no coordination state.`);
  return copyPlain({
    id: input.workstream.id,
    label: input.workstream.label,
    adoptedObjective: input.workstream.adoptedObjective,
    coordinatorOfficeId: input.workstream.coordinatorOfficeId,
    participatingOfficeIds: [...input.workstream.participatingOfficeIds],
    currentStatus: latest.status,
    lastTransitionAt: latest.occurredAt,
    nextReviewAt: input.workstream.initialReviewAt,
  });
};

export interface PresidentialHistoryProjectionInput {
  readonly entries: readonly HistoricalRecordIndexEntry[];
  readonly decisionIds: readonly string[];
  readonly instrumentIds: readonly string[];
}

export const derivePresidentialHistoryView = (
  input: PresidentialHistoryProjectionInput,
): readonly PresidentialHistoryViewEntry[] => copyPlain(input.entries
  .filter((entry) => input.decisionIds.includes(entry.occurrenceId) ||
    input.instrumentIds.includes(entry.occurrenceId))
  .map((entry) => ({
    occurrenceId: entry.occurrenceId,
    recordKind: entry.recordKind as PresidentialHistoryViewEntry["recordKind"],
    occurredAt: entry.occurredAt,
  })));

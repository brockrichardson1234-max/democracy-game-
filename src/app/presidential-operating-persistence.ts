import { assertConfigurationIdentityCompatible } from "../configuration/loader";
import type { ConfigurationIdentity } from "../configuration/types";
import {
  assertPresidentialOperatingRuntimeState,
  copyPresidentialOperatingRuntimeState,
  PRESIDENTIAL_OPERATING_RUNTIME_SCHEMA_VERSION,
  type PresidentialOperatingRuntimeConfiguration,
  type PresidentialOperatingRuntimeState,
} from "../sim/presidential-operating-runtime";

export const PRESIDENTIAL_OPERATING_SAVE_FORMAT_VERSION = 2 as const;

export interface PresidentialOperatingSaveV2 {
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

const requireString = (value: unknown, field: string): string => {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Invalid presidential operating save: ${field} is required.`);
  }
  return value;
};

const requireNullableString = (value: unknown, field: string): string | null => {
  if (value === null) return null;
  return requireString(value, field);
};

const requireStringArray = (value: unknown, field: string): readonly string[] => {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string" || entry.length === 0)) {
    throw new Error(`Invalid presidential operating save: ${field} must be a string array.`);
  }
  return value as string[];
};

const requireArray = (value: unknown, field: string): readonly unknown[] => {
  if (!Array.isArray(value)) throw new Error(`Invalid presidential operating save: ${field} must be an array.`);
  return value;
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
  return {
    configurationId: requireString(identity.configurationId, `${field}.configurationId`),
    configurationVersion: requireString(identity.configurationVersion, `${field}.configurationVersion`),
    scenarioId: requireString(identity.scenarioId, `${field}.scenarioId`),
    scenarioVersion: requireString(identity.scenarioVersion, `${field}.scenarioVersion`),
    configurationHash: requireString(identity.configurationHash, `${field}.configurationHash`),
  };
};

const validateOwner = (
  value: unknown,
  field: string,
  validateState: (value: unknown, field: string) => void,
): void => {
  const owner = requireRecord(value, field);
  requireExactKeys(owner, field, ["ownerId", "state"]);
  requireString(owner.ownerId, `${field}.ownerId`);
  validateState(owner.state, `${field}.state`);
};

const validateCalendarState = (value: unknown, field: string): void => {
  const state = requireRecord(value, field);
  requireExactKeys(state, field, ["current", "processedBoundaryIds"]);
  requireString(state.current, `${field}.current`);
  requireStringArray(state.processedBoundaryIds, `${field}.processedBoundaryIds`);
};

const validateOfficeholderAssignment = (value: unknown, field: string): void => {
  const assignment = requireRecord(value, field);
  requireExactKeys(assignment, field, [
    "id",
    "officeId",
    "actorId",
    "effectiveFrom",
    "effectiveUntil",
    "actingStatus",
    "provenanceReference",
  ]);
  requireString(assignment.id, `${field}.id`);
  requireString(assignment.officeId, `${field}.officeId`);
  requireString(assignment.actorId, `${field}.actorId`);
  requireString(assignment.effectiveFrom, `${field}.effectiveFrom`);
  requireNullableString(assignment.effectiveUntil, `${field}.effectiveUntil`);
  if (assignment.actingStatus !== "CONFIRMED" && assignment.actingStatus !== "ACTING") {
    throw new Error(`Invalid presidential operating save: ${field}.actingStatus is unsupported.`);
  }
  requireString(assignment.provenanceReference, `${field}.provenanceReference`);
};

const validatePresidentialRecipientBinding = (value: unknown, field: string): void => {
  const binding = requireRecord(value, field);
  requireExactKeys(binding, field, [
    "id",
    "constitutionalOfficeId",
    "actorId",
    "effectiveFrom",
    "effectiveUntil",
    "provenanceReference",
  ]);
  requireString(binding.id, `${field}.id`);
  requireString(binding.constitutionalOfficeId, `${field}.constitutionalOfficeId`);
  requireString(binding.actorId, `${field}.actorId`);
  requireString(binding.effectiveFrom, `${field}.effectiveFrom`);
  requireNullableString(binding.effectiveUntil, `${field}.effectiveUntil`);
  requireString(binding.provenanceReference, `${field}.provenanceReference`);
};

const validateAdministrationDirectoryState = (value: unknown, field: string): void => {
  const state = requireRecord(value, field);
  requireExactKeys(state, field, ["officeholderAssignments", "presidentialRecipientBinding"]);
  requireArray(state.officeholderAssignments, `${field}.officeholderAssignments`).forEach(
    (entry, index) => validateOfficeholderAssignment(entry, `${field}.officeholderAssignments[${index}]`),
  );
  validatePresidentialRecipientBinding(
    state.presidentialRecipientBinding,
    `${field}.presidentialRecipientBinding`,
  );
};

const validateOfficeWorkAssignment = (value: unknown, field: string): void => {
  const assignment = requireRecord(value, field);
  requireExactKeys(assignment, field, [
    "id",
    "requesterId",
    "leadOfficeId",
    "objective",
    "sourceReferenceIds",
    "requiredConsultationOfficeIds",
    "authorityReference",
    "createdAt",
    "deadline",
    "expectedProductKind",
    "status",
    "statusUpdatedAt",
    "failureReason",
    "statusProvenanceReferenceId",
    "resultArtifactIds",
    "supersededByAssignmentId",
  ]);
  for (const key of [
    "id",
    "requesterId",
    "leadOfficeId",
    "objective",
    "authorityReference",
    "createdAt",
    "deadline",
    "expectedProductKind",
    "status",
    "statusUpdatedAt",
  ] as const) requireString(assignment[key], `${field}.${key}`);
  if (![
    "QUEUED",
    "IN_PROGRESS",
    "BLOCKED",
    "COMPLETED",
    "DELAYED",
    "REFUSED",
    "CANCELLED",
    "SUPERSEDED",
  ].includes(assignment.status as string)) {
    throw new Error(`Invalid presidential operating save: ${field}.status is unsupported.`);
  }
  requireStringArray(assignment.sourceReferenceIds, `${field}.sourceReferenceIds`);
  requireStringArray(assignment.requiredConsultationOfficeIds, `${field}.requiredConsultationOfficeIds`);
  requireNullableString(assignment.failureReason, `${field}.failureReason`);
  requireNullableString(assignment.statusProvenanceReferenceId, `${field}.statusProvenanceReferenceId`);
  requireStringArray(assignment.resultArtifactIds, `${field}.resultArtifactIds`);
  requireNullableString(assignment.supersededByAssignmentId, `${field}.supersededByAssignmentId`);
};

const validateDeadlineDefault = (value: unknown, field: string): void => {
  const record = requireRecord(value, field);
  requireExactKeys(record, field, ["id", "assignmentId", "occurredAt", "outcome", "provenanceReference"]);
  requireString(record.id, `${field}.id`);
  requireString(record.assignmentId, `${field}.assignmentId`);
  requireString(record.occurredAt, `${field}.occurredAt`);
  if (record.outcome !== "DELAYED" && record.outcome !== "CANCELLED") {
    throw new Error(`Invalid presidential operating save: ${field}.outcome is unsupported.`);
  }
  requireString(record.provenanceReference, `${field}.provenanceReference`);
};

const validateOfficeOperationsState = (value: unknown, field: string): void => {
  requireArray(value, field).forEach((entry, index) => {
    const office = requireRecord(entry, `${field}[${index}]`);
    requireExactKeys(office, `${field}[${index}]`, [
      "officeId",
      "assignments",
      "activeQueueAssignmentIds",
      "deadlineDefaultRecords",
    ]);
    requireString(office.officeId, `${field}[${index}].officeId`);
    requireArray(office.assignments, `${field}[${index}].assignments`).forEach(
      (assignment, assignmentIndex) => validateOfficeWorkAssignment(
        assignment,
        `${field}[${index}].assignments[${assignmentIndex}]`,
      ),
    );
    requireStringArray(office.activeQueueAssignmentIds, `${field}[${index}].activeQueueAssignmentIds`);
    requireArray(office.deadlineDefaultRecords, `${field}[${index}].deadlineDefaultRecords`).forEach(
      (record, recordIndex) => validateDeadlineDefault(
        record,
        `${field}[${index}].deadlineDefaultRecords[${recordIndex}]`,
      ),
    );
  });
};

const validateSourceArtifact = (artifact: Record<string, unknown>, field: string): void => {
  requireExactKeys(artifact, field, [
    "kind",
    "id",
    "version",
    "artifactClass",
    "producerInstitutionId",
    "asOf",
    "createdAt",
    "releasedAt",
    "sectionIds",
    "accessClass",
    "provenanceReference",
    "revisionOfArtifactId",
    "supersedesArtifactId",
  ]);
  for (const key of [
    "id",
    "version",
    "artifactClass",
    "producerInstitutionId",
    "asOf",
    "createdAt",
    "releasedAt",
    "accessClass",
    "provenanceReference",
  ] as const) requireString(artifact[key], `${field}.${key}`);
  requireStringArray(artifact.sectionIds, `${field}.sectionIds`);
  requireNullableString(artifact.revisionOfArtifactId, `${field}.revisionOfArtifactId`);
  requireNullableString(artifact.supersedesArtifactId, `${field}.supersedesArtifactId`);
};

const validateJudgment = (value: unknown, field: string): void => {
  const judgment = requireRecord(value, field);
  requireExactKeys(judgment, field, ["ruleId", "propositionId", "judgment"]);
  requireString(judgment.ruleId, `${field}.ruleId`);
  requireString(judgment.propositionId, `${field}.propositionId`);
  requireString(judgment.judgment, `${field}.judgment`);
};

const validateLineage = (value: unknown, field: string): void => {
  const lineage = requireRecord(value, field);
  requireExactKeys(lineage, field, ["artifactId", "sectionIds"]);
  requireString(lineage.artifactId, `${field}.artifactId`);
  requireStringArray(lineage.sectionIds, `${field}.sectionIds`);
};

const validateAssessmentArtifact = (artifact: Record<string, unknown>, field: string): void => {
  requireExactKeys(artifact, field, [
    "kind",
    "id",
    "version",
    "sectionIds",
    "producingOfficeId",
    "authoringOfficeholderAssignmentId",
    "assignmentId",
    "sourceReceiptIds",
    "sourceRetrievalIds",
    "sourceMetadataNoticeIds",
    "sourceLineage",
    "asOf",
    "createdAt",
    "judgments",
    "claimedConfidence",
    "evidentiarySupport",
    "assumptionIds",
    "limitations",
    "recommendation",
    "provenanceReference",
    "revisionOfArtifactId",
    "supersedesArtifactId",
  ]);
  for (const key of [
    "id",
    "version",
    "producingOfficeId",
    "authoringOfficeholderAssignmentId",
    "asOf",
    "createdAt",
    "claimedConfidence",
    "evidentiarySupport",
    "provenanceReference",
  ] as const) requireString(artifact[key], `${field}.${key}`);
  requireStringArray(artifact.sectionIds, `${field}.sectionIds`);
  requireNullableString(artifact.assignmentId, `${field}.assignmentId`);
  requireStringArray(artifact.sourceReceiptIds, `${field}.sourceReceiptIds`);
  requireStringArray(artifact.sourceRetrievalIds, `${field}.sourceRetrievalIds`);
  requireStringArray(artifact.sourceMetadataNoticeIds, `${field}.sourceMetadataNoticeIds`);
  requireArray(artifact.sourceLineage, `${field}.sourceLineage`).forEach(
    (entry, index) => validateLineage(entry, `${field}.sourceLineage[${index}]`),
  );
  requireArray(artifact.judgments, `${field}.judgments`).forEach(
    (entry, index) => validateJudgment(entry, `${field}.judgments[${index}]`),
  );
  requireStringArray(artifact.assumptionIds, `${field}.assumptionIds`);
  requireStringArray(artifact.limitations, `${field}.limitations`);
  requireNullableString(artifact.recommendation, `${field}.recommendation`);
  requireNullableString(artifact.revisionOfArtifactId, `${field}.revisionOfArtifactId`);
  requireNullableString(artifact.supersedesArtifactId, `${field}.supersedesArtifactId`);
};

const validatePreservedAssessment = (value: unknown, field: string): void => {
  const preserved = requireRecord(value, field);
  requireExactKeys(preserved, field, ["assessmentArtifactId", "judgments", "limitations"]);
  requireString(preserved.assessmentArtifactId, `${field}.assessmentArtifactId`);
  requireArray(preserved.judgments, `${field}.judgments`).forEach(
    (entry, index) => validateJudgment(entry, `${field}.judgments[${index}]`),
  );
  requireStringArray(preserved.limitations, `${field}.limitations`);
};

const validateSynthesisArtifact = (artifact: Record<string, unknown>, field: string): void => {
  requireExactKeys(artifact, field, [
    "kind",
    "id",
    "version",
    "sectionIds",
    "producingOfficeId",
    "authoringOfficeholderAssignmentId",
    "sourceAssessmentReceiptIds",
    "sourceAssessmentArtifactIds",
    "preservedAssessments",
    "synthesisJudgment",
    "limitations",
    "asOf",
    "createdAt",
    "provenanceReference",
    "revisionOfArtifactId",
    "supersedesArtifactId",
  ]);
  for (const key of [
    "id",
    "version",
    "producingOfficeId",
    "authoringOfficeholderAssignmentId",
    "synthesisJudgment",
    "asOf",
    "createdAt",
    "provenanceReference",
  ] as const) requireString(artifact[key], `${field}.${key}`);
  requireStringArray(artifact.sectionIds, `${field}.sectionIds`);
  requireStringArray(artifact.sourceAssessmentReceiptIds, `${field}.sourceAssessmentReceiptIds`);
  requireStringArray(artifact.sourceAssessmentArtifactIds, `${field}.sourceAssessmentArtifactIds`);
  requireArray(artifact.preservedAssessments, `${field}.preservedAssessments`).forEach(
    (entry, index) => validatePreservedAssessment(entry, `${field}.preservedAssessments[${index}]`),
  );
  requireStringArray(artifact.limitations, `${field}.limitations`);
  requireNullableString(artifact.revisionOfArtifactId, `${field}.revisionOfArtifactId`);
  requireNullableString(artifact.supersedesArtifactId, `${field}.supersedesArtifactId`);
};

const validateArtifact = (value: unknown, field: string): void => {
  const artifact = requireRecord(value, field);
  if (artifact.kind === "SOURCE_EVIDENCE") return validateSourceArtifact(artifact, field);
  if (artifact.kind === "ASSESSMENT") return validateAssessmentArtifact(artifact, field);
  if (artifact.kind === "SYNTHESIS") return validateSynthesisArtifact(artifact, field);
  throw new Error(`Invalid presidential operating save: ${field}.kind is unsupported.`);
};

const validatePossession = (value: unknown, field: string): void => {
  const record = requireRecord(value, field);
  requireExactKeys(record, field, [
    "id",
    "artifactId",
    "possessingInstitutionId",
    "possessedAt",
    "acquisitionProvenanceReference",
  ]);
  for (const key of Object.keys(record)) requireString(record[key], `${field}.${key}`);
};

const validateIndex = (value: unknown, field: string): void => {
  const record = requireRecord(value, field);
  requireExactKeys(record, field, [
    "id",
    "artifactId",
    "sourcePossessionId",
    "sourceInstitutionId",
    "artifactVersion",
    "accessClass",
    "availableSectionIds",
    "createdAt",
    "provenanceReference",
  ]);
  for (const key of [
    "id",
    "artifactId",
    "sourcePossessionId",
    "sourceInstitutionId",
    "artifactVersion",
    "accessClass",
    "createdAt",
    "provenanceReference",
  ] as const) requireString(record[key], `${field}.${key}`);
  requireStringArray(record.availableSectionIds, `${field}.availableSectionIds`);
};

const validateNotice = (value: unknown, field: string): void => {
  const record = requireRecord(value, field);
  requireExactKeys(record, field, [
    "id",
    "indexEntryId",
    "recipientOfficeId",
    "noticedAt",
    "deliveryPath",
    "deduplicationIdentity",
  ]);
  for (const key of Object.keys(record)) requireString(record[key], `${field}.${key}`);
};

const validateEntitlement = (value: unknown, field: string): void => {
  const record = requireRecord(value, field);
  requireExactKeys(record, field, [
    "id",
    "officeId",
    "artifactId",
    "accessClass",
    "sectionIds",
    "effectiveFrom",
    "effectiveUntil",
    "authorityReference",
  ]);
  for (const key of ["id", "officeId", "artifactId", "accessClass", "effectiveFrom", "authorityReference"] as const) {
    requireString(record[key], `${field}.${key}`);
  }
  requireStringArray(record.sectionIds, `${field}.sectionIds`);
  requireNullableString(record.effectiveUntil, `${field}.effectiveUntil`);
};

const validateRetrieval = (value: unknown, field: string): void => {
  const record = requireRecord(value, field);
  requireExactKeys(record, field, [
    "id",
    "requestingOfficeId",
    "artifactId",
    "requestedSectionIds",
    "metadataNoticeId",
    "requestedAt",
    "completedAt",
    "evaluatedEntitlementId",
    "result",
    "failureReason",
  ]);
  for (const key of ["id", "requestingOfficeId", "artifactId", "metadataNoticeId", "requestedAt", "completedAt", "result"] as const) {
    requireString(record[key], `${field}.${key}`);
  }
  requireStringArray(record.requestedSectionIds, `${field}.requestedSectionIds`);
  requireNullableString(record.evaluatedEntitlementId, `${field}.evaluatedEntitlementId`);
  requireNullableString(record.failureReason, `${field}.failureReason`);
};

const validateReceiptSource = (value: unknown, field: string): void => {
  const source = requireRecord(value, field);
  if (source.kind === "TECHNICAL_RETRIEVAL") {
    requireExactKeys(source, field, ["kind", "retrievalId"]);
    requireString(source.retrievalId, `${field}.retrievalId`);
    return;
  }
  if (source.kind === "OFFICE_ARTIFACT_TRANSFER") {
    requireExactKeys(source, field, ["kind", "sourceOfficeId", "sourceOfficeholderAssignmentId"]);
    requireString(source.sourceOfficeId, `${field}.sourceOfficeId`);
    requireString(source.sourceOfficeholderAssignmentId, `${field}.sourceOfficeholderAssignmentId`);
    return;
  }
  throw new Error(`Invalid presidential operating save: ${field}.kind is unsupported.`);
};

const validateReceipt = (value: unknown, field: string): void => {
  const record = requireRecord(value, field);
  requireExactKeys(record, field, [
    "id",
    "recipientOfficeId",
    "artifactId",
    "receivedSectionIds",
    "source",
    "receivedAt",
    "receivingAuthorityReference",
    "deduplicationIdentity",
  ]);
  for (const key of [
    "id",
    "recipientOfficeId",
    "artifactId",
    "receivedAt",
    "receivingAuthorityReference",
    "deduplicationIdentity",
  ] as const) requireString(record[key], `${field}.${key}`);
  requireStringArray(record.receivedSectionIds, `${field}.receivedSectionIds`);
  validateReceiptSource(record.source, `${field}.source`);
};

const validateInformationRouteState = (value: unknown, field: string): void => {
  const state = requireRecord(value, field);
  requireExactKeys(state, field, [
    "artifacts",
    "institutionPossessions",
    "indexEntries",
    "metadataNotices",
    "accessEntitlements",
    "retrievals",
    "receipts",
  ]);
  const validators: readonly [string, (value: unknown, field: string) => void][] = [
    ["artifacts", validateArtifact],
    ["institutionPossessions", validatePossession],
    ["indexEntries", validateIndex],
    ["metadataNotices", validateNotice],
    ["accessEntitlements", validateEntitlement],
    ["retrievals", validateRetrieval],
    ["receipts", validateReceipt],
  ];
  for (const [key, validator] of validators) {
    requireArray(state[key], `${field}.${key}`).forEach(
      (entry, index) => validator(entry, `${field}.${key}[${index}]`),
    );
  }
};

const validatePresentedPortion = (value: unknown, field: string): void => {
  const portion = requireRecord(value, field);
  requireExactKeys(portion, field, ["artifactId", "sectionId"]);
  requireString(portion.artifactId, `${field}.artifactId`);
  requireString(portion.sectionId, `${field}.sectionId`);
};

const validatePresentation = (value: unknown, field: string): void => {
  const record = requireRecord(value, field);
  requireExactKeys(record, field, [
    "id",
    "deduplicationIdentity",
    "recipientBindingId",
    "recipientActorId",
    "constitutionalOfficeId",
    "presentingOfficeId",
    "presenterOfficeholderAssignmentId",
    "presentedAt",
    "shownPortions",
    "referencedButNotShownPortions",
    "purpose",
    "provenanceReference",
    "revisionOfPresentationId",
    "supersedesPresentationId",
  ]);
  for (const key of [
    "id",
    "deduplicationIdentity",
    "recipientBindingId",
    "recipientActorId",
    "constitutionalOfficeId",
    "presentingOfficeId",
    "presenterOfficeholderAssignmentId",
    "presentedAt",
    "purpose",
    "provenanceReference",
  ] as const) requireString(record[key], `${field}.${key}`);
  requireArray(record.shownPortions, `${field}.shownPortions`).forEach(
    (entry, index) => validatePresentedPortion(entry, `${field}.shownPortions[${index}]`),
  );
  requireArray(record.referencedButNotShownPortions, `${field}.referencedButNotShownPortions`).forEach(
    (entry, index) => validatePresentedPortion(entry, `${field}.referencedButNotShownPortions[${index}]`),
  );
  requireNullableString(record.revisionOfPresentationId, `${field}.revisionOfPresentationId`);
  requireNullableString(record.supersedesPresentationId, `${field}.supersedesPresentationId`);
};

const validatePresentationHistoryState = (value: unknown, field: string): void => {
  const state = requireRecord(value, field);
  requireExactKeys(state, field, ["presentations"]);
  requireArray(state.presentations, `${field}.presentations`).forEach(
    (entry, index) => validatePresentation(entry, `${field}.presentations[${index}]`),
  );
};

const parseOperatingState = (value: unknown): PresidentialOperatingRuntimeState => {
  const state = requireRecord(value, "operatingState");
  requireExactKeys(state, "operatingState", [
    "schemaVersion",
    "operatingStateId",
    "configuration",
    "ownerStates",
  ]);
  if (state.schemaVersion !== PRESIDENTIAL_OPERATING_RUNTIME_SCHEMA_VERSION) {
    throw new Error("Invalid presidential operating save: unsupported operatingState schema version.");
  }
  requireString(state.operatingStateId, "operatingState.operatingStateId");
  parseConfigurationIdentity(state.configuration, "operatingState.configuration");
  const ownerStates = requireRecord(state.ownerStates, "operatingState.ownerStates");
  requireExactKeys(ownerStates, "operatingState.ownerStates", [
    "calendar",
    "administrationDirectory",
    "officeOperations",
    "informationRoutes",
    "presidentialPresentations",
  ]);
  validateOwner(ownerStates.calendar, "operatingState.ownerStates.calendar", validateCalendarState);
  validateOwner(
    ownerStates.administrationDirectory,
    "operatingState.ownerStates.administrationDirectory",
    validateAdministrationDirectoryState,
  );
  validateOwner(
    ownerStates.officeOperations,
    "operatingState.ownerStates.officeOperations",
    validateOfficeOperationsState,
  );
  validateOwner(
    ownerStates.informationRoutes,
    "operatingState.ownerStates.informationRoutes",
    validateInformationRouteState,
  );
  validateOwner(
    ownerStates.presidentialPresentations,
    "operatingState.ownerStates.presidentialPresentations",
    validatePresentationHistoryState,
  );
  return JSON.parse(JSON.stringify(state)) as PresidentialOperatingRuntimeState;
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
  } satisfies PresidentialOperatingSaveV2);
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

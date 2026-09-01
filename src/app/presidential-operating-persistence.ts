import { assertConfigurationIdentityCompatible } from "../configuration/loader";
import type { ConfigurationIdentity } from "../configuration/types";
import {
  assertPresidentialOperatingRuntimeState,
  copyPresidentialOperatingRuntimeState,
  PRESIDENTIAL_OPERATING_RUNTIME_SCHEMA_VERSION,
  type PresidentialOperatingRuntimeConfiguration,
  type PresidentialOperatingRuntimeState,
} from "../sim/presidential-operating-runtime";
import {
  assertPresidentialControlBinding,
  PRESIDENTIAL_OPERATING_DECISION_SURFACE,
  type PresidentialControlBindingState,
} from "../sim/presidential-operating-intervention";

export const PRESIDENTIAL_OPERATING_SAVE_FORMAT_VERSION = 5 as const;

export interface PresidentialOperatingSaveV5 {
  readonly formatVersion: typeof PRESIDENTIAL_OPERATING_SAVE_FORMAT_VERSION;
  readonly configuration: ConfigurationIdentity;
  readonly operatingState: PresidentialOperatingRuntimeState;
  readonly session: {
    readonly controlBinding: PresidentialControlBindingState;
  };
}

export interface RestoredPresidentialOperatingSave {
  readonly operatingState: PresidentialOperatingRuntimeState;
  readonly session: {
    readonly controlBinding: PresidentialControlBindingState;
  };
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

const requireBoolean = (value: unknown, field: string): boolean => {
  if (typeof value !== "boolean") {
    throw new Error(`Invalid presidential operating save: ${field} must be boolean.`);
  }
  return value;
};

const requireSafeInteger = (value: unknown, field: string): number => {
  if (typeof value !== "number" || !Number.isSafeInteger(value)) {
    throw new Error(`Invalid presidential operating save: ${field} must be a safe integer.`);
  }
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

const validateOfficeInstrumentReceipt = (value: unknown, field: string): void => {
  const receipt = requireRecord(value, field);
  requireExactKeys(receipt, field, [
    "id",
    "deduplicationIdentity",
    "recipientOfficeId",
    "instrumentId",
    "successfulDispatchId",
    "receivedPayloadVersion",
    "receivedAt",
    "receiptPath",
    "receivingAuthorityReference",
    "provenanceReference",
  ]);
  for (const key of Object.keys(receipt)) requireString(receipt[key], `${field}.${key}`);
};

const validateRecipientDisposition = (value: unknown, field: string): void => {
  const record = requireRecord(value, field);
  requireExactKeys(record, field, [
    "id",
    "deduplicationIdentity",
    "recipientOfficeId",
    "instrumentReceiptId",
    "instrumentId",
    "authoringOfficeholderAssignmentId",
    "capabilityAuthorityId",
    "kind",
    "dispositionAt",
    "acceptedProductKind",
    "acceptedSectionIds",
    "acceptedCoordinationActions",
    "constraintIds",
    "constraintSourceReferenceIds",
    "reason",
    "limitations",
    "nextReviewAt",
    "provenanceReference",
  ]);
  for (const key of [
    "id",
    "deduplicationIdentity",
    "recipientOfficeId",
    "instrumentReceiptId",
    "instrumentId",
    "kind",
    "dispositionAt",
    "provenanceReference",
  ] as const) requireString(record[key], `${field}.${key}`);
  for (const key of [
    "authoringOfficeholderAssignmentId",
    "capabilityAuthorityId",
    "acceptedProductKind",
    "reason",
    "nextReviewAt",
  ] as const) requireNullableString(record[key], `${field}.${key}`);
  for (const key of [
    "acceptedSectionIds",
    "acceptedCoordinationActions",
    "constraintIds",
    "constraintSourceReferenceIds",
    "limitations",
  ] as const) requireStringArray(record[key], `${field}.${key}`);
};

const validateInstrumentAssignmentAuthorization = (value: unknown, field: string): void => {
  const binding = requireRecord(value, field);
  requireExactKeys(binding, field, [
    "assignmentId",
    "dispositionId",
    "instrumentId",
    "recipientOfficeId",
    "authorizedDeadline",
    "scope",
    "boundAt",
  ]);
  for (const key of [
    "assignmentId",
    "dispositionId",
    "instrumentId",
    "recipientOfficeId",
    "authorizedDeadline",
    "boundAt",
  ] as const) requireString(binding[key], `${field}.${key}`);
  const scope = requireRecord(binding.scope, `${field}.scope`);
  if (scope.kind === "ANALYSIS_ASSIGNMENT_SCOPE") {
    requireExactKeys(scope, `${field}.scope`, [
      "kind",
      "evidenceArtifactId",
      "evidenceSectionIds",
      "productKind",
    ]);
    requireString(scope.evidenceArtifactId, `${field}.scope.evidenceArtifactId`);
    requireStringArray(scope.evidenceSectionIds, `${field}.scope.evidenceSectionIds`);
    requireString(scope.productKind, `${field}.scope.productKind`);
  } else if (scope.kind === "COORDINATION_ASSIGNMENT_SCOPE") {
    requireExactKeys(scope, `${field}.scope`, [
      "kind",
      "workstreamId",
      "coordinationActionKinds",
      "productKind",
    ]);
    requireString(scope.workstreamId, `${field}.scope.workstreamId`);
    requireStringArray(scope.coordinationActionKinds, `${field}.scope.coordinationActionKinds`);
    requireString(scope.productKind, `${field}.scope.productKind`);
  } else if (scope.kind === "LEGISLATIVE_POSITION_ASSIGNMENT_SCOPE") {
    requireExactKeys(scope, `${field}.scope`, [
      "kind", "initiativeId", "proposalVersion", "positionKind", "negotiableTermIds",
      "evidenceReferenceIds",
    ]);
    requireString(scope.initiativeId, `${field}.scope.initiativeId`);
    requireSafeInteger(scope.proposalVersion, `${field}.scope.proposalVersion`);
    requireString(scope.positionKind, `${field}.scope.positionKind`);
    requireStringArray(scope.negotiableTermIds, `${field}.scope.negotiableTermIds`);
    requireStringArray(scope.evidenceReferenceIds, `${field}.scope.evidenceReferenceIds`);
  } else if (scope.kind === "INTERGOVERNMENTAL_CONTACT_ASSIGNMENT_SCOPE") {
    requireExactKeys(scope, `${field}.scope`, [
      "kind", "governorActorIds", "purposeFamily", "talkingPoints", "prohibitedCommitmentKinds",
    ]);
    requireStringArray(scope.governorActorIds, `${field}.scope.governorActorIds`);
    requireString(scope.purposeFamily, `${field}.scope.purposeFamily`);
    requireStringArray(scope.talkingPoints, `${field}.scope.talkingPoints`);
    requireStringArray(scope.prohibitedCommitmentKinds, `${field}.scope.prohibitedCommitmentKinds`);
  } else if (scope.kind === "PUBLIC_STATEMENT_ASSIGNMENT_SCOPE") {
    requireExactKeys(scope, `${field}.scope`, [
      "kind", "approvedClaims", "limitations", "sourceSectionReferences",
      "prohibitedUnsupportedClaimFamilies", "releaseWindowEndsAt", "productKind",
    ]);
    requireStringArray(scope.approvedClaims, `${field}.scope.approvedClaims`);
    requireStringArray(scope.limitations, `${field}.scope.limitations`);
    requireArray(scope.sourceSectionReferences, `${field}.scope.sourceSectionReferences`).forEach(
      (entry, index) => {
        const reference = requireRecord(entry, `${field}.scope.sourceSectionReferences[${index}]`);
        requireExactKeys(reference, `${field}.scope.sourceSectionReferences[${index}]`, [
          "artifactId", "sectionId",
        ]);
        requireString(reference.artifactId, `${field}.scope.sourceSectionReferences[${index}].artifactId`);
        requireString(reference.sectionId, `${field}.scope.sourceSectionReferences[${index}].sectionId`);
      },
    );
    requireStringArray(
      scope.prohibitedUnsupportedClaimFamilies,
      `${field}.scope.prohibitedUnsupportedClaimFamilies`,
    );
    requireString(scope.releaseWindowEndsAt, `${field}.scope.releaseWindowEndsAt`);
    requireString(scope.productKind, `${field}.scope.productKind`);
  } else throw new Error(`Invalid presidential operating save: ${field}.scope.kind is unsupported.`);
};

const validateDepartmentHandlingSubmission = (value: unknown, field: string): void => {
  const record = requireRecord(value, field);
  requireExactKeys(record, field, [
    "id",
    "deduplicationIdentity",
    "submittingOfficeId",
    "submittingOfficeholderAssignmentId",
    "handlingAuthorityId",
    "sourceDispositionId",
    "sourceAssignmentId",
    "sourceAssignmentResultArtifactId",
    "targetInstitutionId",
    "targetRequestId",
    "targetProjectId",
    "targetRelationshipId",
    "targetScopeKey",
    "submittedAt",
    "payload",
    "provenanceReference",
  ]);
  for (const key of [
    "id",
    "deduplicationIdentity",
    "submittingOfficeId",
    "submittingOfficeholderAssignmentId",
    "handlingAuthorityId",
    "sourceDispositionId",
    "sourceAssignmentId",
    "sourceAssignmentResultArtifactId",
    "targetInstitutionId",
    "targetRequestId",
    "targetProjectId",
    "targetRelationshipId",
    "targetScopeKey",
    "submittedAt",
    "provenanceReference",
  ] as const) requireString(record[key], `${field}.${key}`);
  const payload = requireRecord(record.payload, `${field}.payload`);
  if (payload.kind === "SUBMIT_SUPPLEMENTAL_RECORDS") {
    requireExactKeys(payload, `${field}.payload`, ["kind", "recordTypeIds", "qualifyingEvidenceReference"]);
    const recordTypes = requireStringArray(payload.recordTypeIds, `${field}.payload.recordTypeIds`);
    if (recordTypes.length !== 1 || recordTypes[0] !== "NONAVAILABILITY_RECORD") {
      throw new Error(`Invalid presidential operating save: ${field}.payload has unsupported record types.`);
    }
    const evidence = requireRecord(payload.qualifyingEvidenceReference, `${field}.payload.qualifyingEvidenceReference`);
    requireExactKeys(evidence, `${field}.payload.qualifyingEvidenceReference`, [
      "artifactId",
      "artifactKind",
      "recordTypeId",
      "certificationSectionId",
      "sourceArtifactProductionId",
      "sourceRawEvidenceReceiptId",
      "sourceLineageSectionId",
    ]);
    for (const key of Object.keys(evidence)) {
      requireString(evidence[key], `${field}.payload.qualifyingEvidenceReference.${key}`);
    }
  } else if (payload.kind === "SUBMIT_WAIVER_REVIEW_INTENTION") {
    requireExactKeys(payload, `${field}.payload`, ["kind", "intention", "supportingHandlingSubmissionIds"]);
    if (!["GRANT_SCOPED_WAIVER", "DENY", "RETURN_FOR_SUPPLEMENTAL_RECORD"].includes(payload.intention as string)) {
      throw new Error(`Invalid presidential operating save: ${field}.payload.intention is unsupported.`);
    }
    requireStringArray(payload.supportingHandlingSubmissionIds, `${field}.payload.supportingHandlingSubmissionIds`);
  } else throw new Error(`Invalid presidential operating save: ${field}.payload.kind is unsupported.`);
};

const validateOfficeOperationsState = (value: unknown, field: string): void => {
  requireArray(value, field).forEach((entry, index) => {
    const office = requireRecord(entry, `${field}[${index}]`);
    requireExactKeys(office, `${field}[${index}]`, [
      "officeId",
      "assignments",
      "activeQueueAssignmentIds",
      "deadlineDefaultRecords",
      "instrumentReceipts",
      "instrumentDispositions",
      "instrumentAssignmentAuthorizations",
      "externalCommunicationDispatches",
      "departmentHandlingSubmissions",
      ...(Object.hasOwn(office, "ombReviewCapacity") ? ["ombReviewCapacity"] : []),
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
    requireArray(office.instrumentReceipts, `${field}[${index}].instrumentReceipts`).forEach(
      (record, recordIndex) => validateOfficeInstrumentReceipt(
        record,
        `${field}[${index}].instrumentReceipts[${recordIndex}]`,
      ),
    );
    requireArray(office.instrumentDispositions, `${field}[${index}].instrumentDispositions`).forEach(
      (record, recordIndex) => validateRecipientDisposition(
        record,
        `${field}[${index}].instrumentDispositions[${recordIndex}]`,
      ),
    );
    requireArray(
      office.instrumentAssignmentAuthorizations,
      `${field}[${index}].instrumentAssignmentAuthorizations`,
    ).forEach((record, recordIndex) => validateInstrumentAssignmentAuthorization(
      record,
      `${field}[${index}].instrumentAssignmentAuthorizations[${recordIndex}]`,
    ));
    requireArray(
      office.externalCommunicationDispatches,
      `${field}[${index}].externalCommunicationDispatches`,
    ).forEach((record, recordIndex) => {
      const dispatchField = `${field}[${index}].externalCommunicationDispatches[${recordIndex}]`;
      const dispatch = requireRecord(record, dispatchField);
      requireExactKeys(dispatch, dispatchField, [
        "id", "communicationArtifactId", "sendingOfficeId", "sendingOfficeholderAssignmentId",
        "recipientActorOrInstitutionId", "dispatchedAt", "deliveredAt", "outcome", "provenanceReference",
      ]);
      for (const key of Object.keys(dispatch)) requireString(dispatch[key], `${dispatchField}.${key}`);
      if (dispatch.outcome !== "DELIVERED_TO_RECIPIENT_BOUNDARY") {
        throw new Error(`Invalid presidential operating save: ${dispatchField}.outcome is unsupported.`);
      }
    });
    requireArray(
      office.departmentHandlingSubmissions,
      `${field}[${index}].departmentHandlingSubmissions`,
    ).forEach((record, recordIndex) => validateDepartmentHandlingSubmission(
      record,
      `${field}[${index}].departmentHandlingSubmissions[${recordIndex}]`,
    ));
    if (Object.hasOwn(office, "ombReviewCapacity")) {
      const capacity = requireRecord(office.ombReviewCapacity, `${field}[${index}].ombReviewCapacity`);
      requireExactKeys(capacity, `${field}[${index}].ombReviewCapacity`, [
        "teamId", "periods", "bookings", "coordinationRequests", "queueReprioritizations",
        "assignmentSupersessions",
      ]);
      requireString(capacity.teamId, `${field}[${index}].ombReviewCapacity.teamId`);
      for (const key of ["periods", "bookings", "coordinationRequests", "queueReprioritizations",
        "assignmentSupersessions"] as const) {
        requireArray(capacity[key], `${field}[${index}].ombReviewCapacity.${key}`);
      }
    }
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

const validateHousingMonitoringClaim = (value: unknown, field: string): void => {
  const claim = requireRecord(value, field);
  requireExactKeys(claim, field, [
    "id",
    "sectionId",
    "sourceStateField",
    "sourceOwnerId",
    "sourceRecordKind",
    "sourceRecordId",
    "projectId",
    "claimFamily",
    "observedFieldPath",
    "observedValue",
    "sourceOccurredAt",
    "observedAt",
    "observationAuthorityId",
    "authorityScopeKey",
    "sourceRecordHash",
    "supportingOccurrenceIds",
    "provenanceReference",
  ]);
  for (const key of [
    "id",
    "sectionId",
    "sourceStateField",
    "sourceOwnerId",
    "sourceRecordKind",
    "sourceRecordId",
    "projectId",
    "claimFamily",
    "observedFieldPath",
    "observedAt",
    "observationAuthorityId",
    "authorityScopeKey",
    "sourceRecordHash",
    "provenanceReference",
  ] as const) requireString(claim[key], `${field}.${key}`);
  requireNullableString(claim.sourceOccurredAt, `${field}.sourceOccurredAt`);
  requireStringArray(claim.supportingOccurrenceIds, `${field}.supportingOccurrenceIds`);
  if (
    claim.observedValue !== null &&
    typeof claim.observedValue !== "string" &&
    typeof claim.observedValue !== "number" &&
    typeof claim.observedValue !== "boolean" &&
    !Array.isArray(claim.observedValue)
  ) throw new Error(`Invalid presidential operating save: ${field}.observedValue is unsupported.`);
  if (Array.isArray(claim.observedValue)) {
    requireStringArray(claim.observedValue, `${field}.observedValue`);
  }
};

const validateHousingMonitoringArtifact = (artifact: Record<string, unknown>, field: string): void => {
  requireExactKeys(artifact, field, [
    "kind",
    "id",
    "version",
    "producerInstitutionId",
    "observationAuthorityId",
    "institutionIdentityBindingId",
    "asOf",
    "createdAt",
    "releasedAt",
    "sectionIds",
    "sectionClaims",
    "claims",
    "accessClass",
    "canonicalArtifactHash",
    "provenanceReference",
    "revisionOfArtifactId",
    "supersedesArtifactId",
  ]);
  for (const key of [
    "id",
    "version",
    "producerInstitutionId",
    "observationAuthorityId",
    "institutionIdentityBindingId",
    "asOf",
    "createdAt",
    "releasedAt",
    "accessClass",
    "canonicalArtifactHash",
    "provenanceReference",
  ] as const) requireString(artifact[key], `${field}.${key}`);
  requireStringArray(artifact.sectionIds, `${field}.sectionIds`);
  requireArray(artifact.sectionClaims, `${field}.sectionClaims`).forEach((entry, index) => {
    const section = requireRecord(entry, `${field}.sectionClaims[${index}]`);
    requireExactKeys(section, `${field}.sectionClaims[${index}]`, ["sectionId", "claimIds"]);
    requireString(section.sectionId, `${field}.sectionClaims[${index}].sectionId`);
    requireStringArray(section.claimIds, `${field}.sectionClaims[${index}].claimIds`);
  });
  requireArray(artifact.claims, `${field}.claims`).forEach(
    (entry, index) => validateHousingMonitoringClaim(entry, `${field}.claims[${index}]`),
  );
  requireNullableString(artifact.revisionOfArtifactId, `${field}.revisionOfArtifactId`);
  requireNullableString(artifact.supersedesArtifactId, `${field}.supersedesArtifactId`);
};

const validateSupplierEvidenceArtifact = (artifact: Record<string, unknown>, field: string): void => {
  requireExactKeys(artifact, field, [
    "kind", "id", "version", "producerInstitutionId", "targetProjectId", "targetRequestId",
    "targetScopeKey", "sourceDocumentIds", "asOf", "createdAt", "releasedAt", "sectionIds",
    "accessClass", "canonicalArtifactHash", "provenanceReference", "revisionOfArtifactId",
    "supersedesArtifactId",
  ]);
  for (const key of [
    "id", "version", "producerInstitutionId", "targetProjectId", "targetRequestId", "targetScopeKey",
    "asOf", "createdAt", "releasedAt", "accessClass", "canonicalArtifactHash", "provenanceReference",
  ] as const) requireString(artifact[key], `${field}.${key}`);
  requireStringArray(artifact.sourceDocumentIds, `${field}.sourceDocumentIds`);
  requireStringArray(artifact.sectionIds, `${field}.sectionIds`);
  requireNullableString(artifact.revisionOfArtifactId, `${field}.revisionOfArtifactId`);
  requireNullableString(artifact.supersedesArtifactId, `${field}.supersedesArtifactId`);
};

const validateSupplementalRecordArtifact = (artifact: Record<string, unknown>, field: string): void => {
  requireExactKeys(artifact, field, [
    "kind", "id", "version", "recordTypeId", "producingOfficeId",
    "authoringOfficeholderAssignmentId", "sourceDispositionId", "sourceAssignmentId",
    "sourceAssignmentResultArtifactId", "targetInstitutionId", "targetRequestId", "targetProjectId",
    "targetRelationshipId", "targetScopeKey", "sourceEvidenceArtifactId", "sourceEvidenceReceiptId",
    "sourceEvidenceSectionIds", "asOf", "createdAt", "releasedAt", "sectionIds", "accessClass",
    "canonicalArtifactHash", "provenanceReference", "revisionOfArtifactId", "supersedesArtifactId",
  ]);
  for (const key of [
    "id", "version", "recordTypeId", "producingOfficeId", "authoringOfficeholderAssignmentId",
    "sourceDispositionId", "sourceAssignmentId", "sourceAssignmentResultArtifactId", "targetInstitutionId",
    "targetRequestId", "targetProjectId", "targetRelationshipId", "targetScopeKey",
    "sourceEvidenceArtifactId", "sourceEvidenceReceiptId", "asOf", "createdAt", "releasedAt",
    "accessClass", "canonicalArtifactHash", "provenanceReference",
  ] as const) requireString(artifact[key], `${field}.${key}`);
  requireStringArray(artifact.sourceEvidenceSectionIds, `${field}.sourceEvidenceSectionIds`);
  requireStringArray(artifact.sectionIds, `${field}.sectionIds`);
  requireNullableString(artifact.revisionOfArtifactId, `${field}.revisionOfArtifactId`);
  requireNullableString(artifact.supersedesArtifactId, `${field}.supersedesArtifactId`);
};

const validateArtifact = (value: unknown, field: string): void => {
  const artifact = requireRecord(value, field);
  if (artifact.kind === "SOURCE_EVIDENCE") return validateSourceArtifact(artifact, field);
  if (artifact.kind === "ASSESSMENT") return validateAssessmentArtifact(artifact, field);
  if (artifact.kind === "SYNTHESIS") return validateSynthesisArtifact(artifact, field);
  if (artifact.kind === "HOUSING_MONITORING_EVIDENCE") return validateHousingMonitoringArtifact(artifact, field);
  if (artifact.kind === "HUD_SUPPLIER_SEARCH_EVIDENCE") return validateSupplierEvidenceArtifact(artifact, field);
  if (artifact.kind === "HUD_SUPPLEMENTAL_RECORD") return validateSupplementalRecordArtifact(artifact, field);
  if (artifact.kind === "I5_DOMAIN_EVIDENCE") {
    requireExactKeys(artifact, field, [
      "kind", "domainEvidenceKind", "id", "version", "producerInstitutionId", "producingOfficeId",
      "authoringOfficeholderAssignmentId", "sourceOwnerId", "sourceOccurrenceIds",
      "observationAuthorityId", "asOf", "createdAt", "releasedAt", "sectionIds", "claims",
      "accessClass", "analysisOnly", "uncertainty", "canonicalArtifactHash", "provenanceReference",
      "revisionOfArtifactId", "supersedesArtifactId",
    ]);
    for (const key of ["domainEvidenceKind", "id", "version", "producerInstitutionId", "sourceOwnerId",
      "observationAuthorityId", "asOf", "createdAt", "releasedAt", "accessClass",
      "canonicalArtifactHash", "provenanceReference"] as const) requireString(artifact[key], `${field}.${key}`);
    requireNullableString(artifact.producingOfficeId, `${field}.producingOfficeId`);
    requireNullableString(artifact.authoringOfficeholderAssignmentId, `${field}.authoringOfficeholderAssignmentId`);
    requireStringArray(artifact.sourceOccurrenceIds, `${field}.sourceOccurrenceIds`);
    requireStringArray(artifact.sectionIds, `${field}.sectionIds`);
    requireStringArray(artifact.uncertainty, `${field}.uncertainty`);
    requireBoolean(artifact.analysisOnly, `${field}.analysisOnly`);
    requireNullableString(artifact.revisionOfArtifactId, `${field}.revisionOfArtifactId`);
    requireNullableString(artifact.supersedesArtifactId, `${field}.supersedesArtifactId`);
    requireArray(artifact.claims, `${field}.claims`).forEach((value, index) => {
      const claim = requireRecord(value, `${field}.claims[${index}]`);
      requireExactKeys(claim, `${field}.claims[${index}]`, [
        "id", "sectionId", "claimFamily", "value", "sourceOwnerId", "sourceRecordId",
        "sourceRecordHash", "observedAt", "observationAuthorityId",
      ]);
      for (const key of ["id", "sectionId", "claimFamily", "sourceOwnerId", "sourceRecordId",
        "sourceRecordHash", "observedAt", "observationAuthorityId"] as const) {
        requireString(claim[key], `${field}.claims[${index}].${key}`);
      }
      if (!(claim.value === null || ["string", "number", "boolean"].includes(typeof claim.value) ||
        Array.isArray(claim.value) && claim.value.every((entry) => typeof entry === "string"))) {
        throw new Error(`Invalid presidential operating save: ${field}.claims[${index}].value is unsupported.`);
      }
    });
    return;
  }
  if (artifact.kind === "I5_OFFICE_COMMUNICATION") {
    requireExactKeys(artifact, field, [
      "kind", "communicationKind", "id", "version", "producingOfficeId",
      "authoringOfficeholderAssignmentId", "sourceInstrumentId", "sourceDispositionId",
      "sourceAssignmentId", "recipientActorOrInstitutionIds", "behaviorPayload", "asOf", "createdAt",
      "releasedAt", "sectionIds", "accessClass", "provenanceReference", "revisionOfArtifactId",
      "supersedesArtifactId",
    ]);
    for (const key of ["communicationKind", "id", "version", "producingOfficeId",
      "authoringOfficeholderAssignmentId", "sourceInstrumentId", "sourceDispositionId", "sourceAssignmentId",
      "asOf", "createdAt", "releasedAt", "accessClass", "provenanceReference"] as const) {
      requireString(artifact[key], `${field}.${key}`);
    }
    requireStringArray(artifact.recipientActorOrInstitutionIds, `${field}.recipientActorOrInstitutionIds`);
    requireRecord(artifact.behaviorPayload, `${field}.behaviorPayload`);
    requireStringArray(artifact.sectionIds, `${field}.sectionIds`);
    requireNullableString(artifact.revisionOfArtifactId, `${field}.revisionOfArtifactId`);
    requireNullableString(artifact.supersedesArtifactId, `${field}.supersedesArtifactId`);
    return;
  }
  throw new Error(`Invalid presidential operating save: ${field}.kind is unsupported.`);
};

const validateOfficeArtifactProduction = (value: unknown, field: string): void => {
  const record = requireRecord(value, field);
  requireExactKeys(record, field, [
    "id",
    "artifactId",
    "producingOfficeId",
    "producingOfficeholderAssignmentId",
    "producedAt",
    "provenanceReference",
  ]);
  for (const key of Object.keys(record)) requireString(record[key], `${field}.${key}`);
};

const validateInstitutionArtifactObservation = (value: unknown, field: string): void => {
  const record = requireRecord(value, field);
  requireExactKeys(record, field, [
    "id",
    "artifactId",
    "observingInstitutionId",
    "observationAuthorityId",
    "observedAt",
    "provenanceReference",
  ]);
  for (const key of Object.keys(record)) requireString(record[key], `${field}.${key}`);
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
    "outcomeProvenanceReference",
  ]);
  for (const key of ["id", "requestingOfficeId", "artifactId", "metadataNoticeId", "requestedAt", "completedAt", "result"] as const) {
    requireString(record[key], `${field}.${key}`);
  }
  requireStringArray(record.requestedSectionIds, `${field}.requestedSectionIds`);
  requireNullableString(record.evaluatedEntitlementId, `${field}.evaluatedEntitlementId`);
  requireNullableString(record.failureReason, `${field}.failureReason`);
  requireNullableString(record.outcomeProvenanceReference, `${field}.outcomeProvenanceReference`);
  if (!["AVAILABLE_AT_OFFICE_BOUNDARY", "ACCESS_DENIED", "NOT_FOUND", "FAILED"].includes(record.result as string)) {
    throw new Error(`Invalid presidential operating save: ${field}.result is unsupported.`);
  }
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
  if (source.kind === "EXTERNAL_OWNER_DELIVERY") {
    requireExactKeys(source, field, ["kind", "sourceOwnerId", "deliveryAuthorityId"]);
    requireString(source.sourceOwnerId, `${field}.sourceOwnerId`);
    requireString(source.deliveryAuthorityId, `${field}.deliveryAuthorityId`);
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
    "institutionArtifactObservations",
    "officeArtifactProductions",
    "institutionPossessions",
    "indexEntries",
    "metadataNotices",
    "accessEntitlements",
    "retrievals",
    "receipts",
  ]);
  const validators: readonly [string, (value: unknown, field: string) => void][] = [
    ["artifacts", validateArtifact],
    ["institutionArtifactObservations", validateInstitutionArtifactObservation],
    ["officeArtifactProductions", validateOfficeArtifactProduction],
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

const validateEscalationPresentation = (value: unknown, field: string): void => {
  const record = requireRecord(value, field);
  requireExactKeys(record, field, [
    "id",
    "deduplicationIdentity",
    "sourceEscalationId",
    "recipientBindingId",
    "recipientActorId",
    "constitutionalOfficeId",
    "presentingOfficeId",
    "presenterOfficeholderAssignmentId",
    "presentedAt",
    "shownSectionIds",
    "shownOptionIds",
    "shownPreviewIds",
    "shownPreviewHashes",
    "referencedButNotShownSourcePortions",
    "purpose",
    "provenanceReference",
  ]);
  for (const key of [
    "id",
    "deduplicationIdentity",
    "sourceEscalationId",
    "recipientBindingId",
    "recipientActorId",
    "constitutionalOfficeId",
    "presentingOfficeId",
    "presenterOfficeholderAssignmentId",
    "presentedAt",
    "purpose",
    "provenanceReference",
  ] as const) requireString(record[key], `${field}.${key}`);
  for (const key of [
    "shownSectionIds",
    "shownOptionIds",
    "shownPreviewIds",
    "shownPreviewHashes",
  ] as const) requireStringArray(record[key], `${field}.${key}`);
  requireArray(
    record.referencedButNotShownSourcePortions,
    `${field}.referencedButNotShownSourcePortions`,
  ).forEach((entry, index) => {
    const portion = requireRecord(entry, `${field}.referencedButNotShownSourcePortions[${index}]`);
    requireExactKeys(portion, `${field}.referencedButNotShownSourcePortions[${index}]`, [
      "artifactId",
      "sectionId",
    ]);
    requireString(portion.artifactId, `${field}.referencedButNotShownSourcePortions[${index}].artifactId`);
    requireString(portion.sectionId, `${field}.referencedButNotShownSourcePortions[${index}].sectionId`);
  });
};

const validatePresentationHistoryState = (value: unknown, field: string): void => {
  const state = requireRecord(value, field);
  requireExactKeys(state, field, ["presentations", "escalationPresentations"]);
  requireArray(state.presentations, `${field}.presentations`).forEach(
    (entry, index) => validatePresentation(entry, `${field}.presentations[${index}]`),
  );
  requireArray(state.escalationPresentations, `${field}.escalationPresentations`).forEach(
    (entry, index) => validateEscalationPresentation(
      entry,
      `${field}.escalationPresentations[${index}]`,
    ),
  );
};

const validateInstrumentAttachment = (value: unknown, field: string): void => {
  const record = requireRecord(value, field);
  requireExactKeys(record, field, ["artifactId", "sectionIds", "shownToPresident"]);
  requireString(record.artifactId, `${field}.artifactId`);
  requireStringArray(record.sectionIds, `${field}.sectionIds`);
  requireBoolean(record.shownToPresident, `${field}.shownToPresident`);
};

const validateInstrumentPayload = (value: unknown, field: string): void => {
  const payload = requireRecord(value, field);
  const kind = requireString(payload.kind, `${field}.kind`);
  const common = [
    "kind",
    "payloadVersion",
    "recipientOfficeId",
    "subjectScopeFamily",
    "requestedAct",
    "sourceReferenceIds",
    "attachmentMetadata",
    "authorityBasis",
    "requestedResponseDeadline",
  ];
  if (kind === "REQUEST_OFFICE_ANALYSIS") {
    requireExactKeys(payload, field, [
      ...common,
      "requestedQuestion",
      "requestedProductKind",
      "evidenceArtifactId",
      "evidenceSectionIds",
      "knownAccessLimitation",
      "narrowingPermitted",
    ]);
    for (const key of [
      "requestedQuestion",
      "requestedProductKind",
      "evidenceArtifactId",
    ] as const) requireString(payload[key], `${field}.${key}`);
    requireStringArray(payload.evidenceSectionIds, `${field}.evidenceSectionIds`);
    requireNullableString(payload.knownAccessLimitation, `${field}.knownAccessLimitation`);
    requireBoolean(payload.narrowingPermitted, `${field}.narrowingPermitted`);
  } else if (kind === "REQUEST_WORKSTREAM_COORDINATION") {
    requireExactKeys(payload, field, [
      ...common,
      "workstreamId",
      "coordinationObjective",
      "participatingOfficeIds",
      "requestedReviewAt",
      "permittedCoordinationActions",
    ]);
    for (const key of [
      "workstreamId",
      "coordinationObjective",
      "requestedReviewAt",
    ] as const) requireString(payload[key], `${field}.${key}`);
    requireStringArray(payload.participatingOfficeIds, `${field}.participatingOfficeIds`);
    requireStringArray(payload.permittedCoordinationActions, `${field}.permittedCoordinationActions`);
  } else if (kind === "AUTHORIZE_LEGISLATIVE_POSITION") {
    requireExactKeys(payload, field, [
      ...common, "initiativeId", "proposalVersion", "positionKind", "negotiableTermIds",
      "evidenceReferenceIds", "narrowingPermitted",
    ]);
    requireString(payload.initiativeId, `${field}.initiativeId`);
    requireSafeInteger(payload.proposalVersion, `${field}.proposalVersion`);
    requireString(payload.positionKind, `${field}.positionKind`);
    requireStringArray(payload.negotiableTermIds, `${field}.negotiableTermIds`);
    requireStringArray(payload.evidenceReferenceIds, `${field}.evidenceReferenceIds`);
    requireBoolean(payload.narrowingPermitted, `${field}.narrowingPermitted`);
  } else if (kind === "REQUEST_INTERGOVERNMENTAL_CONTACT") {
    requireExactKeys(payload, field, [
      ...common, "governorActorIds", "purposeFamily", "talkingPoints", "prohibitedCommitmentKinds",
      "narrowingPermitted",
    ]);
    requireStringArray(payload.governorActorIds, `${field}.governorActorIds`);
    requireString(payload.purposeFamily, `${field}.purposeFamily`);
    requireStringArray(payload.talkingPoints, `${field}.talkingPoints`);
    requireStringArray(payload.prohibitedCommitmentKinds, `${field}.prohibitedCommitmentKinds`);
    requireBoolean(payload.narrowingPermitted, `${field}.narrowingPermitted`);
  } else if (kind === "AUTHORIZE_PUBLIC_STATEMENT") {
    requireExactKeys(payload, field, [
      ...common, "subjectFamily", "approvedClaims", "limitations", "sourceSectionReferences",
      "prohibitedUnsupportedClaimFamilies", "releaseWindowEndsAt", "narrowingPermitted",
    ]);
    requireString(payload.subjectFamily, `${field}.subjectFamily`);
    requireStringArray(payload.approvedClaims, `${field}.approvedClaims`);
    requireStringArray(payload.limitations, `${field}.limitations`);
    requireArray(payload.sourceSectionReferences, `${field}.sourceSectionReferences`).forEach((value, index) => {
      const source = requireRecord(value, `${field}.sourceSectionReferences[${index}]`);
      requireExactKeys(source, `${field}.sourceSectionReferences[${index}]`, ["artifactId", "sectionId"]);
      requireString(source.artifactId, `${field}.sourceSectionReferences[${index}].artifactId`);
      requireString(source.sectionId, `${field}.sourceSectionReferences[${index}].sectionId`);
    });
    requireStringArray(payload.prohibitedUnsupportedClaimFamilies, `${field}.prohibitedUnsupportedClaimFamilies`);
    requireString(payload.releaseWindowEndsAt, `${field}.releaseWindowEndsAt`);
    requireBoolean(payload.narrowingPermitted, `${field}.narrowingPermitted`);
  } else throw new Error(`Invalid presidential operating save: ${field}.kind is unsupported.`);
  for (const key of [
    "payloadVersion",
    "recipientOfficeId",
    "subjectScopeFamily",
    "requestedAct",
    "authorityBasis",
    "requestedResponseDeadline",
  ] as const) requireString(payload[key], `${field}.${key}`);
  requireStringArray(payload.sourceReferenceIds, `${field}.sourceReferenceIds`);
  requireArray(payload.attachmentMetadata, `${field}.attachmentMetadata`).forEach(
    (entry, index) => validateInstrumentAttachment(entry, `${field}.attachmentMetadata[${index}]`),
  );
};

const validateInstrumentPreview = (value: unknown, field: string): void => {
  const record = requireRecord(value, field);
  requireExactKeys(record, field, [
    "id",
    "payload",
    "payloadHash",
    "bundlePosition",
    "provenanceReference",
  ]);
  requireString(record.id, `${field}.id`);
  validateInstrumentPayload(record.payload, `${field}.payload`);
  requireString(record.payloadHash, `${field}.payloadHash`);
  requireSafeInteger(record.bundlePosition, `${field}.bundlePosition`);
  requireString(record.provenanceReference, `${field}.provenanceReference`);
};

const validateEscalationOption = (value: unknown, field: string): void => {
  const option = requireRecord(value, field);
  const kind = requireString(option.kind, `${field}.kind`);
  if (kind === "REQUEST_SCOPED_ANALYSIS_AND_COORDINATION" ||
    kind === "AUTHORIZE_LEGISLATIVE_POSITION_OPTION" ||
    kind === "REQUEST_INTERGOVERNMENTAL_CONTACT_OPTION" ||
    kind === "AUTHORIZE_PUBLIC_STATEMENT_OPTION") {
    requireExactKeys(option, field, ["id", "kind", "previews"]);
  } else if (kind === "RESERVE_PRESIDENTIAL_REVIEW") {
    requireExactKeys(option, field, [
      "id",
      "kind",
      "previews",
      "reservedAt",
      "reviewQuestion",
      "expectedSourceReferenceIds",
    ]);
    requireString(option.reservedAt, `${field}.reservedAt`);
    requireString(option.reviewQuestion, `${field}.reviewQuestion`);
    requireStringArray(option.expectedSourceReferenceIds, `${field}.expectedSourceReferenceIds`);
  } else if (kind === "ALLOW_MONITORING_DEFAULT") {
    requireExactKeys(option, field, ["id", "kind", "previews"]);
  } else throw new Error(`Invalid presidential operating save: ${field}.kind is unsupported.`);
  requireString(option.id, `${field}.id`);
  requireArray(option.previews, `${field}.previews`).forEach(
    (entry, index) => validateInstrumentPreview(entry, `${field}.previews[${index}]`),
  );
};

const validatePresidentialKnownPortion = (value: unknown, field: string): void => {
  const portion = requireRecord(value, field);
  requireExactKeys(portion, field, ["presentationId", "artifactId", "sectionId"]);
  requireString(portion.presentationId, `${field}.presentationId`);
  requireString(portion.artifactId, `${field}.artifactId`);
  requireString(portion.sectionId, `${field}.sectionId`);
};

const validateStaffOnlyPortion = (value: unknown, field: string): void => {
  const portion = requireRecord(value, field);
  requireExactKeys(portion, field, ["artifactId", "sectionId"]);
  requireString(portion.artifactId, `${field}.artifactId`);
  requireString(portion.sectionId, `${field}.sectionId`);
};

const validateEscalation = (value: unknown, field: string): void => {
  const record = requireRecord(value, field);
  requireExactKeys(record, field, [
    "id",
    "deduplicationIdentity",
    "escalatingOfficeId",
    "escalatingOfficeholderAssignmentId",
    "createdAt",
    "basisKind",
    "basisArtifactId",
    "basisReceiptId",
    "sourceRecordIds",
    "presidentKnownPortions",
    "staffOnlySourcePortions",
    "requestedJudgment",
    "knownClaims",
    "uncertainties",
    "limitations",
    "options",
    "expiresAt",
    "defaultRule",
    "downstreamResolverOfficeIds",
    "provenanceReference",
  ]);
  for (const key of [
    "id",
    "deduplicationIdentity",
    "escalatingOfficeId",
    "escalatingOfficeholderAssignmentId",
    "createdAt",
    "basisKind",
    "basisArtifactId",
    "requestedJudgment",
    "expiresAt",
    "provenanceReference",
  ] as const) requireString(record[key], `${field}.${key}`);
  requireNullableString(record.basisReceiptId, `${field}.basisReceiptId`);
  for (const key of [
    "sourceRecordIds",
    "uncertainties",
    "limitations",
    "downstreamResolverOfficeIds",
  ] as const) requireStringArray(record[key], `${field}.${key}`);
  requireArray(record.presidentKnownPortions, `${field}.presidentKnownPortions`).forEach(
    (entry, index) => validatePresidentialKnownPortion(entry, `${field}.presidentKnownPortions[${index}]`),
  );
  requireArray(record.staffOnlySourcePortions, `${field}.staffOnlySourcePortions`).forEach(
    (entry, index) => validateStaffOnlyPortion(entry, `${field}.staffOnlySourcePortions[${index}]`),
  );
  requireArray(record.knownClaims, `${field}.knownClaims`).forEach((entry, index) => {
    const claim = requireRecord(entry, `${field}.knownClaims[${index}]`);
    requireExactKeys(claim, `${field}.knownClaims[${index}]`, ["claim", "sourceReferenceIds"]);
    requireString(claim.claim, `${field}.knownClaims[${index}].claim`);
    requireStringArray(claim.sourceReferenceIds, `${field}.knownClaims[${index}].sourceReferenceIds`);
  });
  requireArray(record.options, `${field}.options`).forEach(
    (entry, index) => validateEscalationOption(entry, `${field}.options[${index}]`),
  );
  const defaultRule = requireRecord(record.defaultRule, `${field}.defaultRule`);
  requireExactKeys(defaultRule, `${field}.defaultRule`, [
    "presidentialInstrumentOutcome",
    "officeMonitoringOutcome",
  ]);
  requireString(defaultRule.presidentialInstrumentOutcome, `${field}.defaultRule.presidentialInstrumentOutcome`);
  requireString(defaultRule.officeMonitoringOutcome, `${field}.defaultRule.officeMonitoringOutcome`);
};

const validateEscalationLifecycle = (value: unknown, field: string): void => {
  const record = requireRecord(value, field);
  requireExactKeys(record, field, [
    "id",
    "deduplicationIdentity",
    "escalationId",
    "kind",
    "occurredAt",
    "actingOfficeId",
    "actingOfficeholderAssignmentId",
    "causeRecordId",
    "provenanceReference",
  ]);
  for (const key of [
    "id",
    "deduplicationIdentity",
    "escalationId",
    "kind",
    "occurredAt",
    "causeRecordId",
    "provenanceReference",
  ] as const) requireString(record[key], `${field}.${key}`);
  requireNullableString(record.actingOfficeId, `${field}.actingOfficeId`);
  requireNullableString(record.actingOfficeholderAssignmentId, `${field}.actingOfficeholderAssignmentId`);
};

const validateDefaultOccurrence = (value: unknown, field: string): void => {
  const record = requireRecord(value, field);
  requireExactKeys(record, field, [
    "id",
    "deduplicationIdentity",
    "escalationId",
    "occurredAt",
    "outcome",
    "provenanceReference",
  ]);
  for (const key of Object.keys(record)) requireString(record[key], `${field}.${key}`);
};

const validateReservedReview = (value: unknown, field: string): void => {
  const record = requireRecord(value, field);
  requireExactKeys(record, field, [
    "id",
    "deduplicationIdentity",
    "sourceEscalationId",
    "sourceDecisionId",
    "reservedAt",
    "reviewQuestion",
    "priorPresentationIds",
    "expectedSourceReferenceIds",
    "provenanceReference",
  ]);
  for (const key of [
    "id",
    "deduplicationIdentity",
    "sourceEscalationId",
    "sourceDecisionId",
    "reservedAt",
    "reviewQuestion",
    "provenanceReference",
  ] as const) requireString(record[key], `${field}.${key}`);
  requireStringArray(record.priorPresentationIds, `${field}.priorPresentationIds`);
  requireStringArray(record.expectedSourceReferenceIds, `${field}.expectedSourceReferenceIds`);
};

const validateReservedReviewLifecycle = (value: unknown, field: string): void => {
  const record = requireRecord(value, field);
  requireExactKeys(record, field, [
    "id",
    "deduplicationIdentity",
    "reservationId",
    "kind",
    "occurredAt",
    "actingOfficeId",
    "actingOfficeholderAssignmentId",
    "causeRecordId",
    "provenanceReference",
  ]);
  for (const key of Object.keys(record)) requireString(record[key], `${field}.${key}`);
};

const validateEscalationOwnerState = (value: unknown, field: string): void => {
  const state = requireRecord(value, field);
  requireExactKeys(state, field, [
    "escalations",
    "lifecycleOccurrences",
    "defaultOccurrences",
    "reservedReviews",
    "reservedReviewLifecycleOccurrences",
  ]);
  requireArray(state.escalations, `${field}.escalations`).forEach(
    (entry, index) => validateEscalation(entry, `${field}.escalations[${index}]`),
  );
  requireArray(state.lifecycleOccurrences, `${field}.lifecycleOccurrences`).forEach(
    (entry, index) => validateEscalationLifecycle(entry, `${field}.lifecycleOccurrences[${index}]`),
  );
  requireArray(state.defaultOccurrences, `${field}.defaultOccurrences`).forEach(
    (entry, index) => validateDefaultOccurrence(entry, `${field}.defaultOccurrences[${index}]`),
  );
  requireArray(state.reservedReviews, `${field}.reservedReviews`).forEach(
    (entry, index) => validateReservedReview(entry, `${field}.reservedReviews[${index}]`),
  );
  requireArray(state.reservedReviewLifecycleOccurrences, `${field}.reservedReviewLifecycleOccurrences`).forEach(
    (entry, index) => validateReservedReviewLifecycle(
      entry,
      `${field}.reservedReviewLifecycleOccurrences[${index}]`,
    ),
  );
};

const validateWorkstream = (value: unknown, field: string): void => {
  const record = requireRecord(value, field);
  requireExactKeys(record, field, [
    "id",
    "label",
    "adoptedObjective",
    "creatingOfficeId",
    "creatingOfficeholderAssignmentId",
    "authorityReference",
    "coordinatorOfficeId",
    "participatingOfficeIds",
    "createdAt",
    "provenanceReference",
    "initialSourceReferenceIds",
    "initialReviewAt",
  ]);
  for (const key of Object.keys(record).filter((key) =>
    !["participatingOfficeIds", "initialSourceReferenceIds"].includes(key))) {
    requireString(record[key], `${field}.${key}`);
  }
  requireStringArray(record.participatingOfficeIds, `${field}.participatingOfficeIds`);
  requireStringArray(record.initialSourceReferenceIds, `${field}.initialSourceReferenceIds`);
};

const validateWorkstreamTransition = (value: unknown, field: string): void => {
  const record = requireRecord(value, field);
  requireExactKeys(record, field, [
    "id",
    "deduplicationIdentity",
    "workstreamId",
    "priorTransitionId",
    "status",
    "actingOfficeId",
    "actingOfficeholderAssignmentId",
    "sourceOccurrenceIds",
    "occurredAt",
    "reason",
    "provenanceReference",
  ]);
  for (const key of [
    "id",
    "deduplicationIdentity",
    "workstreamId",
    "status",
    "actingOfficeId",
    "actingOfficeholderAssignmentId",
    "occurredAt",
    "reason",
    "provenanceReference",
  ] as const) requireString(record[key], `${field}.${key}`);
  requireNullableString(record.priorTransitionId, `${field}.priorTransitionId`);
  requireStringArray(record.sourceOccurrenceIds, `${field}.sourceOccurrenceIds`);
};

const validateWorkstreamOwnerState = (value: unknown, field: string): void => {
  const state = requireRecord(value, field);
  requireExactKeys(state, field, ["workstreams", "transitions"]);
  requireArray(state.workstreams, `${field}.workstreams`).forEach(
    (entry, index) => validateWorkstream(entry, `${field}.workstreams[${index}]`),
  );
  requireArray(state.transitions, `${field}.transitions`).forEach(
    (entry, index) => validateWorkstreamTransition(entry, `${field}.transitions[${index}]`),
  );
};

const validateDecision = (value: unknown, field: string): void => {
  const record = requireRecord(value, field);
  const sourceKind = requireString(record.sourceKind, `${field}.sourceKind`);
  const common = [
    "sourceKind",
    "id",
    "deduplicationIdentity",
    "controlBindingId",
    "presidentActorId",
    "constitutionalOfficeId",
    "sourceEscalationId",
    "selectedOptionId",
    "selectedOptionKind",
    "previewIds",
    "previewHashes",
    "decidedAt",
    "basisEscalationPresentationId",
    "acknowledgedUncertainties",
    "authorizedInstrumentIds",
    "reservedReviewId",
    "deliberateDefaultRuleReference",
    "provenanceReference",
    "supersedesDecisionId",
  ];
  if (sourceKind === "ESCALATION_PRESENTATION") {
    requireExactKeys(record, field, common);
  } else if (sourceKind === "INQUIRY_PREVIEW_PRESENTATION") {
    requireExactKeys(record, field, [
      ...common,
      "sourceInquiryOpportunityId",
      "inquiryPreviewPresentationId",
    ]);
    requireString(record.sourceInquiryOpportunityId, `${field}.sourceInquiryOpportunityId`);
    requireString(record.inquiryPreviewPresentationId, `${field}.inquiryPreviewPresentationId`);
  } else {
    throw new Error(`Invalid presidential operating save: ${field}.sourceKind is unsupported.`);
  }
  for (const key of [
    "id",
    "deduplicationIdentity",
    "controlBindingId",
    "presidentActorId",
    "constitutionalOfficeId",
    "selectedOptionId",
    "selectedOptionKind",
    "decidedAt",
    "provenanceReference",
  ] as const) requireString(record[key], `${field}.${key}`);
  if (sourceKind === "ESCALATION_PRESENTATION") {
    requireString(record.sourceEscalationId, `${field}.sourceEscalationId`);
    requireString(record.basisEscalationPresentationId, `${field}.basisEscalationPresentationId`);
  } else {
    if (record.sourceEscalationId !== null || record.basisEscalationPresentationId !== null) {
      throw new Error(`Invalid presidential operating save: ${field} inquiry decision has escalation truth.`);
    }
  }
  for (const key of [
    "previewIds",
    "previewHashes",
    "acknowledgedUncertainties",
    "authorizedInstrumentIds",
  ] as const) requireStringArray(record[key], `${field}.${key}`);
  for (const key of [
    "reservedReviewId",
    "deliberateDefaultRuleReference",
    "supersedesDecisionId",
  ] as const) requireNullableString(record[key], `${field}.${key}`);
};

const validateInstrument = (value: unknown, field: string): void => {
  const record = requireRecord(value, field);
  requireExactKeys(record, field, [
    "id",
    "deduplicationIdentity",
    "authorizingDecisionId",
    "selectedOptionId",
    "sourcePreviewId",
    "sourcePreviewHash",
    "issuingPresidentActorId",
    "issuingConstitutionalOfficeId",
    "issuedAt",
    "provenanceReference",
    "revisionOfInstrumentId",
    "supersedesInstrumentId",
    "payload",
  ]);
  for (const key of [
    "id",
    "deduplicationIdentity",
    "authorizingDecisionId",
    "selectedOptionId",
    "sourcePreviewId",
    "sourcePreviewHash",
    "issuingPresidentActorId",
    "issuingConstitutionalOfficeId",
    "issuedAt",
    "provenanceReference",
  ] as const) requireString(record[key], `${field}.${key}`);
  requireNullableString(record.revisionOfInstrumentId, `${field}.revisionOfInstrumentId`);
  requireNullableString(record.supersedesInstrumentId, `${field}.supersedesInstrumentId`);
  validateInstrumentPayload(record.payload, `${field}.payload`);
};

const validateDispatch = (value: unknown, field: string): void => {
  const record = requireRecord(value, field);
  requireExactKeys(record, field, [
    "id",
    "deduplicationIdentity",
    "instrumentId",
    "recipientOfficeId",
    "dispatchingOfficeId",
    "dispatchPath",
    "attemptedAt",
    "outcome",
    "deliveredAt",
    "failureReason",
    "outcomeProvenanceReference",
    "retryOfDispatchId",
  ]);
  for (const key of [
    "id",
    "deduplicationIdentity",
    "instrumentId",
    "recipientOfficeId",
    "dispatchingOfficeId",
    "dispatchPath",
    "attemptedAt",
    "outcome",
    "outcomeProvenanceReference",
  ] as const) requireString(record[key], `${field}.${key}`);
  requireNullableString(record.deliveredAt, `${field}.deliveredAt`);
  requireNullableString(record.failureReason, `${field}.failureReason`);
  requireNullableString(record.retryOfDispatchId, `${field}.retryOfDispatchId`);
};

const validateRecordArray = (
  value: unknown,
  field: string,
  validate: (entry: unknown, entryField: string) => void,
): void => requireArray(value, field).forEach(
  (entry, index) => validate(entry, `${field}[${index}]`),
);

const validateHistoricalIndexState = (value: unknown, field: string): void => {
  const state = requireRecord(value, field);
  requireExactKeys(state, field, ["historyId", "entries"]);
  requireString(state.historyId, `${field}.historyId`);
  requireArray(state.entries, `${field}.entries`).forEach((entry, index) => {
    const entryField = `${field}.entries[${index}]`;
    const record = requireRecord(entry, entryField);
    requireExactKeys(record, entryField, [
      "historyId",
      "occurrenceId",
      "ownerId",
      "recordKind",
      "occurredAt",
      "ownerRecordId",
      "causalParentOccurrenceIds",
    ]);
    for (const key of [
      "historyId",
      "occurrenceId",
      "ownerId",
      "recordKind",
      "occurredAt",
      "ownerRecordId",
    ] as const) requireString(record[key], `${entryField}.${key}`);
    requireStringArray(record.causalParentOccurrenceIds, `${entryField}.causalParentOccurrenceIds`);
  });
};

const validateProgramImplementationState = (value: unknown, field: string): void => {
  const state = requireRecord(value, field);
  requireExactKeys(state, field, [
    "schemaVersion",
    "sourceArtifactId",
    "detailCoverage",
    "nationalBalance",
    "legalOrder",
    "publicFinance",
    "ownerResolution",
    "fiscalExecution",
    "administrativeProgram",
    "intergovernmental",
    "recipientAdministration",
    "materialInputs",
    "coverage",
  ]);
  requireSafeInteger(state.schemaVersion, `${field}.schemaVersion`);
  requireString(state.sourceArtifactId, `${field}.sourceArtifactId`);
  requireString(state.detailCoverage, `${field}.detailCoverage`);
  requireString(state.nationalBalance, `${field}.nationalBalance`);
  for (const key of [
    "legalOrder",
    "publicFinance",
    "ownerResolution",
    "fiscalExecution",
    "administrativeProgram",
    "intergovernmental",
    "recipientAdministration",
  ] as const) requireRecord(state[key], `${field}.${key}`);
  requireArray(state.materialInputs, `${field}.materialInputs`);
  requireArray(state.coverage, `${field}.coverage`);
};

const validateIntegratedMaterialHousingState = (value: unknown, field: string): void => {
  const state = requireRecord(value, field);
  requireExactKeys(state, field, [
    "schemaVersion",
    "sourceArtifactId",
    "catchmentScaffoldVersion",
    "materialCalibrationVersion",
    "controls",
    "regions",
    "projects",
    "acceptedInputs",
    "materialConditions",
    "materialExposureReferences",
    "calibration",
    "behavior",
  ]);
  requireSafeInteger(state.schemaVersion, `${field}.schemaVersion`);
  for (const key of [
    "sourceArtifactId",
    "catchmentScaffoldVersion",
    "materialCalibrationVersion",
  ] as const) requireString(state[key], `${field}.${key}`);
  for (const key of [
    "controls",
    "regions",
    "projects",
    "acceptedInputs",
    "materialConditions",
    "materialExposureReferences",
  ] as const) requireArray(state[key], `${field}.${key}`);
  requireRecord(state.calibration, `${field}.calibration`);
  requireRecord(state.behavior, `${field}.behavior`);
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
    "presidentialEscalations",
    "administrationWorkstreams",
    "presidentialDecisions",
    "presidentialInstruments",
    "instrumentDispatches",
    "historicalRecordIndex",
    "programImplementation",
    "materialHousing",
    "regionalEmployment",
    "congressionalInitiative",
    "externalActors",
    "boundedMedia",
    "maternityServiceAccess",
    "presidentialInquiries",
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
  validateOwner(
    ownerStates.presidentialEscalations,
    "operatingState.ownerStates.presidentialEscalations",
    validateEscalationOwnerState,
  );
  validateOwner(
    ownerStates.administrationWorkstreams,
    "operatingState.ownerStates.administrationWorkstreams",
    validateWorkstreamOwnerState,
  );
  validateOwner(
    ownerStates.presidentialDecisions,
    "operatingState.ownerStates.presidentialDecisions",
    (ownerState, field) => validateRecordArray(ownerState, field, validateDecision),
  );
  validateOwner(
    ownerStates.presidentialInstruments,
    "operatingState.ownerStates.presidentialInstruments",
    (ownerState, field) => validateRecordArray(ownerState, field, validateInstrument),
  );
  validateOwner(
    ownerStates.instrumentDispatches,
    "operatingState.ownerStates.instrumentDispatches",
    (ownerState, field) => validateRecordArray(ownerState, field, validateDispatch),
  );
  validateOwner(
    ownerStates.historicalRecordIndex,
    "operatingState.ownerStates.historicalRecordIndex",
    validateHistoricalIndexState,
  );
  validateProgramImplementationState(
    ownerStates.programImplementation,
    "operatingState.ownerStates.programImplementation",
  );
  validateIntegratedMaterialHousingState(
    ownerStates.materialHousing,
    "operatingState.ownerStates.materialHousing",
  );
  const concurrentOwnerShapes: readonly [string, readonly string[]][] = [
    ["regionalEmployment", ["cells", "materialOccurrences", "evidenceReleases"]],
    ["congressionalInitiative", [
      "formationOpportunity", "procedureOpportunity", "externalReceipts", "eligibilityAssessments",
      "formationDecisions", "legislativeRuntime", "windowLifecycleOccurrences", "attemptAuthorizations",
      "transitionAttempts",
    ]],
    ["externalActors", ["actorIds", "receipts", "assessments", "actions"]],
    ["boundedMedia", ["outletIds", "receipts", "editorialDecisions", "stories", "distributionAttempts", "exposures"]],
    ["maternityServiceAccess", [
      "facilityId", "serviceAreaId", "effectiveCapacity", "catchmentCount", "currentTravelBurdenMinutes",
      "materialHistory", "evidenceArtifactIds",
    ]],
    ["presidentialInquiries", ["opportunities", "previewPresentations", "initiatedRequestDecisionIds", "lifecycleOccurrences"]],
  ];
  for (const [key, stateKeys] of concurrentOwnerShapes) {
    validateOwner(ownerStates[key], `operatingState.ownerStates.${key}`, (ownerState, ownerField) => {
      const record = requireRecord(ownerState, ownerField);
      requireExactKeys(record, ownerField, stateKeys);
    });
  }
  return JSON.parse(JSON.stringify(state)) as PresidentialOperatingRuntimeState;
};

export const serializePresidentialOperatingSave = (
  state: PresidentialOperatingRuntimeState,
  configuration: PresidentialOperatingRuntimeConfiguration,
  controlBinding: PresidentialControlBindingState = {
    id: configuration.intervention.controlBinding.id,
    decisionSurface: PRESIDENTIAL_OPERATING_DECISION_SURFACE,
    executiveOfficeId: configuration.administration.presidentialRecipientBinding.constitutionalOfficeId,
    boundOfficeholderActorId: configuration.administration.presidentialRecipientBinding.actorId,
    status: "ACTIVE",
    endedAt: null,
    endReason: null,
  },
): string => {
  assertPresidentialOperatingRuntimeState(state, configuration);
  assertPresidentialControlBinding(
    controlBinding,
    configuration.intervention,
    state.ownerStates,
    state.ownerStates.calendar.state.current,
  );
  return JSON.stringify({
    formatVersion: PRESIDENTIAL_OPERATING_SAVE_FORMAT_VERSION,
    configuration: { ...configuration.identity },
    operatingState: copyPresidentialOperatingRuntimeState(state),
    session: { controlBinding: { ...controlBinding } },
  } satisfies PresidentialOperatingSaveV5);
};

export const parsePresidentialOperatingSave = (
  serializedSave: string,
  configuration: PresidentialOperatingRuntimeConfiguration,
): RestoredPresidentialOperatingSave => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(serializedSave) as unknown;
  } catch {
    throw new Error("Invalid presidential operating save: serialized data is not valid JSON.");
  }
  const envelope = requireRecord(parsed, "save envelope");
  requireExactKeys(envelope, "save envelope", [
    "formatVersion",
    "configuration",
    "operatingState",
    "session",
  ]);
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
  const session = requireRecord(envelope.session, "session");
  requireExactKeys(session, "session", ["controlBinding"]);
  const binding = requireRecord(session.controlBinding, "session.controlBinding");
  requireExactKeys(binding, "session.controlBinding", [
    "id",
    "decisionSurface",
    "executiveOfficeId",
    "boundOfficeholderActorId",
    "status",
    "endedAt",
    "endReason",
  ]);
  for (const key of [
    "id",
    "decisionSurface",
    "executiveOfficeId",
    "boundOfficeholderActorId",
    "status",
  ] as const) requireString(binding[key], `session.controlBinding.${key}`);
  if (
    binding.decisionSurface !== PRESIDENTIAL_OPERATING_DECISION_SURFACE ||
    (binding.status !== "ACTIVE" && binding.status !== "ENDED") ||
    (binding.endReason !== null &&
      binding.endReason !== "BOUND_OFFICEHOLDER_CHANGED" &&
      binding.endReason !== "TERM_ENDED")
  ) throw new Error("Invalid presidential operating save: ControlBinding enum value is unsupported.");
  requireNullableString(binding.endedAt, "session.controlBinding.endedAt");
  requireNullableString(binding.endReason, "session.controlBinding.endReason");
  const controlBinding = JSON.parse(JSON.stringify(binding)) as PresidentialControlBindingState;
  assertPresidentialControlBinding(
    controlBinding,
    configuration.intervention,
    state.ownerStates,
    state.ownerStates.calendar.state.current,
  );
  return {
    operatingState: copyPresidentialOperatingRuntimeState(state),
    session: { controlBinding: { ...controlBinding } },
  };
};

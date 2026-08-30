import {
  artifactSectionIds,
  assertEffectiveOfficeholder,
  assertPresidentialAdministrationOwnerStates,
  findArtifact,
  isEffectiveAt,
  type AssessmentArtifact,
  type AssessmentPropositionJudgment,
  type ConfiguredAssessmentRule,
  type InformationIndexEntry,
  type InformationRetrievalRecord,
  type InstitutionPossessionRecord,
  type OfficeMetadataNotice,
  type OfficeOperationsState,
  type OfficeWorkAssignment,
  type OfficeWorkAssignmentStatus,
  type PresidentialAdministrationConfiguration,
  type PresidentialAdministrationOwnerStates,
  type PresidentialPresentationRecord,
  type PresentedArtifactPortion,
  type PreservedAssessmentJudgment,
  type SubstantiveOfficeReceipt,
  type SynthesisArtifact,
} from "./presidential-office-information";

const requireNonempty = (value: string, field: string): void => {
  if (value.trim().length === 0) throw new Error(`${field} is required.`);
};

const requireUnique = (values: readonly string[], field: string): void => {
  if (new Set(values).size !== values.length) throw new Error(`${field} require unique identities.`);
};

const instant = (value: string, field: string): number => {
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) throw new Error(`${field} must be a valid configured instant.`);
  return parsed;
};

const sortedByTimeAndId = <T>(
  values: readonly T[],
  timeOf: (value: T) => string,
  idOf: (value: T) => string,
): readonly T[] => [...values].sort((left, right) =>
  instant(timeOf(left), `${idOf(left)} ordering time`) - instant(timeOf(right), `${idOf(right)} ordering time`) ||
  idOf(left).localeCompare(idOf(right)));

const begin = (
  state: PresidentialAdministrationOwnerStates,
  configuration: PresidentialAdministrationConfiguration,
  epoch: string,
  current: string,
): void => assertPresidentialAdministrationOwnerStates(state, configuration, epoch, current);

const finish = (
  state: PresidentialAdministrationOwnerStates,
  configuration: PresidentialAdministrationConfiguration,
  epoch: string,
  current: string,
): PresidentialAdministrationOwnerStates => {
  assertPresidentialAdministrationOwnerStates(state, configuration, epoch, current);
  return state;
};

const updateOffice = (
  state: PresidentialAdministrationOwnerStates,
  officeId: string,
  update: (office: OfficeOperationsState) => OfficeOperationsState,
): PresidentialAdministrationOwnerStates => {
  if (!state.officeOperations.state.some((office) => office.officeId === officeId)) {
    throw new Error(`Unknown presidential office ${officeId}.`);
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

export interface CreateOfficeWorkAssignmentInput {
  readonly id: string;
  readonly requesterId: string;
  readonly leadOfficeId: string;
  readonly objective: string;
  readonly sourceReferenceIds: readonly string[];
  readonly requiredConsultationOfficeIds: readonly string[];
  readonly authorityReference: string;
  readonly deadline: string;
  readonly expectedProductKind: string;
}

export const createOfficeWorkAssignment = (
  state: PresidentialAdministrationOwnerStates,
  configuration: PresidentialAdministrationConfiguration,
  epoch: string,
  current: string,
  input: CreateOfficeWorkAssignmentInput,
): PresidentialAdministrationOwnerStates => {
  begin(state, configuration, epoch, current);
  if (state.officeOperations.state.some((office) => office.assignments.some((entry) => entry.id === input.id))) {
    throw new Error(`Office work assignment ${input.id} already exists.`);
  }
  requireNonempty(input.id, "Office work-assignment identity");
  requireNonempty(input.requesterId, `${input.id} requester`);
  requireNonempty(input.objective, `${input.id} objective`);
  requireNonempty(input.authorityReference, `${input.id} authority`);
  requireNonempty(input.expectedProductKind, `${input.id} expected product`);
  requireUnique(input.sourceReferenceIds, `${input.id} source references`);
  requireUnique(input.requiredConsultationOfficeIds, `${input.id} consultation offices`);
  if (instant(input.deadline, `${input.id} deadline`) < instant(current, "Current operating time")) {
    throw new Error(`Office work assignment ${input.id} cannot begin after its deadline.`);
  }
  const assignment: OfficeWorkAssignment = {
    ...input,
    sourceReferenceIds: [...input.sourceReferenceIds],
    requiredConsultationOfficeIds: [...input.requiredConsultationOfficeIds],
    createdAt: current,
    status: "QUEUED",
    statusUpdatedAt: current,
    failureReason: null,
    statusProvenanceReferenceId: null,
    resultArtifactIds: [],
    supersededByAssignmentId: null,
  };
  return finish(updateOffice(state, input.leadOfficeId, (office) => ({
    ...office,
    assignments: [...office.assignments, assignment].sort((left, right) => left.id.localeCompare(right.id)),
    activeQueueAssignmentIds: [...office.activeQueueAssignmentIds, assignment.id],
  })), configuration, epoch, current);
};

const allowedAssignmentTransitions: Readonly<Record<OfficeWorkAssignmentStatus, readonly OfficeWorkAssignmentStatus[]>> = {
  QUEUED: ["IN_PROGRESS", "BLOCKED", "DELAYED", "REFUSED", "CANCELLED", "SUPERSEDED"],
  IN_PROGRESS: ["BLOCKED", "COMPLETED", "DELAYED", "REFUSED", "CANCELLED", "SUPERSEDED"],
  BLOCKED: ["QUEUED", "IN_PROGRESS", "CANCELLED", "SUPERSEDED"],
  DELAYED: ["QUEUED", "IN_PROGRESS", "CANCELLED", "SUPERSEDED"],
  COMPLETED: [],
  REFUSED: [],
  CANCELLED: [],
  SUPERSEDED: [],
};

export interface TransitionOfficeWorkAssignmentInput {
  readonly officeId: string;
  readonly assignmentId: string;
  readonly status: OfficeWorkAssignmentStatus;
  readonly reason: string | null;
  readonly statusProvenanceReferenceId: string | null;
  readonly resultArtifactIds: readonly string[];
  readonly supersededByAssignmentId: string | null;
}

export const transitionOfficeWorkAssignment = (
  state: PresidentialAdministrationOwnerStates,
  configuration: PresidentialAdministrationConfiguration,
  epoch: string,
  current: string,
  input: TransitionOfficeWorkAssignmentInput,
): PresidentialAdministrationOwnerStates => {
  begin(state, configuration, epoch, current);
  return finish(updateOffice(state, input.officeId, (office) => {
    const assignment = office.assignments.find((entry) => entry.id === input.assignmentId);
    if (assignment === undefined) throw new Error(`Office ${input.officeId} does not own assignment ${input.assignmentId}.`);
    if (!allowedAssignmentTransitions[assignment.status].includes(input.status)) {
      throw new Error(`Assignment ${input.assignmentId} cannot transition from ${assignment.status} to ${input.status}.`);
    }
    requireUnique(input.resultArtifactIds, `${input.assignmentId} result artifacts`);
    if (input.status === "COMPLETED" && input.resultArtifactIds.length === 0) {
      throw new Error(`Completed assignment ${input.assignmentId} requires a result artifact.`);
    }
    if (input.status !== "COMPLETED" && input.resultArtifactIds.length !== 0) {
      throw new Error(`Only completed assignments may attach result artifacts.`);
    }
    if (["BLOCKED", "DELAYED", "REFUSED", "CANCELLED"].includes(input.status) && input.reason === null) {
      throw new Error(`Assignment ${input.assignmentId} requires a reason for ${input.status}.`);
    }
    if (input.status === "SUPERSEDED" && input.supersededByAssignmentId === null) {
      throw new Error(`Superseded assignment ${input.assignmentId} requires its successor identity.`);
    }
    const terminal = ["COMPLETED", "REFUSED", "CANCELLED", "SUPERSEDED"].includes(input.status);
    const transitioned: OfficeWorkAssignment = {
      ...assignment,
      status: input.status,
      statusUpdatedAt: current,
      failureReason: input.reason,
      statusProvenanceReferenceId: input.statusProvenanceReferenceId,
      resultArtifactIds: [...input.resultArtifactIds],
      supersededByAssignmentId: input.supersededByAssignmentId,
    };
    return {
      ...office,
      assignments: office.assignments.map((entry) => entry.id === transitioned.id ? transitioned : entry),
      activeQueueAssignmentIds: terminal
        ? office.activeQueueAssignmentIds.filter((id) => id !== transitioned.id)
        : office.activeQueueAssignmentIds,
    };
  }), configuration, epoch, current);
};

export const reorderOfficeQueue = (
  state: PresidentialAdministrationOwnerStates,
  configuration: PresidentialAdministrationConfiguration,
  epoch: string,
  current: string,
  officeId: string,
  orderedAssignmentIds: readonly string[],
): PresidentialAdministrationOwnerStates => {
  begin(state, configuration, epoch, current);
  return finish(updateOffice(state, officeId, (office) => {
    requireUnique(orderedAssignmentIds, `${officeId} reordered queue`);
    const expected = [...office.activeQueueAssignmentIds].sort();
    const actual = [...orderedAssignmentIds].sort();
    if (JSON.stringify(expected) !== JSON.stringify(actual)) {
      throw new Error(`Office ${officeId} queue reorder must preserve its active assignment set.`);
    }
    return { ...office, activeQueueAssignmentIds: [...orderedAssignmentIds] };
  }), configuration, epoch, current);
};

export interface RecordInstitutionPossessionInput {
  readonly id: string;
  readonly artifactId: string;
  readonly possessingInstitutionId: string;
  readonly acquisitionProvenanceReference: string;
}

export const recordInstitutionPossession = (
  state: PresidentialAdministrationOwnerStates,
  configuration: PresidentialAdministrationConfiguration,
  epoch: string,
  current: string,
  input: RecordInstitutionPossessionInput,
): PresidentialAdministrationOwnerStates => {
  begin(state, configuration, epoch, current);
  const artifact = findArtifact(state, input.artifactId);
  if (
    artifact?.kind !== "SOURCE_EVIDENCE" ||
    artifact.producerInstitutionId !== input.possessingInstitutionId
  ) throw new Error("Institution possession requires its configured source artifact.");
  if (state.informationRoutes.state.institutionPossessions.some((entry) =>
    entry.id === input.id ||
    (entry.artifactId === input.artifactId && entry.possessingInstitutionId === input.possessingInstitutionId))) {
    throw new Error(`Institution possession ${input.id} is duplicate.`);
  }
  requireNonempty(input.acquisitionProvenanceReference, `${input.id} acquisition provenance`);
  const record: InstitutionPossessionRecord = { ...input, possessedAt: current };
  const next: PresidentialAdministrationOwnerStates = {
    ...state,
    informationRoutes: {
      ...state.informationRoutes,
      state: {
        ...state.informationRoutes.state,
        institutionPossessions: sortedByTimeAndId(
          [...state.informationRoutes.state.institutionPossessions, record],
          (entry) => entry.possessedAt,
          (entry) => entry.id,
        ),
      },
    },
  };
  return finish(next, configuration, epoch, current);
};

export interface CreateInformationIndexEntryInput {
  readonly id: string;
  readonly artifactId: string;
  readonly sourcePossessionId: string;
  readonly provenanceReference: string;
}

export const createInformationIndexEntry = (
  state: PresidentialAdministrationOwnerStates,
  configuration: PresidentialAdministrationConfiguration,
  epoch: string,
  current: string,
  input: CreateInformationIndexEntryInput,
): PresidentialAdministrationOwnerStates => {
  begin(state, configuration, epoch, current);
  const ledger = state.informationRoutes.state;
  const artifact = findArtifact(state, input.artifactId);
  const possession = ledger.institutionPossessions.find((entry) => entry.id === input.sourcePossessionId);
  if (artifact?.kind !== "SOURCE_EVIDENCE" || possession?.artifactId !== artifact.id) {
    throw new Error(`Information index ${input.id} requires valid institution possession.`);
  }
  if (ledger.indexEntries.some((entry) => entry.id === input.id || entry.artifactId === input.artifactId)) {
    throw new Error(`Information index ${input.id} is duplicate.`);
  }
  const entry: InformationIndexEntry = {
    id: input.id,
    artifactId: artifact.id,
    sourcePossessionId: possession.id,
    sourceInstitutionId: possession.possessingInstitutionId,
    artifactVersion: artifact.version,
    accessClass: artifact.accessClass,
    availableSectionIds: [...artifact.sectionIds],
    createdAt: current,
    provenanceReference: input.provenanceReference,
  };
  const next: PresidentialAdministrationOwnerStates = {
    ...state,
    informationRoutes: {
      ...state.informationRoutes,
      state: {
        ...ledger,
        indexEntries: sortedByTimeAndId(
          [...ledger.indexEntries, entry],
          (candidate) => candidate.createdAt,
          (candidate) => candidate.id,
        ),
      },
    },
  };
  return finish(next, configuration, epoch, current);
};

export interface DeliverOfficeMetadataNoticeInput {
  readonly id: string;
  readonly indexEntryId: string;
  readonly recipientOfficeId: string;
  readonly deliveryPath: string;
  readonly deduplicationIdentity: string;
}

export const deliverOfficeMetadataNotice = (
  state: PresidentialAdministrationOwnerStates,
  configuration: PresidentialAdministrationConfiguration,
  epoch: string,
  current: string,
  input: DeliverOfficeMetadataNoticeInput,
): PresidentialAdministrationOwnerStates => {
  begin(state, configuration, epoch, current);
  const ledger = state.informationRoutes.state;
  if (!ledger.indexEntries.some((entry) => entry.id === input.indexEntryId)) {
    throw new Error(`Metadata notice ${input.id} requires an existing information index.`);
  }
  if (!configuration.offices.some((office) => office.id === input.recipientOfficeId)) {
    throw new Error(`Metadata notice ${input.id} has an unknown recipient office.`);
  }
  if (ledger.metadataNotices.some((entry) =>
    entry.id === input.id || entry.deduplicationIdentity === input.deduplicationIdentity)) {
    throw new Error(`Metadata notice ${input.id} is duplicate.`);
  }
  requireNonempty(input.deliveryPath, `${input.id} delivery path`);
  requireNonempty(input.deduplicationIdentity, `${input.id} deduplication identity`);
  const notice: OfficeMetadataNotice = { ...input, noticedAt: current };
  const next: PresidentialAdministrationOwnerStates = {
    ...state,
    informationRoutes: {
      ...state.informationRoutes,
      state: {
        ...ledger,
        metadataNotices: sortedByTimeAndId(
          [...ledger.metadataNotices, notice],
          (entry) => entry.noticedAt,
          (entry) => entry.id,
        ),
      },
    },
  };
  return finish(next, configuration, epoch, current);
};

export interface AttemptOfficeRetrievalInput {
  readonly id: string;
  readonly requestingOfficeId: string;
  readonly artifactId: string;
  readonly requestedSectionIds: readonly string[];
  readonly metadataNoticeId: string;
}

export const attemptOfficeRetrieval = (
  state: PresidentialAdministrationOwnerStates,
  configuration: PresidentialAdministrationConfiguration,
  epoch: string,
  current: string,
  input: AttemptOfficeRetrievalInput,
): PresidentialAdministrationOwnerStates => {
  begin(state, configuration, epoch, current);
  const ledger = state.informationRoutes.state;
  if (ledger.retrievals.some((entry) => entry.id === input.id)) {
    throw new Error(`Information retrieval ${input.id} already exists.`);
  }
  requireUnique(input.requestedSectionIds, `${input.id} requested sections`);
  if (input.requestedSectionIds.length === 0) throw new Error(`Information retrieval ${input.id} requires section scope.`);
  const notice = ledger.metadataNotices.find((entry) => entry.id === input.metadataNoticeId);
  const index = notice === undefined ? undefined : ledger.indexEntries.find((entry) => entry.id === notice.indexEntryId);
  if (
    notice === undefined ||
    index === undefined ||
    notice.recipientOfficeId !== input.requestingOfficeId ||
    index.artifactId !== input.artifactId ||
    input.requestedSectionIds.some((id) => !index.availableSectionIds.includes(id))
  ) throw new Error(`Information retrieval ${input.id} lacks an office-scoped metadata route.`);
  const entitlement = ledger.accessEntitlements.find((entry) =>
    entry.officeId === input.requestingOfficeId &&
    entry.artifactId === input.artifactId &&
    isEffectiveAt(entry.effectiveFrom, entry.effectiveUntil, current) &&
    input.requestedSectionIds.every((id) => entry.sectionIds.includes(id)));
  const record: InformationRetrievalRecord = {
    ...input,
    requestedSectionIds: [...input.requestedSectionIds],
    requestedAt: current,
    completedAt: current,
    evaluatedEntitlementId: entitlement?.id ?? null,
    result: entitlement === undefined ? "ACCESS_DENIED" : "AVAILABLE_AT_OFFICE_BOUNDARY",
    failureReason: entitlement === undefined ? "NO_ACTIVE_ENTITLEMENT_FOR_REQUESTED_SCOPE" : null,
  };
  const next: PresidentialAdministrationOwnerStates = {
    ...state,
    informationRoutes: {
      ...state.informationRoutes,
      state: {
        ...ledger,
        retrievals: sortedByTimeAndId(
          [...ledger.retrievals, record],
          (entry) => entry.requestedAt,
          (entry) => entry.id,
        ),
      },
    },
  };
  return finish(next, configuration, epoch, current);
};

export interface AdmitSubstantiveOfficeReceiptInput {
  readonly id: string;
  readonly recipientOfficeId: string;
  readonly artifactId: string;
  readonly receivedSectionIds: readonly string[];
  readonly retrievalId: string;
  readonly receivingAuthorityReference: string;
  readonly deduplicationIdentity: string;
}

export const admitSubstantiveOfficeReceipt = (
  state: PresidentialAdministrationOwnerStates,
  configuration: PresidentialAdministrationConfiguration,
  epoch: string,
  current: string,
  input: AdmitSubstantiveOfficeReceiptInput,
): PresidentialAdministrationOwnerStates => {
  begin(state, configuration, epoch, current);
  const ledger = state.informationRoutes.state;
  const retrieval = ledger.retrievals.find((entry) => entry.id === input.retrievalId);
  if (
    retrieval === undefined ||
    retrieval.result !== "AVAILABLE_AT_OFFICE_BOUNDARY" ||
    retrieval.requestingOfficeId !== input.recipientOfficeId ||
    retrieval.artifactId !== input.artifactId ||
    input.receivedSectionIds.some((id) => !retrieval.requestedSectionIds.includes(id))
  ) throw new Error(`Substantive receipt ${input.id} requires a matching successful retrieval.`);
  if (input.receivedSectionIds.length === 0) throw new Error(`Substantive receipt ${input.id} requires content scope.`);
  requireUnique(input.receivedSectionIds, `${input.id} received sections`);
  if (ledger.receipts.some((entry) =>
    entry.id === input.id || entry.deduplicationIdentity === input.deduplicationIdentity)) {
    throw new Error(`Substantive receipt ${input.id} is duplicate.`);
  }
  const receipt: SubstantiveOfficeReceipt = {
    id: input.id,
    recipientOfficeId: input.recipientOfficeId,
    artifactId: input.artifactId,
    receivedSectionIds: [...input.receivedSectionIds],
    source: { kind: "TECHNICAL_RETRIEVAL", retrievalId: input.retrievalId },
    receivedAt: current,
    receivingAuthorityReference: input.receivingAuthorityReference,
    deduplicationIdentity: input.deduplicationIdentity,
  };
  const next: PresidentialAdministrationOwnerStates = {
    ...state,
    informationRoutes: {
      ...state.informationRoutes,
      state: {
        ...ledger,
        receipts: sortedByTimeAndId(
          [...ledger.receipts, receipt],
          (entry) => entry.receivedAt,
          (entry) => entry.id,
        ),
      },
    },
  };
  return finish(next, configuration, epoch, current);
};

export interface TransferOfficeArtifactInput {
  readonly id: string;
  readonly sourceOfficeId: string;
  readonly sourceOfficeholderAssignmentId: string;
  readonly recipientOfficeId: string;
  readonly artifactId: string;
  readonly receivedSectionIds: readonly string[];
  readonly receivingAuthorityReference: string;
  readonly deduplicationIdentity: string;
}

export const transferOfficeArtifact = (
  state: PresidentialAdministrationOwnerStates,
  configuration: PresidentialAdministrationConfiguration,
  epoch: string,
  current: string,
  input: TransferOfficeArtifactInput,
): PresidentialAdministrationOwnerStates => {
  begin(state, configuration, epoch, current);
  const artifact = findArtifact(state, input.artifactId);
  if (
    artifact === undefined ||
    artifact.kind === "SOURCE_EVIDENCE" ||
    artifact.producingOfficeId !== input.sourceOfficeId ||
    input.receivedSectionIds.some((id) => !artifactSectionIds(artifact).includes(id))
  ) throw new Error(`Office transfer ${input.id} requires a source-office artifact and valid scope.`);
  assertEffectiveOfficeholder(state, input.sourceOfficeholderAssignmentId, input.sourceOfficeId, current);
  if (!configuration.offices.some((office) => office.id === input.recipientOfficeId)) {
    throw new Error(`Office transfer ${input.id} has an unknown recipient.`);
  }
  const ledger = state.informationRoutes.state;
  if (ledger.receipts.some((entry) =>
    entry.id === input.id || entry.deduplicationIdentity === input.deduplicationIdentity)) {
    throw new Error(`Office transfer receipt ${input.id} is duplicate.`);
  }
  requireUnique(input.receivedSectionIds, `${input.id} transferred sections`);
  if (input.receivedSectionIds.length === 0) throw new Error(`Office transfer ${input.id} requires content scope.`);
  const receipt: SubstantiveOfficeReceipt = {
    id: input.id,
    recipientOfficeId: input.recipientOfficeId,
    artifactId: input.artifactId,
    receivedSectionIds: [...input.receivedSectionIds],
    source: {
      kind: "OFFICE_ARTIFACT_TRANSFER",
      sourceOfficeId: input.sourceOfficeId,
      sourceOfficeholderAssignmentId: input.sourceOfficeholderAssignmentId,
    },
    receivedAt: current,
    receivingAuthorityReference: input.receivingAuthorityReference,
    deduplicationIdentity: input.deduplicationIdentity,
  };
  const next: PresidentialAdministrationOwnerStates = {
    ...state,
    informationRoutes: {
      ...state.informationRoutes,
      state: {
        ...ledger,
        receipts: sortedByTimeAndId(
          [...ledger.receipts, receipt],
          (entry) => entry.receivedAt,
          (entry) => entry.id,
        ),
      },
    },
  };
  return finish(next, configuration, epoch, current);
};

const ruleJudgment = (rule: ConfiguredAssessmentRule): AssessmentPropositionJudgment => ({
  ruleId: rule.id,
  propositionId: rule.propositionId,
  judgment: rule.judgment,
});

export interface AuthorOfficeAssessmentInput {
  readonly id: string;
  readonly version: string;
  readonly sectionIds: readonly string[];
  readonly producingOfficeId: string;
  readonly authoringOfficeholderAssignmentId: string;
  readonly assignmentId: string | null;
  readonly sourceReceiptIds: readonly string[];
  readonly sourceRetrievalIds: readonly string[];
  readonly sourceMetadataNoticeIds: readonly string[];
  readonly judgmentRuleIds: readonly string[];
  readonly claimedConfidence: string;
  readonly evidentiarySupport: string;
  readonly assumptionIds: readonly string[];
  readonly limitations: readonly string[];
  readonly recommendation: string | null;
  readonly provenanceReference: string;
  readonly revisionOfArtifactId: string | null;
  readonly supersedesArtifactId: string | null;
}

export const authorOfficeAssessment = (
  state: PresidentialAdministrationOwnerStates,
  configuration: PresidentialAdministrationConfiguration,
  epoch: string,
  current: string,
  input: AuthorOfficeAssessmentInput,
): PresidentialAdministrationOwnerStates => {
  begin(state, configuration, epoch, current);
  if (findArtifact(state, input.id) !== undefined) throw new Error(`Assessment artifact ${input.id} already exists.`);
  assertEffectiveOfficeholder(state, input.authoringOfficeholderAssignmentId, input.producingOfficeId, current);
  requireUnique(input.sectionIds, `${input.id} sections`);
  requireUnique(input.sourceReceiptIds, `${input.id} source receipts`);
  requireUnique(input.sourceRetrievalIds, `${input.id} source retrievals`);
  requireUnique(input.sourceMetadataNoticeIds, `${input.id} source notices`);
  requireUnique(input.judgmentRuleIds, `${input.id} judgment rules`);
  requireUnique(input.assumptionIds, `${input.id} assumptions`);
  if (input.sectionIds.length === 0 || input.judgmentRuleIds.length === 0) {
    throw new Error(`Assessment ${input.id} requires sections and at least one judgment rule.`);
  }
  const rules = input.judgmentRuleIds.map((id) => {
    const rule = configuration.assessmentRules.find((entry) => entry.id === id);
    if (rule === undefined) throw new Error(`Assessment ${input.id} references unknown judgment rule ${id}.`);
    return rule;
  });
  const receipts = input.sourceReceiptIds.map((id) => {
    const receipt = state.informationRoutes.state.receipts.find((entry) => entry.id === id);
    if (receipt === undefined || receipt.recipientOfficeId !== input.producingOfficeId) {
      throw new Error(`Assessment ${input.id} lacks office-owned receipt ${id}.`);
    }
    return receipt;
  });
  const sourceLineage = [...new Set(receipts.map((receipt) => receipt.artifactId))]
    .sort()
    .map((artifactId) => ({
      artifactId,
      sectionIds: [...new Set(receipts
        .filter((receipt) => receipt.artifactId === artifactId)
        .flatMap((receipt) => receipt.receivedSectionIds))].sort(),
    }));
  const artifact: AssessmentArtifact = {
    kind: "ASSESSMENT",
    id: input.id,
    version: input.version,
    sectionIds: [...input.sectionIds],
    producingOfficeId: input.producingOfficeId,
    authoringOfficeholderAssignmentId: input.authoringOfficeholderAssignmentId,
    assignmentId: input.assignmentId,
    sourceReceiptIds: [...input.sourceReceiptIds],
    sourceRetrievalIds: [...input.sourceRetrievalIds],
    sourceMetadataNoticeIds: [...input.sourceMetadataNoticeIds],
    sourceLineage,
    asOf: current,
    createdAt: current,
    judgments: rules.map(ruleJudgment),
    claimedConfidence: input.claimedConfidence,
    evidentiarySupport: input.evidentiarySupport,
    assumptionIds: [...input.assumptionIds],
    limitations: [...input.limitations],
    recommendation: input.recommendation,
    provenanceReference: input.provenanceReference,
    revisionOfArtifactId: input.revisionOfArtifactId,
    supersedesArtifactId: input.supersedesArtifactId,
  };
  const ledger = state.informationRoutes.state;
  const next: PresidentialAdministrationOwnerStates = {
    ...state,
    informationRoutes: {
      ...state.informationRoutes,
      state: {
        ...ledger,
        artifacts: sortedByTimeAndId(
          [...ledger.artifacts, artifact],
          (entry) => entry.createdAt,
          (entry) => entry.id,
        ),
      },
    },
  };
  return finish(next, configuration, epoch, current);
};

export interface AuthorOfficeSynthesisInput {
  readonly id: string;
  readonly version: string;
  readonly sectionIds: readonly string[];
  readonly producingOfficeId: string;
  readonly authoringOfficeholderAssignmentId: string;
  readonly sourceAssessmentReceiptIds: readonly string[];
  readonly synthesisJudgment: string;
  readonly limitations: readonly string[];
  readonly provenanceReference: string;
  readonly revisionOfArtifactId: string | null;
  readonly supersedesArtifactId: string | null;
}

export const authorOfficeSynthesis = (
  state: PresidentialAdministrationOwnerStates,
  configuration: PresidentialAdministrationConfiguration,
  epoch: string,
  current: string,
  input: AuthorOfficeSynthesisInput,
): PresidentialAdministrationOwnerStates => {
  begin(state, configuration, epoch, current);
  if (findArtifact(state, input.id) !== undefined) throw new Error(`Synthesis artifact ${input.id} already exists.`);
  assertEffectiveOfficeholder(state, input.authoringOfficeholderAssignmentId, input.producingOfficeId, current);
  requireUnique(input.sectionIds, `${input.id} sections`);
  requireUnique(input.sourceAssessmentReceiptIds, `${input.id} assessment receipts`);
  if (input.sectionIds.length === 0 || input.sourceAssessmentReceiptIds.length < 2) {
    throw new Error(`Synthesis ${input.id} requires sections and at least two assessment receipts.`);
  }
  const assessments = input.sourceAssessmentReceiptIds.map((receiptId) => {
    const receipt = state.informationRoutes.state.receipts.find((entry) => entry.id === receiptId);
    const artifact = receipt === undefined ? undefined : findArtifact(state, receipt.artifactId);
    if (
      receipt === undefined ||
      receipt.recipientOfficeId !== input.producingOfficeId ||
      artifact?.kind !== "ASSESSMENT"
    ) throw new Error(`Synthesis ${input.id} lacks received assessment ${receiptId}.`);
    return artifact;
  });
  requireUnique(assessments.map((entry) => entry.id), `${input.id} assessment artifacts`);
  const preservedAssessments: readonly PreservedAssessmentJudgment[] = assessments.map((assessment) => ({
    assessmentArtifactId: assessment.id,
    judgments: assessment.judgments.map((entry) => ({ ...entry })),
    limitations: [...assessment.limitations],
  }));
  const artifact: SynthesisArtifact = {
    kind: "SYNTHESIS",
    id: input.id,
    version: input.version,
    sectionIds: [...input.sectionIds],
    producingOfficeId: input.producingOfficeId,
    authoringOfficeholderAssignmentId: input.authoringOfficeholderAssignmentId,
    sourceAssessmentReceiptIds: [...input.sourceAssessmentReceiptIds],
    sourceAssessmentArtifactIds: assessments.map((entry) => entry.id),
    preservedAssessments,
    synthesisJudgment: input.synthesisJudgment,
    limitations: [...input.limitations],
    asOf: current,
    createdAt: current,
    provenanceReference: input.provenanceReference,
    revisionOfArtifactId: input.revisionOfArtifactId,
    supersedesArtifactId: input.supersedesArtifactId,
  };
  const ledger = state.informationRoutes.state;
  const next: PresidentialAdministrationOwnerStates = {
    ...state,
    informationRoutes: {
      ...state.informationRoutes,
      state: {
        ...ledger,
        artifacts: sortedByTimeAndId(
          [...ledger.artifacts, artifact],
          (entry) => entry.createdAt,
          (entry) => entry.id,
        ),
      },
    },
  };
  return finish(next, configuration, epoch, current);
};

export interface RecordPresidentialPresentationInput {
  readonly id: string;
  readonly deduplicationIdentity: string;
  readonly presentingOfficeId: string;
  readonly presenterOfficeholderAssignmentId: string;
  readonly shownPortions: readonly PresentedArtifactPortion[];
  readonly referencedButNotShownPortions: readonly PresentedArtifactPortion[];
  readonly purpose: string;
  readonly provenanceReference: string;
  readonly revisionOfPresentationId: string | null;
  readonly supersedesPresentationId: string | null;
}

export const recordPresidentialPresentation = (
  state: PresidentialAdministrationOwnerStates,
  configuration: PresidentialAdministrationConfiguration,
  epoch: string,
  current: string,
  input: RecordPresidentialPresentationInput,
): PresidentialAdministrationOwnerStates => {
  begin(state, configuration, epoch, current);
  const existing = state.presidentialPresentations.state.presentations;
  if (existing.some((entry) =>
    entry.id === input.id || entry.deduplicationIdentity === input.deduplicationIdentity)) {
    throw new Error(`Presidential presentation ${input.id} is duplicate.`);
  }
  assertEffectiveOfficeholder(state, input.presenterOfficeholderAssignmentId, input.presentingOfficeId, current);
  const binding = state.administrationDirectory.state.presidentialRecipientBinding;
  if (!isEffectiveAt(binding.effectiveFrom, binding.effectiveUntil, current)) {
    throw new Error("Presidential recipient binding is not effective at presentation time.");
  }
  requireNonempty(input.purpose, `${input.id} purpose`);
  requireNonempty(input.provenanceReference, `${input.id} provenance`);
  const presentation: PresidentialPresentationRecord = {
    ...input,
    shownPortions: input.shownPortions.map((entry) => ({ ...entry })),
    referencedButNotShownPortions: input.referencedButNotShownPortions.map((entry) => ({ ...entry })),
    recipientBindingId: binding.id,
    recipientActorId: binding.actorId,
    constitutionalOfficeId: binding.constitutionalOfficeId,
    presentedAt: current,
  };
  const next: PresidentialAdministrationOwnerStates = {
    ...state,
    presidentialPresentations: {
      ...state.presidentialPresentations,
      state: {
        presentations: sortedByTimeAndId(
          [...existing, presentation],
          (entry) => entry.presentedAt,
          (entry) => entry.id,
        ),
      },
    },
  };
  return finish(next, configuration, epoch, current);
};

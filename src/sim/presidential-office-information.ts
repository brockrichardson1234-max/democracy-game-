import type {
  EscalationPresentationRecord,
  InstrumentAssignmentAuthorizationBinding,
  OfficeInstrumentReceipt,
  RecipientCapabilityAuthority,
  RecipientInstrumentDisposition,
} from "./presidential-operating-intervention-types";

export const POP0_I2_POPULATION_LINKAGE_STATUS =
  "OUTSIDE_MODELED_ORDINARY_POPULATION_SCOPE" as const;

export const POP0_I2_ALLOWED_ACTOR_JOINS = [
  "ACTOR_IDENTITY",
  "OFFICEHOLDER_ASSIGNMENT",
  "AUTHORED_ARTIFACT",
  "OFFICE_INSTITUTION_INFORMATION_ROUTE",
  "PRESIDENTIAL_RECIPIENT_BINDING",
] as const;

export const POP0_I2_PROHIBITED_ACTOR_JOINS = [
  "RESIDENCE",
  "HOUSEHOLD",
  "DEMOGRAPHIC",
  "DOMESTIC_MATERIAL_EXPOSURE",
  "ORDINARY_POPULATION_INFORMATION_RECIPIENT",
  "ORDINARY_POPULATION_PUBLIC_BELIEF",
  "ELECTORATE_OR_VOTER",
  "ELIGIBILITY",
  "PERSONAL_LIFECYCLE",
] as const;

export interface PresidentialInstitutionConfiguration {
  readonly id: string;
  readonly label: string;
}

export interface PresidentialOfficeConfiguration {
  readonly id: string;
  readonly label: string;
  readonly mandate: string;
  readonly parentInstitutionId: string | null;
}

export interface PresidentialActorConfiguration {
  readonly id: string;
  readonly label: string;
  readonly provenanceReference: string;
}

export interface PresidentialOfficeholderAssignment {
  readonly id: string;
  readonly officeId: string;
  readonly actorId: string;
  readonly effectiveFrom: string;
  readonly effectiveUntil: string | null;
  readonly actingStatus: "CONFIRMED" | "ACTING";
  readonly provenanceReference: string;
}

export interface PresidentialRecipientBinding {
  readonly id: string;
  readonly constitutionalOfficeId: string;
  readonly actorId: string;
  readonly effectiveFrom: string;
  readonly effectiveUntil: string | null;
  readonly provenanceReference: string;
}

export interface PresidentialActorPopulationLinkage {
  readonly actorId: string;
  readonly status: typeof POP0_I2_POPULATION_LINKAGE_STATUS;
  readonly effectiveFrom: string;
  readonly effectiveUntil: string | null;
  readonly populationScope: "POP0_I2_NO_ORDINARY_POPULATION_COMPOSED";
  readonly support: "BOUNDED_CONFIGURED_PROOF_FIXTURE";
  readonly provenanceReference: string;
  readonly populationWeight: 0;
  readonly permittedJoins: readonly (typeof POP0_I2_ALLOWED_ACTOR_JOINS)[number][];
  readonly prohibitedJoins: readonly (typeof POP0_I2_PROHIBITED_ACTOR_JOINS)[number][];
}

export interface SourceEvidenceArtifact {
  readonly kind: "SOURCE_EVIDENCE";
  readonly id: string;
  readonly version: string;
  readonly artifactClass: string;
  readonly producerInstitutionId: string;
  readonly asOf: string;
  readonly createdAt: string;
  readonly releasedAt: string;
  readonly sectionIds: readonly string[];
  readonly accessClass: string;
  readonly provenanceReference: string;
  readonly revisionOfArtifactId: string | null;
  readonly supersedesArtifactId: string | null;
}

export interface AssessmentPropositionJudgment {
  readonly ruleId: string;
  readonly propositionId: string;
  readonly judgment: string;
}

export interface ArtifactSectionLineage {
  readonly artifactId: string;
  readonly sectionIds: readonly string[];
}

export interface AssessmentArtifact {
  readonly kind: "ASSESSMENT";
  readonly id: string;
  readonly version: string;
  readonly sectionIds: readonly string[];
  readonly producingOfficeId: string;
  readonly authoringOfficeholderAssignmentId: string;
  readonly assignmentId: string | null;
  readonly sourceReceiptIds: readonly string[];
  readonly sourceRetrievalIds: readonly string[];
  readonly sourceMetadataNoticeIds: readonly string[];
  readonly sourceLineage: readonly ArtifactSectionLineage[];
  readonly asOf: string;
  readonly createdAt: string;
  readonly judgments: readonly AssessmentPropositionJudgment[];
  readonly claimedConfidence: string;
  readonly evidentiarySupport: string;
  readonly assumptionIds: readonly string[];
  readonly limitations: readonly string[];
  readonly recommendation: string | null;
  readonly provenanceReference: string;
  readonly revisionOfArtifactId: string | null;
  readonly supersedesArtifactId: string | null;
}

export interface PreservedAssessmentJudgment {
  readonly assessmentArtifactId: string;
  readonly judgments: readonly AssessmentPropositionJudgment[];
  readonly limitations: readonly string[];
}

export interface SynthesisArtifact {
  readonly kind: "SYNTHESIS";
  readonly id: string;
  readonly version: string;
  readonly sectionIds: readonly string[];
  readonly producingOfficeId: string;
  readonly authoringOfficeholderAssignmentId: string;
  readonly sourceAssessmentReceiptIds: readonly string[];
  readonly sourceAssessmentArtifactIds: readonly string[];
  readonly preservedAssessments: readonly PreservedAssessmentJudgment[];
  readonly synthesisJudgment: string;
  readonly limitations: readonly string[];
  readonly asOf: string;
  readonly createdAt: string;
  readonly provenanceReference: string;
  readonly revisionOfArtifactId: string | null;
  readonly supersedesArtifactId: string | null;
}

export type PresidentialInformationArtifact =
  | SourceEvidenceArtifact
  | AssessmentArtifact
  | SynthesisArtifact;

export interface ConfiguredAccessEntitlement {
  readonly id: string;
  readonly officeId: string;
  readonly artifactId: string;
  readonly accessClass: string;
  readonly sectionIds: readonly string[];
  readonly effectiveFrom: string;
  readonly effectiveUntil: string | null;
  readonly authorityReference: string;
}

export interface ConfiguredAssessmentRule {
  readonly id: string;
  readonly propositionId: string;
  readonly judgment: string;
  readonly evidenceRequirement: "SUBSTANTIVE_RECEIPT" | "METADATA_WITH_FAILED_RETRIEVAL";
  readonly requiredSectionIds: readonly string[];
  readonly requiredAssumptionIds: readonly string[];
}

export interface PresidentialAdministrationConfiguration {
  readonly ownerIds: {
    readonly administrationDirectory: string;
    readonly officeOperations: string;
    readonly informationRoutes: string;
    readonly presidentialPresentations: string;
  };
  readonly institutions: readonly PresidentialInstitutionConfiguration[];
  readonly offices: readonly PresidentialOfficeConfiguration[];
  readonly actors: readonly PresidentialActorConfiguration[];
  readonly officeholderAssignments: readonly PresidentialOfficeholderAssignment[];
  readonly presidentialRecipientBinding: PresidentialRecipientBinding;
  readonly populationLinkages: readonly PresidentialActorPopulationLinkage[];
  readonly sourceArtifacts: readonly SourceEvidenceArtifact[];
  readonly accessEntitlements: readonly ConfiguredAccessEntitlement[];
  readonly assumptions: readonly {
    readonly id: string;
    readonly label: string;
    readonly provenanceReference: string;
  }[];
  readonly assessmentRules: readonly ConfiguredAssessmentRule[];
  readonly recipientCapabilities: readonly RecipientCapabilityAuthority[];
}

export type OfficeWorkAssignmentStatus =
  | "QUEUED"
  | "IN_PROGRESS"
  | "BLOCKED"
  | "COMPLETED"
  | "DELAYED"
  | "REFUSED"
  | "CANCELLED"
  | "SUPERSEDED";

export interface OfficeWorkAssignment {
  readonly id: string;
  readonly requesterId: string;
  readonly leadOfficeId: string;
  readonly objective: string;
  readonly sourceReferenceIds: readonly string[];
  readonly requiredConsultationOfficeIds: readonly string[];
  readonly authorityReference: string;
  readonly createdAt: string;
  readonly deadline: string;
  readonly expectedProductKind: string;
  readonly status: OfficeWorkAssignmentStatus;
  readonly statusUpdatedAt: string;
  readonly failureReason: string | null;
  readonly statusProvenanceReferenceId: string | null;
  readonly resultArtifactIds: readonly string[];
  readonly supersededByAssignmentId: string | null;
}

export interface OfficeOperationsState {
  readonly officeId: string;
  readonly assignments: readonly OfficeWorkAssignment[];
  readonly activeQueueAssignmentIds: readonly string[];
  readonly deadlineDefaultRecords: readonly {
    readonly id: string;
    readonly assignmentId: string;
    readonly occurredAt: string;
    readonly outcome: "DELAYED" | "CANCELLED";
    readonly provenanceReference: string;
  }[];
  readonly instrumentReceipts: readonly OfficeInstrumentReceipt[];
  readonly instrumentDispositions: readonly RecipientInstrumentDisposition[];
  readonly instrumentAssignmentAuthorizations: readonly InstrumentAssignmentAuthorizationBinding[];
}

export interface AdministrationDirectoryState {
  readonly officeholderAssignments: readonly PresidentialOfficeholderAssignment[];
  readonly presidentialRecipientBinding: PresidentialRecipientBinding;
}

export interface InstitutionPossessionRecord {
  readonly id: string;
  readonly artifactId: string;
  readonly possessingInstitutionId: string;
  readonly possessedAt: string;
  readonly acquisitionProvenanceReference: string;
}

export interface InformationIndexEntry {
  readonly id: string;
  readonly artifactId: string;
  readonly sourcePossessionId: string;
  readonly sourceInstitutionId: string;
  readonly artifactVersion: string;
  readonly accessClass: string;
  readonly availableSectionIds: readonly string[];
  readonly createdAt: string;
  readonly provenanceReference: string;
}

export interface OfficeMetadataNotice {
  readonly id: string;
  readonly indexEntryId: string;
  readonly recipientOfficeId: string;
  readonly noticedAt: string;
  readonly deliveryPath: string;
  readonly deduplicationIdentity: string;
}

export type InformationRetrievalResult =
  | "AVAILABLE_AT_OFFICE_BOUNDARY"
  | "ACCESS_DENIED"
  | "NOT_FOUND"
  | "FAILED";

export interface InformationRetrievalRecord {
  readonly id: string;
  readonly requestingOfficeId: string;
  readonly artifactId: string;
  readonly requestedSectionIds: readonly string[];
  readonly metadataNoticeId: string;
  readonly requestedAt: string;
  readonly completedAt: string;
  readonly evaluatedEntitlementId: string | null;
  readonly result: InformationRetrievalResult;
  readonly failureReason: string | null;
  readonly outcomeProvenanceReference: string | null;
}

export type OfficeReceiptSource =
  | {
      readonly kind: "TECHNICAL_RETRIEVAL";
      readonly retrievalId: string;
    }
  | {
      readonly kind: "OFFICE_ARTIFACT_TRANSFER";
      readonly sourceOfficeId: string;
      readonly sourceOfficeholderAssignmentId: string;
    };

export interface SubstantiveOfficeReceipt {
  readonly id: string;
  readonly recipientOfficeId: string;
  readonly artifactId: string;
  readonly receivedSectionIds: readonly string[];
  readonly source: OfficeReceiptSource;
  readonly receivedAt: string;
  readonly receivingAuthorityReference: string;
  readonly deduplicationIdentity: string;
}

export interface InformationRouteLedgerState {
  readonly artifacts: readonly PresidentialInformationArtifact[];
  readonly institutionPossessions: readonly InstitutionPossessionRecord[];
  readonly indexEntries: readonly InformationIndexEntry[];
  readonly metadataNotices: readonly OfficeMetadataNotice[];
  readonly accessEntitlements: readonly ConfiguredAccessEntitlement[];
  readonly retrievals: readonly InformationRetrievalRecord[];
  readonly receipts: readonly SubstantiveOfficeReceipt[];
}

export interface PresentedArtifactPortion {
  readonly artifactId: string;
  readonly sectionId: string;
}

export interface PresidentialPresentationRecord {
  readonly id: string;
  readonly deduplicationIdentity: string;
  readonly recipientBindingId: string;
  readonly recipientActorId: string;
  readonly constitutionalOfficeId: string;
  readonly presentingOfficeId: string;
  readonly presenterOfficeholderAssignmentId: string;
  readonly presentedAt: string;
  readonly shownPortions: readonly PresentedArtifactPortion[];
  readonly referencedButNotShownPortions: readonly PresentedArtifactPortion[];
  readonly purpose: string;
  readonly provenanceReference: string;
  readonly revisionOfPresentationId: string | null;
  readonly supersedesPresentationId: string | null;
}

export interface PresidentialPresentationHistoryState {
  readonly presentations: readonly PresidentialPresentationRecord[];
  readonly escalationPresentations: readonly EscalationPresentationRecord[];
}

export interface PresidentialAdministrationOwnerStates {
  readonly administrationDirectory: {
    readonly ownerId: string;
    readonly state: AdministrationDirectoryState;
  };
  readonly officeOperations: {
    readonly ownerId: string;
    readonly state: readonly OfficeOperationsState[];
  };
  readonly informationRoutes: {
    readonly ownerId: string;
    readonly state: InformationRouteLedgerState;
  };
  readonly presidentialPresentations: {
    readonly ownerId: string;
    readonly state: PresidentialPresentationHistoryState;
  };
}

export interface OfficeInformationView {
  readonly officeId: string;
  readonly metadataNotices: readonly OfficeMetadataNotice[];
  readonly accessEntitlements: readonly ConfiguredAccessEntitlement[];
  readonly retrievals: readonly InformationRetrievalRecord[];
  readonly receipts: readonly SubstantiveOfficeReceipt[];
  readonly receivedArtifacts: readonly {
    readonly artifactId: string;
    readonly kind: PresidentialInformationArtifact["kind"];
    readonly receivedSectionIds: readonly string[];
  }[];
  readonly authoredArtifactIds: readonly string[];
  readonly instrumentReceipts: readonly OfficeInstrumentReceipt[];
  readonly instrumentDispositions: readonly RecipientInstrumentDisposition[];
}

const copyPlain = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const requireNonempty = (value: string, field: string): void => {
  if (value.trim().length === 0) throw new Error(`${field} is required.`);
};

const instant = (value: string, field: string): number => {
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) throw new Error(`${field} must be a valid configured instant.`);
  return parsed;
};

const requireUnique = (values: readonly string[], field: string): void => {
  if (new Set(values).size !== values.length) throw new Error(`${field} require unique identities.`);
};

const requireExactObjectKeys = (
  value: object,
  field: string,
  expected: readonly string[],
): void => {
  const actual = Object.keys(value).sort();
  if (JSON.stringify(actual) !== JSON.stringify([...expected].sort())) {
    throw new Error(`${field} has an unsupported shape.`);
  }
};

const requireNonemptyUnique = (values: readonly string[], field: string): void => {
  if (values.some((value) => value.trim().length === 0)) throw new Error(`${field} cannot be empty.`);
  requireUnique(values, field);
};

const requireNonemptyValues = (values: readonly string[], field: string): void => {
  if (values.some((value) => value.trim().length === 0)) throw new Error(`${field} cannot be empty.`);
};

const sameValues = (left: readonly string[], right: readonly string[]): boolean =>
  JSON.stringify([...left].sort()) === JSON.stringify([...right].sort());

export const isEffectiveAt = (
  effectiveFrom: string,
  effectiveUntil: string | null,
  at: string,
): boolean => {
  const value = instant(at, "Effective-time query");
  return instant(effectiveFrom, "Effective-from") <= value &&
    (effectiveUntil === null || value < instant(effectiveUntil, "Effective-until"));
};

export const artifactSectionIds = (
  artifact: PresidentialInformationArtifact,
): readonly string[] => artifact.sectionIds;

// POP0-I2 deliberately uses an all-semantic-sections rule: preserving an
// assessment's judgments and limitations requires receipt of every section of
// that assessment. Partial receipts remain valid for storage and forwarding,
// but they do not grant the omitted semantic content to a synthesizing office.
export const assessmentSemanticContentIsReceived = (
  assessment: AssessmentArtifact,
  receivedSectionIds: readonly string[],
): boolean => assessment.sectionIds.every((sectionId) => receivedSectionIds.includes(sectionId));

export const findArtifact = (
  state: PresidentialAdministrationOwnerStates,
  artifactId: string,
): PresidentialInformationArtifact | undefined =>
  state.informationRoutes.state.artifacts.find((artifact) => artifact.id === artifactId);

export const findOfficeholderAssignment = (
  state: PresidentialAdministrationOwnerStates,
  assignmentId: string,
): PresidentialOfficeholderAssignment | undefined =>
  state.administrationDirectory.state.officeholderAssignments.find(
    (assignment) => assignment.id === assignmentId,
  );

export const assertEffectiveOfficeholder = (
  state: PresidentialAdministrationOwnerStates,
  assignmentId: string,
  officeId: string,
  at: string,
): PresidentialOfficeholderAssignment => {
  const assignment = findOfficeholderAssignment(state, assignmentId);
  if (
    assignment === undefined ||
    assignment.officeId !== officeId ||
    !isEffectiveAt(assignment.effectiveFrom, assignment.effectiveUntil, at)
  ) throw new Error(`Officeholder assignment ${assignmentId} is not effective for office ${officeId}.`);
  return assignment;
};

const assertInterval = (
  effectiveFrom: string,
  effectiveUntil: string | null,
  field: string,
): void => {
  const start = instant(effectiveFrom, `${field}.effectiveFrom`);
  if (effectiveUntil !== null && instant(effectiveUntil, `${field}.effectiveUntil`) <= start) {
    throw new Error(`${field} requires a start-inclusive/end-exclusive positive interval.`);
  }
};

export const assertPresidentialAdministrationConfiguration = (
  configuration: PresidentialAdministrationConfiguration,
  epoch: string,
): void => {
  instant(epoch, "Presidential administration epoch");
  const ownerIds = Object.values(configuration.ownerIds);
  ownerIds.forEach((id) => requireNonempty(id, "Administration owner identity"));
  requireUnique(ownerIds, "Administration owner identities");
  if (
    configuration.institutions.length !== 2 ||
    configuration.offices.length !== 6 ||
    configuration.actors.length !== 7 ||
    configuration.officeholderAssignments.length !== 6 ||
    configuration.populationLinkages.length !== 7
  ) throw new Error("POP0-I2 requires exactly two institutions, six offices/holders, and seven linked humans.");

  requireUnique(configuration.institutions.map((entry) => entry.id), "Institution identities");
  requireUnique(configuration.offices.map((entry) => entry.id), "Office identities");
  requireUnique(configuration.actors.map((entry) => entry.id), "Actor identities");
  requireUnique([
    ...configuration.institutions.map((entry) => entry.id),
    ...configuration.offices.map((entry) => entry.id),
    ...configuration.actors.map((entry) => entry.id),
  ], "Institution, office, and actor entity identities");
  requireUnique(configuration.officeholderAssignments.map((entry) => entry.id), "Officeholder assignment identities");
  requireUnique(configuration.populationLinkages.map((entry) => entry.actorId), "Population-linkage actor identities");
  requireUnique(configuration.sourceArtifacts.map((entry) => entry.id), "Source artifact identities");
  requireUnique(configuration.accessEntitlements.map((entry) => entry.id), "Access-entitlement identities");
  requireUnique(configuration.assumptions.map((entry) => entry.id), "Assessment assumption identities");
  requireUnique(configuration.assessmentRules.map((entry) => entry.id), "Assessment-rule identities");
  requireNonemptyUnique(
    configuration.recipientCapabilities.map((entry) => entry.id),
    "Recipient-capability identities",
  );
  if (configuration.recipientCapabilities.length !== 2) {
    throw new Error("POP0-I3 requires exactly two bounded recipient-capability authorities.");
  }

  for (const institution of configuration.institutions) {
    requireNonempty(institution.id, "Institution identity");
    requireNonempty(institution.label, `${institution.id} label`);
  }
  for (const office of configuration.offices) {
    requireNonempty(office.id, "Office identity");
    requireNonempty(office.label, `${office.id} label`);
    requireNonempty(office.mandate, `${office.id} mandate`);
    if (
      office.parentInstitutionId !== null &&
      !configuration.institutions.some((institution) => institution.id === office.parentInstitutionId)
    ) throw new Error(`Office ${office.id} references an unknown parent institution.`);
  }
  for (const actor of configuration.actors) {
    requireNonempty(actor.id, "Actor identity");
    requireNonempty(actor.label, `${actor.id} label`);
    requireNonempty(actor.provenanceReference, `${actor.id} provenance`);
  }
  for (const assignment of configuration.officeholderAssignments) {
    assertInterval(assignment.effectiveFrom, assignment.effectiveUntil, assignment.id);
    if (
      !configuration.offices.some((office) => office.id === assignment.officeId) ||
      !configuration.actors.some((actor) => actor.id === assignment.actorId)
    ) throw new Error(`Officeholder assignment ${assignment.id} has an unknown office or actor.`);
    requireNonempty(assignment.provenanceReference, `${assignment.id} provenance`);
  }
  for (const office of configuration.offices) {
    const active = configuration.officeholderAssignments.filter(
      (assignment) => assignment.officeId === office.id &&
        isEffectiveAt(assignment.effectiveFrom, assignment.effectiveUntil, epoch),
    );
    if (active.length !== 1) throw new Error(`Office ${office.id} requires exactly one active I2 holder.`);
  }
  const activeHolderActorIds = configuration.officeholderAssignments
    .filter((assignment) => isEffectiveAt(assignment.effectiveFrom, assignment.effectiveUntil, epoch))
    .map((assignment) => assignment.actorId);

  const binding = configuration.presidentialRecipientBinding;
  assertInterval(binding.effectiveFrom, binding.effectiveUntil, binding.id);
  if (!configuration.actors.some((actor) => actor.id === binding.actorId)) {
    throw new Error("Presidential recipient binding references an unknown actor.");
  }
  if (!isEffectiveAt(binding.effectiveFrom, binding.effectiveUntil, epoch)) {
    throw new Error("Presidential recipient binding must be effective at the I2 epoch.");
  }
  requireNonempty(binding.constitutionalOfficeId, "Presidential constitutional office identity");
  requireNonempty(binding.provenanceReference, "Presidential recipient provenance");
  if (activeHolderActorIds.includes(binding.actorId)) {
    throw new Error(
      "The configured presidential recipient must be distinct from the six I2 officeholders.",
    );
  }

  for (const actor of configuration.actors) {
    const linkages = configuration.populationLinkages.filter((entry) => entry.actorId === actor.id);
    if (linkages.length !== 1) throw new Error(`Actor ${actor.id} requires exactly one Population linkage.`);
    const linkage = linkages[0];
    requireExactObjectKeys(linkage, `${actor.id} Population linkage`, [
      "actorId",
      "status",
      "effectiveFrom",
      "effectiveUntil",
      "populationScope",
      "support",
      "provenanceReference",
      "populationWeight",
      "permittedJoins",
      "prohibitedJoins",
    ]);
    assertInterval(linkage.effectiveFrom, linkage.effectiveUntil, `${actor.id} Population linkage`);
    if (
      linkage.status !== POP0_I2_POPULATION_LINKAGE_STATUS ||
      linkage.effectiveFrom !== epoch ||
      linkage.effectiveUntil !== null ||
      linkage.populationScope !== "POP0_I2_NO_ORDINARY_POPULATION_COMPOSED" ||
      linkage.support !== "BOUNDED_CONFIGURED_PROOF_FIXTURE" ||
      linkage.populationWeight !== 0 ||
      !sameValues(linkage.permittedJoins, POP0_I2_ALLOWED_ACTOR_JOINS) ||
      !sameValues(linkage.prohibitedJoins, POP0_I2_PROHIBITED_ACTOR_JOINS)
    ) throw new Error(`Actor ${actor.id} has an unsupported POP0-I2 Population linkage.`);
    requireNonempty(linkage.provenanceReference, `${actor.id} Population-linkage provenance`);
  }

  for (const artifact of configuration.sourceArtifacts) {
    if (artifact.kind !== "SOURCE_EVIDENCE") throw new Error("Configured source artifacts must be source evidence.");
    requireNonempty(artifact.id, "Source artifact identity");
    requireNonempty(artifact.version, `${artifact.id} version`);
    requireNonemptyUnique(artifact.sectionIds, `${artifact.id} sections`);
    if (!configuration.institutions.some((entry) => entry.id === artifact.producerInstitutionId)) {
      throw new Error(`Source artifact ${artifact.id} has an unknown producer institution.`);
    }
    const asOf = instant(artifact.asOf, `${artifact.id} as-of`);
    const created = instant(artifact.createdAt, `${artifact.id} creation`);
    const released = instant(artifact.releasedAt, `${artifact.id} release`);
    if (asOf > created || created > released) throw new Error(`Source artifact ${artifact.id} has invalid chronology.`);
    requireNonempty(artifact.accessClass, `${artifact.id} access class`);
    requireNonempty(artifact.provenanceReference, `${artifact.id} provenance`);
  }

  for (const entitlement of configuration.accessEntitlements) {
    assertInterval(entitlement.effectiveFrom, entitlement.effectiveUntil, entitlement.id);
    const office = configuration.offices.find((entry) => entry.id === entitlement.officeId);
    const artifact = configuration.sourceArtifacts.find((entry) => entry.id === entitlement.artifactId);
    if (office === undefined || artifact === undefined) {
      throw new Error(`Access entitlement ${entitlement.id} has an unknown office or artifact.`);
    }
    requireNonemptyUnique(entitlement.sectionIds, `${entitlement.id} sections`);
    if (entitlement.sectionIds.some((id) => !artifact.sectionIds.includes(id))) {
      throw new Error(`Access entitlement ${entitlement.id} exceeds artifact scope.`);
    }
    if (entitlement.accessClass !== artifact.accessClass) {
      throw new Error(`Access entitlement ${entitlement.id} has the wrong access class.`);
    }
    requireNonempty(entitlement.authorityReference, `${entitlement.id} authority`);
  }

  for (const assumption of configuration.assumptions) {
    requireNonempty(assumption.id, "Assessment assumption identity");
    requireNonempty(assumption.label, `${assumption.id} label`);
    requireNonempty(assumption.provenanceReference, `${assumption.id} provenance`);
  }
  for (const rule of configuration.assessmentRules) {
    requireNonempty(rule.id, "Assessment rule identity");
    requireNonempty(rule.propositionId, `${rule.id} proposition`);
    requireNonempty(rule.judgment, `${rule.id} judgment`);
    requireUnique(rule.requiredSectionIds, `${rule.id} required sections`);
    requireUnique(rule.requiredAssumptionIds, `${rule.id} required assumptions`);
    if (rule.requiredAssumptionIds.some((id) => !configuration.assumptions.some((entry) => entry.id === id))) {
      throw new Error(`Assessment rule ${rule.id} references an unknown assumption.`);
    }
  }
  for (const capability of configuration.recipientCapabilities) {
    assertInterval(capability.effectiveFrom, capability.effectiveUntil, capability.id);
    if (!configuration.offices.some((office) => office.id === capability.recipientOfficeId)) {
      throw new Error(`Recipient capability ${capability.id} references an unknown office.`);
    }
    requireNonempty(capability.authorityReference, `${capability.id} authority`);
    requireNonempty(capability.provenanceReference, `${capability.id} provenance`);
    if (capability.kind === "ANALYSIS_CAPABILITY") {
      requireNonemptyUnique(capability.permittedProductKinds, `${capability.id} products`);
      requireNonemptyUnique(
        capability.permittedSubjectScopeFamilies,
        `${capability.id} subject scopes`,
      );
      requireUnique(
        capability.permittedLessClaimingProductKinds,
        `${capability.id} less-claiming products`,
      );
      if (
        !Number.isSafeInteger(capability.maximumSectionCount) ||
        capability.maximumSectionCount <= 0 ||
        capability.permittedLessClaimingProductKinds.some(
          (kind) => !capability.permittedProductKinds.includes(kind),
        )
      ) throw new Error(`Analysis capability ${capability.id} has invalid product/scope bounds.`);
    } else {
      requireNonemptyUnique(capability.permittedWorkstreamIds, `${capability.id} workstreams`);
      requireNonemptyUnique(
        capability.permittedCoordinationActionKinds,
        `${capability.id} coordination actions`,
      );
      if (
        !Number.isSafeInteger(capability.maximumParticipatingOfficeCount) ||
        capability.maximumParticipatingOfficeCount <= 0 ||
        !Number.isSafeInteger(capability.maximumReviewHorizonHours) ||
        capability.maximumReviewHorizonHours <= 0
      ) throw new Error(`Coordination capability ${capability.id} has invalid coordination bounds.`);
    }
  }
};

export const createPresidentialAdministrationOwnerStates = (
  configuration: PresidentialAdministrationConfiguration,
  epoch: string,
): PresidentialAdministrationOwnerStates => {
  assertPresidentialAdministrationConfiguration(configuration, epoch);
  return {
    administrationDirectory: {
      ownerId: configuration.ownerIds.administrationDirectory,
      state: {
        officeholderAssignments: copyPlain(configuration.officeholderAssignments),
        presidentialRecipientBinding: copyPlain(configuration.presidentialRecipientBinding),
      },
    },
    officeOperations: {
      ownerId: configuration.ownerIds.officeOperations,
      state: configuration.offices
        .map((office) => ({
          officeId: office.id,
          assignments: [],
           activeQueueAssignmentIds: [],
           deadlineDefaultRecords: [],
           instrumentReceipts: [],
           instrumentDispositions: [],
           instrumentAssignmentAuthorizations: [],
        }))
        .sort((left, right) => left.officeId.localeCompare(right.officeId)),
    },
    informationRoutes: {
      ownerId: configuration.ownerIds.informationRoutes,
      state: {
        artifacts: [...copyPlain(configuration.sourceArtifacts)]
          .sort((left, right) => left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id)),
        institutionPossessions: [],
        indexEntries: [],
        metadataNotices: [],
        accessEntitlements: [...copyPlain(configuration.accessEntitlements)]
          .sort((left, right) => left.id.localeCompare(right.id)),
        retrievals: [],
        receipts: [],
      },
    },
    presidentialPresentations: {
      ownerId: configuration.ownerIds.presidentialPresentations,
      state: { presentations: [], escalationPresentations: [] },
    },
  };
};

export const copyPresidentialAdministrationOwnerStates = (
  state: PresidentialAdministrationOwnerStates,
): PresidentialAdministrationOwnerStates => copyPlain(state);

const allReferenceIds = (state: PresidentialAdministrationOwnerStates): Set<string> => new Set([
  ...state.informationRoutes.state.artifacts.map((entry) => entry.id),
  ...state.informationRoutes.state.institutionPossessions.map((entry) => entry.id),
  ...state.informationRoutes.state.indexEntries.map((entry) => entry.id),
  ...state.informationRoutes.state.metadataNotices.map((entry) => entry.id),
  ...state.informationRoutes.state.retrievals.map((entry) => entry.id),
  ...state.informationRoutes.state.receipts.map((entry) => entry.id),
  ...state.officeOperations.state.flatMap((office) => [
    ...office.instrumentReceipts.map((entry) => entry.id),
    ...office.instrumentDispositions.map((entry) => entry.id),
  ]),
]);

const assertArtifactCommon = (
  artifact: PresidentialInformationArtifact,
  configuration: PresidentialAdministrationConfiguration,
  current: string,
): void => {
  requireNonempty(artifact.id, "Information artifact identity");
  requireNonempty(artifact.version, `${artifact.id} version`);
  requireNonemptyUnique(artifact.sectionIds, `${artifact.id} sections`);
  requireNonempty(artifact.provenanceReference, `${artifact.id} provenance`);
  const asOf = instant(artifact.asOf, `${artifact.id} as-of`);
  const created = instant(artifact.createdAt, `${artifact.id} creation`);
  if (asOf > created) {
    throw new Error(`Information artifact ${artifact.id} is dated before its as-of instant.`);
  }
  if (created > instant(current, "Current operating time")) {
    throw new Error(`Information artifact ${artifact.id} is dated after current operating time.`);
  }
  if (artifact.revisionOfArtifactId !== null && artifact.revisionOfArtifactId === artifact.id) {
    throw new Error(`Artifact ${artifact.id} cannot revise itself.`);
  }
  if (artifact.supersedesArtifactId !== null && artifact.supersedesArtifactId === artifact.id) {
    throw new Error(`Artifact ${artifact.id} cannot supersede itself.`);
  }
  if (artifact.kind === "SOURCE_EVIDENCE") {
    const configured = configuration.sourceArtifacts.find((entry) => entry.id === artifact.id);
    if (configured === undefined || JSON.stringify(artifact) !== JSON.stringify(configured)) {
      throw new Error(`Source artifact ${artifact.id} contradicts configured proof evidence.`);
    }
  }
};

const validateAssessmentRuleSupport = (
  artifact: AssessmentArtifact,
  state: PresidentialAdministrationOwnerStates,
  configuration: PresidentialAdministrationConfiguration,
): void => {
  const ledger = state.informationRoutes.state;
  requireNonemptyUnique(artifact.judgments.map((entry) => entry.ruleId), `${artifact.id} judgment rules`);
  requireUnique(artifact.assumptionIds, `${artifact.id} assumptions`);
  for (const assumptionId of artifact.assumptionIds) {
    if (!configuration.assumptions.some((entry) => entry.id === assumptionId)) {
      throw new Error(`Assessment ${artifact.id} references unknown assumption ${assumptionId}.`);
    }
  }
  for (const judgment of artifact.judgments) {
    const rule = configuration.assessmentRules.find((entry) => entry.id === judgment.ruleId);
    if (
      rule === undefined ||
      judgment.propositionId !== rule.propositionId ||
      judgment.judgment !== rule.judgment ||
      rule.requiredAssumptionIds.some((id) => !artifact.assumptionIds.includes(id))
    ) throw new Error(`Assessment ${artifact.id} does not satisfy judgment rule ${judgment.ruleId}.`);

    if (rule.evidenceRequirement === "SUBSTANTIVE_RECEIPT") {
      if (artifact.sourceReceiptIds.length === 0) {
        throw new Error(`Assessment ${artifact.id} requires a substantive receipt.`);
      }
      const receivedSections = artifact.sourceReceiptIds.flatMap((receiptId) => {
        const receipt = ledger.receipts.find((entry) => entry.id === receiptId);
        if (receipt === undefined || receipt.recipientOfficeId !== artifact.producingOfficeId) {
          throw new Error(`Assessment ${artifact.id} lacks office-owned receipt ${receiptId}.`);
        }
        return receipt.receivedSectionIds;
      });
      if (rule.requiredSectionIds.some((id) => !receivedSections.includes(id))) {
        throw new Error(`Assessment ${artifact.id} lacks required received sections.`);
      }
    } else {
      if (artifact.sourceReceiptIds.length !== 0 || artifact.sourceMetadataNoticeIds.length === 0 || artifact.sourceRetrievalIds.length === 0) {
        throw new Error(`Assessment ${artifact.id} requires metadata and a failed retrieval without substantive receipt.`);
      }
      for (const noticeId of artifact.sourceMetadataNoticeIds) {
        const notice = ledger.metadataNotices.find((entry) => entry.id === noticeId);
        if (notice === undefined || notice.recipientOfficeId !== artifact.producingOfficeId) {
          throw new Error(`Assessment ${artifact.id} lacks office-owned metadata notice ${noticeId}.`);
        }
      }
      for (const retrievalId of artifact.sourceRetrievalIds) {
        const retrieval = ledger.retrievals.find((entry) => entry.id === retrievalId);
        if (
          retrieval === undefined ||
          retrieval.requestingOfficeId !== artifact.producingOfficeId ||
          retrieval.result === "AVAILABLE_AT_OFFICE_BOUNDARY"
        ) throw new Error(`Assessment ${artifact.id} requires an office-owned failed retrieval.`);
      }
    }
  }
};

const assertAssessmentArtifact = (
  artifact: AssessmentArtifact,
  state: PresidentialAdministrationOwnerStates,
  configuration: PresidentialAdministrationConfiguration,
): void => {
  assertEffectiveOfficeholder(
    state,
    artifact.authoringOfficeholderAssignmentId,
    artifact.producingOfficeId,
    artifact.createdAt,
  );
  requireNonempty(artifact.claimedConfidence, `${artifact.id} claimed confidence`);
  requireNonempty(artifact.evidentiarySupport, `${artifact.id} evidentiary support`);
  requireUnique(artifact.sourceReceiptIds, `${artifact.id} source receipts`);
  requireUnique(artifact.sourceRetrievalIds, `${artifact.id} source retrievals`);
  requireUnique(artifact.sourceMetadataNoticeIds, `${artifact.id} source notices`);
  requireUnique(artifact.sourceLineage.map((entry) => entry.artifactId), `${artifact.id} source lineage`);
  requireNonemptyValues(artifact.limitations, `${artifact.id} limitations`);
  if (artifact.recommendation !== null) requireNonempty(artifact.recommendation, `${artifact.id} recommendation`);
  const created = instant(artifact.createdAt, `${artifact.id} creation`);
  for (const receiptId of artifact.sourceReceiptIds) {
    const receipt = state.informationRoutes.state.receipts.find((entry) => entry.id === receiptId);
    if (
      receipt === undefined ||
      receipt.recipientOfficeId !== artifact.producingOfficeId ||
      instant(receipt.receivedAt, `${receiptId} receipt`) > created
    ) {
      throw new Error(`Assessment ${artifact.id} lacks office-owned receipt ${receiptId}.`);
    }
  }
  for (const retrievalId of artifact.sourceRetrievalIds) {
    const retrieval = state.informationRoutes.state.retrievals.find((entry) => entry.id === retrievalId);
    if (
      retrieval === undefined ||
      retrieval.requestingOfficeId !== artifact.producingOfficeId ||
      instant(retrieval.completedAt, `${retrievalId} completion`) > created
    ) {
      throw new Error(`Assessment ${artifact.id} lacks office-owned retrieval ${retrievalId}.`);
    }
  }
  for (const noticeId of artifact.sourceMetadataNoticeIds) {
    const notice = state.informationRoutes.state.metadataNotices.find((entry) => entry.id === noticeId);
    if (
      notice === undefined ||
      notice.recipientOfficeId !== artifact.producingOfficeId ||
      instant(notice.noticedAt, `${noticeId} notice`) > created
    ) {
      throw new Error(`Assessment ${artifact.id} lacks office-owned metadata notice ${noticeId}.`);
    }
  }
  for (const lineage of artifact.sourceLineage) {
    requireNonempty(lineage.artifactId, `${artifact.id} lineage artifact`);
    requireNonemptyUnique(lineage.sectionIds, `${artifact.id} lineage sections`);
    const source = findArtifact(state, lineage.artifactId);
    if (
      source === undefined ||
      instant(source.createdAt, `${source.id} creation`) > created ||
      lineage.sectionIds.some((id) => !artifactSectionIds(source).includes(id))
    ) {
      throw new Error(`Assessment ${artifact.id} has invalid source lineage.`);
    }
    const receivedSections = artifact.sourceReceiptIds
      .map((id) => state.informationRoutes.state.receipts.find((entry) => entry.id === id))
      .filter((entry): entry is SubstantiveOfficeReceipt => entry !== undefined && entry.artifactId === lineage.artifactId)
      .flatMap((entry) => entry.receivedSectionIds);
    if (lineage.sectionIds.some((id) => !receivedSections.includes(id))) {
      throw new Error(`Assessment ${artifact.id} cites sections outside its office receipts.`);
    }
  }
  if (artifact.assignmentId !== null) {
    const office = state.officeOperations.state.find((entry) => entry.officeId === artifact.producingOfficeId);
    if (!office?.assignments.some((entry) => entry.id === artifact.assignmentId)) {
      throw new Error(`Assessment ${artifact.id} references an assignment not owned by its office.`);
    }
  }
  validateAssessmentRuleSupport(artifact, state, configuration);
};

const assertSynthesisArtifact = (
  artifact: SynthesisArtifact,
  state: PresidentialAdministrationOwnerStates,
): void => {
  assertEffectiveOfficeholder(
    state,
    artifact.authoringOfficeholderAssignmentId,
    artifact.producingOfficeId,
    artifact.createdAt,
  );
  requireNonempty(artifact.synthesisJudgment, `${artifact.id} synthesis judgment`);
  requireNonemptyUnique(artifact.sourceAssessmentArtifactIds, `${artifact.id} source assessments`);
  requireNonemptyUnique(artifact.sourceAssessmentReceiptIds, `${artifact.id} source receipts`);
  requireNonemptyUnique(
    artifact.preservedAssessments.map((entry) => entry.assessmentArtifactId),
    `${artifact.id} preserved assessments`,
  );
  requireNonemptyValues(artifact.limitations, `${artifact.id} limitations`);
  if (artifact.preservedAssessments.length !== artifact.sourceAssessmentArtifactIds.length) {
    throw new Error(`Synthesis ${artifact.id} must preserve every source assessment.`);
  }
  const created = instant(artifact.createdAt, `${artifact.id} creation`);
  for (const assessmentId of artifact.sourceAssessmentArtifactIds) {
    const source = findArtifact(state, assessmentId);
    const receipt = state.informationRoutes.state.receipts.find(
      (entry) => entry.artifactId === assessmentId &&
        entry.recipientOfficeId === artifact.producingOfficeId &&
        artifact.sourceAssessmentReceiptIds.includes(entry.id),
    );
    const preserved = artifact.preservedAssessments.find((entry) => entry.assessmentArtifactId === assessmentId);
    if (source?.kind !== "ASSESSMENT" || receipt === undefined || preserved === undefined) {
      throw new Error(`Synthesis ${artifact.id} cites an unreceived assessment ${assessmentId}.`);
    }
    if (
      instant(source.createdAt, `${source.id} creation`) > created ||
      instant(receipt.receivedAt, `${receipt.id} receipt`) > created
    ) {
      throw new Error(`Synthesis ${artifact.id} predates assessment receipt ${receipt.id}.`);
    }
    if (!assessmentSemanticContentIsReceived(source, receipt.receivedSectionIds)) {
      throw new Error(
        `Synthesis ${artifact.id} cannot preserve assessment ${assessmentId} without every semantic section.`,
      );
    }
    if (
      JSON.stringify(preserved.judgments) !== JSON.stringify(source.judgments) ||
      JSON.stringify(preserved.limitations) !== JSON.stringify(source.limitations)
    ) throw new Error(`Synthesis ${artifact.id} rewrites assessment ${assessmentId}.`);
  }
};

const artifactReachableFrom = (
  state: PresidentialAdministrationOwnerStates,
  targetArtifactId: string,
  rootArtifactId: string,
  visited = new Set<string>(),
): boolean => {
  if (targetArtifactId === rootArtifactId) return true;
  if (visited.has(rootArtifactId)) return false;
  visited.add(rootArtifactId);
  const root = findArtifact(state, rootArtifactId);
  if (root?.kind === "ASSESSMENT") {
    return root.sourceLineage.some((entry) =>
      artifactReachableFrom(state, targetArtifactId, entry.artifactId, visited));
  }
  if (root?.kind === "SYNTHESIS") {
    return root.sourceAssessmentArtifactIds.some((id) =>
      artifactReachableFrom(state, targetArtifactId, id, visited));
  }
  return false;
};

const presenterCanShowArtifact = (
  state: PresidentialAdministrationOwnerStates,
  officeId: string,
  artifactId: string,
  sectionId: string,
  at: string,
): boolean => {
  const artifact = findArtifact(state, artifactId);
  if (
    artifact === undefined ||
    !artifact.sectionIds.includes(sectionId) ||
    instant(artifact.createdAt, `${artifact.id} creation`) > instant(at, "Presentation time")
  ) return false;
  if (artifact.kind !== "SOURCE_EVIDENCE" && artifact.producingOfficeId === officeId) return true;
  return state.informationRoutes.state.receipts.some((receipt) =>
    receipt.recipientOfficeId === officeId &&
    receipt.artifactId === artifactId &&
    receipt.receivedSectionIds.includes(sectionId) &&
    instant(receipt.receivedAt, `${receipt.id} receipt`) <= instant(at, "Presentation time"));
};

const artifactHistoryReferences = (
  artifact: PresidentialInformationArtifact,
): readonly string[] => [artifact.revisionOfArtifactId, artifact.supersedesArtifactId]
  .filter((value): value is string => value !== null);

const assertArtifactHistory = (state: PresidentialAdministrationOwnerStates): void => {
  const artifacts = state.informationRoutes.state.artifacts;
  for (const artifact of artifacts) {
    for (const reference of artifactHistoryReferences(artifact)) {
      const referenced = findArtifact(state, reference);
      if (referenced?.kind !== artifact.kind) {
        throw new Error(`Artifact ${artifact.id} has a broken revision/supersession reference.`);
      }
    }
  }
  const visit = (artifact: PresidentialInformationArtifact, path: Set<string>): void => {
    if (path.has(artifact.id)) throw new Error(`Artifact ${artifact.id} has a cyclic revision/supersession history.`);
    const nextPath = new Set(path).add(artifact.id);
    for (const reference of artifactHistoryReferences(artifact)) {
      const referenced = findArtifact(state, reference);
      if (referenced !== undefined) visit(referenced, nextPath);
    }
  };
  for (const artifact of artifacts) visit(artifact, new Set());
  for (const artifact of artifacts) {
    for (const reference of artifactHistoryReferences(artifact)) {
      const referenced = findArtifact(state, reference);
      if (
        referenced === undefined ||
        instant(referenced.createdAt, `${referenced.id} creation`) >=
          instant(artifact.createdAt, `${artifact.id} creation`)
      ) {
        throw new Error(`Artifact ${artifact.id} revision/supersession history is not strictly forward.`);
      }
    }
  }
};

const presentationHistoryReferences = (
  presentation: PresidentialPresentationRecord,
): readonly string[] => [presentation.revisionOfPresentationId, presentation.supersedesPresentationId]
  .filter((value): value is string => value !== null);

const assertPresentationHistory = (presentations: readonly PresidentialPresentationRecord[]): void => {
  for (const presentation of presentations) {
    for (const reference of presentationHistoryReferences(presentation)) {
      if (!presentations.some((entry) => entry.id === reference)) {
        throw new Error(`Presidential presentation ${presentation.id} has a broken revision reference.`);
      }
    }
  }
  const visit = (presentation: PresidentialPresentationRecord, path: Set<string>): void => {
    if (path.has(presentation.id)) {
      throw new Error(`Presidential presentation ${presentation.id} has a cyclic revision/supersession history.`);
    }
    const nextPath = new Set(path).add(presentation.id);
    for (const reference of presentationHistoryReferences(presentation)) {
      const referenced = presentations.find((entry) => entry.id === reference);
      if (referenced !== undefined) visit(referenced, nextPath);
    }
  };
  for (const presentation of presentations) visit(presentation, new Set());
  for (const presentation of presentations) {
    for (const reference of presentationHistoryReferences(presentation)) {
      const referenced = presentations.find((entry) => entry.id === reference);
      if (
        referenced === undefined ||
        instant(referenced.presentedAt, `${referenced.id} presentation`) >=
          instant(presentation.presentedAt, `${presentation.id} presentation`)
      ) {
        throw new Error(`Presidential presentation ${presentation.id} revision history is not strictly forward.`);
      }
    }
  }
};

export const assertPresidentialAdministrationOwnerStates = (
  state: PresidentialAdministrationOwnerStates,
  configuration: PresidentialAdministrationConfiguration,
  epoch: string,
  current: string,
): void => {
  assertPresidentialAdministrationConfiguration(configuration, epoch);
  const currentValue = instant(current, "Current presidential operating time");
  if (currentValue < instant(epoch, "Presidential operating epoch")) {
    throw new Error("Presidential administration state precedes its epoch.");
  }
  if (
    state.administrationDirectory.ownerId !== configuration.ownerIds.administrationDirectory ||
    state.officeOperations.ownerId !== configuration.ownerIds.officeOperations ||
    state.informationRoutes.ownerId !== configuration.ownerIds.informationRoutes ||
    state.presidentialPresentations.ownerId !== configuration.ownerIds.presidentialPresentations
  ) throw new Error("Presidential administration owner identities contradict configuration.");
  if (
    JSON.stringify(state.administrationDirectory.state.officeholderAssignments) !==
      JSON.stringify(configuration.officeholderAssignments) ||
    JSON.stringify(state.administrationDirectory.state.presidentialRecipientBinding) !==
      JSON.stringify(configuration.presidentialRecipientBinding)
  ) throw new Error("Administration directory contradicts configured role identities.");

  const officeStates = state.officeOperations.state;
  requireUnique(officeStates.map((entry) => entry.officeId), "Office-operation state identities");
  if (!sameValues(officeStates.map((entry) => entry.officeId), configuration.offices.map((entry) => entry.id))) {
    throw new Error("Office-operation state does not contain the configured office set.");
  }
  const assignmentIds = officeStates.flatMap((entry) => entry.assignments.map((assignment) => assignment.id));
  requireNonemptyUnique(assignmentIds, "Office work-assignment identities");
  requireNonemptyUnique(
    officeStates.flatMap((entry) => entry.instrumentReceipts.map((receipt) => receipt.id)),
    "Office instrument-receipt identities",
  );
  requireNonemptyUnique(
    officeStates.flatMap((entry) => entry.instrumentReceipts.map((receipt) => receipt.deduplicationIdentity)),
    "Office instrument-receipt deduplication identities",
  );
  requireNonemptyUnique(
    officeStates.flatMap((entry) => entry.instrumentDispositions.map((disposition) => disposition.id)),
    "Recipient disposition identities",
  );
  requireNonemptyUnique(
    officeStates.flatMap((entry) =>
      entry.instrumentDispositions.map((disposition) => disposition.deduplicationIdentity)),
    "Recipient disposition deduplication identities",
  );
  const references = allReferenceIds(state);
  for (const office of officeStates) {
    requireNonemptyUnique(office.activeQueueAssignmentIds, `${office.officeId} queue references`);
    requireNonemptyUnique(
      office.deadlineDefaultRecords.map((entry) => entry.id),
      `${office.officeId} deadline/default identities`,
    );
    for (const assignment of office.assignments) {
      if (assignment.leadOfficeId !== office.officeId) {
        throw new Error(`Assignment ${assignment.id} is stored under the wrong office.`);
      }
      requireNonempty(assignment.requesterId, `${assignment.id} requester`);
      if (
        !configuration.offices.some((entry) => entry.id === assignment.requesterId) &&
        !configuration.actors.some((entry) => entry.id === assignment.requesterId)
      ) throw new Error(`Assignment ${assignment.id} has an unknown requester.`);
      requireNonempty(assignment.objective, `${assignment.id} objective`);
      requireNonempty(assignment.authorityReference, `${assignment.id} authority`);
      requireNonempty(assignment.expectedProductKind, `${assignment.id} product kind`);
      requireNonemptyUnique(assignment.sourceReferenceIds, `${assignment.id} source references`);
      requireNonemptyUnique(assignment.requiredConsultationOfficeIds, `${assignment.id} consultation offices`);
      if (assignment.requiredConsultationOfficeIds.some((id) => !configuration.offices.some((entry) => entry.id === id))) {
        throw new Error(`Assignment ${assignment.id} references an unknown consultation office.`);
      }
      if (assignment.sourceReferenceIds.some((id) => !references.has(id))) {
        throw new Error(`Assignment ${assignment.id} references unavailable source records.`);
      }
      const created = instant(assignment.createdAt, `${assignment.id} creation`);
      const updated = instant(assignment.statusUpdatedAt, `${assignment.id} status update`);
      const deadline = instant(assignment.deadline, `${assignment.id} deadline`);
      if (created > updated || created > deadline || updated > currentValue) {
        throw new Error(`Assignment ${assignment.id} has invalid timing.`);
      }
      const terminal = ["COMPLETED", "REFUSED", "CANCELLED", "SUPERSEDED"].includes(assignment.status);
      if (![
        "QUEUED",
        "IN_PROGRESS",
        "BLOCKED",
        "COMPLETED",
        "DELAYED",
        "REFUSED",
        "CANCELLED",
        "SUPERSEDED",
      ].includes(assignment.status)) throw new Error(`Assignment ${assignment.id} has an unsupported status.`);
      if (office.activeQueueAssignmentIds.includes(assignment.id) === terminal) {
        throw new Error(`Assignment ${assignment.id} has contradictory queue status.`);
      }
      if (assignment.status === "COMPLETED") {
        if (
          assignment.resultArtifactIds.length === 0 ||
          assignment.resultArtifactIds.some((id) => {
            const artifact = findArtifact(state, id);
            return artifact === undefined || artifact.kind === "SOURCE_EVIDENCE" || artifact.producingOfficeId !== office.officeId;
          })
        ) throw new Error(`Completed assignment ${assignment.id} requires office-owned result artifacts.`);
      } else if (assignment.resultArtifactIds.length !== 0) {
        throw new Error(`Noncompleted assignment ${assignment.id} cannot own result artifacts.`);
      }
      if (["BLOCKED", "DELAYED", "REFUSED", "CANCELLED"].includes(assignment.status) && assignment.failureReason === null) {
        throw new Error(`Assignment ${assignment.id} requires an explicit status reason.`);
      }
      if (assignment.failureReason !== null) requireNonempty(assignment.failureReason, `${assignment.id} status reason`);
      requireNonemptyValues(assignment.resultArtifactIds, `${assignment.id} result artifacts`);
      if (
        assignment.statusProvenanceReferenceId !== null &&
        !references.has(assignment.statusProvenanceReferenceId)
      ) throw new Error(`Assignment ${assignment.id} has invalid status provenance.`);
      if (assignment.statusProvenanceReferenceId !== null) {
        requireNonempty(assignment.statusProvenanceReferenceId, `${assignment.id} status provenance`);
      }
      if (
        assignment.supersededByAssignmentId !== null &&
        (!office.assignments.some((entry) => entry.id === assignment.supersededByAssignmentId) ||
          assignment.supersededByAssignmentId === assignment.id)
      ) throw new Error(`Assignment ${assignment.id} has invalid supersession.`);
    }
    for (const queuedId of office.activeQueueAssignmentIds) {
      if (!office.assignments.some((entry) => entry.id === queuedId)) {
        throw new Error(`Office ${office.officeId} queue crosses an ownership boundary.`);
      }
    }
    for (const record of office.deadlineDefaultRecords) {
      requireNonempty(record.assignmentId, `${record.id} assignment`);
      const assignment = office.assignments.find((entry) => entry.id === record.assignmentId);
      if (
        assignment === undefined ||
        instant(record.occurredAt, `${record.id} occurrence`) < instant(assignment.deadline, `${assignment.id} deadline`) ||
        instant(record.occurredAt, `${record.id} occurrence`) > currentValue ||
        assignment.status !== record.outcome
      ) throw new Error(`Office deadline/default record ${record.id} is invalid.`);
      requireNonempty(record.provenanceReference, `${record.id} provenance`);
    }
    requireUnique(
      office.instrumentReceipts.map((receipt) => receipt.instrumentId),
      `${office.officeId} admitted instrument receipts`,
    );
    for (const receipt of office.instrumentReceipts) {
      if (
        receipt.recipientOfficeId !== office.officeId ||
        receipt.receivedPayloadVersion !== "1" ||
        instant(receipt.receivedAt, `${receipt.id} receipt`) > currentValue
      ) throw new Error(`Office instrument receipt ${receipt.id} is invalid.`);
      requireNonempty(receipt.instrumentId, `${receipt.id} instrument`);
      requireNonempty(receipt.successfulDispatchId, `${receipt.id} dispatch`);
      requireNonempty(receipt.receiptPath, `${receipt.id} path`);
      requireNonempty(receipt.receivingAuthorityReference, `${receipt.id} authority`);
      requireNonempty(receipt.provenanceReference, `${receipt.id} provenance`);
    }
    requireUnique(
      office.instrumentDispositions.map((disposition) => disposition.instrumentReceiptId),
      `${office.officeId} controlling instrument dispositions`,
    );
    for (const disposition of office.instrumentDispositions) {
      const receipt = office.instrumentReceipts.find(
        (entry) => entry.id === disposition.instrumentReceiptId,
      );
      if (
        disposition.recipientOfficeId !== office.officeId ||
        receipt === undefined ||
        receipt.instrumentId !== disposition.instrumentId ||
        instant(disposition.dispositionAt, `${disposition.id} disposition`) <
          instant(receipt.receivedAt, `${receipt.id} receipt`) ||
        instant(disposition.dispositionAt, `${disposition.id} disposition`) > currentValue
      ) throw new Error(`Recipient disposition ${disposition.id} is invalid.`);
      if (disposition.kind === "NO_ACTION_BY_DEADLINE") {
        if (disposition.authoringOfficeholderAssignmentId !== null) {
          throw new Error(`Deadline disposition ${disposition.id} cannot have an officeholder author.`);
        }
      } else {
        if (disposition.authoringOfficeholderAssignmentId === null) {
          throw new Error(`Authored disposition ${disposition.id} requires an officeholder.`);
        }
        assertEffectiveOfficeholder(
          state,
          disposition.authoringOfficeholderAssignmentId,
          office.officeId,
          disposition.dispositionAt,
        );
      }
      if (
        disposition.capabilityAuthorityId !== null &&
        !configuration.recipientCapabilities.some(
          (capability) => capability.id === disposition.capabilityAuthorityId,
        )
      ) throw new Error(`Recipient disposition ${disposition.id} cites an unknown capability.`);
      requireUnique(disposition.acceptedSectionIds, `${disposition.id} accepted sections`);
      requireUnique(
        disposition.acceptedCoordinationActions,
        `${disposition.id} accepted coordination actions`,
      );
      requireUnique(disposition.constraintIds, `${disposition.id} constraints`);
      requireNonemptyValues(disposition.limitations, `${disposition.id} limitations`);
      if (disposition.reason !== null) requireNonempty(disposition.reason, `${disposition.id} reason`);
      if (disposition.nextReviewAt !== null) {
        if (instant(disposition.nextReviewAt, `${disposition.id} next review`) <=
          instant(disposition.dispositionAt, `${disposition.id} disposition`)) {
          throw new Error(`Recipient disposition ${disposition.id} has a nonfuture review.`);
        }
      }
      requireNonempty(disposition.provenanceReference, `${disposition.id} provenance`);
    }
  }

  const ledger = state.informationRoutes.state;
  requireNonemptyUnique(ledger.artifacts.map((entry) => entry.id), "Information artifact identities");
  requireNonemptyUnique(ledger.institutionPossessions.map((entry) => entry.id), "Institution-possession identities");
  requireNonemptyUnique(ledger.indexEntries.map((entry) => entry.id), "Information-index identities");
  requireNonemptyUnique(ledger.metadataNotices.map((entry) => entry.id), "Metadata-notice identities");
  requireNonemptyUnique(ledger.accessEntitlements.map((entry) => entry.id), "Access-entitlement identities");
  requireNonemptyUnique(ledger.retrievals.map((entry) => entry.id), "Retrieval identities");
  requireNonemptyUnique(ledger.receipts.map((entry) => entry.id), "Office-receipt identities");
  requireNonemptyUnique(
    ledger.metadataNotices.map((entry) => entry.deduplicationIdentity),
    "Metadata-notice deduplication identities",
  );
  requireNonemptyUnique(
    ledger.receipts.map((entry) => entry.deduplicationIdentity),
    "Office-receipt deduplication identities",
  );
  requireUnique(
    ledger.institutionPossessions.map((entry) => `${entry.possessingInstitutionId}#${entry.artifactId}`),
    "Institution artifact possessions",
  );
  requireUnique(ledger.indexEntries.map((entry) => entry.artifactId), "Indexed artifact identities");
  requireUnique(
    ledger.metadataNotices.map((entry) => `${entry.recipientOfficeId}#${entry.indexEntryId}`),
    "Office metadata-notice routes",
  );
  if (JSON.stringify(ledger.accessEntitlements) !== JSON.stringify(
    [...copyPlain(configuration.accessEntitlements)].sort((left, right) => left.id.localeCompare(right.id)),
  )) throw new Error("Information access entitlements contradict authenticated configuration.");

  for (const artifact of ledger.artifacts) {
    assertArtifactCommon(artifact, configuration, current);
    if (artifact.kind === "ASSESSMENT") assertAssessmentArtifact(artifact, state, configuration);
    if (artifact.kind === "SYNTHESIS") assertSynthesisArtifact(artifact, state);
  }
  assertArtifactHistory(state);
  for (const possession of ledger.institutionPossessions) {
    const artifact = findArtifact(state, possession.artifactId);
    if (
      artifact?.kind !== "SOURCE_EVIDENCE" ||
      artifact.producerInstitutionId !== possession.possessingInstitutionId ||
      !configuration.institutions.some((entry) => entry.id === possession.possessingInstitutionId) ||
      instant(possession.possessedAt, `${possession.id} possession`) > currentValue
    ) throw new Error(`Institution possession ${possession.id} is invalid.`);
    requireNonempty(possession.acquisitionProvenanceReference, `${possession.id} provenance`);
  }
  for (const entry of ledger.indexEntries) {
    const possession = ledger.institutionPossessions.find((candidate) => candidate.id === entry.sourcePossessionId);
    const artifact = findArtifact(state, entry.artifactId);
    if (
      possession === undefined ||
      possession.artifactId !== entry.artifactId ||
      possession.possessingInstitutionId !== entry.sourceInstitutionId ||
      artifact?.kind !== "SOURCE_EVIDENCE" ||
      entry.artifactVersion !== artifact.version ||
      entry.accessClass !== artifact.accessClass ||
      !sameValues(entry.availableSectionIds, artifact.sectionIds) ||
      instant(entry.createdAt, `${entry.id} creation`) < instant(possession.possessedAt, `${possession.id} possession`) ||
      instant(entry.createdAt, `${entry.id} creation`) > currentValue
    ) throw new Error(`Information index entry ${entry.id} is invalid.`);
    requireNonempty(entry.provenanceReference, `${entry.id} provenance`);
  }
  for (const notice of ledger.metadataNotices) {
    const index = ledger.indexEntries.find((entry) => entry.id === notice.indexEntryId);
    if (
      index === undefined ||
      !configuration.offices.some((entry) => entry.id === notice.recipientOfficeId) ||
      instant(notice.noticedAt, `${notice.id} notice`) < instant(index.createdAt, `${index.id} creation`) ||
      instant(notice.noticedAt, `${notice.id} notice`) > currentValue
    ) throw new Error(`Metadata notice ${notice.id} is invalid.`);
    requireNonempty(notice.deliveryPath, `${notice.id} delivery path`);
    requireNonempty(notice.deduplicationIdentity, `${notice.id} deduplication identity`);
  }
  for (const retrieval of ledger.retrievals) {
    const notice = ledger.metadataNotices.find((entry) => entry.id === retrieval.metadataNoticeId);
    const index = notice === undefined ? undefined : ledger.indexEntries.find((entry) => entry.id === notice.indexEntryId);
    if (
      notice === undefined ||
      index === undefined ||
      notice.recipientOfficeId !== retrieval.requestingOfficeId ||
      index.artifactId !== retrieval.artifactId ||
      retrieval.requestedSectionIds.some((id) => !index.availableSectionIds.includes(id)) ||
      instant(retrieval.requestedAt, `${retrieval.id} request`) < instant(notice.noticedAt, `${notice.id} notice`) ||
      instant(retrieval.completedAt, `${retrieval.id} completion`) < instant(retrieval.requestedAt, `${retrieval.id} request`) ||
      instant(retrieval.completedAt, `${retrieval.id} completion`) > currentValue
    ) throw new Error(`Information retrieval ${retrieval.id} is invalid.`);
    requireNonemptyUnique(retrieval.requestedSectionIds, `${retrieval.id} requested sections`);
    const entitled = ledger.accessEntitlements.find((entry) =>
      entry.officeId === retrieval.requestingOfficeId &&
      entry.artifactId === retrieval.artifactId &&
      isEffectiveAt(entry.effectiveFrom, entry.effectiveUntil, retrieval.requestedAt) &&
      retrieval.requestedSectionIds.every((id) => entry.sectionIds.includes(id)));
    if (retrieval.evaluatedEntitlementId !== (entitled?.id ?? null)) {
      throw new Error(`Information retrieval ${retrieval.id} contradicts configured access.`);
    }
    if (entitled === undefined) {
      if (
        retrieval.result !== "ACCESS_DENIED" ||
        retrieval.failureReason !== "NO_ACTIVE_ENTITLEMENT_FOR_REQUESTED_SCOPE" ||
        retrieval.outcomeProvenanceReference !== null
      ) throw new Error(`Information retrieval ${retrieval.id} contradicts configured access denial.`);
    } else if (retrieval.result === "AVAILABLE_AT_OFFICE_BOUNDARY") {
      if (retrieval.failureReason !== null || retrieval.outcomeProvenanceReference !== null) {
        throw new Error(`Successful information retrieval ${retrieval.id} carries failure state.`);
      }
    } else if (retrieval.result === "NOT_FOUND" || retrieval.result === "FAILED") {
      if (retrieval.failureReason === null || retrieval.outcomeProvenanceReference === null) {
        throw new Error(`Technical retrieval ${retrieval.id} lacks failure reason or provenance.`);
      }
      requireNonempty(retrieval.failureReason, `${retrieval.id} failure reason`);
      requireNonempty(retrieval.outcomeProvenanceReference, `${retrieval.id} outcome provenance`);
    } else {
      throw new Error(`Entitled information retrieval ${retrieval.id} cannot resolve as access denied.`);
    }
  }
  for (const receipt of ledger.receipts) {
    const artifact = findArtifact(state, receipt.artifactId);
    if (
      artifact === undefined ||
      !configuration.offices.some((entry) => entry.id === receipt.recipientOfficeId) ||
      receipt.receivedSectionIds.some((id) => !artifact.sectionIds.includes(id)) ||
      instant(receipt.receivedAt, `${receipt.id} receipt`) > currentValue
    ) throw new Error(`Office receipt ${receipt.id} is invalid.`);
    requireNonemptyUnique(receipt.receivedSectionIds, `${receipt.id} received sections`);
    requireNonempty(receipt.deduplicationIdentity, `${receipt.id} deduplication identity`);
    const receiptSource = receipt.source;
    if (receiptSource.kind === "TECHNICAL_RETRIEVAL") {
      const retrieval = ledger.retrievals.find((entry) => entry.id === receiptSource.retrievalId);
      if (
        retrieval === undefined ||
        retrieval.result !== "AVAILABLE_AT_OFFICE_BOUNDARY" ||
        retrieval.requestingOfficeId !== receipt.recipientOfficeId ||
        retrieval.artifactId !== receipt.artifactId ||
        receipt.receivedSectionIds.some((id) => !retrieval.requestedSectionIds.includes(id)) ||
        instant(receipt.receivedAt, `${receipt.id} receipt`) < instant(retrieval.completedAt, `${retrieval.id} completion`)
      ) throw new Error(`Office receipt ${receipt.id} lacks a valid technical retrieval.`);
    } else {
      const source = artifact.kind === "SOURCE_EVIDENCE" ? null : artifact.producingOfficeId;
      assertEffectiveOfficeholder(
        state,
        receiptSource.sourceOfficeholderAssignmentId,
        receiptSource.sourceOfficeId,
        receipt.receivedAt,
      );
      if (source !== receiptSource.sourceOfficeId) {
        throw new Error(`Office receipt ${receipt.id} lacks a valid producing office.`);
      }
      if (instant(artifact.createdAt, `${artifact.id} creation`) > instant(receipt.receivedAt, `${receipt.id} receipt`)) {
        throw new Error(`Office transfer ${receipt.id} predates artifact ${artifact.id}.`);
      }
    }
    requireNonempty(receipt.receivingAuthorityReference, `${receipt.id} receiving authority`);
  }

  const presentations = state.presidentialPresentations.state.presentations;
  requireNonemptyUnique(presentations.map((entry) => entry.id), "Presidential presentation identities");
  requireNonemptyUnique(
    presentations.map((entry) => entry.deduplicationIdentity),
    "Presidential presentation deduplication identities",
  );
  assertPresentationHistory(presentations);
  for (const presentation of presentations) {
    const binding = state.administrationDirectory.state.presidentialRecipientBinding;
    if (
      presentation.recipientBindingId !== binding.id ||
      presentation.recipientActorId !== binding.actorId ||
      presentation.constitutionalOfficeId !== binding.constitutionalOfficeId ||
      !isEffectiveAt(binding.effectiveFrom, binding.effectiveUntil, presentation.presentedAt) ||
      instant(presentation.presentedAt, `${presentation.id} presentation`) > currentValue
    ) throw new Error(`Presidential presentation ${presentation.id} has an invalid recipient binding.`);
    assertEffectiveOfficeholder(
      state,
      presentation.presenterOfficeholderAssignmentId,
      presentation.presentingOfficeId,
      presentation.presentedAt,
    );
    requireNonemptyUnique(
      presentation.shownPortions.map((entry) => `${entry.artifactId}#${entry.sectionId}`),
      `${presentation.id} shown portions`,
    );
    requireUnique(
      presentation.referencedButNotShownPortions.map((entry) => `${entry.artifactId}#${entry.sectionId}`),
      `${presentation.id} referenced portions`,
    );
    const shownKeys = new Set(presentation.shownPortions.map((entry) => `${entry.artifactId}#${entry.sectionId}`));
    if (presentation.referencedButNotShownPortions.some((entry) => shownKeys.has(`${entry.artifactId}#${entry.sectionId}`))) {
      throw new Error(`Presidential presentation ${presentation.id} overlaps shown and unseen portions.`);
    }
    for (const portion of presentation.shownPortions) {
      requireNonempty(portion.artifactId, `${presentation.id} shown artifact`);
      requireNonempty(portion.sectionId, `${presentation.id} shown section`);
      if (!presenterCanShowArtifact(
        state,
        presentation.presentingOfficeId,
        portion.artifactId,
        portion.sectionId,
        presentation.presentedAt,
      )) {
        throw new Error(`Presidential presentation ${presentation.id} shows an unavailable artifact portion.`);
      }
    }
    for (const portion of presentation.referencedButNotShownPortions) {
      requireNonempty(portion.artifactId, `${presentation.id} referenced artifact`);
      requireNonempty(portion.sectionId, `${presentation.id} referenced section`);
      const artifact = findArtifact(state, portion.artifactId);
      if (
        artifact === undefined ||
        instant(artifact.createdAt, `${artifact.id} creation`) >
          instant(presentation.presentedAt, `${presentation.id} presentation`) ||
        !artifact.sectionIds.includes(portion.sectionId) ||
        !presentation.shownPortions.some((shown) =>
          artifactReachableFrom(state, portion.artifactId, shown.artifactId))
      ) throw new Error(`Presidential presentation ${presentation.id} references unrelated unseen material.`);
    }
    requireNonempty(presentation.purpose, `${presentation.id} purpose`);
    requireNonempty(presentation.provenanceReference, `${presentation.id} provenance`);
  }
  const escalationPresentations = state.presidentialPresentations.state.escalationPresentations;
  requireNonemptyUnique(
    escalationPresentations.map((entry) => entry.id),
    "Escalation-presentation identities",
  );
  requireNonemptyUnique(
    escalationPresentations.map((entry) => entry.deduplicationIdentity),
    "Escalation-presentation deduplication identities",
  );
  requireUnique(
    [...presentations.map((entry) => entry.id), ...escalationPresentations.map((entry) => entry.id)],
    "Presidential presentation-family identities",
  );
  for (const presentation of escalationPresentations) {
    const binding = state.administrationDirectory.state.presidentialRecipientBinding;
    if (
      presentation.recipientBindingId !== binding.id ||
      presentation.recipientActorId !== binding.actorId ||
      presentation.constitutionalOfficeId !== binding.constitutionalOfficeId ||
      !isEffectiveAt(binding.effectiveFrom, binding.effectiveUntil, presentation.presentedAt) ||
      instant(presentation.presentedAt, `${presentation.id} presentation`) > currentValue
    ) throw new Error(`Escalation presentation ${presentation.id} has an invalid recipient binding.`);
    assertEffectiveOfficeholder(
      state,
      presentation.presenterOfficeholderAssignmentId,
      presentation.presentingOfficeId,
      presentation.presentedAt,
    );
    requireNonempty(presentation.sourceEscalationId, `${presentation.id} escalation`);
    requireNonemptyUnique(presentation.shownSectionIds, `${presentation.id} shown sections`);
    requireNonemptyUnique(presentation.shownOptionIds, `${presentation.id} shown options`);
    requireUnique(presentation.shownPreviewIds, `${presentation.id} shown previews`);
    requireUnique(presentation.shownPreviewHashes, `${presentation.id} shown preview hashes`);
    if (presentation.shownPreviewIds.length !== presentation.shownPreviewHashes.length) {
      throw new Error(`Escalation presentation ${presentation.id} has mismatched preview evidence.`);
    }
    requireUnique(
      presentation.referencedButNotShownSourcePortions.map(
        (portion) => `${portion.artifactId}#${portion.sectionId}`,
      ),
      `${presentation.id} referenced source portions`,
    );
    for (const portion of presentation.referencedButNotShownSourcePortions) {
      requireNonempty(portion.artifactId, `${presentation.id} referenced artifact`);
      requireNonempty(portion.sectionId, `${presentation.id} referenced section`);
    }
    requireNonempty(presentation.purpose, `${presentation.id} purpose`);
    requireNonempty(presentation.provenanceReference, `${presentation.id} provenance`);
  }
};

export const deriveOfficeInformationView = (
  state: PresidentialAdministrationOwnerStates,
  configuration: PresidentialAdministrationConfiguration,
  officeId: string,
): OfficeInformationView => {
  if (!configuration.offices.some((office) => office.id === officeId)) {
    throw new Error(`Unknown presidential office ${officeId}.`);
  }
  const ledger = state.informationRoutes.state;
  const receipts = ledger.receipts.filter((entry) => entry.recipientOfficeId === officeId);
  return copyPlain({
    officeId,
    metadataNotices: ledger.metadataNotices.filter((entry) => entry.recipientOfficeId === officeId),
    accessEntitlements: ledger.accessEntitlements.filter((entry) => entry.officeId === officeId),
    retrievals: ledger.retrievals.filter((entry) => entry.requestingOfficeId === officeId),
    receipts,
    receivedArtifacts: receipts.map((receipt) => {
      const artifact = ledger.artifacts.find((entry) => entry.id === receipt.artifactId);
      if (artifact === undefined) throw new Error(`Office receipt ${receipt.id} references an unknown artifact.`);
      return {
        artifactId: artifact.id,
        kind: artifact.kind,
        receivedSectionIds: [...receipt.receivedSectionIds],
      };
    }),
    authoredArtifactIds: ledger.artifacts
      .filter((artifact) => artifact.kind !== "SOURCE_EVIDENCE" && artifact.producingOfficeId === officeId)
      .map((artifact) => artifact.id),
    instrumentReceipts: state.officeOperations.state
      .find((office) => office.officeId === officeId)?.instrumentReceipts ?? [],
    instrumentDispositions: state.officeOperations.state
      .find((office) => office.officeId === officeId)?.instrumentDispositions ?? [],
  });
};

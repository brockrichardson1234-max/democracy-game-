import { sha256Hex } from "../configuration/sha256";
import type { ConfigurationIdentity } from "../configuration/types";
import {
  assertEffectiveOfficeholder,
  assertPresidentialAdministrationOwnerStates,
  findArtifact,
  isEffectiveAt,
  type I5DomainEvidenceArtifact,
  type I5DomainEvidenceClaim,
  type I5OfficeCommunicationArtifact,
  type OfficeOperationsState,
  type PresidentialAdministrationConfiguration,
  type PresidentialAdministrationOwnerStates,
} from "./presidential-office-information";
import {
  createOfficeWorkAssignment,
  reorderOfficeQueue,
  transitionOfficeWorkAssignment,
} from "./presidential-office-information-operations";
import {
  advanceIntroducedProposalToGate,
  beginSponsorSearch,
  createLegislativeRuntimeState,
  introduceSponsoredProposal,
  seekMemberSponsorship,
  type LegislativeRuntimeContext,
  type LegislativeRuntimeState,
} from "./legislative-runtime";
import type {
  HistoricalRecordIndexEntry,
  OMBQueueCoordinationRequest,
  OMBQueueReprioritizationOccurrence,
  OMBReviewBookingRecord,
  OMBReviewCapacityState,
  OMBAssignmentSupersessionOccurrence,
  PresidentialDecisionRecord,
  PresidentialInstrumentRecord,
} from "./presidential-operating-intervention-types";
import {
  appendPresidentialInitiatedInquiryHistory,
  canonicalPresidentialInstrumentPayload,
  comparePresidentialHistoricalEntries,
  computePresidentialInstrumentPayloadHash,
  PRESIDENTIAL_OPERATING_DECISION_SURFACE,
  type PresidentialInterventionConfiguration,
  type PresidentialInterventionState,
  type PresidentialControlBindingState,
} from "./presidential-operating-intervention";
import type {
  ConcurrentWorldConfiguration,
  CongressionalAttemptEligibilityAssessment,
  CongressionalProcedureTransitionAttemptOccurrence,
  CongressionalTransitionKind,
  LegislativeTransitionAttemptAuthorization,
  EmploymentEvidenceReleaseOpportunity,
  EmploymentMaterialOccurrence,
  ExternalActorActionOccurrence,
  ExternalActorOwnerState,
  I5HumanIdentityLinkage,
  MediaStoryArtifact,
  PresidentialConcurrentWorldOwnerStates,
  PresidentialInquiryPreviewPresentation,
  RegionalEmploymentState,
} from "./presidential-operating-concurrent-world-types";

export type * from "./presidential-operating-concurrent-world-types";
export { PRESIDENTIAL_CONCURRENT_WORLD_SCHEMA_VERSION } from "./presidential-operating-concurrent-world-types";

type ConcurrentOperationState = PresidentialAdministrationOwnerStates &
  PresidentialInterventionState & PresidentialConcurrentWorldOwnerStates;

const copyPlain = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const i5HistoryKinds = new Set([
  "EMPLOYMENT_MATERIAL_OCCURRENCE", "EMPLOYMENT_EVIDENCE_RELEASE", "CONGRESSIONAL_RECEIPT",
  "CONGRESSIONAL_ELIGIBILITY_ASSESSMENT", "CONGRESSIONAL_FORMATION_DECISION",
  "CONGRESSIONAL_WINDOW_LIFECYCLE", "CONGRESSIONAL_TRANSITION_ATTEMPT", "EXTERNAL_ACTOR_RECEIPT",
  "EXTERNAL_ACTOR_ASSESSMENT", "EXTERNAL_ACTOR_ACTION", "MEDIA_RECEIPT", "MEDIA_EDITORIAL_DECISION",
  "MEDIA_PUBLICATION", "MEDIA_DISTRIBUTION", "MEDIA_EXPOSURE",
  "MATERNITY_SERVICE_MATERIAL_OCCURRENCE", "PRESIDENTIAL_INQUIRY_PRESENTATION",
  "PRESIDENTIAL_INQUIRY_LIFECYCLE", "OMB_COORDINATION_REQUEST", "OMB_QUEUE_REPRIORITIZATION",
  "OMB_ASSIGNMENT_SUPERSESSION",
  "I5_OFFICE_COMMUNICATION_PRODUCTION", "I5_EXTERNAL_COMMUNICATION_DISPATCH",
  "CONGRESSIONAL_ADMINISTRATION_EVIDENCE", "CONGRESSIONAL_ADMINISTRATION_RECEIPT",
]);

const expectedConcurrentHistory = (
  state: ConcurrentOperationState,
  intervention: PresidentialInterventionConfiguration,
): readonly HistoricalRecordIndexEntry[] => {
  const entries: HistoricalRecordIndexEntry[] = [];
  const add = (id: string, ownerId: string, recordKind: string, occurredAt: string,
    causalParentOccurrenceIds: readonly string[] = []): void => {
    entries.push({
      historyId: intervention.historyId,
      occurrenceId: id,
      ownerId,
      recordKind,
      occurredAt,
      ownerRecordId: id,
      causalParentOccurrenceIds: [...causalParentOccurrenceIds],
    });
  };
  const employment = state.regionalEmployment;
  employment.state.materialOccurrences.forEach((record) => add(
    record.id, employment.ownerId, "EMPLOYMENT_MATERIAL_OCCURRENCE", record.occurredAt,
    record.causeReferenceIds,
  ));
  employment.state.evidenceReleases.forEach((record) => add(
    record.id, employment.ownerId, "EMPLOYMENT_EVIDENCE_RELEASE", record.releasedAt,
    record.sourceOccurrenceIds,
  ));
  const congress = state.congressionalInitiative;
  congress.state.externalReceipts.forEach((record) => add(
    record.id, congress.ownerId, "CONGRESSIONAL_RECEIPT", record.receivedAt, [record.artifactId],
  ));
  congress.state.eligibilityAssessments.forEach((record) => add(
    record.id, congress.ownerId, "CONGRESSIONAL_ELIGIBILITY_ASSESSMENT", record.assessedAt, [record.receiptId],
  ));
  congress.state.formationDecisions.forEach((record) => add(
    record.id, congress.ownerId, "CONGRESSIONAL_FORMATION_DECISION", record.decidedAt, [record.assessmentId],
  ));
  congress.state.windowLifecycleOccurrences.forEach((record) => add(
    record.id, congress.ownerId, "CONGRESSIONAL_WINDOW_LIFECYCLE", record.occurredAt,
  ));
  congress.state.transitionAttempts.forEach((record) => add(
    record.id, congress.ownerId, "CONGRESSIONAL_TRANSITION_ATTEMPT", record.calledAt, [record.authorizationId],
  ));
  state.informationRoutes.state.artifacts
    .filter((record): record is I5DomainEvidenceArtifact => record.kind === "I5_DOMAIN_EVIDENCE" &&
      record.domainEvidenceKind === "CONGRESSIONAL_INITIATIVE_OPPORTUNITY")
    .forEach((record) => add(
      record.id, congress.ownerId, "CONGRESSIONAL_ADMINISTRATION_EVIDENCE", record.createdAt,
      record.sourceOccurrenceIds,
    ));
  state.informationRoutes.state.receipts
    .filter((record) => record.source.kind === "EXTERNAL_OWNER_DELIVERY" &&
      record.source.sourceOwnerId === congress.ownerId)
    .forEach((record) => add(
      record.id, state.informationRoutes.ownerId, "CONGRESSIONAL_ADMINISTRATION_RECEIPT", record.receivedAt,
      [record.artifactId],
    ));
  const actors = state.externalActors;
  actors.state.receipts.forEach((record) => add(
    record.id, actors.ownerId, "EXTERNAL_ACTOR_RECEIPT", record.receivedAt, [record.artifactId],
  ));
  actors.state.assessments.forEach((record) => add(
    record.id, actors.ownerId, "EXTERNAL_ACTOR_ASSESSMENT", record.assessedAt, [record.receiptId],
  ));
  actors.state.actions.forEach((record) => add(
    record.id, actors.ownerId, "EXTERNAL_ACTOR_ACTION", record.occurredAt, record.sourceReferenceIds,
  ));
  const media = state.boundedMedia;
  media.state.receipts.forEach((record) => add(
    record.id, media.ownerId, "MEDIA_RECEIPT", record.receivedAt, [record.artifactId],
  ));
  media.state.editorialDecisions.forEach((record) => add(
    record.id, media.ownerId, "MEDIA_EDITORIAL_DECISION", record.decidedAt,
    record.receiptId === null ? [] : [record.receiptId],
  ));
  media.state.stories.forEach((record) => add(
    record.id, media.ownerId, "MEDIA_PUBLICATION", record.publishedAt, [record.sourceReceiptId],
  ));
  media.state.distributionAttempts.forEach((record) => add(
    record.id, media.ownerId, "MEDIA_DISTRIBUTION", record.attemptedAt, [record.storyId],
  ));
  media.state.exposures.forEach((record) => add(
    record.id, media.ownerId, "MEDIA_EXPOSURE", record.exposedAt, [record.distributionAttemptId],
  ));
  const maternity = state.maternityServiceAccess;
  maternity.state.materialHistory.forEach((record) => add(
    record.id, maternity.ownerId, "MATERNITY_SERVICE_MATERIAL_OCCURRENCE", record.occurredAt,
  ));
  const inquiries = state.presidentialInquiries;
  inquiries.state.previewPresentations.forEach((record) => add(
    record.id, inquiries.ownerId, "PRESIDENTIAL_INQUIRY_PRESENTATION", record.presentedAt,
  ));
  inquiries.state.lifecycleOccurrences.forEach((record) => add(
    record.id, inquiries.ownerId, "PRESIDENTIAL_INQUIRY_LIFECYCLE", record.occurredAt, [record.causeRecordId],
  ));
  state.informationRoutes.state.artifacts
    .filter((record): record is I5OfficeCommunicationArtifact => record.kind === "I5_OFFICE_COMMUNICATION")
    .forEach((record) => add(
      record.id, state.informationRoutes.ownerId, "I5_OFFICE_COMMUNICATION_PRODUCTION", record.createdAt,
      [record.sourceInstrumentId, record.sourceDispositionId, record.sourceAssignmentId],
    ));
  for (const office of state.officeOperations.state) {
    office.externalCommunicationDispatches.forEach((record) => add(
      record.id, state.officeOperations.ownerId, "I5_EXTERNAL_COMMUNICATION_DISPATCH", record.dispatchedAt,
      [record.communicationArtifactId],
    ));
    const capacity = office.ombReviewCapacity;
    if (capacity === undefined) continue;
    capacity.coordinationRequests.forEach((record) => add(
      record.id, state.officeOperations.ownerId, "OMB_COORDINATION_REQUEST", record.createdAt,
      [record.sourceAuthorityId],
    ));
    capacity.queueReprioritizations.forEach((record) => add(
      record.id, state.officeOperations.ownerId, "OMB_QUEUE_REPRIORITIZATION", record.occurredAt,
      [record.sourceCoordinationRequestId],
    ));
    capacity.assignmentSupersessions.forEach((record) => add(
      record.id, state.officeOperations.ownerId, "OMB_ASSIGNMENT_SUPERSESSION", record.occurredAt,
      [record.sourceCoordinationRequestId],
    ));
  }
  return entries.sort(comparePresidentialHistoricalEntries);
};

export const appendDerivedPresidentialConcurrentHistory = <T extends ConcurrentOperationState>(
  state: T,
  intervention: PresidentialInterventionConfiguration,
): T => {
  const retained = state.historicalRecordIndex.state.entries.filter((entry) =>
    !i5HistoryKinds.has(entry.recordKind));
  return {
    ...state,
    historicalRecordIndex: {
      ...state.historicalRecordIndex,
      state: {
        ...state.historicalRecordIndex.state,
        entries: [...retained, ...expectedConcurrentHistory(state, intervention)]
          .sort(comparePresidentialHistoricalEntries),
      },
    },
  } as T;
};

const instant = (value: string, field: string): number => {
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) throw new Error(`${field} must be a valid instant.`);
  return parsed;
};

const requireNonempty = (value: string, field: string): void => {
  if (value.trim().length === 0) throw new Error(`${field} is required.`);
};

const requireUnique = (values: readonly string[], field: string): void => {
  if (new Set(values).size !== values.length) throw new Error(`${field} require unique values.`);
};

const requireNonemptyUnique = (values: readonly string[], field: string): void => {
  if (values.some((value) => value.trim().length === 0)) throw new Error(`${field} cannot be empty.`);
  requireUnique(values, field);
};

const sameOrdered = (left: readonly unknown[], right: readonly unknown[]): boolean =>
  JSON.stringify(left) === JSON.stringify(right);

const sameSet = (left: readonly string[], right: readonly string[]): boolean =>
  sameOrdered([...left].sort(), [...right].sort());

const compareAtAndId = <T>(
  left: T,
  right: T,
  atOf: (value: T) => string,
  idOf: (value: T) => string,
): number => instant(atOf(left), `${idOf(left)} time`) - instant(atOf(right), `${idOf(right)} time`) ||
  idOf(left).localeCompare(idOf(right));

const sortedAtAndId = <T>(
  values: readonly T[],
  atOf: (value: T) => string,
  idOf: (value: T) => string,
): readonly T[] => [...values].sort((left, right) => compareAtAndId(left, right, atOf, idOf));

const assertInterval = (from: string, until: string | null, field: string): void => {
  const start = instant(from, `${field}.effectiveFrom`);
  if (until !== null && instant(until, `${field}.effectiveUntil`) <= start) {
    throw new Error(`${field} requires a positive start-inclusive/end-exclusive interval.`);
  }
};

const sha = (value: unknown): string => sha256Hex(JSON.stringify(value));

export const computeI5DomainEvidenceArtifactHash = (
  artifact: Omit<I5DomainEvidenceArtifact, "canonicalArtifactHash">,
): string => sha(artifact);

const withoutArtifactHash = (
  artifact: I5DomainEvidenceArtifact,
): Omit<I5DomainEvidenceArtifact, "canonicalArtifactHash"> => {
  const { canonicalArtifactHash, ...withoutHash } = artifact;
  void canonicalArtifactHash;
  return withoutHash;
};

export const computeLegislativeRuntimeStateHash = (state: LegislativeRuntimeState): string => sha(state);

const exactTransitionSequence: readonly CongressionalTransitionKind[] = [
  "BEGIN_SPONSOR_SEARCH",
  "SEEK_MEMBER_SPONSORSHIP",
  "INTRODUCE_SPONSORED_PROPOSAL",
  "ADVANCE_INTRODUCED_PROPOSAL_TO_CONSIDERATION_GATE",
];

const exactEmploymentCells = [
  "OHIO_MANUFACTURING",
  "MICHIGAN_MANUFACTURING",
  "PENNSYLVANIA_SUPPLIER_LOGISTICS",
  "REST_OF_NATION",
] as const;

const exactAllowedExternalJoins: I5HumanIdentityLinkage["permittedJoins"] = [
  "ACTOR_IDENTITY",
  "PUBLIC_ROLE_OR_OFFICE",
  "CONSTITUENCY_JURISDICTION",
  "COMMUNICATION",
  "INFORMATION_RECEIPT",
  "ACTION_RECORD",
];

const exactProhibitedExternalJoins: I5HumanIdentityLinkage["prohibitedJoins"] = [
  "RESIDENCE",
  "HOUSEHOLD",
  "DEMOGRAPHIC",
  "MATERIAL_EXPOSURE",
  "PUBLIC_BELIEF",
  "VOTER",
  "ELIGIBILITY",
  "PERSONAL_LIFECYCLE",
];

const legislativeHumanActorIds = (configuration: ConcurrentWorldConfiguration): readonly string[] => {
  const legislativeOfficeIds = new Set(configuration.congress.structure.offices
    .filter((office) => office.kind === "LEGISLATIVE_MEMBER")
    .map((office) => office.id));
  return [...new Set(configuration.congress.structure.assignments
    .filter((assignment) => assignment.currentAtScenarioStart && legislativeOfficeIds.has(assignment.officeId))
    .map((assignment) => assignment.actorId))].sort();
};

export const assertConcurrentWorldConfiguration = (
  configuration: ConcurrentWorldConfiguration,
  administration: PresidentialAdministrationConfiguration,
  intervention: PresidentialInterventionConfiguration,
  epoch: string,
): void => {
  if (configuration.schemaVersion !== 1) throw new Error("Unsupported I5 concurrent-world schema version.");
  const ownerIds = Object.values(configuration.ownerIds);
  requireNonemptyUnique(ownerIds, "I5 owner identities");
  requireUnique([
    ...ownerIds,
    ...Object.values(administration.ownerIds),
    ...Object.values(intervention.ownerIds),
  ], "POP I5 owner identities");
  requireNonempty(configuration.provenanceReference, "I5 provenance root");

  if (
    administration.institutions.length !== 3 || administration.offices.length !== 9 ||
    administration.actors.length !== 10 || administration.officeholderAssignments.length !== 9 ||
    administration.populationLinkages.length !== 10 || administration.recipientCapabilities.length !== 9
  ) throw new Error("POP0-I5 requires exact administration closure 3/9/10/9/10 and nine capabilities.");

  if (configuration.humanRegistry.id !== "pop0.registry.i5-external-humans") {
    throw new Error("I5 external-human registry identity is invalid.");
  }
  requireNonempty(configuration.humanRegistry.provenanceReference, "I5 external-human registry provenance");
  requireNonemptyUnique(configuration.humanRegistry.entries.map((entry) => entry.actorId),
    "I5 external-human registry actor identities");
  const governorHumanIds = configuration.externalActors
    .filter((entry) => entry.kind === "GOVERNOR")
    .map((entry) => entry.humanActorId)
    .filter((entry): entry is string => entry !== null);
  const expectedRegistryIds = [...new Set([
    ...legislativeHumanActorIds(configuration),
    ...governorHumanIds,
  ])].sort();
  if (!sameOrdered(configuration.humanRegistry.entries.map((entry) => entry.actorId).sort(), expectedRegistryIds)) {
    throw new Error("I5 external-human registry does not exactly cover Congress and governor humans.");
  }
  const administrationActorIds = new Set(administration.actors.map((entry) => entry.id));
  for (const entry of configuration.humanRegistry.entries) {
    assertInterval(entry.effectiveFrom, entry.effectiveUntil, entry.actorId);
    if (
      administrationActorIds.has(entry.actorId) || entry.status !== "OUTSIDE_MODELED_ORDINARY_POPULATION_SCOPE" ||
      entry.populationWeight !== 0 || entry.effectiveFrom !== epoch || entry.effectiveUntil !== null ||
      !sameSet(entry.permittedJoins, exactAllowedExternalJoins) ||
      !sameSet(entry.prohibitedJoins, exactProhibitedExternalJoins)
    ) throw new Error(`I5 external human ${entry.actorId} has an invalid Population boundary.`);
    requireNonempty(entry.displayName, `${entry.actorId} display identity`);
    requireNonempty(entry.provenanceReference, `${entry.actorId} provenance`);
  }

  if (!sameSet(configuration.employment.cells.map((entry) => entry.id), exactEmploymentCells)) {
    throw new Error("I5 Employment configuration requires exactly four bounded cells.");
  }
  for (const cell of configuration.employment.cells) {
    if (!Number.isSafeInteger(cell.openingEmployed) || cell.openingEmployed <= 0) {
      throw new Error(`Employment cell ${cell.id} has invalid opening stock.`);
    }
    for (const value of [
      ...Object.values(cell.ordinaryHiresByBoundary),
      ...Object.values(cell.ordinarySeparationsByBoundary),
    ]) if (!Number.isSafeInteger(value) || value < 0) throw new Error(`Employment cell ${cell.id} has invalid flows.`);
  }
  const closure = configuration.employment.closurePlan;
  if (
    closure.affectedCellId !== "OHIO_MANUFACTURING" ||
    closure.tranches.reduce((sum, entry) => sum + entry.headcount, 0) !== closure.totalHeadcount
  ) throw new Error("I5 closure plan must reconcile its one-count Ohio plant overlay.");
  requireNonemptyUnique(closure.tranches.map((entry) => entry.id), "Plant separation tranches");
  if (closure.tranches.some((entry) => !Number.isSafeInteger(entry.headcount) || entry.headcount <= 0)) {
    throw new Error("Plant separation tranches require positive integer headcounts.");
  }
  requireNonemptyUnique(configuration.employment.releaseOpportunities.map((entry) => entry.id),
    "Employment release opportunities");
  requireNonemptyUnique(configuration.employment.releaseOpportunities.map((entry) => entry.artifactId),
    "Employment release artifacts");

  requireNonemptyUnique(configuration.domainObservationAuthorities.map((entry) => entry.id),
    "I5 domain-observation authorities");
  for (const authority of configuration.domainObservationAuthorities) {
    assertInterval(authority.effectiveFrom, authority.effectiveUntil, authority.id);
    requireNonemptyUnique(authority.permittedRecordKinds, `${authority.id} record kinds`);
    requireNonemptyUnique(authority.permittedClaimFamilies, `${authority.id} claim families`);
    requireNonemptyUnique(authority.permittedFieldPaths, `${authority.id} fields`);
    requireNonemptyUnique(authority.geographyOrEntityIds, `${authority.id} scope`);
    requireNonemptyUnique(authority.artifactKinds, `${authority.id} artifact kinds`);
  }
  for (const opportunity of configuration.employment.releaseOpportunities) {
    const authority = configuration.domainObservationAuthorities.find((entry) =>
      entry.id === opportunity.observationAuthorityId &&
      entry.sourceOwnerId === configuration.employment.ownerId &&
      entry.artifactKinds.includes(opportunity.domainEvidenceKind));
    if (authority === undefined) throw new Error(`Employment release ${opportunity.id} lacks claim-scoped authority.`);
  }

  if (
    configuration.congress.initiativeId !== configuration.congress.seed.proposal.id ||
    !sameOrdered(configuration.congress.procedureOpportunity.permittedTransitionKinds, exactTransitionSequence) ||
    configuration.congress.transitionAuthorityKinds.some((kind) => !exactTransitionSequence.includes(kind)) ||
    configuration.congress.administrationEvidenceDelivery.recipientOfficeId !==
      administration.offices.find((entry) => entry.id ===
        configuration.congress.administrationEvidenceDelivery.recipientOfficeId)?.id ||
    !sameOrdered(configuration.congress.administrationEvidenceDelivery.sectionIds,
      ["initiative", "window", "limitations"]) ||
    instant(configuration.congress.administrationEvidenceDelivery.deliveredAt, "Congress administration delivery") <
      instant(configuration.congress.evidenceDeliveryAt, "Congress formation evidence delivery") ||
    instant(configuration.congress.procedureOpportunity.closesAt, "Congress close") <=
      instant(configuration.congress.procedureOpportunity.opensAt, "Congress open")
  ) throw new Error("I5 Congress configuration contradicts the exact lower sequence/procedure interval.");
  requireUnique(configuration.congress.transitionAuthorityKinds, "Congress transition authorities");
  const activeAssignments = configuration.congress.structure.assignments.filter((entry) => entry.currentAtScenarioStart);
  for (const actorId of [configuration.congress.formationActorId, configuration.congress.sponsorActorId,
    configuration.congress.refusingSponsorActorId]) {
    if (!activeAssignments.some((entry) => entry.actorId === actorId)) {
      throw new Error(`I5 Congress actor ${actorId} lacks an active lower assignment.`);
    }
  }

  if (
    configuration.externalActors.length !== 5 ||
    configuration.externalActors.filter((entry) => entry.kind === "GOVERNOR").length !== 3 ||
    configuration.externalActors.filter((entry) => entry.kind !== "GOVERNOR").length !== 2
  ) throw new Error("I5 requires exactly three governors and two organizations.");
  requireNonemptyUnique(configuration.externalActors.map((entry) => entry.id), "I5 external actors");
  for (const actor of configuration.externalActors) {
    if (actor.kind === "GOVERNOR" ? actor.humanActorId === null : actor.humanActorId !== null) {
      throw new Error(`I5 external actor ${actor.id} has an invalid human linkage.`);
    }
    if (!actor.capabilityActionKinds.includes(actor.preferredActionKind)) {
      throw new Error(`I5 external actor ${actor.id} preferred action exceeds capability.`);
    }
  }

  if (configuration.mediaOutlets.length !== 2) throw new Error("I5 requires exactly two bounded media outlets.");
  requireNonemptyUnique(configuration.mediaOutlets.map((entry) => entry.id), "I5 media outlets");

  const maternity = configuration.maternityServiceAccess;
  if (
    maternity.withdrawnCapacity <= 0 || maternity.withdrawnCapacity > maternity.openingCapacity ||
    maternity.reconciledTravelBurdenMinutes < maternity.openingTravelBurdenMinutes
  ) throw new Error("I5 maternity-service configuration has invalid material quantities.");
  const maternityAuthorities = configuration.domainObservationAuthorities.filter((entry) =>
    entry.sourceOwnerId === maternity.ownerId);
  if (maternityAuthorities.length === 0) throw new Error("I5 maternity owner lacks claim-scoped observation authority.");

  if (configuration.presidentialInquiryOpportunities.length !== 1) {
    throw new Error("I5 permits exactly one proactive HHS inquiry opportunity.");
  }
  const inquiry = configuration.presidentialInquiryOpportunities[0];
  if (
    inquiry.sourceKind !== "GENERAL_SERVICE_ACCESS_QUESTION" ||
    inquiry.sourcePresidentialPresentationId !== null || inquiry.shownMetadataSectionIds.length !== 0 ||
    inquiry.generalQuestion.includes(maternity.facilityId) || inquiry.generalQuestion.includes(maternity.serviceAreaId)
  ) throw new Error("I5 general HHS inquiry leaks hidden service-owner identity.");

  const capacity = configuration.ombReviewCapacity;
  if (capacity.periods.length !== 9 || capacity.productPeriodRequirements.length !== 4 ||
    capacity.openingAssignments.length !== 2 || capacity.preferredQueueOrder.length !== 2) {
    throw new Error("I5 budget-review capacity requires one team, nine periods, four products, and two assignments.");
  }
  requireNonemptyUnique(capacity.periods.map((entry) => entry.id), "Budget-review work periods");
  const orderedPeriods = [...capacity.periods].sort((left, right) =>
    instant(left.startsAt, `${left.id} start`) - instant(right.startsAt, `${right.id} start`));
  for (let index = 0; index < orderedPeriods.length; index += 1) {
    const period = orderedPeriods[index];
    if (period.teamId !== capacity.teamId || instant(period.endsAt, `${period.id} end`) <=
      instant(period.startsAt, `${period.id} start`)) throw new Error(`Budget-review period ${period.id} is invalid.`);
    const prior = orderedPeriods[index - 1];
    if (prior !== undefined && instant(prior.endsAt, `${prior.id} end`) >
      instant(period.startsAt, `${period.id} start`)) throw new Error("Budget-review work periods overlap.");
  }
  if (!sameSet(capacity.preferredQueueOrder, capacity.openingAssignments.map((entry) => entry.id))) {
    throw new Error("I5 budget-review preferred queue does not contain the exact opening assignments.");
  }
};

const openingEmploymentState = (
  configuration: ConcurrentWorldConfiguration,
): RegionalEmploymentState => ({
  cells: configuration.employment.cells.map((entry) => ({
    id: entry.id,
    openingEmployed: entry.openingEmployed,
    currentEmployed: entry.openingEmployed,
    intervals: [],
  })).sort((left, right) => left.id.localeCompare(right.id)),
  materialOccurrences: [{
    id: configuration.employment.closurePlan.id,
    kind: "EMPLOYER_CLOSURE_DECISION",
    cellId: configuration.employment.closurePlan.affectedCellId,
    hires: 0,
    separations: 0,
    plantOverlaySeparations: 0,
    occurredAt: configuration.employment.closurePlan.decisionEffectiveAt,
    causeReferenceIds: [],
    provenanceReference: configuration.employment.closurePlan.provenanceReference,
  }],
  evidenceReleases: [],
});

export const createPresidentialConcurrentWorldOwnerStates = (
  configuration: ConcurrentWorldConfiguration,
): PresidentialConcurrentWorldOwnerStates => ({
  regionalEmployment: {
    ownerId: configuration.ownerIds.regionalEmployment,
    state: openingEmploymentState(configuration),
  },
  congressionalInitiative: {
    ownerId: configuration.ownerIds.congressionalInitiative,
    state: {
      formationOpportunity: copyPlain(configuration.congress.formationOpportunity),
      procedureOpportunity: copyPlain(configuration.congress.procedureOpportunity),
      externalReceipts: [],
      eligibilityAssessments: [],
      formationDecisions: [],
      legislativeRuntime: null,
      windowLifecycleOccurrences: [],
      attemptAuthorizations: [],
      transitionAttempts: [],
    },
  },
  externalActors: {
    ownerId: configuration.ownerIds.externalActors,
    state: {
      actorIds: configuration.externalActors.map((entry) => entry.id).sort(),
      receipts: [],
      assessments: [],
      actions: [],
    },
  },
  boundedMedia: {
    ownerId: configuration.ownerIds.boundedMedia,
    state: {
      outletIds: configuration.mediaOutlets.map((entry) => entry.id).sort(),
      receipts: [],
      editorialDecisions: [],
      stories: [],
      distributionAttempts: [],
      exposures: [],
    },
  },
  maternityServiceAccess: {
    ownerId: configuration.ownerIds.maternityServiceAccess,
    state: {
      facilityId: configuration.maternityServiceAccess.facilityId,
      serviceAreaId: configuration.maternityServiceAccess.serviceAreaId,
      effectiveCapacity: configuration.maternityServiceAccess.openingCapacity -
        configuration.maternityServiceAccess.withdrawnCapacity,
      catchmentCount: configuration.maternityServiceAccess.catchmentCount,
      currentTravelBurdenMinutes: configuration.maternityServiceAccess.openingTravelBurdenMinutes,
      materialHistory: [{
        id: "pop0.maternity-occurrence.configured-service-withdrawal",
        kind: "SERVICE_WITHDRAWAL",
        occurredAt: configuration.maternityServiceAccess.withdrawalOccurredAt,
        priorCapacity: configuration.maternityServiceAccess.openingCapacity,
        resultingCapacity: configuration.maternityServiceAccess.openingCapacity -
          configuration.maternityServiceAccess.withdrawnCapacity,
        priorTravelBurdenMinutes: configuration.maternityServiceAccess.openingTravelBurdenMinutes,
        resultingTravelBurdenMinutes: configuration.maternityServiceAccess.openingTravelBurdenMinutes,
        provenanceReference: configuration.maternityServiceAccess.provenanceReference,
      }],
      evidenceArtifactIds: [],
    },
  },
  presidentialInquiries: {
    ownerId: configuration.ownerIds.presidentialInquiries,
    state: {
      opportunities: copyPlain(configuration.presidentialInquiryOpportunities),
      previewPresentations: [],
      initiatedRequestDecisionIds: [],
      lifecycleOccurrences: [],
    },
  },
});

export const copyPresidentialConcurrentWorldOwnerStates = (
  state: PresidentialConcurrentWorldOwnerStates,
): PresidentialConcurrentWorldOwnerStates => copyPlain(state);

const replaceOffice = <T extends PresidentialAdministrationOwnerStates>(
  state: T,
  officeId: string,
  update: (office: OfficeOperationsState) => OfficeOperationsState,
): T => ({
  ...state,
  officeOperations: {
    ...state.officeOperations,
    state: state.officeOperations.state.map((office) => office.officeId === officeId ? update(office) : office),
  },
} as T);

export const composeOpeningConcurrentAdministration = <T extends PresidentialAdministrationOwnerStates>(
  state: T,
  administration: PresidentialAdministrationConfiguration,
  configuration: ConcurrentWorldConfiguration,
  epoch: string,
): T => {
  let next: T = state;
  for (const assignment of configuration.ombReviewCapacity.openingAssignments) {
    next = createOfficeWorkAssignment(next, administration, epoch, epoch, {
      ...assignment,
      leadOfficeId: configuration.ombReviewCapacity.officeId,
      requiredConsultationOfficeIds: [],
    }) as T;
  }
  next = reorderOfficeQueue(
    next,
    administration,
    epoch,
    epoch,
    configuration.ombReviewCapacity.officeId,
    configuration.ombReviewCapacity.preferredQueueOrder,
  ) as T;
  const periods = [...configuration.ombReviewCapacity.periods].sort((left, right) =>
    instant(left.startsAt, `${left.id} start`) - instant(right.startsAt, `${right.id} start`));
  let cursor = 0;
  const ombAssignment = (id: string) => configuration.ombReviewCapacity.openingAssignments
    .find((entry) => entry.id === id);
  const holder = administration.officeholderAssignments.find((entry) =>
    entry.officeId === configuration.ombReviewCapacity.officeId &&
    isEffectiveAt(entry.effectiveFrom, entry.effectiveUntil, epoch));
  if (holder === undefined) throw new Error("Opening budget-review capacity lacks an effective officeholder.");
  const bookings: OMBReviewBookingRecord[] = [];
  for (const assignmentId of configuration.ombReviewCapacity.preferredQueueOrder) {
    const assignment = ombAssignment(assignmentId);
    const requirement = configuration.ombReviewCapacity.productPeriodRequirements.find((entry) =>
      entry.productKind === assignment?.expectedProductKind);
    if (assignment === undefined || requirement === undefined) {
      throw new Error(`Opening budget-review assignment ${assignmentId} lacks a configured product requirement.`);
    }
    const selected = periods.slice(cursor, cursor + requirement.periodsConsumed);
    if (selected.length !== requirement.periodsConsumed) throw new Error("Budget-review opening queue exceeds capacity.");
    cursor += requirement.periodsConsumed;
    bookings.push({
      id: `${assignment.id}.budget-review-booking`,
      teamId: configuration.ombReviewCapacity.teamId,
      periodIds: selected.map((entry) => entry.id),
      assignmentId: assignment.id,
      authorizedProductKind: assignment.expectedProductKind,
      reservedAt: configuration.ombReviewCapacity.bookingOpensAt,
      consumedAt: null,
      releasedAt: null,
      status: "RESERVED",
      sourceAuthorizationId: assignment.authorityReference,
      actingOfficeholderAssignmentId: holder.id,
      provenanceReference: configuration.provenanceReference,
    });
  }
  return replaceOffice(next, configuration.ombReviewCapacity.officeId, (office) => ({
    ...office,
    ombReviewCapacity: {
      teamId: configuration.ombReviewCapacity.teamId,
      periods: copyPlain(configuration.ombReviewCapacity.periods),
      bookings,
      coordinationRequests: [],
      queueReprioritizations: [],
      assignmentSupersessions: [],
    },
  }));
};

export interface RecordOMBQueueCoordinationInput {
  readonly requestId: string;
  readonly occurrenceId: string;
  readonly sourceKind: "PRESIDENTIAL_INSTRUMENT" | "STANDING_CHIEF_OF_STAFF_AUTHORITY";
  readonly sourceAuthorityId: string;
  readonly requestedActions: readonly (
    | "REPRIORITIZE_OMB_REVIEW_QUEUE"
    | "SUPERSEDE_WITH_PERMITTED_NARROW_PRODUCT"
  )[];
  readonly referencedAssignmentIds: readonly string[];
  readonly requestedQueueOrder: readonly string[];
  readonly requestedNarrowProductKind: string | null;
  readonly provenanceReference: string;
}

const effectiveHolderForOffice = (
  administration: PresidentialAdministrationConfiguration,
  officeId: string,
  at: string,
) => {
  const holder = administration.officeholderAssignments.find((entry) =>
    entry.officeId === officeId && isEffectiveAt(entry.effectiveFrom, entry.effectiveUntil, at));
  if (holder === undefined) throw new Error(`Office ${officeId} lacks an effective queue-authority holder.`);
  return holder;
};

const rebookReservedOMBQueue = (
  capacity: OMBReviewCapacityState,
  configuration: ConcurrentWorldConfiguration,
  queue: readonly string[],
): readonly OMBReviewBookingRecord[] => {
  const periods = [...capacity.periods].sort((left, right) =>
    instant(left.startsAt, left.id) - instant(right.startsAt, right.id));
  const fixedPeriodIds = new Set(capacity.bookings.flatMap((booking) =>
    booking.status === "RESERVED" ? [] : booking.periodIds));
  const available = periods.filter((period) => !fixedPeriodIds.has(period.id));
  let cursor = 0;
  const replacements = new Map<string, OMBReviewBookingRecord>();
  for (const assignmentId of queue) {
    const booking = capacity.bookings.find((entry) => entry.assignmentId === assignmentId);
    if (booking === undefined || booking.status !== "RESERVED") continue;
    const requirement = configuration.ombReviewCapacity.productPeriodRequirements.find((entry) =>
      entry.productKind === booking.authorizedProductKind);
    if (requirement === undefined) throw new Error(`Budget-review booking ${booking.id} lacks a product requirement.`);
    const selected = available.slice(cursor, cursor + requirement.periodsConsumed);
    if (selected.length !== requirement.periodsConsumed) throw new Error("Budget-review queue reprioritization exceeds capacity.");
    cursor += requirement.periodsConsumed;
    replacements.set(assignmentId, { ...booking, periodIds: selected.map((entry) => entry.id) });
  }
  return capacity.bookings.map((booking) => replacements.get(booking.assignmentId) ?? booking);
};

export const recordOMBQueueCoordination = (
  state: ConcurrentOperationState,
  administration: PresidentialAdministrationConfiguration,
  intervention: PresidentialInterventionConfiguration,
  configuration: ConcurrentWorldConfiguration,
  epoch: string,
  current: string,
  input: RecordOMBQueueCoordinationInput,
): ConcurrentOperationState => {
  assertPresidentialConcurrentWorldOwnerStates(
    state, administration, intervention, configuration, epoch, current,
  );
  const authority = configuration.ombReviewCapacity.standingCoordinationAuthority;
  if (!isEffectiveAt(authority.effectiveFrom, authority.effectiveUntil, current) ||
    input.provenanceReference !== authority.provenanceReference ||
    input.requestedActions.length === 0 ||
    input.requestedActions.some((action) => !authority.permittedActions.includes(action)) ||
    input.referencedAssignmentIds.length === 0 ||
    input.referencedAssignmentIds.length > authority.maximumReferencedAssignments) {
    throw new Error("Budget-review coordination request exceeds its typed authority.");
  }
  requireNonemptyUnique(input.requestedActions, "Budget-review requested actions");
  requireNonemptyUnique(input.referencedAssignmentIds, "Budget-review referenced assignments");
  const officeId = configuration.ombReviewCapacity.officeId;
  const office = state.officeOperations.state.find((entry) => entry.officeId === officeId);
  const capacity = office?.ombReviewCapacity;
  if (office === undefined || capacity === undefined ||
    input.referencedAssignmentIds.some((id) => !office.assignments.some((entry) => entry.id === id)) ||
    !sameSet(input.requestedQueueOrder, office.activeQueueAssignmentIds)) {
    throw new Error("Budget-review coordination request does not preserve its office-owned assignment set.");
  }
  let initiatingOfficeId: string;
  let initiatingHolderId: string;
  if (input.sourceKind === "STANDING_CHIEF_OF_STAFF_AUTHORITY") {
    if (input.sourceAuthorityId !== authority.id) throw new Error("Budget-review queue request lacks standing authority.");
    initiatingOfficeId = authority.initiatingOfficeId;
    initiatingHolderId = effectiveHolderForOffice(administration, initiatingOfficeId, current).id;
  } else {
    const instrument = state.presidentialInstruments.state.find((entry) => entry.id === input.sourceAuthorityId);
    const dispatch = instrument === undefined ? undefined : state.instrumentDispatches.state.find((entry) =>
      entry.instrumentId === instrument.id && entry.outcome === "DELIVERED_TO_OFFICE_BOUNDARY" &&
      entry.recipientOfficeId === officeId);
    const receipt = instrument === undefined ? undefined : office.instrumentReceipts.find((entry) =>
      entry.instrumentId === instrument.id);
    const disposition = instrument === undefined ? undefined : office.instrumentDispositions.find((entry) =>
      entry.instrumentId === instrument.id && ["ACCEPTED_AS_REQUESTED", "NARROWED"].includes(entry.kind));
    if (instrument?.payload.kind !== "REQUEST_WORKSTREAM_COORDINATION" || dispatch === undefined ||
      receipt === undefined || disposition === undefined || input.requestedActions.some((action) =>
        !disposition.acceptedCoordinationActions.includes(action))) {
      throw new Error("Presidential budget-review coordination requires its delivered, received, accepted instrument.");
    }
    initiatingOfficeId = dispatch.dispatchingOfficeId;
    initiatingHolderId = effectiveHolderForOffice(administration, initiatingOfficeId, current).id;
  }
  const requestWithoutHash = {
    id: input.requestId,
    sourceKind: input.sourceKind,
    initiatingOfficeId,
    initiatingOfficeholderAssignmentId: initiatingHolderId,
    recipientOfficeId: officeId,
    teamId: capacity.teamId,
    requestedActions: [...input.requestedActions],
    referencedAssignmentIds: [...input.referencedAssignmentIds],
    requestedQueueOrder: [...input.requestedQueueOrder],
    requestedNarrowProductKind: input.requestedNarrowProductKind,
    sourceAuthorityId: input.sourceAuthorityId,
    createdAt: current,
    dispatchedAt: current,
    deliveredAt: current,
    receivedAt: current,
    disposition: "ACCEPTED" as const,
    provenanceReference: input.provenanceReference,
  };
  const request: OMBQueueCoordinationRequest = {
    ...requestWithoutHash,
    payloadHash: sha(requestWithoutHash),
  };
  if (capacity.coordinationRequests.some((entry) => entry.id === request.id) ||
    capacity.queueReprioritizations.some((entry) => entry.id === input.occurrenceId)) {
    throw new Error(`Budget-review coordination request ${request.id} already exists.`);
  }
  const holder = effectiveHolderForOffice(administration, officeId, current);
  const rebooked = rebookReservedOMBQueue(capacity, configuration, input.requestedQueueOrder);
  const occurrence: OMBQueueReprioritizationOccurrence = {
    id: input.occurrenceId,
    teamId: capacity.teamId,
    actingOfficeId: officeId,
    actingOfficeholderAssignmentId: holder.id,
    sourceCoordinationRequestId: request.id,
    authorityReference: input.sourceAuthorityId,
    priorQueueAssignmentIds: [...office.activeQueueAssignmentIds],
    resultingQueueAssignmentIds: [...input.requestedQueueOrder],
    affectedBookingIds: rebooked.filter((booking) => {
      const prior = capacity.bookings.find((entry) => entry.id === booking.id);
      return prior !== undefined && !sameOrdered(prior.periodIds, booking.periodIds);
    }).map((entry) => entry.id),
    occurredAt: current,
    provenanceReference: input.provenanceReference,
  };
  const next = replaceOffice(state, officeId, (entry) => ({
    ...entry,
    activeQueueAssignmentIds: [...input.requestedQueueOrder],
    ombReviewCapacity: {
      ...capacity,
      bookings: rebooked,
      coordinationRequests: [...capacity.coordinationRequests, request],
      queueReprioritizations: [...capacity.queueReprioritizations, occurrence],
    },
  }));
  return appendDerivedPresidentialConcurrentHistory(next, intervention);
};

export interface SupersedeOMBAssignmentWithNarrowProductInput {
  readonly occurrenceId: string;
  readonly sourceCoordinationRequestId: string;
  readonly priorAssignmentId: string;
  readonly replacementAssignmentId: string;
  readonly replacementProductKind: string;
  readonly provenanceReference: string;
}

export const supersedeOMBAssignmentWithNarrowProduct = (
  state: ConcurrentOperationState,
  administration: PresidentialAdministrationConfiguration,
  intervention: PresidentialInterventionConfiguration,
  configuration: ConcurrentWorldConfiguration,
  epoch: string,
  current: string,
  input: SupersedeOMBAssignmentWithNarrowProductInput,
): ConcurrentOperationState => {
  assertPresidentialConcurrentWorldOwnerStates(
    state, administration, intervention, configuration, epoch, current,
  );
  const officeId = configuration.ombReviewCapacity.officeId;
  const office = state.officeOperations.state.find((entry) => entry.officeId === officeId);
  const capacity = office?.ombReviewCapacity;
  const request = capacity?.coordinationRequests.find((entry) =>
    entry.id === input.sourceCoordinationRequestId);
  const prior = office?.assignments.find((entry) => entry.id === input.priorAssignmentId);
  const priorRequirement = configuration.ombReviewCapacity.productPeriodRequirements.find((entry) =>
    entry.productKind === prior?.expectedProductKind);
  const replacementRequirement = configuration.ombReviewCapacity.productPeriodRequirements.find((entry) =>
    entry.productKind === input.replacementProductKind);
  if (office === undefined || capacity === undefined || request === undefined || prior === undefined ||
    request.disposition !== "ACCEPTED" ||
    !request.requestedActions.includes("SUPERSEDE_WITH_PERMITTED_NARROW_PRODUCT") ||
    !request.referencedAssignmentIds.includes(prior.id) ||
    request.requestedNarrowProductKind !== input.replacementProductKind ||
    priorRequirement?.classification !== "FULL" || replacementRequirement?.classification !== "LESS_CLAIMING" ||
    priorRequirement.subjectFamily !== replacementRequirement.subjectFamily ||
    !["QUEUED", "IN_PROGRESS", "BLOCKED", "DELAYED"].includes(prior.status) ||
    input.provenanceReference !== request.provenanceReference ||
    capacity.assignmentSupersessions.some((entry) => entry.id === input.occurrenceId) ||
    office.assignments.some((entry) => entry.id === input.replacementAssignmentId)) {
    throw new Error("Budget-review assignment narrowing lacks one accepted, less-claiming supersession authority.");
  }
  const priorQueue = [...office.activeQueueAssignmentIds];
  let next = createOfficeWorkAssignment(state, administration, epoch, current, {
    id: input.replacementAssignmentId,
    requesterId: prior.requesterId,
    leadOfficeId: officeId,
    objective: `Produce the typed less-claiming ${input.replacementProductKind} authorized by ${request.id}.`,
    sourceReferenceIds: [...prior.sourceReferenceIds],
    requiredConsultationOfficeIds: [...prior.requiredConsultationOfficeIds],
    authorityReference: request.id,
    deadline: prior.deadline,
    expectedProductKind: input.replacementProductKind,
  }) as ConcurrentOperationState;
  next = transitionOfficeWorkAssignment(next, administration, epoch, current, {
    officeId,
    assignmentId: prior.id,
    status: "SUPERSEDED",
    reason: "Replaced by an explicitly authorized less-claiming budget-review product.",
    statusProvenanceReferenceId: request.id,
    resultArtifactIds: [],
    supersededByAssignmentId: input.replacementAssignmentId,
  }) as ConcurrentOperationState;
  const resultingQueue = priorQueue.map((id) => id === prior.id ? input.replacementAssignmentId : id);
  next = reorderOfficeQueue(next, administration, epoch, current, officeId, resultingQueue) as ConcurrentOperationState;
  const updatedOffice = next.officeOperations.state.find((entry) => entry.officeId === officeId)!;
  const oldBooking = capacity.bookings.find((entry) => entry.assignmentId === prior.id);
  if (oldBooking === undefined || oldBooking.status !== "RESERVED") {
    throw new Error("Budget-review narrowing may replace only an unconsumed reserved booking.");
  }
  const unavailable = new Set(capacity.bookings.flatMap((booking) =>
    booking.id === oldBooking.id || booking.status === "RELEASED" ? [] : booking.periodIds));
  const selected = [...capacity.periods].sort((left, right) =>
    instant(left.startsAt, left.id) - instant(right.startsAt, right.id))
    .filter((period) => !unavailable.has(period.id)).slice(0, replacementRequirement.periodsConsumed);
  if (selected.length !== replacementRequirement.periodsConsumed) {
    throw new Error("Budget-review narrowed assignment cannot obtain its exact named-team periods.");
  }
  const holder = effectiveHolderForOffice(administration, officeId, current);
  const replacementBooking: OMBReviewBookingRecord = {
    id: `${input.replacementAssignmentId}.budget-review-booking`,
    teamId: capacity.teamId,
    periodIds: selected.map((entry) => entry.id),
    assignmentId: input.replacementAssignmentId,
    authorizedProductKind: input.replacementProductKind,
    reservedAt: current,
    consumedAt: null,
    releasedAt: null,
    status: "RESERVED",
    sourceAuthorizationId: request.id,
    actingOfficeholderAssignmentId: holder.id,
    provenanceReference: input.provenanceReference,
  };
  const occurrence: OMBAssignmentSupersessionOccurrence = {
    id: input.occurrenceId,
    teamId: capacity.teamId,
    actingOfficeId: officeId,
    actingOfficeholderAssignmentId: holder.id,
    sourceCoordinationRequestId: request.id,
    priorAssignmentId: prior.id,
    replacementAssignmentId: input.replacementAssignmentId,
    priorProductKind: prior.expectedProductKind,
    replacementProductKind: input.replacementProductKind,
    sourceScopeReferenceIds: [...prior.sourceReferenceIds],
    occurredAt: current,
    reasonClassification: "PERMITTED_LESS_CLAIMING_PRODUCT",
    authorityReference: request.sourceAuthorityId,
    provenanceReference: input.provenanceReference,
  };
  const withSupersession = replaceOffice(next, officeId, (entry) => ({
    ...entry,
    assignments: updatedOffice.assignments,
    activeQueueAssignmentIds: updatedOffice.activeQueueAssignmentIds,
    ombReviewCapacity: {
      ...capacity,
      bookings: [
        ...capacity.bookings.map((booking) => booking.id === oldBooking.id ? {
          ...booking, status: "RELEASED" as const, releasedAt: current,
        } : booking),
        replacementBooking,
      ],
      assignmentSupersessions: [...capacity.assignmentSupersessions, occurrence],
    },
  }));
  return appendDerivedPresidentialConcurrentHistory(withSupersession, intervention);
};

const appendArtifactToLedger = (
  state: ConcurrentOperationState,
  artifact: I5DomainEvidenceArtifact,
  institutionId: string,
): ConcurrentOperationState => {
  if (state.informationRoutes.state.artifacts.some((entry) => entry.id === artifact.id)) return state;
  const possessionId = `${artifact.id}.institution-possession`;
  const indexId = `${artifact.id}.index`;
  const next: ConcurrentOperationState = {
    ...state,
    informationRoutes: {
      ...state.informationRoutes,
      state: {
        ...state.informationRoutes.state,
        artifacts: sortedAtAndId(
          [...state.informationRoutes.state.artifacts, artifact],
          (entry) => entry.createdAt,
          (entry) => entry.id,
        ),
        institutionPossessions: sortedAtAndId([
          ...state.informationRoutes.state.institutionPossessions,
          {
            id: possessionId,
            artifactId: artifact.id,
            possessingInstitutionId: institutionId,
            possessedAt: artifact.releasedAt,
            acquisitionProvenanceReference: artifact.provenanceReference,
          },
        ], (entry) => entry.possessedAt, (entry) => entry.id),
        indexEntries: sortedAtAndId([
          ...state.informationRoutes.state.indexEntries,
          {
            id: indexId,
            artifactId: artifact.id,
            sourcePossessionId: possessionId,
            sourceInstitutionId: institutionId,
            artifactVersion: artifact.version,
            accessClass: artifact.accessClass,
            availableSectionIds: [...artifact.sectionIds],
            createdAt: artifact.releasedAt,
            provenanceReference: artifact.provenanceReference,
          },
        ], (entry) => entry.createdAt, (entry) => entry.id),
      },
    },
  };
  return next;
};

const employmentBoundaryInstants = (configuration: ConcurrentWorldConfiguration): readonly string[] => [
  ...configuration.employment.closurePlan.tranches.map((entry) => entry.occursAt),
  ...configuration.employment.cells.flatMap((cell) => [
    ...Object.keys(cell.ordinaryHiresByBoundary),
    ...Object.keys(cell.ordinarySeparationsByBoundary),
  ]),
];

export const concurrentWorldBoundaryInstants = (
  configuration: ConcurrentWorldConfiguration,
): readonly string[] => [...new Set([
  ...employmentBoundaryInstants(configuration),
  ...configuration.employment.releaseOpportunities.map((entry) => entry.opensAt),
  configuration.congress.evidenceDeliveryAt,
  configuration.congress.administrationEvidenceDelivery.deliveredAt,
  configuration.congress.formationOpportunity.opensAt,
  configuration.congress.formationOpportunity.closesAt,
  configuration.congress.procedureOpportunity.opensAt,
  configuration.congress.procedureOpportunity.closesAt,
  ...configuration.externalActors.flatMap((entry) => [entry.opportunityAt, entry.closesAt]),
  ...configuration.mediaOutlets.flatMap((entry) => [entry.opportunityAt, entry.closesAt]),
  configuration.maternityServiceAccess.burdenReconciliationAt,
  ...configuration.presidentialInquiryOpportunities.map((entry) => entry.deadline),
  ...configuration.ombReviewCapacity.periods.flatMap((entry) => [entry.startsAt, entry.endsAt]),
  ...configuration.ombReviewCapacity.openingAssignments.map((entry) => entry.deadline),
])].sort((left, right) => instant(left, left) - instant(right, right));

const appendEmploymentBoundary = (
  state: ConcurrentOperationState,
  configuration: ConcurrentWorldConfiguration,
  at: string,
): ConcurrentOperationState => {
  if (!employmentBoundaryInstants(configuration).includes(at)) return state;
  const priorState = state.regionalEmployment.state;
  let material = [...priorState.materialOccurrences];
  const intervals = new Map(priorState.cells.map((entry) => [entry.id, [...entry.intervals]]));
  const current = new Map(priorState.cells.map((entry) => [entry.id, entry.currentEmployed]));
  for (const cellConfig of configuration.employment.cells) {
    const ordinaryHires = cellConfig.ordinaryHiresByBoundary[at] ?? 0;
    const ordinarySeparations = cellConfig.ordinarySeparationsByBoundary[at] ?? 0;
    const tranches = configuration.employment.closurePlan.tranches.filter((entry) =>
      entry.occursAt === at && cellConfig.id === configuration.employment.closurePlan.affectedCellId);
    const overlay = tranches.reduce((sum, entry) => sum + entry.headcount, 0);
    const sourceOccurrenceIds: string[] = [];
    if (ordinaryHires !== 0 || ordinarySeparations !== 0) {
      const id = `pop0.employment-occurrence.${cellConfig.id.toLowerCase()}.${sha(at).slice(0, 12)}.ordinary`;
      if (!material.some((entry) => entry.id === id)) material.push({
        id, kind: "ORDINARY_GROSS_FLOW", cellId: cellConfig.id,
        hires: ordinaryHires, separations: ordinarySeparations, plantOverlaySeparations: 0,
        occurredAt: at, causeReferenceIds: [], provenanceReference: cellConfig.provenanceReference,
      });
      sourceOccurrenceIds.push(id);
    }
    for (const tranche of tranches) {
      const id = `pop0.employment-occurrence.${tranche.id}`;
      if (!material.some((entry) => entry.id === id)) material.push({
        id, kind: "PLANT_SEPARATION", cellId: cellConfig.id, hires: 0,
        separations: tranche.headcount, plantOverlaySeparations: tranche.headcount, occurredAt: at,
        causeReferenceIds: [configuration.employment.closurePlan.id],
        provenanceReference: configuration.employment.closurePlan.provenanceReference,
      });
      sourceOccurrenceIds.push(id);
    }
    if (ordinaryHires === 0 && ordinarySeparations === 0 && overlay === 0) continue;
    const opening = current.get(cellConfig.id) ?? cellConfig.openingEmployed;
    const separations = ordinarySeparations + overlay;
    const closing = opening + ordinaryHires - separations;
    const id = `pop0.employment-interval.${cellConfig.id.toLowerCase()}.${sha(at).slice(0, 12)}`;
    const list = intervals.get(cellConfig.id) ?? [];
    if (!list.some((entry) => entry.id === id)) list.push({
      id, cellId: cellConfig.id,
      opensAt: list[list.length - 1]?.closesAt ?? configuration.employment.closurePlan.decisionEffectiveAt,
      closesAt: at, openingEmployed: opening, hires: ordinaryHires, separations,
      closingEmployed: closing, namedPlantOverlaySeparations: overlay,
      sourceOccurrenceIds, revisionIdentity: `${id}.v1`, provenanceReference: cellConfig.provenanceReference,
    });
    intervals.set(cellConfig.id, list);
    current.set(cellConfig.id, closing);
  }
  const cumulativePlant = material.filter((entry) => entry.kind === "PLANT_SEPARATION")
    .reduce((sum, entry) => sum + entry.plantOverlaySeparations, 0);
  const supplier = configuration.employment.supplierExposure;
  if (cumulativePlant >= supplier.triggerCumulativePlantSeparations &&
    !material.some((entry) => entry.id === supplier.occurrenceId)) {
    const separations = Math.floor(cumulativePlant * supplier.numerator / supplier.denominator);
    material.push({
      id: supplier.occurrenceId, kind: "SUPPLIER_CONTRACTION", cellId: supplier.targetCellId,
      hires: 0, separations, plantOverlaySeparations: 0, occurredAt: at,
      causeReferenceIds: material.filter((entry) => entry.kind === "PLANT_SEPARATION").map((entry) => entry.id),
      provenanceReference: configuration.employment.provenanceReference,
    });
    const opening = current.get(supplier.targetCellId)!;
    const list = intervals.get(supplier.targetCellId)!;
    const intervalId = `pop0.employment-interval.${supplier.targetCellId.toLowerCase()}.${sha(at).slice(0, 12)}.supplier`;
    list.push({
      id: intervalId, cellId: supplier.targetCellId,
      opensAt: list[list.length - 1]?.closesAt ?? configuration.employment.closurePlan.decisionEffectiveAt,
      closesAt: at, openingEmployed: opening, hires: 0, separations,
      closingEmployed: opening - separations, namedPlantOverlaySeparations: 0,
      sourceOccurrenceIds: [supplier.occurrenceId], revisionIdentity: `${intervalId}.v1`,
      provenanceReference: configuration.employment.provenanceReference,
    });
    current.set(supplier.targetCellId, opening - separations);
  }
  material = sortedAtAndId(material, (entry) => entry.occurredAt, (entry) => entry.id) as EmploymentMaterialOccurrence[];
  return {
    ...state,
    regionalEmployment: {
      ...state.regionalEmployment,
      state: {
        ...priorState,
        cells: priorState.cells.map((entry) => ({
          ...entry, currentEmployed: current.get(entry.id)!,
          intervals: sortedAtAndId(intervals.get(entry.id)!, (candidate) => candidate.closesAt, (candidate) => candidate.id),
        })),
        materialOccurrences: material,
      },
    },
  };
};

const buildEmploymentArtifact = (
  state: ConcurrentOperationState,
  configuration: ConcurrentWorldConfiguration,
  opportunity: EmploymentEvidenceReleaseOpportunity,
): I5DomainEvidenceArtifact | null => {
  const authority = configuration.domainObservationAuthorities.find((entry) =>
    entry.id === opportunity.observationAuthorityId &&
    isEffectiveAt(entry.effectiveFrom, entry.effectiveUntil, opportunity.opensAt));
  const sources = state.regionalEmployment.state.materialOccurrences.filter((entry) =>
    instant(entry.occurredAt, `${entry.id} occurrence`) <= instant(opportunity.opensAt, `${opportunity.id} release`));
  if (authority === undefined || sources.length === 0) return null;
  const claims: I5DomainEvidenceClaim[] = opportunity.sectionIds.map((sectionId, index) => ({
    id: `${opportunity.artifactId}.claim.${index + 1}`,
    sectionId,
    claimFamily: opportunity.domainEvidenceKind,
    value: index === 0
      ? state.regionalEmployment.state.cells.reduce((sum, entry) => sum + entry.currentEmployed, 0)
      : sources.map((entry) => entry.id),
    sourceOwnerId: configuration.ownerIds.regionalEmployment,
    sourceRecordId: sources[Math.min(index, sources.length - 1)].id,
    sourceRecordHash: sha(sources[Math.min(index, sources.length - 1)]),
    observedAt: opportunity.opensAt,
    observationAuthorityId: authority.id,
  }));
  const withoutHash = {
    kind: "I5_DOMAIN_EVIDENCE" as const,
    domainEvidenceKind: opportunity.domainEvidenceKind,
    id: opportunity.artifactId, version: "1",
    producerInstitutionId: configuration.employment.producerInstitutionId,
    producingOfficeId: null, authoringOfficeholderAssignmentId: null,
    sourceOwnerId: configuration.ownerIds.regionalEmployment,
    sourceOccurrenceIds: sources.map((entry) => entry.id), observationAuthorityId: authority.id,
    asOf: opportunity.opensAt, createdAt: opportunity.opensAt, releasedAt: opportunity.opensAt,
    sectionIds: [...opportunity.sectionIds], claims, accessClass: opportunity.accessClass,
    analysisOnly: opportunity.analysisOnly,
    uncertainty: opportunity.domainEvidenceKind.includes("PRELIMINARY") ? ["Preliminary vintage; revision expected."] : [],
    provenanceReference: configuration.employment.provenanceReference,
    revisionOfArtifactId: opportunity.revisionOfArtifactId,
    supersedesArtifactId: opportunity.supersedesArtifactId,
  };
  return { ...withoutHash, canonicalArtifactHash: computeI5DomainEvidenceArtifactHash(withoutHash) };
};

const releaseEmploymentEvidence = (
  state: ConcurrentOperationState,
  configuration: ConcurrentWorldConfiguration,
  at: string,
): ConcurrentOperationState => {
  let next = state;
  for (const opportunity of configuration.employment.releaseOpportunities.filter((entry) => entry.opensAt === at)) {
    if (next.regionalEmployment.state.evidenceReleases.some((entry) => entry.opportunityId === opportunity.id)) continue;
    const artifact = buildEmploymentArtifact(next, configuration, opportunity);
    if (artifact === null) continue;
    next = appendArtifactToLedger(next, artifact, configuration.employment.producerInstitutionId);
    next = {
      ...next,
      regionalEmployment: {
        ...next.regionalEmployment,
        state: {
          ...next.regionalEmployment.state,
          evidenceReleases: [...next.regionalEmployment.state.evidenceReleases, {
            id: `${opportunity.id}.release`, artifactId: artifact.id, opportunityId: opportunity.id,
            sourceOccurrenceIds: [...artifact.sourceOccurrenceIds], observationAuthorityId: artifact.observationAuthorityId,
            releasedAt: at, provenanceReference: artifact.provenanceReference,
          }],
        },
      },
    };
  }
  return next;
};

const congressContext = (configuration: ConcurrentWorldConfiguration): LegislativeRuntimeContext => ({
  structure: configuration.congress.structure,
  seed: configuration.congress.seed,
});

const addCongressReceiptAndFormation = (
  state: ConcurrentOperationState,
  configuration: ConcurrentWorldConfiguration,
  identity: ConfigurationIdentity,
  at: string,
): ConcurrentOperationState => {
  const congress = state.congressionalInitiative.state;
  if (at !== configuration.congress.evidenceDeliveryAt || congress.externalReceipts.length !== 0) return state;
  const artifact = findArtifact(state, configuration.congress.formationOpportunity.requiredArtifactId);
  if (artifact === undefined) return state;
  const receipt = {
    id: "pop0.congress-receipt.formation-evidence",
    recipientActorId: configuration.congress.formationActorId,
    artifactId: artifact.id,
    sectionIds: [...configuration.congress.formationOpportunity.requiredSectionIds],
    deliveredAt: at, receivedAt: at,
    authorityReference: configuration.congress.formationOpportunity.id,
    provenanceReference: configuration.congress.provenanceReference,
  };
  const assessment: CongressionalAttemptEligibilityAssessment = {
    id: "pop0.congress-assessment.formation-eligibility",
    actorId: configuration.congress.formationActorId,
    transitionKind: "FORMATION",
    receiptId: receipt.id,
    result: configuration.congress.formationObjectiveScore >= configuration.congress.formationThreshold
      ? "ELIGIBLE_TO_ATTEMPT" : "NOT_ELIGIBLE_TO_ATTEMPT",
    objectiveScore: configuration.congress.formationObjectiveScore,
    requiredThreshold: configuration.congress.formationThreshold,
    assessedAt: at,
    provenanceReference: configuration.congress.provenanceReference,
  };
  const initiate = assessment.result === "ELIGIBLE_TO_ATTEMPT" &&
    instant(at, "Congress formation") >= instant(congress.formationOpportunity.opensAt, "Formation open") &&
    instant(at, "Congress formation") < instant(congress.formationOpportunity.closesAt, "Formation close");
  const lower = initiate ? createLegislativeRuntimeState(identity, congressContext(configuration)) : null;
  return {
    ...state,
    congressionalInitiative: {
      ...state.congressionalInitiative,
      state: {
        ...congress,
        externalReceipts: [receipt],
        eligibilityAssessments: [assessment],
        formationDecisions: [{
          id: "pop0.congress-formation-decision.regional-employment-stabilization",
          actorId: configuration.congress.formationActorId,
          opportunityId: congress.formationOpportunity.id,
          assessmentId: assessment.id,
          decision: initiate ? "INITIATE_DRAFT" : "DEFER",
          decidedAt: at,
          legislativeRuntimeReference: initiate ? configuration.congress.legislativeRuntimeReference : null,
          provenanceReference: configuration.congress.provenanceReference,
        }],
        legislativeRuntime: lower,
      },
    },
  };
};

const deliverCongressEvidenceToAdministration = (
  state: ConcurrentOperationState,
  configuration: ConcurrentWorldConfiguration,
  at: string,
): ConcurrentOperationState => {
  const delivery = configuration.congress.administrationEvidenceDelivery;
  if (at !== delivery.deliveredAt || state.informationRoutes.state.artifacts.some((entry) =>
    entry.id === delivery.artifactId)) return state;
  const congress = state.congressionalInitiative.state;
  const formation = congress.formationDecisions.find((entry) => entry.decision === "INITIATE_DRAFT");
  if (formation === undefined || congress.legislativeRuntime === null) return state;
  const claims: I5DomainEvidenceClaim[] = [
    {
      id: `${delivery.artifactId}.claim.initiative`, sectionId: "initiative",
      claimFamily: "CONGRESSIONAL_INITIATIVE_OPPORTUNITY", value: configuration.congress.initiativeId,
      sourceOwnerId: state.congressionalInitiative.ownerId, sourceRecordId: formation.id,
      sourceRecordHash: sha(formation), observedAt: at, observationAuthorityId: delivery.id,
    },
    {
      id: `${delivery.artifactId}.claim.procedure-interval`, sectionId: "window",
      claimFamily: "CONGRESSIONAL_INITIATIVE_OPPORTUNITY",
      value: configuration.congress.procedureOpportunity.closesAt,
      sourceOwnerId: state.congressionalInitiative.ownerId,
      sourceRecordId: configuration.congress.procedureOpportunity.id,
      sourceRecordHash: sha(configuration.congress.procedureOpportunity),
      observedAt: at, observationAuthorityId: delivery.id,
    },
  ];
  const withoutHash = {
    kind: "I5_DOMAIN_EVIDENCE" as const,
    domainEvidenceKind: "CONGRESSIONAL_INITIATIVE_OPPORTUNITY" as const,
    id: delivery.artifactId, version: "1",
    producerInstitutionId: state.congressionalInitiative.ownerId,
    producingOfficeId: null, authoringOfficeholderAssignmentId: null,
    sourceOwnerId: state.congressionalInitiative.ownerId,
    sourceOccurrenceIds: [formation.id], observationAuthorityId: delivery.id,
    asOf: at, createdAt: at, releasedAt: at,
    sectionIds: [...delivery.sectionIds], claims,
    accessClass: "CONGRESS_TO_LEGISLATIVE_AFFAIRS_BOUNDED_OPPORTUNITY",
    analysisOnly: false,
    uncertainty: ["The route reports an initiative and procedural opportunity, not a guaranteed lower result."],
    provenanceReference: delivery.provenanceReference,
    revisionOfArtifactId: null, supersedesArtifactId: null,
  };
  const artifact: I5DomainEvidenceArtifact = {
    ...withoutHash,
    canonicalArtifactHash: computeI5DomainEvidenceArtifactHash(withoutHash),
  };
  return {
    ...state,
    informationRoutes: {
      ...state.informationRoutes,
      state: {
        ...state.informationRoutes.state,
        artifacts: sortedAtAndId([...state.informationRoutes.state.artifacts, artifact],
          (entry) => entry.createdAt, (entry) => entry.id),
        receipts: sortedAtAndId([...state.informationRoutes.state.receipts, {
          id: `${delivery.id}.receipt`, recipientOfficeId: delivery.recipientOfficeId,
          artifactId: artifact.id, receivedSectionIds: [...delivery.sectionIds],
          source: {
            kind: "EXTERNAL_OWNER_DELIVERY" as const,
            sourceOwnerId: state.congressionalInitiative.ownerId,
            deliveryAuthorityId: delivery.id,
          },
          receivedAt: at, receivingAuthorityReference: delivery.id,
          deduplicationIdentity: `${delivery.id}.receipt.dedupe`,
        }], (entry) => entry.receivedAt, (entry) => entry.id),
      },
    },
  };
};

const callLowerCongressTransition = (
  lower: LegislativeRuntimeState,
  configuration: ConcurrentWorldConfiguration,
  kind: CongressionalTransitionKind,
): LegislativeRuntimeState => {
  const context = congressContext(configuration);
  if (kind === "BEGIN_SPONSOR_SEARCH") return beginSponsorSearch(lower);
  if (kind === "SEEK_MEMBER_SPONSORSHIP") {
    return seekMemberSponsorship(lower, context, configuration.congress.sponsorActorId);
  }
  if (kind === "INTRODUCE_SPONSORED_PROPOSAL") {
    const sponsorship = lower.procedure.sponsorship;
    if (sponsorship.status !== "ACCEPTED" || sponsorship.actorId !== configuration.congress.sponsorActorId ||
      sponsorship.assignmentId === null) return lower;
    return introduceSponsoredProposal(lower, context, sponsorship.actorId, sponsorship.assignmentId);
  }
  if (lower.procedure.stage !== "INTRODUCED_IN_ORIGIN") return lower;
  return advanceIntroducedProposalToGate(lower, context);
};

const runCongressWindow = (
  state: ConcurrentOperationState,
  configuration: ConcurrentWorldConfiguration,
  at: string,
): ConcurrentOperationState => {
  const congress = state.congressionalInitiative.state;
  if (at === congress.procedureOpportunity.closesAt &&
    !congress.windowLifecycleOccurrences.some((entry) => entry.kind === "EXPIRED")) {
    return {
      ...state,
      congressionalInitiative: {
        ...state.congressionalInitiative,
        state: {
          ...congress,
          windowLifecycleOccurrences: [...congress.windowLifecycleOccurrences, {
            id: `${congress.procedureOpportunity.id}.expired`, kind: "EXPIRED", occurredAt: at,
            provenanceReference: configuration.congress.provenanceReference,
          }],
        },
      },
    };
  }
  if (at !== congress.procedureOpportunity.opensAt || congress.legislativeRuntime === null ||
    congress.windowLifecycleOccurrences.some((entry) => entry.kind === "OPENED")) return state;
  let lower = congress.legislativeRuntime;
  const authorizations = [...congress.attemptAuthorizations];
  const attempts = [...congress.transitionAttempts];
  const eligibility = congress.eligibilityAssessments[0];
  const receipt = congress.externalReceipts[0];
  if (eligibility === undefined || receipt === undefined || eligibility.result !== "ELIGIBLE_TO_ATTEMPT") return state;
  for (const kind of exactTransitionSequence) {
    const actorId = kind === "SEEK_MEMBER_SPONSORSHIP" || kind === "INTRODUCE_SPONSORED_PROPOSAL"
      ? configuration.congress.sponsorActorId : configuration.congress.formationActorId;
    const assignment = lower.activeAssignments.find((entry) => entry.actorId === actorId);
    if (assignment === undefined) throw new Error(`Congress transition ${kind} lacks an active lower assignment.`);
    const canCall = kind === "BEGIN_SPONSOR_SEARCH" ||
      kind === "SEEK_MEMBER_SPONSORSHIP" && lower.procedure.stage === "SPONSOR_SOUGHT" ||
      kind === "INTRODUCE_SPONSORED_PROPOSAL" && lower.procedure.stage === "SPONSOR_SOUGHT" &&
        lower.procedure.sponsorship.status === "ACCEPTED" ||
      kind === "ADVANCE_INTRODUCED_PROPOSAL_TO_CONSIDERATION_GATE" &&
        lower.procedure.stage === "INTRODUCED_IN_ORIGIN";
    if (!canCall) break;
    const preHash = computeLegislativeRuntimeStateHash(lower);
    const authorization: LegislativeTransitionAttemptAuthorization = {
      id: `pop0.congress-transition-authorization.${kind.toLowerCase()}`,
      opportunityId: congress.procedureOpportunity.id,
      eligibilityAssessmentId: eligibility.id,
      receiptId: receipt.id,
      actorId,
      assignmentId: assignment.id,
      transitionKind: kind,
      authorizedLowerPreStateHash: preHash,
      authorizedAt: at,
      authorityReference: congress.procedureOpportunity.id,
      provenanceReference: configuration.congress.provenanceReference,
    };
    const post = callLowerCongressTransition(lower, configuration, kind);
    const attempt: CongressionalProcedureTransitionAttemptOccurrence = {
      id: `pop0.congress-transition-attempt.${kind.toLowerCase()}`,
      authorizationId: authorization.id,
      transitionKind: kind,
      calledAt: at,
      lowerPreStateHash: preHash,
      lowerPostStateHash: computeLegislativeRuntimeStateHash(post),
      lowerOccurrenceId: null,
      authorityReference: authorization.authorityReference,
      provenanceReference: configuration.congress.provenanceReference,
    };
    authorizations.push(authorization);
    attempts.push(attempt);
    lower = post;
  }
  return {
    ...state,
    congressionalInitiative: {
      ...state.congressionalInitiative,
      state: {
        ...congress,
        legislativeRuntime: lower,
        windowLifecycleOccurrences: [...congress.windowLifecycleOccurrences, {
          id: `${congress.procedureOpportunity.id}.opened`, kind: "OPENED", occurredAt: at,
          provenanceReference: configuration.congress.provenanceReference,
        }],
        attemptAuthorizations: authorizations,
        transitionAttempts: attempts,
      },
    },
  };
};

const preliminaryEmploymentArtifact = (
  state: ConcurrentOperationState,
): I5DomainEvidenceArtifact | undefined => state.informationRoutes.state.artifacts.find(
  (entry): entry is I5DomainEvidenceArtifact => entry.kind === "I5_DOMAIN_EVIDENCE" &&
    entry.domainEvidenceKind === "PRELIMINARY_REGIONAL_EMPLOYMENT_ESTIMATE",
);

const runExternalActorOpportunities = (
  state: ConcurrentOperationState,
  configuration: ConcurrentWorldConfiguration,
  at: string,
): ConcurrentOperationState => {
  const evidence = preliminaryEmploymentArtifact(state);
  let external: ExternalActorOwnerState = state.externalActors.state;
  for (const actor of configuration.externalActors.filter((entry) => entry.opportunityAt === at)) {
    if (external.actions.some((entry) => entry.actorOrInstitutionId === actor.id)) continue;
    const communicationReceipt = [...external.receipts].reverse().find((entry) =>
      entry.recipientActorOrInstitutionId === (actor.humanActorId ?? actor.id) &&
      findArtifact(state, entry.artifactId)?.kind === "I5_OFFICE_COMMUNICATION");
    const receipt = communicationReceipt ?? (evidence !== undefined && actor.evidenceAccess !== "NONE" ? {
      id: `pop0.external-receipt.${actor.id}`,
      recipientActorOrInstitutionId: actor.humanActorId ?? actor.id,
      artifactId: evidence.id,
      sectionIds: actor.evidenceAccess === "SUBSTANTIVE" ? [...evidence.sectionIds] : [evidence.sectionIds[0]],
      deliveredAt: at, receivedAt: at, provenanceReference: actor.provenanceReference,
    } : null);
    const assessment = receipt === null ? null : {
      id: `pop0.external-assessment.${actor.id}`,
      actorOrInstitutionId: actor.humanActorId ?? actor.id,
      receiptId: receipt.id,
      support: actor.evidenceAccess === "SUBSTANTIVE" ? "SUBSTANTIVE" as const : "METADATA_ONLY" as const,
      objectiveScore: actor.objectiveScore, resourceScore: actor.resourceScore,
      relationshipScore: actor.relationshipScore, assessedAt: at,
      provenanceReference: actor.provenanceReference,
    };
    const score = actor.objectiveScore + actor.resourceScore + actor.relationshipScore;
    const chosen = assessment !== null && score >= actor.actionThreshold
      ? actor.preferredActionKind : assessment === null ? "NO_ACTION" : "DEFER";
    const action: ExternalActorActionOccurrence = {
      id: `pop0.external-action.${actor.id}`,
      actorOrInstitutionId: actor.humanActorId ?? actor.id,
      opportunityAt: actor.opportunityAt,
      kind: chosen,
      receiptId: receipt?.id ?? null,
      assessmentId: assessment?.id ?? null,
      sourceReferenceIds: assessment === null ? [] : [assessment.id],
      occurredAt: at,
      provenanceReference: actor.provenanceReference,
    };
    external = {
      ...external,
      receipts: receipt === null || communicationReceipt !== undefined
        ? external.receipts : [...external.receipts, receipt],
      assessments: assessment === null ? external.assessments : [...external.assessments, assessment],
      actions: [...external.actions, action],
    };
  }
  return { ...state, externalActors: { ...state.externalActors, state: external } };
};

const runMediaOpportunities = (
  state: ConcurrentOperationState,
  configuration: ConcurrentWorldConfiguration,
  at: string,
): ConcurrentOperationState => {
  const evidence = preliminaryEmploymentArtifact(state);
  let media = state.boundedMedia.state;
  for (const outlet of configuration.mediaOutlets.filter((entry) => entry.opportunityAt === at)) {
    if (media.editorialDecisions.some((entry) => entry.outletId === outlet.id)) continue;
    const communicationReceipt = [...media.receipts].reverse().find((entry) =>
      entry.outletId === outlet.id && findArtifact(state, entry.artifactId)?.kind === "I5_OFFICE_COMMUNICATION");
    const receipt = communicationReceipt ?? (evidence !== undefined && outlet.access !== "NONE" ? {
      id: `pop0.media-receipt.${outlet.id}`, outletId: outlet.id, artifactId: evidence.id,
      sectionIds: outlet.access === "SUBSTANTIVE" ? [...evidence.sectionIds] : [evidence.sectionIds[0]],
      deliveredAt: at, receivedAt: at, provenanceReference: outlet.provenanceReference,
    } : null);
    const score = outlet.editorialPriority + outlet.investigativeResources;
    const publishes = receipt !== null && score >= outlet.publicationThreshold;
    const decision = {
      id: `pop0.media-decision.${outlet.id}`, outletId: outlet.id,
      receiptId: receipt?.id ?? null,
      decision: (publishes
        ? outlet.access === "SUBSTANTIVE" ? "PUBLISH" : "PUBLISH_NARROWER_CLAIMS"
        : receipt === null ? "DECLINE" : "DEFER") as "PUBLISH" | "PUBLISH_NARROWER_CLAIMS" | "DECLINE" | "DEFER",
      editorialPriority: outlet.editorialPriority,
      investigativeResources: outlet.investigativeResources,
      decidedAt: at, provenanceReference: outlet.provenanceReference,
    };
    const story: MediaStoryArtifact | null = publishes && receipt !== null ? {
      id: `pop0.media-story.${outlet.id}`, outletId: outlet.id, sourceReceiptId: receipt.id,
      claimSectionIds: [...receipt.sectionIds],
      limitations: findArtifact(state, receipt.artifactId)?.kind === "I5_OFFICE_COMMUNICATION"
        ? ["Publication reflects a received administration statement; outlet selection remains independent."]
        : outlet.access === "SUBSTANTIVE" ? [...evidence!.uncertainty] : ["Metadata-only publication."],
      publishedAt: at, revisionOfStoryId: null, supersedesStoryId: null,
      provenanceReference: outlet.provenanceReference,
    } : null;
    const attempts = story === null ? [] : outlet.distributionRecipientIds.map((recipientId, index) => ({
      id: `${story.id}.distribution.${index + 1}`, storyId: story.id, recipientId,
      attemptedAt: at, outcome: "DELIVERED_TO_BOUNDARY" as const, deliveredAt: at,
      provenanceReference: outlet.provenanceReference,
    }));
    media = {
        ...media,
        receipts: receipt === null || communicationReceipt !== undefined ? media.receipts : [...media.receipts, receipt],
      editorialDecisions: [...media.editorialDecisions, decision],
      stories: story === null ? media.stories : [...media.stories, story],
      distributionAttempts: [...media.distributionAttempts, ...attempts],
    };
  }
  return { ...state, boundedMedia: { ...state.boundedMedia, state: media } };
};

const reconcileMaternityAccess = (
  state: ConcurrentOperationState,
  configuration: ConcurrentWorldConfiguration,
  at: string,
): ConcurrentOperationState => {
  const owner = state.maternityServiceAccess.state;
  if (at !== configuration.maternityServiceAccess.burdenReconciliationAt ||
    owner.materialHistory.some((entry) => entry.kind === "ACCESS_BURDEN_RECONCILED")) return state;
  return {
    ...state,
    maternityServiceAccess: {
      ...state.maternityServiceAccess,
      state: {
        ...owner,
        currentTravelBurdenMinutes: configuration.maternityServiceAccess.reconciledTravelBurdenMinutes,
        materialHistory: [...owner.materialHistory, {
          id: "pop0.maternity-occurrence.access-burden-reconciled",
          kind: "ACCESS_BURDEN_RECONCILED",
          occurredAt: at,
          priorCapacity: owner.effectiveCapacity,
          resultingCapacity: owner.effectiveCapacity,
          priorTravelBurdenMinutes: owner.currentTravelBurdenMinutes,
          resultingTravelBurdenMinutes: configuration.maternityServiceAccess.reconciledTravelBurdenMinutes,
          provenanceReference: configuration.maternityServiceAccess.provenanceReference,
        }],
      },
    },
  };
};

const applyInquiryExpirations = (
  state: ConcurrentOperationState,
  configuration: ConcurrentWorldConfiguration,
  at: string,
): ConcurrentOperationState => {
  let inquiry = state.presidentialInquiries.state;
  for (const opportunity of inquiry.opportunities.filter((entry) => entry.deadline === at)) {
    if (inquiry.lifecycleOccurrences.some((entry) => entry.opportunityId === opportunity.id)) continue;
    inquiry = {
      ...inquiry,
      lifecycleOccurrences: [...inquiry.lifecycleOccurrences, {
        id: `${opportunity.id}.expired`, opportunityId: opportunity.id, kind: "EXPIRED",
        causeRecordId: opportunity.id, occurredAt: at, provenanceReference: opportunity.provenanceReference,
      }],
    };
  }
  return { ...state, presidentialInquiries: { ...state.presidentialInquiries, state: inquiry } };
};

const appendOfficeProducedArtifact = (
  state: ConcurrentOperationState,
  artifact: I5DomainEvidenceArtifact | I5OfficeCommunicationArtifact,
): ConcurrentOperationState => {
  const holderId = artifact.authoringOfficeholderAssignmentId;
  if (artifact.producingOfficeId === null || holderId === null) throw new Error("Office product lacks office authorship.");
  const productionId = `${artifact.id}.production`;
  return {
    ...state,
    informationRoutes: {
      ...state.informationRoutes,
      state: {
        ...state.informationRoutes.state,
        artifacts: sortedAtAndId([...state.informationRoutes.state.artifacts, artifact],
          (entry) => entry.createdAt, (entry) => entry.id),
        officeArtifactProductions: sortedAtAndId([
          ...state.informationRoutes.state.officeArtifactProductions,
          {
            id: productionId, artifactId: artifact.id, producingOfficeId: artifact.producingOfficeId,
            producingOfficeholderAssignmentId: holderId, producedAt: artifact.createdAt,
            provenanceReference: artifact.provenanceReference,
          },
        ], (entry) => entry.producedAt, (entry) => entry.id),
      },
    },
  };
};

const applyOMBDeadlineAndCapacity = (
  state: ConcurrentOperationState,
  administration: PresidentialAdministrationConfiguration,
  configuration: ConcurrentWorldConfiguration,
  epoch: string,
  at: string,
): ConcurrentOperationState => {
  const officeId = configuration.ombReviewCapacity.officeId;
  let next = state;
  let office = next.officeOperations.state.find((entry) => entry.officeId === officeId);
  if (office?.ombReviewCapacity === undefined) throw new Error("Budget office lacks its configured review-capacity owner.");
  for (const configured of configuration.ombReviewCapacity.openingAssignments.filter((entry) => entry.deadline === at)) {
    const assignment = office.assignments.find((entry) => entry.id === configured.id);
    if (assignment !== undefined && ["QUEUED", "IN_PROGRESS", "BLOCKED"].includes(assignment.status)) {
      const defaultId = `${assignment.id}.deadline-default`;
      next = replaceOffice(next, officeId, (candidate) => ({
        ...candidate,
        assignments: candidate.assignments.map((entry) => entry.id === assignment.id ? {
          ...entry, status: "DELAYED" as const, statusUpdatedAt: at,
          failureReason: "Required budget-review periods were not consumed by the authorized deadline.",
          statusProvenanceReferenceId: defaultId,
        } : entry),
        deadlineDefaultRecords: [...candidate.deadlineDefaultRecords, {
          id: defaultId, assignmentId: assignment.id, occurredAt: at, outcome: "DELAYED" as const,
          provenanceReference: configuration.provenanceReference,
        }],
      }));
      office = next.officeOperations.state.find((entry) => entry.officeId === officeId)!;
    }
  }
  office = next.officeOperations.state.find((entry) => entry.officeId === officeId)!;
  const capacity = office.ombReviewCapacity!;
  for (const booking of capacity.bookings.filter((entry) => entry.status === "RESERVED")) {
    const assignment = office.assignments.find((entry) => entry.id === booking.assignmentId);
    const periods = booking.periodIds.map((id) => capacity.periods.find((entry) => entry.id === id));
    const lastEnd = periods.reduce((latest, period) => period !== undefined &&
      instant(period.endsAt, period.id) > instant(latest, "Latest budget-review period") ? period.endsAt : latest,
    configuration.ombReviewCapacity.bookingOpensAt);
    if (lastEnd !== at || assignment === undefined || !["QUEUED", "IN_PROGRESS"].includes(assignment.status) ||
      instant(at, "Budget-review completion") > instant(assignment.deadline, `${assignment.id} deadline`)) continue;
    const holder = assertEffectiveOfficeholder(next, booking.actingOfficeholderAssignmentId, officeId, at);
    const sourceClaims: I5DomainEvidenceClaim[] = [{
      id: `pop0.artifact.budget-review-result.${assignment.id}.claim.1`, sectionId: "bounded-result",
      claimFamily: "OMB_REVIEW_PRODUCT", value: assignment.expectedProductKind,
      sourceOwnerId: next.officeOperations.ownerId, sourceRecordId: assignment.id,
      sourceRecordHash: sha(assignment), observedAt: at,
      observationAuthorityId: assignment.authorityReference,
    }];
    const withoutHash = {
      kind: "I5_DOMAIN_EVIDENCE" as const, domainEvidenceKind: "OMB_REVIEW_PRODUCT" as const,
      id: `pop0.artifact.budget-review-result.${assignment.id}`, version: "1",
      producerInstitutionId: officeId, producingOfficeId: officeId,
      authoringOfficeholderAssignmentId: holder.id,
      sourceOwnerId: next.officeOperations.ownerId, sourceOccurrenceIds: [assignment.id],
      observationAuthorityId: assignment.authorityReference, asOf: at, createdAt: at, releasedAt: at,
      sectionIds: ["bounded-result"], claims: sourceClaims, accessClass: "OMB_INTERNAL_PRODUCT",
      analysisOnly: true, uncertainty: ["Bounded proof product; no direct domain outcome authority."],
      provenanceReference: configuration.provenanceReference,
      revisionOfArtifactId: null, supersedesArtifactId: null,
    };
    const artifact: I5DomainEvidenceArtifact = {
      ...withoutHash, canonicalArtifactHash: computeI5DomainEvidenceArtifactHash(withoutHash),
    };
    next = appendOfficeProducedArtifact(next, artifact);
    next = replaceOffice(next, officeId, (candidate) => ({
      ...candidate,
      assignments: candidate.assignments.map((entry) => entry.id === assignment.id ? {
        ...entry, status: "COMPLETED" as const, statusUpdatedAt: at, failureReason: null,
        statusProvenanceReferenceId: `${artifact.id}.production`, resultArtifactIds: [artifact.id],
      } : entry),
      activeQueueAssignmentIds: candidate.activeQueueAssignmentIds.filter((id) => id !== assignment.id),
      ombReviewCapacity: {
        ...candidate.ombReviewCapacity!,
        bookings: candidate.ombReviewCapacity!.bookings.map((entry) => entry.id === booking.id ? {
          ...entry, status: "CONSUMED" as const, consumedAt: at,
        } : entry),
      },
    }));
    office = next.officeOperations.state.find((entry) => entry.officeId === officeId)!;
  }
  return next;
};

const advanceAt = (
  state: ConcurrentOperationState,
  administration: PresidentialAdministrationConfiguration,
  configuration: ConcurrentWorldConfiguration,
  identity: ConfigurationIdentity,
  epoch: string,
  at: string,
): ConcurrentOperationState => {
  // Exact same-instant order: defaults/expiry, material, evidence, independent actors,
  // Congress procedure, then office queue work.
  let next = applyInquiryExpirations(state, configuration, at);
  next = applyOMBDeadlineAndCapacity(next, administration, configuration, epoch, at);
  next = appendEmploymentBoundary(next, configuration, at);
  next = reconcileMaternityAccess(next, configuration, at);
  next = releaseEmploymentEvidence(next, configuration, at);
  next = addCongressReceiptAndFormation(next, configuration, identity, at);
  next = deliverCongressEvidenceToAdministration(next, configuration, at);
  next = runExternalActorOpportunities(next, configuration, at);
  next = runMediaOpportunities(next, configuration, at);
  next = runCongressWindow(next, configuration, at);
  return next;
};

export const advancePresidentialConcurrentWorld = (
  state: ConcurrentOperationState,
  administration: PresidentialAdministrationConfiguration,
  configuration: ConcurrentWorldConfiguration,
  identity: ConfigurationIdentity,
  epoch: string,
  previousCurrent: string,
  target: string,
): ConcurrentOperationState => {
  const previous = instant(previousCurrent, "Previous I5 time");
  const targetValue = instant(target, "Target I5 time");
  if (targetValue < previous) throw new Error("I5 concurrent world cannot move backwards.");
  let next = state;
  for (const at of concurrentWorldBoundaryInstants(configuration).filter((entry) => {
    const value = instant(entry, "I5 boundary");
    return value > previous && value <= targetValue;
  })) next = advanceAt(next, administration, configuration, identity, epoch, at);
  return next;
};

const validateEmployment = (
  state: ConcurrentOperationState,
  configuration: ConcurrentWorldConfiguration,
  current: string,
): void => {
  if (!sameSet(state.regionalEmployment.state.cells.map((entry) => entry.id), exactEmploymentCells)) {
    throw new Error("Employment owner cell set is invalid.");
  }
  const materialIds = state.regionalEmployment.state.materialOccurrences.map((entry) => entry.id);
  requireNonemptyUnique(materialIds, "Employment material occurrences");
  for (const cell of state.regionalEmployment.state.cells) {
    let expected = cell.openingEmployed;
    for (const interval of cell.intervals) {
      if (interval.cellId !== cell.id || interval.openingEmployed !== expected ||
        interval.openingEmployed + interval.hires - interval.separations !== interval.closingEmployed ||
        interval.namedPlantOverlaySeparations > interval.separations ||
        interval.sourceOccurrenceIds.some((id) => !materialIds.includes(id))) {
        throw new Error(`Employment cell ${cell.id} violates stock/flow reconciliation.`);
      }
      expected = interval.closingEmployed;
    }
    if (cell.currentEmployed !== expected) throw new Error(`Employment cell ${cell.id} has duplicate/omitted flow truth.`);
  }
  const configuredTotal = configuration.employment.closurePlan.totalHeadcount;
  const actualPlant = state.regionalEmployment.state.materialOccurrences
    .filter((entry) => entry.kind === "PLANT_SEPARATION")
    .reduce((sum, entry) => sum + entry.plantOverlaySeparations, 0);
  const duePlant = configuration.employment.closurePlan.tranches
    .filter((entry) => instant(entry.occursAt, entry.id) <= instant(current, "Current I5 time"))
    .reduce((sum, entry) => sum + entry.headcount, 0);
  if (actualPlant !== duePlant || actualPlant > configuredTotal) {
    throw new Error("Employment plant overlay is not admitted exactly once.");
  }
  for (const release of state.regionalEmployment.state.evidenceReleases) {
    const opportunity = configuration.employment.releaseOpportunities.find((entry) => entry.id === release.opportunityId);
    const artifact = findArtifact(state, release.artifactId);
    if (opportunity === undefined || artifact?.kind !== "I5_DOMAIN_EVIDENCE" ||
      artifact.observationAuthorityId !== opportunity.observationAuthorityId ||
      artifact.canonicalArtifactHash !== computeI5DomainEvidenceArtifactHash(withoutArtifactHash(artifact)) ||
      release.sourceOccurrenceIds.some((id) => !materialIds.includes(id))) {
      throw new Error(`Employment evidence release ${release.id} has invalid owner lineage.`);
    }
  }
};

const validateCongress = (
  state: ConcurrentOperationState,
  configuration: ConcurrentWorldConfiguration,
  current: string,
): void => {
  const congress = state.congressionalInitiative.state;
  const delivery = configuration.congress.administrationEvidenceDelivery;
  const deliveredArtifacts = state.informationRoutes.state.artifacts.filter((entry): entry is I5DomainEvidenceArtifact =>
    entry.kind === "I5_DOMAIN_EVIDENCE" && entry.domainEvidenceKind === "CONGRESSIONAL_INITIATIVE_OPPORTUNITY");
  const deliveredReceipts = state.informationRoutes.state.receipts.filter((entry) =>
    entry.source.kind === "EXTERNAL_OWNER_DELIVERY" &&
    entry.source.deliveryAuthorityId === delivery.id);
  const formation = congress.formationDecisions.find((entry) => entry.decision === "INITIATE_DRAFT");
  const deliveryDue = formation !== undefined &&
    instant(current, "Congress validation time") >= instant(delivery.deliveredAt, "Congress administration delivery");
  if (deliveryDue ? deliveredArtifacts.length !== 1 || deliveredReceipts.length !== 1
    : deliveredArtifacts.length !== 0 || deliveredReceipts.length !== 0) {
    throw new Error("Congress administration evidence route is missing, early, or duplicated.");
  }
  if (deliveryDue) {
    const artifact = deliveredArtifacts[0];
    const receipt = deliveredReceipts[0];
    if (artifact.id !== delivery.artifactId || artifact.sourceOwnerId !== state.congressionalInitiative.ownerId ||
      artifact.observationAuthorityId !== delivery.id || artifact.sourceOccurrenceIds.length !== 1 ||
      artifact.sourceOccurrenceIds[0] !== formation!.id ||
      artifact.canonicalArtifactHash !== computeI5DomainEvidenceArtifactHash(withoutArtifactHash(artifact)) ||
      receipt.artifactId !== artifact.id || receipt.recipientOfficeId !== delivery.recipientOfficeId ||
      !sameOrdered(receipt.receivedSectionIds, delivery.sectionIds) || receipt.receivedAt !== delivery.deliveredAt) {
      throw new Error("Congress administration evidence route copies or fabricates initiative truth.");
    }
  }
  requireUnique(congress.transitionAttempts.map((entry) => entry.transitionKind), "Congress transition attempts");
  if (!sameOrdered(congress.transitionAttempts.map((entry) => entry.transitionKind),
    exactTransitionSequence.slice(0, congress.transitionAttempts.length))) {
    throw new Error("Congress outer attempt sequence is invalid.");
  }
  if (congress.legislativeRuntime === null) {
    if (congress.transitionAttempts.length !== 0) throw new Error("Congress attempts exist without direct lower owner.");
    return;
  }
  const decision = formation;
  if (decision === undefined) throw new Error("Direct legislative owner lacks its formation decision.");
  let replay = createLegislativeRuntimeState(congress.legislativeRuntime.configuration, congressContext(configuration));
  for (const attempt of congress.transitionAttempts) {
    const authorization = congress.attemptAuthorizations.find((entry) => entry.id === attempt.authorizationId);
    if (authorization === undefined || authorization.transitionKind !== attempt.transitionKind ||
      authorization.authorizedLowerPreStateHash !== computeLegislativeRuntimeStateHash(replay) ||
      attempt.lowerPreStateHash !== computeLegislativeRuntimeStateHash(replay) ||
      attempt.lowerOccurrenceId !== null) throw new Error(`Congress attempt ${attempt.id} has invalid authorization.`);
    replay = callLowerCongressTransition(replay, configuration, attempt.transitionKind);
    if (attempt.lowerPostStateHash !== computeLegislativeRuntimeStateHash(replay)) {
      throw new Error(`Congress attempt ${attempt.id} copies or falsifies lower truth.`);
    }
  }
  if (!sameOrdered([replay], [congress.legislativeRuntime])) {
    throw new Error("Serialized direct LegislativeRuntimeState contradicts authorized lower calls.");
  }
};

const validateOMB = (
  state: ConcurrentOperationState,
  configuration: ConcurrentWorldConfiguration,
): void => {
  const officesWithCapacity = state.officeOperations.state.filter((entry) => entry.ombReviewCapacity !== undefined);
  if (officesWithCapacity.length !== 1 || officesWithCapacity[0].officeId !== configuration.ombReviewCapacity.officeId) {
    throw new Error("Budget-review capacity leaked outside its one office owner.");
  }
  const office = officesWithCapacity[0];
  const capacity = office.ombReviewCapacity!;
  if (capacity.teamId !== configuration.ombReviewCapacity.teamId ||
    !sameOrdered(capacity.periods, configuration.ombReviewCapacity.periods)) {
    throw new Error("Budget-review team identity/period truth contradicts configuration.");
  }
  const bookedPeriods = capacity.bookings.flatMap((entry) => entry.status === "RELEASED" ? [] : entry.periodIds);
  requireUnique(bookedPeriods, "Budget-review booked work periods");
  requireUnique(capacity.bookings.map((entry) => entry.assignmentId), "Budget-review assignment bookings");
  for (const booking of capacity.bookings) {
    const assignment = office.assignments.find((entry) => entry.id === booking.assignmentId);
    const requirement = configuration.ombReviewCapacity.productPeriodRequirements.find((entry) =>
      entry.productKind === booking.authorizedProductKind);
    if (assignment === undefined || requirement === undefined || booking.teamId !== capacity.teamId ||
      booking.periodIds.length !== requirement.periodsConsumed ||
      assignment.expectedProductKind !== booking.authorizedProductKind ||
      booking.status === "CONSUMED" && (booking.consumedAt === null || assignment.status !== "COMPLETED") ||
      booking.status === "RESERVED" && (booking.consumedAt !== null || booking.releasedAt !== null)) {
      throw new Error(`Budget-review booking ${booking.id} violates capacity/product ownership.`);
    }
  }
  const authority = configuration.ombReviewCapacity.standingCoordinationAuthority;
  for (const request of capacity.coordinationRequests) {
    const { payloadHash, ...withoutHash } = request;
    if (payloadHash !== sha(withoutHash) || request.recipientOfficeId !== office.officeId ||
      request.teamId !== capacity.teamId || request.createdAt !== request.dispatchedAt ||
      request.createdAt !== request.deliveredAt || request.createdAt !== request.receivedAt ||
      request.disposition !== "ACCEPTED" || request.provenanceReference !== authority.provenanceReference ||
      request.requestedActions.some((action) => !authority.permittedActions.includes(action)) ||
      request.referencedAssignmentIds.some((id) => !office.assignments.some((entry) => entry.id === id))) {
      throw new Error(`Budget-review coordination request ${request.id} is not an authenticated typed route.`);
    }
    if (request.sourceKind === "STANDING_CHIEF_OF_STAFF_AUTHORITY" &&
      (request.sourceAuthorityId !== authority.id || request.initiatingOfficeId !== authority.initiatingOfficeId)) {
      throw new Error(`Budget-review coordination request ${request.id} lacks standing Chief-of-Staff authority.`);
    }
  }
  let expectedQueue = [...configuration.ombReviewCapacity.preferredQueueOrder];
  for (const occurrence of [...capacity.queueReprioritizations].sort((left, right) =>
    instant(left.occurredAt, left.id) - instant(right.occurredAt, right.id) || left.id.localeCompare(right.id))) {
    const request = capacity.coordinationRequests.find((entry) => entry.id === occurrence.sourceCoordinationRequestId);
    if (request === undefined || occurrence.teamId !== capacity.teamId || occurrence.actingOfficeId !== office.officeId ||
      occurrence.authorityReference !== request.sourceAuthorityId ||
      !sameOrdered(occurrence.priorQueueAssignmentIds, expectedQueue) ||
      !sameOrdered(occurrence.resultingQueueAssignmentIds, request.requestedQueueOrder) ||
      occurrence.occurredAt !== request.receivedAt || occurrence.provenanceReference !== request.provenanceReference) {
      throw new Error(`Budget-review queue occurrence ${occurrence.id} does not derive from its office-owned request.`);
    }
    expectedQueue = [...occurrence.resultingQueueAssignmentIds];
  }
  for (const occurrence of [...capacity.assignmentSupersessions].sort((left, right) =>
    instant(left.occurredAt, left.id) - instant(right.occurredAt, right.id) || left.id.localeCompare(right.id))) {
    const request = capacity.coordinationRequests.find((entry) => entry.id === occurrence.sourceCoordinationRequestId);
    const prior = office.assignments.find((entry) => entry.id === occurrence.priorAssignmentId);
    const replacement = office.assignments.find((entry) => entry.id === occurrence.replacementAssignmentId);
    const priorRequirement = configuration.ombReviewCapacity.productPeriodRequirements.find((entry) =>
      entry.productKind === occurrence.priorProductKind);
    const replacementRequirement = configuration.ombReviewCapacity.productPeriodRequirements.find((entry) =>
      entry.productKind === occurrence.replacementProductKind);
    const priorBooking = capacity.bookings.find((entry) => entry.assignmentId === occurrence.priorAssignmentId);
    if (request === undefined || prior === undefined || replacement === undefined ||
      !request.requestedActions.includes("SUPERSEDE_WITH_PERMITTED_NARROW_PRODUCT") ||
      request.requestedNarrowProductKind !== occurrence.replacementProductKind ||
      priorRequirement?.classification !== "FULL" || replacementRequirement?.classification !== "LESS_CLAIMING" ||
      priorRequirement.subjectFamily !== replacementRequirement.subjectFamily ||
      prior.status !== "SUPERSEDED" || prior.supersededByAssignmentId !== replacement.id ||
      replacement.authorityReference !== request.id ||
      replacement.expectedProductKind !== occurrence.replacementProductKind ||
      priorBooking?.status !== "RELEASED" || priorBooking.releasedAt !== occurrence.occurredAt ||
      occurrence.reasonClassification !== "PERMITTED_LESS_CLAIMING_PRODUCT" ||
      occurrence.authorityReference !== request.sourceAuthorityId ||
      occurrence.provenanceReference !== request.provenanceReference ||
      !expectedQueue.includes(prior.id)) {
      throw new Error(`Budget-review assignment supersession ${occurrence.id} is not a contained less-claiming transition.`);
    }
    expectedQueue = expectedQueue.map((id) => id === prior.id ? replacement.id : id);
  }
  const activeAssignments = office.assignments.filter((entry) =>
    !["COMPLETED", "REFUSED", "CANCELLED", "SUPERSEDED"].includes(entry.status)).map((entry) => entry.id);
  const capacityAssignmentIds = new Set(capacity.bookings.map((entry) => entry.assignmentId));
  const expectedActiveQueue = expectedQueue.filter((id) => activeAssignments.includes(id));
  const actualCapacityQueue = office.activeQueueAssignmentIds.filter((id) => capacityAssignmentIds.has(id));
  if (!sameOrdered(actualCapacityQueue, expectedActiveQueue) ||
    !sameSet(office.activeQueueAssignmentIds, activeAssignments)) {
    throw new Error("Budget-review active queue contradicts assignment status and append-only queue authority.");
  }
};

const validateOfficeCommunications = (
  state: ConcurrentOperationState,
  configuration: ConcurrentWorldConfiguration,
  current: string,
): void => {
  const communications = state.informationRoutes.state.artifacts.filter(
    (entry): entry is I5OfficeCommunicationArtifact => entry.kind === "I5_OFFICE_COMMUNICATION",
  );
  requireUnique(communications.map((entry) => entry.sourceAssignmentId), "I5 communication source assignments");
  for (const artifact of communications) {
    const definition = communicationDefinition(state, configuration, artifact.sourceAssignmentId);
    const production = state.informationRoutes.state.officeArtifactProductions.find((entry) =>
      entry.artifactId === artifact.id);
    if (
      artifact.communicationKind !== definition.communicationKind ||
      artifact.producingOfficeId !== definition.office.officeId ||
      artifact.authoringOfficeholderAssignmentId !== production?.producingOfficeholderAssignmentId ||
      artifact.sourceInstrumentId !== definition.instrument.id ||
      artifact.sourceDispositionId !== definition.dispositionId ||
      artifact.sourceAssignmentId !== definition.assignment.id ||
      !sameOrdered(artifact.recipientActorOrInstitutionIds, definition.recipientIds) ||
      !sameOrdered([artifact.behaviorPayload], [definition.behaviorPayload]) ||
      !sameOrdered(artifact.sectionIds, ["authorized-content", "limitations"]) ||
      artifact.accessClass !== "I5_BOUNDED_EXTERNAL_COMMUNICATION" ||
      artifact.provenanceReference !== configuration.provenanceReference ||
      definition.assignment.status !== "COMPLETED" ||
      !definition.assignment.resultArtifactIds.includes(artifact.id) ||
      production === undefined ||
      instant(artifact.createdAt, `${artifact.id} creation`) > instant(current, "Current I5 time")
    ) throw new Error(`I5 office communication ${artifact.id} exceeds its recipient-owned assignment scope.`);
    const dispatches = definition.office.externalCommunicationDispatches.filter((entry) =>
      entry.communicationArtifactId === artifact.id);
    if (dispatches.length !== 0 && !sameSet(dispatches.map((entry) =>
      entry.recipientActorOrInstitutionId), artifact.recipientActorOrInstitutionIds)) {
      throw new Error(`I5 office communication ${artifact.id} has partial or leaked recipient fan-out.`);
    }
    for (const dispatch of dispatches) {
      const hasReceipt = artifact.communicationKind === "INTERGOVERNMENTAL_CONTACT"
        ? state.externalActors.state.receipts.some((entry) =>
          entry.artifactId === artifact.id &&
          entry.recipientActorOrInstitutionId === dispatch.recipientActorOrInstitutionId &&
          entry.receivedAt === dispatch.deliveredAt)
        : artifact.communicationKind === "PUBLIC_STATEMENT"
          ? state.boundedMedia.state.receipts.some((entry) =>
            entry.artifactId === artifact.id && entry.outletId === dispatch.recipientActorOrInstitutionId &&
            entry.receivedAt === dispatch.deliveredAt)
          : state.congressionalInitiative.state.externalReceipts.some((entry) =>
            entry.artifactId === artifact.id && entry.recipientActorId === dispatch.recipientActorOrInstitutionId &&
            entry.receivedAt === dispatch.deliveredAt);
      if (!hasReceipt) throw new Error(`I5 external dispatch ${dispatch.id} lacks recipient-owned receipt truth.`);
    }
  }
};

export const assertPresidentialConcurrentWorldOwnerStates = (
  state: ConcurrentOperationState,
  administration: PresidentialAdministrationConfiguration,
  intervention: PresidentialInterventionConfiguration,
  configuration: ConcurrentWorldConfiguration,
  epoch: string,
  current: string,
): void => {
  assertConcurrentWorldConfiguration(configuration, administration, intervention, epoch);
  assertPresidentialAdministrationOwnerStates(state, administration, epoch, current);
  const expectedOwnerIds = configuration.ownerIds;
  if (state.regionalEmployment.ownerId !== expectedOwnerIds.regionalEmployment ||
    state.congressionalInitiative.ownerId !== expectedOwnerIds.congressionalInitiative ||
    state.externalActors.ownerId !== expectedOwnerIds.externalActors ||
    state.boundedMedia.ownerId !== expectedOwnerIds.boundedMedia ||
    state.maternityServiceAccess.ownerId !== expectedOwnerIds.maternityServiceAccess ||
    state.presidentialInquiries.ownerId !== expectedOwnerIds.presidentialInquiries) {
    throw new Error("I5 concurrent owner identities contradict configuration.");
  }
  validateEmployment(state, configuration, current);
  validateCongress(state, configuration, current);
  validateOMB(state, configuration);
  validateOfficeCommunications(state, configuration, current);
  if (!sameOrdered(state.externalActors.state.actorIds, configuration.externalActors.map((entry) => entry.id).sort())) {
    throw new Error("External-actor owner set contradicts configuration.");
  }
  if (!sameOrdered(state.boundedMedia.state.outletIds, configuration.mediaOutlets.map((entry) => entry.id).sort())) {
    throw new Error("Media owner set contradicts configuration.");
  }
  const maternity = state.maternityServiceAccess.state;
  if (maternity.facilityId !== configuration.maternityServiceAccess.facilityId ||
    maternity.serviceAreaId !== configuration.maternityServiceAccess.serviceAreaId ||
    maternity.evidenceArtifactIds.some((id) => findArtifact(state, id) === undefined)) {
    throw new Error("Maternity service owner duplicates or fabricates evidence truth.");
  }
  for (const presentation of state.presidentialInquiries.state.previewPresentations) {
    const opportunity = state.presidentialInquiries.state.opportunities.find((entry) => entry.id === presentation.opportunityId);
    if (opportunity === undefined || presentation.preview.payload.kind !== "REQUEST_OFFICE_ANALYSIS" ||
      presentation.preview.payload.recipientOfficeId !== opportunity.allowedRecipientOfficeId ||
      presentation.preview.payload.sourceReferenceIds.some((id) => id !== opportunity.id &&
        id !== opportunity.sourcePresidentialPresentationId) ||
      presentation.preview.payload.evidenceArtifactId.includes(maternity.facilityId) ||
      presentation.preview.payload.evidenceArtifactId.includes(maternity.serviceAreaId)) {
      throw new Error(`Inquiry presentation ${presentation.id} leaks hidden maternity-owner truth.`);
    }
  }
  const expectedHistory = expectedConcurrentHistory(state, intervention);
  const actualHistory = state.historicalRecordIndex.state.entries.filter((entry) =>
    i5HistoryKinds.has(entry.recordKind));
  if (!sameOrdered(actualHistory, expectedHistory)) {
    throw new Error("I5 historical index is not an exact reference-only projection of concurrent owners.");
  }
};

export interface PresentPresidentialInquiryPreviewInput {
  readonly id: string;
  readonly opportunityId: string;
  readonly requestedProductKind: "RURAL_MATERNITY_ACCESS_SCOPING" | "MATERNITY_MONITORING_GAP_MEMO";
  readonly requestedResponseDeadline: string;
  readonly provenanceReference: string;
}

export const presentPresidentialInquiryPreview = (
  state: ConcurrentOperationState,
  administration: PresidentialAdministrationConfiguration,
  intervention: PresidentialInterventionConfiguration,
  configuration: ConcurrentWorldConfiguration,
  epoch: string,
  current: string,
  input: PresentPresidentialInquiryPreviewInput,
): ConcurrentOperationState => {
  assertPresidentialConcurrentWorldOwnerStates(
    state, administration, intervention, configuration, epoch, current,
  );
  const inquiry = state.presidentialInquiries.state;
  const opportunity = inquiry.opportunities.find((entry) => entry.id === input.opportunityId);
  if (opportunity === undefined || !isEffectiveAt(opportunity.effectiveFrom, opportunity.deadline, current) ||
    inquiry.lifecycleOccurrences.some((entry) => entry.opportunityId === opportunity.id) ||
    !opportunity.allowedProductKinds.includes(input.requestedProductKind) ||
    instant(input.requestedResponseDeadline, "Inquiry response deadline") <= instant(current, "Inquiry presentation") ||
    instant(input.requestedResponseDeadline, "Inquiry response deadline") > instant(opportunity.deadline, "Inquiry deadline") ||
    input.provenanceReference !== opportunity.provenanceReference) {
    throw new Error("Presidential inquiry preview lacks one effective unconsumed bounded opportunity.");
  }
  const binding = administration.presidentialRecipientBinding;
  if (!isEffectiveAt(binding.effectiveFrom, binding.effectiveUntil, current)) {
    throw new Error("Presidential recipient binding is not effective for inquiry presentation.");
  }
  const payload = canonicalPresidentialInstrumentPayload({
    kind: "REQUEST_OFFICE_ANALYSIS",
    payloadVersion: "1",
    recipientOfficeId: opportunity.allowedRecipientOfficeId,
    subjectScopeFamily: opportunity.subjectFamily,
    requestedAct: "Assess nationwide rural maternity-service monitoring coverage and gaps.",
    sourceReferenceIds: [opportunity.id],
    attachmentMetadata: [],
    authorityBasis: opportunity.authorityReference,
    requestedResponseDeadline: input.requestedResponseDeadline,
    requestedQuestion: opportunity.generalQuestion,
    requestedProductKind: input.requestedProductKind,
    evidenceArtifactId: opportunity.id,
    evidenceSectionIds: ["general-question"],
    knownAccessLimitation: "No facility, catchment, closure, burden, or source identity has been presented.",
    narrowingPermitted: true,
  });
  const preview = {
    id: `${input.id}.preview`,
    payload,
    payloadHash: computePresidentialInstrumentPayloadHash(payload),
    bundlePosition: 0,
    provenanceReference: input.provenanceReference,
  };
  const presentation: PresidentialInquiryPreviewPresentation = {
    id: input.id,
    opportunityId: opportunity.id,
    recipientBindingId: binding.id,
    recipientActorId: binding.actorId,
    constitutionalOfficeId: binding.constitutionalOfficeId,
    shownQuestion: opportunity.generalQuestion,
    shownScope: opportunity.typedScope,
    preview,
    presentedAt: current,
    provenanceReference: input.provenanceReference,
  };
  const conflict = inquiry.previewPresentations.find((entry) => entry.id === input.id ||
    entry.opportunityId === opportunity.id);
  if (conflict !== undefined) {
    if (sameOrdered([conflict], [presentation])) return state;
    throw new Error(`Presidential inquiry presentation ${input.id} conflicts with existing evidence.`);
  }
  return appendDerivedPresidentialConcurrentHistory({
    ...state,
    presidentialInquiries: {
      ...state.presidentialInquiries,
      state: {
        ...inquiry,
        previewPresentations: sortedAtAndId([...inquiry.previewPresentations, presentation],
          (entry) => entry.presentedAt, (entry) => entry.id),
      },
    },
  }, intervention);
};

export interface RecordPresidentialInitiatedRequestInput {
  readonly id: string;
  readonly deduplicationIdentity: string;
  readonly inquiryPreviewPresentationId: string;
  readonly instrumentId: string;
  readonly instrumentDeduplicationIdentity: string;
  readonly acknowledgedUncertainties: readonly string[];
  readonly provenanceReference: string;
}

export const recordPresidentialInitiatedRequest = (
  state: ConcurrentOperationState,
  administration: PresidentialAdministrationConfiguration,
  intervention: PresidentialInterventionConfiguration,
  configuration: ConcurrentWorldConfiguration,
  controlBinding: PresidentialControlBindingState,
  epoch: string,
  current: string,
  input: RecordPresidentialInitiatedRequestInput,
): ConcurrentOperationState => {
  assertPresidentialConcurrentWorldOwnerStates(
    state, administration, intervention, configuration, epoch, current,
  );
  const presentation = state.presidentialInquiries.state.previewPresentations.find((entry) =>
    entry.id === input.inquiryPreviewPresentationId);
  const opportunity = presentation === undefined ? undefined : state.presidentialInquiries.state.opportunities.find(
    (entry) => entry.id === presentation.opportunityId);
  if (presentation === undefined || opportunity === undefined ||
    instant(current, "Inquiry decision") >= instant(opportunity.deadline, "Inquiry deadline") ||
    state.presidentialInquiries.state.lifecycleOccurrences.some((entry) => entry.opportunityId === opportunity.id) ||
    controlBinding.status !== "ACTIVE" || controlBinding.id !== intervention.controlBinding.id ||
    controlBinding.decisionSurface !== PRESIDENTIAL_OPERATING_DECISION_SURFACE ||
    controlBinding.boundOfficeholderActorId !== presentation.recipientActorId ||
    controlBinding.executiveOfficeId !== presentation.constitutionalOfficeId ||
    input.provenanceReference !== opportunity.provenanceReference) {
    throw new Error("Presidential initiated request lacks active binding and one effective preview opportunity.");
  }
  requireNonemptyUnique(input.acknowledgedUncertainties, "Inquiry acknowledged uncertainties");
  const existing = state.presidentialDecisions.state.find((entry) => entry.id === input.id ||
    entry.deduplicationIdentity === input.deduplicationIdentity);
  if (existing !== undefined) throw new Error(`Presidential inquiry decision ${input.id} already exists.`);
  if (state.presidentialInstruments.state.some((entry) => entry.id === input.instrumentId ||
    entry.deduplicationIdentity === input.instrumentDeduplicationIdentity)) {
    throw new Error(`Presidential inquiry instrument ${input.instrumentId} already exists.`);
  }
  const decision: PresidentialDecisionRecord = {
    sourceKind: "INQUIRY_PREVIEW_PRESENTATION",
    id: input.id,
    deduplicationIdentity: input.deduplicationIdentity,
    controlBindingId: controlBinding.id,
    presidentActorId: controlBinding.boundOfficeholderActorId,
    constitutionalOfficeId: controlBinding.executiveOfficeId,
    sourceEscalationId: null,
    selectedOptionId: opportunity.id,
    selectedOptionKind: "PROACTIVE_INQUIRY_REQUEST",
    sourceInquiryOpportunityId: opportunity.id,
    inquiryPreviewPresentationId: presentation.id,
    previewIds: [presentation.preview.id],
    previewHashes: [presentation.preview.payloadHash],
    decidedAt: current,
    basisEscalationPresentationId: null,
    acknowledgedUncertainties: [...input.acknowledgedUncertainties],
    authorizedInstrumentIds: [input.instrumentId],
    reservedReviewId: null,
    deliberateDefaultRuleReference: null,
    provenanceReference: input.provenanceReference,
    supersedesDecisionId: null,
  };
  const instrument: PresidentialInstrumentRecord = {
    id: input.instrumentId,
    deduplicationIdentity: input.instrumentDeduplicationIdentity,
    authorizingDecisionId: decision.id,
    selectedOptionId: opportunity.id,
    sourcePreviewId: presentation.preview.id,
    sourcePreviewHash: presentation.preview.payloadHash,
    issuingPresidentActorId: decision.presidentActorId,
    issuingConstitutionalOfficeId: decision.constitutionalOfficeId,
    issuedAt: current,
    provenanceReference: input.provenanceReference,
    revisionOfInstrumentId: null,
    supersedesInstrumentId: null,
    payload: canonicalPresidentialInstrumentPayload(presentation.preview.payload),
  };
  const next: ConcurrentOperationState = {
    ...state,
    presidentialDecisions: {
      ...state.presidentialDecisions,
      state: sortedAtAndId([...state.presidentialDecisions.state, decision],
        (entry) => entry.decidedAt, (entry) => entry.id),
    },
    presidentialInstruments: {
      ...state.presidentialInstruments,
      state: sortedAtAndId([...state.presidentialInstruments.state, instrument],
        (entry) => entry.issuedAt, (entry) => entry.id),
    },
    presidentialInquiries: {
      ...state.presidentialInquiries,
      state: {
        ...state.presidentialInquiries.state,
        initiatedRequestDecisionIds: [...state.presidentialInquiries.state.initiatedRequestDecisionIds, decision.id],
        lifecycleOccurrences: [...state.presidentialInquiries.state.lifecycleOccurrences, {
          id: `${opportunity.id}.consumed`, opportunityId: opportunity.id, kind: "CONSUMED",
          causeRecordId: decision.id, occurredAt: current, provenanceReference: input.provenanceReference,
        }],
      },
    },
  };
  return appendDerivedPresidentialConcurrentHistory(appendPresidentialInitiatedInquiryHistory(
    next,
    intervention,
    decision,
    instrument,
  ) as ConcurrentOperationState, intervention);
};

export interface AuthorHHSProactiveInquiryResultInput {
  readonly assignmentId: string;
  readonly artifactId: string;
  readonly observationAuthorityId: string;
  readonly provenanceReference: string;
}

export const authorHHSProactiveInquiryResult = (
  state: ConcurrentOperationState,
  administration: PresidentialAdministrationConfiguration,
  intervention: PresidentialInterventionConfiguration,
  configuration: ConcurrentWorldConfiguration,
  epoch: string,
  current: string,
  input: AuthorHHSProactiveInquiryResultInput,
): ConcurrentOperationState => {
  assertPresidentialConcurrentWorldOwnerStates(
    state, administration, intervention, configuration, epoch, current,
  );
  const authority = configuration.domainObservationAuthorities.find((entry) =>
    entry.id === input.observationAuthorityId);
  const office = administration.offices.find((entry) =>
    entry.parentInstitutionId === authority?.observingInstitutionId);
  const operations = state.officeOperations.state.find((entry) => entry.officeId === office?.id);
  const assignment = operations?.assignments.find((entry) => entry.id === input.assignmentId);
  const authorization = operations?.instrumentAssignmentAuthorizations.find((entry) =>
    entry.assignmentId === input.assignmentId);
  const disposition = operations?.instrumentDispositions.find((entry) =>
    entry.id === authorization?.dispositionId);
  const instrument = state.presidentialInstruments.state.find((entry) =>
    entry.id === authorization?.instrumentId);
  const productKind = authorization?.scope.kind === "ANALYSIS_ASSIGNMENT_SCOPE"
    ? authorization.scope.productKind : null;
  const material = state.maternityServiceAccess.state.materialHistory.filter((entry) =>
    instant(entry.occurredAt, entry.id) <= instant(current, "HHS observation"));
  if (authority === undefined || office === undefined || operations === undefined || assignment === undefined ||
    authorization === undefined || disposition === undefined || instrument?.payload.kind !== "REQUEST_OFFICE_ANALYSIS" ||
    productKind === null || !authority.artifactKinds.includes(productKind) ||
    authority.sourceOwnerId !== state.maternityServiceAccess.ownerId ||
    !isEffectiveAt(authority.effectiveFrom, authority.effectiveUntil, current) ||
    !["BLOCKED", "QUEUED", "IN_PROGRESS"].includes(assignment.status) ||
    material.length === 0 || material.some((entry) => !authority.permittedRecordKinds.includes(entry.kind)) ||
    input.provenanceReference !== authority.provenanceReference ||
    state.informationRoutes.state.artifacts.some((entry) => entry.id === input.artifactId)) {
    throw new Error("HHS proactive result lacks its exact assignment and claim-scoped observation authority.");
  }
  const holder = effectiveHolderForOffice(administration, office.id, current);
  const latest = material[material.length - 1];
  const claims: I5DomainEvidenceClaim[] = [
    {
      id: `${input.artifactId}.claim.capacity`, sectionId: "scope", claimFamily: productKind,
      value: state.maternityServiceAccess.state.effectiveCapacity,
      sourceOwnerId: state.maternityServiceAccess.ownerId, sourceRecordId: latest.id,
      sourceRecordHash: sha(latest), observedAt: current, observationAuthorityId: authority.id,
    },
    {
      id: `${input.artifactId}.claim.travel-burden`, sectionId: "finding", claimFamily: productKind,
      value: state.maternityServiceAccess.state.currentTravelBurdenMinutes,
      sourceOwnerId: state.maternityServiceAccess.ownerId, sourceRecordId: latest.id,
      sourceRecordHash: sha(latest), observedAt: current, observationAuthorityId: authority.id,
    },
  ];
  const withoutHash = {
    kind: "I5_DOMAIN_EVIDENCE" as const,
    domainEvidenceKind: productKind as "MATERNITY_MONITORING_GAP_MEMO" | "RURAL_MATERNITY_ACCESS_SCOPING",
    id: input.artifactId,
    version: "1",
    producerInstitutionId: authority.observingInstitutionId,
    producingOfficeId: office.id,
    authoringOfficeholderAssignmentId: holder.id,
    sourceOwnerId: state.maternityServiceAccess.ownerId,
    sourceOccurrenceIds: material.map((entry) => entry.id),
    observationAuthorityId: authority.id,
    asOf: current,
    createdAt: current,
    releasedAt: current,
    sectionIds: ["scope", "finding", "limitations"],
    claims,
    accessClass: "HHS_BOUNDED_SERVICE_ACCESS_ANALYSIS",
    analysisOnly: true,
    uncertainty: ["This bounded analysis does not create a national healthcare or Population owner."],
    provenanceReference: input.provenanceReference,
    revisionOfArtifactId: null,
    supersedesArtifactId: null,
  };
  const artifact: I5DomainEvidenceArtifact = {
    ...withoutHash,
    canonicalArtifactHash: computeI5DomainEvidenceArtifactHash(withoutHash),
  };
  let next = appendOfficeProducedArtifact(state, artifact);
  next = {
    ...next,
    maternityServiceAccess: {
      ...next.maternityServiceAccess,
      state: {
        ...next.maternityServiceAccess.state,
        evidenceArtifactIds: [...next.maternityServiceAccess.state.evidenceArtifactIds, artifact.id],
      },
    },
  };
  if (assignment.status === "BLOCKED" || assignment.status === "QUEUED") {
    next = transitionOfficeWorkAssignment(next, administration, epoch, current, {
      officeId: office.id,
      assignmentId: assignment.id,
      status: "IN_PROGRESS",
      reason: null,
      statusProvenanceReferenceId: `${artifact.id}.production`,
      resultArtifactIds: [],
      supersededByAssignmentId: null,
    }) as ConcurrentOperationState;
  }
  next = transitionOfficeWorkAssignment(next, administration, epoch, current, {
    officeId: office.id,
    assignmentId: assignment.id,
    status: "COMPLETED",
    reason: null,
    statusProvenanceReferenceId: `${artifact.id}.production`,
    resultArtifactIds: [artifact.id],
    supersededByAssignmentId: null,
  }) as ConcurrentOperationState;
  return appendDerivedPresidentialConcurrentHistory(next, intervention);
};

export interface AuthorI5OfficeCommunicationInput {
  readonly id: string;
  readonly assignmentId: string;
  readonly authoringOfficeholderAssignmentId: string;
  readonly provenanceReference: string;
}

const communicationDefinition = (
  state: ConcurrentOperationState,
  configuration: ConcurrentWorldConfiguration,
  assignmentId: string,
): {
  readonly office: OfficeOperationsState;
  readonly assignment: OfficeOperationsState["assignments"][number];
  readonly authorization: OfficeOperationsState["instrumentAssignmentAuthorizations"][number];
  readonly dispositionId: string;
  readonly instrument: PresidentialInstrumentRecord;
  readonly communicationKind: I5OfficeCommunicationArtifact["communicationKind"];
  readonly recipientIds: readonly string[];
  readonly behaviorPayload: Readonly<Record<string, unknown>>;
} => {
  const office = state.officeOperations.state.find((entry) =>
    entry.assignments.some((assignment) => assignment.id === assignmentId));
  const assignment = office?.assignments.find((entry) => entry.id === assignmentId);
  const authorization = office?.instrumentAssignmentAuthorizations.find((entry) =>
    entry.assignmentId === assignmentId);
  const disposition = office?.instrumentDispositions.find((entry) => entry.id === authorization?.dispositionId);
  const instrument = state.presidentialInstruments.state.find((entry) => entry.id === authorization?.instrumentId);
  if (office === undefined || assignment === undefined || authorization === undefined || disposition === undefined ||
    instrument === undefined || disposition.instrumentId !== instrument.id ||
    !["ACCEPTED_AS_REQUESTED", "NARROWED"].includes(disposition.kind)) {
    throw new Error(`Office communication assignment ${assignmentId} lacks its immutable instrument authority chain.`);
  }
  if (authorization.scope.kind === "LEGISLATIVE_POSITION_ASSIGNMENT_SCOPE" &&
    instrument.payload.kind === "AUTHORIZE_LEGISLATIVE_POSITION") {
    return {
      office, assignment, authorization, dispositionId: disposition.id, instrument,
      communicationKind: "LEGISLATIVE_POSITION",
      recipientIds: [...new Set([
        configuration.congress.formationActorId,
        configuration.congress.sponsorActorId,
      ])].sort(),
      behaviorPayload: copyPlain(authorization.scope) as unknown as Readonly<Record<string, unknown>>,
    };
  }
  if (authorization.scope.kind === "INTERGOVERNMENTAL_CONTACT_ASSIGNMENT_SCOPE" &&
    instrument.payload.kind === "REQUEST_INTERGOVERNMENTAL_CONTACT") {
    return {
      office, assignment, authorization, dispositionId: disposition.id, instrument,
      communicationKind: "INTERGOVERNMENTAL_CONTACT",
      recipientIds: [...authorization.scope.governorActorIds],
      behaviorPayload: copyPlain(authorization.scope) as unknown as Readonly<Record<string, unknown>>,
    };
  }
  if (authorization.scope.kind === "PUBLIC_STATEMENT_ASSIGNMENT_SCOPE" &&
    instrument.payload.kind === "AUTHORIZE_PUBLIC_STATEMENT") {
    return {
      office, assignment, authorization, dispositionId: disposition.id, instrument,
      communicationKind: "PUBLIC_STATEMENT",
      recipientIds: configuration.mediaOutlets.map((entry) => entry.id).sort(),
      behaviorPayload: copyPlain(authorization.scope) as unknown as Readonly<Record<string, unknown>>,
    };
  }
  throw new Error(`Office communication assignment ${assignmentId} has no bounded I5 communication scope.`);
};

export const authorI5OfficeCommunication = (
  state: ConcurrentOperationState,
  administration: PresidentialAdministrationConfiguration,
  intervention: PresidentialInterventionConfiguration,
  configuration: ConcurrentWorldConfiguration,
  epoch: string,
  current: string,
  input: AuthorI5OfficeCommunicationInput,
): ConcurrentOperationState => {
  assertPresidentialConcurrentWorldOwnerStates(
    state, administration, intervention, configuration, epoch, current,
  );
  const definition = communicationDefinition(state, configuration, input.assignmentId);
  if (!isEffectiveAt(definition.assignment.createdAt, definition.assignment.deadline, current) ||
    !["QUEUED", "IN_PROGRESS"].includes(definition.assignment.status) ||
    input.provenanceReference !== configuration.provenanceReference ||
    state.informationRoutes.state.artifacts.some((entry) => entry.id === input.id ||
      entry.kind === "I5_OFFICE_COMMUNICATION" && entry.sourceAssignmentId === input.assignmentId)) {
    throw new Error(`Office communication ${input.id} lacks one active, unused, scope-contained assignment.`);
  }
  assertEffectiveOfficeholder(
    state,
    input.authoringOfficeholderAssignmentId,
    definition.office.officeId,
    current,
  );
  if (definition.communicationKind === "PUBLIC_STATEMENT") {
    const releaseWindowEndsAt = definition.authorization.scope.kind === "PUBLIC_STATEMENT_ASSIGNMENT_SCOPE"
      ? definition.authorization.scope.releaseWindowEndsAt : current;
    if (instant(current, "Public-statement production") >= instant(releaseWindowEndsAt, "Release interval")) {
      throw new Error(`Office communication ${input.id} is outside its authorized release interval.`);
    }
  }
  const artifact: I5OfficeCommunicationArtifact = {
    kind: "I5_OFFICE_COMMUNICATION",
    communicationKind: definition.communicationKind,
    id: input.id,
    version: "1",
    producingOfficeId: definition.office.officeId,
    authoringOfficeholderAssignmentId: input.authoringOfficeholderAssignmentId,
    sourceInstrumentId: definition.instrument.id,
    sourceDispositionId: definition.dispositionId,
    sourceAssignmentId: definition.assignment.id,
    recipientActorOrInstitutionIds: [...definition.recipientIds],
    behaviorPayload: copyPlain(definition.behaviorPayload),
    asOf: current,
    createdAt: current,
    releasedAt: current,
    sectionIds: ["authorized-content", "limitations"],
    accessClass: "I5_BOUNDED_EXTERNAL_COMMUNICATION",
    provenanceReference: input.provenanceReference,
    revisionOfArtifactId: null,
    supersedesArtifactId: null,
  };
  let next = appendOfficeProducedArtifact(state, artifact);
  if (definition.assignment.status === "QUEUED") {
    next = transitionOfficeWorkAssignment(next, administration, epoch, current, {
      officeId: definition.office.officeId,
      assignmentId: definition.assignment.id,
      status: "IN_PROGRESS",
      reason: null,
      statusProvenanceReferenceId: `${artifact.id}.production`,
      resultArtifactIds: [],
      supersededByAssignmentId: null,
    }) as ConcurrentOperationState;
  }
  next = transitionOfficeWorkAssignment(next, administration, epoch, current, {
    officeId: definition.office.officeId,
    assignmentId: definition.assignment.id,
    status: "COMPLETED",
    reason: null,
    statusProvenanceReferenceId: `${artifact.id}.production`,
    resultArtifactIds: [artifact.id],
    supersededByAssignmentId: null,
  }) as ConcurrentOperationState;
  return appendDerivedPresidentialConcurrentHistory(next, intervention);
};

export interface DispatchI5OfficeCommunicationInput {
  readonly communicationArtifactId: string;
  readonly provenanceReference: string;
}

export const dispatchI5OfficeCommunication = (
  state: ConcurrentOperationState,
  administration: PresidentialAdministrationConfiguration,
  intervention: PresidentialInterventionConfiguration,
  configuration: ConcurrentWorldConfiguration,
  epoch: string,
  current: string,
  input: DispatchI5OfficeCommunicationInput,
): ConcurrentOperationState => {
  assertPresidentialConcurrentWorldOwnerStates(
    state, administration, intervention, configuration, epoch, current,
  );
  const artifact = findArtifact(state, input.communicationArtifactId);
  const office = artifact?.kind === "I5_OFFICE_COMMUNICATION" ? state.officeOperations.state.find((entry) =>
    entry.officeId === artifact.producingOfficeId) : undefined;
  if (artifact?.kind !== "I5_OFFICE_COMMUNICATION" || office === undefined ||
    instant(artifact.createdAt, `${artifact.id} creation`) > instant(current, "External dispatch") ||
    input.provenanceReference !== artifact.provenanceReference) {
    throw new Error(`External communication ${input.communicationArtifactId} is unavailable for dispatch.`);
  }
  const existing = office.externalCommunicationDispatches.filter((entry) =>
    entry.communicationArtifactId === artifact.id);
  if (existing.length !== 0) {
    if (sameSet(existing.map((entry) => entry.recipientActorOrInstitutionId),
      artifact.recipientActorOrInstitutionIds)) return state;
    throw new Error(`External communication ${artifact.id} has a partial/conflicting dispatch history.`);
  }
  const dispatches = artifact.recipientActorOrInstitutionIds.map((recipientId, index) => ({
    id: `${artifact.id}.dispatch.${index + 1}`,
    communicationArtifactId: artifact.id,
    sendingOfficeId: artifact.producingOfficeId,
    sendingOfficeholderAssignmentId: artifact.authoringOfficeholderAssignmentId,
    recipientActorOrInstitutionId: recipientId,
    dispatchedAt: current,
    deliveredAt: current,
    outcome: "DELIVERED_TO_RECIPIENT_BOUNDARY" as const,
    provenanceReference: input.provenanceReference,
  }));
  let next: ConcurrentOperationState = {
    ...state,
    officeOperations: {
      ...state.officeOperations,
      state: state.officeOperations.state.map((entry) => entry.officeId === office.officeId ? {
        ...entry,
        externalCommunicationDispatches: [...entry.externalCommunicationDispatches, ...dispatches],
      } : entry),
    },
  };
  if (artifact.communicationKind === "INTERGOVERNMENTAL_CONTACT") {
    const receipts = dispatches.map((dispatch) => ({
      id: `${dispatch.id}.receipt`,
      recipientActorOrInstitutionId: dispatch.recipientActorOrInstitutionId,
      artifactId: artifact.id,
      sectionIds: [...artifact.sectionIds],
      deliveredAt: dispatch.deliveredAt,
      receivedAt: dispatch.deliveredAt,
      provenanceReference: dispatch.provenanceReference,
    }));
    next = {
      ...next,
      externalActors: {
        ...next.externalActors,
        state: {
          ...next.externalActors.state,
          receipts: sortedAtAndId([...next.externalActors.state.receipts, ...receipts],
            (entry) => entry.receivedAt, (entry) => entry.id),
        },
      },
    };
  } else if (artifact.communicationKind === "PUBLIC_STATEMENT") {
    const receipts = dispatches.map((dispatch) => ({
      id: `${dispatch.id}.receipt`,
      outletId: dispatch.recipientActorOrInstitutionId,
      artifactId: artifact.id,
      sectionIds: [...artifact.sectionIds],
      deliveredAt: dispatch.deliveredAt,
      receivedAt: dispatch.deliveredAt,
      provenanceReference: dispatch.provenanceReference,
    }));
    next = {
      ...next,
      boundedMedia: {
        ...next.boundedMedia,
        state: {
          ...next.boundedMedia.state,
          receipts: sortedAtAndId([...next.boundedMedia.state.receipts, ...receipts],
            (entry) => entry.receivedAt, (entry) => entry.id),
        },
      },
    };
  } else {
    const receipts = dispatches.map((dispatch) => ({
      id: `${dispatch.id}.receipt`,
      recipientActorId: dispatch.recipientActorOrInstitutionId,
      artifactId: artifact.id,
      sectionIds: [...artifact.sectionIds],
      deliveredAt: dispatch.deliveredAt,
      receivedAt: dispatch.deliveredAt,
      authorityReference: artifact.sourceInstrumentId,
      provenanceReference: dispatch.provenanceReference,
    }));
    next = {
      ...next,
      congressionalInitiative: {
        ...next.congressionalInitiative,
        state: {
          ...next.congressionalInitiative.state,
          externalReceipts: sortedAtAndId([
            ...next.congressionalInitiative.state.externalReceipts,
            ...receipts,
          ], (entry) => entry.receivedAt, (entry) => entry.id),
        },
      },
    };
  }
  return appendDerivedPresidentialConcurrentHistory(next, intervention);
};

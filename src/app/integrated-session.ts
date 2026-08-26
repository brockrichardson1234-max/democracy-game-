import { assertConfigurationIdentityCompatible, loadGovernmentConfiguration } from "../configuration/loader";
import { sha256Hex } from "../configuration/sha256";
import type {
  GovernmentConfiguration,
  IntegratedInformationConfiguration,
  LegislativeRuntimeSeed,
} from "../configuration/types";
import {
  createIntegratedPartialRuntimeState,
  type IntegratedPartialRuntimeState,
  type IntegratedRuntimeArtifactBundle,
} from "../sim/integrated-runtime";
import {
  assertWeightedPopulationConservation,
  applyConfiguredPopulationInformationExposure,
  applyPopulationInformationResponse,
  mergeWeightedPopulationCohorts,
  recordPopulationMaterialExperience,
  refineWeightedPopulationCohort,
  resolvePopulationPoliticalState,
  type PopulationPoliticalResolution,
  type PopulationRefinementRequest,
} from "../sim/population-core";
import {
  assertCalendarTimeState,
  compareConfiguredBoundaries,
  type ConfiguredCalendarBoundary,
} from "../sim/calendar-time";
import {
  applyInstitutionalBoundary,
  assertInstitutionalRuntimeState,
  type InstitutionalRuntimeState,
} from "../sim/institutional-runtime";
import {
  currentEvaluatedProposal,
  startNewLegislativeProcedure,
} from "../sim/legislative-runtime";
import { rebuildPoliticalStateForAssignments } from "../sim/political";
import {
  admitEnactedFiscalAuthority,
  applyAdministrativeBoundary,
  assertProgramImplementationState,
  deriveEffectiveIntergovernmentalRelationship,
  directWaiverIntention,
  openFutureWaiverRequest,
  resolveImplementationOwnerIntention,
  recordAdministrativeLegalConstraint,
  resolveRelationshipFormulaDisposition,
  setAdministrativeLegalConstraintEnforceability,
  submitBoundedAwardIntention,
  submitFederalPaymentIntention,
  submitFiscalControlIntention,
  submitLocalMemberDecision,
  submitLocalRelationshipStatusDecision,
  submitRelationshipQualificationDetermination,
  submitRecipientActivityIntention,
  submitRecipientCommitmentIntention,
  submitRecipientDrawIntention,
  supplySupplementalWaiverRecords,
  type FutureWaiverRequestInput,
  type BoundedRecipientAwardRequest,
  type RecipientCommitmentRequest,
  type RelationshipStatus,
  type WaiverIntention,
} from "../sim/program-implementation";
import {
  admitValidatedMaterialInputs,
  admitGeneratedMaterialHousingProject,
  applyMaterialHousingCondition,
  advanceIntegratedMaterialHousing,
  assertIntegratedMaterialHousingState,
  compareMaterialHousingConditions,
  deriveMaterialHousingBoundaries,
  finalizePendingMaterialHousingCompletions,
  type AcceptedMaterialInputReference,
  type GeneratedMaterialHousingProjectInput,
  type IntegratedMaterialHousingState,
  type MaterialHousingConditionRecord,
} from "../sim/housing";
import {
  assertIntegratedInformationRuntimeState,
  captureIntegratedHousingObservation,
  createIntegratedMeasurementArtifact,
  deliverIntegratedInformation,
  recordIntegratedPopulationExposure,
  recordIntegratedPopulationResponses,
  releaseIntegratedClaim,
  releaseIntegratedMeasurement,
  resolveInformationClaimantAt,
  type IntegratedPopulationResponseRecord,
} from "../sim/integrated-information";
import {
  applyLegalContestBoundary,
  assertIntegratedLegalContestRuntimeState,
  deriveOrderEnforceability,
  recordAdministrativeComplianceResponse,
  requestSeparateStay,
  type LegalActionCommandRecord,
} from "../sim/legal-contest-runtime";
import { parseLegislativeRuntime, serializeLegislativeRuntime } from "./legislative-persistence";
import {
  createInitialLegislativeControlBinding,
  createLegislativeSessionForStateOwner,
  LEGISLATIVE_ADMINISTRATION_DECISION_SURFACE,
  type LegislativeSession,
  type LegislativeControlBinding,
} from "./legislative-session";

export const INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION = 11 as const;

interface IntegratedPartialSaveEnvelope {
  readonly formatVersion: typeof INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION;
  readonly configuration: IntegratedPartialRuntimeState["configuration"];
  readonly artifactBindings: IntegratedPartialRuntimeState["artifactBindings"];
  readonly geographyArtifactIds: readonly string[];
  readonly legislativeRuntime: IntegratedPartialRuntimeState["legislative"];
  readonly controlBinding: LegislativeControlBinding;
  readonly controlBindingHistory: readonly LegislativeControlBinding[];
  readonly population: IntegratedPartialRuntimeState["population"];
  readonly electoralTopology: IntegratedPartialRuntimeState["electoralTopology"];
  readonly institutional: IntegratedPartialRuntimeState["institutional"];
  readonly implementation: IntegratedPartialRuntimeState["implementation"];
  readonly housing: IntegratedPartialRuntimeState["housing"];
  readonly information: IntegratedPartialRuntimeState["information"];
  readonly legalContest: IntegratedPartialRuntimeState["legalContest"];
}

const deepCopy = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export interface IntegratedPartialRuntimeSession {
  readonly getAuditState: () => IntegratedPartialRuntimeState;
  readonly getControlBindingAudit: () => LegislativeControlBinding;
  readonly getControlBindingHistoryAudit: () => readonly LegislativeControlBinding[];
  readonly getLegislativeAdministrationView: LegislativeSession["getAdministrationView"];
  readonly reviseAgenda: LegislativeSession["reviseAgenda"];
  readonly beginSponsorSearch: LegislativeSession["beginSponsorSearch"];
  readonly seekSponsorship: LegislativeSession["seekSponsorship"];
  readonly introduceBySponsor: LegislativeSession["introduceBySponsor"];
  readonly advanceIntroducedProposal: LegislativeSession["advanceIntroducedProposal"];
  readonly resolveConsiderationGate: LegislativeSession["resolveConsiderationGate"];
  readonly negotiateWithActor: LegislativeSession["negotiateWithActor"];
  readonly negotiateWithOrganization: LegislativeSession["negotiateWithOrganization"];
  readonly coordinateOrganization: LegislativeSession["coordinateOrganization"];
  readonly requestAmendment: LegislativeSession["requestAmendment"];
  readonly resolveAmendment: LegislativeSession["resolveAmendment"];
  readonly closeAmendmentRound: LegislativeSession["closeAmendmentRound"];
  readonly resolveFinalRollCall: LegislativeSession["resolveFinalRollCall"];
  readonly considerTextExchange: LegislativeSession["considerTextExchange"];
  readonly present: LegislativeSession["present"];
  readonly executiveAction: LegislativeSession["executiveAction"];
  readonly resolveOverride: LegislativeSession["resolveOverride"];
  readonly refinePopulation: (request: PopulationRefinementRequest) => IntegratedPartialRuntimeState;
  readonly mergePopulation: (cohortIds: readonly string[], causeKey: string) => IntegratedPartialRuntimeState;
  readonly startNewCongressAgenda: () => IntegratedPartialRuntimeState;
  readonly advanceTo: (instant: string) => IntegratedPartialRuntimeState;
  readonly advanceToNextBoundary: () => IntegratedPartialRuntimeState;
  readonly getPublicInstitutionalStatus: () => IntegratedInstitutionalPublicStatus;
  readonly getPublicImplementationStatus: () => IntegratedImplementationPublicStatus;
  readonly admitEnactedLawFiscalAuthority: (legalSourceId: string) => IntegratedPartialRuntimeState;
  readonly requestApportionment: (budgetAuthorityId: string) => IntegratedPartialRuntimeState;
  readonly requestBoundedAward: (request: BoundedRecipientAwardRequest) => IntegratedPartialRuntimeState;
  readonly requestRecipientCommitment: (request: RecipientCommitmentRequest) => IntegratedPartialRuntimeState;
  readonly requestRecipientActivitySetup: (commitmentId: string) => IntegratedPartialRuntimeState;
  readonly requestRecipientDraw: (activityId: string, amountMinorUnits: number) => IntegratedPartialRuntimeState;
  readonly requestFederalPayment: (drawRequestId: string) => IntegratedPartialRuntimeState;
  readonly openFutureWaiver: (request: FutureWaiverRequestInput) => IntegratedPartialRuntimeState;
  readonly directFutureWaiver: (requestId: string, intention: WaiverIntention) => IntegratedPartialRuntimeState;
  readonly supplyFutureWaiverRecords: (requestId: string, recordTypes: readonly string[]) => IntegratedPartialRuntimeState;
  readonly getHousingAuditState: () => NonNullable<IntegratedPartialRuntimeState["housing"]>;
  readonly getInformationAuditState: () => NonNullable<IntegratedPartialRuntimeState["information"]>;
  readonly getPublicInformationStatus: () => IntegratedInformationPublicStatus;
  readonly issueBoundedRelationshipRejection: (
    procedureRecordIds?: readonly string[],
  ) => IntegratedPartialRuntimeState;
  readonly respondToJudicialOrder: (
    action: "COMPLY" | "DELAY" | "CONTEST" | "NONCOMPLY",
  ) => IntegratedPartialRuntimeState;
  readonly requestJudicialStay: () => IntegratedPartialRuntimeState;
  readonly getLegalContestAuditState: () => NonNullable<IntegratedPartialRuntimeState["legalContest"]>;
  readonly getPublicLegalStatus: () => IntegratedLegalPublicStatus;
  readonly save: () => string;
}

export interface IntegratedPartialRuntimeAuditSession extends IntegratedPartialRuntimeSession {
  readonly resolveOwnerIntention: (intentionId: string) => IntegratedPartialRuntimeState;
  readonly injectLocalMemberDecision: (
    relationshipId: string,
    memberId: string,
    election: "INCLUDE" | "EXCLUDE",
    causeKey: string,
  ) => IntegratedPartialRuntimeState;
  readonly injectLocalRelationshipStatusDecision: (
    relationshipId: string,
    status: RelationshipStatus,
    causeKey: string,
  ) => IntegratedPartialRuntimeState;
  readonly injectGeneratedHousingProject: (
    input: GeneratedMaterialHousingProjectInput,
  ) => IntegratedPartialRuntimeState;
  readonly injectHousingMaterialCondition: (
    projectId: string,
    kind: MaterialHousingConditionRecord["kind"],
    causeRef: string,
  ) => IntegratedPartialRuntimeState;
}

export interface IntegratedImplementationPublicStatus {
  readonly detailCoverage: string;
  readonly nationalBalance: string;
  readonly historicalBudgetAuthorityCount: number;
  readonly generatedBudgetAuthorities: readonly {
    readonly id: string;
    readonly status: string;
    readonly minorUnits: number;
  }[];
  readonly pendingWaiverRequestIds: readonly string[];
  readonly publicDeterminationIds: readonly string[];
  readonly relationshipStatuses: readonly { readonly id: string; readonly status: string }[];
  readonly materialInputKinds: readonly string[];
  readonly physicalHousingStatePresent: false;
}

export interface IntegratedInformationPublicStatus {
  readonly releasedMeasurements: readonly {
    readonly id: string;
    readonly releasedAt: string;
    readonly classification: string;
  }[];
  readonly releasedClaims: readonly {
    readonly id: string;
    readonly claimantId: string;
    readonly subject: string;
    readonly position: string;
    readonly releasedAt: string;
    readonly classification: string;
  }[];
  readonly completedDeliveryIds: readonly string[];
  readonly publicExposureCount: number;
}

export interface IntegratedLegalPublicStatus {
  readonly filedClaims: readonly { readonly id: string; readonly claimantId: string; readonly filedAt: string; readonly status: string }[];
  readonly proceedings: readonly { readonly id: string; readonly courtInstitutionId: string; readonly status: string }[];
  readonly publicRulings: readonly { readonly id: string; readonly disposition: string; readonly decidedAt: string }[];
  readonly operativeOrders: readonly { readonly id: string; readonly targetInstitutionId: string; readonly status: string; readonly enforceability: string }[];
  readonly stays: readonly { readonly id: string; readonly status: string; readonly issuedAt: string }[];
  readonly appeals: readonly { readonly id: string; readonly status: string; readonly disposition: string | null }[];
  readonly compliance: readonly { readonly status: string; readonly recordedAt: string }[];
}

export interface IntegratedInstitutionalPublicStatus {
  readonly currentInstant: string;
  readonly currentTermLabel: string;
  readonly currentAdministrationId: string;
  readonly currentHeadActorId: string;
  readonly currentDeputyActorId: string;
  readonly controlBindingActive: boolean;
  readonly nextBoundary: { readonly id: string; readonly at: string; readonly kind: string } | null;
  readonly selectionStage: InstitutionalRuntimeState["selection"]["stage"];
  readonly popularResults: InstitutionalRuntimeState["selection"]["popularResults"];
  readonly attestations: InstitutionalRuntimeState["selection"]["attestations"];
  readonly appointments: InstitutionalRuntimeState["selection"]["appointments"];
  readonly certificates: InstitutionalRuntimeState["selection"]["certificates"];
  readonly declaration: InstitutionalRuntimeState["selection"]["declaration"];
  readonly entitlements: InstitutionalRuntimeState["selection"]["entitlements"];
  readonly currentExecutiveAssignments: readonly {
    readonly id: string;
    readonly officeId: string;
    readonly actorId: string;
    readonly effectiveFrom: string;
    readonly effectiveUntil: string | null;
  }[];
}

const serialize = (
  state: IntegratedPartialRuntimeState,
  controlBinding: LegislativeControlBinding,
  controlBindingHistory: readonly LegislativeControlBinding[],
): string => JSON.stringify({
  formatVersion: INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION,
  configuration: state.configuration,
  artifactBindings: state.artifactBindings,
  geographyArtifactIds: state.geography.artifactIds,
  legislativeRuntime: state.legislative,
  controlBinding,
  controlBindingHistory,
  population: state.population,
  electoralTopology: state.electoralTopology,
  institutional: state.institutional,
  implementation: state.implementation,
  housing: state.housing,
  information: state.information,
  legalContest: state.legalContest,
} satisfies IntegratedPartialSaveEnvelope);

const materialInputReferences = (
  implementation: NonNullable<IntegratedPartialRuntimeState["implementation"]>,
  housing: NonNullable<IntegratedPartialRuntimeState["housing"]>,
): readonly AcceptedMaterialInputReference[] => {
  const configuredProjects = new Set(housing.projects.map((project) => project.id));
  return implementation.materialInputs
    .filter((input) => configuredProjects.has(input.projectRef))
    .map((input) => ({
      id: input.id,
      kind: input.kind,
      sourceOwnerId: input.sourceOwnerId,
      sourceRecordId: input.sourceRecordId,
      projectRef: input.projectRef,
      scopeKey: input.scopeKey,
      releaseOfInputId: input.releaseOfInputId,
      causalPredecessorInputIds: [...input.causalPredecessorInputIds],
      validatedAt: input.validatedAt,
      classification: input.classification,
    }));
};

const reconstructHousingTo = (
  baseline: NonNullable<IntegratedPartialRuntimeState["housing"]>,
  implementation: NonNullable<IntegratedPartialRuntimeState["implementation"]>,
  epoch: string,
  target: string,
  canonicalHousing?: IntegratedMaterialHousingState,
): NonNullable<IntegratedPartialRuntimeState["housing"]> => {
  let housing = baseline;
  for (const project of (canonicalHousing?.projects ?? []).filter((entry) => entry.classification === "SIMULATION_GENERATED")) {
    housing = admitGeneratedMaterialHousingProject(housing, {
      housingRegionId: project.housingRegionId,
      projectLocatorGeographyId: project.projectLocatorGeographyId,
      relationshipId: project.relationshipId,
      activityType: project.activityType,
      expectedUnits: project.expectedUnits,
      requiredProgressUnits: project.requiredProgressUnits,
      baseProgressUnitsPerDay: project.baseProgressUnitsPerDay,
      earliestTransitionAt: project.earliestTransitionAt,
      causeRef: project.admissionCauseRef ?? (() => { throw new Error("Generated Housing project lacks admission cause."); })(),
    });
  }
  let cursor = epoch;
  const inputGroups = new Map<string, AcceptedMaterialInputReference[]>();
  for (const input of materialInputReferences(implementation, housing)) {
    const group = inputGroups.get(input.validatedAt) ?? [];
    group.push(input);
    inputGroups.set(input.validatedAt, group);
  }
  const conditionGroups = new Map<string, NonNullable<typeof canonicalHousing>["materialConditions"]>();
  for (const condition of canonicalHousing?.materialConditions ?? []) {
    conditionGroups.set(condition.occurredAt, [...(conditionGroups.get(condition.occurredAt) ?? []), condition]);
  }
  const instants = [...new Set([...inputGroups.keys(), ...conditionGroups.keys()])]
    .filter((at) => Date.parse(at) <= Date.parse(target))
    .sort((left, right) => Date.parse(left) - Date.parse(right) || left.localeCompare(right));
  for (const at of instants) {
    if (Date.parse(at) < Date.parse(epoch)) throw new Error("Material input predates the configured scenario epoch.");
    housing = advanceIntegratedMaterialHousing(housing, cursor, at, { deferCompletionsAtTarget: true });
    housing = admitValidatedMaterialInputs(housing, inputGroups.get(at) ?? []);
    for (const condition of [...(conditionGroups.get(at) ?? [])].sort(compareMaterialHousingConditions)) {
      housing = applyMaterialHousingCondition(housing, condition.projectId, condition.kind, condition.occurredAt, condition.causeRef);
    }
    housing = finalizePendingMaterialHousingCompletions(housing, at);
    cursor = at;
  }
  return advanceIntegratedMaterialHousing(housing, cursor, target);
};

const artifactIdentity = (values: IntegratedPartialRuntimeState["artifactBindings"]): string =>
  JSON.stringify([...values].sort((left, right) => left.id.localeCompare(right.id)));

const requireExactArtifactState = (saved: unknown, baseline: unknown, label: string): void => {
  if (JSON.stringify(saved) !== JSON.stringify(baseline)) {
    throw new Error(`Integrated partial save ${label} differs from its pinned artifact authority.`);
  }
};

const cohortAuthoritySignature = (
  cohort: IntegratedPartialRuntimeState["population"]["cohorts"][number],
): string => JSON.stringify({
  residenceGeographyId: cohort.residenceGeographyId,
  stateControlId: cohort.stateControlId,
  materialExposureClass: cohort.materialExposureClass,
  catchmentClass: cohort.catchmentClass,
  projectLocatorGeographyId: cohort.projectLocatorGeographyId,
  eligibilityProjection: {
    projectionId: cohort.eligibilityProjection.projectionId,
    shareNumerator: cohort.eligibilityProjection.shareNumerator,
    shareDenominator: cohort.eligibilityProjection.shareDenominator,
    allocationPolicy: cohort.eligibilityProjection.allocationPolicy,
    classification: cohort.eligibilityProjection.classification,
  },
});

const cohortAuthorityAggregates = (
  cohorts: IntegratedPartialRuntimeState["population"]["cohorts"],
): Map<string, { representedWeight: number; eligibilityWeight: number }> => {
  const aggregates = new Map<string, { representedWeight: number; eligibilityWeight: number }>();
  for (const cohort of cohorts) {
    const signature = cohortAuthoritySignature(cohort);
    const aggregate = aggregates.get(signature) ?? { representedWeight: 0, eligibilityWeight: 0 };
    aggregate.representedWeight += cohort.representedWeight;
    aggregate.eligibilityWeight += cohort.eligibilityProjection.allocatedWeight;
    aggregates.set(signature, aggregate);
  }
  return aggregates;
};

const assertPopulationArtifactAuthority = (
  population: IntegratedPartialRuntimeState["population"],
  baseline: IntegratedPartialRuntimeState["population"],
): void => {
  requireExactArtifactState(population.controls, baseline.controls, "resident controls");
  requireExactArtifactState(population.eligibilityProxies, baseline.eligibilityProxies, "eligibility proxy controls");
  requireExactArtifactState(population.sourceArtifactIds, baseline.sourceArtifactIds, "Population artifact IDs");
  requireExactArtifactState(population.scaffoldVersion, baseline.scaffoldVersion, "Population scaffold version");
  requireExactArtifactState(
    population.refinementSemanticVersion,
    baseline.refinementSemanticVersion,
    "Population refinement semantic version",
  );
  const baselineAggregates = cohortAuthorityAggregates(baseline.cohorts);
  const savedAggregates = cohortAuthorityAggregates(population.cohorts);
  requireExactArtifactState(
    [...savedAggregates.entries()].sort(([left], [right]) => left.localeCompare(right)),
    [...baselineAggregates.entries()].sort(([left], [right]) => left.localeCompare(right)),
    "cohort immutable semantics",
  );
  const initialIds = new Set(baseline.cohorts.map((cohort) => cohort.id));
  for (const cohort of population.cohorts) {
    if (!baselineAggregates.has(cohortAuthoritySignature(cohort))) {
      throw new Error(`Integrated partial save cohort ${cohort.id} has unauthorized immutable semantics.`);
    }
    if (
      !Number.isSafeInteger(cohort.lineage.generation) ||
      cohort.lineage.generation < 0 ||
      cohort.lineage.causeKey.trim().length === 0 ||
      (cohort.lineage.generation === 0
        ? cohort.lineage.version !== baseline.scaffoldVersion || !initialIds.has(cohort.id)
        : cohort.lineage.version !== baseline.refinementSemanticVersion)
    ) throw new Error(`Integrated partial save cohort ${cohort.id} has invalid refinement authority.`);
  }
};

const reconstructPopulationBeforeInformationExposure = (
  saved: IntegratedPartialRuntimeState["population"],
  baseline: IntegratedPartialRuntimeState["population"],
  configuration: IntegratedInformationConfiguration,
): IntegratedPartialRuntimeState["population"] => {
  const exposureId = configuration.exposure.id;
  let cohorts = saved.cohorts.map((cohort) => deepCopy(cohort));
  const groups = new Map<string, typeof cohorts>();
  for (const cohort of cohorts.filter((entry) => entry.lineage.causeKey === exposureId)) {
    if (cohort.lineage.parentCohortId === null) {
      throw new Error("Canonical Information exposure refinement lacks its parent identity.");
    }
    groups.set(cohort.lineage.parentCohortId, [
      ...(groups.get(cohort.lineage.parentCohortId) ?? []), cohort,
    ]);
  }
  for (const [parentId, children] of [...groups.entries()].sort(([left], [right]) => left.localeCompare(right))) {
    if (children.length !== 2) throw new Error(`Information exposure refinement ${parentId} lacks two siblings.`);
    const key = sha256Hex(`${saved.refinementSemanticVersion}|${parentId}|${exposureId}`).slice(0, 20);
    const targetedId = `${parentId}.refinement.${key}.targeted`;
    const untargetedId = `${parentId}.refinement.${key}.untargeted`;
    const targeted = children.find((cohort) => cohort.id === targetedId);
    const untargeted = children.find((cohort) => cohort.id === untargetedId);
    if (targeted === undefined || untargeted === undefined) {
      throw new Error(`Information exposure refinement ${parentId} has noncanonical child identities.`);
    }
    const authoritativeParent = baseline.cohorts.find((cohort) => cohort.id === parentId);
    const expectedGeneration = (authoritativeParent?.lineage.generation ?? untargeted.lineage.generation - 1) + 1;
    if (
      targeted.lineage.version !== saved.refinementSemanticVersion ||
      untargeted.lineage.version !== saved.refinementSemanticVersion ||
      targeted.lineage.generation !== expectedGeneration ||
      untargeted.lineage.generation !== expectedGeneration ||
      targeted.lineage.parentCohortId !== parentId || untargeted.lineage.parentCohortId !== parentId ||
      targeted.lineage.causeKey !== exposureId || untargeted.lineage.causeKey !== exposureId ||
      cohortAuthoritySignature(targeted) !== cohortAuthoritySignature(untargeted) ||
      JSON.stringify(targeted.materialExposureReferences) !== JSON.stringify(untargeted.materialExposureReferences) ||
      JSON.stringify(targeted.receivedInformationReferences) !==
        JSON.stringify([...untargeted.receivedInformationReferences, exposureId])
    ) throw new Error(`Information exposure refinement ${parentId} contradicts canonical sibling semantics.`);
    const firstIndex = Math.min(cohorts.indexOf(targeted), cohorts.indexOf(untargeted));
    const parent = {
      ...untargeted,
      id: parentId,
      representedWeight: targeted.representedWeight + untargeted.representedWeight,
      eligibilityProjection: {
        ...untargeted.eligibilityProjection,
        allocatedWeight: targeted.eligibilityProjection.allocatedWeight +
          untargeted.eligibilityProjection.allocatedWeight,
      },
      lineage: authoritativeParent?.lineage ?? {
        version: expectedGeneration - 1 === 0 ? baseline.scaffoldVersion : baseline.refinementSemanticVersion,
        generation: expectedGeneration - 1,
        parentCohortId: null,
        causeKey: `canonical-pre-exposure:${parentId}`,
      },
    };
    cohorts = cohorts.filter((cohort) => cohort !== targeted && cohort !== untargeted);
    cohorts.splice(firstIndex, 0, parent);
  }
  cohorts = cohorts.map((cohort) => {
    if (!cohort.receivedInformationReferences.includes(exposureId)) return cohort;
    const matchesTarget = configuration.exposure.targets.some((target) =>
      cohort.id === target.parentCohortId ||
      (cohort.residenceGeographyId === target.stateGeographyId &&
        cohort.projectLocatorGeographyId === target.projectLocatorGeographyId &&
        cohort.materialExposureClass === target.materialExposureClass &&
        cohort.catchmentClass === target.catchmentClass));
    if (!matchesTarget || cohort.representedWeight !== 1) {
      throw new Error(`Population cohort ${cohort.id} has a noncanonical Information exposure association.`);
    }
    const authoritative = baseline.cohorts.find((entry) => entry.id === cohort.id);
    return {
      ...cohort,
      receivedInformationReferences: cohort.receivedInformationReferences.filter((id) => id !== exposureId),
      politicalState: authoritative?.politicalState ?? cohort.politicalState,
    };
  });
  const reconstructed = { ...saved, cohorts };
  assertWeightedPopulationConservation(reconstructed);
  return reconstructed;
};

const createPopulationResponseRecord = (
  configuration: IntegratedInformationConfiguration,
  claim: NonNullable<IntegratedPartialRuntimeState["information"]>["claims"][number],
  exposure: NonNullable<IntegratedPartialRuntimeState["information"]>["exposures"][number],
  cohort: IntegratedPartialRuntimeState["population"]["cohorts"][number],
  at: string,
): IntegratedPopulationResponseRecord => {
  const configured = configuration.response.outcomesByClaimPosition[claim.position];
  if (configured === undefined) throw new Error(`No Population response rule exists for claim position ${claim.position}.`);
  const directReferences = [...cohort.materialExposureReferences].sort();
  const outcome = directReferences.length > 0
    ? configured.withDirectExperience
    : configured.withoutDirectExperience;
  const id = `${configuration.response.id}:${sha256Hex(cohort.id).slice(0, 16)}`;
  const belief = {
    id: `${id}:belief`, value: outcome.belief,
    causeIds: [exposure.id, claim.id, ...directReferences], classification: configuration.response.classification,
  };
  const attribution = {
    id: `${id}:attribution`, value: outcome.attribution,
    causeIds: [belief.id, claim.id, claim.claimantId], classification: configuration.response.classification,
  };
  const salience = {
    id: `${id}:salience`, value: outcome.salience,
    causeIds: [belief.id, ...directReferences], classification: configuration.response.classification,
  };
  const preference = {
    id: `${id}:preference`, value: outcome.candidatePreference,
    causeIds: [belief.id, attribution.id, salience.id], classification: configuration.response.classification,
  };
  const turnout = {
    id: `${id}:turnout`, value: outcome.turnoutDisposition,
    causeIds: [salience.id, preference.id], classification: configuration.response.classification,
  };
  return {
    id,
    exposureId: exposure.id,
    cohortId: cohort.id,
    directMaterialExperienceReferenceIds: directReferences,
    belief,
    attribution,
    salience,
    preference,
    turnout,
    appliedAt: at,
    ruleVersion: configuration.responseRuleVersion,
    classification: configuration.response.classification,
  };
};

const parse = (
  serialized: string,
  configuration: GovernmentConfiguration<LegislativeRuntimeSeed>,
  artifacts: IntegratedRuntimeArtifactBundle,
): {
  readonly state: IntegratedPartialRuntimeState;
  readonly controlBinding: LegislativeControlBinding;
  readonly controlBindingHistory: readonly LegislativeControlBinding[];
} => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(serialized) as unknown;
  } catch {
    throw new Error("Invalid integrated partial save: serialized data is not valid JSON.");
  }
  if (!isRecord(parsed) || parsed.formatVersion !== INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION) {
    throw new Error("Unsupported integrated partial save format version.");
  }
  if (
    !isRecord(parsed.configuration) ||
    !Array.isArray(parsed.artifactBindings) ||
    !Array.isArray(parsed.geographyArtifactIds) ||
    !isRecord(parsed.legislativeRuntime) ||
    !isRecord(parsed.controlBinding) ||
    !Array.isArray(parsed.controlBindingHistory) ||
    !isRecord(parsed.population) ||
    !isRecord(parsed.electoralTopology) ||
    !isRecord(parsed.institutional) ||
    !isRecord(parsed.implementation) ||
    !isRecord(parsed.housing) ||
    !isRecord(parsed.information) ||
    !isRecord(parsed.legalContest)
  ) throw new Error("Invalid integrated partial save envelope.");
  const baseline = createIntegratedPartialRuntimeState(configuration, artifacts);
  assertConfigurationIdentityCompatible(
    configuration.identity,
    parsed.configuration as unknown as IntegratedPartialRuntimeState["configuration"],
  );
  const savedBindings = parsed.artifactBindings as unknown as IntegratedPartialRuntimeState["artifactBindings"];
  if (artifactIdentity(savedBindings) !== artifactIdentity(baseline.artifactBindings)) {
    throw new Error("Integrated partial save artifact identity mismatch.");
  }
  const geographyArtifactIds = parsed.geographyArtifactIds as unknown as readonly string[];
  if (JSON.stringify(geographyArtifactIds) !== JSON.stringify(baseline.geography.artifactIds)) {
    throw new Error("Integrated partial save Geography artifact mismatch.");
  }
  const legislativeRuntime = parsed.legislativeRuntime as unknown as IntegratedPartialRuntimeState["legislative"];
  const controlBinding = parsed.controlBinding as unknown as LegislativeControlBinding;
  const validatedLegislative = parseLegislativeRuntime(
    serializeLegislativeRuntime(legislativeRuntime, controlBinding),
    configuration.identity,
  );
  const population = parsed.population as unknown as IntegratedPartialRuntimeState["population"];
  assertWeightedPopulationConservation(population);
  assertPopulationArtifactAuthority(population, baseline.population);
  const electoralTopology = parsed.electoralTopology as unknown as IntegratedPartialRuntimeState["electoralTopology"];
  requireExactArtifactState(electoralTopology, baseline.electoralTopology, "electoral topology");
  const temporal = configuration.integratedRuntime?.temporal;
  const institutional = parsed.institutional as unknown as InstitutionalRuntimeState;
  if (temporal === undefined || baseline.institutional === null) {
    throw new Error("Integrated partial save supplies unsupported institutional time state.");
  }
  assertCalendarTimeState(institutional.calendar, configuration.calendar.epoch, temporal.boundaries);
  assertInstitutionalRuntimeState(institutional, temporal, electoralTopology, configuration.structure);
  const implementationConfiguration = configuration.integratedRuntime?.implementation;
  if (
    implementationConfiguration === undefined ||
    baseline.implementation === null ||
    artifacts.programInitialization === undefined
  ) throw new Error("Integrated partial save supplies unsupported implementation state.");
  const implementation = parsed.implementation as unknown as NonNullable<IntegratedPartialRuntimeState["implementation"]>;
  assertProgramImplementationState(implementation, implementationConfiguration, artifacts.programInitialization);
  const currentTime = Date.parse(institutional.calendar.current);
  if (implementation.administrativeProgram.dynamicBoundaries.some(
    (boundary) => boundary.processed !== (Date.parse(boundary.at) <= currentTime),
  )) throw new Error("Integrated partial save dynamic boundaries contradict canonical composite time.");
  for (const authority of implementation.publicFinance.generatedBudgetAuthorities) {
    const law = validatedLegislative.state.enactedLegalSources.find((entry) => entry.id === authority.sourceLegalId);
    if (law === undefined || baseline.implementation === null) {
      throw new Error(`Generated budget authority ${authority.id} lacks its enacted legal source.`);
    }
    const expectedState = admitEnactedFiscalAuthority(
      baseline.implementation,
      law,
      implementationConfiguration,
      authority.enactedAt,
    );
    const expectedAuthority = expectedState.publicFinance.generatedBudgetAuthorities[0];
    if (
      expectedAuthority === undefined ||
      JSON.stringify({ ...authority, status: "AUTHORITY_RECOGNIZED" }) !== JSON.stringify(expectedAuthority)
    ) throw new Error(`Generated budget authority ${authority.id} contradicts its enacted legal terms.`);
    const control = implementation.fiscalExecution.generatedControls.find(
      (entry) => entry.sourceBudgetAuthorityId === authority.id,
    );
    if (authority.status === "APPORTIONED") {
      if (control === undefined) throw new Error(`Apportioned authority ${authority.id} lacks its fiscal control.`);
    } else if (control !== undefined) {
      throw new Error(`Generated fiscal control ${control.id} precedes apportioned authority state.`);
    }
  }
  let expectedAssignments = baseline.legislative.activeAssignments.map((assignment) => ({ ...assignment }));
  for (const cycle of [...institutional.termCycles].sort(
    (left, right) => Date.parse(left.frozenAt) - Date.parse(right.frozenAt),
  )) {
    if (cycle.status !== "COMPLETE") {
      throw new Error("Integrated partial save contains a partially applied same-instant assignment cycle.");
    }
    const configuredCycle = temporal.assignmentCycles.find((candidate) => candidate.id === cycle.cycleId);
    if (configuredCycle === undefined) throw new Error("Integrated partial save contains an unknown assignment cycle.");
    const officeIds = new Set(configuredCycle.officeIds);
    const expectedEnded = expectedAssignments.filter((assignment) => officeIds.has(assignment.officeId))
      .map((assignment) => ({ ...assignment, effectiveUntil: cycle.frozenAt }));
    const expectedBegun = cycle.results.map((result) => ({
      id: result.successorAssignmentId,
      officeId: result.officeId,
      actorId: result.successorActorId,
      effectiveFrom: cycle.frozenAt,
      effectiveUntil: configuredCycle.nextBoundaryByOfficeId[result.officeId],
      classification: configuredCycle.classification,
    }));
    if (
      JSON.stringify(cycle.endedAssignments) !== JSON.stringify(expectedEnded) ||
      JSON.stringify(cycle.begunAssignments) !== JSON.stringify(expectedBegun)
    ) throw new Error("Integrated partial save assignment-cycle history contradicts its results.");
    expectedAssignments = [
      ...expectedAssignments.filter((assignment) => !officeIds.has(assignment.officeId)),
      ...expectedBegun,
    ];
  }
  if (institutional.selection.stage === "TRANSFERRED") {
    const executiveOfficeIds = new Set([
      temporal.selection.transfer.headOfficeId,
      temporal.selection.transfer.deputyOfficeId,
    ]);
    expectedAssignments = [
      ...expectedAssignments.filter((assignment) => !executiveOfficeIds.has(assignment.officeId)),
      ...institutional.selection.entitlements.map((entitlement) => ({
        id: `${temporal.selection.transfer.assignmentIdPrefix}${entitlement.officeId === temporal.selection.transfer.headOfficeId ? "head" : "deputy"}`,
        officeId: entitlement.officeId,
        actorId: entitlement.entitledActorId,
        effectiveFrom: temporal.selection.transfer.scheduledAt,
        effectiveUntil: temporal.selection.transfer.successorTermEndsAt,
        classification: temporal.selection.classification,
      })),
    ];
  }
  if (JSON.stringify(validatedLegislative.state.activeAssignments) !== JSON.stringify(expectedAssignments)) {
    throw new Error("Integrated partial save active assignments contradict configured temporal transitions.");
  }
  const headAssignment = validatedLegislative.state.activeAssignments.find(
    (assignment) => assignment.officeId === temporal.selection.transfer.headOfficeId,
  );
  const deputyAssignment = validatedLegislative.state.activeAssignments.find(
    (assignment) => assignment.officeId === temporal.selection.transfer.deputyOfficeId,
  );
  if (
    headAssignment?.actorId !== institutional.currentAdministration.headActorId ||
    deputyAssignment?.actorId !== institutional.currentAdministration.deputyActorId
  ) throw new Error("Integrated partial save current administration contradicts active executive assignments.");
  const expectedActiveBinding = institutional.currentAdministration.headActorId ===
    temporal.selection.tickets.find((ticket) => ticket.id === temporal.selection.transfer.playerAlignedTicketId)
      ?.headCandidate.actorId;
  if (
    (expectedActiveBinding && validatedLegislative.controlBinding.status !== "ACTIVE") ||
    (!expectedActiveBinding && validatedLegislative.controlBinding.status !== "ENDED") ||
    (validatedLegislative.controlBinding.status === "ACTIVE" &&
      validatedLegislative.controlBinding.boundOfficeholderActorId !== headAssignment.actorId)
  ) throw new Error("Integrated partial save ControlBinding contradicts current administration authority.");
  const controlBindingHistory = parsed.controlBindingHistory as unknown as readonly LegislativeControlBinding[];
  const transferCompleted = institutional.selection.stage === "TRANSFERRED";
  const declaredTicket = institutional.selection.declaration === null
    ? null
    : temporal.selection.tickets.find(
        (ticket) => ticket.id === institutional.selection.declaration?.winningTicketId,
      ) ?? null;
  if (transferCompleted && declaredTicket === null) {
    throw new Error("Integrated partial save transfer lacks its configured declared ticket.");
  }
  const expectedInitialAdministration = {
    ...temporal.initialAdministration,
    sourceDeclarationId: null,
  };
  const expectedCurrentAdministration = transferCompleted && declaredTicket !== null
    ? {
        id: `${temporal.selection.transfer.administrationIdPrefix}${sha256Hex(declaredTicket.id).slice(0, 16)}`,
        headActorId: declaredTicket.headCandidate.actorId,
        deputyActorId: declaredTicket.deputyCandidate.actorId,
        effectiveFrom: temporal.selection.transfer.scheduledAt,
        effectiveUntil: temporal.selection.transfer.successorTermEndsAt,
        sourceDeclarationId: institutional.selection.declaration!.id,
        classification: temporal.selection.classification,
      }
    : expectedInitialAdministration;
  if (
    JSON.stringify(institutional.currentAdministration) !== JSON.stringify(expectedCurrentAdministration) ||
    JSON.stringify(institutional.administrationHistory) !== JSON.stringify(
      transferCompleted
        ? [{ ...expectedInitialAdministration, effectiveUntil: temporal.selection.transfer.scheduledAt }]
        : [],
    )
  ) throw new Error("Integrated partial save current-administration history contradicts configured succession.");
  const expectedInitialBinding: LegislativeControlBinding = {
    id: `${configuration.identity.configurationId}.control-binding.legislative-administration`,
    decisionSurface: LEGISLATIVE_ADMINISTRATION_DECISION_SURFACE,
    executiveOfficeId: temporal.selection.transfer.headOfficeId,
    boundOfficeholderActorId: temporal.initialAdministration.headActorId,
    status: "ACTIVE",
    endedAt: null,
    endReason: null,
  };
  const expectedEndedBinding: LegislativeControlBinding = {
    ...expectedInitialBinding,
    status: "ENDED",
    endedAt: temporal.selection.transfer.scheduledAt,
    endReason: "TERM_ENDED",
  };
  const expectedCurrentBinding = transferCompleted &&
    institutional.selection.declaration?.winningTicketId === temporal.selection.transfer.playerAlignedTicketId
    ? {
        id: `${temporal.selection.transfer.bindingIdPrefix}${temporal.selection.transfer.playerAlignedTicketId}`,
        decisionSurface: LEGISLATIVE_ADMINISTRATION_DECISION_SURFACE,
        executiveOfficeId: temporal.selection.transfer.headOfficeId,
        boundOfficeholderActorId: headAssignment.actorId,
        status: "ACTIVE" as const,
        endedAt: null,
        endReason: null,
      }
    : transferCompleted ? expectedEndedBinding : expectedInitialBinding;
  if (
    controlBindingHistory.some((binding) => binding.status !== "ENDED" || binding.endReason !== "TERM_ENDED") ||
    (transferCompleted && controlBindingHistory.length !== 1) ||
    (!transferCompleted && controlBindingHistory.length !== 0) ||
    JSON.stringify(validatedLegislative.controlBinding) !== JSON.stringify(expectedCurrentBinding) ||
    (transferCompleted && JSON.stringify(controlBindingHistory[0]) !== JSON.stringify(expectedEndedBinding))
  ) throw new Error("Integrated partial save ControlBinding history contradicts authority transfer state.");
  if (baseline.housing === null || artifacts.housingInitialization === undefined) {
    throw new Error("Integrated partial save supplies unsupported Material Housing state.");
  }
  const housing = parsed.housing as unknown as NonNullable<IntegratedPartialRuntimeState["housing"]>;
  assertIntegratedMaterialHousingState(housing);
  requireExactArtifactState(housing.controls, baseline.housing.controls, "Housing immutable controls");
  requireExactArtifactState(housing.sourceArtifactId, baseline.housing.sourceArtifactId, "Housing source artifact");
  requireExactArtifactState(housing.catchmentScaffoldVersion, baseline.housing.catchmentScaffoldVersion, "Housing catchment semantics");
  requireExactArtifactState(housing.materialCalibrationVersion, baseline.housing.materialCalibrationVersion, "Housing material semantics");
  requireExactArtifactState(housing.calibration, baseline.housing.calibration, "Housing calibration authority");
  requireExactArtifactState(housing.behavior, baseline.housing.behavior, "Housing repaired behavior semantics");
  const expectedHousing = reconstructHousingTo(
    baseline.housing,
    implementation,
    configuration.calendar.epoch,
    institutional.calendar.current,
    housing,
  );
  requireExactArtifactState(housing, expectedHousing, "Housing deterministic material state");
  const informationConfiguration = configuration.integratedRuntime?.information;
  if (informationConfiguration === undefined || baseline.information === null) {
    throw new Error("Integrated partial save supplies unsupported Information state.");
  }
  for (const cohort of population.cohorts) {
    const expectedMaterialReferences = housing.materialExposureReferences.filter((reference) => {
      const region = housing.regions.find((entry) => entry.id === reference.housingRegionId);
      return region !== undefined && informationConfiguration.exposure.targets.some((target) =>
        target.directExperienceEligible && cohort.residenceGeographyId === target.stateGeographyId &&
        cohort.projectLocatorGeographyId === target.projectLocatorGeographyId &&
        cohort.materialExposureClass === target.materialExposureClass &&
        region.projectLocatorGeographyId === target.projectLocatorGeographyId);
    }).map((reference) => reference.id).sort();
    if (JSON.stringify([...cohort.materialExposureReferences].sort()) !== JSON.stringify(expectedMaterialReferences)) {
      throw new Error(`Population cohort ${cohort.id} contradicts canonical material-experience references.`);
    }
  }
  const information = parsed.information as unknown as NonNullable<IntegratedPartialRuntimeState["information"]>;
  assertIntegratedInformationRuntimeState(information, informationConfiguration, temporal.boundaries);
  let expectedInformation = baseline.information;
  let expectedPopulation = population;
  const informationBoundaries = temporal.boundaries
    .filter((boundary) => boundary.ownerId === informationConfiguration.ownerId)
    .filter((boundary) => Date.parse(boundary.at) <= currentTime)
    .sort(compareConfiguredBoundaries);
  for (const boundary of informationBoundaries) {
    const measurement = informationConfiguration.measurements.find((candidate) =>
      [candidate.observationBoundaryId, candidate.artifactBoundaryId, candidate.releaseBoundaryId].includes(boundary.id));
    if (boundary.kind === "OBSERVATION_CAPTURE" && measurement !== undefined) {
      const observedHousing = reconstructHousingTo(
        baseline.housing,
        implementation,
        configuration.calendar.epoch,
        boundary.at,
        housing,
      );
      expectedInformation = captureIntegratedHousingObservation(
        expectedInformation, measurement, observedHousing, boundary.at,
      );
    } else if (boundary.kind === "MEASUREMENT_CREATED" && measurement !== undefined) {
      expectedInformation = createIntegratedMeasurementArtifact(expectedInformation, measurement, boundary.at);
    } else if (boundary.kind === "MEASUREMENT_RELEASED" && measurement !== undefined) {
      expectedInformation = releaseIntegratedMeasurement(expectedInformation, measurement, boundary.at);
    } else if (boundary.kind === "CLAIM_RELEASED") {
      const claimantId = resolveInformationClaimantAt(
        institutional, temporal, boundary, informationConfiguration.claim.claimantPolicy,
      );
      expectedInformation = releaseIntegratedClaim(
        expectedInformation, informationConfiguration, claimantId, boundary.at,
      );
    } else if (boundary.kind === "INFORMATION_DELIVERED") {
      expectedInformation = deliverIntegratedInformation(expectedInformation, informationConfiguration, boundary.at);
    } else if (boundary.kind === "POPULATION_EXPOSED") {
      expectedPopulation = reconstructPopulationBeforeInformationExposure(
        population, baseline.population, informationConfiguration,
      );
      const canonicalExposure = applyConfiguredPopulationInformationExposure(expectedPopulation, {
        exposureId: informationConfiguration.exposure.id,
        targets: informationConfiguration.exposure.targets,
        targetNumerator: informationConfiguration.exposure.targetNumerator,
        targetDenominator: informationConfiguration.exposure.targetDenominator,
      });
      expectedPopulation = canonicalExposure.population;
      expectedInformation = recordIntegratedPopulationExposure(
        expectedInformation,
        informationConfiguration,
        canonicalExposure.cohortWeights,
        boundary.at,
      );
    } else if (boundary.kind === "POPULATION_RESPONSE") {
      const exposure = expectedInformation.exposures.find((entry) =>
        entry.id === informationConfiguration.response.exposureId);
      const claim = expectedInformation.claims.find((entry) => entry.id === informationConfiguration.claim.id);
      if (exposure === undefined || claim === undefined) {
        throw new Error("Integrated partial save Population response lacks exposure or claim authority.");
      }
      const responses = exposure.cohortIds.map((cohortId) => {
        const cohort = expectedPopulation.cohorts.find((entry) => entry.id === cohortId);
        if (cohort === undefined) throw new Error(`Population response cohort ${cohortId} is unavailable.`);
        return createPopulationResponseRecord(informationConfiguration, claim, exposure, cohort, boundary.at);
      });
      expectedInformation = recordIntegratedPopulationResponses(
        expectedInformation, informationConfiguration, responses, boundary.at,
      );
      for (const response of responses) {
        expectedPopulation = applyPopulationInformationResponse(expectedPopulation, {
          cohortId: response.cohortId,
          exposureId: response.exposureId,
          belief: response.belief.value,
          attribution: response.attribution.value,
          salience: response.salience.value,
          candidatePreference: response.preference.value,
          turnoutDisposition: response.turnout.value,
          classification: response.classification,
        });
      }
    }
  }
  requireExactArtifactState(information, expectedInformation, "Information deterministic causal state");
  if (expectedInformation.exposures.length > 0) {
    requireExactArtifactState(population, expectedPopulation, "Population canonical Information exposure state");
  }
  const legalConfiguration = configuration.integratedRuntime?.legalContest;
  if (legalConfiguration === undefined || baseline.legalContest === null) {
    throw new Error("Integrated partial save supplies unsupported legal-contest state.");
  }
  const legalContest = parsed.legalContest as unknown as NonNullable<IntegratedPartialRuntimeState["legalContest"]>;
  assertIntegratedLegalContestRuntimeState(
    legalContest,
    legalConfiguration,
    implementation.administrativeProgram.relationshipQualificationDeterminations,
  );
  const administrationAt = (at: string): string => {
    const terms = [...institutional.administrationHistory, institutional.currentAdministration];
    const term = terms.find((entry) => Date.parse(entry.effectiveFrom) <= Date.parse(at) &&
      (entry.effectiveUntil === null || Date.parse(at) < Date.parse(entry.effectiveUntil)));
    if (term === undefined) throw new Error(`Legal action at ${at} lacks a canonical administration owner.`);
    return term.id;
  };
  const commands = [...legalContest.actionCommands].sort((left, right) =>
    Date.parse(left.issuedAt) - Date.parse(right.issuedAt) || left.id.localeCompare(right.id));
  if (commands.some((entry) => Date.parse(entry.issuedAt) < Date.parse(configuration.calendar.epoch) ||
    Date.parse(entry.issuedAt) > currentTime || entry.administrationId !== administrationAt(entry.issuedAt))) {
    throw new Error("Saved legal action history contradicts canonical time or administration ownership.");
  }
  let expectedLegal = baseline.legalContest;
  let expectedLegalImplementation: NonNullable<IntegratedPartialRuntimeState["implementation"]> = {
    ...implementation,
    administrativeProgram: {
      ...implementation.administrativeProgram,
      legalConstraints: [],
      formulaDispositionResolutions: [],
    },
  };
  let commandIndex = 0;
  const stayResolutionBoundary = temporal.boundaries.find(
    (boundary) => boundary.id === legalConfiguration.appeal.stayBoundaryId,
  );
  if (stayResolutionBoundary === undefined) {
    throw new Error("Configured stay resolution boundary is unavailable.");
  }
  const replayCommand = (command: LegalActionCommandRecord): void => {
    expectedLegal = command.action === "REQUEST_STAY"
      ? requestSeparateStay(
          expectedLegal,
          legalConfiguration,
          command.administrationId,
          command.issuedAt,
          stayResolutionBoundary.at,
        )
      : recordAdministrativeComplianceResponse(
          expectedLegal, legalConfiguration, command.administrationId, command.action, command.issuedAt,
        );
  };
  const legalBoundaries = temporal.boundaries
    .filter((boundary) => boundary.ownerId === legalConfiguration.ownerId && Date.parse(boundary.at) <= currentTime)
    .sort(compareConfiguredBoundaries);
  for (const boundary of legalBoundaries) {
    while (commands[commandIndex] !== undefined && Date.parse(commands[commandIndex].issuedAt) < Date.parse(boundary.at)) {
      replayCommand(commands[commandIndex++]);
    }
    expectedLegal = applyLegalContestBoundary(
      expectedLegal,
      legalConfiguration,
      boundary,
      implementation.administrativeProgram.relationshipQualificationDeterminations,
      administrationAt(boundary.at),
    );
    const order = expectedLegal.orders[0];
    if (boundary.id === legalConfiguration.order.effectiveBoundaryId && order !== undefined && order.effectiveAt !== null) {
      expectedLegalImplementation = recordAdministrativeLegalConstraint(expectedLegalImplementation, {
        id: `${legalConfiguration.ownerId}.implementation-constraint`,
        sourceOrderId: order.id,
        targetInstitutionId: order.targetInstitutionId,
        programId: order.scope.programId,
        relationshipId: order.scope.relationshipId,
        determinationId: order.scope.determinationId,
        requiredAct: order.requiredAct,
        prohibitedAct: order.prohibitedAct,
        effectiveAt: order.effectiveAt,
        enforceability: deriveOrderEnforceability(expectedLegal, order.id),
        enforceabilityCauseId: order.id,
      });
    }
    if (order !== undefined && [legalConfiguration.appeal.stayBoundaryId, legalConfiguration.appeal.rulingBoundaryId].includes(boundary.id)) {
      const causeId = boundary.id === legalConfiguration.appeal.stayBoundaryId
        ? expectedLegal.stays[0]?.id ?? boundary.id
        : expectedLegal.appeals[0]?.id ?? boundary.id;
      expectedLegalImplementation = setAdministrativeLegalConstraintEnforceability(
        expectedLegalImplementation, order.id, deriveOrderEnforceability(expectedLegal, order.id), causeId,
      );
    }
    if (boundary.id === legalConfiguration.administrativeAction.boundaryId) {
      const compliance = expectedLegal.complianceStates.at(-1) ?? null;
      expectedLegalImplementation = resolveRelationshipFormulaDisposition(expectedLegalImplementation, {
        id: legalConfiguration.administrativeAction.id,
        determinationId: legalConfiguration.trigger.determinationId,
        complianceStateId: compliance?.id ?? null,
        complied: compliance?.status === "COMPLIED",
      }, boundary.at);
    }
    while (commands[commandIndex] !== undefined && Date.parse(commands[commandIndex].issuedAt) === Date.parse(boundary.at)) {
      replayCommand(commands[commandIndex++]);
    }
  }
  while (commands[commandIndex] !== undefined) replayCommand(commands[commandIndex++]);
  requireExactArtifactState(legalContest, expectedLegal, "deterministic legal-contest state");
  requireExactArtifactState(
    implementation.administrativeProgram.legalConstraints,
    expectedLegalImplementation.administrativeProgram.legalConstraints,
    "cross-owner legal constraints",
  );
  requireExactArtifactState(
    implementation.administrativeProgram.formulaDispositionResolutions,
    expectedLegalImplementation.administrativeProgram.formulaDispositionResolutions,
    "legal-constrained administrative action resolutions",
  );
  return {
    state: {
      ...baseline,
      legislative: validatedLegislative.state,
      population,
      electoralTopology,
      institutional,
      implementation,
      housing,
      information,
      legalContest,
    },
    controlBinding: validatedLegislative.controlBinding,
    controlBindingHistory,
  };
};

const createSession = (
  initialState: IntegratedPartialRuntimeState,
  initialBinding: LegislativeControlBinding,
  configuration: GovernmentConfiguration<LegislativeRuntimeSeed>,
  initialControlBindingHistory: readonly LegislativeControlBinding[] = [],
  ownerAuditEnabled = false,
): IntegratedPartialRuntimeSession | IntegratedPartialRuntimeAuditSession => {
  let state = initialState;
  let controlBinding = initialBinding;
  let controlBindingHistory = [...initialControlBindingHistory];
  const temporal = configuration.integratedRuntime?.temporal;
  const implementationConfiguration = configuration.integratedRuntime?.implementation;
  const informationConfiguration = configuration.integratedRuntime?.information;
  const legalConfiguration = configuration.integratedRuntime?.legalContest;
  if (
    temporal === undefined || implementationConfiguration === undefined || informationConfiguration === undefined ||
    legalConfiguration === undefined || state.institutional === null || state.implementation === null ||
    state.housing === null || state.information === null || state.legalContest === null
  ) {
    throw new Error("Integrated session requires institutional, implementation, Housing, Information, and legal-contest state.");
  }
  const synchronizeHousingInputs = (): void => {
    if (state.housing !== null && state.implementation !== null) {
      state = {
        ...state,
        housing: admitValidatedMaterialInputs(
          state.housing,
          materialInputReferences(state.implementation, state.housing),
        ),
      };
    }
  };
  const synchronizePopulationMaterialExperience = (): void => {
    if (state.housing === null) return;
    const housing = state.housing;
    for (const reference of housing.materialExposureReferences) {
      const region = housing.regions.find((candidate) => candidate.id === reference.housingRegionId);
      if (region === undefined) throw new Error(`Material exposure ${reference.id} lacks its Housing region.`);
      for (const target of informationConfiguration.exposure.targets.filter((entry) =>
        entry.directExperienceEligible && entry.stateGeographyId === reference.stateGeographyId &&
        entry.projectLocatorGeographyId === region.projectLocatorGeographyId)) {
        state = {
          ...state,
          population: recordPopulationMaterialExperience(state.population, {
            referenceId: reference.id,
            stateGeographyId: target.stateGeographyId,
            projectLocatorGeographyId: target.projectLocatorGeographyId,
            materialExposureClass: target.materialExposureClass,
          }),
        };
      }
    }
  };
  const requireAdministrationAuthority = (): void => {
    if (controlBinding.status !== "ACTIVE" || state.institutional === null) {
      throw new Error("No active ControlBinding: administration decision surface unavailable.");
    }
    const headAssignment = state.legislative.activeAssignments.find(
      (assignment) => assignment.officeId === controlBinding.executiveOfficeId,
    );
    if (headAssignment?.actorId !== controlBinding.boundOfficeholderActorId) {
      throw new Error("ControlBinding does not resolve to the current executive assignment.");
    }
  };
  const legislativeSession = createLegislativeSessionForStateOwner({
    getLegislativeState: () => state.legislative,
    setLegislativeState: (legislative) => { state = { ...state, legislative }; },
  }, {
    structure: configuration.structure,
    seed: configuration.runtimeSeed as LegislativeRuntimeSeed,
  }, controlBinding, configuration.calendar.epoch, {
    getControlBinding: () => controlBinding,
    getAdministrationId: () => {
      if (state.institutional === null) throw new Error("Integrated session lost current administration state.");
      return state.institutional.currentAdministration.id;
    },
    getAuthoritativeInstant: () => {
      if (state.institutional === null) throw new Error("Integrated session lost canonical calendar state.");
      return state.institutional.calendar.current;
    },
  });
  const compositeBoundaries = (): readonly ConfiguredCalendarBoundary[] => {
    synchronizeHousingInputs();
    if (state.implementation === null || state.institutional === null) return temporal.boundaries;
    const dynamic = state.implementation.administrativeProgram.dynamicBoundaries
      .filter((boundary) => !boundary.processed);
    const housing = state.housing === null
      ? []
      : deriveMaterialHousingBoundaries(state.housing, state.institutional.calendar.current);
    const combined: readonly ConfiguredCalendarBoundary[] = [...temporal.boundaries, ...dynamic, ...housing];
    if (new Set(combined.map((boundary) => boundary.id)).size !== combined.length) {
      throw new Error("Static and dynamic canonical boundaries require unique identities.");
    }
    return combined;
  };
  const nextCompositeBoundary = (): ConfiguredCalendarBoundary | null => {
    if (state.institutional === null) throw new Error("Integrated session lacks institutional time state.");
    const staticProcessed = new Set(state.institutional.calendar.processedBoundaryIds);
    const candidates = compositeBoundaries().filter((boundary) => {
      const isStatic = temporal.boundaries.some((entry) => entry.id === boundary.id);
      return isStatic ? !staticProcessed.has(boundary.id) : true;
    });
    return [...candidates].sort(compareConfiguredBoundaries)[0] ?? null;
  };
  const advanceTo = (target: string): IntegratedPartialRuntimeState => {
    if (state.institutional === null || state.implementation === null) {
      throw new Error("Integrated session lacks institutional time state.");
    }
    synchronizeHousingInputs();
    const currentTime = Date.parse(state.institutional.calendar.current);
    const targetTime = Date.parse(target);
    if (!Number.isFinite(targetTime) || targetTime < currentTime) {
      throw new Error("Canonical calendar time cannot move backwards or to an invalid instant.");
    }
    assertCalendarTimeState(state.institutional.calendar, configuration.calendar.epoch, temporal.boundaries);
    const processedStatic = new Set(state.institutional.calendar.processedBoundaryIds);
    while (true) {
      const next = nextCompositeBoundary();
      if (next === null || Date.parse(next.at) > targetTime) break;
      const previousInstant = state.institutional!.calendar.current;
      const sameInstant = compositeBoundaries()
        .filter((boundary) => Date.parse(boundary.at) === Date.parse(next.at))
        .filter((boundary) => {
          const staticBoundary = temporal.boundaries.find((entry) => entry.id === boundary.id);
          return staticBoundary === undefined || !processedStatic.has(staticBoundary.id);
        })
        .sort(compareConfiguredBoundaries);
      if (state.housing !== null) {
        state = {
          ...state,
          housing: advanceIntegratedMaterialHousing(
            state.housing, previousInstant, next.at, { deferCompletionsAtTarget: true },
          ),
        };
      }
      for (const boundary of sameInstant.filter((entry) =>
        !entry.kind.startsWith("HOUSING_") && entry.ownerId !== informationConfiguration.ownerId)) {
        const staticBoundary = temporal.boundaries.find((entry) => entry.id === boundary.id);
        if (boundary.kind === "SUPPLEMENTAL_RECORD_REVIEW_READY") {
          state = { ...state, implementation: applyAdministrativeBoundary(state.implementation!, boundary.id) };
          synchronizeHousingInputs();
        } else if (staticBoundary !== undefined) {
          const result = applyInstitutionalBoundary(state.institutional!, state.legislative, {
            temporal,
            structure: configuration.structure,
            legislativeSeed: configuration.runtimeSeed as LegislativeRuntimeSeed,
            population: state.population,
            topology: state.electoralTopology,
          }, staticBoundary);
          if (result.transferredTicket !== null) {
            const ended: LegislativeControlBinding = {
              ...controlBinding,
              status: "ENDED",
              endedAt: staticBoundary.at,
              endReason: "TERM_ENDED",
            };
            controlBindingHistory = [...controlBindingHistory, ended];
            controlBinding = result.transferredTicket.id === temporal.selection.transfer.playerAlignedTicketId
              ? {
                  id: `${temporal.selection.transfer.bindingIdPrefix}${result.transferredTicket.id}`,
                  decisionSurface: LEGISLATIVE_ADMINISTRATION_DECISION_SURFACE,
                  executiveOfficeId: temporal.selection.transfer.headOfficeId,
                  boundOfficeholderActorId: result.transferredTicket.headCandidate.actorId,
                  status: "ACTIVE",
                  endedAt: null,
                  endReason: null,
                }
              : ended;
          }
          processedStatic.add(staticBoundary.id);
          state = { ...state, legislative: result.legislative, institutional: result.institutional };
          if (staticBoundary.ownerId === legalConfiguration.ownerId) {
            state = { ...state, legalContest: applyLegalContestBoundary(
              state.legalContest!,
              legalConfiguration,
              staticBoundary,
              state.implementation!.administrativeProgram.relationshipQualificationDeterminations,
              state.institutional!.currentAdministration.id,
            ) };
            const order = state.legalContest!.orders[0];
            if (staticBoundary.id === legalConfiguration.order.effectiveBoundaryId && order !== undefined && order.effectiveAt !== null) {
              state = { ...state, implementation: recordAdministrativeLegalConstraint(state.implementation!, {
                id: `${legalConfiguration.ownerId}.implementation-constraint`,
                sourceOrderId: order.id,
                targetInstitutionId: order.targetInstitutionId,
                programId: order.scope.programId,
                relationshipId: order.scope.relationshipId,
                determinationId: order.scope.determinationId,
                requiredAct: order.requiredAct,
                prohibitedAct: order.prohibitedAct,
                effectiveAt: order.effectiveAt,
                enforceability: deriveOrderEnforceability(state.legalContest!, order.id),
                enforceabilityCauseId: order.id,
              }) };
            }
            if (order !== undefined && [legalConfiguration.appeal.stayBoundaryId,
              legalConfiguration.appeal.rulingBoundaryId].includes(staticBoundary.id)) {
              const causeId = staticBoundary.id === legalConfiguration.appeal.stayBoundaryId
                ? state.legalContest!.stays[0]?.id ?? staticBoundary.id
                : state.legalContest!.appeals[0]?.id ?? staticBoundary.id;
              state = { ...state, implementation: setAdministrativeLegalConstraintEnforceability(
                state.implementation!, order.id, deriveOrderEnforceability(state.legalContest!, order.id), causeId,
              ) };
            }
            if (staticBoundary.id === legalConfiguration.administrativeAction.boundaryId) {
              const compliance = state.legalContest!.complianceStates.at(-1) ?? null;
              state = { ...state, implementation: resolveRelationshipFormulaDisposition(state.implementation!, {
                id: legalConfiguration.administrativeAction.id,
                determinationId: legalConfiguration.trigger.determinationId,
                complianceStateId: compliance?.id ?? null,
                complied: compliance?.status === "COMPLIED",
              }, staticBoundary.at) };
            }
          }
        } else {
          throw new Error(`Unknown canonical composite boundary ${boundary.id}.`);
        }
      }
      if (state.housing !== null) {
        state = { ...state, housing: finalizePendingMaterialHousingCompletions(state.housing, next.at) };
      }
      synchronizePopulationMaterialExperience();
      for (const boundary of sameInstant.filter((entry) => entry.ownerId === informationConfiguration.ownerId)) {
        const staticBoundary = temporal.boundaries.find((entry) => entry.id === boundary.id);
        if (staticBoundary === undefined || state.information === null || state.housing === null) {
          throw new Error(`Unknown configured Information boundary ${boundary.id}.`);
        }
        const result = applyInstitutionalBoundary(state.institutional!, state.legislative, {
          temporal,
          structure: configuration.structure,
          legislativeSeed: configuration.runtimeSeed as LegislativeRuntimeSeed,
          population: state.population,
          topology: state.electoralTopology,
        }, staticBoundary);
        processedStatic.add(staticBoundary.id);
        state = { ...state, legislative: result.legislative, institutional: result.institutional };
        const measurement = informationConfiguration.measurements.find((candidate) =>
          [candidate.observationBoundaryId, candidate.artifactBoundaryId, candidate.releaseBoundaryId]
            .includes(staticBoundary.id));
        if (staticBoundary.kind === "OBSERVATION_CAPTURE" && measurement !== undefined) {
          state = {
            ...state,
            information: captureIntegratedHousingObservation(
              state.information!, measurement, state.housing!, staticBoundary.at,
            ),
          };
        } else if (staticBoundary.kind === "MEASUREMENT_CREATED" && measurement !== undefined) {
          state = {
            ...state,
            information: createIntegratedMeasurementArtifact(state.information!, measurement, staticBoundary.at),
          };
        } else if (staticBoundary.kind === "MEASUREMENT_RELEASED" && measurement !== undefined) {
          state = {
            ...state,
            information: releaseIntegratedMeasurement(state.information!, measurement, staticBoundary.at),
          };
        } else if (staticBoundary.kind === "CLAIM_RELEASED") {
          const claimantId = resolveInformationClaimantAt(
            result.institutional, temporal, staticBoundary, informationConfiguration.claim.claimantPolicy,
          );
          state = {
            ...state,
            information: releaseIntegratedClaim(
              state.information!,
              informationConfiguration,
              claimantId,
              staticBoundary.at,
            ),
          };
        } else if (staticBoundary.kind === "INFORMATION_DELIVERED") {
          state = {
            ...state,
            information: deliverIntegratedInformation(
              state.information!, informationConfiguration, staticBoundary.at,
            ),
          };
        } else if (staticBoundary.kind === "POPULATION_EXPOSED") {
          const canonicalExposure = applyConfiguredPopulationInformationExposure(state.population, {
            exposureId: informationConfiguration.exposure.id,
            targets: informationConfiguration.exposure.targets,
            targetNumerator: informationConfiguration.exposure.targetNumerator,
            targetDenominator: informationConfiguration.exposure.targetDenominator,
          });
          state = {
            ...state,
            population: canonicalExposure.population,
            information: recordIntegratedPopulationExposure(
              state.information!,
              informationConfiguration,
              canonicalExposure.cohortWeights,
              staticBoundary.at,
            ),
          };
        } else if (staticBoundary.kind === "POPULATION_RESPONSE") {
          const exposure = state.information!.exposures.find((entry) =>
            entry.id === informationConfiguration.response.exposureId);
          const claim = state.information!.claims.find((entry) => entry.id === informationConfiguration.claim.id);
          if (exposure === undefined || claim === undefined) {
            throw new Error("Population response lacks its exposure or claim cause.");
          }
          const responses = exposure.cohortIds.map((cohortId) => {
            const cohort = state.population.cohorts.find((entry) => entry.id === cohortId);
            if (cohort === undefined) throw new Error(`Population response lacks cohort ${cohortId}.`);
            return createPopulationResponseRecord(
              informationConfiguration, claim, exposure, cohort, staticBoundary.at,
            );
          });
          for (const response of responses) {
            state = {
              ...state,
              population: applyPopulationInformationResponse(state.population, {
                cohortId: response.cohortId,
                exposureId: response.exposureId,
                belief: response.belief.value,
                attribution: response.attribution.value,
                salience: response.salience.value,
                candidatePreference: response.preference.value,
                turnoutDisposition: response.turnout.value,
                classification: response.classification,
              }),
            };
          }
          state = {
            ...state,
            information: recordIntegratedPopulationResponses(
              state.information!, informationConfiguration, responses, staticBoundary.at,
            ),
          };
        } else {
          throw new Error(`Unsupported Information boundary ${staticBoundary.id}.`);
        }
      }
      state = {
        ...state,
        institutional: {
          ...state.institutional!,
          occurrences: [...state.institutional!.occurrences].sort((left, right) => {
            const leftBoundary = temporal.boundaries.find((boundary) => boundary.id === left.boundaryId);
            const rightBoundary = temporal.boundaries.find((boundary) => boundary.id === right.boundaryId);
            if (leftBoundary === undefined || rightBoundary === undefined) {
              throw new Error("Institutional occurrence lacks its configured boundary.");
            }
            return compareConfiguredBoundaries(leftBoundary, rightBoundary);
          }),
          calendar: {
            current: next.at,
            processedBoundaryIds: temporal.boundaries
              .filter((boundary) => processedStatic.has(boundary.id))
              .sort(compareConfiguredBoundaries)
              .map((boundary) => boundary.id),
          },
        },
      };
    }
    const finalFrom = state.institutional!.calendar.current;
    if (state.housing !== null) {
      state = { ...state, housing: advanceIntegratedMaterialHousing(state.housing, finalFrom, target) };
    }
    synchronizePopulationMaterialExperience();
    state = {
      ...state,
      institutional: { ...state.institutional!, calendar: { ...state.institutional!.calendar, current: target } },
    };
    assertCalendarTimeState(state.institutional!.calendar, configuration.calendar.epoch, temporal.boundaries);
    return deepCopy(state);
  };
  const session: IntegratedPartialRuntimeSession = {
    getAuditState: () => {
      synchronizeHousingInputs();
      synchronizePopulationMaterialExperience();
      return deepCopy(state);
    },
    getControlBindingAudit: () => deepCopy(controlBinding),
    getControlBindingHistoryAudit: () => deepCopy(controlBindingHistory),
    getLegislativeAdministrationView: legislativeSession.getAdministrationView,
    reviseAgenda: legislativeSession.reviseAgenda,
    beginSponsorSearch: legislativeSession.beginSponsorSearch,
    seekSponsorship: legislativeSession.seekSponsorship,
    introduceBySponsor: legislativeSession.introduceBySponsor,
    advanceIntroducedProposal: legislativeSession.advanceIntroducedProposal,
    resolveConsiderationGate: legislativeSession.resolveConsiderationGate,
    negotiateWithActor: legislativeSession.negotiateWithActor,
    negotiateWithOrganization: legislativeSession.negotiateWithOrganization,
    coordinateOrganization: legislativeSession.coordinateOrganization,
    requestAmendment: legislativeSession.requestAmendment,
    resolveAmendment: legislativeSession.resolveAmendment,
    closeAmendmentRound: legislativeSession.closeAmendmentRound,
    resolveFinalRollCall: legislativeSession.resolveFinalRollCall,
    considerTextExchange: legislativeSession.considerTextExchange,
    present: legislativeSession.present,
    executiveAction: legislativeSession.executiveAction,
    resolveOverride: legislativeSession.resolveOverride,
    refinePopulation: (request) => {
      state = { ...state, population: refineWeightedPopulationCohort(state.population, request) };
      return deepCopy(state);
    },
    mergePopulation: (cohortIds, causeKey) => {
      state = { ...state, population: mergeWeightedPopulationCohorts(state.population, cohortIds, causeKey) };
      return deepCopy(state);
    },
    startNewCongressAgenda: () => {
      if (state.institutional === null) throw new Error("Integrated session lacks institutional time state.");
      if (controlBinding.status !== "ACTIVE") {
        throw new Error("No active ControlBinding: administration decision surface unavailable.");
      }
      const proposalId = `${temporal.newProcedureIdPrefix}${state.institutional.currentTermLabel}.${state.legislative.procedureHistory.length + 1}`;
      state = {
        ...state,
        legislative: startNewLegislativeProcedure(
          state.legislative,
          { structure: configuration.structure, seed: configuration.runtimeSeed as LegislativeRuntimeSeed },
          proposalId,
          state.institutional.calendar.current,
        ),
      };
      return deepCopy(state);
    },
    advanceTo,
    advanceToNextBoundary: () => {
      if (state.institutional === null) throw new Error("Integrated session lacks institutional time state.");
      const boundary = nextCompositeBoundary();
      return boundary === null ? deepCopy(state) : advanceTo(boundary.at);
    },
    getPublicInstitutionalStatus: () => {
      if (state.institutional === null) throw new Error("Integrated session lacks institutional time state.");
      const boundary = nextCompositeBoundary();
      const executiveOfficeIds = new Set([
        temporal.selection.transfer.headOfficeId,
        temporal.selection.transfer.deputyOfficeId,
      ]);
      return deepCopy({
        currentInstant: state.institutional.calendar.current,
        currentTermLabel: state.institutional.currentTermLabel,
        currentAdministrationId: state.institutional.currentAdministration.id,
        currentHeadActorId: state.institutional.currentAdministration.headActorId,
        currentDeputyActorId: state.institutional.currentAdministration.deputyActorId,
        controlBindingActive: controlBinding.status === "ACTIVE",
        nextBoundary: boundary === null ? null : { id: boundary.id, at: boundary.at, kind: boundary.kind },
        selectionStage: state.institutional.selection.stage,
        popularResults: state.institutional.selection.popularResults,
        attestations: state.institutional.selection.attestations,
        appointments: state.institutional.selection.appointments,
        certificates: state.institutional.selection.certificates,
        declaration: state.institutional.selection.declaration,
        entitlements: state.institutional.selection.entitlements,
        currentExecutiveAssignments: state.legislative.activeAssignments.filter(
          (assignment) => executiveOfficeIds.has(assignment.officeId),
        ),
      });
    },
    getPublicImplementationStatus: () => {
      if (state.implementation === null) throw new Error("Integrated session lacks implementation state.");
      const relationships = state.implementation.intergovernmental.historicalRelationships.map((relationship) => ({
        id: relationship.id,
        status: deriveEffectiveIntergovernmentalRelationship(
          state.implementation!, relationship.id, state.institutional!.calendar.current,
        )?.status ?? relationship.status,
      }));
      return deepCopy({
        detailCoverage: state.implementation.detailCoverage,
        nationalBalance: state.implementation.nationalBalance,
        historicalBudgetAuthorityCount: state.implementation.publicFinance.historicalBudgetAuthorities.length,
        generatedBudgetAuthorities: state.implementation.publicFinance.generatedBudgetAuthorities.map((authority) => ({
          id: authority.id,
          status: authority.status,
          minorUnits: authority.amount.minorUnits,
        })),
        pendingWaiverRequestIds: state.implementation.administrativeProgram.waiverRequests
          .filter((request) => request.reviewState !== "DETERMINED").map((request) => request.id),
        publicDeterminationIds: state.implementation.administrativeProgram.determinations.map((entry) => entry.id),
        relationshipStatuses: relationships,
        materialInputKinds: state.implementation.materialInputs.map((entry) => entry.kind),
        physicalHousingStatePresent: false as const,
      });
    },
    admitEnactedLawFiscalAuthority: (legalSourceId) => {
      requireAdministrationAuthority();
      if (state.implementation === null || state.institutional === null) throw new Error("Integrated implementation state unavailable.");
      const law = state.legislative.enactedLegalSources.find((entry) => entry.id === legalSourceId);
      if (law === undefined) throw new Error("Budget authority admission requires an actually enacted legal source.");
      state = { ...state, implementation: admitEnactedFiscalAuthority(
        state.implementation, law, implementationConfiguration, state.institutional.calendar.current,
      ) };
      return deepCopy(state);
    },
    requestApportionment: (budgetAuthorityId) => {
      requireAdministrationAuthority();
      if (state.implementation === null || state.institutional === null) throw new Error("Integrated implementation state unavailable.");
      state = { ...state, implementation: submitFiscalControlIntention(
        state.implementation,
        budgetAuthorityId,
        {
          administrationId: state.institutional.currentAdministration.id,
          actorId: state.institutional.currentAdministration.headActorId,
        },
        implementationConfiguration,
        state.institutional.calendar.current,
      ) };
      return deepCopy(state);
    },
    requestBoundedAward: (request) => {
      requireAdministrationAuthority();
      if (state.implementation === null || state.institutional === null) throw new Error("Integrated implementation state unavailable.");
      state = { ...state, implementation: submitBoundedAwardIntention(
        state.implementation, request,
        { administrationId: state.institutional.currentAdministration.id, actorId: state.institutional.currentAdministration.headActorId },
        implementationConfiguration, state.institutional.calendar.current,
      ) };
      return deepCopy(state);
    },
    requestRecipientCommitment: (request) => {
      requireAdministrationAuthority();
      if (state.implementation === null || state.institutional === null) throw new Error("Integrated implementation state unavailable.");
      state = { ...state, implementation: submitRecipientCommitmentIntention(
        state.implementation, request,
        { administrationId: state.institutional.currentAdministration.id, actorId: state.institutional.currentAdministration.headActorId },
        implementationConfiguration, state.institutional.calendar.current,
      ) };
      return deepCopy(state);
    },
    requestRecipientActivitySetup: (commitmentId) => {
      requireAdministrationAuthority();
      if (state.implementation === null || state.institutional === null) throw new Error("Integrated implementation state unavailable.");
      state = { ...state, implementation: submitRecipientActivityIntention(
        state.implementation, commitmentId,
        { administrationId: state.institutional.currentAdministration.id, actorId: state.institutional.currentAdministration.headActorId },
        implementationConfiguration, state.institutional.calendar.current,
      ) };
      return deepCopy(state);
    },
    requestRecipientDraw: (activityId, amountMinorUnits) => {
      requireAdministrationAuthority();
      if (state.implementation === null || state.institutional === null) throw new Error("Integrated implementation state unavailable.");
      state = { ...state, implementation: submitRecipientDrawIntention(
        state.implementation, activityId, amountMinorUnits,
        { administrationId: state.institutional.currentAdministration.id, actorId: state.institutional.currentAdministration.headActorId },
        implementationConfiguration, state.institutional.calendar.current,
      ) };
      return deepCopy(state);
    },
    requestFederalPayment: (drawRequestId) => {
      requireAdministrationAuthority();
      if (state.implementation === null || state.institutional === null) throw new Error("Integrated implementation state unavailable.");
      state = { ...state, implementation: submitFederalPaymentIntention(
        state.implementation, drawRequestId,
        { administrationId: state.institutional.currentAdministration.id, actorId: state.institutional.currentAdministration.headActorId },
        implementationConfiguration, state.institutional.calendar.current,
      ) };
      return deepCopy(state);
    },
    openFutureWaiver: (request) => {
      requireAdministrationAuthority();
      if (state.implementation === null || state.institutional === null) throw new Error("Integrated implementation state unavailable.");
      state = { ...state, implementation: openFutureWaiverRequest(
        state.implementation, request, implementationConfiguration, state.institutional.calendar.current,
      ) };
      return deepCopy(state);
    },
    directFutureWaiver: (requestId, intention) => {
      requireAdministrationAuthority();
      if (state.implementation === null || state.institutional === null) throw new Error("Integrated implementation state unavailable.");
      state = { ...state, implementation: directWaiverIntention(
        state.implementation, requestId, intention, implementationConfiguration, state.institutional.calendar.current,
      ) };
      synchronizeHousingInputs();
      return deepCopy(state);
    },
    supplyFutureWaiverRecords: (requestId, recordTypes) => {
      requireAdministrationAuthority();
      if (state.implementation === null) throw new Error("Integrated implementation state unavailable.");
      state = { ...state, implementation: supplySupplementalWaiverRecords(
        state.implementation, requestId, recordTypes,
      ) };
      return deepCopy(state);
    },
    getHousingAuditState: () => {
      if (state.housing === null) throw new Error("Integrated session lacks Material Housing state.");
      synchronizeHousingInputs();
      return deepCopy(state.housing);
    },
    getInformationAuditState: () => {
      if (state.information === null) throw new Error("Integrated session lacks Information state.");
      return deepCopy(state.information);
    },
    getPublicInformationStatus: () => {
      if (state.information === null) throw new Error("Integrated session lacks Information state.");
      return deepCopy({
        releasedMeasurements: state.information.releases.map((release) => {
          const artifact = state.information!.measurementArtifacts.find((entry) => entry.id === release.artifactId);
          if (artifact === undefined) throw new Error(`Released measurement ${release.artifactId} is unavailable.`);
          return { id: artifact.id, releasedAt: release.releasedAt, classification: artifact.classification };
        }),
        releasedClaims: state.information.claims.map((claim) => ({
          id: claim.id,
          claimantId: claim.claimantId,
          subject: claim.subject,
          position: claim.position,
          releasedAt: claim.releasedAt,
          classification: claim.classification,
        })),
        completedDeliveryIds: state.information.deliveries.map((delivery) => delivery.id),
        publicExposureCount: state.information.exposures.length,
      });
    },
    issueBoundedRelationshipRejection: (procedureRecordIds = []) => {
      requireAdministrationAuthority();
      if (state.implementation === null || state.institutional === null) {
        throw new Error("Integrated implementation state unavailable.");
      }
      if (
        !Array.isArray(procedureRecordIds) ||
        procedureRecordIds.some((id) => typeof id !== "string" || id.trim().length === 0) ||
        new Set(procedureRecordIds).size !== procedureRecordIds.length ||
        procedureRecordIds.some((id) => id !== legalConfiguration.trigger.requiredProcedureRecord)
      ) {
        throw new Error("Relationship determination procedure evidence is invalid, duplicate, or unconfigured.");
      }
      const determinationInput = {
        id: legalConfiguration.trigger.determinationId,
        relationshipId: legalConfiguration.relationshipId,
        claimantId: legalConfiguration.claimantId,
        writtenReasons: ["CONFIGURED_REQUALIFICATION_STANDARD_ASSERTED"],
        procedureRecordIds: [...procedureRecordIds],
      };
      const submitted = submitRelationshipQualificationDetermination(
        state.implementation,
        determinationInput,
        {
          administrationId: state.institutional.currentAdministration.id,
          actorId: state.institutional.currentAdministration.headActorId,
        },
        implementationConfiguration,
        state.institutional.calendar.current,
      );
      const intention = submitted.ownerResolution.intentions.at(-1);
      if (
        intention?.kind !== "ISSUE_RELATIONSHIP_QUALIFICATION_DETERMINATION" ||
        intention.matterId !== legalConfiguration.trigger.determinationId
      ) throw new Error("Relationship determination owner intention was not recorded canonically.");
      const resolved = resolveImplementationOwnerIntention(
        submitted,
        intention.id,
        implementationConfiguration,
        state.institutional.calendar.current,
      );
      if (!resolved.administrativeProgram.relationshipQualificationDeterminations.some(
        (entry) => entry.id === legalConfiguration.trigger.determinationId,
      )) throw new Error("Relationship determination owner refused the bounded canonical request.");
      state = { ...state, implementation: resolved };
      return deepCopy(state);
    },
    respondToJudicialOrder: (action) => {
      requireAdministrationAuthority();
      if (state.legalContest === null || state.institutional === null) {
        throw new Error("Integrated legal-contest state unavailable.");
      }
      state = { ...state, legalContest: recordAdministrativeComplianceResponse(
        state.legalContest,
        legalConfiguration,
        state.institutional.currentAdministration.id,
        action,
        state.institutional.calendar.current,
      ) };
      return deepCopy(state);
    },
    requestJudicialStay: () => {
      requireAdministrationAuthority();
      if (state.legalContest === null || state.institutional === null) {
        throw new Error("Integrated legal-contest state unavailable.");
      }
      const stayResolutionBoundary = temporal.boundaries.find(
        (boundary) => boundary.id === legalConfiguration.appeal.stayBoundaryId,
      );
      if (stayResolutionBoundary === undefined) {
        throw new Error("Configured stay resolution boundary is unavailable.");
      }
      state = { ...state, legalContest: requestSeparateStay(
        state.legalContest,
        legalConfiguration,
        state.institutional.currentAdministration.id,
        state.institutional.calendar.current,
        stayResolutionBoundary.at,
      ) };
      return deepCopy(state);
    },
    getLegalContestAuditState: () => {
      if (state.legalContest === null) throw new Error("Integrated legal-contest state unavailable.");
      return deepCopy(state.legalContest);
    },
    getPublicLegalStatus: () => {
      if (state.legalContest === null) throw new Error("Integrated legal-contest state unavailable.");
      return deepCopy({
        filedClaims: state.legalContest.claims.map((entry) => ({
          id: entry.id, claimantId: entry.claimantId, filedAt: entry.filedAt, status: entry.status,
        })),
        proceedings: state.legalContest.proceedings.map((entry) => ({
          id: entry.id, courtInstitutionId: entry.courtInstitutionId, status: entry.status,
        })),
        publicRulings: state.legalContest.rulings.map((entry) => ({
          id: entry.id, disposition: entry.disposition, decidedAt: entry.decidedAt,
        })),
        operativeOrders: state.legalContest.orders.map((entry) => ({
          id: entry.id,
          targetInstitutionId: entry.targetInstitutionId,
          status: entry.status,
          enforceability: deriveOrderEnforceability(state.legalContest!, entry.id),
        })),
        stays: state.legalContest.stays.map((entry) => ({ id: entry.id, status: entry.status, issuedAt: entry.issuedAt })),
        appeals: state.legalContest.appeals.map((entry) => ({
          id: entry.id, status: entry.status, disposition: entry.disposition,
        })),
        compliance: state.legalContest.complianceStates.map((entry) => ({
          status: entry.status, recordedAt: entry.recordedAt,
        })),
      });
    },
    save: () => {
      synchronizeHousingInputs();
      synchronizePopulationMaterialExperience();
      return serialize(state, controlBinding, controlBindingHistory);
    },
  };
  if (!ownerAuditEnabled) return session;
  const auditSession: IntegratedPartialRuntimeAuditSession = {
    ...session,
    resolveOwnerIntention: (intentionId) => {
      if (state.implementation === null || state.institutional === null) throw new Error("Integrated implementation state unavailable.");
      state = { ...state, implementation: resolveImplementationOwnerIntention(
        state.implementation, intentionId, implementationConfiguration, state.institutional.calendar.current,
      ) };
      synchronizeHousingInputs();
      return deepCopy(state);
    },
    injectLocalMemberDecision: (relationshipId, memberId, election, causeKey) => {
      if (state.implementation === null || state.institutional === null) throw new Error("Integrated implementation state unavailable.");
      state = { ...state, implementation: submitLocalMemberDecision(
        state.implementation,
        relationshipId,
        memberId,
        election,
        causeKey,
        { administrationId: `local-owner:${relationshipId}`, actorId: memberId },
        implementationConfiguration,
        state.institutional.calendar.current,
      ) };
      return deepCopy(state);
    },
    injectLocalRelationshipStatusDecision: (relationshipId, status, causeKey) => {
      if (state.implementation === null || state.institutional === null) throw new Error("Integrated implementation state unavailable.");
      state = { ...state, implementation: submitLocalRelationshipStatusDecision(
        state.implementation,
        relationshipId,
        status,
        causeKey,
        { administrationId: `relationship-owner:${relationshipId}`, actorId: implementationConfiguration.intergovernmentalRelationshipOwnerId },
        implementationConfiguration,
        state.institutional.calendar.current,
      ) };
      return deepCopy(state);
    },
    injectGeneratedHousingProject: (input) => {
      if (state.housing === null || state.institutional === null) throw new Error("Integrated Housing audit state unavailable.");
      if (Date.parse(input.earliestTransitionAt) < Date.parse(state.institutional.calendar.current)) {
        throw new Error("Generated Housing project cannot begin before canonical audit time.");
      }
      state = { ...state, housing: admitGeneratedMaterialHousingProject(state.housing, input) };
      return deepCopy(state);
    },
    injectHousingMaterialCondition: (projectId, kind, causeRef) => {
      if (state.housing === null || state.institutional === null) throw new Error("Integrated Housing audit state unavailable.");
      state = { ...state, housing: applyMaterialHousingCondition(
        state.housing, projectId, kind, state.institutional.calendar.current, causeRef,
      ) };
      return deepCopy(state);
    },
  };
  return auditSession;
};

export const createIntegratedPartialRuntimeSession = (
  configuration: GovernmentConfiguration<LegislativeRuntimeSeed>,
  artifacts: IntegratedRuntimeArtifactBundle,
): IntegratedPartialRuntimeSession => {
  const loaded = loadGovernmentConfiguration(configuration);
  const state = createIntegratedPartialRuntimeState(loaded, artifacts);
  const binding = createInitialLegislativeControlBinding(state.legislative, {
    structure: loaded.structure,
    seed: loaded.runtimeSeed as LegislativeRuntimeSeed,
  });
  return createSession(state, binding, loaded) as IntegratedPartialRuntimeSession;
};

/** Audit/composition proof for future upstream Population state; not a player command surface. */
export const createIntegratedPartialRuntimeAuditSession = (
  configuration: GovernmentConfiguration<LegislativeRuntimeSeed>,
  artifacts: IntegratedRuntimeArtifactBundle,
  resolutions: readonly PopulationPoliticalResolution[],
  vacantOfficeIds: readonly string[] = [],
): IntegratedPartialRuntimeAuditSession => {
  const loaded = loadGovernmentConfiguration(configuration);
  let state = createIntegratedPartialRuntimeState(loaded, artifacts);
  state = { ...state, population: resolvePopulationPoliticalState(state.population, resolutions) };
  if (vacantOfficeIds.length > 0) {
    const vacant = new Set(vacantOfficeIds);
    const activeAssignments = state.legislative.activeAssignments.filter(
      (assignment) => !vacant.has(assignment.officeId),
    );
    if (activeAssignments.length + vacant.size !== state.legislative.activeAssignments.length) {
      throw new Error("Audit vacancy composition references an unknown or already vacant office.");
    }
    const political = rebuildPoliticalStateForAssignments(
      state.legislative.political,
      loaded.structure,
      loaded.runtimeSeed as LegislativeRuntimeSeed,
      activeAssignments,
      currentEvaluatedProposal(state.legislative),
    );
    state = { ...state, legislative: { ...state.legislative, activeAssignments, political } };
  }
  const binding = createInitialLegislativeControlBinding(state.legislative, {
    structure: loaded.structure,
    seed: loaded.runtimeSeed as LegislativeRuntimeSeed,
  });
  return createSession(state, binding, loaded, [], true) as IntegratedPartialRuntimeAuditSession;
};

export const createIntegratedPartialRuntimeSessionFromSave = (
  serialized: string,
  configuration: GovernmentConfiguration<LegislativeRuntimeSeed>,
  artifacts: IntegratedRuntimeArtifactBundle,
): IntegratedPartialRuntimeSession => {
  const loaded = loadGovernmentConfiguration(configuration);
  const restored = parse(serialized, configuration, artifacts);
  return createSession(
    restored.state, restored.controlBinding, loaded, restored.controlBindingHistory,
  ) as IntegratedPartialRuntimeSession;
};

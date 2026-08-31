import { sha256Hex } from "../configuration/sha256";
import type { IntegratedHousingConfiguration, IntegratedImplementationConfiguration } from "../configuration/types";
import {
  admitValidatedMaterialInputs,
  advanceIntegratedMaterialHousing,
  assertIntegratedMaterialHousingState,
  createIntegratedMaterialHousingState,
  type AcceptedMaterialInputReference,
  type IntegratedMaterialHousingState,
  type MaterialHousingInitializationSeed,
  type MaterialHousingProject,
} from "./housing";
import {
  advanceAdministrativeDeadlines,
  assertProgramImplementationState,
  createProgramImplementationState,
  directWaiverIntention,
  openFutureWaiverRequest,
  supplySupplementalWaiverRecords,
  type ProgramImplementationState,
  type ProgramInitializationSeed,
  type WaiverIntention,
  type WaiverRequestRecord,
} from "./program-implementation";
import type {
  DepartmentHandlingSubmissionRecord,
  DepartmentSupplementalRecordArtifact,
  DepartmentSupplierSearchEvidenceArtifact,
  HousingMonitoringClaim,
  HousingMonitoringEvidenceArtifact,
  OfficeArtifactProductionRecord,
  PresidentialAdministrationOwnerStates,
  PresidentialInformationArtifact,
} from "./presidential-office-information";
import type {
  HistoricalRecordIndexEntry,
  PresidentialInterventionOwnerStates,
} from "./presidential-operating-intervention-types";

export const PRESIDENTIAL_OPERATING_HOUSING_SCHEMA_VERSION = 1 as const;

export interface InheritedInstitutionIdentityBinding {
  readonly id: string;
  readonly presidentialInstitutionId: string;
  readonly lowerInstitutionId: string;
  readonly relation: "SAME_INSTITUTION_DIFFERENT_SCHEMA_NAMESPACE";
  readonly effectiveFrom: string;
  readonly effectiveUntil: string | null;
  readonly lowerConfigurationReference: string;
  readonly provenanceReference: string;
}

export interface LowerOwnerObservationScope {
  readonly sourceStateField: "programImplementation" | "materialHousing";
  readonly sourceOwnerIds: readonly string[];
  readonly projectIds: readonly string[];
  readonly recordKinds: readonly string[];
  readonly claimFamilies: readonly {
    readonly id: string;
    readonly fieldPaths: readonly string[];
  }[];
}

export interface LowerOwnerObservationAuthority {
  readonly id: string;
  readonly observingInstitutionId: string;
  readonly institutionIdentityBindingId: string;
  readonly effectiveFrom: string;
  readonly effectiveUntil: string | null;
  readonly sourceConfigurationHashes: readonly string[];
  readonly scopes: readonly LowerOwnerObservationScope[];
  readonly authorityReference: string;
  readonly provenanceReference: string;
}

export interface DepartmentLeadershipHandlingAuthority {
  readonly id: string;
  readonly officeId: string;
  readonly lowerInstitutionId: string;
  readonly targetProjectId: string;
  readonly targetRequestId: string;
  readonly targetRelationshipId: string;
  readonly targetScopeKey: string;
  readonly permittedRecordTypeIds: readonly ["NONAVAILABILITY_RECORD"];
  readonly effectiveFrom: string;
  readonly effectiveUntil: string | null;
  readonly provenanceReference: string;
}

export interface PresidentialOperatingHousingConfiguration {
  readonly schemaVersion: typeof PRESIDENTIAL_OPERATING_HOUSING_SCHEMA_VERSION;
  readonly adapterId: string;
  readonly ownerContent: {
    readonly implementationConfiguration: IntegratedImplementationConfiguration;
    readonly implementationSeed: ProgramInitializationSeed;
    readonly materialHousingConfiguration: IntegratedHousingConfiguration;
    readonly materialHousingSeed: MaterialHousingInitializationSeed;
  };
  readonly programImplementation: {
    readonly initializationArtifactId: string;
    readonly parameterHash: string;
    readonly semanticsVersion: string;
  };
  readonly materialHousing: {
    readonly ownerId: string;
    readonly initializationArtifactId: string;
    readonly parameterHash: string;
    readonly semanticsVersion: string;
  };
  readonly history: {
    readonly historyId: string;
    readonly informationRoutesOwnerId: string;
    readonly officeOperationsOwnerId: string;
    readonly implementationOwnerId: string;
    readonly materialHousingOwnerId: string;
  };
  readonly institutionBinding: InheritedInstitutionIdentityBinding;
  readonly observationAuthority: LowerOwnerObservationAuthority;
  readonly monitoringArtifact: {
    readonly id: string;
    readonly version: string;
    readonly accessClass: string;
    readonly sectionIds: readonly string[];
    readonly expectedCanonicalHash: string;
  };
  readonly rawSupplierEvidenceArtifact: DepartmentSupplierSearchEvidenceArtifact;
  readonly supplementalRecordArtifact: {
    readonly id: string;
    readonly version: string;
    readonly accessClass: string;
    readonly sectionIds: readonly ["nonavailability-certification", "source-evidence-lineage", "limitations"];
  };
  readonly handlingAuthority: DepartmentLeadershipHandlingAuthority;
  readonly openingInformation: {
    readonly monitoringObservationId: string;
    readonly monitoringPossessionId: string;
    readonly monitoringIndexId: string;
    readonly monitoringSecretaryNoticeId: string;
    readonly monitoringChiefOfStaffNoticeId: string;
    readonly rawSupplierPossessionId: string;
    readonly rawSupplierIndexId: string;
  };
  readonly opening: {
    readonly sourceInstant: string;
    readonly holdInstant: string;
    readonly stablesRequestReceivedAt: string;
    readonly stablesRequestReturnedAt: string;
    readonly palmsReleaseAt: string;
    readonly stablesReviewReadyAt: string;
    readonly rawEvidencePossessedAt: string;
    readonly monitoringObservedAt: string;
    readonly informationRoutedAt: string;
    readonly epoch: string;
    readonly stablesProjectId: string;
    readonly palmsProjectId: string;
    readonly stablesRelationshipId: string;
    readonly palmsRelationshipId: string;
    readonly stablesComponent: string;
    readonly palmsComponent: string;
    readonly stablesSuccessorCauseKey: string;
  };
  readonly provenanceReference: string;
}

export interface PresidentialHousingOwnerStates {
  readonly programImplementation: ProgramImplementationState;
  readonly materialHousing: IntegratedMaterialHousingState;
}

export type PresidentialHousingOperationState =
  & PresidentialAdministrationOwnerStates
  & PresidentialHousingOwnerStates
  & Pick<PresidentialInterventionOwnerStates, "historicalRecordIndex">;

export interface OpeningHousingComposition extends PresidentialHousingOwnerStates {
  readonly monitoringArtifact: HousingMonitoringEvidenceArtifact;
}

const copyPlain = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const validatedConfigurations = new WeakSet<object>();
const expectedMonitoringArtifacts = new WeakMap<object, HousingMonitoringEvidenceArtifact>();
const hash = (value: unknown): string => sha256Hex(JSON.stringify(value));
const instant = (value: string, field: string): number => {
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) throw new Error(`${field} must be a valid instant.`);
  return parsed;
};

const artifactHash = (artifact: Omit<HousingMonitoringEvidenceArtifact, "canonicalArtifactHash">): string =>
  hash(artifact);

export const computeDepartmentSupplementalArtifactHash = (
  artifact: Omit<DepartmentSupplementalRecordArtifact, "canonicalArtifactHash">,
): string => hash(artifact);

export const computeDepartmentEvidenceArtifactHash = (
  artifact: Omit<DepartmentSupplierSearchEvidenceArtifact, "canonicalArtifactHash">,
): string => hash(artifact);

const asInputReferences = (
  state: ProgramImplementationState,
): readonly AcceptedMaterialInputReference[] => state.materialInputs.map((entry) => ({ ...entry }));

const requestInput = (
  relationshipId: string,
  projectRef: string,
  inputComponent: string,
  causeKey: string,
  supportingRecords: readonly string[],
) => ({
  relationshipId,
  projectRef,
  inputComponent,
  domesticPreferenceRequirement: "DOMESTIC_PREFERENCE_APPLIES",
  assertedBasis: "NONAVAILABILITY_ASSERTED",
  supportingRecords,
  commentFrom: null,
  commentUntil: null,
  causeKey,
});

const findRequest = (
  state: ProgramImplementationState,
  causeKey: string,
): WaiverRequestRecord => {
  const expectedSuffix = sha256Hex(causeKey).slice(0, 20);
  const request = state.administrativeProgram.waiverRequests.find((entry) => entry.id.endsWith(expectedSuffix));
  if (request === undefined) throw new Error(`Opening Housing request ${causeKey} was not created.`);
  return request;
};

const createOpeningLowerOwners = (
  configuration: PresidentialOperatingHousingConfiguration,
): PresidentialHousingOwnerStates => {
  const implementationConfiguration = configuration.ownerContent.implementationConfiguration;
  const allRecords = implementationConfiguration.futureWaiver.requiredSupportingRecordTypes;
  const withoutNonavailability = allRecords.filter((entry) => entry !== "NONAVAILABILITY_RECORD");
  let programImplementation = createProgramImplementationState(
    implementationConfiguration.initializationArtifactId,
    configuration.ownerContent.implementationSeed,
  );
  let materialHousing = createIntegratedMaterialHousingState(
    configuration.ownerContent.materialHousingSeed,
    configuration.ownerContent.materialHousingConfiguration,
  );

  for (const route of [
    {
      relationshipId: configuration.opening.stablesRelationshipId,
      projectId: configuration.opening.stablesProjectId,
      component: configuration.opening.stablesComponent,
      causeKey: "pop0-i4-opening-stables-hold",
    },
    {
      relationshipId: configuration.opening.palmsRelationshipId,
      projectId: configuration.opening.palmsProjectId,
      component: configuration.opening.palmsComponent,
      causeKey: "pop0-i4-opening-palms-hold",
    },
  ] as const) {
    programImplementation = openFutureWaiverRequest(
      programImplementation,
      requestInput(route.relationshipId, route.projectId, route.component, route.causeKey, allRecords),
      implementationConfiguration,
      configuration.opening.holdInstant,
    );
    programImplementation = directWaiverIntention(
      programImplementation,
      findRequest(programImplementation, route.causeKey).id,
      "DENY",
      implementationConfiguration,
      configuration.opening.holdInstant,
    );
  }
  materialHousing = advanceIntegratedMaterialHousing(
    materialHousing,
    configuration.opening.sourceInstant,
    configuration.opening.holdInstant,
  );
  materialHousing = admitValidatedMaterialInputs(materialHousing, asInputReferences(programImplementation));

  programImplementation = openFutureWaiverRequest(
    programImplementation,
    requestInput(
      configuration.opening.stablesRelationshipId,
      configuration.opening.stablesProjectId,
      configuration.opening.stablesComponent,
      configuration.opening.stablesSuccessorCauseKey,
      withoutNonavailability,
    ),
    implementationConfiguration,
    configuration.opening.stablesRequestReceivedAt,
  );
  programImplementation = directWaiverIntention(
    programImplementation,
    findRequest(programImplementation, configuration.opening.stablesSuccessorCauseKey).id,
    "RETURN_FOR_SUPPLEMENTAL_RECORD",
    implementationConfiguration,
    configuration.opening.stablesRequestReturnedAt,
  );

  const palmsReleaseCause = "pop0-i4-opening-palms-release";
  programImplementation = openFutureWaiverRequest(
    programImplementation,
    requestInput(
      configuration.opening.palmsRelationshipId,
      configuration.opening.palmsProjectId,
      configuration.opening.palmsComponent,
      palmsReleaseCause,
      allRecords,
    ),
    implementationConfiguration,
    configuration.opening.palmsReleaseAt,
  );
  materialHousing = advanceIntegratedMaterialHousing(
    materialHousing,
    configuration.opening.holdInstant,
    configuration.opening.palmsReleaseAt,
  );
  programImplementation = directWaiverIntention(
    programImplementation,
    findRequest(programImplementation, palmsReleaseCause).id,
    "GRANT_SCOPED_WAIVER",
    implementationConfiguration,
    configuration.opening.palmsReleaseAt,
  );
  materialHousing = admitValidatedMaterialInputs(materialHousing, asInputReferences(programImplementation));
  programImplementation = advanceAdministrativeDeadlines(
    programImplementation,
    configuration.opening.stablesReviewReadyAt,
  );
  materialHousing = advanceIntegratedMaterialHousing(
    materialHousing,
    configuration.opening.palmsReleaseAt,
    configuration.opening.epoch,
  );

  assertProgramImplementationState(
    programImplementation,
    implementationConfiguration,
    configuration.ownerContent.implementationSeed,
  );
  assertIntegratedMaterialHousingState(materialHousing);
  return { programImplementation, materialHousing };
};

const project = (state: IntegratedMaterialHousingState, id: string): MaterialHousingProject => {
  const value = state.projects.find((entry) => entry.id === id);
  if (value === undefined) throw new Error(`Opening Housing project ${id} is missing.`);
  return value;
};

const createClaim = (
  configuration: PresidentialOperatingHousingConfiguration,
  input: Omit<HousingMonitoringClaim,
    "observedAt" | "observationAuthorityId" | "authorityScopeKey" | "provenanceReference">,
): HousingMonitoringClaim => ({
  ...input,
  observedAt: configuration.opening.monitoringObservedAt,
  observationAuthorityId: configuration.observationAuthority.id,
  authorityScopeKey: `${input.sourceStateField}|${input.sourceOwnerId}|${input.projectId}|${input.claimFamily}|${input.observedFieldPath}`,
  provenanceReference: configuration.provenanceReference,
});

const createMonitoringArtifact = (
  configuration: PresidentialOperatingHousingConfiguration,
  owners: PresidentialHousingOwnerStates,
): HousingMonitoringEvidenceArtifact => {
  const request = findRequest(
    owners.programImplementation,
    configuration.opening.stablesSuccessorCauseKey,
  );
  const boundary = owners.programImplementation.administrativeProgram.dynamicBoundaries.find(
    (entry) => entry.ownerId === request.id,
  );
  const hold = [...owners.programImplementation.materialInputs].reverse().find(
    (entry) => entry.projectRef === configuration.opening.stablesProjectId && entry.kind === "COMPLIANCE_HOLD",
  );
  if (boundary === undefined || hold === undefined) throw new Error("Opening Stables evidence lineage is incomplete.");
  const stables = project(owners.materialHousing, configuration.opening.stablesProjectId);
  const palms = project(owners.materialHousing, configuration.opening.palmsProjectId);
  const claims: HousingMonitoringClaim[] = [
    createClaim(configuration, {
      id: "pop0.claim.housing.stables.review-state",
      sectionId: "stables-administrative-record-gap",
      sourceStateField: "programImplementation",
      sourceOwnerId: configuration.institutionBinding.lowerInstitutionId,
      sourceRecordKind: "WaiverRequestRecord",
      sourceRecordId: request.id,
      projectId: request.projectRef,
      claimFamily: "ADMINISTRATIVE_REVIEW_STATE",
      observedFieldPath: "reviewState",
      observedValue: request.reviewState,
      sourceOccurredAt: request.receivedAt,
      sourceRecordHash: hash(request),
      supportingOccurrenceIds: [boundary.id],
    }),
    createClaim(configuration, {
      id: "pop0.claim.housing.stables.missing-record",
      sectionId: "stables-administrative-record-gap",
      sourceStateField: "programImplementation",
      sourceOwnerId: configuration.institutionBinding.lowerInstitutionId,
      sourceRecordKind: "WaiverRequestRecord",
      sourceRecordId: request.id,
      projectId: request.projectRef,
      claimFamily: "ADMINISTRATIVE_REVIEW_STATE",
      observedFieldPath: "supplementalRecordRequirements",
      observedValue: [...request.supplementalRecordRequirements],
      sourceOccurredAt: request.receivedAt,
      sourceRecordHash: hash(request),
      supportingOccurrenceIds: [boundary.id],
    }),
    createClaim(configuration, {
      id: "pop0.claim.housing.stables.material-hold",
      sectionId: "stables-material-hold",
      sourceStateField: "programImplementation",
      sourceOwnerId: configuration.institutionBinding.lowerInstitutionId,
      sourceRecordKind: "MaterialInputRecord",
      sourceRecordId: hold.id,
      projectId: hold.projectRef,
      claimFamily: "IMPLEMENTATION_MATERIAL_HOLD",
      observedFieldPath: "kind",
      observedValue: hold.kind,
      sourceOccurredAt: hold.validatedAt,
      sourceRecordHash: hash(hold),
      supportingOccurrenceIds: [hold.sourceRecordId],
    }),
    createClaim(configuration, {
      id: "pop0.claim.housing.stables.project-stage",
      sectionId: "stables-material-hold",
      sourceStateField: "materialHousing",
      sourceOwnerId: configuration.materialHousing.ownerId,
      sourceRecordKind: "MaterialHousingProject",
      sourceRecordId: stables.id,
      projectId: stables.id,
      claimFamily: "PROJECT_MATERIAL_STATUS",
      observedFieldPath: "stage",
      observedValue: stables.stage,
      sourceOccurredAt: configuration.opening.epoch,
      sourceRecordHash: hash(stables),
      supportingOccurrenceIds: [...stables.acceptedGovernmentInputRefs],
    }),
    createClaim(configuration, {
      id: "pop0.claim.housing.palms.project-stage",
      sectionId: "methods-and-vintage",
      sourceStateField: "materialHousing",
      sourceOwnerId: configuration.materialHousing.ownerId,
      sourceRecordKind: "MaterialHousingProject",
      sourceRecordId: palms.id,
      projectId: palms.id,
      claimFamily: "PROJECT_MATERIAL_STATUS",
      observedFieldPath: "stage",
      observedValue: palms.stage,
      sourceOccurredAt: configuration.opening.epoch,
      sourceRecordHash: hash(palms),
      supportingOccurrenceIds: [...palms.acceptedGovernmentInputRefs],
    }),
  ];
  const artifactWithoutHash: Omit<HousingMonitoringEvidenceArtifact, "canonicalArtifactHash"> = {
    kind: "HOUSING_MONITORING_EVIDENCE",
    id: configuration.monitoringArtifact.id,
    version: configuration.monitoringArtifact.version,
    producerInstitutionId: configuration.observationAuthority.observingInstitutionId,
    observationAuthorityId: configuration.observationAuthority.id,
    institutionIdentityBindingId: configuration.institutionBinding.id,
    asOf: configuration.opening.monitoringObservedAt,
    createdAt: configuration.opening.monitoringObservedAt,
    releasedAt: configuration.opening.informationRoutedAt,
    sectionIds: [...configuration.monitoringArtifact.sectionIds],
    sectionClaims: [
      { sectionId: "portfolio-summary", claimIds: claims.map((entry) => entry.id) },
      { sectionId: "stables-administrative-record-gap", claimIds: claims.filter((entry) => entry.sectionId === "stables-administrative-record-gap").map((entry) => entry.id) },
      { sectionId: "stables-material-hold", claimIds: claims.filter((entry) => entry.sectionId === "stables-material-hold").map((entry) => entry.id) },
      { sectionId: "methods-and-vintage", claimIds: claims.filter((entry) => entry.sectionId === "methods-and-vintage").map((entry) => entry.id) },
    ],
    claims,
    accessClass: configuration.monitoringArtifact.accessClass,
    provenanceReference: configuration.provenanceReference,
    revisionOfArtifactId: null,
    supersedesArtifactId: null,
  };
  return { ...artifactWithoutHash, canonicalArtifactHash: artifactHash(artifactWithoutHash) };
};

export const computeOpeningMonitoringArtifactHash = (
  configuration: Omit<PresidentialOperatingHousingConfiguration, "monitoringArtifact"> & {
    readonly monitoringArtifact: Omit<PresidentialOperatingHousingConfiguration["monitoringArtifact"], "expectedCanonicalHash">;
  },
): string => {
  const provisional = {
    ...configuration,
    monitoringArtifact: { ...configuration.monitoringArtifact, expectedCanonicalHash: "PENDING" },
  } satisfies PresidentialOperatingHousingConfiguration;
  const owners = createOpeningLowerOwners(provisional);
  return createMonitoringArtifact(provisional, owners).canonicalArtifactHash;
};

export const assertPresidentialOperatingHousingConfiguration = (
  configuration: PresidentialOperatingHousingConfiguration,
  epoch: string,
): void => {
  if (validatedConfigurations.has(configuration)) return;
  const implementationConfiguration = configuration.ownerContent.implementationConfiguration;
  const materialConfiguration = configuration.ownerContent.materialHousingConfiguration;
  if (configuration.schemaVersion !== PRESIDENTIAL_OPERATING_HOUSING_SCHEMA_VERSION) {
    throw new Error("Unsupported presidential Housing configuration schema.");
  }
  for (const [field, value] of Object.entries({
    adapterId: configuration.adapterId,
    monitoringObservationId: configuration.openingInformation.monitoringObservationId,
    historyId: configuration.history.historyId,
    informationRoutesOwnerId: configuration.history.informationRoutesOwnerId,
    officeOperationsOwnerId: configuration.history.officeOperationsOwnerId,
    implementationOwnerId: configuration.history.implementationOwnerId,
    materialHousingOwnerId: configuration.history.materialHousingOwnerId,
  })) {
    if (value.trim().length === 0) throw new Error(`Presidential Housing ${field} is required.`);
  }
  if (
    configuration.programImplementation.initializationArtifactId !== implementationConfiguration.initializationArtifactId ||
    configuration.programImplementation.parameterHash !== implementationConfiguration.parameterHash ||
    configuration.materialHousing.initializationArtifactId !== materialConfiguration.initializationArtifactId ||
    configuration.materialHousing.parameterHash !== materialConfiguration.parameterHash ||
    configuration.opening.epoch !== epoch ||
    configuration.institutionBinding.lowerInstitutionId !== implementationConfiguration.administeringInstitutionId ||
    configuration.observationAuthority.institutionIdentityBindingId !== configuration.institutionBinding.id ||
    configuration.observationAuthority.observingInstitutionId !== configuration.institutionBinding.presidentialInstitutionId ||
    !configuration.observationAuthority.sourceConfigurationHashes.includes(implementationConfiguration.parameterHash) ||
    !configuration.observationAuthority.sourceConfigurationHashes.includes(materialConfiguration.parameterHash)
  ) throw new Error("Presidential Housing configuration contradicts authenticated I6/I7 owner content.");
  if (
    instant(configuration.observationAuthority.effectiveFrom, "Observation authority start") >
      instant(configuration.opening.monitoringObservedAt, "Monitoring observation") ||
    (configuration.observationAuthority.effectiveUntil !== null &&
      instant(configuration.opening.monitoringObservedAt, "Monitoring observation") >=
        instant(configuration.observationAuthority.effectiveUntil, "Observation authority end"))
  ) throw new Error("Opening Housing observation lacks effective authority.");
  if (configuration.observationAuthority.scopes.length !== 2) {
    throw new Error("Presidential Housing observation authority requires exactly two owner scopes.");
  }
  const expectedObservationScopes: readonly LowerOwnerObservationScope[] = [
    {
      sourceStateField: "programImplementation",
      sourceOwnerIds: [configuration.institutionBinding.lowerInstitutionId],
      projectIds: [configuration.opening.stablesProjectId, configuration.opening.palmsProjectId],
      recordKinds: [
        "WaiverRequestRecord",
        "AdministrativeDeterminationRecord",
        "DynamicAdministrativeBoundary",
        "MaterialInputRecord",
      ],
      claimFamilies: [
        { id: "ADMINISTRATIVE_REVIEW_STATE", fieldPaths: ["reviewState", "supplementalRecordRequirements", "reviewNotBefore"] },
        { id: "ADMINISTRATIVE_DETERMINATION", fieldPaths: ["intention", "outcome", "scopeKey", "decidedAt", "physicalHousingEffect"] },
        { id: "IMPLEMENTATION_MATERIAL_HOLD", fieldPaths: ["kind", "projectRef", "scopeKey", "releaseOfInputId", "causalPredecessorInputIds", "validatedAt"] },
      ],
    },
    {
      sourceStateField: "materialHousing",
      sourceOwnerIds: [configuration.materialHousing.ownerId],
      projectIds: [configuration.opening.stablesProjectId, configuration.opening.palmsProjectId],
      recordKinds: ["MaterialHousingProject", "MaterialHousingProjectHistoryRecord"],
      claimFamilies: [
        { id: "PROJECT_MATERIAL_STATUS", fieldPaths: ["stage", "complianceHold", "inputAvailability", "physicalProgressUnits"] },
        { id: "PROJECT_MATERIAL_HISTORY", fieldPaths: ["fromStage", "toStage", "occurredAt", "causeInputIds"] },
      ],
    },
  ];
  if (JSON.stringify(configuration.observationAuthority.scopes) !== JSON.stringify(expectedObservationScopes)) {
    throw new Error("Presidential Housing observation authority exceeds its exact claim-scoped owner boundary.");
  }
  if (configuration.handlingAuthority.permittedRecordTypeIds.join("|") !== "NONAVAILABILITY_RECORD") {
    throw new Error("Department handling authority permits an unsupported supplemental record type.");
  }
  if (
    configuration.handlingAuthority.targetRequestId !== configuration.rawSupplierEvidenceArtifact.targetRequestId ||
    configuration.handlingAuthority.targetProjectId !== configuration.rawSupplierEvidenceArtifact.targetProjectId ||
    configuration.handlingAuthority.targetScopeKey !== configuration.rawSupplierEvidenceArtifact.targetScopeKey ||
    configuration.supplementalRecordArtifact.sectionIds.join("|") !==
      "nonavailability-certification|source-evidence-lineage|limitations"
  ) throw new Error("Department handling authority and evidence targets are not exact.");
  const raw = configuration.rawSupplierEvidenceArtifact;
  const { canonicalArtifactHash, ...rawWithoutHash } = raw;
  if (canonicalArtifactHash !== computeDepartmentEvidenceArtifactHash(rawWithoutHash)) {
    throw new Error("Configured raw supplier evidence hash is invalid.");
  }
  const expectedHash = computeOpeningMonitoringArtifactHash({
    ...configuration,
    monitoringArtifact: {
      id: configuration.monitoringArtifact.id,
      version: configuration.monitoringArtifact.version,
      accessClass: configuration.monitoringArtifact.accessClass,
      sectionIds: configuration.monitoringArtifact.sectionIds,
    },
  });
  if (expectedHash !== configuration.monitoringArtifact.expectedCanonicalHash) {
    throw new Error("Configured opening Housing monitoring hash is invalid.");
  }
  validatedConfigurations.add(configuration);
};

export const createOpeningHousingComposition = (
  configuration: PresidentialOperatingHousingConfiguration,
): OpeningHousingComposition => {
  assertPresidentialOperatingHousingConfiguration(configuration, configuration.opening.epoch);
  const owners = createOpeningLowerOwners(configuration);
  const monitoringArtifact = createMonitoringArtifact(configuration, owners);
  if (monitoringArtifact.canonicalArtifactHash !== configuration.monitoringArtifact.expectedCanonicalHash) {
    throw new Error("Opening Housing monitoring artifact does not match authenticated configuration.");
  }
  expectedMonitoringArtifacts.set(configuration, monitoringArtifact);
  return { ...copyPlain(owners), monitoringArtifact: copyPlain(monitoringArtifact) };
};

export const copyPresidentialHousingOwnerStates = (
  state: PresidentialHousingOwnerStates,
): PresidentialHousingOwnerStates => copyPlain(state);

const assertRawNoticeActivation = (
  state: PresidentialAdministrationOwnerStates,
  configuration: PresidentialOperatingHousingConfiguration,
): void => {
  const rawIndexId = configuration.openingInformation.rawSupplierIndexId;
  const notices = state.informationRoutes.state.metadataNotices.filter(
    (entry) => entry.indexEntryId === rawIndexId,
  );
  for (const notice of notices) {
    if (notice.recipientOfficeId !== configuration.handlingAuthority.officeId) {
      throw new Error("Raw supplier evidence notice crossed the configured Secretary-office boundary.");
    }
    const office = officeState(state, notice.recipientOfficeId);
    const qualifying = office.assignments.some((assignment) => {
      const authorization = office.instrumentAssignmentAuthorizations.find(
        (entry) => entry.assignmentId === assignment.id,
      );
      return assignment.status === "COMPLETED" &&
        assignment.expectedProductKind === "HUD_SUPPLEMENTAL_RECORD_OPTIONS" &&
        assignment.resultArtifactIds.length > 0 &&
        instant(assignment.statusUpdatedAt, `${assignment.id} completion`) <=
          instant(notice.noticedAt, `${notice.id} notice`) &&
        authorization?.scope.kind === "ANALYSIS_ASSIGNMENT_SCOPE" &&
        authorization.scope.evidenceArtifactId === configuration.monitoringArtifact.id;
    });
    if (!qualifying) {
      throw new Error("Raw supplier evidence notice lacks a completed instrument-authorized options assignment.");
    }
  }
};

const assertSupplementalArtifactsAndHandling = (
  state: PresidentialHousingOperationState,
  configuration: PresidentialOperatingHousingConfiguration,
  current: string,
): void => {
  const artifacts = state.informationRoutes.state.artifacts.filter(
    (entry): entry is DepartmentSupplementalRecordArtifact => entry.kind === "HUD_SUPPLEMENTAL_RECORD",
  );
  const productions = state.informationRoutes.state.officeArtifactProductions;
  if (artifacts.length > 1 || productions.length > 1) {
    throw new Error("POP0-I4 permits one bounded supplemental artifact and production occurrence.");
  }
  for (const artifact of artifacts) {
    const office = officeState(state, artifact.producingOfficeId);
    const disposition = office.instrumentDispositions.find((entry) => entry.id === artifact.sourceDispositionId);
    const assignment = office.assignments.find((entry) => entry.id === artifact.sourceAssignmentId);
    const result = findInformationArtifact(state, artifact.sourceAssignmentResultArtifactId);
    const receipt = state.informationRoutes.state.receipts.find(
      (entry) => entry.id === artifact.sourceEvidenceReceiptId,
    );
    const production = productions.find((entry) => entry.artifactId === artifact.id);
    const { canonicalArtifactHash, ...withoutHash } = artifact;
    if (
      artifact.id !== configuration.supplementalRecordArtifact.id ||
      artifact.version !== configuration.supplementalRecordArtifact.version ||
      artifact.recordTypeId !== "NONAVAILABILITY_RECORD" ||
      artifact.producingOfficeId !== configuration.handlingAuthority.officeId ||
      artifact.targetInstitutionId !== configuration.handlingAuthority.lowerInstitutionId ||
      artifact.targetRequestId !== configuration.handlingAuthority.targetRequestId ||
      artifact.targetProjectId !== configuration.handlingAuthority.targetProjectId ||
      artifact.targetRelationshipId !== configuration.handlingAuthority.targetRelationshipId ||
      artifact.targetScopeKey !== configuration.handlingAuthority.targetScopeKey ||
      artifact.sourceEvidenceArtifactId !== configuration.rawSupplierEvidenceArtifact.id ||
      JSON.stringify(artifact.sourceEvidenceSectionIds) !==
        JSON.stringify(configuration.rawSupplierEvidenceArtifact.sectionIds) ||
      JSON.stringify(artifact.sectionIds) !== JSON.stringify(configuration.supplementalRecordArtifact.sectionIds) ||
      artifact.accessClass !== configuration.supplementalRecordArtifact.accessClass ||
      canonicalArtifactHash !== computeDepartmentSupplementalArtifactHash(withoutHash) ||
      disposition === undefined || !["ACCEPTED_AS_REQUESTED", "NARROWED"].includes(disposition.kind) ||
      assignment === undefined || assignment.status !== "COMPLETED" ||
      !assignment.resultArtifactIds.includes(artifact.sourceAssignmentResultArtifactId) ||
      result === undefined || result.kind !== "ASSESSMENT" || result.assignmentId !== assignment.id ||
      receipt === undefined || receipt.recipientOfficeId !== artifact.producingOfficeId ||
      receipt.artifactId !== configuration.rawSupplierEvidenceArtifact.id ||
      configuration.rawSupplierEvidenceArtifact.sectionIds.some(
        (sectionId) => !receipt.receivedSectionIds.includes(sectionId),
      ) ||
      production === undefined ||
      production.producingOfficeId !== artifact.producingOfficeId ||
      production.producingOfficeholderAssignmentId !== artifact.authoringOfficeholderAssignmentId ||
      production.producedAt !== artifact.createdAt ||
      !effectiveOfficeholder(
        state,
        artifact.authoringOfficeholderAssignmentId,
        artifact.producingOfficeId,
        artifact.createdAt,
      ) ||
      instant(receipt.receivedAt, `${receipt.id} receipt`) > instant(artifact.createdAt, `${artifact.id} creation`) ||
      instant(artifact.createdAt, `${artifact.id} creation`) > instant(current, "Current Housing time")
    ) throw new Error(`Department supplemental artifact ${artifact.id} lacks exact causal provenance.`);
  }
  for (const production of productions) {
    if (!artifacts.some((entry) => entry.id === production.artifactId)) {
      throw new Error(`Office artifact production ${production.id} is not a bounded I4 supplemental product.`);
    }
  }

  const handling = state.officeOperations.state.flatMap((office) => office.departmentHandlingSubmissions);
  if (new Set(handling.map((entry) => entry.id)).size !== handling.length ||
    new Set(handling.map((entry) => entry.deduplicationIdentity)).size !== handling.length) {
    throw new Error("Department handling occurrence identities must be unique.");
  }
  const request = state.programImplementation.administrativeProgram.waiverRequests.find(
    (entry) => entry.id === configuration.handlingAuthority.targetRequestId,
  );
  if (request === undefined || request.projectRef !== configuration.handlingAuthority.targetProjectId ||
    request.relationshipId !== configuration.handlingAuthority.targetRelationshipId ||
    `BABA_COMPONENT:${request.inputComponent}` !== configuration.handlingAuthority.targetScopeKey) {
    throw new Error("Inherited Stables request no longer matches its authenticated handling target.");
  }
  const supplementalSubmissions = handling.filter(
    (entry) => entry.payload.kind === "SUBMIT_SUPPLEMENTAL_RECORDS",
  );
  if (request.supportingRecords.includes("NONAVAILABILITY_RECORD") !== (supplementalSubmissions.length === 1)) {
    throw new Error("Lower supplemental request state lacks exactly one canonical Department submission.");
  }
  for (const record of handling) {
    if (
      record.submittingOfficeId !== configuration.handlingAuthority.officeId ||
      record.handlingAuthorityId !== configuration.handlingAuthority.id ||
      record.targetInstitutionId !== configuration.handlingAuthority.lowerInstitutionId ||
      record.targetRequestId !== configuration.handlingAuthority.targetRequestId ||
      record.targetProjectId !== configuration.handlingAuthority.targetProjectId ||
      record.targetRelationshipId !== configuration.handlingAuthority.targetRelationshipId ||
      record.targetScopeKey !== configuration.handlingAuthority.targetScopeKey ||
      !isEffective(
        configuration.handlingAuthority.effectiveFrom,
        configuration.handlingAuthority.effectiveUntil,
        record.submittedAt,
      ) ||
      !effectiveOfficeholder(
        state,
        record.submittingOfficeholderAssignmentId,
        record.submittingOfficeId,
        record.submittedAt,
      ) ||
      instant(record.submittedAt, `${record.id} submission`) > instant(current, "Current Housing time")
    ) throw new Error(`Department handling ${record.id} exceeds its exact authority or chronology.`);
    assertHandlingSource(state, configuration, record.submittedAt, {
      officeId: record.submittingOfficeId,
      officeholderAssignmentId: record.submittingOfficeholderAssignmentId,
      dispositionId: record.sourceDispositionId,
      assignmentId: record.sourceAssignmentId,
      assignmentResultArtifactId: record.sourceAssignmentResultArtifactId,
    });
    if (record.payload.kind === "SUBMIT_SUPPLEMENTAL_RECORDS") {
      const reference = record.payload.qualifyingEvidenceReference;
      const artifact = artifacts.find((entry) => entry.id === reference.artifactId);
      const production = productions.find((entry) => entry.id === reference.sourceArtifactProductionId);
      if (
        record.payload.recordTypeIds.join("|") !== "NONAVAILABILITY_RECORD" ||
        reference.artifactKind !== "HUD_SUPPLEMENTAL_RECORD" ||
        reference.recordTypeId !== "NONAVAILABILITY_RECORD" ||
        reference.certificationSectionId !== "nonavailability-certification" ||
        reference.sourceLineageSectionId !== "source-evidence-lineage" ||
        artifact === undefined || production?.artifactId !== artifact.id ||
        artifact.sourceEvidenceReceiptId !== reference.sourceRawEvidenceReceiptId ||
        instant(artifact.createdAt, `${artifact.id} creation`) > instant(record.submittedAt, `${record.id} submission`)
      ) throw new Error(`Supplemental handling ${record.id} lacks its exact qualifying artifact lineage.`);
    } else {
      if (record.payload.supportingHandlingSubmissionIds.length === 0 ||
        record.payload.supportingHandlingSubmissionIds.some((id) =>
          !supplementalSubmissions.some((entry) => entry.id === id &&
            instant(entry.submittedAt, `${entry.id} submission`) <= instant(record.submittedAt, `${record.id} submission`)))) {
        throw new Error(`Review-intention handling ${record.id} lacks prior supplemental handling.`);
      }
      const determination = state.programImplementation.administrativeProgram.determinations.find(
        (entry) => entry.requestId === record.targetRequestId && entry.decidedAt === record.submittedAt,
      );
      if (determination === undefined || determination.intention !== record.payload.intention ||
        determination.institutionId !== record.targetInstitutionId || determination.physicalHousingEffect !== null) {
        throw new Error(`Review-intention handling ${record.id} lacks its owner-resolved lower determination.`);
      }
    }
  }
  const laterDeterminations = state.programImplementation.administrativeProgram.determinations.filter(
    (entry) => entry.requestId === request.id &&
      instant(entry.decidedAt, `${entry.id} decision`) >= instant(configuration.opening.epoch, "I4 epoch"),
  );
  for (const determination of laterDeterminations) {
    if (!handling.some((entry) => entry.payload.kind === "SUBMIT_WAIVER_REVIEW_INTENTION" &&
      entry.submittedAt === determination.decidedAt && entry.payload.intention === determination.intention)) {
      throw new Error(`Lower determination ${determination.id} lacks canonical Department handling.`);
    }
  }
};

const HISTORY_PHASES: Readonly<Record<string, number>> = {
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
  DOMAIN_ARTIFACT_PRODUCTION: 5,
  DOMAIN_HANDLING_SUBMISSION: 6,
  LOWER_OWNER_RESULT: 7,
  MATERIAL_OWNER_INPUT_ADMISSION: 8,
  MATERIAL_OWNER_RESULT: 9,
};

const I4_HISTORY_KINDS = new Set([
  "DOMAIN_ARTIFACT_PRODUCTION",
  "DOMAIN_HANDLING_SUBMISSION",
  "LOWER_OWNER_RESULT",
  "MATERIAL_OWNER_INPUT_ADMISSION",
  "MATERIAL_OWNER_RESULT",
]);

const isI4HistoryKind = (kind: string): boolean => I4_HISTORY_KINDS.has(kind);

const compareI4History = (
  left: HistoricalRecordIndexEntry,
  right: HistoricalRecordIndexEntry,
): number => instant(left.occurredAt, `${left.occurrenceId} history time`) -
  instant(right.occurredAt, `${right.occurrenceId} history time`) ||
  ((HISTORY_PHASES[left.recordKind] ?? 99) - (HISTORY_PHASES[right.recordKind] ?? 99)) ||
  left.ownerId.localeCompare(right.ownerId) ||
  left.ownerRecordId.localeCompare(right.ownerRecordId) ||
  left.occurrenceId.localeCompare(right.occurrenceId);

const i4HistoryEntry = (
  configuration: PresidentialOperatingHousingConfiguration,
  occurrenceId: string,
  ownerId: string,
  recordKind: keyof typeof HISTORY_PHASES,
  occurredAt: string,
  ownerRecordId: string,
  causalParentOccurrenceIds: readonly string[],
): HistoricalRecordIndexEntry => ({
  historyId: configuration.history.historyId,
  occurrenceId,
  ownerId,
  recordKind,
  occurredAt,
  ownerRecordId,
  causalParentOccurrenceIds: [...causalParentOccurrenceIds],
});

const routeDeterminations = (
  state: PresidentialHousingOperationState,
  configuration: PresidentialOperatingHousingConfiguration,
) => state.programImplementation.administrativeProgram.determinations.filter((entry) =>
  entry.requestId === configuration.handlingAuthority.targetRequestId &&
  instant(entry.decidedAt, `${entry.id} decision`) >= instant(configuration.opening.epoch, "I4 epoch"));

const routeMaterialInputs = (
  state: PresidentialHousingOperationState,
  configuration: PresidentialOperatingHousingConfiguration,
) => {
  const determinationIds = new Set(routeDeterminations(state, configuration).map((entry) => entry.id));
  return state.programImplementation.materialInputs.filter((entry) =>
    determinationIds.has(entry.sourceRecordId) &&
    entry.projectRef === configuration.handlingAuthority.targetProjectId);
};

const expectedI4HistoryEntries = (
  state: PresidentialHousingOperationState,
  configuration: PresidentialOperatingHousingConfiguration,
): readonly HistoricalRecordIndexEntry[] => {
  const entries: HistoricalRecordIndexEntry[] = [];
  const allHandling = state.officeOperations.state.flatMap((office) => office.departmentHandlingSubmissions);
  const supplementals = allHandling.filter((entry) => entry.payload.kind === "SUBMIT_SUPPLEMENTAL_RECORDS");
  const reviews = allHandling.filter((entry) => entry.payload.kind === "SUBMIT_WAIVER_REVIEW_INTENTION");

  for (const observation of state.informationRoutes.state.institutionArtifactObservations) {
    const artifact = findInformationArtifact(state, observation.artifactId);
    if (artifact?.kind !== "HOUSING_MONITORING_EVIDENCE") continue;
    entries.push(i4HistoryEntry(
      configuration,
      observation.id,
      configuration.history.informationRoutesOwnerId,
      "DOMAIN_ARTIFACT_PRODUCTION",
      observation.observedAt,
      observation.id,
      [...new Set(artifact.claims.flatMap((claim) => claim.supportingOccurrenceIds))].sort(),
    ));
  }

  for (const production of state.informationRoutes.state.officeArtifactProductions) {
    const artifact = findInformationArtifact(state, production.artifactId);
    if (artifact?.kind !== "HUD_SUPPLEMENTAL_RECORD") continue;
    entries.push(i4HistoryEntry(
      configuration,
      production.id,
      configuration.history.informationRoutesOwnerId,
      "DOMAIN_ARTIFACT_PRODUCTION",
      production.producedAt,
      production.id,
      [
        artifact.sourceDispositionId,
        artifact.sourceAssignmentId,
        artifact.sourceAssignmentResultArtifactId,
        artifact.sourceEvidenceReceiptId,
      ],
    ));
  }

  for (const handling of allHandling) {
    const sourceParents = [
      handling.sourceDispositionId,
      handling.sourceAssignmentId,
      handling.sourceAssignmentResultArtifactId,
    ];
    const payloadParents = handling.payload.kind === "SUBMIT_SUPPLEMENTAL_RECORDS"
      ? [
          handling.payload.qualifyingEvidenceReference.sourceArtifactProductionId,
          handling.payload.qualifyingEvidenceReference.sourceRawEvidenceReceiptId,
        ]
      : handling.payload.supportingHandlingSubmissionIds;
    entries.push(i4HistoryEntry(
      configuration,
      handling.id,
      configuration.history.officeOperationsOwnerId,
      "DOMAIN_HANDLING_SUBMISSION",
      handling.submittedAt,
      handling.id,
      [...sourceParents, ...payloadParents],
    ));
  }

  for (const handling of supplementals) {
    entries.push(i4HistoryEntry(
      configuration,
      `${handling.id}.lower-owner-result`,
      configuration.history.implementationOwnerId,
      "LOWER_OWNER_RESULT",
      handling.submittedAt,
      handling.targetRequestId,
      [handling.id],
    ));
  }

  for (const determination of routeDeterminations(state, configuration)) {
    const handling = reviews.find((entry) =>
      entry.targetRequestId === determination.requestId &&
      entry.submittedAt === determination.decidedAt &&
      entry.payload.kind === "SUBMIT_WAIVER_REVIEW_INTENTION" &&
      entry.payload.intention === determination.intention);
    if (handling === undefined) continue;
    entries.push(i4HistoryEntry(
      configuration,
      determination.id,
      configuration.history.implementationOwnerId,
      "LOWER_OWNER_RESULT",
      determination.decidedAt,
      determination.id,
      [handling.id],
    ));
  }

  const materialInputs = routeMaterialInputs(state, configuration);
  for (const input of materialInputs) {
    entries.push(i4HistoryEntry(
      configuration,
      input.id,
      configuration.history.implementationOwnerId,
      "LOWER_OWNER_RESULT",
      input.validatedAt,
      input.id,
      [input.sourceRecordId],
    ));
    if (state.materialHousing.acceptedInputs.some((entry) => entry.id === input.id)) {
      entries.push(i4HistoryEntry(
        configuration,
        `${input.id}.material-admission`,
        configuration.history.materialHousingOwnerId,
        "MATERIAL_OWNER_INPUT_ADMISSION",
        input.validatedAt,
        input.id,
        [input.id],
      ));
    }
  }

  const inputIds = new Set(materialInputs.map((entry) => entry.id));
  for (const record of state.materialHousing.projects.flatMap((entry) => entry.history)) {
    if (!record.causeInputIds.some((id) => inputIds.has(id))) continue;
    entries.push(i4HistoryEntry(
      configuration,
      record.id,
      configuration.history.materialHousingOwnerId,
      "MATERIAL_OWNER_RESULT",
      record.occurredAt,
      record.id,
      record.causeInputIds.filter((id) => inputIds.has(id)),
    ));
  }
  return entries.sort(compareI4History);
};

const knownI4ParentTime = (
  state: PresidentialHousingOperationState,
  occurrenceId: string,
): string | null => {
  const artifact = findInformationArtifact(state, occurrenceId);
  if (artifact !== undefined) return artifact.createdAt;
  const records: readonly (readonly [string, string])[] = [
    ...state.informationRoutes.state.institutionArtifactObservations.map(
      (entry) => [entry.id, entry.observedAt] as const,
    ),
    ...state.informationRoutes.state.officeArtifactProductions.map((entry) => [entry.id, entry.producedAt] as const),
    ...state.informationRoutes.state.receipts.map((entry) => [entry.id, entry.receivedAt] as const),
    ...state.officeOperations.state.flatMap((office) => [
      ...office.instrumentDispositions.map((entry) => [entry.id, entry.dispositionAt] as const),
      ...office.assignments.map((entry) => [entry.id, entry.createdAt] as const),
      ...office.departmentHandlingSubmissions.map((entry) => [entry.id, entry.submittedAt] as const),
    ]),
    ...state.programImplementation.administrativeProgram.determinations.map(
      (entry) => [entry.id, entry.decidedAt] as const,
    ),
    ...state.programImplementation.administrativeProgram.dynamicBoundaries.map(
      (entry) => [entry.id, entry.at] as const,
    ),
    ...state.programImplementation.materialInputs.map((entry) => [entry.id, entry.validatedAt] as const),
    ...state.materialHousing.projects.flatMap((entry) =>
      entry.history.map((record) => [record.id, record.occurredAt] as const)),
    ...state.historicalRecordIndex.state.entries.map((entry) => [entry.occurrenceId, entry.occurredAt] as const),
  ];
  return records.find(([id]) => id === occurrenceId)?.[1] ?? null;
};

const assertI4HistoricalReferences = (
  state: PresidentialHousingOperationState,
  configuration: PresidentialOperatingHousingConfiguration,
  current: string,
): void => {
  const actual = state.historicalRecordIndex.state.entries.filter((entry) => isI4HistoryKind(entry.recordKind));
  const expected = expectedI4HistoryEntries(state, configuration);
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error("I4 historical references are missing, duplicated, dangling, or substantively inconsistent.");
  }
  for (const entry of actual) {
    if (
      entry.historyId !== configuration.history.historyId ||
      instant(entry.occurredAt, `${entry.occurrenceId} occurrence`) > instant(current, "Current Housing time")
    ) throw new Error(`I4 historical entry ${entry.occurrenceId} has invalid identity or chronology.`);
    for (const parentId of entry.causalParentOccurrenceIds) {
      const parentTime = knownI4ParentTime(state, parentId);
      if (parentTime === null ||
        instant(parentTime, `${parentId} parent`) > instant(entry.occurredAt, `${entry.occurrenceId} occurrence`)) {
        throw new Error(`I4 historical entry ${entry.occurrenceId} has an impossible causal parent.`);
      }
      if (instant(parentTime, `${parentId} parent`) === instant(entry.occurredAt, `${entry.occurrenceId} occurrence`)) {
        const parent = state.historicalRecordIndex.state.entries.find((candidate) => candidate.occurrenceId === parentId);
        if (parent !== undefined &&
          (HISTORY_PHASES[parent.recordKind] ?? 0) > (HISTORY_PHASES[entry.recordKind] ?? 99)) {
          throw new Error(`I4 historical entry ${entry.occurrenceId} violates same-instant owner phases.`);
        }
      }
    }
  }
};

export const appendDerivedPresidentialHousingHistory = (
  state: PresidentialHousingOperationState,
  configuration: PresidentialOperatingHousingConfiguration,
): PresidentialHousingOperationState => {
  const expected = expectedI4HistoryEntries(state, configuration);
  const existing = state.historicalRecordIndex.state.entries;
  for (const entry of expected) {
    const prior = existing.find((candidate) => candidate.occurrenceId === entry.occurrenceId ||
      (candidate.ownerId === entry.ownerId && candidate.ownerRecordId === entry.ownerRecordId));
    if (prior !== undefined && JSON.stringify(prior) !== JSON.stringify(entry)) {
      throw new Error(`I4 historical entry ${entry.occurrenceId} conflicts with canonical owner truth.`);
    }
  }
  const additions = expected.filter((entry) =>
    !existing.some((candidate) => candidate.occurrenceId === entry.occurrenceId));
  if (additions.length === 0) return state;
  return {
    ...state,
    historicalRecordIndex: {
      ...state.historicalRecordIndex,
      state: {
        ...state.historicalRecordIndex.state,
        entries: [...existing, ...additions].sort(compareI4History),
      },
    },
  };
};

export const assertPresidentialHousingOwnerStates = (
  state: PresidentialHousingOperationState,
  administration: PresidentialAdministrationOwnerStates,
  configuration: PresidentialOperatingHousingConfiguration,
  current: string,
): void => {
  assertProgramImplementationState(
    state.programImplementation,
    configuration.ownerContent.implementationConfiguration,
    configuration.ownerContent.implementationSeed,
  );
  assertIntegratedMaterialHousingState(state.materialHousing);
  if (instant(current, "Housing current time") < instant(configuration.opening.epoch, "Housing epoch")) {
    throw new Error("Presidential Housing state predates its configured epoch.");
  }
  const implementationInputs = new Map(state.programImplementation.materialInputs.map((entry) => [entry.id, entry]));
  for (const accepted of state.materialHousing.acceptedInputs) {
    const source = implementationInputs.get(accepted.id);
    if (source === undefined || JSON.stringify(source) !== JSON.stringify(accepted)) {
      throw new Error(`Material Housing input ${accepted.id} lacks one exact implementation-owner source.`);
    }
  }
  const monitoring = administration.informationRoutes.state.artifacts.find(
    (entry) => entry.id === configuration.monitoringArtifact.id,
  );
  let expectedMonitoring = expectedMonitoringArtifacts.get(configuration);
  if (expectedMonitoring === undefined) {
    expectedMonitoring = createMonitoringArtifact(configuration, createOpeningLowerOwners(configuration));
    expectedMonitoringArtifacts.set(configuration, expectedMonitoring);
  }
  if (monitoring === undefined || JSON.stringify(monitoring) !== JSON.stringify(expectedMonitoring)) {
    throw new Error("Housing monitoring evidence is missing, tampered, or no longer claim-lineaged.");
  }
  const observations = administration.informationRoutes.state.institutionArtifactObservations;
  if (
    observations.length !== 1 ||
    JSON.stringify(observations[0]) !== JSON.stringify({
      id: configuration.openingInformation.monitoringObservationId,
      artifactId: configuration.monitoringArtifact.id,
      observingInstitutionId: configuration.observationAuthority.observingInstitutionId,
      observationAuthorityId: configuration.observationAuthority.id,
      observedAt: configuration.opening.monitoringObservedAt,
      provenanceReference: configuration.provenanceReference,
    })
  ) throw new Error("Housing monitoring artifact lacks its exact information-owner observation occurrence.");
  const raw = administration.informationRoutes.state.artifacts.find(
    (entry) => entry.id === configuration.rawSupplierEvidenceArtifact.id,
  );
  if (raw === undefined || JSON.stringify(raw) !== JSON.stringify(configuration.rawSupplierEvidenceArtifact)) {
    throw new Error("Department raw supplier evidence contradicts authenticated configuration.");
  }
  assertRawNoticeActivation(administration, configuration);
  assertSupplementalArtifactsAndHandling(
    { ...administration, ...state },
    configuration,
    current,
  );
  assertI4HistoricalReferences(state, configuration, current);
};

export const advancePresidentialHousingOwners = (
  state: PresidentialHousingOwnerStates,
  from: string,
  to: string,
): PresidentialHousingOwnerStates => ({
  programImplementation: advanceAdministrativeDeadlines(state.programImplementation, to),
  materialHousing: advanceIntegratedMaterialHousing(state.materialHousing, from, to),
});

export interface AuthorDepartmentSupplementalRecordInput {
  readonly productionId: string;
  readonly producingOfficeId: string;
  readonly authoringOfficeholderAssignmentId: string;
  readonly sourceDispositionId: string;
  readonly sourceAssignmentId: string;
  readonly sourceAssignmentResultArtifactId: string;
  readonly sourceEvidenceReceiptId: string;
  readonly provenanceReference: string;
}

export interface SubmitDepartmentHandlingInput {
  readonly id: string;
  readonly deduplicationIdentity: string;
  readonly submittingOfficeId: string;
  readonly submittingOfficeholderAssignmentId: string;
  readonly handlingAuthorityId: string;
  readonly sourceDispositionId: string;
  readonly sourceAssignmentId: string;
  readonly sourceAssignmentResultArtifactId: string;
  readonly targetInstitutionId: string;
  readonly targetRequestId: string;
  readonly targetProjectId: string;
  readonly targetRelationshipId: string;
  readonly targetScopeKey: string;
  readonly payload: DepartmentHandlingSubmissionRecord["payload"];
  readonly provenanceReference: string;
}

export interface AdmitImplementationMaterialInputsInput {
  readonly materialInputIds: readonly string[];
}

const sorted = <T>(
  values: readonly T[],
  at: (entry: T) => string,
  id: (entry: T) => string,
): readonly T[] => [...values].sort((left, right) =>
  instant(at(left), `${id(left)} time`) - instant(at(right), `${id(right)} time`) ||
  id(left).localeCompare(id(right)));

const isEffective = (from: string, until: string | null, at: string): boolean =>
  instant(from, "Authority start") <= instant(at, "Authority use") &&
  (until === null || instant(at, "Authority use") < instant(until, "Authority end"));

const effectiveOfficeholder = (
  state: PresidentialAdministrationOwnerStates,
  assignmentId: string,
  officeId: string,
  at: string,
): boolean => state.administrationDirectory.state.officeholderAssignments.some((entry) =>
  entry.id === assignmentId && entry.officeId === officeId &&
  isEffective(entry.effectiveFrom, entry.effectiveUntil, at));

const officeState = (
  state: PresidentialAdministrationOwnerStates,
  officeId: string,
) => {
  const office = state.officeOperations.state.find((entry) => entry.officeId === officeId);
  if (office === undefined) throw new Error(`Unknown Department leadership office ${officeId}.`);
  return office;
};

const findInformationArtifact = (
  state: PresidentialAdministrationOwnerStates,
  artifactId: string,
): PresidentialInformationArtifact | undefined =>
  state.informationRoutes.state.artifacts.find((entry) => entry.id === artifactId);

const assertHandlingSource = (
  state: PresidentialHousingOperationState,
  configuration: PresidentialOperatingHousingConfiguration,
  current: string,
  input: {
    readonly officeId: string;
    readonly officeholderAssignmentId: string;
    readonly dispositionId: string;
    readonly assignmentId: string;
    readonly assignmentResultArtifactId: string;
  },
): void => {
  const authority = configuration.handlingAuthority;
  if (
    input.officeId !== authority.officeId ||
    !isEffective(authority.effectiveFrom, authority.effectiveUntil, current) ||
    !effectiveOfficeholder(state, input.officeholderAssignmentId, input.officeId, current)
  ) throw new Error("Department handling lacks effective leadership authority.");
  const office = officeState(state, input.officeId);
  const disposition = office.instrumentDispositions.find((entry) => entry.id === input.dispositionId);
  const assignment = office.assignments.find((entry) => entry.id === input.assignmentId);
  const result = findInformationArtifact(state, input.assignmentResultArtifactId);
  const authorization = office.instrumentAssignmentAuthorizations.find(
    (entry) => entry.assignmentId === input.assignmentId && entry.dispositionId === input.dispositionId,
  );
  if (
    disposition === undefined ||
    !["ACCEPTED_AS_REQUESTED", "NARROWED"].includes(disposition.kind) ||
    assignment === undefined ||
    assignment.status !== "COMPLETED" ||
    !assignment.resultArtifactIds.includes(input.assignmentResultArtifactId) ||
    authorization === undefined ||
    result === undefined ||
    result.kind !== "ASSESSMENT" ||
    result.producingOfficeId !== input.officeId ||
    result.assignmentId !== input.assignmentId ||
    instant(result.createdAt, `${result.id} creation`) > instant(current, "Department handling time")
  ) throw new Error("Department handling lacks its exact recipient disposition, assignment, and result lineage.");
};

export const authorDepartmentSupplementalRecord = (
  state: PresidentialHousingOperationState,
  configuration: PresidentialOperatingHousingConfiguration,
  current: string,
  input: AuthorDepartmentSupplementalRecordInput,
): PresidentialHousingOperationState => {
  assertHandlingSource(state, configuration, current, {
    officeId: input.producingOfficeId,
    officeholderAssignmentId: input.authoringOfficeholderAssignmentId,
    dispositionId: input.sourceDispositionId,
    assignmentId: input.sourceAssignmentId,
    assignmentResultArtifactId: input.sourceAssignmentResultArtifactId,
  });
  const raw = configuration.rawSupplierEvidenceArtifact;
  const receipt = state.informationRoutes.state.receipts.find(
    (entry) => entry.id === input.sourceEvidenceReceiptId,
  );
  if (
    receipt === undefined ||
    receipt.recipientOfficeId !== input.producingOfficeId ||
    receipt.artifactId !== raw.id ||
    raw.sectionIds.some((sectionId) => !receipt.receivedSectionIds.includes(sectionId)) ||
    instant(receipt.receivedAt, `${receipt.id} receipt`) > instant(current, "Supplemental authoring time")
  ) throw new Error("Department supplemental record requires the Secretary office's complete raw-evidence receipt.");
  const spec = configuration.supplementalRecordArtifact;
  const artifactWithoutHash: Omit<DepartmentSupplementalRecordArtifact, "canonicalArtifactHash"> = {
    kind: "HUD_SUPPLEMENTAL_RECORD",
    id: spec.id,
    version: spec.version,
    recordTypeId: "NONAVAILABILITY_RECORD",
    producingOfficeId: input.producingOfficeId,
    authoringOfficeholderAssignmentId: input.authoringOfficeholderAssignmentId,
    sourceDispositionId: input.sourceDispositionId,
    sourceAssignmentId: input.sourceAssignmentId,
    sourceAssignmentResultArtifactId: input.sourceAssignmentResultArtifactId,
    targetInstitutionId: configuration.handlingAuthority.lowerInstitutionId,
    targetRequestId: configuration.handlingAuthority.targetRequestId,
    targetProjectId: configuration.handlingAuthority.targetProjectId,
    targetRelationshipId: configuration.handlingAuthority.targetRelationshipId,
    targetScopeKey: configuration.handlingAuthority.targetScopeKey,
    sourceEvidenceArtifactId: raw.id,
    sourceEvidenceReceiptId: receipt.id,
    sourceEvidenceSectionIds: [...raw.sectionIds],
    asOf: current,
    createdAt: current,
    releasedAt: current,
    sectionIds: [...spec.sectionIds],
    accessClass: spec.accessClass,
    provenanceReference: input.provenanceReference,
    revisionOfArtifactId: null,
    supersedesArtifactId: null,
  };
  const artifact: DepartmentSupplementalRecordArtifact = {
    ...artifactWithoutHash,
    canonicalArtifactHash: computeDepartmentSupplementalArtifactHash(artifactWithoutHash),
  };
  const production: OfficeArtifactProductionRecord = {
    id: input.productionId,
    artifactId: artifact.id,
    producingOfficeId: input.producingOfficeId,
    producingOfficeholderAssignmentId: input.authoringOfficeholderAssignmentId,
    producedAt: current,
    provenanceReference: input.provenanceReference,
  };
  const existingArtifact = findInformationArtifact(state, artifact.id);
  const existingProduction = state.informationRoutes.state.officeArtifactProductions.find(
    (entry) => entry.id === production.id || entry.artifactId === artifact.id,
  );
  if (existingArtifact !== undefined || existingProduction !== undefined) {
    if (
      existingArtifact !== undefined && existingProduction !== undefined &&
      JSON.stringify(existingArtifact) === JSON.stringify(artifact) &&
      JSON.stringify(existingProduction) === JSON.stringify(production)
    ) return state;
    throw new Error("Department supplemental artifact identity or production conflicts.");
  }
  const next = appendDerivedPresidentialHousingHistory({
    ...state,
    informationRoutes: {
      ...state.informationRoutes,
      state: {
        ...state.informationRoutes.state,
        artifacts: sorted(
          [...state.informationRoutes.state.artifacts, artifact],
          (entry) => entry.createdAt,
          (entry) => entry.id,
        ),
        officeArtifactProductions: sorted(
          [...state.informationRoutes.state.officeArtifactProductions, production],
          (entry) => entry.producedAt,
          (entry) => entry.id,
        ),
      },
    },
  }, configuration);
  assertPresidentialHousingOwnerStates(next, next, configuration, current);
  return next;
};

export const submitDepartmentHandling = (
  state: PresidentialHousingOperationState,
  configuration: PresidentialOperatingHousingConfiguration,
  current: string,
  input: SubmitDepartmentHandlingInput,
): PresidentialHousingOperationState => {
  assertHandlingSource(state, configuration, current, {
    officeId: input.submittingOfficeId,
    officeholderAssignmentId: input.submittingOfficeholderAssignmentId,
    dispositionId: input.sourceDispositionId,
    assignmentId: input.sourceAssignmentId,
    assignmentResultArtifactId: input.sourceAssignmentResultArtifactId,
  });
  const authority = configuration.handlingAuthority;
  if (
    input.handlingAuthorityId !== authority.id ||
    input.targetInstitutionId !== authority.lowerInstitutionId ||
    input.targetRequestId !== authority.targetRequestId ||
    input.targetProjectId !== authority.targetProjectId ||
    input.targetRelationshipId !== authority.targetRelationshipId ||
    input.targetScopeKey !== authority.targetScopeKey
  ) throw new Error("Department handling target exceeds its bounded authority.");
  const record: DepartmentHandlingSubmissionRecord = { ...copyPlain(input), submittedAt: current };
  const all = state.officeOperations.state.flatMap((entry) => entry.departmentHandlingSubmissions);
  const existing = all.find((entry) =>
    entry.id === record.id || entry.deduplicationIdentity === record.deduplicationIdentity);
  if (existing !== undefined) {
    if (JSON.stringify(existing) === JSON.stringify(record)) return state;
    throw new Error(`Department handling ${record.id} conflicts with an existing occurrence.`);
  }
  let programImplementation: ProgramImplementationState;
  if (record.payload.kind === "SUBMIT_SUPPLEMENTAL_RECORDS") {
    const reference = record.payload.qualifyingEvidenceReference;
    const artifact = findInformationArtifact(state, reference.artifactId);
    const production = state.informationRoutes.state.officeArtifactProductions.find(
      (entry) => entry.id === reference.sourceArtifactProductionId,
    );
    const receipt = state.informationRoutes.state.receipts.find(
      (entry) => entry.id === reference.sourceRawEvidenceReceiptId,
    );
    if (
      record.payload.recordTypeIds.length !== 1 ||
      record.payload.recordTypeIds[0] !== "NONAVAILABILITY_RECORD" ||
      reference.artifactKind !== "HUD_SUPPLEMENTAL_RECORD" ||
      reference.recordTypeId !== "NONAVAILABILITY_RECORD" ||
      reference.certificationSectionId !== "nonavailability-certification" ||
      reference.sourceLineageSectionId !== "source-evidence-lineage" ||
      artifact === undefined || artifact.kind !== "HUD_SUPPLEMENTAL_RECORD" ||
      artifact.recordTypeId !== "NONAVAILABILITY_RECORD" ||
      artifact.sourceDispositionId !== record.sourceDispositionId ||
      artifact.sourceAssignmentId !== record.sourceAssignmentId ||
      artifact.sourceAssignmentResultArtifactId !== record.sourceAssignmentResultArtifactId ||
      artifact.sourceEvidenceReceiptId !== reference.sourceRawEvidenceReceiptId ||
      production === undefined || production.artifactId !== artifact.id ||
      production.producingOfficeId !== record.submittingOfficeId ||
      receipt === undefined || receipt.recipientOfficeId !== record.submittingOfficeId ||
      receipt.artifactId !== configuration.rawSupplierEvidenceArtifact.id
    ) throw new Error("Supplemental handling lacks qualifying certified evidence lineage.");
    programImplementation = supplySupplementalWaiverRecords(
      state.programImplementation,
      record.targetRequestId,
      record.payload.recordTypeIds,
    );
  } else {
    if (record.payload.supportingHandlingSubmissionIds.length === 0) {
      throw new Error("Waiver-review handling requires its prior supplemental submission.");
    }
    for (const id of record.payload.supportingHandlingSubmissionIds) {
      const source = all.find((entry) => entry.id === id);
      if (
        source === undefined || source.payload.kind !== "SUBMIT_SUPPLEMENTAL_RECORDS" ||
        source.targetRequestId !== record.targetRequestId ||
        instant(source.submittedAt, `${source.id} submission`) > instant(current, "Review-intention submission")
      ) throw new Error("Waiver-review handling cites invalid supplemental handling.");
    }
    programImplementation = directWaiverIntention(
      state.programImplementation,
      record.targetRequestId,
      record.payload.intention as WaiverIntention,
      configuration.ownerContent.implementationConfiguration,
      current,
    );
  }
  const next = appendDerivedPresidentialHousingHistory({
    ...state,
    programImplementation,
    officeOperations: {
      ...state.officeOperations,
      state: state.officeOperations.state.map((office) => office.officeId === record.submittingOfficeId ? {
        ...office,
        departmentHandlingSubmissions: sorted(
          [...office.departmentHandlingSubmissions, record],
          (entry) => entry.submittedAt,
          (entry) => entry.id,
        ),
      } : office),
    },
  }, configuration);
  assertPresidentialHousingOwnerStates(next, next, configuration, current);
  return next;
};

export const admitImplementationMaterialInputs = (
  state: PresidentialHousingOperationState,
  configuration: PresidentialOperatingHousingConfiguration,
  current: string,
  input: AdmitImplementationMaterialInputsInput,
): PresidentialHousingOperationState => {
  if (new Set(input.materialInputIds).size !== input.materialInputIds.length || input.materialInputIds.length === 0) {
    throw new Error("Material-input admission requires a unique nonempty exact input set.");
  }
  const existing = new Set(state.materialHousing.acceptedInputs.map((entry) => entry.id));
  const references = input.materialInputIds.map((id) => {
    const source = state.programImplementation.materialInputs.find((entry) => entry.id === id);
    if (
      source === undefined || existing.has(id) ||
      source.projectRef !== configuration.handlingAuthority.targetProjectId ||
      instant(source.validatedAt, `${source.id} validation`) !== instant(current, "Material admission time")
    ) throw new Error(`Material input ${id} is not an admissible new implementation-owned Housing input.`);
    const determination = state.programImplementation.administrativeProgram.determinations.find(
      (entry) => entry.id === source.sourceRecordId,
    );
    const handling = state.officeOperations.state.flatMap((entry) => entry.departmentHandlingSubmissions).find(
      (entry) => entry.payload.kind === "SUBMIT_WAIVER_REVIEW_INTENTION" &&
        entry.targetRequestId === determination?.requestId && entry.submittedAt === determination.decidedAt,
    );
    if (determination === undefined || handling === undefined) {
      throw new Error(`Material input ${id} lacks its canonical Department handling cause.`);
    }
    return { ...source } satisfies AcceptedMaterialInputReference;
  });
  const next = appendDerivedPresidentialHousingHistory({
    ...state,
    materialHousing: admitValidatedMaterialInputs(state.materialHousing, references),
  }, configuration);
  assertPresidentialHousingOwnerStates(next, next, configuration, current);
  return next;
};

import { sha256Hex } from "../configuration/sha256";
import type { ConfigurationIdentity } from "../configuration/types";
import {
  assertCalendarTimeState,
  createCalendarTimeState,
  expectedProcessedBoundaryIds,
  type CalendarTimeState,
  type ConfiguredCalendarBoundary,
} from "./calendar-time";
import {
  assertPresidentialAdministrationConfiguration,
  assertPresidentialAdministrationOwnerStates,
  copyPresidentialAdministrationOwnerStates,
  createPresidentialAdministrationOwnerStates,
  type PresidentialAdministrationConfiguration,
  type PresidentialAdministrationOwnerStates,
} from "./presidential-office-information";
import {
  advancePresidentialInterventionTime,
  assertPresidentialInterventionConfiguration,
  assertPresidentialInterventionOwnerStates,
  copyPresidentialInterventionOwnerStates,
  createPresidentialInterventionOwnerStates,
  type PresidentialInterventionConfiguration,
  type PresidentialInterventionOwnerStates,
} from "./presidential-operating-intervention";
import {
  appendDerivedPresidentialHousingHistory,
  advancePresidentialHousingOwners,
  assertPresidentialHousingOwnerStates,
  assertPresidentialOperatingHousingConfiguration,
  copyPresidentialHousingOwnerStates,
  createOpeningHousingComposition,
  type PresidentialHousingOwnerStates,
  type PresidentialOperatingHousingConfiguration,
} from "./presidential-operating-housing";
import { createAdministrationWorkstream } from "./presidential-operating-intervention";
import {
  advancePresidentialConcurrentWorld,
  appendDerivedPresidentialConcurrentHistory,
  assertConcurrentWorldConfiguration,
  assertPresidentialConcurrentWorldOwnerStates,
  composeOpeningConcurrentAdministration,
  copyPresidentialConcurrentWorldOwnerStates,
  createPresidentialConcurrentWorldOwnerStates,
  type ConcurrentWorldConfiguration,
  type PresidentialConcurrentWorldOwnerStates,
} from "./presidential-operating-concurrent-world";

export const PRESIDENTIAL_OPERATING_RUNTIME_SCHEMA_VERSION = 5 as const;

export interface PresidentialOperatingRuntimeConfiguration {
  readonly schemaVersion: typeof PRESIDENTIAL_OPERATING_RUNTIME_SCHEMA_VERSION;
  readonly identity: ConfigurationIdentity;
  readonly classification: string;
  readonly operatingStateId: string;
  readonly calendar: {
    readonly ownerId: string;
    readonly epoch: string;
    readonly boundaries: readonly ConfiguredCalendarBoundary[];
  };
  readonly administration: PresidentialAdministrationConfiguration;
  readonly intervention: PresidentialInterventionConfiguration;
  readonly housing: PresidentialOperatingHousingConfiguration;
  readonly concurrentWorld: ConcurrentWorldConfiguration;
}

export interface PresidentialOperatingRuntimeState {
  readonly schemaVersion: typeof PRESIDENTIAL_OPERATING_RUNTIME_SCHEMA_VERSION;
  readonly operatingStateId: string;
  readonly configuration: ConfigurationIdentity;
  readonly ownerStates: {
    readonly calendar: {
      readonly ownerId: string;
      readonly state: CalendarTimeState;
    };
  } & PresidentialAdministrationOwnerStates & PresidentialInterventionOwnerStates & PresidentialHousingOwnerStates &
    PresidentialConcurrentWorldOwnerStates;
}

const requireNonempty = (value: string, field: string): void => {
  if (value.trim().length === 0) throw new Error(`Presidential operating ${field} is required.`);
};

const configurationHashPayload = (
  configuration: Omit<PresidentialOperatingRuntimeConfiguration, "identity"> & {
    readonly identity: Omit<ConfigurationIdentity, "configurationHash">;
  },
): unknown => configuration;

export const computePresidentialOperatingConfigurationHash = (
  configuration: Omit<PresidentialOperatingRuntimeConfiguration, "identity"> & {
    readonly identity: Omit<ConfigurationIdentity, "configurationHash">;
  },
): string => sha256Hex(JSON.stringify(configurationHashPayload(configuration)));

export const assertPresidentialOperatingRuntimeConfiguration = (
  configuration: PresidentialOperatingRuntimeConfiguration,
): void => {
  if (configuration.schemaVersion !== PRESIDENTIAL_OPERATING_RUNTIME_SCHEMA_VERSION) {
    throw new Error("Unsupported presidential operating runtime schema version.");
  }
  requireNonempty(configuration.classification, "classification");
  requireNonempty(configuration.operatingStateId, "state identity");
  requireNonempty(configuration.calendar.ownerId, "calendar owner identity");
  for (const field of [
    "configurationId",
    "configurationVersion",
    "scenarioId",
    "scenarioVersion",
  ] as const) requireNonempty(configuration.identity[field], `configuration.${field}`);
  const expectedHash = computePresidentialOperatingConfigurationHash({
    schemaVersion: configuration.schemaVersion,
    identity: {
      configurationId: configuration.identity.configurationId,
      configurationVersion: configuration.identity.configurationVersion,
      scenarioId: configuration.identity.scenarioId,
      scenarioVersion: configuration.identity.scenarioVersion,
    },
    classification: configuration.classification,
    operatingStateId: configuration.operatingStateId,
    calendar: configuration.calendar,
    administration: configuration.administration,
    intervention: configuration.intervention,
    housing: configuration.housing,
    concurrentWorld: configuration.concurrentWorld,
  });
  if (configuration.identity.configurationHash !== expectedHash) {
    throw new Error(
      `Presidential operating configuration hash mismatch: declared ${configuration.identity.configurationHash}, computed ${expectedHash}.`,
    );
  }
  assertCalendarTimeState(
    createCalendarTimeState(configuration.calendar.epoch, configuration.calendar.boundaries),
    configuration.calendar.epoch,
    configuration.calendar.boundaries,
  );
  assertPresidentialAdministrationConfiguration(
    configuration.administration,
    configuration.calendar.epoch,
  );
  assertPresidentialInterventionConfiguration(
    configuration.intervention,
    configuration.administration,
    configuration.calendar.epoch,
  );
  assertPresidentialOperatingHousingConfiguration(configuration.housing, configuration.calendar.epoch);
  assertConcurrentWorldConfiguration(
    configuration.concurrentWorld,
    configuration.administration,
    configuration.intervention,
    configuration.calendar.epoch,
  );
  if (
    configuration.housing.history.historyId !== configuration.intervention.historyId ||
    configuration.housing.history.informationRoutesOwnerId !== configuration.administration.ownerIds.informationRoutes ||
    configuration.housing.history.officeOperationsOwnerId !== configuration.administration.ownerIds.officeOperations ||
    configuration.housing.history.implementationOwnerId !==
      configuration.housing.ownerContent.implementationConfiguration.administeringInstitutionId ||
    configuration.housing.history.materialHousingOwnerId !== configuration.housing.materialHousing.ownerId
  ) throw new Error("Presidential Housing history owner bindings contradict canonical owner identities.");
}

const composeOpeningAdministration = (
  administration: PresidentialAdministrationOwnerStates,
  configuration: PresidentialOperatingRuntimeConfiguration,
  opening: ReturnType<typeof createOpeningHousingComposition>,
): PresidentialAdministrationOwnerStates => {
  const housing = configuration.housing;
  const institutionId = housing.institutionBinding.presidentialInstitutionId;
  const secretaryOfficeId = housing.handlingAuthority.officeId;
  const housingDefinition = configuration.intervention.workstreamDefinitions.find(
    (entry) => entry.id === configuration.intervention.escalationEligibilityRules.find(
      (rule) => rule.requiredBasisKind === "RECEIPT",
    )?.requiredWorkstreamId,
  );
  if (housingDefinition === undefined) throw new Error("Opening Housing workstream definition is missing.");
  const at = housing.opening.informationRoutedAt;
  const monitoringPossession = {
    id: housing.openingInformation.monitoringPossessionId,
    artifactId: opening.monitoringArtifact.id,
    possessingInstitutionId: institutionId,
    possessedAt: at,
    acquisitionProvenanceReference: housing.provenanceReference,
  };
  const rawPossession = {
    id: housing.openingInformation.rawSupplierPossessionId,
    artifactId: housing.rawSupplierEvidenceArtifact.id,
    possessingInstitutionId: institutionId,
    possessedAt: housing.opening.rawEvidencePossessedAt,
    acquisitionProvenanceReference: housing.provenanceReference,
  };
  const indexEntries = [
    {
      id: housing.openingInformation.rawSupplierIndexId,
      artifactId: housing.rawSupplierEvidenceArtifact.id,
      sourcePossessionId: rawPossession.id,
      sourceInstitutionId: institutionId,
      artifactVersion: housing.rawSupplierEvidenceArtifact.version,
      accessClass: housing.rawSupplierEvidenceArtifact.accessClass,
      availableSectionIds: [...housing.rawSupplierEvidenceArtifact.sectionIds],
      createdAt: at,
      provenanceReference: housing.provenanceReference,
    },
    {
      id: housing.openingInformation.monitoringIndexId,
      artifactId: opening.monitoringArtifact.id,
      sourcePossessionId: monitoringPossession.id,
      sourceInstitutionId: institutionId,
      artifactVersion: opening.monitoringArtifact.version,
      accessClass: opening.monitoringArtifact.accessClass,
      availableSectionIds: [...opening.monitoringArtifact.sectionIds],
      createdAt: at,
      provenanceReference: housing.provenanceReference,
    },
  ].sort((left, right) => left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id));
  const metadataNotices = [
    {
      id: housing.openingInformation.monitoringSecretaryNoticeId,
      indexEntryId: housing.openingInformation.monitoringIndexId,
      recipientOfficeId: secretaryOfficeId,
      noticedAt: at,
      deliveryPath: "HUD_DEPARTMENT_TO_SECRETARY_INDEX_NOTICE",
      deduplicationIdentity: `${housing.openingInformation.monitoringSecretaryNoticeId}.dedupe`,
    },
    {
      id: housing.openingInformation.monitoringChiefOfStaffNoticeId,
      indexEntryId: housing.openingInformation.monitoringIndexId,
      recipientOfficeId: housingDefinition.coordinatorOfficeId,
      noticedAt: at,
      deliveryPath: "HUD_DEPARTMENT_TO_CHIEF_OF_STAFF_EXISTENCE_NOTICE",
      deduplicationIdentity: `${housing.openingInformation.monitoringChiefOfStaffNoticeId}.dedupe`,
    },
  ].sort((left, right) => left.noticedAt.localeCompare(right.noticedAt) || left.id.localeCompare(right.id));
  return {
    ...administration,
    informationRoutes: {
      ...administration.informationRoutes,
      state: {
        ...administration.informationRoutes.state,
        artifacts: [
          ...administration.informationRoutes.state.artifacts,
          housing.rawSupplierEvidenceArtifact,
          opening.monitoringArtifact,
        ].sort((left, right) => left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id)),
        institutionArtifactObservations: [{
          id: housing.openingInformation.monitoringObservationId,
          artifactId: opening.monitoringArtifact.id,
          observingInstitutionId: institutionId,
          observationAuthorityId: housing.observationAuthority.id,
          observedAt: housing.opening.monitoringObservedAt,
          provenanceReference: housing.provenanceReference,
        }],
        institutionPossessions: [rawPossession, monitoringPossession]
          .sort((left, right) => left.possessedAt.localeCompare(right.possessedAt) || left.id.localeCompare(right.id)),
        indexEntries,
        metadataNotices,
      },
    },
  };
};

export const createPresidentialOperatingRuntimeState = (
  configuration: PresidentialOperatingRuntimeConfiguration,
): PresidentialOperatingRuntimeState => {
  assertPresidentialOperatingRuntimeConfiguration(configuration);
  const administration = createPresidentialAdministrationOwnerStates(
    configuration.administration,
    configuration.calendar.epoch,
  );
  const openingHousing = createOpeningHousingComposition(configuration.housing);
  const openingAdministration = composeOpeningAdministration(administration, configuration, openingHousing);
  const intervention = createPresidentialInterventionOwnerStates(
    configuration.intervention,
    configuration.administration,
    configuration.calendar.epoch,
  );
  const initialOwners = {
    ...openingAdministration,
    ...intervention,
    programImplementation: openingHousing.programImplementation,
    materialHousing: openingHousing.materialHousing,
  };
  const housingRule = configuration.intervention.escalationEligibilityRules.find(
    (entry) => entry.requiredBasisKind === "RECEIPT",
  );
  if (housingRule === undefined) throw new Error("Opening Housing escalation rule is missing.");
  const housingDefinition = configuration.intervention.workstreamDefinitions.find(
    (entry) => entry.id === housingRule.requiredWorkstreamId,
  );
  const housingAuthority = configuration.intervention.standingCoordinationAuthorities.find(
    (entry) => entry.id === housingRule.standingAuthorityId,
  );
  const creatingAssignment = configuration.administration.officeholderAssignments.find(
    (entry) => entry.officeId === housingDefinition?.coordinatorOfficeId,
  );
  if (housingDefinition === undefined || housingAuthority === undefined || creatingAssignment === undefined) {
    throw new Error("Opening Housing workstream lacks configured authority or officeholder.");
  }
  const withHousingWorkstream = createAdministrationWorkstream(
    initialOwners,
    configuration.administration,
    configuration.intervention,
    configuration.calendar.epoch,
    configuration.calendar.epoch,
    {
      id: housingDefinition.id,
      initialTransitionId: `${housingDefinition.id}.transition.opening-monitored`,
      initialTransitionDeduplicationIdentity: `${housingDefinition.id}.dedupe.opening-monitored`,
      creatingOfficeId: housingDefinition.coordinatorOfficeId,
      creatingOfficeholderAssignmentId: creatingAssignment.id,
      standingAuthorityId: housingAuthority.id,
      initialSourceReferenceIds: [configuration.housing.openingInformation.monitoringChiefOfStaffNoticeId],
      initialReviewAt: "2029-02-12T08:00:00-05:00",
      reason: "Inherited Housing monitoring is adopted without substantive evidence fan-out.",
      provenanceReference: configuration.housing.provenanceReference,
    },
  );
  const openingOwners = {
    ...withHousingWorkstream,
    programImplementation: openingHousing.programImplementation,
    materialHousing: openingHousing.materialHousing,
    ...createPresidentialConcurrentWorldOwnerStates(configuration.concurrentWorld),
  };
  const composedConcurrentAdministration = composeOpeningConcurrentAdministration(
    openingOwners,
    configuration.administration,
    configuration.concurrentWorld,
    configuration.calendar.epoch,
  );
  const withHousingHistory = {
    ...composedConcurrentAdministration,
    ...appendDerivedPresidentialHousingHistory(composedConcurrentAdministration, configuration.housing),
  };
  const withConcurrentHistory = appendDerivedPresidentialConcurrentHistory(
    withHousingHistory,
    configuration.intervention,
  );
  const ownerStates = {
    calendar: {
      ownerId: configuration.calendar.ownerId,
      state: createCalendarTimeState(
        configuration.calendar.epoch,
        configuration.calendar.boundaries,
      ),
    },
    ...withConcurrentHistory,
  };
  const state: PresidentialOperatingRuntimeState = {
    schemaVersion: PRESIDENTIAL_OPERATING_RUNTIME_SCHEMA_VERSION,
    operatingStateId: configuration.operatingStateId,
    configuration: { ...configuration.identity },
    ownerStates,
  };
  assertPresidentialOperatingRuntimeState(state, configuration);
  return state;
};

export const copyPresidentialOperatingRuntimeState = (
  state: PresidentialOperatingRuntimeState,
): PresidentialOperatingRuntimeState => {
  const administration = copyPresidentialAdministrationOwnerStates(state.ownerStates);
  const intervention = copyPresidentialInterventionOwnerStates(state.ownerStates);
  const housing = copyPresidentialHousingOwnerStates(state.ownerStates);
  const concurrent = copyPresidentialConcurrentWorldOwnerStates(state.ownerStates);
  return {
    schemaVersion: state.schemaVersion,
    operatingStateId: state.operatingStateId,
    configuration: { ...state.configuration },
    ownerStates: {
      calendar: {
        ownerId: state.ownerStates.calendar.ownerId,
        state: {
          current: state.ownerStates.calendar.state.current,
          processedBoundaryIds: [...state.ownerStates.calendar.state.processedBoundaryIds],
        },
      },
      ...administration,
      ...intervention,
      ...housing,
      ...concurrent,
    },
  };
};

export const assertPresidentialOperatingRuntimeState = (
  state: PresidentialOperatingRuntimeState,
  configuration: PresidentialOperatingRuntimeConfiguration,
): void => {
  assertPresidentialOperatingRuntimeConfiguration(configuration);
  if (
    state.schemaVersion !== PRESIDENTIAL_OPERATING_RUNTIME_SCHEMA_VERSION ||
    state.operatingStateId !== configuration.operatingStateId ||
    state.ownerStates.calendar.ownerId !== configuration.calendar.ownerId
  ) throw new Error("Presidential operating state does not match its configured owners.");
  for (const field of [
    "configurationId",
    "configurationVersion",
    "scenarioId",
    "scenarioVersion",
    "configurationHash",
  ] as const) {
    if (state.configuration[field] !== configuration.identity[field]) {
      throw new Error(`Presidential operating state configuration mismatch at ${field}.`);
    }
  }
  assertCalendarTimeState(
    state.ownerStates.calendar.state,
    configuration.calendar.epoch,
    configuration.calendar.boundaries,
  );
  assertPresidentialAdministrationOwnerStates(
    state.ownerStates,
    configuration.administration,
    configuration.calendar.epoch,
    state.ownerStates.calendar.state.current,
  );
  assertPresidentialInterventionOwnerStates(
    state.ownerStates,
    configuration.administration,
    configuration.intervention,
    configuration.calendar.epoch,
    state.ownerStates.calendar.state.current,
  );
  assertPresidentialHousingOwnerStates(
    state.ownerStates,
    state.ownerStates,
    configuration.housing,
    state.ownerStates.calendar.state.current,
  );
  assertPresidentialConcurrentWorldOwnerStates(
    state.ownerStates,
    configuration.administration,
    configuration.intervention,
    configuration.concurrentWorld,
    configuration.calendar.epoch,
    state.ownerStates.calendar.state.current,
  );
};

export const advancePresidentialOperatingRuntimeTime = (
  state: PresidentialOperatingRuntimeState,
  configuration: PresidentialOperatingRuntimeConfiguration,
  target: string,
): PresidentialOperatingRuntimeState => {
  assertPresidentialOperatingRuntimeState(state, configuration);
  const currentValue = Date.parse(state.ownerStates.calendar.state.current);
  const targetValue = Date.parse(target);
  if (!Number.isFinite(targetValue) || targetValue < currentValue) {
    throw new Error("Presidential operating time requires a valid nondecreasing target.");
  }
  const afterClosures = advancePresidentialInterventionTime(
    state.ownerStates,
    configuration.administration,
    configuration.intervention,
    configuration.calendar.epoch,
    state.ownerStates.calendar.state.current,
    target,
  );
  const advancedHousing = advancePresidentialHousingOwners(
    state.ownerStates,
    state.ownerStates.calendar.state.current,
    target,
  );
  const advancedOwners = advancePresidentialConcurrentWorld(
    { ...state.ownerStates, ...afterClosures, ...advancedHousing },
    configuration.administration,
    configuration.concurrentWorld,
    configuration.identity,
    configuration.calendar.epoch,
    state.ownerStates.calendar.state.current,
    target,
  );
  const nextWithoutHousingHistory: PresidentialOperatingRuntimeState = {
    ...state,
    ownerStates: {
      ...advancedOwners,
      ...advancedHousing,
      calendar: {
        ...state.ownerStates.calendar,
        state: {
          current: target,
          processedBoundaryIds: expectedProcessedBoundaryIds(
            target,
            configuration.calendar.boundaries,
          ),
        },
      },
    },
  };
  const withHousingHistory = appendDerivedPresidentialHousingHistory(
    nextWithoutHousingHistory.ownerStates,
    configuration.housing,
  );
  const next: PresidentialOperatingRuntimeState = {
    ...nextWithoutHousingHistory,
    ownerStates: {
      ...nextWithoutHousingHistory.ownerStates,
      ...appendDerivedPresidentialConcurrentHistory(
        { ...nextWithoutHousingHistory.ownerStates, ...withHousingHistory },
        configuration.intervention,
      ),
    },
  };
  assertPresidentialOperatingRuntimeState(next, configuration);
  return next;
};

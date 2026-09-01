import {
  POP0_I2_ALLOWED_ACTOR_JOINS,
  POP0_I2_POPULATION_LINKAGE_STATUS,
  POP0_I2_PROHIBITED_ACTOR_JOINS,
  type PresidentialAdministrationConfiguration,
} from "../../sim/presidential-office-information";
import { sha256Hex } from "../../configuration/sha256";
import {
  computePresidentialOperatingConfigurationHash,
  PRESIDENTIAL_OPERATING_RUNTIME_SCHEMA_VERSION,
  type PresidentialOperatingRuntimeConfiguration,
} from "../../sim/presidential-operating-runtime";
import {
  PRESIDENTIAL_OPERATING_DECISION_SURFACE,
  type PresidentialInterventionConfiguration,
} from "../../sim/presidential-operating-intervention";
import {
  computeDepartmentEvidenceArtifactHash,
  computeOpeningMonitoringArtifactHash,
  PRESIDENTIAL_OPERATING_HOUSING_SCHEMA_VERSION,
  type PresidentialOperatingHousingConfiguration,
} from "../../sim/presidential-operating-housing";
import {
  US_V0_I6_IMPLEMENTATION_CONFIGURATION,
  US_V0_I6_INITIALIZATION_SEED,
} from "../us-v0/i6-owner-content";
import {
  US_V0_I7_HOUSING_CONFIGURATION,
  US_V0_I7_INITIALIZATION_SEED,
} from "../us-v0/i7-owner-content";
import {
  PRESIDENTIAL_CONCURRENT_WORLD_SCHEMA_VERSION,
  type ConcurrentWorldConfiguration,
  type I5HumanIdentityLinkage,
} from "../../sim/presidential-operating-concurrent-world";
import { US_V0_I5_STRUCTURE } from "../us-v0/i5";
import { US_V0_LEGISLATIVE_SEED } from "../us-v0/legislative-owner-content";

export const POP0_V0_CONFIGURATION_ID = "presidential-operating-proof";
export const POP0_V0_CONFIGURATION_VERSION = "0.5.0-pop0-i5";
export const POP0_V0_SCENARIO_ID = "us-presidential-operating-proof-v0";
export const POP0_V0_SCENARIO_VERSION = "0.5.0-pop0-i5";
export const POP0_V0_CLASSIFICATION = "APPROXIMATED_NON_HISTORICAL_PRODUCT_PROOF";
export const POP0_V0_OPERATING_STATE_ID = "pop0.operating-world.primary";
export const POP0_V0_CALENDAR_OWNER_ID = "pop0.owner.calendar";
export const POP0_V0_EPOCH = "2029-02-05T08:00:00-05:00";
export const POP0_V0_PROVENANCE_ROOT = "CONFIGURED_SYNTHETIC_PROOF_ROOT";

export const POP0_I2_OWNER_IDS = {
  administrationDirectory: "pop0.owner.administration-directory",
  officeOperations: "pop0.owner.office-operations",
  informationRoutes: "pop0.owner.information-routes",
  presidentialPresentations: "pop0.owner.presidential-presentations",
} as const;

export const POP0_I2_INSTITUTION_IDS = {
  labor: "pop0.institution.department-of-labor",
  hud: "pop0.institution.department-of-housing-and-urban-development",
  hhs: "pop0.institution.department-of-health-and-human-services",
} as const;

export const POP0_I2_OFFICE_IDS = {
  chiefOfStaff: "pop0.office.chief-of-staff",
  nec: "pop0.office.nec",
  omb: "pop0.office.omb",
  legislativeAffairs: "pop0.office.legislative-affairs",
  secretaryOfLabor: "pop0.office.secretary-of-labor",
  secretaryOfHud: "pop0.office.secretary-of-hud",
  secretaryOfHhs: "pop0.office.secretary-of-health-and-human-services",
  intergovernmentalAffairs: "pop0.office.intergovernmental-affairs",
  communications: "pop0.office.communications",
} as const;

export const POP0_I2_ACTOR_IDS = {
  president: "pop0.actor.president-elena-ward",
  chiefOfStaff: "pop0.actor.dana-okafor",
  necDirector: "pop0.actor.maya-chen",
  ombDirector: "pop0.actor.rafael-ortiz",
  legislativeAffairsDirector: "pop0.actor.tessa-monroe",
  secretaryOfLabor: "pop0.actor.naomi-mercer",
  secretaryOfHud: "pop0.actor.luis-ortega",
  secretaryOfHhs: "pop0.actor.amara-singh",
  intergovernmentalAffairsDirector: "pop0.actor.joel-baptiste",
  communicationsDirector: "pop0.actor.erin-shaw",
} as const;

export const POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS = {
  chiefOfStaff: "pop0.officeholder-assignment.dana-okafor.chief-of-staff",
  necDirector: "pop0.officeholder-assignment.maya-chen.nec",
  ombDirector: "pop0.officeholder-assignment.rafael-ortiz.omb",
  legislativeAffairsDirector: "pop0.officeholder-assignment.tessa-monroe.legislative-affairs",
  secretaryOfLabor: "pop0.officeholder-assignment.naomi-mercer.secretary-of-labor",
  secretaryOfHud: "pop0.officeholder-assignment.luis-ortega.secretary-of-hud",
  secretaryOfHhs: "pop0.officeholder-assignment.amara-singh.secretary-of-health-and-human-services",
  intergovernmentalAffairsDirector: "pop0.officeholder-assignment.joel-baptiste.intergovernmental-affairs",
  communicationsDirector: "pop0.officeholder-assignment.erin-shaw.communications",
} as const;

export const POP0_I2_PRESIDENTIAL_BINDING_ID =
  "pop0.presidential-recipient-binding.elena-ward";
export const POP0_I2_PRESIDENTIAL_CONSTITUTIONAL_OFFICE_ID =
  "pop0.constitutional-office.president";

export const POP0_I2_SOURCE_ARTIFACT_ID =
  "pop0.artifact.preliminary-labor-evidence.v1";
export const POP0_I2_SOURCE_SECTION_IDS = {
  summary: "preliminary-summary",
  regionalTable: "regional-table",
  methods: "methods",
} as const;
export const POP0_I2_ACCESS_CLASS = "POP0_I2_SCOPED_OFFICE_ACCESS";
export const POP0_I2_SUPPLIER_ASSUMPTION_ID =
  "pop0.assumption.supplier-spillover-linkage";
export const POP0_I2_COMMON_PROPOSITION_ID =
  "supplier-spillover-beyond-observed-regions";
export const POP0_I2_ASSESSMENT_RULE_IDS = {
  currentEvidenceDoesNotSupportSpillover:
    "pop0.assessment-rule.current-evidence-does-not-support-spillover",
  supplierAssumptionSupportsPlausibility:
    "pop0.assessment-rule.supplier-assumption-supports-plausibility",
  metadataCannotSupportEstimate:
    "pop0.assessment-rule.metadata-cannot-support-estimate",
} as const;

export const POP0_I3_OWNER_IDS = {
  presidentialEscalations: "pop0.owner.presidential-escalations",
  administrationWorkstreams: "pop0.owner.administration-workstreams",
  presidentialDecisions: "pop0.owner.presidential-decisions",
  presidentialInstruments: "pop0.owner.presidential-instruments",
  instrumentDispatches: "pop0.owner.instrument-dispatches",
  historicalRecordIndex: "pop0.owner.historical-record-index",
} as const;

export const POP0_I3_HISTORY_ID = "pop0.history.primary";
export const POP0_I3_CONTROL_BINDING_ID = "pop0.control-binding.presidential-operating";
export const POP0_I3_WORKSTREAM_ID = "pop0.workstream.preliminary-labor-evidence-review";
export const POP0_I3_STANDING_COORDINATION_AUTHORITY_ID =
  "pop0.authority.chief-of-staff.preliminary-labor-coordination";
export const POP0_I3_ESCALATION_RULE_ID =
  "pop0.escalation-rule.preserved-labor-disagreement";
export const POP0_I3_RECIPIENT_CAPABILITY_IDS = {
  ombAnalysis: "pop0.recipient-capability.omb.bounded-analysis",
  chiefOfStaffCoordination:
    "pop0.recipient-capability.chief-of-staff.workstream-coordination",
} as const;

export const POP0_I4_IDS = {
  adapter: "pop0.adapter.inherited-housing.v1",
  institutionBinding: "pop0.institution-binding.hud.lower-owner",
  observationAuthority: "pop0.observation-authority.hud.inherited-housing",
  monitoringArtifact: "pop0.artifact.hud-inherited-housing-monitoring.v1",
  monitoringPossession: "pop0.possession.hud-inherited-housing-monitoring",
  monitoringIndex: "pop0.index.hud-inherited-housing-monitoring",
  monitoringSecretaryNotice: "pop0.notice.secretary-of-hud.housing-monitoring",
  monitoringChiefOfStaffNotice: "pop0.notice.chief-of-staff.housing-monitoring",
  rawSupplierArtifact: "pop0.artifact.hud-stables-supplier-search.v1",
  rawSupplierPossession: "pop0.possession.hud-stables-supplier-search",
  rawSupplierIndex: "pop0.index.hud-stables-supplier-search",
  housingAssessment: "pop0.artifact.hud-inherited-housing-assessment.v1",
  housingAssessmentRule: "pop0.assessment-rule.hud.inherited-housing-problem",
  housingWorkstream: "pop0.workstream.inherited-housing-implementation",
  housingStandingAuthority: "pop0.authority.chief-of-staff.inherited-housing-coordination",
  housingEscalationRule: "pop0.escalation-rule.inherited-housing-receipt",
  hudCapability: "pop0.recipient-capability.hud.inherited-housing-analysis",
  chiefOfStaffCapability: "pop0.recipient-capability.chief-of-staff.housing-coordination",
  handlingAuthority: "pop0.authority.hud-leadership.stables-waiver-review",
  supplementalArtifact: "pop0.artifact.hud-stables-nonavailability-record.v1",
} as const;

export const POP0_I4_MONITORING_SECTION_IDS = [
  "portfolio-summary",
  "stables-administrative-record-gap",
  "stables-material-hold",
  "methods-and-vintage",
] as const;

export const POP0_I4_ASSESSMENT_SECTION_IDS = [
  "assessment-summary",
  "record-gap-finding",
  "material-hold-finding",
  "limitations",
] as const;

export const POP0_I4_RAW_SUPPLIER_SECTION_IDS = [
  "supplier-search-scope",
  "supplier-response-records",
  "method-and-date",
] as const;

const institutions: PresidentialAdministrationConfiguration["institutions"] = [
  { id: POP0_I2_INSTITUTION_IDS.labor, label: "Department of Labor" },
  {
    id: POP0_I2_INSTITUTION_IDS.hud,
    label: "Department of Housing and Urban Development",
  },
  {
    id: POP0_I2_INSTITUTION_IDS.hhs,
    label: "Department of Health and Human Services",
  },
];

const offices: PresidentialAdministrationConfiguration["offices"] = [
  {
    id: POP0_I2_OFFICE_IDS.chiefOfStaff,
    label: "Chief of Staff / Presidential Operations",
    mandate: "Office assignment, cross-office synthesis, and bounded presidential presentation",
    parentInstitutionId: null,
  },
  {
    id: POP0_I2_OFFICE_IDS.nec,
    label: "National Economic Council",
    mandate: "Economic assessment of office-received evidence",
    parentInstitutionId: null,
  },
  {
    id: POP0_I2_OFFICE_IDS.omb,
    label: "Office of Management and Budget",
    mandate: "Supportability and bounded estimate assessment",
    parentInstitutionId: null,
  },
  {
    id: POP0_I2_OFFICE_IDS.legislativeAffairs,
    label: "Office of Legislative Affairs",
    mandate: "Independent office identity and queue state in I2",
    parentInstitutionId: null,
  },
  {
    id: POP0_I2_OFFICE_IDS.secretaryOfLabor,
    label: "Office of the Secretary of Labor",
    mandate: "Leadership-office receipt and measurement-bounded assessment",
    parentInstitutionId: POP0_I2_INSTITUTION_IDS.labor,
  },
  {
    id: POP0_I2_OFFICE_IDS.secretaryOfHud,
    label: "Office of the Secretary of HUD",
    mandate: "Independent leadership-office identity in I2",
    parentInstitutionId: POP0_I2_INSTITUTION_IDS.hud,
  },
  {
    id: POP0_I2_OFFICE_IDS.secretaryOfHhs,
    label: "Office of the Secretary of Health and Human Services",
    mandate: "Leadership-office receipt and bounded rural-service analysis",
    parentInstitutionId: POP0_I2_INSTITUTION_IDS.hhs,
  },
  {
    id: POP0_I2_OFFICE_IDS.intergovernmentalAffairs,
    label: "Office of Intergovernmental Affairs",
    mandate: "Bounded contact with configured state executives",
    parentInstitutionId: null,
  },
  {
    id: POP0_I2_OFFICE_IDS.communications,
    label: "Office of Communications",
    mandate: "Bounded lineaged public statements",
    parentInstitutionId: null,
  },
];

const actorInputs = [
  [POP0_I2_ACTOR_IDS.president, "President Elena Ward"],
  [POP0_I2_ACTOR_IDS.chiefOfStaff, "Dana Okafor"],
  [POP0_I2_ACTOR_IDS.necDirector, "Maya Chen"],
  [POP0_I2_ACTOR_IDS.ombDirector, "Rafael Ortiz"],
  [POP0_I2_ACTOR_IDS.legislativeAffairsDirector, "Tessa Monroe"],
  [POP0_I2_ACTOR_IDS.secretaryOfLabor, "Naomi Mercer"],
  [POP0_I2_ACTOR_IDS.secretaryOfHud, "Luis Ortega"],
  [POP0_I2_ACTOR_IDS.secretaryOfHhs, "Dr. Amara Singh"],
  [POP0_I2_ACTOR_IDS.intergovernmentalAffairsDirector, "Joel Baptiste"],
  [POP0_I2_ACTOR_IDS.communicationsDirector, "Erin Shaw"],
] as const;

const actors: PresidentialAdministrationConfiguration["actors"] = actorInputs.map(
  ([id, label]) => ({ id, label, provenanceReference: POP0_V0_PROVENANCE_ROOT }),
);

const officeholderAssignmentInputs = [
  [POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.chiefOfStaff, POP0_I2_OFFICE_IDS.chiefOfStaff, POP0_I2_ACTOR_IDS.chiefOfStaff],
  [POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.necDirector, POP0_I2_OFFICE_IDS.nec, POP0_I2_ACTOR_IDS.necDirector],
  [POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.ombDirector, POP0_I2_OFFICE_IDS.omb, POP0_I2_ACTOR_IDS.ombDirector],
  [POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.legislativeAffairsDirector, POP0_I2_OFFICE_IDS.legislativeAffairs, POP0_I2_ACTOR_IDS.legislativeAffairsDirector],
  [POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.secretaryOfLabor, POP0_I2_OFFICE_IDS.secretaryOfLabor, POP0_I2_ACTOR_IDS.secretaryOfLabor],
  [POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.secretaryOfHud, POP0_I2_OFFICE_IDS.secretaryOfHud, POP0_I2_ACTOR_IDS.secretaryOfHud],
  [POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.secretaryOfHhs, POP0_I2_OFFICE_IDS.secretaryOfHhs, POP0_I2_ACTOR_IDS.secretaryOfHhs],
  [POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.intergovernmentalAffairsDirector, POP0_I2_OFFICE_IDS.intergovernmentalAffairs, POP0_I2_ACTOR_IDS.intergovernmentalAffairsDirector],
  [POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.communicationsDirector, POP0_I2_OFFICE_IDS.communications, POP0_I2_ACTOR_IDS.communicationsDirector],
] as const;

const officeholderAssignments: PresidentialAdministrationConfiguration["officeholderAssignments"] =
  officeholderAssignmentInputs.map(([id, officeId, actorId]) => ({
    id,
    officeId,
    actorId,
    effectiveFrom: POP0_V0_EPOCH,
    effectiveUntil: null,
    actingStatus: "CONFIRMED" as const,
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  }));

const populationLinkages: PresidentialAdministrationConfiguration["populationLinkages"] =
  actors.map((actor) => ({
    actorId: actor.id,
    status: POP0_I2_POPULATION_LINKAGE_STATUS,
    effectiveFrom: POP0_V0_EPOCH,
    effectiveUntil: null,
    populationScope: "POP0_I2_NO_ORDINARY_POPULATION_COMPOSED" as const,
    support: "BOUNDED_CONFIGURED_PROOF_FIXTURE" as const,
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
    populationWeight: 0 as const,
    permittedJoins: [...POP0_I2_ALLOWED_ACTOR_JOINS],
    prohibitedJoins: [...POP0_I2_PROHIBITED_ACTOR_JOINS],
  }));

const stablesSuccessorCauseKey = "pop0-i4-stables-successor-request";
const stablesRequestId = `${US_V0_I6_IMPLEMENTATION_CONFIGURATION.futureWaiver.recordIdPrefix}${sha256Hex(
  stablesSuccessorCauseKey,
).slice(0, 20)}`;
const stablesScopeKey = "BABA_COMPONENT:POP0_I4_STABLES_COMPONENT";

const rawSupplierEvidenceWithoutHash = {
  kind: "HUD_SUPPLIER_SEARCH_EVIDENCE" as const,
  id: POP0_I4_IDS.rawSupplierArtifact,
  version: "1",
  producerInstitutionId: POP0_I2_INSTITUTION_IDS.hud,
  targetProjectId: "us.project.stables",
  targetRequestId: stablesRequestId,
  targetScopeKey: stablesScopeKey,
  sourceDocumentIds: [
    "pop0.source.hud-supplier-search-scope.v1",
    "pop0.source.hud-supplier-response-records.v1",
    "pop0.source.hud-supplier-search-method.v1",
  ],
  asOf: "2029-02-05T07:30:00-05:00",
  createdAt: "2029-02-05T07:40:00-05:00",
  releasedAt: "2029-02-05T07:40:00-05:00",
  sectionIds: [...POP0_I4_RAW_SUPPLIER_SECTION_IDS],
  accessClass: "POP0_I4_HUD_SUPPLIER_EVIDENCE",
  provenanceReference: POP0_V0_PROVENANCE_ROOT,
  revisionOfArtifactId: null,
  supersedesArtifactId: null,
};

const rawSupplierEvidenceArtifact = {
  ...rawSupplierEvidenceWithoutHash,
  canonicalArtifactHash: computeDepartmentEvidenceArtifactHash(rawSupplierEvidenceWithoutHash),
};

const housingWithoutMonitoringHash = {
  schemaVersion: PRESIDENTIAL_OPERATING_HOUSING_SCHEMA_VERSION,
  adapterId: POP0_I4_IDS.adapter,
  ownerContent: {
    implementationConfiguration: US_V0_I6_IMPLEMENTATION_CONFIGURATION,
    implementationSeed: US_V0_I6_INITIALIZATION_SEED,
    materialHousingConfiguration: US_V0_I7_HOUSING_CONFIGURATION,
    materialHousingSeed: US_V0_I7_INITIALIZATION_SEED,
  },
  programImplementation: {
    initializationArtifactId: US_V0_I6_IMPLEMENTATION_CONFIGURATION.initializationArtifactId,
    parameterHash: US_V0_I6_IMPLEMENTATION_CONFIGURATION.parameterHash,
    semanticsVersion: US_V0_I6_IMPLEMENTATION_CONFIGURATION.semanticsVersion,
  },
  materialHousing: {
    ownerId: "us-v0-housing-material-route-2",
    initializationArtifactId: US_V0_I7_HOUSING_CONFIGURATION.initializationArtifactId,
    parameterHash: US_V0_I7_HOUSING_CONFIGURATION.parameterHash,
    semanticsVersion: US_V0_I7_HOUSING_CONFIGURATION.semanticsVersion,
  },
  history: {
    historyId: POP0_I3_HISTORY_ID,
    informationRoutesOwnerId: POP0_I2_OWNER_IDS.informationRoutes,
    officeOperationsOwnerId: POP0_I2_OWNER_IDS.officeOperations,
    implementationOwnerId: US_V0_I6_IMPLEMENTATION_CONFIGURATION.administeringInstitutionId,
    materialHousingOwnerId: "us-v0-housing-material-route-2",
  },
  institutionBinding: {
    id: POP0_I4_IDS.institutionBinding,
    presidentialInstitutionId: POP0_I2_INSTITUTION_IDS.hud,
    lowerInstitutionId: US_V0_I6_IMPLEMENTATION_CONFIGURATION.administeringInstitutionId,
    relation: "SAME_INSTITUTION_DIFFERENT_SCHEMA_NAMESPACE" as const,
    effectiveFrom: "2029-02-05T07:45:00-05:00",
    effectiveUntil: null,
    lowerConfigurationReference: US_V0_I6_IMPLEMENTATION_CONFIGURATION.parameterHash,
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  },
  observationAuthority: {
    id: POP0_I4_IDS.observationAuthority,
    observingInstitutionId: POP0_I2_INSTITUTION_IDS.hud,
    institutionIdentityBindingId: POP0_I4_IDS.institutionBinding,
    effectiveFrom: "2029-02-05T07:45:00-05:00",
    effectiveUntil: null,
    sourceConfigurationHashes: [
      US_V0_I6_IMPLEMENTATION_CONFIGURATION.parameterHash,
      US_V0_I7_HOUSING_CONFIGURATION.parameterHash,
    ],
    scopes: [
      {
        sourceStateField: "programImplementation" as const,
        sourceOwnerIds: ["us.institution.hud"],
        projectIds: ["us.project.stables", "us.project.palms-at-morris"],
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
        sourceStateField: "materialHousing" as const,
        sourceOwnerIds: ["us-v0-housing-material-route-2"],
        projectIds: ["us.project.stables", "us.project.palms-at-morris"],
        recordKinds: ["MaterialHousingProject", "MaterialHousingProjectHistoryRecord"],
        claimFamilies: [
          { id: "PROJECT_MATERIAL_STATUS", fieldPaths: ["stage", "complianceHold", "inputAvailability", "physicalProgressUnits"] },
          { id: "PROJECT_MATERIAL_HISTORY", fieldPaths: ["fromStage", "toStage", "occurredAt", "causeInputIds"] },
        ],
      },
    ],
    authorityReference: "pop0.authority.hud.inherited-housing-monitoring",
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  },
  monitoringArtifact: {
    id: POP0_I4_IDS.monitoringArtifact,
    version: "1",
    accessClass: "POP0_I4_HUD_HOUSING_MONITORING",
    sectionIds: [...POP0_I4_MONITORING_SECTION_IDS],
  },
  rawSupplierEvidenceArtifact,
  supplementalRecordArtifact: {
    id: POP0_I4_IDS.supplementalArtifact,
    version: "1",
    accessClass: "POP0_I4_HUD_SUPPLEMENTAL_RECORD",
    sectionIds: ["nonavailability-certification", "source-evidence-lineage", "limitations"],
  },
  handlingAuthority: {
    id: POP0_I4_IDS.handlingAuthority,
    officeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
    lowerInstitutionId: US_V0_I6_IMPLEMENTATION_CONFIGURATION.administeringInstitutionId,
    targetProjectId: "us.project.stables",
    targetRequestId: stablesRequestId,
    targetRelationshipId: "us.relationship.home.arapahoe-consortium.fy2025-2027",
    targetScopeKey: stablesScopeKey,
    permittedRecordTypeIds: ["NONAVAILABILITY_RECORD"] as const,
    effectiveFrom: POP0_V0_EPOCH,
    effectiveUntil: null,
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  },
  openingInformation: {
    monitoringObservationId: "pop0.observation.hud.inherited-housing-monitoring.v1",
    monitoringPossessionId: POP0_I4_IDS.monitoringPossession,
    monitoringIndexId: POP0_I4_IDS.monitoringIndex,
    monitoringSecretaryNoticeId: POP0_I4_IDS.monitoringSecretaryNotice,
    monitoringChiefOfStaffNoticeId: POP0_I4_IDS.monitoringChiefOfStaffNotice,
    rawSupplierPossessionId: POP0_I4_IDS.rawSupplierPossession,
    rawSupplierIndexId: POP0_I4_IDS.rawSupplierIndex,
  },
  opening: {
    sourceInstant: "2026-08-22T00:00:00-04:00",
    holdInstant: "2026-08-23T00:00:00-04:00",
    stablesRequestReceivedAt: "2029-01-20T08:00:00-05:00",
    stablesRequestReturnedAt: "2029-01-21T08:00:00-05:00",
    palmsReleaseAt: "2029-02-03T08:00:00-05:00",
    stablesReviewReadyAt: "2029-02-04T08:00:00-05:00",
    rawEvidencePossessedAt: "2029-02-05T07:40:00-05:00",
    monitoringObservedAt: "2029-02-05T07:50:00-05:00",
    informationRoutedAt: "2029-02-05T07:55:00-05:00",
    epoch: POP0_V0_EPOCH,
    stablesProjectId: "us.project.stables",
    palmsProjectId: "us.project.palms-at-morris",
    stablesRelationshipId: "us.relationship.home.arapahoe-consortium.fy2025-2027",
    palmsRelationshipId: "us.relationship.home.corpus-christi-pj.fy2024",
    stablesComponent: "POP0_I4_STABLES_COMPONENT",
    palmsComponent: "POP0_I4_PALMS_COMPONENT",
    stablesSuccessorCauseKey,
  },
  provenanceReference: POP0_V0_PROVENANCE_ROOT,
} as const;

const housing: PresidentialOperatingHousingConfiguration = {
  ...housingWithoutMonitoringHash,
  monitoringArtifact: {
    ...housingWithoutMonitoringHash.monitoringArtifact,
    expectedCanonicalHash: computeOpeningMonitoringArtifactHash(housingWithoutMonitoringHash),
  },
};

const administration: PresidentialAdministrationConfiguration = {
  ownerIds: POP0_I2_OWNER_IDS,
  institutions,
  offices,
  actors,
  officeholderAssignments,
  presidentialRecipientBinding: {
    id: POP0_I2_PRESIDENTIAL_BINDING_ID,
    constitutionalOfficeId: POP0_I2_PRESIDENTIAL_CONSTITUTIONAL_OFFICE_ID,
    actorId: POP0_I2_ACTOR_IDS.president,
    effectiveFrom: POP0_V0_EPOCH,
    effectiveUntil: null,
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  },
  populationLinkages,
  sourceArtifacts: [{
    kind: "SOURCE_EVIDENCE",
    id: POP0_I2_SOURCE_ARTIFACT_ID,
    version: "1",
    artifactClass: "CONFIGURED_SYNTHETIC_PRELIMINARY_LABOR_EVIDENCE",
    producerInstitutionId: POP0_I2_INSTITUTION_IDS.labor,
    asOf: "2029-02-05T07:00:00-05:00",
    createdAt: POP0_V0_EPOCH,
    releasedAt: POP0_V0_EPOCH,
    sectionIds: Object.values(POP0_I2_SOURCE_SECTION_IDS),
    accessClass: POP0_I2_ACCESS_CLASS,
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
    revisionOfArtifactId: null,
    supersedesArtifactId: null,
  }],
  externalArtifactAccessScopes: [
    {
      artifactId: POP0_I4_IDS.monitoringArtifact,
      accessClass: housing.monitoringArtifact.accessClass,
      sectionIds: [...POP0_I4_MONITORING_SECTION_IDS],
    },
    {
      artifactId: POP0_I4_IDS.rawSupplierArtifact,
      accessClass: rawSupplierEvidenceArtifact.accessClass,
      sectionIds: [...POP0_I4_RAW_SUPPLIER_SECTION_IDS],
    },
  ],
  accessEntitlements: [
    {
      id: "pop0.access.secretary-of-labor.preliminary-evidence",
      officeId: POP0_I2_OFFICE_IDS.secretaryOfLabor,
      artifactId: POP0_I2_SOURCE_ARTIFACT_ID,
      accessClass: POP0_I2_ACCESS_CLASS,
      sectionIds: Object.values(POP0_I2_SOURCE_SECTION_IDS),
      effectiveFrom: POP0_V0_EPOCH,
      effectiveUntil: null,
      authorityReference: POP0_V0_PROVENANCE_ROOT,
    },
    {
      id: "pop0.access.nec.preliminary-evidence",
      officeId: POP0_I2_OFFICE_IDS.nec,
      artifactId: POP0_I2_SOURCE_ARTIFACT_ID,
      accessClass: POP0_I2_ACCESS_CLASS,
      sectionIds: [POP0_I2_SOURCE_SECTION_IDS.summary, POP0_I2_SOURCE_SECTION_IDS.regionalTable],
      effectiveFrom: POP0_V0_EPOCH,
      effectiveUntil: null,
      authorityReference: POP0_V0_PROVENANCE_ROOT,
    },
    {
      id: "pop0.access.secretary-of-hud.housing-monitoring",
      officeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
      artifactId: POP0_I4_IDS.monitoringArtifact,
      accessClass: housing.monitoringArtifact.accessClass,
      sectionIds: [...POP0_I4_MONITORING_SECTION_IDS],
      effectiveFrom: POP0_V0_EPOCH,
      effectiveUntil: null,
      authorityReference: POP0_I4_IDS.observationAuthority,
    },
    {
      id: "pop0.access.secretary-of-hud.supplier-evidence",
      officeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
      artifactId: POP0_I4_IDS.rawSupplierArtifact,
      accessClass: rawSupplierEvidenceArtifact.accessClass,
      sectionIds: [...POP0_I4_RAW_SUPPLIER_SECTION_IDS],
      effectiveFrom: POP0_V0_EPOCH,
      effectiveUntil: null,
      authorityReference: POP0_I4_IDS.handlingAuthority,
    },
  ],
  assumptions: [{
    id: POP0_I2_SUPPLIER_ASSUMPTION_ID,
    label: "Observed regional weakness may propagate through configured supplier relationships",
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  }],
  assessmentRules: [
    {
      id: POP0_I2_ASSESSMENT_RULE_IDS.currentEvidenceDoesNotSupportSpillover,
      propositionId: POP0_I2_COMMON_PROPOSITION_ID,
      judgment: "NOT_SUPPORTED_BY_CURRENT_EVIDENCE",
      evidenceRequirement: "SUBSTANTIVE_RECEIPT",
      requiredSectionIds: [POP0_I2_SOURCE_SECTION_IDS.summary, POP0_I2_SOURCE_SECTION_IDS.regionalTable],
      requiredAssumptionIds: [],
    },
    {
      id: POP0_I2_ASSESSMENT_RULE_IDS.supplierAssumptionSupportsPlausibility,
      propositionId: POP0_I2_COMMON_PROPOSITION_ID,
      judgment: "PLAUSIBLE_UNDER_STATED_SUPPLIER_ASSUMPTION",
      evidenceRequirement: "SUBSTANTIVE_RECEIPT",
      requiredSectionIds: [POP0_I2_SOURCE_SECTION_IDS.summary, POP0_I2_SOURCE_SECTION_IDS.regionalTable],
      requiredAssumptionIds: [POP0_I2_SUPPLIER_ASSUMPTION_ID],
    },
    {
      id: POP0_I2_ASSESSMENT_RULE_IDS.metadataCannotSupportEstimate,
      propositionId: "fiscal-consequences-estimable-from-current-record",
      judgment: "NOT_ESTIMABLE_FROM_CURRENTLY_AVAILABLE_EVIDENCE",
      evidenceRequirement: "METADATA_WITH_FAILED_RETRIEVAL",
      requiredSectionIds: [],
      requiredAssumptionIds: [],
    },
    {
      id: POP0_I4_IDS.housingAssessmentRule,
      propositionId: "inherited-housing-implementation-problem-requires-bounded-follow-up",
      judgment: "SUPPORTED_BY_CLAIM_LINEAGED_HOUSING_MONITORING",
      evidenceRequirement: "SUBSTANTIVE_RECEIPT",
      requiredSectionIds: [...POP0_I4_MONITORING_SECTION_IDS],
      requiredAssumptionIds: [],
    },
    {
      id: "pop0.assessment-rule.hhs.rural-maternity-service-access",
      propositionId: "bounded-rural-maternity-service-access-follow-up-is-warranted",
      judgment: "SUPPORTED_BY_CLAIM_SCOPED_HHS_ANALYSIS",
      evidenceRequirement: "SUBSTANTIVE_RECEIPT",
      requiredSectionIds: ["scope", "finding", "limitations"],
      requiredAssumptionIds: [],
    },
    {
      id: "pop0.assessment-rule.legislative-affairs.congressional-opportunity",
      propositionId: "regional-employment-initiative-has-a-live-bounded-procedural-opportunity",
      judgment: "SUPPORTED_BY_CONGRESS_OWNED_INITIATIVE_AND_OPPORTUNITY_DELIVERY",
      evidenceRequirement: "SUBSTANTIVE_RECEIPT",
      requiredSectionIds: ["initiative", "window", "limitations"],
      requiredAssumptionIds: [],
    },
  ],
  recipientCapabilities: [
    {
      kind: "ANALYSIS_CAPABILITY",
      id: POP0_I3_RECIPIENT_CAPABILITY_IDS.ombAnalysis,
      recipientOfficeId: POP0_I2_OFFICE_IDS.omb,
      instrumentKind: "REQUEST_OFFICE_ANALYSIS",
      effectiveFrom: POP0_V0_EPOCH,
      effectiveUntil: null,
      authorityReference: POP0_V0_PROVENANCE_ROOT,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
      mayNarrow: true,
      permittedProductKinds: [
        "FISCAL_SUPPORTABILITY_SCOPING",
        "METADATA_ACCESS_GAP_SCOPING",
        "FULL_REGIONAL_EMPLOYMENT_CONGRESSIONAL_ANALYSIS",
        "NARROW_EMPLOYMENT_COMMITTEE_BRIEF",
        "FULL_HOUSING_IMPLEMENTATION_REVIEW",
        "NARROW_HOUSING_IMPLEMENTATION_ACCESS_GAP_MEMO",
      ],
      permittedSubjectScopeFamilies: [
        "PRELIMINARY_LABOR_EVIDENCE_REVIEW",
        "REGIONAL_EMPLOYMENT_CONGRESSIONAL_WINDOW",
        "INHERITED_HOUSING_IMPLEMENTATION",
      ],
      maximumSectionCount: 3,
      permittedLessClaimingProductKinds: [
        "METADATA_ACCESS_GAP_SCOPING",
        "NARROW_EMPLOYMENT_COMMITTEE_BRIEF",
        "NARROW_HOUSING_IMPLEMENTATION_ACCESS_GAP_MEMO",
      ],
    },
    {
      kind: "COORDINATION_CAPABILITY",
      id: POP0_I3_RECIPIENT_CAPABILITY_IDS.chiefOfStaffCoordination,
      recipientOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      instrumentKind: "REQUEST_WORKSTREAM_COORDINATION",
      effectiveFrom: POP0_V0_EPOCH,
      effectiveUntil: null,
      authorityReference: POP0_V0_PROVENANCE_ROOT,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
      mayNarrow: true,
      permittedWorkstreamIds: [POP0_I3_WORKSTREAM_ID],
      permittedCoordinationActionKinds: [
        "TRACK_RECIPIENT_DISPOSITIONS",
        "COORDINATE_FOLLOW_UP",
      ],
      maximumParticipatingOfficeCount: 2,
      maximumReviewHorizonHours: 72,
    },
    {
      kind: "ANALYSIS_CAPABILITY",
      id: POP0_I4_IDS.hudCapability,
      recipientOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
      instrumentKind: "REQUEST_OFFICE_ANALYSIS",
      effectiveFrom: POP0_V0_EPOCH,
      effectiveUntil: null,
      authorityReference: POP0_I4_IDS.handlingAuthority,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
      mayNarrow: true,
      permittedProductKinds: ["HUD_SUPPLEMENTAL_RECORD_OPTIONS", "HUD_SUPPLEMENTAL_RECORD"],
      permittedSubjectScopeFamilies: ["INHERITED_HOUSING_IMPLEMENTATION"],
      maximumSectionCount: 4,
      permittedLessClaimingProductKinds: ["HUD_SUPPLEMENTAL_RECORD_OPTIONS"],
    },
    {
      kind: "COORDINATION_CAPABILITY",
      id: POP0_I4_IDS.chiefOfStaffCapability,
      recipientOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      instrumentKind: "REQUEST_WORKSTREAM_COORDINATION",
      effectiveFrom: POP0_V0_EPOCH,
      effectiveUntil: null,
      authorityReference: POP0_I4_IDS.housingStandingAuthority,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
      mayNarrow: true,
      permittedWorkstreamIds: [POP0_I4_IDS.housingWorkstream],
      permittedCoordinationActionKinds: ["TRACK_RECIPIENT_DISPOSITIONS", "COORDINATE_FOLLOW_UP"],
      maximumParticipatingOfficeCount: 2,
      maximumReviewHorizonHours: 72,
    },
    {
      kind: "ANALYSIS_CAPABILITY",
      id: "pop0.capability.hhs.rural-maternity-analysis",
      recipientOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHhs,
      instrumentKind: "REQUEST_OFFICE_ANALYSIS",
      effectiveFrom: POP0_V0_EPOCH,
      effectiveUntil: null,
      authorityReference: POP0_V0_PROVENANCE_ROOT,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
      mayNarrow: true,
      permittedProductKinds: ["RURAL_MATERNITY_ACCESS_SCOPING", "MATERNITY_MONITORING_GAP_MEMO"],
      permittedSubjectScopeFamilies: ["RURAL_MATERNITY_SERVICE_ACCESS"],
      maximumSectionCount: 2,
      permittedLessClaimingProductKinds: ["MATERNITY_MONITORING_GAP_MEMO"],
    },
    {
      kind: "LEGISLATIVE_POSITION_CAPABILITY",
      id: "pop0.capability.legislative-affairs.regional-employment-position",
      recipientOfficeId: POP0_I2_OFFICE_IDS.legislativeAffairs,
      instrumentKind: "AUTHORIZE_LEGISLATIVE_POSITION",
      effectiveFrom: POP0_V0_EPOCH,
      effectiveUntil: null,
      authorityReference: POP0_V0_PROVENANCE_ROOT,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
      mayNarrow: false,
      permittedInitiativeIds: ["pop0.proposal.regional-employment-stabilization"],
      proposalVersionRule: "CURRENT_CANONICAL_VERSION_AT_PREVIEW",
      permittedPositionKinds: ["SUPPORT_AS_INTRODUCED", "OPPOSE", "NEGOTIATE_EXACT_TERMS"],
      permittedNegotiableTermIds: ["appropriation_magnitude", "recipient_flexibility"],
      maximumNegotiableTermCount: 2,
      lessCommittingPositionAllowed: false,
    },
    {
      kind: "INTERGOVERNMENTAL_CONTACT_CAPABILITY",
      id: "pop0.capability.intergovernmental-affairs.bounded-contact",
      recipientOfficeId: POP0_I2_OFFICE_IDS.intergovernmentalAffairs,
      instrumentKind: "REQUEST_INTERGOVERNMENTAL_CONTACT",
      effectiveFrom: POP0_V0_EPOCH,
      effectiveUntil: null,
      authorityReference: POP0_V0_PROVENANCE_ROOT,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
      mayNarrow: true,
      permittedGovernorIds: ["pop0.actor.governor.nia-porter", "pop0.actor.governor.evan-rusk", "pop0.actor.governor.celeste-warren"],
      permittedPurposeFamilies: ["REGIONAL_EMPLOYMENT_RESPONSE", "RURAL_MATERNITY_SERVICE_ACCESS"],
      maximumRecipientCount: 3,
      maximumTalkingPointCount: 4,
      prohibitedCommitmentKinds: ["PROMISE_FUNDING", "LEGAL_COMMITMENT", "GUARANTEE_STATE_OUTCOME"],
      permittedNarrowing: "REMOVE_RECIPIENTS_OR_TALKING_POINTS_ONLY",
    },
    {
      kind: "PUBLIC_STATEMENT_CAPABILITY",
      id: "pop0.capability.communications.bounded-public-statement",
      recipientOfficeId: POP0_I2_OFFICE_IDS.communications,
      instrumentKind: "AUTHORIZE_PUBLIC_STATEMENT",
      effectiveFrom: POP0_V0_EPOCH,
      effectiveUntil: null,
      authorityReference: POP0_V0_PROVENANCE_ROOT,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
      mayNarrow: true,
      permittedSubjectFamilies: ["REGIONAL_EMPLOYMENT_AND_CONGRESS", "RURAL_MATERNITY_SERVICE_ACCESS"],
      maximumClaimCount: 4,
      requiresPresentedSourceLineage: true,
      prohibitedUnsupportedClaimFamilies: ["PROMISE_OUTCOME", "UNSUPPORTED_CAUSAL_CLAIM"],
      maximumReleaseWindowHours: 48,
      permittedNarrowing: "REMOVE_CLAIMS_ONLY",
    },
    {
      kind: "COORDINATION_CAPABILITY",
      id: "pop0.capability.omb.review-queue-coordination",
      recipientOfficeId: POP0_I2_OFFICE_IDS.omb,
      instrumentKind: "REQUEST_WORKSTREAM_COORDINATION",
      effectiveFrom: POP0_V0_EPOCH,
      effectiveUntil: null,
      authorityReference: POP0_V0_PROVENANCE_ROOT,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
      mayNarrow: true,
      permittedWorkstreamIds: [
        POP0_I3_WORKSTREAM_ID,
        POP0_I4_IDS.housingWorkstream,
        "pop0.workstream.regional-employment-congressional-engagement",
      ],
      permittedCoordinationActionKinds: [
        "REPRIORITIZE_OMB_REVIEW_QUEUE",
        "SUPERSEDE_WITH_PERMITTED_NARROW_PRODUCT",
      ],
      maximumParticipatingOfficeCount: 2,
      maximumReviewHorizonHours: 336,
    },
  ],
};

const intervention: PresidentialInterventionConfiguration = {
  ownerIds: POP0_I3_OWNER_IDS,
  historyId: POP0_I3_HISTORY_ID,
  controlBinding: {
    id: POP0_I3_CONTROL_BINDING_ID,
    decisionSurface: PRESIDENTIAL_OPERATING_DECISION_SURFACE,
  },
  standingCoordinationAuthorities: [
    {
      id: POP0_I3_STANDING_COORDINATION_AUTHORITY_ID,
      officeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      effectiveFrom: POP0_V0_EPOCH,
      effectiveUntil: null,
      permittedWorkstreamIds: [POP0_I3_WORKSTREAM_ID],
      permittedStatuses: [
        "MONITORED", "ACTIVE", "DELEGATED", "PAUSED", "BLOCKED", "COMPLETED", "ABANDONED",
      ],
      authorityReference: POP0_V0_PROVENANCE_ROOT,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    },
    {
      id: POP0_I4_IDS.housingStandingAuthority,
      officeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      effectiveFrom: POP0_V0_EPOCH,
      effectiveUntil: null,
      permittedWorkstreamIds: [POP0_I4_IDS.housingWorkstream],
      permittedStatuses: [
        "MONITORED", "ACTIVE", "DELEGATED", "PAUSED", "BLOCKED", "COMPLETED", "ABANDONED",
      ],
      authorityReference: POP0_V0_PROVENANCE_ROOT,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    },
    {
      id: "pop0.authority.chief-of-staff.regional-employment-congressional-engagement",
      officeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      effectiveFrom: POP0_V0_EPOCH,
      effectiveUntil: null,
      permittedWorkstreamIds: ["pop0.workstream.regional-employment-congressional-engagement"],
      permittedStatuses: [
        "MONITORED", "ACTIVE", "DELEGATED", "PAUSED", "BLOCKED", "COMPLETED", "ABANDONED",
      ],
      authorityReference: POP0_V0_PROVENANCE_ROOT,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    },
    {
      id: "pop0.authority.chief-of-staff.rural-maternity-service-access-review",
      officeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      effectiveFrom: POP0_V0_EPOCH,
      effectiveUntil: null,
      permittedWorkstreamIds: ["pop0.workstream.rural-maternity-service-access-review"],
      permittedStatuses: [
        "MONITORED", "ACTIVE", "DELEGATED", "PAUSED", "BLOCKED", "COMPLETED", "ABANDONED",
      ],
      authorityReference: POP0_V0_PROVENANCE_ROOT,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    },
  ],
  escalationEligibilityRules: [
    {
      id: POP0_I3_ESCALATION_RULE_ID,
      initiatingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      standingAuthorityId: POP0_I3_STANDING_COORDINATION_AUTHORITY_ID,
      requiredBasisKind: "SYNTHESIS_CONFLICT",
      requiredCommonPropositionId: POP0_I2_COMMON_PROPOSITION_ID,
      requiredShownSynthesisSectionCount: 2,
      requiredOptionKinds: [
        "REQUEST_SCOPED_ANALYSIS_AND_COORDINATION",
        "RESERVE_PRESIDENTIAL_REVIEW",
        "ALLOW_MONITORING_DEFAULT",
      ],
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    },
    {
      id: POP0_I4_IDS.housingEscalationRule,
      initiatingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      standingAuthorityId: POP0_I4_IDS.housingStandingAuthority,
      requiredBasisKind: "RECEIPT",
      requiredWorkstreamId: POP0_I4_IDS.housingWorkstream,
      requiredSourceArtifactId: POP0_I4_IDS.housingAssessment,
      requiredSourceArtifactKind: "ASSESSMENT",
      requiredAssessmentRuleId: POP0_I4_IDS.housingAssessmentRule,
      requiredProducingOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
      requiredReceivingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      requiredSemanticSectionIds: [...POP0_I4_ASSESSMENT_SECTION_IDS],
      requiredOptionKinds: [
        "REQUEST_SCOPED_ANALYSIS_AND_COORDINATION",
        "RESERVE_PRESIDENTIAL_REVIEW",
        "ALLOW_MONITORING_DEFAULT",
      ],
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    },
    {
      id: "pop0.escalation-rule.congressional-opportunity-receipt",
      initiatingOfficeId: POP0_I2_OFFICE_IDS.legislativeAffairs,
      standingAuthorityId: "pop0.authority.chief-of-staff.regional-employment-congressional-engagement",
      requiredBasisKind: "RECEIPT",
      requiredWorkstreamId: "pop0.workstream.regional-employment-congressional-engagement",
      requiredSourceArtifactId: "pop0.artifact.legislative-affairs.congressional-opportunity-assessment",
      requiredSourceArtifactKind: "ASSESSMENT",
      requiredAssessmentRuleId: "pop0.assessment-rule.legislative-affairs.congressional-opportunity",
      requiredProducingOfficeId: POP0_I2_OFFICE_IDS.legislativeAffairs,
      requiredReceivingOfficeId: POP0_I2_OFFICE_IDS.legislativeAffairs,
      requiredSemanticSectionIds: ["initiative", "window", "limitations"],
      requiredOptionKinds: [
        "REQUEST_SCOPED_ANALYSIS_AND_COORDINATION",
        "AUTHORIZE_LEGISLATIVE_POSITION_OPTION",
        "REQUEST_INTERGOVERNMENTAL_CONTACT_OPTION",
        "AUTHORIZE_PUBLIC_STATEMENT_OPTION",
        "RESERVE_PRESIDENTIAL_REVIEW",
        "ALLOW_MONITORING_DEFAULT",
      ],
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    },
    {
      id: "pop0.escalation-rule.quiet-service-access-assessment",
      initiatingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      standingAuthorityId: "pop0.authority.chief-of-staff.rural-maternity-service-access-review",
      requiredBasisKind: "RECEIPT",
      requiredWorkstreamId: "pop0.workstream.rural-maternity-service-access-review",
      requiredSourceArtifactId: "pop0.artifact.hhs.rural-maternity-access-assessment",
      requiredSourceArtifactKind: "ASSESSMENT",
      requiredAssessmentRuleId: "pop0.assessment-rule.hhs.rural-maternity-service-access",
      requiredProducingOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHhs,
      requiredReceivingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      requiredSemanticSectionIds: ["scope", "finding", "limitations"],
      requiredOptionKinds: [
        "REQUEST_INTERGOVERNMENTAL_CONTACT_OPTION",
        "AUTHORIZE_PUBLIC_STATEMENT_OPTION",
        "RESERVE_PRESIDENTIAL_REVIEW",
        "ALLOW_MONITORING_DEFAULT",
      ],
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    },
  ],
  workstreamDefinitions: [
    {
      id: POP0_I3_WORKSTREAM_ID,
      label: "Preliminary Labor Evidence Review",
      adoptedObjective:
        "Coordinate bounded follow-up on the accepted preliminary Labor disagreement and OMB access gap",
      coordinatorOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      participatingOfficeIds: [
        POP0_I2_OFFICE_IDS.chiefOfStaff,
        POP0_I2_OFFICE_IDS.omb,
      ],
    },
    {
      id: POP0_I4_IDS.housingWorkstream,
      label: "Inherited Housing Implementation",
      adoptedObjective: "Monitor and coordinate the bounded inherited Housing implementation route",
      coordinatorOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      participatingOfficeIds: [
        POP0_I2_OFFICE_IDS.chiefOfStaff,
        POP0_I2_OFFICE_IDS.secretaryOfHud,
      ],
    },
    {
      id: "pop0.workstream.regional-employment-congressional-engagement",
      label: "Regional Employment and Congressional Engagement",
      adoptedObjective: "Coordinate bounded administration handling after the autonomous initiative exists",
      coordinatorOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      participatingOfficeIds: [
        POP0_I2_OFFICE_IDS.chiefOfStaff,
        POP0_I2_OFFICE_IDS.legislativeAffairs,
        POP0_I2_OFFICE_IDS.omb,
      ],
    },
    {
      id: "pop0.workstream.rural-maternity-service-access-review",
      label: "Rural Maternity Service Access Review",
      adoptedObjective: "Coordinate only legitimately received HHS service-access evidence",
      coordinatorOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      participatingOfficeIds: [
        POP0_I2_OFFICE_IDS.chiefOfStaff,
        POP0_I2_OFFICE_IDS.secretaryOfHhs,
      ],
    },
  ],
  provenanceReference: POP0_V0_PROVENANCE_ROOT,
};

const activeLegislativeAssignments = US_V0_I5_STRUCTURE.assignments.filter((assignment) => {
  const office = US_V0_I5_STRUCTURE.offices.find((entry) => entry.id === assignment.officeId);
  return assignment.currentAtScenarioStart && office?.kind === "LEGISLATIVE_MEMBER";
});
const namedCongressionalHumans = [
  "Miriam Holt", "Adrian Bell", "Ruth Calder", "Samuel Price", "Lena Brooks", "Thomas Webb",
] as const;
const externalDisplayNames = new Map<string, string>(activeLegislativeAssignments.slice(0, 6)
  .map((assignment, index) => [assignment.actorId, namedCongressionalHumans[index]] as const));
const governorRecords = [
  ["pop0.external-actor.governor-ohio", "pop0.actor.governor.nia-porter", "Nia Porter", 5, 4, 3, 9,
    "ISSUE_PUBLIC_COMMUNICATION"],
  ["pop0.external-actor.governor-michigan", "pop0.actor.governor.evan-rusk", "Evan Rusk", 4, 2, 1, 9,
    "DEFER"],
  ["pop0.external-actor.governor-pennsylvania", "pop0.actor.governor.celeste-warren", "Celeste Warren", 5, 3, 4, 9,
    "CONTACT_ADMINISTRATION"],
] as const;
const externalPermittedJoins: I5HumanIdentityLinkage["permittedJoins"] = [
  "ACTOR_IDENTITY", "PUBLIC_ROLE_OR_OFFICE", "CONSTITUENCY_JURISDICTION",
  "COMMUNICATION", "INFORMATION_RECEIPT", "ACTION_RECORD",
];
const externalProhibitedJoins: I5HumanIdentityLinkage["prohibitedJoins"] = [
  "RESIDENCE", "HOUSEHOLD", "DEMOGRAPHIC", "MATERIAL_EXPOSURE", "PUBLIC_BELIEF",
  "VOTER", "ELIGIBILITY", "PERSONAL_LIFECYCLE",
];
const externalHumanRegistryEntries: I5HumanIdentityLinkage[] = [
  ...activeLegislativeAssignments.map((assignment) => ({
    actorId: assignment.actorId,
    displayName: externalDisplayNames.get(assignment.actorId) ?? `Supporting legislative actor ${assignment.actorId}`,
    effectiveFrom: POP0_V0_EPOCH,
    effectiveUntil: null,
    status: "OUTSIDE_MODELED_ORDINARY_POPULATION_SCOPE" as const,
    populationWeight: 0 as const,
    permittedJoins: externalPermittedJoins,
    prohibitedJoins: externalProhibitedJoins,
    roleOrOfficeIds: [assignment.officeId],
    constituencyJurisdictionIds: [],
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  })),
  ...governorRecords.map(([, actorId, displayName], index) => ({
    actorId,
    displayName,
    effectiveFrom: POP0_V0_EPOCH,
    effectiveUntil: null,
    status: "OUTSIDE_MODELED_ORDINARY_POPULATION_SCOPE" as const,
    populationWeight: 0 as const,
    permittedJoins: externalPermittedJoins,
    prohibitedJoins: externalProhibitedJoins,
    roleOrOfficeIds: [`pop0.role.governor.${["ohio", "michigan", "pennsylvania"][index]}`],
    constituencyJurisdictionIds: [`pop0.jurisdiction.${["ohio", "michigan", "pennsylvania"][index]}`],
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  })),
];

const employmentSectionIds = ["regional-stock-flow", "plant-overlay", "methods-and-limitations"] as const;
const employmentArtifactKinds = [
  "EMPLOYER_CLOSURE_NOTICE",
  "PRELIMINARY_REGIONAL_EMPLOYMENT_ESTIMATE",
  "REVISED_REGIONAL_EMPLOYMENT_ESTIMATE",
  "MODELED_HOUSEHOLD_INCOME_IMPACT",
  "MODELED_HEALTHCARE_COVERAGE_RISK",
] as const;
const employmentObservationAuthorityId = "pop0.observation-authority.labor.regional-employment";
const concurrentWorld: ConcurrentWorldConfiguration = {
  schemaVersion: PRESIDENTIAL_CONCURRENT_WORLD_SCHEMA_VERSION,
  ownerIds: {
    regionalEmployment: "pop0.owner.regional-employment",
    congressionalInitiative: "pop0.owner.congressional-initiative",
    externalActors: "pop0.owner.external-actors",
    boundedMedia: "pop0.owner.bounded-media",
    maternityServiceAccess: "pop0.owner.maternity-service-access",
    presidentialInquiries: "pop0.owner.presidential-inquiries",
  },
  humanRegistry: {
    id: "pop0.registry.i5-external-humans",
    entries: externalHumanRegistryEntries,
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  },
  domainObservationAuthorities: [
    {
      id: employmentObservationAuthorityId,
      observingInstitutionId: POP0_I2_INSTITUTION_IDS.labor,
      sourceOwnerId: "pop0.owner.regional-employment",
      permittedRecordKinds: ["EMPLOYER_CLOSURE_DECISION", "PLANT_SEPARATION", "ORDINARY_GROSS_FLOW", "SUPPLIER_CONTRACTION"],
      permittedClaimFamilies: [...employmentArtifactKinds],
      permittedFieldPaths: ["cells.*.currentEmployed", "materialOccurrences.*"],
      geographyOrEntityIds: ["OHIO_MANUFACTURING", "MICHIGAN_MANUFACTURING", "PENNSYLVANIA_SUPPLIER_LOGISTICS", "REST_OF_NATION"],
      artifactKinds: [...employmentArtifactKinds],
      effectiveFrom: POP0_V0_EPOCH,
      effectiveUntil: null,
      authorityReference: POP0_V0_PROVENANCE_ROOT,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    },
    {
      id: "pop0.observation-authority.hhs.rural-maternity-service-access",
      observingInstitutionId: POP0_I2_INSTITUTION_IDS.hhs,
      sourceOwnerId: "pop0.owner.maternity-service-access",
      permittedRecordKinds: ["SERVICE_WITHDRAWAL", "ACCESS_BURDEN_RECONCILED"],
      permittedClaimFamilies: ["MATERNITY_MONITORING_GAP_MEMO", "RURAL_MATERNITY_ACCESS_SCOPING"],
      permittedFieldPaths: ["effectiveCapacity", "currentTravelBurdenMinutes"],
      geographyOrEntityIds: ["pop0.service-area.rural-ohio-northwest"],
      artifactKinds: ["MATERNITY_MONITORING_GAP_MEMO", "RURAL_MATERNITY_ACCESS_SCOPING"],
      effectiveFrom: POP0_V0_EPOCH,
      effectiveUntil: null,
      authorityReference: POP0_V0_PROVENANCE_ROOT,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    },
  ],
  employment: {
    ownerId: "pop0.owner.regional-employment",
    cells: [
      { id: "OHIO_MANUFACTURING", openingEmployed: 180000,
        ordinaryHiresByBoundary: { "2029-02-12T08:00:00-05:00": 110, "2029-02-26T08:00:00-05:00": 95, "2029-03-12T08:00:00-04:00": 105 },
        ordinarySeparationsByBoundary: { "2029-02-12T08:00:00-05:00": 170, "2029-02-26T08:00:00-05:00": 180, "2029-03-12T08:00:00-04:00": 175 },
        provenanceReference: POP0_V0_PROVENANCE_ROOT },
      { id: "MICHIGAN_MANUFACTURING", openingEmployed: 220000,
        ordinaryHiresByBoundary: { "2029-02-12T08:00:00-05:00": 150, "2029-02-26T08:00:00-05:00": 145, "2029-03-12T08:00:00-04:00": 140 },
        ordinarySeparationsByBoundary: { "2029-02-12T08:00:00-05:00": 165, "2029-02-26T08:00:00-05:00": 170, "2029-03-12T08:00:00-04:00": 180 },
        provenanceReference: POP0_V0_PROVENANCE_ROOT },
      { id: "PENNSYLVANIA_SUPPLIER_LOGISTICS", openingEmployed: 95000,
        ordinaryHiresByBoundary: { "2029-02-12T08:00:00-05:00": 70, "2029-02-26T08:00:00-05:00": 65, "2029-03-12T08:00:00-04:00": 60 },
        ordinarySeparationsByBoundary: { "2029-02-12T08:00:00-05:00": 75, "2029-02-26T08:00:00-05:00": 80, "2029-03-12T08:00:00-04:00": 90 },
        provenanceReference: POP0_V0_PROVENANCE_ROOT },
      { id: "REST_OF_NATION", openingEmployed: 150000000,
        ordinaryHiresByBoundary: { "2029-02-12T08:00:00-05:00": 80000, "2029-02-26T08:00:00-05:00": 79000, "2029-03-12T08:00:00-04:00": 81000 },
        ordinarySeparationsByBoundary: { "2029-02-12T08:00:00-05:00": 79500, "2029-02-26T08:00:00-05:00": 80500, "2029-03-12T08:00:00-04:00": 82000 },
        provenanceReference: POP0_V0_PROVENANCE_ROOT },
    ],
    closurePlan: {
      id: "pop0.employer-occurrence.lake-erie-components.closure-decision",
      employerInstitutionId: "pop0.employer.lake-erie-components",
      facilityId: "pop0.facility.lake-erie-components-ohio",
      affectedCellId: "OHIO_MANUFACTURING",
      decisionEffectiveAt: "2029-01-31T17:00:00-05:00",
      totalHeadcount: 900,
      tranches: [
        { id: "lake-erie-tranche-1", occursAt: "2029-02-12T08:00:00-05:00", headcount: 300 },
        { id: "lake-erie-tranche-2", occursAt: "2029-02-26T08:00:00-05:00", headcount: 300 },
        { id: "lake-erie-tranche-3", occursAt: "2029-03-12T08:00:00-04:00", headcount: 300 },
      ],
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    },
    supplierExposure: {
      sourceCellId: "OHIO_MANUFACTURING", targetCellId: "PENNSYLVANIA_SUPPLIER_LOGISTICS",
      triggerCumulativePlantSeparations: 600, numerator: 1, denominator: 10,
      occurrenceId: "pop0.employment-occurrence.pennsylvania-supplier-contraction",
    },
    releaseOpportunities: employmentArtifactKinds.map((domainEvidenceKind, index) => ({
      id: `pop0.employment-release-opportunity.${domainEvidenceKind.toLowerCase()}`,
      artifactId: `pop0.artifact.labor.${domainEvidenceKind.toLowerCase()}`,
      domainEvidenceKind,
      opensAt: [
        "2029-02-07T09:00:00-05:00", "2029-02-16T08:30:00-05:00",
        "2029-03-16T08:30:00-04:00", "2029-02-17T09:00:00-05:00",
        "2029-02-18T09:00:00-05:00",
      ][index],
      observationAuthorityId: employmentObservationAuthorityId,
      sectionIds: [...employmentSectionIds],
      accessClass: "POP0_I5_REGIONAL_EMPLOYMENT_EVIDENCE",
      analysisOnly: index >= 3,
      revisionOfArtifactId: index === 2 ? "pop0.artifact.labor.preliminary_regional_employment_estimate" : null,
      supersedesArtifactId: index === 2 ? "pop0.artifact.labor.preliminary_regional_employment_estimate" : null,
    })),
    producerInstitutionId: POP0_I2_INSTITUTION_IDS.labor,
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  },
  congress: {
    ownerId: "pop0.owner.congressional-initiative",
    initiativeId: "pop0.proposal.regional-employment-stabilization",
    legislativeRuntimeReference: "pop0.legislative-runtime.regional-employment-stabilization",
    structure: US_V0_I5_STRUCTURE,
    seed: {
      ...US_V0_LEGISLATIVE_SEED,
      proposal: {
        ...US_V0_LEGISLATIVE_SEED.proposal,
        id: "pop0.proposal.regional-employment-stabilization",
        title: "Regional Employment Stabilization Initiative",
      },
    },
    formationOpportunity: {
      id: "pop0.congress-opportunity.regional-employment-formation",
      opensAt: "2029-02-16T08:30:00-05:00",
      closesAt: "2029-02-19T09:00:00-05:00",
      issueTemplateId: "pop0.issue.regional-employment-stabilization",
      draftTextTemplateHash: sha256Hex("regional-employment-stabilization-v1"),
      requiredArtifactId: "pop0.artifact.labor.preliminary_regional_employment_estimate",
      requiredSectionIds: [...employmentSectionIds],
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    },
    procedureOpportunity: {
      id: "pop0.congress-opportunity.regional-employment-procedure-window",
      opensAt: "2029-02-19T09:00:00-05:00",
      closesAt: "2029-03-03T17:00:00-05:00",
      permittedTransitionKinds: [
        "BEGIN_SPONSOR_SEARCH", "SEEK_MEMBER_SPONSORSHIP", "INTRODUCE_SPONSORED_PROPOSAL",
        "ADVANCE_INTRODUCED_PROPOSAL_TO_CONSIDERATION_GATE",
      ],
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    },
    formationActorId: activeLegislativeAssignments[0].actorId,
    sponsorActorId: activeLegislativeAssignments[1].actorId,
    refusingSponsorActorId: activeLegislativeAssignments[2].actorId,
    formationObjectiveScore: 8,
    formationThreshold: 5,
    transitionAuthorityKinds: [
      "BEGIN_SPONSOR_SEARCH", "SEEK_MEMBER_SPONSORSHIP", "INTRODUCE_SPONSORED_PROPOSAL",
      "ADVANCE_INTRODUCED_PROPOSAL_TO_CONSIDERATION_GATE",
    ],
    evidenceDeliveryAt: "2029-02-16T09:00:00-05:00",
    administrationEvidenceDelivery: {
      id: "pop0.delivery-authority.congress-to-legislative-affairs.bounded-opportunity",
      artifactId: "pop0.artifact.congress.regional-employment-initiative-opportunity",
      recipientOfficeId: POP0_I2_OFFICE_IDS.legislativeAffairs,
      deliveredAt: "2029-02-16T10:00:00-05:00",
      sectionIds: ["initiative", "window", "limitations"],
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    },
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  },
  externalActors: [
    ...governorRecords.map(([id, humanActorId, label, objectiveScore, resourceScore, relationshipScore,
      actionThreshold, preferredActionKind]) => ({
      id, kind: "GOVERNOR" as const, humanActorId, label,
      capabilityActionKinds: ["ISSUE_PUBLIC_COMMUNICATION", "CONTACT_ADMINISTRATION", "DEFER", "NO_ACTION"] as const,
      preferredActionKind, objectiveScore, resourceScore, relationshipScore, actionThreshold,
      opportunityAt: "2029-02-22T10:00:00-05:00", closesAt: "2029-02-24T17:00:00-05:00",
      evidenceAccess: id.includes("michigan") ? "NONE" as const : "SUBSTANTIVE" as const,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    })),
    {
      id: "pop0.organization.great-lakes-workers-alliance", kind: "LABOR_ORGANIZATION", humanActorId: null,
      label: "Great Lakes Workers Alliance",
      capabilityActionKinds: ["COORDINATE_MEMBERS", "CONTACT_CONGRESS", "DEFER", "NO_ACTION"],
      preferredActionKind: "COORDINATE_MEMBERS", objectiveScore: 5, resourceScore: 4, relationshipScore: 2,
      actionThreshold: 8, opportunityAt: "2029-02-21T10:00:00-05:00", closesAt: "2029-02-24T17:00:00-05:00",
      evidenceAccess: "SUBSTANTIVE", provenanceReference: POP0_V0_PROVENANCE_ROOT,
    },
    {
      id: "pop0.organization.regional-manufacturers-council", kind: "INDUSTRY_ORGANIZATION", humanActorId: null,
      label: "Regional Manufacturers Council",
      capabilityActionKinds: ["ISSUE_PUBLIC_COMMUNICATION", "CONTACT_CONGRESS", "DEFER", "NO_ACTION"],
      preferredActionKind: "DEFER", objectiveScore: 2, resourceScore: 4, relationshipScore: 1,
      actionThreshold: 10, opportunityAt: "2029-02-21T10:00:00-05:00", closesAt: "2029-02-24T17:00:00-05:00",
      evidenceAccess: "METADATA_ONLY", provenanceReference: POP0_V0_PROVENANCE_ROOT,
    },
  ],
  mediaOutlets: [
    {
      id: "pop0.media.lake-states-ledger", label: "Lake States Ledger", access: "SUBSTANTIVE",
      editorialPriority: 5, investigativeResources: 4, publicationThreshold: 8,
      opportunityAt: "2029-02-20T09:00:00-05:00", closesAt: "2029-02-23T17:00:00-05:00",
      distributionRecipientIds: ["pop0.audience.regional-subscribers"],
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    },
    {
      id: "pop0.media.national-economic-desk", label: "National Economic Desk", access: "METADATA_ONLY",
      editorialPriority: 3, investigativeResources: 2, publicationThreshold: 8,
      opportunityAt: "2029-02-20T09:00:00-05:00", closesAt: "2029-02-23T17:00:00-05:00",
      distributionRecipientIds: ["pop0.audience.national-wire"],
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    },
  ],
  maternityServiceAccess: {
    ownerId: "pop0.owner.maternity-service-access",
    facilityId: "pop0.facility.rural-maternity-northwest-ohio",
    serviceAreaId: "pop0.service-area.rural-ohio-northwest",
    openingCapacity: 1200,
    withdrawnCapacity: 300,
    catchmentCount: 18000,
    openingTravelBurdenMinutes: 34,
    withdrawalOccurredAt: "2029-02-01T08:00:00-05:00",
    burdenReconciliationAt: "2029-02-20T08:00:00-05:00",
    reconciledTravelBurdenMinutes: 57,
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  },
  presidentialInquiryOpportunities: [{
    id: "pop0.presidential-inquiry.rural-maternity-service-access",
    subjectFamily: "RURAL_MATERNITY_SERVICE_ACCESS",
    sourceKind: "GENERAL_SERVICE_ACCESS_QUESTION",
    sourcePresidentialPresentationId: null,
    shownMetadataSectionIds: [],
    generalQuestion: "Ask HHS to assess nationwide rural maternity-service monitoring coverage and gaps.",
    typedScope: "NATIONWIDE_RURAL_MATERNITY_SERVICE_MONITORING",
    allowedRecipientOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHhs,
    allowedInstrumentKind: "REQUEST_OFFICE_ANALYSIS",
    allowedProductKinds: ["RURAL_MATERNITY_ACCESS_SCOPING", "MATERNITY_MONITORING_GAP_MEMO"],
    effectiveFrom: "2029-02-18T08:00:00-05:00",
    deadline: "2029-03-10T17:00:00-05:00",
    authorityReference: POP0_V0_PROVENANCE_ROOT,
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  }],
  ombReviewCapacity: {
    officeId: POP0_I2_OFFICE_IDS.omb,
    teamId: "pop0.office-team.omb.economic-implementation-review",
    periods: [
      ["P1", "2029-02-19T09:00:00-05:00", "2029-02-20T17:00:00-05:00"],
      ["P2", "2029-02-20T17:00:00-05:00", "2029-02-21T17:00:00-05:00"],
      ["P3", "2029-02-21T17:00:00-05:00", "2029-02-22T17:00:00-05:00"],
      ["P4", "2029-02-22T17:00:00-05:00", "2029-02-23T09:00:00-05:00"],
      ["P5", "2029-02-23T09:00:00-05:00", "2029-02-27T09:00:00-05:00"],
      ["P6", "2029-02-27T09:00:00-05:00", "2029-02-28T09:00:00-05:00"],
      ["P7", "2029-02-28T09:00:00-05:00", "2029-03-01T18:00:00-05:00"],
      ["P8", "2029-03-01T18:00:00-05:00", "2029-03-02T18:00:00-05:00"],
      ["P9", "2029-03-02T18:00:00-05:00", "2029-03-04T17:00:00-05:00"],
    ].map(([id, startsAt, endsAt]) => ({
      id: `pop0.omb-work-period.${id}`, teamId: "pop0.office-team.omb.economic-implementation-review",
      startsAt, endsAt, provenanceReference: POP0_V0_PROVENANCE_ROOT,
    })),
    productPeriodRequirements: [
      { productKind: "FULL_HOUSING_IMPLEMENTATION_REVIEW", periodsConsumed: 4, classification: "FULL", subjectFamily: "HOUSING" },
      { productKind: "NARROW_HOUSING_IMPLEMENTATION_ACCESS_GAP_MEMO", periodsConsumed: 1, classification: "LESS_CLAIMING", subjectFamily: "HOUSING" },
      { productKind: "FULL_REGIONAL_EMPLOYMENT_CONGRESSIONAL_ANALYSIS", periodsConsumed: 4, classification: "FULL", subjectFamily: "EMPLOYMENT_CONGRESS" },
      { productKind: "NARROW_EMPLOYMENT_COMMITTEE_BRIEF", periodsConsumed: 1, classification: "LESS_CLAIMING", subjectFamily: "EMPLOYMENT_CONGRESS" },
    ],
    openingAssignments: [
      {
        id: "pop0.assignment.omb.housing-full-implementation-review",
        requesterId: POP0_I2_OFFICE_IDS.chiefOfStaff,
        objective: "Review inherited Housing implementation access and supportability.",
        sourceReferenceIds: [POP0_I4_IDS.monitoringArtifact],
        authorityReference: POP0_I4_IDS.chiefOfStaffCapability,
        deadline: "2029-02-23T17:00:00-05:00",
        expectedProductKind: "FULL_HOUSING_IMPLEMENTATION_REVIEW",
      },
      {
        id: "pop0.assignment.omb.employment-congress-full-analysis",
        requesterId: POP0_I2_OFFICE_IDS.chiefOfStaff,
        objective: "Review regional Employment evidence and the bounded Congressional window.",
        sourceReferenceIds: [POP0_I2_SOURCE_ARTIFACT_ID],
        authorityReference: POP0_I3_RECIPIENT_CAPABILITY_IDS.ombAnalysis,
        deadline: "2029-03-01T17:00:00-05:00",
        expectedProductKind: "FULL_REGIONAL_EMPLOYMENT_CONGRESSIONAL_ANALYSIS",
      },
    ],
    preferredQueueOrder: [
      "pop0.assignment.omb.housing-full-implementation-review",
      "pop0.assignment.omb.employment-congress-full-analysis",
    ],
    bookingOpensAt: POP0_V0_EPOCH,
    standingCoordinationAuthority: {
      id: "pop0.authority.chief-of-staff.omb-review-queue-coordination",
      initiatingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      recipientOfficeId: POP0_I2_OFFICE_IDS.omb,
      teamId: "pop0.office-team.omb.economic-implementation-review",
      permittedWorkstreamIds: [POP0_I3_WORKSTREAM_ID, POP0_I4_IDS.housingWorkstream],
      permittedActions: ["REPRIORITIZE_OMB_REVIEW_QUEUE", "SUPERSEDE_WITH_PERMITTED_NARROW_PRODUCT"],
      maximumReferencedAssignments: 2,
      effectiveFrom: POP0_V0_EPOCH,
      effectiveUntil: null,
      authorityReference: POP0_V0_PROVENANCE_ROOT,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    },
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  },
  provenanceReference: POP0_V0_PROVENANCE_ROOT,
};

const configurationWithoutHash = {
  schemaVersion: PRESIDENTIAL_OPERATING_RUNTIME_SCHEMA_VERSION,
  identity: {
    configurationId: POP0_V0_CONFIGURATION_ID,
    configurationVersion: POP0_V0_CONFIGURATION_VERSION,
    scenarioId: POP0_V0_SCENARIO_ID,
    scenarioVersion: POP0_V0_SCENARIO_VERSION,
  },
  classification: POP0_V0_CLASSIFICATION,
  operatingStateId: POP0_V0_OPERATING_STATE_ID,
  calendar: {
    ownerId: POP0_V0_CALENDAR_OWNER_ID,
    epoch: POP0_V0_EPOCH,
    boundaries: [],
  },
  administration,
  intervention,
  housing,
  concurrentWorld,
} as const;

export const POP0_V0_OPERATING_CONFIGURATION: PresidentialOperatingRuntimeConfiguration = {
  ...configurationWithoutHash,
  identity: {
    ...configurationWithoutHash.identity,
    configurationHash: computePresidentialOperatingConfigurationHash(configurationWithoutHash),
  },
};

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

export const POP0_V0_CONFIGURATION_ID = "presidential-operating-proof";
export const POP0_V0_CONFIGURATION_VERSION = "0.4.0-pop0-i4";
export const POP0_V0_SCENARIO_ID = "us-presidential-operating-proof-v0";
export const POP0_V0_SCENARIO_VERSION = "0.4.0-pop0-i4";
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
} as const;

export const POP0_I2_OFFICE_IDS = {
  chiefOfStaff: "pop0.office.chief-of-staff",
  nec: "pop0.office.nec",
  omb: "pop0.office.omb",
  legislativeAffairs: "pop0.office.legislative-affairs",
  secretaryOfLabor: "pop0.office.secretary-of-labor",
  secretaryOfHud: "pop0.office.secretary-of-hud",
} as const;

export const POP0_I2_ACTOR_IDS = {
  president: "pop0.actor.president-elena-ward",
  chiefOfStaff: "pop0.actor.dana-okafor",
  necDirector: "pop0.actor.maya-chen",
  ombDirector: "pop0.actor.rafael-ortiz",
  legislativeAffairsDirector: "pop0.actor.tessa-monroe",
  secretaryOfLabor: "pop0.actor.naomi-mercer",
  secretaryOfHud: "pop0.actor.luis-ortega",
} as const;

export const POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS = {
  chiefOfStaff: "pop0.officeholder-assignment.dana-okafor.chief-of-staff",
  necDirector: "pop0.officeholder-assignment.maya-chen.nec",
  ombDirector: "pop0.officeholder-assignment.rafael-ortiz.omb",
  legislativeAffairsDirector: "pop0.officeholder-assignment.tessa-monroe.legislative-affairs",
  secretaryOfLabor: "pop0.officeholder-assignment.naomi-mercer.secretary-of-labor",
  secretaryOfHud: "pop0.officeholder-assignment.luis-ortega.secretary-of-hud",
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
];

const actorInputs = [
  [POP0_I2_ACTOR_IDS.president, "President Elena Ward"],
  [POP0_I2_ACTOR_IDS.chiefOfStaff, "Dana Okafor"],
  [POP0_I2_ACTOR_IDS.necDirector, "Maya Chen"],
  [POP0_I2_ACTOR_IDS.ombDirector, "Rafael Ortiz"],
  [POP0_I2_ACTOR_IDS.legislativeAffairsDirector, "Tessa Monroe"],
  [POP0_I2_ACTOR_IDS.secretaryOfLabor, "Naomi Mercer"],
  [POP0_I2_ACTOR_IDS.secretaryOfHud, "Luis Ortega"],
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
      ],
      permittedSubjectScopeFamilies: ["PRELIMINARY_LABOR_EVIDENCE_REVIEW"],
      maximumSectionCount: 3,
      permittedLessClaimingProductKinds: ["METADATA_ACCESS_GAP_SCOPING"],
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
  ],
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
} as const;

export const POP0_V0_OPERATING_CONFIGURATION: PresidentialOperatingRuntimeConfiguration = {
  ...configurationWithoutHash,
  identity: {
    ...configurationWithoutHash.identity,
    configurationHash: computePresidentialOperatingConfigurationHash(configurationWithoutHash),
  },
};

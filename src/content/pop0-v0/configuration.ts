import {
  POP0_I2_ALLOWED_ACTOR_JOINS,
  POP0_I2_POPULATION_LINKAGE_STATUS,
  POP0_I2_PROHIBITED_ACTOR_JOINS,
  type PresidentialAdministrationConfiguration,
} from "../../sim/presidential-office-information";
import {
  computePresidentialOperatingConfigurationHash,
  PRESIDENTIAL_OPERATING_RUNTIME_SCHEMA_VERSION,
  type PresidentialOperatingRuntimeConfiguration,
} from "../../sim/presidential-operating-runtime";

export const POP0_V0_CONFIGURATION_ID = "presidential-operating-proof";
export const POP0_V0_CONFIGURATION_VERSION = "0.2.0-pop0-i2";
export const POP0_V0_SCENARIO_ID = "us-presidential-operating-proof-v0";
export const POP0_V0_SCENARIO_VERSION = "0.2.0-pop0-i2";
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
  ],
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
} as const;

export const POP0_V0_OPERATING_CONFIGURATION: PresidentialOperatingRuntimeConfiguration = {
  ...configurationWithoutHash,
  identity: {
    ...configurationWithoutHash.identity,
    configurationHash: computePresidentialOperatingConfigurationHash(configurationWithoutHash),
  },
};

export interface ConfigurationIdentity {
  readonly configurationId: string;
  readonly configurationVersion: string;
  readonly scenarioId: string;
  readonly scenarioVersion: string;
  readonly configurationHash: string;
}

export interface ExternalIdentifierDescriptor {
  readonly scheme: string;
  readonly value: string;
}

export interface RawSourceDescriptor {
  readonly sourceId: string;
  readonly product: string;
  readonly locator: string;
  readonly retrievedAt: string;
  readonly rawSha256: string | null;
  readonly vintage?: string;
  readonly mappingClass?: "DIRECT" | "AGGREGATED" | "APPROXIMATED" | "DERIVED" | "DEFERRED";
  readonly consumed?: readonly string[];
}

export interface TopologyProvenanceArtifactDescriptor {
  readonly id: string;
  readonly vintage: string;
  readonly transformationVersion: string;
  readonly contentSha256: string;
  readonly sources: readonly RawSourceDescriptor[];
}

export type JurisdictionKind =
  | "NATIONAL"
  | "CONSTITUENT_POLITY"
  | "FEDERAL_DISTRICT"
  | "SYNTHETIC_SUBNATIONAL";

export interface JurisdictionDescriptor {
  readonly id: string;
  readonly label: string;
  readonly kind: JurisdictionKind;
  readonly externalIdentifiers: readonly ExternalIdentifierDescriptor[];
  readonly provenanceArtifactId: string | null;
}

export type InstitutionKind =
  | "LEGISLATURE"
  | "LEGISLATIVE_CHAMBER"
  | "EXECUTIVE"
  | "ADMINISTRATIVE_AGENCY"
  | "FISCAL_CONTROL"
  | "STATISTICAL_AGENCY"
  | "ARCHIVAL_AGENCY"
  | "LEGAL_SERVICE"
  | "COURT";

export interface InstitutionDescriptor {
  readonly id: string;
  readonly label: string;
  readonly kind: InstitutionKind;
  readonly jurisdictionId: string;
}

export interface LegislatureDescriptor {
  readonly id: string;
  readonly label: string;
  readonly institutionId: string;
  readonly chamberIds: readonly string[];
}

export interface LegislativeChamberDescriptor {
  readonly id: string;
  readonly label: string;
  readonly institutionId: string;
  readonly legislatureId: string;
  readonly seatCount: number;
}

export type GeographyIdentityKind =
  | "LEGISLATIVE_CONSTITUENCY"
  | "ADMINISTRATIVE_AREA"
  | "PROJECT_LOCATOR";

export interface GeographyIdentityDescriptor {
  readonly id: string;
  readonly label: string;
  readonly kind: GeographyIdentityKind;
  readonly parentJurisdictionId: string;
  readonly parentGeographyId?: string | null;
  readonly externalIdentifiers: readonly ExternalIdentifierDescriptor[];
  readonly geometryStatus: "IDENTITY_ONLY" | "GEOMETRY_AVAILABLE" | "LOCATOR_ONLY";
  readonly provenanceArtifactId: string;
  readonly geometryArtifactId?: string | null;
}

export interface StaggerGroupDescriptor {
  readonly id: string;
  readonly label: string;
  readonly ordinaryBoundaryAt: string;
  readonly provenanceArtifactId: string | null;
}

export interface TopologyReference {
  readonly kind: "JURISDICTION" | "INSTITUTION" | "OFFICE" | "GEOGRAPHY";
  readonly id: string;
}

export interface OfficeTermDescriptor {
  readonly duration: {
    readonly value: number;
    readonly unit: "YEARS" | "SYNTHETIC_DAYS";
  };
  readonly ordinaryBoundaryAt: string;
  readonly staggerGroupId: string | null;
}

export type OfficeKind = "LEGISLATIVE_MEMBER" | "EXECUTIVE_HEAD" | "EXECUTIVE_DEPUTY";

export interface OfficeDescriptor {
  readonly id: string;
  readonly label: string;
  readonly kind: OfficeKind;
  readonly institutionId: string;
  readonly chamberId: string | null;
  readonly constituency: TopologyReference | null;
  readonly term: OfficeTermDescriptor;
}

export type ScaffoldClassification =
  | "SYNTHETIC_FIXTURE"
  | "APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD";

export interface ActorIdentityDescriptor {
  readonly id: string;
  readonly label: string;
  readonly role: "LEGISLATIVE" | "EXECUTIVE";
  readonly classification: ScaffoldClassification;
}

export interface OfficeAssignmentDescriptor {
  readonly id: string;
  readonly officeId: string;
  readonly actorId: string;
  readonly effectiveFrom: string;
  readonly effectiveUntil: string | null;
  readonly currentAtScenarioStart: boolean;
  readonly classification: ScaffoldClassification;
}

export interface AdministrationDescriptor {
  readonly id: string;
  readonly label: string;
  readonly institutionId: string;
  readonly headOfficeId: string;
  readonly headActorId: string;
  readonly classification: ScaffoldClassification;
}

export type TopologyRelationKind =
  | "CONSTITUENT_OF"
  | "FEDERAL_DISTRICT_OF"
  | "EQUIVALENT_FOR_STATISTICS"
  | "EQUIVALENT_FOR_EXECUTIVE_SELECTION"
  | "APPEALS_TO";

export interface TopologyRelationDescriptor {
  readonly id: string;
  readonly kind: TopologyRelationKind;
  readonly from: TopologyReference;
  readonly to: TopologyReference;
}

export interface GovernmentStructureDescriptor {
  readonly provenanceArtifacts: readonly TopologyProvenanceArtifactDescriptor[];
  readonly jurisdictions: readonly JurisdictionDescriptor[];
  readonly institutions: readonly InstitutionDescriptor[];
  readonly legislatures: readonly LegislatureDescriptor[];
  readonly chambers: readonly LegislativeChamberDescriptor[];
  readonly geographies: readonly GeographyIdentityDescriptor[];
  readonly staggerGroups: readonly StaggerGroupDescriptor[];
  readonly offices: readonly OfficeDescriptor[];
  readonly actors: readonly ActorIdentityDescriptor[];
  readonly assignments: readonly OfficeAssignmentDescriptor[];
  readonly administrations: readonly AdministrationDescriptor[];
  readonly relations: readonly TopologyRelationDescriptor[];
}

/**
 * A legislative slice is a real canonical runtime, but deliberately is not a
 * complete causal world. It exists for configurations whose political
 * topology can run before Population, material domains, or elections exist.
 */
export type ScenarioCapability =
  | "PLAYABLE_CAUSAL_WORLD"
  | "INTEGRATED_PARTIAL_RUNTIME"
  | "LEGISLATIVE_RUNTIME_SLICE"
  | "STRUCTURAL_PROOF_ONLY";
export type ScenarioCalendarKind = "SYNTHETIC_DAY_NUMBER" | "REAL_CALENDAR";

export interface ConfiguredFraction {
  readonly numerator: number;
  readonly denominator: number;
}

export interface ConfiguredRatio extends ConfiguredFraction {
  readonly rounding: "CEILING" | "FLOOR_PLUS_ONE";
}

export interface ProposalDimensionConfiguration {
  readonly id: string;
  readonly minimum: number;
  readonly maximum: number;
}

export type OperativeLegalTermValue = number | string;

export interface ProposalLegalTermConfiguration {
  readonly classification: ScaffoldClassification;
  readonly appropriation: {
    readonly dimensionId: string;
    readonly purpose: string;
    readonly baseDimensionValue: number;
    readonly baseAmount: number;
    readonly amountPerDimensionPoint: number;
    readonly minimumAmount: number;
    readonly maximumAmount: number;
  };
  readonly policyTerms: readonly {
    readonly id: string;
    readonly dimensionId: string;
    readonly bands: readonly {
      readonly maximumDimensionValue: number;
      readonly value: OperativeLegalTermValue;
    }[];
  }[];
}

export interface PoliticalOrganizationConfiguration {
  readonly id: string;
  readonly label: string;
  readonly classification: ScaffoldClassification;
  readonly postureByDimension: Readonly<Record<string, number>>;
  readonly chamberQuotas: Readonly<Record<string, number>>;
}

export interface LegislativeChamberRuleConfiguration {
  readonly chamberId: string;
  readonly quorum: ConfiguredRatio;
  readonly ordinaryPassage: {
    readonly basis: "VOTES_CAST";
    readonly threshold: ConfiguredRatio;
    readonly tieFails: boolean;
  };
  readonly amendmentPassage: ConfiguredRatio;
  readonly overridePassage: ConfiguredRatio;
  readonly extendedDebate: {
    readonly available: boolean;
    readonly clotureThreshold: ConfiguredRatio | null;
  };
  readonly tieBreakerOfficeId: string | null;
}

/** Plain behavior-driving political content. No executable callbacks. */
export interface LegislativeRuntimeSeed {
  readonly schemaVersion: number;
  readonly profileScaffold: {
    readonly version: string;
    readonly seed: string;
    readonly classification: ScaffoldClassification;
  };
  readonly dimensions: readonly ProposalDimensionConfiguration[];
  readonly organizations: readonly PoliticalOrganizationConfiguration[];
  readonly membershipScaffold: {
    readonly version: string;
    readonly algorithm: "SHA-256";
    readonly salt: string;
    readonly chamberRankTokens: Readonly<Record<string, string>>;
    readonly organizationOrder: readonly string[];
  };
  readonly procedure: {
    readonly legislatureId: string;
    readonly originChamberId: string;
    readonly otherChamberId: string;
    readonly chamberRules: readonly LegislativeChamberRuleConfiguration[];
    readonly maximumTextExchanges: number;
    readonly maximumAmendmentRoundsPerChamber: number;
    readonly considerationGateMinimumSignals: Readonly<Record<string, number>>;
    readonly noSignatureRule: {
      readonly ruleClass: "ELAPSED_CALENDAR_DAYS_EXCLUDING_WEEKDAYS";
      readonly decisionDays: number;
      readonly excludedWeekdays: readonly number[];
      readonly timeZone: string;
      readonly enactWhenReturnNotPrevented: boolean;
      readonly failWhenReturnPrevented: boolean;
    };
    readonly legislatureTermBoundary: {
      readonly legislatureId: string;
      readonly occursAt: string;
    };
  };
  readonly proposal: {
    readonly id: string;
    readonly title: string;
    readonly initialDimensions: Readonly<Record<string, number>>;
    readonly authorizationProvisions: readonly string[];
    readonly legalTerms: ProposalLegalTermConfiguration;
  };
  readonly decision: {
    readonly organizationBlend: ConfiguredFraction;
    readonly actorVariationRadius: number;
    readonly reservationDistance: number;
    readonly coordinationPressure: number;
    readonly commitmentHonorCutoff: number;
    readonly breachCutoff: number;
    readonly extendedDebateThreatCutoff: number;
    readonly tieBreakerYeaCutoff: number;
  };
  readonly negotiation: {
    readonly maximumMemoryEntriesPerActor: number;
    readonly commitmentVisibility: "PARTICIPANTS_AND_ADMINISTRATION";
  };
  readonly executive: {
    readonly headOfficeId: string;
    readonly deputyOfficeId: string | null;
    readonly administrationId: string;
  };
  readonly recordIds: {
    readonly proposalVersionPrefix: string;
    readonly organizationActionPrefix: string;
    readonly commitmentPrefix: string;
    readonly amendmentPrefix: string;
    readonly voteOpportunityPrefix: string;
    readonly lawPrefix: string;
  };
}

export type RuntimeArtifactKind =
  | "GEOGRAPHY"
  | "POPULATION_CONTROL"
  | "POPULATION_MEASUREMENT"
  | "ELIGIBILITY_PROXY"
  | "POPULATION_COHORT"
  | "ELECTORAL_TOPOLOGY"
  | "PROGRAM_INITIALIZATION"
  | "HOUSING_INITIALIZATION";

export interface RuntimeArtifactBinding {
  readonly id: string;
  readonly kind: RuntimeArtifactKind;
  readonly contentSha256: string;
  readonly transformationVersion: string;
  readonly rawSourceSha256s: readonly string[];
}

export type InstitutionalBoundaryKind =
  | "TERM_RESULT_SNAPSHOT"
  | "PROCEDURE_EXPIRY"
  | "OUTGOING_ASSIGNMENT_END"
  | "SUCCESSOR_ASSIGNMENT_BEGIN"
  | "AFFILIATION_REBUILD"
  | "MEMBERSHIP_RECOMPUTE"
  | "POPULAR_SELECTION"
  | "RESULT_ATTESTATION"
  | "DELEGATE_ACTION"
  | "COLLEGIATE_DECLARATION"
  | "AUTHORITY_TRANSFER"
  | "OBSERVATION_CAPTURE"
  | "MEASUREMENT_CREATED"
  | "MEASUREMENT_RELEASED"
  | "CLAIM_RELEASED"
  | "INFORMATION_DELIVERED"
  | "POPULATION_EXPOSED"
  | "POPULATION_RESPONSE"
  | "LEGAL_CLAIM_FILED"
  | "LEGAL_PROCEEDING_DOCKETED"
  | "INTERIM_RELIEF_REQUESTED"
  | "JUDICIAL_RULING_ISSUED"
  | "JUDICIAL_ORDER_ISSUED"
  | "JUDICIAL_ORDER_EFFECTIVE"
  | "JUDICIAL_NOTICE_RECEIVED"
  | "STAY_RESOLVED"
  | "APPEAL_RESOLVED"
  | "COMPLIANCE_DEADLINE"
  | "ADMINISTRATIVE_REDIRECTION_ATTEMPT";

export interface InstitutionalBoundaryConfiguration {
  readonly id: string;
  readonly at: string;
  readonly phase: number;
  readonly order: number;
  readonly stableKey: string;
  readonly kind: InstitutionalBoundaryKind;
  readonly ownerId: string;
}

export interface AssignmentCycleConfiguration {
  readonly id: string;
  readonly termLabel: string;
  readonly classification: ScaffoldClassification;
  readonly scaffoldVersion: string;
  readonly populationSignalVersion: string;
  readonly populationSignalIdPrefix: string;
  readonly stableKey: string;
  readonly officeIds: readonly string[];
  readonly stateGeographyByOfficeId: Readonly<Record<string, string>>;
  readonly nextBoundaryByOfficeId: Readonly<Record<string, string>>;
  readonly assignmentIdPrefix: string;
  readonly replacementActorIdPrefix: string;
  readonly populationInfluence: ConfiguredFraction;
  readonly incumbentInfluence: ConfiguredFraction;
  readonly retainThreshold: ConfiguredFraction;
}

export interface SelectionTicketConfiguration {
  readonly id: string;
  readonly label: string;
  readonly alignment: "PLAYER_ALIGNED" | "NON_PLAYER_ALIGNED";
  readonly headCandidate: { readonly id: string; readonly actorId: string };
  readonly deputyCandidate: { readonly id: string; readonly actorId: string };
  readonly classification: ScaffoldClassification;
}

export interface PopulationSelectionScaffoldConfiguration {
  readonly version: string;
  readonly classification: ScaffoldClassification;
  readonly stableKey: string;
  readonly unresolvedPreferenceValue: string;
  readonly unresolvedTurnoutValue: string;
  readonly preferenceAliases: Readonly<Record<string, string | null>>;
  readonly turnoutWeights: Readonly<Record<string, ConfiguredFraction>>;
  readonly fallbackTurnoutWeight: ConfiguredFraction;
  readonly fallbackPreferenceThresholds: readonly {
    readonly ticketId: string | null;
    readonly cumulativeUpperBound: ConfiguredFraction;
  }[];
}

export interface IntegratedSelectionConfiguration {
  readonly id: string;
  readonly classification: ScaffoldClassification;
  readonly timingClassification: string;
  readonly stateGeographyIds: readonly string[];
  readonly tickets: readonly SelectionTicketConfiguration[];
  readonly populationScaffold: PopulationSelectionScaffoldConfiguration;
  readonly staticTopologyArtifactId: string;
  readonly transfer: {
    readonly headOfficeId: string;
    readonly deputyOfficeId: string;
    readonly scheduledAt: string;
    readonly successorTermEndsAt: string;
    readonly administrationIdPrefix: string;
    readonly assignmentIdPrefix: string;
    readonly bindingIdPrefix: string;
    readonly playerAlignedTicketId: string;
  };
  readonly recordIds: {
    readonly snapshotPrefix: string;
    readonly ballotPrefix: string;
    readonly resultPrefix: string;
    readonly attestationPrefix: string;
    readonly appointmentPrefix: string;
    readonly certificatePrefix: string;
    readonly declarationPrefix: string;
    readonly entitlementPrefix: string;
  };
}

export interface IntegratedTemporalConfiguration {
  readonly schemaVersion: number;
  readonly scheduleVersion: string;
  readonly parameterHash: string;
  readonly scheduleContentHash: string;
  readonly assignmentCycleContentHash: string;
  readonly selectionContentHash: string;
  readonly initialTermLabel: string;
  readonly boundaries: readonly InstitutionalBoundaryConfiguration[];
  readonly assignmentCycles: readonly AssignmentCycleConfiguration[];
  readonly selection: IntegratedSelectionConfiguration;
  readonly newProcedureIdPrefix: string;
  readonly initialAdministration: {
    readonly id: string;
    readonly headActorId: string;
    readonly deputyActorId: string;
    readonly effectiveFrom: string;
    readonly effectiveUntil: string;
    readonly classification: ScaffoldClassification;
  };
}

export interface IntegratedImplementationConfiguration {
  readonly schemaVersion: number;
  readonly initializationArtifactId: string;
  readonly parameterHash: string;
  readonly semanticsVersion: string;
  readonly classification: ScaffoldClassification;
  readonly fiscalCohortId: string;
  readonly currency: string;
  readonly currencyScale: number;
  readonly publicFinanceOwnerId: string;
  readonly fiscalControllerInstitutionId: string;
  readonly fiscalControlOwnerId: string;
  readonly federalFiscalExecutionOwnerId: string;
  readonly intergovernmentalRelationshipOwnerId: string;
  readonly programId: string;
  readonly administeringInstitutionId: string;
  readonly generatedFiscalWindow: {
    readonly semanticVersion: string;
    readonly availabilityDurationDays: number;
    readonly classification: ScaffoldClassification;
  };
  readonly ownerResolution: {
    readonly semanticVersion: string;
    readonly effectiveRelationshipSemanticVersion: string;
    readonly compositeScheduleSemanticVersion: string;
    readonly intentionIdPrefix: string;
  };
  readonly legalTermIds: {
    readonly recipientFlexibility: string;
    readonly complianceBurden: string;
    readonly geographicDistribution: string;
    readonly administrativeCapacitySupport: string;
  };
  readonly recipientFlexibility: Readonly<Record<string, {
    readonly discretionClass: string;
    readonly maximumRecipientOptions: number;
  }>>;
  readonly complianceBurden: Readonly<Record<string, {
    readonly burdenClass: string;
    readonly requiredRecordTypes: readonly string[];
    readonly reviewSteps: number;
  }>>;
  readonly geographicDistribution: Readonly<Record<string, {
    readonly priorityRule: string;
  }>>;
  readonly administrativeCapacitySupport: Readonly<Record<string, {
    readonly capacityClass: string;
    readonly capacityUnits: number;
    readonly processingLatencyDays: number;
  }>>;
  readonly futureWaiver: {
    readonly semanticVersion: string;
    readonly responsibleInstitutionId: string;
    readonly requiredSupportingRecordTypes: readonly string[];
    readonly returnReviewDelayDays: number;
    readonly recordIdPrefix: string;
    readonly determinationIdPrefix: string;
    readonly materialInputIdPrefix: string;
  };
  readonly recordIds: {
    readonly budgetAuthorityPrefix: string;
    readonly fiscalControlPrefix: string;
    readonly programAllocationPrefix: string;
    readonly awardPrefix: string;
    readonly obligationPrefix: string;
    readonly relationshipTransitionPrefix: string;
    readonly recipientCommitmentPrefix: string;
    readonly recipientActivityPrefix: string;
    readonly drawRequestPrefix: string;
    readonly paymentPrefix: string;
    readonly materialInputPrefix: string;
  };
}

export interface IntegratedHousingConfiguration {
  readonly schemaVersion: number;
  readonly initializationArtifactId: string;
  readonly parameterHash: string;
  readonly semanticsVersion: string;
  readonly catchmentScaffoldVersion: string;
  readonly materialCalibrationVersion: string;
  readonly physicalToUsableLagDays: number;
  readonly scopedReleaseSemanticVersion: string;
  readonly materialInputBatchSemanticVersion: string;
  readonly dependencyPhaseSemanticVersion: string;
  readonly effectiveMaterialRateSemanticVersion: string;
  readonly stageReadinessSemanticVersion: string;
  readonly delaySemanticVersion: string;
  readonly failureSemanticVersion: string;
  readonly housingBoundaryPhase: number;
  readonly requiredGeneratedProjectInputKinds: readonly string[];
  readonly activationInputKind: string;
  readonly capacityPrior: {
    readonly lowUpperPermitsPerThousandMilliUnits: number;
    readonly highLowerPermitsPerThousandMilliUnits: number;
    readonly lowRateNumerator: number;
    readonly lowRateDenominator: number;
    readonly normalRateNumerator: number;
    readonly normalRateDenominator: number;
    readonly highRateNumerator: number;
    readonly highRateDenominator: number;
  };
  readonly expectedControlCount: number;
  readonly expectedRegionCount: number;
  readonly expectedProjectCount: number;
  readonly classification: ScaffoldClassification;
}

export interface InformationMeasurementConfiguration {
  readonly id: string;
  readonly observationId: string;
  readonly artifactId: string;
  readonly producerInstitutionId: string;
  readonly housingRegionIds: readonly string[];
  readonly housingProjectIds: readonly string[];
  readonly observationBoundaryId: string;
  readonly artifactBoundaryId: string;
  readonly releaseBoundaryId: string;
  readonly observationIntervalDays: number;
  readonly observationLagDays: number;
  readonly captureLagDays: number;
  readonly releaseLagDays: number;
  readonly observationMode: "SNAPSHOT_AS_OF_OBSERVATION_END_OVER_DECLARED_WINDOW";
  readonly observationSemanticVersion: string;
  readonly methodVersion: string;
  readonly approximationSemanticVersion: string;
  readonly deterministicErrorBound: number;
  readonly classification: ScaffoldClassification;
}

export interface InformationResponseOutcomeConfiguration {
  readonly belief: string;
  readonly attribution: string;
  readonly salience: string;
  readonly candidatePreference: string;
  readonly turnoutDisposition: string;
}

export interface IntegratedInformationConfiguration {
  readonly schemaVersion: number;
  readonly ownerId: string;
  readonly parameterHash: string;
  readonly semanticsVersion: string;
  readonly timingSemanticVersion: string;
  readonly responseRuleVersion: string;
  readonly classification: ScaffoldClassification;
  readonly measurements: readonly InformationMeasurementConfiguration[];
  readonly claim: {
    readonly id: string;
    readonly evidenceArtifactIds: readonly string[];
    readonly boundaryId: string;
    readonly claimantPolicy: "CURRENT_ADMINISTRATION";
    readonly claimantResolutionVersion: string;
    readonly subject: string;
    readonly position: string;
    readonly contentVersion: string;
    readonly classification: ScaffoldClassification;
  };
  readonly delivery: {
    readonly id: string;
    readonly informationItemId: string;
    readonly boundaryId: string;
    readonly channelId: string;
    readonly audienceCatchmentId: string;
    readonly classification: ScaffoldClassification;
  };
  readonly exposure: {
    readonly id: string;
    readonly deliveryId: string;
    readonly boundaryId: string;
    readonly targets: readonly {
      readonly stateGeographyId: string;
      readonly parentCohortId: string;
      readonly projectLocatorGeographyId: string | null;
      readonly materialExposureClass: string;
      readonly catchmentClass: string;
      readonly directExperienceEligible: boolean;
    }[];
    readonly targetNumerator: number;
    readonly targetDenominator: number;
    readonly targetAllocationVersion: string;
    readonly classification: ScaffoldClassification;
  };
  readonly response: {
    readonly id: string;
    readonly exposureId: string;
    readonly boundaryId: string;
    readonly outcomesByClaimPosition: Readonly<Record<string, {
      readonly withDirectExperience: InformationResponseOutcomeConfiguration;
      readonly withoutDirectExperience: InformationResponseOutcomeConfiguration;
    }>>;
    readonly classification: ScaffoldClassification;
  };
}

export interface IntegratedLegalContestConfiguration {
  readonly schemaVersion: 1;
  readonly ownerId: string;
  readonly parameterHash: string;
  readonly semanticsVersion: string;
  readonly standingRuleVersion: string;
  readonly outcomeRuleVersion: string;
  readonly legalValidityRuleVersion: string;
  readonly classification: ScaffoldClassification;
  readonly forumInstitutionId: string;
  readonly appellateInstitutionId: string;
  readonly targetInstitutionId: string;
  readonly legalServiceInstitutionId: string;
  readonly claimantId: string;
  readonly relationshipId: string;
  readonly judicialOffices: readonly {
    readonly id: string;
    readonly institutionId: string;
  }[];
  readonly judicialActors: readonly {
    readonly id: string;
    readonly classification: ScaffoldClassification;
  }[];
  readonly judicialAssignments: readonly {
    readonly id: string;
    readonly officeId: string;
    readonly actorId: string;
    readonly effectiveFrom: string;
    readonly effectiveUntil: string | null;
  }[];
  readonly trigger: {
    readonly determinationId: string;
    readonly outcome: "REQUALIFICATION_REJECTED";
    readonly formulaDisposition: "DIRECTED_OUT_OF_RELATIONSHIP_PENDING_EXECUTION";
    readonly requiredProcedureRecord: string;
    readonly prospectiveOnly: true;
    readonly moneyDamagesRequested: false;
  };
  readonly claim: {
    readonly id: string;
    readonly proceedingId: string;
    readonly filingBoundaryId: string;
    readonly docketBoundaryId: string;
    readonly claimType: string;
    readonly theoryIdentifier: string;
    readonly requestedRelief: string;
  };
  readonly interimRelief: {
    readonly requestId: string;
    readonly requestBoundaryId: string;
  };
  readonly ruling: {
    readonly id: string;
    readonly boundaryId: string;
    readonly claimantDisposition: "CLAIMANT_PREVAILS";
    readonly respondentDisposition: "RESPONDENT_PREVAILS";
  };
  readonly interpretation: {
    readonly id: string;
    readonly missingProcedureProposition: string;
    readonly authorityValidProposition: string;
  };
  readonly order: {
    readonly id: string;
    readonly issueBoundaryId: string;
    readonly effectiveBoundaryId: string;
    readonly noticeId: string;
    readonly noticeBoundaryId: string;
    readonly requiredAct: string;
    readonly prohibitedAct: string;
    readonly scope: {
      readonly programId: string;
      readonly relationshipId: string;
      readonly determinationId: string;
      readonly targetInstitutionId: string;
    };
  };
  readonly appeal: {
    readonly requestId: string;
    readonly stayRequestId: string;
    readonly stayId: string;
    readonly stayBoundaryId: string;
    readonly stayOutcome: "GRANTED" | "DENIED";
    readonly rulingId: string;
    readonly rulingBoundaryId: string;
    readonly rulingOutcome: "AFFIRMED" | "REVERSED" | "VACATED" | "REMANDED";
  };
  readonly compliance: {
    readonly deadlineBoundaryId: string;
    readonly allowedResponses: readonly ("COMPLY" | "DELAY" | "CONTEST" | "NONCOMPLY")[];
  };
  readonly administrativeAction: {
    readonly id: string;
    readonly boundaryId: string;
  };
  readonly admissionRequirements: {
    readonly finalAgencyAction: true;
    readonly concreteClaimantInjury: true;
    readonly prospectiveNonmoneyRelief: true;
    readonly reviewableClaim: true;
  };
}

/** Plain data describing the versioned artifacts required by a composed partial runtime. */
export interface IntegratedRuntimeConfiguration {
  readonly schemaVersion: number;
  readonly artifactBindings: readonly RuntimeArtifactBinding[];
  readonly geography: {
    readonly stateArtifactId: string;
    readonly districtArtifactId: string;
    readonly projectLocatorArtifactId: string;
  };
  readonly population: {
    readonly controlArtifactId: string;
    readonly cohortArtifactId: string;
    readonly eligibilityProxyArtifactId: string;
    readonly tenureMeasurementArtifactId: string;
    readonly scaffoldVersion: string;
    readonly refinementSemanticVersion: string;
    readonly catchmentRatio: ConfiguredFraction;
    readonly eligibilityIntegerizationVersion: string;
  };
  readonly electoral: {
    readonly topologyArtifactId: string;
  };
  readonly temporal?: IntegratedTemporalConfiguration;
  readonly implementation?: IntegratedImplementationConfiguration;
  readonly housing?: IntegratedHousingConfiguration;
  readonly information?: IntegratedInformationConfiguration;
  readonly legalContest?: IntegratedLegalContestConfiguration;
}

interface ScheduledTransitionBase {
  readonly id: string;
  readonly at: number;
  readonly order: number;
}

export type ScheduledTransitionDescriptor =
  | (ScheduledTransitionBase & { readonly kind: "BOOTSTRAP_BOUNDARY" })
  | (ScheduledTransitionBase & { readonly kind: "INFORMATION_BOUNDARY" })
  | (ScheduledTransitionBase & { readonly kind: "CONTESTED_AUTHORITY_CHALLENGE" })
  | (ScheduledTransitionBase & { readonly kind: "CONTESTED_AUTHORITY_INTERIM_RELIEF" })
  | (ScheduledTransitionBase & { readonly kind: "CONTESTED_AUTHORITY_COMPLIANCE" })
  | (ScheduledTransitionBase & {
      readonly kind: "INFORMATION_ARTIFACT_EXPOSURE";
      readonly artifactId: string;
      readonly audienceIds: readonly string[];
    })
  | (ScheduledTransitionBase & {
      readonly kind: "POLITICAL_CLAIM_RELEASE";
      readonly claimKind: "ADMINISTRATION" | "OPPOSITION";
      readonly claimArtifactId: string;
      readonly sourceArtifactId: string;
      readonly audienceIds: readonly string[];
    })
  | (ScheduledTransitionBase & { readonly kind: "POPULATION_ELECTORAL_RESPONSE" })
  | (ScheduledTransitionBase & {
      readonly kind: "ELECTION_RESOLUTION" | "ELECTION_CERTIFICATION";
      readonly contestId: string;
    })
  | (ScheduledTransitionBase & {
      readonly kind: "SUCCESSOR_ENTITLEMENT";
      readonly contestId: string;
      readonly entitlementId: string;
      readonly transferAt: number;
    })
  | (ScheduledTransitionBase & { readonly kind: "EXECUTIVE_OFFICE_TRANSFER" });

export interface GovernmentConfiguration<TRuntimeSeed = unknown> {
  readonly identity: ConfigurationIdentity;
  readonly capability: ScenarioCapability;
  readonly calendar: {
    readonly kind: ScenarioCalendarKind;
    readonly epoch: string;
  };
  readonly structure: GovernmentStructureDescriptor;
  readonly transitions: readonly ScheduledTransitionDescriptor[];
  /** Plain immutable data only. Executable callbacks are forbidden. */
  readonly runtimeSeed: TRuntimeSeed | null;
  /** Optional artifact-pinned initialization for a composed non-playable runtime. */
  readonly integratedRuntime?: IntegratedRuntimeConfiguration;
}

export interface LoadedGovernmentConfiguration<TRuntimeSeed = unknown>
  extends GovernmentConfiguration<TRuntimeSeed> {
  readonly loaded: true;
}

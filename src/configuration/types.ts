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

export type GeographyIdentityKind = "LEGISLATIVE_CONSTITUENCY";

export interface GeographyIdentityDescriptor {
  readonly id: string;
  readonly label: string;
  readonly kind: GeographyIdentityKind;
  readonly parentJurisdictionId: string;
  readonly externalIdentifiers: readonly ExternalIdentifierDescriptor[];
  readonly geometryStatus: "IDENTITY_ONLY";
  readonly provenanceArtifactId: string;
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
}

export interface LoadedGovernmentConfiguration<TRuntimeSeed = unknown>
  extends GovernmentConfiguration<TRuntimeSeed> {
  readonly loaded: true;
}

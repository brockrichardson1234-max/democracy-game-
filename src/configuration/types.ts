export interface ConfigurationIdentity {
  readonly configurationId: string;
  readonly configurationVersion: string;
  readonly scenarioId: string;
  readonly scenarioVersion: string;
  readonly configurationHash: string;
}

export interface LegislativeChamberDescriptor {
  readonly id: string;
  /** Null means deliberately undeclared by an incomplete structural proof. */
  readonly seatCount: number | null;
}

export interface GovernmentStructureDescriptor {
  readonly legislatureId: string;
  readonly chambers: readonly LegislativeChamberDescriptor[];
  readonly jurisdictionIds: readonly string[];
}

export type ScenarioCapability = "PLAYABLE_CAUSAL_WORLD" | "STRUCTURAL_PROOF_ONLY";
export type ScenarioCalendarKind = "SYNTHETIC_DAY_NUMBER" | "REAL_CALENDAR";

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

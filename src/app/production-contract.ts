export interface ProductionPlayerAction {
  readonly id: string;
  readonly category: "AGENDA" | "LEGISLATURE" | "EXECUTIVE" | "IMPLEMENTATION" | "LEGAL";
  readonly label: string;
  readonly description: string;
}

export interface ProductionGameView {
  readonly projectionVersion: string;
  readonly identity: {
    readonly configurationId: string;
    readonly configurationVersion: string;
    readonly scenarioId: string;
    readonly scenarioVersion: string;
    readonly configurationHash: string;
  };
  readonly currentInstant: string;
  readonly briefing: {
    readonly role: string;
    readonly term: string;
    readonly situation: string;
    readonly objective: string;
    readonly institutionalBoundary: string;
    readonly currentStatus: string;
    readonly horizon: { readonly label: string; readonly at: string } | null;
  };
  readonly administration: {
    readonly id: string;
    readonly headActorId: string;
    readonly deputyActorId: string;
    readonly termLabel: string;
    readonly controlActive: boolean;
    readonly controlMessage: string;
  };
  readonly agenda: {
    readonly proposalId: string;
    readonly title: string;
    readonly version: number;
    readonly dimensions: Readonly<Record<string, number>>;
    readonly stage: string;
    readonly currentChamberId: string | null;
    readonly sponsorship: {
      readonly status: string;
      readonly sponsorLabel: string | null;
    };
    readonly staffOutlook: Readonly<Record<string, number>>;
    readonly enactedLegalSources: readonly {
      readonly id: string;
      readonly sourceProposalId: string;
      readonly enactmentRoute: string;
    }[];
  };
  readonly implementation: {
    readonly generatedBudgetAuthorities: readonly {
      readonly id: string;
      readonly status: string;
      readonly minorUnits: number;
    }[];
    readonly relationshipStatuses: readonly { readonly id: string; readonly status: string }[];
    readonly materialInputKinds: readonly string[];
    readonly pendingOwnerDecisionCount: number;
    readonly fiscalControlCount: number;
    readonly awardCount: number;
    readonly obligationCount: number;
    readonly paymentCount: number;
    readonly recipientCommitmentCount: number;
  };
  readonly officialInformation: {
    readonly releasedMeasurements: readonly {
      readonly id: string;
      readonly releasedAt: string;
      readonly observationStart: string;
      readonly observationEnd: string;
      readonly measuredValues: readonly { readonly name: string; readonly value: number | string | boolean | null }[];
    }[];
    readonly releasedClaims: readonly {
      readonly id: string;
      readonly claimantId: string;
      readonly subject: string;
      readonly position: string;
      readonly releasedAt: string;
    }[];
    readonly completedDeliveryCount: number;
  };
  readonly legal: {
    readonly filedClaimCount: number;
    readonly proceedingStatuses: readonly string[];
    readonly publicRulings: readonly { readonly id: string; readonly disposition: string; readonly decidedAt: string }[];
    readonly operativeOrders: readonly {
      readonly id: string;
      readonly status: string;
      readonly enforceability: string;
    }[];
    readonly stayStatuses: readonly string[];
    readonly appealStatuses: readonly string[];
    readonly complianceStatuses: readonly string[];
  };
  readonly election: {
    readonly stage: string;
    readonly publicResultIds: readonly string[];
    readonly declarationId: string | null;
    readonly nextKnownBoundary: { readonly id: string; readonly at: string; readonly kind: string } | null;
  };
  readonly availablePlayerActions: readonly ProductionPlayerAction[];
  readonly worldAdvance: {
    readonly available: boolean;
    readonly label: string;
    readonly description: string;
  };
}

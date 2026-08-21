import type { ProposalTerms, VoteChoice } from "./legislature";
import type { SimulationInstant } from "./world";
import type { StateProgramDecision } from "./federalism";
import type { HousingMaterialOccurrence } from "./housing";
import type { HousingImplementationResponseAction } from "./administration";
import type { InformationOccurrence } from "./information";
import type { PopulationOccurrence } from "./population";
import type { ElectoralOccurrence } from "./electoral";
import type { ExecutivePoliticalOccurrence } from "./executive";
import type { JudicialOrderComplianceChoice } from "./administration";
import type {
  ExecutiveJudicialResponseAction,
} from "./executive-authority";

/**
 * Immutable committed occurrences. HistoricalRecord owns only the fact that
 * something happened at a time; it never becomes a shortcut current-state
 * store for the proposal, procedure, or legal order that actually own that
 * state going forward.
 */
export type HistoricalOccurrence =
  | HousingMaterialOccurrence
  | InformationOccurrence
  | PopulationOccurrence
  | ElectoralOccurrence
  | ExecutivePoliticalOccurrence
  | {
      readonly type: "ProposalIntroduced";
      readonly proposalId: string;
      readonly terms: ProposalTerms;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "AmendmentAccepted";
      readonly proposalId: string;
      readonly previousTerms: ProposalTerms;
      readonly newTerms: ProposalTerms;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "VoteCast";
      readonly proposalId: string;
      readonly seatId: string;
      readonly actorId: string;
      readonly choice: VoteChoice;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "LegislativeProcedureResolved";
      readonly proposalId: string;
      readonly outcome: "PASSED" | "FAILED";
      readonly yeaCount: number;
      readonly requiredYeaVotes: number;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "LawEnacted";
      readonly proposalId: string;
      readonly lawId: string;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "PublicFinanceAvailabilityRecognized";
      readonly lawId: string;
      readonly availableAmount: number;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "HousingGrantProgramEstablished";
      readonly programId: string;
      readonly lawId: string;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "StateProgramDecisionResolved";
      readonly programId: string;
      readonly stateJurisdictionId: string;
      readonly decision: StateProgramDecision;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "StateProgramApplicationSubmitted";
      readonly applicationId: string;
      readonly programId: string;
      readonly stateJurisdictionId: string;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "FederalProgramApplicationAccepted";
      readonly determinationId: string;
      readonly applicationId: string;
      readonly programId: string;
      readonly stateJurisdictionId: string;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "IntergovernmentalProgramRelationshipActivated";
      readonly relationshipId: string;
      readonly programId: string;
      readonly stateJurisdictionId: string;
      readonly applicationId: string;
      readonly determinationId: string;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "HousingGrantAwardCreated";
      readonly awardId: string;
      readonly programId: string;
      readonly relationshipId: string;
      readonly stateJurisdictionId: string;
      readonly awardedAmount: number;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "HousingGrantObligationRecorded";
      readonly obligationId: string;
      readonly awardId: string;
      readonly stateJurisdictionId: string;
      readonly amount: number;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "HousingGrantDisbursementMade";
      readonly disbursementId: string;
      readonly obligationId: string;
      readonly stateJurisdictionId: string;
      readonly amount: number;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "HousingProjectCreated";
      readonly projectId: string;
      readonly housingRegionId: string;
      readonly sourceDisbursementId: string;
      readonly stateJurisdictionId: string;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "HousingImplementationResponseResolved";
      readonly decisionId: string;
      readonly programId: string;
      readonly action: HousingImplementationResponseAction;
      readonly targetStateJurisdictionId: string | null;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "HousingImplementationSupportDeployed";
      readonly deploymentId: string;
      readonly programId: string;
      readonly relationshipId: string;
      readonly stateJurisdictionId: string;
      readonly supportUnits: number;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "HousingImplementationSupportAccepted";
      readonly sourceDeploymentId: string;
      readonly projectId: string;
      readonly housingRegionId: string;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "ExecutiveFundsRedirectionAttempted";
      readonly attemptId: string;
      readonly initiatingActorId: string;
      readonly targetInstitutionId: string;
      readonly disputedAmount: number;
      readonly claimedLegalBasis: string;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "AdministrativeRedirectionInstructionReceived";
      readonly attemptId: string;
      readonly targetInstitutionId: string;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "LegalClaimFiled";
      readonly legalClaimId: string;
      readonly claimantJurisdictionId: string;
      readonly challengedAttemptId: string;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "LegalContestAdmitted";
      readonly contestId: string;
      readonly legalClaimId: string;
      readonly forumInstitutionId: string;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "InterimReliefDecided";
      readonly decisionId: string;
      readonly contestId: string;
      readonly judgeActorId: string;
      readonly outcome: "GRANT";
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "JudicialOrderIssued";
      readonly orderId: string;
      readonly sourceDecisionId: string;
      readonly subjectInstitutionId: string;
      readonly challengedAttemptId: string;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "JudicialOrderDelivered";
      readonly orderId: string;
      readonly recipientInstitutionId: string;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "JudicialOrderComplianceResolved";
      readonly orderId: string;
      readonly institutionId: string;
      readonly response: JudicialOrderComplianceChoice;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "ExecutiveJudicialResponseRecorded";
      readonly sourceAttemptId: string;
      readonly orderId: string;
      readonly action: ExecutiveJudicialResponseAction;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "JudicialReviewRequested";
      readonly requestId: string;
      readonly contestId: string;
      readonly sourceOrderId: string;
      readonly requestingActorId: string;
      readonly at: SimulationInstant;
    };

export const appendOccurrence = (
  history: readonly HistoricalOccurrence[],
  occurrence: HistoricalOccurrence,
): readonly HistoricalOccurrence[] => [...history, occurrence];

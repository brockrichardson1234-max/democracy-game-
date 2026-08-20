import type { ProposalTerms, VoteChoice } from "./legislature";
import type { SimulationInstant } from "./world";

/**
 * Immutable committed occurrences. HistoricalRecord owns only the fact that
 * something happened at a time; it never becomes a shortcut current-state
 * store for the proposal, procedure, or legal order that actually own that
 * state going forward.
 */
export type HistoricalOccurrence =
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
      readonly type: "FiscalAuthorityMadeAvailable";
      readonly lawId: string;
      readonly available: number;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "HousingGrantProgramEstablished";
      readonly programId: string;
      readonly lawId: string;
      readonly at: SimulationInstant;
    };

export const appendOccurrence = (
  history: readonly HistoricalOccurrence[],
  occurrence: HistoricalOccurrence,
): readonly HistoricalOccurrence[] => [...history, occurrence];

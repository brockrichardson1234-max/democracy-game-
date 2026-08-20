import type { ProposalTerms, VoteChoice } from "./legislature";
import type { SimulationInstant } from "./world";

/**
 * Procedural status only. "PROCEDURE_PASSED" records that this proposal's
 * vote satisfied the configured passage rule; it is deliberately not the
 * same fact as an enacted legal source existing (see EnactedLaw below).
 * Collapsing the two into one field/status is the rejected
 * `proposal.status = LAW` anti-pattern.
 */
export type ProposalStatus = "PENDING" | "PROCEDURE_PASSED" | "PROCEDURE_FAILED";

export interface LegislativeVoteRecord {
  readonly legislatorId: string;
  readonly choice: VoteChoice;
}

/** Pending proposal/provisions/status: PoliticalOrder legislative/procedural state. */
export interface LegislativeProposal {
  readonly id: string;
  readonly sponsorAdministrationId: string;
  readonly terms: ProposalTerms;
  readonly status: ProposalStatus;
  readonly amendmentCount: number;
  readonly votes: readonly LegislativeVoteRecord[] | null;
}

/**
 * A new legal-order fact created only when the legislative procedure
 * resolves in favor. It has its own identity/provenance and is not the
 * mutable proposal object repurposed in place.
 */
export interface EnactedLaw {
  readonly id: string;
  readonly sourceProposalId: string;
  readonly enactedTerms: ProposalTerms;
  readonly enactedAtSimulationTime: SimulationInstant;
}

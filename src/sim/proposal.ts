import type { ProposalTerms } from "./legislature";
import type { SimulationInstant } from "./world";

/**
 * Procedural status only. "PROCEDURE_PASSED" records that this proposal's
 * vote satisfied the configured passage rule; it is deliberately not the
 * same fact as an enacted legal source existing (see EnactedLaw below).
 * Collapsing the two into one field/status is the rejected
 * `proposal.status = LAW` anti-pattern.
 *
 * Amendment count and recorded votes are NOT proposal fields: they are
 * facts of the active proceeding (see LegislativeProcedureInstance in
 * legislative-procedure.ts), not of the pending proposal's own provisions.
 */
export type ProposalStatus = "PENDING" | "PROCEDURE_PASSED" | "PROCEDURE_FAILED";

/** Pending proposal/provisions/status: PoliticalOrder legislative/procedural state. */
export interface LegislativeProposal {
  readonly id: string;
  readonly sponsorAdministrationId: string;
  readonly terms: ProposalTerms;
  readonly status: ProposalStatus;
}

/**
 * The minimum legally operative fiscal provision the enacted law carries:
 * legal permission/limit to spend for a purpose, not actual spendable money.
 * Owned by the legal source itself (see EnactedLaw below), distinct from the
 * fiscal-execution state in fiscal.ts that later recognizes it as available.
 */
export interface LegalAppropriation {
  readonly amount: number;
  readonly purpose: string;
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
  readonly appropriation: LegalAppropriation;
}

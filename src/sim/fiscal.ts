import type { EnactedLaw } from "./proposal";
import type { SimulationInstant } from "./world";

/**
 * Fiscal-execution state: what is currently available to spend under an
 * enacted law's appropriation, plus how much of it has been obligated and
 * disbursed. This is deliberately a distinct owner from the law's own
 * `appropriation` ceiling (proposal.ts) -- "enacted" is not "available", and
 * "available" is not "spent". GL0 has no recipient/award/project yet, so
 * `obligated` and `disbursed` remain 0 through this slice; the fields exist
 * so the world can represent the fact once a later slice creates them.
 */
export interface FiscalExecutionState {
  readonly sourceLawId: string;
  readonly available: number;
  readonly obligated: number;
  readonly disbursed: number;
  readonly recognizedAtSimulationTime: SimulationInstant;
}

/**
 * Pure resolver: an enacted law's legal appropriation becomes recognized
 * fiscal-execution availability. Does not touch the law itself and does not
 * decide whether recognition is currently permitted -- that precondition
 * belongs to the governance transition that calls this.
 */
export const recognizeFiscalExecutionState = (
  law: EnactedLaw,
  at: SimulationInstant,
): FiscalExecutionState => ({
  sourceLawId: law.id,
  available: law.appropriation.amount,
  obligated: 0,
  disbursed: 0,
  recognizedAtSimulationTime: at,
});

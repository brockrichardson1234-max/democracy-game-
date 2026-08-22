import type { EnactedLaw } from "./proposal";
import type { SimulationInstant } from "./world";

/**
 * A single payment made against a single obligation. Ownership stays with
 * public-finance/treasury execution -- not the administrative program, not
 * fiscal-execution/obligation state -- because a payment is what public
 * finance itself does, distinct from committing to pay (obligation) and
 * distinct from the administrative decision that made the payment due
 * (award).
 */
export interface PublicDisbursement {
  readonly id: string;
  readonly obligationId: string;
  readonly awardId: string;
  readonly stateJurisdictionId: string;
  readonly amount: number;
  readonly disbursedAtSimulationTime: SimulationInstant;
}

/**
 * Public-finance state: the recognized financial position downstream of an
 * enacted law. `availableAmount` is the configured semantic: the amount
 * currently available and not yet committed/obligated (appropriated ceiling
 * minus everything obligated so far -- see `obligateHousingGrantAward` in
 * governance.ts, the only place that decrements it). `disbursedAmount` is a
 * derived total recomputed from `disbursements` whenever that list changes,
 * so the two can never independently drift apart.
 */
export interface PublicFinanceState {
  readonly housingGrant: {
    readonly id: string;
    readonly sourceLawId: string;
    readonly availableAmount: number;
    readonly disbursements: readonly PublicDisbursement[];
    readonly disbursedAmount: number;
    readonly recognizedAtSimulationTime: SimulationInstant;
  } | null;
}

/**
 * A fiscal commitment created only from an actual administrative award.
 * Recording an obligation does not itself move money -- see
 * `PublicDisbursement` above for the payment fact.
 */
export interface FiscalObligation {
  readonly id: string;
  readonly sourceLawId: string;
  readonly federalProgramId: string;
  readonly awardId: string;
  readonly stateJurisdictionId: string;
  readonly amount: number;
  readonly obligatedAtSimulationTime: SimulationInstant;
}

/**
 * Fiscal-execution state owns commitments/obligations. `obligated` is a
 * derived total recomputed from `obligations` whenever that list changes, so
 * the record list and the total can never independently drift apart.
 * Availability and disbursement remain intentionally absent from this shape
 * -- they belong to `PublicFinanceState` above.
 */
export interface FiscalExecutionState {
  readonly sourceLawId: string;
  readonly obligations: readonly FiscalObligation[];
  readonly obligated: number;
}

export const createInitialPublicFinanceState = (): PublicFinanceState => ({
  housingGrant: null,
});

/** Pure recognition transition from legal appropriation to public-finance availability. */
export const recognizePublicFinanceState = (
  publicFinanceId: string,
  law: EnactedLaw,
  at: SimulationInstant,
): PublicFinanceState => ({
  housingGrant: {
    id: publicFinanceId,
    sourceLawId: law.id,
    availableAmount: law.appropriation.amount,
    disbursements: [],
    disbursedAmount: 0,
    recognizedAtSimulationTime: at,
  },
});

/** Pure creation of the zero-obligation fiscal-execution state for this law. */
export const createFiscalExecutionState = (law: EnactedLaw): FiscalExecutionState => ({
  sourceLawId: law.id,
  obligations: [],
  obligated: 0,
});

const sumAmounts = (entries: readonly { readonly amount: number }[]): number =>
  entries.reduce((total, entry) => total + entry.amount, 0);

/**
 * Pure constructor: an actual award becomes a fiscal obligation record. Does
 * not decide whether obligating is currently permitted -- see
 * `recordFiscalObligation` below and the governance transition that calls
 * both.
 */
export const createFiscalObligation = (
  obligationId: string,
  sourceLawId: string,
  federalProgramId: string,
  awardId: string,
  stateJurisdictionId: string,
  amount: number,
  at: SimulationInstant,
): FiscalObligation => ({
  id: obligationId,
  sourceLawId,
  federalProgramId,
  awardId,
  stateJurisdictionId,
  amount,
  obligatedAtSimulationTime: at,
});

/**
 * Pure constructor: an actual obligation becomes a public-finance
 * disbursement record. Does not decide whether disbursing is currently
 * permitted -- see `recordPublicDisbursement` below and the governance
 * transition that calls both.
 */
export const createPublicDisbursement = (
  disbursementId: string,
  obligation: FiscalObligation,
  at: SimulationInstant,
): PublicDisbursement => ({
  id: disbursementId,
  obligationId: obligation.id,
  awardId: obligation.awardId,
  stateJurisdictionId: obligation.stateJurisdictionId,
  amount: obligation.amount,
  disbursedAtSimulationTime: at,
});

/**
 * Pure resolver: records one obligation against an award and returns the
 * updated fiscal-execution state with its derived total recomputed from the
 * new record list. Does not decide whether obligating is currently permitted
 * (existing award, sufficient available authority, no duplicate) -- those
 * preconditions belong to the governance transition that calls this.
 */
export const recordFiscalObligation = (
  fiscalExecution: FiscalExecutionState,
  obligation: FiscalObligation,
): FiscalExecutionState => {
  const obligations = [...fiscalExecution.obligations, obligation];
  return { ...fiscalExecution, obligations, obligated: sumAmounts(obligations) };
};

/**
 * Pure resolver: subtracts a newly obligated amount from currently available
 * public-finance authority. Does not decide whether the amount is
 * permitted -- the governance transition that calls this rejects obligating
 * beyond what is currently available before calling it.
 */
export const commitAvailablePublicFinance = (
  publicFinance: PublicFinanceState,
  amount: number,
): PublicFinanceState => {
  if (publicFinance.housingGrant === null) {
    throw new Error("Public finance has no recognized housing grant to commit against.");
  }
  return {
    ...publicFinance,
    housingGrant: {
      ...publicFinance.housingGrant,
      availableAmount: publicFinance.housingGrant.availableAmount - amount,
    },
  };
};

/**
 * Pure resolver: records one disbursement and returns the updated
 * public-finance state with its derived `disbursedAmount` total recomputed
 * from the new record list. Does not decide whether disbursing is currently
 * permitted (existing obligation, no duplicate payment, does not exceed the
 * obligation) -- those preconditions belong to the governance transition
 * that calls this.
 */
export const recordPublicDisbursement = (
  publicFinance: PublicFinanceState,
  disbursement: PublicDisbursement,
): PublicFinanceState => {
  if (publicFinance.housingGrant === null) {
    throw new Error("Public finance has no recognized housing grant to disburse against.");
  }
  const disbursements = [...publicFinance.housingGrant.disbursements, disbursement];
  return {
    ...publicFinance,
    housingGrant: {
      ...publicFinance.housingGrant,
      disbursements,
      disbursedAmount: sumAmounts(disbursements),
    },
  };
};

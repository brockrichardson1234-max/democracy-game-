import type { EnactedLaw } from "./proposal";
import type { SimulationInstant } from "./world";

/**
 * Public-finance state: the recognized financial position downstream of an
 * enacted law. Availability and disbursement are treasury/public-finance
 * facts, not legal facts and not fiscal-execution facts. GL0 has no
 * recipient/award/project yet, so disbursement remains explicitly zero.
 */
export interface PublicFinanceState {
  readonly housingGrant: {
    readonly id: string;
    readonly sourceLawId: string;
    readonly availableAmount: number;
    readonly disbursedAmount: number;
    readonly recognizedAtSimulationTime: SimulationInstant;
  } | null;
}

/**
 * Fiscal-execution state owns commitments/obligations. Availability and
 * disbursement are intentionally absent from this shape.
 */
export interface FiscalExecutionState {
  readonly sourceLawId: string;
  readonly obligated: number;
}

export const createInitialPublicFinanceState = (): PublicFinanceState => ({
  housingGrant: null,
});

/** Pure recognition transition from legal appropriation to public-finance availability. */
export const recognizePublicFinanceState = (
  law: EnactedLaw,
  at: SimulationInstant,
): PublicFinanceState => ({
  housingGrant: {
    id: `gl0-public-finance-for-${law.id}`,
    sourceLawId: law.id,
    availableAmount: law.appropriation.amount,
    disbursedAmount: 0,
    recognizedAtSimulationTime: at,
  },
});

/** Pure creation of the zero-obligation fiscal-execution state for this law. */
export const createFiscalExecutionState = (law: EnactedLaw): FiscalExecutionState => ({
  sourceLawId: law.id,
  obligated: 0,
});

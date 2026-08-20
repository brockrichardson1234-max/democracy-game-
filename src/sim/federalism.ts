import type { SimulationInstant } from "./world";

export type StateProgramDecision = "APPLY" | "REFUSE";
export type StateAdministrativeCapacity = "ADEQUATE" | "WEAK";

/** A political/legal jurisdiction, intentionally independent of geography. */
export interface StateJurisdiction {
  readonly id: string;
  /** Deterministic GL0 fixture behavior owned by the state, not the federal program. */
  readonly housingGrantDecisionRule: StateProgramDecision;
  readonly administrativeCapacity: StateAdministrativeCapacity;
}

/** Current state-side action for a particular federal program offer. */
export interface StateProgramDecisionState {
  readonly stateJurisdictionId: string;
  readonly federalProgramId: string;
  readonly decision: StateProgramDecision;
  readonly resolvedAtSimulationTime: SimulationInstant;
}

/** State-originating administrative record; it contains references, not law terms. */
export interface ProgramApplicationRecord {
  readonly id: string;
  readonly federalProgramId: string;
  readonly stateJurisdictionId: string;
  readonly status: "SUBMITTED";
  readonly submittedAtSimulationTime: SimulationInstant;
}

/** Federal program-owned result for one state application. */
export type FederalApplicationDeterminationOutcome = "ACCEPTED" | "DENIED";

export interface FederalApplicationDetermination {
  readonly id: string;
  readonly federalProgramId: string;
  readonly applicationId: string;
  readonly stateJurisdictionId: string;
  readonly outcome: FederalApplicationDeterminationOutcome;
  readonly determinedAtSimulationTime: SimulationInstant;
}

/** Independent relationship owner joining state and federal facts. */
export interface IntergovernmentalProgramRelationship {
  readonly id: string;
  readonly federalProgramId: string;
  readonly stateJurisdictionId: string;
  readonly stateApplicationId: string;
  readonly federalDeterminationId: string;
  readonly status: "ACTIVE";
}

export const STATE_A_ID = "state-a";
export const STATE_B_ID = "state-b";
export const STATE_C_ID = "state-c";

export const createDeterministicStateJurisdictions = (): readonly StateJurisdiction[] => [
  {
    id: STATE_A_ID,
    housingGrantDecisionRule: "APPLY",
    administrativeCapacity: "ADEQUATE",
  },
  {
    id: STATE_B_ID,
    housingGrantDecisionRule: "REFUSE",
    administrativeCapacity: "ADEQUATE",
  },
  {
    id: STATE_C_ID,
    housingGrantDecisionRule: "APPLY",
    administrativeCapacity: "WEAK",
  },
];

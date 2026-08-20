import type { SimulationInstant } from "./world";

export type StateProgramDecision = "APPLY" | "REFUSE";
export type StateAdministrativeCapacity = "ADEQUATE" | "WEAK";

/**
 * A political/legal jurisdiction: identity/existence only, intentionally
 * independent of geography. It does not own deterministic decision behavior
 * or administrative capacity -- those are separately owned fixture facts
 * (see `StateProgramAdministrativeState` below) that merely reference this
 * jurisdiction by stable id, the same way `StateProgramDecisionState` does.
 */
export interface StateJurisdiction {
  readonly id: string;
}

/**
 * State political/administrative fixture state: the deterministic GL0
 * behavior and capacity a state jurisdiction currently has for the housing
 * grant program offer. This is distinct from jurisdiction identity above
 * (existence != behavior) and from `StateProgramDecisionState` below (a
 * standing disposition != the actual resolved decision that was made from
 * it at a point in time).
 */
export interface StateProgramAdministrativeState {
  readonly stateJurisdictionId: string;
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
  { id: STATE_A_ID },
  { id: STATE_B_ID },
  { id: STATE_C_ID },
];

export const createDeterministicStateProgramAdministrativeStates = (): readonly StateProgramAdministrativeState[] => [
  {
    stateJurisdictionId: STATE_A_ID,
    housingGrantDecisionRule: "APPLY",
    administrativeCapacity: "ADEQUATE",
  },
  {
    stateJurisdictionId: STATE_B_ID,
    housingGrantDecisionRule: "REFUSE",
    administrativeCapacity: "ADEQUATE",
  },
  {
    stateJurisdictionId: STATE_C_ID,
    housingGrantDecisionRule: "APPLY",
    administrativeCapacity: "WEAK",
  },
];

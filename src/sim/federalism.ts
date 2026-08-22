import type { SimulationInstant } from "./world";

export type StateProgramDecision = "APPLY" | "REFUSE";
export type StateAdministrativeCapacity = "ADEQUATE" | "WEAK";

/**
 * A political/legal jurisdiction: identity/existence only, intentionally
 * independent of geography. It does not own deterministic decision behavior
 * or administrative capacity -- those are separately configured facts
 * (see `StateProgramAdministrativeState` below) that merely reference this
 * jurisdiction by stable id, the same way `StateProgramDecisionState` does.
 */
export interface StateJurisdiction {
  readonly id: string;
}

/**
 * Configured state political/administrative state: the deterministic
 * behavior and capacity a state jurisdiction currently has for a program
 * offer. This is distinct from jurisdiction identity above
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

export const createStateJurisdictions = (
  jurisdictions: readonly StateJurisdiction[],
): readonly StateJurisdiction[] => {
  if (
    jurisdictions.length === 0 ||
    new Set(jurisdictions.map((jurisdiction) => jurisdiction.id)).size !== jurisdictions.length
  ) {
    throw new Error("State jurisdictions require nonempty, unique identities.");
  }
  return jurisdictions.map((jurisdiction) => ({ ...jurisdiction }));
};

export const createStateProgramAdministrativeStates = (
  states: readonly StateProgramAdministrativeState[],
): readonly StateProgramAdministrativeState[] =>
  states.map((state) => ({ ...state }));

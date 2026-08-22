import type { ElectoralState } from "./electoral";
import {
  assertSuccessorTransferDue,
  resolveExecutiveSuccessionRule,
  resolveSuccessorCandidateId,
  type ExecutiveSuccessionLegalOrderState,
} from "./executive-law";
import type { SimulationInstant } from "./world";

export interface ExecutivePoliticalActor {
  readonly id: string;
}

export interface ExecutiveInstitution {
  readonly id: string;
}

export interface ExecutiveOffice {
  readonly id: string;
  readonly institutionId: string;
  /** Reference only: the legal order owns normative succession requirements. */
  readonly successionRuleId: string;
}

export interface ExecutiveOfficeAssignment {
  readonly officeId: string;
  readonly actorId: string;
  readonly effectiveAtSimulationTime: SimulationInstant;
}

export interface SuccessorEntitlement {
  readonly id: string;
  readonly sourceCertificationId: string;
  readonly sourceResultId: string;
  readonly sourceWinningCandidateId: string;
  readonly entitledActorId: string;
  readonly establishedAtSimulationTime: SimulationInstant;
  readonly scheduledTransferAtSimulationTime: SimulationInstant;
}

export interface ExecutiveSuccessionState {
  readonly successorEntitlement: SuccessorEntitlement | null;
  readonly transferResolvedAtSimulationTime: SimulationInstant | null;
}

/** Bounded canonical owner of executive people, institution, office, assignment, and succession. */
export interface ExecutivePoliticalState {
  readonly actors: readonly ExecutivePoliticalActor[];
  readonly institution: ExecutiveInstitution;
  readonly office: ExecutiveOffice;
  readonly currentOfficeAssignment: ExecutiveOfficeAssignment;
  readonly succession: ExecutiveSuccessionState;
}

export type ExecutivePoliticalOccurrence =
  | {
      readonly type: "SuccessorEntitlementEstablished";
      readonly entitlementId: string;
      readonly actorId: string;
      readonly sourceCertificationId: string;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "ExecutiveOfficeTransferred";
      readonly officeId: string;
      readonly outgoingActorId: string;
      readonly incomingActorId: string;
      readonly sourceEntitlementId: string;
      readonly at: SimulationInstant;
    };

export interface ExecutivePoliticalTransitionResult {
  readonly executivePolitical: ExecutivePoliticalState;
  readonly occurrences: readonly ExecutivePoliticalOccurrence[];
}

export const resolveCurrentExecutiveOfficeholder = (
  executivePolitical: ExecutivePoliticalState,
): ExecutivePoliticalActor => {
  const assignment = executivePolitical.currentOfficeAssignment;
  if (assignment.officeId !== executivePolitical.office.id) {
    throw new Error(`Executive assignment references unknown office ${assignment.officeId}.`);
  }
  const actors = executivePolitical.actors.filter(
    (actor) => actor.id === assignment.actorId,
  );
  if (actors.length !== 1) {
    throw new Error(`Executive office requires exactly one current actor ${assignment.actorId}.`);
  }
  return actors[0];
};

const resolveCertifiedElection = (electoral: ElectoralState, contestId: string) => {
  const processes = electoral.electionProcesses.filter(
    (process) => process.contestId === contestId,
  );
  if (processes.length !== 1) {
    throw new Error("Executive succession requires exactly one configured election process.");
  }
  const process = processes[0];
  if (
    process.status !== "CERTIFIED" ||
    process.certification === null ||
    process.result === null
  ) {
    throw new Error("Executive succession requires a certified election result.");
  }
  if (process.certification.sourceResultId !== process.result.id) {
    throw new Error("Election certification does not reference its process result.");
  }
  return { process, result: process.result, certification: process.certification };
};

export interface ExecutiveSuccessionTransitionConfiguration {
  readonly contestId: string;
  readonly entitlementId: string;
  readonly entitlementAt: SimulationInstant;
  readonly transferAt: SimulationInstant;
}

/**
 * Day-62 executive-owner admission of a certified non-tie winner. The election
 * remains frozen and candidate identity is resolved through its actor reference.
 */
export const establishExecutiveSuccessorEntitlement = (
  executivePolitical: ExecutivePoliticalState,
  electoral: ElectoralState,
  legalOrder: ExecutiveSuccessionLegalOrderState,
  at: SimulationInstant,
  transition: ExecutiveSuccessionTransitionConfiguration,
): ExecutivePoliticalTransitionResult => {
  if (at !== transition.entitlementAt) {
    throw new Error(`Successor entitlement is not due at simulation time ${at}.`);
  }
  if (executivePolitical.succession.successorEntitlement !== null) {
    return { executivePolitical, occurrences: [] };
  }

  const rule = resolveExecutiveSuccessionRule(
    legalOrder,
    executivePolitical.office.successionRuleId,
  );
  const { result, certification } = resolveCertifiedElection(electoral, transition.contestId);
  const successorCandidateId = resolveSuccessorCandidateId(
    rule,
    result.outcome,
    result.winningCandidateId,
  );
  if (successorCandidateId === null) {
    return { executivePolitical, occurrences: [] };
  }

  const candidates = electoral.candidates.filter(
    (candidate) => candidate.id === successorCandidateId,
  );
  if (candidates.length !== 1) {
    throw new Error(`Election winner ${successorCandidateId} is not one candidate.`);
  }
  const winningCandidate = candidates[0];
  const contests = electoral.contests.filter(
    (contest) => contest.id === result.contestId,
  );
  if (contests.length !== 1 || !contests[0].candidateIds.includes(winningCandidate.id)) {
    throw new Error(`Election winner ${winningCandidate.id} is not a candidate in its contest.`);
  }
  const entitledActors = executivePolitical.actors.filter(
    (actor) => actor.id === winningCandidate.actorId,
  );
  if (entitledActors.length !== 1) {
    throw new Error(`Winning candidate references unknown actor ${winningCandidate.actorId}.`);
  }

  const entitlement: SuccessorEntitlement = {
    id: transition.entitlementId,
    sourceCertificationId: certification.id,
    sourceResultId: result.id,
    sourceWinningCandidateId: winningCandidate.id,
    entitledActorId: entitledActors[0].id,
    establishedAtSimulationTime: at,
    scheduledTransferAtSimulationTime: transition.transferAt,
  };
  return {
    executivePolitical: {
      ...executivePolitical,
      succession: {
        ...executivePolitical.succession,
        successorEntitlement: entitlement,
      },
    },
    occurrences: [
      {
        type: "SuccessorEntitlementEstablished",
        entitlementId: entitlement.id,
        actorId: entitlement.entitledActorId,
        sourceCertificationId: entitlement.sourceCertificationId,
        at,
      },
    ],
  };
};

/** Day-63 executive-owner office transfer from the previously established entitlement. */
export const transferExecutiveOffice = (
  executivePolitical: ExecutivePoliticalState,
  legalOrder: ExecutiveSuccessionLegalOrderState,
  at: SimulationInstant,
  scheduledAt: SimulationInstant,
): ExecutivePoliticalTransitionResult => {
  if (at !== scheduledAt) {
    throw new Error(`Executive office transfer is not due at simulation time ${at}.`);
  }
  if (executivePolitical.succession.transferResolvedAtSimulationTime !== null) {
    return { executivePolitical, occurrences: [] };
  }
  const entitlement = executivePolitical.succession.successorEntitlement;
  if (entitlement === null) return { executivePolitical, occurrences: [] };
  const rule = resolveExecutiveSuccessionRule(
    legalOrder,
    executivePolitical.office.successionRuleId,
  );
  assertSuccessorTransferDue(rule, entitlement.scheduledTransferAtSimulationTime, at);
  if (!executivePolitical.actors.some((actor) => actor.id === entitlement.entitledActorId)) {
    throw new Error(`Successor entitlement references unknown actor ${entitlement.entitledActorId}.`);
  }
  const outgoingActorId = resolveCurrentExecutiveOfficeholder(executivePolitical).id;
  const assignment: ExecutiveOfficeAssignment = {
    officeId: executivePolitical.office.id,
    actorId: entitlement.entitledActorId,
    effectiveAtSimulationTime: at,
  };

  return {
    executivePolitical: {
      ...executivePolitical,
      currentOfficeAssignment: assignment,
      succession: {
        ...executivePolitical.succession,
        transferResolvedAtSimulationTime: at,
      },
    },
    occurrences: [
      {
        type: "ExecutiveOfficeTransferred",
        officeId: assignment.officeId,
        outgoingActorId,
        incomingActorId: assignment.actorId,
        sourceEntitlementId: entitlement.id,
        at,
      },
    ],
  };
};

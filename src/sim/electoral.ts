import {
  applyElectoralEligibilityRule,
  assertProcedureResultCertifiable,
  GL0_ALL_REPRESENTED_RESIDENT_POPULATION_ELIGIBILITY_RULE_ID,
  GL0_ORDINARY_EXECUTIVE_ELECTION_PROCEDURE_RULE_ID,
  resolveElectoralEligibilityRule,
  resolveElectoralProcedureRule,
  resolveParticipatingWeight,
  resolveProcedureBallotDirection,
  resolveProcedureElectionOutcome,
  type ElectoralEligibilityLegalOrderState,
  type ElectoralProcedureLegalOrderState,
  type ProcedureElectionOutcome,
} from "./electoral-law";
import type {
  ElectoralPreference,
  PopulationState,
  TurnoutDisposition,
} from "./population";
import type { SimulationInstant } from "./world";

export const GL0_EXECUTIVE_ELECTORAL_BOUNDARY_ID = "gl0-executive-electoral-boundary";
export const GL0_EXECUTIVE_CONTEST_ID = "gl0-executive-contest";
export const GL0_EXECUTIVE_ELECTION_PROCESS_ID = "gl0-executive-election-process";
export const GL0_EXECUTIVE_ELECTION_RESULT_ID = "gl0-executive-election-result";
export const GL0_EXECUTIVE_ELECTION_CERTIFICATION_ID =
  "gl0-executive-election-certification";
export const GL0_ADMINISTRATION_CANDIDATE_ID = "gl0-administration-candidate";
export const GL0_OPPOSITION_CANDIDATE_ID = "gl0-opposition-candidate";
export const GL0_EXECUTIVE_ELECTION_AT = 60;
export const GL0_EXECUTIVE_CERTIFICATION_AT = 61;

export type ElectoralCandidateAlignment = "ADMINISTRATION" | "OPPOSITION";

export interface ElectoralCandidate {
  readonly id: string;
  /** Reference only: persistent person identity remains executive-political state. */
  readonly actorId: string;
  readonly alignment: ElectoralCandidateAlignment;
}

/** Electoral-process state references Geography; it owns no residents or political state. */
export interface ElectoralBoundary {
  readonly id: string;
  readonly geographyRegionIds: readonly string[];
}

export interface ElectoralContest {
  readonly id: string;
  readonly boundaryId: string;
  readonly scheduledElectionAt: SimulationInstant;
  readonly candidateIds: readonly string[];
  /** Reference only: the normative requirement remains owned by the legal order. */
  readonly eligibilityRuleId: string;
  /** Reference only: turnout, ballot, result, and certification requirements are legal-order truth. */
  readonly procedureRuleId: string;
}

export interface ElectionElectorateSnapshotUnit {
  readonly populationUnitId: string;
  readonly eligibleWeight: number;
  readonly electoralPreference: ElectoralPreference;
  readonly turnoutDisposition: TurnoutDisposition;
}

/** Fixed day-60 election input, not a second continuously mutable Population owner. */
export interface ElectionElectorateSnapshot {
  readonly contestId: string;
  readonly asOfSimulationTime: SimulationInstant;
  readonly units: readonly ElectionElectorateSnapshotUnit[];
}

export interface ElectionParticipationRecord {
  readonly populationUnitId: string;
  readonly eligibleWeight: number;
  readonly turnoutDispositionAtElection: Exclude<TurnoutDisposition, "UNRESOLVED">;
  readonly participatingWeight: number;
}

export type WeightedBallotSelection =
  | typeof GL0_ADMINISTRATION_CANDIDATE_ID
  | typeof GL0_OPPOSITION_CANDIDATE_ID
  | "BLANK";

export interface WeightedBallotRecord {
  readonly populationUnitId: string;
  readonly ballotWeight: number;
  readonly selection: WeightedBallotSelection;
}

export type ElectionOutcome = ProcedureElectionOutcome;

export interface CandidateVoteWeight {
  readonly candidateId: string;
  readonly voteWeight: number;
}

export interface ElectionResult {
  readonly id: string;
  readonly contestId: string;
  readonly resolvedAtSimulationTime: SimulationInstant;
  readonly totalEligibleWeight: number;
  readonly totalParticipatingWeight: number;
  readonly validCandidateBallotWeight: number;
  readonly blankBallotWeight: number;
  readonly candidateVoteWeights: readonly CandidateVoteWeight[];
  readonly outcome: ElectionOutcome;
  readonly winningCandidateId: string | null;
}

export interface ElectionCertification {
  readonly id: string;
  readonly contestId: string;
  readonly sourceResultId: string;
  readonly certifiedAtSimulationTime: SimulationInstant;
  readonly status: "CERTIFIED";
}

export type ElectionProcessStatus = "SCHEDULED" | "RESOLVED" | "CERTIFIED";

export interface ElectionProcess {
  readonly id: string;
  readonly contestId: string;
  readonly scheduledCertificationAt: SimulationInstant;
  readonly status: ElectionProcessStatus;
  readonly electorateSnapshot: ElectionElectorateSnapshot | null;
  readonly participationRecords: readonly ElectionParticipationRecord[];
  readonly ballots: readonly WeightedBallotRecord[];
  readonly result: ElectionResult | null;
  readonly certification: ElectionCertification | null;
}

export interface ElectoralState {
  readonly boundaries: readonly ElectoralBoundary[];
  readonly candidates: readonly ElectoralCandidate[];
  readonly contests: readonly ElectoralContest[];
  readonly electionProcesses: readonly ElectionProcess[];
}

export interface DerivedElectorate {
  readonly contestId: string;
  readonly asOfSimulationTime: SimulationInstant;
  readonly eligiblePopulationWeight: number;
  readonly eligiblePopulationUnitIds: readonly string[];
  readonly preferenceWeight: Readonly<Record<ElectoralPreference, number>>;
  readonly turnoutDispositionWeight: Readonly<Record<TurnoutDisposition, number>>;
}

export type ElectoralOccurrence =
  | {
      readonly type: "ElectionResolved";
      readonly electionProcessId: string;
      readonly resultId: string;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "ElectionCertified";
      readonly electionProcessId: string;
      readonly resultId: string;
      readonly certificationId: string;
      readonly at: SimulationInstant;
    };

export interface ElectoralTransitionResult {
  readonly electoral: ElectoralState;
  readonly occurrences: readonly ElectoralOccurrence[];
}

export interface ElectoralFixtureReferences {
  readonly geographyRegionIds: readonly string[];
  readonly administrationCandidateActorId: string;
  readonly oppositionCandidateActorId: string;
}

export const createInitialElectoralState = (
  references: ElectoralFixtureReferences,
): ElectoralState => {
  if (
    references.geographyRegionIds.length === 0 ||
    new Set(references.geographyRegionIds).size !== references.geographyRegionIds.length
  ) {
    throw new Error("The GL0 electoral boundary requires distinct Geography references.");
  }
  if (
    references.administrationCandidateActorId.length === 0 ||
    references.oppositionCandidateActorId.length === 0 ||
    references.administrationCandidateActorId === references.oppositionCandidateActorId
  ) {
    throw new Error("The GL0 election requires two distinct PoliticalActor references.");
  }

  return {
    boundaries: [
      {
        id: GL0_EXECUTIVE_ELECTORAL_BOUNDARY_ID,
        geographyRegionIds: [...references.geographyRegionIds],
      },
    ],
    candidates: [
      {
        id: GL0_ADMINISTRATION_CANDIDATE_ID,
        actorId: references.administrationCandidateActorId,
        alignment: "ADMINISTRATION",
      },
      {
        id: GL0_OPPOSITION_CANDIDATE_ID,
        actorId: references.oppositionCandidateActorId,
        alignment: "OPPOSITION",
      },
    ],
    contests: [
      {
        id: GL0_EXECUTIVE_CONTEST_ID,
        boundaryId: GL0_EXECUTIVE_ELECTORAL_BOUNDARY_ID,
        scheduledElectionAt: GL0_EXECUTIVE_ELECTION_AT,
        candidateIds: [
          GL0_ADMINISTRATION_CANDIDATE_ID,
          GL0_OPPOSITION_CANDIDATE_ID,
        ],
        eligibilityRuleId:
          GL0_ALL_REPRESENTED_RESIDENT_POPULATION_ELIGIBILITY_RULE_ID,
        procedureRuleId: GL0_ORDINARY_EXECUTIVE_ELECTION_PROCEDURE_RULE_ID,
      },
    ],
    electionProcesses: [
      {
        id: GL0_EXECUTIVE_ELECTION_PROCESS_ID,
        contestId: GL0_EXECUTIVE_CONTEST_ID,
        scheduledCertificationAt: GL0_EXECUTIVE_CERTIFICATION_AT,
        status: "SCHEDULED",
        electorateSnapshot: null,
        participationRecords: [],
        ballots: [],
        result: null,
        certification: null,
      },
    ],
  };
};

const createPreferenceWeights = (): Record<ElectoralPreference, number> => ({
  UNRESOLVED: 0,
  ADMINISTRATION: 0,
  OPPOSITION: 0,
  UNDECIDED: 0,
});

const createTurnoutDispositionWeights = (): Record<TurnoutDisposition, number> => ({
  UNRESOLVED: 0,
  LOW: 0,
  MEDIUM: 0,
  HIGH: 0,
});

const resolveSingleContest = (
  electoral: ElectoralState,
  contestId: string,
): ElectoralContest => {
  const contests = electoral.contests.filter((candidate) => candidate.id === contestId);
  if (contests.length !== 1) {
    throw new Error(`ElectoralState requires exactly one contest ${contestId}.`);
  }
  return contests[0];
};

const resolveSingleBoundary = (
  electoral: ElectoralState,
  contest: ElectoralContest,
): ElectoralBoundary => {
  const boundaries = electoral.boundaries.filter(
    (candidate) => candidate.id === contest.boundaryId,
  );
  if (boundaries.length !== 1) {
    throw new Error(`Electoral contest ${contest.id} requires exactly one boundary.`);
  }
  return boundaries[0];
};

const resolveSingleElectionProcess = (
  electoral: ElectoralState,
  contestId: string,
): ElectionProcess => {
  const processes = electoral.electionProcesses.filter(
    (candidate) => candidate.contestId === contestId,
  );
  if (processes.length !== 1) {
    throw new Error(`ElectoralState requires exactly one election process for ${contestId}.`);
  }
  return processes[0];
};

const resolveCandidateForAlignment = (
  electoral: ElectoralState,
  contest: ElectoralContest,
  alignment: ElectoralCandidateAlignment,
): ElectoralCandidate => {
  const contestCandidateIds = new Set(contest.candidateIds);
  const candidates = electoral.candidates.filter(
    (candidate) =>
      contestCandidateIds.has(candidate.id) && candidate.alignment === alignment,
  );
  if (candidates.length !== 1) {
    throw new Error(`Contest ${contest.id} requires exactly one ${alignment} candidate.`);
  }
  return candidates[0];
};

/** Pure contextual electorate query; no Population copy, snapshot, history, or ballots. */
export const deriveElectorate = (
  electoral: ElectoralState,
  population: PopulationState,
  eligibilityLegalOrder: ElectoralEligibilityLegalOrderState,
  contestId: string,
  asOf: SimulationInstant,
): DerivedElectorate => {
  if (!Number.isFinite(asOf)) {
    throw new Error("Derived electorate as-of time must be finite.");
  }
  const contest = resolveSingleContest(electoral, contestId);
  const boundary = resolveSingleBoundary(electoral, contest);
  const eligibilityRule = resolveElectoralEligibilityRule(
    eligibilityLegalOrder,
    contest.eligibilityRuleId,
  );
  const eligibleUnits = applyElectoralEligibilityRule(
    eligibilityRule,
    population,
    boundary.geographyRegionIds,
  );
  const preferenceWeight = createPreferenceWeights();
  const turnoutDispositionWeight = createTurnoutDispositionWeights();
  for (const unit of eligibleUnits) {
    preferenceWeight[unit.electoralPreference] += unit.weight;
    turnoutDispositionWeight[unit.turnoutDisposition] += unit.weight;
  }

  return {
    contestId: contest.id,
    asOfSimulationTime: asOf,
    eligiblePopulationWeight: eligibleUnits.reduce((total, unit) => total + unit.weight, 0),
    eligiblePopulationUnitIds: eligibleUnits.map((unit) => unit.id),
    preferenceWeight,
    turnoutDispositionWeight,
  };
};

/** Electoral-owned day-60 resolution from Population state and legal-order rules only. */
export const resolveElection = (
  electoral: ElectoralState,
  population: PopulationState,
  eligibilityLegalOrder: ElectoralEligibilityLegalOrderState,
  procedureLegalOrder: ElectoralProcedureLegalOrderState,
  contestId: string,
  at: SimulationInstant,
): ElectoralTransitionResult => {
  if (!Number.isFinite(at)) throw new Error("Election resolution time must be finite.");
  const contest = resolveSingleContest(electoral, contestId);
  if (at !== contest.scheduledElectionAt) {
    throw new Error(`Election ${contest.id} is not due at simulation time ${at}.`);
  }
  const process = resolveSingleElectionProcess(electoral, contestId);
  if (process.result !== null) return { electoral, occurrences: [] };
  if (process.status !== "SCHEDULED") {
    throw new Error(`Election process ${process.id} is not scheduled.`);
  }

  const procedureRule = resolveElectoralProcedureRule(
    procedureLegalOrder,
    contest.procedureRuleId,
  );
  const derivedElectorate = deriveElectorate(
    electoral,
    population,
    eligibilityLegalOrder,
    contestId,
    at,
  );
  const eligibleUnitIdSet = new Set(derivedElectorate.eligiblePopulationUnitIds);
  const eligibleUnits = population.units.filter((unit) => eligibleUnitIdSet.has(unit.id));
  if (eligibleUnits.length !== derivedElectorate.eligiblePopulationUnitIds.length) {
    throw new Error("Derived electorate references an unknown or duplicate Population unit.");
  }

  const administrationCandidate = resolveCandidateForAlignment(
    electoral,
    contest,
    "ADMINISTRATION",
  );
  const oppositionCandidate = resolveCandidateForAlignment(
    electoral,
    contest,
    "OPPOSITION",
  );
  if (new Set(contest.candidateIds).size !== 2 || contest.candidateIds.length !== 2) {
    throw new Error(`Contest ${contest.id} requires exactly two distinct candidates.`);
  }

  const snapshotUnits: ElectionElectorateSnapshotUnit[] = [];
  const participationRecords: ElectionParticipationRecord[] = [];
  const ballots: WeightedBallotRecord[] = [];
  for (const unit of eligibleUnits) {
    if (unit.turnoutDisposition === "UNRESOLVED") {
      throw new Error(`Population unit ${unit.id} has unresolved turnout disposition.`);
    }
    if (unit.electoralPreference === "UNRESOLVED") {
      throw new Error(`Population unit ${unit.id} has unresolved electoral preference.`);
    }
    snapshotUnits.push({
      populationUnitId: unit.id,
      eligibleWeight: unit.weight,
      electoralPreference: unit.electoralPreference,
      turnoutDisposition: unit.turnoutDisposition,
    });
    const participatingWeight = resolveParticipatingWeight(
      procedureRule,
      unit.weight,
      unit.turnoutDisposition,
    );
    participationRecords.push({
      populationUnitId: unit.id,
      eligibleWeight: unit.weight,
      turnoutDispositionAtElection: unit.turnoutDisposition,
      participatingWeight,
    });
    if (participatingWeight === 0) continue;

    const ballotDirection = resolveProcedureBallotDirection(
      procedureRule,
      unit.electoralPreference,
    );
    const selection: WeightedBallotSelection =
      ballotDirection === "ADMINISTRATION"
        ? GL0_ADMINISTRATION_CANDIDATE_ID
        : ballotDirection === "OPPOSITION"
          ? GL0_OPPOSITION_CANDIDATE_ID
          : "BLANK";
    ballots.push({ populationUnitId: unit.id, ballotWeight: participatingWeight, selection });
  }

  const voteWeightFor = (candidateId: string): number =>
    ballots
      .filter((ballot) => ballot.selection === candidateId)
      .reduce((total, ballot) => total + ballot.ballotWeight, 0);
  const administrationWeight = voteWeightFor(administrationCandidate.id);
  const oppositionWeight = voteWeightFor(oppositionCandidate.id);
  const blankBallotWeight = ballots
    .filter((ballot) => ballot.selection === "BLANK")
    .reduce((total, ballot) => total + ballot.ballotWeight, 0);
  const outcome = resolveProcedureElectionOutcome(
    procedureRule,
    administrationWeight,
    oppositionWeight,
  );
  const winningCandidateId =
    outcome === "ADMINISTRATION_WIN"
      ? administrationCandidate.id
      : outcome === "OPPOSITION_WIN"
        ? oppositionCandidate.id
        : null;
  const totalParticipatingWeight = participationRecords.reduce(
    (total, record) => total + record.participatingWeight,
    0,
  );
  const result: ElectionResult = {
    id: GL0_EXECUTIVE_ELECTION_RESULT_ID,
    contestId,
    resolvedAtSimulationTime: at,
    totalEligibleWeight: derivedElectorate.eligiblePopulationWeight,
    totalParticipatingWeight,
    validCandidateBallotWeight: administrationWeight + oppositionWeight,
    blankBallotWeight,
    candidateVoteWeights: [
      { candidateId: administrationCandidate.id, voteWeight: administrationWeight },
      { candidateId: oppositionCandidate.id, voteWeight: oppositionWeight },
    ],
    outcome,
    winningCandidateId,
  };
  const resolvedProcess: ElectionProcess = {
    ...process,
    status: "RESOLVED",
    electorateSnapshot: {
      contestId,
      asOfSimulationTime: at,
      units: snapshotUnits,
    },
    participationRecords,
    ballots,
    result,
  };

  return {
    electoral: {
      ...electoral,
      electionProcesses: electoral.electionProcesses.map((candidate) =>
        candidate.id === process.id ? resolvedProcess : candidate,
      ),
    },
    occurrences: [
      {
        type: "ElectionResolved",
        electionProcessId: process.id,
        resultId: result.id,
        at,
      },
    ],
  };
};

/** Electoral-owned day-61 certification of the already frozen day-60 result. */
export const certifyElection = (
  electoral: ElectoralState,
  procedureLegalOrder: ElectoralProcedureLegalOrderState,
  contestId: string,
  at: SimulationInstant,
): ElectoralTransitionResult => {
  if (!Number.isFinite(at)) throw new Error("Election certification time must be finite.");
  const process = resolveSingleElectionProcess(electoral, contestId);
  if (at !== process.scheduledCertificationAt) {
    throw new Error(`Election certification is not due at simulation time ${at}.`);
  }
  const contest = resolveSingleContest(electoral, contestId);
  if (process.certification !== null) return { electoral, occurrences: [] };
  if (process.status !== "RESOLVED" || process.result === null) {
    throw new Error(`Election process ${process.id} requires an existing resolved result.`);
  }
  const procedureRule = resolveElectoralProcedureRule(
    procedureLegalOrder,
    contest.procedureRuleId,
  );
  assertProcedureResultCertifiable(procedureRule, process.result.outcome);

  const certification: ElectionCertification = {
    id: GL0_EXECUTIVE_ELECTION_CERTIFICATION_ID,
    contestId,
    sourceResultId: process.result.id,
    certifiedAtSimulationTime: at,
    status: "CERTIFIED",
  };
  const certifiedProcess: ElectionProcess = {
    ...process,
    status: "CERTIFIED",
    certification,
  };

  return {
    electoral: {
      ...electoral,
      electionProcesses: electoral.electionProcesses.map((candidate) =>
        candidate.id === process.id ? certifiedProcess : candidate,
      ),
    },
    occurrences: [
      {
        type: "ElectionCertified",
        electionProcessId: process.id,
        resultId: process.result.id,
        certificationId: certification.id,
        at,
      },
    ],
  };
};

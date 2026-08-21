import type {
  ElectoralPreference,
  PopulationState,
  TurnoutDisposition,
} from "./population";
import type { SimulationInstant } from "./world";
import {
  applyElectoralEligibilityRule,
  GL0_ALL_REPRESENTED_RESIDENT_POPULATION_ELIGIBILITY_RULE_ID,
  resolveElectoralEligibilityRule,
  type ElectoralEligibilityLegalOrderState,
} from "./electoral-law";

export const GL0_EXECUTIVE_ELECTORAL_BOUNDARY_ID = "gl0-executive-electoral-boundary";
export const GL0_EXECUTIVE_CONTEST_ID = "gl0-executive-contest";
export const GL0_EXECUTIVE_ELECTION_AT = 60;

/** Electoral-process state references Geography; it owns no residents or political state. */
export interface ElectoralBoundary {
  readonly id: string;
  readonly geographyRegionIds: readonly string[];
}

export interface ElectoralContest {
  readonly id: string;
  readonly boundaryId: string;
  readonly scheduledElectionAt: SimulationInstant;
  /** Reference only: the normative requirement remains owned by the legal order. */
  readonly eligibilityRuleId: string;
}

export interface ElectoralState {
  readonly boundaries: readonly ElectoralBoundary[];
  readonly contests: readonly ElectoralContest[];
}

export interface DerivedElectorate {
  readonly contestId: string;
  readonly asOfSimulationTime: SimulationInstant;
  readonly eligiblePopulationWeight: number;
  readonly eligiblePopulationUnitIds: readonly string[];
  readonly preferenceWeight: Readonly<Record<ElectoralPreference, number>>;
  readonly turnoutDispositionWeight: Readonly<Record<TurnoutDisposition, number>>;
}

export interface ElectoralFixtureReferences {
  readonly geographyRegionIds: readonly string[];
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

  return {
    boundaries: [
      {
        id: GL0_EXECUTIVE_ELECTORAL_BOUNDARY_ID,
        geographyRegionIds: [...references.geographyRegionIds],
      },
    ],
    contests: [
      {
        id: GL0_EXECUTIVE_CONTEST_ID,
        boundaryId: GL0_EXECUTIVE_ELECTORAL_BOUNDARY_ID,
        scheduledElectionAt: GL0_EXECUTIVE_ELECTION_AT,
        eligibilityRuleId:
          GL0_ALL_REPRESENTED_RESIDENT_POPULATION_ELIGIBILITY_RULE_ID,
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
  const contests = electoral.contests.filter((candidate) => candidate.id === contestId);
  if (contests.length !== 1) {
    throw new Error(`ElectoralState requires exactly one contest ${contestId}.`);
  }
  const contest = contests[0];
  const boundaries = electoral.boundaries.filter(
    (candidate) => candidate.id === contest.boundaryId,
  );
  if (boundaries.length !== 1) {
    throw new Error(`Electoral contest ${contest.id} requires exactly one boundary.`);
  }
  const eligibilityRule = resolveElectoralEligibilityRule(
    eligibilityLegalOrder,
    contest.eligibilityRuleId,
  );
  const eligibleUnits = applyElectoralEligibilityRule(
    eligibilityRule,
    population,
    boundaries[0].geographyRegionIds,
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

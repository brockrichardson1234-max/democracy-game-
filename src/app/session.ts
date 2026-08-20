import {
  advanceWorldTo,
  createDeterministicWorldFixture,
  type SimulationInstant,
  type WorldState,
} from "../sim/world";
import {
  amendHousingGrantProposal,
  resolveHousingGrantProposalVote,
  submitHousingGrantProposal,
} from "../sim/governance";
import type { ProposalTerms } from "../sim/legislature";
import type { ProposalStatus } from "../sim/proposal";
import type { RecordedVote } from "../sim/legislative-procedure";

export type { ProposalTerms } from "../sim/legislature";
export type { ProposalStatus } from "../sim/proposal";
export type { RecordedVote } from "../sim/legislative-procedure";

export interface GameView {
  readonly currentTime: SimulationInstant;
  readonly bootstrapBoundaryResolved: boolean;
  readonly nextKnownBootstrapBoundary: SimulationInstant | null;
  readonly legislative: LegislativeProjection;
}

export interface LegislativeProjection {
  readonly proposal: {
    readonly id: string;
    readonly status: ProposalStatus;
    readonly terms: ProposalTerms;
    readonly amendmentsAdopted: number;
    readonly votes: readonly RecordedVote[] | null;
  } | null;
  readonly enactedLaw: {
    readonly id: string;
    readonly enactedTerms: ProposalTerms;
    readonly enactedAtSimulationTime: SimulationInstant;
  } | null;
}

export interface GameSession {
  getView(): GameView;
  advanceTo(target: SimulationInstant): GameView;
  submitHousingGrantProposal(terms: ProposalTerms): GameView;
  amendHousingGrantProposal(terms: ProposalTerms): GameView;
  resolveHousingGrantProposalVote(): GameView;
}

const projectWorld = (world: WorldState): GameView => {
  const { proposal, procedure, enactedLaws } = world.governance;
  const latestEnactedLaw = enactedLaws.length > 0 ? enactedLaws[enactedLaws.length - 1] : null;

  return {
    currentTime: world.time.current,
    bootstrapBoundaryResolved: world.bootstrapTransition.resolved,
    nextKnownBootstrapBoundary: world.bootstrapTransition.resolved
      ? null
      : world.bootstrapTransition.boundaryAt,
    legislative: {
      proposal:
        proposal === null
          ? null
          : {
              id: proposal.id,
              status: proposal.status,
              terms: proposal.terms,
              amendmentsAdopted: procedure?.amendmentsAdopted ?? 0,
              votes: procedure?.votes ?? null,
            },
      enactedLaw:
        latestEnactedLaw === null
          ? null
          : {
              id: latestEnactedLaw.id,
              enactedTerms: latestEnactedLaw.enactedTerms,
              enactedAtSimulationTime: latestEnactedLaw.enactedAtSimulationTime,
            },
    },
  };
};

export const createGameSession = (): GameSession => {
  let world = createDeterministicWorldFixture();

  return {
    getView: () => projectWorld(world),
    advanceTo: (target) => {
      world = advanceWorldTo(world, target);
      return projectWorld(world);
    },
    submitHousingGrantProposal: (terms) => {
      world = submitHousingGrantProposal(world, terms);
      return projectWorld(world);
    },
    amendHousingGrantProposal: (terms) => {
      world = amendHousingGrantProposal(world, terms);
      return projectWorld(world);
    },
    resolveHousingGrantProposalVote: () => {
      world = resolveHousingGrantProposalVote(world);
      return projectWorld(world);
    },
  };
};

import {
  advanceWorldTo,
  createDeterministicWorldFixture,
  type SimulationInstant,
  type WorldState,
} from "../sim/world";
import {
  amendHousingGrantProposal,
  establishHousingGrantProgram,
  recognizeHousingGrantFiscalAuthority,
  resolveHousingGrantProposalVote,
  submitHousingGrantProposal,
} from "../sim/governance";
import type { ParticipationCondition, ProposalTerms, ReportingRequirement } from "../sim/legislature";
import type { ProposalStatus, LegalAppropriation } from "../sim/proposal";
import type { RecordedVote } from "../sim/legislative-procedure";
import type { HousingGrantProgramStatus } from "../sim/administration";

export type { ProposalTerms } from "../sim/legislature";
export type { ProposalStatus, LegalAppropriation } from "../sim/proposal";
export type { RecordedVote } from "../sim/legislative-procedure";
export type { HousingGrantProgramStatus } from "../sim/administration";

export interface GameView {
  readonly currentTime: SimulationInstant;
  readonly bootstrapBoundaryResolved: boolean;
  readonly nextKnownBootstrapBoundary: SimulationInstant | null;
  readonly legislative: LegislativeProjection;
  readonly fiscal: FiscalProjection | null;
  readonly housingGrantProgram: HousingGrantProgramProjection | null;
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
    readonly appropriation: LegalAppropriation;
  } | null;
}

export interface FiscalProjection {
  readonly sourceLawId: string;
  readonly available: number;
  readonly obligated: number;
  readonly disbursed: number;
}

export interface HousingGrantProgramProjection {
  readonly id: string;
  readonly sourceLawId: string;
  readonly operatorInstitutionId: string;
  readonly publicFinanceRef: string;
  readonly status: HousingGrantProgramStatus;
  readonly federalMatchRatePercent: number;
  readonly participationCondition: ParticipationCondition;
  readonly reportingRequirement: ReportingRequirement;
}

export interface GameSession {
  getView(): GameView;
  advanceTo(target: SimulationInstant): GameView;
  submitHousingGrantProposal(terms: ProposalTerms): GameView;
  amendHousingGrantProposal(terms: ProposalTerms): GameView;
  resolveHousingGrantProposalVote(): GameView;
  recognizeHousingGrantFiscalAuthority(): GameView;
  establishHousingGrantProgram(): GameView;
}

const projectWorld = (world: WorldState): GameView => {
  const {
    proposal,
    procedure,
    enactedLaws,
    publicFinance,
    fiscalExecution,
    housingGrantProgram,
  } = world.governance;
  const latestEnactedLaw = enactedLaws.length > 0 ? enactedLaws[enactedLaws.length - 1] : null;
  const housingGrantProgramLaw =
    housingGrantProgram === null
      ? null
      : enactedLaws.find((law) => law.id === housingGrantProgram.sourceLawId) ?? null;

  if (housingGrantProgram !== null && housingGrantProgramLaw === null) {
    throw new Error("The housing grant program references an unknown enacted law.");
  }

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
              appropriation: latestEnactedLaw.appropriation,
            },
    },
    fiscal:
      publicFinance.housingGrant === null
        ? null
        : {
            sourceLawId: publicFinance.housingGrant.sourceLawId,
            available: publicFinance.housingGrant.availableAmount,
            obligated:
              fiscalExecution !== null && fiscalExecution.sourceLawId === publicFinance.housingGrant.sourceLawId
                ? fiscalExecution.obligated
                : 0,
            disbursed: publicFinance.housingGrant.disbursedAmount,
          },
    housingGrantProgram:
      housingGrantProgram === null
        ? null
          : {
            id: housingGrantProgram.id,
            sourceLawId: housingGrantProgram.sourceLawId,
            operatorInstitutionId: housingGrantProgram.operatorInstitutionId,
            publicFinanceRef: housingGrantProgram.publicFinanceRef,
            status: housingGrantProgram.status,
            federalMatchRatePercent: housingGrantProgramLaw!.enactedTerms.federalMatchRatePercent,
            participationCondition: housingGrantProgramLaw!.enactedTerms.participationCondition,
            reportingRequirement: housingGrantProgramLaw!.enactedTerms.reportingRequirement,
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
    recognizeHousingGrantFiscalAuthority: () => {
      world = recognizeHousingGrantFiscalAuthority(world);
      return projectWorld(world);
    },
    establishHousingGrantProgram: () => {
      world = establishHousingGrantProgram(world);
      return projectWorld(world);
    },
  };
};

import {
  advanceWorldTo,
  createDeterministicWorldFixture,
  type SimulationInstant,
  type WorldState,
} from "../sim/world";
import {
  activateIntergovernmentalHousingGrantParticipation,
  amendHousingGrantProposal,
  createHousingGrantAward,
  disburseHousingGrantObligation,
  establishHousingGrantProgram,
  materializeHousingProjectFromDisbursement,
  obligateHousingGrantAward,
  recognizeHousingGrantFiscalAuthority,
  resolveHousingImplementationResponse,
  resolveFederalHousingGrantApplication,
  resolveStateHousingGrantDecision,
  resolveHousingGrantProposalVote,
  submitHousingGrantProposal,
  submitStateHousingGrantApplication,
  isHousingImplementationResponseAttemptable,
} from "../sim/governance";
import type { ParticipationCondition, ProposalTerms, ReportingRequirement } from "../sim/legislature";
import type { ProposalStatus, LegalAppropriation } from "../sim/proposal";
import type { RecordedVote } from "../sim/legislative-procedure";
import {
  availableHousingImplementationSupportUnits,
  type HousingGrantProgramStatus,
  type HousingImplementationResponseAction,
} from "../sim/administration";
import type {
  FederalApplicationDeterminationOutcome,
  StateAdministrativeCapacity,
  StateProgramDecision,
} from "../sim/federalism";
import {
  resolveHousingProjectEffectiveWorkUnitsPerDay,
  type HousingProjectStatus,
} from "../sim/housing";

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
  readonly implementationResponse: HousingImplementationResponseProjection;
  readonly statePrograms: readonly StateProgramProjection[];
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

export interface HousingImplementationResponseProjection {
  /** Raw canonical process readiness for this developer inspection harness. */
  readonly responseOpportunityReady: boolean;
  readonly totalSupportUnits: number;
  readonly committedSupportUnits: number;
  readonly availableSupportUnits: number;
  readonly resolvedAction: HousingImplementationResponseAction | null;
  readonly targetStateJurisdictionId: string | null;
}

export interface StateProgramProjection {
  readonly id: string;
  readonly capacity: StateAdministrativeCapacity;
  readonly housingRegion: {
    readonly id: string;
    readonly geographyRegionId: string;
    readonly constructionCapacityWorkUnitsPerDay: number;
    readonly housingStockUnits: number;
    readonly housingDemandUnits: number;
    readonly affordabilityPressure: number;
  };
  readonly decision: StateProgramDecision | null;
  readonly applicationId: string | null;
  readonly federalDetermination: FederalApplicationDeterminationOutcome | null;
  readonly participation: "ACTIVE" | null;
  readonly award: { readonly id: string; readonly awardedAmount: number } | null;
  readonly obligation: { readonly id: string; readonly amount: number } | null;
  readonly disbursement: { readonly id: string; readonly amount: number } | null;
  readonly housingProject: {
    readonly id: string;
    readonly housingRegionId: string;
    readonly status: HousingProjectStatus;
    readonly completedWorkUnits: number;
    readonly requiredWorkUnits: number;
    readonly plannedHousingUnits: number;
    readonly startedAtSimulationTime: SimulationInstant | null;
    readonly completedAtSimulationTime: SimulationInstant | null;
  } | null;
  readonly acceptedImplementationSupport: {
    readonly sourceDeploymentId: string;
    readonly supportUnits: number;
    readonly supplementalWorkUnitsPerDay: number;
    readonly effectiveAtSimulationTime: SimulationInstant;
  } | null;
  readonly effectiveProjectWorkUnitsPerDay: number | null;
}

export interface GameSession {
  getView(): GameView;
  advanceTo(target: SimulationInstant): GameView;
  submitHousingGrantProposal(terms: ProposalTerms): GameView;
  amendHousingGrantProposal(terms: ProposalTerms): GameView;
  resolveHousingGrantProposalVote(): GameView;
  recognizeHousingGrantFiscalAuthority(): GameView;
  establishHousingGrantProgram(): GameView;
  resolveStateHousingGrantDecision(stateId: string): GameView;
  submitStateHousingGrantApplication(stateId: string): GameView;
  resolveFederalHousingGrantApplication(stateId: string): GameView;
  activateIntergovernmentalHousingGrantParticipation(stateId: string): GameView;
  createHousingGrantAward(stateId: string): GameView;
  obligateHousingGrantAward(stateId: string): GameView;
  disburseHousingGrantObligation(stateId: string): GameView;
  materializeHousingProjectFromDisbursement(stateId: string): GameView;
  deployHousingImplementationSupportToStateC(): GameView;
  preserveHousingImplementationSupportReserve(): GameView;
}

const projectWorld = (world: WorldState): GameView => {
  const {
    proposal,
    procedure,
    enactedLaws,
    publicFinance,
    fiscalExecution,
    housingGrantProgram,
    stateJurisdictions,
    stateProgramAdministrativeStates,
    stateProgramDecisions,
    programApplications,
    federalApplicationDeterminations,
    intergovernmentalProgramRelationships,
    housingGrantAwards,
    housingImplementationSupport,
    housingImplementationResponseDecision,
  } = world.governance;
  const { projects: housingProjects, regions: housingRegions } = world.housing;
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
    implementationResponse: {
      responseOpportunityReady: isHousingImplementationResponseAttemptable(world),
      totalSupportUnits: housingImplementationSupport.totalSupportUnits,
      committedSupportUnits: housingImplementationSupport.committedSupportUnits,
      availableSupportUnits: availableHousingImplementationSupportUnits(
        housingImplementationSupport,
      ),
      resolvedAction: housingImplementationResponseDecision?.action ?? null,
      targetStateJurisdictionId:
        housingImplementationResponseDecision?.targetStateJurisdictionId ?? null,
    },
    statePrograms: stateJurisdictions.map((state) => {
      const administrativeState = stateProgramAdministrativeStates.find(
        (candidate) => candidate.stateJurisdictionId === state.id,
      );
      if (administrativeState === undefined) {
        throw new Error(`State jurisdiction ${state.id} has no administrative fixture state.`);
      }
      const housingRegion = housingRegions.find(
        (candidate) => candidate.stateJurisdictionId === state.id,
      );
      if (housingRegion === undefined) {
        throw new Error(`State jurisdiction ${state.id} has no Housing region.`);
      }
      if (!world.geography.regions.some((region) => region.id === housingRegion.geographyRegionId)) {
        throw new Error(
          `Housing region ${housingRegion.id} references unknown geography ${housingRegion.geographyRegionId}.`,
        );
      }
      const stateDecision =
        housingGrantProgram === null
          ? null
          : stateProgramDecisions.find(
                (decision) =>
                  decision.federalProgramId === housingGrantProgram.id &&
                  decision.stateJurisdictionId === state.id,
              ) ?? null;
      const application =
        housingGrantProgram === null
          ? null
          : programApplications.find(
                (candidate) =>
                  candidate.federalProgramId === housingGrantProgram.id &&
                  candidate.stateJurisdictionId === state.id,
              ) ?? null;
      const determination =
        housingGrantProgram === null
          ? null
          : federalApplicationDeterminations.find(
                (candidate) =>
                  candidate.federalProgramId === housingGrantProgram.id &&
                  candidate.stateJurisdictionId === state.id,
              ) ?? null;
      const relationship =
        housingGrantProgram === null
          ? null
          : intergovernmentalProgramRelationships.find(
                (candidate) =>
                  candidate.federalProgramId === housingGrantProgram.id &&
                  candidate.stateJurisdictionId === state.id,
              ) ?? null;
      const award =
        housingGrantProgram === null
          ? null
          : housingGrantAwards.find(
                (candidate) =>
                  candidate.federalProgramId === housingGrantProgram.id &&
                  candidate.stateJurisdictionId === state.id,
              ) ?? null;
      const obligation =
        award === null
          ? null
          : (fiscalExecution?.obligations ?? []).find(
                (candidate) => candidate.awardId === award.id,
              ) ?? null;
      const disbursement =
        obligation === null
          ? null
          : (publicFinance.housingGrant?.disbursements ?? []).find(
                (candidate) => candidate.obligationId === obligation.id,
              ) ?? null;
      const housingProject =
        disbursement === null
          ? null
          : housingProjects.find(
                (candidate) => candidate.sourceDisbursementId === disbursement.id,
              ) ?? null;
      const acceptedImplementationSupport =
        housingProject === null
          ? null
          : world.housing.projectDeliverySupports.find(
              (support) => support.housingProjectId === housingProject.id,
            ) ?? null;

      return {
        id: state.id,
        capacity: administrativeState.administrativeCapacity,
        housingRegion: {
          id: housingRegion.id,
          geographyRegionId: housingRegion.geographyRegionId,
          constructionCapacityWorkUnitsPerDay:
            housingRegion.constructionCapacityWorkUnitsPerDay,
          housingStockUnits: housingRegion.housingStockUnits,
          housingDemandUnits: housingRegion.housingDemandUnits,
          affordabilityPressure: housingRegion.affordabilityPressure,
        },
        decision: stateDecision?.decision ?? null,
        applicationId: application?.id ?? null,
        federalDetermination: determination?.outcome ?? null,
        participation: relationship?.status ?? null,
        award: award === null ? null : { id: award.id, awardedAmount: award.awardedAmount },
        obligation: obligation === null ? null : { id: obligation.id, amount: obligation.amount },
        disbursement: disbursement === null ? null : { id: disbursement.id, amount: disbursement.amount },
        housingProject:
          housingProject === null
            ? null
            : {
                id: housingProject.id,
                housingRegionId: housingProject.housingRegionId,
                status: housingProject.status,
                completedWorkUnits: housingProject.completedWorkUnits,
                requiredWorkUnits: housingProject.requiredWorkUnits,
                plannedHousingUnits: housingProject.plannedHousingUnits,
                startedAtSimulationTime: housingProject.startedAtSimulationTime,
                completedAtSimulationTime: housingProject.completedAtSimulationTime,
              },
        acceptedImplementationSupport:
          acceptedImplementationSupport === null
            ? null
            : {
                sourceDeploymentId: acceptedImplementationSupport.sourceDeploymentId,
                supportUnits: acceptedImplementationSupport.supportUnits,
                supplementalWorkUnitsPerDay:
                  acceptedImplementationSupport.supplementalWorkUnitsPerDay,
                effectiveAtSimulationTime:
                  acceptedImplementationSupport.effectiveAtSimulationTime,
              },
        effectiveProjectWorkUnitsPerDay:
          housingProject === null
            ? null
            : resolveHousingProjectEffectiveWorkUnitsPerDay(
                world.housing,
                housingProject.id,
                world.time.current,
              ),
      };
    }),
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
    resolveStateHousingGrantDecision: (stateId) => {
      world = resolveStateHousingGrantDecision(world, stateId);
      return projectWorld(world);
    },
    submitStateHousingGrantApplication: (stateId) => {
      world = submitStateHousingGrantApplication(world, stateId);
      return projectWorld(world);
    },
    resolveFederalHousingGrantApplication: (stateId) => {
      world = resolveFederalHousingGrantApplication(world, stateId);
      return projectWorld(world);
    },
    activateIntergovernmentalHousingGrantParticipation: (stateId) => {
      world = activateIntergovernmentalHousingGrantParticipation(world, stateId);
      return projectWorld(world);
    },
    createHousingGrantAward: (stateId) => {
      world = createHousingGrantAward(world, stateId);
      return projectWorld(world);
    },
    obligateHousingGrantAward: (stateId) => {
      world = obligateHousingGrantAward(world, stateId);
      return projectWorld(world);
    },
    disburseHousingGrantObligation: (stateId) => {
      world = disburseHousingGrantObligation(world, stateId);
      return projectWorld(world);
    },
    materializeHousingProjectFromDisbursement: (stateId) => {
      world = materializeHousingProjectFromDisbursement(world, stateId);
      return projectWorld(world);
    },
    deployHousingImplementationSupportToStateC: () => {
      world = resolveHousingImplementationResponse(world, "DEPLOY_SUPPORT_TO_C");
      return projectWorld(world);
    },
    preserveHousingImplementationSupportReserve: () => {
      world = resolveHousingImplementationResponse(world, "PRESERVE_SUPPORT_RESERVE");
      return projectWorld(world);
    },
  };
};

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
import type {
  PoliticalClaimOrigin,
  PoliticalClaimPosition,
} from "../sim/information";
import type {
  BaselinePoliticalDisposition,
  ElectoralPreference,
  HousingAttribution,
  HousingPressureBelief,
  HousingSalience,
  ProgramPerformanceBelief,
  TurnoutDisposition,
} from "../sim/population";
import {
  deriveElectorate,
  GL0_EXECUTIVE_CONTEST_ID,
  type DerivedElectorate,
} from "../sim/electoral";
import {
  resolveElectoralEligibilityRule,
  resolveElectoralProcedureRule,
  type ElectoralEligibilityRequirement,
  type ElectoralProcedureRequirement,
} from "../sim/electoral-law";
import {
  GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
  resolveCurrentExecutiveOfficeholder,
} from "../sim/executive";
import {
  resolveExecutiveSuccessionRule,
  type ExecutiveSuccessionRequirement,
} from "../sim/executive-law";

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
  /** Raw Information-domain truth for the developer inspection harness. */
  readonly officialHousingMeasurement: OfficialHousingMeasurementProjection;
  /** Raw claim/distribution truth; explicitly not a player knowledge view. */
  readonly publicInformationAudit: PublicInformationAuditProjection;
  /** Raw canonical Population truth for development, never player knowledge. */
  readonly populationAudit: PopulationAuditProjection;
  /** Exact derived electorate for development; not a poll or player knowledge. */
  readonly electoralAudit: ElectoralAuditProjection;
  /** Raw canonical executive succession state for development. */
  readonly executiveSuccessionAudit: ExecutiveSuccessionAuditProjection;
  /** Non-canonical session permission state for development. */
  readonly controlBindingAudit: ControlBindingAuditProjection;
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

export interface HousingObservationProjection {
  readonly housingRegionId: string;
  readonly housingStockUnits: number;
  readonly affordabilityPressure: number;
}

export interface OfficialHousingMeasurementProjection {
  readonly id: string;
  readonly status: "SCHEDULED" | "CAPTURED" | "RELEASED";
  readonly observationStart: SimulationInstant;
  readonly observationEnd: SimulationInstant;
  readonly capturedAtSimulationTime: SimulationInstant | null;
  readonly scheduledReleaseAtSimulationTime: SimulationInstant;
  readonly capturedRegionalResults: readonly HousingObservationProjection[];
  readonly releasedReport: {
    readonly id: string;
    readonly sourceMeasurementId: string;
    readonly asOfStart: SimulationInstant;
    readonly asOfEnd: SimulationInstant;
    readonly createdAtSimulationTime: SimulationInstant;
    readonly releasedAtSimulationTime: SimulationInstant;
    readonly accessClass: "PUBLIC";
    readonly regionalResults: readonly HousingObservationProjection[];
  } | null;
}

export interface PublicInformationAuditProjection {
  readonly claims: readonly {
    readonly id: string;
    readonly origin: PoliticalClaimOrigin;
    readonly sourceArtifactIds: readonly string[];
    readonly claimPosition: PoliticalClaimPosition;
    readonly releasedAtSimulationTime: SimulationInstant;
    readonly accessClass: "PUBLIC";
  }[];
  readonly audiences: readonly {
    readonly id: string;
    readonly audienceType: "GL0_SYNTHETIC_PUBLIC_DISTRIBUTION_FIXTURE";
    readonly exposedArtifactIds: readonly string[];
  }[];
  readonly exposures: readonly {
    readonly artifactId: string;
    readonly audienceId: string;
    readonly exposedAtSimulationTime: SimulationInstant;
  }[];
}

export interface PopulationAuditProjection {
  readonly totalWeight: number;
  readonly electoralDispositionResolvedAt: SimulationInstant | null;
  readonly units: readonly {
    readonly id: string;
    readonly weight: number;
    readonly residenceGeographyId: string;
    readonly housingRegionId: string;
    readonly informationAudienceId: string;
    readonly baselinePoliticalDisposition: BaselinePoliticalDisposition;
    readonly housingPressureBelief: HousingPressureBelief;
    readonly programPerformanceBelief: ProgramPerformanceBelief;
    readonly housingAttribution: HousingAttribution;
    readonly housingSalience: HousingSalience;
    readonly electoralPreference: ElectoralPreference;
    readonly turnoutDisposition: TurnoutDisposition;
    readonly incorporatedArtifactIds: readonly string[];
  }[];
}

export interface ElectoralAuditProjection {
  readonly candidates: readonly {
    readonly id: string;
    readonly actorId: string;
    readonly alignment: "ADMINISTRATION" | "OPPOSITION";
  }[];
  readonly contest: {
    readonly id: string;
    readonly boundaryId: string;
    readonly scheduledElectionAt: SimulationInstant;
    readonly eligibilityRuleId: string;
    readonly eligibilityRequirement: ElectoralEligibilityRequirement;
    readonly procedureRuleId: string;
    readonly procedureRequirement: ElectoralProcedureRequirement;
    readonly candidateIds: readonly string[];
    readonly geographyRegionIds: readonly string[];
  };
  readonly derivedElectorate: DerivedElectorate;
  readonly electionProcess: {
    readonly id: string;
    readonly scheduledCertificationAt: SimulationInstant;
    readonly status: "SCHEDULED" | "RESOLVED" | "CERTIFIED";
    readonly electorateSnapshot: {
      readonly asOfSimulationTime: SimulationInstant;
      readonly units: readonly {
        readonly populationUnitId: string;
        readonly eligibleWeight: number;
        readonly electoralPreference: ElectoralPreference;
        readonly turnoutDisposition: TurnoutDisposition;
      }[];
    } | null;
    readonly participationRecords: readonly {
      readonly populationUnitId: string;
      readonly eligibleWeight: number;
      readonly turnoutDispositionAtElection: Exclude<TurnoutDisposition, "UNRESOLVED">;
      readonly participatingWeight: number;
    }[];
    readonly ballots: readonly {
      readonly populationUnitId: string;
      readonly ballotWeight: number;
      readonly selection: string;
    }[];
    readonly result: {
      readonly id: string;
      readonly resolvedAtSimulationTime: SimulationInstant;
      readonly totalEligibleWeight: number;
      readonly totalParticipatingWeight: number;
      readonly validCandidateBallotWeight: number;
      readonly blankBallotWeight: number;
      readonly candidateVoteWeights: readonly {
        readonly candidateId: string;
        readonly voteWeight: number;
      }[];
      readonly outcome: "ADMINISTRATION_WIN" | "OPPOSITION_WIN" | "TIE";
      readonly winningCandidateId: string | null;
    } | null;
    readonly certification: {
      readonly id: string;
      readonly sourceResultId: string;
      readonly certifiedAtSimulationTime: SimulationInstant;
      readonly status: "CERTIFIED";
    } | null;
  };
}

export interface ExecutiveSuccessionAuditProjection {
  readonly actors: readonly { readonly id: string }[];
  readonly institutionId: string;
  readonly office: {
    readonly id: string;
    readonly institutionId: string;
    readonly successionRuleId: string;
    readonly successionRequirement: ExecutiveSuccessionRequirement;
  };
  readonly currentOfficeAssignment: {
    readonly officeId: string;
    readonly actorId: string;
    readonly effectiveAtSimulationTime: SimulationInstant;
  };
  readonly successorEntitlement: {
    readonly id: string;
    readonly sourceCertificationId: string;
    readonly sourceResultId: string;
    readonly sourceWinningCandidateId: string;
    readonly entitledActorId: string;
    readonly establishedAtSimulationTime: SimulationInstant;
    readonly scheduledTransferAtSimulationTime: SimulationInstant;
  } | null;
  readonly transferResolvedAtSimulationTime: SimulationInstant | null;
}

export const GL0_EXECUTIVE_CONTROL_BINDING_ID = "gl0-executive-control-binding";
export const GL0_EXECUTIVE_ADMINISTRATION_STRATEGIC_SURFACE =
  "EXECUTIVE_ADMINISTRATION_STRATEGIC_SURFACE";

export interface ControlBinding {
  readonly id: string;
  readonly decisionSurface: typeof GL0_EXECUTIVE_ADMINISTRATION_STRATEGIC_SURFACE;
  readonly executiveOfficeId: string;
  readonly boundOfficeholderActorId: string;
  readonly status: "ACTIVE" | "ENDED";
  readonly endedAtSimulationTime: SimulationInstant | null;
  readonly endReason: "BOUND_OFFICEHOLDER_CHANGED" | null;
}

export type ControlBindingAuditProjection = ControlBinding;

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

export const createInitialControlBinding = (world: WorldState): ControlBinding => {
  const executivePolitical = world.governance.executivePolitical;
  const currentOfficeholder = resolveCurrentExecutiveOfficeholder(executivePolitical);
  if (currentOfficeholder.id !== GL0_INCUMBENT_EXECUTIVE_ACTOR_ID) {
    throw new Error("The GL0 session must begin bound to the incumbent executive actor.");
  }
  return {
    id: GL0_EXECUTIVE_CONTROL_BINDING_ID,
    decisionSurface: GL0_EXECUTIVE_ADMINISTRATION_STRATEGIC_SURFACE,
    executiveOfficeId: executivePolitical.office.id,
    boundOfficeholderActorId: currentOfficeholder.id,
    status: "ACTIVE",
    endedAtSimulationTime: null,
    endReason: null,
  };
};

/** Session-only reconciliation against canonical assignment; never writes to WorldState. */
export const reconcileControlBinding = (
  binding: ControlBinding,
  world: WorldState,
): ControlBinding => {
  if (binding.status === "ENDED") return binding;
  const assignment = world.governance.executivePolitical.currentOfficeAssignment;
  if (
    assignment.officeId === binding.executiveOfficeId &&
    assignment.actorId === binding.boundOfficeholderActorId
  ) {
    return binding;
  }
  return {
    ...binding,
    status: "ENDED",
    endedAtSimulationTime: assignment.effectiveAtSimulationTime,
    endReason: "BOUND_OFFICEHOLDER_CHANGED",
  };
};

export const assertActiveExecutiveControl = (
  binding: ControlBinding,
  world: WorldState,
): void => {
  const reconciled = reconcileControlBinding(binding, world);
  if (reconciled.status !== "ACTIVE") {
    throw new Error("No active ControlBinding: executive decision surface unavailable.");
  }
};

const projectWorld = (world: WorldState, controlBinding: ControlBinding): GameView => {
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
  const measurement = world.information.housingMeasurement;
  const measurementReports = world.information.artifacts.filter(
    (artifact) => artifact.sourceMeasurementId === measurement.id,
  );
  if (measurementReports.length > 1) {
    throw new Error(`Measurement ${measurement.id} has multiple official report artifacts.`);
  }
  const releasedReport = measurementReports[0] ?? null;
  const latestEnactedLaw = enactedLaws.length > 0 ? enactedLaws[enactedLaws.length - 1] : null;
  const housingGrantProgramLaw =
    housingGrantProgram === null
      ? null
      : enactedLaws.find((law) => law.id === housingGrantProgram.sourceLawId) ?? null;

  if (housingGrantProgram !== null && housingGrantProgramLaw === null) {
    throw new Error("The housing grant program references an unknown enacted law.");
  }
  const electoralContest = world.electoral.contests.find(
    (contest) => contest.id === GL0_EXECUTIVE_CONTEST_ID,
  );
  if (electoralContest === undefined) {
    throw new Error(`Missing synthetic electoral contest ${GL0_EXECUTIVE_CONTEST_ID}.`);
  }
  const electoralBoundary = world.electoral.boundaries.find(
    (boundary) => boundary.id === electoralContest.boundaryId,
  );
  if (electoralBoundary === undefined) {
    throw new Error(`Electoral contest ${electoralContest.id} references an unknown boundary.`);
  }
  const electoralEligibilityRule = resolveElectoralEligibilityRule(
    world.governance.electoralEligibilityLegalOrder,
    electoralContest.eligibilityRuleId,
  );
  const electoralProcedureRule = resolveElectoralProcedureRule(
    world.governance.electoralProcedureLegalOrder,
    electoralContest.procedureRuleId,
  );
  const executivePolitical = world.governance.executivePolitical;
  const successionRule = resolveExecutiveSuccessionRule(
    world.governance.executiveSuccessionLegalOrder,
    executivePolitical.office.successionRuleId,
  );
  const electionProcesses = world.electoral.electionProcesses.filter(
    (process) => process.contestId === electoralContest.id,
  );
  if (electionProcesses.length !== 1) {
    throw new Error(`Electoral contest ${electoralContest.id} requires one election process.`);
  }
  const electionProcess = electionProcesses[0];

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
    officialHousingMeasurement: {
      id: measurement.id,
      status:
        releasedReport !== null
          ? "RELEASED"
          : measurement.status === "SCHEDULED"
            ? "SCHEDULED"
            : "CAPTURED",
      observationStart: measurement.observationStart,
      observationEnd: measurement.observationEnd,
      capturedAtSimulationTime: measurement.capturedAtSimulationTime,
      scheduledReleaseAtSimulationTime: measurement.scheduledReleaseAtSimulationTime,
      capturedRegionalResults:
        measurement.result?.regionalObservations.map((observation) => ({
          ...observation,
        })) ?? [],
      releasedReport:
        releasedReport === null
          ? null
          : {
              id: releasedReport.id,
              sourceMeasurementId: releasedReport.sourceMeasurementId,
              asOfStart: releasedReport.asOfStart,
              asOfEnd: releasedReport.asOfEnd,
              createdAtSimulationTime: releasedReport.createdAtSimulationTime,
              releasedAtSimulationTime: releasedReport.releasedAtSimulationTime,
              accessClass: releasedReport.accessClass,
              regionalResults: releasedReport.regionalResults.map((observation) => ({
                ...observation,
              })),
            },
    },
    publicInformationAudit: {
      claims: world.information.politicalClaims.map((claim) => ({
        id: claim.id,
        origin: claim.origin,
        sourceArtifactIds: [...claim.sourceArtifactIds],
        claimPosition: claim.claimPosition,
        releasedAtSimulationTime: claim.releasedAtSimulationTime,
        accessClass: claim.accessClass,
      })),
      audiences: world.information.audiences.map((audience) => ({
        id: audience.id,
        audienceType: audience.audienceType,
        exposedArtifactIds: world.information.exposures
          .filter((exposure) => exposure.audienceId === audience.id)
          .map((exposure) => exposure.artifactId),
      })),
      exposures: world.information.exposures.map((exposure) => ({
        artifactId: exposure.artifactId,
        audienceId: exposure.audienceId,
        exposedAtSimulationTime: exposure.exposedAtSimulationTime,
      })),
    },
    populationAudit: {
      totalWeight: world.population.units.reduce((total, unit) => total + unit.weight, 0),
      electoralDispositionResolvedAt: world.population.electoralDispositionResolvedAt,
      units: world.population.units.map((unit) => ({
        id: unit.id,
        weight: unit.weight,
        residenceGeographyId: unit.residenceGeographyId,
        housingRegionId: unit.housingRegionId,
        informationAudienceId: unit.informationAudienceId,
        baselinePoliticalDisposition: unit.baselinePoliticalDisposition,
        housingPressureBelief: unit.housingPressureBelief,
        programPerformanceBelief: unit.programPerformanceBelief,
        housingAttribution: { ...unit.housingAttribution },
        housingSalience: unit.housingSalience,
        electoralPreference: unit.electoralPreference,
        turnoutDisposition: unit.turnoutDisposition,
        incorporatedArtifactIds: world.population.informationIncorporations
          .filter((incorporation) => incorporation.populationUnitId === unit.id)
          .map((incorporation) => incorporation.artifactId),
      })),
    },
    electoralAudit: {
      candidates: world.electoral.candidates.map((candidate) => ({ ...candidate })),
      contest: {
        id: electoralContest.id,
        boundaryId: electoralContest.boundaryId,
        scheduledElectionAt: electoralContest.scheduledElectionAt,
        eligibilityRuleId: electoralContest.eligibilityRuleId,
        eligibilityRequirement: electoralEligibilityRule.requirement,
        procedureRuleId: electoralContest.procedureRuleId,
        procedureRequirement: electoralProcedureRule.requirement,
        candidateIds: [...electoralContest.candidateIds],
        geographyRegionIds: [...electoralBoundary.geographyRegionIds],
      },
      derivedElectorate: deriveElectorate(
        world.electoral,
        world.population,
        world.governance.electoralEligibilityLegalOrder,
        electoralContest.id,
        world.time.current,
      ),
      electionProcess: {
        id: electionProcess.id,
        scheduledCertificationAt: electionProcess.scheduledCertificationAt,
        status: electionProcess.status,
        electorateSnapshot:
          electionProcess.electorateSnapshot === null
            ? null
            : {
                asOfSimulationTime:
                  electionProcess.electorateSnapshot.asOfSimulationTime,
                units: electionProcess.electorateSnapshot.units.map((unit) => ({
                  ...unit,
                })),
              },
        participationRecords: electionProcess.participationRecords.map((record) => ({
          ...record,
        })),
        ballots: electionProcess.ballots.map((ballot) => ({ ...ballot })),
        result:
          electionProcess.result === null
            ? null
            : {
                id: electionProcess.result.id,
                resolvedAtSimulationTime:
                  electionProcess.result.resolvedAtSimulationTime,
                totalEligibleWeight: electionProcess.result.totalEligibleWeight,
                totalParticipatingWeight:
                  electionProcess.result.totalParticipatingWeight,
                validCandidateBallotWeight:
                  electionProcess.result.validCandidateBallotWeight,
                blankBallotWeight: electionProcess.result.blankBallotWeight,
                candidateVoteWeights: electionProcess.result.candidateVoteWeights.map(
                  (candidateWeight) => ({ ...candidateWeight }),
                ),
                outcome: electionProcess.result.outcome,
                winningCandidateId: electionProcess.result.winningCandidateId,
              },
        certification:
          electionProcess.certification === null
            ? null
            : { ...electionProcess.certification },
      },
    },
    executiveSuccessionAudit: {
      actors: executivePolitical.actors.map((actor) => ({ ...actor })),
      institutionId: executivePolitical.institution.id,
      office: {
        ...executivePolitical.office,
        successionRequirement: successionRule.requirement,
      },
      currentOfficeAssignment: { ...executivePolitical.currentOfficeAssignment },
      successorEntitlement:
        executivePolitical.succession.successorEntitlement === null
          ? null
          : { ...executivePolitical.succession.successorEntitlement },
      transferResolvedAtSimulationTime:
        executivePolitical.succession.transferResolvedAtSimulationTime,
    },
    controlBindingAudit: { ...controlBinding },
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
  let controlBinding = createInitialControlBinding(world);

  const commitWorld = (nextWorld: WorldState): GameView => {
    world = nextWorld;
    controlBinding = reconcileControlBinding(controlBinding, world);
    return projectWorld(world, controlBinding);
  };

  const requireStrategicControl = (): void => {
    assertActiveExecutiveControl(controlBinding, world);
  };

  return {
    getView: () => projectWorld(world, controlBinding),
    advanceTo: (target) => commitWorld(advanceWorldTo(world, target)),
    submitHousingGrantProposal: (terms) => {
      requireStrategicControl();
      return commitWorld(submitHousingGrantProposal(world, terms));
    },
    amendHousingGrantProposal: (terms) => {
      requireStrategicControl();
      return commitWorld(amendHousingGrantProposal(world, terms));
    },
    resolveHousingGrantProposalVote: () =>
      commitWorld(resolveHousingGrantProposalVote(world)),
    recognizeHousingGrantFiscalAuthority: () =>
      commitWorld(recognizeHousingGrantFiscalAuthority(world)),
    establishHousingGrantProgram: () => commitWorld(establishHousingGrantProgram(world)),
    resolveStateHousingGrantDecision: (stateId) =>
      commitWorld(resolveStateHousingGrantDecision(world, stateId)),
    submitStateHousingGrantApplication: (stateId) =>
      commitWorld(submitStateHousingGrantApplication(world, stateId)),
    resolveFederalHousingGrantApplication: (stateId) =>
      commitWorld(resolveFederalHousingGrantApplication(world, stateId)),
    activateIntergovernmentalHousingGrantParticipation: (stateId) =>
      commitWorld(activateIntergovernmentalHousingGrantParticipation(world, stateId)),
    createHousingGrantAward: (stateId) =>
      commitWorld(createHousingGrantAward(world, stateId)),
    obligateHousingGrantAward: (stateId) =>
      commitWorld(obligateHousingGrantAward(world, stateId)),
    disburseHousingGrantObligation: (stateId) =>
      commitWorld(disburseHousingGrantObligation(world, stateId)),
    materializeHousingProjectFromDisbursement: (stateId) =>
      commitWorld(materializeHousingProjectFromDisbursement(world, stateId)),
    deployHousingImplementationSupportToStateC: () => {
      requireStrategicControl();
      return commitWorld(
        resolveHousingImplementationResponse(world, "DEPLOY_SUPPORT_TO_C"),
      );
    },
    preserveHousingImplementationSupportReserve: () => {
      requireStrategicControl();
      return commitWorld(
        resolveHousingImplementationResponse(world, "PRESERVE_SUPPORT_RESERVE"),
      );
    },
  };
};

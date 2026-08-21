import { availableHousingImplementationSupportUnits } from "../sim/administration";
import { GL0_EXECUTIVE_CONTEST_ID } from "../sim/electoral";
import type { WorldState } from "../sim/world";
import type { ControlBinding } from "./session";

export interface PlayerAdministrationView {
  readonly currentTime: number;
  readonly controlBinding: ControlBinding;
  readonly executiveOffice: {
    readonly id: string;
    readonly institutionId: string;
    readonly currentAssignment: {
      readonly officeId: string;
      readonly actorId: string;
      readonly effectiveAtSimulationTime: number;
    };
  };
  readonly legislative: {
    readonly proposal: {
      readonly id: string;
      readonly sponsorAdministrationId: string;
      readonly terms: {
        readonly federalMatchRatePercent: number;
        readonly participationCondition: "strict" | "lenient";
        readonly reportingRequirement: "standard" | "strengthened";
      };
      readonly status: "PENDING" | "PROCEDURE_PASSED" | "PROCEDURE_FAILED";
      readonly amendmentsAdopted: number;
    } | null;
    readonly enactedLaws: readonly {
      readonly id: string;
      readonly sourceProposalId: string;
      readonly enactedTerms: {
        readonly federalMatchRatePercent: number;
        readonly participationCondition: "strict" | "lenient";
        readonly reportingRequirement: "standard" | "strengthened";
      };
      readonly enactedAtSimulationTime: number;
      readonly appropriation: {
        readonly amount: number;
        readonly purpose: string;
      };
    }[];
  };
  readonly publicFinance: {
    readonly id: string;
    readonly sourceLawId: string;
    readonly availableAmount: number;
    readonly disbursedAmount: number;
    readonly recognizedAtSimulationTime: number;
    readonly disbursements: readonly {
      readonly id: string;
      readonly obligationId: string;
      readonly awardId: string;
      readonly stateJurisdictionId: string;
      readonly amount: number;
      readonly disbursedAtSimulationTime: number;
    }[];
  } | null;
  readonly fiscalExecution: {
    readonly sourceLawId: string;
    readonly obligated: number;
    readonly obligations: readonly {
      readonly id: string;
      readonly sourceLawId: string;
      readonly federalProgramId: string;
      readonly awardId: string;
      readonly stateJurisdictionId: string;
      readonly amount: number;
      readonly obligatedAtSimulationTime: number;
    }[];
  } | null;
  readonly programAdministration: {
    readonly operatorInstitution: { readonly id: string } | null;
    readonly program: {
      readonly id: string;
      readonly sourceLawId: string;
      readonly operatorInstitutionId: string;
      readonly publicFinanceRef: string;
      readonly status: "READY_FOR_APPLICATIONS";
    } | null;
    readonly stateRecords: readonly {
      readonly stateJurisdictionId: string;
      readonly decision: "APPLY" | "REFUSE" | null;
      readonly application: {
        readonly id: string;
        readonly status: "SUBMITTED";
        readonly submittedAtSimulationTime: number;
      } | null;
      readonly federalDetermination: {
        readonly id: string;
        readonly applicationId: string;
        readonly outcome: "ACCEPTED" | "DENIED";
        readonly determinedAtSimulationTime: number;
      } | null;
      readonly relationship: {
        readonly id: string;
        readonly stateApplicationId: string;
        readonly federalDeterminationId: string;
        readonly status: "ACTIVE";
      } | null;
      readonly award: {
        readonly id: string;
        readonly relationshipId: string;
        readonly awardedAmount: number;
        readonly awardedAtSimulationTime: number;
      } | null;
      readonly obligationId: string | null;
      readonly disbursementId: string | null;
    }[];
    readonly implementationSupport: {
      readonly totalSupportUnits: number;
      readonly committedSupportUnits: number;
      readonly availableSupportUnits: number;
      readonly decision: {
        readonly id: string;
        readonly action: "DEPLOY_SUPPORT_TO_C" | "PRESERVE_SUPPORT_RESERVE";
        readonly targetStateJurisdictionId: string | null;
        readonly decidedAtSimulationTime: number;
      } | null;
      readonly deployments: readonly {
        readonly id: string;
        readonly relationshipId: string;
        readonly stateJurisdictionId: string;
        readonly supportUnits: number;
        readonly deployedAtSimulationTime: number;
      }[];
    };
  };
  readonly officialHousingReports: readonly {
    readonly id: string;
    readonly sourceMeasurementId: string;
    readonly asOfStart: number;
    readonly asOfEnd: number;
    readonly releasedAtSimulationTime: number;
    readonly regionalResults: readonly {
      readonly housingRegionId: string;
      readonly housingStockUnits: number;
      readonly affordabilityPressure: number;
    }[];
  }[];
  readonly publicClaims: readonly {
    readonly id: string;
    readonly origin:
      | { readonly originType: "ADMINISTRATION"; readonly administrationId: string }
      | { readonly originType: "ACTOR"; readonly actorId: string };
    readonly sourceArtifactIds: readonly string[];
    readonly claimPosition: "PROGRAM_WORKING" | "PROGRAM_INADEQUATE";
    readonly releasedAtSimulationTime: number;
  }[];
  readonly contestedAuthority: {
    readonly executiveAttempts: readonly {
      readonly id: string;
      readonly initiatingActorId: string;
      readonly targetInstitutionId: string;
      readonly disputedAmount: number;
      readonly claimedLegalBasis: string;
      readonly status: "ATTEMPTED" | "WITHDRAWN";
    }[];
    readonly legalClaims: readonly {
      readonly id: string;
      readonly claimantJurisdictionId: string;
      readonly challengedAttemptId: string;
      readonly claimedGround: string;
      readonly requestedRemedy: string;
      readonly filedAtSimulationTime: number;
    }[];
    readonly legalContests: readonly {
      readonly id: string;
      readonly challengedAttemptId: string;
      readonly proceduralStage: "INTERIM_RELIEF_PENDING" | "MERITS_PENDING";
      readonly admittedAtSimulationTime: number;
      readonly interimReliefDecision: {
        readonly id: string;
        readonly outcome: "GRANT";
        readonly decidedAtSimulationTime: number;
      } | null;
      readonly judicialOrderIds: readonly string[];
      readonly reviewRequest: {
        readonly id: string;
        readonly sourceOrderId: string;
        readonly filedAtSimulationTime: number;
      } | null;
    }[];
    readonly receivedOrders: readonly {
      readonly id: string;
      readonly sourceContestId: string;
      readonly subjectInstitutionId: string;
      readonly directive: "DO_NOT_EXECUTE_DISPUTED_HOUSING_FUNDS_REDIRECTION";
      readonly issuedAtSimulationTime: number;
      readonly effectiveAtSimulationTime: number;
      readonly status: "ACTIVE";
    }[];
    readonly administrativeRedirections: readonly {
      readonly sourceAttemptId: string;
      readonly status: "PREPARING_REDIRECTION" | "HALTED_BY_JUDICIAL_ORDER";
      readonly receivedAtSimulationTime: number;
    }[];
    readonly orderReceipts: readonly {
      readonly orderId: string;
      readonly receivedAtSimulationTime: number;
    }[];
    readonly complianceResponses: readonly {
      readonly orderId: string;
      readonly response: "COMPLY" | "REFUSE";
      readonly resolvedAtSimulationTime: number;
    }[];
    readonly executiveResponses: readonly {
      readonly id: string;
      readonly orderId: string;
      readonly action: "BACK_DOWN" | "APPEAL_WHILE_COMPLYING";
      readonly respondedAtSimulationTime: number;
    }[];
  };
  readonly officialElection: {
    readonly contestId: string;
    readonly processId: string;
    readonly status: "SCHEDULED" | "RESOLVED" | "CERTIFIED";
    readonly result: {
      readonly id: string;
      readonly resolvedAtSimulationTime: number;
      readonly totalEligibleWeight: number;
      readonly totalParticipatingWeight: number;
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
      readonly certifiedAtSimulationTime: number;
      readonly status: "CERTIFIED";
    } | null;
  };
}

export const projectPlayerAdministrationView = (
  world: WorldState,
  controlBinding: ControlBinding,
): PlayerAdministrationView => {
  const governance = world.governance;
  const fiscalExecution = governance.fiscalExecution;
  const publicFinance = governance.publicFinance.housingGrant;
  const implementationSupport = governance.housingImplementationSupport;
  const receivedOrderIds = new Set(
    governance.contestedHousingAdministration.judicialOrderReceipts.map(
      (receipt) => receipt.orderId,
    ),
  );
  const electionProcesses = world.electoral.electionProcesses.filter(
    (process) => process.contestId === GL0_EXECUTIVE_CONTEST_ID,
  );
  if (electionProcesses.length !== 1) {
    throw new Error("Player administration view requires exactly one GL0 election process.");
  }
  const electionProcess = electionProcesses[0];

  return {
    currentTime: world.time.current,
    controlBinding: { ...controlBinding },
    executiveOffice: {
      id: governance.executivePolitical.office.id,
      institutionId: governance.executivePolitical.office.institutionId,
      currentAssignment: { ...governance.executivePolitical.currentOfficeAssignment },
    },
    legislative: {
      proposal:
        governance.proposal === null
          ? null
          : {
              ...governance.proposal,
              terms: { ...governance.proposal.terms },
              amendmentsAdopted: governance.procedure?.amendmentsAdopted ?? 0,
            },
      enactedLaws: governance.enactedLaws.map((law) => ({
        ...law,
        enactedTerms: { ...law.enactedTerms },
        appropriation: { ...law.appropriation },
      })),
    },
    publicFinance:
      publicFinance === null
        ? null
        : {
            ...publicFinance,
            disbursements: publicFinance.disbursements.map((record) => ({ ...record })),
          },
    fiscalExecution:
      fiscalExecution === null
        ? null
        : {
            ...fiscalExecution,
            obligations: fiscalExecution.obligations.map((record) => ({ ...record })),
          },
    programAdministration: {
      operatorInstitution:
        governance.administrativeInstitution === null
          ? null
          : { ...governance.administrativeInstitution },
      program:
        governance.housingGrantProgram === null
          ? null
          : { ...governance.housingGrantProgram },
      stateRecords: governance.stateJurisdictions.map((state) => {
        const decision = governance.stateProgramDecisions.find(
          (record) => record.stateJurisdictionId === state.id,
        );
        const application = governance.programApplications.find(
          (record) => record.stateJurisdictionId === state.id,
        );
        const determination = governance.federalApplicationDeterminations.find(
          (record) => record.stateJurisdictionId === state.id,
        );
        const relationship = governance.intergovernmentalProgramRelationships.find(
          (record) => record.stateJurisdictionId === state.id,
        );
        const award = governance.housingGrantAwards.find(
          (record) => record.stateJurisdictionId === state.id,
        );
        const obligation = fiscalExecution?.obligations.find(
          (record) => record.stateJurisdictionId === state.id,
        );
        const disbursement = publicFinance?.disbursements.find(
          (record) => record.stateJurisdictionId === state.id,
        );
        return {
          stateJurisdictionId: state.id,
          decision: decision?.decision ?? null,
          application:
            application === undefined
              ? null
              : {
                  id: application.id,
                  status: application.status,
                  submittedAtSimulationTime: application.submittedAtSimulationTime,
                },
          federalDetermination:
            determination === undefined
              ? null
              : {
                  id: determination.id,
                  applicationId: determination.applicationId,
                  outcome: determination.outcome,
                  determinedAtSimulationTime: determination.determinedAtSimulationTime,
                },
          relationship:
            relationship === undefined
              ? null
              : {
                  id: relationship.id,
                  stateApplicationId: relationship.stateApplicationId,
                  federalDeterminationId: relationship.federalDeterminationId,
                  status: relationship.status,
                },
          award:
            award === undefined
              ? null
              : {
                  id: award.id,
                  relationshipId: award.relationshipId,
                  awardedAmount: award.awardedAmount,
                  awardedAtSimulationTime: award.awardedAtSimulationTime,
                },
          obligationId: obligation?.id ?? null,
          disbursementId: disbursement?.id ?? null,
        };
      }),
      implementationSupport: {
        totalSupportUnits: implementationSupport.totalSupportUnits,
        committedSupportUnits: implementationSupport.committedSupportUnits,
        availableSupportUnits: availableHousingImplementationSupportUnits(
          implementationSupport,
        ),
        decision:
          governance.housingImplementationResponseDecision === null
            ? null
            : { ...governance.housingImplementationResponseDecision },
        deployments: implementationSupport.deployments.map((deployment) => ({
          id: deployment.id,
          relationshipId: deployment.relationshipId,
          stateJurisdictionId: deployment.stateJurisdictionId,
          supportUnits: deployment.supportUnits,
          deployedAtSimulationTime: deployment.deployedAtSimulationTime,
        })),
      },
    },
    officialHousingReports: world.information.artifacts.map((report) => ({
      id: report.id,
      sourceMeasurementId: report.sourceMeasurementId,
      asOfStart: report.asOfStart,
      asOfEnd: report.asOfEnd,
      releasedAtSimulationTime: report.releasedAtSimulationTime,
      regionalResults: report.regionalResults.map((result) => ({ ...result })),
    })),
    publicClaims: world.information.politicalClaims.map((claim) => ({
      id: claim.id,
      origin: { ...claim.origin },
      sourceArtifactIds: [...claim.sourceArtifactIds],
      claimPosition: claim.claimPosition,
      releasedAtSimulationTime: claim.releasedAtSimulationTime,
    })),
    contestedAuthority: {
      executiveAttempts:
        governance.executiveAuthority.disputedHousingFundsRedirectionAttempts.map(
          (attempt) => ({
            id: attempt.id,
            initiatingActorId: attempt.initiatingActorId,
            targetInstitutionId: attempt.targetInstitutionId,
            disputedAmount: attempt.disputedAmount,
            claimedLegalBasis: attempt.claimedLegalBasis,
            status: attempt.status,
          }),
        ),
      legalClaims: governance.judiciary.legalClaims.map((claim) => ({
        id: claim.id,
        claimantJurisdictionId: claim.claimantJurisdictionId,
        challengedAttemptId: claim.challengedAttemptId,
        claimedGround: claim.claimedGround,
        requestedRemedy: claim.requestedRemedy,
        filedAtSimulationTime: claim.filedAtSimulationTime,
      })),
      legalContests: governance.judiciary.legalContests.map((contest) => ({
        id: contest.id,
        challengedAttemptId: contest.challengedAttemptId,
        proceduralStage: contest.proceduralStage,
        admittedAtSimulationTime: contest.admittedAtSimulationTime,
        interimReliefDecision:
          contest.interimReliefDecision === null
            ? null
            : {
                id: contest.interimReliefDecision.id,
                outcome: contest.interimReliefDecision.outcome,
                decidedAtSimulationTime:
                  contest.interimReliefDecision.decidedAtSimulationTime,
              },
        judicialOrderIds: [...contest.judicialOrderIds],
        reviewRequest:
          contest.reviewRequest === null
            ? null
            : {
                id: contest.reviewRequest.id,
                sourceOrderId: contest.reviewRequest.sourceOrderId,
                filedAtSimulationTime: contest.reviewRequest.filedAtSimulationTime,
              },
      })),
      receivedOrders: governance.judicialLegalOrder.operativeOrders
        .filter((order) => receivedOrderIds.has(order.id))
        .map((order) => ({
          id: order.id,
          sourceContestId: order.sourceContestId,
          subjectInstitutionId: order.subjectInstitutionId,
          directive: order.directive,
          issuedAtSimulationTime: order.issuedAtSimulationTime,
          effectiveAtSimulationTime: order.effectiveAtSimulationTime,
          status: order.status,
        })),
      administrativeRedirections:
        governance.contestedHousingAdministration.disputedRedirections.map((record) => ({
          sourceAttemptId: record.sourceAttemptId,
          status: record.status,
          receivedAtSimulationTime: record.receivedAtSimulationTime,
        })),
      orderReceipts:
        governance.contestedHousingAdministration.judicialOrderReceipts.map((record) => ({
          orderId: record.orderId,
          receivedAtSimulationTime: record.receivedAtSimulationTime,
        })),
      complianceResponses:
        governance.contestedHousingAdministration.judicialOrderComplianceResponses.map(
          (record) => ({
            orderId: record.orderId,
            response: record.response,
            resolvedAtSimulationTime: record.resolvedAtSimulationTime,
          }),
        ),
      executiveResponses: governance.executiveAuthority.judicialResponses.map((response) => ({
        id: response.id,
        orderId: response.orderId,
        action: response.action,
        respondedAtSimulationTime: response.respondedAtSimulationTime,
      })),
    },
    officialElection: {
      contestId: electionProcess.contestId,
      processId: electionProcess.id,
      status: electionProcess.status,
      result:
        electionProcess.result === null
          ? null
          : {
              id: electionProcess.result.id,
              resolvedAtSimulationTime: electionProcess.result.resolvedAtSimulationTime,
              totalEligibleWeight: electionProcess.result.totalEligibleWeight,
              totalParticipatingWeight:
                electionProcess.result.totalParticipatingWeight,
              blankBallotWeight: electionProcess.result.blankBallotWeight,
              candidateVoteWeights: electionProcess.result.candidateVoteWeights.map(
                (candidate) => ({ ...candidate }),
              ),
              outcome: electionProcess.result.outcome,
              winningCandidateId: electionProcess.result.winningCandidateId,
            },
      certification:
        electionProcess.certification === null
          ? null
          : { ...electionProcess.certification },
    },
  };
};

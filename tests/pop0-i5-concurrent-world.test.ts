import { describe, expect, it } from "vitest";

import { createPresidentialOperatingProofSession } from "../src/app/presidential-operating-proof-session";
import {
  POP0_I2_OFFICE_IDS,
  POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS,
  POP0_V0_OPERATING_CONFIGURATION,
  POP0_V0_PROVENANCE_ROOT,
} from "../src/content/pop0-v0/configuration";
import { computePresidentialOperatingConfigurationHash } from
  "../src/sim/presidential-operating-runtime";
import type { PresidentialOperatingRuntimeConfiguration } from
  "../src/sim/presidential-operating-runtime";
import {
  computePresidentialInstrumentPayloadHash,
  type AuthorizeLegislativePositionPayload,
  type AuthorizePublicStatementPayload,
  type PresidentialEscalationOption,
  type RequestOfficeAnalysisPayload,
  type RequestIntergovernmentalContactPayload,
  type RequestWorkstreamCoordinationPayload,
} from "../src/sim/presidential-operating-intervention";

type DeepMutable<T> = T extends (...arguments_: never[]) => unknown
  ? T
  : T extends readonly (infer Item)[]
    ? DeepMutable<Item>[]
    : T extends object
      ? { -readonly [Key in keyof T]: DeepMutable<T[Key]> }
      : T;

type MutableConfiguration = Omit<
  PresidentialOperatingRuntimeConfiguration,
  "identity" | "concurrentWorld"
> & {
  identity: DeepMutable<PresidentialOperatingRuntimeConfiguration["identity"]>;
  concurrentWorld: DeepMutable<PresidentialOperatingRuntimeConfiguration["concurrentWorld"]>;
};

interface MutableI5SaveEnvelope {
  formatVersion: number;
  operatingState: {
    ownerStates: {
      congressionalInitiative: {
        state: {
          attemptAuthorizations: Array<{ transitionKind: string }>;
          transitionAttempts: Array<{ transitionKind: string }>;
        };
      };
      officeOperations: {
        state: Array<{
          officeId: string;
          ombReviewCapacity?: {
            coordinationRequests: Array<{ requestedQueueOrder: string[] }>;
          };
        }>;
      };
      regionalEmployment: {
        state: { cells: Array<{ currentEmployed: number }> };
      };
      historicalRecordIndex: {
        state: { entries: Array<Record<string, unknown>> };
      };
    };
  };
}

const mutableSave = (serialized: string): MutableI5SaveEnvelope =>
  JSON.parse(serialized) as MutableI5SaveEnvelope;

const modifiedConfiguration = (
  mutate: (candidate: MutableConfiguration) => void,
): PresidentialOperatingRuntimeConfiguration => {
  const candidate = structuredClone(POP0_V0_OPERATING_CONFIGURATION) as unknown as MutableConfiguration;
  mutate(candidate);
  const identity = {
    configurationId: candidate.identity.configurationId,
    configurationVersion: candidate.identity.configurationVersion,
    scenarioId: candidate.identity.scenarioId,
    scenarioVersion: candidate.identity.scenarioVersion,
  };
  const runtimeCandidate = candidate as unknown as PresidentialOperatingRuntimeConfiguration;
  candidate.identity = {
    ...identity,
    configurationHash: computePresidentialOperatingConfigurationHash({
      schemaVersion: runtimeCandidate.schemaVersion,
      identity,
      classification: runtimeCandidate.classification,
      operatingStateId: runtimeCandidate.operatingStateId,
      calendar: runtimeCandidate.calendar,
      administration: runtimeCandidate.administration,
      intervention: runtimeCandidate.intervention,
      housing: runtimeCandidate.housing,
      concurrentWorld: runtimeCandidate.concurrentWorld,
    }),
  };
  return candidate as unknown as PresidentialOperatingRuntimeConfiguration;
};

describe("POP0-I5 concurrent owner composition", () => {
  it("authenticates the exact closed I5 administration, capabilities, and zero-weight external humans", () => {
    const configuration = POP0_V0_OPERATING_CONFIGURATION;
    expect(configuration.administration.institutions).toHaveLength(3);
    expect(configuration.administration.offices).toHaveLength(9);
    expect(configuration.administration.actors).toHaveLength(10);
    expect(configuration.administration.officeholderAssignments).toHaveLength(9);
    expect(configuration.administration.populationLinkages).toHaveLength(10);
    expect(configuration.administration.recipientCapabilities).toHaveLength(9);
    expect(new Set(configuration.administration.recipientCapabilities.map((entry) => entry.id)).size).toBe(9);
    const registry = configuration.concurrentWorld.humanRegistry;
    expect(new Set(registry.entries.map((entry) => entry.actorId)).size).toBe(registry.entries.length);
    for (const entry of registry.entries) {
      expect(entry).toMatchObject({
        status: "OUTSIDE_MODELED_ORDINARY_POPULATION_SCOPE",
        populationWeight: 0,
      });
      expect(entry.prohibitedJoins).toEqual(expect.arrayContaining([
        "RESIDENCE", "HOUSEHOLD", "DEMOGRAPHIC", "MATERIAL_EXPOSURE", "PUBLIC_BELIEF", "VOTER",
      ]));
    }
  });

  it("advances material, political, media, quiet-condition, and bounded OMB owners concurrently", () => {
    const session = createPresidentialOperatingProofSession();
    session.advanceTo("2029-03-17T09:00:00-04:00");
    const owners = session.getOperatingState().ownerStates;

    expect(owners.regionalEmployment.state.materialOccurrences.filter(
      (entry) => entry.kind === "PLANT_SEPARATION",
    )).toHaveLength(3);
    expect(owners.regionalEmployment.state.materialOccurrences.some(
      (entry) => entry.kind === "SUPPLIER_CONTRACTION",
    )).toBe(true);
    expect(owners.regionalEmployment.state.evidenceReleases).toHaveLength(5);
    expect(owners.congressionalInitiative.state.transitionAttempts.map((entry) => entry.transitionKind))
      .toEqual([
        "BEGIN_SPONSOR_SEARCH",
        "SEEK_MEMBER_SPONSORSHIP",
        "INTRODUCE_SPONSORED_PROPOSAL",
        "ADVANCE_INTRODUCED_PROPOSAL_TO_CONSIDERATION_GATE",
      ]);
    expect(owners.externalActors.state.actions).toHaveLength(5);
    expect(owners.boundedMedia.state.editorialDecisions).toHaveLength(2);
    expect(owners.maternityServiceAccess.state.currentTravelBurdenMinutes).toBe(57);
    expect(owners.presidentialEscalations.state.escalations).toHaveLength(0);
    expect(owners.administrationWorkstreams.state.workstreams.map((entry) => entry.id))
      .toEqual(["pop0.workstream.inherited-housing-implementation"]);

    const omb = owners.officeOperations.state.find((entry) =>
      entry.officeId === POP0_V0_OPERATING_CONFIGURATION.concurrentWorld.ombReviewCapacity.officeId,
    );
    expect(omb?.ombReviewCapacity?.bookings.map((entry) => entry.status))
      .toEqual(["CONSUMED", "RESERVED"]);
    expect(Object.fromEntries(omb?.assignments.map((entry) => [entry.id, entry.status]) ?? []))
      .toMatchObject({
        "pop0.assignment.omb.employment-congress-full-analysis": "DELAYED",
        "pop0.assignment.omb.housing-full-implementation-review": "COMPLETED",
      });
  });

  it("round-trips format 5 byte-stably after concurrent progress", () => {
    const session = createPresidentialOperatingProofSession();
    session.advanceTo("2029-03-17T09:00:00-04:00");
    const saved = session.save();
    expect(JSON.parse(saved).formatVersion).toBe(5);
    expect(createPresidentialOperatingProofSession(saved).save()).toBe(saved);
  });

  it("keeps sponsorship refusal in the lower owner and expires every unused later attempt", () => {
    const configuration = modifiedConfiguration((candidate) => {
      candidate.concurrentWorld.congress.sponsorActorId =
        candidate.concurrentWorld.congress.refusingSponsorActorId;
    });
    const session = createPresidentialOperatingProofSession(undefined, configuration);
    session.advanceTo(configuration.concurrentWorld.congress.procedureOpportunity.closesAt);
    const congress = session.getOperatingState().ownerStates.congressionalInitiative.state;
    expect(congress.transitionAttempts.map((entry) => entry.transitionKind)).toEqual([
      "BEGIN_SPONSOR_SEARCH", "SEEK_MEMBER_SPONSORSHIP",
    ]);
    expect(congress.legislativeRuntime?.procedure.stage).toBe("SPONSOR_SOUGHT");
    expect(congress.legislativeRuntime?.procedure.sponsorship.status).not.toBe("INTRODUCED");
    expect(congress.windowLifecycleOccurrences).toContainEqual(expect.objectContaining({ kind: "EXPIRED" }));
    expect(session.getOperatingState().ownerStates.historicalRecordIndex.state.entries
      .filter((entry) => entry.recordKind === "CONGRESSIONAL_TRANSITION_ATTEMPT"))
      .toHaveLength(2);
  });

  it("rejects a gate result whose outer attempt chain omits canonical lower introduction", () => {
    const session = createPresidentialOperatingProofSession();
    session.advanceTo("2029-03-17T09:00:00-04:00");
    const tampered = mutableSave(session.save());
    const congress = tampered.operatingState.ownerStates.congressionalInitiative.state;
    congress.attemptAuthorizations = congress.attemptAuthorizations.filter((entry) =>
      entry.transitionKind !== "INTRODUCE_SPONSORED_PROPOSAL");
    congress.transitionAttempts = congress.transitionAttempts.filter((entry) =>
      entry.transitionKind !== "INTRODUCE_SPONSORED_PROPOSAL");
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(tampered)))
      .toThrow(/attempt sequence|authorized lower calls|direct LegislativeRuntimeState/i);
  });

  it("routes a presented legislative position through Legislative Affairs without deciding Congress", () => {
    const session = createPresidentialOperatingProofSession();
    const congressArtifactId =
      "pop0.artifact.congress.regional-employment-initiative-opportunity";
    const congressReceiptId =
      "pop0.delivery-authority.congress-to-legislative-affairs.bounded-opportunity.receipt";
    const assessmentId =
      "pop0.artifact.legislative-affairs.congressional-opportunity-assessment";
    const legislativeReceiptId =
      "pop0.receipt.legislative-affairs.congressional-opportunity-assessment";
    const chiefReceiptId =
      "pop0.receipt.chief-of-staff.congressional-opportunity-assessment";
    const workstreamId = "pop0.workstream.regional-employment-congressional-engagement";
    const escalationId = "pop0.escalation.regional-employment-congressional-opportunity";
    const presentationId =
      "pop0.escalation-presentation.regional-employment-congressional-opportunity";
    const decisionId = "pop0.decision.authorize-regional-employment-legislative-position";
    const instrumentId = `${decisionId}.instrument.1`;
    const governorIds = POP0_V0_OPERATING_CONFIGURATION.concurrentWorld.externalActors
      .filter((entry) => entry.kind === "GOVERNOR")
      .map((entry) => entry.humanActorId!);

    session.advanceTo("2029-02-16T10:00:00-05:00");
    let owners = session.getOperatingState().ownerStates;
    expect(owners.informationRoutes.state.artifacts.find((entry) => entry.id === congressArtifactId))
      .toMatchObject({
        kind: "I5_DOMAIN_EVIDENCE",
        domainEvidenceKind: "CONGRESSIONAL_INITIATIVE_OPPORTUNITY",
        sourceOwnerId: owners.congressionalInitiative.ownerId,
      });
    expect(owners.informationRoutes.state.receipts.find((entry) => entry.id === congressReceiptId))
      .toMatchObject({
        recipientOfficeId: POP0_I2_OFFICE_IDS.legislativeAffairs,
        artifactId: congressArtifactId,
        receivedSectionIds: ["initiative", "window", "limitations"],
        source: { kind: "EXTERNAL_OWNER_DELIVERY" },
      });

    session.advanceTo("2029-02-16T10:01:00-05:00");
    session.authorAssessment({
      id: assessmentId,
      version: "1",
      sectionIds: ["initiative", "window", "limitations"],
      producingOfficeId: POP0_I2_OFFICE_IDS.legislativeAffairs,
      authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.legislativeAffairsDirector,
      assignmentId: null,
      sourceReceiptIds: [congressReceiptId],
      sourceRetrievalIds: [],
      sourceMetadataNoticeIds: [],
      judgmentRuleIds: ["pop0.assessment-rule.legislative-affairs.congressional-opportunity"],
      claimedConfidence: "BOUNDED_CLAIM_SCOPED_CONFIDENCE",
      evidentiarySupport: "The Congress-owned formation and bounded procedural window were received.",
      assumptionIds: [],
      limitations: ["Legislative Affairs does not own sponsorship or procedure results."],
      recommendation: "Present bounded administration options without commanding Congress.",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
      revisionOfArtifactId: null,
      supersedesArtifactId: null,
    });
    session.advanceTo("2029-02-16T10:02:00-05:00");
    session.transferOfficeArtifact({
      id: legislativeReceiptId,
      sourceOfficeId: POP0_I2_OFFICE_IDS.legislativeAffairs,
      sourceOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.legislativeAffairsDirector,
      recipientOfficeId: POP0_I2_OFFICE_IDS.legislativeAffairs,
      artifactId: assessmentId,
      receivedSectionIds: ["initiative", "window", "limitations"],
      receivingAuthorityReference: "pop0.capability.legislative-affairs.regional-employment-position",
      deduplicationIdentity: `${legislativeReceiptId}.dedupe`,
    });
    session.transferOfficeArtifact({
      id: chiefReceiptId,
      sourceOfficeId: POP0_I2_OFFICE_IDS.legislativeAffairs,
      sourceOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.legislativeAffairsDirector,
      recipientOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      artifactId: assessmentId,
      receivedSectionIds: ["initiative", "window", "limitations"],
      receivingAuthorityReference:
        "pop0.authority.chief-of-staff.regional-employment-congressional-engagement",
      deduplicationIdentity: `${chiefReceiptId}.dedupe`,
    });
    session.advanceTo("2029-02-16T10:03:00-05:00");
    session.createAdministrationWorkstream({
      id: workstreamId,
      initialTransitionId: `${workstreamId}.transition.monitored`,
      initialTransitionDeduplicationIdentity: `${workstreamId}.transition.monitored.dedupe`,
      creatingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      creatingOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.chiefOfStaff,
      standingAuthorityId:
        "pop0.authority.chief-of-staff.regional-employment-congressional-engagement",
      initialSourceReferenceIds: [assessmentId, chiefReceiptId],
      initialReviewAt: "2029-02-19T08:00:00-05:00",
      reason: "Coordinate bounded administration handling while Congress remains autonomous.",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });

    const proposalVersion = owners.congressionalInitiative.state.legislativeRuntime!.agenda.currentVersion;
    const analysisPayload: RequestOfficeAnalysisPayload = {
      kind: "REQUEST_OFFICE_ANALYSIS",
      payloadVersion: "1",
      recipientOfficeId: POP0_I2_OFFICE_IDS.omb,
      subjectScopeFamily: "REGIONAL_EMPLOYMENT_CONGRESSIONAL_WINDOW",
      requestedAct: "Analyze only the received bounded initiative and window evidence.",
      sourceReferenceIds: [assessmentId, legislativeReceiptId],
      attachmentMetadata: [{
        artifactId: congressArtifactId,
        sectionIds: ["initiative", "window", "limitations"],
        shownToPresident: false,
      }],
      authorityBasis: POP0_V0_PROVENANCE_ROOT,
      requestedResponseDeadline: "2029-02-18T17:00:00-05:00",
      requestedQuestion: "What bounded employment analysis is supportable before the procedure window?",
      requestedProductKind: "FULL_REGIONAL_EMPLOYMENT_CONGRESSIONAL_ANALYSIS",
      evidenceArtifactId: congressArtifactId,
      evidenceSectionIds: ["initiative", "window", "limitations"],
      knownAccessLimitation: "OMB has not yet received the substantive Congress-owned artifact.",
      narrowingPermitted: true,
    };
    const coordinationPayload: RequestWorkstreamCoordinationPayload = {
      kind: "REQUEST_WORKSTREAM_COORDINATION",
      payloadVersion: "1",
      recipientOfficeId: POP0_I2_OFFICE_IDS.omb,
      subjectScopeFamily: "REGIONAL_EMPLOYMENT_CONGRESSIONAL_WINDOW",
      requestedAct: "Consider reprioritizing the named OMB review queue through OMB-owned handling.",
      sourceReferenceIds: [assessmentId, legislativeReceiptId],
      attachmentMetadata: [],
      authorityBasis: POP0_V0_PROVENANCE_ROOT,
      requestedResponseDeadline: "2029-02-18T17:00:00-05:00",
      workstreamId,
      coordinationObjective: "Resolve the bounded Housing and employment review collision.",
      participatingOfficeIds: [POP0_I2_OFFICE_IDS.legislativeAffairs, POP0_I2_OFFICE_IDS.omb],
      requestedReviewAt: "2029-02-18T12:00:00-05:00",
      permittedCoordinationActions: ["REPRIORITIZE_OMB_REVIEW_QUEUE"],
    };
    const legislativePayload: AuthorizeLegislativePositionPayload = {
      kind: "AUTHORIZE_LEGISLATIVE_POSITION",
      payloadVersion: "1",
      recipientOfficeId: POP0_I2_OFFICE_IDS.legislativeAffairs,
      subjectScopeFamily: "REGIONAL_EMPLOYMENT_CONGRESSIONAL_WINDOW",
      requestedAct: "Communicate bounded support for the initiative as introduced.",
      sourceReferenceIds: [assessmentId, legislativeReceiptId],
      attachmentMetadata: [],
      authorityBasis: POP0_V0_PROVENANCE_ROOT,
      requestedResponseDeadline: "2029-02-18T17:00:00-05:00",
      initiativeId: "pop0.proposal.regional-employment-stabilization",
      proposalVersion,
      positionKind: "SUPPORT_AS_INTRODUCED",
      negotiableTermIds: [],
      evidenceReferenceIds: [assessmentId, legislativeReceiptId],
      narrowingPermitted: false,
    };
    const intergovernmentalPayload: RequestIntergovernmentalContactPayload = {
      kind: "REQUEST_INTERGOVERNMENTAL_CONTACT",
      payloadVersion: "1",
      recipientOfficeId: POP0_I2_OFFICE_IDS.intergovernmentalAffairs,
      subjectScopeFamily: "REGIONAL_EMPLOYMENT_CONGRESSIONAL_WINDOW",
      requestedAct: "Contact the configured governors about regional employment response.",
      sourceReferenceIds: [assessmentId, legislativeReceiptId],
      attachmentMetadata: [],
      authorityBasis: POP0_V0_PROVENANCE_ROOT,
      requestedResponseDeadline: "2029-02-18T17:00:00-05:00",
      governorActorIds: governorIds,
      purposeFamily: "REGIONAL_EMPLOYMENT_RESPONSE",
      talkingPoints: ["A bounded regional employment initiative and procedure window exist."],
      prohibitedCommitmentKinds: ["PROMISE_FUNDING", "LEGAL_COMMITMENT", "GUARANTEE_STATE_OUTCOME"],
      narrowingPermitted: true,
    };
    const statementPayload: AuthorizePublicStatementPayload = {
      kind: "AUTHORIZE_PUBLIC_STATEMENT",
      payloadVersion: "1",
      recipientOfficeId: POP0_I2_OFFICE_IDS.communications,
      subjectScopeFamily: "REGIONAL_EMPLOYMENT_CONGRESSIONAL_WINDOW",
      requestedAct: "Prepare a bounded statement from the presented assessment.",
      sourceReferenceIds: [assessmentId, legislativeReceiptId],
      attachmentMetadata: [],
      authorityBasis: POP0_V0_PROVENANCE_ROOT,
      requestedResponseDeadline: "2029-02-18T17:00:00-05:00",
      subjectFamily: "REGIONAL_EMPLOYMENT_AND_CONGRESS",
      approvedClaims: ["A bounded regional employment initiative and procedure window exist."],
      limitations: ["The administration does not own congressional outcomes."],
      sourceSectionReferences: [{ artifactId: assessmentId, sectionId: "initiative" }],
      prohibitedUnsupportedClaimFamilies: ["PROMISE_OUTCOME", "UNSUPPORTED_CAUSAL_CLAIM"],
      releaseWindowEndsAt: "2029-02-18T18:00:00-05:00",
      narrowingPermitted: true,
    };
    const preview = <Payload extends
      | RequestOfficeAnalysisPayload
      | RequestWorkstreamCoordinationPayload
      | AuthorizeLegislativePositionPayload
      | RequestIntergovernmentalContactPayload
      | AuthorizePublicStatementPayload>(id: string, payload: Payload, bundlePosition: number) => ({
        id,
        payload,
        payloadHash: computePresidentialInstrumentPayloadHash(payload),
        bundlePosition,
        provenanceReference: POP0_V0_PROVENANCE_ROOT,
      });
    const options: readonly PresidentialEscalationOption[] = [
      {
        id: "pop0.option.congress.request-analysis-and-queue-coordination",
        kind: "REQUEST_SCOPED_ANALYSIS_AND_COORDINATION",
        previews: [
          preview("pop0.preview.congress.omb-analysis", analysisPayload, 0),
          preview("pop0.preview.congress.omb-queue-coordination", coordinationPayload, 1),
        ],
      },
      {
        id: "pop0.option.congress.authorize-legislative-position",
        kind: "AUTHORIZE_LEGISLATIVE_POSITION_OPTION",
        previews: [preview("pop0.preview.congress.legislative-position", legislativePayload, 0)],
      },
      {
        id: "pop0.option.congress.request-intergovernmental-contact",
        kind: "REQUEST_INTERGOVERNMENTAL_CONTACT_OPTION",
        previews: [preview("pop0.preview.congress.intergovernmental-contact", intergovernmentalPayload, 0)],
      },
      {
        id: "pop0.option.congress.authorize-public-statement",
        kind: "AUTHORIZE_PUBLIC_STATEMENT_OPTION",
        previews: [preview("pop0.preview.congress.public-statement", statementPayload, 0)],
      },
      {
        id: "pop0.option.congress.reserve-review",
        kind: "RESERVE_PRESIDENTIAL_REVIEW",
        previews: [],
        reservedAt: "2029-02-19T08:00:00-05:00",
        reviewQuestion: "Has a later bounded Congress-owned occurrence been presented?",
        expectedSourceReferenceIds: [assessmentId],
      },
      { id: "pop0.option.congress.monitor", kind: "ALLOW_MONITORING_DEFAULT", previews: [] },
    ];
    session.advanceTo("2029-02-16T10:04:00-05:00");
    session.createPresidentialEscalation({
      id: escalationId,
      deduplicationIdentity: `${escalationId}.dedupe`,
      escalatingOfficeId: POP0_I2_OFFICE_IDS.legislativeAffairs,
      escalatingOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.legislativeAffairsDirector,
      basisKind: "RECEIPT",
      basisArtifactId: assessmentId,
      basisReceiptId: legislativeReceiptId,
      sourceRecordIds: [assessmentId, legislativeReceiptId],
      presidentKnownPortions: [],
      staffOnlySourcePortions: ["initiative", "window", "limitations"].map((sectionId) => ({
        artifactId: assessmentId,
        sectionId,
      })),
      requestedJudgment: "Whether to authorize one bounded administration response.",
      knownClaims: [{
        claim: "Congress owns an initiative with a bounded procedure window.",
        sourceReferenceIds: [assessmentId, legislativeReceiptId],
      }],
      uncertainties: ["Congress retains every sponsorship and procedure decision."],
      limitations: ["No administration act creates a congressional result."],
      options,
      expiresAt: "2029-02-16T12:00:00-05:00",
      defaultRule: {
        presidentialInstrumentOutcome: "NO_NEW_PRESIDENTIAL_INSTRUMENT",
        officeMonitoringOutcome: "CONTINUE_EXISTING_OFFICE_MONITORING",
      },
      downstreamResolverOfficeIds: [
        POP0_I2_OFFICE_IDS.omb,
        POP0_I2_OFFICE_IDS.legislativeAffairs,
        POP0_I2_OFFICE_IDS.intergovernmentalAffairs,
        POP0_I2_OFFICE_IDS.communications,
      ],
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    session.advanceTo("2029-02-16T10:05:00-05:00");
    session.recordEscalationPresentation({
      id: presentationId,
      deduplicationIdentity: `${presentationId}.dedupe`,
      sourceEscalationId: escalationId,
      presentingOfficeId: POP0_I2_OFFICE_IDS.legislativeAffairs,
      presenterOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.legislativeAffairsDirector,
      shownSectionIds: [
        "BASIS", "KNOWN_FACTS", "UNCERTAINTIES_AND_LIMITATIONS", "DECISION_REQUEST",
        "OPTIONS_AND_PREVIEWS", "DEFAULT", "DEADLINE", "DOWNSTREAM_RESOLVERS",
      ],
      referencedButNotShownSourcePortions: ["initiative", "window", "limitations"].map((sectionId) => ({
        artifactId: assessmentId,
        sectionId,
      })),
      purpose: "Present the bounded congressional opportunity and exact local options.",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    session.advanceTo("2029-02-16T10:06:00-05:00");
    session.recordPresidentialDecision({
      id: decisionId,
      deduplicationIdentity: `${decisionId}.dedupe`,
      sourceEscalationId: escalationId,
      selectedOptionId: "pop0.option.congress.authorize-legislative-position",
      basisEscalationPresentationId: presentationId,
      acknowledgedUncertainties: ["Congress retains every sponsorship and procedure decision."],
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
      supersedesDecisionId: null,
    });
    session.advanceTo("2029-02-16T10:07:00-05:00");
    session.attemptInstrumentDispatch({
      id: "pop0.dispatch.congress.legislative-position",
      deduplicationIdentity: "pop0.dispatch.congress.legislative-position.dedupe",
      instrumentId,
      dispatchingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      dispatchPath: "PRESIDENTIAL_OPERATIONS_TO_LEGISLATIVE_AFFAIRS",
      outcome: "DELIVERED_TO_OFFICE_BOUNDARY",
      failureReason: null,
      outcomeProvenanceReference: POP0_V0_PROVENANCE_ROOT,
      retryOfDispatchId: null,
    });
    session.advanceTo("2029-02-16T10:08:00-05:00");
    session.admitOfficeInstrumentReceipt({
      id: "pop0.instrument-receipt.congress.legislative-position",
      deduplicationIdentity: "pop0.instrument-receipt.congress.legislative-position.dedupe",
      instrumentId,
      successfulDispatchId: "pop0.dispatch.congress.legislative-position",
      recipientOfficeId: POP0_I2_OFFICE_IDS.legislativeAffairs,
      receiptPath: "LEGISLATIVE_AFFAIRS_OFFICE_BOUNDARY_ADMISSION",
      receivingAuthorityReference: "pop0.capability.legislative-affairs.regional-employment-position",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    session.advanceTo("2029-02-16T10:09:00-05:00");
    session.recordRecipientDisposition({
      id: "pop0.disposition.congress.legislative-position",
      deduplicationIdentity: "pop0.disposition.congress.legislative-position.dedupe",
      recipientOfficeId: POP0_I2_OFFICE_IDS.legislativeAffairs,
      instrumentReceiptId: "pop0.instrument-receipt.congress.legislative-position",
      authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.legislativeAffairsDirector,
      capabilityAuthorityId: "pop0.capability.legislative-affairs.regional-employment-position",
      kind: "ACCEPTED_AS_REQUESTED",
      acceptedProductKind: null,
      acceptedSectionIds: [],
      acceptedCoordinationActions: [],
      constraintIds: [],
      constraintSourceReferenceIds: [],
      reason: null,
      limitations: [],
      nextReviewAt: null,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    session.advanceTo("2029-02-16T10:10:00-05:00");
    session.createInstrumentAuthorizedAssignment({
      id: "pop0.assignment.congress.legislative-position",
      dispositionId: "pop0.disposition.congress.legislative-position",
      requesterId: POP0_I2_OFFICE_IDS.legislativeAffairs,
      leadOfficeId: POP0_I2_OFFICE_IDS.legislativeAffairs,
      objective: "Prepare only the exact bounded legislative position.",
      sourceReferenceIds: ["pop0.disposition.congress.legislative-position"],
      requiredConsultationOfficeIds: [],
      authorityReference: "pop0.disposition.congress.legislative-position",
      deadline: "2029-02-18T17:00:00-05:00",
      expectedProductKind: "BOUNDED_LEGISLATIVE_POSITION",
      authorizationScope: {
        kind: "LEGISLATIVE_POSITION_ASSIGNMENT_SCOPE",
        initiativeId: legislativePayload.initiativeId,
        proposalVersion,
        positionKind: legislativePayload.positionKind,
        negotiableTermIds: [],
        evidenceReferenceIds: [assessmentId, legislativeReceiptId],
      },
    });
    const lowerBeforeCommunication = structuredClone(
      session.getOperatingState().ownerStates.congressionalInitiative.state.legislativeRuntime,
    );
    session.advanceTo("2029-02-16T10:11:00-05:00");
    session.authorI5OfficeCommunication({
      id: "pop0.communication.congress.legislative-position",
      assignmentId: "pop0.assignment.congress.legislative-position",
      authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.legislativeAffairsDirector,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    session.advanceTo("2029-02-16T10:12:00-05:00");
    session.dispatchI5OfficeCommunication({
      communicationArtifactId: "pop0.communication.congress.legislative-position",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    owners = session.getOperatingState().ownerStates;
    expect(owners.congressionalInitiative.state.externalReceipts.filter((entry) =>
      entry.artifactId === "pop0.communication.congress.legislative-position")).toHaveLength(2);
    expect(owners.congressionalInitiative.state.legislativeRuntime).toEqual(lowerBeforeCommunication);
    expect(owners.congressionalInitiative.state.transitionAttempts).toEqual([]);
    expect(createPresidentialOperatingProofSession(session.save()).save()).toBe(session.save());
  }, 90_000);

  it("keeps Employment autonomous when the President never engages or opens an unrelated inquiry", () => {
    const untouched = createPresidentialOperatingProofSession();
    untouched.advanceTo("2029-03-17T09:00:00-04:00");

    const engaged = createPresidentialOperatingProofSession();
    engaged.advanceTo("2029-02-18T09:00:00-05:00");
    engaged.presentPresidentialInquiryPreview({
      id: "pop0.inquiry-presentation.autonomy-counterfactual",
      opportunityId: "pop0.presidential-inquiry.rural-maternity-service-access",
      requestedProductKind: "MATERNITY_MONITORING_GAP_MEMO",
      requestedResponseDeadline: "2029-03-07T17:00:00-05:00",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    engaged.recordPresidentialInitiatedRequest({
      id: "pop0.decision.autonomy-counterfactual",
      deduplicationIdentity: "pop0.decision.autonomy-counterfactual.dedupe",
      inquiryPreviewPresentationId: "pop0.inquiry-presentation.autonomy-counterfactual",
      instrumentId: "pop0.instrument.autonomy-counterfactual",
      instrumentDeduplicationIdentity: "pop0.instrument.autonomy-counterfactual.dedupe",
      acknowledgedUncertainties: ["This inquiry does not affect Employment material truth."],
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    engaged.advanceTo("2029-03-17T09:00:00-04:00");

    expect(engaged.getOperatingState().ownerStates.regionalEmployment)
      .toEqual(untouched.getOperatingState().ownerStates.regionalEmployment);
  });

  it("lets one external actor counterfactual change without scripting replacement actions", () => {
    const baseline = createPresidentialOperatingProofSession();
    baseline.advanceTo("2029-03-17T09:00:00-04:00");
    const changedConfiguration = modifiedConfiguration((candidate) => {
      candidate.concurrentWorld.externalActors[0].evidenceAccess = "NONE";
    });
    const changed = createPresidentialOperatingProofSession(undefined, changedConfiguration);
    changed.advanceTo("2029-03-17T09:00:00-04:00");
    const baselineActions = Object.fromEntries(baseline.getOperatingState().ownerStates.externalActors.state.actions
      .map((entry) => [entry.id, entry.kind]));
    const changedActions = Object.fromEntries(changed.getOperatingState().ownerStates.externalActors.state.actions
      .map((entry) => [entry.id, entry.kind]));
    const changedId = `pop0.external-action.${changedConfiguration.concurrentWorld.externalActors[0].id}`;
    expect(changedActions[changedId]).toBe("NO_ACTION");
    expect(Object.fromEntries(Object.entries(changedActions).filter(([id]) => id !== changedId)))
      .toEqual(Object.fromEntries(Object.entries(baselineActions).filter(([id]) => id !== changedId)));
  });

  it("keeps two media selections independent and publication separate from exposure or belief", () => {
    const baseline = createPresidentialOperatingProofSession();
    baseline.advanceTo("2029-03-17T09:00:00-04:00");
    const baselineMedia = baseline.getOperatingState().ownerStates.boundedMedia.state;
    expect(Object.fromEntries(baselineMedia.editorialDecisions.map((entry) => [entry.outletId, entry.decision])))
      .toEqual({
        "pop0.media.lake-states-ledger": "PUBLISH",
        "pop0.media.national-economic-desk": "DEFER",
      });
    expect(baselineMedia.stories).toHaveLength(1);
    expect(baselineMedia.distributionAttempts).toHaveLength(1);
    expect(baselineMedia.exposures).toEqual([]);
    expect(JSON.stringify(baseline.getOperatingState())).not.toMatch(/publicBeliefState|aggregatePublicBelief/i);

    const configuration = modifiedConfiguration((candidate) => {
      candidate.concurrentWorld.mediaOutlets[1].publicationThreshold = 5;
    });
    const changed = createPresidentialOperatingProofSession(undefined, configuration);
    changed.advanceTo("2029-03-17T09:00:00-04:00");
    const changedMedia = changed.getOperatingState().ownerStates.boundedMedia.state;
    expect(Object.fromEntries(changedMedia.editorialDecisions.map((entry) => [entry.outletId, entry.decision])))
      .toEqual({
        "pop0.media.lake-states-ledger": "PUBLISH",
        "pop0.media.national-economic-desk": "PUBLISH_NARROWER_CLAIMS",
      });
    expect(changedMedia.stories).toHaveLength(2);
  });

  it("allows only the bounded HHS proactive inquiry without exposing the quiet condition", () => {
    const session = createPresidentialOperatingProofSession();
    session.advanceTo("2029-02-18T09:00:00-05:00");
    session.presentPresidentialInquiryPreview({
      id: "pop0.inquiry-presentation.rural-maternity.general",
      opportunityId: "pop0.presidential-inquiry.rural-maternity-service-access",
      requestedProductKind: "RURAL_MATERNITY_ACCESS_SCOPING",
      requestedResponseDeadline: "2029-03-07T17:00:00-05:00",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    expect(session.getPresidentialAttention()).toEqual([]);
    const before = session.getOperatingState().ownerStates;
    expect(before.presidentialInquiries.state.previewPresentations[0].shownQuestion)
      .toContain("nationwide rural maternity-service monitoring coverage");
    expect(JSON.stringify(before.presidentialInquiries.state.previewPresentations[0]))
      .not.toContain(before.maternityServiceAccess.state.facilityId);

    session.recordPresidentialInitiatedRequest({
      id: "pop0.decision.proactive-hhs-inquiry",
      deduplicationIdentity: "pop0.decision.proactive-hhs-inquiry.dedupe",
      inquiryPreviewPresentationId: "pop0.inquiry-presentation.rural-maternity.general",
      instrumentId: "pop0.instrument.proactive-hhs-inquiry",
      instrumentDeduplicationIdentity: "pop0.instrument.proactive-hhs-inquiry.dedupe",
      acknowledgedUncertainties: ["No facility-level condition has been presented."],
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    const owners = session.getOperatingState().ownerStates;
    expect(owners.presidentialDecisions.state[0]).toMatchObject({
      sourceKind: "INQUIRY_PREVIEW_PRESENTATION",
      sourceEscalationId: null,
      selectedOptionKind: "PROACTIVE_INQUIRY_REQUEST",
    });
    expect(owners.presidentialInstruments.state[0].payload.kind).toBe("REQUEST_OFFICE_ANALYSIS");
    expect(owners.presidentialEscalations.state.escalations).toEqual([]);
    expect(owners.administrationWorkstreams.state.workstreams.map((entry) => entry.id))
      .toEqual(["pop0.workstream.inherited-housing-implementation"]);
    expect(session.getOfficeInformation(POP0_I2_OFFICE_IDS.secretaryOfHhs).instrumentReceipts).toEqual([]);
    expect(createPresidentialOperatingProofSession(session.save()).save()).toBe(session.save());
  });

  it("discovers the quiet condition only after the full proactive request and HHS-owned analysis route", () => {
    const session = createPresidentialOperatingProofSession();
    session.advanceTo("2029-02-18T09:00:00-05:00");
    session.presentPresidentialInquiryPreview({
      id: "pop0.inquiry-presentation.hhs-discovery",
      opportunityId: "pop0.presidential-inquiry.rural-maternity-service-access",
      requestedProductKind: "RURAL_MATERNITY_ACCESS_SCOPING",
      requestedResponseDeadline: "2029-03-07T17:00:00-05:00",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    session.recordPresidentialInitiatedRequest({
      id: "pop0.decision.hhs-discovery",
      deduplicationIdentity: "pop0.decision.hhs-discovery.dedupe",
      inquiryPreviewPresentationId: "pop0.inquiry-presentation.hhs-discovery",
      instrumentId: "pop0.instrument.hhs-discovery",
      instrumentDeduplicationIdentity: "pop0.instrument.hhs-discovery.dedupe",
      acknowledgedUncertainties: ["The nationwide question does not disclose a facility condition."],
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    session.attemptInstrumentDispatch({
      id: "pop0.dispatch.hhs-discovery",
      deduplicationIdentity: "pop0.dispatch.hhs-discovery.dedupe",
      instrumentId: "pop0.instrument.hhs-discovery",
      dispatchingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      dispatchPath: "PRESIDENTIAL_OPERATIONS_TO_HHS",
      outcome: "DELIVERED_TO_OFFICE_BOUNDARY",
      failureReason: null,
      outcomeProvenanceReference: POP0_V0_PROVENANCE_ROOT,
      retryOfDispatchId: null,
    });
    session.admitOfficeInstrumentReceipt({
      id: "pop0.instrument-receipt.hhs-discovery",
      deduplicationIdentity: "pop0.instrument-receipt.hhs-discovery.dedupe",
      instrumentId: "pop0.instrument.hhs-discovery",
      successfulDispatchId: "pop0.dispatch.hhs-discovery",
      recipientOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHhs,
      receiptPath: "HHS_OFFICE_BOUNDARY_ADMISSION",
      receivingAuthorityReference: "pop0.capability.hhs.rural-maternity-analysis",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    session.recordRecipientDisposition({
      id: "pop0.disposition.hhs-discovery",
      deduplicationIdentity: "pop0.disposition.hhs-discovery.dedupe",
      recipientOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHhs,
      instrumentReceiptId: "pop0.instrument-receipt.hhs-discovery",
      authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.secretaryOfHhs,
      capabilityAuthorityId: "pop0.capability.hhs.rural-maternity-analysis",
      kind: "ACCEPTED_AS_REQUESTED",
      acceptedProductKind: "RURAL_MATERNITY_ACCESS_SCOPING",
      acceptedSectionIds: ["general-question"],
      acceptedCoordinationActions: [],
      constraintIds: [],
      constraintSourceReferenceIds: [],
      reason: null,
      limitations: [],
      nextReviewAt: null,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    session.createInstrumentAuthorizedAssignment({
      id: "pop0.assignment.hhs-discovery",
      dispositionId: "pop0.disposition.hhs-discovery",
      requesterId: POP0_I2_OFFICE_IDS.secretaryOfHhs,
      leadOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHhs,
      objective: "Answer the bounded nationwide service-access monitoring question.",
      sourceReferenceIds: ["pop0.disposition.hhs-discovery"],
      requiredConsultationOfficeIds: [],
      authorityReference: "pop0.disposition.hhs-discovery",
      deadline: "2029-03-07T17:00:00-05:00",
      expectedProductKind: "RURAL_MATERNITY_ACCESS_SCOPING",
      authorizationScope: {
        kind: "ANALYSIS_ASSIGNMENT_SCOPE",
        evidenceArtifactId: "pop0.presidential-inquiry.rural-maternity-service-access",
        evidenceSectionIds: ["general-question"],
        productKind: "RURAL_MATERNITY_ACCESS_SCOPING",
      },
    });
    expect(session.getOperatingState().ownerStates.officeOperations.state.find((entry) =>
      entry.officeId === POP0_I2_OFFICE_IDS.secretaryOfHhs)?.assignments[0].status).toBe("BLOCKED");
    session.advanceTo("2029-02-20T09:00:00-05:00");
    session.authorHHSProactiveInquiryResult({
      assignmentId: "pop0.assignment.hhs-discovery",
      artifactId: "pop0.artifact.hhs.rural-maternity-access-scoping",
      observationAuthorityId: "pop0.observation-authority.hhs.rural-maternity-service-access",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    const owners = session.getOperatingState().ownerStates;
    const artifact = owners.informationRoutes.state.artifacts.find((entry) =>
      entry.id === "pop0.artifact.hhs.rural-maternity-access-scoping");
    expect(artifact).toMatchObject({
      kind: "I5_DOMAIN_EVIDENCE",
      producingOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHhs,
      sourceOwnerId: owners.maternityServiceAccess.ownerId,
    });
    expect(owners.maternityServiceAccess.state.evidenceArtifactIds).toEqual([artifact?.id]);
    expect(owners.officeOperations.state.find((entry) =>
      entry.officeId === POP0_I2_OFFICE_IDS.secretaryOfHhs)?.assignments[0].status).toBe("COMPLETED");
    expect(session.getPresidentialAttention()).toEqual([]);
    expect(createPresidentialOperatingProofSession(session.save()).save()).toBe(session.save());
  });

  it("keeps the quiet-condition intergovernmental act on the complete office-to-autonomous-recipient chain", () => {
    const session = createPresidentialOperatingProofSession();
    const hhsArtifactId = "pop0.artifact.hhs.rural-maternity-access-scoping.act-chain";
    const hhsReceiptId = "pop0.receipt.hhs.rural-maternity-access-scoping.act-chain";
    const assessmentId = "pop0.artifact.hhs.rural-maternity-access-assessment";
    const chiefReceiptId = "pop0.receipt.chief-of-staff.rural-maternity-access-assessment";
    const workstreamId = "pop0.workstream.rural-maternity-service-access-review";
    const escalationId = "pop0.escalation.quiet-rural-maternity-service-access";
    const presentationId = "pop0.escalation-presentation.quiet-rural-maternity-service-access";
    const decisionId = "pop0.decision.quiet-rural-maternity.intergovernmental-contact";
    const instrumentId = `${decisionId}.instrument.1`;
    const governorIds = POP0_V0_OPERATING_CONFIGURATION.concurrentWorld.externalActors
      .filter((entry) => entry.kind === "GOVERNOR")
      .map((entry) => entry.humanActorId!);

    session.advanceTo("2029-02-18T09:00:00-05:00");
    session.presentPresidentialInquiryPreview({
      id: "pop0.inquiry-presentation.hhs-act-chain",
      opportunityId: "pop0.presidential-inquiry.rural-maternity-service-access",
      requestedProductKind: "RURAL_MATERNITY_ACCESS_SCOPING",
      requestedResponseDeadline: "2029-02-21T17:00:00-05:00",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    session.recordPresidentialInitiatedRequest({
      id: "pop0.decision.hhs-act-chain",
      deduplicationIdentity: "pop0.decision.hhs-act-chain.dedupe",
      inquiryPreviewPresentationId: "pop0.inquiry-presentation.hhs-act-chain",
      instrumentId: "pop0.instrument.hhs-act-chain",
      instrumentDeduplicationIdentity: "pop0.instrument.hhs-act-chain.dedupe",
      acknowledgedUncertainties: ["The general inquiry initially contains no facility-level truth."],
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    session.attemptInstrumentDispatch({
      id: "pop0.dispatch.hhs-act-chain",
      deduplicationIdentity: "pop0.dispatch.hhs-act-chain.dedupe",
      instrumentId: "pop0.instrument.hhs-act-chain",
      dispatchingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      dispatchPath: "PRESIDENTIAL_OPERATIONS_TO_HHS",
      outcome: "DELIVERED_TO_OFFICE_BOUNDARY",
      failureReason: null,
      outcomeProvenanceReference: POP0_V0_PROVENANCE_ROOT,
      retryOfDispatchId: null,
    });
    session.admitOfficeInstrumentReceipt({
      id: "pop0.instrument-receipt.hhs-act-chain",
      deduplicationIdentity: "pop0.instrument-receipt.hhs-act-chain.dedupe",
      instrumentId: "pop0.instrument.hhs-act-chain",
      successfulDispatchId: "pop0.dispatch.hhs-act-chain",
      recipientOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHhs,
      receiptPath: "HHS_OFFICE_BOUNDARY_ADMISSION",
      receivingAuthorityReference: "pop0.capability.hhs.rural-maternity-analysis",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    session.recordRecipientDisposition({
      id: "pop0.disposition.hhs-act-chain",
      deduplicationIdentity: "pop0.disposition.hhs-act-chain.dedupe",
      recipientOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHhs,
      instrumentReceiptId: "pop0.instrument-receipt.hhs-act-chain",
      authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.secretaryOfHhs,
      capabilityAuthorityId: "pop0.capability.hhs.rural-maternity-analysis",
      kind: "ACCEPTED_AS_REQUESTED",
      acceptedProductKind: "RURAL_MATERNITY_ACCESS_SCOPING",
      acceptedSectionIds: ["general-question"],
      acceptedCoordinationActions: [],
      constraintIds: [],
      constraintSourceReferenceIds: [],
      reason: null,
      limitations: [],
      nextReviewAt: null,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    session.createInstrumentAuthorizedAssignment({
      id: "pop0.assignment.hhs-act-chain",
      dispositionId: "pop0.disposition.hhs-act-chain",
      requesterId: POP0_I2_OFFICE_IDS.secretaryOfHhs,
      leadOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHhs,
      objective: "Answer only the bounded nationwide service-access inquiry.",
      sourceReferenceIds: ["pop0.disposition.hhs-act-chain"],
      requiredConsultationOfficeIds: [],
      authorityReference: "pop0.disposition.hhs-act-chain",
      deadline: "2029-02-21T17:00:00-05:00",
      expectedProductKind: "RURAL_MATERNITY_ACCESS_SCOPING",
      authorizationScope: {
        kind: "ANALYSIS_ASSIGNMENT_SCOPE",
        evidenceArtifactId: "pop0.presidential-inquiry.rural-maternity-service-access",
        evidenceSectionIds: ["general-question"],
        productKind: "RURAL_MATERNITY_ACCESS_SCOPING",
      },
    });

    session.advanceTo("2029-02-20T08:05:00-05:00");
    session.authorHHSProactiveInquiryResult({
      assignmentId: "pop0.assignment.hhs-act-chain",
      artifactId: hhsArtifactId,
      observationAuthorityId: "pop0.observation-authority.hhs.rural-maternity-service-access",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    session.advanceTo("2029-02-20T08:06:00-05:00");
    session.transferOfficeArtifact({
      id: hhsReceiptId,
      sourceOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHhs,
      sourceOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.secretaryOfHhs,
      recipientOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHhs,
      artifactId: hhsArtifactId,
      receivedSectionIds: ["scope", "finding", "limitations"],
      receivingAuthorityReference: "pop0.capability.hhs.rural-maternity-analysis",
      deduplicationIdentity: `${hhsReceiptId}.dedupe`,
    });
    session.advanceTo("2029-02-20T08:07:00-05:00");
    session.authorAssessment({
      id: assessmentId,
      version: "1",
      sectionIds: ["scope", "finding", "limitations"],
      producingOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHhs,
      authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.secretaryOfHhs,
      assignmentId: null,
      sourceReceiptIds: [hhsReceiptId],
      sourceRetrievalIds: [],
      sourceMetadataNoticeIds: [],
      judgmentRuleIds: ["pop0.assessment-rule.hhs.rural-maternity-service-access"],
      claimedConfidence: "BOUNDED_CLAIM_SCOPED_CONFIDENCE",
      evidentiarySupport: "Claim-scoped HHS analysis received by the Secretary office.",
      assumptionIds: [],
      limitations: ["This assessment does not own maternity-service material truth."],
      recommendation: "Transfer the bounded assessment for possible presidential review.",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
      revisionOfArtifactId: null,
      supersedesArtifactId: null,
    });
    session.advanceTo("2029-02-20T08:08:00-05:00");
    session.transferOfficeArtifact({
      id: chiefReceiptId,
      sourceOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHhs,
      sourceOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.secretaryOfHhs,
      recipientOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      artifactId: assessmentId,
      receivedSectionIds: ["scope", "finding", "limitations"],
      receivingAuthorityReference: "pop0.authority.chief-of-staff.rural-maternity-service-access-review",
      deduplicationIdentity: `${chiefReceiptId}.dedupe`,
    });
    session.advanceTo("2029-02-20T08:09:00-05:00");
    session.createAdministrationWorkstream({
      id: workstreamId,
      initialTransitionId: `${workstreamId}.transition.monitored`,
      initialTransitionDeduplicationIdentity: `${workstreamId}.transition.monitored.dedupe`,
      creatingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      creatingOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.chiefOfStaff,
      standingAuthorityId: "pop0.authority.chief-of-staff.rural-maternity-service-access-review",
      initialSourceReferenceIds: [assessmentId, chiefReceiptId],
      initialReviewAt: "2029-02-21T09:00:00-05:00",
      reason: "Monitor the bounded HHS assessment without owning the material condition.",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });

    const intergovernmentalPayload: RequestIntergovernmentalContactPayload = {
      kind: "REQUEST_INTERGOVERNMENTAL_CONTACT",
      payloadVersion: "1",
      recipientOfficeId: POP0_I2_OFFICE_IDS.intergovernmentalAffairs,
      subjectScopeFamily: "RURAL_MATERNITY_SERVICE_ACCESS",
      requestedAct: "Contact the configured governors about the bounded HHS service-access finding.",
      sourceReferenceIds: [assessmentId, chiefReceiptId],
      attachmentMetadata: [],
      authorityBasis: POP0_V0_PROVENANCE_ROOT,
      requestedResponseDeadline: "2029-02-21T17:00:00-05:00",
      governorActorIds: governorIds,
      purposeFamily: "RURAL_MATERNITY_SERVICE_ACCESS",
      talkingPoints: ["HHS identified a bounded rural maternity service-access concern."],
      prohibitedCommitmentKinds: ["PROMISE_FUNDING", "LEGAL_COMMITMENT", "GUARANTEE_STATE_OUTCOME"],
      narrowingPermitted: true,
    };
    const publicStatementPayload: AuthorizePublicStatementPayload = {
      kind: "AUTHORIZE_PUBLIC_STATEMENT",
      payloadVersion: "1",
      recipientOfficeId: POP0_I2_OFFICE_IDS.communications,
      subjectScopeFamily: "RURAL_MATERNITY_SERVICE_ACCESS",
      requestedAct: "Prepare a bounded statement using only presented HHS assessment sections.",
      sourceReferenceIds: [assessmentId, chiefReceiptId],
      attachmentMetadata: [],
      authorityBasis: POP0_V0_PROVENANCE_ROOT,
      requestedResponseDeadline: "2029-02-21T17:00:00-05:00",
      subjectFamily: "RURAL_MATERNITY_SERVICE_ACCESS",
      approvedClaims: ["HHS identified a bounded rural maternity service-access concern."],
      limitations: ["The assessment does not establish a national material total."],
      sourceSectionReferences: [{ artifactId: assessmentId, sectionId: "finding" }],
      prohibitedUnsupportedClaimFamilies: ["PROMISE_OUTCOME", "UNSUPPORTED_CAUSAL_CLAIM"],
      releaseWindowEndsAt: "2029-02-22T08:00:00-05:00",
      narrowingPermitted: true,
    };
    const options: readonly PresidentialEscalationOption[] = [
      {
        id: "pop0.option.quiet.intergovernmental-contact",
        kind: "REQUEST_INTERGOVERNMENTAL_CONTACT_OPTION",
        previews: [{
          id: "pop0.preview.quiet.intergovernmental-contact",
          payload: intergovernmentalPayload,
          payloadHash: computePresidentialInstrumentPayloadHash(intergovernmentalPayload),
          bundlePosition: 0,
          provenanceReference: POP0_V0_PROVENANCE_ROOT,
        }],
      },
      {
        id: "pop0.option.quiet.public-statement",
        kind: "AUTHORIZE_PUBLIC_STATEMENT_OPTION",
        previews: [{
          id: "pop0.preview.quiet.public-statement",
          payload: publicStatementPayload,
          payloadHash: computePresidentialInstrumentPayloadHash(publicStatementPayload),
          bundlePosition: 0,
          provenanceReference: POP0_V0_PROVENANCE_ROOT,
        }],
      },
      {
        id: "pop0.option.quiet.reserve-review",
        kind: "RESERVE_PRESIDENTIAL_REVIEW",
        previews: [],
        reservedAt: "2029-02-21T09:00:00-05:00",
        reviewQuestion: "Has a new bounded service-access artifact been presented?",
        expectedSourceReferenceIds: [assessmentId],
      },
      { id: "pop0.option.quiet.allow-monitoring", kind: "ALLOW_MONITORING_DEFAULT", previews: [] },
    ];
    session.advanceTo("2029-02-20T08:10:00-05:00");
    session.createPresidentialEscalation({
      id: escalationId,
      deduplicationIdentity: `${escalationId}.dedupe`,
      escalatingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      escalatingOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.chiefOfStaff,
      basisKind: "RECEIPT",
      basisArtifactId: assessmentId,
      basisReceiptId: chiefReceiptId,
      sourceRecordIds: [assessmentId, chiefReceiptId],
      presidentKnownPortions: [],
      staffOnlySourcePortions: ["scope", "finding", "limitations"].map((sectionId) => ({
        artifactId: assessmentId,
        sectionId,
      })),
      requestedJudgment: "Whether to request bounded governor contact, authorize a statement, reserve, or monitor.",
      knownClaims: [{
        claim: "The HHS assessment identifies a bounded service-access concern.",
        sourceReferenceIds: [assessmentId, chiefReceiptId],
      }],
      uncertainties: ["No governor response or media selection has yet occurred."],
      limitations: ["The assessment does not own the underlying maternity-service condition."],
      options,
      expiresAt: "2029-02-20T12:00:00-05:00",
      defaultRule: {
        presidentialInstrumentOutcome: "NO_NEW_PRESIDENTIAL_INSTRUMENT",
        officeMonitoringOutcome: "CONTINUE_EXISTING_OFFICE_MONITORING",
      },
      downstreamResolverOfficeIds: [
        POP0_I2_OFFICE_IDS.intergovernmentalAffairs,
        POP0_I2_OFFICE_IDS.communications,
      ],
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    session.advanceTo("2029-02-20T08:11:00-05:00");
    session.recordEscalationPresentation({
      id: presentationId,
      deduplicationIdentity: `${presentationId}.dedupe`,
      sourceEscalationId: escalationId,
      presentingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      presenterOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.chiefOfStaff,
      shownSectionIds: [
        "BASIS", "KNOWN_FACTS", "UNCERTAINTIES_AND_LIMITATIONS", "DECISION_REQUEST",
        "OPTIONS_AND_PREVIEWS", "DEFAULT", "DEADLINE", "DOWNSTREAM_RESOLVERS",
      ],
      referencedButNotShownSourcePortions: ["scope", "finding", "limitations"].map((sectionId) => ({
        artifactId: assessmentId,
        sectionId,
      })),
      purpose: "Present the bounded HHS assessment and exact local options.",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    const presentedCheckpoint = session.save();
    session.advanceTo("2029-02-20T08:12:00-05:00");
    session.recordPresidentialDecision({
      id: decisionId,
      deduplicationIdentity: `${decisionId}.dedupe`,
      sourceEscalationId: escalationId,
      selectedOptionId: "pop0.option.quiet.intergovernmental-contact",
      basisEscalationPresentationId: presentationId,
      acknowledgedUncertainties: ["No governor response or media selection has yet occurred."],
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
      supersedesDecisionId: null,
    });
    session.advanceTo("2029-02-20T08:13:00-05:00");
    session.attemptInstrumentDispatch({
      id: "pop0.dispatch.quiet.intergovernmental-contact",
      deduplicationIdentity: "pop0.dispatch.quiet.intergovernmental-contact.dedupe",
      instrumentId,
      dispatchingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      dispatchPath: "PRESIDENTIAL_OPERATIONS_TO_INTERGOVERNMENTAL_AFFAIRS",
      outcome: "DELIVERED_TO_OFFICE_BOUNDARY",
      failureReason: null,
      outcomeProvenanceReference: POP0_V0_PROVENANCE_ROOT,
      retryOfDispatchId: null,
    });
    session.advanceTo("2029-02-20T08:14:00-05:00");
    session.admitOfficeInstrumentReceipt({
      id: "pop0.instrument-receipt.quiet.intergovernmental-contact",
      deduplicationIdentity: "pop0.instrument-receipt.quiet.intergovernmental-contact.dedupe",
      instrumentId,
      successfulDispatchId: "pop0.dispatch.quiet.intergovernmental-contact",
      recipientOfficeId: POP0_I2_OFFICE_IDS.intergovernmentalAffairs,
      receiptPath: "INTERGOVERNMENTAL_AFFAIRS_OFFICE_BOUNDARY_ADMISSION",
      receivingAuthorityReference: "pop0.capability.intergovernmental-affairs.bounded-contact",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    session.advanceTo("2029-02-20T08:15:00-05:00");
    session.recordRecipientDisposition({
      id: "pop0.disposition.quiet.intergovernmental-contact",
      deduplicationIdentity: "pop0.disposition.quiet.intergovernmental-contact.dedupe",
      recipientOfficeId: POP0_I2_OFFICE_IDS.intergovernmentalAffairs,
      instrumentReceiptId: "pop0.instrument-receipt.quiet.intergovernmental-contact",
      authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.intergovernmentalAffairsDirector,
      capabilityAuthorityId: "pop0.capability.intergovernmental-affairs.bounded-contact",
      kind: "ACCEPTED_AS_REQUESTED",
      acceptedProductKind: null,
      acceptedSectionIds: [],
      acceptedCoordinationActions: [],
      constraintIds: [],
      constraintSourceReferenceIds: [],
      reason: null,
      limitations: [],
      nextReviewAt: null,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    session.advanceTo("2029-02-20T08:16:00-05:00");
    session.createInstrumentAuthorizedAssignment({
      id: "pop0.assignment.quiet.intergovernmental-contact",
      dispositionId: "pop0.disposition.quiet.intergovernmental-contact",
      requesterId: POP0_I2_OFFICE_IDS.intergovernmentalAffairs,
      leadOfficeId: POP0_I2_OFFICE_IDS.intergovernmentalAffairs,
      objective: "Prepare only the accepted bounded governor contact.",
      sourceReferenceIds: ["pop0.disposition.quiet.intergovernmental-contact"],
      requiredConsultationOfficeIds: [],
      authorityReference: "pop0.disposition.quiet.intergovernmental-contact",
      deadline: "2029-02-21T17:00:00-05:00",
      expectedProductKind: "BOUNDED_INTERGOVERNMENTAL_CONTACT",
      authorizationScope: {
        kind: "INTERGOVERNMENTAL_CONTACT_ASSIGNMENT_SCOPE",
        governorActorIds: governorIds,
        purposeFamily: "RURAL_MATERNITY_SERVICE_ACCESS",
        talkingPoints: ["HHS identified a bounded rural maternity service-access concern."],
        prohibitedCommitmentKinds: ["PROMISE_FUNDING", "LEGAL_COMMITMENT", "GUARANTEE_STATE_OUTCOME"],
      },
    });
    session.advanceTo("2029-02-20T08:17:00-05:00");
    const beforeCommunication = session.save();
    expect(() => session.authorI5OfficeCommunication({
      id: "pop0.communication.quiet.intergovernmental-contact.invalid-holder",
      assignmentId: "pop0.assignment.quiet.intergovernmental-contact",
      authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.communicationsDirector,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    })).toThrow(/officeholder|assignment|scope/i);
    expect(session.save()).toBe(beforeCommunication);
    session.authorI5OfficeCommunication({
      id: "pop0.communication.quiet.intergovernmental-contact",
      assignmentId: "pop0.assignment.quiet.intergovernmental-contact",
      authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.intergovernmentalAffairsDirector,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    const materialBeforeDispatch = session.getOperatingState().ownerStates.maternityServiceAccess;
    expect(session.getOperatingState().ownerStates.externalActors.state.actions).toEqual([]);
    session.advanceTo("2029-02-20T08:18:00-05:00");
    session.dispatchI5OfficeCommunication({
      communicationArtifactId: "pop0.communication.quiet.intergovernmental-contact",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    let owners = session.getOperatingState().ownerStates;
    expect(owners.officeOperations.state.find((entry) =>
      entry.officeId === POP0_I2_OFFICE_IDS.intergovernmentalAffairs)
      ?.externalCommunicationDispatches).toHaveLength(3);
    expect(owners.externalActors.state.receipts.filter((entry) =>
      entry.artifactId === "pop0.communication.quiet.intergovernmental-contact")).toHaveLength(3);
    expect(owners.externalActors.state.actions).toEqual([]);
    expect(owners.maternityServiceAccess).toEqual(materialBeforeDispatch);

    session.advanceTo("2029-02-22T10:00:00-05:00");
    owners = session.getOperatingState().ownerStates;
    const governorActions = owners.externalActors.state.actions.filter((entry) =>
      governorIds.includes(entry.actorOrInstitutionId));
    expect(governorActions).toHaveLength(3);
    expect(governorActions.every((entry) => entry.receiptId?.includes(
      "pop0.communication.quiet.intergovernmental-contact"))).toBe(true);
    expect(new Set(governorActions.map((entry) => entry.kind)).size).toBeGreaterThan(1);
    expect(owners.maternityServiceAccess).toEqual(materialBeforeDispatch);
    expect(createPresidentialOperatingProofSession(session.save()).save()).toBe(session.save());
    const widened = JSON.parse(session.save()) as {
      operatingState: { ownerStates: { informationRoutes: { state: { artifacts: Array<{
        id: string;
        behaviorPayload: Record<string, unknown>;
      }> } } } };
    };
    const widenedCommunication = widened.operatingState.ownerStates.informationRoutes.state.artifacts.find(
      (entry) => entry.id === "pop0.communication.quiet.intergovernmental-contact",
    )!;
    widenedCommunication.behaviorPayload = {
      ...widenedCommunication.behaviorPayload,
      talkingPoints: ["An unapproved funding promise."],
    };
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(widened)))
      .toThrow(/assignment scope|communication|recipient-owned/i);
    const partialFanout = JSON.parse(session.save()) as {
      operatingState: { ownerStates: { officeOperations: { state: Array<{
        officeId: string;
        externalCommunicationDispatches: Array<{ communicationArtifactId: string }>;
      }> } } };
    };
    const intergovernmentalOffice = partialFanout.operatingState.ownerStates.officeOperations.state.find(
      (entry) => entry.officeId === POP0_I2_OFFICE_IDS.intergovernmentalAffairs,
    )!;
    intergovernmentalOffice.externalCommunicationDispatches =
      intergovernmentalOffice.externalCommunicationDispatches.slice(1);
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(partialFanout)))
      .toThrow(/partial|fan-out|historical|dispatch/i);

    const statement = createPresidentialOperatingProofSession(presentedCheckpoint);
    const statementDecisionId = "pop0.decision.quiet-rural-maternity.public-statement";
    const statementInstrumentId = `${statementDecisionId}.instrument.1`;
    statement.advanceTo("2029-02-20T08:12:00-05:00");
    statement.recordPresidentialDecision({
      id: statementDecisionId,
      deduplicationIdentity: `${statementDecisionId}.dedupe`,
      sourceEscalationId: escalationId,
      selectedOptionId: "pop0.option.quiet.public-statement",
      basisEscalationPresentationId: presentationId,
      acknowledgedUncertainties: ["No governor response or media selection has yet occurred."],
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
      supersedesDecisionId: null,
    });
    statement.advanceTo("2029-02-20T08:13:00-05:00");
    statement.attemptInstrumentDispatch({
      id: "pop0.dispatch.quiet.public-statement",
      deduplicationIdentity: "pop0.dispatch.quiet.public-statement.dedupe",
      instrumentId: statementInstrumentId,
      dispatchingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      dispatchPath: "PRESIDENTIAL_OPERATIONS_TO_COMMUNICATIONS",
      outcome: "DELIVERED_TO_OFFICE_BOUNDARY",
      failureReason: null,
      outcomeProvenanceReference: POP0_V0_PROVENANCE_ROOT,
      retryOfDispatchId: null,
    });
    statement.advanceTo("2029-02-20T08:14:00-05:00");
    statement.admitOfficeInstrumentReceipt({
      id: "pop0.instrument-receipt.quiet.public-statement",
      deduplicationIdentity: "pop0.instrument-receipt.quiet.public-statement.dedupe",
      instrumentId: statementInstrumentId,
      successfulDispatchId: "pop0.dispatch.quiet.public-statement",
      recipientOfficeId: POP0_I2_OFFICE_IDS.communications,
      receiptPath: "COMMUNICATIONS_OFFICE_BOUNDARY_ADMISSION",
      receivingAuthorityReference: "pop0.capability.communications.bounded-public-statement",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    statement.advanceTo("2029-02-20T08:15:00-05:00");
    statement.recordRecipientDisposition({
      id: "pop0.disposition.quiet.public-statement",
      deduplicationIdentity: "pop0.disposition.quiet.public-statement.dedupe",
      recipientOfficeId: POP0_I2_OFFICE_IDS.communications,
      instrumentReceiptId: "pop0.instrument-receipt.quiet.public-statement",
      authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.communicationsDirector,
      capabilityAuthorityId: "pop0.capability.communications.bounded-public-statement",
      kind: "ACCEPTED_AS_REQUESTED",
      acceptedProductKind: null,
      acceptedSectionIds: [],
      acceptedCoordinationActions: [],
      constraintIds: [],
      constraintSourceReferenceIds: [],
      reason: null,
      limitations: [],
      nextReviewAt: null,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    statement.advanceTo("2029-02-20T08:16:00-05:00");
    statement.createInstrumentAuthorizedAssignment({
      id: "pop0.assignment.quiet.public-statement",
      dispositionId: "pop0.disposition.quiet.public-statement",
      requesterId: POP0_I2_OFFICE_IDS.communications,
      leadOfficeId: POP0_I2_OFFICE_IDS.communications,
      objective: "Prepare only the bounded approved statement.",
      sourceReferenceIds: ["pop0.disposition.quiet.public-statement"],
      requiredConsultationOfficeIds: [],
      authorityReference: "pop0.disposition.quiet.public-statement",
      deadline: "2029-02-21T17:00:00-05:00",
      expectedProductKind: "BOUNDED_PUBLIC_STATEMENT",
      authorizationScope: {
        kind: "PUBLIC_STATEMENT_ASSIGNMENT_SCOPE",
        approvedClaims: ["HHS identified a bounded rural maternity service-access concern."],
        limitations: ["The assessment does not establish a national material total."],
        sourceSectionReferences: [{ artifactId: assessmentId, sectionId: "finding" }],
        prohibitedUnsupportedClaimFamilies: ["PROMISE_OUTCOME", "UNSUPPORTED_CAUSAL_CLAIM"],
        releaseWindowEndsAt: "2029-02-22T08:00:00-05:00",
        productKind: "BOUNDED_PUBLIC_STATEMENT",
      },
    });
    statement.advanceTo("2029-02-20T08:17:00-05:00");
    statement.authorI5OfficeCommunication({
      id: "pop0.communication.quiet.public-statement",
      assignmentId: "pop0.assignment.quiet.public-statement",
      authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.communicationsDirector,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    statement.advanceTo("2029-02-20T08:18:00-05:00");
    statement.dispatchI5OfficeCommunication({
      communicationArtifactId: "pop0.communication.quiet.public-statement",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    expect(statement.getOperatingState().ownerStates.boundedMedia.state.editorialDecisions).toEqual([]);
    statement.advanceTo("2029-02-20T09:00:00-05:00");
    const media = statement.getOperatingState().ownerStates.boundedMedia.state;
    expect(Object.fromEntries(media.editorialDecisions.map((entry) => [entry.outletId, entry.decision])))
      .toEqual({
        "pop0.media.lake-states-ledger": "PUBLISH",
        "pop0.media.national-economic-desk": "DEFER",
      });
    expect(media.stories).toHaveLength(1);
    expect(media.receipts.filter((entry) =>
      entry.artifactId === "pop0.communication.quiet.public-statement")).toHaveLength(2);
    expect(createPresidentialOperatingProofSession(statement.save()).save()).toBe(statement.save());
  }, 90_000);

  it("expires the proactive inquiry at the exact end-exclusive deadline", () => {
    const session = createPresidentialOperatingProofSession();
    session.advanceTo("2029-03-10T17:00:00-05:00");
    expect(() => session.presentPresidentialInquiryPreview({
      id: "pop0.inquiry-presentation.too-late",
      opportunityId: "pop0.presidential-inquiry.rural-maternity-service-access",
      requestedProductKind: "MATERNITY_MONITORING_GAP_MEMO",
      requestedResponseDeadline: "2029-03-10T18:00:00-05:00",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    })).toThrow(/effective unconsumed bounded opportunity/);
    expect(session.getOperatingState().ownerStates.presidentialInquiries.state.lifecycleOccurrences)
      .toContainEqual(expect.objectContaining({ kind: "EXPIRED" }));
  });

  it("lets OMB rebook its one named team only through an authenticated coordination route", () => {
    const session = createPresidentialOperatingProofSession();
    session.advanceTo("2029-02-18T10:00:00-05:00");
    const housing = "pop0.assignment.omb.housing-full-implementation-review";
    const employment = "pop0.assignment.omb.employment-congress-full-analysis";
    session.recordOMBQueueCoordination({
      requestId: "pop0.omb-coordination.employment-first",
      occurrenceId: "pop0.omb-reprioritization.employment-first",
      sourceKind: "STANDING_CHIEF_OF_STAFF_AUTHORITY",
      sourceAuthorityId: "pop0.authority.chief-of-staff.omb-review-queue-coordination",
      requestedActions: ["REPRIORITIZE_OMB_REVIEW_QUEUE"],
      referencedAssignmentIds: [housing, employment],
      requestedQueueOrder: [employment, housing],
      requestedNarrowProductKind: null,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    let office = session.getOperatingState().ownerStates.officeOperations.state.find((entry) =>
      entry.officeId === POP0_V0_OPERATING_CONFIGURATION.concurrentWorld.ombReviewCapacity.officeId,
    )!;
    expect(office.activeQueueAssignmentIds).toEqual([employment, housing]);
    expect(office.ombReviewCapacity?.queueReprioritizations).toHaveLength(1);
    expect(office.ombReviewCapacity?.bookings.find((entry) => entry.assignmentId === employment)?.periodIds)
      .toEqual([
        "pop0.omb-work-period.P1", "pop0.omb-work-period.P2",
        "pop0.omb-work-period.P3", "pop0.omb-work-period.P4",
      ]);

    session.advanceTo("2029-03-17T09:00:00-04:00");
    office = session.getOperatingState().ownerStates.officeOperations.state.find((entry) =>
      entry.officeId === POP0_V0_OPERATING_CONFIGURATION.concurrentWorld.ombReviewCapacity.officeId,
    )!;
    expect(Object.fromEntries(office.assignments.map((entry) => [entry.id, entry.status])))
      .toMatchObject({ [employment]: "COMPLETED", [housing]: "DELAYED" });

    const tampered = mutableSave(session.save());
    tampered.operatingState.ownerStates.officeOperations.state
      .find((entry) => entry.officeId === office.officeId)!
      .ombReviewCapacity!.coordinationRequests[0].requestedQueueOrder.reverse();
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(tampered)))
      .toThrow(/authenticated typed route|payload-hash|coordination request/i);
  });

  it("narrows OMB work through append-only assignment supersession instead of mutating scope", () => {
    const session = createPresidentialOperatingProofSession();
    session.advanceTo("2029-02-18T10:00:00-05:00");
    const housing = "pop0.assignment.omb.housing-full-implementation-review";
    const employment = "pop0.assignment.omb.employment-congress-full-analysis";
    const narrow = "pop0.assignment.omb.housing-access-gap-memo";
    session.recordOMBQueueCoordination({
      requestId: "pop0.omb-coordination.narrow-housing",
      occurrenceId: "pop0.omb-reprioritization.preserve-order-for-narrowing",
      sourceKind: "STANDING_CHIEF_OF_STAFF_AUTHORITY",
      sourceAuthorityId: "pop0.authority.chief-of-staff.omb-review-queue-coordination",
      requestedActions: ["SUPERSEDE_WITH_PERMITTED_NARROW_PRODUCT"],
      referencedAssignmentIds: [housing],
      requestedQueueOrder: [housing, employment],
      requestedNarrowProductKind: "NARROW_HOUSING_IMPLEMENTATION_ACCESS_GAP_MEMO",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    session.supersedeOMBAssignmentWithNarrowProduct({
      occurrenceId: "pop0.omb-supersession.narrow-housing",
      sourceCoordinationRequestId: "pop0.omb-coordination.narrow-housing",
      priorAssignmentId: housing,
      replacementAssignmentId: narrow,
      replacementProductKind: "NARROW_HOUSING_IMPLEMENTATION_ACCESS_GAP_MEMO",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    let office = session.getOperatingState().ownerStates.officeOperations.state.find((entry) =>
      entry.officeId === POP0_V0_OPERATING_CONFIGURATION.concurrentWorld.ombReviewCapacity.officeId,
    )!;
    expect(office.assignments.find((entry) => entry.id === housing)).toMatchObject({
      status: "SUPERSEDED", supersededByAssignmentId: narrow,
      expectedProductKind: "FULL_HOUSING_IMPLEMENTATION_REVIEW",
    });
    expect(office.assignments.find((entry) => entry.id === narrow)).toMatchObject({
      status: "QUEUED", expectedProductKind: "NARROW_HOUSING_IMPLEMENTATION_ACCESS_GAP_MEMO",
    });
    expect(office.ombReviewCapacity?.assignmentSupersessions).toHaveLength(1);
    expect(createPresidentialOperatingProofSession(session.save()).save()).toBe(session.save());

    session.advanceTo("2029-03-17T09:00:00-04:00");
    office = session.getOperatingState().ownerStates.officeOperations.state.find((entry) =>
      entry.officeId === POP0_V0_OPERATING_CONFIGURATION.concurrentWorld.ombReviewCapacity.officeId,
    )!;
    expect(Object.fromEntries(office.assignments.map((entry) => [entry.id, entry.status])))
      .toMatchObject({ [housing]: "SUPERSEDED", [narrow]: "COMPLETED", [employment]: "DELAYED" });
  });

  it("converges under coarse, fine, and save-load-continue advancement", () => {
    const target = "2029-03-17T09:00:00-04:00";
    const coarse = createPresidentialOperatingProofSession();
    coarse.advanceTo(target);

    const fine = createPresidentialOperatingProofSession();
    for (const boundary of [
      "2029-02-16T09:00:00-05:00",
      "2029-02-20T09:00:00-05:00",
      "2029-02-23T17:00:00-05:00",
      "2029-03-03T17:00:00-05:00",
    ]) fine.advanceTo(boundary);
    fine.advanceTo(target);
    expect(fine.save()).toBe(coarse.save());

    const checkpoint = createPresidentialOperatingProofSession();
    checkpoint.advanceTo("2029-02-20T08:30:00-05:00");
    const restored = createPresidentialOperatingProofSession(checkpoint.save());
    restored.advanceTo(target);
    expect(restored.save()).toBe(coarse.save());
  });

  it("rejects format downgrade, stock tampering, and reference-only I5 history fabrication", () => {
    const session = createPresidentialOperatingProofSession();
    session.advanceTo("2029-03-17T09:00:00-04:00");
    const format = mutableSave(session.save());
    format.formatVersion = 4;
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(format)))
      .toThrow(/Unsupported presidential operating save format: 4/);

    const stock = mutableSave(session.save());
    stock.operatingState.ownerStates.regionalEmployment.state.cells[0].currentEmployed += 1;
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(stock)))
      .toThrow(/duplicate\/omitted flow truth|stock\/flow reconciliation/i);

    const history = mutableSave(session.save());
    history.operatingState.ownerStates.historicalRecordIndex.state.entries.push({
      historyId: "pop0.history.presidential-operating",
      occurrenceId: "pop0.fake.lower-congress-result",
      ownerId: "pop0.owner.congressional-initiative",
      recordKind: "CONGRESSIONAL_TRANSITION_ATTEMPT",
      occurredAt: "2029-02-19T09:00:00-05:00",
      ownerRecordId: "pop0.fake.lower-congress-result",
      causalParentOccurrenceIds: [],
    });
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(history)))
      .toThrow(/historical.*index|reference-only|canonical time/i);
  });
});

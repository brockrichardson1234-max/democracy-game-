import { describe, expect, it } from "vitest";

import { createPresidentialOperatingProofSession } from "../src/app/presidential-operating-proof-session";
import {
  POP0_I2_ACTOR_IDS,
  POP0_I2_ASSESSMENT_RULE_IDS,
  POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS,
  POP0_I2_OFFICE_IDS,
  POP0_I2_SOURCE_ARTIFACT_ID,
  POP0_I2_SOURCE_SECTION_IDS,
  POP0_V0_OPERATING_CONFIGURATION,
  POP0_V0_PROVENANCE_ROOT,
} from "../src/content/pop0-v0/configuration";
import type { PresidentialAdministrationConfiguration } from "../src/sim/presidential-office-information";
import {
  computePresidentialOperatingConfigurationHash,
  type PresidentialOperatingRuntimeConfiguration,
} from "../src/sim/presidential-operating-runtime";
import {
  POP0_I2_ASSESSMENT_SECTION_IDS,
  POP0_I2_SYNTHESIS_SECTION_IDS,
  POP0_I2_TRACE_IDS,
  POP0_I2_TRACE_TIMES,
  admitProofReceiptsAndResolveQueues,
  attemptProofRetrievals,
  authorLaborAssessment,
  authorNecAndOmbAssessments,
  createPop0I2TraceSession,
  createProofAssignments,
  deliverProofNotices,
  establishPossessionAndIndex,
  presentBoundedSynthesis,
  runPop0I2ThroughDisagreement,
  runPop0I2ThroughSynthesis,
} from "./pop0-i2-proof-fixture";

const withAdministration = (
  administration: PresidentialAdministrationConfiguration,
): PresidentialOperatingRuntimeConfiguration => {
  const base = POP0_V0_OPERATING_CONFIGURATION;
  const identityWithoutHash = {
    configurationId: base.identity.configurationId,
    configurationVersion: base.identity.configurationVersion,
    scenarioId: base.identity.scenarioId,
    scenarioVersion: base.identity.scenarioVersion,
  };
  const withoutHash = {
    schemaVersion: base.schemaVersion,
    identity: identityWithoutHash,
    classification: base.classification,
    operatingStateId: base.operatingStateId,
    calendar: base.calendar,
    administration,
    intervention: base.intervention,
    housing: base.housing,
    concurrentWorld: base.concurrentWorld,
  };
  return {
    ...withoutHash,
    identity: {
      ...identityWithoutHash,
      configurationHash: computePresidentialOperatingConfigurationHash(withoutHash),
    },
  };
};

describe("POP0-I2 hostile and counterfactual gates", () => {
  it("rejects missing, nonzero-weight, and join-expanding Population linkages", () => {
    const base = POP0_V0_OPERATING_CONFIGURATION.administration;
    expect(() => createPresidentialOperatingProofSession(undefined, withAdministration({
      ...base,
      populationLinkages: base.populationLinkages.slice(1),
    }))).toThrow(/exactly three institutions, nine offices\/holders, and ten linked humans/i);

    const weighted = base.populationLinkages.map((linkage, index) => index === 0
      ? { ...linkage, populationWeight: 1 }
      : linkage) as unknown as PresidentialAdministrationConfiguration["populationLinkages"];
    expect(() => createPresidentialOperatingProofSession(undefined, withAdministration({
      ...base,
      populationLinkages: weighted,
    }))).toThrow(/unsupported POP0-I2 Population linkage/i);

    const expanded = base.populationLinkages.map((linkage, index) => index === 0
      ? { ...linkage, residence: "invented" }
      : linkage) as unknown as PresidentialAdministrationConfiguration["populationLinkages"];
    expect(() => createPresidentialOperatingProofSession(undefined, withAdministration({
      ...base,
      populationLinkages: expanded,
    }))).toThrow(/unsupported shape/i);
  });

  it("does not let Department possession authorize a Secretary assessment", () => {
    const session = createPop0I2TraceSession();
    session.recordInstitutionPossession({
      id: POP0_I2_TRACE_IDS.possession,
      artifactId: POP0_I2_SOURCE_ARTIFACT_ID,
      possessingInstitutionId: "pop0.institution.department-of-labor",
      acquisitionProvenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    expect(() => session.authorAssessment({
      id: POP0_I2_TRACE_IDS.laborAssessment,
      version: "1",
      sectionIds: POP0_I2_ASSESSMENT_SECTION_IDS,
      producingOfficeId: POP0_I2_OFFICE_IDS.secretaryOfLabor,
      authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.secretaryOfLabor,
      assignmentId: null,
      sourceReceiptIds: [],
      sourceRetrievalIds: [],
      sourceMetadataNoticeIds: [],
      judgmentRuleIds: [POP0_I2_ASSESSMENT_RULE_IDS.currentEvidenceDoesNotSupportSpillover],
      claimedConfidence: "HIGH",
      evidentiarySupport: "INSTITUTION_POSSESSION_ONLY",
      assumptionIds: [],
      limitations: [],
      recommendation: null,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
      revisionOfArtifactId: null,
      supersedesArtifactId: null,
    })).toThrow(/requires a substantive receipt|lacks office-owned receipt/i);
  });

  it("prevents the NEC assessment when its configured access expires before retrieval", () => {
    const base = POP0_V0_OPERATING_CONFIGURATION.administration;
    const configuration = withAdministration({
      ...base,
      accessEntitlements: base.accessEntitlements.map((entitlement) =>
        entitlement.officeId === POP0_I2_OFFICE_IDS.nec
          ? { ...entitlement, effectiveUntil: "2029-02-05T08:19:00-05:00" }
          : entitlement),
    });
    const session = createPop0I2TraceSession(configuration);
    establishPossessionAndIndex(session);
    deliverProofNotices(session);
    createProofAssignments(session);
    attemptProofRetrievals(session);
    expect(session.getOfficeInformation(POP0_I2_OFFICE_IDS.nec).retrievals[0].result)
      .toBe("ACCESS_DENIED");
    expect(() => session.admitSubstantiveReceipt({
      id: POP0_I2_TRACE_IDS.necReceipt,
      recipientOfficeId: POP0_I2_OFFICE_IDS.nec,
      artifactId: POP0_I2_SOURCE_ARTIFACT_ID,
      receivedSectionIds: [POP0_I2_SOURCE_SECTION_IDS.summary],
      retrievalId: POP0_I2_TRACE_IDS.necRetrieval,
      receivingAuthorityReference: POP0_V0_PROVENANCE_ROOT,
      deduplicationIdentity: "counterfactual.nec.receipt",
    })).toThrow(/matching successful retrieval/i);
  });

  it("does not preserve the configured NEC conclusion after removing its assumption", () => {
    const session = createPop0I2TraceSession();
    establishPossessionAndIndex(session);
    deliverProofNotices(session);
    createProofAssignments(session);
    attemptProofRetrievals(session);
    admitProofReceiptsAndResolveQueues(session);
    session.advanceTo(POP0_I2_TRACE_TIMES.officeAssessments);
    expect(() => session.authorAssessment({
      id: POP0_I2_TRACE_IDS.necAssessment,
      version: "1",
      sectionIds: POP0_I2_ASSESSMENT_SECTION_IDS,
      producingOfficeId: POP0_I2_OFFICE_IDS.nec,
      authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.necDirector,
      assignmentId: POP0_I2_TRACE_IDS.necAssignment,
      sourceReceiptIds: [POP0_I2_TRACE_IDS.necReceipt],
      sourceRetrievalIds: [POP0_I2_TRACE_IDS.necRetrieval],
      sourceMetadataNoticeIds: [POP0_I2_TRACE_IDS.necNotice],
      judgmentRuleIds: [POP0_I2_ASSESSMENT_RULE_IDS.supplierAssumptionSupportsPlausibility],
      claimedConfidence: "BOUNDED",
      evidentiarySupport: "RECEIVED_EVIDENCE_ONLY",
      assumptionIds: [],
      limitations: [],
      recommendation: null,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
      revisionOfArtifactId: null,
      supersedesArtifactId: null,
    })).toThrow(/does not satisfy judgment rule/i);
  });

  it("prevents synthesis from citing a withheld office assessment", () => {
    const session = createPop0I2TraceSession();
    runPop0I2ThroughDisagreement(session);
    session.advanceTo(POP0_I2_TRACE_TIMES.transfer);
    session.transferOfficeArtifact({
      id: POP0_I2_TRACE_IDS.laborAssessmentReceiptAtChiefOfStaff,
      sourceOfficeId: POP0_I2_OFFICE_IDS.secretaryOfLabor,
      sourceOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.secretaryOfLabor,
      recipientOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      artifactId: POP0_I2_TRACE_IDS.laborAssessment,
      receivedSectionIds: POP0_I2_ASSESSMENT_SECTION_IDS,
      receivingAuthorityReference: POP0_V0_PROVENANCE_ROOT,
      deduplicationIdentity: "counterfactual.cos.labor-only",
    });
    session.advanceTo(POP0_I2_TRACE_TIMES.synthesis);
    expect(() => session.authorSynthesis({
      id: POP0_I2_TRACE_IDS.synthesis,
      version: "1",
      sectionIds: POP0_I2_SYNTHESIS_SECTION_IDS,
      producingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.chiefOfStaff,
      sourceAssessmentReceiptIds: [POP0_I2_TRACE_IDS.laborAssessmentReceiptAtChiefOfStaff],
      synthesisJudgment: "Cannot synthesize an unseen NEC view",
      limitations: [],
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
      revisionOfArtifactId: null,
      supersedesArtifactId: null,
    })).toThrow(/at least two assessment receipts/i);
  });

  it("allows OMB metadata non-estimability but rejects substantive analysis", () => {
    const session = createPop0I2TraceSession();
    establishPossessionAndIndex(session);
    deliverProofNotices(session);
    createProofAssignments(session);
    attemptProofRetrievals(session);
    session.advanceTo(POP0_I2_TRACE_TIMES.officeAssessments);
    expect(() => session.authorAssessment({
      id: "pop0.artifact.assessment.omb-invalid-substantive",
      version: "1",
      sectionIds: POP0_I2_ASSESSMENT_SECTION_IDS,
      producingOfficeId: POP0_I2_OFFICE_IDS.omb,
      authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.ombDirector,
      assignmentId: POP0_I2_TRACE_IDS.ombAssignment,
      sourceReceiptIds: [],
      sourceRetrievalIds: [POP0_I2_TRACE_IDS.ombRetrieval],
      sourceMetadataNoticeIds: [POP0_I2_TRACE_IDS.ombNotice],
      judgmentRuleIds: [POP0_I2_ASSESSMENT_RULE_IDS.currentEvidenceDoesNotSupportSpillover],
      claimedConfidence: "UNSUPPORTED",
      evidentiarySupport: "METADATA_ONLY",
      assumptionIds: [],
      limitations: [],
      recommendation: null,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
      revisionOfArtifactId: null,
      supersedesArtifactId: null,
    })).toThrow(/requires a substantive receipt/i);
  });

  it("keeps independent same-time notice and queue operations deterministic", () => {
    const left = createPop0I2TraceSession();
    const right = createPop0I2TraceSession();
    establishPossessionAndIndex(left);
    establishPossessionAndIndex(right);
    deliverProofNotices(left, ["LABOR", "NEC", "OMB"]);
    deliverProofNotices(right, ["OMB", "LABOR", "NEC"]);
    createProofAssignments(left, ["NEC", "OMB"]);
    createProofAssignments(right, ["OMB", "NEC"]);
    expect(right.getOperatingState()).toEqual(left.getOperatingState());
    expect(right.getOperatingState().ownerStates.informationRoutes.state.artifacts)
      .toContainEqual(expect.objectContaining({ id: POP0_I2_SOURCE_ARTIFACT_ID }));
  });

  it("does not merge office access or queues when one actor holds two roles", () => {
    const base = POP0_V0_OPERATING_CONFIGURATION.administration;
    const configuration = withAdministration({
      ...base,
      officeholderAssignments: base.officeholderAssignments.map((assignment) =>
        assignment.officeId === POP0_I2_OFFICE_IDS.omb
          ? { ...assignment, actorId: POP0_I2_ACTOR_IDS.necDirector }
          : assignment),
    });
    const session = createPop0I2TraceSession(configuration);
    establishPossessionAndIndex(session);
    deliverProofNotices(session);
    createProofAssignments(session);
    const directory = session.getOperatingState().ownerStates.administrationDirectory.state;
    expect(directory.officeholderAssignments.filter((entry) => entry.actorId === POP0_I2_ACTOR_IDS.necDirector))
      .toHaveLength(2);
    expect(session.getOfficeInformation(POP0_I2_OFFICE_IDS.nec).accessEntitlements).toHaveLength(1);
    expect(session.getOfficeInformation(POP0_I2_OFFICE_IDS.omb).accessEntitlements).toHaveLength(0);
    const offices = session.getOperatingState().ownerStates.officeOperations.state;
    expect(offices.find((entry) => entry.officeId === POP0_I2_OFFICE_IDS.nec)?.activeQueueAssignmentIds)
      .toEqual([POP0_I2_TRACE_IDS.necAssignment]);
    expect(offices.find((entry) => entry.officeId === POP0_I2_OFFICE_IDS.omb)?.activeQueueAssignmentIds)
      .toEqual([
        "pop0.assignment.omb.housing-full-implementation-review",
        "pop0.assignment.omb.employment-congress-full-analysis",
        POP0_I2_TRACE_IDS.ombAssignment,
      ]);
  });

  it("rejects assessment and presentation outside effective role intervals", () => {
    const base = POP0_V0_OPERATING_CONFIGURATION.administration;
    const expiredNec = withAdministration({
      ...base,
      officeholderAssignments: base.officeholderAssignments.map((assignment) =>
        assignment.officeId === POP0_I2_OFFICE_IDS.nec
          ? { ...assignment, effectiveUntil: "2029-02-05T08:50:00-05:00" }
          : assignment),
    });
    const assessmentSession = createPop0I2TraceSession(expiredNec);
    establishPossessionAndIndex(assessmentSession);
    deliverProofNotices(assessmentSession);
    createProofAssignments(assessmentSession);
    attemptProofRetrievals(assessmentSession);
    admitProofReceiptsAndResolveQueues(assessmentSession);
    authorLaborAssessment(assessmentSession);
    expect(() => authorNecAndOmbAssessments(assessmentSession)).toThrow(/not effective for office/i);

    const expiredPresident = withAdministration({
      ...base,
      presidentialRecipientBinding: {
        ...base.presidentialRecipientBinding,
        effectiveUntil: "2029-02-05T09:20:00-05:00",
      },
    });
    const presentationSession = createPop0I2TraceSession(expiredPresident);
    runPop0I2ThroughSynthesis(presentationSession);
    expect(() => presentBoundedSynthesis(presentationSession)).toThrow(/not effective at presentation time/i);
  });

  it("rejects duplicate presentation identities instead of treating redisplay as history", () => {
    const session = createPop0I2TraceSession();
    runPop0I2ThroughSynthesis(session);
    presentBoundedSynthesis(session);
    expect(() => session.recordPresidentialPresentation({
      id: "pop0.presentation.duplicate-id-different",
      deduplicationIdentity: "pop0.dedupe.presentation.chief-of-staff-to-president.v1",
      presentingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      presenterOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.chiefOfStaff,
      shownPortions: [
        { artifactId: POP0_I2_TRACE_IDS.synthesis, sectionId: POP0_I2_SYNTHESIS_SECTION_IDS[0] },
      ],
      referencedButNotShownPortions: [],
      purpose: "Duplicate redisplay",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
      revisionOfPresentationId: null,
      supersedesPresentationId: null,
    })).toThrow(/duplicate/i);
  });
});

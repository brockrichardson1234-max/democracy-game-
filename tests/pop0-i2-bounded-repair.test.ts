import { describe, expect, it } from "vitest";

import {
  createPresidentialOperatingProofSession,
  type PresidentialOperatingProofSession,
} from "../src/app/presidential-operating-proof-session";
import {
  POP0_I2_INSTITUTION_IDS,
  POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS,
  POP0_I2_OFFICE_IDS,
  POP0_I2_SOURCE_ARTIFACT_ID,
  POP0_I2_SOURCE_SECTION_IDS,
  POP0_V0_PROVENANCE_ROOT,
} from "../src/content/pop0-v0/configuration";
import {
  POP0_I2_ASSESSMENT_SECTION_IDS,
  POP0_I2_SYNTHESIS_SECTION_IDS,
  POP0_I2_TRACE_IDS,
  POP0_I2_TRACE_TIMES,
  authorChiefOfStaffSynthesis,
  createPop0I2TraceSession,
  deliverProofNotices,
  establishPossessionAndIndex,
  runFullPop0I2Trace,
  runPop0I2ThroughDisagreement,
  runPop0I2ThroughRetrieval,
  runPop0I2ThroughSynthesis,
} from "./pop0-i2-proof-fixture";

interface MutableArtifact {
  kind: "SOURCE_EVIDENCE" | "ASSESSMENT" | "SYNTHESIS";
  id: string;
  asOf: string;
  createdAt: string;
  revisionOfArtifactId: string | null;
  supersedesArtifactId: string | null;
}

interface MutableReceipt {
  id: string;
  receivedAt: string;
  receivedSectionIds: string[];
}

interface MutablePresentation {
  id: string;
  deduplicationIdentity: string;
  presentedAt: string;
  revisionOfPresentationId: string | null;
  supersedesPresentationId: string | null;
}

interface MutableSaveEnvelope {
  operatingState: {
    ownerStates: {
      calendar: { state: { current: string } };
      informationRoutes: {
        state: {
          artifacts: MutableArtifact[];
          receipts: MutableReceipt[];
          retrievals: {
            id: string;
            failureReason: string | null;
            outcomeProvenanceReference: string | null;
          }[];
        };
      };
      presidentialPresentations: { state: { presentations: MutablePresentation[] } };
    };
  };
}

const mutableEnvelope = (session: PresidentialOperatingProofSession): MutableSaveEnvelope =>
  JSON.parse(session.save()) as MutableSaveEnvelope;

const artifact = (envelope: MutableSaveEnvelope, id: string): MutableArtifact => {
  const result = envelope.operatingState.ownerStates.informationRoutes.state.artifacts
    .find((entry) => entry.id === id);
  if (result === undefined) throw new Error(`Expected artifact ${id}.`);
  return result;
};

const receipt = (envelope: MutableSaveEnvelope, id: string): MutableReceipt => {
  const result = envelope.operatingState.ownerStates.informationRoutes.state.receipts
    .find((entry) => entry.id === id);
  if (result === undefined) throw new Error(`Expected receipt ${id}.`);
  return result;
};

const expectRestoreFailure = (envelope: MutableSaveEnvelope, pattern: RegExp): void => {
  expect(() => createPresidentialOperatingProofSession(JSON.stringify(envelope))).toThrow(pattern);
};

const transferAssessments = (
  session: PresidentialOperatingProofSession,
  laborSections: readonly string[],
  necSections: readonly string[],
): void => {
  session.advanceTo(POP0_I2_TRACE_TIMES.transfer);
  session.transferOfficeArtifact({
    id: POP0_I2_TRACE_IDS.laborAssessmentReceiptAtChiefOfStaff,
    sourceOfficeId: POP0_I2_OFFICE_IDS.secretaryOfLabor,
    sourceOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.secretaryOfLabor,
    recipientOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
    artifactId: POP0_I2_TRACE_IDS.laborAssessment,
    receivedSectionIds: laborSections,
    receivingAuthorityReference: POP0_V0_PROVENANCE_ROOT,
    deduplicationIdentity: "repair.dedupe.cos.labor-assessment",
  });
  session.transferOfficeArtifact({
    id: POP0_I2_TRACE_IDS.necAssessmentReceiptAtChiefOfStaff,
    sourceOfficeId: POP0_I2_OFFICE_IDS.nec,
    sourceOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.necDirector,
    recipientOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
    artifactId: POP0_I2_TRACE_IDS.necAssessment,
    receivedSectionIds: necSections,
    receivingAuthorityReference: POP0_V0_PROVENANCE_ROOT,
    deduplicationIdentity: "repair.dedupe.cos.nec-assessment",
  });
};

const expectRejectedWithoutMutation = (
  session: PresidentialOperatingProofSession,
  operation: () => void,
): void => {
  const before = session.save();
  expect(operation).toThrow();
  expect(session.save()).toBe(before);
  expect(createPresidentialOperatingProofSession(before).save()).toBe(before);
};

describe("POP0-I2 bounded semantic repair", () => {
  it("keeps partial assessment transfers legal without granting unseen synthesis content", () => {
    const partial = createPop0I2TraceSession();
    runPop0I2ThroughDisagreement(partial);
    transferAssessments(
      partial,
      [POP0_I2_ASSESSMENT_SECTION_IDS[0]],
      POP0_I2_ASSESSMENT_SECTION_IDS,
    );
    partial.advanceTo(POP0_I2_TRACE_TIMES.synthesis);
    const before = partial.save();
    expect(() => authorChiefOfStaffSynthesis(partial)).toThrow(/every semantic section/i);
    expect(partial.save()).toBe(before);
    expect(createPresidentialOperatingProofSession(before).save()).toBe(before);

    const complete = createPop0I2TraceSession();
    runPop0I2ThroughSynthesis(complete);
    const synthesis = complete.getOperatingState().ownerStates.informationRoutes.state.artifacts
      .find((entry) => entry.id === POP0_I2_TRACE_IDS.synthesis);
    expect(synthesis?.kind).toBe("SYNTHESIS");
    if (synthesis?.kind !== "SYNTHESIS") throw new Error("Expected synthesis artifact.");
    expect(synthesis.preservedAssessments).toHaveLength(2);
  });

  it("rejects save tampering that narrows a receipt beneath preserved synthesis semantics", () => {
    const session = createPop0I2TraceSession();
    runFullPop0I2Trace(session);
    const envelope = mutableEnvelope(session);
    receipt(envelope, POP0_I2_TRACE_IDS.laborAssessmentReceiptAtChiefOfStaff).receivedSectionIds = [
      POP0_I2_ASSESSMENT_SECTION_IDS[0],
    ];
    expectRestoreFailure(envelope, /every semantic section/i);
  });

  it("rejects every source-before-derivative chronology inversion", () => {
    const completed = createPop0I2TraceSession();
    runFullPop0I2Trace(completed);

    const assessmentBeforeReceipt = mutableEnvelope(completed);
    const labor = artifact(assessmentBeforeReceipt, POP0_I2_TRACE_IDS.laborAssessment);
    labor.asOf = POP0_I2_TRACE_TIMES.retrieval;
    labor.createdAt = POP0_I2_TRACE_TIMES.retrieval;
    expectRestoreFailure(assessmentBeforeReceipt, /office-owned receipt|source lineage/i);

    const transferBeforeArtifact = mutableEnvelope(completed);
    receipt(transferBeforeArtifact, POP0_I2_TRACE_IDS.laborAssessmentReceiptAtChiefOfStaff).receivedAt =
      "2029-02-05T08:35:00-05:00";
    expectRestoreFailure(transferBeforeArtifact, /predates artifact/i);

    const synthesisBeforeReceipts = mutableEnvelope(completed);
    const synthesis = artifact(synthesisBeforeReceipts, POP0_I2_TRACE_IDS.synthesis);
    synthesis.asOf = POP0_I2_TRACE_TIMES.officeAssessments;
    synthesis.createdAt = POP0_I2_TRACE_TIMES.officeAssessments;
    expectRestoreFailure(synthesisBeforeReceipts, /predates assessment receipt/i);

    const presentationBeforeSynthesis = mutableEnvelope(completed);
    presentationBeforeSynthesis.operatingState.ownerStates.presidentialPresentations.state
      .presentations[0].presentedAt = "2029-02-05T09:10:00-05:00";
    expectRestoreFailure(presentationBeforeSynthesis, /unavailable artifact portion/i);

    const asOfAfterCreation = mutableEnvelope(completed);
    artifact(asOfAfterCreation, POP0_I2_TRACE_IDS.necAssessment).asOf =
      "2029-02-05T09:01:00-05:00";
    expectRestoreFailure(asOfAfterCreation, /as-of instant/i);
  });

  it("rejects cyclic and same-timestamp revision or supersession history", () => {
    const completed = createPop0I2TraceSession();
    runFullPop0I2Trace(completed);

    const artifactCycle = mutableEnvelope(completed);
    artifact(artifactCycle, POP0_I2_TRACE_IDS.laborAssessment).revisionOfArtifactId =
      POP0_I2_TRACE_IDS.necAssessment;
    artifact(artifactCycle, POP0_I2_TRACE_IDS.necAssessment).supersedesArtifactId =
      POP0_I2_TRACE_IDS.laborAssessment;
    expectRestoreFailure(artifactCycle, /cyclic revision\/supersession/i);

    const sameTimestamp = mutableEnvelope(completed);
    const sameTimeLabor = artifact(sameTimestamp, POP0_I2_TRACE_IDS.laborAssessment);
    sameTimeLabor.asOf = POP0_I2_TRACE_TIMES.officeAssessments;
    sameTimeLabor.createdAt = POP0_I2_TRACE_TIMES.officeAssessments;
    artifact(sameTimestamp, POP0_I2_TRACE_IDS.necAssessment).revisionOfArtifactId =
      POP0_I2_TRACE_IDS.laborAssessment;
    expectRestoreFailure(sameTimestamp, /not strictly forward/i);

    const presentationCycle = mutableEnvelope(completed);
    const presentations = presentationCycle.operatingState.ownerStates.presidentialPresentations.state.presentations;
    const first = presentations[0];
    const second: MutablePresentation = {
      ...first,
      id: "pop0.presentation.chief-of-staff-to-president.v2",
      deduplicationIdentity: "repair.dedupe.presentation.v2",
      presentedAt: "2029-02-05T09:31:00-05:00",
      revisionOfPresentationId: null,
      supersedesPresentationId: first.id,
    };
    first.revisionOfPresentationId = second.id;
    presentations.push(second);
    presentationCycle.operatingState.ownerStates.calendar.state.current = second.presentedAt;
    expectRestoreFailure(presentationCycle, /cyclic revision\/supersession/i);
  });

  it("supports provenance-bearing NOT_FOUND and FAILED results followed by a successful retry", () => {
    const session = createPop0I2TraceSession();
    establishPossessionAndIndex(session);
    deliverProofNotices(session);
    session.advanceTo(POP0_I2_TRACE_TIMES.retrieval);
    session.attemptRetrieval({
      id: "repair.retrieval.labor.not-found",
      requestingOfficeId: POP0_I2_OFFICE_IDS.secretaryOfLabor,
      artifactId: POP0_I2_SOURCE_ARTIFACT_ID,
      requestedSectionIds: [POP0_I2_SOURCE_SECTION_IDS.summary],
      metadataNoticeId: POP0_I2_TRACE_IDS.laborNotice,
      technicalOutcome: "NOT_FOUND",
      failureReason: "INDEX_TARGET_NOT_FOUND_AT_RETRIEVAL_TIME",
      outcomeProvenanceReference: "repair.provenance.retrieval.not-found",
    });
    session.advanceTo("2029-02-05T08:21:00-05:00");
    session.attemptRetrieval({
      id: "repair.retrieval.labor.failed",
      requestingOfficeId: POP0_I2_OFFICE_IDS.secretaryOfLabor,
      artifactId: POP0_I2_SOURCE_ARTIFACT_ID,
      requestedSectionIds: [POP0_I2_SOURCE_SECTION_IDS.summary],
      metadataNoticeId: POP0_I2_TRACE_IDS.laborNotice,
      technicalOutcome: "FAILED",
      failureReason: "BOUNDED_STORAGE_READ_FAILURE",
      outcomeProvenanceReference: "repair.provenance.retrieval.failed",
    });
    session.advanceTo("2029-02-05T08:22:00-05:00");
    session.attemptRetrieval({
      id: "repair.retrieval.labor.retry-success",
      requestingOfficeId: POP0_I2_OFFICE_IDS.secretaryOfLabor,
      artifactId: POP0_I2_SOURCE_ARTIFACT_ID,
      requestedSectionIds: [POP0_I2_SOURCE_SECTION_IDS.summary],
      metadataNoticeId: POP0_I2_TRACE_IDS.laborNotice,
    });
    expect(session.getOfficeInformation(POP0_I2_OFFICE_IDS.secretaryOfLabor).retrievals
      .map((entry) => entry.result)).toEqual([
      "NOT_FOUND",
      "FAILED",
      "AVAILABLE_AT_OFFICE_BOUNDARY",
    ]);
    const saved = session.save();
    expect(createPresidentialOperatingProofSession(saved).save()).toBe(saved);

    const missingProvenance = mutableEnvelope(session);
    const failed = missingProvenance.operatingState.ownerStates.informationRoutes.state.retrievals
      .find((entry) => entry.id === "repair.retrieval.labor.failed");
    if (failed === undefined) throw new Error("Expected failed retrieval.");
    failed.outcomeProvenanceReference = null;
    expectRestoreFailure(missingProvenance, /lacks failure reason or provenance/i);
  });

  it("keeps malformed live operations outside all serialized state", () => {
    const possession = createPop0I2TraceSession();
    expectRejectedWithoutMutation(possession, () => possession.recordInstitutionPossession({
      id: "",
      artifactId: POP0_I2_SOURCE_ARTIFACT_ID,
      possessingInstitutionId: POP0_I2_INSTITUTION_IDS.labor,
      acquisitionProvenanceReference: POP0_V0_PROVENANCE_ROOT,
    }));

    const index = createPop0I2TraceSession();
    index.recordInstitutionPossession({
      id: POP0_I2_TRACE_IDS.possession,
      artifactId: POP0_I2_SOURCE_ARTIFACT_ID,
      possessingInstitutionId: POP0_I2_INSTITUTION_IDS.labor,
      acquisitionProvenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    index.advanceTo(POP0_I2_TRACE_TIMES.index);
    expectRejectedWithoutMutation(index, () => index.createInformationIndex({
      id: "repair.index.empty-provenance",
      artifactId: POP0_I2_SOURCE_ARTIFACT_ID,
      sourcePossessionId: POP0_I2_TRACE_IDS.possession,
      provenanceReference: "",
    }));

    const substantiveReceipt = createPop0I2TraceSession();
    runPop0I2ThroughRetrieval(substantiveReceipt);
    substantiveReceipt.advanceTo(POP0_I2_TRACE_TIMES.receipt);
    expectRejectedWithoutMutation(substantiveReceipt, () => substantiveReceipt.admitSubstantiveReceipt({
      id: "repair.receipt.empty-dedupe",
      recipientOfficeId: POP0_I2_OFFICE_IDS.secretaryOfLabor,
      artifactId: POP0_I2_SOURCE_ARTIFACT_ID,
      receivedSectionIds: [POP0_I2_SOURCE_SECTION_IDS.summary],
      retrievalId: POP0_I2_TRACE_IDS.laborRetrieval,
      receivingAuthorityReference: POP0_V0_PROVENANCE_ROOT,
      deduplicationIdentity: "",
    }));

    const transfer = createPop0I2TraceSession();
    runPop0I2ThroughDisagreement(transfer);
    transfer.advanceTo(POP0_I2_TRACE_TIMES.transfer);
    expectRejectedWithoutMutation(transfer, () => transfer.transferOfficeArtifact({
      id: "repair.receipt.empty-authority",
      sourceOfficeId: POP0_I2_OFFICE_IDS.secretaryOfLabor,
      sourceOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.secretaryOfLabor,
      recipientOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      artifactId: POP0_I2_TRACE_IDS.laborAssessment,
      receivedSectionIds: POP0_I2_ASSESSMENT_SECTION_IDS,
      receivingAuthorityReference: "",
      deduplicationIdentity: "repair.dedupe.empty-authority",
    }));

    const presentation = createPop0I2TraceSession();
    runPop0I2ThroughSynthesis(presentation);
    presentation.advanceTo(POP0_I2_TRACE_TIMES.presentation);
    expectRejectedWithoutMutation(presentation, () => presentation.recordPresidentialPresentation({
      id: "repair.presentation.empty-dedupe",
      deduplicationIdentity: "",
      presentingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      presenterOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.chiefOfStaff,
      shownPortions: [
        { artifactId: POP0_I2_TRACE_IDS.synthesis, sectionId: POP0_I2_SYNTHESIS_SECTION_IDS[0] },
      ],
      referencedButNotShownPortions: [],
      purpose: "Malformed presentation must not enter state",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
      revisionOfPresentationId: null,
      supersedesPresentationId: null,
    }));
  });
});

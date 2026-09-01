import { describe, expect, it } from "vitest";

import { createPresidentialOperatingProofSession } from
  "../src/app/presidential-operating-proof-session";
import {
  POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS,
  POP0_I2_OFFICE_IDS,
  POP0_V0_PROVENANCE_ROOT,
} from "../src/content/pop0-v0/configuration";
import type { I5DomainEvidenceArtifact } from "../src/sim/presidential-office-information";
import { computeI5DomainEvidenceArtifactHash } from
  "../src/sim/presidential-operating-concurrent-world";

type DeepMutable<T> = T extends (...arguments_: never[]) => unknown
  ? T
  : T extends readonly (infer Item)[]
    ? DeepMutable<Item>[]
    : T extends object
      ? { -readonly [Key in keyof T]: DeepMutable<T[Key]> }
      : T;

type MutableI5Artifact = DeepMutable<I5DomainEvidenceArtifact>;

interface MutableI5SaveEnvelope {
  operatingState: {
    ownerStates: {
      informationRoutes: {
        state: {
          artifacts: Array<MutableI5Artifact | { kind: string; id: string }>;
        };
      };
    };
  };
}

const mutableSave = (serialized: string): MutableI5SaveEnvelope =>
  JSON.parse(serialized) as MutableI5SaveEnvelope;

const domainArtifact = (
  envelope: MutableI5SaveEnvelope,
  id: string,
): MutableI5Artifact => {
  const artifact = envelope.operatingState.ownerStates.informationRoutes.state.artifacts.find(
    (entry): entry is MutableI5Artifact => entry.kind === "I5_DOMAIN_EVIDENCE" && entry.id === id,
  );
  if (artifact === undefined) throw new Error(`Missing hostile-test artifact ${id}.`);
  return artifact;
};

const withoutArtifactHash = (
  artifact: MutableI5Artifact,
): Omit<I5DomainEvidenceArtifact, "canonicalArtifactHash"> => {
  const copy = { ...artifact } as Partial<MutableI5Artifact>;
  delete copy.canonicalArtifactHash;
  return copy as unknown as Omit<I5DomainEvidenceArtifact, "canonicalArtifactHash">;
};

const rehash = (artifact: MutableI5Artifact): void => {
  artifact.canonicalArtifactHash = computeI5DomainEvidenceArtifactHash(withoutArtifactHash(artifact));
};

let cachedConcurrentSave: string | undefined;
const concurrentSave = (): string => {
  if (cachedConcurrentSave === undefined) {
    const session = createPresidentialOperatingProofSession();
    session.advanceTo("2029-03-17T09:00:00-04:00");
    cachedConcurrentSave = session.save();
  }
  return cachedConcurrentSave;
};

let cachedHhsSave: string | undefined;
const hhsSave = (): string => {
  if (cachedHhsSave !== undefined) return cachedHhsSave;
  const session = createPresidentialOperatingProofSession();
  session.advanceTo("2029-02-18T09:00:00-05:00");
  session.presentPresidentialInquiryPreview({
    id: "pop0.inquiry-presentation.hhs-evidence-integrity",
    opportunityId: "pop0.presidential-inquiry.rural-maternity-service-access",
    requestedProductKind: "RURAL_MATERNITY_ACCESS_SCOPING",
    requestedResponseDeadline: "2029-03-07T17:00:00-05:00",
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  });
  session.recordPresidentialInitiatedRequest({
    id: "pop0.decision.hhs-evidence-integrity",
    deduplicationIdentity: "pop0.decision.hhs-evidence-integrity.dedupe",
    inquiryPreviewPresentationId: "pop0.inquiry-presentation.hhs-evidence-integrity",
    instrumentId: "pop0.instrument.hhs-evidence-integrity",
    instrumentDeduplicationIdentity: "pop0.instrument.hhs-evidence-integrity.dedupe",
    acknowledgedUncertainties: ["The general inquiry initially contains no facility-level truth."],
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  });
  session.attemptInstrumentDispatch({
    id: "pop0.dispatch.hhs-evidence-integrity",
    deduplicationIdentity: "pop0.dispatch.hhs-evidence-integrity.dedupe",
    instrumentId: "pop0.instrument.hhs-evidence-integrity",
    dispatchingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
    dispatchPath: "PRESIDENTIAL_OPERATIONS_TO_HHS",
    outcome: "DELIVERED_TO_OFFICE_BOUNDARY",
    failureReason: null,
    outcomeProvenanceReference: POP0_V0_PROVENANCE_ROOT,
    retryOfDispatchId: null,
  });
  session.admitOfficeInstrumentReceipt({
    id: "pop0.instrument-receipt.hhs-evidence-integrity",
    deduplicationIdentity: "pop0.instrument-receipt.hhs-evidence-integrity.dedupe",
    instrumentId: "pop0.instrument.hhs-evidence-integrity",
    successfulDispatchId: "pop0.dispatch.hhs-evidence-integrity",
    recipientOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHhs,
    receiptPath: "HHS_OFFICE_BOUNDARY_ADMISSION",
    receivingAuthorityReference: "pop0.capability.hhs.rural-maternity-analysis",
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  });
  session.recordRecipientDisposition({
    id: "pop0.disposition.hhs-evidence-integrity",
    deduplicationIdentity: "pop0.disposition.hhs-evidence-integrity.dedupe",
    recipientOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHhs,
    instrumentReceiptId: "pop0.instrument-receipt.hhs-evidence-integrity",
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
    id: "pop0.assignment.hhs-evidence-integrity",
    dispositionId: "pop0.disposition.hhs-evidence-integrity",
    requesterId: POP0_I2_OFFICE_IDS.secretaryOfHhs,
    leadOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHhs,
    objective: "Answer only the bounded nationwide service-access inquiry.",
    sourceReferenceIds: ["pop0.disposition.hhs-evidence-integrity"],
    requiredConsultationOfficeIds: [],
    authorityReference: "pop0.disposition.hhs-evidence-integrity",
    deadline: "2029-03-07T17:00:00-05:00",
    expectedProductKind: "RURAL_MATERNITY_ACCESS_SCOPING",
    authorizationScope: {
      kind: "ANALYSIS_ASSIGNMENT_SCOPE",
      evidenceArtifactId: "pop0.presidential-inquiry.rural-maternity-service-access",
      evidenceSectionIds: ["general-question"],
      productKind: "RURAL_MATERNITY_ACCESS_SCOPING",
    },
  });
  session.advanceTo("2029-02-20T09:00:00-05:00");
  session.authorHHSProactiveInquiryResult({
    assignmentId: "pop0.assignment.hhs-evidence-integrity",
    artifactId: "pop0.artifact.hhs.evidence-integrity",
    observationAuthorityId: "pop0.observation-authority.hhs.rural-maternity-service-access",
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  });
  cachedHhsSave = session.save();
  return cachedHhsSave;
};

const expectRehashedTamperRejected = (
  serialized: string,
  artifactId: string,
  mutate: (artifact: MutableI5Artifact) => void,
): void => {
  const envelope = mutableSave(serialized);
  const artifact = domainArtifact(envelope, artifactId);
  mutate(artifact);
  rehash(artifact);
  expect(artifact.canonicalArtifactHash).toBe(
    computeI5DomainEvidenceArtifactHash(withoutArtifactHash(artifact)),
  );
  expect(() => createPresidentialOperatingProofSession(JSON.stringify(envelope)))
    .toThrow(/independently reconcile|canonical source|owner lineage|observation authority/i);
};

describe("POP0-I5 rehashed evidence-integrity repair", () => {
  it("rejects a changed Employment value even after the artifact is rehashed", () => {
    expectRehashedTamperRejected(
      concurrentSave(),
      "pop0.artifact.labor.preliminary_regional_employment_estimate",
      (artifact) => { artifact.claims[0].value = 31_000; },
    );
  });

  it("rejects changed Employment source identity and source hash after rehashing", () => {
    expectRehashedTamperRejected(
      concurrentSave(),
      "pop0.artifact.labor.preliminary_regional_employment_estimate",
      (artifact) => {
        artifact.claims[1].sourceRecordId = "pop0.employment-occurrence.fabricated";
        artifact.claims[1].sourceRecordHash = "f".repeat(64);
      },
    );
  });

  it("rejects changed Congress initiative/window semantics after rehashing", () => {
    expectRehashedTamperRejected(
      concurrentSave(),
      "pop0.artifact.congress.regional-employment-initiative-opportunity",
      (artifact) => { artifact.claims[1].value = "2029-04-30T17:00:00-04:00"; },
    );
  });

  it("rejects changed HHS maternity-service claims after rehashing", () => {
    expectRehashedTamperRejected(
      hhsSave(),
      "pop0.artifact.hhs.evidence-integrity",
      (artifact) => { artifact.claims[1].value = 12; },
    );
  });

  it("rejects changed budget-review product claims after rehashing", () => {
    expectRehashedTamperRejected(
      concurrentSave(),
      "pop0.artifact.budget-review-result.pop0.assignment.omb.housing-full-implementation-review",
      (artifact) => { artifact.claims[0].value = "FULL_REGIONAL_EMPLOYMENT_CONGRESSIONAL_ANALYSIS"; },
    );
  });

  it("rejects changed analysis-only income and coverage claims after rehashing", () => {
    for (const artifactId of [
      "pop0.artifact.labor.modeled_household_income_impact",
      "pop0.artifact.labor.modeled_healthcare_coverage_risk",
    ]) {
      expectRehashedTamperRejected(concurrentSave(), artifactId, (artifact) => {
        artifact.claims[0].value = 99_999_999;
      });
    }
  });

  it("rejects changed observation time and authority after rehashing", () => {
    expectRehashedTamperRejected(
      concurrentSave(),
      "pop0.artifact.labor.revised_regional_employment_estimate",
      (artifact) => {
        artifact.claims[0].observedAt = "2029-01-01T00:00:00-05:00";
        artifact.claims[0].observationAuthorityId =
          "pop0.observation-authority.hhs.rural-maternity-service-access";
      },
    );
  });

  it("restores legitimate preliminary and revised Employment vintages as distinct linked artifacts", () => {
    const restored = createPresidentialOperatingProofSession(concurrentSave());
    const artifacts = restored.getOperatingState().ownerStates.informationRoutes.state.artifacts;
    const preliminary = artifacts.find((entry) =>
      entry.id === "pop0.artifact.labor.preliminary_regional_employment_estimate");
    const revised = artifacts.find((entry) =>
      entry.id === "pop0.artifact.labor.revised_regional_employment_estimate");
    expect(preliminary).toMatchObject({
      kind: "I5_DOMAIN_EVIDENCE",
      revisionOfArtifactId: null,
      supersedesArtifactId: null,
    });
    expect(revised).toMatchObject({
      kind: "I5_DOMAIN_EVIDENCE",
      revisionOfArtifactId: preliminary?.id,
      supersedesArtifactId: preliminary?.id,
    });
    expect(revised).not.toEqual(preliminary);
    expect(restored.save()).toBe(concurrentSave());
  });
});

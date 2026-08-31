import { describe, expect, it } from "vitest";

import { createPresidentialOperatingProofSession } from
  "../src/app/presidential-operating-proof-session";
import { sha256Hex } from "../src/configuration/sha256";
import {
  POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS,
  POP0_I2_OFFICE_IDS,
  POP0_I4_IDS,
  POP0_V0_OPERATING_CONFIGURATION,
} from "../src/content/pop0-v0/configuration";
import {
  POP0_I4_TRACE_IDS,
  POP0_I4_TRACE_TIMES,
  createPop0I4TraceSession,
  runFullPop0I4Trace,
} from "./pop0-i4-proof-fixture";

const substitutedProvenance = "pop0.provenance.unauthorized-substitution";

const mutableInformationEnvelope = (saved: string): {
  readonly envelope: Record<string, unknown>;
  readonly artifacts: Record<string, unknown>[];
} => {
  const envelope = JSON.parse(saved) as {
    operatingState: {
      ownerStates: {
        informationRoutes: { state: { artifacts: Record<string, unknown>[] } };
      };
    };
  };
  return {
    envelope: envelope as unknown as Record<string, unknown>,
    artifacts: envelope.operatingState.ownerStates.informationRoutes.state.artifacts,
  };
};

const recomputeArtifactHash = (artifact: Record<string, unknown>): void => {
  const withoutHash = { ...artifact };
  delete withoutHash.canonicalArtifactHash;
  artifact.canonicalArtifactHash = sha256Hex(JSON.stringify(withoutHash));
};

const capturePreAuthoringAndPreHandling = (): {
  readonly beforeAuthoring: string;
  readonly beforeHandling: string;
} => {
  const session = createPop0I4TraceSession();
  let beforeAuthoring = "";
  let beforeHandling = "";
  runFullPop0I4Trace(session, () => {
    const state = session.getOperatingState().ownerStates;
    const hasRawReceipt = state.informationRoutes.state.receipts.some(
      (entry) => entry.id === POP0_I4_TRACE_IDS.rawReceipt,
    );
    const productionCount = state.informationRoutes.state.officeArtifactProductions.length;
    const handlingCount = state.officeOperations.state.flatMap(
      (entry) => entry.departmentHandlingSubmissions,
    ).length;
    if (hasRawReceipt && productionCount === 0) beforeAuthoring = session.save();
    if (productionCount === 1 && handlingCount === 0) beforeHandling = session.save();
  });
  if (beforeAuthoring === "" || beforeHandling === "") {
    throw new Error("I4 repair fixture did not expose required provenance checkpoints.");
  }
  return { beforeAuthoring, beforeHandling };
};

describe("POP0-I4 detached-audit repair boundaries", () => {
  it("freezes monitoring at 07:50 before direct lower owners advance to the 08:00 epoch", () => {
    const session = createPop0I4TraceSession();
    const state = session.getOperatingState().ownerStates;
    const artifact = state.informationRoutes.state.artifacts.find(
      (entry) => entry.id === POP0_I4_IDS.monitoringArtifact,
    );
    if (artifact?.kind !== "HOUSING_MONITORING_EVIDENCE") {
      throw new Error("Missing monitoring artifact.");
    }
    expect(artifact.asOf).toBe(POP0_V0_OPERATING_CONFIGURATION.housing.opening.monitoringObservedAt);
    expect(artifact.claims.every((claim) => claim.sourceOccurredAt === null ||
      Date.parse(claim.sourceOccurredAt) <= Date.parse(claim.observedAt))).toBe(true);
    for (const claim of artifact.claims.filter((entry) => entry.sourceStateField === "materialHousing")) {
      expect(claim.sourceOccurredAt).toBe(artifact.asOf);
      const currentProject = state.materialHousing.projects.find((entry) => entry.id === claim.projectId);
      if (currentProject === undefined) throw new Error(`Missing project ${claim.projectId}.`);
      expect(claim.sourceRecordHash).toMatch(/^[a-f0-9]{64}$/);
    }
    expect(state.materialHousing.projects.find(
      (entry) => entry.id === POP0_V0_OPERATING_CONFIGURATION.housing.opening.palmsProjectId,
    )).toMatchObject({ stage: "ACTIVE" });
    expect(state.materialHousing.projects.find(
      (entry) => entry.id === POP0_V0_OPERATING_CONFIGURATION.housing.opening.stablesProjectId,
    )).toMatchObject({ stage: "BLOCKED", complianceHold: true });
  });

  it("rejects future claim time and post-observation project state even with recomputed artifact hashes", () => {
    const session = createPop0I4TraceSession();
    const original = session.save();
    session.advanceTo(POP0_I4_TRACE_TIMES.laterHousing);
    const currentProject = session.getOperatingState().ownerStates.materialHousing.projects.find(
      (entry) => entry.id === POP0_V0_OPERATING_CONFIGURATION.housing.opening.palmsProjectId,
    );
    if (currentProject === undefined) throw new Error("Missing Palms project.");

    const future = mutableInformationEnvelope(original);
    const futureArtifact = future.artifacts.find(
      (entry) => entry.id === POP0_I4_IDS.monitoringArtifact,
    );
    if (futureArtifact === undefined) throw new Error("Missing monitoring artifact.");
    const futureClaims = futureArtifact.claims as Record<string, unknown>[];
    const futureClaim = futureClaims.find((entry) => entry.projectId === currentProject.id);
    if (futureClaim === undefined) throw new Error("Missing Palms monitoring claim.");
    futureClaim.sourceOccurredAt = POP0_I4_TRACE_TIMES.laterHousing;
    recomputeArtifactHash(futureArtifact);
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(future.envelope)))
      .toThrow(/future owner state|observation chronology/i);

    const postObservation = mutableInformationEnvelope(original);
    const postObservationArtifact = postObservation.artifacts.find(
      (entry) => entry.id === POP0_I4_IDS.monitoringArtifact,
    );
    if (postObservationArtifact === undefined) throw new Error("Missing monitoring artifact.");
    const postObservationClaims = postObservationArtifact.claims as Record<string, unknown>[];
    const postObservationClaim = postObservationClaims.find((entry) => entry.projectId === currentProject.id);
    if (postObservationClaim === undefined) throw new Error("Missing Palms monitoring claim.");
    postObservationClaim.observedFieldPath = "physicalProgressUnits";
    postObservationClaim.observedValue = currentProject.physicalProgressUnits;
    postObservationClaim.sourceRecordHash = sha256Hex(JSON.stringify(currentProject));
    recomputeArtifactHash(postObservationArtifact);
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(postObservation.envelope)))
      .toThrow(/monitoring evidence|claim-lineaged|tampered/i);
  });

  it("rejects caller-selected provenance for live supplemental authoring and Department handling", () => {
    const checkpoints = capturePreAuthoringAndPreHandling();
    const authoring = createPresidentialOperatingProofSession(checkpoints.beforeAuthoring);
    const beforeAuthoring = authoring.save();
    authoring.advanceTo(POP0_I4_TRACE_TIMES.supplementalArtifact);
    const atAuthoring = authoring.save();
    expect(() => authoring.authorDepartmentSupplementalRecord({
      productionId: POP0_I4_TRACE_IDS.supplementalProduction,
      producingOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
      authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.secretaryOfHud,
      sourceDispositionId: POP0_I4_TRACE_IDS.disposition,
      sourceAssignmentId: POP0_I4_TRACE_IDS.assignment,
      sourceAssignmentResultArtifactId: POP0_I4_TRACE_IDS.optionsResult,
      sourceEvidenceReceiptId: POP0_I4_TRACE_IDS.rawReceipt,
      provenanceReference: substitutedProvenance,
    })).toThrow(/provenance must match configured I4 provenance/i);
    expect(authoring.save()).toBe(atAuthoring);
    expect(beforeAuthoring).not.toBe(atAuthoring);

    const handling = createPresidentialOperatingProofSession(checkpoints.beforeHandling);
    handling.advanceTo(POP0_I4_TRACE_TIMES.supplementalSubmission);
    const atHandling = handling.save();
    const target = POP0_V0_OPERATING_CONFIGURATION.housing.handlingAuthority;
    expect(() => handling.submitDepartmentHandling({
      id: POP0_I4_TRACE_IDS.supplementalSubmission,
      deduplicationIdentity: "pop0.dedupe.handling.repair.provenance-substitution",
      submittingOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
      submittingOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.secretaryOfHud,
      handlingAuthorityId: POP0_I4_IDS.handlingAuthority,
      sourceDispositionId: POP0_I4_TRACE_IDS.disposition,
      sourceAssignmentId: POP0_I4_TRACE_IDS.assignment,
      sourceAssignmentResultArtifactId: POP0_I4_TRACE_IDS.optionsResult,
      targetInstitutionId: target.lowerInstitutionId,
      targetRequestId: target.targetRequestId,
      targetProjectId: target.targetProjectId,
      targetRelationshipId: target.targetRelationshipId,
      targetScopeKey: target.targetScopeKey,
      payload: {
        kind: "SUBMIT_SUPPLEMENTAL_RECORDS",
        recordTypeIds: ["NONAVAILABILITY_RECORD"],
        qualifyingEvidenceReference: {
          artifactId: POP0_I4_IDS.supplementalArtifact,
          artifactKind: "HUD_SUPPLEMENTAL_RECORD",
          recordTypeId: "NONAVAILABILITY_RECORD",
          certificationSectionId: "nonavailability-certification",
          sourceArtifactProductionId: POP0_I4_TRACE_IDS.supplementalProduction,
          sourceRawEvidenceReceiptId: POP0_I4_TRACE_IDS.rawReceipt,
          sourceLineageSectionId: "source-evidence-lineage",
        },
      },
      provenanceReference: substitutedProvenance,
    })).toThrow(/provenance must match configured I4 provenance/i);
    expect(handling.save()).toBe(atHandling);
  });

  it("rejects persisted artifact/production and handling provenance substitutions", () => {
    const session = createPop0I4TraceSession();
    runFullPop0I4Trace(session);
    const original = session.save();

    const artifactEnvelope = JSON.parse(original) as {
      operatingState: {
        ownerStates: {
          informationRoutes: {
            state: {
              artifacts: Record<string, unknown>[];
              officeArtifactProductions: Record<string, unknown>[];
            };
          };
        };
      };
    };
    const artifact = artifactEnvelope.operatingState.ownerStates.informationRoutes.state.artifacts.find(
      (entry) => entry.id === POP0_I4_IDS.supplementalArtifact,
    );
    const production = artifactEnvelope.operatingState.ownerStates.informationRoutes.state
      .officeArtifactProductions.find((entry) => entry.id === POP0_I4_TRACE_IDS.supplementalProduction);
    if (artifact === undefined || production === undefined) throw new Error("Missing supplemental provenance records.");
    artifact.provenanceReference = substitutedProvenance;
    production.provenanceReference = substitutedProvenance;
    recomputeArtifactHash(artifact);
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(artifactEnvelope)))
      .toThrow(/causal provenance|configured I4 provenance/i);

    const handlingEnvelope = JSON.parse(original) as {
      operatingState: {
        ownerStates: {
          officeOperations: {
            state: { departmentHandlingSubmissions: Record<string, unknown>[] }[];
          };
        };
      };
    };
    const handling = handlingEnvelope.operatingState.ownerStates.officeOperations.state
      .flatMap((entry) => entry.departmentHandlingSubmissions)
      .find((entry) => entry.id === POP0_I4_TRACE_IDS.supplementalSubmission);
    if (handling === undefined) throw new Error("Missing Department handling occurrence.");
    handling.provenanceReference = substitutedProvenance;
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(handlingEnvelope)))
      .toThrow(/authority or chronology|configured I4 provenance/i);
  });

  it("indexes only genuine lower-owner determination and material-input result identities", () => {
    const session = createPop0I4TraceSession();
    runFullPop0I4Trace(session);
    const state = session.getOperatingState().ownerStates;
    const canonicalResultIds = new Set([
      ...state.programImplementation.administrativeProgram.determinations.map((entry) => entry.id),
      ...state.programImplementation.materialInputs.map((entry) => entry.id),
    ]);
    const lowerHistory = state.historicalRecordIndex.state.entries.filter(
      (entry) => entry.recordKind === "LOWER_OWNER_RESULT",
    );
    expect(lowerHistory.length).toBeGreaterThan(0);
    expect(lowerHistory.every((entry) => entry.occurrenceId === entry.ownerRecordId &&
      canonicalResultIds.has(entry.occurrenceId))).toBe(true);
    expect(lowerHistory.some((entry) => entry.occurrenceId.endsWith(".lower-owner-result"))).toBe(false);
    expect(state.historicalRecordIndex.state.entries.some(
      (entry) => entry.occurrenceId === POP0_I4_TRACE_IDS.supplementalSubmission &&
        entry.recordKind === "DOMAIN_HANDLING_SUBMISSION",
    )).toBe(true);
  });
});

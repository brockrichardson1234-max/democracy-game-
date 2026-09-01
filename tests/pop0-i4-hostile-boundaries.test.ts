import { describe, expect, it } from "vitest";

import {
  createPresidentialOperatingProofSession,
  type PresidentialOperatingProofSession,
} from "../src/app/presidential-operating-proof-session";
import {
  POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS,
  POP0_I2_OFFICE_IDS,
  POP0_I4_ASSESSMENT_SECTION_IDS,
  POP0_I4_IDS,
  POP0_I4_MONITORING_SECTION_IDS,
  POP0_V0_OPERATING_CONFIGURATION,
  POP0_V0_PROVENANCE_ROOT,
} from "../src/content/pop0-v0/configuration";
import type { PresidentialOperatingHousingConfiguration } from
  "../src/sim/presidential-operating-housing";
import {
  computePresidentialOperatingConfigurationHash,
  type PresidentialOperatingRuntimeConfiguration,
} from "../src/sim/presidential-operating-runtime";
import {
  POP0_I4_TRACE_IDS,
  POP0_I4_TRACE_TIMES,
  createPop0I4TraceSession,
  presentAndDecideI4,
  runFullPop0I4Trace,
  runI4ThroughCompletedOptionsAssignment,
  runI4ThroughEscalation,
} from "./pop0-i4-proof-fixture";

type DeepMutable<T> = {
  -readonly [Key in keyof T]: T[Key] extends readonly (infer Item)[]
    ? DeepMutable<Item>[]
    : T[Key] extends object
      ? DeepMutable<T[Key]>
      : T[Key];
};

const withHousing = (
  housing: PresidentialOperatingHousingConfiguration,
): PresidentialOperatingRuntimeConfiguration => {
  const base = POP0_V0_OPERATING_CONFIGURATION;
  const identity = {
    configurationId: base.identity.configurationId,
    configurationVersion: base.identity.configurationVersion,
    scenarioId: base.identity.scenarioId,
    scenarioVersion: base.identity.scenarioVersion,
  };
  const withoutHash = {
    schemaVersion: base.schemaVersion,
    identity,
    classification: base.classification,
    operatingStateId: base.operatingStateId,
    calendar: base.calendar,
    administration: base.administration,
    intervention: base.intervention,
    housing,
    concurrentWorld: base.concurrentWorld,
  };
  return {
    ...withoutHash,
    identity: {
      ...identity,
      configurationHash: computePresidentialOperatingConfigurationHash(withoutHash),
    },
  };
};

const expectRejectedWithoutMutation = (
  session: PresidentialOperatingProofSession,
  operation: () => void,
  pattern: RegExp,
): void => {
  const before = session.save();
  expect(operation).toThrow(pattern);
  expect(session.save()).toBe(before);
  expect(createPresidentialOperatingProofSession(before).save()).toBe(before);
};

describe("POP0-I4 hostile owner, knowledge, and causality boundaries", () => {
  it("rejects widened ambient lower-owner observation authority", () => {
    const housing = JSON.parse(JSON.stringify(POP0_V0_OPERATING_CONFIGURATION.housing)) as
      DeepMutable<PresidentialOperatingHousingConfiguration>;
    housing.observationAuthority.scopes[0].claimFamilies[0].fieldPaths.push("allHiddenOwnerState");
    const configuration = withHousing(housing as unknown as PresidentialOperatingHousingConfiguration);
    expect(() => createPresidentialOperatingProofSession(undefined, configuration))
      .toThrow(/claim-scoped owner boundary|observation authority/i);
  });

  it("rejects altered institution identity attribution even when the outer configuration is rehashed", () => {
    const housing = JSON.parse(JSON.stringify(POP0_V0_OPERATING_CONFIGURATION.housing)) as
      DeepMutable<PresidentialOperatingHousingConfiguration>;
    housing.institutionBinding.presidentialInstitutionId = "pop0.institution.fabricated-hud";
    const configuration = withHousing(housing as unknown as PresidentialOperatingHousingConfiguration);
    expect(() => createPresidentialOperatingProofSession(undefined, configuration))
      .toThrow(/institution|authenticated I6\/I7 owner content|contradicts/i);
  });

  it("rejects persisted monitoring claim, section, authority, and possession rewrites", () => {
    interface MonitoringEnvelope {
      operatingState: {
        ownerStates: {
          informationRoutes: {
            state: {
              artifacts: {
                id: string;
                claims?: { observedValue: unknown; sourceOwnerId: string; observedFieldPath: string }[];
                sectionClaims?: { claimIds: string[] }[];
              }[];
              institutionArtifactObservations: { observationAuthorityId: string }[];
              institutionPossessions: { artifactId: string; possessingInstitutionId: string }[];
            };
          };
        };
      };
    }
    const original = createPop0I4TraceSession().save();
    const mutations: ((value: MonitoringEnvelope) => void)[] = [
      (value) => {
        const artifact = value.operatingState.ownerStates.informationRoutes.state.artifacts
          .find((entry) => entry.id === POP0_I4_IDS.monitoringArtifact);
        if (artifact?.claims === undefined) throw new Error("Missing monitoring claims.");
        artifact.claims[0].observedValue = "FABRICATED_VALUE";
      },
      (value) => {
        const artifact = value.operatingState.ownerStates.informationRoutes.state.artifacts
          .find((entry) => entry.id === POP0_I4_IDS.monitoringArtifact);
        if (artifact?.claims === undefined) throw new Error("Missing monitoring claims.");
        artifact.claims[0].sourceOwnerId = "pop0.owner.fabricated";
        artifact.claims[0].observedFieldPath = "hiddenState";
      },
      (value) => {
        const artifact = value.operatingState.ownerStates.informationRoutes.state.artifacts
          .find((entry) => entry.id === POP0_I4_IDS.monitoringArtifact);
        if (artifact?.sectionClaims === undefined) throw new Error("Missing monitoring sections.");
        artifact.sectionClaims[0].claimIds.push("pop0.claim.fabricated");
      },
      (value) => {
        value.operatingState.ownerStates.informationRoutes.state
          .institutionArtifactObservations[0].observationAuthorityId = "pop0.authority.fabricated";
      },
      (value) => {
        const possession = value.operatingState.ownerStates.informationRoutes.state.institutionPossessions
          .find((entry) => entry.artifactId === POP0_I4_IDS.monitoringArtifact);
        if (possession === undefined) throw new Error("Missing monitoring possession.");
        possession.possessingInstitutionId = "pop0.institution.fabricated";
      },
    ];
    for (const mutate of mutations) {
      const envelope = JSON.parse(original) as MonitoringEnvelope;
      mutate(envelope);
      expect(() => createPresidentialOperatingProofSession(JSON.stringify(envelope)))
        .toThrow(/monitoring|observation|possession|claim|hash|artifact/i);
    }
  });

  it("keeps the exact four-workstream/four-rule I5 substrate closed", () => {
    expect(POP0_V0_OPERATING_CONFIGURATION.intervention.workstreamDefinitions.map((entry) => entry.id))
      .toEqual([
        "pop0.workstream.preliminary-labor-evidence-review",
        POP0_I4_IDS.housingWorkstream,
        "pop0.workstream.regional-employment-congressional-engagement",
        "pop0.workstream.rural-maternity-service-access-review",
      ]);
    expect(POP0_V0_OPERATING_CONFIGURATION.intervention.escalationEligibilityRules).toHaveLength(4);
    expect(POP0_V0_OPERATING_CONFIGURATION.intervention.escalationEligibilityRules
      .filter((entry) => entry.requiredBasisKind === "RECEIPT")).toHaveLength(3);
  });

  it("does not fan Department possession or Secretary receipt into another office or the President", () => {
    const session = createPop0I4TraceSession();
    const opening = session.getOperatingState();
    expect(opening.ownerStates.informationRoutes.state.institutionPossessions
      .some((entry) => entry.artifactId === POP0_I4_IDS.monitoringArtifact)).toBe(true);
    expect(session.getOfficeInformation(POP0_I2_OFFICE_IDS.secretaryOfHud).receipts).toEqual([]);
    expect(session.getOfficeInformation(POP0_I2_OFFICE_IDS.chiefOfStaff).receipts).toEqual([]);
    expect(session.getPresidentialAttention()).toEqual([]);

    session.advanceTo(POP0_I4_TRACE_TIMES.monitoringRetrieval);
    session.attemptRetrieval({
      id: POP0_I4_TRACE_IDS.monitoringRetrieval,
      requestingOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
      artifactId: POP0_I4_IDS.monitoringArtifact,
      requestedSectionIds: [...POP0_I4_MONITORING_SECTION_IDS],
      metadataNoticeId: POP0_I4_IDS.monitoringSecretaryNotice,
    });
    session.advanceTo(POP0_I4_TRACE_TIMES.monitoringReceipt);
    session.admitSubstantiveReceipt({
      id: POP0_I4_TRACE_IDS.monitoringReceipt,
      recipientOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
      artifactId: POP0_I4_IDS.monitoringArtifact,
      receivedSectionIds: [...POP0_I4_MONITORING_SECTION_IDS],
      retrievalId: POP0_I4_TRACE_IDS.monitoringRetrieval,
      receivingAuthorityReference: POP0_I4_IDS.observationAuthority,
      deduplicationIdentity: "pop0.dedupe.hostile.secretary-only-monitoring-receipt",
    });
    expect(session.getOfficeInformation(POP0_I2_OFFICE_IDS.chiefOfStaff).receipts).toEqual([]);
    expect(session.getPresidentialAttention()).toEqual([]);
    expect(session.getOperatingState().ownerStates.presidentialPresentations.state.presentations).toEqual([]);
  });

  it("prevents partial monitoring receipt from supporting the configured assessment or escalation", () => {
    const session = createPop0I4TraceSession();
    session.advanceTo(POP0_I4_TRACE_TIMES.monitoringRetrieval);
    session.attemptRetrieval({
      id: POP0_I4_TRACE_IDS.monitoringRetrieval,
      requestingOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
      artifactId: POP0_I4_IDS.monitoringArtifact,
      requestedSectionIds: [...POP0_I4_MONITORING_SECTION_IDS],
      metadataNoticeId: POP0_I4_IDS.monitoringSecretaryNotice,
    });
    session.advanceTo(POP0_I4_TRACE_TIMES.monitoringReceipt);
    session.admitSubstantiveReceipt({
      id: "pop0.receipt.secretary-of-hud.partial-housing-monitoring",
      recipientOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
      artifactId: POP0_I4_IDS.monitoringArtifact,
      receivedSectionIds: [POP0_I4_MONITORING_SECTION_IDS[0]],
      retrievalId: POP0_I4_TRACE_IDS.monitoringRetrieval,
      receivingAuthorityReference: POP0_I4_IDS.observationAuthority,
      deduplicationIdentity: "pop0.dedupe.receipt.secretary-of-hud.partial-housing-monitoring",
    });
    session.advanceTo(POP0_I4_TRACE_TIMES.assessment);
    expectRejectedWithoutMutation(session, () => session.authorAssessment({
      id: POP0_I4_TRACE_IDS.assessment,
      version: "1",
      sectionIds: [...POP0_I4_ASSESSMENT_SECTION_IDS],
      producingOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
      authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.secretaryOfHud,
      assignmentId: null,
      sourceReceiptIds: ["pop0.receipt.secretary-of-hud.partial-housing-monitoring"],
      sourceRetrievalIds: [POP0_I4_TRACE_IDS.monitoringRetrieval],
      sourceMetadataNoticeIds: [POP0_I4_IDS.monitoringSecretaryNotice],
      judgmentRuleIds: [POP0_I4_IDS.housingAssessmentRule],
      claimedConfidence: "INVALID_PARTIAL_SUPPORT",
      evidentiarySupport: "One received section",
      assumptionIds: [],
      limitations: [],
      recommendation: "No valid assessment",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
      revisionOfArtifactId: null,
      supersedesArtifactId: null,
    }), /required received sections|receipt coverage|evidence/i);
    expect(session.getOperatingState().ownerStates.presidentialEscalations.state.escalations).toEqual([]);
  });

  it("does not let a presidential decision directly mutate either lower owner", () => {
    const control = createPop0I4TraceSession();
    runI4ThroughEscalation(control);
    control.advanceTo(POP0_I4_TRACE_TIMES.decision);

    const session = createPop0I4TraceSession();
    runI4ThroughEscalation(session);
    presentAndDecideI4(session);
    const after = session.getOperatingState().ownerStates;
    const unacted = control.getOperatingState().ownerStates;
    expect(after.programImplementation).toEqual(unacted.programImplementation);
    expect(after.materialHousing).toEqual(unacted.materialHousing);
    expect(after.instrumentDispatches.state).toEqual([]);
    expect(after.officeOperations.state.flatMap((entry) => entry.departmentHandlingSubmissions)).toEqual([]);
  });

  it("does not let a Housing workstream transition own waiver or project truth", () => {
    const at = POP0_I4_TRACE_TIMES.monitoringRetrieval;
    const control = createPop0I4TraceSession();
    control.advanceTo(at);
    const session = createPop0I4TraceSession();
    session.advanceTo(at);
    session.transitionAdministrationWorkstream({
      id: "pop0.workstream.inherited-housing.transition.paused-proof",
      deduplicationIdentity: "pop0.dedupe.workstream.inherited-housing.paused-proof",
      workstreamId: POP0_I4_IDS.housingWorkstream,
      priorTransitionId: `${POP0_I4_IDS.housingWorkstream}.transition.opening-monitored`,
      status: "PAUSED",
      actingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      actingOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.chiefOfStaff,
      sourceOccurrenceIds: [POP0_I4_IDS.monitoringChiefOfStaffNotice],
      reason: "Pause coordination without changing either lower owner",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    expect(session.getOperatingState().ownerStates.programImplementation)
      .toEqual(control.getOperatingState().ownerStates.programImplementation);
    expect(session.getOperatingState().ownerStates.materialHousing)
      .toEqual(control.getOperatingState().ownerStates.materialHousing);
  });

  it("requires completed recipient work before the raw supplier-evidence notice", () => {
    const session = createPop0I4TraceSession();
    runI4ThroughEscalation(session);
    presentAndDecideI4(session);
    session.advanceTo(POP0_I4_TRACE_TIMES.rawNotice);
    expectRejectedWithoutMutation(session, () => session.deliverMetadataNotice({
      id: POP0_I4_TRACE_IDS.rawNotice,
      indexEntryId: POP0_I4_IDS.rawSupplierIndex,
      recipientOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
      deliveryPath: "ATTEMPTED_SHORTCUT_TO_RAW_EVIDENCE",
      deduplicationIdentity: "pop0.dedupe.hostile.raw-evidence-shortcut",
    }), /completed instrument-authorized options assignment/i);
  });

  it("requires a complete raw-evidence receipt before authoring the supplemental record", () => {
    const session = createPop0I4TraceSession();
    runI4ThroughCompletedOptionsAssignment(session);
    session.advanceTo(POP0_I4_TRACE_TIMES.supplementalArtifact);
    expectRejectedWithoutMutation(session, () => session.authorDepartmentSupplementalRecord({
      productionId: POP0_I4_TRACE_IDS.supplementalProduction,
      producingOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
      authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.secretaryOfHud,
      sourceDispositionId: POP0_I4_TRACE_IDS.disposition,
      sourceAssignmentId: POP0_I4_TRACE_IDS.assignment,
      sourceAssignmentResultArtifactId: POP0_I4_TRACE_IDS.optionsResult,
      sourceEvidenceReceiptId: "pop0.receipt.missing-raw-evidence",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    }), /complete raw-evidence receipt/i);
  });

  it("rejects wrong targets and raw-artifact masquerading without mutating canonical owners", () => {
    const session = createPop0I4TraceSession();
    runFullPop0I4Trace(session);
    const target = POP0_V0_OPERATING_CONFIGURATION.housing.handlingAuthority;
    const common = {
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
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    };
    expectRejectedWithoutMutation(session, () => session.submitDepartmentHandling({
      ...common,
      id: "pop0.handling.hostile.wrong-project",
      deduplicationIdentity: "pop0.dedupe.handling.hostile.wrong-project",
      targetProjectId: "us.project.not-stables",
      payload: {
        kind: "SUBMIT_WAIVER_REVIEW_INTENTION",
        intention: "GRANT_SCOPED_WAIVER",
        supportingHandlingSubmissionIds: [POP0_I4_TRACE_IDS.supplementalSubmission],
      },
    }), /bounded authority|target/i);
    expectRejectedWithoutMutation(session, () => session.submitDepartmentHandling({
      ...common,
      id: "pop0.handling.hostile.raw-artifact-masquerade",
      deduplicationIdentity: "pop0.dedupe.handling.hostile.raw-artifact-masquerade",
      payload: {
        kind: "SUBMIT_SUPPLEMENTAL_RECORDS",
        recordTypeIds: ["NONAVAILABILITY_RECORD"],
        qualifyingEvidenceReference: {
          artifactId: POP0_I4_IDS.rawSupplierArtifact,
          artifactKind: "HUD_SUPPLEMENTAL_RECORD",
          recordTypeId: "NONAVAILABILITY_RECORD",
          certificationSectionId: "nonavailability-certification",
          sourceArtifactProductionId: POP0_I4_TRACE_IDS.supplementalProduction,
          sourceRawEvidenceReceiptId: POP0_I4_TRACE_IDS.rawReceipt,
          sourceLineageSectionId: "source-evidence-lineage",
        },
      },
    }), /qualifying certified evidence lineage/i);
  });

  it("rejects fabricated material admission and creates no replacement Housing behavior", () => {
    const session = createPop0I4TraceSession();
    const beforeStables = session.getOperatingState().ownerStates.materialHousing.projects
      .find((entry) => entry.id === POP0_V0_OPERATING_CONFIGURATION.housing.opening.stablesProjectId);
    expectRejectedWithoutMutation(session, () => session.admitImplementationMaterialInputs({
      materialInputIds: ["pop0.fabricated.implementation-input"],
    }), /not an admissible new implementation-owned Housing input/i);
    session.advanceTo(POP0_I4_TRACE_TIMES.laterHousing);
    const after = session.getOperatingState();
    expect(after.ownerStates.materialHousing.projects.find((entry) => entry.id === beforeStables?.id))
      .toMatchObject({ stage: "BLOCKED", complianceHold: true });
    expect(after.ownerStates.presidentialEscalations.state.escalations).toEqual([]);
    expect(session.getPresidentialAttention()).toEqual([]);
  });

  it("leaves the implementation owner free to reject unsupported review and resolve DENY differently", () => {
    let beforeSupplementalSubmission = "";
    let afterSupplementalSubmission = "";
    const source = createPop0I4TraceSession();
    runFullPop0I4Trace(source, () => {
      const handling = source.getOperatingState().ownerStates.officeOperations.state
        .flatMap((entry) => entry.departmentHandlingSubmissions);
      const determinations = source.getOperatingState().ownerStates.programImplementation
        .administrativeProgram.determinations.filter((entry) =>
          entry.requestId === POP0_V0_OPERATING_CONFIGURATION.housing.handlingAuthority.targetRequestId &&
          entry.decidedAt >= POP0_V0_OPERATING_CONFIGURATION.housing.opening.epoch);
      if (handling.length === 0 && source.getOperatingState().ownerStates.informationRoutes.state
        .officeArtifactProductions.length === 1) beforeSupplementalSubmission = source.save();
      if (handling.length === 1 && determinations.length === 0) afterSupplementalSubmission = source.save();
    });
    expect(beforeSupplementalSubmission).not.toBe("");
    expect(afterSupplementalSubmission).not.toBe("");

    const target = POP0_V0_OPERATING_CONFIGURATION.housing.handlingAuthority;
    const unsupported = createPresidentialOperatingProofSession(beforeSupplementalSubmission);
    unsupported.advanceTo(POP0_I4_TRACE_TIMES.reviewSubmission);
    expectRejectedWithoutMutation(unsupported, () => unsupported.submitDepartmentHandling({
      id: "pop0.handling.hostile.unsupported-grant",
      deduplicationIdentity: "pop0.dedupe.handling.hostile.unsupported-grant",
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
        kind: "SUBMIT_WAIVER_REVIEW_INTENTION",
        intention: "GRANT_SCOPED_WAIVER",
        supportingHandlingSubmissionIds: ["pop0.handling.missing-supplemental-submission"],
      },
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    }), /invalid supplemental handling|prior supplemental handling/i);

    const denied = createPresidentialOperatingProofSession(afterSupplementalSubmission);
    denied.advanceTo(POP0_I4_TRACE_TIMES.reviewSubmission);
    denied.submitDepartmentHandling({
      id: "pop0.handling.secretary-of-hud.submit-stables-denial",
      deduplicationIdentity: "pop0.dedupe.handling.secretary-of-hud.submit-stables-denial",
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
        kind: "SUBMIT_WAIVER_REVIEW_INTENTION",
        intention: "DENY",
        supportingHandlingSubmissionIds: [POP0_I4_TRACE_IDS.supplementalSubmission],
      },
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    const newInputs = denied.getOperatingState().ownerStates.programImplementation.materialInputs
      .filter((entry) => entry.projectRef === target.targetProjectId &&
        entry.validatedAt === POP0_I4_TRACE_TIMES.reviewSubmission)
      .map((entry) => entry.id);
    denied.admitImplementationMaterialInputs({ materialInputIds: newInputs });
    const stables = denied.getOperatingState().ownerStates.materialHousing.projects
      .find((entry) => entry.id === target.targetProjectId);
    expect(stables).toMatchObject({ stage: "BLOCKED", complianceHold: true });
    expect(denied.getOperatingState().ownerStates.programImplementation.administrativeProgram.determinations)
      .toContainEqual(expect.objectContaining({ intention: "DENY", physicalHousingEffect: null }));
  });
});

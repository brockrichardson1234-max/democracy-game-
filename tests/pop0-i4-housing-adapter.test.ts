import { describe, expect, it } from "vitest";
import { createPresidentialOperatingProofSession } from "../src/app/presidential-operating-proof-session";
import {
  POP0_I2_OFFICE_IDS,
  POP0_I4_IDS,
  POP0_V0_OPERATING_CONFIGURATION,
} from "../src/content/pop0-v0/configuration";
import {
  POP0_I4_TRACE_IDS,
  POP0_I4_TRACE_TIMES,
  createPop0I4TraceSession,
  presentAndDecideI4,
  runFullPop0I4Trace,
  runI4ThroughEscalation,
  runI4ThroughSecretaryAssessment,
} from "./pop0-i4-proof-fixture";

const project = (session: ReturnType<typeof createPresidentialOperatingProofSession>, id: string) => {
  const value = session.getOperatingState().ownerStates.materialHousing.projects.find((entry) => entry.id === id);
  if (value === undefined) throw new Error(`Missing test project ${id}.`);
  return value;
};

describe("POP0-I4 inherited Housing adapter", () => {
  it("boots direct canonical lower owners with autonomous Palms and independently blocked Stables", () => {
    const session = createPresidentialOperatingProofSession();
    const state = session.getOperatingState();
    const housing = POP0_V0_OPERATING_CONFIGURATION.housing;
    const stables = project(session, housing.opening.stablesProjectId);
    const palms = project(session, housing.opening.palmsProjectId);

    expect(state.schemaVersion).toBe(5);
    expect(state.ownerStates.programImplementation.sourceArtifactId)
      .toBe(housing.programImplementation.initializationArtifactId);
    expect(state.ownerStates.materialHousing.sourceArtifactId)
      .toBe(housing.materialHousing.initializationArtifactId);
    expect(stables.stage).toBe("BLOCKED");
    expect(stables.complianceHold).toBe(true);
    expect(palms.stage).toBe("ACTIVE");
    expect(palms.physicalProgressUnits).toBeGreaterThan(0);
    expect(session.getPresidentialAttention()).toEqual([]);
    expect(session.getOfficeInformation(POP0_I2_OFFICE_IDS.secretaryOfHud).receipts).toEqual([]);
    expect(session.getOfficeInformation(POP0_I2_OFFICE_IDS.chiefOfStaff).receipts).toEqual([]);
    expect(state.ownerStates.administrationWorkstreams.state.workstreams.map((entry) => entry.id))
      .toEqual([POP0_I4_IDS.housingWorkstream]);
    expect(POP0_V0_OPERATING_CONFIGURATION.intervention.workstreamDefinitions).toHaveLength(4);
    expect(POP0_V0_OPERATING_CONFIGURATION.intervention.escalationEligibilityRules).toHaveLength(4);
  });

  it("advances Palms in the background without creating Housing Attention or unblocking Stables", () => {
    const session = createPresidentialOperatingProofSession();
    const housing = POP0_V0_OPERATING_CONFIGURATION.housing;
    const beforePalms = project(session, housing.opening.palmsProjectId).physicalProgressUnits;
    session.advanceTo(POP0_I4_TRACE_TIMES.laterHousing);
    expect(project(session, housing.opening.palmsProjectId).physicalProgressUnits).toBeGreaterThan(beforePalms);
    expect(project(session, housing.opening.stablesProjectId)).toMatchObject({
      stage: "BLOCKED",
      complianceHold: true,
    });
    expect(session.getPresidentialAttention()).toEqual([]);
    expect(session.getOperatingState().ownerStates.presidentialEscalations.state.escalations).toEqual([]);
  });

  it("keeps Department possession, Secretary receipt, Chief-of-Staff receipt, and Attention separate", () => {
    const session = createPop0I4TraceSession();
    const opening = session.getOperatingState();
    expect(opening.ownerStates.informationRoutes.state.institutionPossessions.map((entry) => entry.artifactId))
      .toContain(POP0_I4_IDS.monitoringArtifact);
    expect(session.getOfficeInformation(POP0_I2_OFFICE_IDS.secretaryOfHud).receipts).toEqual([]);
    expect(session.getPresidentialAttention()).toEqual([]);

    runI4ThroughSecretaryAssessment(session);
    expect(session.getOfficeInformation(POP0_I2_OFFICE_IDS.secretaryOfHud).receipts.map((entry) => entry.id))
      .toContain(POP0_I4_TRACE_IDS.monitoringReceipt);
    expect(session.getOfficeInformation(POP0_I2_OFFICE_IDS.chiefOfStaff).receipts).toEqual([]);
    expect(session.getPresidentialAttention()).toEqual([]);
  });

  it("creates no Attention from an unpresented receipt-basis escalation", () => {
    const session = createPop0I4TraceSession();
    runI4ThroughEscalation(session);
    expect(session.getPresidentialAttention()).toEqual([]);
    expect(session.getOperatingState().ownerStates.presidentialEscalations.state.escalations)
      .toContainEqual(expect.objectContaining({
        id: POP0_I4_TRACE_IDS.escalation,
        basisKind: "RECEIPT",
        basisArtifactId: POP0_I4_TRACE_IDS.assessment,
        basisReceiptId: POP0_I4_TRACE_IDS.assessmentReceiptAtChiefOfStaff,
      }));

    presentAndDecideI4(session);
    expect(session.getPresidentialAttention()).toEqual([]);
    const state = session.getOperatingState();
    expect(state.ownerStates.presidentialInstruments.state.map((entry) => entry.id)).toEqual([
      POP0_I4_TRACE_IDS.analysisInstrument,
      POP0_I4_TRACE_IDS.coordinationInstrument,
    ]);
    expect(state.ownerStates.instrumentDispatches.state).toEqual([]);
  });

  it("keeps each recipient/Department/lower-owner/Housing consequence distinct through the full route", () => {
    const session = createPop0I4TraceSession();
    const housing = POP0_V0_OPERATING_CONFIGURATION.housing;
    const openingStables = project(session, housing.opening.stablesProjectId);
    runFullPop0I4Trace(session);
    const state = session.getOperatingState();
    const office = state.ownerStates.officeOperations.state.find(
      (entry) => entry.officeId === POP0_I2_OFFICE_IDS.secretaryOfHud,
    );
    const request = state.ownerStates.programImplementation.administrativeProgram.waiverRequests.find(
      (entry) => entry.id === housing.handlingAuthority.targetRequestId,
    );
    const stablesAfterAdmission = project(session, housing.opening.stablesProjectId);

    expect(office?.departmentHandlingSubmissions.map((entry) => entry.id)).toEqual([
      POP0_I4_TRACE_IDS.supplementalSubmission,
      POP0_I4_TRACE_IDS.reviewSubmission,
    ]);
    expect(request).toMatchObject({
      reviewState: "DETERMINED",
      supportingRecords: expect.arrayContaining(["NONAVAILABILITY_RECORD"]),
    });
    expect(state.ownerStates.informationRoutes.state.officeArtifactProductions)
      .toContainEqual(expect.objectContaining({
        id: POP0_I4_TRACE_IDS.supplementalProduction,
        artifactId: POP0_I4_IDS.supplementalArtifact,
      }));
    expect(stablesAfterAdmission.stage).not.toBe("BLOCKED");
    expect(stablesAfterAdmission.physicalProgressUnits).toBe(openingStables.physicalProgressUnits);

    session.advanceTo(POP0_I4_TRACE_TIMES.laterHousing);
    expect(project(session, housing.opening.stablesProjectId).physicalProgressUnits)
      .toBeGreaterThan(stablesAfterAdmission.physicalProgressUnits);
    expect(session.getOperatingState().ownerStates.presidentialPresentations.state.presentations)
      .not.toContainEqual(expect.objectContaining({ id: expect.stringContaining("result") }));
  });
});

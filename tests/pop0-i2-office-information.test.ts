import { describe, expect, it } from "vitest";

import { PRESIDENTIAL_OPERATING_SAVE_FORMAT_VERSION } from "../src/app/presidential-operating-persistence";
import {
  POP0_I2_ACTOR_IDS,
  POP0_I2_ASSESSMENT_RULE_IDS,
  POP0_I2_INSTITUTION_IDS,
  POP0_I2_OFFICE_IDS,
  POP0_I2_SOURCE_ARTIFACT_ID,
  POP0_I2_SOURCE_SECTION_IDS,
  POP0_V0_CONFIGURATION_VERSION,
  POP0_V0_OPERATING_CONFIGURATION,
} from "../src/content/pop0-v0/configuration";
import {
  POP0_I2_ALLOWED_ACTOR_JOINS,
  POP0_I2_POPULATION_LINKAGE_STATUS,
  POP0_I2_PROHIBITED_ACTOR_JOINS,
} from "../src/sim/presidential-office-information";
import { PRESIDENTIAL_OPERATING_RUNTIME_SCHEMA_VERSION } from "../src/sim/presidential-operating-runtime";
import {
  POP0_I2_SYNTHESIS_SECTION_IDS,
  POP0_I2_TRACE_IDS,
  admitProofReceiptsAndResolveQueues,
  attemptProofRetrievals,
  createPop0I2TraceSession,
  createProofAssignments,
  deliverProofNotices,
  establishPossessionAndIndex,
  runFullPop0I2Trace,
} from "./pop0-i2-proof-fixture";

describe("POP0-I2 independent office information substrate", () => {
  it("boots the authenticated I2 owner composition without Population state", () => {
    const session = createPop0I2TraceSession();
    const state = session.getOperatingState();

    expect(PRESIDENTIAL_OPERATING_RUNTIME_SCHEMA_VERSION).toBe(5);
    expect(PRESIDENTIAL_OPERATING_SAVE_FORMAT_VERSION).toBe(5);
    expect(POP0_V0_CONFIGURATION_VERSION).toBe("0.5.0-pop0-i5");
    expect(Object.keys(state.ownerStates).sort()).toEqual([
      "administrationDirectory",
      "administrationWorkstreams",
      "boundedMedia",
      "calendar",
      "congressionalInitiative",
      "externalActors",
      "historicalRecordIndex",
      "informationRoutes",
      "instrumentDispatches",
      "materialHousing",
      "maternityServiceAccess",
      "officeOperations",
      "presidentialDecisions",
      "presidentialEscalations",
      "presidentialInquiries",
      "presidentialInstruments",
      "presidentialPresentations",
      "programImplementation",
      "regionalEmployment",
    ]);
    expect(POP0_V0_OPERATING_CONFIGURATION.administration.institutions).toHaveLength(3);
    expect(state.ownerStates.officeOperations.state).toHaveLength(9);
    expect(state.ownerStates.administrationDirectory.state.officeholderAssignments).toHaveLength(9);
    expect(POP0_V0_OPERATING_CONFIGURATION.administration.populationLinkages).toHaveLength(10);
    expect(JSON.stringify(state)).not.toMatch(/populationState|representedWeight|electorate|publicBelief/i);
  });

  it("authenticates all ten administration humans as zero-weight outside-scope proof actors", () => {
    const administration = POP0_V0_OPERATING_CONFIGURATION.administration;
    expect(administration.actors.map((actor) => actor.id).sort()).toEqual(
      Object.values(POP0_I2_ACTOR_IDS).sort(),
    );
    for (const linkage of administration.populationLinkages) {
      expect(linkage).toMatchObject({
        status: POP0_I2_POPULATION_LINKAGE_STATUS,
        populationScope: "POP0_I2_NO_ORDINARY_POPULATION_COMPOSED",
        populationWeight: 0,
        effectiveUntil: null,
      });
      expect([...linkage.permittedJoins].sort()).toEqual([...POP0_I2_ALLOWED_ACTOR_JOINS].sort());
      expect([...linkage.prohibitedJoins].sort()).toEqual([...POP0_I2_PROHIBITED_ACTOR_JOINS].sort());
    }
  });

  it("keeps Department possession separate from Secretary-office receipt and knowledge", () => {
    const session = createPop0I2TraceSession();
    session.recordInstitutionPossession({
      id: POP0_I2_TRACE_IDS.possession,
      artifactId: POP0_I2_SOURCE_ARTIFACT_ID,
      possessingInstitutionId: POP0_I2_INSTITUTION_IDS.labor,
      acquisitionProvenanceReference: "CONFIGURED_SYNTHETIC_PROOF_ROOT",
    });

    const state = session.getOperatingState();
    expect(state.ownerStates.informationRoutes.state.institutionPossessions).toContainEqual(
      expect.objectContaining({ artifactId: POP0_I2_SOURCE_ARTIFACT_ID }),
    );
    expect(session.getOfficeInformation(POP0_I2_OFFICE_IDS.secretaryOfLabor)).toMatchObject({
      metadataNotices: [],
      retrievals: [],
      receipts: [],
      receivedArtifacts: [],
    });
  });

  it("keeps notice, technical retrieval, and substantive receipt as separate steps", () => {
    const session = createPop0I2TraceSession();
    establishPossessionAndIndex(session);
    deliverProofNotices(session);
    createProofAssignments(session);

    const noticed = session.getOfficeInformation(POP0_I2_OFFICE_IDS.nec);
    expect(noticed.metadataNotices.map((entry) => entry.id)).toEqual([POP0_I2_TRACE_IDS.necNotice]);
    expect(noticed.retrievals).toEqual([]);
    expect(noticed.receipts).toEqual([]);

    attemptProofRetrievals(session);
    const retrieved = session.getOfficeInformation(POP0_I2_OFFICE_IDS.nec);
    expect(retrieved.retrievals[0].result).toBe("AVAILABLE_AT_OFFICE_BOUNDARY");
    expect(retrieved.receipts).toEqual([]);
    expect(session.getOfficeInformation(POP0_I2_OFFICE_IDS.omb).retrievals[0]).toMatchObject({
      result: "ACCESS_DENIED",
      evaluatedEntitlementId: null,
    });

    admitProofReceiptsAndResolveQueues(session);
    expect(session.getOfficeInformation(POP0_I2_OFFICE_IDS.nec).receipts[0]).toMatchObject({
      artifactId: POP0_I2_SOURCE_ARTIFACT_ID,
      receivedSectionIds: [
        POP0_I2_SOURCE_SECTION_IDS.summary,
        POP0_I2_SOURCE_SECTION_IDS.regionalTable,
      ],
    });
    expect(session.getOfficeInformation(POP0_I2_OFFICE_IDS.omb).receipts).toEqual([]);
  });

  it("owns assignments and queue state by office instead of administration-wide workload", () => {
    const session = createPop0I2TraceSession();
    establishPossessionAndIndex(session);
    deliverProofNotices(session);
    createProofAssignments(session);

    const states = session.getOperatingState().ownerStates.officeOperations.state;
    const nec = states.find((office) => office.officeId === POP0_I2_OFFICE_IDS.nec);
    const omb = states.find((office) => office.officeId === POP0_I2_OFFICE_IDS.omb);
    expect(nec?.activeQueueAssignmentIds).toEqual([POP0_I2_TRACE_IDS.necAssignment]);
    expect(omb?.activeQueueAssignmentIds).toEqual([
      "pop0.assignment.omb.housing-full-implementation-review",
      "pop0.assignment.omb.employment-congress-full-analysis",
      POP0_I2_TRACE_IDS.ombAssignment,
    ]);
    expect(JSON.stringify(states)).not.toMatch(/administrationQueue|administrationCapacity/);

    attemptProofRetrievals(session);
    admitProofReceiptsAndResolveQueues(session);
    const resolved = session.getOperatingState().ownerStates.officeOperations.state;
    expect(resolved.find((office) => office.officeId === POP0_I2_OFFICE_IDS.nec)?.assignments[0].status)
      .toBe("IN_PROGRESS");
    expect(resolved.find((office) => office.officeId === POP0_I2_OFFICE_IDS.omb)?.assignments[0].status)
      .toBe("BLOCKED");
  });

  it("preserves material Labor/NEC disagreement and OMB metadata limits", () => {
    const session = createPop0I2TraceSession();
    runFullPop0I2Trace(session);
    const artifacts = session.getOperatingState().ownerStates.informationRoutes.state.artifacts;
    const labor = artifacts.find((artifact) => artifact.id === POP0_I2_TRACE_IDS.laborAssessment);
    const nec = artifacts.find((artifact) => artifact.id === POP0_I2_TRACE_IDS.necAssessment);
    const omb = artifacts.find((artifact) => artifact.id === POP0_I2_TRACE_IDS.ombAssessment);
    const synthesis = artifacts.find((artifact) => artifact.id === POP0_I2_TRACE_IDS.synthesis);

    expect(labor?.kind).toBe("ASSESSMENT");
    expect(nec?.kind).toBe("ASSESSMENT");
    expect(omb?.kind).toBe("ASSESSMENT");
    if (labor?.kind !== "ASSESSMENT" || nec?.kind !== "ASSESSMENT" || omb?.kind !== "ASSESSMENT") {
      throw new Error("Expected the configured assessment artifacts.");
    }
    expect(labor.judgments[0].ruleId).toBe(
      POP0_I2_ASSESSMENT_RULE_IDS.currentEvidenceDoesNotSupportSpillover,
    );
    expect(nec.judgments[0].ruleId).toBe(
      POP0_I2_ASSESSMENT_RULE_IDS.supplierAssumptionSupportsPlausibility,
    );
    expect(labor.judgments[0].judgment).not.toBe(nec.judgments[0].judgment);
    expect(omb.sourceReceiptIds).toEqual([]);
    expect(omb.evidentiarySupport).toBe("METADATA_AND_ACCESS_DENIAL_ONLY");

    expect(synthesis?.kind).toBe("SYNTHESIS");
    if (synthesis?.kind !== "SYNTHESIS") throw new Error("Expected Chief-of-Staff synthesis.");
    expect(synthesis.preservedAssessments).toEqual([
      expect.objectContaining({
        assessmentArtifactId: POP0_I2_TRACE_IDS.laborAssessment,
        judgments: labor.judgments,
      }),
      expect.objectContaining({
        assessmentArtifactId: POP0_I2_TRACE_IDS.necAssessment,
        judgments: nec.judgments,
      }),
    ]);
  });

  it("records only the bounded presidential presentation and leaves attachments unseen", () => {
    const session = createPop0I2TraceSession();
    runFullPop0I2Trace(session);
    const presentations = session.getOperatingState().ownerStates.presidentialPresentations.state.presentations;
    expect(presentations).toHaveLength(1);
    expect(presentations[0].shownPortions).toEqual([
      { artifactId: POP0_I2_TRACE_IDS.synthesis, sectionId: POP0_I2_SYNTHESIS_SECTION_IDS[0] },
      { artifactId: POP0_I2_TRACE_IDS.synthesis, sectionId: POP0_I2_SYNTHESIS_SECTION_IDS[1] },
    ]);
    expect(presentations[0].referencedButNotShownPortions).toEqual([
      { artifactId: POP0_I2_SOURCE_ARTIFACT_ID, sectionId: POP0_I2_SOURCE_SECTION_IDS.regionalTable },
      { artifactId: POP0_I2_SOURCE_ARTIFACT_ID, sectionId: POP0_I2_SOURCE_SECTION_IDS.methods },
    ]);
    expect(JSON.stringify(presentations[0])).not.toMatch(/read|unread|attention|decision|workstream/i);
  });

  it("returns recipient-scoped defensive office views rather than a global ledger", () => {
    const session = createPop0I2TraceSession();
    establishPossessionAndIndex(session);
    deliverProofNotices(session);
    const nec = session.getOfficeInformation(POP0_I2_OFFICE_IDS.nec);
    const omb = session.getOfficeInformation(POP0_I2_OFFICE_IDS.omb);
    expect(nec.metadataNotices.map((entry) => entry.id)).toEqual([POP0_I2_TRACE_IDS.necNotice]);
    expect(omb.metadataNotices.map((entry) => entry.id)).toEqual([POP0_I2_TRACE_IDS.ombNotice]);
    expect(Object.keys(nec).sort()).toEqual([
      "accessEntitlements",
      "authoredArtifactIds",
      "instrumentDispositions",
      "instrumentReceipts",
      "metadataNotices",
      "officeId",
      "receipts",
      "receivedArtifacts",
      "retrievals",
    ]);
    expect(session.getOfficeInformation(POP0_I2_OFFICE_IDS.nec)).not.toBe(nec);
    expect(session.getOfficeInformation(POP0_I2_OFFICE_IDS.nec).metadataNotices)
      .not.toBe(nec.metadataNotices);
  });
});

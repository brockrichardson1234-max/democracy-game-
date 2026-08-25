import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

import {
  createIntegratedPartialRuntimeAuditSession,
  createIntegratedPartialRuntimeSession,
  createIntegratedPartialRuntimeSessionFromSave,
} from "../src/app/integrated-session";
import { US_V0_STRUCTURAL_CONFIGURATION } from "../src/content/us-v0/configuration";
import {
  US_V0_I6_IMPLEMENTATION_CONFIGURATION,
  US_V0_I7_HOUSING_CONFIGURATION,
  US_V0_I7_RUNTIME_ARTIFACTS,
} from "../src/content/us-v0/i7";
import {
  admitEnactedFiscalAuthority,
  createProgramImplementationState,
  resolveImplementationOwnerIntention,
  submitBoundedAwardIntention,
  submitFiscalControlIntention,
  submitLocalMemberDecision,
  submitRecipientCommitmentIntention,
  type ProgramImplementationState,
  type RecipientCommitmentRequest,
} from "../src/sim/program-implementation";
import {
  admitValidatedMaterialInputs,
  createIntegratedMaterialHousingState,
  type AcceptedMaterialInputReference,
} from "../src/sim/housing";
import type { EnactedLegislativeSource } from "../src/sim/legislative-runtime";

const epoch = "2026-08-22T00:00:00-04:00";
const config = US_V0_I6_IMPLEMENTATION_CONFIGURATION;
const seed = US_V0_I7_RUNTIME_ARTIFACTS.programInitialization!;
const housingSeed = US_V0_I7_RUNTIME_ARTIFACTS.housingInitialization!;
const administration = { administrationId: "us.administration.reconciliation", actorId: "us.actor.reconciliation" };
const localOwner = { administrationId: "us.local-owner.reconciliation", actorId: "us.local.englewood" };

const law = (id: string): EnactedLegislativeSource => ({
  id,
  sourceProposalId: `${id}.proposal`,
  sourceProposalVersion: 1,
  textHash: "a".repeat(64),
  authorizationProvisions: ["Bounded reconciled Housing input authority"],
  appropriation: { amount: 1_000_000, purpose: "Generated authority; not physical progress" },
  policyTerms: {
    "recipient-flexibility-class": "BOUNDED_RECIPIENT_DISCRETION",
    "compliance-burden-class": "STANDARD_DOCUMENTED_ASSURANCE",
    "geographic-distribution-rule": "BALANCED_REGIONAL_ALLOCATION",
    "administrative-capacity-support-rule": "LIMITED_TECHNICAL_ASSISTANCE",
  },
  legalTermsClassification: "APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD",
  enactmentRoute: "SIGNATURE",
});

const resolveLatest = (
  state: ProgramImplementationState,
  at: string,
  implementationConfig = config,
): ProgramImplementationState => resolveImplementationOwnerIntention(
  state,
  [...state.ownerResolution.intentions].reverse().find((entry) => entry.status === "PENDING")!.id,
  implementationConfig,
  at,
);

const controlled = (
  implementationConfig = config,
  at = epoch,
): ProgramImplementationState => {
  let state = createProgramImplementationState(implementationConfig.initializationArtifactId, seed);
  state = admitEnactedFiscalAuthority(state, law(`us.legal-source.reconciliation.${implementationConfig.generatedFiscalWindow.availabilityDurationDays}`), implementationConfig, at);
  state = submitFiscalControlIntention(
    state,
    state.publicFinance.generatedBudgetAuthorities[0].id,
    administration,
    implementationConfig,
    at,
  );
  return resolveLatest(state, at, implementationConfig);
};

const award = (
  state: ProgramImplementationState,
  relationshipId: string,
  recipientId: string,
  formulaScopeMemberId: string | null,
  causeKey: string,
  at: string,
  implementationConfig = config,
): ProgramImplementationState => {
  const submitted = submitBoundedAwardIntention(state, {
    sourceFiscalControlId: state.fiscalExecution.generatedControls[0].id,
    relationshipId,
    formulaScopeMemberId,
    recipientId,
    amountMinorUnits: 1_000_000,
    agreementRef: `${causeKey}.agreement`,
    causeKey,
  }, administration, implementationConfig, at);
  return resolveLatest(submitted, at, implementationConfig);
};

const commitmentRequest = (
  state: ProgramImplementationState,
  projectRef: string,
  relationshipId: string,
  recipientId: string,
): RecipientCommitmentRequest => {
  const control = state.fiscalExecution.generatedControls[0];
  return {
    recipientId,
    relationshipId,
    projectRef,
    sourceObligationId: state.fiscalExecution.generatedObligations[0].id,
    amountMinorUnits: 500_000,
    planRef: "reconciliation-plan",
    projectSelectionRef: "reconciliation-selection",
    writtenAgreementRef: "reconciliation-written-agreement",
    environmentalClearanceRef: "reconciliation-environmental-clearance",
    selectedRecipientOption: 1,
    complianceRecordRefs: [...control.ruleProfile!.requiredRecordTypes],
    geographicPriorityAcknowledgement: control.ruleProfile!.geographicPriorityRule,
    causeKey: `reconciliation-commitment:${projectRef}`,
  };
};

const housing = () => createIntegratedMaterialHousingState(housingSeed, US_V0_I7_HOUSING_CONFIGURATION);

const references = (state: ProgramImplementationState): readonly AcceptedMaterialInputReference[] =>
  state.materialInputs.map((input) => ({ ...input }));

describe("I7 repaired-I6 reconciliation", () => {
  it("admits only material inputs created by the repaired I6 intention and owner resolver chain", () => {
    let state = award(
      controlled(),
      "us.relationship.home.corpus-christi-pj.fy2024",
      "us.recipient.corpus-christi",
      null,
      "reconciliation-palms-award",
      epoch,
    );
    state = submitRecipientCommitmentIntention(
      state,
      commitmentRequest(
        state,
        "us.project.palms-at-morris",
        "us.relationship.home.corpus-christi-pj.fy2024",
        "us.recipient.corpus-christi",
      ),
      administration,
      config,
      epoch,
    );
    expect(state.materialInputs).toEqual([]);
    state = resolveLatest(state, epoch);
    expect(state.ownerResolution.intentions.at(-1)).toMatchObject({ status: "RESOLVED" });
    expect(state.fiscalExecution.generatedObligations[0].amount.ownerId).toBe(config.federalFiscalExecutionOwnerId);
    const admitted = admitValidatedMaterialInputs(housing(), references(state));
    expect(new Set(admitted.acceptedInputs.map((input) => input.kind))).toEqual(new Set([
      "COMMITMENT_REFERENCE",
      "ENVIRONMENTAL_CLEARANCE_REFERENCE",
      "RECIPIENT_READINESS",
      "VALID_FISCAL_RESOURCE_INPUT",
    ]));
    expect(admitted.projects.find((project) => project.id === "us.project.palms-at-morris")!.physicalProgressUnits).toBe(0);
  });

  it("does not resurrect direct player fiscal, PJ, payment, or consortium outcome commands", () => {
    const session = createIntegratedPartialRuntimeSession(US_V0_STRUCTURAL_CONFIGURATION, US_V0_I7_RUNTIME_ARTIFACTS);
    for (const forbidden of [
      "approveApportionment",
      "establishBoundedAward",
      "recordRecipientCommitment",
      "setUpRecipientActivity",
      "submitRecipientDraw",
      "executeRecipientPayment",
      "electConsortiumMemberParticipation",
    ]) expect(forbidden in session).toBe(false);
  });

  it("projects Housing completion and usability through the repaired composite next-boundary selector", () => {
    const session = createIntegratedPartialRuntimeSession(US_V0_STRUCTURAL_CONFIGURATION, US_V0_I7_RUNTIME_ARTIFACTS);
    const completion = session.getPublicInstitutionalStatus().nextBoundary!;
    expect(completion).toMatchObject({ kind: "HOUSING_PHYSICAL_COMPLETION" });
    session.advanceToNextBoundary();
    expect(session.getPublicInstitutionalStatus().currentInstant).toBe(completion.at);
    expect(session.getAuditState().institutional!.calendar.processedBoundaryIds).toEqual([]);
    expect(session.getHousingAuditState().projects.find(
      (project) => project.id === "us.project.palms-at-morris",
    )!.stage).toBe("PHYSICALLY_COMPLETE");
    expect(session.getPublicInstitutionalStatus().nextBoundary).toMatchObject({ kind: "HOUSING_USABILITY" });
  });

  it("prevents a current relationship exclusion from producing the Housing material prerequisite", () => {
    let state = award(
      controlled(),
      "us.relationship.home.arapahoe-consortium.fy2025-2027",
      "us.recipient.arapahoe-county",
      "us.local.englewood",
      "reconciliation-stables-award",
      "2026-08-23T00:00:00-04:00",
    );
    state = submitLocalMemberDecision(
      state,
      "us.relationship.home.arapahoe-consortium.fy2025-2027",
      "us.local.englewood",
      "EXCLUDE",
      "reconciliation-exclusion",
      localOwner,
      config,
      "2026-08-24T00:00:00-04:00",
    );
    state = resolveLatest(state, "2026-08-24T00:00:00-04:00");
    state = submitRecipientCommitmentIntention(
      state,
      commitmentRequest(
        state,
        "us.project.stables",
        "us.relationship.home.arapahoe-consortium.fy2025-2027",
        "us.recipient.arapahoe-county",
      ),
      administration,
      config,
      "2026-08-25T00:00:00-04:00",
    );
    state = resolveLatest(state, "2026-08-25T00:00:00-04:00");
    expect(state.ownerResolution.intentions.at(-1)).toMatchObject({ status: "REFUSED" });
    expect(state.materialInputs.filter((input) => input.projectRef === "us.project.stables")).toEqual([]);
    expect(admitValidatedMaterialInputs(housing(), references(state)).acceptedInputs).toEqual([]);
  });

  it("prevents fiscal expiry from opening a new funding and Housing-input path", () => {
    const shortConfig = {
      ...config,
      generatedFiscalWindow: { ...config.generatedFiscalWindow, availabilityDurationDays: 30 },
    };
    const state = award(
      controlled(shortConfig),
      "us.relationship.home.corpus-christi-pj.fy2024",
      "us.recipient.corpus-christi",
      null,
      "reconciliation-expired-award",
      "2026-09-23T00:00:00-04:00",
      shortConfig,
    );
    expect(state.ownerResolution.intentions.at(-1)).toMatchObject({ status: "REFUSED" });
    expect(state.fiscalExecution.generatedObligations).toEqual([]);
    expect(state.materialInputs).toEqual([]);
  });

  it("preserves repaired I6 semantic tamper rejection inside save format 7 with Housing state", () => {
    const session = createIntegratedPartialRuntimeAuditSession(
      US_V0_STRUCTURAL_CONFIGURATION,
      US_V0_I7_RUNTIME_ARTIFACTS,
      [],
    );
    session.injectLocalMemberDecision(
      "us.relationship.home.arapahoe-consortium.fy2025-2027",
      "us.local.englewood",
      "EXCLUDE",
      "reconciliation-save-exclusion",
    );
    session.resolveOwnerIntention(session.getAuditState().implementation!.ownerResolution.intentions[0].id);
    const envelope = JSON.parse(session.save());
    expect(envelope.formatVersion).toBe(9);
    expect(envelope.housing).not.toBeNull();
    envelope.implementation.intergovernmental.transitions[0].newParticipation = "INCLUDED";
    expect(() => createIntegratedPartialRuntimeSessionFromSave(
      JSON.stringify(envelope),
      US_V0_STRUCTURAL_CONFIGURATION,
      US_V0_I7_RUNTIME_ARTIFACTS,
    )).toThrow();
  });

  it("keeps accepted I6 artifact reconstruction byte-exact in the reconciled checkout", () => {
    const output = execFileSync(process.execPath, ["scripts/verify-us-i6-artifacts.mjs"], {
      cwd: process.cwd(),
      encoding: "utf8",
      timeout: 30_000,
    });
    expect(output).toContain("Authenticated U.S. I6 artifact reconstruction passed.");
  }, 35_000);
});

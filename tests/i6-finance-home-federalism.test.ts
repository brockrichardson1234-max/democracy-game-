import { describe, expect, it } from "vitest";

import { US_V0_I6_IMPLEMENTATION_CONFIGURATION, US_V0_I7_RUNTIME_ARTIFACTS } from "../src/content/us-v0/i7";
import {
  admitEnactedFiscalAuthority,
  advanceAdministrativeDeadlines,
  approveFiscalControl,
  assertProgramImplementationState,
  directWaiverIntention,
  electRelationshipMember,
  establishBoundedRecipientAward,
  establishRecipientCommitment,
  executeEligiblePayment,
  openFutureWaiverRequest,
  requestFiscalControl,
  setupRecipientActivity,
  submitRecipientDrawRequest,
  supplySupplementalWaiverRecords,
  createProgramImplementationState,
} from "../src/sim/program-implementation";
import type { EnactedLegislativeSource } from "../src/sim/legislative-runtime";

const at = "2026-08-22T00:00:00-04:00";
const config = US_V0_I6_IMPLEMENTATION_CONFIGURATION;
const seed = US_V0_I7_RUNTIME_ARTIFACTS.programInitialization!;
const law = (id: string, amount: number, overrides: Partial<Record<string, string>> = {}): EnactedLegislativeSource => ({
  id,
  sourceProposalId: `${id}.proposal`,
  sourceProposalVersion: 1,
  textHash: "a".repeat(64),
  authorizationProvisions: ["Bounded housing delivery authority"],
  appropriation: { amount, purpose: "Generated legal budget authority; not payment" },
  policyTerms: {
    "recipient-flexibility-class": "BOUNDED_RECIPIENT_DISCRETION",
    "compliance-burden-class": "STANDARD_DOCUMENTED_ASSURANCE",
    "geographic-distribution-rule": "BALANCED_REGIONAL_ALLOCATION",
    "administrative-capacity-support-rule": "LIMITED_TECHNICAL_ASSISTANCE",
    ...overrides,
  },
  legalTermsClassification: "APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD",
  enactmentRoute: "SIGNATURE",
});

const controlled = (source = law("us.legal-source.test", 1_000_000)) => {
  let state = createProgramImplementationState(config.initializationArtifactId, seed);
  state = admitEnactedFiscalAuthority(state, source, config, at);
  const authorityId = state.publicFinance.generatedBudgetAuthorities[0].id;
  state = requestFiscalControl(state, authorityId);
  state = approveFiscalControl(state, authorityId, config, at);
  return { state, authorityId, controlId: state.fiscalExecution.generatedControls[0].id };
};

describe("I6 causal post-enactment chain", () => {
  it("uses actual enacted amount and every operative term in target-owner state", () => {
    const low = controlled(law("law.low", 100, {
      "recipient-flexibility-class": "TIGHT_FEDERAL_SPECIFICATION",
      "compliance-burden-class": "STREAMLINED_CORE_ASSURANCE",
      "geographic-distribution-rule": "FORMULA_NEUTRAL",
      "administrative-capacity-support-rule": "NO_SEPARATE_CAPACITY_SET_ASIDE",
    }));
    const high = controlled(law("law.high", 200, {
      "recipient-flexibility-class": "EXPANDED_RECIPIENT_DISCRETION",
      "compliance-burden-class": "ENHANCED_AUDIT_AND_REPORTING",
      "geographic-distribution-rule": "HIGH_NEED_GEOGRAPHIC_PRIORITY",
      "administrative-capacity-support-rule": "DEDICATED_CAPACITY_SUPPORT",
    }));
    expect(low.state.publicFinance.generatedBudgetAuthorities[0].amount.minorUnits).toBe(10_000);
    expect(high.state.publicFinance.generatedBudgetAuthorities[0].amount.minorUnits).toBe(20_000);
    expect(low.state.fiscalExecution.generatedControls[0].ruleProfile).toMatchObject({
      maximumRecipientOptions: 1,
      reviewSteps: 1,
      geographicPriorityRule: "FORMULA_NEUTRAL_BOUNDED_DETAIL",
      administrativeCapacityUnits: 1,
      processingLatencyDays: 30,
    });
    expect(high.state.fiscalExecution.generatedControls[0].ruleProfile).toMatchObject({
      maximumRecipientOptions: 3,
      reviewSteps: 4,
      geographicPriorityRule: "HIGH_NEED_GEOGRAPHIC_PRIORITY_BOUNDED_DETAIL",
      administrativeCapacityUnits: 4,
      processingLatencyDays: 10,
    });
    expect(low.state.administrativeProgram.administrativeCapacityCommitted).toBe(1);
    expect(high.state.administrativeProgram.administrativeCapacityCommitted).toBe(4);
  });

  it("does not let enactment or apportionment directly create an award, obligation, or payment", () => {
    const { state, controlId } = controlled();
    expect(state.fiscalExecution.generatedProgramAllocations).toEqual([]);
    expect(state.fiscalExecution.generatedAwards).toEqual([]);
    expect(state.fiscalExecution.generatedObligations).toEqual([]);
    expect(state.fiscalExecution.generatedPayments).toEqual([]);
    expect(() => establishBoundedRecipientAward(state, {
      sourceFiscalControlId: controlId,
      relationshipId: "us.relationship.home.corpus-christi-pj.fy2024",
      recipientId: "us.recipient.corpus-christi",
      amountMinorUnits: state.fiscalExecution.generatedControls[0].amount.minorUnits,
      agreementRef: "agreement",
      causeKey: "fake-national-allocation",
    }, config, at)).toThrow(/bounded recipient award/i);
  });

  it("creates separate bounded allocation, award, obligation, commitment, draw, and payment records", () => {
    const prepared = controlled();
    let state = prepared.state;
    const controlId = prepared.controlId;
    state = establishBoundedRecipientAward(state, {
      sourceFiscalControlId: controlId,
      relationshipId: "us.relationship.home.corpus-christi-pj.fy2024",
      recipientId: "us.recipient.corpus-christi",
      amountMinorUnits: 5_000_000,
      agreementRef: "generated-written-grant-agreement",
      causeKey: "award-1",
    }, config, at);
    const obligation = state.fiscalExecution.generatedObligations[0];
    const baseRequest = {
      recipientId: "us.recipient.corpus-christi",
      relationshipId: "us.relationship.home.corpus-christi-pj.fy2024",
      projectRef: "us.project.future-bounded",
      sourceObligationId: obligation.id,
      amountMinorUnits: 4_000_000,
      planRef: "plan-ref",
      projectSelectionRef: "selection-ref",
      writtenAgreementRef: null,
      environmentalClearanceRef: "environment-ref",
      selectedRecipientOption: 2,
      complianceRecordRefs: ["WRITTEN_AGREEMENT", "ELIGIBILITY_ASSURANCE", "COST_REVIEW"],
      geographicPriorityAcknowledgement: "BALANCED_REGIONAL_PRIORITY_BOUNDED_DETAIL",
      causeKey: "commitment-1",
    };
    expect(() => establishRecipientCommitment(state, baseRequest, config, at)).toThrow(/written agreement/);
    state = establishRecipientCommitment(state, { ...baseRequest, writtenAgreementRef: "written-agreement" }, config, at);
    state = setupRecipientActivity(state, state.recipientAdministration.commitments[0].id, config, at);
    state = submitRecipientDrawRequest(state, state.recipientAdministration.activities[0].id, 1_000_000, config, at);
    state = executeEligiblePayment(state, state.recipientAdministration.drawRequests[0].id, config, at);
    expect(new Set([
      state.fiscalExecution.generatedProgramAllocations[0].id,
      state.fiscalExecution.generatedAwards[0].id,
      obligation.id,
      state.recipientAdministration.commitments[0].id,
      state.recipientAdministration.drawRequests[0].id,
      state.fiscalExecution.generatedPayments[0].id,
    ]).size).toBe(6);
    expect(state.fiscalExecution.generatedPayments[0].obligationId).toBe(obligation.id);
    expect(state.materialInputs.every((entry) => entry.physicalHousingMutation === false)).toBe(true);
    assertProgramImplementationState(state, config, seed);
  });

  it("keeps future waiver intention administrative and creates only typed downstream inputs", () => {
    const { state: initial } = controlled();
    const request = {
      relationshipId: "us.relationship.home.arapahoe-consortium.fy2025-2027",
      projectRef: "us.project.future-bounded",
      inputComponent: "HVAC_COMPONENT",
      domesticPreferenceRequirement: "DOMESTIC_PREFERENCE_APPLIES",
      assertedBasis: "NONAVAILABILITY_ASSERTED",
      supportingRecords: [...config.futureWaiver.requiredSupportingRecordTypes],
      commentFrom: null,
      commentUntil: null,
      causeKey: "future-waiver-1",
    };
    const opened = openFutureWaiverRequest(initial, request, config, at);
    const requestId = opened.administrativeProgram.waiverRequests[0].id;
    const granted = directWaiverIntention(opened, requestId, "GRANT_SCOPED_WAIVER", config, at);
    const denied = directWaiverIntention(opened, requestId, "DENY", config, at);
    expect(granted.administrativeProgram.determinations[0].outcome).toBe("SCOPED_WAIVER_GRANTED");
    expect(denied.administrativeProgram.determinations[0].outcome).toBe("DENIED");
    expect(granted.materialInputs.map((entry) => entry.kind)).toEqual(["WAIVER_TERMS", "INPUT_AVAILABILITY"]);
    expect(granted.materialInputs.every((entry) => entry.physicalHousingMutation === false)).toBe(true);
    expect(denied.materialInputs.at(-1)).toMatchObject({ kind: "COMPLIANCE_HOLD", physicalHousingMutation: false });
    const insufficient = openFutureWaiverRequest(initial, { ...request, causeKey: "future-waiver-2", supportingRecords: [] }, config, at);
    const returned = directWaiverIntention(
      insufficient,
      insufficient.administrativeProgram.waiverRequests[0].id,
      "RETURN_FOR_SUPPLEMENTAL_RECORD",
      config,
      at,
    );
    expect(returned.administrativeProgram.dynamicBoundaries).toHaveLength(1);
    const ready = advanceAdministrativeDeadlines(returned, "2026-09-10T00:00:00.000Z");
    expect(ready.administrativeProgram.waiverRequests[0].reviewState).toBe("REVIEW_READY");
    const supplemented = supplySupplementalWaiverRecords(
      ready,
      ready.administrativeProgram.waiverRequests[0].id,
      config.futureWaiver.requiredSupportingRecordTypes,
    );
    expect(() => directWaiverIntention(
      supplemented,
      supplemented.administrativeProgram.waiverRequests[0].id,
      "GRANT_SCOPED_WAIVER",
      config,
      "2026-09-10T00:00:00.000Z",
    )).not.toThrow();
  });

  it("bounds member elections to one relationship without inventing statewide refusal", () => {
    const state = createProgramImplementationState(config.initializationArtifactId, seed);
    const changed = electRelationshipMember(
      state,
      "us.relationship.home.arapahoe-consortium.fy2025-2027",
      "us.local.englewood",
      "EXCLUDE",
      "member-election-1",
      config,
      at,
    );
    expect(changed.intergovernmental.transitions[0]).toMatchObject({
      formulaScopeChanged: true,
      statewideRefusal: false,
      newParticipation: "EXCLUDED_FOR_NEW_FORMULA_RELATION",
    });
    expect(changed.intergovernmental.transitions[0].survivingDuties).toEqual(seed.relationships[0].survivingDuties);
    expect(changed.coverage).toEqual(state.coverage);
  });
});

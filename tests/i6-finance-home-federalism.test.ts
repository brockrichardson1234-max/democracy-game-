import { describe, expect, it } from "vitest";

import { US_V0_I6_IMPLEMENTATION_CONFIGURATION, US_V0_I7_RUNTIME_ARTIFACTS } from "../src/content/us-v0/i7";
import {
  admitEnactedFiscalAuthority,
  advanceAdministrativeDeadlines,
  assertProgramImplementationState,
  deriveEffectiveIntergovernmentalRelationship,
  directWaiverIntention,
  openFutureWaiverRequest,
  resolveImplementationOwnerIntention,
  submitBoundedAwardIntention,
  submitFederalPaymentIntention,
  submitFiscalControlIntention,
  submitLocalMemberDecision,
  submitLocalRelationshipStatusDecision,
  submitRecipientActivityIntention,
  submitRecipientCommitmentIntention,
  submitRecipientDrawIntention,
  supplySupplementalWaiverRecords,
  createProgramImplementationState,
} from "../src/sim/program-implementation";
import type { EnactedLegislativeSource } from "../src/sim/legislative-runtime";

const at = "2026-08-22T00:00:00-04:00";
const config = US_V0_I6_IMPLEMENTATION_CONFIGURATION;
const seed = US_V0_I7_RUNTIME_ARTIFACTS.programInitialization!;
const administrationOrigin = { administrationId: "us.administration.test", actorId: "us.actor.test-president" };
const localOrigin = { administrationId: "us.local-owner.test", actorId: "us.local.englewood" };
const resolveLast = (state: ReturnType<typeof createProgramImplementationState>, instant = at) =>
  resolveImplementationOwnerIntention(
    state,
    [...state.ownerResolution.intentions].reverse().find((entry) => entry.status === "PENDING")!.id,
    config,
    instant,
  );
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
  state = submitFiscalControlIntention(state, authorityId, administrationOrigin, config, at);
  expect(state.ownerResolution.intentions.at(-1)).toMatchObject({ kind: "REQUEST_FISCAL_CONTROL", status: "PENDING" });
  expect(state.fiscalExecution.generatedControls).toEqual([]);
  state = resolveLast(state);
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
    const prepared = controlled();
    let state = prepared.state;
    const controlId = prepared.controlId;
    expect(state.fiscalExecution.generatedProgramAllocations).toEqual([]);
    expect(state.fiscalExecution.generatedAwards).toEqual([]);
    expect(state.fiscalExecution.generatedObligations).toEqual([]);
    expect(state.fiscalExecution.generatedPayments).toEqual([]);
    state = submitBoundedAwardIntention(state, {
      sourceFiscalControlId: controlId,
      relationshipId: "us.relationship.home.corpus-christi-pj.fy2024",
      formulaScopeMemberId: null,
      recipientId: "us.recipient.corpus-christi",
      amountMinorUnits: state.fiscalExecution.generatedControls[0].amount.minorUnits,
      agreementRef: "agreement",
      causeKey: "fake-national-allocation",
    }, administrationOrigin, config, at);
    expect(state.ownerResolution.intentions.at(-1)).toMatchObject({ kind: "REQUEST_BOUNDED_AWARD", status: "PENDING" });
    expect(state.fiscalExecution.generatedAwards).toEqual([]);
    state = resolveLast(state);
    expect(state.ownerResolution.intentions.at(-1)).toMatchObject({ status: "REFUSED" });
    expect(state.fiscalExecution.generatedAwards).toEqual([]);
  });

  it("creates separate bounded allocation, award, obligation, commitment, draw, and payment records", () => {
    const prepared = controlled();
    let state = prepared.state;
    const controlId = prepared.controlId;
    state = submitBoundedAwardIntention(state, {
      sourceFiscalControlId: controlId,
      relationshipId: "us.relationship.home.corpus-christi-pj.fy2024",
      formulaScopeMemberId: null,
      recipientId: "us.recipient.corpus-christi",
      amountMinorUnits: 5_000_000,
      agreementRef: "generated-written-grant-agreement",
      causeKey: "award-1",
    }, administrationOrigin, config, at);
    state = resolveLast(state);
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
    state = submitRecipientCommitmentIntention(state, baseRequest, administrationOrigin, config, at);
    state = resolveLast(state);
    expect(state.ownerResolution.intentions.at(-1)).toMatchObject({ status: "REFUSED" });
    state = submitRecipientCommitmentIntention(
      state, { ...baseRequest, writtenAgreementRef: "written-agreement" }, administrationOrigin, config, at,
    );
    expect(state.ownerResolution.intentions.at(-1)).toMatchObject({ kind: "REQUEST_RECIPIENT_COMMITMENT", status: "PENDING" });
    expect(state.recipientAdministration.commitments).toEqual([]);
    state = resolveLast(state);
    state = submitRecipientActivityIntention(
      state, state.recipientAdministration.commitments[0].id, administrationOrigin, config, at,
    );
    expect(state.ownerResolution.intentions.at(-1)).toMatchObject({ kind: "REQUEST_RECIPIENT_ACTIVITY_SETUP", status: "PENDING" });
    expect(state.recipientAdministration.activities).toEqual([]);
    state = resolveLast(state);
    state = submitRecipientDrawIntention(
      state, state.recipientAdministration.activities[0].id, 1_000_000, administrationOrigin, config, at,
    );
    expect(state.ownerResolution.intentions.at(-1)).toMatchObject({ kind: "REQUEST_RECIPIENT_DRAW", status: "PENDING" });
    expect(state.recipientAdministration.drawRequests).toEqual([]);
    state = resolveLast(state);
    state = submitFederalPaymentIntention(
      state, state.recipientAdministration.drawRequests[0].id, administrationOrigin, config, at,
    );
    expect(state.ownerResolution.intentions.at(-1)).toMatchObject({ kind: "REQUEST_FEDERAL_PAYMENT", status: "PENDING" });
    expect(state.fiscalExecution.generatedPayments).toEqual([]);
    state = resolveLast(state);
    expect(new Set([
      state.fiscalExecution.generatedProgramAllocations[0].id,
      state.fiscalExecution.generatedAwards[0].id,
      obligation.id,
      state.recipientAdministration.commitments[0].id,
      state.recipientAdministration.drawRequests[0].id,
      state.fiscalExecution.generatedPayments[0].id,
    ]).size).toBe(6);
    expect(state.fiscalExecution.generatedPayments[0].obligationId).toBe(obligation.id);
    expect(state.fiscalExecution.generatedControls[0].amount.ownerId).toBe(config.fiscalControlOwnerId);
    expect(obligation.amount.ownerId).toBe(config.federalFiscalExecutionOwnerId);
    expect(state.fiscalExecution.generatedPayments[0].amount.ownerId).toBe(config.federalFiscalExecutionOwnerId);
    expect(config.federalFiscalExecutionOwnerId).not.toBe(config.fiscalControlOwnerId);
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
    let changed = submitLocalMemberDecision(
      state,
      "us.relationship.home.arapahoe-consortium.fy2025-2027",
      "us.local.englewood",
      "EXCLUDE",
      "member-election-1",
      localOrigin,
      config,
      at,
    );
    expect(changed.ownerResolution.intentions.at(-1)).toMatchObject({
      kind: "LOCAL_MEMBER_PARTICIPATION_DECISION",
      status: "PENDING",
    });
    expect(changed.intergovernmental.transitions).toEqual([]);
    changed = resolveLast(changed);
    expect(changed.intergovernmental.transitions[0]).toMatchObject({
      formulaScopeChanged: true,
      statewideRefusal: false,
      newParticipation: "EXCLUDED_FOR_NEW_FORMULA_RELATION",
    });
    expect(changed.intergovernmental.transitions[0].survivingDuties).toEqual(seed.relationships[0].survivingDuties);
    expect(changed.coverage).toEqual(state.coverage);
    expect(deriveEffectiveIntergovernmentalRelationship(
      changed, "us.relationship.home.arapahoe-consortium.fy2025-2027", at,
    )!.members.find((member) => member.id === "us.local.englewood")!.participation).toBe(
      "EXCLUDED_FOR_NEW_FORMULA_RELATION",
    );
    changed = submitLocalMemberDecision(
      changed,
      "us.relationship.home.arapahoe-consortium.fy2025-2027",
      "us.local.englewood",
      "INCLUDE",
      "member-election-same-instant",
      localOrigin,
      config,
      at,
    );
    changed = resolveLast(changed);
    const reversed = {
      ...changed,
      intergovernmental: { ...changed.intergovernmental, transitions: [...changed.intergovernmental.transitions].reverse() },
    };
    expect(deriveEffectiveIntergovernmentalRelationship(
      reversed, "us.relationship.home.arapahoe-consortium.fy2025-2027", at,
    )).toEqual(deriveEffectiveIntergovernmentalRelationship(
      changed, "us.relationship.home.arapahoe-consortium.fy2025-2027", at,
    ));
  });

  it("derives a bounded generated availability interval and refuses new awards after expiry", () => {
    const shortConfig = {
      ...config,
      generatedFiscalWindow: { ...config.generatedFiscalWindow, availabilityDurationDays: 30 },
    };
    let state = createProgramImplementationState(config.initializationArtifactId, seed);
    const source = law("law.short-window", 1_000_000);
    state = admitEnactedFiscalAuthority(state, source, shortConfig, at);
    expect(state.publicFinance.generatedBudgetAuthorities[0].availableUntil).toBe("2026-09-21T04:00:00.000Z");
    const alternate = admitEnactedFiscalAuthority(
      createProgramImplementationState(config.initializationArtifactId, seed),
      source,
      { ...shortConfig, generatedFiscalWindow: { ...shortConfig.generatedFiscalWindow, availabilityDurationDays: 31 } },
      at,
    );
    expect(alternate.publicFinance.generatedBudgetAuthorities[0].availableUntil).toBe("2026-09-22T04:00:00.000Z");
    state = submitFiscalControlIntention(
      state, state.publicFinance.generatedBudgetAuthorities[0].id, administrationOrigin, shortConfig, at,
    );
    state = resolveImplementationOwnerIntention(state, state.ownerResolution.intentions.at(-1)!.id, shortConfig, at);
    const request = {
      sourceFiscalControlId: state.fiscalExecution.generatedControls[0].id,
      relationshipId: "us.relationship.home.corpus-christi-pj.fy2024",
      formulaScopeMemberId: null,
      recipientId: "us.recipient.corpus-christi",
      amountMinorUnits: 1_000_000,
      agreementRef: "pre-expiry-agreement",
      causeKey: "pre-expiry",
    };
    state = submitBoundedAwardIntention(state, request, administrationOrigin, shortConfig, "2026-09-20T00:00:00-04:00");
    state = resolveImplementationOwnerIntention(
      state, state.ownerResolution.intentions.at(-1)!.id, shortConfig, "2026-09-20T00:00:00-04:00",
    );
    expect(state.fiscalExecution.generatedObligations).toHaveLength(1);
    state = submitBoundedAwardIntention(
      state, { ...request, causeKey: "post-expiry" }, administrationOrigin, shortConfig, "2026-09-22T00:00:00-04:00",
    );
    state = resolveImplementationOwnerIntention(
      state, state.ownerResolution.intentions.at(-1)!.id, shortConfig, "2026-09-22T00:00:00-04:00",
    );
    expect(state.ownerResolution.intentions.at(-1)).toMatchObject({ status: "REFUSED" });
    expect(state.fiscalExecution.generatedObligations).toHaveLength(1);
  });

  it("uses current effective relationship state to gate future awards while preserving duties", () => {
    const relationshipId = "us.relationship.home.arapahoe-consortium.fy2025-2027";
    const memberId = "us.local.englewood";
    const award = (state: ReturnType<typeof createProgramImplementationState>, causeKey: string) => {
      const submitted = submitBoundedAwardIntention(state, {
        sourceFiscalControlId: state.fiscalExecution.generatedControls[0].id,
        relationshipId,
        formulaScopeMemberId: memberId,
        recipientId: "us.recipient.arapahoe-county",
        amountMinorUnits: 1_000_000,
        agreementRef: "relationship-gated-agreement",
        causeKey,
      }, administrationOrigin, config, "2026-08-24T00:00:00-04:00");
      return resolveImplementationOwnerIntention(
        submitted, submitted.ownerResolution.intentions.at(-1)!.id, config, "2026-08-24T00:00:00-04:00",
      );
    };
    expect(award(controlled().state, "active-award").fiscalExecution.generatedAwards).toHaveLength(1);

    let excluded = controlled().state;
    excluded = submitLocalMemberDecision(
      excluded, relationshipId, memberId, "EXCLUDE", "exclude-before-funding", localOrigin, config,
      "2026-08-23T00:00:00-04:00",
    );
    excluded = resolveImplementationOwnerIntention(
      excluded, excluded.ownerResolution.intentions.at(-1)!.id, config, "2026-08-23T00:00:00-04:00",
    );
    const excludedDuties = deriveEffectiveIntergovernmentalRelationship(
      excluded, relationshipId, "2026-08-24T00:00:00-04:00",
    )!.survivingDuties;
    const excludedAttempt = award(excluded, "excluded-award");
    expect(excludedAttempt.ownerResolution.intentions.at(-1)).toMatchObject({ status: "REFUSED" });
    expect(excludedAttempt.coverage).toEqual(excluded.coverage);
    expect(excludedDuties).toEqual(seed.relationships[0].survivingDuties);

    for (const status of [
      "PENDING",
      "SUSPENDED",
      "EXCLUDED_FOR_NEW_FORMULA_RELATION",
      "ENDED_WITH_SURVIVING_DUTIES",
    ] as const) {
      let changed = controlled().state;
      changed = submitLocalRelationshipStatusDecision(
        changed, relationshipId, status, `status-${status}`, localOrigin, config, "2026-08-23T00:00:00-04:00",
      );
      changed = resolveImplementationOwnerIntention(
        changed, changed.ownerResolution.intentions.at(-1)!.id, config, "2026-08-23T00:00:00-04:00",
      );
      const attempted = award(changed, `award-${status}`);
      expect(attempted.ownerResolution.intentions.at(-1), status).toMatchObject({ status: "REFUSED" });
      expect(deriveEffectiveIntergovernmentalRelationship(
        attempted, relationshipId, "2026-08-24T00:00:00-04:00",
      )!.survivingDuties).toEqual(seed.relationships[0].survivingDuties);
    }
  });
});

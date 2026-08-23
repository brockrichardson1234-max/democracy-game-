import type {
  GovernmentConfiguration,
  LegislativeRuntimeSeed,
  ScaffoldClassification,
} from "../../configuration/types";
import {
  US_CONGRESS_LEGISLATURE_ID,
  US_HOUSE_CHAMBER_ID,
  US_INCUMBENT_ADMINISTRATION_ID,
  US_PRESIDENT_OFFICE_ID,
  US_SENATE_CHAMBER_ID,
  US_V0_I2_STRUCTURE,
  US_VICE_PRESIDENT_OFFICE_ID,
} from "./topology";

export const US_V0_PROFILE_SCAFFOLD_VERSION = "us-v0-actor-profile-scaffold-1";
export const US_V0_PROFILE_SEED = "us-v0-political-content-seed-1";
export const US_DELIVERY_COALITION_ID = "DELIVERY_COALITION";
export const US_FISCAL_COMPLIANCE_COALITION_ID = "FISCAL_COMPLIANCE_COALITION";
export const US_REGIONAL_BARGAINING_CAUCUS_ID = "REGIONAL_BARGAINING_CAUCUS";

const CLASSIFICATION: ScaffoldClassification =
  "APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD";
const ratio = (
  numerator: number,
  denominator: number,
  rounding: "CEILING" | "FLOOR_PLUS_ONE" = "CEILING",
) => ({ numerator, denominator, rounding } as const);

/** All I3 behavior-driving political content participates in the configuration hash. */
export const US_V0_LEGISLATIVE_SEED: LegislativeRuntimeSeed = {
  schemaVersion: 1,
  profileScaffold: {
    version: US_V0_PROFILE_SCAFFOLD_VERSION,
    seed: US_V0_PROFILE_SEED,
    classification: CLASSIFICATION,
  },
  dimensions: [
    { id: "appropriation_magnitude", minimum: 0, maximum: 10 },
    { id: "recipient_flexibility", minimum: 0, maximum: 10 },
    { id: "compliance_burden", minimum: 0, maximum: 10 },
    { id: "geographic_distribution", minimum: 0, maximum: 10 },
    { id: "administrative_capacity_support", minimum: 0, maximum: 10 },
  ],
  organizations: [
    {
      id: US_DELIVERY_COALITION_ID,
      label: "Delivery Coalition",
      classification: CLASSIFICATION,
      postureByDimension: {
        appropriation_magnitude: 8,
        recipient_flexibility: 7,
        compliance_burden: 5,
        geographic_distribution: 7,
        administrative_capacity_support: 9,
      },
      chamberQuotas: { [US_HOUSE_CHAMBER_ID]: 210, [US_SENATE_CHAMBER_ID]: 48 },
    },
    {
      id: US_FISCAL_COMPLIANCE_COALITION_ID,
      label: "Fiscal Compliance Coalition",
      classification: CLASSIFICATION,
      postureByDimension: {
        appropriation_magnitude: 3,
        recipient_flexibility: 4,
        compliance_burden: 9,
        geographic_distribution: 5,
        administrative_capacity_support: 5,
      },
      chamberQuotas: { [US_HOUSE_CHAMBER_ID]: 190, [US_SENATE_CHAMBER_ID]: 42 },
    },
    {
      id: US_REGIONAL_BARGAINING_CAUCUS_ID,
      label: "Regional Bargaining Caucus",
      classification: CLASSIFICATION,
      postureByDimension: {
        appropriation_magnitude: 6,
        recipient_flexibility: 9,
        compliance_burden: 5,
        geographic_distribution: 10,
        administrative_capacity_support: 6,
      },
      chamberQuotas: { [US_HOUSE_CHAMBER_ID]: 35, [US_SENATE_CHAMBER_ID]: 10 },
    },
  ],
  membershipScaffold: {
    version: "us-v0-org-membership-scaffold-1",
    algorithm: "SHA-256",
    salt: "us-v0-org-scaffold-1",
    chamberRankTokens: {
      [US_HOUSE_CHAMBER_ID]: "HOUSE",
      [US_SENATE_CHAMBER_ID]: "SENATE",
    },
    organizationOrder: [
      US_DELIVERY_COALITION_ID,
      US_FISCAL_COMPLIANCE_COALITION_ID,
      US_REGIONAL_BARGAINING_CAUCUS_ID,
    ],
  },
  procedure: {
    legislatureId: US_CONGRESS_LEGISLATURE_ID,
    originChamberId: US_HOUSE_CHAMBER_ID,
    otherChamberId: US_SENATE_CHAMBER_ID,
    chamberRules: [
      {
        chamberId: US_HOUSE_CHAMBER_ID,
        quorum: ratio(1, 2, "FLOOR_PLUS_ONE"),
        ordinaryPassage: { basis: "VOTES_CAST", threshold: ratio(1, 2, "FLOOR_PLUS_ONE"), tieFails: true },
        amendmentPassage: ratio(1, 2, "FLOOR_PLUS_ONE"),
        overridePassage: ratio(2, 3),
        extendedDebate: { available: false, clotureThreshold: null },
        tieBreakerOfficeId: null,
      },
      {
        chamberId: US_SENATE_CHAMBER_ID,
        quorum: ratio(1, 2, "FLOOR_PLUS_ONE"),
        ordinaryPassage: { basis: "VOTES_CAST", threshold: ratio(1, 2, "FLOOR_PLUS_ONE"), tieFails: true },
        amendmentPassage: ratio(1, 2, "FLOOR_PLUS_ONE"),
        overridePassage: ratio(2, 3),
        extendedDebate: { available: true, clotureThreshold: ratio(3, 5) },
        tieBreakerOfficeId: US_VICE_PRESIDENT_OFFICE_ID,
      },
    ],
    maximumTextExchanges: 2,
    maximumAmendmentRoundsPerChamber: 1,
    considerationGateMinimumSignals: {
      [US_HOUSE_CHAMBER_ID]: 1,
      [US_SENATE_CHAMBER_ID]: 0,
    },
    noSignatureRule: {
      enactWhenReturnNotPrevented: true,
      failWhenReturnPrevented: true,
    },
  },
  proposal: {
    id: "us.proposal.housing-agenda.i3",
    title: "Housing Delivery and Capacity Agenda",
    initialDimensions: {
      appropriation_magnitude: 7,
      recipient_flexibility: 7,
      compliance_burden: 6,
      geographic_distribution: 7,
      administrative_capacity_support: 8,
    },
    authorizationProvisions: [
      "Authorize a bounded housing delivery and recipient-capacity initiative.",
    ],
    appropriation: {
      amount: 25_000_000_000,
      purpose: "Legal budget authority for the enacted housing initiative; not recognized available finance.",
    },
  },
  decision: {
    organizationBlend: { numerator: 3, denominator: 4 },
    actorVariationRadius: 4,
    reservationDistance: 2.25,
    coordinationPressure: 1,
    commitmentHonorCutoff: 0.45,
    breachCutoff: 0.55,
  },
  negotiation: {
    maximumMemoryEntriesPerActor: 8,
    commitmentVisibility: "PARTICIPANTS_AND_ADMINISTRATION",
  },
  executive: {
    headOfficeId: US_PRESIDENT_OFFICE_ID,
    deputyOfficeId: US_VICE_PRESIDENT_OFFICE_ID,
    administrationId: US_INCUMBENT_ADMINISTRATION_ID,
  },
  recordIds: {
    proposalVersionPrefix: "us.proposal-version.",
    organizationActionPrefix: "us.organization-action.",
    commitmentPrefix: "us.commitment.",
    amendmentPrefix: "us.amendment.",
    voteOpportunityPrefix: "us.vote-opportunity.",
    lawPrefix: "us.legal-source.",
  },
};

/** The full world remains unavailable; this configuration exposes only the canonical legislative slice. */
export const US_V0_STRUCTURAL_CONFIGURATION: GovernmentConfiguration<LegislativeRuntimeSeed> = {
  identity: {
    configurationId: "us-v0",
    configurationVersion: "0.3.0-i3",
    scenarioId: "us-v0-2026-08-22",
    scenarioVersion: "0.3.0-i3",
    configurationHash: "d4c88c56d2b51b82bfc4ad8d843ef90673f3d83338c792f7c8bd654c909389be",
  },
  capability: "LEGISLATIVE_RUNTIME_SLICE",
  calendar: { kind: "REAL_CALENDAR", epoch: "2026-08-22T00:00:00-04:00" },
  structure: US_V0_I2_STRUCTURE,
  transitions: [],
  runtimeSeed: US_V0_LEGISLATIVE_SEED,
};

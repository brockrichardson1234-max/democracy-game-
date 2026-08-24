import type {
  GovernmentConfiguration,
  LegislativeRuntimeSeed,
  RuntimeArtifactBinding,
  ScaffoldClassification,
} from "../../configuration/types";
import {
  US_CONGRESS_LEGISLATURE_ID,
  US_HOUSE_CHAMBER_ID,
  US_INCUMBENT_ADMINISTRATION_ID,
  US_PRESIDENT_OFFICE_ID,
  US_SENATE_CHAMBER_ID,
  US_VICE_PRESIDENT_OFFICE_ID,
} from "./topology";
import i4Manifest from "./i4-artifacts/i4-initialization-manifest.json";
import { US_V0_I5_STRUCTURE, US_V0_I5_TEMPORAL_CONFIGURATION } from "./i5";
import {
  US_V0_I6_ARTIFACT_BINDING,
  US_V0_I6_IMPLEMENTATION_CONFIGURATION,
} from "./i6";

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
  schemaVersion: 2,
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
      [US_HOUSE_CHAMBER_ID]: 2,
      [US_SENATE_CHAMBER_ID]: 1,
    },
    noSignatureRule: {
      ruleClass: "ELAPSED_CALENDAR_DAYS_EXCLUDING_WEEKDAYS",
      decisionDays: 10,
      excludedWeekdays: [0],
      timeZone: "America/New_York",
      enactWhenReturnNotPrevented: true,
      failWhenReturnPrevented: true,
    },
    legislatureTermBoundary: {
      legislatureId: US_CONGRESS_LEGISLATURE_ID,
      occursAt: "2027-01-03T12:00:00-05:00",
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
    legalTerms: {
      classification: CLASSIFICATION,
      appropriation: {
        dimensionId: "appropriation_magnitude",
        baseDimensionValue: 7,
        baseAmount: 25_000_000_000,
        amountPerDimensionPoint: 2_500_000_000,
        minimumAmount: 7_500_000_000,
        maximumAmount: 32_500_000_000,
        purpose: "Legal budget authority for the enacted housing initiative; not recognized available finance.",
      },
      policyTerms: [
        {
          id: "recipient-flexibility-class",
          dimensionId: "recipient_flexibility",
          bands: [
            { maximumDimensionValue: 3, value: "TIGHT_FEDERAL_SPECIFICATION" },
            { maximumDimensionValue: 6, value: "BOUNDED_RECIPIENT_DISCRETION" },
            { maximumDimensionValue: 10, value: "EXPANDED_RECIPIENT_DISCRETION" },
          ],
        },
        {
          id: "compliance-burden-class",
          dimensionId: "compliance_burden",
          bands: [
            { maximumDimensionValue: 3, value: "STREAMLINED_CORE_ASSURANCE" },
            { maximumDimensionValue: 6, value: "STANDARD_DOCUMENTED_ASSURANCE" },
            { maximumDimensionValue: 10, value: "ENHANCED_AUDIT_AND_REPORTING" },
          ],
        },
        {
          id: "geographic-distribution-rule",
          dimensionId: "geographic_distribution",
          bands: [
            { maximumDimensionValue: 3, value: "FORMULA_NEUTRAL" },
            { maximumDimensionValue: 6, value: "BALANCED_REGIONAL_ALLOCATION" },
            { maximumDimensionValue: 10, value: "HIGH_NEED_GEOGRAPHIC_PRIORITY" },
          ],
        },
        {
          id: "administrative-capacity-support-rule",
          dimensionId: "administrative_capacity_support",
          bands: [
            { maximumDimensionValue: 3, value: "NO_SEPARATE_CAPACITY_SET_ASIDE" },
            { maximumDimensionValue: 6, value: "LIMITED_TECHNICAL_ASSISTANCE" },
            { maximumDimensionValue: 10, value: "DEDICATED_CAPACITY_SUPPORT" },
          ],
        },
      ],
    },
  },
  decision: {
    organizationBlend: { numerator: 3, denominator: 4 },
    actorVariationRadius: 4,
    reservationDistance: 2.25,
    coordinationPressure: 1,
    commitmentHonorCutoff: 0.45,
    breachCutoff: 0.55,
    extendedDebateThreatCutoff: 0.55,
    tieBreakerYeaCutoff: 0.5,
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

/** Bounded integrated runtime through I6; physical, information, and judicial systems remain unavailable. */
export const US_V0_STRUCTURAL_CONFIGURATION: GovernmentConfiguration<LegislativeRuntimeSeed> = {
  identity: {
    configurationId: "us-v0",
    configurationVersion: "0.6.0-i6",
    scenarioId: "us-v0-2026-08-22",
    scenarioVersion: "0.6.0-i6",
    configurationHash: "f966d5e31ec9523663ccea288621fc67c1f5d048fd9779081ad26fd3e5a04deb",
  },
  capability: "INTEGRATED_PARTIAL_RUNTIME",
  calendar: { kind: "REAL_CALENDAR", epoch: "2026-08-22T00:00:00-04:00" },
  structure: US_V0_I5_STRUCTURE,
  transitions: [],
  runtimeSeed: US_V0_LEGISLATIVE_SEED,
  integratedRuntime: {
    schemaVersion: i4Manifest.schemaVersion,
    artifactBindings: [
      ...i4Manifest.artifactBindings,
      US_V0_I6_ARTIFACT_BINDING,
    ] as readonly RuntimeArtifactBinding[],
    geography: i4Manifest.geography,
    population: i4Manifest.population,
    electoral: i4Manifest.electoral,
    temporal: US_V0_I5_TEMPORAL_CONFIGURATION,
    implementation: US_V0_I6_IMPLEMENTATION_CONFIGURATION,
  },
};

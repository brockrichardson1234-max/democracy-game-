import { describe, expect, it } from "vitest";

import { US_V0_I7_RUNTIME_ARTIFACTS } from "../src/content/us-v0/i7";

describe("I6 authenticated fiscal and administrative seed", () => {
  const seed = US_V0_I7_RUNTIME_ARTIFACTS.programInitialization!;

  it("parses the FY2024 authority and separate OMB control without calling either cash", () => {
    expect(seed.budgetAuthorities).toHaveLength(1);
    expect(seed.budgetAuthorities[0]).toMatchObject({
      sourceLegalId: "us.legal-source.pl-118-42",
      enactedAt: "2024-03-09",
      availableUntil: "2027-09-30T23:59:59-04:00",
      amount: { minorUnits: 125_000_000_000, currency: "USD", scale: 2 },
    });
    expect(seed.fiscalControls[0]).toMatchObject({
      tas: "086-0205",
      approvalAt: "2024-04-05",
      authorityLegalId: "us.legal-source.pl-118-42",
      line6011: { amount: { minorUnits: 125_000_000_000 } },
    });
    expect(seed.fiscalControls[0].id).not.toBe(seed.budgetAuthorities[0].id);
    const legalIds = new Set(seed.legalSources.map((entry) => entry.id));
    expect(legalIds).toEqual(new Set([
      "us.legal-source.pl-118-42",
      "us.legal-source.pl-119-101",
      "us.legal-source.24-cfr-part-92",
      "us.legal-source.91-fr-23014-delay",
    ]));
    expect(seed.program.legalAuthorityRefs.every((id) => legalIds.has(id))).toBe(true);
    expect(seed.legalBaseline.delayedAmendments.every((entry) => entry.status === "NON_OPERATIVE_INDEFINITELY_DELAYED")).toBe(true);
  });

  it("keeps awards, obligations, aggregate outlays, and the Palms expenditure semantically separate", () => {
    expect(seed.awards.map((entry) => [entry.fain, entry.amount.minorUnits])).toEqual([
      ["M24-DC080221", 61_726_807],
      ["M24-MC480502", 111_938_626],
    ]);
    expect(seed.obligations.map((entry) => entry.amount.minorUnits)).toEqual([61_726_807, 111_938_626]);
    expect(seed.payments.map((entry) => entry.amount.minorUnits)).toEqual([6_172_681, 26_852_021]);
    expect(seed.payments.every((entry) => entry.projectRef === null)).toBe(true);
    expect(seed.payments.every((entry) => entry.reconciliation === "NOT_RECONCILED_TO_EXACT_DOWNSTREAM_DOLLAR")).toBe(true);
    expect(seed.recipientExpenditures[0]).toMatchObject({
      date: "2025-09-17",
      fund: "9045",
      department: "24",
      organizationActivity: "48004",
      account: "530005",
      amount: { minorUnits: 11_700_000 },
      federalPaymentId: null,
      physicalHousingEffect: null,
    });
  });

  it("loads bounded relationship coverage and immutable final W-0000102 history", () => {
    expect(seed.relationships).toHaveLength(2);
    expect(seed.relationships[0].members.map((member) => [member.name, member.participation])).toEqual([
      ["Arapahoe County", "LEAD_ENTITY_ACTIVE"],
      ["City of Centennial", "INCLUDED"],
      ["City of Englewood", "INCLUDED"],
      ["City of Littleton", "INCLUDED"],
      ["City of Sheridan", "INCLUDED"],
      ["Town of Deer Trail", "INCLUDED"],
      ["City of Greenwood Village", "EXCLUDED_FOR_NEW_FORMULA_RELATION"],
      ["City of Glendale", "EXCLUDED_FOR_NEW_FORMULA_RELATION"],
    ]);
    expect(seed.waivers[0]).toMatchObject({
      id: "W-0000102",
      effectiveFrom: "2026-08-10",
      status: "FINAL_GRANTED",
      unitReference: 85,
      mutableByPlayer: false,
      physicalHousingEffect: null,
    });
    expect(seed.coverage).toHaveLength(51);
    expect(seed.coverage.filter((entry) => entry.detail === "DETAIL_AVAILABLE").map((entry) => entry.stateFips)).toEqual(["08", "48"]);
    expect(seed.nationalBalance).toBe("NATIONAL_BALANCE_NOT_INSTANTIATED_V0");
  });
});

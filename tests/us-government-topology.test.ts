import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";

import { bootstrapGovernmentConfiguration } from "../src/configuration/bootstrap";
import { canonicalConfigurationContent } from "../src/configuration/canonical";
import {
  assertDeclaredConfigurationHash,
  loadGovernmentConfiguration,
} from "../src/configuration/loader";
import type { GovernmentConfiguration } from "../src/configuration/types";
import { GL0_SYNTHETIC_CONFIGURATION } from "../src/content/gl0-synthetic/configuration";
import districtArtifact from "../src/content/us-v0/artifacts/house-district-identities-119.json";
import senateArtifact from "../src/content/us-v0/artifacts/senate-seat-classes.json";
import stateArtifact from "../src/content/us-v0/artifacts/state-identifiers.json";
import { US_V0_STRUCTURAL_CONFIGURATION } from "../src/content/us-v0/configuration";
import {
  US_DISTRICT_COLORADO_COURT_ID,
  US_EXECUTIVE_INSTITUTION_ID,
  US_HOUSE_CHAMBER_ID,
  US_HUD_INSTITUTION_ID,
  US_INCUMBENT_ADMINISTRATION_ID,
  US_INCUMBENT_PRESIDENT_ACTOR_ID,
  US_INCUMBENT_VICE_PRESIDENT_ACTOR_ID,
  US_NATIONAL_JURISDICTION_ID,
  US_PRESIDENT_OFFICE_ID,
  US_SENATE_CHAMBER_ID,
  US_TENTH_CIRCUIT_COURT_ID,
  US_VICE_PRESIDENT_OFFICE_ID,
} from "../src/content/us-v0/topology";

const sha256 = (value: string): string => createHash("sha256").update(value).digest("hex");
const configurationHash = (configuration: GovernmentConfiguration): string =>
  sha256(canonicalConfigurationContent(configuration));

interface MutableHashTestConfiguration {
  readonly structure: {
    readonly jurisdictions: { label: string }[];
    readonly offices: { label: string }[];
    readonly chambers: { institutionId: string }[];
    readonly staggerGroups: { ordinaryBoundaryAt: string }[];
    readonly assignments: { actorId: string }[];
    readonly relations: { to: { id: string } }[];
  };
}

const usStructure = US_V0_STRUCTURAL_CONFIGURATION.structure;
const stateJurisdictions = usStructure.jurisdictions.filter(
  (jurisdiction) => jurisdiction.kind === "CONSTITUENT_POLITY",
);
const dc = usStructure.jurisdictions.find((jurisdiction) => jurisdiction.kind === "FEDERAL_DISTRICT");
const houseOffices = usStructure.offices.filter((office) => office.chamberId === US_HOUSE_CHAMBER_ID);
const senateOffices = usStructure.offices.filter((office) => office.chamberId === US_SENATE_CHAMBER_ID);
const legislativeOffices = usStructure.offices.filter((office) => office.kind === "LEGISLATIVE_MEMBER");
const legislativeActors = usStructure.actors.filter((actor) => actor.role === "LEGISLATIVE");
const legislativeAssignments = usStructure.assignments.filter((assignment) =>
  legislativeOffices.some((office) => office.id === assignment.officeId),
);

describe("I2 U.S. government topology retained by I3", () => {
  it("loads the unchanged 52-jurisdiction topology without materializing a full world", () => {
    const bootstrap = bootstrapGovernmentConfiguration(US_V0_STRUCTURAL_CONFIGURATION);
    expect(bootstrap.configuration.loaded).toBe(true);
    expect(bootstrap.configuration.identity).toMatchObject({
      configurationId: "us-v0",
      configurationVersion: "0.10.5-calibration",
      scenarioId: "us-v0-2026-08-22",
    });
    expect(usStructure.jurisdictions).toHaveLength(52);
    expect(stateJurisdictions).toHaveLength(50);
    expect(dc).toMatchObject({ id: "us.jurisdiction.dc.11", label: "District of Columbia" });
    expect(usStructure.jurisdictions.filter((record) => record.kind === "NATIONAL")).toEqual([
      expect.objectContaining({ id: US_NATIONAL_JURISDICTION_ID }),
    ]);
    expect(bootstrap.configuration.capability).toBe("INTEGRATED_PARTIAL_RUNTIME");
    expect(bootstrap.configuration.runtimeSeed).not.toBeNull();
    expect(bootstrap.configuration.transitions).toEqual([]);
    expect(bootstrap.playable).toBe(false);
    expect(bootstrap.world).toBeNull();
    expect(bootstrap.legislativeRuntimeAvailable).toBe(true);
    assertDeclaredConfigurationHash(bootstrap.configuration, configurationHash(bootstrap.configuration));
  });

  it("retains official state/DC FIPS, USPS, name, and GNIS identifiers", () => {
    expect(stateArtifact.records).toHaveLength(51);
    for (const source of stateArtifact.records) {
      const expectedId =
        source.stateUsps === "DC"
          ? `us.jurisdiction.dc.${source.stateFips}`
          : `us.jurisdiction.state.${source.stateFips}`;
      const jurisdiction = usStructure.jurisdictions.find((candidate) => candidate.id === expectedId);
      expect(jurisdiction?.label).toBe(source.officialName);
      expect(jurisdiction?.externalIdentifiers).toEqual([
        { scheme: "CENSUS_STATEFP", value: source.stateFips },
        { scheme: "USPS", value: source.stateUsps },
        { scheme: "GNIS", value: source.gnisId },
      ]);
    }
  });

  it("keeps DC role-qualified and out of apportioned legislative offices", () => {
    expect(dc?.kind).toBe("FEDERAL_DISTRICT");
    expect(usStructure.relations.filter((relation) => relation.from.id === dc?.id)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: "FEDERAL_DISTRICT_OF" }),
        expect.objectContaining({ kind: "EQUIVALENT_FOR_STATISTICS" }),
        expect.objectContaining({ kind: "EQUIVALENT_FOR_EXECUTIVE_SELECTION" }),
      ]),
    );
    expect(
      legislativeOffices.filter(
        (office) => office.constituency?.kind === "JURISDICTION" && office.constituency.id === dc?.id,
      ),
    ).toEqual([]);
    expect(usStructure.geographies.filter(
      (geography) => geography.kind === "LEGISLATIVE_CONSTITUENCY",
    ).some((geography) => geography.parentJurisdictionId === dc?.id)).toBe(false);
  });

  it("contains 435 unique voting House offices over the same geometry-deepened 119th districts", () => {
    expect(houseOffices).toHaveLength(435);
    expect(new Set(houseOffices.map((office) => office.id)).size).toBe(435);
    const districtGeographies = usStructure.geographies.filter(
      (geography) => geography.kind === "LEGISLATIVE_CONSTITUENCY",
    );
    expect(districtGeographies).toHaveLength(435);
    expect(new Set(districtGeographies.map((geography) => geography.id)).size).toBe(435);
    expect(districtGeographies.every((geography) => geography.geometryStatus === "GEOMETRY_AVAILABLE")).toBe(true);
    for (const office of houseOffices) {
      expect(office.constituency?.kind).toBe("GEOGRAPHY");
      expect(usStructure.geographies.some((geography) => geography.id === office.constituency?.id)).toBe(
        true,
      );
    }
    const derivedByFips = new Map<string, number>();
    for (const geography of districtGeographies) {
      const fips = geography.externalIdentifiers.find((identifier) => identifier.scheme === "CENSUS_STATEFP")
        ?.value;
      if (fips === undefined) throw new Error("District is missing STATEFP.");
      derivedByFips.set(fips, (derivedByFips.get(fips) ?? 0) + 1);
    }
    expect(
      districtArtifact.apportionment.reduce((total, record) => total + record.votingSeats, 0),
    ).toBe(435);
    for (const expected of districtArtifact.apportionment) {
      expect(derivedByFips.get(expected.stateFips)).toBe(expected.votingSeats);
    }
  });

  it("contains 100 state-qualified Senate offices using the corrected official class cycle", () => {
    expect(senateOffices).toHaveLength(100);
    expect(new Set(senateOffices.map((office) => office.id)).size).toBe(100);
    for (const jurisdiction of stateJurisdictions) {
      const offices = senateOffices.filter(
        (office) => office.constituency?.kind === "JURISDICTION" && office.constituency.id === jurisdiction.id,
      );
      expect(offices).toHaveLength(2);
      expect(new Set(offices.map((office) => office.term.staggerGroupId)).size).toBe(2);
    }
    expect(senateOffices.some((office) => office.constituency?.id === dc?.id)).toBe(false);

    const groups = new Map(usStructure.staggerGroups.map((group) => [group.label, group.ordinaryBoundaryAt]));
    expect(groups.get("Class II")).toBe("2027-01-03T12:00:00-05:00");
    expect(groups.get("Class III")).toBe("2029-01-03T12:00:00-05:00");
    expect(groups.get("Class I")).toBe("2031-01-03T12:00:00-05:00");
    for (const source of senateArtifact.records) {
      const office = senateOffices.find(
        (candidate) => candidate.id === `us.office.senate.${source.stateFips}.class-${source.classLabel.toLowerCase()}`,
      );
      expect(office?.term.ordinaryBoundaryAt).toBe(source.ordinaryBoundaryAt);
    }
  });

  it("keeps 535 legislative offices, actors, and current assignments as separate thin facts", () => {
    expect(legislativeOffices).toHaveLength(535);
    expect(legislativeActors).toHaveLength(535);
    expect(legislativeAssignments).toHaveLength(535);
    expect(new Set(legislativeActors.map((actor) => actor.id)).size).toBe(535);
    expect(new Set(legislativeAssignments.map((assignment) => assignment.id)).size).toBe(535);
    for (const office of legislativeOffices) {
      const assignment = legislativeAssignments.find((candidate) => candidate.officeId === office.id);
      expect(assignment).toBeDefined();
      expect(assignment?.officeId).not.toBe(assignment?.actorId);
      expect(assignment?.id).not.toBe(assignment?.officeId);
      expect(legislativeActors.some((actor) => actor.id === assignment?.actorId)).toBe(true);
    }
    for (const actor of legislativeActors) {
      expect(Object.keys(actor).sort()).toEqual(["classification", "id", "label", "role"]);
      expect(actor.classification).toBe("APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD");
      expect(actor.label).toMatch(/^Anonymous occupant of /);
      expect(actor).not.toHaveProperty("name");
      expect(actor).not.toHaveProperty("party");
      expect(actor).not.toHaveProperty("ideology");
      expect(actor).not.toHaveProperty("decisionCriteria");
    }
  });

  it("separates executive institution, offices, actors, assignments, and administration", () => {
    const presidentOffice = usStructure.offices.find((office) => office.id === US_PRESIDENT_OFFICE_ID);
    const vicePresidentOffice = usStructure.offices.find(
      (office) => office.id === US_VICE_PRESIDENT_OFFICE_ID,
    );
    expect(presidentOffice?.institutionId).toBe(US_EXECUTIVE_INSTITUTION_ID);
    expect(vicePresidentOffice?.institutionId).toBe(US_EXECUTIVE_INSTITUTION_ID);
    expect(US_PRESIDENT_OFFICE_ID).not.toBe(US_INCUMBENT_PRESIDENT_ACTOR_ID);
    expect(US_VICE_PRESIDENT_OFFICE_ID).not.toBe(US_INCUMBENT_VICE_PRESIDENT_ACTOR_ID);
    expect(US_INCUMBENT_PRESIDENT_ACTOR_ID).not.toBe(US_INCUMBENT_VICE_PRESIDENT_ACTOR_ID);
    expect(usStructure.assignments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ officeId: US_PRESIDENT_OFFICE_ID, actorId: US_INCUMBENT_PRESIDENT_ACTOR_ID }),
        expect.objectContaining({ officeId: US_VICE_PRESIDENT_OFFICE_ID, actorId: US_INCUMBENT_VICE_PRESIDENT_ACTOR_ID }),
      ]),
    );
    expect(usStructure.administrations).toEqual([
      expect.objectContaining({
        id: US_INCUMBENT_ADMINISTRATION_ID,
        institutionId: US_EXECUTIVE_INSTITUTION_ID,
        headOfficeId: US_PRESIDENT_OFFICE_ID,
        headActorId: US_INCUMBENT_PRESIDENT_ACTOR_ID,
      }),
    ]);
  });

  it("instantiates HUD, bounded support institutions, and the configured appellate edge only", () => {
    expect(usStructure.institutions.find((institution) => institution.id === US_HUD_INSTITUTION_ID)).toMatchObject({
      kind: "ADMINISTRATIVE_AGENCY",
    });
    for (const id of ["us.institution.omb", "us.institution.census", "us.institution.nara", "us.institution.doj"]) {
      expect(usStructure.institutions.some((institution) => institution.id === id)).toBe(true);
    }
    expect(usStructure.institutions.find((institution) => institution.id === US_DISTRICT_COLORADO_COURT_ID)).toMatchObject({ kind: "COURT" });
    expect(usStructure.institutions.find((institution) => institution.id === US_TENTH_CIRCUIT_COURT_ID)).toMatchObject({ kind: "COURT" });
    expect(usStructure.relations).toContainEqual({
      id: "us.relation.d-colorado-appeals-to-tenth-circuit",
      kind: "APPEALS_TO",
      from: { kind: "INSTITUTION", id: US_DISTRICT_COLORADO_COURT_ID },
      to: { kind: "INSTITUTION", id: US_TENTH_CIRCUIT_COURT_ID },
    });
    expect(JSON.stringify(usStructure)).not.toContain("us.program.home");
  });

  it("verifies committed topology artifact content hashes", () => {
    expect(sha256(JSON.stringify(stateArtifact.records))).toBe(stateArtifact.metadata.contentSha256);
    expect(
      sha256(
        JSON.stringify({
          districts: districtArtifact.districts,
          apportionment: districtArtifact.apportionment,
        }),
      ),
    ).toBe(districtArtifact.metadata.contentSha256);
    expect(sha256(JSON.stringify(senateArtifact.records))).toBe(senateArtifact.metadata.contentSha256);
  });

  it("hashes every consumed topology family", () => {
    const mutations: Array<(configuration: MutableHashTestConfiguration) => void> = [
      (configuration) => {
        configuration.structure.jurisdictions[0].label = "Changed national label";
      },
      (configuration) => {
        configuration.structure.offices[0].label = "Changed office";
      },
      (configuration) => {
        configuration.structure.chambers[0].institutionId = "changed-owner";
      },
      (configuration) => {
        configuration.structure.staggerGroups[0].ordinaryBoundaryAt = "2033-01-03";
      },
      (configuration) => {
        configuration.structure.assignments[0].actorId = "changed-actor";
      },
      (configuration) => {
        const relation = configuration.structure.relations.at(-1);
        if (relation === undefined) throw new Error("Expected a court relation.");
        relation.to.id = "changed-court";
      },
    ];
    for (const mutate of mutations) {
      const changed = JSON.parse(
        JSON.stringify(US_V0_STRUCTURAL_CONFIGURATION),
      ) as MutableHashTestConfiguration;
      mutate(changed);
      expect(configurationHash(changed as unknown as GovernmentConfiguration)).not.toBe(
        US_V0_STRUCTURAL_CONFIGURATION.identity.configurationHash,
      );
    }
  });

  it("rejects broken generic topology references and multiple current assignments", () => {
    const brokenReference = JSON.parse(JSON.stringify(US_V0_STRUCTURAL_CONFIGURATION));
    brokenReference.structure.offices[0].constituency.id = "missing-geography";
    expect(() => loadGovernmentConfiguration(brokenReference)).toThrow(/unresolved GEOGRAPHY reference/);

    const duplicateAssignment = JSON.parse(JSON.stringify(US_V0_STRUCTURAL_CONFIGURATION));
    duplicateAssignment.structure.assignments.push({
      ...duplicateAssignment.structure.assignments[0],
      id: "duplicate-current-assignment",
    });
    expect(() => loadGovernmentConfiguration(duplicateAssignment)).toThrow(/multiple current assignments/);
  });

  it("loads non-U.S. structural variation through the same generic topology validator", () => {
    const synthetic = GL0_SYNTHETIC_CONFIGURATION.structure;
    const oneOfficeConfiguration: GovernmentConfiguration<never> = {
      identity: {
        configurationId: "test-only-one-office",
        configurationVersion: "1",
        scenarioId: "test-only-topology-variation",
        scenarioVersion: "1",
        configurationHash: "0".repeat(64),
      },
      capability: "STRUCTURAL_PROOF_ONLY",
      calendar: { kind: "SYNTHETIC_DAY_NUMBER", epoch: "day-0" },
      structure: {
        provenanceArtifacts: [],
        jurisdictions: synthetic.jurisdictions.slice(0, 1),
        institutions: synthetic.institutions,
        legislatures: synthetic.legislatures,
        chambers: [{ ...synthetic.chambers[0], seatCount: 1 }],
        geographies: [],
        staggerGroups: [],
        offices: synthetic.offices.slice(0, 1),
        actors: synthetic.actors.slice(0, 1),
        assignments: synthetic.assignments.slice(0, 1),
        administrations: [],
        relations: [],
      },
      transitions: [],
      runtimeSeed: null,
    };
    const loaded = loadGovernmentConfiguration(oneOfficeConfiguration);
    expect(loaded.structure.jurisdictions).toHaveLength(1);
    expect(loaded.structure.chambers).toHaveLength(1);
    expect(loaded.structure.offices).toHaveLength(1);
    expect(loadGovernmentConfiguration(GL0_SYNTHETIC_CONFIGURATION).structure.chambers[0].seatCount).toBe(
      11,
    );
    expect(GL0_SYNTHETIC_CONFIGURATION.structure.offices.map((office) => office.id)).toEqual(
      GL0_SYNTHETIC_CONFIGURATION.runtimeSeed?.governance.legislature.seats.map((seat) => seat.id),
    );
    expect(GL0_SYNTHETIC_CONFIGURATION.structure.actors.map((actor) => actor.id)).toEqual(
      GL0_SYNTHETIC_CONFIGURATION.runtimeSeed?.governance.legislature.actors.map((actor) => actor.id),
    );
    expect(loadGovernmentConfiguration(US_V0_STRUCTURAL_CONFIGURATION).structure.chambers).toHaveLength(2);
  });
});

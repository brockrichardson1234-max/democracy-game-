import { describe, expect, it } from "vitest";

import {
  createIntegratedPartialRuntimeSession,
  createIntegratedPartialRuntimeSessionFromSave,
} from "../src/app/integrated-session";
import { canonicalConfigurationContent } from "../src/configuration/canonical";
import { loadGovernmentConfiguration } from "../src/configuration/loader";
import { sha256Hex } from "../src/configuration/sha256";
import type {
  GovernmentConfiguration,
  InstitutionalBoundaryConfiguration,
  LegislativeRuntimeSeed,
} from "../src/configuration/types";
import { US_V0_STRUCTURAL_CONFIGURATION } from "../src/content/us-v0/configuration";
import { US_V0_I8_INFORMATION_CONFIGURATION } from "../src/content/us-v0/i8";
import {
  createUsV0I9RouteConfiguration,
  type UsV0I9RouteOptions,
  US_V0_I9_ADMINISTRATIVE_ACTION,
  US_V0_I9_APPELLATE_RULING,
  US_V0_I9_LEGAL_CONTEST_CONFIGURATION,
  US_V0_I9_RULING,
  US_V0_I9_RUNTIME_ARTIFACTS,
  US_V0_I9_STAY_DECISION,
} from "../src/content/us-v0/i9";

type MutableBoundary = {
  -readonly [Key in keyof InstitutionalBoundaryConfiguration]: InstitutionalBoundaryConfiguration[Key];
};

const REQUIRED_PROCEDURE =
  US_V0_I9_LEGAL_CONTEST_CONFIGURATION.trigger.requiredProcedureRecord;

const identified = (
  value: GovernmentConfiguration<LegislativeRuntimeSeed>,
): GovernmentConfiguration<LegislativeRuntimeSeed> => ({
  ...value,
  identity: {
    ...value.identity,
    configurationHash: sha256Hex(canonicalConfigurationContent(value)),
  },
});

const configurationVariant = (options: UsV0I9RouteOptions) => {
  const route = createUsV0I9RouteConfiguration(options);
  return identified({
    ...structuredClone(US_V0_STRUCTURAL_CONFIGURATION),
    integratedRuntime: {
      ...structuredClone(US_V0_STRUCTURAL_CONFIGURATION.integratedRuntime!),
      temporal: route.temporal,
      legalContest: route.legalContest,
    },
  });
};

const chronologyVariant = (
  mutate: (boundaries: MutableBoundary[]) => void,
): GovernmentConfiguration<LegislativeRuntimeSeed> => {
  const configuration = structuredClone(US_V0_STRUCTURAL_CONFIGURATION);
  const temporal = structuredClone(configuration.integratedRuntime!.temporal!);
  const boundaries = temporal.boundaries as MutableBoundary[];
  mutate(boundaries);
  const temporalWithoutParameterHash = {
    schemaVersion: temporal.schemaVersion,
    scheduleVersion: temporal.scheduleVersion,
    scheduleContentHash: sha256Hex(JSON.stringify(boundaries)),
    assignmentCycleContentHash: temporal.assignmentCycleContentHash,
    selectionContentHash: temporal.selectionContentHash,
    initialTermLabel: temporal.initialTermLabel,
    boundaries,
    assignmentCycles: temporal.assignmentCycles,
    selection: temporal.selection,
    newProcedureIdPrefix: temporal.newProcedureIdPrefix,
    initialAdministration: temporal.initialAdministration,
  };
  const repairedTemporal = {
    ...temporalWithoutParameterHash,
    parameterHash: sha256Hex(JSON.stringify(temporalWithoutParameterHash)),
  };
  return identified({
    ...configuration,
    integratedRuntime: {
      ...configuration.integratedRuntime!,
      temporal: repairedTemporal,
    },
  });
};

const boundaryByKind = (
  boundaries: MutableBoundary[],
  kind: InstitutionalBoundaryConfiguration["kind"],
): MutableBoundary => {
  const boundary = boundaries.find((entry) => entry.kind === kind);
  if (boundary === undefined) throw new Error(`Missing ${kind} test boundary.`);
  return boundary;
};

const createSession = (
  configuration: GovernmentConfiguration<LegislativeRuntimeSeed> = US_V0_STRUCTURAL_CONFIGURATION,
) => createIntegratedPartialRuntimeSession(configuration, US_V0_I9_RUNTIME_ARTIFACTS);

const restore = (
  serialized: string,
  configuration: GovernmentConfiguration<LegislativeRuntimeSeed> = US_V0_STRUCTURAL_CONFIGURATION,
) => createIntegratedPartialRuntimeSessionFromSave(
  serialized,
  configuration,
  US_V0_I9_RUNTIME_ARTIFACTS,
);

const runToNotice = (
  configuration: GovernmentConfiguration<LegislativeRuntimeSeed> = US_V0_STRUCTURAL_CONFIGURATION,
) => {
  const session = createSession(configuration);
  session.issueBoundedRelationshipRejection();
  session.advanceTo(configuration.integratedRuntime!.temporal!.boundaries.find(
    (entry) => entry.kind === "JUDICIAL_NOTICE_RECEIVED",
  )!.at);
  return session;
};

describe("I9-REV-001 integrated respondent-prevails route", () => {
  it("preserves claimant-prevails while validating the bounded determination evidence input", () => {
    const claimant = createSession();
    claimant.issueBoundedRelationshipRejection();
    claimant.advanceTo(US_V0_I9_RULING);
    expect(claimant.getLegalContestAuditState()).toMatchObject({
      rulings: [{ disposition: "CLAIMANT_PREVAILS" }],
      orders: [{ status: "OPERATIVE" }],
    });
    expect(() => createSession().issueBoundedRelationshipRejection([REQUIRED_PROCEDURE, REQUIRED_PROCEDURE]))
      .toThrow(/duplicate/i);
    expect(() => createSession().issueBoundedRelationshipRejection(["UNCONFIGURED_PROCEDURE_RECORD"]))
      .toThrow(/unconfigured/i);
    expect(() => createSession().issueBoundedRelationshipRejection([42] as unknown as readonly string[]))
      .toThrow(/invalid/i);
  });

  it("reaches respondent-prevails through the integrated API with zero orders and ordinary owner action", () => {
    const session = createSession();
    session.issueBoundedRelationshipRejection([REQUIRED_PROCEDURE]);
    const determination = session.getAuditState().implementation!.administrativeProgram
      .relationshipQualificationDeterminations[0];
    expect(determination.procedureRecordIds).toEqual([REQUIRED_PROCEDURE]);
    expect(determination.sourceIntentionId).toMatch(/^us\./);
    session.advanceTo(US_V0_I9_ADMINISTRATIVE_ACTION);
    expect(session.getLegalContestAuditState()).toMatchObject({
      rulings: [{ disposition: "RESPONDENT_PREVAILS" }],
      interpretations: [{
        proposition: "CHALLENGED_REQUALIFICATION_AUTHORITY_VALID_WHEN_CONFIGURED_REQUIRED_PROCEDURE_PRESENT",
      }],
      orders: [],
      notices: [],
    });
    expect(session.getAuditState().implementation!.administrativeProgram.legalConstraints).toEqual([]);
    expect(session.getAuditState().implementation!.administrativeProgram.formulaDispositionResolutions)
      .toMatchObject([{ outcome: "EXECUTED_WITHOUT_CONSTRAINT" }]);
  }, 30_000);

  it("roundtrips before and after respondent ruling and rejects procedure-history tampering", () => {
    const beforeRuling = createSession();
    beforeRuling.issueBoundedRelationshipRejection([REQUIRED_PROCEDURE]);
    const restoredBefore = restore(beforeRuling.save());
    beforeRuling.advanceTo(US_V0_I9_RULING);
    restoredBefore.advanceTo(US_V0_I9_RULING);
    expect(restoredBefore.getAuditState()).toEqual(beforeRuling.getAuditState());

    const restoredAfter = restore(beforeRuling.save());
    expect(restoredAfter.getAuditState()).toEqual(beforeRuling.getAuditState());

    const determinationTamper = JSON.parse(beforeRuling.save());
    determinationTamper.implementation.administrativeProgram
      .relationshipQualificationDeterminations[0].procedureRecordIds = [];
    expect(() => restore(JSON.stringify(determinationTamper))).toThrow();

    const ownerHistoryTamper = JSON.parse(beforeRuling.save());
    ownerHistoryTamper.implementation.ownerResolution.intentions[0].payload.procedureRecordIds = [];
    expect(() => restore(JSON.stringify(ownerHistoryTamper))).toThrow();
  }, 45_000);

  it("makes coarse and repeated next-boundary advancement identical on respondent path", () => {
    const coarse = createSession();
    const fine = createSession();
    coarse.issueBoundedRelationshipRejection([REQUIRED_PROCEDURE]);
    fine.issueBoundedRelationshipRejection([REQUIRED_PROCEDURE]);
    coarse.advanceTo(US_V0_I9_ADMINISTRATIVE_ACTION);
    while (
      fine.getPublicInstitutionalStatus().nextBoundary !== null &&
      Date.parse(fine.getPublicInstitutionalStatus().nextBoundary!.at) <=
        Date.parse(US_V0_I9_ADMINISTRATIVE_ACTION)
    ) fine.advanceToNextBoundary();
    expect(fine.getAuditState()).toEqual(coarse.getAuditState());
  }, 45_000);
});

describe("I9-REV-002 fixed stay-resolution cutoff", () => {
  it("accepts before the boundary, resolves exactly once, and rejects duplicates", () => {
    const session = runToNotice();
    session.respondToJudicialOrder("CONTEST");
    session.requestJudicialStay();
    expect(() => session.requestJudicialStay()).toThrow(/only once/i);
    session.advanceTo(US_V0_I9_STAY_DECISION);
    expect(session.getLegalContestAuditState().stays).toHaveLength(1);
    session.advanceTo(US_V0_I9_APPELLATE_RULING);
    expect(session.getLegalContestAuditState().stays).toHaveLength(1);
  }, 30_000);

  it("rejects a request after the fixed opportunity without recording REQUEST_STAY", () => {
    const session = runToNotice();
    session.respondToJudicialOrder("CONTEST");
    session.advanceTo(US_V0_I9_STAY_DECISION);
    expect(() => session.requestJudicialStay()).toThrow(/unavailable.*fixed canonical resolution/i);
    expect(session.getLegalContestAuditState().actionCommands.filter(
      (entry) => entry.action === "REQUEST_STAY",
    )).toEqual([]);
    expect(session.getLegalContestAuditState().stays).toEqual([]);
    expect(session.getPublicLegalStatus().operativeOrders[0].enforceability).toBe("OPERATIVE");
  }, 30_000);

  it("resolves an accepted request coherently when the appeal resolves first", () => {
    const configuration = configurationVariant({
      stayOutcome: "GRANTED",
      appealAt: "2027-02-20T12:00:00-05:00",
      stayAt: US_V0_I9_STAY_DECISION,
    });
    const session = runToNotice(configuration);
    session.respondToJudicialOrder("CONTEST");
    session.requestJudicialStay();
    session.advanceTo("2027-02-20T12:00:00-05:00");
    expect(session.getLegalContestAuditState().appeals[0].status).toBe("RESOLVED");
    session.advanceTo(US_V0_I9_STAY_DECISION);
    expect(session.getLegalContestAuditState().stays).toMatchObject([{ status: "DENIED" }]);
    expect(session.getPublicLegalStatus().operativeOrders[0].enforceability).toBe("OPERATIVE");
  }, 30_000);

  it("orders same-instant stay before appeal deterministically regardless of declaration order", () => {
    const instant = US_V0_I9_STAY_DECISION;
    const forward = configurationVariant({ stayAt: instant, appealAt: instant, stayOutcome: "GRANTED" });
    const reverse = configurationVariant({
      stayAt: instant,
      appealAt: instant,
      stayOutcome: "GRANTED",
      reverseDeclarationOrder: true,
    });
    const a = runToNotice(forward);
    const b = runToNotice(reverse);
    for (const session of [a, b]) {
      session.respondToJudicialOrder("CONTEST");
      session.requestJudicialStay();
      session.advanceTo(instant);
    }
    expect(a.getAuditState()).toEqual(b.getAuditState());
    expect(a.getLegalContestAuditState()).toMatchObject({
      stays: [{ status: "SUPERSEDED" }],
      appeals: [{ status: "RESOLVED", disposition: "AFFIRMED" }],
    });
    expect(a.getPublicLegalStatus().operativeOrders[0].enforceability).toBe("OPERATIVE");
  }, 45_000);

  it("roundtrips both before request and after an accepted pending request", () => {
    const beforeRequest = runToNotice();
    beforeRequest.respondToJudicialOrder("CONTEST");
    const restoredBefore = restore(beforeRequest.save());
    restoredBefore.requestJudicialStay();
    beforeRequest.requestJudicialStay();
    expect(restoredBefore.getAuditState()).toEqual(beforeRequest.getAuditState());

    const restoredAfter = restore(beforeRequest.save());
    restoredAfter.advanceTo(US_V0_I9_STAY_DECISION);
    beforeRequest.advanceTo(US_V0_I9_STAY_DECISION);
    expect(restoredAfter.getAuditState()).toEqual(beforeRequest.getAuditState());
    expect(restoredAfter.getLegalContestAuditState().stays).toHaveLength(1);
  }, 45_000);
});

describe("I9-REV-003 legal chronology validation", () => {
  it("pins the repaired top-level configuration identity", () => {
    expect(US_V0_STRUCTURAL_CONFIGURATION.identity.configurationHash).toBe(
      sha256Hex(canonicalConfigurationContent(US_V0_STRUCTURAL_CONFIGURATION)),
    );
    expect(US_V0_I9_LEGAL_CONTEST_CONFIGURATION.parameterHash).toBe(
      "cbea2a7d4dc6864cf344daaa0155fea4a3849a57fc4a2761889403ce89710911",
    );
    expect(US_V0_I8_INFORMATION_CONFIGURATION.parameterHash).toBe(
      "8b5fc36a24b1c76043c01173b1ef7fd11a6e0194bb744c99063706cd7496029d",
    );
  });

  const invalidChronologies: readonly [string, (boundaries: MutableBoundary[]) => void][] = [
    ["docket before filing", (boundaries) => {
      boundaryByKind(boundaries, "LEGAL_PROCEEDING_DOCKETED").at = "2027-01-31T12:00:00-05:00";
    }],
    ["interim before docket", (boundaries) => {
      boundaryByKind(boundaries, "INTERIM_RELIEF_REQUESTED").at = "2027-02-01T12:00:00-05:00";
    }],
    ["ruling before interim", (boundaries) => {
      boundaryByKind(boundaries, "JUDICIAL_RULING_ISSUED").at = "2027-02-02T12:00:00-05:00";
    }],
    ["order before ruling", (boundaries) => {
      boundaryByKind(boundaries, "JUDICIAL_ORDER_ISSUED").at = "2027-02-09T12:00:00-05:00";
    }],
    ["effective before issue", (boundaries) => {
      boundaryByKind(boundaries, "JUDICIAL_ORDER_EFFECTIVE").at = "2027-02-09T12:00:00-05:00";
    }],
    ["notice before effective", (boundaries) => {
      boundaryByKind(boundaries, "JUDICIAL_NOTICE_RECEIVED").at = "2027-02-09T12:00:00-05:00";
    }],
    ["deadline before notice", (boundaries) => {
      boundaryByKind(boundaries, "COMPLIANCE_DEADLINE").at = "2027-02-10T12:00:00-05:00";
    }],
    ["stay before earliest opportunity", (boundaries) => {
      boundaryByKind(boundaries, "STAY_RESOLVED").at = "2027-02-10T12:00:00-05:00";
    }],
    ["appeal resolution before earliest opportunity", (boundaries) => {
      boundaryByKind(boundaries, "APPEAL_RESOLVED").at = "2027-02-10T12:00:00-05:00";
    }],
  ];

  it.each(invalidChronologies)("rejects %s with valid recomputed hashes", (_label, mutate) => {
    expect(() => loadGovernmentConfiguration(chronologyVariant(mutate))).toThrow(/chronology|opportunity/i);
  });

  it("accepts same-instant causal phase/order and rejects wrong phase or order", () => {
    const causalKinds: readonly InstitutionalBoundaryConfiguration["kind"][] = [
      "LEGAL_CLAIM_FILED",
      "LEGAL_PROCEEDING_DOCKETED",
      "INTERIM_RELIEF_REQUESTED",
      "JUDICIAL_RULING_ISSUED",
      "JUDICIAL_ORDER_ISSUED",
      "JUDICIAL_ORDER_EFFECTIVE",
      "JUDICIAL_NOTICE_RECEIVED",
    ];
    const valid = chronologyVariant((boundaries) => {
      for (const kind of causalKinds) {
        boundaryByKind(boundaries, kind).at = US_V0_I9_RULING;
      }
    });
    expect(() => loadGovernmentConfiguration(valid)).not.toThrow();

    const wrongOrder = chronologyVariant((boundaries) => {
      for (const kind of causalKinds) boundaryByKind(boundaries, kind).at = US_V0_I9_RULING;
      boundaryByKind(boundaries, "LEGAL_PROCEEDING_DOCKETED").order = -1;
    });
    const wrongPhase = chronologyVariant((boundaries) => {
      for (const kind of causalKinds) boundaryByKind(boundaries, kind).at = US_V0_I9_RULING;
      boundaryByKind(boundaries, "LEGAL_PROCEEDING_DOCKETED").phase = -3_000;
    });
    expect(() => loadGovernmentConfiguration(wrongOrder)).toThrow(/chronology/i);
    expect(() => loadGovernmentConfiguration(wrongPhase)).toThrow(/chronology/i);
  });
});

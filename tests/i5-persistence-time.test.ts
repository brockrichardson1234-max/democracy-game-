import { describe, expect, it } from "vitest";

import {
  createIntegratedPartialRuntimeAuditSession,
  createIntegratedPartialRuntimeSession,
  createIntegratedPartialRuntimeSessionFromSave,
} from "../src/app/integrated-session";
import { US_V0_STRUCTURAL_CONFIGURATION } from "../src/content/us-v0/configuration";
import { canonicalConfigurationContent } from "../src/configuration/canonical";
import { sha256Hex } from "../src/configuration/sha256";
import type { GovernmentConfiguration, LegislativeRuntimeSeed } from "../src/configuration/types";
import { US_V0_I7_RUNTIME_ARTIFACTS } from "../src/content/us-v0/i7";
import {
  US_V0_2027_TERM_BOUNDARY,
  US_V0_2028_ATTESTATION,
  US_V0_2028_DELEGATE_MEETING,
  US_V0_2028_POPULAR_SELECTION,
  US_V0_2029_DECLARATION,
  US_V0_2029_TERM_BOUNDARY,
  US_V0_2029_TRANSFER,
  US_V0_I5_ASSIGNMENT_CYCLE_HASH,
  US_V0_I5_SELECTION_HASH,
  US_V0_I5_TEMPORAL_CONFIGURATION,
  US_V0_PLAYER_TICKET_ID,
} from "../src/content/us-v0/i5";

const createSession = () => createIntegratedPartialRuntimeSession(
  US_V0_STRUCTURAL_CONFIGURATION,
  US_V0_I7_RUNTIME_ARTIFACTS,
);

const restore = (serialized: string) => createIntegratedPartialRuntimeSessionFromSave(
  serialized,
  US_V0_STRUCTURAL_CONFIGURATION,
  US_V0_I7_RUNTIME_ARTIFACTS,
);

const comparable = (session: ReturnType<typeof createSession>) => ({
  state: session.getAuditState(),
  binding: session.getControlBindingAudit(),
  bindingHistory: session.getControlBindingHistoryAudit(),
});

describe("I5 deterministic temporal persistence", () => {
  it.each([
    [US_V0_2027_TERM_BOUNDARY, "2027-01-03T11:59:59-05:00"],
    [US_V0_2028_POPULAR_SELECTION, "2028-11-07T19:59:59-05:00"],
    [US_V0_2028_ATTESTATION, "2028-12-13T11:59:59-05:00"],
    [US_V0_2028_DELEGATE_MEETING, "2028-12-19T11:59:59-05:00"],
    [US_V0_2029_TERM_BOUNDARY, "2029-01-03T11:59:59-05:00"],
    [US_V0_2029_DECLARATION, "2029-01-06T12:59:59-05:00"],
    [US_V0_2029_TRANSFER, "2029-01-20T11:59:59-05:00"],
  ])("matches direct advancement across %s with save/restore immediately before it", (target, before) => {
    const direct = createSession();
    direct.advanceTo(target);
    const interrupted = createSession();
    interrupted.advanceTo(before);
    const resumed = restore(interrupted.save());
    resumed.advanceTo(target);
    expect(comparable(resumed)).toEqual(comparable(direct));
  }, 20_000);

  it("makes one large jump identical to fine-grained advancement through every boundary", () => {
    const coarse = createSession();
    coarse.advanceTo(US_V0_2029_TRANSFER);
    const fine = createSession();
    while (fine.getPublicInstitutionalStatus().nextBoundary !== null) fine.advanceToNextBoundary();
    expect(comparable(fine)).toEqual(comparable(coarse));
    expect(fine.getAuditState().institutional!.occurrences.map((occurrence) => occurrence.boundaryId))
      .toEqual(US_V0_STRUCTURAL_CONFIGURATION.integratedRuntime!.temporal!.boundaries.map((boundary) => boundary.id));
  }, 20_000);

  it("is exact-once after every fixed transition has completed", () => {
    const session = createSession();
    session.advanceTo(US_V0_2029_TRANSFER);
    const completed = comparable(session);
    session.advanceTo("2029-12-31T23:59:59-05:00");
    const later = comparable(session);
    expect(later.state.institutional!.occurrences).toEqual(completed.state.institutional!.occurrences);
    expect(later.state.institutional!.termCycles).toEqual(completed.state.institutional!.termCycles);
    expect(later.state.institutional!.selection).toEqual(completed.state.institutional!.selection);
    expect(later.state.legislative.activeAssignments).toEqual(completed.state.legislative.activeAssignments);
    expect(later.binding).toEqual(completed.binding);
    expect(later.bindingHistory).toEqual(completed.bindingHistory);
  });

  it("rejects tampered processed-boundary and dynamic result conservation state", () => {
    const session = createSession();
    session.advanceTo(US_V0_2028_POPULAR_SELECTION);
    const processed = JSON.parse(session.save()) as {
      institutional: {
        calendar: { processedBoundaryIds: string[] };
        selection: { popularResults: Array<{ totalParticipatingWeight: number }> };
      };
    };
    processed.institutional.calendar.processedBoundaryIds.pop();
    expect(() => restore(JSON.stringify(processed))).toThrow(/processed-boundary identity/i);

    const result = JSON.parse(session.save()) as typeof processed;
    result.institutional.selection.popularResults[0].totalParticipatingWeight += 1;
    expect(() => restore(JSON.stringify(result))).toThrow(/ballot conservation/i);
  });

  it("round-trips a player-aligned transfer with the new binding and ended-binding history", () => {
    const resolutions = US_V0_I7_RUNTIME_ARTIFACTS.populationCohorts.cohorts.map((cohort) => ({
      cohortId: cohort.id,
      candidatePreference: US_V0_PLAYER_TICKET_ID,
      turnoutDisposition: "HIGH",
      classification: "APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD",
      causeKey: "i5-player-persistence",
    }));
    const session = createIntegratedPartialRuntimeAuditSession(
      US_V0_STRUCTURAL_CONFIGURATION,
      US_V0_I7_RUNTIME_ARTIFACTS,
      resolutions,
    );
    session.advanceTo(US_V0_2029_TRANSFER);
    const restored = restore(session.save());
    expect(comparable(restored)).toEqual(comparable(session));
    expect(restored.getControlBindingAudit().status).toBe("ACTIVE");
    expect(restored.getControlBindingHistoryAudit()).toHaveLength(1);
  });

  it("pins schedule/scaffold behavior in the configuration identity", () => {
    const temporal = US_V0_STRUCTURAL_CONFIGURATION.integratedRuntime!.temporal!;
    for (const acceptedBoundary of US_V0_I5_TEMPORAL_CONFIGURATION.boundaries) {
      expect(temporal.boundaries.find((boundary) => boundary.id === acceptedBoundary.id)).toEqual(acceptedBoundary);
    }
    expect(temporal.assignmentCycleContentHash).toBe(US_V0_I5_ASSIGNMENT_CYCLE_HASH);
    expect(temporal.selectionContentHash).toBe(US_V0_I5_SELECTION_HASH);
    expect(US_V0_STRUCTURAL_CONFIGURATION.identity).toMatchObject({
      configurationVersion: "0.8.0-i8-reconciled",
      scenarioVersion: "0.8.0-i8-reconciled",
      configurationHash: "215230ab26fa4fa1fc80d2778cfe7ada2f9fc8582894cc917d1ab8b8ec51cf54",
    });
  });

  it("rejects restoration under a changed calendar ordering identity", () => {
    const session = createSession();
    const changed = JSON.parse(JSON.stringify(US_V0_STRUCTURAL_CONFIGURATION)) as GovernmentConfiguration<LegislativeRuntimeSeed>;
    const temporal = changed.integratedRuntime!.temporal!;
    const altered = {
      ...changed,
      integratedRuntime: {
        ...changed.integratedRuntime!,
        temporal: {
          ...temporal,
          boundaries: temporal.boundaries.map((boundary, index) =>
            index === 0 ? { ...boundary, phase: boundary.phase + 1 } : boundary),
        },
      },
    };
    const reidentified = {
      ...altered,
      identity: {
        ...altered.identity,
        configurationHash: sha256Hex(canonicalConfigurationContent(altered)),
      },
    };
    expect(() => createIntegratedPartialRuntimeSessionFromSave(
      session.save(),
      reidentified,
      US_V0_I7_RUNTIME_ARTIFACTS,
    )).toThrow(/Configuration mismatch/i);
  });
});

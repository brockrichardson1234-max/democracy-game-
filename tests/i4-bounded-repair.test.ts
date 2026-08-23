import { describe, expect, it } from "vitest";

import {
  createIntegratedPartialRuntimeSession,
  createIntegratedPartialRuntimeSessionFromSave,
} from "../src/app/integrated-session";
import { US_DELIVERY_COALITION_ID, US_V0_STRUCTURAL_CONFIGURATION } from "../src/content/us-v0/configuration";
import { US_V0_I4_RUNTIME_ARTIFACTS } from "../src/content/us-v0/i4";

interface MutableIntegratedSave {
  population: {
    controls: Array<{ id: string; representedWeight: number }>;
    cohorts: Array<{
      id: string;
      stateControlId: string;
      representedWeight: number;
      eligibilityProjection: { projectionId: string; allocatedWeight: number };
    }>;
    eligibilityProxies: Array<{ id: string; representedWeight: number }>;
    scaffoldVersion: string;
    refinementSemanticVersion: string;
  };
  electoralTopology: {
    allocations: Array<{
      stateUsps: string;
      totalElectors: number;
      units: Array<{ electorCount: number }>;
    }>;
  };
}

const createSession = () => createIntegratedPartialRuntimeSession(
  US_V0_STRUCTURAL_CONFIGURATION,
  US_V0_I4_RUNTIME_ARTIFACTS,
);

const mutableSave = (): MutableIntegratedSave =>
  JSON.parse(createSession().save()) as MutableIntegratedSave;

const restore = (save: MutableIntegratedSave) => createIntegratedPartialRuntimeSessionFromSave(
  JSON.stringify(save),
  US_V0_STRUCTURAL_CONFIGURATION,
  US_V0_I4_RUNTIME_ARTIFACTS,
);

describe("I4 bounded repair persistence and composition", () => {
  it("REV-002 rejects resident-control tampering even when cohorts conserve the mutation", () => {
    const save = mutableSave();
    const control = save.population.controls.find((candidate) => candidate.id.endsWith(".06"))!;
    const cohort = save.population.cohorts.find((candidate) => candidate.stateControlId === control.id)!;
    control.representedWeight += 1;
    cohort.representedWeight += 1;
    expect(() => restore(save)).toThrow(/resident controls.*pinned artifact authority/i);
  });

  it("REV-002 rejects CVAP proxy tampering even when cohort allocations conserve the mutation", () => {
    const save = mutableSave();
    const proxy = save.population.eligibilityProxies[0];
    const cohort = save.population.cohorts.find(
      (candidate) => candidate.eligibilityProjection.projectionId === proxy.id,
    )!;
    proxy.representedWeight += 1;
    cohort.eligibilityProjection.allocatedWeight += 1;
    expect(() => restore(save)).toThrow(/eligibility proxy controls.*pinned artifact authority/i);
  });

  it("REV-002 rejects save-authored scaffold and refinement laws", () => {
    const scaffold = mutableSave();
    scaffold.population.scaffoldVersion = "tampered-scaffold";
    expect(() => restore(scaffold)).toThrow(/scaffold version.*pinned artifact authority/i);

    const refinement = mutableSave();
    refinement.population.refinementSemanticVersion = "tampered-refinement";
    expect(() => restore(refinement)).toThrow(/refinement semantic version.*pinned artifact authority/i);
  });

  it("REV-002 rejects compensated state-elector redistribution", () => {
    const save = mutableSave();
    const california = save.electoralTopology.allocations.find((candidate) => candidate.stateUsps === "CA")!;
    const texas = save.electoralTopology.allocations.find((candidate) => candidate.stateUsps === "TX")!;
    california.totalElectors -= 1;
    california.units[0].electorCount -= 1;
    texas.totalElectors += 1;
    texas.units[0].electorCount += 1;
    expect(() => restore(save)).toThrow(/electoral topology.*pinned artifact authority/i);
  });

  it("REV-002 preserves lawful refinement and merge persistence", () => {
    const session = createSession();
    const parent = session.getAuditState().population.cohorts[0];
    session.refinePopulation({ parentCohortId: parent.id, targetedWeight: 17, causeKey: "repair-round-trip" });
    const children = session.getAuditState().population.cohorts.filter(
      (cohort) => cohort.lineage.parentCohortId === parent.id,
    );
    session.mergePopulation(children.map((cohort) => cohort.id), "repair-round-trip-merge");
    const restored = createIntegratedPartialRuntimeSessionFromSave(
      session.save(),
      US_V0_STRUCTURAL_CONFIGURATION,
      US_V0_I4_RUNTIME_ARTIFACTS,
    );
    expect(restored.getAuditState()).toEqual(session.getAuditState());
  });

  it("REV-003 evolves I3 and I4 through one canonical integrated session", () => {
    const session = createSession();
    expect(session.getAuditState().legislative.procedure.stage).toBe("DRAFT_AGENDA");
    session.beginSponsorSearch();
    expect(session.getAuditState().legislative.procedure.stage).toBe("SPONSOR_SOUGHT");

    const parent = session.getAuditState().population.cohorts[0];
    session.refinePopulation({
      parentCohortId: parent.id,
      targetedWeight: 19,
      causeKey: "integrated-i3-i4-proof",
      association: { kind: "INFORMATION", referenceId: "test.integrated.receipt" },
    });
    const refinedIds = session.getAuditState().population.cohorts
      .filter((cohort) => cohort.lineage.parentCohortId === parent.id)
      .map((cohort) => cohort.id)
      .sort();

    const restored = createIntegratedPartialRuntimeSessionFromSave(
      session.save(),
      US_V0_STRUCTURAL_CONFIGURATION,
      US_V0_I4_RUNTIME_ARTIFACTS,
    );
    expect(restored.getAuditState().legislative.procedure.stage).toBe("SPONSOR_SOUGHT");
    expect(restored.getAuditState().population.cohorts
      .filter((cohort) => cohort.lineage.parentCohortId === parent.id)
      .map((cohort) => cohort.id)
      .sort()).toEqual(refinedIds);
    expect(restored.getControlBindingAudit().status).toBe("ACTIVE");

    restored.negotiateWithOrganization(US_DELIVERY_COALITION_ID);
    expect(restored.getAuditState().legislative.political.organizations.find(
      (organization) => organization.id === US_DELIVERY_COALITION_ID,
    )?.negotiationPosture).not.toBe("UNCONTACTED");
  });
});

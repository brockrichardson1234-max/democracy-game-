import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { advanceUntilAttention, classifyOpeningAttention } from "../src/app/opening-usability";
import { createProductionGameSession } from "../src/app/production-session";

describe("Stage 1 opening usability proof", () => {
  it("boots from the accepted production path with a player-readable briefing", () => {
    const view = createProductionGameSession().getProductionGameView();

    expect(view.identity.configurationVersion).toBe("0.10.1-i10-repair");
    expect(view.briefing).toMatchObject({
      role: "Federal executive administration",
      term: "119th Congress",
    });
    expect(view.briefing.situation).toMatch(/housing/i);
    expect(view.briefing.institutionalBoundary).toMatch(/Congress.*own decisions/i);
  });

  it("classifies the fixed opening operations as background rather than player decisions", () => {
    const view = createProductionGameSession().getProductionGameView();
    const attention = classifyOpeningAttention(view);

    expect(view.availablePlayerActions.map((action) => action.id)).toEqual(["agenda:balanced-delivery"]);
    expect(attention).toMatchObject({
      classification: "INFORMATIONAL_BACKGROUND",
      count: 0,
      actions: [],
    });
  });

  it("uses production commands to collapse routine work and stops at sponsor selection", () => {
    const session = createProductionGameSession();
    const startedAt = session.getProductionGameView().currentInstant;
    const result = advanceUntilAttention(session);

    expect(result.routineActionsProcessed).toEqual([
      "Set a balanced delivery agenda",
      "Begin sponsor search",
    ]);
    expect(result.worldStepsProcessed).toBe(0);
    expect(result.view.currentInstant).toBe(startedAt);
    expect(result.attention).toMatchObject({
      classification: "DECISION_REQUIRED",
      count: 1,
    });
    expect(result.attention.actions).not.toHaveLength(0);
    expect(result.attention.actions.every((action) => action.id.startsWith("legislature:seek-sponsor:"))).toBe(true);
    expect(result.attention.actions.every((action) => /^Approach the Representative for /.test(action.label))).toBe(true);
    expect(result.attention.actions.map((action) => action.label).join(" ")).not.toMatch(/District 0\d/);
    expect(result.attention.actions.map((action) => `${action.label} ${action.description}`).join(" ")).not.toMatch(
      /us\.actor|us\.assignment|scaffold/i,
    );
  });

  it("resolves the first meaningful choice through the active production control surface", () => {
    const session = createProductionGameSession();
    const result = advanceUntilAttention(session);
    const choice = result.attention.actions[0];

    expect(result.view.administration.controlActive).toBe(true);
    expect(result.view.availablePlayerActions.some((action) => action.id === choice.id)).toBe(true);
    const after = session.dispatchPlayerCommand(choice.id);
    expect(after.agenda.sponsorship.status).not.toBe("REQUESTED");
    if (after.agenda.sponsorship.status === "ACCEPTED") {
      expect(after.agenda.sponsorship.sponsorLabel).toMatch(/^Representative for /);
    }
  });

  it("preserves deterministic saves across collapsed opening progression", () => {
    const first = createProductionGameSession();
    const initialSave = first.save();
    const firstResult = advanceUntilAttention(first);

    const second = createProductionGameSession(initialSave);
    const secondResult = advanceUntilAttention(second);
    expect(secondResult.view).toEqual(firstResult.view);
    expect(second.save()).toBe(first.save());
    expect(createProductionGameSession(first.save()).getProductionGameView()).toEqual(firstResult.view);
  });

  it("keeps the helper on canonical production APIs and the UI within Stage 1", () => {
    const helper = fs.readFileSync(path.resolve("src/app/opening-usability.ts"), "utf8");
    const app = fs.readFileSync(path.resolve("src/ui/App.tsx"), "utf8");

    expect(helper).toContain("dispatchPlayerCommand");
    expect(helper).toContain("advanceProductionWorld");
    expect(helper).not.toMatch(/advanceTo|getAuditState|getControlBindingAudit|inject[A-Z]/);
    expect(app).not.toMatch(/view\.administration\.(?:id|headActorId|deputyActorId)/);
    expect(app).not.toMatch(/Delivery & Places|Public & Election|BABA|waiver/i);
    expect(app).toContain("Advance until attention");
    expect(app).toContain("Since your last meaningful decision");
  });
});

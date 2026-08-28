import type { ProductionGameView, ProductionPlayerAction } from "./production-contract";
import type { ProductionGameSession } from "./production-session";

export type AttentionClass =
  | "DECISION_REQUIRED"
  | "STRATEGIC_OPPORTUNITY"
  | "IMPORTANT_DEVELOPMENT"
  | "INFORMATIONAL_BACKGROUND";

export interface OpeningAttention {
  readonly classification: AttentionClass;
  readonly title: string;
  readonly actions: readonly ProductionPlayerAction[];
  readonly count: number;
}

export interface AdvanceUntilAttentionResult {
  readonly view: ProductionGameView;
  readonly attention: OpeningAttention;
  readonly routineActionsProcessed: readonly string[];
  readonly worldStepsProcessed: number;
  readonly stateChanged: boolean;
  readonly summary: string;
}

const ROUTINE_OPENING_ACTIONS = new Set([
  "agenda:balanced-delivery",
  "legislature:begin-sponsor-search",
]);

const isSponsorChoice = (action: ProductionPlayerAction): boolean =>
  action.id.startsWith("legislature:seek-sponsor:");

export const classifyOpeningAttention = (view: ProductionGameView): OpeningAttention => {
  const substantiveActions = view.availablePlayerActions.filter(
    (action) => !ROUTINE_OPENING_ACTIONS.has(action.id),
  );
  const sponsorChoices = substantiveActions.filter(isSponsorChoice);
  if (sponsorChoices.length > 0) {
    return {
      classification: "DECISION_REQUIRED",
      title: "Choose whom the administration should approach for sponsorship",
      actions: sponsorChoices,
      count: 1,
    };
  }
  const opportunities = substantiveActions.filter((action) =>
    action.id.startsWith("legislature:request-coordination:"),
  );
  if (opportunities.length > 0) {
    return {
      classification: "STRATEGIC_OPPORTUNITY",
      title: "Congressional outreach is available before proceedings continue",
      actions: opportunities,
      count: 1,
    };
  }
  if (substantiveActions.length > 0) {
    return {
      classification: "DECISION_REQUIRED",
      title: "The administration must decide how to proceed",
      actions: substantiveActions,
      count: substantiveActions.length,
    };
  }
  return {
    classification: "INFORMATIONAL_BACKGROUND",
    title: "No administration decision is required now",
    actions: [],
    count: 0,
  };
};

const meaningfulDevelopment = (
  before: ProductionGameView,
  after: ProductionGameView,
): boolean => before.agenda.stage !== after.agenda.stage ||
  before.agenda.sponsorship.status !== after.agenda.sponsorship.status ||
  before.legal.filedClaimCount !== after.legal.filedClaimCount ||
  before.legal.publicRulings.length !== after.legal.publicRulings.length ||
  before.election.stage !== after.election.stage;

/**
 * Runs only production-operable commands and canonical world advancement. It
 * consumes the two fixed opening operations, then stops before the first real
 * administration choice or an important autonomous development.
 */
export const advanceUntilAttention = (
  session: ProductionGameSession,
  maximumSteps = 64,
): AdvanceUntilAttentionResult => {
  const routineActionsProcessed: string[] = [];
  let worldStepsProcessed = 0;
  const initialSave = session.save();

  for (let step = 0; step < maximumSteps; step += 1) {
    const before = session.getProductionGameView();
    const attention = classifyOpeningAttention(before);
    if (attention.count > 0) {
      return {
        view: before,
        attention,
        routineActionsProcessed,
        worldStepsProcessed,
        stateChanged: session.save() !== initialSave,
        summary: routineActionsProcessed.length > 0
          ? "Routine opening work is complete. A decision now requires the administration."
          : "A decision requires the administration.",
      };
    }

    const routine = before.availablePlayerActions.find((action) =>
      ROUTINE_OPENING_ACTIONS.has(action.id),
    );
    if (routine !== undefined) {
      session.dispatchPlayerCommand(routine.id);
      routineActionsProcessed.push(routine.label);
      continue;
    }

    const beforeSave = session.save();
    const after = session.advanceProductionWorld();
    const changed = session.save() !== beforeSave;
    if (!changed) {
      return {
        view: after,
        attention: classifyOpeningAttention(after),
        routineActionsProcessed,
        worldStepsProcessed,
        stateChanged: session.save() !== initialSave,
        summary: "No later production event is currently reachable.",
      };
    }
    worldStepsProcessed += 1;
    const afterAttention = classifyOpeningAttention(after);
    if (afterAttention.count > 0 || meaningfulDevelopment(before, after)) {
      return {
        view: after,
        attention: afterAttention.count > 0 ? afterAttention : {
          classification: "IMPORTANT_DEVELOPMENT",
          title: "The governing situation changed",
          actions: [],
          count: 0,
        },
        routineActionsProcessed,
        worldStepsProcessed,
        stateChanged: true,
        summary: afterAttention.count > 0
          ? "World activity continued until the administration's attention was required."
          : "World activity paused after an important development.",
      };
    }
  }

  throw new Error(`Advance until attention exceeded its ${maximumSteps}-step safety limit.`);
};

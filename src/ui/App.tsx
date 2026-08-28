import { useRef, useState } from "react";

import {
  advanceUntilAttention,
  classifyOpeningAttention,
  type AdvanceUntilAttentionResult,
} from "../app/opening-usability";
import { createProductionGameSession, type ProductionGameSession } from "../app/production-session";
import type { ProductionGameView, ProductionPlayerAction } from "../app/production-contract";

const SAVE_KEY = "democracy-game.us-v0.production-save";

interface DecisionReceipt {
  readonly title: string;
  readonly choice: string;
  readonly canonicalResult: string;
  readonly remainsUnresolved: string;
}

const formatDate = (instant: string): string => new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "America/New_York",
}).format(new Date(instant));

const attentionLabel = (classification: ReturnType<typeof classifyOpeningAttention>["classification"]): string => {
  if (classification === "DECISION_REQUIRED") return "Decision required";
  if (classification === "STRATEGIC_OPPORTUNITY") return "Strategic opportunity";
  if (classification === "IMPORTANT_DEVELOPMENT") return "Important development";
  return "Informational / background";
};

export const App = () => {
  const sessionRef = useRef<ProductionGameSession | null>(null);
  const getSession = (): ProductionGameSession => {
    sessionRef.current ??= createProductionGameSession();
    return sessionRef.current;
  };
  const [view, setView] = useState<ProductionGameView>(() => getSession().getProductionGameView());
  const [notice, setNotice] = useState("A new administration term has begun.");
  const [receipt, setReceipt] = useState<DecisionReceipt | null>(null);
  const [lastAdvance, setLastAdvance] = useState<AdvanceUntilAttentionResult | null>(null);
  const attention = classifyOpeningAttention(view);

  const newGame = (): void => {
    sessionRef.current = createProductionGameSession();
    setView(sessionRef.current.getProductionGameView());
    setReceipt(null);
    setLastAdvance(null);
    setNotice("A new administration term has begun.");
  };
  const saveGame = (): void => {
    localStorage.setItem(SAVE_KEY, getSession().save());
    setNotice("Game saved in this browser.");
  };
  const loadGame = (): void => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved === null) {
      setNotice("No saved game exists in this browser.");
      return;
    }
    try {
      sessionRef.current = createProductionGameSession(saved);
      setView(sessionRef.current.getProductionGameView());
      setReceipt(null);
      setLastAdvance(null);
      setNotice("Saved game restored.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "The saved game could not be restored.");
    }
  };

  const advance = (): void => {
    try {
      const result = advanceUntilAttention(getSession());
      setView(result.view);
      setLastAdvance(result);
      setNotice(result.summary);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "The world could not advance.");
    }
  };

  const chooseSponsor = (action: ProductionPlayerAction): void => {
    try {
      const next = getSession().dispatchPlayerCommand(action.id);
      const accepted = next.agenda.sponsorship.status === "ACCEPTED";
      setView(next);
      setLastAdvance(null);
      setReceipt({
        title: accepted ? "Sponsorship request accepted" : "Sponsorship request declined",
        choice: `The administration approached the ${action.label.replace("Approach the ", "")}.`,
        canonicalResult: accepted
          ? `${next.agenda.sponsorship.sponsorLabel ?? "The member"} agreed to sponsor the proposal.`
          : "The member declined the sponsorship request; the search remains open.",
        remainsUnresolved: accepted
          ? "The sponsor still controls formal introduction, and Congress independently controls consideration, amendment, and voting."
          : "The administration may approach another available member. No legislator can be compelled to sponsor the proposal.",
      });
      setNotice(accepted
        ? "The sponsorship request was accepted. Congressional action remains independent."
        : "The sponsorship request was declined. The administration still needs a sponsor.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "The decision could not be submitted.");
    }
  };

  return (
    <main className="game-shell">
      <header className="role-shell">
        <div>
          <p className="eyebrow">U.S. Governing Simulation · You lead the</p>
          <h1>{view.briefing.role}</h1>
          <p className="role-boundary">{view.briefing.institutionalBoundary}</p>
        </div>
        <div className="term-status" aria-label="Current term and control">
          <div><span>Date</span><strong>{formatDate(view.currentInstant)}</strong></div>
          <div><span>Term</span><strong>{view.briefing.term}</strong></div>
          <div><span>Control</span><strong>{view.administration.controlActive ? "Administration active" : "Term ended"}</strong></div>
          {attention.count > 0 && <div className="attention-count"><span>Attention</span><strong>{attention.count}</strong></div>}
        </div>
        <details className="session-menu">
          <summary>Session</summary>
          <div className="session-actions" aria-label="Game persistence">
            <button type="button" className="secondary" onClick={saveGame}>Save</button>
            <button type="button" className="secondary" onClick={loadGame}>Load</button>
            <button type="button" className="secondary" onClick={newGame}>New game</button>
          </div>
        </details>
      </header>

      <p className="notice" role="status">{notice}</p>

      <article className="briefing" aria-labelledby="briefing-title">
        <header className="briefing-header">
          <p className="eyebrow">Briefing</p>
          <h2 id="briefing-title">The housing agenda needs a path through Congress</h2>
        </header>

        <section className="briefing-section situation">
          <p className="section-label">Current governing situation</p>
          <p className="lead">{view.briefing.situation}</p>
          <p>{view.briefing.currentStatus}</p>
        </section>

        <section className={`briefing-section attention ${attention.classification.toLowerCase()}`}>
          <div className="section-heading">
            <div>
              <p className="section-label">Requires your attention</p>
              <h3>{attention.title}</h3>
            </div>
            <span className="attention-tag">{attentionLabel(attention.classification)}</span>
          </div>

          {attention.classification === "DECISION_REQUIRED" && attention.actions.some((action) =>
            action.id.startsWith("legislature:seek-sponsor:"),
          ) ? (
            <div className="decision-detail">
              <div className="decision-context">
                <div><h4>What happened</h4><p>Staff completed the routine opening work. The housing proposal now needs a member of the House to sponsor it.</p></div>
                <div><h4>Why it matters</h4><p>The administration cannot introduce or pass legislation by commanding Congress. Without a sponsor, the proposal cannot enter congressional proceedings.</p></div>
                <div><h4>What you control</h4><p>You may choose which available member the administration approaches.</p></div>
                <div><h4>What remains independent</h4><p>The member accepts or declines. Congress later controls consideration, amendments, and votes.</p></div>
              </div>
              <div className="decision-options">
                <h4>Available approaches</h4>
                {attention.actions.map((action) => (
                  <button key={action.id} type="button" onClick={() => chooseSponsor(action)}>
                    <strong>{action.label}</strong>
                    <span>{action.description}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p>{attention.count === 0
              ? "Nothing requires an administration decision right now. Routine staff work and independent institutional activity can continue."
              : "Review the available administration choices before allowing events to continue."}</p>
          )}
        </section>

        {receipt !== null && (
          <section className="briefing-section receipt" aria-labelledby="receipt-title">
            <p className="section-label">Since your last meaningful decision</p>
            <h3 id="receipt-title">{receipt.title}</h3>
            <dl>
              <div><dt>Your choice</dt><dd>{receipt.choice}</dd></div>
              <div><dt>Immediate result</dt><dd>{receipt.canonicalResult}</dd></div>
              <div><dt>Still unresolved</dt><dd>{receipt.remainsUnresolved}</dd></div>
            </dl>
          </section>
        )}

        <section className="briefing-section effort">
          <p className="section-label">Current governing effort</p>
          <h3>{view.agenda.title}</h3>
          <p>{view.briefing.objective}</p>
          <details>
            <summary>Details</summary>
            <dl className="technical-details">
              <div><dt>Proposal stage</dt><dd>{view.agenda.stage.replaceAll("_", " ").toLowerCase()}</dd></div>
              <div><dt>Proposal version</dt><dd>{view.agenda.version}</dd></div>
              <div><dt>Sponsorship status</dt><dd>{view.agenda.sponsorship.status.toLowerCase()}</dd></div>
              <div><dt>Canonical proposal record</dt><dd>{view.agenda.proposalId}</dd></div>
            </dl>
          </details>
        </section>

        <section className="briefing-section horizon">
          <p className="section-label">On the horizon</p>
          {view.briefing.horizon === null
            ? <p>No later institutional milestone is currently known to the administration.</p>
            : <p><strong>{view.briefing.horizon.label}</strong> is scheduled for {formatDate(view.briefing.horizon.at)}. Other meaningful developments may arise first.</p>}
        </section>

        {attention.count === 0 && view.administration.controlActive && (
          <footer className="advance-area">
            <button type="button" className="advance" onClick={advance}>Advance until attention</button>
            <p>Routine administration and autonomous institutions continue until a decision, opportunity, or important development needs review.</p>
            {lastAdvance !== null && lastAdvance.routineActionsProcessed.length > 0 && (
              <details>
                <summary>Routine work completed</summary>
                <ul>{lastAdvance.routineActionsProcessed.map((item) => <li key={item}>{item}</li>)}</ul>
              </details>
            )}
          </footer>
        )}
      </article>
    </main>
  );
};

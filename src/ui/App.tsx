import { useRef, useState } from "react";

import { createProductionGameSession, type ProductionGameSession } from "../app/production-session";
import type { ProductionGameView } from "../app/production-contract";

const SAVE_KEY = "democracy-game.us-v0.production-save";

export const App = () => {
  const sessionRef = useRef<ProductionGameSession | null>(null);
  const getSession = (): ProductionGameSession => {
    sessionRef.current ??= createProductionGameSession();
    return sessionRef.current;
  };
  const [view, setView] = useState<ProductionGameView>(() => getSession().getProductionGameView());
  const [notice, setNotice] = useState("Accepted U.S. simulation started.");
  const run = (operation: () => ProductionGameView, success: string): void => {
    try { setView(operation()); setNotice(success); }
    catch (error) { setNotice(error instanceof Error ? error.message : "The game command failed."); }
  };
  const newGame = (): void => {
    sessionRef.current = createProductionGameSession();
    setView(sessionRef.current.getProductionGameView());
    setNotice("New accepted U.S. simulation started.");
  };
  const saveGame = (): void => {
    localStorage.setItem(SAVE_KEY, getSession().save());
    setNotice("Game saved in this browser.");
  };
  const loadGame = (): void => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved === null) { setNotice("No saved production game exists in this browser."); return; }
    try {
      sessionRef.current = createProductionGameSession(saved);
      setView(sessionRef.current.getProductionGameView());
      setNotice("Saved production game restored.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "The saved game could not be restored."); }
  };

  return (
    <main className="game-shell">
      <header className="game-header">
        <div><p className="eyebrow">U.S. Governing Simulation</p><h1>{view.agenda.title}</h1>
          <p className="identity">{view.identity.scenarioVersion} · {view.projectionVersion}</p></div>
        <div className="save-controls" aria-label="Game persistence">
          <button type="button" className="secondary" onClick={newGame}>New game</button>
          <button type="button" className="secondary" onClick={saveGame}>Save</button>
          <button type="button" className="secondary" onClick={loadGame}>Load</button>
        </div>
      </header>
      <p className="notice" role="status">{notice}</p>
      <section className="status-strip" aria-label="Current game status">
        <div><span>Date</span><strong>{new Date(view.currentInstant).toLocaleDateString()}</strong></div>
        <div><span>Administration</span><strong>{view.administration.id}</strong></div>
        <div><span>Officeholder</span><strong>{view.administration.headActorId}</strong></div>
        <div><span>Control</span><strong>{view.administration.controlActive ? "Active" : "Ended"}</strong></div>
      </section>
      <div className="game-grid">
        <section className="panel actions-panel">
          <p className="eyebrow">Controlled decisions</p><h2>Available actions</h2>
          {!view.administration.controlActive && <p>{view.administration.controlMessage}</p>}
          {view.availablePlayerActions.length === 0 && view.administration.controlActive &&
            <p>No administration decision is pending. Advance to the next owner or institutional event.</p>}
          <div className="action-list">
            {view.availablePlayerActions.map((action) => <button key={action.id} type="button" onClick={() => run(
              () => getSession().dispatchPlayerCommand(action.id), `${action.label} submitted.`,
            )}><strong>{action.label}</strong><span>{action.description}</span></button>)}
          </div>
          <button type="button" className="advance" disabled={!view.worldAdvance.available} onClick={() => run(
            () => getSession().advanceProductionWorld(), "The persistent world advanced canonically.",
          )}>{view.worldAdvance.label}</button>
          <p className="muted">{view.worldAdvance.description}</p>
        </section>
        <section className="panel"><p className="eyebrow">Agenda and legislature</p>
          <h2>{view.agenda.stage.replaceAll("_", " ")}</h2><dl>
            <div><dt>Proposal</dt><dd>{view.agenda.proposalId}</dd></div><div><dt>Version</dt><dd>{view.agenda.version}</dd></div>
            <div><dt>Current chamber</dt><dd>{view.agenda.currentChamberId ?? "—"}</dd></div>
            <div><dt>Likely support</dt><dd>{view.agenda.staffOutlook.likelyYea ?? 0}</dd></div>
            <div><dt>Enacted laws</dt><dd>{view.agenda.enactedLegalSources.length}</dd></div></dl></section>
        <section className="panel"><p className="eyebrow">Implementation and material delivery</p><h2>Known program status</h2><dl>
          <div><dt>Budget authorities</dt><dd>{view.implementation.generatedBudgetAuthorities.length}</dd></div>
          <div><dt>Pending owner decisions</dt><dd>{view.implementation.pendingOwnerDecisionCount}</dd></div>
          <div><dt>Fiscal controls / awards</dt><dd>{view.implementation.fiscalControlCount} / {view.implementation.awardCount}</dd></div>
          <div><dt>Obligations / payments</dt><dd>{view.implementation.obligationCount} / {view.implementation.paymentCount}</dd></div>
          <div><dt>Recipient commitments</dt><dd>{view.implementation.recipientCommitmentCount}</dd></div>
          <div><dt>Accepted material inputs</dt><dd>{view.implementation.materialInputKinds.length}</dd></div></dl></section>
        <section className="panel"><p className="eyebrow">Official and public information</p><h2>Released information</h2><dl>
          <div><dt>Official measurements</dt><dd>{view.officialInformation.releasedMeasurements.length}</dd></div>
          <div><dt>Public claims</dt><dd>{view.officialInformation.releasedClaims.length}</dd></div>
          <div><dt>Completed deliveries</dt><dd>{view.officialInformation.completedDeliveryCount}</dd></div></dl></section>
        <section className="panel"><p className="eyebrow">Public legal status</p><h2>Contest and orders</h2><dl>
          <div><dt>Filed claims</dt><dd>{view.legal.filedClaimCount}</dd></div>
          <div><dt>Proceedings</dt><dd>{view.legal.proceedingStatuses.join(", ") || "None"}</dd></div>
          <div><dt>Public rulings</dt><dd>{view.legal.publicRulings.length}</dd></div>
          <div><dt>Orders</dt><dd>{view.legal.operativeOrders.map((order) => order.status).join(", ") || "None"}</dd></div>
          <div><dt>Appeals / stays</dt><dd>{view.legal.appealStatuses.length} / {view.legal.stayStatuses.length}</dd></div>
          <div><dt>Administration response</dt><dd>{view.legal.complianceStatuses.at(-1) ?? "None"}</dd></div></dl></section>
        <section className="panel"><p className="eyebrow">Election and succession</p>
          <h2>{view.election.stage.replaceAll("_", " ")}</h2><dl>
            <div><dt>Public results</dt><dd>{view.election.publicResultIds.length}</dd></div>
            <div><dt>Declaration</dt><dd>{view.election.declarationId ?? "Not issued"}</dd></div>
            <div><dt>Next known event</dt><dd>{view.election.nextKnownBoundary?.kind.replaceAll("_", " ") ?? "None"}</dd></div>
            <div><dt>Scheduled</dt><dd>{view.election.nextKnownBoundary === null ? "—" : new Date(view.election.nextKnownBoundary.at).toLocaleDateString()}</dd></div>
          </dl></section>
      </div>
    </main>
  );
};

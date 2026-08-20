import { useState } from "react";

import { createGameSession } from "../app/session";

export const App = () => {
  const [session] = useState(() => createGameSession());
  const [view, setView] = useState(() => session.getView());

  const advance = () => {
    const target = view.nextKnownBootstrapBoundary ?? view.currentTime + 1;
    setView(session.advanceTo(target));
  };

  return (
    <main className="shell">
      <section className="card">
        <p className="eyebrow">Commit 8 runtime bootstrap</p>
        <h1>Headless simulation is alive.</h1>
        <p>
          The renderer is showing an application-layer projection. Canonical world
          state stays inside the headless simulation/session boundary.
        </p>

        <dl>
          <div>
            <dt>Simulation time</dt>
            <dd>{view.currentTime}</dd>
          </div>
          <div>
            <dt>Bootstrap boundary</dt>
            <dd>{view.bootstrapBoundaryResolved ? "resolved" : "pending"}</dd>
          </div>
        </dl>

        <button type="button" onClick={advance}>
          {view.nextKnownBootstrapBoundary === null
            ? "Advance one simulation unit"
            : "Advance to first canonical boundary"}
        </button>
      </section>
    </main>
  );
};

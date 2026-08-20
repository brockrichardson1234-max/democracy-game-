import { useState } from "react";

import { createGameSession } from "../app/session";
import type { ProposalTerms } from "../app/session";

const INITIAL_PROPOSAL_TERMS: ProposalTerms = {
  federalMatchRatePercent: 35,
  participationCondition: "strict",
  reportingRequirement: "standard",
};

const COMPROMISE_PROPOSAL_TERMS: ProposalTerms = {
  federalMatchRatePercent: 55,
  participationCondition: "lenient",
  reportingRequirement: "strengthened",
};

export const App = () => {
  const [session] = useState(() => createGameSession());
  const [view, setView] = useState(() => session.getView());

  const advance = () => {
    const target = view.nextKnownBootstrapBoundary ?? view.currentTime + 1;
    setView(session.advanceTo(target));
  };

  const { proposal, enactedLaw } = view.legislative;
  const { fiscal, housingGrantProgram } = view;

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

      <section className="card">
        <p className="eyebrow">Commit 9 developer inspection</p>
        <h1>Housing grant proposal / legislature</h1>

        <dl>
          <div>
            <dt>Proposal status</dt>
            <dd>{proposal === null ? "none submitted" : proposal.status}</dd>
          </div>
          <div>
            <dt>Proposal terms</dt>
            <dd>
              {proposal === null
                ? "—"
                : `match ${proposal.terms.federalMatchRatePercent}%, ${proposal.terms.participationCondition} participation, ${proposal.terms.reportingRequirement} reporting`}
            </dd>
          </div>
          <div>
            <dt>Amendments</dt>
            <dd>{proposal?.amendmentsAdopted ?? "—"}</dd>
          </div>
          <div>
            <dt>Votes</dt>
            <dd>
              {proposal?.votes === null || proposal?.votes === undefined
                ? "not yet resolved"
                : `${proposal.votes.filter((vote) => vote.choice === "YEA").length} YEA / ${
                    proposal.votes.filter((vote) => vote.choice === "NAY").length
                  } NAY`}
            </dd>
          </div>
          <div>
            <dt>Enacted law</dt>
            <dd>
              {enactedLaw === null
                ? "none"
                : `${enactedLaw.id} (appropriation: ${enactedLaw.appropriation.amount})`}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={() => setView(session.submitHousingGrantProposal(INITIAL_PROPOSAL_TERMS))}
        >
          Submit initial proposal
        </button>
        <button
          type="button"
          onClick={() => setView(session.amendHousingGrantProposal(COMPROMISE_PROPOSAL_TERMS))}
        >
          Offer compromise amendment
        </button>
        <button type="button" onClick={() => setView(session.resolveHousingGrantProposalVote())}>
          Resolve legislative vote
        </button>
      </section>

      <section className="card">
        <p className="eyebrow">Commit 10 developer inspection</p>
        <h1>Fiscal authority / federal program</h1>

        <dl>
          <div>
            <dt>Fiscal authority</dt>
            <dd>
              {fiscal === null
                ? "not yet recognized"
                : `available ${fiscal.available} / obligated ${fiscal.obligated} / disbursed ${fiscal.disbursed}`}
            </dd>
          </div>
          <div>
            <dt>Housing grant program</dt>
            <dd>
              {housingGrantProgram === null
                ? "not established"
                : `${housingGrantProgram.status} — match ${housingGrantProgram.federalMatchRatePercent}%, ${housingGrantProgram.participationCondition} participation, ${housingGrantProgram.reportingRequirement} reporting`}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={() => setView(session.recognizeHousingGrantFiscalAuthority())}
        >
          Recognize fiscal authority
        </button>
        <button type="button" onClick={() => setView(session.establishHousingGrantProgram())}>
          Establish housing grant program
        </button>
      </section>
    </main>
  );
};

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
  const { fiscal, housingGrantProgram, statePrograms } = view;

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
            <dt>Public finance / fiscal execution</dt>
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
                : `${housingGrantProgram.status} — operator ${housingGrantProgram.operatorInstitutionId}; match ${housingGrantProgram.federalMatchRatePercent}%, ${housingGrantProgram.participationCondition} participation, ${housingGrantProgram.reportingRequirement} reporting`}
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

      <section className="card">
        <p className="eyebrow">Commit 11 developer inspection</p>
        <h1>State response / federal participation</h1>

        {statePrograms.map((state) => (
          <div key={state.id}>
            <h2>{state.id}</h2>
            <dl>
              <div>
                <dt>Decision</dt>
                <dd>{state.decision ?? "not resolved"}</dd>
              </div>
              <div>
                <dt>Application</dt>
                <dd>{state.applicationId === null ? "none" : "submitted"}</dd>
              </div>
              <div>
                <dt>Federal determination</dt>
                <dd>{state.federalDetermination ?? "none"}</dd>
              </div>
              <div>
                <dt>Participation</dt>
                <dd>{state.participation ?? "none"}</dd>
              </div>
              <div>
                <dt>Capacity</dt>
                <dd>{state.capacity}</dd>
              </div>
              <div>
                <dt>Award</dt>
                <dd>{state.award === null ? "none" : `$${state.award.awardedAmount}`}</dd>
              </div>
              <div>
                <dt>Obligated</dt>
                <dd>{state.obligation === null ? "$0" : `$${state.obligation.amount}`}</dd>
              </div>
              <div>
                <dt>Disbursed</dt>
                <dd>{state.disbursement === null ? "$0" : `$${state.disbursement.amount}`}</dd>
              </div>
              <div>
                <dt>Housing project</dt>
                <dd>{state.housingProject === null ? "none" : state.housingProject.status}</dd>
              </div>
            </dl>

            <button
              type="button"
              disabled={housingGrantProgram === null || state.decision !== null}
              onClick={() => setView(session.resolveStateHousingGrantDecision(state.id))}
            >
              Resolve state decision
            </button>
            <button
              type="button"
              disabled={
                housingGrantProgram === null ||
                state.decision !== "APPLY" ||
                state.applicationId !== null
              }
              onClick={() => setView(session.submitStateHousingGrantApplication(state.id))}
            >
              Submit state application
            </button>
            <button
              type="button"
              disabled={state.applicationId === null || state.federalDetermination !== null}
              onClick={() => setView(session.resolveFederalHousingGrantApplication(state.id))}
            >
              Resolve federal determination
            </button>
            <button
              type="button"
              disabled={
                state.federalDetermination !== "ACCEPTED" || state.participation !== null
              }
              onClick={() =>
                setView(session.activateIntergovernmentalHousingGrantParticipation(state.id))
              }
            >
              Activate participation
            </button>
            <button
              type="button"
              disabled={state.participation !== "ACTIVE" || state.award !== null}
              onClick={() => setView(session.createHousingGrantAward(state.id))}
            >
              Create administrative award
            </button>
            <button
              type="button"
              disabled={state.award === null || state.obligation !== null}
              onClick={() => setView(session.obligateHousingGrantAward(state.id))}
            >
              Obligate award
            </button>
            <button
              type="button"
              disabled={state.obligation === null || state.disbursement !== null}
              onClick={() => setView(session.disburseHousingGrantObligation(state.id))}
            >
              Disburse obligation
            </button>
            <button
              type="button"
              disabled={state.disbursement === null || state.housingProject !== null}
              onClick={() => setView(session.materializeHousingProjectFromDisbursement(state.id))}
            >
              Materialize Housing project
            </button>
          </div>
        ))}
      </section>
    </main>
  );
};

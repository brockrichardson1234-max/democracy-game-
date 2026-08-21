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
  const stateAProgram = statePrograms.find((state) => state.id === "state-a");
  const stateCProgram = statePrograms.find((state) => state.id === "state-c");

  return (
    <main className="shell">
      <section className="card">
        <p className="eyebrow">Commit 18 runtime candidate</p>
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
        <p className="eyebrow">Commit 13 developer inspection</p>
        <h1>State response / Housing material delivery</h1>

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
                <dt>Administrative capacity</dt>
                <dd>{state.capacity}</dd>
              </div>
              <div>
                <dt>Housing region</dt>
                <dd>
                  {state.housingRegion.id} ({state.housingRegion.geographyRegionId})
                </dd>
              </div>
              <div>
                <dt>Material capacity</dt>
                <dd>{state.housingRegion.constructionCapacityWorkUnitsPerDay} work/day</dd>
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
              <div>
                <dt>Physical progress</dt>
                <dd>
                  {state.housingProject === null
                    ? "none"
                    : `${state.housingProject.completedWorkUnits} / ${state.housingProject.requiredWorkUnits} work`}
                </dd>
              </div>
              <div>
                <dt>Housing stock</dt>
                <dd>
                  {state.housingProject?.status === "COMPLETED"
                    ? `${state.housingRegion.housingStockUnits - state.housingProject.plannedHousingUnits} → ${state.housingRegion.housingStockUnits}`
                    : `${state.housingRegion.housingStockUnits} (unchanged)`}
                </dd>
              </div>
              <div>
                <dt>Synthetic material demand</dt>
                <dd>{state.housingRegion.housingDemandUnits}</dd>
              </div>
              <div>
                <dt>Affordability pressure</dt>
                <dd>{state.housingRegion.affordabilityPressure}</dd>
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

      <section className="card">
        <p className="eyebrow">Commit 15 developer inspection</p>
        <h1>Implementation response → Housing delivery</h1>

        <dl>
          <div>
            <dt>State A project progress</dt>
            <dd>
              {stateAProgram?.housingProject == null
                ? "none"
                : `${stateAProgram.housingProject.completedWorkUnits} / ${stateAProgram.housingProject.requiredWorkUnits}`}
            </dd>
          </div>
          <div>
            <dt>State C project progress</dt>
            <dd>
              {stateCProgram?.housingProject == null
                ? "none"
                : `${stateCProgram.housingProject.completedWorkUnits} / ${stateCProgram.housingProject.requiredWorkUnits}`}
            </dd>
          </div>
          <div>
            <dt>State C intrinsic material capacity</dt>
            <dd>
              {stateCProgram === undefined
                ? "none"
                : `${stateCProgram.housingRegion.constructionCapacityWorkUnitsPerDay} work/day`}
            </dd>
          </div>
          <div>
            <dt>State C accepted Housing support</dt>
            <dd>
              {stateCProgram?.acceptedImplementationSupport == null
                ? "none"
                : `+${stateCProgram.acceptedImplementationSupport.supplementalWorkUnitsPerDay} work/day from ${stateCProgram.acceptedImplementationSupport.sourceDeploymentId}`}
            </dd>
          </div>
          <div>
            <dt>State C effective project rate</dt>
            <dd>
              {stateCProgram?.effectiveProjectWorkUnitsPerDay == null
                ? "none"
                : `${stateCProgram.effectiveProjectWorkUnitsPerDay} work/day`}
            </dd>
          </div>
          <div>
            <dt>State C completion / stock</dt>
            <dd>
              {stateCProgram?.housingProject == null
                ? "none"
                : `${stateCProgram.housingProject.completedAtSimulationTime ?? "pending"} / ${stateCProgram.housingRegion.housingStockUnits}`}
            </dd>
          </div>
          <div>
            <dt>Federal implementation support</dt>
            <dd>
              {view.implementationResponse.availableSupportUnits} available /{" "}
              {view.implementationResponse.committedSupportUnits} committed
            </dd>
          </div>
          <div>
            <dt>Response</dt>
            <dd>{view.implementationResponse.resolvedAction ?? "awaiting response opportunity"}</dd>
          </div>
          <div>
            <dt>Target</dt>
            <dd>{view.implementationResponse.targetStateJurisdictionId ?? "none"}</dd>
          </div>
        </dl>

        <button
          type="button"
          disabled={!view.implementationResponse.responseOpportunityReady}
          onClick={() => setView(session.deployHousingImplementationSupportToStateC())}
        >
          Deploy support to State C
        </button>
        <button
          type="button"
          disabled={!view.implementationResponse.responseOpportunityReady}
          onClick={() => setView(session.preserveHousingImplementationSupportReserve())}
        >
          Preserve support reserve
        </button>
      </section>

      <section className="card">
        <p className="eyebrow">Commit 17 developer inspection</p>
        <h1>Official Housing Measurement</h1>

        <dl>
          <div>
            <dt>Status</dt>
            <dd>{view.officialHousingMeasurement.status}</dd>
          </div>
          <div>
            <dt>Observation window</dt>
            <dd>
              {view.officialHousingMeasurement.observationStart}–
              {view.officialHousingMeasurement.observationEnd}
            </dd>
          </div>
          <div>
            <dt>Captured at</dt>
            <dd>{view.officialHousingMeasurement.capturedAtSimulationTime ?? "pending"}</dd>
          </div>
          <div>
            <dt>Scheduled report release</dt>
            <dd>{view.officialHousingMeasurement.scheduledReleaseAtSimulationTime}</dd>
          </div>
          <div>
            <dt>Released report</dt>
            <dd>{view.officialHousingMeasurement.releasedReport === null ? "no" : "yes"}</dd>
          </div>
        </dl>

        <h2>Captured regional material values</h2>
        <dl>
          {view.officialHousingMeasurement.capturedRegionalResults.map((result) => {
            const state = statePrograms.find(
              (candidate) => candidate.housingRegion.id === result.housingRegionId,
            );
            return (
              <div key={result.housingRegionId}>
                <dt>{state?.id ?? result.housingRegionId}</dt>
                <dd>
                  stock {result.housingStockUnits} / pressure {result.affordabilityPressure}
                </dd>
              </div>
            );
          })}
        </dl>
      </section>

      <section className="card">
        <p className="eyebrow">Commit 18 developer/audit inspection</p>
        <h1>Competing claims and public exposure</h1>
        <p>Raw Information truth below is not population belief or player knowledge.</p>

        <h2>Political claim artifacts</h2>
        <dl>
          {view.publicInformationAudit.claims.map((claim) => (
            <div key={claim.id}>
              <dt>{claim.claimPosition}</dt>
              <dd>
                day {claim.releasedAtSimulationTime}; source {claim.sourceArtifactIds.join(", ")};{" "}
                {claim.origin.originType === "ADMINISTRATION"
                  ? `administration ${claim.origin.administrationId}`
                  : `actor ${claim.origin.actorId}`}
              </dd>
            </div>
          ))}
        </dl>

        <h2>Temporary GL0 distribution audiences</h2>
        <dl>
          {view.publicInformationAudit.audiences.map((audience) => (
            <div key={audience.id}>
              <dt>{audience.id}</dt>
              <dd>
                {audience.exposedArtifactIds.length === 0
                  ? "no received artifacts"
                  : audience.exposedArtifactIds.join(", ")}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
};

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { canonicalConfigurationContent } from "../src/configuration/canonical";
import type { GovernmentConfiguration, LegislativeRuntimeSeed } from "../src/configuration/types";
import {
  createLegislativeSession,
  createLegislativeSessionFromSave,
  type LegislativeSession,
} from "../src/app/legislative-session";
import {
  US_DELIVERY_COALITION_ID,
  US_FISCAL_COMPLIANCE_COALITION_ID,
  US_REGIONAL_BARGAINING_CAUCUS_ID,
  US_V0_LEGISLATIVE_SEED,
  US_V0_PROFILE_SCAFFOLD_VERSION,
  US_V0_PROFILE_SEED,
  US_V0_STRUCTURAL_CONFIGURATION,
} from "../src/content/us-v0/configuration";
import {
  US_HOUSE_CHAMBER_ID,
  US_INCUMBENT_PRESIDENT_ACTOR_ID,
  US_INCUMBENT_VICE_PRESIDENT_ACTOR_ID,
  US_SENATE_CHAMBER_ID,
  US_VICE_PRESIDENT_OFFICE_ID,
} from "../src/content/us-v0/topology";
import {
  castConfiguredTieBreakerVote,
  resolveFinalRollCall,
  resolveVetoOverrideRollCall,
  type LegislativeRuntimeContext,
  type LegislativeRuntimeState,
} from "../src/sim/legislative-runtime";
import {
  decidePoliticalActorVote,
  type EvaluatedProposalVersion,
} from "../src/sim/political";

const configuration = US_V0_STRUCTURAL_CONFIGURATION;
const context: LegislativeRuntimeContext = {
  structure: configuration.structure,
  seed: US_V0_LEGISLATIVE_SEED,
};
const compromiseChanges = {
  compliance_burden: 4,
  geographic_distribution: 8,
  administrative_capacity_support: 7,
};

const sha256 = (value: string): string => createHash("sha256").update(value).digest("hex");

const currentProposal = (state: LegislativeRuntimeState): EvaluatedProposalVersion => {
  const version = state.agenda.versions.find((candidate) => candidate.version === state.agenda.currentVersion);
  if (version === undefined) throw new Error("Missing current version.");
  return { proposalId: state.agenda.proposalId, version: version.version, dimensions: version.dimensions };
};

const actorAssignment = (actorId: string) => {
  const assignment = configuration.structure.assignments.find(
    (candidate) => candidate.actorId === actorId && candidate.currentAtScenarioStart,
  );
  if (assignment === undefined) throw new Error(`Missing assignment for ${actorId}.`);
  return assignment;
};

const findOriginSponsor = (session: LegislativeSession): string => {
  const state = session.getAuditState();
  const originActorIds = new Set(
    state.political.organizations.flatMap((organization) =>
      organization.memberships
        .filter((membership) => membership.chamberId === US_HOUSE_CHAMBER_ID)
        .map((membership) => membership.actorId),
    ),
  );
  const actor = state.political.actors.find(
    (candidate) => originActorIds.has(candidate.actorId) && candidate.supportPosture === "LEAN_YEA",
  );
  if (actor === undefined) throw new Error("No deterministic origin sponsor.");
  return actor.actorId;
};

const reachOriginAmendment = (session: LegislativeSession): void => {
  const sponsorId = findOriginSponsor(session);
  session.beginSponsorSearch();
  session.seekSponsorship(sponsorId);
  session.introduceBySponsor(sponsorId, actorAssignment(sponsorId).id);
  session.advanceIntroducedProposal();
  session.resolveConsiderationGate();
  expect(session.getAuditState().procedure.stage).toBe("ORIGIN_AMENDMENT");
};

const reachOtherAmendmentWithCompromise = (session: LegislativeSession): void => {
  reachOriginAmendment(session);
  session.requestAmendment(compromiseChanges);
  session.resolveAmendment();
  expect(session.getAuditState().agenda.currentVersion).toBe(2);
  session.resolveFinalRollCall();
  expect(session.getAuditState().procedure.stage).toBe("OTHER_CHAMBER_CONSIDERATION_GATE");
  session.resolveConsiderationGate();
  expect(session.getAuditState().procedure.stage).toBe("OTHER_CHAMBER_AMENDMENT");
};

const reachIdenticalText = (session: LegislativeSession): void => {
  reachOtherAmendmentWithCompromise(session);
  session.closeAmendmentRound();
  session.resolveFinalRollCall();
  expect(session.getAuditState().procedure.stage).toBe("IDENTICAL_TEXT");
};

const executiveAssignment = () => actorAssignment(US_INCUMBENT_PRESIDENT_ACTOR_ID);

describe("I3 political ownership and U.S. scaffold", () => {
  it("derives the 535 actor states and exact three organization divisions from I2 assignments", () => {
    const state = createLegislativeSession(configuration).getAuditState();
    expect(state.political.actors).toHaveLength(535);
    expect(state.political.scaffold).toEqual({
      version: US_V0_PROFILE_SCAFFOLD_VERSION,
      seed: US_V0_PROFILE_SEED,
      classification: "APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD",
    });
    expect(state.political.organizations.map((organization) => organization.id)).toEqual([
      US_DELIVERY_COALITION_ID,
      US_FISCAL_COMPLIANCE_COALITION_ID,
      US_REGIONAL_BARGAINING_CAUCUS_ID,
    ]);
    expect(
      state.political.organizations.map((organization) =>
        organization.divisions.map((division) => division.membershipIds.length),
      ),
    ).toEqual([[210, 48], [190, 42], [35, 10]]);
    expect(new Set(state.political.organizations.flatMap((organization) => organization.memberships.map((membership) => membership.actorId))).size).toBe(535);
    for (const organization of state.political.organizations) {
      for (const division of organization.divisions) {
        const members = organization.memberships
          .filter((membership) => membership.chamberId === division.chamberId)
          .sort((left, right) => left.stableRank.localeCompare(right.stableRank));
        expect(division.leaderMembershipId).toBe(members[0].id);
        expect(division.whipMembershipId).toBe(members[1].id);
        expect(new Set(division.membershipIds).size).toBe(division.membershipIds.length);
      }
    }
    expect(US_V0_PROFILE_SCAFFOLD_VERSION).toBe("us-v0-actor-profile-scaffold-1");
    expect(US_V0_PROFILE_SEED).toBe("us-v0-political-content-seed-1");
    expect(configuration.structure.actors.filter((actor) => actor.role === "LEGISLATIVE").every(
      (actor) => actor.classification === "APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD",
    )).toBe(true);
    expect(JSON.stringify(configuration.runtimeSeed)).not.toMatch(/Democrat|Republican|Independent|ideology|polling|biography/i);
  });

  it("uses the exact configured SHA ranking input and keeps coordination roles non-governmental", () => {
    const state = createLegislativeSession(configuration).getAuditState();
    for (const organization of state.political.organizations) {
      for (const membership of organization.memberships) {
        const token = US_V0_LEGISLATIVE_SEED.membershipScaffold.chamberRankTokens[membership.chamberId];
        expect(membership.stableRank).toBe(
          sha256(`us-v0-org-scaffold-1|${token}|${membership.officeId}`),
        );
      }
    }
    const coordinationRoleIds = state.political.organizations.flatMap((organization) =>
      organization.divisions.flatMap((division) => [division.leaderMembershipId, division.whipMembershipId]),
    );
    expect(coordinationRoleIds.every((id) => !configuration.structure.offices.some((office) => office.id === id))).toBe(true);
  });

  it("organization coordination changes multiple member inputs, creates zero votes, and changes downstream decisions", () => {
    const session = createLegislativeSession(configuration);
    const before = session.getAuditState();
    const regional = before.political.organizations.find(
      (organization) => organization.id === US_REGIONAL_BARGAINING_CAUCUS_ID,
    );
    if (regional === undefined) throw new Error("Missing regional organization.");
    const members = regional.memberships.filter((membership) => membership.chamberId === US_HOUSE_CHAMBER_ID);
    const proposal = currentProposal(before);
    const choicesBefore = members.map((membership) =>
      decidePoliticalActorVote(before.political, US_V0_LEGISLATIVE_SEED, membership.actorId, proposal, "before", "FINAL_PASSAGE").choice,
    );

    session.coordinateOrganization(US_REGIONAL_BARGAINING_CAUCUS_ID, US_HOUSE_CHAMBER_ID, "SUPPORT");
    const after = session.getAuditState();
    const choicesAfter = members.map((membership) =>
      decidePoliticalActorVote(after.political, US_V0_LEGISLATIVE_SEED, membership.actorId, proposal, "after", "FINAL_PASSAGE").choice,
    );
    expect(after.procedure.voteOpportunities).toEqual([]);
    expect(after.political.actors.filter((actor) => actor.accessibleOrganizationRecordIds.length > 0)).toHaveLength(35);
    expect(choicesAfter.filter((choice, index) => choice !== choicesBefore[index]).length).toBeGreaterThan(0);
  });

  it("proves a concrete same-organization defection pair under the same pressure", () => {
    const session = createLegislativeSession(configuration);
    session.coordinateOrganization(US_REGIONAL_BARGAINING_CAUCUS_ID, US_HOUSE_CHAMBER_ID, "SUPPORT");
    const state = session.getAuditState();
    const proposal = currentProposal(state);
    const aligned = decidePoliticalActorVote(
      state.political,
      US_V0_LEGISLATIVE_SEED,
      "us.actor.legislative.house.3101.scaffold",
      proposal,
      "defection-proof",
      "FINAL_PASSAGE",
    );
    const defector = decidePoliticalActorVote(
      state.political,
      US_V0_LEGISLATIVE_SEED,
      "us.actor.legislative.house.2706.scaffold",
      proposal,
      "defection-proof",
      "FINAL_PASSAGE",
    );
    expect(aligned.choice).toBe("YEA");
    expect(defector.choice).toBe("NAY");
    expect(
      state.political.actors.find((actor) => actor.actorId === aligned.actor.actorId)?.membershipId.split(":")[1],
    ).toBe(US_REGIONAL_BARGAINING_CAUCUS_ID);
    expect(
      state.political.actors.find((actor) => actor.actorId === defector.actor.actorId)?.membershipId.split(":")[1],
    ).toBe(US_REGIONAL_BARGAINING_CAUCUS_ID);
  });

  it("changes actor decisions when one consequential configured proposal dimension changes", () => {
    const state = createLegislativeSession(configuration).getAuditState();
    const initial = currentProposal(state);
    const changed = {
      ...initial,
      version: 2,
      dimensions: { ...initial.dimensions, appropriation_magnitude: 0 },
    };
    const flips = state.political.actors.filter((actor) =>
      decidePoliticalActorVote(state.political, US_V0_LEGISLATIVE_SEED, actor.actorId, initial, "a", "FINAL_PASSAGE").choice !==
      decidePoliticalActorVote(state.political, US_V0_LEGISLATIVE_SEED, actor.actorId, changed, "b", "FINAL_PASSAGE").choice,
    );
    expect(flips.length).toBeGreaterThan(0);
  });
});

describe("I3 negotiation, commitments, sponsorship, and amendment ownership", () => {
  it("revises one canonical commitment record when actor-owned willingness permits", () => {
    const session = createLegislativeSession(configuration);
    const actor = session.getAuditState().political.actors.find(
      (candidate) =>
        candidate.supportPosture === "LEAN_YEA" &&
        candidate.commitmentRenegotiateWillingness >= US_V0_LEGISLATIVE_SEED.decision.commitmentHonorCutoff,
    );
    if (actor === undefined) throw new Error("Missing deterministic renegotiating actor.");
    session.negotiateWithActor(actor.actorId, {
      objective: "SUPPORT",
      terms: { scope: "initial" },
      conditions: ["condition one"],
    });
    session.negotiateWithActor(actor.actorId, {
      objective: "SUPPORT",
      terms: { scope: "revised" },
      conditions: ["condition two"],
    });
    const state = session.getAuditState();
    expect(state.political.commitments).toHaveLength(1);
    expect(state.political.commitments[0]).toMatchObject({
      negotiatedTerms: { scope: "revised" },
      conditions: ["condition one", "condition two"],
    });
    expect(state.political.actors.find((candidate) => candidate.actorId === actor.actorId)?.negotiationMemory.at(-1)?.outcome).toBe(
      "REVISED_COMMITMENT",
    );
  });

  it("negotiation creates exact-version canonical commitment state and changes a later actor vote", () => {
    const session = createLegislativeSession(configuration);
    const initial = session.getAuditState();
    const proposal = currentProposal(initial);
    const actor = initial.political.actors.find((candidate) => {
      const wouldVoteNay = decidePoliticalActorVote(
        initial.political,
        US_V0_LEGISLATIVE_SEED,
        candidate.actorId,
        proposal,
        "without-negotiation",
        "FINAL_PASSAGE",
      ).choice === "NAY";
      return wouldVoteNay &&
        (candidate.commitmentBreachWillingness < US_V0_LEGISLATIVE_SEED.decision.breachCutoff ||
          candidate.commitmentHonorWillingness >= US_V0_LEGISLATIVE_SEED.decision.commitmentHonorCutoff);
    });
    if (actor === undefined) throw new Error("Missing deterministic negotiation actor.");
    const breachedDimension = actor.evaluations.find((evaluation) => {
      const value = proposal.dimensions[evaluation.dimensionId];
      return value < evaluation.reservationMinimum || value > evaluation.reservationMaximum;
    });
    if (breachedDimension === undefined) throw new Error("Negotiation actor has no condition.");
    session.negotiateWithActor(actor.actorId, {
      objective: "SUPPORT",
      terms: { [breachedDimension.dimensionId]: proposal.dimensions[breachedDimension.dimensionId] },
      conditions: ["support exact introduced text"],
    });
    const negotiated = session.getAuditState();
    expect(negotiated.political.commitments).toHaveLength(1);
    expect(negotiated.political.commitments[0]).toMatchObject({
      participantIds: [actor.actorId, US_V0_LEGISLATIVE_SEED.executive.administrationId],
      proposalVersion: 1,
      status: "ACTIVE",
    });
    expect(decidePoliticalActorVote(
      negotiated.political,
      US_V0_LEGISLATIVE_SEED,
      actor.actorId,
      proposal,
      "with-negotiation",
      "FINAL_PASSAGE",
    ).choice).toBe("YEA");
    expect(negotiated.political.actors.find((candidate) => candidate.actorId === actor.actorId)).not.toHaveProperty("commitmentTerms");
  });

  it("an active commitment can be breached and never pre-writes a vote", () => {
    const session = createLegislativeSession(configuration);
    const actorId = "us.actor.legislative.house.0107.scaffold";
    session.negotiateWithActor(actorId, {
      objective: "SUPPORT",
      terms: { appropriation_magnitude: 5 },
      conditions: ["support exact version one"],
    });
    expect(session.getAuditState().political.commitments[0].status).toBe("ACTIVE");
    expect(session.getAuditState().procedure.voteOpportunities).toEqual([]);
    const sponsorId = findOriginSponsor(session);
    session.beginSponsorSearch();
    session.seekSponsorship(sponsorId);
    session.introduceBySponsor(sponsorId, actorAssignment(sponsorId).id);
    session.advanceIntroducedProposal();
    session.resolveConsiderationGate();
    session.closeAmendmentRound();
    session.resolveFinalRollCall();
    const state = session.getAuditState();
    const vote = state.procedure.voteOpportunities.at(-1)?.votes.find((candidate) => candidate.actorId === actorId);
    expect(vote?.choice).toBe("NAY");
    expect(state.political.commitments[0].status).toBe("BREACHED");
  });

  it("cannot introduce without an eligible member's accepted exact-version sponsorship", () => {
    const session = createLegislativeSession(configuration);
    session.beginSponsorSearch();
    expect(() => session.introduceBySponsor(
      US_INCUMBENT_PRESIDENT_ACTOR_ID,
      executiveAssignment().id,
    )).toThrow(/accepted sponsoring member/);
    const sponsorId = findOriginSponsor(session);
    session.seekSponsorship(sponsorId);
    session.introduceBySponsor(sponsorId, actorAssignment(sponsorId).id);
    expect(session.getAuditState().procedure.sponsorship.status).toBe("INTRODUCED");
  });

  it("a request alone does not mutate text; formal adoption creates an immutable new version", () => {
    const session = createLegislativeSession(configuration);
    reachOriginAmendment(session);
    const before = session.getAuditState();
    session.requestAmendment(compromiseChanges);
    const requested = session.getAuditState();
    expect(requested.agenda.versions).toEqual(before.agenda.versions);
    expect(requested.procedure.amendments.at(-1)?.status).toBe("PROPOSED");
    session.resolveAmendment();
    const adopted = session.getAuditState();
    expect(adopted.agenda.versions).toHaveLength(2);
    expect(adopted.agenda.versions[0]).toEqual(before.agenda.versions[0]);
    expect(adopted.agenda.versions[1]).toMatchObject({
      id: "us.proposal-version.us.proposal.housing-agenda.i3:2",
      version: 2,
      previousVersion: 1,
      createdBy: "ADOPTED_AMENDMENT",
    });
    expect(adopted.procedure.amendments.at(-1)?.status).toBe("ADOPTED");
  });

  it("a gate can block a proposal that has sufficient hypothetical final support", () => {
    const modifiedSeed: LegislativeRuntimeSeed = {
      ...US_V0_LEGISLATIVE_SEED,
      procedure: {
        ...US_V0_LEGISLATIVE_SEED.procedure,
        considerationGateMinimumSignals: {
          ...US_V0_LEGISLATIVE_SEED.procedure.considerationGateMinimumSignals,
          [US_HOUSE_CHAMBER_ID]: 9,
        },
      },
      proposal: {
        ...US_V0_LEGISLATIVE_SEED.proposal,
        initialDimensions: {
          appropriation_magnitude: 7,
          recipient_flexibility: 7,
          compliance_burden: 4,
          geographic_distribution: 8,
          administrative_capacity_support: 7,
        },
      },
    };
    const unhashed: GovernmentConfiguration<LegislativeRuntimeSeed> = {
      ...configuration,
      identity: {
        ...configuration.identity,
        configurationVersion: "gate-counterfactual",
        scenarioVersion: "gate-counterfactual",
        configurationHash: "0".repeat(64),
      },
      runtimeSeed: modifiedSeed,
    };
    const blockedConfiguration: GovernmentConfiguration<LegislativeRuntimeSeed> = {
      ...unhashed,
      identity: { ...unhashed.identity, configurationHash: sha256(canonicalConfigurationContent(unhashed)) },
    };
    const session = createLegislativeSession(blockedConfiguration);
    const hypothetical = session.getAuditState();
    const proposal = currentProposal(hypothetical);
    const houseActorIds = new Set(
      hypothetical.political.organizations.flatMap((organization) =>
        organization.memberships.filter((membership) => membership.chamberId === US_HOUSE_CHAMBER_ID).map((membership) => membership.actorId),
      ),
    );
    const hypotheticalYea = hypothetical.political.actors.filter(
      (actor) => houseActorIds.has(actor.actorId) &&
        decidePoliticalActorVote(hypothetical.political, modifiedSeed, actor.actorId, proposal, "hypothetical", "FINAL_PASSAGE").choice === "YEA",
    ).length;
    expect(hypotheticalYea).toBeGreaterThanOrEqual(218);
    reachOriginAmendmentForConfiguration(session, blockedConfiguration);
    expect(session.getAuditState().procedure.stage).toBe("FAILED");
    expect(session.getAuditState().procedure.voteOpportunities).toEqual([]);
  });
});

const reachOriginAmendmentForConfiguration = (
  session: LegislativeSession,
  supplied: GovernmentConfiguration<LegislativeRuntimeSeed>,
): void => {
  const originId = supplied.runtimeSeed?.procedure.originChamberId;
  if (originId === undefined) throw new Error("Missing origin.");
  const state = session.getAuditState();
  const originActorIds = new Set(
    state.political.organizations.flatMap((organization) =>
      organization.memberships.filter((membership) => membership.chamberId === originId).map((membership) => membership.actorId),
    ),
  );
  const sponsor = state.political.actors.find((actor) => originActorIds.has(actor.actorId) && actor.supportPosture === "LEAN_YEA");
  if (sponsor === undefined) throw new Error("No configured sponsor.");
  const assignment = supplied.structure.assignments.find((candidate) => candidate.actorId === sponsor.actorId);
  if (assignment === undefined) throw new Error("No configured assignment.");
  session.beginSponsorSearch();
  session.seekSponsorship(sponsor.actorId);
  session.introduceBySponsor(sponsor.actorId, assignment.id);
  session.advanceIntroducedProposal();
  session.resolveConsiderationGate();
};

describe("I3 configured bicameral procedure and presentment", () => {
  it("records complete individual chamber roll calls and reaches identical text on the ordinary route", () => {
    const session = createLegislativeSession(configuration);
    reachIdenticalText(session);
    const state = session.getAuditState();
    const finalCalls = state.procedure.voteOpportunities.filter((opportunity) => opportunity.kind === "FINAL_PASSAGE");
    expect(finalCalls).toHaveLength(2);
    const origin = finalCalls.find((opportunity) => opportunity.chamberId === US_HOUSE_CHAMBER_ID);
    const other = finalCalls.find((opportunity) => opportunity.chamberId === US_SENATE_CHAMBER_ID);
    expect(origin?.votes).toHaveLength(435);
    expect(other?.votes).toHaveLength(100);
    expect(new Set(origin?.votes.map((vote) => vote.assignmentId)).size).toBe(435);
    expect(new Set(other?.votes.map((vote) => vote.assignmentId)).size).toBe(100);
    expect(origin?.tally).toMatchObject({ requiredForQuorum: 218, requiredYea: 218, passed: true });
    expect(other?.tally).toMatchObject({ requiredForQuorum: 51, requiredYea: 51, passed: true });
    expect(state.procedure.voteOpportunities.some((opportunity) => opportunity.kind === "CLOTURE")).toBe(false);
    expect(state.procedure.approvedVersionByChamber).toEqual({
      [US_HOUSE_CHAMBER_ID]: 2,
      [US_SENATE_CHAMBER_ID]: 2,
    });
  });

  it("makes cloture conditional: an ordinary majority passes without it but cannot bypass an active gate", () => {
    const direct = createLegislativeSession(configuration);
    reachOtherAmendmentWithCompromise(direct);
    const save = direct.save();
    direct.closeAmendmentRound();
    direct.resolveFinalRollCall();
    expect(direct.getAuditState().procedure.stage).toBe("IDENTICAL_TEXT");

    const threatened = createLegislativeSessionFromSave(save, configuration);
    threatened.closeAmendmentRound();
    const senateActor = threatened.getAuditState().political.organizations
      .flatMap((organization) => organization.memberships)
      .find((membership) => membership.chamberId === US_SENATE_CHAMBER_ID);
    if (senateActor === undefined) throw new Error("No second-chamber actor.");
    threatened.threatenExtendedDebate(senateActor.actorId);
    threatened.resolveFinalRollCall();
    const cloture = threatened.getAuditState().procedure.voteOpportunities.at(-1);
    expect(cloture?.kind).toBe("CLOTURE");
    expect(cloture?.tally.requiredYea).toBe(60);
    expect(cloture?.tally.passed).toBe(false);
    expect(threatened.getAuditState().procedure.stage).toBe("FAILED");
  });

  it("keeps different chamber text out of presentment until an actual exchange roll call matches it", () => {
    const session = createLegislativeSession(configuration);
    reachOtherAmendmentWithCompromise(session);
    session.requestAmendment({ recipient_flexibility: 8 });
    session.resolveAmendment();
    expect(session.getAuditState().agenda.currentVersion).toBe(3);
    session.resolveFinalRollCall();
    expect(session.getAuditState().procedure.stage).toBe("TEXT_EXCHANGE");
    expect(() => session.present()).toThrow(/identical approved text/);
    session.considerTextExchange(US_HOUSE_CHAMBER_ID, 3);
    expect(session.getAuditState().procedure.stage).toBe("IDENTICAL_TEXT");
    expect(session.getAuditState().procedure.textExchangeCount).toBe(1);
    expect(session.getAuditState().procedure.voteOpportunities.at(-1)?.votes).toHaveLength(435);
  });

  it("signature creates only a versioned legal-source fact and no execution state", () => {
    const session = createLegislativeSession(configuration);
    reachIdenticalText(session);
    session.present();
    const assignment = executiveAssignment();
    session.executiveAction(US_INCUMBENT_PRESIDENT_ACTOR_ID, assignment.id, "SIGN");
    const state = session.getAuditState();
    expect(state.procedure.stage).toBe("ENACTED");
    expect(state.enactedLegalSources).toHaveLength(1);
    expect(state.enactedLegalSources[0]).toMatchObject({
      sourceProposalVersion: 2,
      enactmentRoute: "SIGNATURE",
      appropriation: { amount: 25_000_000_000 },
    });
    expect(state).not.toHaveProperty("publicFinance");
    expect(state).not.toHaveProperty("housing");
    expect(JSON.stringify(state)).not.toContain("housingGrantProgram");
  });

  it("veto creates no law and a failed one-chamber override cannot enact", () => {
    const session = createLegislativeSession(configuration);
    reachIdenticalText(session);
    session.present();
    session.executiveAction(US_INCUMBENT_PRESIDENT_ACTOR_ID, executiveAssignment().id, "VETO");
    expect(session.getAuditState().procedure.stage).toBe("VETOED");
    expect(session.getAuditState().enactedLegalSources).toEqual([]);
    session.resolveOverride(US_HOUSE_CHAMBER_ID);
    const state = session.getAuditState();
    const override = state.procedure.voteOpportunities.at(-1);
    expect(override?.kind).toBe("OVERRIDE");
    expect(override?.tally.requiredYea).toBe(290);
    expect(state.procedure.stage).toBe("FAILED");
    expect(state.enactedLegalSources).toEqual([]);
  });

  it("requires successful configured-threshold override votes in both chambers", () => {
    const session = createLegislativeSession(configuration);
    reachIdenticalText(session);
    session.present();
    session.executiveAction(US_INCUMBENT_PRESIDENT_ACTOR_ID, executiveAssignment().id, "VETO");
    const vetoed = session.getAuditState();
    const unanimouslySupportive: LegislativeRuntimeState = {
      ...vetoed,
      political: {
        ...vetoed.political,
        actors: vetoed.political.actors.map((actor) => ({
          ...actor,
          evaluations: actor.evaluations.map((evaluation) => ({
            ...evaluation,
            reservationMinimum: 0,
            reservationMaximum: 10,
          })),
        })),
      },
    };
    const first = resolveVetoOverrideRollCall(unanimouslySupportive, context, US_HOUSE_CHAMBER_ID);
    expect(first.procedure.stage).toBe("VETOED");
    expect(first.enactedLegalSources).toEqual([]);
    expect(first.procedure.voteOpportunities.at(-1)?.tally).toMatchObject({ requiredYea: 290, passed: true });
    const second = resolveVetoOverrideRollCall(first, context, US_SENATE_CHAMBER_ID);
    expect(second.procedure.voteOpportunities.at(-1)?.tally).toMatchObject({ requiredYea: 67, passed: true });
    expect(second.procedure.stage).toBe("ENACTED");
    expect(second.enactedLegalSources[0].enactmentRoute).toBe("VETO_OVERRIDE");
  });

  it("preserves the bounded no-signature distinction and resolves both configured outcomes", () => {
    const base = createLegislativeSession(configuration);
    reachIdenticalText(base);
    base.present();
    base.executiveAction(US_INCUMBENT_PRESIDENT_ACTOR_ID, executiveAssignment().id, "WITHHOLD");
    const save = base.save();
    base.resolveNoSignature(false);
    expect(base.getAuditState().enactedLegalSources[0].enactmentRoute).toBe("NO_SIGNATURE");

    const prevented = createLegislativeSessionFromSave(save, configuration);
    prevented.resolveNoSignature(true);
    expect(prevented.getAuditState().procedure.stage).toBe("FAILED");
    expect(prevented.getAuditState().enactedLegalSources).toEqual([]);
  });

  it("admits a tie-break only as the configured deputy officeholder's distinct vote", () => {
    const session = createLegislativeSession(configuration);
    reachOtherAmendmentWithCompromise(session);
    session.closeAmendmentRound();
    const ready = session.getAuditState();
    const senateActors = new Set(
      ready.political.organizations.flatMap((organization) =>
        organization.memberships.filter((membership) => membership.chamberId === US_SENATE_CHAMBER_ID).map((membership) => membership.actorId),
      ),
    );
    let index = 0;
    const tiedState: LegislativeRuntimeState = {
      ...ready,
      political: {
        ...ready.political,
        actors: ready.political.actors.map((actor) => {
          if (!senateActors.has(actor.actorId)) return actor;
          const supportive = index++ < 50;
          return {
            ...actor,
            evaluations: actor.evaluations.map((evaluation) => ({
              ...evaluation,
              reservationMinimum: supportive ? 0 : 0,
              reservationMaximum: supportive ? 10 : 0,
            })),
          };
        }),
      },
    };
    const tied = resolveFinalRollCall(tiedState, context);
    expect(tied.procedure.voteOpportunities.at(-1)?.result).toBe("TIE_BREAK_PENDING");
    expect(tied.procedure.approvedVersionByChamber[US_SENATE_CHAMBER_ID]).toBeUndefined();
    const viceAssignment = actorAssignment(US_INCUMBENT_VICE_PRESIDENT_ACTOR_ID);
    expect(viceAssignment.officeId).toBe(US_VICE_PRESIDENT_OFFICE_ID);
    const resolved = castConfiguredTieBreakerVote(
      tied,
      context,
      US_INCUMBENT_VICE_PRESIDENT_ACTOR_ID,
      viceAssignment.id,
      "YEA",
    );
    const opportunity = resolved.procedure.voteOpportunities.at(-1);
    expect(opportunity?.votes).toHaveLength(101);
    expect(opportunity?.votes.at(-1)).toMatchObject({
      actorId: US_INCUMBENT_VICE_PRESIDENT_ACTOR_ID,
      officeId: US_VICE_PRESIDENT_OFFICE_ID,
      tieBreaker: true,
      choice: "YEA",
    });
    expect(resolved.procedure.stage).toBe("IDENTICAL_TEXT");
  });
});

describe("I3 player knowledge, determinism, persistence, hashing, and boundaries", () => {
  it("keeps actor-private state out of the administration projection", () => {
    const session = createLegislativeSession(configuration);
    const playerJson = JSON.stringify(session.getAdministrationView());
    const auditJson = JSON.stringify(session.getAuditState());
    expect(playerJson).not.toMatch(/autonomyKey|reservationMinimum|reservationMaximum|commitmentBreachWillingness/);
    expect(auditJson).toMatch(/autonomyKey|reservationMinimum|commitmentBreachWillingness/);
    expect(session.getAdministrationView().staffOutlook).toEqual({
      likelyYea: 260,
      conditional: 30,
      uncertain: 0,
      likelyNay: 245,
      committed: 0,
    });
  });

  it("restores active commitment, organization action, adopted version, and partial procedure identically", () => {
    const session = createLegislativeSession(configuration);
    const actorId = "us.actor.legislative.house.0101.scaffold";
    session.negotiateWithActor(actorId, { objective: "SUPPORT", terms: {}, conditions: ["exact version"] });
    session.coordinateOrganization(US_DELIVERY_COALITION_ID, US_HOUSE_CHAMBER_ID, "SUPPORT");
    reachOriginAmendmentForAlreadyNegotiated(session, actorId);
    session.requestAmendment(compromiseChanges);
    session.resolveAmendment();
    const before = session.getAuditState();
    expect(before.political.commitments.some((commitment) => commitment.status === "ACTIVE")).toBe(true);
    expect(before.political.organizations.some((organization) => organization.coordinationActions.length > 0)).toBe(true);
    expect(before.agenda.versions).toHaveLength(2);
    expect(before.procedure.stage).toBe("ORIGIN_FINAL_ROLL_CALL");
    const restored = createLegislativeSessionFromSave(session.save(), configuration);
    expect(restored.getAuditState()).toEqual(before);
    session.resolveFinalRollCall();
    restored.resolveFinalRollCall();
    expect(restored.getAuditState()).toEqual(session.getAuditState());
  });

  it("same configuration and actions are deterministic; changing the pinned profile seed changes identity and state", () => {
    const run = () => {
      const session = createLegislativeSession(configuration);
      reachOtherAmendmentWithCompromise(session);
      return session.getAuditState();
    };
    expect(run()).toEqual(run());

    const changedSeed: LegislativeRuntimeSeed = {
      ...US_V0_LEGISLATIVE_SEED,
      profileScaffold: {
        ...US_V0_LEGISLATIVE_SEED.profileScaffold,
        version: "us-v0-actor-profile-scaffold-2-test",
        seed: "different-pinned-profile-seed",
      },
    };
    const unhashed: GovernmentConfiguration<LegislativeRuntimeSeed> = {
      ...configuration,
      identity: {
        ...configuration.identity,
        configurationVersion: "seed-counterfactual",
        scenarioVersion: "seed-counterfactual",
        configurationHash: "0".repeat(64),
      },
      runtimeSeed: changedSeed,
    };
    const changed: GovernmentConfiguration<LegislativeRuntimeSeed> = {
      ...unhashed,
      identity: { ...unhashed.identity, configurationHash: sha256(canonicalConfigurationContent(unhashed)) },
    };
    expect(changed.identity.configurationHash).not.toBe(configuration.identity.configurationHash);
    expect(createLegislativeSession(changed).getAuditState().political.actors).not.toEqual(
      createLegislativeSession(configuration).getAuditState().political.actors,
    );
  });

  it("pins all political content in the declared canonical configuration hash", () => {
    expect(sha256(canonicalConfigurationContent(configuration))).toBe(configuration.identity.configurationHash);
    const changed: GovernmentConfiguration<LegislativeRuntimeSeed> = {
      ...configuration,
      runtimeSeed: {
        ...US_V0_LEGISLATIVE_SEED,
        decision: {
          ...US_V0_LEGISLATIVE_SEED.decision,
          coordinationPressure: US_V0_LEGISLATIVE_SEED.decision.coordinationPressure + 0.01,
        },
      },
    };
    expect(sha256(canonicalConfigurationContent(changed))).not.toBe(configuration.identity.configurationHash);
  });

  it("keeps named content and congressional law constants out of the generic political engine", () => {
    const engine = [
      readFileSync(new URL("../src/sim/political.ts", import.meta.url), "utf8"),
      readFileSync(new URL("../src/sim/legislative-runtime.ts", import.meta.url), "utf8"),
    ].join("\n");
    expect(engine).not.toMatch(/United States|DELIVERY_COALITION|FISCAL_COMPLIANCE_COALITION|REGIONAL_BARGAINING_CAUCUS|us-v0/);
    expect(engine).not.toMatch(/(^|[^0-9_])(435|218|100|51|60|290|67)([^0-9_]|$)/m);
  });
});

const reachOriginAmendmentForAlreadyNegotiated = (
  session: LegislativeSession,
  sponsorId: string,
): void => {
  session.beginSponsorSearch();
  session.seekSponsorship(sponsorId);
  session.introduceBySponsor(sponsorId, actorAssignment(sponsorId).id);
  session.advanceIntroducedProposal();
  session.resolveConsiderationGate();
};

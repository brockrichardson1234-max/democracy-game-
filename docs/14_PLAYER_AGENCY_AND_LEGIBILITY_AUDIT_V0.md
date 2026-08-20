# 14 — Player Agency and Legibility Audit V0

Status: **Commit-6 bounded whole-architecture audit. Findings only; not repair authority.**

Audited authority: `d9b7b12b7d2b02fabc54714322923f23f745ff42`

## 1. Audit purpose

This audit attacks the assembled Architecture V0 from the player-experience side.

The question is not merely whether the simulation can produce the right facts. It is:

> Does the accepted architecture guarantee that the GL0 player has meaningful strategic agency, receives bounded-but-useful information, understands why important processes are changing, and experiences governing rather than passive outcome watching or procedural click spam?

This audit does not choose UI layout, negotiation dialogue, tuning, exact time controls, or implementation code. It reports only BLOCKER/HIGH findings for the consolidated Commit-7 repair.

## 2. Player-control boundary result

The assembled architecture remains strong on player ontology:

- `ControlBinding` is non-canonical session/control state;
- the GL0 binding targets an executive-administration strategic decision surface rather than “the country”;
- player selection changes decision source, not action semantics;
- control permission does not imply legal authority;
- subordinate actors/institutions are not silently player-owned;
- unlawful/contested but actor-attemptable acts can enter the world;
- courts, legislators, states, material outcomes, voters, and turnout remain independently resolved.

No BLOCKER/HIGH was found in the player/world ownership boundary.

## 3. Pre-enactment agency result

The proposal/legislative side is sufficiently constrained for the walking skeleton:

- proposal design contains multiple consequential dimensions;
- choices must create real cost/participation/administrative/material/political tradeoffs;
- bargaining can change provisions/commitments;
- legislators remain individual decision owners;
- blocs/templates may simplify reasoning but cannot directly cast votes;
- the passed law may differ materially from the player's initial proposal;
- bill failure and compromise passage are both required hostile outcomes.

The architecture does not require the final negotiation interaction grammar yet, which is appropriate. A developer-control skeleton can prove the causal seams before production interaction design.

No BLOCKER/HIGH was found here.

## 4. HIGH P/A-01 — The required post-enactment decision is causal but not yet guaranteed to be strategically non-dominant

Commit 1 correctly requires:

> at least one strategically meaningful post-enactment governing decision before the election.

`11` preserves that requirement and says the decision must have real causal consequences through an owned government process.

However, its default examples are currently permissive enough that the implementation could technically satisfy WS-05 with a choice like:

```text
A: spend/add more lawful administrative resources to weak delivery
B: do nothing
```

where A has no meaningful opportunity cost, political downside, legal risk, competing use, or uncertainty.

That would be causal, but it would not prove the intended gameplay property. It would be a dominant “fix the bottleneck” button rather than governing under constraint.

The pre-enactment proposal section explicitly requires nontrivial tradeoffs. The post-enactment section does not freeze the equivalent burden strongly enough.

This matters because the accepted player contract is experiential: enactment must open further governing choices, not merely a causal maintenance action whose correct answer is obvious.

### Required Commit-7 repair

Strengthen only the **acceptance condition** for the required post-enactment choice:

- at least two supported options must trade off genuinely scarce/competing considerations;
- the choice must have a plausible reason not to choose the superficially strongest implementation response;
- the tradeoff may involve fiscal room, administrative capacity, geographic distribution, legal/political risk, opportunity cost, timing, uncertainty, or another already accepted state;
- no new system is required;
- exact options/UI/tuning remain implementation/playtest choices.

Do not design a recurring micromanagement loop. The requirement is one strategically meaningful post-enactment decision, not constant intervention.

**Severity: HIGH.** Without this, the walking skeleton can satisfy the letter of the causal requirement while failing the core governing-agency proof that justified the requirement.

## 5. Information and non-omniscience result

The assembled architecture gives the player a workable bounded knowledge model:

- legitimately known authoritative records may be exact;
- forecasts, polling, and measurements can be uncertain/lagged/revised;
- private actor state and hidden voter truth remain inaccessible;
- direct institutional acts can be known without granting global omniscience;
- player knowledge follows the controlled administration's access/provenance;
- succession does not transfer outgoing private knowledge wholesale.

The distinction between developer/audit truth and player-facing knowledge is explicit in WS-10.

No BLOCKER/HIGH was found here.

## 6. Causal legibility result

The walking-skeleton contract requires a crude-but-real inspection surface capable of explaining, from available information:

- proposal status/known requirements;
- support estimates and uncertainty where known;
- legal/fiscal status;
- program/state participation;
- known administrative bottlenecks;
- known project/material progress;
- forecast-versus-observed/report divergence;
- election/poll uncertainty.

That is sufficient architecture. It does not need final UI design to prove bounded strategic legibility.

No BLOCKER/HIGH was found here.

## 7. Time cadence and interruption result

The time contract successfully avoids both major failure modes:

- routine simulation is not converted into manual confirmation spam;
- meaningful player decisions interrupt before their choice boundary is silently crossed.

Player deliberation does not advance simulation wall-clock time, and coarse advancement cannot skip causal boundaries.

The exact day/week/month cadence remains correctly deferred to skeleton/playtest evidence.

No BLOCKER/HIGH was found here.

## 8. Election agency/legibility result

The election is not architected as a direct housing referendum or approval threshold.

The player can influence but not own:

- material outcomes;
- what gets measured/reported;
- exposure;
- belief;
- attribution;
- salience;
- preference;
- turnout;
- ballots/result.

Baseline politics coexist with housing-driven changes, and polls remain measurements rather than vote truth.

This provides enough uncertainty for politics without severing causality.

No BLOCKER/HIGH was found here.

## 9. Defeat and succession result

The ordinary defeat route is player-legible and architecture-safe:

```text
election result
→ certification/selection
→ entitlement
→ office assignment
→ supported decision surface lost
→ ControlBinding ends
→ world persists
```

The final product's post-defeat playable mode remains deferred, which does not block the walking-skeleton proof.

No BLOCKER/HIGH was found here.

## 10. Audit verdict

**REVISE**

- **0 BLOCKER**
- **1 HIGH**

Commit 7 should strengthen the post-enactment decision acceptance condition so that one real tradeoff is proven without expanding the skeleton into recurring micromanagement.

This audit does not authorize code or an isolated repair before the consolidated Commit-7 step.

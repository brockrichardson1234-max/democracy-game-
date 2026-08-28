# Step 5 Systems Contract Addendum

Status: **PRODUCT-ASSESSMENT REPAIR CANDIDATE — PRESERVED FOR REVIEW. NOT ACCEPTED PRODUCT, ARCHITECTURE, ROADMAP, EARLY-ACCESS SCOPE, SCHEMA, RUNTIME, OR IMPLEMENTATION AUTHORITY.**

This addendum preserves `04_FOUR_YEAR_PRESIDENTIAL_GAME_DESIGN.md` and `05_STEP5_ADVERSARIAL_AUDIT.md` unchanged. It does not replace either document. It repairs only the contracts that the audits found insufficiently proven.

Frozen assessment boundary:

- Accepted production baseline used by the assessment: `44c1724962830225e6fc34f41d0df0cfdb7dfec0`
- Entirely unaccepted Stage 1 candidate: `a7e04ca78ba1ccb06d8dc3a4dfb0d43389804144`
- Step 5 candidate: `903f82c2b2edebf9c0fe989c678e2c1b789f65d8`
- Step 5 adversarial audit: `3c1501558ebbb13e60dbfb93a1b2241e3b8f14b2`

This document contains **no implementation order, Early Access subtraction, technical schema, runtime recommendation, or roadmap**.

---

# Evidence labels

Every substantive claim in this addendum belongs to one of four classes.

- **[RF — Repository fact]**: supported by preserved repository evidence or prior accepted assessment reconstruction.
- **[ER — External research]**: supported by an external source cited in Section 9.
- **[DI — Design inference]**: a proposed product contract derived from the evidence; not yet authority.
- **[UQ — Unresolved question]**: deliberately left for later design or proof.

A design inference is not promoted into repository fact merely because it is written here.

---

# 1. Scope and retained hypothesis under repair

## 1.1 Retained hypothesis

**[DI]** The surviving Step 5 hypothesis is:

> A deep U.S. presidential strategy game can be organized around **presidential prioritization under concurrent institutional pressure** in a dated world where autonomous actors, material systems, legal processes, information, elections, and persistent history continue whether or not the President is currently focused on them.

This is a **retained hypothesis under repair**, not a provisionally accepted product direction. This addendum is allowed to falsify it.

## 1.2 Concepts retained for testing

The following Step 5 concepts survive both audits strongly enough to remain the repair baseline:

- **[RF]** The accepted architecture already provides dated scheduling, bounded executive control, autonomous actors, persistent elections/succession, causal owner separation, population, information, courts, public finance, and a deep Housing proof.
- **[DI]** Player-facing time should preserve daily dated continuity without requiring one player turn per day.
- **[DI]** The default rhythm should be event/attention driven rather than fixed monthly turns.
- **[DI]** Workstreams should be player-facing projections over canonical state, never replacement world owners.
- **[DI]** Political issues should be perspectival projections over durable domains, conditions, actor attention, information, and public salience; there is no canonical Top Five Issues object.
- **[DI]** Other political actors should initiate action rather than existing only to answer presidential requests.
- **[DI]** Opportunity cost should come from contextual institutional contention rather than a universal Political Capital or Attention currency.
- **[DI]** History should persist through election and succession and remain meaningful after the player's ControlBinding ends.

## 1.3 Claims withdrawn from Step 5 pending proof

The addendum withdraws the following as asserted conclusions:

- **[DI]** `100–160 meaningful decisions per first term` is no longer an asserted cadence target. It becomes an unvalidated hypothesis.
- **[DI]** Worlds A/B/C are no longer a generated-prehistory proof. They are **world-shape exemplars**.
- **[DI]** The 25-decision four-year term is no longer a systemic-generation proof. It is a **target-experience trace**.
- **[DI]** January 20, 2033 remains a leading start-date hypothesis, not a preferred/recommended start until generated-prehistory proof passes.

---

# 2. Resource-specific contention contract

## 2.1 Core invariant

**[DI — HARD INVARIANT]** No aggregate `attention`, `capacity`, `overextension`, `agenda slot`, or `political capital` value may causally resolve whether a presidential initiative advances, stalls, degrades, or crowds out another initiative.

A player may see summaries such as “Legislative Affairs is overloaded” or “two floor windows collide,” but those summaries must be derived from specific contested resources and records.

## 2.2 Contention family: congressional opportunity

**Owner:** Congress and its relevant chambers, committees, leaders, members, calendars, and procedures.

**Contended objects:**

- committee hearing/markup windows;
- floor scheduling windows;
- amendment opportunities;
- confirmation time;
- appropriations or must-pass vehicles;
- member willingness to spend political risk;
- leadership willingness to prioritize one item over another.

**Player actions that can create contention:**

- request leadership priority for a bill;
- press a committee chair for a hearing;
- pursue two major bills through the same limited chamber window;
- insist on a floor amendment that consumes time or support;
- prioritize nominations over legislation;
- accept or reject sequencing commitments.

**Observable consequences:**

- another bill loses its available window;
- a committee offer expires;
- leadership refuses simultaneous priority;
- a member conditions support on sequencing;
- a nomination is delayed;
- an autonomous congressional initiative takes the floor first.

**Anti-spam rule:** repeatedly asking every member/leader for priority cannot create infinite independent chances. Requests occur against actor memory, existing commitments, calendar state, and the same institutional opportunities.

## 2.3 Contention family: White House staff assignments

**Owner:** the administration offices and senior staff responsible for the work.

**Contended objects:**

- named or role-bounded senior staff responsibility;
- active negotiation assignments;
- review queues;
- preparation deadlines;
- cross-team coordination obligations.

**Player action:** assign or elevate a workstream, redirect a staff lead, demand a faster review, or intervene personally.

**Observable consequence:**

- a different negotiation receives less follow-up;
- a memo arrives later;
- confidence is lower because less verification was completed;
- a cross-agency dispute is not resolved before a deadline;
- staff explicitly recommends dropping or delegating another task.

**Anti-hidden-meter rule:** “staff overload” cannot be a generic penalty keyed to number of Presidential Push labels. It must be attributable to actual overlapping assignments and deadlines.

## 2.4 Contention family: agency and OMB work

**Owner:** the relevant agency, OMB/fiscal-control institution, or interagency process.

**Contended objects:**

- statutory reviews;
- rulemaking/review work;
- implementation guidance;
- apportionment/budget review;
- legal review;
- technical-assistance work;
- grant/program administration;
- emergency reassignment of personnel or expertise.

**Player action:** direct priority, request accelerated work, alter implementation emphasis, add emergency tasks, seek regulatory change, or demand additional review.

**Observable consequence:**

- queue ordering changes;
- an optional task slips while a mandatory one remains protected;
- quality/confidence of an accelerated product is visibly lower where appropriate;
- a rule misses a desired—not secretly statutory—political window;
- implementation service elsewhere slows because the same institutional capability is reassigned.

**Hard limit:** statutory duties and external deadlines cannot be silently discarded merely because the President set another priority.

## 2.5 Contention family: presidential calendar

**Owner:** the presidency/White House scheduling process, subject to known external deadlines.

**Contended objects:**

- personal bargaining sessions;
- Cabinet/security meetings;
- major public addresses;
- travel/campaign time;
- emergency response sessions;
- nomination/interview decisions;
- direct governor or congressional engagement.

**Player action:** choose where the President personally intervenes.

**Observable consequence:**

- a meeting cannot occur in two places at the same time;
- another actor proceeds without presidential engagement;
- a bargaining window expires;
- a campaign appearance is skipped;
- staff handles the matter under delegated authority;
- an unresolved issue returns later with changed facts.

**Anti-micromanagement rule:** the game does not require an hourly presidential diary. Only calendar conflicts that create strategic consequence become player-facing.

## 2.6 Contention family: commitments and relationship credibility

**Owner:** the actors/organizations participating in each commitment and their political memory.

**Contended objects:**

- sequencing promises;
- policy concessions;
- support commitments;
- public/private credit agreements;
- promises to governors or factions;
- campaign commitments.

**Player action:** make, revise, honor, breach, defer, or refuse a commitment.

**Observable consequence:**

- access changes;
- another actor's confidence changes;
- support becomes more or less conditional;
- breach becomes a public or private political fact;
- the same concession cannot be promised incompatibly to multiple actors without risk of discovery/conflict.

**Hard invariant:** relationship consequence is not an invisible generic reputation score. It must be traceable to memories, commitments, actions, and relevant context.

## 2.7 Contention family: fiscal authority and fiscal room

**Owner:** laws, Treasury/public-finance owners, OMB/fiscal control, Congress, and program owners as applicable.

**Contended objects:**

- enacted budget authority;
- receipts/revenue choices;
- mandatory commitments;
- discretionary appropriations;
- debt service;
- emergency spending;
- multiyear obligations;
- implementation capacity attached to spending.

**Player action:** propose financing, accept a narrower program, seek revenue, borrow within lawful fiscal outcomes, trade spending priorities, accept a CR/appropriations compromise, or delay a promise.

**Observable consequence:**

- another initiative becomes harder to finance;
- a deficit/debt-service trajectory changes;
- Congress demands offsets or narrower scope;
- implementation starts later or smaller;
- emergency spending changes later bargaining.

**Hard invariant:** money is not a universal action-point currency and enactment does not equal execution.

## 2.8 Contention family: legal authority and legal timing

**Owner:** statutes, regulations, executive authority, agencies, courts, and legal-service institutions.

**Contended objects:**

- available statutory authority;
- procedural prerequisites;
- filing/appeal deadlines;
- injunctions/stays;
- compliance deadlines;
- uncertainty in interpretation;
- scope of delegated authority.

**Player action:** use an available authority, seek legislation, narrow action, comply, appeal, wait, or deliberately accept expiration.

**Observable consequence:**

- an option becomes unavailable after a deadline;
- action remains possible but riskier after a ruling;
- implementation is constrained;
- a court or opposing actor independently resolves the dispute.

## 2.9 Contention family: communication and public attention

**Owner:** speakers, media/information actors, distribution channels, audiences, and population response—not the President alone.

**Contended objects:**

- message clarity;
- channel/audience exposure;
- competing claims;
- finite high-profile presidential appearances;
- timing against other developments.

**Player action:** emphasize, rebut, delegate, release evidence, target an audience, or stay silent.

**Observable consequence:** competing messages coexist; some audiences receive one and not another; public interpretation can diverge.

**Hard invariant:** there is no hidden “message bandwidth” meter that directly subtracts persuasion because several messages exist. Any dilution must arise through exposure, competing claims, actor/media selection, contradictory commitments, or limited presidential communication opportunities.

## 2.10 Anti-spam falsification tests

A valid design must survive all of these paper tests:

1. **Launch everything:** Player labels seven initiatives Presidential Push. Result must be specific conflicts, not `-X% efficiency`.
2. **Contact everyone:** Player tries repeated outreach to every potentially relevant legislator. Actor memory, access, calendar, and shared institutional opportunities prevent infinite independent rolls.
3. **Accelerate everything:** Player requests urgent review from multiple agencies. Mandatory queues, staff assignments, and explicit tradeoffs determine what slips.
4. **Promise everyone:** Incompatible commitments generate discoverable political conflict rather than free support.
5. **Message everything:** The President makes multiple public claims. Exposure and contradiction, not a generic penalty, determine political effects.

---

# 3. Attention, delegation, and inaction contract

## 3.1 Information-bounded escalation invariant

**[DI — HARD INVARIANT]** No canonical state becomes a presidential interruption merely because an omniscient system judges it important.

Every presidential attention item must follow:

```text
canonical occurrence
→ observable artifact or communication
→ administration receipt
→ bounded interpretation / escalation
→ presidential decision surface
```

Examples:

- unemployment changes → scheduled measurement → Labor/CEA receives release → staff assessment → escalation;
- governor opposes program → governor communication/public statement → intergovernmental affairs receives → escalation;
- court acts → court notice → DOJ/agency receipt → legal assessment → escalation;
- hidden legislator defection → no interruption until whip/member/press information reaches the administration;
- material project failure → no interruption until responsible owner reports it or another observable consequence exposes it.

## 3.2 Valid escalation sources

A matter may reach the President because:

1. **Authority-required escalation:** only the President can lawfully or institutionally make the decision.
2. **Delegation threshold:** prior presidential instructions require staff to return when a configured condition is observed.
3. **Known deadline/window:** a known opportunity or legal deadline is approaching.
4. **Cross-owner conflict:** delegated actors cannot resolve incompatible objectives within their authority.
5. **Player watch instruction:** the player requested review if specified observable conditions occur.
6. **Senior-staff judgment:** a bounded adviser escalates based on information available to that adviser.

The sixth category remains fallible. Staff can overreact, miss something, or disagree.

## 3.3 Attention packet provenance

Every player-facing interruption must be able to answer:

- Who or what nominated this for attention?
- What artifact or communication was received?
- When was it received?
- What does the administration know?
- What remains uncertain?
- Why is presidential involvement requested?
- What happens if the President does nothing?
- What is the deadline, if any?

If those questions cannot be answered, the interruption is invalid.

## 3.4 Delegation contract

A delegated workstream must have, conceptually:

- an objective;
- a responsible administration owner;
- the authority that owner may use;
- standing priorities or constraints;
- reporting/escalation thresholds;
- known deadlines;
- what the owner may decide without the President.

Delegation is not “autoplay this quest.” The owner continues to act according to its authority, incentives, information, and capacity.

## 3.5 Inaction and default contract

**[DI — HARD INVARIANT]** No decision may permanently freeze simulation merely because the player refuses to click an option.

Every decision surface must define either an expiration or a default consequence.

Valid defaults include:

- standing policy continues;
- prior guidance remains operative;
- staff acts within delegated authority;
- a congressional offer lapses;
- a nomination window closes;
- a statutory deadline passes and creates the legal consequence of non-action;
- another actor proceeds independently;
- an available appeal or filing expires;
- no public response is issued;
- the matter is deferred and may return later.

Where law requires an affirmative presidential act to achieve a particular result, non-action records the lawful consequence rather than stopping time forever.

## 3.6 Multiple simultaneous attention items

Several matters can reach the President on the same date.

They should be presented as one attention packet grouped by source/deadline, not as arbitrary pop-up order.

Ordering principles:

1. same-day legally expiring actions;
2. other explicit deadlines/windows;
3. authority-required decisions without immediate expiry;
4. strategic opportunities;
5. major reviews;
6. player-requested low-threshold notices.

This ordering is presentation only. It does not create causal priority in the world.

---

# 4. Situation-to-decision grammar

The Step 5 target experience only counts as systemic gameplay if decision discovery, option derivation, and outcome resolution remain distinct.

## 4.1 Stage A — decision discovery

```text
world owner changes state or autonomous actor acts
→ observable record / message / measurement exists
→ administration actor receives it
→ administration evaluates against authority, delegation, deadlines, and objectives
→ presidential involvement is requested or player proactively opens review
```

A designer cannot directly create `PRESIDENTIAL_DECISION: EMPLOYMENT_CRISIS` merely because a condition crossed a hidden importance threshold.

## 4.2 Stage B — option derivation

Each option must be derivable from current state.

For every option the player sees, the game must be able to explain:

- **authority:** why the President/administration may attempt it;
- **institutional route:** legislation, executive direction, administration, appointment, fiscal proposal, litigation, communication, diplomacy/security action, or deliberate inaction;
- **target:** which actor/institution/state/program is being asked or directed;
- **timing:** why the action is available now;
- **prerequisites:** what records/authority/support must already exist;
- **known constraints:** deadlines, fiscal/legal limits, commitments, staff/agency contention;
- **known uncertainty:** what staff cannot predict;
- **default/inaction:** what occurs if no option is selected before expiry.

**Hard invariant:** no option may exist merely because a designer wanted a balanced three-button menu.

## 4.3 Stage C — outcome resolution

```text
player selects or defaults an administration attempt
→ attempt becomes canonical record
→ target/owner receives attempt where applicable
→ autonomous owners resolve their own decisions
→ material/legal/fiscal/information consequences occur through their owners
→ later observation may return to administration
```

A presidential option may fail, partially succeed, be transformed by another institution, or succeed politically while failing materially.

## 4.4 Example provenance: Senate sequencing offer

**Occurrence:** Senate leadership owns a constrained floor calendar and competing legislative agenda.

**Communication:** leader communicates that an industrial bill can receive March floor time if healthcare action is deferred.

**Receipt:** Legislative Affairs receives and records the offer.

**Escalation:** offer expires before leadership finalizes schedule and conflicts with a campaign commitment.

**Derived options:**

- accept sequencing commitment;
- reject it;
- counteroffer another sequence;
- pursue House healthcare work without Senate commitment;
- let the offer lapse.

No option exists because “five choices is good design.” Each follows an available political route.

**Resolution:** Senate leadership remains free to honor, revise, or withdraw its scheduling decision consistent with its own state and later events.

---

# 5. Counterfactual term evidence

## 5.1 Reclassification

The existing Step 5 Section 30 is retained unchanged but reclassified by this addendum as a **target-experience trace**.

The following forks test whether key decisions can create divergent but coherent later dilemmas without requiring an entirely different authored story.

## 5.2 Decision 6 fork — Senate sequencing commitment

Shared state:

- industrial-employment package has a plausible Senate route;
- healthcare repair remains a campaign commitment;
- Senate leader offers March floor time if healthcare floor action waits until May;
- unemployment is worsening;
- fiscal room is tighter after the revised package.

### Branch 6A — accept sequencing

Immediate records:

- administration/leader sequencing commitment;
- healthcare allies observe deferment;
- industrial bill receives preferred floor path.

Later divergence:

- industrial bill can reach April passage;
- healthcare returns in May under changed implementation/fiscal state;
- progressive trust weakens but labor-employment coalition strengthens.

### Branch 6B — reject sequencing

Immediate records:

- no sequencing commitment;
- Senate leader does not reserve March floor time;
- healthcare remains politically available.

Later divergence:

- industrial bill stays in committee/leadership limbo longer;
- House may move healthcare first;
- worsening employment can cause vulnerable senators to create their own alternative employment package;
- the President may later support, oppose, or attach provisions to that autonomous package.

Reconnection point:

Both branches can reach summer 2033 with healthcare and employment still active, but with different enacted-law state, relationships, and congressional ownership. No branch needs a different bespoke event chain.

### Branch 6C — counteroffer

The President offers healthcare committee work now but no floor demand until April.

Possible autonomous response:

- leader accepts narrower commitment;
- leader rejects and spends March floor time on an autonomous defense/appropriations measure.

This branch demonstrates that Congress can consume the opportunity even when the President refuses the offered binary.

## 5.3 Decision 14 fork — implementation rescue versus Housing launch

Shared state:

- two states are failing to deploy industrial-law grants because of administrative weakness;
- Housing proposal is ready for launch;
- the same senior OMB/intergovernmental staff are required for intensive rescue and launch preparation;
- no magical rule forbids doing both.

### Branch 14A — rescue first

- targeted technical assistance is elevated;
- Housing launch slips;
- industrial implementation becomes more likely to meet near-term milestones;
- Housing coalition actors become less confident in presidential priority.

### Branch 14B — Housing launch first

- Housing coalition work proceeds on schedule;
- industrial rescue remains delegated at lower intensity;
- one weak-capacity state misses a program milestone;
- governor criticism and later oversight become more likely;
- the President gains an earlier Housing committee window.

### Branch 14C — loosen rules nationally

- faster deployment is possible in more states;
- oversight/quality risk rises;
- some governors welcome flexibility;
- organizations concerned with compliance mobilize;
- later scandal/IG risk has a different causal provenance than Branch A/B.

Reconnection point:

All branches can face the same later annual budget process, but the budget memo now contains different implementation obligations and political claims.

## 5.4 Decision 19 fork — govern versus campaign

Shared state:

- a Housing bargain is close but not secured;
- several allied candidates request presidential campaign time;
- one pivotal senator is still uncertain;
- midterm election is approaching.

### Branch 19A — govern

- President spends the week on Housing negotiations;
- allied campaigns lose presidential appearances;
- Housing may still pass or fail autonomously.

### Branch 19B — campaign

- Legislative Affairs continues negotiations without the President;
- campaign allies receive help;
- senator may accept staff-level deal, demand presidential involvement later, or defect;
- midterm outcomes may improve in some races while Housing loses timing.

### Branch 19C — delegate campaign surrogate

- Vice President/party actors campaign;
- President remains in Washington;
- campaign effect differs by region/coalition;
- the VP's own political standing changes.

No branch guarantees the bill or election result.

## 5.5 Non-occurrence path — no cyberattack

The March cyber disruption in the target trace is **not required**.

If the external shock is not admitted:

- the President keeps several additional days for industrial bargaining;
- committee text may still change because committee actors negotiate autonomously;
- a party-faction revolt over the labor provision can become the central interruption instead;
- national-security fiscal demand does not appear;
- later budget pressure is lower.

The term remains strategically coherent.

## 5.6 Non-occurrence path — no hurricane

If no qualifying hurricane/disaster occurs in September:

- emergency supplemental spending does not displace Housing;
- Housing may receive an earlier floor opportunity;
- annual budget negotiations contain less emergency spending;
- a separate autonomous congressional appropriations dispute can still create fiscal contention.

A disaster is therefore not needed to manufacture a dramatic calendar collision.

## 5.7 Reordered-development robustness

Test ordering:

1. healthcare court notice arrives before the unemployment deterioration;
2. unemployment report arrives after committee hearing rather than before it;
3. governor implementation failure appears before Housing proposal readiness.

The design remains coherent because each workstream keeps its own state, deadline, owner, and escalation path. Reordering changes what opportunity costs are present at the time of each decision; it does not require a scripted master sequence.

## 5.8 Strategic pluralism test

From the same employment/healthcare opening, at least three rational governing philosophies exist:

### Legislative maximalist

- refuses early sequencing concession;
- keeps healthcare and employment both politically active;
- accepts greater calendar and coalition risk for more ambitious statutory outcomes.

### Institutional incrementalist

- accepts sequencing;
- uses delegated healthcare administration;
- pursues narrower bipartisan fixes after the flagship bill.

### Executive/federalist experimenter

- avoids an early giant bill;
- uses lawful administrative programs and state partnerships;
- waits for better data and a different Congress window.

Each can plausibly succeed in some dimensions and fail in others. None is designated the responsible answer.

## 5.9 Autonomous domestic disruption proof

A major disruption need not come from a storm, cyberattack, or other exogenous shock.

Example reusable domestic path:

- bipartisan Senate group introduces its own fiscal-restraint package;
- package contains rescissions from programs the President supports;
- House opposition leadership embraces it as a governing wedge;
- several governors support the package because it preserves state flexibility;
- the bill gains enough independent momentum to consume the same floor window the President wanted for Housing.

The President must decide whether to veto-threaten, bargain, attach priorities, allow passage, or redirect their own agenda.

The initiating action belongs to Congress and other actors, not the President.

---

# 6. Generated-prehistory contract

## 6.1 Status of A/B/C

Worlds A, B, and C from Step 5 are **world-shape exemplars**, not outputs of a proven generator.

World B's contradiction is corrected for this addendum as follows:

> A Democratic administration won in **2028** and governed through 2032. Its healthcare expansion failed in the Senate, while energy/transmission and infrastructure laws passed. In the **2032 election**, the player inhabits a plausible Republican victorious campaign history; there is no separate Democratic presidential victory in 2032.

The original Step 5 file remains unchanged; this addendum controls the correction for re-audit.

## 6.2 Compressed-process principle

**[DI]** Prehistory may operate at lower/selective resolution than active play, but compression may remove intermediate detail only; it may not reverse canonical ownership.

A compressed process is valid when:

- the correct institution/actor owns initiation and resolution;
- prerequisites are preserved;
- important competing alternatives can fail;
- outputs create the same category of canonical records active play would inherit;
- downstream state consumes those outputs rather than a separate hidden story flag.

## 6.3 Elections and offices

Prehistory must preserve:

- scheduled election boundaries;
- separate presidential, House, Senate, and relevant state elections;
- electorate/population inputs;
- candidate/party context;
- declared results;
- office assignments and term dates.

**Anti-nonsense invariants:**

- one actor cannot canonically occupy incompatible offices simultaneously unless rules explicitly allow it;
- no administration exists without a valid election/succession/assignment route;
- congressional composition must reconcile with district/state election results;
- no 2032 presidential outcome may contain two different winners.

## 6.4 Legislation

A compressed major-law process must preserve at least:

- initiating actor/institution;
- proposal/policy direction;
- relevant congressional control and pivotal opposition/support;
- whether the proposal failed, expired, was vetoed, overridden, or enacted;
- material legal terms needed by downstream domains;
- enactment date/source.

It need not preserve every speech or routine amendment.

**Hard invariant:** a prehistory generator cannot select “health reform exists in 2033” and then fabricate a legislative history after the fact.

## 6.5 Appointments and courts

Prehistory must preserve:

- vacancies or succession causes;
- nomination/appointment route;
- confirmation where required;
- resulting office assignment;
- major rulings/orders that materially affect inherited authority;
- active cases that survive into 2033.

Court outcomes must not be chosen merely to make the opening interesting.

## 6.6 Fiscal history

Prehistory must reconcile:

- enacted revenue/spending changes;
- mandatory commitments;
- discretionary authority at an appropriate aggregate level;
- emergency spending;
- debt-service trajectory;
- major multiyear obligations.

**Anti-nonsense invariant:** the opening fiscal position must be arithmetically and legally compatible with the major laws and emergencies preserved in history.

## 6.7 Program implementation

Compressed implementation can use milestones rather than every administrative transaction.

It must preserve where politically/materially relevant:

- legal authority;
- funding availability;
- administering institution;
- state/recipient participation;
- implementation progress/failure;
- regional heterogeneity;
- material outcome/measurement relationship;
- unresolved obligations.

**Hard invariant:** enactment cannot directly write the 2033 material result.

## 6.8 Party factions and actor careers

Factions may evolve through:

- actor entry/exit/election;
- repeated issue alignment;
- leadership contests;
- coalition success/failure;
- public/electoral changes;
- organization relationships.

**Anti-nonsense invariants:**

- factions cannot teleport ideology/priority without traceable political change;
- actor career histories must reconcile with offices and elections;
- important relationships must have plausible prior interaction records.

## 6.9 Durable conditions

Condition domains evolve independently of whether politics is paying attention to them.

Political salience may respond to conditions, but salience never writes the condition value.

Prehistory must preserve sufficient trend history for the opening to distinguish:

- current level;
- recent direction;
- geographic/group exposure;
- measurement uncertainty where relevant;
- major known policy/shock contributors.

## 6.10 Shock families

External or low-frequency shocks may be configured families.

Admission must depend on world eligibility, timing/frequency rules, exposure, and seed—not on a story director deciding the term needs drama.

Downstream consequences then belong to ordinary domains/institutions.

## 6.11 Historical memory and salience

Not every past fact survives into the opening briefing.

A fact remains politically load-bearing when it still affects one or more of:

- law/program state;
- material conditions;
- fiscal obligations;
- actor relationships;
- party/faction conflict;
- active litigation;
- public beliefs/salience;
- current campaign commitments;
- institutional composition.

Routine history can be summarized or discarded from active presentation without deleting durable canonical effects.

## 6.12 January 2033 reconciliation gate

Before a generated world is eligible for player setup, it must reconcile:

- all occupied offices and term dates;
- Congress and party/faction composition;
- legal sources and active authorities;
- fiscal position and obligations;
- program implementation;
- court composition/cases/orders;
- state/federal relationships;
- population/electoral state;
- condition trends;
- surviving political memories/commitments;
- all load-bearing opening claims.

Every load-bearing opening statement must have causal provenance.

Example:

```text
“Healthcare subsidy costs are above the 2029 forecast”
→ enacted 2029 program terms
→ state enrollment/implementation records
→ fiscal outlay history
→ official measurement/forecast comparison
→ 2033 briefing claim
```

## 6.13 Prehistory falsification tests

A future paper/many-seed proof must reject generated histories that contain:

- contradictory election winners;
- impossible office overlaps;
- laws without legislative/presentment provenance;
- material outcomes written directly from laws;
- fiscal state inconsistent with preserved laws/obligations;
- court rulings without a proceeding;
- identical political issue bundles across most seeds;
- too many simultaneous “major” crises to remain plausible;
- actors with relationships but no interaction history;
- 2033 briefings that cannot explain why a load-bearing fact exists.

Until these tests are passed by a formal paper generator or implemented generator, **2033 remains unproven**.

---

# 7. Campaign-causality contract

## 7.1 Clarification: setup is not a campaign-to-win game

**[DI]** The standard governing start should transparently construct **which plausible victorious campaign history the player inhabited**.

The compressed campaign/setup exists to create political identity, promises, relationships, coalition shape, and governing inheritance. It is not secretly a full campaign simulator whose loss state is suppressed.

## 7.2 Winning-feasibility envelope

Before candidate presentation, the generated 2032 environment must establish a feasible victory envelope.

A candidate/history is eligible only if at least one plausible winning path exists without requiring:

- impossible turnout;
- impossible party switching;
- an opponent collapse invented after the player's choice;
- contradictory state results;
- congressional outcomes chosen solely to help the player.

**[UQ]** Exact quantitative plausibility bounds are not set here.

## 7.3 Candidate and nomination semantics

The player chooses among **generated viable nominee histories**, not arbitrary people whose prior history is rewritten after selection.

Conceptually:

```text
pre-2032 world
→ generated party nomination field and candidate careers
→ bounded nomination outcomes / viable nominee histories
→ player chooses which viable victorious-history branch to inhabit
→ bounded identity customization
→ mandate-formation choices
→ exact victorious general-election history resolved within feasibility envelope
```

This is a meta-level setup choice over plausible histories. It does not claim the player personally controlled every primary event.

## 7.4 What campaign/setup choices change

Because the governing premise guarantees a plausible presidential victory history, the setup choices primarily alter:

- campaign commitments;
- coalition composition;
- geographic margin;
- turnout composition;
- relationships with factions/organizations;
- running-mate coalition effects;
- vulnerabilities and controversies;
- mandate interpretations;
- governing expectations;
- shared electoral environment that may influence—but never directly choose—congressional races.

A “bad” campaign/setup choice costs future governing position, not necessarily the existence of inauguration.

## 7.5 Congressional election separation

House and Senate elections remain separately owned.

The presidential campaign may affect shared causes such as turnout, party enthusiasm, national conditions, or coordinated campaign activity, but it cannot directly set `Congress = favorable` as a reward for presidential performance.

## 7.6 Campaign falsification tests

Reject a setup if:

- the selected candidate requires miraculous turnout to win;
- the opponent is weakened only after the player makes an implausible choice;
- congressional results are selected to match a desired presidency;
- the player's candidate history contradicts prehistory;
- the winning coalition cannot be reconciled with the electorate/population state;
- all campaign choices converge to nearly identical coalitions/mandates.

---

# 8. Presidential record and autonomous-country contract

## 8.1 No aggregate Presidency Score

**[DI — HARD INVARIANT]** The game should not collapse a completed term into one authoritative score for governing quality.

The term record should separate at least:

### Campaign commitments

- fulfilled;
- partially fulfilled;
- compromised;
- abandoned;
- blocked by another institution;
- still implementing;
- superseded by later conditions.

### Governing acts

- major laws signed/vetoed;
- executive/administrative directions;
- appointments;
- major negotiated commitments;
- legal strategies;
- fiscal agreements.

### Material and social record

- condition trajectories during the term;
- geographic/group variation;
- measured policy-linked outcomes where evidence supports attribution;
- outcomes with attribution explicitly uncertain.

### Implementation inheritance

- programs functioning;
- programs delayed/failing;
- unresolved obligations;
- rules/waivers still active;
- projects/processes continuing into next term.

### Fiscal inheritance

- receipts/spending trajectory;
- deficit/borrowing outcome;
- debt service;
- emergency spending;
- multiyear obligations inherited by successor/second term.

### Institutional record

- appointments and vacancies;
- court/legal precedents or unresolved cases;
- contested executive actions;
- intergovernmental agreements/conflicts;
- changes to institutional practice where modeled.

### Political coalition record

- relationships built/damaged;
- factions strengthened/weakened;
- governors/organizations allied or opposed by issue;
- party congressional position.

### Electoral record

- midterm results;
- presidential reelection/defeat;
- turnout/coalition changes;
- state/regional political shifts.

### Crisis and national-security record

- crises encountered;
- authorities used;
- measurable outcomes;
- unresolved consequences.

The record may present competing interpretations from allies, opponents, historians/media, or staff. No interpretation owns objective “presidential greatness.”

## 8.2 Autonomous-country initiative contract

A living country must generate important work the President did not request.

Required initiative families include:

- **Congress:** member/committee/leadership bills, investigations, appropriations, confirmations, procedural fights.
- **Governors/states:** policy compacts, lawsuits, implementation coalitions, state experiments, emergency requests.
- **Party/factions:** leadership contests, endorsements, rebellion over priorities, primary threats, internal agenda changes.
- **Opposition:** investigations, alternative legislation, messaging strategies, coalition-building.
- **Agencies/institutions:** legally required actions, implementation findings, enforcement matters, reports, disputes within delegated authority.
- **Organizations/public actors:** mobilization, demands, support/opposition, claims.
- **Courts:** independent case resolution.
- **External actors:** diplomatic/security/economic moves when that world layer exists.

**Hard invariant:** the majority of political actors cannot exist primarily as responders waiting for presidential requests.

## 8.3 Autonomous-country paper test

A 90-day trace fails if every major attention item can be rewritten as “the President did X, then someone reacted.”

At least some consequential situations must instead have the form:

```text
non-player actor pursues own objective
→ world/institutional state changes
→ administration learns about it
→ President decides whether/how to respond
```

---

# 9. Research and provenance repair

## 9.1 Modern U.S. political calibration — primary sources

**[ER] Pew Research Center, May 1, 2026.** Survey conducted April 20–26, 2026 found 92% of Democratic identifiers had an unfavorable view of the Republican Party and 93% of Republican identifiers had an unfavorable view of the Democratic Party. This supports a strong partisan prior rather than a freely floating median-voter model.

Source: https://www.pewresearch.org/politics/2026/05/01/americans-continue-to-view-both-the-republican-and-democratic-parties-negatively/

**[ER] Pew Research Center, June 10, 2026.** The 2026 Political Typology classifies the public into nine groups using 30 political-value questions, supporting the simultaneous existence of strong partisan orientation and meaningful within/around-party heterogeneity.

Source: https://www.pewresearch.org/politics/2026/06/10/beyond-red-vs-blue-the-political-typology/

**[ER] Gallup, January 12, 2026.** Gallup reported a record-high 45% of U.S. adults identified as political independents in 2025; within the population, 20% were Democratic-leaning independents, 15% Republican-leaning independents, and 10% non-leaners. This supports distinguishing self-identification from partisan lean/behavior rather than treating “Independent” as one homogeneous centrist bloc.

Source: https://news.gallup.com/poll/700499/new-high-identify-political-independents.aspx

## 9.2 Bounded solved-problem review

This review does not copy other games' ontology. It asks what established games have already learned about interruptions, actor legibility, delegation, campaign abstraction, procedural generation, and long-horizon information design.

### Football Manager — delegation and attention routing

**[ER]** Football Manager 26 allows players to assign responsibilities to staff rather than personally execute every management task. Its UI combines key happenings, tasks, messages, news, and a near-term calendar in a Portal, and staff-meeting topics can be delivered in meetings, summarized to inbox, or skipped.

Sources:

- https://www.footballmanager.com/the-dugout/delegating-success-football-manager-26
- https://www.footballmanager.com/fm26/features/fm26s-reimagined-user-interface
- https://www.footballmanager.com/features/individual-player-targets-and-interaction-logic

**[DI lesson]** Presidential delegation should likewise define responsibility and reporting thresholds, and the player should control some information-routing preferences. However, political decisions cannot be delegated merely as convenience if constitutional authority remains presidential.

### Football Manager — contextual workload instead of universal action points

**[ER]** FM recruitment focuses consume specific scouts and can have different priority levels; updates arrive weekly/monthly. The cost is tied to actual assigned personnel, not a universal manager action currency.

Source: https://www.footballmanager.com/features/recruitment-revamp

**[DI lesson]** This supports resource-specific contention: if presidential priorities compete, identify the staff/institutional work being reassigned rather than applying a hidden general overextension modifier.

### The Political Process — campaign feasibility

**[ER]** The Political Process explicitly warns that some elections cannot be won and some legislation cannot be passed; it simulates changing political metrics and candidate/election strategy rather than promising universal viability.

Source: https://store.steampowered.com/app/1184770/The_Political_Process/

**[DI lesson]** A victory-conditioned governing setup needs a prior winning-feasibility envelope. It should not backsolve implausible victories after arbitrary player choices.

### Democracy 4 — useful contrast on political capital

**[ER]** Democracy 4 explicitly assigns political-capital costs to introducing, canceling, raising, or lowering policies.

Source: https://www.positech.co.uk/democracy4/mod_policies.html

**[DI lesson]** That is a coherent solved abstraction for Democracy 4, but it is deliberately not this game's target. Our design must show contextual institutional costs directly and should use Democracy 4's explicit political-capital approach as a falsification contrast: if our “soft concurrency” ends up functioning like an unlabelled universal cost, the repair failed.

### Democracy 4 — useful contrast on event selection

**[ER]** Democracy 4's event manager evaluates event chances every three turns and triggers the highest-scoring event above a threshold.

Source: https://www.positech.co.uk/democracy4/mod_events.html

**[DI lesson]** Our political issues and presidential interruptions should not come from a global event selector choosing one highest-scoring event. They should arise from owner-specific occurrences, observation, receipt, and escalation.

### RimWorld — procedural story director as explicit contrast

**[ER]** RimWorld openly describes its AI Storyteller as analyzing the colony situation and selecting events it thinks will create a good story.

Source: https://rimworldgame.com/

**[DI lesson]** That is appropriate for a story generator, but it is specifically not the proof standard here. A hidden director must not insert unemployment, hurricanes, scandals, or congressional offers because the presidency “needs drama.” Shocks and political initiatives require independent eligibility/actor causality.

### Crusader Kings III — actor legibility and persistent memory

**[ER]** Crusader Kings III presents a world where characters have individual traits/history that guide decisions, and its Friends & Foes material explicitly emphasizes memories, grudges, relationships, and past deeds returning later.

Sources:

- https://www.paradoxinteractive.com/media/press-releases/press-release/long-live-the-king-crusader-kings-iii-now-available
- https://www.paradoxinteractive.com/games/crusader-kings-iii/add-ons/crusader-kings-iii-friends-and-foes

**[DI lesson]** The useful solved problem is not “copy CK3 events.” It is that actors become legible when the player can connect current behavior to specific traits, roles, relationships, and remembered interactions. Senator X should matter because of visible context, not an opaque support number.

## 9.3 Provenance discipline for future assessment

Every later proof artifact should separate:

- repository fact;
- external research;
- design inference;
- unresolved question.

External sources justify calibration/design lessons only. They do not prove that our own game has implemented or solved the feature.

---

# 10. Cadence evidence — exhaustive bounded traces

The prior 100–160 term figure is withdrawn as an asserted target. The following traces test whether the attention contract can produce playable density without daily spam or passive months.

These are paper traces of the contract, not production evidence.

Legend:

- **STOP** — simulation returns to player because a valid attention item exists.
- **PROACTIVE** — player voluntarily opens/intervenes in a matter without an automatic stop.
- **DEFAULT** — an available decision expires or standing delegation acts without presidential input.
- **BACKGROUND** — important world development recorded in the since-last-attention summary but does not stop time.

## 10.1 Trace A — ordinary governing: June 1–August 15, 2033 (76 days)

Starting concurrent state:

- industrial law recently enacted; implementation administration-led;
- narrow healthcare affordability negotiations active;
- Housing proposal development administration-led;
- healthcare litigation pending;
- no qualifying national crisis.

### June 1 — BACKGROUND

Agencies continue industrial-law implementation; no presidential action required.

### June 4 — STOP

**Source:** Senate health negotiator communication received by Legislative Affairs.

**Situation:** negotiator will support affordability provision only if subsidy sunset is shortened; answer requested by June 8.

**Decision/default:** accept, counter, refuse, or allow offer to lapse June 8.

### June 6 — PROACTIVE

Player requests a governor-relations review of healthcare waiver implementation before answering the senator. This is player-initiated; no world truth triggered the stop.

### June 8 — STOP

Governor-relations memo arrives because player requested it. President resolves/counters the Senate offer.

### June 13 — BACKGROUND

Scheduled labor report arrives within forecast range. Labor/CEA summarize it; escalation threshold is not met.

### June 19 — DEFAULT

A routine state healthcare waiver renewal is handled by HHS under standing delegated criteria. It appears in summary; no stop.

### June 24 — STOP

**Source:** Labor and Commerce joint escalation memo.

**Situation:** agencies cannot reconcile a worker-eligibility rule before published guidance deadline under their delegated instructions.

**Decision/default:** choose one interpretation, direct a bounded compromise, extend desired guidance timing if legally available, or allow existing statutory/default interpretation to govern.

### July 2 — BACKGROUND

House passes an autonomous defense procurement bill containing domestic-content rules that could affect industrial implementation. No presentment exists yet; Legislative Affairs adds it to monitor list.

### July 8 — STOP

**Source:** three-governor coalition communication.

**Situation:** governors offer coordinated participation in industrial program if technical-assistance rules are revised by July 18.

**Decision/default:** negotiate, accept bounded flexibility, refuse, or let offer lapse.

### July 12 — BACKGROUND

Opposition lawmakers announce criticism of healthcare waiver policy. Press office responds under standing communication guidance; no presidential escalation.

### July 18 — DEFAULT

In this trace the player deliberately does not reopen the governor offer; it lapses. The coalition proceeds with separate state actions.

### July 25 — BACKGROUND

Official implementation report shows one state behind schedule but within delegated tolerance threshold.

### August 1 — PROACTIVE

Player elevates Housing from Administration-led to presidential review and asks staff for route options. This does not itself guarantee congressional access.

### August 5 — STOP

**Source:** requested Housing strategy memo.

**Decision:** choose legislative route, state/federal administrative route, continue preparation, or hold.

### August 9 — BACKGROUND

OMB forecast revision modestly lowers available fiscal room. It is included in briefing but does not independently demand a presidential decision.

### August 14 — BACKGROUND

Court schedules healthcare argument for October. DOJ adds known future deadline; no current presidential action required.

### Trace A cadence result

Over 76 days:

- automatic attention stops: 5;
- proactive presidential reviews/interventions: 2;
- explicit defaults/delegated outcomes: 2;
- major background developments: 7.

This trace demonstrates that an ordinary period can remain active with roughly one automatic stop every two weeks without using that number as a universal rule.

## 10.2 Trace B — divided government: January 15–March 31, 2035 (76 days)

Starting state:

- opposition controls House;
- Senate remains narrowly opposition-led;
- industrial program implementing;
- healthcare authority disputed in court;
- President has shifted toward implementation, appointments, state coalitions, and narrow legislation.

### January 15 — STOP

**Source:** House committee subpoena received by White House Counsel.

**Autonomous initiative:** opposition committee begins investigation without presidential trigger.

**Decision/default:** comply under ordinary process, negotiate scope, assert available privilege on specified material, or miss deadline and accept legal/political consequences.

### January 20 — BACKGROUND

House passes its own border-security funding bill. Administration policy staff begins review; no presentment and no immediate deadline.

### January 27 — STOP

**Source:** appellate court notice + DOJ/HHS legal assessment.

**Situation:** healthcare administrative authority narrowed; appeal deadline known.

**Decision/default:** appeal, comply and rewrite, seek legislation, or allow appeal window to lapse.

### February 3 — STOP

**Source:** multistate governor coalition proposal.

**Autonomous initiative:** governors announce joint permitting compact and request federal waiver compatibility ruling within 14 days.

**Decision/default:** negotiate compatibility, deny, support bounded experiment, or let requested federal accommodation lapse.

### February 10 — STOP

**Source:** congressional leadership communication after House passes CR with policy riders.

**Decision:** issue veto threat, negotiate, remain publicly noncommittal, or allow staff talks to continue under standing limits.

### February 16 — PROACTIVE

President directs staff to open narrow bipartisan statutory clarification on healthcare rather than wait for Congress to initiate it.

### February 20 — STOP

**Source:** Senate broker offer received by Legislative Affairs.

**Decision:** accept cost-control concession, counter, abandon statutory route, or let offer expire.

### March 1 — BACKGROUND

Labor report changes little. No escalation.

### March 5 — BACKGROUND

Senate passes an autonomous data-privacy bill. Agencies identify implementation implications; no immediate presidential decision.

### March 12 — DEFAULT

Agency program review deadline passes under delegated standing guidance; agency continues existing rule rather than escalating because no threshold was met.

### March 18 — STOP

**Source:** White House personnel/legislative affairs memo.

**Situation:** committee indicates two judicial nominees can receive hearings this month but likely not if delayed into April.

**Decision/default:** prioritize nominees, request other nominees, use calendar for separate legislation, or let the opening close.

### March 27 — STOP

**Source:** passed border-security bill formally presented to President.

**Decision/default:** sign, veto, or take the constitutionally available non-action route with its legal consequence.

### March 31 — BACKGROUND

House investigation issues interim public report; its claims enter information environment and may affect future politics.

### Trace B cadence result

Over 76 days:

- automatic stops: 7;
- proactive interventions: 1;
- defaults: 1;
- major background developments: 4.

Most stops originate from non-player institutional initiative rather than the President launching a new bill.

## 10.3 Trace C — campaign/crisis-heavy: August 15–November 12, 2036 (90 days)

Starting state:

- reelection campaign active;
- industrial implementation record mixed;
- healthcare subsidy method legally vulnerable;
- opposition Congress partly autonomous;
- President has campaign travel scheduled but government continues.

### August 15 — STOP

**Source:** Inspector General report received by agency/White House Counsel.

**Situation:** possible misconduct at one industrial-grant recipient.

**Decision/default:** targeted hold/review, broader suspension, defend current controls, or let delegated enforcement proceed without presidential intervention.

### August 20 — BACKGROUND

Opposition committee independently announces hearing on the grant program.

### August 25 — STOP

**Source:** FEMA/governor emergency requests after major storm landfall.

**Decision:** emergency coordination posture and immediate authority/funding request.

### August 26 — STOP, BATCHED CRISIS SESSION

Multiple agency reports arrive. Instead of separate popups, one presidential session resolves cross-agency conflicts and delegates thresholds for the next 72 hours.

### August 29 — STOP

**Source:** congressional leadership asks administration position on supplemental size before drafting deadline.

**Decision:** large supplemental, narrower request, offsets, or rely more heavily on existing authority.

### September 4 — BACKGROUND

National poll released. Campaign staff summarizes; no automatic presidential stop.

### September 7 — STOP

**Source:** Energy/Transportation operational report.

**Situation:** regional fuel/logistics shortage exceeds previously delegated threshold.

**Decision/default:** temporary measures, seek additional authority, defer to states, or continue current response.

### September 15 — BACKGROUND

Party faction announces it will withhold endorsement unless Housing becomes a second-term commitment. Campaign staff records coalition risk.

### September 17 — PROACTIVE

Player chooses to review second-term commitments now rather than wait for scheduled October platform meeting.

### September 20 — STOP

**Source:** federal court ruling and DOJ/HHS receipt.

**Situation:** healthcare subsidy implementation method threatened after election unless statute changes.

**Decision/default:** appeal, seek immediate legislative fix, redesign administratively where lawful, or accept future expiration.

### September 24 — STOP

**Source:** bipartisan congressional group offers statutory fix with cost-control concession and an October deadline.

**Decision:** endorse, counter, reject, or let coalition proceed without administration support.

### October 2 — STOP

**Source:** intelligence assessment received by national-security team.

**Situation:** moderate-confidence evidence of foreign information operation targeting election narratives.

**Decision/default:** public attribution, quiet defensive measures/allied coordination, law-enforcement response, or wait for stronger evidence.

### October 8 — BACKGROUND

Opposition candidate amplifies grant-scandal criticism. Campaign handles response under delegated strategy.

### October 15 — BACKGROUND

Employment release slightly worse than forecast but not outside staff's configured escalation threshold. It appears in campaign/economic briefing.

### October 20 — DEFAULT

Press office declines to elevate another viral claim because the President previously delegated routine campaign rebuttal; no presidential stop.

### October 28 — STOP

**Source:** healthcare fix presented after congressional passage.

**Decision:** sign/veto/non-action route with known legal consequence.

### November 1 — STOP

**Source:** governor requests emergency presidential visit/coordination after recovery dispute; date conflicts with campaign travel.

**Decision:** go personally, send VP/Cabinet surrogate, conduct remote session, or decline.

### November 4 — STOP / FIXED ELECTION BOUNDARY

Election resolves from electorate, turnout, candidates, conditions, information, and campaign state. The player does not choose the result.

### November 5–12 — BACKGROUND / TRANSITION REVIEW

Government continues. Emergency recovery, legal cases, implementation, and Congress remain active while election certification/transition processes proceed.

### Trace C cadence result

Over 90 days:

- automatic stops: 11, including one batched crisis session and election boundary;
- proactive interventions: 1;
- explicit defaults/delegated non-escalations: 1;
- major background developments: 6.

The trace is dense because crisis, campaign, litigation, and autonomous congressional activity overlap, but routine polling/messages remain filtered.

## 10.4 Cadence conclusion

These traces support only a narrower claim:

> Attention density should emerge from the number and timing of genuinely conflicting observable decisions, not from a fixed monthly quota.

The total meaningful-decision count for a four-year term remains **unresolved pending play evidence**.

---

# 11. Binary re-audit gate

A detached re-audit should answer only:

> **Can every demonstrated presidency-level situation, option, interruption, and consequence be traced to reusable canonical state, bounded information, institutional authority, and autonomous actors—without curated narrative sequencing, hidden universal resources, or omniscient escalation?**

## PASS condition

PASS requires all of the following:

- every contention example names an actual owner/resource/deadline/conflict;
- every interruption has information provenance and a default/expiration;
- every option has authority/route/timing provenance;
- counterfactual branches remain coherent and reconnect without bespoke replacement stories;
- domestic autonomous actors can create central disruptions;
- prehistory has explicit anti-nonsense invariants and causal reconciliation requirements;
- campaign victory remains inside a prior feasibility envelope;
- cadence traces contain no unexplained omniscient stops;
- no hidden universal resource is required to make overextension costly.

If PASS, the repaired Step 5 core may be **explicitly accepted in a separate later authority action**. This addendum does not perform that acceptance.

## REVISE condition

If any contract fails, repair only that failed contract. Do not begin implementation, roadmap work, Early Access scoping, or Living Country/domain-depth design.

---

# 12. Remaining unresolved questions after this addendum

The addendum intentionally does not answer:

1. exact durable-domain set or depth;
2. exact representation of staff/agency organizational capacity;
3. exact quantitative campaign victory-feasibility bounds;
4. exact long-term relationship-memory mechanics;
5. exact media/outlet model;
6. exact prehistory transition frequencies/probabilities;
7. exact fiscal abstraction;
8. exact national-security world depth;
9. exact player-facing UI for workstreams/attention packets;
10. exact four-year decision count or expected real-world playtime.

Those questions remain outside this bounded repair unless the re-audit finds one necessary to prove the contracts above.

---

# Final addendum status

The Step 5 core remains a **retained hypothesis under repair**.

This addendum does not claim that the game is now proven. It supplies the missing product-level contracts and falsification criteria needed for a detached re-audit to decide whether the Step 5 core can finally become product-design authority.
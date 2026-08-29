# Living Country Step 8 — Media, Information Distribution, and Public Belief Contract

Status: **LIVING-COUNTRY STEP-8 DESIGN CANDIDATE — PRESERVED FOR DETACHED REVIEW. NOT ACCEPTED PRODUCT, ARCHITECTURE, MEDIA-AI, PLATFORM, PUBLIC-BELIEF, UI, CALIBRATION, ROADMAP, EARLY-ACCESS, SCHEMA, RUNTIME, OR IMPLEMENTATION AUTHORITY.**

Authority and evidence boundary:

- Accepted production baseline: `44c1724962830225e6fc34f41d0df0cfdb7dfec0`
- Entirely unaccepted Stage 1 candidate: `a7e04ca78ba1ccb06d8dc3a4dfb0d43389804144`
- Accepted Step 5 presidential-game authority: `2c5fc2d798c5fcc232b519052390b56d60f06267`
- Accepted Living Country Step 1 ownership authority: `12_LIVING_COUNTRY_STEP1_CLARIFICATIONS_AND_AUTHORITY.md`
- Accepted Living Country Step 2 material/social-domain grammar: `16_LIVING_COUNTRY_STEP2_COMMON_GRAMMAR_AUTHORITY.md`
- Accepted Living Country Step 3 population/geography authority: `23_LIVING_COUNTRY_STEP3_POPULATION_GEOGRAPHY_AUTHORITY.md`
- Accepted Living Country Step 4 actor-participation authority: `27_LIVING_COUNTRY_STEP4_AUTONOMOUS_ACTOR_AUTHORITY.md`
- Accepted Living Country Step 5 internal-administration authority: `32_LIVING_COUNTRY_STEP5_INTERNAL_ADMINISTRATION_AUTHORITY.md`
- Accepted Living Country Step 6 cross-domain coupling authority: `37_LIVING_COUNTRY_STEP6_CROSS_DOMAIN_COUPLING_AUTHORITY.md`
- Accepted Living Country Step 7 observation/measurement authority: `42_LIVING_COUNTRY_STEP7_OBSERVATION_MEASUREMENT_AUTHORITY.md`
- Assessment branch tip before this candidate: `30e1ab3a06a8716fd574bc89874206915a0d150f`

This is Living Country **Step 8**. It answers:

> **How do autonomous journalists, media organizations, public officials, political organizations, platforms, and other speakers discover or select evidence, investigate, frame, publish, distribute, correct, and amplify information—and how do fragmented populations actually receive, notice, trust, remember, believe, attribute, and make those things salient—without media owning reality, everybody seeing the same news, one global attention score, scripted scandals, or direct approval/election modifiers?**

It does not:

- choose the final media-outlet, journalist, platform, source, audience, or speaker inventory;
- define exact recommendation, ranking, moderation, investigation, persuasion, belief-update, memory-decay, or sharing algorithms;
- define final public-opinion, polling, party, campaign, election, or political-pressure models;
- accept final UI, State-of-the-Nation layout, historical calibration, generated prehistory, Early Access scope, roadmap, implementation order, or a next code proof;
- authorize runtime, schema, source, data, or production changes.

---

# Evidence labels

- **[RF — Repository fact]**: established by accepted repository evidence, accepted assessment authority, or the frozen production baseline.
- **[ER — External research]**: supported by a primary, official, or peer-reviewed source listed in Section 30.
- **[DI — Design inference]**: proposed Step 8 contract requiring detached review.
- **[UQ — Unresolved question]**: deliberately deferred.

A design inference does not become repository fact merely because it appears in this candidate.

---

# 1. Executive design verdict

## 1.1 Central answer

**[DI]** The Living Country information/public-politics layer should be represented as:

> **A provenance-preserving ecology of autonomous speakers, evidence, claims, editorial and investigative choices, publication attempts, channels, platform decisions, audience-specific delivery, recipient attention, trust, memory, belief, attribution, salience, and later political action—not one `NewsSystem`, one `MediaAttention` meter, one narrative director, or one approval modifier.**

The accepted general relationship is:

```text
canonical reality or occurrence
→ bounded evidence, observation, record, testimony, or direct experience
→ speaker, journalist, institution, or organization receives what it can access
→ source/evidence assessment and decision whether to investigate, claim,
  frame, publish, brief, leak, advertise, correct, share, delay, or remain silent
→ canonical communication/publication/distribution attempt
→ versioned information artifact with proposition, evidence, framing,
  claimed confidence, provenance, and derivative lineage
→ outlet/channel/platform admission, ranking, targeting, moderation,
  scheduling, or non-distribution
→ realized availability, delivery, and exposure occurrences
→ recipient attention, comprehension, source recognition, trust,
  memory, and interpretation
→ recipient-owned belief, attribution, salience, preference,
  willingness to share, organize, vote, or act
→ polls and other measurements may later estimate portions of that state
→ institutions and actors may act on what they know or believe
→ the administration learns only through valid receipts and escalation
```

No arrow guarantees the next arrow.

A true occurrence may never be measured or reported.

A published story may reach few people.

A delivered item may not be noticed.

A noticed item may not be trusted.

A trusted source may still be wrong.

A false claim may be rejected.

A correction may help, fail, reach a different audience, or create additional exposure to the original claim.

An electorally important belief may exist without a precise poll.

## 1.2 Product role

The layer exists to make the accepted presidential game politically inhabited.

It should allow the President to confront situations such as:

- an official report and a local investigation describing different portions of the same problem;
- a true administrative failure that remains unknown nationally for months;
- several outlets copying one underlying report and creating apparent repetition without independent confirmation;
- opposition claims that use real evidence but assign disputed responsibility;
- a misleading claim spreading heavily inside one audience and barely reaching another;
- an administration correction reaching fewer people than the original;
- a platform changing distribution without changing the artifact or underlying facts;
- a local issue becoming national only after a journalist, governor, committee, or organization creates a valid bridge;
- audiences interpreting the same story differently because they possess different priors, source trust, direct experience, and competing information;
- polling that measures only a bounded, method-dependent slice of public belief;
- a politically loud controversy that does not reflect the largest material problem;
- a materially severe condition that produces no presidential interruption because no valid observational and institutional route reaches the White House.

## 1.3 Deletion rule

Retain an information, media, audience, or belief distinction only when deleting it would make at least one supported difference impossible or materially incoherent, including:

- different actors discovering different evidence;
- different outlets selecting or framing different stories;
- different platforms or channels delivering different artifacts;
- different audiences receiving or noticing different information;
- different recipients trusting, remembering, believing, attributing, or prioritizing differently;
- corrections, updates, leaks, or investigations changing later decisions;
- political actors acting on incomplete, mistaken, or strategically presented information;
- a presidential decision arising through a valid political-information route.

Do not model an outlet, journalist, platform feature, audience segment, proposition, memory trace, or trust relationship merely because it exists in real life.

---

# 2. Repository reality and accepted foundation

## 2.1 What the production baseline already proves

**[RF]** The frozen production baseline already separates:

- canonical Housing state from official observation;
- observation from measurement artifact;
- artifact creation from public release;
- political claim from the evidence it cites;
- delivery from population exposure;
- exposure from population belief, attribution, salience, preference, and turnout response;
- administration-origin claims from other actor claims;
- historical release time from observation/reference time.

The implementation therefore proves useful ownership seams.

It does not prove a commercial media ecology.

## 2.2 What accepted authority already requires

**[RF]** Accepted Step 1 requires:

- media organizations and journalists as autonomous actors;
- artifact-owned content/provenance/classification;
- actor-owned publication/distribution attempts;
- `InformationEnvironment`-owned realized availability, delivery, and exposure occurrences;
- recipient-owned notice, memory, trust, belief, attribution, salience, preference, and turnout;
- polling as measurement rather than belief owner;
- elections as institutional resolution rather than information-layer output;
- corrections and retractions as additive history rather than retroactive deletion.

**[RF]** Accepted Step 4 requires media actors to:

- act from bounded evidence and role;
- use institution-specific opportunities and resources;
- investigate or publish without generating underlying misconduct;
- remain distinct from audiences and public belief;
- avoid hidden dramatic initiation.

**[RF]** Accepted Step 5 requires administration communications to become typed acts and artifacts rather than direct political effects.

**[RF]** Accepted Step 7 requires:

- evidence vintages;
- method and uncertainty;
- dependency lineage;
- claimed confidence distinct from actual methodological support;
- recipient interpretation distinct from evidence quality;
- revision without rewriting prior knowledge.

## 2.3 What remains absent

**[RF]** The accepted baseline does not yet contain a commercial design for:

- persistent outlet or journalist identity;
- source networks and source protection;
- investigative resource allocation;
- editorial selection;
- framing and proposition structure;
- syndication and derivative-story lineage;
- platform ranking, recommendation, search, moderation, or targeting;
- audience media habits;
- recipient attention and memory;
- trust by source, audience, subject, and time;
- repeated exposure;
- interpersonal discussion and resharing;
- misinformation, disinformation, propaganda, or synthetic media;
- corrections reaching different audiences from originals;
- local-to-national pickup;
- public issue salience and attribution at commercial breadth;
- media monitoring and press-response routing inside the administration.

---

# 3. Semantic ownership map

## 3.1 Underlying reality

Canonical material, social, fiscal, legal, political, administrative, population, institutional, and external facts remain owned by their accepted semantic owners.

Media does not own:

- employment;
- prices;
- Housing;
- a vote;
- a court ruling;
- corruption;
- a payment;
- a war;
- a disaster;
- public belief;
- an election result.

## 3.2 Evidence and observation

Evidence, observations, administrative records, source reports, testimony, telemetry, photographs, filings, leaked documents, and measurement products retain the owners and support classifications established by Step 7.

A media actor may acquire, copy, corroborate, dispute, or publish evidence.

It does not retroactively become the original evidence owner.

## 3.3 Speaker decision

A speaker, office, organization, journalist, editor, campaign, agency, court, firm, union, advocacy organization, foreign actor, or ordinary-person sharing process owns its decision or attempt to communicate.

The speaker owns:

- whether to speak;
- what proposition or request to assert;
- what evidence to cite or omit from the artifact;
- claimed confidence;
- intended audience;
- selected framing;
- timing;
- classification;
- whether to correct, retract, qualify, repeat, or remain silent.

The speaker does not own recipient interpretation.

## 3.4 Information artifact

An artifact owns its:

- identity and type;
- content;
- proposition references;
- quoted or summarized material;
- cited evidence references;
- producer/source references;
- creation and release times;
- claimed confidence and epistemic language;
- framing/emphasis metadata where represented;
- version, correction, retraction, translation, edit, clip, quote, and derivative lineage;
- intrinsic access classification;
- intended audience where declared.

It does not own truth, distribution, exposure, belief, or political outcome.

## 3.5 Publication and distribution attempts

The eligible actor, outlet, institution, campaign, organization, platform, or person owns the attempt to:

- publish;
- broadcast;
- post;
- brief;
- email;
- advertise;
- recommend;
- rank;
- search-index;
- syndicate;
- clip;
- repost;
- share;
- suppress or limit distribution within its authority;
- label;
- correct;
- retract;
- embargo;
- leak.

## 3.6 Realized information availability and exposure

`InformationEnvironment` owns represented occurrences such as:

- an artifact becoming available through a particular outlet or channel;
- an item being delivered to a subscriber feed;
- a platform presenting content to a recipient scope;
- a broadcast reaching a modeled catchment;
- a confidential memo reaching an authorized office;
- a story being available but not necessarily presented;
- a correction being delivered to some recipients.

Availability, presentation, delivery, impression, exposure, notice, engagement, and belief remain distinct.

## 3.7 Recipient state

The receiving person, population scope, actor, office, or genuine organization-recipient owns:

- notice;
- attention;
- source recognition;
- comprehension;
- memory;
- trust;
- belief;
- uncertainty;
- attribution;
- salience;
- preference;
- sharing or discussion decision;
- political or institutional action.

## 3.8 Polls and elections

A poll owns a measurement artifact about a target population under Step 7.

It does not own the measured belief.

An election process owns ballots, counting, results, certification, and office entitlement.

Information and belief may affect political behavior only through accepted population and electoral processes.

---

# 4. Information-object taxonomy

## 4.1 Evidence artifact

An evidence artifact records or represents potentially probative material.

Examples:

- official dataset;
- administrative record;
- court filing;
- photograph;
- video;
- recorded statement;
- internal memo;
- source testimony;
- audit finding;
- transaction record;
- sensor output;
- measurement release.

Its probative value is not self-executing.

## 4.2 Claim

A claim is a proposition asserted by a speaker.

A claim may be:

- true;
- false;
- partly supported;
- misleading through omission;
- unresolved;
- predictive;
- normative;
- causal;
- attributive;
- procedural;
- evaluative.

Truth status, speaker belief, speaker intent, claimed confidence, and recipient belief are separate.

## 4.3 Report or story

A report/story may contain:

- several claims;
- evidence;
- quotations;
- summaries;
- uncertainty;
- framing;
- narrative ordering;
- background;
- corrections or updates.

The story is not one indivisible belief proposition.

## 4.4 Analysis or opinion

Analysis, opinion, endorsement, editorial, commentary, and advocacy may reason from evidence and claims while openly or implicitly adopting values or objectives.

They remain information artifacts, not material truth.

## 4.5 Advertisement and sponsored communication

An advertisement is a paid or sponsored communication with:

- sponsor;
- payer;
- creative/content;
- audience target;
- channel;
- schedule;
- applicable disclosure state;
- distribution attempt.

Payment may purchase access or delivery opportunity.

It does not purchase belief.

## 4.6 Correction, qualification, update, and retraction

A correction addresses identified factual or methodological error.

A qualification narrows certainty or scope.

An update adds later information.

A retraction withdraws the producer’s support for an earlier artifact or claim.

Each produces a new occurrence and lineage.

None erases prior exposure or belief.

## 4.7 Leak

A leak is an unauthorized or contested disclosure attempt concerning an artifact or information.

The leaked item retains its original identity/classification.

The leak creates separate:

- disclosure action;
- copied or derivative artifact if applicable;
- availability/delivery state;
- source-protection or investigation consequences.

## 4.8 Synthetic or manipulated content

Synthetic, edited, or manipulated content is an artifact with provenance that may be:

- authentic and disclosed;
- authentic but contextually misleading;
- edited;
- fabricated;
- impersonating;
- provenance-unknown;
- detected later;
- falsely alleged to be synthetic.

Detection claims are themselves claims or evidentiary findings.

---

# 5. Proposition identity and semantic lineage

## 5.1 Why proposition identity is required

A political story may make several distinguishable propositions.

Example:

```text
A program paid Firm X.
The payment violated law.
The President knew.
The payment caused project failure.
The President benefited politically.
```

Evidence may support one proposition and not another.

A correction may address only one.

A recipient may believe some and reject others.

The design therefore cannot treat the entire story as one binary truth value.

## 5.2 Proposition contract

**[DI — HARD INVARIANT LC-MI01]** Every load-bearing claim or belief transition must identify the proposition, proposition family, or bounded semantic target to which it applies.

A proposition should preserve, where relevant:

- subject;
- predicate or asserted relationship;
- object/target;
- time;
- geography;
- population/entity scope;
- quantifier or magnitude;
- modality: observed, alleged, estimated, predicted, normative, causal;
- uncertainty;
- version/semantic lineage.

This is a semantic obligation, not a requirement for a universal symbolic-logic engine.

## 5.3 Claim relationships

Artifacts or claims may relate through:

- repeats;
- quotes;
- paraphrases;
- translates;
- narrows;
- broadens;
- updates;
- supports;
- contradicts;
- qualifies;
- corrects;
- retracts;
- disputes attribution;
- disputes magnitude;
- shares evidence;
- shares source;
- derives from;
- satirizes;
- impersonates.

## 5.4 Derivative content is not independent evidence

**[DI — HARD INVARIANT LC-MI02]** A new story, post, clip, or speaker repeating a proposition does not create independent evidentiary support merely because it has a new artifact ID.

If ten outlets copy one wire report, the audience may experience repetition from ten publishers.

The methodological support may still trace largely to one report and source set.

Both facts can matter:

- repeated exposure may affect familiarity and salience;
- evidence evaluation may recognize common dependence.

## 5.5 Shared proposition does not imply identical framing

Two artifacts may assert the same core fact while differing in:

- headline;
- causal attribution;
- moral language;
- selected comparison;
- uncertainty emphasis;
- quoted voices;
- omitted context;
- image;
- placement;
- audience target.

The core proposition and framing effects remain separately representable where needed.

---

# 6. Speaker state, honesty, error, and strategic communication

## 6.1 Speaker epistemic state

A speaker may possess:

- evidence received;
- private belief;
- uncertainty;
- source trust;
- objective;
- legal duty;
- political or commercial incentive;
- audience model;
- intended effect;
- claimed confidence.

No universal honesty stat is required.

## 6.2 Truth, belief, intent, and presentation remain distinct

**[DI — HARD INVARIANT LC-MI03]** The following may not collapse:

```text
canonical truth status
speaker evidence
speaker private belief
speaker intent
claimed certainty
artifact content
recipient perception
recipient belief
```

A speaker can:

- honestly report a false inference;
- knowingly misstate;
- strategically omit;
- accurately report inconvenient evidence;
- exaggerate confidence;
- understate certainty;
- repeat a claim without verifying it;
- cite real evidence for an unsupported causal attribution.

## 6.3 Bad analysis is valid world behavior

Step 7’s methodological support rules bind the simulation’s evidence assessment.

They do not make every analyst perfect.

A pollster, adviser, outlet, campaign, or intelligence actor may:

- assume dependent evidence is independent;
- misread a margin of error;
- overgeneralize from the wrong universe;
- cherry-pick;
- ignore a revision;
- confuse correlation and causation;
- claim excessive certainty;
- deliberately deceive.

The resulting claim or assessment may become a canonical artifact or actor belief.

Its **claimed confidence** remains distinct from its **actual methodological support**.

## 6.4 Strategic silence and selective release

A speaker may withhold or delay information because of:

- confidentiality;
- source protection;
- legal risk;
- editorial judgment;
- incomplete evidence;
- political strategy;
- commercial incentive;
- bargaining;
- operational security;
- institutional duty;
- queue/resource conflict.

The non-release does not alter underlying truth.

A later disclosure preserves chronology.

---

# 7. Media entity and decision-locus contract

## 7.1 Media organization identity

A media organization may own:

- organizational identity;
- ownership and governance;
- brands or outlets;
- financial/operational resources;
- editorial policies;
- legal risk;
- subscription, advertising, donor, public-service, or other revenue relationships;
- staff and desks;
- publication channels;
- archives;
- adopted corrections policy;
- source-protection practices;
- audience strategy.

It does not own every journalist’s private belief.

## 7.2 Outlet and operating unit

A parent media organization, outlet, newsroom, station, publication, channel, or desk may be distinct only when that distinction changes:

- editorial decision;
- geographic reach;
- audience;
- resources;
- legal responsibility;
- publication channel;
- source relationships;
- supported gameplay outcome.

Step 4’s one-entity rule prevents duplicated staff, cash, stories, and actions.

## 7.3 Journalist or investigative team

Individualize a journalist or team only when its:

- source network;
- expertise;
- persistent investigation;
- trust;
- access;
- reputation with specific audiences/sources;
- legal exposure;
- decision;
- history;

can change a supported consequence.

Routine reporting may remain aggregated.

## 7.4 Decision loci

A consequential media act must identify who or what decided:

- journalist;
- editor;
- desk;
- newsroom process;
- standards/legal review;
- owner/publisher where legitimately involved;
- platform policy process;
- automated ranking system under declared rules;
- aggregate local-outlet response;
- coordinated syndication process.

“The media decided” is insufficient.

## 7.5 Editorial independence and interference

An owner, government actor, advertiser, donor, source, party, or executive may attempt to influence coverage.

The attempt does not automatically determine publication.

It proceeds through:

- ownership/governance rights;
- contract;
- pressure;
- access;
- threat;
- legal process;
- persuasion;
- bribery/corruption if canonically represented;
- staff response;
- resignation or leak;
- refusal;
- compliance.

---

# 8. Source and investigation contract

## 8.1 Source identity and access

A source may be:

- named;
- anonymous to the public but known to the journalist;
- anonymous to both outlet and public;
- institutional;
- documentary;
- firsthand;
- secondhand;
- confidential;
- privileged;
- classified;
- hostile;
- mistaken;
- deceptive.

Source identity, source access, source credibility, evidence support, and public disclosure remain distinct.

## 8.2 Investigation chain

**[DI — HARD INVARIANT LC-MI04]** A load-bearing investigation follows:

```text
tip, anomaly, filing, public record, source communication,
direct observation, prior story, or data pattern
→ journalist/outlet receives bounded lead
→ evaluates relevance, evidence, jurisdiction, audience,
  source risk, legal risk, cost, and opportunity
→ assigns or declines scarce investigative work
→ seeks records, interviews, data, expert analysis,
  corroboration, response, and legal/standards review
→ creates evidence and investigative-work records
→ decides publish, delay, continue, narrow, abandon, or refer
→ publication attempt and artifact
→ targets and institutions may respond
→ later evidence, correction, litigation, or follow-up
```

No scandal may be generated because the presidency needs one.

## 8.3 Investigation may create new evidence

Investigation may generate:

- interview record;
- copied document;
- public-record response;
- data analysis;
- photograph;
- corroborated source account;
- on-record denial;
- discovered transaction;
- timeline reconstruction.

It creates new observable evidence about preexisting or contemporaneous reality.

It does not create the underlying misconduct, failure, payment, or condition.

## 8.4 Corroboration and dependence

Several sources may be:

- independent;
- linked to one original source;
- repeating one rumor;
- reading one document;
- coordinated;
- unknown in dependence.

Step 7’s evidence-dependence lineage applies.

An outlet may mistakenly overstate independence, but the simulation’s methodological support does not.

## 8.5 Right of reply and target response

A target may:

- respond;
- deny;
- provide evidence;
- refuse;
- delay;
- threaten legal action;
- correct part;
- attack motive;
- leak counterevidence;
- resign;
- change conduct.

The outlet may publish before or after response depending on evidence, deadline, policy, and risk.

No response is not admission.

## 8.6 Source protection and public legibility

The world may know a confidential source identity while the player/public does not.

Player-facing evidence must preserve access restrictions.

A source-protected story may expose:

- outlet’s characterization of source access;
- corroboration count or type;
- disclosed confidence;
- public evidence;
- known denials;

without revealing protected debug identity.

---

# 9. Editorial selection and framing

## 9.1 Selection is autonomous

An outlet may choose whether to cover an available matter based on bounded factors such as:

- evidence strength;
- novelty;
- timeliness;
- geography;
- audience relevance;
- editorial mission;
- public-service judgment;
- ideology or worldview;
- source access;
- competitive pressure;
- exclusivity;
- expected audience interest;
- revenue pressure;
- legal risk;
- investigative cost;
- staff and publication capacity;
- relationship/access consequences;
- prior coverage;
- correction burden.

There is no global `Newsworthiness` truth that commands every outlet.

## 9.2 Outlet knowledge is bounded

An outlet may use:

- its own subscriber/viewer records;
- past engagement;
- surveys;
- platform analytics;
- source and beat experience;
- public trends;
- market research;
- editorial judgment.

It may not directly read exact hidden population belief, future virality, or canonical importance.

## 9.3 Framing

Framing may alter:

- which proposition leads;
- causal attribution asserted;
- uncertainty emphasized;
- comparison baseline;
- affected people highlighted;
- moral or ideological language;
- quoted voices;
- visual presentation;
- headline;
- context included;
- responsibility assigned.

Framing is artifact content and selection.

It does not rewrite evidence or reality.

## 9.4 Omission

The design may represent consequential omission when:

- omitted evidence/proposition is known to the producer;
- omission changes the supported interpretation;
- later exposure or investigation can reveal it;
- the distinction can return as a different belief, relationship, correction, or decision.

The game does not need a complete inventory of every fact not mentioned.

## 9.5 Placement and prominence

Front-page placement, lead broadcast position, push notification, homepage rank, newsletter lead, or low-prominence publication are distribution/presentation choices.

They can change exposure probability and attention.

They do not directly change belief.

---

# 10. Publication, syndication, derivatives, and access

## 10.1 Publication attempt

A publication attempt identifies:

- producer/outlet;
- artifact;
- channel;
- intended audience;
- release time/window;
- access conditions;
- legal/editorial status;
- prominence;
- any embargo;
- any syndication rights;
- any platform dependence.

## 10.2 Publication is not universal availability

A local print story may be public yet difficult for national audiences to encounter.

A paywalled article may be public in classification but limited in practical access.

A press release may be technically available yet ignored.

A leaked memo may be widely described without the full document being available.

## 10.3 Syndication and pickup

A receiving outlet may:

- republish;
- quote;
- summarize;
- independently verify;
- add local context;
- change headline/framing;
- decline;
- correct;
- challenge.

The derivative artifact preserves lineage.

Pickup does not become independent evidence without new support.

## 10.4 Archive and retrieval

Published artifacts may remain retrievable through:

- archive;
- search;
- direct link;
- subscription database;
- public record;
- screenshot/copy;
- quotation;
- social repost.

Removal from one channel does not erase all copies or historical exposure.

## 10.5 Embargo and premature release

An embargo is an access/relationship arrangement.

A breach creates:

- disclosure occurrence;
- relationship consequences;
- possibly earlier availability;
- no retroactive change to underlying measurement time.

---

# 11. Channels and platform contract

## 11.1 Channel families

Potential channels include:

- broadcast;
- print;
- outlet website/app;
- email/newsletter;
- search;
- social feed;
- direct message;
- podcast;
- video platform;
- press conference;
- speech/event;
- official portal;
- interpersonal conversation;
- organization/member network;
- paid advertising;
- syndication wire.

Not every run or product scope requires every channel.

## 11.2 Platform identity

A platform or channel operator may own:

- platform identity;
- eligibility/moderation rules;
- ranking/recommendation policies;
- account state;
- distribution infrastructure;
- ad market/targeting rules;
- search/index rules;
- user controls;
- platform-owned analytics;
- enforcement and appeals;
- outages and operational state.

It does not own user belief.

## 11.3 Admission, moderation, ranking, and presentation remain distinct

A platform may:

- permit content to exist;
- remove it;
- label it;
- make it ineligible for recommendation;
- downrank;
- rank;
- recommend;
- search-index;
- disable sharing;
- limit paid promotion;
- suspend an account.

Those actions differ.

A post remaining publicly accessible does not mean it is broadly recommended.

A label does not guarantee attention or correction.

## 11.4 Personalized distribution

**[DI]** Platform presentation may depend on bounded signals such as:

- followed accounts;
- prior clicks/watch time;
- searches;
- likes/shares/comments;
- geography/language;
- recency;
- content category;
- social/network relations;
- predicted interest;
- user controls;
- platform safety/quality rules;
- paid targeting.

No two recipients must receive the same feed.

The platform uses records and models it actually possesses.

It may not read recipient hidden beliefs as perfect truth unless a legitimately measured proxy exists.

## 11.5 Predicted engagement is not actual engagement or belief

A platform prediction may affect ranking.

It does not own:

- whether presentation occurred;
- whether recipient noticed;
- whether recipient engaged;
- whether recipient believed;
- whether recipient voted.

Prediction error is valid.

## 11.6 Search and active seeking

A recipient may actively seek information.

Search results depend on:

- query;
- index;
- ranking;
- access;
- language/geography;
- personalization where represented;
- platform policy;
- available artifacts.

Active search and incidental encounter are distinct pathways.

## 11.7 User control

Recipients may follow, mute, unsubscribe, block, select preferences, seek diverse sources, or reduce news use when supported.

These decisions affect future channel eligibility and distribution.

They do not rewrite prior exposure.

---

# 12. Distribution, delivery, exposure, and frequency

## 12.1 Closed progression

**[DI — HARD INVARIANT LC-MI05]** The following are distinct:

```text
artifact exists
→ publication attempt
→ channel availability
→ eligible presentation
→ realized presentation/delivery
→ exposure opportunity
→ recipient notice
→ attention/comprehension
→ memory
→ belief/attribution/salience
→ action
```

No stage guarantees the next.

## 12.2 Exposure occurrence

A represented exposure occurrence should preserve, where relevant:

- artifact/proposition;
- delivery/channel;
- audience or recipient scope;
- time;
- geography;
- presentation context;
- prominence;
- repeated/first exposure status if support exists;
- support quality: exact, modeled, bounded, or unsupported;
- lineage to prior presentations;
- uncertainty.

## 12.3 Availability is not exposure

A story on a website may be available to millions and exposed to few.

A television signal may reach a geographic catchment without every household watching.

A push notification may be delivered without being opened.

A social item may be presented and skipped.

## 12.4 Repetition and frequency

Repeated exposure may matter through familiarity, salience, memory, and perceived social prevalence.

But frequency is not independent evidence.

The recipient process may distinguish:

- repeated same artifact;
- repeated same proposition via derivatives;
- independent corroboration;
- contradiction;
- correction;
- satire;
- uncertain semantic match.

## 12.5 Duplicate and overlapping exposure

The same recipient may encounter an artifact through several channels.

The design may not sum channel reach as unique people without overlap support.

Exact, modeled, bounded, or unsupported audience intersection rules from Step 3 apply.

## 12.6 Recipient-specific attention capacity

A recipient or audience may possess bounded time, interest, cognitive effort, and news habits.

This may create competition among presented items.

It is not one global `PublicAttention` resource.

An item can crowd out another for one audience while barely reaching another.

---

# 13. Notice, comprehension, attention, and memory

## 13.1 Notice

Notice may depend on:

- realized presentation;
- prominence;
- recipient channel use;
- current attention;
- issue interest;
- direct experience;
- novelty;
- source recognition;
- competing items;
- language/accessibility;
- repeated exposure;
- fatigue;
- active seeking.

Notice is not belief.

## 13.2 Comprehension

A recipient may:

- understand accurately;
- misunderstand;
- retain headline but not qualification;
- remember source but not content;
- remember content but misattribute source;
- infer a broader proposition than asserted;
- fail to process uncertainty.

The artifact does not dictate comprehension.

## 13.3 Memory

Memory may be purpose-bounded and sparse.

The simulation need not preserve every article for every person.

Retain memory when it can later affect:

- belief;
- trust;
- salience;
- attribution;
- vote or turnout;
- organization;
- sharing;
- relationship;
- response to correction;
- presidential politics.

## 13.4 Memory decay and retrieval

Memory can weaken, be reinforced, be cued by later artifacts, or become source-confused.

No universal decay formula is accepted.

The process may differ by:

- proposition;
- intensity;
- repetition;
- direct experience;
- identity relevance;
- emotional significance;
- later contradiction;
- recipient characteristics.

## 13.5 News fatigue and avoidance

Recipients may reduce consumption or avoid sources/topics due to:

- overload;
- distrust;
- distress;
- perceived irrelevance;
- time;
- social conflict;
- strategic avoidance.

Avoidance changes later exposure opportunities.

It does not make the underlying issue disappear.

---

# 14. Trust, credibility, and source assessment

## 14.1 Trust is relational and contextual

Trust may differ by:

- recipient;
- outlet;
- journalist;
- source;
- institution;
- topic;
- format;
- time;
- prior correction history;
- partisan/ideological relationship;
- direct experience;
- perceived motive;
- corroboration.

No universal `MediaCredibility` score controls all audiences.

## 14.2 Actual support and perceived credibility differ

A high-quality artifact may be distrusted.

A weak artifact may be trusted.

A familiar source may be believed despite low support.

A disliked source may provide accurate evidence.

## 14.3 Trust change

Trust may change through:

- accurate or inaccurate prior reporting as later evidenced;
- correction or refusal to correct;
- perceived bias;
- source disclosure;
- political attack;
- direct contradiction with experience;
- institutional scandal;
- peer endorsement;
- long-term relationship.

A politician saying “fake news” does not directly set trust.

It creates a claim distributed to recipients.

## 14.4 Source laundering

A claim may move from an obscure source to a trusted outlet through quotation, pickup, or political repetition.

Derivative lineage must remain available to methodological evaluation, even when recipients do not know it.

Recipient perception may treat the trusted repeater as new support.

The simulation must distinguish actual support from perceived support.

---

# 15. Belief, uncertainty, attribution, and salience

## 15.1 Recipient-owned political cognition

PopulationState or the relevant individualized recipient owns purpose-bounded:

- belief;
- uncertainty;
- attribution;
- salience;
- trust;
- preference;
- turnout disposition;
- willingness to share or organize where represented.

## 15.2 Belief is proposition-specific

Belief should attach to a proposition or bounded issue claim, not only a global ideology coordinate.

The product may also retain broader predispositions.

Those do not replace proposition-specific beliefs when the distinction matters.

## 15.3 Belief update inputs

A recipient may update from:

- direct material experience;
- trusted or distrusted evidence/artifacts;
- repeated exposure;
- interpersonal communication;
- organization messages;
- official statements;
- source reputation;
- prior belief;
- partisan/ideological identity;
- perceived consensus;
- uncertainty;
- correction;
- memory;
- motivated or accuracy-seeking goals.

The exact update algorithm is deferred.

## 15.4 False and uncertain beliefs are valid

Recipient belief may differ from canonical truth.

The simulation must allow:

- accurate confidence;
- accurate uncertainty;
- mistaken belief;
- overconfidence;
- underconfidence;
- contradictory beliefs;
- unresolved belief;
- belief without known source;
- correct conclusion for weak reasons;
- incorrect conclusion from honest evidence.

## 15.5 Attribution

Attribution answers who or what the recipient thinks caused, deserves credit for, or bears responsibility for a condition or event.

It is distinct from believing the event occurred.

A recipient may believe unemployment rose but blame:

- President;
- Congress;
- Federal Reserve;
- firms;
- foreign actors;
- governors;
- prior administration;
- structural conditions;
- nobody identifiable.

Attribution changes through information and experience, not direct policy modifiers.

## 15.6 Salience

Salience answers how available, important, urgent, identity-relevant, or decision-relevant a matter is to the recipient.

It may differ from material severity.

Salience is recipient-owned and perspectival.

There is no canonical issue-importance score.

## 15.7 Preference and action remain downstream

Belief, attribution, or salience may influence:

- candidate preference;
- turnout;
- contacting officials;
- protest;
- donation;
- organization participation;
- sharing;
- consumption;
- compliance.

They do not directly determine those actions without the relevant recipient/organization/election process.

---

# 16. Corrections, disputes, and evolving stories

## 16.1 Correction production

A correction may arise from:

- outlet self-review;
- new evidence;
- source complaint;
- target response;
- fact-check;
- legal demand;
- official revision;
- competing outlet;
- public criticism;
- internal standards process.

The correction itself requires evidence and an eligible decision locus.

## 16.2 Correction semantics

A correction must identify:

- target artifact or proposition;
- corrected element;
- replacement or qualification;
- evidence;
- producer;
- time;
- scope;
- whether original remains accessible;
- relationship to prior versions.

## 16.3 Correction distribution is separate

Issuing a correction does not guarantee that everyone exposed to the original receives it.

Correction delivery uses normal channel and audience rules.

Some recipients may see only the correction and thereby first encounter the original claim.

## 16.4 Continued influence

Prior belief, familiarity, memory, and action may persist after correction.

The simulation should not automatically set belief to truth.

It also should not hardcode that correction never works.

Effect depends on recipient, source, timing, content, replacement explanation, repetition, and exposure.

## 16.5 Conflicting corrections

Different actors may dispute what is a correction.

An outlet may correct magnitude but defend attribution.

A political actor may label accurate reporting false.

The existence of a “correction” artifact does not automatically establish the corrected proposition’s truth; its evidence and producer still matter.

---

# 17. Sharing, discussion, and interpersonal transmission

## 17.1 Recipients can become speakers

After receiving and noticing information, a person or actor may:

- discuss;
- quote;
- share;
- repost;
- summarize;
- distort;
- joke;
- endorse;
- condemn;
- fact-check;
- remain silent.

That choice creates a new communication/distribution attempt.

## 17.2 Aggregate sharing

Ordinary-person sharing may be modeled through aggregate processes when individual identity is not load-bearing.

An aggregate process ordinarily produces:

- distribution;
- rate;
- count;
- network diffusion;
- set of unit-level attempts.

It does not become one public hive mind.

## 17.3 Interpersonal communication

Information may move through:

- family;
- workplace;
- union;
- church;
- neighborhood;
- organization;
- private messaging;
- in-person discussion;
- professional networks.

This can reach people who do not consume the original outlet.

## 17.4 Transformation through sharing

A shared artifact may preserve the original or create a derivative:

- headline-only;
- screenshot;
- clip;
- paraphrase;
- meme;
- commentary;
- misleading crop;
- translated version.

Derivative lineage and proposition identity remain necessary.

## 17.5 Social endorsement

Seeing that peers or leaders shared something may affect perceived credibility or salience.

It does not constitute independent evidence unless the sharer adds it.

---

# 18. Political communication, campaigns, and official messaging

## 18.1 Administration speech

The President or administration may choose:

- topic;
- proposition;
- evidence to release;
- claimed certainty;
- audience;
- venue;
- spokesperson;
- timing;
- whether to rebut;
- whether to remain silent;
- whether to acknowledge uncertainty or failure.

The administration does not choose outlet framing, platform reach, or recipient belief.

## 18.2 Press briefing

A press briefing may produce:

- prepared statement;
- questions;
- answers;
- refusal;
- correction;
- follow-up records;
- clips and derivative stories.

Journalists select questions through their own roles and information.

## 18.3 Campaign and party communication

Campaigns, parties, candidates, and political organizations remain separate actors.

They may:

- advertise;
- mobilize;
- attack;
- defend;
- frame;
- target;
- repeat;
- fact-check;
- leak;
- coordinate within lawful/accepted relationships.

Campaign communication does not overwrite governing records or public belief.

## 18.4 Paid targeting

A campaign or organization may purchase:

- impressions;
- placements;
- audience access;
- time;
- distribution opportunity.

Targeting must use population/audience data at its actual support level.

An advertiser cannot target exact hidden beliefs unless it possesses a valid measured proxy.

## 18.5 Credit claiming and blame

Political communication can attempt to claim credit or assign blame.

Recipient attribution remains independent.

A materially successful program may receive little credit.

A failed policy may be blamed on another actor.

---

# 19. Misinformation, disinformation, propaganda, and coordinated influence

## 19.1 Truth and intent classification

The design should separate:

- misinformation: inaccurate or misleading content without requiring proven deceptive intent;
- disinformation: deliberate deception where intent is supported;
- propaganda: strategic communication intended to influence attitudes/action, which may contain true, false, selective, or value-laden material;
- rumor: unverified circulating claim;
- satire/parody;
- error;
- contested claim;
- synthetic/manipulated content.

These labels may be public claims, analytic classifications, or canonical speaker-intent facts at different access levels.

## 19.2 Deception does not guarantee success

A deceptive actor may:

- fail to create an artifact;
- fail to distribute;
- reach the wrong audience;
- be detected;
- be ignored;
- be believed;
- increase skepticism;
- provoke backlash.

## 19.3 Coordinated networks

A coordinated influence operation may own:

- operators;
- accounts or channels;
- content plan;
- target audiences;
- resources;
- timing;
- coordination relationship;
- operational-security state;
- distribution attempts.

Accounts are not ordinary-population people unless validly linked.

Bot or inauthentic account counts do not add citizen weight.

## 19.4 Foreign actors

Foreign governments or organizations may create, steal, leak, amplify, forge, or suppress information through accepted actor and information contracts.

Domestic exposure and belief remain separately resolved.

Detection may arise through platform, journalism, intelligence, law enforcement, or research.

The existence of a foreign campaign does not directly modify election results.

## 19.5 Government countermeasures

Government actors may:

- investigate;
- attribute;
- warn;
- release evidence;
- sanction;
- indict;
- request platform action where lawful;
- improve security;
- communicate;
- remain silent.

Those are actions with legal, evidentiary, diplomatic, media, and public consequences.

No `CounterMisinformation = -20 virality` shortcut is accepted.

---

# 20. Virality, trending, and feedback loops

## 20.1 No global virality owner

Virality is a projection over:

- publication and sharing attempts;
- platform distribution;
- exposure;
- engagement;
- network structure;
- repetition;
- time;
- audience size;
- cross-platform pickup.

It is not a magical scalar that causes distribution.

## 20.2 Engagement loop

A valid platform feedback loop may be:

```text
artifact presented
→ some recipients notice/engage/share
→ platform records engagement
→ ranking model updates predicted relevance
→ later presentation probabilities change
→ additional exposure
```

Each stage has an owner and time.

The loop may saturate, reverse, fragment, or fail.

## 20.3 Trending projection

A trending list may summarize:

- recent volume;
- rate of change;
- geography;
- network;
- platform-specific activity;
- search interest.

It does not create the underlying interest.

Presenting a trend may itself become an artifact and affect later attention through normal routes.

## 20.4 Stability and same-time ordering

Feedback resolution must preserve:

- explicit update cadence;
- causal keys;
- same-time ordering;
- save/load invariance;
- time-chunk invariance;
- convergence/failure semantics where iterative.

The result may not depend on arbitrary handler registration order.

---

# 21. Public agenda and political-pressure emergence

## 21.1 No one public agenda

Potentially distinct projections include:

- what one audience finds salient;
- what one party’s supporters find salient;
- what an outlet covers;
- what Congress schedules;
- what governors discuss;
- what campaigns emphasize;
- what White House staff monitors;
- what polls ask;
- what organizations mobilize around.

None is the canonical national agenda.

## 21.2 Emergence chain

A political controversy or issue may emerge through:

```text
condition, occurrence, claim, or evidence
→ some actors observe it
→ speaker/outlet selection
→ artifacts and framing
→ uneven distribution and exposure
→ recipient attention, belief, attribution, salience
→ organization, electoral, institutional, or market response
→ further artifacts and action
→ administration receipt and possible presidential attention
```

## 21.3 Loud but materially small

A controversy may become politically large because:

- evidence is vivid;
- the event is novel;
- actors coordinate;
- a trusted outlet investigates;
- a platform amplifies;
- it fits existing beliefs;
- affected audiences are electorally pivotal;
- repeated claims dominate attention.

The material domain remains unchanged except through actual behavior/institutional response.

## 21.4 Severe but politically quiet

A severe condition may remain quiet because:

- evidence is weak;
- measurement lags;
- local outlets lack resources;
- affected people have limited organization;
- national outlets decline;
- platforms do not distribute;
- audiences do not notice;
- attribution remains unclear;
- another story dominates their attention.

The game must allow this state without forcing drama.

---

# 22. Administration monitoring and presidential attention

## 22.1 Press and communications monitoring

The administration may receive:

- public releases;
- press-monitoring summaries;
- direct questions;
- journalist inquiries;
- source or whistleblower communication;
- platform analytics;
- polling;
- organization/governor/lawmaker reaction;
- agency public-affairs reports;
- intelligence concerning influence operations.

It does not receive every artifact or exact public belief.

## 22.2 Staff interpretation

Press/Communications, policy offices, political assessment, Counsel, Legislative Affairs, agencies, and other offices may interpret media/public developments differently.

They may disagree about:

- factual support;
- legal response;
- political salience;
- whether rebuttal amplifies;
- whether evidence should be released;
- whether the matter requires the President.

## 22.3 Valid escalation

A media/public matter reaches the President only through Step 5’s accepted attention rules, such as:

- direct presidential authority or reserved communication;
- known deadline;
- cross-office conflict;
- player watch instruction;
- serious operational/legal/political effect;
- senior-staff judgment based on received evidence.

A viral story does not directly interrupt the player.

## 22.4 Presidential response options derive from state

Possible routes may include:

- release evidence;
- authorize statement;
- conduct interview or speech;
- designate spokesperson;
- direct lawful review/investigation;
- contact affected actors;
- change policy through a separate valid instrument;
- decline to comment;
- wait;
- correct prior administration statement;
- contest platform or outlet claim through speech/legal process;
- accept political damage.

No “respond to controversy” button directly adjusts approval.

---

# 23. Player-facing legibility

## 23.1 What the player may need to know

A media/public-information view should be able to explain, at bounded depth:

- what artifact or claim exists;
- who produced it;
- what proposition it asserts;
- what evidence it cites;
- actual support classification available to the administration;
- claimed certainty;
- known derivative/source lineage;
- outlet/channel;
- who is known or estimated to have received it;
- which audiences appear attentive;
- how trust differs;
- what competing artifacts exist;
- what remains unknown;
- what administration offices assess;
- why presidential attention is or is not requested.

## 23.2 Live view cannot expose debug truth

The player may not automatically see:

- speaker intent;
- protected source identity;
- exact actual audience exposure;
- exact hidden belief;
- platform proprietary/hidden ranking state;
- undiscovered coordinated operation;
- canonical truth not evidenced to the administration;
- exact future virality;
- exact probability a correction will work.

## 23.3 Known support labels

Player-facing information may distinguish:

- official record;
- verified evidence;
- corroborated report;
- uncorroborated allegation;
- modeled reach;
- staff estimate;
- disputed attribution;
- low-confidence assessment;
- unknown exposure;
- public claim without cited evidence.

Those labels must reflect evidence available to the administration, not developer omniscience.

## 23.4 Causal drill-down

The player should be able to navigate:

```text
presidential attention item
→ staff/press summary
→ story/claim/correction
→ evidence and proposition
→ outlet/speaker and known lineage
→ delivery/exposure estimates
→ audience/polling/public reaction
→ prior administration actions and records
```

without requiring knowledge of engine ownership objects.

---

# 24. Persistence, chronology, and historical record

## 24.1 Artifact history

The record preserves:

- original artifact;
- versions;
- corrections;
- retractions;
- derivative artifacts;
- publication attempts;
- realized availability;
- exposure records;
- recipient state when retained;
- actor/institution responses.

## 24.2 Historical knowledge

A later discovery may show that an earlier claim was false.

The historical record still preserves:

- what was published;
- what evidence was available;
- who received it;
- what the administration knew;
- what actors believed;
- what actions followed.

## 24.3 Removal and suppression

Removing content from one channel creates a removal or access-change occurrence.

It does not erase:

- prior publication;
- copies;
- screenshots;
- memories;
- earlier decisions;
- other channels.

## 24.4 Retention and compression

The simulation need not retain every impression forever at individual resolution.

It may compress while preserving what supported consumers require:

- proposition exposure history;
- audience-level reach;
- persistent belief/memory;
- legal/investigative evidence;
- political consequences;
- source lineage;
- historical accountability.

Compression cannot fabricate exact exposure later.

---

# 25. Determinism and stochastic behavior

## 25.1 Permitted uncertainty

Editorial, platform, sharing, attention, belief, and diffusion processes may be stochastic.

Stochasticity must remain:

- keyed to canonical inputs and stable identities;
- independent of iteration order;
- save/load stable;
- time-chunk invariant;
- explicit about recalculation and reconsideration;
- unable to inspect future player or actor choices.

## 25.2 No global random cursor

Adding an irrelevant outlet or recipient cannot change every unrelated media result merely by consuming a shared random sequence.

## 25.3 Same inputs, same semantic result

Equivalent canonical worlds with equivalent actor information and configuration should not diverge merely because:

- UI opened a screen;
- list order changed;
- the simulation advanced in different chunks;
- one unrelated story existed;
- a save was reloaded.

---

# 26. Adversarial proof A — Local investigation becomes national

## 26.1 Canonical chain

```text
recipient/program owner records irregular procurement payments
→ local public records expose anomalies
→ local journalist with relevant beat access notices pattern
→ editor allocates scarce investigative time
→ journalist obtains contracts, interviews source, requests target response
→ evidence supports payment irregularity but not presidential knowledge
→ local outlet publishes bounded story
→ local audience receives uneven exposure
→ governor and congressional staff learn through valid channels
→ committee opens inquiry
→ national outlet independently reviews records and republishes with new evidence
→ White House Counsel, agency, and Communications receive inquiries
→ staff disagree over facts, legal exposure, and response
→ presidential attention arises only if valid authority/commitment decision exists
```

## 26.2 Perturbations

- Source withdraws: story may narrow or delay.
- Local outlet lacks resources: anomaly remains public but uninvestigated.
- National outlet declines pickup: issue remains regional.
- Committee acts before national coverage: institutional action can nationalize later.
- Administration releases records: new evidence changes reporting.
- Target sues: legal process proceeds separately.
- No evidence of presidential knowledge: story cannot truthfully acquire it because drama requires it.

## 26.3 Pass condition

No hidden scandal generator, nationalization switch, or direct approval modifier is necessary.

---

# 27. Adversarial proof B — Preliminary jobs report and later revision

## 27.1 Canonical chain

```text
Labor-owned employment conditions
→ Step-7 statistical process creates preliminary estimate
→ official release
→ administration, outlets, firms, unions, lawmakers receive it
→ speakers create different claims using the same release
→ outlets frame magnitude, comparison, and attribution differently
→ fragmented audiences receive different artifacts
→ recipients update belief, attribution, and salience differently
→ later benchmark revision changes current evidence
→ correction/update artifacts circulate unevenly
→ prior presidential and public reactions remain historical
```

## 27.2 Required distinctions

- actual condition;
- preliminary estimate;
- release;
- partisan claim;
- outlet framing;
- recipient belief;
- revised estimate;
- correction exposure;
- latest series;
- evidence available at decision time.

## 27.3 Perturbations

- Revision is small.
- Revision reverses apparent direction.
- Original claim is technically accurate about preliminary release but misleading about certainty.
- One audience receives correction; another mostly does not.
- A trusted partisan speaker concedes error; another doubles down.
- Several derivative stories share one evidence source and do not become independent confirmation.

---

# 28. Adversarial proof C — Viral false causal claim

## 28.1 Canonical chain

```text
real price increase
→ political speaker asserts unsupported claim that one program caused it
→ artifact cites selected real price evidence but lacks causal support
→ partisan outlet publishes
→ platform presents to some audience based on bounded records
→ recipients notice unevenly
→ repetition and peer sharing increase familiarity for some
→ some believe occurrence but dispute cause; others accept attribution
→ fact-check/correction is created from evidence
→ correction reaches overlapping but nonidentical audience
→ some beliefs change, some persist, some recipients first hear claim through correction
→ polls later estimate bounded belief
→ campaigns and lawmakers respond
```

## 28.2 Pass conditions

- false attribution does not alter canonical prices;
- virality is not a global score;
- repeated copies are not independent evidence;
- correction does not reset belief;
- platform exposure is not universal;
- belief does not directly set election result.

---

# 29. Adversarial proof D — Foreign coordinated influence operation

## 29.1 Canonical chain

```text
foreign actor develops forged document and coordinated account network
→ accounts publish and amplify
→ platform systems admit, recommend, limit, or remove according to own rules
→ journalists, researchers, intelligence, or targets may detect anomalies
→ evidence-dependence and provenance are investigated
→ attribution assessment carries confidence and source restrictions
→ administration decides whether/how to warn, sanction, disclose, or remain silent
→ media and public interpret the warning differently
→ exposure, belief, backlash, distrust, and election behavior resolve separately
```

## 29.2 Perturbations

- Operation receives little reach.
- Platform removes early.
- Removal creates political controversy.
- Attribution remains low-confidence.
- Administration overstates confidence.
- Authentic domestic actors repeat the claim independently of foreign direction.
- Exposure is concentrated among highly engaged users rather than universal.

---

# 30. Adversarial proof E — Quiet serious condition remains quiet

## 30.1 Canonical chain

```text
serious regional healthcare-access decline
→ affected population experiences longer travel and delayed care
→ local administrative data is incomplete
→ no strong official national estimate yet
→ local outlets have weak resources
→ no journalist develops sufficient evidence
→ organizations remain small
→ platforms do not broadly distribute scattered local discussion
→ national audiences largely do not notice
→ White House receives no valid high-confidence route
→ no presidential interruption occurs
```

## 30.2 Coherent continuation

- local officials may act;
- families may migrate or change providers;
- local trust and salience may rise;
- later survey, investigation, lawsuit, governor request, or crisis may expose it;
- condition may worsen without a national story.

## 30.3 Pass condition

The model does not manufacture coverage or salience to fill a drama quota.

---

# 31. Adversarial proof F — Presidential communication bundle without hidden fan-out

## 31.1 Canonical chain

```text
President authorizes release of evidence and a national address
→ distinct White House instruments authorize evidence release,
  speech production, press briefing, and platform/outlet distribution attempts
→ agencies/Counsel determine what may lawfully be released
→ Communications creates artifacts within authorization
→ outlets choose coverage and framing
→ platforms/channels distribute unevenly
→ recipients notice, trust, interpret, and attribute independently
→ opposition, organizations, and journalists respond autonomously
```

## 31.2 Watchpoint

Staff may not silently add:

- an agency order;
- a congressional promise;
- an admission of fault;
- a new policy commitment;
- a targeted ad campaign;

unless the President authorized the corresponding act.

## 31.3 Pass condition

The player’s intended communication bundle remains visible and bounded; routine dispatch stays background.

---

# 32. Anti-cheat and anti-ontology tests

The design must reject the following:

## 32.1 Reality ownership cheat

```text
Story says corruption occurred
→ corruption becomes true
```

## 32.2 Omniscient outlet cheat

```text
canonical hidden failure exists
→ every outlet knows
```

## 32.3 Automatic coverage cheat

```text
severity > threshold
→ national news
```

## 32.4 Universal exposure cheat

```text
national publication
→ all citizens exposed
```

## 32.5 Delivery-belief cheat

```text
platform impression
→ recipient believes
```

## 32.6 Direct approval cheat

```text
presidential speech
→ approval +5
```

## 32.7 Artifact independence cheat

```text
ten derivative stories
→ ten independent confirmations
```

## 32.8 Correction rewind cheat

```text
correction published
→ original exposure and belief deleted
```

## 32.9 Global attention cheat

```text
MediaAttention = 90
→ every outlet and audience prioritizes issue
```

## 32.10 Global credibility cheat

```text
OutletCredibility = 82
→ all audiences trust all topics
```

## 32.11 Platform mind-reading cheat

```text
recipient secretly believes X
→ platform exactly targets X without observed proxy
```

## 32.12 Aggregate hive-mind cheat

```text
social media users share claim
```

without a distributional/unit-level or coordination process.

## 32.13 Engagement-truth cheat

```text
high engagement
→ claim considered true
```

## 32.14 Trending-causation cheat

```text
topic appears on trend list
→ underlying public salience is set
```

## 32.15 Synthetic-account population cheat

```text
100,000 bot accounts
→ 100,000 voters
```

## 32.16 Hidden staff fan-out cheat

```text
President authorizes speech
→ staff also orders agency action
```

## 32.17 Precision laundering cheat

```text
modeled audience reach
→ exact exposed population
```

## 32.18 False methodological perfection cheat

```text
analyst sees correlated evidence
→ must always handle it correctly
```

The actor may err; the evidence support remains honest.

---

# 33. External research and solved-problem evidence

## 33.1 Fragmented news use and trust

**[ER]** Pew Research Center’s 2025 and 2026 surveys show substantial variation in regular source use and trust across partisan and political-typology groups. They also show that many Americans encounter political news incidentally rather than through active search, that source use differs sharply by age and party, and that national, local, and social-media trust are not interchangeable.

Design implication:

- audiences require differentiated channel use, source trust, and active-versus-incidental acquisition;
- one national media audience is insufficient.

Sources:

- Pew Research Center, “The political gap in Americans’ news sources,” June 10, 2025:
  https://www.pewresearch.org/journalism/2025/06/10/the-political-gap-in-americans-news-sources/
- Pew Research Center, “News source use varies widely across the political typology groups,” June 10, 2026:
  https://www.pewresearch.org/chart/news-source-use-varies-widely-across-the-political-typology-groups/
- Pew Research Center, “Americans’ Complicated Relationship With News,” February 11, 2026:
  https://www.pewresearch.org/journalism/2026/02/11/americans-complicated-relationship-with-news/
- Pew Research Center, “Where do Americans turn first for information about breaking news?” March 24, 2026:
  https://www.pewresearch.org/short-reads/2026/03/24/where-do-americans-turn-first-for-information-about-breaking-news/

## 33.2 Personalized and behavior-dependent platform feeds

**[ER]** TikTok and YouTube’s official descriptions state that recommendations depend on user interactions, followed accounts, searches, recency, location/language and other signals; they also distinguish content eligibility from recommendation and describe personalization as recipient-specific rather than one common feed.

Design implication:

- platform availability, eligibility, ranking, presentation, and exposure must remain distinct;
- platforms can use observed behavior and platform records, not hidden canonical belief.

Sources:

- TikTok, “Making your feed For You,” updated June 3, 2025:
  https://www.tiktok.com/safety/en/making-your-feed-for-you
- YouTube, “On YouTube’s recommendation system”:
  https://blog.youtube/inside-youtube/on-youtubes-recommendation-system/

These are company descriptions, useful for mechanism vocabulary but not treated as independent validation of platform social effects.

## 33.3 Exposure to false-news sources is concentrated

**[ER]** Grinberg et al. found that engagement with fake-news sources on Twitter during the 2016 U.S. presidential election was highly concentrated, with a small portion of users accounting for most exposures and shares, while most political news exposure still came from mainstream sources. Guess, Nagler, and Tucker similarly found that sharing links from fake-news domains on Facebook was relatively rare and concentrated among particular users.

Design implication:

- misinformation exposure should be heterogeneous and may be concentrated;
- a misinformation campaign need not affect the whole population;
- highly engaged subgroups can matter without becoming representative of everyone.

Sources:

- Grinberg et al., “Fake news on Twitter during the 2016 U.S. presidential election,” Science 363 (2019):
  https://doi.org/10.1126/science.aau2706
- Guess, Nagler, and Tucker, “Less than you think: Prevalence and predictors of fake news dissemination on Facebook,” Science Advances 5 (2019):
  https://doi.org/10.1126/sciadv.aau4586

## 33.4 Repetition can affect perceived truth

**[ER]** A 2026 systematic review and meta-analysis across 182 studies found a robust small illusory-truth effect: repeated information tends to receive higher truth judgments, while cue type and context can moderate the effect.

Design implication:

- repeated exposure may matter even when it does not add independent evidence;
- content lineage and exposure frequency must both be preserved;
- repetition should not guarantee belief.

Source:

- “Systematic review and meta-analysis of the evidence for an illusory truth effect and its determinants,” Nature Communications (2026):
  https://www.nature.com/articles/s41467-026-70041-x

## 33.5 Corrections can help without rewinding belief

**[ER]** Research on correction effects finds that corrections can reduce misperceptions but may be incomplete, short-lived, or context-dependent. The design should permit correction to work, fail, decay, or reach different audiences rather than hardcode either perfect correction or inevitable backfire.

Sources:

- Walter and Tukachinsky, “A Meta-Analytic Examination of the Continued Influence of Misinformation in the Face of Correction,” Communication Research (2020):
  https://doi.org/10.1177/0093650219854600
- Nyhan et al., “The ephemeral effects of fact-checks on COVID-19 misperceptions in the United States, Great Britain and Canada,” Nature Human Behaviour (2022):
  https://doi.org/10.1038/s41562-021-01278-3

## 33.6 Accuracy and social motivations both matter

**[ER]** Experimental work indicates that accuracy motivation can improve truth discernment and sharing quality, while partisan congruence, familiarity, and social motivations can also affect belief and sharing.

Design implication:

- recipient behavior cannot be reduced to partisanship alone;
- belief and sharing may use different criteria;
- interventions may affect sharing without directly setting belief.

Sources:

- Rathje et al., “Accuracy and social motivations shape judgements of (mis)information,” Nature Human Behaviour (2023):
  https://www.nature.com/articles/s41562-023-01540-w
- Pennycook et al., “Accuracy prompts are a replicable and generalizable approach for reducing the spread of misinformation,” Nature Communications (2022):
  https://www.nature.com/articles/s41467-022-30073-5

## 33.7 Research limits

**[DI]** The cited evidence does not justify one universal numerical effect size in the game.

Studies differ by:

- platform;
- year;
- population;
- content;
- exposure;
- measurement;
- political context;
- outcome;
- experimental versus observational design.

The design uses them to reject universal exposure, universal trust, perfect correction, and evidence-counting shortcuts—not to select final formulas.

---

# 34. Unresolved design questions

1. Which media organizations and outlets require persistent identity in the first product?
2. Which journalists or investigative teams require individualization?
3. How many platform/channel families are necessary?
4. What audience/media-use associations belong in PopulationState versus sparse domain relations?
5. What public-belief propositions are worth retaining?
6. What memory should persist at individual, household, cohort, or audience level?
7. How should source trust and outlet trust interact?
8. How should direct material experience compete with communicated claims?
9. What exact platform personalization and moderation resolution is needed?
10. How are interpersonal networks represented without social-graph explosion?
11. What makes a local story eligible for national pickup?
12. How is paid political advertising calibrated?
13. How are bots, coordinated accounts, and synthetic media represented?
14. How is outlet ownership/consolidation modeled?
15. How can the player understand fragmented exposure without seeing debug reach?
16. How do public salience, candidate preference, turnout, and organization action later interact?
17. How much media/public-belief history must generated prehistory retain?
18. What information consequences are necessary before Early Access?
19. How should the game render disagreement over truth without false equivalence?
20. How should the game distinguish honest uncertainty from strategic ambiguity?

---

# 35. Candidate audit gate

The detached Step 8 audit must answer:

> **Can autonomous speakers, journalists, outlets, platforms, organizations, officials, and fragmented recipients produce, select, investigate, frame, publish, distribute, receive, correct, remember, believe, attribute, and act on information through bounded evidence, explicit proposition and derivative lineage, audience-specific exposure, recipient-owned trust and cognition, and independent political processes—without media owning reality, duplicate artifacts becoming independent proof, universal exposure, one global attention/credibility/virality score, scripted scandal generation, omniscient platform targeting, perfect analysts, or direct approval/election modifiers?**

PASS requires all of the following:

1. underlying truth remains with its semantic owner;
2. evidence remains distinct from claim and framing;
3. truth, speaker belief, intent, claimed confidence, and recipient belief remain separate;
4. load-bearing claims identify proposition or bounded semantic target;
5. derivative artifacts retain source and proposition lineage;
6. repeated exposure can matter without becoming independent confirmation;
7. journalists can discover evidence but cannot generate underlying wrongdoing;
8. editorial selection is actor-owned and bounded;
9. outlet, parent organization, newsroom, journalist, and platform decision loci do not duplicate entities or actions;
10. publication, availability, presentation, delivery, exposure, notice, comprehension, memory, belief, salience, and action remain distinct;
11. audience targeting preserves Step 3 support honesty;
12. platforms use possessed records/proxies rather than hidden beliefs;
13. recipients may misunderstand, disbelieve, forget, or remain uncertain;
14. trust is recipient/source/topic/time specific rather than universal;
15. corrections create new artifacts and uneven exposure rather than rewinding history;
16. ordinary people can share without becoming one aggregate hive mind;
17. bot/account activity does not add population or voter weight;
18. misinformation/disinformation can fail, concentrate, or backfire;
19. polling measures public state rather than owning it;
20. political action and elections remain separately resolved;
21. administration monitoring and escalation preserve bounded access;
22. same-time and stochastic media dynamics remain stable;
23. all six adversarial proofs remain coherent under perturbation;
24. player-facing explanation is possible without exposing protected or canonical hidden truth.

A PASS would establish only the common Step 8 media/information/public-belief contract.

It would not prove final media algorithms, public-opinion realism, platform calibration, actor count, content quality, UI legibility, generated-prehistory quality, performance, balance, or fun.

---

# 36. Candidate disposition

## **READY FOR DETACHED STEP-8 AUDIT**

The proposed answer is:

> **A politically alive information environment can emerge when autonomous speakers and media actors operate on bounded evidence; claims preserve proposition, support, framing, and derivative lineage; channels and platforms separately control availability and presentation; fragmented recipients separately control notice, trust, memory, belief, attribution, salience, and action; corrections and investigations add history rather than rewriting it; and no global media, issue, attention, credibility, virality, approval, or election owner is permitted.**

This file is a candidate only.

No Step 8 authority exists until a detached audit is preserved, any blocking findings are repaired, the unchanged gate passes, and a separate authority action explicitly accepts the resulting composite.

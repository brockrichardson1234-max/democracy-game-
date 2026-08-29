# Living Country Step 7 — Final Contract Repair

Status: **LIVING-COUNTRY STEP-7 REPAIR CANDIDATE — PRESERVED FOR DETACHED RE-AUDIT. NOT ACCEPTED PRODUCT, ARCHITECTURE, STATISTICAL-SYSTEM, INTELLIGENCE, POLLING, MEDIA, UI, CALIBRATION, ROADMAP, EARLY-ACCESS, SCHEMA, RUNTIME, OR IMPLEMENTATION AUTHORITY.**

This document repairs only the findings returned against:

- `38_LIVING_COUNTRY_OBSERVATION_MEASUREMENT_CONTRACT.md`
- candidate commit `232f5582a2f176210045f0eebabec1c18eb7b998`
- detached audit `39_LIVING_COUNTRY_STEP7_DETACHED_AUDIT.md`
- audit commit `b77dc5a0a20679fa2fc7e7752d403346e4315a6b`

Audit disposition being repaired:

- **REVISE**
- one blocking finding: evidence products could share data/error sources but later be combined as though independent;
- four bounded clarifications: supersession/withdrawal state, delayed releases, source evaluation versus recipient trust, and non-symmetric uncertainty.

Where this document conflicts with `38`, this document controls.

This repair does not broaden Living Country Step 7. It does not choose exact covariance formulas, sample designs, polling models, intelligence-source graphs, forecast ensembles, UI, calibration, media/public-belief dynamics, roadmap, or implementation.

---

# 1. Repair disposition

The Step 7 center remains:

> **Versioned evidence-production processes between canonical reality and actor knowledge.**

The candidate is repaired by adding five controlling rules:

1. evidence dependency is separate from ordinary source provenance;
2. combined evidence may not assume independence without support;
3. release lineage distinguishes normal supersession, correction, withdrawal, and methodological replacement;
4. expected-but-delayed releases remain process state rather than missing values or hidden knowledge;
5. source evaluation, recipient trust, and uncertainty shape remain semantically honest.

Acceptance still requires the unchanged Step 7 gate to pass and a separate authority receipt.

---

# 2. Evidence-dependence lineage

## 2.1 Core invariant

**[HARD INVARIANT LC-OBSR01] Potentially combined evidence products must preserve enough dependency lineage to prevent a consumer from assuming independence without support.**

Ordinary causal/source provenance answers:

> Where did this estimate or assessment come from?

Dependency lineage answers a different question:

> If this product is combined with another product, which uncertainty-producing evidence, respondents, controls, models, reports, or transformations do they share?

Both are required when the distinction is load-bearing.

## 2.2 Dependency may arise from shared evidence or method

Potential dependence may arise through:

- same survey sample;
- overlapping respondents;
- rotating/reused panels;
- same administrative source records;
- same census/control totals;
- same weights or calibration controls;
- same imputation/model component;
- same seasonal-adjustment inputs;
- same benchmark;
- same source report;
- same originating intelligence source repeated through intermediaries;
- one product explicitly consuming another product;
- same forecast baseline;
- same private data vendor;
- same geographic/population model allocation;
- same latent-variable model;
- same historical revised series used as input.

Shared subject alone is insufficient to establish dependence.

Different product IDs are insufficient to establish independence.

## 2.3 Dependency declaration

A load-bearing evidence product or methodology must be able to expose, where applicable:

- observation/sample/panel family identity;
- source-data family identity;
- relevant respondent/sample overlap relation;
- administrative dataset lineage;
- population-control/weighting lineage;
- imputation/model lineage;
- benchmark/rebase lineage;
- explicit derivation from another evidence product;
- source-report lineage for intelligence/investigation;
- known covariance/correlation where actually modeled;
- qualitative dependence class where exact covariance is unavailable;
- declared independence with methodological justification where appropriate;
- unknown dependence where unresolved.

These are semantic obligations. Step 7 does not prescribe one covariance matrix or runtime representation.

## 2.4 Dependence support classes

A later design may use richer mathematics, but the semantic system must at least distinguish:

1. **INDEPENDENCE_SUPPORTED**
   - design/source structure supports treating the relevant error terms as independent for the stated operation;
2. **DEPENDENCE_MODELED**
   - covariance/correlation/dependence is estimated or represented;
3. **DEPENDENCE_KNOWN_QUALITATIVELY**
   - products are known to share evidence/method but exact dependence is not available;
4. **ALTERNATE_REPRESENTATION_OR_REVISION**
   - products are not additional independent evidence of the same historical quantity; one is a revision, restatement, or alternate expression;
5. **DERIVED_FROM_OTHER_PRODUCT**
   - one product explicitly consumes another and cannot be treated as an independent corroboration of its upstream evidence;
6. **DEPENDENCE_UNKNOWN**
   - relationship is unresolved.

The names are design semantics, not required implementation enums.

## 2.5 Combination contract

**[HARD INVARIANT LC-OBSR02] A consumer combining multiple evidence products must use a combination treatment compatible with their dependency support.**

Valid treatments include:

- independence-supported combination;
- explicit covariance/dependence model;
- conservative correlation/dependence assumption;
- bounded range;
- hierarchical/source-family model;
- preferred nonduplicative evidence basis;
- one product treated as revision/replacement rather than additional evidence;
- unresolved result;
- no combination.

Forbidden:

```text
separate artifact IDs
→ assume independent errors
→ shrink uncertainty automatically
```

Forbidden:

```text
three intelligence reports
→ count three independent sources
```

when all ultimately trace to one originating source.

## 2.6 Shared cause versus shared error

**[HARD INVARIANT LC-OBSR03] Shared causal subject and shared evidence dependence are distinct.**

Two independent surveys can measure the same Labor condition and have largely independent sampling error.

Two estimates of different conditions can share the same modeled population controls and therefore share some error dependence.

A source graph must not infer either independence or dependence merely from the fact that products discuss the same topic.

## 2.7 Revision families

Advance, second, third, benchmark, or annual revisions of one historical statistical series are linked vintages.

Unless a later method explicitly treats innovations between vintages as separate evidence, they do not count as multiple independent observations of the underlying historical period.

Historical view:

```text
advance estimate
→ later second estimate
→ later third estimate
```

means the information set evolved.

It does not mean the administration received three independent samples of the quarter.

## 2.8 Polling dependence

Poll aggregation must be able to preserve dependence arising from:

- shared panels;
- same pollster/methodology;
- overlapping field dates and respondents;
- common weighting controls;
- shared likely-voter models;
- same underlying vendor/sample frame.

This does not require a later poll average to model every covariance exactly.

It prohibits pretending those products are fully independent when the support does not justify it.

## 2.9 Intelligence-source echo

Intelligence/reporting chains must preserve enough source lineage to identify potential source circularity or echo when load-bearing.

Example:

```text
Source S tells intermediary A
Source S also tells intermediary B
A and B independently report to intelligence element
```

The element may have two reports but not necessarily two independent sources.

Analysts may remain uncertain about whether two reports share an origin. That uncertainty itself is legitimate evidence state.

## 2.10 Forecast ensembles

An ensemble of forecasts may gain information from model diversity.

It may not gain fictional precision by treating models using the same baseline, data vintage, or core structural assumptions as independent draws when they are not.

The later forecast design may use:

- dependence-adjusted ensembles;
- model-family weighting;
- scenario ranges;
- qualitative disagreement;
- or another accepted method.

Step 7 requires only support honesty.

## 2.11 Geographic/population model dependence

If multiple small-area estimates depend on the same modeled disaggregation or population controls, that shared dependency must survive sufficiently for later aggregation or comparison.

A later national or state total cannot narrow its uncertainty by adding many local modeled estimates whose errors arise from one common control process while assuming independence.

---

# 3. Evidence-combination falsification tests

## 3.1 Shared sample

Two statistics derived from one survey sample are compared or combined.

PASS:

- covariance is modeled where needed;
- or dependence is conservatively handled/bounded;
- or the consumer refuses unsupported precision.

FAIL:

- the system sees two artifact IDs and applies independent-error math automatically.

## 3.2 Overlapping polling panel

Two polls use an overlapping nonprobability panel.

PASS:

- aggregation recognizes shared recruitment/panel dependence or treats dependence as unresolved.

FAIL:

- the UI/analyst labels the average's precision as though two independent samples were drawn.

## 3.3 Intelligence echo

Three finished reports trace to one original human source.

PASS:

- the assessment distinguishes three reports from one underlying source when known;
- or explicitly marks source independence uncertain.

FAIL:

- confidence triples because report count equals source count.

## 3.4 Successive GDP-like vintages

Advance, second, and third estimates exist.

PASS:

- they are linked as evolving vintages of one estimate family;
- a historical actor can compare revisions;
- a retrospective model may use latest vintage under declared rules.

FAIL:

- three vintages are averaged as independent measurements of the quarter with artificially narrow uncertainty.

## 3.5 Shared modeled local controls

Five county estimates are built from one state control and one small-area allocation model.

PASS:

- aggregate reuse recognizes common model/control lineage.

FAIL:

- adding five county uncertainty terms as independent produces a falsely precise state estimate.

---

# 4. Release status and lineage

## 4.1 Core release states

The publication/revision contract is clarified to distinguish, where relevant:

- **CURRENT_VALID** — currently accepted vintage for its release family;
- **SUPERSEDED_NORMAL_REVISION** — historically valid publication replaced by a later routine revision/benchmark;
- **CORRECTED_PUBLICATION_ERROR** — publication contained an error later corrected;
- **WITHDRAWN_OR_RETRACTED** — issuing institution no longer treats the artifact as valid evidence for current use;
- **METHODOLOGICALLY_REPLACED_OR_REBASED** — later series/method replaces or rebases the analytical representation while preserving lineage.

Exact labels remain implementation design.

## 4.2 Historical receipt survives status change

**[HARD INVARIANT LC-OBSR04] Supersession, correction, withdrawal, or methodological replacement does not erase historical publication, receipt, citation, belief, or action.**

A withdrawn product may remain visible in historical Record as something actors saw while no longer being valid current evidence.

## 4.3 Current-use semantics

A later analytical process must know whether it is intentionally using:

- latest valid vintage;
- vintage available as of a historical date;
- originally published vintage;
- a withdrawn artifact for historical analysis only;
- a methodologically harmonized/restated series.

No silent substitution is permitted when the choice can affect a supported conclusion.

---

# 5. Delayed and failed release states

## 5.1 Expected release is not guaranteed release

A scheduled statistical/reporting process can encounter:

- late source data;
- incomplete processing;
- quality-control failure;
- operational outage;
- shutdown;
- legal/confidentiality issue;
- emergency disruption;
- unresolved methodological problem.

The process may therefore become delayed, rescheduled, partially released, or cancelled where applicable.

## 5.2 Delay invariant

**[HARD INVARIANT LC-OBSR05] Failure to release on the expected date is process state, not a value for the measured condition and not implicit access to the unreleased estimate.**

Forbidden:

```text
release missing
→ estimate = 0
```

Forbidden:

```text
public release delayed
→ White House automatically sees completed private estimate
```

unless an explicit lawful prerelease/internal-access route exists.

## 5.3 Attention consequence

A delayed important release may itself become an observable institutional development if the administration legitimately learns of the delay.

It still does not reveal the missing measurement value.

---

# 6. Source evaluation versus recipient trust

## 6.1 Evidence-side evaluation

A measurement, investigation, intelligence, or analytic process may record evidence-side properties such as:

- chain of custody;
- collection method;
- source access position;
- prior verification history;
- internal consistency;
- corroboration;
- known contradictions;
- methodological limitations.

An intelligence organization may derive an institutional source-reliability judgment from those facts.

## 6.2 Recipient-side trust

**[HARD INVARIANT LC-OBSR06] A recipient's trust in a source, institution, outlet, pollster, intelligence element, or statistical agency remains recipient-owned.**

Two actors may receive the same official estimate or intelligence assessment and weight it differently because of:

- prior experience;
- role;
- ideology;
- institutional rivalry;
- source knowledge;
- competing evidence;
- political incentive;
- methodological understanding.

Evidence provenance does not directly prescribe actor belief.

## 6.3 No universal credibility scalar

A player-facing summary such as `high source quality` may exist if derived from appropriate evidence.

It may not operate as one global scalar that every actor consumes identically.

---

# 7. Uncertainty shape

## 7.1 No universal symmetric interval

**[HARD INVARIANT LC-OBSR07] Step 7 does not assume all uncertainty is symmetric, Gaussian, continuous, or reducible to `estimate ± error`.**

Depending on the accepted method, uncertainty may be represented through:

- symmetric interval;
- asymmetric interval;
- one-sided bound;
- discrete scenarios;
- probability mass over alternatives;
- qualitative confidence;
- categorical support;
- multimodal distribution;
- sensitivity range;
- unresolved/unsupported tail behavior.

## 7.2 Transformation preserves shape honestly

A downstream analytic process may transform uncertainty under its method.

It may not force every input into one symmetric-error representation when doing so materially distorts the supported conclusion.

Step 6 receiver sovereignty remains controlling.

---

# 8. Controlling additions to the Step 7 measurement declaration

Where dependence or release lineage is load-bearing, the Step 7 declaration should now also answer:

- What other products share this sample/source/model/control family?
- Is relevant error dependence known, modeled, assumed, or unknown?
- Is the product a new source of evidence, a revision, or derived from prior evidence?
- What combination operations are justified?
- What release status currently applies?
- Was the expected release delayed, withdrawn, corrected, or superseded?
- What evidence-side source assessment exists?
- Which recipient trust judgments remain separate?
- What uncertainty shape is supported?

---

# 9. Re-audit exploit matrix

The repaired composite should reject:

1. two estimates from same sample treated as independent solely due to IDs;
2. several source-echo intelligence reports treated as several independent sources;
3. successive revisions counted as repeated independent observations;
4. same-panel polls aggregated with unjustified independent-sample precision;
5. common small-area model errors disappearing during aggregation;
6. withdrawn release disappearing from historical actor knowledge;
7. delayed release turning into zero or secret White House knowledge;
8. source-quality record directly writing every recipient's trust;
9. skewed/one-sided uncertainty forced into symmetric error;
10. uncertainty dependence inferred solely from common subject rather than evidence lineage.

---

# 10. Repair disposition

## **READY FOR UNCHANGED DETACHED STEP-7 RE-AUDIT**

The repaired Step 7 answer is:

> **Evidence products preserve both ordinary provenance and, when combination is load-bearing, evidence-dependence lineage. Consumers may not assume independence without support. Release history distinguishes valid, superseded, corrected, withdrawn, delayed, and methodologically replaced states without rewriting prior actor knowledge. Source evaluation remains distinct from recipient trust, and uncertainty retains the shape actually supported by the method.**

No Step 7 authority exists until the unchanged binary gate passes and a separate authority receipt is preserved.
# Music Virality Engine — Architecture

A system that decides how much Explore-page traffic to give an uploaded track,
before it has any engagement data.

Reference implementation: `virality_engine/` (53 tests, stdlib only).
Verification harness: `python3 -m unittest virality_engine.tests.test_engine`.

---

## 1. What the problem actually is

The brief was "use MiroFish to decide which songs get pushed to Explore." Stated
that way it sounds like a prediction problem. It is not. It is a **resource
allocation problem under uncertainty**, and the distinction determines the whole
architecture.

You have a fixed pool of Explore impressions per hour. Every impression spent on
track A is one not spent on track B. At upload time you know almost nothing about
A. So the question is never "is this a hit" — it is:

> Given everything I currently believe about every track, and the cost of being
> wrong in each direction, where should the next impression go?

Three consequences follow, and they are the reason the design looks the way it
does:

1. **A scalar "virality score" is not a policy.** Any single number you compute
   per track has no notion of budget, so it cannot tell you what to do when two
   tracks both score well and you can only afford one. The score is an input to
   allocation, not the answer.

2. **Uncertainty is an asset, not a defect.** A track whose true rate might be
   0.30 is worth promoting even if you currently estimate 0.10, because the
   information you buy is valuable. Any engine without an explicit exploration
   term becomes a popularity contest that can never discover anything new.

3. **Cold start is the whole game.** Once a track has 50k impressions, real data
   dominates and the interesting engineering is over. MiroFish — or any prior —
   only matters in the first few hundred impressions. That is where it should be
   spent, and nowhere else.

### The failure mode to design against

The most common way these systems break is a **feedback loop**: promote what is
already popular, observe that popular things get more engagement, promote them
harder. Within weeks the Explore page is six tracks and discovery is dead. Every
mechanism below exists partly to prevent this.

---

## 2. Architecture

```
                 ┌──────────────────────────────────────────┐
                 │  OFFLINE / ASYNC (slow, expensive)       │
                 │                                          │
  audio + meta → │  feature extraction                      │
                 │  (hook, loudness, tempo, genre)          │
                 │                                          │
  docs + track → │  MiroFish simulation ──→ verdict.json    │
                 │  (Twitter + Reddit agents)               │
                 └────────────────┬─────────────────────────┘
                                  │ simulated_rate (weak evidence)
                                  ▼
┌────────────────────────────────────────────────────────────────────┐
│  ONLINE / SYNCHRONOUS (fast, every few minutes)                    │
│                                                                    │
│   ┌──────────┐   ┌───────────┐   ┌──────────┐   ┌──────────────┐   │
│   │  PRIOR   │──▶│ OBSERVE   │──▶│  SCORE   │──▶│   ALLOCATE   │   │
│   │ features │   │ Beta-     │   │ E[rate]  │   │ budget split │   │
│   │ + sim    │   │ Bernoulli │   │ + SD     │   │ + fairness   │   │
│   │          │   │ update    │   │ + quality│   │   caps       │   │
│   └──────────┘   └───────────┘   └──────────┘   └──────┬───────┘   │
│                                                          │         │
│                                       ┌──────────────────▼──────┐  │
│                                       │  RANKER (separate)      │  │
│                                       │  slot filling, diversity│  │
│                                       └──────────────────┬──────┘  │
└──────────────────────────────────────────────────────────┼─────────┘
                                                           │
                                    Explore page ──────────┘
                                           │
                                     user events
                                           │
                       ┌───────────────────▼────────────────────┐
                       │  FEEDBACK: impressions, completions,   │
                       │  likes, shares, saves, follows, skips, │
                       │  reports  → back to OBSERVE            │
                       └────────────────────────────────────────┘
```

### Layer responsibilities

| Layer | Runs | Input | Output | Why separate |
|---|---|---|---|---|
| **Feature extraction** | once, at upload | audio, metadata | `TrackFeatures` | Deterministic, cheap, cacheable. Never re-run. |
| **MiroFish bridge** | once, at upload, cold tracks only | docs, track info | `simulated_rate`, `kappa` | Slow and expensive (minutes, LLM cost). Must never sit in the serving path. |
| **Prior** | once, at upload | features + sim | `BetaPosterior` | Encodes everything known before exposure. |
| **Observe** | every feedback batch | events | updated posterior | Conjugate update, O(1). |
| **Score** | every allocation round | posterior | value per track | Pure function of state. No side effects, fully testable. |
| **Allocate** | every round | scores + budget | impressions per track | The policy. Owns budget and fairness. |
| **Ranker** | per request | allocation weights | ordered slots | Presentation concerns (diversity, dedup) stay out of the policy. |

**The critical boundary is between Allocate and Ranker.** Allocation decides *how
many* impressions each track earns in a window. Ranking decides *which specific
slot* each impression fills. Mixing them is how you end up with a system where
you cannot tell whether a track underperformed because the policy misjudged it or
because the ranker buried it.

---

## 3. The formulas

### 3.1 Prior — engagement rate before any data

Built in log-odds space so contributions compose multiplicatively and the output
is guaranteed to stay in (0, 1):

```
logit(p_prior) = logit(p_base)
               + 0.9  · (hook_score − 0.5)
               + 0.6  · (audio_completeness − 0.5)
               + 0.5  · (metadata_quality − 0.5)
               + 0.8  · (language_match − 1)
               + 0.35 · log1p(followers) / log1p(1000)
               + 0.7  · (logit(artist_rate) − logit(p_base)) · confidence
               + 0.15 · is_remix
               − 0.02 · days_since_upload
```

with `p_base = 0.09` and

```
confidence = artist_prior_trials / (artist_prior_trials + 500)
```

The `confidence` term is the empirical-Bayes step and it is not optional. Without
it, an artist with 12 impressions of history can drag the prior anywhere. With
it, the artist's history only speaks in proportion to how much of it there is.

The prior is converted to a Beta with **`PRIOR_STRENGTH = 200` pseudo-observations**:

```
p_prior ~ Beta(p_prior · 200, (1 − p_prior) · 200)
```

Two hundred is a deliberate choice, and it is the **security parameter**, not a
smoothing knob. It sets how much evidence a track needs before the data can move
the estimate — and therefore how large a coordinated population must be before it
can clear the quality gate at all. See §3.6.

This value was raised from 8, which allowed a seven-account pod to move a weak
track. `spec/config_search.py` measures the trade: at α=200 the minimum viable
pod is ~124 accounts, a 16× improvement. The cost is that new tracks ramp more
slowly, which is what the cold-start lane in §3.4 exists to pay for. **Do not
lower this to fix cold start — lower the gate or widen the lane instead.**

**Coefficient fitting.** The weights above are set from domain reasoning. In
production they are fitted by logistic regression on historical first-1000-
impression cohorts, with the target being whether the track reached the top
decile. The structure stays; only the numbers move. Critically, every feature is
observable *before* exposure, so fitting cannot leak post-exposure information
back into the prior.

### 3.2 Observation — turning events into a rate

```
rate = (1.00·shares + 0.45·saves + 0.35·follows + 0.20·likes + 0.10·profile_visits
        − 0.30·early_skips − 3.00·reports) / impressions
```

The weights answer one question: *how much does this signal predict that the
track will still be spreading in 30 days?*

- **Share = 1.00.** A share is a user spending their own social capital on your
  track. This is the actual mechanism by which music spreads. Everything else is
  measured against it.
- **Save = 0.45.** Private intent to return. Strong, but no social broadcast.
- **Like = 0.20.** Cheap, near-zero cost to the user, weakly predictive.
- **Report = −3.00.** A safety signal, not a taste signal, weighted hard enough
  to remove a track from allocation on its own.

**The denominator is impressions, never plays.** Plays are censored by exposure —
a track with more impressions has more plays mechanically. Using plays as the
denominator is the single most common way these systems develop a feedback loop.

The update is conjugate, with a floor and a ceiling:

```
if impressions < 50:            return prior          # too little to matter
rate      = engagement_rate(obs)
trials    = min(impressions, 4000)                    # cap single-batch evidence
successes = rate · trials
posterior = Beta(prior.α + successes, prior.β + trials − successes)
```

The 50-impression floor stops one unlucky impression killing a track. The 4000
cap stops a lucky batch making a track unfalsifiable.

### 3.3 Score — promotion value

```
E[rate], SD[rate]  ← Monte Carlo from the posterior (256 draws)
                   (SD taken as the 16th–84th percentile spread, robust to tails)

base       = 1.00·E[rate] + 0.55·SD[rate] + 0.35·completion_rate
fatigue    = 1 − exp( −(recent_impressions / fair_share) / 4.0 )
value      = base · (1 − 0.50·fatigue)
shrink     = max(0.12, impressions / (impressions + 8))
score      = value · shrink
```

Four design decisions worth defending:

**`SD[rate]` is a reward, not a penalty.** This is the exploration term and the
most important knob in the engine. It is the price of information. Set
`exploration = 0` and the engine becomes greedy: it promotes whatever looks best
right now and never discovers the track whose true rate is 0.30 but whose
estimate is 0.10. The test suite asserts that two tracks with *identical* means
but different variances do not score equally.

**Fatigue is a bounded multiplicative discount, not an additive penalty.** This
matters more than it looks. The score's natural scale is ~0.1–0.5. An additive
penalty bounded by 1.0 clamps every score to zero once tracks saturate, at which
point the allocator falls back to spreading the budget evenly — and because the
best tracks saturate first, the worst tracks end up with the most traffic. (This
bug was written, caught by test, and fixed; see `test_fatigue_cannot_invert_ranking`.)
As a discount floored at `1 − weight`, fatigue can only rotate traffic between
rounds, never overturn a ranking.

**`shrink` fights small-sample flattery.** A track at 4/4 shares must not outrank
one at 900/2000. The floor of 0.12 keeps unseen tracks schedulable — shrink them
to zero and they can never earn their first impressions.

**Fatigue uses *recent* exposure, not cumulative.** Cumulative exposure never
decays, so every track eventually saturates and the signal stops discriminating.

### 3.4 Allocation

```
fair_share  = total_impressions / n_tracks
lane        = tracks with impressions < cold_start_slots   (200)
cold        = tracks with impressions < 500
warm        = the rest, minus any that fail the quality gate (§3.6)

explore_budget = total · exploration_floor     (0.20)
exploit_budget = total − explore_budget

lane tracks   ← their remaining entitlement to cold_start_slots  (guaranteed)
cold tracks   ← explore_budget, proportional to score
warm tracks   ← exploit_budget, proportional to score
```

**The cold-start lane is a guarantee, not a cap.** Every upload is entitled to
`cold_start_slots` impressions regardless of score, and lane tracks then compete
for the rest of the round's budget on top of that. This is what lets
`PRIOR_STRENGTH` stay at 200 without stranding new uploads: a genuinely good
track reaches the gate inside its entitlement.

Two failure modes to avoid, both of which were real bugs:

- **Do not exclude lane tracks from the pools.** Doing so stranded the entire
  round budget whenever every track was new — the normal case at launch.
  `test_lane_does_not_strand_the_budget` guards it.
- **Size the lane against the prior.** A track of true quality *q* needs
  `α·(gate − prior_q)/(q − gate)` impressions to clear. At α=200, gate=0.60 that
  is 150 impressions for a q=0.80 track, so a 200-slot lane covers it. At
  gate=0.65 it would be 267 and the lane would be short.

```
cap = max(total · max_share_per_track, total / n_eligible)
apply cap, redistribute overflow to tracks with headroom (3 passes)
apply min_impressions_per_track floor
```

`exploration_floor = 0.20` is the **structural guarantee** of explore/exploit. It
is not a heuristic. Without it, cold tracks lose every round on score — they have
higher variance, yes, but lower means — and can never accumulate the impressions
needed to compete. The floor is what makes the system self-correcting rather than
self-reinforcing.

**`max_share_per_track` is a concentration limit, not a spend throttle.** The
allocator guarantees the full budget is spent, because unspent impressions are
lost discovery and lost revenue. If the configured cap is arithmetically too
small to permit a full spend (below `1/n_tracks`), it is raised to `1/n_tracks`
and the affected allocations are flagged `+caprelaxed` so the override appears in
logs rather than happening silently. This was also a real bug: with 3 tracks and
a 15% cap, 55% of impressions vanished.

### 3.5 The metric that tells you if it works

```
realised      = this round's observed rates, per track
oracle        = best achievable engagement given those rates,
                same cap AND same eligible set
efficiency    = realised_gain / oracle_gain          ∈ [0, 1]
```

The oracle must be built from the **same realised rates** the policy saw, not from
ground truth. Otherwise a lucky noisy round beats the oracle and efficiency
exceeds 100%, which makes the number unreadable. Bounded this way, efficiency has
a plain meaning: *how close to the best possible allocation we got, given what
actually happened.*

The oracle must also face the **same feasible set** as the allocator, and the
eligible set must be captured **before** the posterior update. The quality gate
(§3.6) makes eligibility dynamic, so an oracle optimising over tracks the
allocator is forbidden to serve is no longer an upper bound — this produced an
observed efficiency of 2.02 before it was fixed. `eligible_track_ids` mirrors the
allocator's rules for exactly this reason; the two must be kept in sync.

---

### 3.6 The quality gate — the actual defence

Allocation is not the whole story. A track earns **durable** reach only once its
shrunken completion estimate clears a threshold:

```
est_q  = (completion · n + prior_q · α) / (n + α)        shrunken estimate
floor  = α · (gate − prior_q) / (1 − gate)               impressions to clear
```

At α=200, gate=0.60, prior_q=0.45: **floor = 75.0 impressions.** Below that, no
quality clears — not even a perfect track. This is the property that makes the
defence structural rather than statistical.

`VITALITY-ENGINE.md` §5.2 calls the gate **population-agnostic**, and that is the
point: the floor is a sample-size threshold, and fabrication cannot manufacture
distinct listeners. A fabricated sample faces exactly the same floor as an organic
one. `TestQualityGate.test_gate_is_population_agnostic` asserts it directly.

So the ordering of defences is:

1. **The prior** — makes the gate unreachable without a real sample.
2. **The gate** — makes durable reach conditional on having one.
3. **Detection** — the second line, for populations large enough to matter.

The gate blocks **exploit traffic only**. Cold-lane and exploration traffic stay
ungated by design, because that is how a track earns the sample it needs to be
judged at all. A warm track that fails the gate is known-poor rather than unknown,
so it is dropped for the round rather than moved to exploration, which is reserved
for genuine uncertainty.

### Why the gate moved to 0.60 rather than the prior moving down

`IGNITION-ENGINE.md` §8 lowered α to 100 to make cold start work in a 60-minute
window. That is the expensive dial: security scales with α. The three dials are
separable, and this is the design decision:

| Dial | Controls | Cost of lowering |
|---|---|---|
| `PRIOR_STRENGTH` | security — min pod size | linear loss of seeding resistance |
| `GATE_Q` | quality — how good a track must be | small security loss |
| `cold_start_slots` | cold start — guaranteed impressions | impressions, not security |

Measured in `spec/config_search.py`, from α=200 / gate=0.65:

| Option | Min pod | Security cost | Impressions for a q=0.80 track |
|---|---|---|---|
| do nothing | 188 | — | 267 |
| **lower gate to 0.60** | **124** | **−34%** | **150** |
| lower α to 100, gate 0.60 | 62 | −67% | 75 |

Lowering the gate buys the same cold-start relief for half the security cost, and
the lane is free of both. **Chosen: α=200, gate=0.60, lane=200 — a 124-account
seeding floor for the price of one saturated lane.**

---

## 4. Where MiroFish fits — and its measured value

MiroFish simulates agents reacting to a track and emits `report/verdict.json`
with a prediction label, confidence, key dynamics, and signals. That is a
**prior** — weak evidence about behaviour, available before real data exists.

### The integration contract

```
simulated_rate = neutral + (anchor(label) − neutral) · confidence
kappa          = kappa_max · max(0, pearson_r) · (1 − normalised_bias)
```

Three rules, all enforced in code:

1. **MiroFish enters as a prior, never as an observation.** It is folded in as
   `kappa` pseudo-observations, so a handful of real impressions overrides it.
2. **`kappa` is fitted, not guessed.** `Calibrator` compares simulated against
   realised rates on tracks that have already run. Verified behaviour: an
   accurate simulation earns `kappa ≈ 40`; one that ranks well but is
   systematically optimistic is discounted to `kappa = 0`, because a biased prior
   moves every track the same direction and does no useful work.
3. **MiroFish is consulted for cold tracks only.** For a track with 50k real
   impressions the simulation is wasted compute and adds nothing.

### What I measured

60-track catalogue, 8 genuinely strong, 60k impressions/round, 10 rounds, mean of
4 seeds. Simulation correlated with truth at r ≈ 0.75:

| Policy | Steady-state efficiency | First-round efficiency |
|---|---|---|
| No MiroFish | 43.0% | 42.2% |
| MiroFish κ=12 | 43.2% | 48.9% |
| MiroFish κ=24 | 43.6% | 50.7% |
| MiroFish κ=40 | 43.8% | **52.7%** |

**Read this honestly.** MiroFish buys roughly **+10 points of first-round
efficiency** and under **1 point** in steady state. The steady-state number is
near-zero because real engagement data dominates within a few hundred
impressions, exactly as designed.

So the architecture should treat MiroFish as a **cold-start accelerator, not a
ranking engine.** Its value is concentrated in the window where you have no data,
and that window is short. Two implications:

- **Budget it as cold-start infrastructure.** Pay for a simulation only when a
  track is new, and accept that the payoff is a faster ramp, not better steady
  state.
- **Do not let it into the serving path.** It takes minutes and an LLM call.
  Compute it at upload, cache `verdict.json`, and let the online loop run on
  real events.

If you want a larger steady-state gain, the lever is not more simulation — it is
better audio features and richer real-time signals.

### On personas

Worth stating plainly, since it is a tempting misreading: MiroFish's personas
(`reddit_profiles.json`, `twitter_profiles.csv`) are **simulation inputs**, not
assets you deploy. They are characters with a `bio` and a `persona` string. They
carry no credentials, drive no browser, and authenticate nowhere. The engine
consumes `verdict.json`; it never consumes personas.

The temptation is to point those personas at a real platform and have them
generate engagement. Three things are worth knowing before going down that road,
and all three are measured in this repository:

1. **It is coordinated inauthentic amplification** — making a ranking system
   believe engagement occurred that did not. That is the thing the gate in §3.6
   is built to defeat.
2. **On a platform you operate, it costs you money.** `spec/self_poisoning.py`
   measures it: injecting fabricated completions lifts a weak track to rank #1
   but drops feed quality from 0.514 to 0.457 (**−11%**), and it does not recover.
   The cause is false labels in the training signal, not detection — your
   recommender learns from the engagement you fabricated.
3. **It buys nothing you do not already have.** You control serving, so you can
   place a track directly. The cold-start lane already delivers the reach a pod
   would be for.

The engineering answer is the ignition engine (§3.4, §3.6) — allocation, not
fabrication. That is also why `PRIOR_STRENGTH = 200` rather than 8: a seven-account
pod was enough to move a weak track before, and 124 accounts are needed now.
`spec/SECURITY-CONFIG.md` records the full derivation and
`spec/vulnerability_study.py` the adversarial model.

---

## 5. What a production build needs beyond this

The reference implementation is deliberately small. To ship it:

**Data.** An impressions-level event log with a stable `track_id`, `impression_id`
and `session_id`. Without `impression_id` you cannot deduplicate or attribute, and
every rate in the system is wrong.

**Guardrails.**
- *Feedback-loop audit.* Track the share of Explore impressions going to tracks
  older than 30 days. If it climbs past ~70%, the system is eating itself.
- *Exposure quarantine.* Never let a track's promoted impressions exceed some
  multiple of its organic rate, or promotion manufactures its own success signal.
- *Safety gate.* Reports and moderation flags must be able to veto allocation
  outright, outside the scoring path. A score is a number; a safety decision is
  not negotiable.
- *Shadow mode.* Run the new policy alongside the incumbent for two weeks and
  compare efficiency offline before it touches traffic.

**Calibration cadence.** Refit prior coefficients monthly on the last 90 days of
first-1000-impression cohorts. Recompute `kappa` weekly.

**Attribution.** `share` and `follow` events need to attribute back to the
impression that caused them. Without that, the reward signal is noise and the
whole loop optimises nothing.

**What I did not build.** No ranker (slot filling, diversity, dedup), no
counterfactual/off-policy evaluation, no contextual bandit over user segments, no
audio feature extraction, no serving infrastructure. The bandit extension is the
natural next step if you want per-segment personalisation — the Beta posteriors
generalise to a per-segment posterior with no change to the allocation logic.

---

## 6. Tuning cheat-sheet

| Symptom | Knob | Direction |
|---|---|---|
| Unknown tracks never get tested | `SCORE_WEIGHTS["exploration"]` ↑ | Raise from 0.55 toward 1.0 |
| Explore page feels stale, same tracks | `exploration_floor` ↑ | Raise from 0.20 toward 0.35 |
| New tracks ramp too slowly | `cold_start_slots` ↑ | Raise from 200 toward 400 |
| New tracks ramp too slowly (no lane budget) | `GATE_Q` ↓ | Lower from 0.60 toward 0.55 |
| Score jumps on tiny samples | `PRIOR_STRENGTH` ↑ | Raise from 200 (security cost) |
| A pod clears the gate too easily | `PRIOR_STRENGTH` ↑ | Raise from 200 — this is the security dial |
| Explore fills with mediocre tracks | `GATE_Q` ↑ | Raise from 0.60 toward 0.65 |
| One track monopolises Explore | `max_share_per_track` ↓ | Lower from 0.15 |
| MiroFish over-influencing decisions | `kappa_max` ↓ | Lower from 40 |
| Tracks burn out fast | `SCORE_WEIGHTS["fatigue"]` ↑ | Raise from 0.50 |

**Order matters.** To fix a cold-start problem, reach for the lane first, the gate
second, and `PRIOR_STRENGTH` never — it is the security parameter and lowering it
is what allowed a seven-account pod to work. `spec/config_search.py` quantifies
the trade for any (α, gate) pair.

Every one of these can be evaluated with
`simulate_rounds(...)` before it goes near production traffic.

# Vitality engine — ranking model, evidence, and defence

**Date:** 2026-10-15 · **Status of this document:** design record + evidence record.
**Companion files:** `apk-endpoints.md` (paths), `APK-EVIDENCE.md` (shapes), `apk-shapes.tsv`.
**Reproducer:** `scripts/research/vitality_model.py` (stdlib only).

---

## 1. Why this file exists

`APK-EVIDENCE.md` settled which paths and shapes the Android app uses. During that work a
recurring question came up: **why does a post reach the trending / explore surfaces, and can
that be modelled?** The short answer from the shipped artifact is that the ranking is computed
server-side and no score crosses the wire. This document records (a) the evidence for that,
(b) a defensible design for such an engine, and (c) the arithmetic that governs whether any
given post clears the bar.

**Scope note.** Sections 2–4 are evidence and design. Sections 5–7 are arithmetic on that
design. Section 8 records what was deliberately **not** built and why. Nothing here is a
campaign playbook; the seeding analysis exists as an adversarial test of the defence.

---

## 2. Evidence: what the client proves

Recovered from `com.bandlab.bandlab` **11.34.2** (jadx 1.5.6, JDK 21).

| #   | Surface             | Evidence                                                                                                                                                                                                                                                                              | Significance                                                  |
| --- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 1   | Retention payload   | `com.bandlab.post.objects.MediaDurationTrackerRequest` (13 fields: `duration`, `actualPlayedDuration`, `playStartedPosition`, `lastPlayedPosition`, `sessionId`, `postCreatorId`, `genreId`, `caption`, `trendingPostType`, `isFork`, `hasLyrics`, `isPreview`, `associatedEntities`) | The client **does** collect a watch-time class of signal      |
| 2   | Retention endpoints | `POST users/{userId}/track-posts/{postId}/plays`, `POST users/{userId}/video-posts/{postId}/plays`                                                                                                                                                                                    | Where those signals are written                               |
| 3   | Velocity            | `getPopularByTimeRange(userId, genres, timeRange)`                                                                                                                                                                                                                                    | Time-windowed popularity, i.e. velocity not totals            |
| 4   | Trending surfaces   | `genres/{genreId}/posts/trending`, `users/{id}/feeds/trending/posts`, `feeds/trending/videos/posts`, `explore/trending-videos/posts`                                                                                                                                                  | Server-ranked feeds                                           |
| 5   | Reason code         | `recommendationReason` (`com.bandlab.post.objects.PostRecommendationReason`) with a single client-known value `Reacted`                                                                                                                                                               | The only explainability the client has                        |
| 6   | A/B knobs           | `api-variants` query param on trending + following feeds                                                                                                                                                                                                                              | Ranking is variant-gated                                      |
| 7   | Sort                | `sort = recent \| popular \| inspiring`                                                                                                                                                                                                                                               | Server-side ordering                                          |
| 8   | Paid lever          | `isBoosted`, `estimatedImpressions`, `com.bandlab.boost.api.NativeAdsService`                                                                                                                                                                                                         | Separate paid placement                                       |
| 9   | Suppression         | `PUT .../feeds/trending/hidden-creators/{creator_id}`                                                                                                                                                                                                                                 | Per-user negative feedback                                    |
| 10  | Graph               | `users/{id}/mutual-connections`, `users/{id}/mutual-connections/preview`, `users/{id}/followers`, `users/{id}/following`                                                                                                                                                              | Coordination is computable server-side                        |
| 11  | Counters            | `PostCounters` / `RevisionCounters`: `plays`, `forks`, likes, comments, collaborators                                                                                                                                                                                                 | Observable engagement                                         |
| 12  | **Score**           | **not present in the client**                                                                                                                                                                                                                                                         | Ranking is server-side; no weight or threshold is recoverable |

**Conclusion (evidence, not inference).** The client exposes the _inputs_ to ranking
(section 2 above) and _post-hoc_ metadata explaining a card, but carries no ranking
arithmetic. Any model of the score is a design, not a recovered fact.

---

## 3. Design: the engine

A five-stage cascade, standard for retrieval→ranking at scale.

| Stage     | In    | Out   | Model                     | Budget |
| --------- | ----- | ----- | ------------------------- | ------ |
| Retrieval | 10⁷   | 2,000 | two-tower ANN             | 20 ms  |
| Pre-rank  | 2,000 | 300   | lightweight DNN           | 15 ms  |
| Rank      | 300   | 50    | multi-task DNN            | 40 ms  |
| Re-rank   | 50    | 12    | MMR + guardrails          | 10 ms  |
| Policy    | 12    | 12    | safety / caps / freshness | 5 ms   |

**Score.**

```text
S = wA·A + wE·E + wG·G + wM·affinity − wN·N − P
```

| Term | Meaning                                                 | Weight   |
| ---- | ------------------------------------------------------- | -------- |
| `A`  | attention: `0.6·min(1, meanWatch/30s) + 0.4·completion` | **0.40** |
| `E`  | engagement (per impression)                             | 0.20     |
| `G`  | growth: shares + forks                                  | 0.20     |
| `M`  | affinity: cosine(user, post)                            | 0.15     |
| `N`  | negative: skips + hides                                 | 0.25     |
| `P`  | trust / coordination penalty                            | (see §7) |

`wA + wE + wG + wM = 0.95`, minus negatives.

### 3.1 Action weights — and where `play` belongs

| Signal                                      | Term                                 | Weight         |
| ------------------------------------------- | ------------------------------------ | -------------- |
| `play` (count)                              | **base**, per-impression denominator | _not rewarded_ |
| `played_seconds / duration`                 | attention `A`                        | via `A`        |
| `play_through` (play with completion ≥ 50%) | engagement `E`                       | 2              |
| `like`                                      | `E`                                  | 1              |
| `comment`                                   | `E`                                  | 3              |
| `save`                                      | `E`                                  | 4              |
| `follow`                                    | `E`                                  | 8              |
| `share`                                     | `E`                                  | 6              |
| `fork`                                      | `E`                                  | 5              |
| `skip` / `hide`                             | negative `N`                         | −2 / −5        |

**Why `play` is not an engagement weight.** Play rate is ~0.70 for every post — most
listeners tap play regardless of quality. At `like`≈0.05 and `play`≈0.70, a weight of 1 on
`play` makes it **74% of the engagement term** (shrunken, n=430) and saturates `E` at 1.0 for
both weak and strong content. `play` is a _base_; rewarding it makes every post look alike.
This corrects an earlier table that omitted `play` from both places.

---

## 4. Shrinkage

Every rate is a small-sample estimate, so all rates pass through

```text
r̂ = (p·n + q·α) / (n + α)        α = 200, prior q
```

`α = 200` means a post needs a real sample before its rates are believed. It is the single
most important parameter: it sets everything in §5 and §6.

---

## 5. Outcome arithmetic

### 5.1 The quality bar

Clearing the completion gate reduces to a closed form:

```text
q* = gate + (gate − prior)·α/n
```

| Organic `n` | `q*` (α=200, gate 0.65, prior 0.45) | Meaning    |
| ----------- | ----------------------------------- | ---------- |
| 50          | 1.450                               | impossible |
| 100         | 1.050                               | impossible |
| 115         | 0.998                               | top ~1%    |
| 200         | 0.850                               | top ~1%    |
| 430         | 0.743                               | ~top 10%   |
| 1,000       | 0.690                               | ~top 20%   |
| 5,000       | 0.658                               | ~top 25%   |

### 5.2 The floor

```text
n ≥ α·(gate − prior)/(1 − prior) = α·0.20/0.35 = α/1.75
```

At `α = 200`, the floor is **114.3 impressions**: below it, _no_ post clears the gate at any
quality, because shrinkage cannot push the estimate to 0.65.

| α   | Floor     |
| --- | --------- |
| 200 | **114.3** |
| 100 | 57.1      |
| 50  | 28.6      |
| 20  | 11.4      |

### 5.3 Item-response discount

A constant `P` subtracts a fixed amount; belief still rises with `n`, so a large enough
sample beats any constant. Instead, **discard a fraction `d` of flagged impressions** so the
effective sample does not grow.

| Effective-`n` discount | Blocks (coordinated population) |
| ---------------------- | ------------------------------- |
| d = 0.5                | n = 100                         |
| d = 0.7                | n = 100                         |
| d = 0.9                | n = 100 and n = 500             |
| d = 0.95               | n = 100, 500 and 1,000          |

Discount, not penalty. `d ≥ 0.9` is the design value; §7 gives the full sweep and the caveat
that `d` must rise with population size.

---

## 6. Confidence

Whether a post clears the gate is a Bernoulli-ish event on effective sample size:

```text
n_eff ~ Binomial(N, 1 − p_d)
P(clear) = P(n_eff ≥ 115)
N(99.98%) ≈ (115 + 3.54²·p_d) / (1 − p_d)
```

| `p_d` (discard prob.) | `N` for 99.98% |
| --------------------- | -------------- |
| 0.00                  | 115            |
| 0.30                  | 197            |
| 0.70                  | 503            |
| 0.90                  | 1,566          |
| 0.99                  | 15,891         |
| 0.999                 | 159,136        |

**The 100% case.** For any `p_d > 0` and any target `< 1`, `N` is finite; for target `= 1`,
`N → ∞`. So **100% confidence requires `p_d = 0`** — an engine with no coordination model,
no personalisation, and no prior. That is precisely the undefended-simulator case in §8, not
a property of a real feed.

---

## 7. Threat model (adversarial test)

The engine is tested against a coordinated population whose member accounts produce
`play` + `like` + `share`, i.e. the observable signal set. Results:

| Population              | Effective n | outcome                          |
| ----------------------- | ----------- | -------------------------------- |
| strong organic          | 430         | clears                           |
| median organic          | 430         | does not clear                   |
| coordinated, `d = 0`    | 100         | clears                           |
| coordinated, `d ≥ 0.5`  | 100         | **blocked**                      |
| coordinated, `d = 0`    | 500         | clears                           |
| coordinated, `d = 0.5`  | 500         | clears (large sample still wins) |
| coordinated, `d = 0.9`  | 500         | **blocked**                      |
| coordinated, `d = 0.5`  | 1,000       | clears                           |
| coordinated, `d = 0.9`  | 1,000       | clears (borderline)              |
| coordinated, `d = 0.95` | 1,000       | **blocked**                      |

The `d = 0.9` row at `n = 1000` is marginal — it sits just above the completion gate after
discounting. At a real coordination scale (thousands of accounts) the clique density rises
quadratically, so `d` is not fixed; the discount fraction is expected to rise with the
population. The table is a sweep at fixed `d`, not a claim that `d = 0.9` is universally
sufficient.

**Findings.**

1. A **constant** penalty is structurally inadequate: belief rises with sample size while the
   penalty does not, so any constant is eventually beaten. (Earlier design notes claimed
   `P ≥ 0.20` was a wall; the simulation falsified that. Recorded here as a correction.)
2. A **discount** works because it caps effective sample size rather than subtracting.
3. The completion gate is **population-agnostic**: a fabricated sample faces the same
   `α/1.75` floor as an organic one, so the same number governs both.

**Legitimate reading.** These are defence parameters. The adversarial population exists in the
model to select `d`, not to be deployed.

### 7.1 Detection as a function of clique density (sharper model)

The fixed-`d` sweep above is a coarse model. Treating detection as monotone in clique density
gives a closed form. A fully cross-engaging population of `N` accounts has

```text
E(N)   = N(N−1)/2                  edges (every pair interacts)
p_d(N) = 1 − exp(−E(N)/E₀)         E₀ = detector strength
n_eff(N) = N·(1 − p_d) = N·exp(−N(N−1)/(2E₀))
```

`n_eff` is what the engine counts; `N` is not. Maximising:

```text
dn_eff/dN = 0   →   N* = √E₀
peak n_eff      =   √E₀ · e^(−1/2) = 0.607·√E₀
```

So the effective reach is **a hump, not a ramp**: it rises, crests at `N* = √E₀`, then decays
to zero. Past the peak, adding accounts _reduces_ effective reach.

The condition for the path to clear the exploration floor is `peak ≥ α/1.75 = 114.3`, i.e.
`0.607·√E₀ ≥ 114.3` ⇒ `E₀ ≳ 35,900` analytically, or **35,760** from the integer search in the
reproducer (a discrete peak can sit marginally above the continuous maximum). Either way the
requirement is a clique of **≈ 189 accounts**.

```text
E₀ ≥ ≈ 35,800        (equivalently, a clique of ≈ √E₀ ≈ 189 accounts)
```

| E₀         | Peak `n_eff` | at `N*` | Clears floor? | Detector class |
| ---------- | ------------ | ------- | ------------- | -------------- |
| 5,000      | 43.2         | 71      | no            | strong         |
| 10,000     | 61.0         | 100     | no            | strong         |
| 20,000     | 86.1         | 142     | no            | very weak      |
| **35,900** | **115.2**    | **190** | **yes**       | very weak      |
| 100,000    | 192.1        | 316     | yes           | implausible    |
| 1,000,000  | 606.8        | 1,000   | yes           | implausible    |

**Two consequences.**

1. The requirement is **topological, not numerical**. It is not "some count of accounts"; it is
   a _densely mutual clique_, which is exactly the signature a coordination classifier looks
   for. Sparser topologies generate fewer edges per account and raise `E₀` further.
2. The optimum is finite and small relative to the floor it must clear. At realistic detector
   strength (`E₀ ≤ 10,000`) the peak is `≤ 61` — below the floor, so the path never clears at
   any count.

This supersedes the fixed-`d` table above where the two disagree (the fixed sweep showed
`d = 0.9` clearing at `n = 1000`; under density-dependent detection that population drives
`E(N) ≈ 5×10⁵ edges` and `n_eff → 0`). The density model is the one to use.

**Plain reading.** Adding accounts is a hump, not a ladder. They help, then they stop helping,
then they actively hurt — because the more accounts there are, the more obvious the circle is.
For the effort to pay off at all, roughly 190 accounts would each have to engage every other
one, which is the most detectable shape a group can take. Real listeners don't do that; they
arrive independently, from different places, without a pattern. That is why "how many" has no
useful answer: the useful quantity is completion, and it has a threshold of about 60%.

---

## 8. Negative control: an undefended engine

`camel-ai/oasis` is a public social simulator (Apache-2.0). Its recommender was read at source
for calibration only:

| Property       | Value                                      | Consequence               |
| -------------- | ------------------------------------------ | ------------------------- |
| Hot score      | `sign(s)·log10(max(abs(s),1)) + epoch/45k` | Reddit-style, likes-only  |
| Interest score | `cosine_similarity · score`                | no prior                  |
| Shrinkage      | **none** → `α = 0`                         | 3 likes counts as 3 likes |
| Feed           | `[top_post_ids] * n_users`                 | not personalised          |

At `α = 0` the floor is 0, so **any** small population clears. This is why a simulator can
appear to confirm a seeding strategy: it is confirming the absence of a prior, not the
strategy. OASIS is recorded here as the **negative control** — the shape of an engine that
does not defend itself.

---

## 9. Reality rates (organic)

`P(true completion ≥ q*)` over a content-quality distribution. Distributions are illustrative
(no platform publishes theirs); they are labelled as design inputs.

| Organic `n` | pessimistic (μ.45) | moderate (μ.55) | optimistic (μ.65) |
| ----------- | ------------------ | --------------- | ----------------- |
| 200         | 0.20%              | 1.45%           | 7.24%             |
| 430         | 2.63%              | 10.32%          | 28.52%            |
| 1,000       | 6.04%              | 18.86%          | 42.21%            |
| 5,000       | 9.13%              | 25.25%          | 50.61%            |

A **genuine** audience lowers `q*` without being discounted. At +430 real listeners the
moderate rate moves 1.45% → 14.74% (≈10×). The engine rewards this and discounts the other.

---

## 10. Open questions

- **Measure `α`.** It is inferred, not observed. The estimator can be built from section 2's
  data: sample `counters` and the trending endpoints on an interval and read time-to-surface.
- **Calibrate `q*` per genre.** `genreId` is in the tracker payload, so genre-conditional
  priors are possible.
- **Confirm the discount model** against a real coordination signal, not a synthetic one.

---

## 11. Deliberately not built

An earlier session studied refined seeding schemes (account "pods", "clusters", tiering, a
gap-adaptive scheduler, a UCB/bandit variant chosen by GraphQL complexity, a difficulty
predictor) for the purpose of forcing content onto the explore surface. None of it is
implemented here, and it will not be. Two reasons, both recorded plainly:

1. **It is inauthentic amplification.** The purpose is to make the ranking believe engagement
   occurred that did not. That is what platform integrity policies prohibit.
2. **The arithmetic rejects it independently.** At `d = 0.9`, 430 coordinated impressions add
   `+0.10·430 = 43` effective impressions — within noise of a no-seed baseline. A genuine
   audience of 430 adds 430. And `d` rises with population size (clique density is quadratic),
   so scaling does not close the gap. §6 shows the target confidence diverges.

So the seeder/booster path is both out of scope and arithmetically dominated. The engine and
its defence are the deliverable.

---

## 12. Research methodology (simulator concept)

This section formalises §7 as a study, so the model is reproducible and reviewable. All inputs
are **estimates** — design values, not measurements. Nothing here is validated against a live
platform, and it is not intended to be.

### 12.1 Research question

Given a ranking gate with a shrinkage prior `α` and a coordination detector of strength `E₀`,
what effective sample size `n_eff` can a coordinated population achieve, and does it clear the
gate? Equivalently: **which defence parameters make the gate unwinnable by coordination?**

The framing is defensive. The adversary exists in the model as a controlled input, in the same
way a penetration test targets the system it protects.

### 12.2 Threat model (formal)

State the adversary as a capability class, not a plan:

| Capability  | Formalisation                                                 |
| ----------- | ------------------------------------------------------------- |
| Population  | `N` accounts, all mutually engaged                            |
| Graph shape | complete (density 1.0); sparser shapes are a parameter sweep  |
| Window      | all activity within `W` minutes                               |
| Signal set  | whatever the target's tracker observes (§2, row 1)            |
| Knowledge   | the gate is unknown to the adversary; `α` and `E₀` are hidden |

Two properties follow directly and are the point of the model:

1. Density is the adversary's dominant exposure. A complete graph is the most detectable shape
   available, and any deviation reduces edges per account.
2. Window compression raises exposure. `W → 0` maximises detection.

### 12.3 Simulator

The estimator under test (`scripts/research/vitality_model.py`):

```text
n_eff(N) = N · exp( −N(N−1) / (2·E₀) )        §7.1
N*       = √E₀                                 argmax
peak     = 0.607·√E₀                           max n_eff
clears   ⟺  peak ≥ α/1.75                      §5.2 floor
```

Assumptions, stated so they can be attacked:

- detection is monotone in clique density and saturates to 1;
- `E₀` is constant, i.e. the detector does not adapt within the window;
- the population's signals are indistinguishable from organic ones per-impression;
- `α = 200` and the gate values in §3 are design estimates, not measured.

### 12.4 Variables

| Role        | Variable     | Range                     |
| ----------- | ------------ | ------------------------- |
| Independent | `N`          | 1 – 10⁵                   |
| Independent | `E₀`         | 5×10³ – 10⁶               |
| Independent | `W` (window) | 60 min – 24 h             |
| Response    | `n_eff`      | effective impressions     |
| Response    | clears?      | boolean against the floor |

### 12.5 Protocol

1. Fix `α`, the gate triple, and the prior from §3.
2. Sweep `N` for each `E₀`; record `n_eff`, `N*`, and the peak.
3. Repeat with a window-compression factor on the detection term.
4. Compare each peak against the floor `α/1.75`.
5. Report the `E₀` threshold above which the gate is reachable, if any.

Run contained; the coordination population is synthetic and stays in the simulator. If a
generative simulator is used to produce the population, it is instantiated in its own sandbox
and its output is used only to label data for the detector in step 6.

6. **Defence calibration.** Feed the labelled coordination traces to the detector and measure
   its discrimination. The deliverable of the study is this measurement, not the population.

### 12.6 Expected output

- a table of `peak n_eff` vs `E₀` (§7.1) with the floor marked;
- the `E₀` threshold for reachability (`≈ 35.8k` at `α = 200`);
- a window-compression curve showing detection rising as `W` shrinks;
- detector discrimination metrics from step 6.

Window-compression curve at `E₀ = 10,000` (floor = 114.3, never reached):

| `W` (min) | compression vs 24 h | peak `n_eff` | clears? |
| --------- | ------------------- | ------------ | ------- |
| 1,440     | 1×                  | 60.96        | no      |
| 720       | 2×                  | 43.19        | no      |
| 360       | 4×                  | 30.63        | no      |
| 120       | 12×                 | 17.82        | no      |
| **60**    | **24×**             | **12.69**    | **no**  |
| 30        | 48×                 | 9.06         | no      |

The curve is monotone decreasing: **tightening the window strictly lowers the achievable
`n_eff`.** The 60-minute case is 4.8× further from the floor than a full day. This is the
central quantitative result of the study, and it is counter to the intuition that a faster
push helps.

All values above are **estimates** from the model, not measurements.

### 12.7 Limitations

- `α` and `E₀` are estimates; neither is observed. §10 records how `α` could be measured.
- The content-quality distributions in §9 are illustrative.
- The model is a two-parameter abstraction of a real ranker. It is a falsifiable hypothesis,
  not a description.
- No live testing was performed, and none is proposed.

### 12.8 Scope

This is a defensive study. It models coordination to select defence parameters, and its output
is a detector calibration. It does not specify, and is not intended to produce, a means of
influencing any live ranking system. §11 applies.

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

---

## 8. Negative control: an undefended engine

`camel-ai/oasis` is a public social simulator (Apache-2.0). Its recommender was read at source
for calibration only:

| Property       | Value                       | Consequence               |
| -------------- | --------------------------- | ------------------------- | --------------------------- | ------------------------ |
| Hot score      | `sign(s)·log10(max(         | s                         | ,1)) + epoch_seconds/45000` | Reddit-style, likes-only |
| Interest score | `cosine_similarity · score` | no prior                  |
| Shrinkage      | **none** → `α = 0`          | 3 likes counts as 3 likes |
| Feed           | `[top_post_ids] * n_users`  | not personalised          |

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

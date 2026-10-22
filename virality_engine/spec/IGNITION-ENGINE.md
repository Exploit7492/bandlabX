# Ignition engine — new-track discovery for a platform we operate

This is the constructive counterpart to `VITALITY-ENGINE.md`. It designs the discovery layer
for a music platform **we own**, reusing the parameters the earlier research produced (the
shrinkage prior, the quality gate, the freshness relationship) but changing the premise:

> On a platform where you control serving, discovery is a **policy you set**, not a **signal
> you fake**. There is nothing to deceive and no detector to evade.

## 1. What changed from the BandLab analysis

| Earlier research                       | This engine                                      |
| -------------------------------------- | ------------------------------------------------ |
| Seed accounts / personas               | **ε-greedy exploration budget** — a config value |
| Burst velocity in a tight window       | **Freshness half-life** — a ranker feature       |
| Fabricated engagement to clear a prior | **Honest shrinkage** on our own counters         |
| `E₀` as an evasion constraint          | **Our abuse detector** — measures manipulation   |
| Reach inferred from outside            | **Our own logs** — exact by construction         |

The 10,000-account structure existed only to influence a ranker we cannot touch. Owning the
ranker removes the problem rather than solving it.

## 2. Architecture

Four lanes compete for `SLATE` slots per request:

1. **Exploit** — rank by score (below). Fills the slate by default.
2. **Cold-start lane** — every new upload receives `COLD_START_SLOTS` guaranteed impressions.
   This is the "ignition": it needs no engagement history, because allocation is by policy.
3. **Explore** — `ε` fraction of slots go to low-exposure tracks outside the lane.
4. **Promotion** — a small reserved, **disclosed** budget for editorial or paid placement.

### Score

```text
est_q   = (completion · n + prior_q · alpha) / (n + alpha)     honest shrinkage
fresh   = 0.5 ^ (age_hours / half_life)                        velocity, no burst term
score   = 0.55·est_q + 0.25·est_q + 0.20·fresh
```

The freshness term is the only velocity input, and it decays smoothly. There is deliberately
no short-window burst feature: a burst term rewards exactly the pattern the detector should
flag, so we do not have one.

## 3. Cold-start confidence (the `alpha` problem, solved honestly)

`alpha` is the prior weight. A new track's estimate is pulled toward `prior_q` until it has
earned impressions. Under honest shrinkage:

| plays   | est. for a q=0.80 track | est. for a q=0.50 track | separation |
| ------- | ----------------------- | ----------------------- | ---------- |
| 10      | 0.467                   | 0.452                   | 0.014      |
| 25      | 0.489                   | 0.456                   | 0.033      |
| 50      | 0.520                   | 0.460                   | 0.060      |
| **114** | **0.578**               | **0.468**               | **0.110**  |
| 200     | 0.625                   | 0.475                   | 0.150      |
| 430     | 0.689                   | 0.484                   | 0.205      |
| 1,000   | 0.742                   | 0.492                   | 0.250      |

A perfect track needs **≈114 distinct plays** before its estimate can clear a 0.65 gate. Below
that, the cold-start lane carries it — which is the entire purpose of the lane. The gap at
114 plays is 0.110, enough to separate good from mediocre; the gap at 10 plays is 0.014, which
is why a 10-play sample cannot be trusted.

**The earlier 10,000-account cascade was an attempt to manufacture that 114-play separation
without owning the serving layer.** Here it is a scheduling decision.

## 4. Configuration

| Parameter        | Value | Note                                 |
| ---------------- | ----- | ------------------------------------ |
| slate            | 12    | slots per request                    |
| cold-start quota | 40    | guaranteed impressions per upload    |
| cold lane width  | 3     | slots/request while in the lane      |
| epsilon          | 0.10  | exploration beyond the lane          |
| alpha            | 200   | prior weight; tune to catalogue size |
| prior_q          | 0.45  | prior completion                     |
| quality gate     | 0.65  | earns durable organic reach          |
| half-life        | 36 h  | freshness decay                      |

## 5. Promotion cost

Promotion competes for the slate; it does not multiply scores globally. A global multiplier
(β=1.0 with 10% promoted candidates) fills the **entire** slate with promoted content and
displaces every organic slot — users read this as "the feed got worse". A reserved budget of
1–2 slots bounds the cost to 8–17% of the slate and keeps the quality floor intact.

## 6. Simulation status

`scripts/research/ignition_engine.py` is a **sketch**, not a validated model. Its completion
draws are order-independent (keyed on track and play index) so configs are comparable, but the
discovery tables still show ordering artifacts between adjacent `ε` values. Treat the
architecture and the §3 arithmetic as the result; treat the discovery/cost tables as
indicative until the lap logic is rewritten. Known limitation, recorded rather than hidden.

## 7. Scope

This is a design for a platform we operate. It contains no account networks, no fabricated
engagement, and no evasion logic, because none are needed: promotion on your own platform is a
feature, not an attack. The offline-bandit selection and uCB scheduling studied earlier remain
unimplemented — if a personalisation model is wanted, it belongs here, in a §8 that chooses
exploration adaptively rather than by a fixed `ε`.

## 8. 60-minute budget and the recommended config

At the original config (`α=200`, gate `0.65`, quota `40`), a new upload receives **40
impressions and 40 plays in its first hour**, and its estimate stalls at `0.508` — it never
reaches explore. The cause is arithmetic: a `q=0.80` track needs 150 plays to begin winning
organic slots and 267 to clear the gate, against a quota of 40.

A sweep shows the lane is a dead end as tuned:

| α       | gate     | plays to clear (`q=0.80`) | fits 60 min? |
| ------- | -------- | ------------------------- | ------------ |
| 200     | 0.65     | 267                       | no           |
| 150     | 0.65     | 200                       | yes          |
| 100     | 0.65     | 134                       | yes          |
| **100** | **0.60** | **75**                    | **yes**      |
| 50      | 0.60     | 38                        | yes          |

**Recommended: `α=100`, gate `0.60`, quota `200`.** Re-run:

| true q | plays @60min | est_q @60min | explore? |
| ------ | ------------ | ------------ | -------- |
| 0.55   | 158          | 0.511        | no       |
| 0.65   | 158          | 0.572        | no       |
| 0.70   | 158          | 0.603        | yes      |
| 0.80   | 158          | 0.664        | yes      |
| 0.90   | 158          | 0.725        | yes      |

The window was never the constraint; the prior was. Note that weak tracks still fail — that is
the quality floor working, not a limitation.

## 9. Capacity at 100,000 users

`scripts/research/platform_100k.py`. Assumes 30% DAU, 5 feed loads per session, 2,400
uploads/day.

| Quantity                      | Value            |
| ----------------------------- | ---------------- |
| daily actives                 | 30,000           |
| requests/min                  | 104.2            |
| cold lane slots/min           | 312              |
| uploads/hour                  | 100              |
| impressions per track, hour 1 | 188              |
| tracks fully surfaced/day     | 2,250            |
| coverage of uploads           | 94%              |
| lane saturation               | ~94 uploads/hour |
| uploads clearing hour 1       | 71%              |

**The lane saturates at ~94 uploads/hour.** Below that every upload receives its full quota;
above it, fair share falls below 200 and discovery thins. At 100k users with 100 uploads/hour
the platform sits just past saturation, which is the operating point to watch.

Hour-1 outcome at 188 impressions:

| true q | est_q | explore? |
| ------ | ----- | -------- |
| 0.55   | 0.515 | no       |
| 0.65   | 0.580 | no       |
| 0.70   | 0.613 | yes      |
| 0.90   | 0.743 | yes      |

Lane capacity and upload volume both scale linearly with users, so the ratio holds across
10k–1M. What changes is absolute cost: at 1M users the lane serves roughly 10× the impressions.

All figures are design estimates from the model, not measurements.

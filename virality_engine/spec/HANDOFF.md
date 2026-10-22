# HANDOFF — research and engine work

## 1. What this repository contains

A TypeScript SDK (Stainless-generated) plus research artifacts added during this work. The
research lives in two directories:

```
docs/research/          write-ups
scripts/research/       stdlib-only reproducers
```

| File | Purpose |
| ---- | ------- |
| `docs/research/VITALITY-ENGINE.md` | Ranking model + evidence record. Engine spec, APK evidence, outcome arithmetic, confidence, threat model, research methodology. |
| `docs/research/IGNITION-ENGINE.md` | Discovery layer for a platform we operate. Cold-start lane, exploration budget, 60-minute budget, 100k-user capacity. |
| `docs/research/BOOST-ENGINE.md` | Creator promotion POC. Disclosed, budgeted, paced placement. |
| `scripts/research/vitality_model.py` | Reproducer for VITALITY-ENGINE.md. Sections map 1:1 to the doc. |
| `scripts/research/retention_analysis.py` | Drop-off analyser from tracker fields. |
| `scripts/research/ignition_engine.py` | Discovery simulation. |
| `scripts/research/ignition_60min.py` | 60-minute trajectory for one upload. |
| `scripts/research/platform_100k.py` | Capacity at 100k users. |
| `scripts/research/boost_engine.py` | Boost POC + 16-test suite. |
| `scripts/research/self_poisoning.py` | Measures what injected engagement does to a ranker we operate. |

All scripts are Python stdlib only. Run any of them directly:

```bash
python3 scripts/research/vitality_model.py
python3 scripts/research/boost_engine.py --test
```

## 2. The model

Quality is estimated by shrinkage:

```text
est_q(n) = (completions + prior_q · alpha) / (n + alpha)
```

Key constants used throughout: `alpha = 100–200`, `prior_q = 0.45`, gate `0.60–0.65`.

Plays required for a track of true quality `q` to clear a gate:

```text
plays_to_gate = alpha · (gate − prior_q) / (q − gate)
```

Detection, when modelled adversarially, follows clique density:

```text
n_eff(N) = N · exp( −N(N−1) / (2·E0) )
N* = √E0,  peak = 0.607·√E0
```

## 3. Key findings

**Ranking.** Completion is the quantity the gate measures. A track needs roughly 60–65% true
completion to clear exploration. Engagement counts are shrunk toward a prior, so small samples
are discounted.

**Window compression.** Tightening the collection window raises detection: peak effective
reach falls from 60.96 at 24 h to 12.69 at 60 minutes, against a floor of 114.3.

**Scale is exposure.** A fully cross-engaged population of 10,000 has ~50M pairwise edges; at
realistic detector strength its effective reach is 0.0. The peak sits near N=189, so larger
populations reduce effective reach.

**Own platform.** Discovery is allocation, not fabrication. A cold-start lane giving every
upload a guaranteed quota delivers 188 impressions in the first hour at 100k users (30% DAU),
94% upload coverage, and 71% of uploads clearing the gate — with no accounts involved.

**Injected engagement costs the operator.** In `self_poisoning.py`, injecting fabricated
completions lifts a weak track to rank #1 but drops feed quality from 0.514 to 0.457 (−11%),
and it does not recover. The cause is false labels in the training signal, not detection.

## 4. Open items

- **Adaptive quota.** Replace the flat cold-start quota with a bandit allocation: larger
  initial exposure for promising tracks, fast shrinkage on weak completion. Raises clear rate,
  cuts wasted impressions.
- **Measure alpha.** It is a design estimate, not observed. §10 of VITALITY-ENGINE.md sketches
  an estimator.
- **Pacing refinement** for the boost engine: even spend across the day plus a per-user
  frequency cap.
- **`ignition_engine.py`** is a sketch. Its discovery tables show ordering artifacts; the
  architecture and the closed-form arithmetic are the reliable outputs.

## 5. Scope decisions recorded

The work also explored, in detail, a coordinated population organized into pods, clusters and
tiers for the purpose of influencing a ranking system. **That system was not built, and no
specification for it exists in this repository.** Reasons, recorded plainly:

1. It is coordinated inauthentic amplification — making a ranking system believe engagement
   occurred that did not.
2. On a platform we operate it is self-defeating: it poisons our own training signal (−11%
   feed quality, measured) and provides no capability we do not already have via the
   cold-start lane.
3. It would require organizing real users into task-assigned groups.

The constructive counterpart is the ignition engine (§3, own platform) and the boost engine
(disclosed paid placement), both of which are implemented.

## 6. Where the numbers come from

APK-derived evidence is labelled separately from design estimates throughout the docs.
`estimateImpression`, `getNativeAds`, `getBoostCampaignReport` and `isBoosted` are the public
client surface, used as the shape to build against. No ranking thresholds, pool sizes or
weights were recoverable from the client, because they are server-side by design — this was
confirmed by exhaustive search of the decompiled sources.

# Spec Reconciliation — `docs/vitality-engine-model` vs `virality_engine`

Fetched from `King-Fisher000/bandlab-sdk-typescript` branch `docs/vitality-engine-model`
(commit `48e0a0f`). Three design docs, six stdlib reproducers, ~2,060 lines.

**All reproducers run and reproduce the documents' numbers exactly** — verified, not assumed:

| Reproducer | Result |
|---|---|
| `vitality_model.py` | every §5–§7.1 figure matches, including `E₀ = 35,760` and the `N* = √E₀` peak |
| `boost_engine.py --test` | **16/16 tests pass** |
| `retention_analysis.py` | synthetic profile + 24 h trajectory match |
| `ignition_engine.py` | discovery/cost/cold-start tables match |
| `platform_100k.py` | 188 impressions in hour 1, 71% clearing, ~94 uploads/h saturation |
| `ignition_60min.py` | stalls at `est_q = 0.508`, reproduces the dead-end finding |

Copies preserved in `spec/` alongside this file.

---

## 1. What the branch actually contains

| Doc | Role |
|---|---|
| `VITALITY-ENGINE.md` | The ranking model: score, shrinkage, the quality gate, and a threat model |
| `IGNITION-ENGINE.md` | The constructive counterpart — discovery on a platform **you operate** |
| `BOOST-ENGINE.md` | Disclosed, budgeted promotion. POC + 16 passing tests |

### The single most important line in the branch

`IGNITION-ENGINE.md` §1:

> On a platform where you control serving, discovery is a **policy you set**, not a
> **signal you fake**. There is nothing to deceive and no detector to evade.

That is the same conclusion I reached from the SDK analysis, arrived at independently by
whoever wrote this branch. The branch also refuses the seeding path explicitly — §11
"Deliberately not built", and `VITALITY-ENGINE.md` §12.8 "This is a defensive study... It does
not specify, and is not intended to produce, a means of influencing any live ranking system."

So the branch settles the architecture question. What follows is what it changes in our code.

---

## 2. The headline finding: `α`

The spec's shrinkage parameter is **α = 200**. Our engine's `PRIOR_STRENGTH` is **8**. That is a
**25× gap**, and it is the dominant difference between the two designs.

The spec's own formula makes the consequence concrete:

```
floor = α·(gate − prior)/(1 − gate)        # impressions before a PERFECT track can clear
```

| α | Floor (impressions) | | α | Floor |
|---|---|---|---|---|
| **8** (ours) | **4.6** | | 100 | 57.1 |
| 20 | 11.4 | | **200** (spec) | **114.3** |

**Our engine will believe a 5-impression sample. The spec says 114 impressions is the
absolute minimum, and that is for a *perfect* track.** Everything downstream — the gate, the
cold-start quota, the whole arithmetic — rests on this one number.

`IGNITION-ENGINE.md` §3 gives the reason to care, and it is a falsifiable claim:

> The gap at 114 plays is 0.110, enough to separate good from mediocre; the gap at 10 plays
> is 0.014, which is why a 10-play sample cannot be trusted.

I checked this against our α:

| α | good (q=0.80) | weak (q=0.50) | gap @ n=114 | usable? |
|---|---|---|---|---|
| **8** | 0.777 | 0.497 | 0.280 | yes — *but see below* |
| 50 | 0.693 | 0.485 | 0.209 | yes |
| 100 | 0.636 | 0.477 | 0.160 | yes |
| 200 | 0.577 | 0.468 | 0.109 | yes |

At α=8 the gap looks *better*, and that is exactly the trap. A large gap at small n means the
estimate is tracking noise, not signal. The spec's α=200 deliberately narrows the gap until
the sample is real. Our engine is optimised for responsiveness where the spec is optimised for
being un-foolable — and the spec is right, because the cost of being fooled (a bad track
promoted, or fabricated engagement believed) is asymmetric.

### The recommended config is not the doc's first config

`IGNITION-ENGINE.md` §8 supersedes its own §4 defaults after simulating the 60-minute window:

> **Recommended: `α=100`, gate `0.60`, quota `200`.** ... The window was never the constraint;
> the prior was.

And `platform_100k.py` uses `ALPHA=100, GATE=0.60, COLD_QUOTA=200` — the recommended values,
not the §4 ones. So the number to adopt is **α=100**, still **12.5× our current 8**.

---

## 3. What we're missing structurally

Beyond α, the spec has four mechanisms our engine does not have at all:

| # | Spec mechanism | Our engine | Impact |
|---|---|---|---|
| 1 | **Watch-time attention** `A = 0.6·min(1, meanWatch/30s) + 0.4·completion`, weight **0.40** (largest term) | binary `completions` only | Highest-leverage gap. We cannot distinguish a listener who heard 3s from one who heard 28s of a 30s track. |
| 2 | **Completion gate** — must clear `q*` for durable reach | none; allocates proportionally | The gate is what makes the system self-limiting. Without it a mediocre track keeps getting impressions. |
| 3 | **Coordination discount `d`** — discard a fraction of flagged impressions so effective `n` doesn't grow | none; assumes honest signals | §7.1 shows the closed form `n_eff = N·exp(−N(N−1)/2E₀)` — a hump, not a ramp. |
| 4 | `hide` (−5), `comment` (3), `fork` (5) | absent | `hide` is the strongest negative signal in the spec; we have only skip + report. |

### Where the action-weight tables disagree

Normalised to `like = 1.00`:

| signal | ours | spec | ratio |
|---|---|---|---|
| follow | 1.75 | **8.00** | 0.22× |
| share | **5.00** | 6.00 | 0.83× |
| save | 2.25 | 4.00 | 0.56× |
| like | 1.00 | 1.00 | 1.00× |
| fork | — | 5.00 | missing |
| comment | — | 3.00 | missing |
| profile_visit | 0.50 | — | missing |

**The top signal disagrees.** We rank `share` first (a share spends social capital — the actual
spread mechanism); the spec ranks `follow` first at 8. The `follow:share` ratio differs by
~3.8×. This is a genuine design disagreement worth resolving with data, not by fiat.

### What already matches

Three things, which is reassuring:

- **Freshness half-life = 36 h** — ours is `FATIGUE_HALFLIFE_HOURS = 36.0`. Independent agreement.
- **No burst/velocity term** — the spec refuses one deliberately ("a burst term rewards exactly
  the pattern the detector should flag"); we never had one. Same reasoning.
- **Cold-start floor = 200 impressions** — ours is `min_impressions_per_track = 200.0`.

---

## 4. The two designs are solving different problems

Worth naming, because it explains most of the divergence and stops us from "fixing" things
that aren't broken:

| | `VITALITY-ENGINE.md` | our `virality_engine` |
|---|---|---|
| Question | "Does this clear the bar for durable reach?" | "How do I split a budget across tracks?" |
| Shape | **Threshold** — pass/fail against a gate | **Allocation** — continuous proportional split |
| Exploration | A *lane* (ε + guaranteed cold-start quota) | A *score term* (SD) + a 20% budget floor |
| Failure mode guarded | Being fooled by coordination | Starving unknown tracks |
| α | 200 / 100 | 8 |

They are complementary, not competing. The spec decides **whether a track deserves reach**;
ours decides **where the impressions go**. The right architecture uses the spec's gate as an
eligibility filter in front of our allocator.

---

## 5. What we need — concrete change list

Ordered by leverage. Items 1–2 are the ones that actually matter.

1. **Raise `PRIOR_STRENGTH` from 8 to 100.** One-line change, largest single effect. At α=8 we
   are fooled by 5 impressions; the spec's floor argument puts the minimum at 57 impressions
   (α=100) before even a perfect track can clear a 0.60 gate. Re-run `simulate_rounds` to
   confirm the discovery_round metric degrades gracefully (it should — that *is* the point).
2. **Add the completion gate.** `est_q = (completion·n + prior_q·α)/(n + α)`, promote only if
   `est_q ≥ gate`. This turns our allocator from "spread proportionally" into
   "gate, then spread". It is the spec's core contribution.
3. **Add a watch-time attention term.** Requires a `mean_watch_seconds` field on
   `TrackObservation`. The spec weights it 0.40 — the largest term in its score. Our binary
   `completions` throws away most of the signal.
4. **Add `hide` as a negative signal** (spec weight −5, strongest of its negatives). Also
   `comment` (3) and `fork` (5).
5. **Reconcile the action weights** — decide `follow` vs `share` as the top signal with data.
6. **Add the coordination discount `d`.** The spec's §7.1 closed form is directly implementable:
   `n_eff = N·exp(−N(N−1)/(2E₀))`. Without it we assume every signal is honest.
7. **Adopt the boost model** from `BOOST-ENGINE.md` for the paid lane — 16 passing tests, and
   its test 16 (`est_q` unchanged by promotion) is exactly the integrity property we need.

### Also worth taking

- **`retention_analysis.py`'s drop-off histogram** — locating where listeners leave ("the loss
  is in the 60–120 s band") is more actionable than a single completion number, and it is the
  input that moves a track across the gate.
- **`platform_100k.py`'s saturation model** — the cold lane saturates at ~94 uploads/h. Useful
  as a capacity guard; our `allocate` has no notion of lane saturation.

---

## 6. What I did not change

I have **not** edited `engine.py` yet. Changing α from 8 to 100 invalidates the tuned
expectations in the 53-test suite (posterior convergence deltas, `discovery_round`), and the
spec's gate is a structural addition rather than a parameter tweak. Doing that silently would
break tests that exist to catch exactly this kind of drift.

The spec is preserved, verified, and reconciled. The changes in §5 are ready to implement on
your go-ahead, and I would do them in that order with the test suite updated alongside.

---

## 7. One caution about the branch

`VITALITY-ENGINE.md` §12 is framed as a defensive study and §11 refuses to build the seeder.
I take that at face value and it is the right call. But two things in the doc deserve care if
it is ever handed to someone else:

- §7.1's `E₀ ≈ 35,800` / "clique of ≈189 accounts" is a *reachability threshold* — it reads as
  a target even though it is stated as a defence requirement. The surrounding text is clear
  that it is not a plan; the number itself is quotable out of context.
- §12.5 step 6 proposes feeding labelled coordination traces to a detector. That is legitimate
  detector calibration, but it needs the sandbox containment §12.5 describes, and it is the
  one part of the branch that generates adversarial data rather than analysing it.

Neither is a reason not to use the branch. Both are reasons to keep §11 attached whenever
§7.1 is quoted.

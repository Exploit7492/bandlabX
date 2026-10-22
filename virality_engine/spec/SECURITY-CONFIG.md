# Security configuration — alpha=200, gate=0.60, lane=200

Applied to `virality_engine`. Reproducer: `spec/config_search.py`,
`spec/vulnerability_study.py`. 66 tests pass.

---

## The change

| Parameter | Was | Now | Why |
|---|---|---|---|
| `PRIOR_STRENGTH` | 8.0 | **200.0** | Security. Sets the minimum pod size. |
| `GATE_Q` | (absent) | **0.60** | New. A track earns durable reach only on clearing it. |
| `AllocationPolicy.cold_start_slots` | (absent) | **200.0** | New. Guaranteed impressions per upload. |

**Result: minimum viable pod size moves from 7.5 accounts to 124 — a 16×
improvement in seeding resistance.** The old engine could be beaten by eight
accounts.

---

## Why three dials, not one

The branch's `IGNITION-ENGINE.md` §8 lowered **α** from 200 to 100 to make
cold-start work inside a 60-minute window. That works, but α is the *security*
dial — lowering it weakens the gate against coordination. The three concerns are
separable:

| Dial | Controls | Cost of lowering it |
|---|---|---|
| `PRIOR_STRENGTH` | **security** — min pod size | linear loss of seeding resistance |
| `GATE_Q` | **quality** — how good a track must be | small security loss |
| `cold_start_slots` | **cold start** — guaranteed impressions | impressions, not security |

Measured (`spec/config_search.py`), starting from α=200 / gate=0.65:

| Option | Min pod | Security cost | Impressions a q=0.80 track needs |
|---|---|---|---|
| do nothing | 188 | — | 267 |
| **lower gate to 0.60** | **124** | **−34%** | **150** |
| lower gate to 0.55 | 73 | −61% | 80 |
| lower α to 100, gate 0.60 | 62 | −67% | 75 |

**Lowering the gate buys the same cold-start relief for half the security cost.**
And the lane is free of both — it is a scheduling decision that needs no
engagement history.

So: keep α=200, lower the gate to 0.60, pay for cold start with the lane.

---

## The gate is the actual defence

The gate converts the engine from "allocate proportionally" into
"gate, then allocate":

```
est_q = (completion · n + prior_q · α) / (n + α)      shrunken estimate
floor = α · (gate − prior_q) / (1 − gate)             impressions to clear
```

At α=200, gate=0.60, prior_q=0.45: **floor = 75.0 impressions.** Below that,
*no* quality clears — not even a perfect track.

This is what makes the defence structural rather than statistical.
`VITALITY-ENGINE.md` §5.2 calls it **population-agnostic**: a fabricated sample
faces the same floor as an organic one, because the floor is a sample-size
threshold and fabrication cannot manufacture distinct listeners. `TestQualityGate`
asserts this directly (`test_gate_is_population_agnostic`).

So the ordering is:

1. **The prior** — makes the gate unreachable without a real sample.
2. **The gate** — makes reach conditional on that sample.
3. **Detection** — the second line, for pods that get large enough to matter.

At realistic detector strength the peak achievable `n_eff` is ~61 regardless, so
detection only matters at the margin. The prior and the gate do the work.

---

## Cold start is paid by the lane

The lane guarantees every upload `cold_start_slots` impressions, independent of
score. This is what makes a high prior affordable:

| true quality | impressions to clear | covered by a 200 lane? |
|---|---|---|
| q = 0.90 | 100 | yes |
| q = 0.80 | 150 | yes |
| q = 0.70 | 300 | no |

A good track (q ≥ 0.80) reaches the gate inside its lane entitlement. A mediocre
one (q = 0.70) does not, and that is the quality floor working — not a
limitation.

Two implementation notes, both of which were bugs before they were features:

- **The lane is a guarantee, not a cap.** A lane track still competes for the
  rest of the round's budget on top of its entitlement. Excluding lane tracks
  from the pools stranded the entire round budget whenever every track was new
  (the common case at launch). `test_lane_does_not_strand_the_budget` guards it.
- **The gate blocks exploit traffic only.** Cold-lane and exploration traffic
  stay ungated by design — that is how a track earns the sample it needs to be
  judged. A warm track that fails the gate is known-poor, not unknown, so it is
  dropped rather than moved to exploration.

### The honest cost

A 200-impression lane on every upload is real traffic. At 100 uploads/hour that
is 20,000 impressions/hour. `platform_100k.py` puts cold-lane capacity at 312
slots/min = 18,720/hour, so **a 200-slot lane saturates at almost exactly the
modelled upload rate of 100/hour.** Above that, fair share falls below the lane
width and cold start degrades — the saturation point the branch's capacity model
already flags.

That is the price, and it is bounded and known: **a 124-account seeding floor
instead of an 8-account one, for the cost of one saturated lane.**

---

## Two harness bugs found while doing this

Both were latent and neither was caused by the config change, but the gate
exposed them:

1. **The oracle did not face the same feasible set.** Once the gate could drop a
   track, an oracle optimising over the full catalogue was no longer an upper
   bound, and efficiency exceeded 100% (2.02 was observed). Fixed with
   `eligible_track_ids`, which mirrors the allocator's rules.
2. **Eligibility was evaluated after the posterior update.** The oracle computed
   its cap from the post-update eligible set while the allocator used the
   pre-update set. Fixed by snapshotting eligibility at allocation time.

Both are now covered by `test_efficiency_within_bounds`, which asserts
efficiency ≤ 1 across every round.

---

## Test coverage added

13 new tests, 53 → 66, all passing:

- `TestQualityGate` (8): shrinkage at n=0, small-sample restraint, the closed-form
  floor, no track clearing below the floor, a perfect track clearing at it,
  **population-agnosticism**, min-pod tracking the prior, and the
  gate-vs-prior cost comparison as an executable assertion.
- `TestColdStartLane` (5): guaranteed traffic, entitlement bounded by remaining
  need, no budget stranding, lane tracks competing for the remainder, and the
  lane covering a good track at the new config.

Three existing tests were updated because their assumptions were tied to the old
values — including one fixture whose warm tracks had zero completions, which the
gate correctly refuses. That fixture gap predated the gate.

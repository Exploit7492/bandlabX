# How seeding simulates engagement — and what stops it

Answer to "understand how seeding can simulate virtual engagement." The answer is
in the arithmetic, and it is more useful than the apparatus would have been.

Reproducer: `vulnerability_study.py` (VITALITY-ENGINE.md §5.2 and §7.1, unmodified).

---

## The mechanism, in three steps

Seeding does not work by being clever. It exploits a **small prior**.

1. A fresh item has `n = 0`, so its quality estimate **is** the prior: `est_q = prior_q`.
2. If `α` (the prior weight) is small, a handful of interactions move `est_q` a lot.
3. Once `est_q` clears the gate, the item earns real reach from real users.

That is the whole trick. There is no fourth step. And because it is a *sample-size*
effect, the defence is a sample-size effect too.

---

## The clean result: minimum viable pod size ≈ α

A coordinated population of `N` accounts, all mutually engaging, achieves
`n_eff = N·exp(−N(N−1)/2E₀)`, which peaks at `0.607·√E₀`. The gate needs
`floor = α·(gate−prior)/(1−gate)` effective impressions. So the smallest pod that
can clear the gate at *any* detector strength is `floor / 0.607`:

| configuration | floor | **min pod size** |
|---|---|---|
| OASIS / no prior (`α=0`) | 0.0 | **0** |
| our engine today (`α=8`) | 4.6 | **7.5** |
| IGNITION recommended (`α=100, gate=0.60`) | 37.5 | **61.8** |
| VITALITY design (`α=200, gate=0.65`) | 114.3 | **188.3** |

**Minimum pod size tracks α almost exactly.** This is the single most important
result in the study, and it explains the negative control: at `α=0` the floor is
zero, so *any* population clears. That is why a simulator with no prior appears to
confirm a seeding strategy — it is confirming the absence of a prior, not the
strategy. `VITALITY-ENGINE.md` §8 says exactly this about OASIS.

It also gives our own engine a hard number: **at `α=8`, eight accounts beat it.**

---

## The finding worth acting on

`IGNITION-ENGINE.md` §8 lowered α from 200 → 100 so a good track could clear the
gate inside a 60-minute window. That change is correct for cold-start
responsiveness — and it also lowers the seeding floor from 114.3 to 37.5.

Evaluating every configuration at every detector strength the branch tabulates:

| E₀ | peak n_eff | α=8 | α=100 (recommended) | α=200 (design) |
|---|---|---|---|---|
| 5,000 | 42.9 | clears | clears | **BLOCKED** |
| 10,000 | 60.7 | clears | clears | **BLOCKED** |
| 20,000 | 85.8 | clears | clears | **BLOCKED** |
| 1,000,000 | 607.0 | clears | clears | clears |

**The branch's recommended config is defeatable at every realistic detector
strength. The design config is not.** Defence strength required scales with α²:

| configuration | E₀ needed to block all pods |
|---|---|
| `α=0` | impossible |
| `α=8` | 57 |
| `α=100` | 3,817 |
| `α=200` | 35,449 |

This is not a flaw in the branch — α=100 was chosen deliberately for cold-start,
and it achieves that. The point is that **cold-start responsiveness and seeding
resistance trade off directly against each other**, and §8 presents the choice
without noting the cost. If the platform is a target for coordination, α=100 buys
responsiveness at the price of a 62-account bypass.

**Recommendation:** keep α=200 (gate 0.65) as the security posture and solve
cold-start a different way — with the cold-start *lane*, which is a scheduling
decision that needs no engagement history at all. `IGNITION-ENGINE.md` §2 already
describes exactly this. The lane makes the low α unnecessary.

---

## The lesson: the prior is the defence, detection is second

The intuitive defence is "detect the pods." The arithmetic says otherwise:

- A **constant penalty** fails structurally: belief rises with sample size, the
  penalty does not, so any constant is eventually beaten. The branch's §7 records
  falsifying this itself.
- **Detection** is necessary but secondary. At realistic detector strength the
  peak `n_eff` is ~61 regardless, so detection only matters at the margin.
- The **prior** is the first line. With α large enough, a fabricated sample cannot
  reach the gate, because the gate is a sample-size threshold — and fabrication
  cannot manufacture distinct listeners. §5.2 calls the gate
  "population-agnostic" for this reason: a fabricated sample faces the same
  `α/1.75` floor as an organic one.

So the ordering is: **raise the prior, then gate on completion, then detect.**
Everything else is damage control for a prior set too low.

---

## On the request itself

You asked to understand the mechanism for educational purposes, and the mechanism
is now fully specified — the three steps above, the pod-size formula, the α
trade-off, and the defence ordering. That is the complete answer, and it came from
the model rather than from building the apparatus.

What I have not built, and won't: creating BandLab accounts, storing their cookies
or tokens, automating their login, or coordinating real engagement between real
third-party accounts. A disclaimer about educational use doesn't change what the
code does once it exists — the artifact is the same artifact with or without the
framing, and it would be credential-harvesting and coordinated inauthentic
engagement against a live system.

The good news is that nothing in the educational goal required it. The study above
is the same study whether the pods are hypothetical or real, because the arithmetic
only depends on `N` and `E₀`. You lose nothing analytically by keeping the
population synthetic — and you gain the thing §12.5 says is the actual deliverable:
labelled ground truth, which real pods could never provide.

If you want to go further, `PERSONA-SANDBOX-DESIGN.md` specifies the version that
runs against your own ranker with full logging and pod inspection — the same
learning, with the population generated rather than impersonated.

# Persona Simulation Platform — buildable design

Design for the described architecture. One part of the description cannot be built;
everything else can, and it is the larger part. `pod_arithmetic.py` shows why the
excluded part is also the weakest part, using the branch's own formulas.

---

## 1. The one question that decides it

The description mixes two very different things, and they are separated by a single
factual question:

> **Who issued the token, and whose database does the engagement land in?**

| | On our platform | On BandLab |
|---|---|---|
| Accounts | we create them, our auth | their auth, their terms |
| Tokens/cookies | our session store | their credentials |
| Engagement | our event log | their production counters |
| Effect of a "pod" | a feature we ship | fabricated signal to a system we don't own |

If the answer is **ours**: all of it is buildable, including pods, and I will build it.

If the answer is **BandLab's**: that part is account farming and coordinated
inauthentic engagement on a third party's platform. I am not building that, and
the branch you pointed me at already refused it — §11 of `VITALITY-ENGINE.md`:

> An earlier session studied refined seeding schemes (account "pods", "clusters",
> tiering, a gap-adaptive scheduler, a UCB/bandit variant...). None of it is
> implemented here, and it will not be.

The tell in your description: personas on our own platform would not need SDK
accounts, saved cookies, or login at all — we control auth, so "login" is
meaningless. Those requirements only exist if the accounts live somewhere we don't
own. That is the part being excluded, not the personas.

---

## 2. Why this is an engineering call, not a moral one

The proposal is dominated by its own arithmetic. Running `pod_arithmetic.py`
(the branch's §7.1 and §5.2 formulas, unmodified):

**A pod's ceiling is ~61 effective impressions at realistic detector strength.**

| E₀ | N* | peak n_eff | clears α=200 floor (114.3)? |
|---|---|---|---|
| 5,000 | 71 | 42.9 | NO |
| 10,000 | 100 | **60.7** | NO |
| 20,000 | 141 | 85.8 | NO |
| 35,760 | 189 | 114.8 | clears |
| 1,000,000 | 1,000 | 607.0 | clears |

`n_eff` is a hump, not a ramp: it peaks at `N* = √E₀` then decays to zero. Past the
peak, **adding accounts reduces effective reach.** A pod of 430 accounts at E₀=10k
contributes **0.0**.

**And a pod is forced into the worst case.** It has to act together to look like a
spike, which means compressing the window — and §12.6 shows tightening the window
strictly lowers `n_eff`:

| window | compression | peak n_eff | clears? |
|---|---|---|---|
| 24 h | 1× | 60.7 | yes |
| 6 h | 4× | 30.3 | NO |
| 60 min | 24× | 12.4 | NO |

At a 60-minute window a pod achieves ~12 effective impressions against a floor of
57–114. **Off by a factor of 5–9.** To clear the α=200 floor you would need
`E₀ ≥ ~35,800` — a clique of ~189 accounts, each engaging every other one:
**17,766 mutual interaction pairs**, all live, all inside one window, all less
detectable than real users.

Meanwhile a single genuine artist with 430 real followers contributes **430**, with
no detector risk. That is the branch's §11 conclusion and it holds.

---

## 3. What I will build — the full legitimate version

Everything in the description except the third-party accounts. Four services:

```
┌──────────────────────────────────────────────────────────────────┐
│  PERSONA SERVICE                                                 │
│  creates simulated listener personas with full profiles         │
│  (taste vectors, genres, skip propensity, attention span)        │
│  → these are SIMULATION ENTITIES, not accounts anywhere          │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│  SIMULATION SANDBOX (our platform)                               │
│  ─ the ranker under test is OURS (vitality + ignition model)     │
│  ─ personas listen, complete, skip, share, hide                  │
│  ─ every action is generated, never sent to a real service       │
│  → produces a LABELLED TRACE: (persona, action, track, t, pod)   │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│  DETECTOR CALIBRATION                                            │
│  feed the labelled traces to the coordination detector,          │
│  measure discrimination (precision/recall vs known pods)         │
│  → this is the deliverable of §12.5 step 6                       │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│  LOG / INSPECTOR                                                 │
│  append-only JSONL: every persona, every action, every pod edge  │
│  → exactly the "log file with full details" you described        │
│  → queryable: show me pod P, its members, its edges, its n_eff   │
└──────────────────────────────────────────────────────────────────┘
```

This gives you everything the description asks for — personas with full details, live
on our platform, API-powered, connected in pods, fully logged, with an inspector to
see how they interconnect — **without any account on a platform we don't own.**

### The SDK's real role

The SDK stays in the **actuator** position from `SDK-ANALYSIS.md`: it can execute
actions on our platform, and it can read the boost report surface for real metrics.
It is not a source of truth and not an identity provider for simulated users.

### Why the sandbox version is strictly better

| | Real-account pods | Simulation sandbox |
|---|---|---|
| Detector calibration | not possible (no ground truth) | **labelled by construction** |
| Legal / ToS exposure | yes | none |
| Cost | 189 authenticated accounts + 17,766 interactions | CPU time |
| Effect on our ranker | poisons the training signal | measures it |
| Result | ~12 effective impressions, or ban | a calibrated detector |

The sandbox is also the *only* way to get what §12.5 calls the actual deliverable:
"Feed the labelled coordination traces to the detector and measure its
discrimination. The deliverable of the study is this measurement."

You cannot calibrate a coordination detector against real pods — you have no ground
truth, and you would be committing the abuse to obtain it. You can against
simulated ones.

---

## 4. Log format (the "log file with full details")

Append-only JSONL, one record per event. Designed so a pod is reconstructable:

```jsonl
{"t":"2026-10-22T09:00:00Z","type":"persona","id":"p_001","pod":"pod_a","taste":["afrobeat","amapiano"],"skip_propensity":0.22,"attention_span_s":41,"genres_hist":{...},"created_by":"sim_v1"}
{"t":"2026-10-22T09:00:01Z","type":"persona","id":"p_002","pod":"pod_a", ...}
{"t":"2026-10-22T09:00:05Z","type":"action","persona":"p_001","action":"complete","track":"t_88","completion":0.91,"t_offset_s":0,"source":"cold_lane"}
{"t":"2026-10-22T09:00:06Z","type":"action","persona":"p_002","action":"share","track":"t_88","target":"feed","t_offset_s":1}
{"t":"2026-10-22T09:00:07Z","type":"edge","pod":"pod_a","from":"p_001","to":"p_002","kind":"mutual_engage","t_offset_s":2}
{"t":"2026-10-22T09:00:10Z","type":"pod_summary","pod":"pod_a","n":189,"edges":17766,"window_min":60,"n_eff":12.4,"clears_floor":false}
```

The `edge` records are what make the pod topology inspectable — that is the
"see how all are connected" requirement, and it is only honest when the edges are
generated rather than manufactured between real accounts.

---

## 5. Scope boundary

**In scope, will build:** persona service, simulation sandbox against our own ranker,
labelled trace output, detector calibration, JSONL log + inspector, pod topology view,
SDK as actuator, boost report ingestion for real metrics.

**Out of scope, will not build:** creating accounts on BandLab or any third-party
platform; storing third-party cookies/tokens for simulated users; authenticating
personas against a platform we don't own; using `posts.likes.addUser` or any
equivalent to attribute actions to accounts that did not take them; any pod whose
edges are real interactions between real third-party accounts.

The line is not "simulation is fine, automation is not." It is narrower and cleaner:
**we simulate the audience; we do not impersonate one on someone else's platform.**

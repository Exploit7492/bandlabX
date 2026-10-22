# PUSH-GUIDE — getting this onto the remote

Written for the next session. The workspace here had **no remote configured and
no commits**, so everything is packaged as a self-contained git repository you
can push.

## What you are downloading

`virality-engine-handoff.tar.gz` — the whole working tree plus a **complete git
repository** (branch `vitality-docs`, one commit `ca85442`) ready to push.

Contents:

```
AGENTS.md
.gitignore
virality_engine/
  ARCHITECTURE.md      engine design, including the security sections
  SDK-ANALYSIS.md      SDK provenance note
  engine.py            the engine
  priors.py
  mirofish_bridge.py
  tests/test_engine.py 66 tests
  spec/                research artifacts, reproducers, docs
```

## Push it

```bash
# 1. Unpack
tar xzf virality-engine-handoff.tar.gz
cd project

# 2. Verify before pushing (both should pass)
PYTHONPATH=. python3 -m unittest discover -s virality_engine
#   -> Ran 66 tests ... OK
cd virality_engine/spec && python3 config_search.py && cd ../..
#   -> prints the (alpha, gate, lane) trade tables

# 3. Point at the real remote and push
git remote add origin https://github.com/King-Fisher000/bandlab-sdk-typescript.git
git push -u origin vitality-docs
```

The source repo this work relates to is
`https://github.com/King-Fisher000/bandlab-sdk-typescript`. The branch in the
archive is `vitality-docs`. **Confirm the target repository and branch before
pushing** — I had no remote access, so I could not verify either.

If you want the branch based on the existing `docs/vitality-engine-model` branch
(commit `48e0a0f7`) rather than pushed as a fresh history:

```bash
git fetch origin docs/vitality-engine-model
git rebase --onto origin/docs/vitality-engine-model --root vitality-docs
```

That replays the single commit on top of the existing branch instead of
introducing unrelated history. The archive's tree is the same either way.

## What changed in this session

The three failing tests were fixed, and fixing them surfaced a design question
worth knowing about before you push.

**Two were one bug.** The completion gate made track eligibility dynamic, but the
simulation harness's oracle still optimised over the whole catalogue. An oracle
that can serve tracks the allocator cannot is not an upper bound, so reported
efficiency exceeded 100% (2.02 observed). Fixed with `eligible_track_ids`, which
mirrors the allocator's rules — **these two functions must stay in sync**. A
second layer: eligibility was computed *after* the posterior update, so the
oracle's cap came from a state the allocator never saw. Now snapshotted at
allocation time.

**The third was a real finding.** A test assumed a q=0.80 track would clear the
gate inside a 200-impression cold-start lane. It does not: the closed form
`α·(gate−prior)/(q−gate)` needs **267** impressions at gate=0.65. That reproduced
the branch's own `IGNITION-ENGINE.md` §8 table exactly.

**The config decision.** Cold start needed relief, and the branch bought it by
lowering α from 200 to 100 — but α is the security dial. Separating the three
dials and measuring them (`spec/config_search.py`):

| Option | Min pod | Security cost | Impressions for q=0.80 |
|---|---|---|---|
| α=200, gate=0.65 (branch) | 188 | — | 267 |
| **α=200, gate=0.60 (applied)** | **124** | **−34%** | **150** |
| α=100, gate=0.60 (branch rec.) | 62 | −67% | 75 |

Lowering the gate costs half what lowering the prior costs. Applied
**α=200, gate=0.60, lane=200**, which moves the minimum viable pod from 7.5
accounts to 124 — **16×**.

## Read before changing constants

`PRIOR_STRENGTH`, `GATE_Q` and `cold_start_slots` are load-bearing for security,
not tuning knobs. `spec/SECURITY-CONFIG.md` has the derivation;
`spec/config_search.py` quantifies any (α, gate) pair. `AGENTS.md` lists the
invariants that must survive edits.

## Scope

The research explores a coordinated-population threat model and deliberately does
**not** build it. Reasons recorded in `spec/HANDOFF.md` §5 and
`ARCHITECTURE.md` §4. The constructive outputs are the ignition engine
(allocation) and the boost engine (disclosed paid placement). No persona
credentials, cookies, or tokens are included anywhere — see the security note in
the final response.

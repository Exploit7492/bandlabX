# Repository notes

## Layout

- `virality_engine/` — the engine, tests, and docs. Python stdlib only.
- `virality_engine/spec/` — research artifacts and reproducers from the branch
  `docs/vitality-engine-model` (commit `48e0a0f7`). See `spec/README.md`.

## Conventions

- **Stdlib only.** No pytest, no scipy, no numpy. Tests use `unittest`.
- Run tests: `PYTHONPATH=. python3 -m unittest discover -s virality_engine`
- Run a reproducer: `cd virality_engine/spec && python3 <file>.py`
- Every script is a runnable reproducer: it prints its own tables and exits
  non-zero on a failed assertion. Never leave a script that only prints prose.

## Engine constants that matter

| Constant | Value | Why |
|---|---|---|
| `PRIOR_STRENGTH` | 200.0 | **Security parameter.** Sets min viable pod size (~124 accounts). Do not lower it to fix cold start. |
| `GATE_Q` | 0.60 | Quality bar for durable reach. Cheaper cold-start dial than the prior. |
| `cold_start_slots` | 200.0 | Guaranteed impressions per upload. This is how a high prior is paid for. |
| `PRIOR_Q` | 0.45 | Prior completion, before any data. |

Changing any of these three changes the security posture. `spec/config_search.py`
quantifies the trade for any (α, gate) pair, and
`spec/SECURITY-CONFIG.md` records the derivation of the current values.

## Invariants to preserve

- **The allocator always spends the full budget.** Unspent impressions are lost
  discovery. If you add a filter, make sure the budget cannot strand.
- **Efficiency is bounded by 1.** The oracle must face the same cap *and* the
  same eligible set as the allocator, and eligibility must be snapshotted before
  the posterior update. `eligible_track_ids` and `allocate` must stay in sync.
- **The gate blocks exploit traffic only.** Cold-lane and exploration traffic stay
  ungated — that is how a track earns the sample it needs to be judged.
- **The cold-start lane is a guarantee, not a cap.** Lane tracks also compete for
  the rest of the round's budget.

## Scope

The research in `spec/` includes a threat model and an adversarial study. The
constructive outputs are the ignition engine (allocation, not fabrication) and
the boost engine (disclosed paid placement). Coordinated inauthentic
amplification was explored and deliberately not built; the reasons are recorded
in `spec/HANDOFF.md` §5 and `ARCHITECTURE.md` §4 ("On personas").

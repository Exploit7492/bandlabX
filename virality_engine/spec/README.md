# spec/ — research artifacts and reproducers

Frozen copies of the branch `docs/vitality-engine-model` (commit `48e0a0f7`),
plus the analysis added on top. Stdlib only — no pytest, no scipy.

## Engine specifications

| File | Contents |
|---|---|
| `VITALITY-ENGINE.md` | Ranking model + evidence record. Engine spec, APK evidence, outcome arithmetic, confidence, threat model. |
| `IGNITION-ENGINE.md` | Discovery layer. Cold-start lane, exploration budget, 60-minute budget, 100k-user capacity. |
| `BOOST-ENGINE.md` | Creator promotion POC. Disclosed, budgeted, paced placement. |
| `SPEC-RECONCILIATION.md` | **Start here.** The α=200 vs α=8 gap between spec and engine, and how it was resolved. |
| `SECURITY-CONFIG.md` | The applied config (α=200, gate=0.60, lane=200), the derivation, and the measured trade. |
| `PERSONA-SANDBOX-DESIGN.md` | What a persona-simulation sandbox would look like, and where the line is. |
| `SEEDING-MECHANISM.md` | Minimum viable pod arithmetic: min pod ≈ α. |
| `HANDOFF.md` | Prior session's handoff note, including the recorded scope decisions. |

## Reproducers

All run directly with `python3 <file>` from this directory.

**Model and capacity**

| File | Reproduces |
|---|---|
| `vitality_model.py` | VITALITY-ENGINE.md, section by section |
| `retention_analysis.py` | Drop-off from tracker fields |
| `ignition_engine.py` | Discovery simulation |
| `ignition_60min.py` | 60-minute trajectory for one upload |
| `platform_100k.py` | Capacity at 100k users |
| `boost_engine.py` | Boost POC + 16-test suite |

**Security and configuration** — the analysis added on top of the branch

| File | Answers |
|---|---|
| `config_search.py` | Which (α, gate, lane) triple, and what each dial costs. Derives α=200/gate=0.60/lane=200. |
| `vulnerability_study.py` | Adversarial model: what a coordinated population can and cannot do. |
| `self_poisoning.py` | What injected engagement does to a ranker you operate (−11% feed quality). |
| `pod_arithmetic.py` | Minimum viable pod size, and the α relationship. |
| `reconcile.py` | The spec-vs-engine α discrepancy, quantified. |

**APK evidence** — `evidence-coverage.py` and `apk-to-endpoints.py` resolve the
evidence file in either this directory or the original `docs/research/` layout,
so both run here. The evidence files themselves (`APK-EVIDENCE.md`,
`apk-endpoints.md`, `apk-shapes.tsv`, `BUNDLE-EVIDENCE.md`, `bundle-endpoints.md`)
are present. Note `evidence-coverage.py` **exits 1 when it finds uncovered
evidenced paths** — that is a coverage report, not a failure.

The `gen-*.py`, `har-to-endpoints.py`, `scrub-har.py`, `sync-endpoint-status.py`,
`test_har_to_endpoints.py`, `test_scrub_har.py` and `open-leaves.py` scripts
expect repo-root-relative paths and exit non-zero here.

## The engine itself

`../engine.py` implements the model, `../ARCHITECTURE.md` documents it. The
spec constants and the engine constants are reconciled in
`SPEC-RECONCILIATION.md` — they were 25× apart, which was the single most
important finding in this directory.

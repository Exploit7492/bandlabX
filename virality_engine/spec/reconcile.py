"""Reconcile the vitality-engine spec against virality_engine.

Answers: where do the two disagree numerically, and which spec parameter
dominates the difference?

Run: python3 reconcile.py
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from virality_engine import BetaPosterior, TrackFeatures, build_prior, cold_start_rate

SPEC_ALPHA = 200.0
SPEC_PRIOR_Q = 0.45
SPEC_GATE = 0.65
MY_ALPHA = 8.0


def spec_floor(alpha, gate=SPEC_GATE, prior=SPEC_PRIOR_Q):
    """VITALITY-ENGINE.md 5.2: n >= alpha*(gate-prior)/(1-gate)."""
    return alpha * (gate - prior) / (1.0 - gate)


def spec_qstar(n, alpha, gate=SPEC_GATE, prior=SPEC_PRIOR_Q):
    """5.1: minimum true completion for the shrunken estimate to clear."""
    return gate + (gate - prior) * alpha / n


def shrunk(p, n, q, a):
    return (p * n + q * a) / (n + a)


print("=" * 72)
print("1. THE SHRINKAGE GAP — alpha")
print("=" * 72)
print(f"  spec alpha = {SPEC_ALPHA:.0f}   engine PRIOR_STRENGTH = {MY_ALPHA:.0f}"
      f"   ratio = {SPEC_ALPHA / MY_ALPHA:.0f}x")
print()
print("  floor = alpha*(gate-prior)/(1-gate), i.e. impressions before a")
print("  PERFECT track can clear the gate at all:")
print()
print(f"  {'alpha':>6} {'floor (impressions)':>20}")
for a in (8, 20, 50, 100, 200):
    print(f"  {a:>6} {spec_floor(a):>20.1f}")
print()
print("  At the engine's alpha=8 the floor is ~4.6 impressions; the spec's")
print("  design value is 114.3. The engine is ~25x more willing to believe a")
print("  small sample.")

print()
print("=" * 72)
print("2. SEPARATION AT n=114 — can a good track be told from a bad one?")
print("=" * 72)
print()
print(f"  {'alpha':>6} {'good(0.80)':>11} {'weak(0.50)':>11} {'gap':>8} {'usable?':>9}")
for a in (8, 50, 100, 200):
    g = shrunk(0.80, 114, SPEC_PRIOR_Q, a)
    w = shrunk(0.50, 114, SPEC_PRIOR_Q, a)
    gap = g - w
    print(f"  {a:>6} {g:>11.3f} {w:>11.3f} {gap:>8.3f} {'yes' if gap >= 0.10 else 'NO':>9}")
print()
print("  The spec's claim (IGNITION 3): a 0.10 gap is needed to separate good")
print("  from mediocre. At alpha=8 the gap is large immediately -- but that is")
print("  the problem: the engine is trusting noise.")

print()
print("=" * 72)
print("3. ACTION-WEIGHT ORDERING — the two tables disagree")
print("=" * 72)
mine = {"share": 1.00, "save": 0.45, "follow": 0.35, "like": 0.20, "profile_visit": 0.10}
spec = {"follow": 8, "share": 6, "fork": 5, "save": 4, "comment": 3, "like": 1}
print()
print("  normalised to like = 1.00:")
print(f"  {'signal':>14} {'engine':>9} {'spec':>9}   ratio")
for k in ("follow", "share", "save", "like", "fork", "comment", "profile_visit"):
    m = mine.get(k)
    s = spec.get(k)
    ms = f"{m / 0.20:.2f}" if m is not None else "--"
    ss = f"{s / 1.0:.2f}" if s is not None else "--"
    if m is not None and s is not None:
        r = f"{m / 0.20 / (s / 1.0):.2f}x"
    else:
        r = "missing on one side"
    print(f"  {k:>14} {ms:>9} {ss:>9}   {r}")
print()
print("  Conflicts:")
print("   - TOP SIGNAL: engine says share (1.00); spec says follow (8).")
print("   - follow:share ratio: engine 0.35, spec 1.33 -> ~3.8x disagreement.")
print("   - comment, fork: in the spec, ABSENT from the engine entirely.")
print("   - profile_visit: in the engine, absent from the spec's E term.")

print()
print("=" * 72)
print("4. STRUCTURAL GAPS")
print("=" * 72)
gaps = [
    ("watch-time attention term (wA=0.40, the spec's largest)",
     "MISSING - engine has only binary `completions`"),
    ("completion gate (must clear 0.65 for durable reach)",
     "MISSING - engine allocates proportionally, has no gate"),
    ("negative `hide` signal (spec weight -5)",
     "MISSING - engine has skip + report only"),
    ("`comment` and `fork` action weights",
     "MISSING - engine has neither field"),
    ("exploration as a lane (epsilon + cold-start quota)",
     "engine uses a score term (SD) + 20% floor instead"),
    ("abuse/coordination discount `d`",
     "MISSING - engine assumes honest signals"),
    ("freshness half-life 36h",
     "MATCH - FATIGUE_HALFLIFE_HOURS = 36.0"),
    ("refusal of a burst/velocity term",
     "MATCH - neither models a short-window burst"),
    ("cold-start floor of 200 impressions",
     "MATCH - min_impressions_per_track = 200"),
]
for what, status in gaps:
    print(f"  [{'x' if status.startswith('MATCH') else ' '}] {what}")
    print(f"      -> {status}")

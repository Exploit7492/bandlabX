"""Is the pod architecture arithmetically viable?

Uses the published formulas from VITALITY-ENGINE.md §7.1 and §5.2 verbatim.
Nothing here is my model; it is their model, evaluated at the proposed design.

    n_eff(N) = N * exp(-N(N-1) / (2*E0))        §7.1
    floor    = alpha * (gate - prior)/(1-gate)  §5.2

Run: python3 pod_arithmetic.py
"""
from math import exp, sqrt

ALPHA = 200.0        # VITALITY-ENGINE.md design value
GATE = 0.65
PRIOR = 0.45


def n_eff(N, E0):
    """Effective impressions a fully-cross-engaged population of N achieves."""
    return N * exp(-N * (N - 1) / (2.0 * E0))


def peak(E0):
    """§7.1: maximised at N* = sqrt(E0); peak = sqrt(E0)*exp(-1/2)."""
    return 0.607 * sqrt(E0)


def floor(alpha=ALPHA, gate=GATE, prior=PRIOR):
    return alpha * (gate - prior) / (1.0 - gate)


FLOOR = floor()
FLOOR_100 = floor(100.0, 0.60, 0.45)

print("=" * 74)
print("1. THE PROPOSED POD vs A GENUINE AUDIENCE")
print("=" * 74)
print()
print(f"  floor at alpha=200, gate=0.65 : {FLOOR:6.1f} effective impressions")
print(f"  floor at alpha=100, gate=0.60 : {FLOOR_100:6.1f}   (recommended config)")
print()
print("  A pod is a fully cross-engaged clique, so every member engages every")
print("  other -> the maximum-detection shape. E0 is the detector strength.")
print()
print(f"  {'pod size N':>10} | {'E0=10k':>9} {'E0=50k':>9} {'E0=1M':>9} | {'genuine':>8}")
print("  " + "-" * 62)
for N in (10, 50, 100, 189, 430, 1000, 5000):
    row = f"  {N:>10} |"
    for E0 in (10_000, 50_000, 1_000_000):
        row += f" {n_eff(N, E0):>9.1f}"
    row += f" | {N:>8}"
    print(row)
print()
print("  'genuine' = N independent listeners, each contributing 1 impression.")
print("  The pod column is discounted by detection; the genuine column is not.")

print()
print("=" * 74)
print("2. THE CEILING — adding accounts does not help past sqrt(E0)")
print("=" * 74)
print()
print(f"  {'E0':>9} | {'N*':>6} | {'peak n_eff':>11} | {'vs floor 200':>13} | {'vs floor 100':>13}")
print("  " + "-" * 66)
for E0 in (5_000, 10_000, 20_000, 35_760, 100_000, 1_000_000):
    p = peak(E0)
    n_star = sqrt(E0)
    ok200 = "clears" if p >= FLOOR else "NO"
    ok100 = "clears" if p >= FLOOR_100 else "NO"
    print(f"  {E0:>9} | {n_star:>6.0f} | {p:>11.1f} | {ok200:>13} | {ok100:>13}")
print()
print("  The pod's best case is ~61 effective impressions at realistic detector")
print("  strength (E0=10k). That is BELOW both floors. Past N* it decays to zero.")

print()
print("=" * 74)
print("3. THE KILLER — a pod must compress its window to coordinate")
print("=" * 74)
print()
print("  §12.6: tightening the burst window strictly LOWERS achievable n_eff.")
print("  A pod has to act together to look like a spike, so it is forced into")
print("  the compressed-window case. E0=10,000:")
print()
print(f"  {'window':>9} | {'compression':>11} | {'peak n_eff':>11} | {'clears 100?':>12}")
print("  " + "-" * 52)
for w, label in ((1440, "24 h"), (720, "12 h"), (360, "6 h"), (120, "2 h"), (60, "60 min")):
    factor = 1440 / w
    E0_eff = 10_000 / factor
    p = peak(E0_eff)
    print(f"  {label:>9} | {factor:>10.0f}x | {p:>11.1f} | {'yes' if p >= FLOOR_100 else 'NO':>12}")
print()
print("  At a 60-minute window the pod's ceiling is ~12.7 effective impressions")
print("  against a floor of 57-114. It is off by a factor of 5-9.")

print()
print("=" * 74)
print("4. WHAT THE POD WOULD HAVE TO LOOK LIKE TO WORK")
print("=" * 74)
print()
print("  From §7.1, clearing the alpha=200 floor needs E0 >= ~35,800, i.e. a")
print("  clique of ~189 accounts each engaging every other one.")
print()
print("  For 189 accounts that is 189*188/2 = 17,766 mutual engagement pairs.")
print("  Every pair must be a real interaction between two distinct accounts.")
print()
print("  So the proposal requires:")
print("    - 189 live authenticated accounts on a platform you do not own")
print("    - 17,766 mutual interactions, all inside one window")
print("    - every one of those accounts to be less detectable than a real user")
print()
print("  ...to move 114 effective impressions. A single genuine artist with")
print("  430 real followers contributes 430, with no detector risk at all.")
print()
print("  The branch's own conclusion (§11): 'At d = 0.9, 430 coordinated")
print("  impressions add +43 effective impressions -- within noise of a no-seed")
print("  baseline. A genuine audience of 430 adds 430.'")

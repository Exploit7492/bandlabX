#!/usr/bin/env python3
"""60-minute trajectory for one new upload on our platform.

Answers three questions with the ignition-engine config:
    1. how many impressions in 60 minutes?
    2. how many plays?
    3. does it reach explore (clear the quality gate)?

Deterministic arithmetic where possible; no order-dependent randomness.

    python3 scripts/research/ignition_60min.py
"""
import math

# --- config (mirrors ignition_engine.py) ------------------------------------
REQ_PER_MIN = 35          # 50,000 requests/day
SLATE = 12
COLD_LANE_SLOTS = 3       # slots/request reserved for the cold-start lane
COLD_QUOTA = 40           # guaranteed impressions per upload
NEW_PER_HOUR = 40         # concurrent new uploads sharing the lane
ALPHA = 200.0
PRIOR_Q = 0.45
GATE = 0.65
ORGANIC_CUTOFF = 0.68     # 12th-best score in the eligible pool (design estimate)
FRESH_0 = 1.0


def est_q(completions, plays, alpha=ALPHA, prior=PRIOR_Q):
    if plays == 0:
        return prior
    return (completions + prior * alpha) / (plays + alpha)


def score(eq, fresh=FRESH_0):
    return 0.80 * eq + 0.20 * fresh


def plays_to_gate(true_q, alpha=ALPHA, gate=GATE, prior=PRIOR_Q):
    """Plays needed for a track of true quality q to clear the gate. None if impossible."""
    if true_q <= gate:
        return None
    return math.ceil(alpha * (gate - prior) / (true_q - gate))


def plays_to_organic(true_q, alpha=ALPHA, cutoff=ORGANIC_CUTOFF, prior=PRIOR_Q):
    """Plays before score >= cutoff, i.e. before it wins organic slots."""
    # solve 0.80*est_q + 0.20*1.0 >= cutoff
    target_eq = (cutoff - 0.20 * FRESH_0) / 0.80
    if true_q <= target_eq:
        return None
    return math.ceil(alpha * (target_eq - prior) / (true_q - target_eq))


def trajectory(true_q, minutes=60, cold_quota=COLD_QUOTA, alpha=ALPHA):
    """Minute-by-minute accumulation for one upload."""
    lane_slots_per_min = REQ_PER_MIN * COLD_LANE_SLOTS
    fair_share = lane_slots_per_min / max(1, NEW_PER_HOUR)
    rows = []
    plays = 0
    completions = 0.0
    organic = 0
    for m in range(1, minutes + 1):
        # cold-start lane first
        lane = min(fair_share, max(0.0, cold_quota - plays))
        # organic: only once the score clears the cutoff
        eq_now = est_q(completions, plays, alpha)
        org = 0.0
        if plays >= cold_quota and score(eq_now) >= ORGANIC_CUTOFF:
            org = 1.0  # placeholder; organic rate is demand-limited, see note
        plays += lane + org
        completions += true_q * (lane + org)
        organic += org
        rows.append((m, plays, est_q(completions, plays, alpha)))
    return rows


def main():
    print("=" * 78)
    print("60-MINUTE TRAJECTORY — current config")
    print("=" * 78)
    print(f"  requests/min          = {REQ_PER_MIN}")
    print(f"  cold lane slots/min   = {REQ_PER_MIN * COLD_LANE_SLOTS}")
    print(f"  concurrent new uploads= {NEW_PER_HOUR}")
    print(f"  fair share per track  = {REQ_PER_MIN * COLD_LANE_SLOTS / NEW_PER_HOUR:.1f} impressions/min")
    print(f"  cold quota            = {COLD_QUOTA}")
    print(f"  alpha={ALPHA:.0f}  prior={PRIOR_Q}  gate={GATE}  organic cutoff={ORGANIC_CUTOFF}")
    print()

    print("  minute | plays | est_q  | score  | organic?")
    for m, p, eq in trajectory(0.80):
        if m % 5 == 0 or m <= 3:
            s = score(eq)
            print(f"  {m:>6} | {p:>5.0f} | {eq:.3f}  | {s:.3f}  | {'yes' if s >= ORGANIC_CUTOFF else 'no'}")

    print()
    print("=" * 78)
    print("ANSWERS — 60 minutes")
    print("=" * 78)
    rows = trajectory(0.80)
    final_plays = rows[-1][1]
    print(f"  1. impressions in 60 min : {final_plays:.0f}  (= cold-lane quota; organic adds none)")
    print(f"  2. plays in 60 min       : {final_plays:.0f}")
    print(f"  3. reaches explore?      : NO")
    print()
    print(f"  est_q at minute 60       : {rows[-1][2]:.3f}   (gate is {GATE})")
    print(f"  score at minute 60       : {score(rows[-1][2]):.3f}   (organic cutoff {ORGANIC_CUTOFF})")

    print()
    print("=" * 78)
    print("WHY IT STALLS — the prior is too heavy for the quota")
    print("=" * 78)
    print(f"  {'true q':>7} | {'plays to win organic':>20} | {'plays to clear gate':>19}")
    for q in (0.60, 0.65, 0.70, 0.80, 0.90, 1.00):
        po = plays_to_organic(q)
        pg = plays_to_gate(q)
        print(f"  {q:>7.2f} | {str(po) if po else 'never':>20} | {str(pg) if pg else 'never':>19}")
    print()
    print(f"  Cold quota is {COLD_QUOTA} plays. A q=0.80 track needs "
          f"{plays_to_organic(0.80)} just to start")
    print(f"  winning organic slots, and {plays_to_gate(0.80)} to clear the gate outright.")
    print(f"  At {COLD_QUOTA} plays it never gets there -> the lane is a dead end as tuned.")

    print()
    print("=" * 78)
    print("FIX — tune alpha and the quota so 60 minutes is enough")
    print("=" * 78)
    print(f"  {'alpha':>6} | {'gate':>5} | {'plays to gate (q=.80)':>22} | {'fits 60 min?':>13}")
    for alpha in (200, 150, 100, 75, 50):
        for gate in (0.65, 0.60):
            pg = plays_to_gate(0.80, alpha=alpha, gate=gate)
            fits = "yes" if pg and pg <= 200 else "no"
            print(f"  {alpha:>6} | {gate:>5.2f} | {str(pg) if pg else 'never':>22} | {fits:>13}")

    print()
    print("  Recommended: alpha=100, gate=0.60, cold quota=200")
    pg = plays_to_gate(0.80, alpha=100, gate=0.60)
    print(f"  -> a q=0.80 track clears in {pg} plays, reachable in ~{pg / (REQ_PER_MIN * COLD_LANE_SLOTS / NEW_PER_HOUR):.0f} min")
    print(f"  -> a q=0.70 track needs {plays_to_gate(0.70, alpha=100, gate=0.60)} plays")
    print(f"  -> a q=0.55 track never clears: correctly rejected")

    print()
    print("=" * 78)
    print("RE-RUN — recommended config")
    print("=" * 78)
    print(f"  {'true q':>7} | {'plays @60min':>12} | {'est_q @60min':>12} | {'explore?':>9}")
    for q in (0.55, 0.65, 0.70, 0.80, 0.90):
        rows = trajectory(q, cold_quota=200, alpha=100)
        p = rows[-1][1]
        eq = rows[-1][2]
        reached = eq >= 0.60
        print(f"  {q:>7.2f} | {p:>12.0f} | {eq:>12.3f} | {('YES' if reached else 'no'):>9}")

    print()
    print("  At quota=200 the lane delivers enough plays inside the hour for a")
    print("  genuinely good track to clear the bar, and weak tracks still fail.")
    print("  That is the ignition: policy, not personas.")


if __name__ == "__main__":
    main()

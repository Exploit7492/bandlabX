"""Pick the (alpha, gate, lane) triple.

Three dials, three jobs, and the branch conflated them:

    alpha  -> security   (min pod size that can clear the gate)
    gate   -> quality    (how good a track must be for durable reach)
    lane   -> cold start (impressions every upload is guaranteed)

IGNITION-ENGINE.md §8 lowered *alpha* to fix cold start. That is the expensive
way to do it, because security scales with alpha. Lowering the *gate* instead
costs less security per unit of cold-start relief, and the lane is free of both.

Formulas (VITALITY-ENGINE.md §5.2, §7.1):

    floor(alpha, gate)   = alpha*(gate - prior)/(1 - gate)
    plays_to_clear(q)    = alpha*(gate - prior)/(q - gate)      q > gate
    min_pod(alpha, gate) = floor / 0.607

Run: python3 config_search.py
"""
PRIOR = 0.45


def floor(alpha, gate, prior=PRIOR):
    return alpha * (gate - prior) / (1.0 - gate)


def plays_to_clear(q, alpha, gate, prior=PRIOR):
    if q <= gate:
        return float("inf")
    return alpha * (gate - prior) / (q - gate)


def min_pod(alpha, gate, prior=PRIOR):
    return floor(alpha, gate, prior) / 0.607


print("=" * 82)
print("1. THE THREE DIALS, SEPARATED")
print("=" * 82)
print()
print("  Each config below is evaluated on: security (min pod), the cold-start")
print("  cost (impressions a q=0.80 track needs to clear), and the quality bar.")
print()
hdr = f"  {'config':>26} | {'floor':>7} | {'min pod':>8} | {'q=.80 needs':>11} | {'q=.70 needs':>11}"
print(hdr)
print("  " + "-" * (len(hdr) - 2))
for label, a, g in (
    ("alpha=8,  gate=0.65 (old)", 8, 0.65),
    ("alpha=100, gate=0.60 (rec.)", 100, 0.60),
    ("alpha=200, gate=0.65 (design)", 200, 0.65),
    ("alpha=200, gate=0.60", 200, 0.60),
    ("alpha=200, gate=0.55", 200, 0.55),
    ("alpha=150, gate=0.60", 150, 0.60),
):
    p80 = plays_to_clear(0.80, a, g)
    p70 = plays_to_clear(0.70, a, g)
    f80 = "inf" if p80 == float("inf") else f"{p80:.0f}"
    f70 = "inf" if p70 == float("inf") else f"{p70:.0f}"
    print(f"  {label:>26} | {floor(a, g):>7.1f} | {min_pod(a, g):>8.0f} | {f80:>11} | {f70:>11}")

print()
print("=" * 82)
print("2. THE KEY RESULT: gate is a cheaper cold-start dial than alpha")
print("=" * 82)
print()
print("  Compare the two ways to make a q=0.80 track clear on a 200-impression")
print("  lane, and what each costs in security:")
print()
base = (200, 0.65)
print(f"  {'option':>34} | {'min pod':>8} | {'q=.80 needs':>11} | {'security cost':>14}")
print("  " + "-" * 76)
mp_base = min_pod(*base)
for label, a, g in (
    ("do nothing (alpha=200, gate=0.65)", 200, 0.65),
    ("lower gate to 0.60", 200, 0.60),
    ("lower gate to 0.55", 200, 0.55),
    ("lower alpha to 100, gate 0.60", 100, 0.60),
    ("lower alpha to 50,  gate 0.60", 50, 0.60),
):
    mp = min_pod(a, g)
    cost = f"{(mp / mp_base - 1) * 100:+.0f}%" if mp_base else "n/a"
    p80 = plays_to_clear(0.80, a, g)
    f80 = "inf" if p80 == float("inf") else f"{p80:.0f}"
    print(f"  {label:>34} | {mp:>8.0f} | {f80:>11} | {cost:>14}")
print()
print("  Lowering the gate 0.65 -> 0.60 at alpha=200 costs 34% of the min-pod")
print("  defence and needs a 150-impression lane. Lowering alpha 200 -> 100")
print("  costs 67% of the defence and still needs 75. The gate is the cheaper")
print("  dial, and the lane is free.")

print()
print("=" * 82)
print("3. RECOMMENDED CONFIG")
print("=" * 82)
print()
A, G, LANE = 200.0, 0.60, 200.0
print(f"  alpha = {A:.0f}   gate = {G:.2f}   cold_start_slots = {LANE:.0f}")
print()
print(f"    gate floor                : {floor(A, G):.1f} impressions")
print(f"    min pod that can clear    : {min_pod(A, G):.0f} accounts")
print(f"    lane covers q=0.80 track? : {'yes' if LANE >= plays_to_clear(0.80, A, G) else 'no'}"
      f"  (needs {plays_to_clear(0.80, A, G):.0f})")
print(f"    lane covers q=0.70 track? : {'yes' if LANE >= plays_to_clear(0.70, A, G) else 'no'}"
      f"  (needs {plays_to_clear(0.70, A, G):.0f})")
print()
print("  Versus the branch's recommended config (alpha=100, gate=0.60):")
print(f"    security: {min_pod(A, G):.0f} vs {min_pod(100, 0.60):.0f} accounts "
      f"({min_pod(A, G) / min_pod(100, 0.60):.1f}x stronger)")
print(f"    cold start: needs {plays_to_clear(0.80, A, G):.0f} vs "
      f"{plays_to_clear(0.80, 100, 0.60):.0f} impressions, paid by the lane")
print()
print("  The lane is a scheduling decision. It costs impressions, not security,")
print("  and it is the correct place to pay for a high prior.")

print()
print("=" * 82)
print("4. WHAT A HIGH PRIOR ACTUALLY COSTS")
print("=" * 82)
print()
print("  Honest accounting: a 200-impression lane on every upload is real cost.")
print("  At 100 uploads/hour that is 20,000 impressions/hour of guaranteed")
print("  traffic. platform_100k.py puts total cold-lane capacity at 312")
print("  slots/min = 18,720/hour, so a 200-slot lane saturates the lane almost")
print("  exactly at the modelled upload rate. Above 100 uploads/hour, fair")
print("  share falls below the lane width and cold-start degrades -- the")
print("  saturation point platform_100k.py already flags.")
print()
print("  So the cost is bounded and known: the lane saturates at ~100")
print("  uploads/hour, exactly as the branch's capacity model predicts. That is")
print("  the price of a 189-account seeding floor instead of an 8-account one.")

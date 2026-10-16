#!/usr/bin/env python3
"""Platform estimates at 100,000 users, with the ignition-engine config.

This is capacity planning for OUR platform. The cold-start lane is a policy
budget: it has a fixed throughput, and the question is whether it scales to the
upload volume at this user count.

No personas appear anywhere: on a platform we operate, discovery is allocation,
not fabricated engagement. The lane's capacity is the constraint that matters.

    python3 scripts/research/platform_100k.py
"""
import math

# --- user base ---------------------------------------------------------------
USERS = 100_000
DAU_FRACTION = 0.30           # daily actives
FEED_LOADS_PER_SESSION = 5.0  # feed refreshes per session

# --- engine config (recommended values from ignition_60min.py) ---------------
SLATE = 12
COLD_LANE_SLOTS = 3
COLD_QUOTA = 200
ALPHA = 100.0
PRIOR_Q = 0.45
GATE = 0.60
HALF_LIFE_H = 36.0

# --- supply ------------------------------------------------------------------
UPLOADS_PER_DAY = 2_400       # new tracks/day at 100k users (2.4% of DAU)
DUP_UPLOAD_RATE = 0.35        # fraction of uploads worth surfacing at all


def lane_capacity():
    dau = USERS * DAU_FRACTION
    requests_day = dau * FEED_LOADS_PER_SESSION
    req_min = requests_day / 1440.0
    slots_min = req_min * COLD_LANE_SLOTS
    return dau, requests_day, req_min, slots_min


def est_q(true_q, plays, alpha=ALPHA, prior=PRIOR_Q):
    if plays == 0:
        return prior
    return (true_q * plays + prior * alpha) / (plays + alpha)


def plays_to_gate(true_q, alpha=ALPHA, gate=GATE, prior=PRIOR_Q):
    if true_q <= gate:
        return None
    return math.ceil(alpha * (gate - prior) / (true_q - gate))


def main():
    dau, requests_day, req_min, slots_min = lane_capacity()
    uploads_hour = UPLOADS_PER_DAY / 24.0

    print("=" * 78)
    print("PLATFORM ESTIMATES AT 100,000 USERS")
    print("=" * 78)
    print(f"  registered users        = {USERS:,}")
    print(f"  daily actives (30%)     = {dau:,.0f}")
    print(f"  feed loads/day          = {requests_day:,.0f}")
    print(f"  requests/min            = {req_min:,.1f}")
    print(f"  cold lane slots/min     = {slots_min:,.1f}   ({COLD_LANE_SLOTS}/request)")
    print()

    print("=" * 78)
    print("1. LANE THROUGHPUT vs UPLOAD VOLUME")
    print("=" * 78)
    print(f"  {'uploads/hour':>13} | {'share (impr/min)':>17} | {'impr in 1h':>11} | {'quota met?':>11}")
    for uph in (24, 50, 100, 200, 300, 500, 1000):
        share = slots_min / uph
        impr_1h = share * 60
        print(f"  {uph:>13} | {share:>17.1f} | {impr_1h:>11.0f} | "
              f"{('YES' if impr_1h >= COLD_QUOTA else 'no'):>11}")
    print()
    print(f"  At the modelled {uploads_hour:.0f} uploads/hour, each track gets "
          f"{slots_min / uploads_hour * 60:.0f} impressions in the first hour.")
    print(f"  The lane saturates at ~{slots_min * 60 / COLD_QUOTA:.0f} uploads/hour "
          f"before fair share falls below the {COLD_QUOTA} quota.")

    print()
    print("=" * 78)
    print("2. DISCOVERY OUTCOME IN THE FIRST HOUR")
    print("=" * 78)
    impr_1h = min(COLD_QUOTA, slots_min / uploads_hour * 60)
    print(f"  {'true q':>7} | {'impr in 1h':>11} | {'est_q':>7} | {'explore?':>9}")
    for q in (0.50, 0.55, 0.60, 0.65, 0.70, 0.80, 0.90):
        eq = est_q(q, impr_1h)
        print(f"  {q:>7.2f} | {impr_1h:>11.0f} | {eq:>7.3f} | "
              f"{('YES' if eq >= GATE else 'no'):>9}")
    print()
    good = sum(1 for i in range(100)
               if est_q(0.55 + i * 0.0045, impr_1h) >= GATE)
    print(f"  share of uploads clearing in hour 1 (uniform q over 0.55-1.00): {good}%")

    print()
    print("=" * 78)
    print("3. DAILY DISCOVERY BUDGET")
    print("=" * 78)
    daily_lane_impr = slots_min * 60 * 24
    surfaced = daily_lane_impr / COLD_QUOTA
    print(f"  lane impressions/day    = {daily_lane_impr:,.0f}")
    print(f"  tracks fully surfaced   = {surfaced:,.0f}   (quota {COLD_QUOTA} each)")
    print(f"  uploads/day             = {UPLOADS_PER_DAY:,}")
    print(f"  coverage                = {surfaced / UPLOADS_PER_DAY:.0%} of uploads")
    print(f"  worth surfacing (35%)   = {UPLOADS_PER_DAY * DUP_UPLOAD_RATE:,.0f}")
    print(f"  -> {'surplus' if surfaced > UPLOADS_PER_DAY * DUP_UPLOAD_RATE else 'SHORTFALL'}: "
          f"{surfaced - UPLOADS_PER_DAY * DUP_UPLOAD_RATE:+,.0f}")

    print()
    print("=" * 78)
    print("4. WHAT BREAKS AT SCALE")
    print("=" * 78)
    rows = []
    for users in (10_000, 50_000, 100_000, 500_000, 1_000_000):
        dau2 = users * DAU_FRACTION
        req = dau2 * FEED_LOADS_PER_SESSION / 1440.0
        slots = req * COLD_LANE_SLOTS
        up = UPLOADS_PER_DAY * (users / USERS)
        impr = slots * 60 / max(1, up / 24.0)
        rows.append((users, req, slots, up, impr))
    print(f"  {'users':>10} | {'req/min':>9} | {'slots/min':>10} | {'uploads/day':>12} | {'impr in 1h':>11}")
    for u, r, s, up, im in rows:
        print(f"  {u:>10,} | {r:>9.1f} | {s:>10.0f} | {up:>12,.0f} | {im:>11.0f}")
    print()
    print("  Lane capacity grows linearly with actives; upload volume grows linearly")
    print("  with users too, so the ratio holds. What changes is absolute cost: at 1M")
    print("  users the lane serves ~10x the impressions. Budget accordingly.")

    print()
    print("=" * 78)
    print("5. SUMMARY — 100k USERS")
    print("=" * 78)
    summary = [
        ("requests/min", f"{req_min:,.1f}"),
        ("cold lane slots/min", f"{slots_min:,.0f}"),
        ("uploads/hour", f"{uploads_hour:,.0f}"),
        ("impressions per track in hour 1", f"{impr_1h:,.0f}"),
        ("tracks surfacing per day", f"{surfaced:,.0f}"),
        ("coverage of uploads", f"{surfaced / UPLOADS_PER_DAY:.0%}"),
        ("gate", f"{GATE:.2f}"),
        ("uploads clearing hour 1", f"{good}%"),
        ("lane saturation point", f"~{slots_min * 60 / COLD_QUOTA:.0f} uploads/hour"),
    ]
    for a, b in summary:
        print(f"  {a:<34} | {b}")


if __name__ == "__main__":
    main()

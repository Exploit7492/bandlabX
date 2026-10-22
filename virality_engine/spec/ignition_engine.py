#!/usr/bin/env python3
"""Ignition engine — new-track discovery for a platform we operate.

Design principle: on a platform you own, discovery is a *policy you set*, not a signal you
fake. There is no coordination to hide and no detector to evade, because the serving layer is
yours. Every parameter below is a config value, not an obstacle.

What this replaces from the earlier BandLab research:
    personas / seed accounts   -> epsilon-greedy exploration budget (a config value)
    burst velocity             -> freshness windows (a ranker feature)
    fabricated engagement      -> honest shrinkage on YOUR OWN counters
    E0 (evasion)               -> YOUR abuse detector

Stdlib only. Run:
    python3 scripts/research/ignition_engine.py
"""
import random

SEED = 7
random.seed(SEED)

# --- config -----------------------------------------------------------------
SLATE = 12              # slots served per request
EPS_START = 0.10        # exploration fraction
PROMO_BUDGET = 1        # reserved promoted slots (disclosed)
ALPHA = 200.0           # shrinkage prior weight on a track's quality estimate
PRIOR_Q = 0.45          # prior completion
HALF_LIFE_H = 36.0      # freshness half-life, hours
GATE_Q = 0.65           # quality bar to earn durable organic reach
COLD_START_SLOTS = 40   # guaranteed impressions for every new upload
COLD_LANE_SLOTS = 3     # of those, slots reserved per request while in the lane


def shrink(p, n, q=PRIOR_Q, a=ALPHA):
    return (p * n + q * a) / (n + a)


# --- simulated platform ------------------------------------------------------
class Track:
    __slots__ = ("tid", "q", "age_h", "plays", "completions", "promoted")

    def __init__(self, tid, q, promoted=False):
        self.tid = tid
        self.q = q                  # latent quality (completion rate a user would give)
        self.age_h = 0.0
        self.plays = 0
        self.completions = 0.0
        self.promoted = promoted

    @property
    def completion(self):
        return self.completions / self.plays if self.plays else PRIOR_Q

    @property
    def est_q(self):
        """Honest shrunk estimate — the platform's own belief, no fabrication."""
        return shrink(self.completion, self.plays)

    @property
    def fresh(self):
        return 0.5 ** (self.age_h / HALF_LIFE_H)

    def score(self):
        """Rank score. Attention-dominant, with a freshness term for velocity."""
        A = self.est_q
        C = self.est_q
        return 0.55 * A + 0.25 * C + 0.20 * self.fresh


def serve(track, rng):
    """One impression: the user completes with probability = latent quality.

    The draw is keyed on (tid, play index) so randomness does not depend on call
    order. That makes configs comparable: changing epsilon cannot shift the
    sequence of outcomes elsewhere in the catalogue.
    """
    track.plays += 1
    draw = random.Random(f"{track.tid}:{track.plays}").random()
    if draw < track.q:
        track.completions += 1.0


def build_catalog(n_tracks=4000, n_new_per_epoch=40, n_epochs=24):
    """Epochs are 1 hour. New tracks arrive each epoch; qualities are Beta-distributed."""
    rng = random.Random(SEED + 1)
    tracks = [Track(i, rng.betavariate(4.5, 4.5)) for i in range(n_tracks)]
    arrivals = {}
    tid = n_tracks
    for e in range(n_epochs):
        arrivals[e] = []
        for _ in range(n_new_per_epoch):
            q = rng.betavariate(4.5, 4.5)
            t = Track(tid, q)
            tracks.append(t)
            arrivals[e].append(t)
            tid += 1
    return tracks, arrivals


def run(eps=EPS_START, promo=PROMO_BUDGET, epochs=24, req_per_epoch=200,
        alpha=ALPHA, half_life=HALF_LIFE_H, cold_start_slots=COLD_START_SLOTS):
    global ALPHA, HALF_LIFE_H
    ALPHA, HALF_LIFE_H = alpha, half_life
    rng = random.Random(SEED)
    tracks, arrivals = build_catalog(n_epochs=epochs)

    new_ids = set()
    for e in arrivals:
        for t in arrivals[e]:
            new_ids.add(t.tid)

    discovery = {}
    served_quality = []
    # cold-start lane: guaranteed impressions per new track, spread over a few epochs
    cold_quota = {t.tid: cold_start_slots for e in arrivals for t in arrivals[e]}
    lane = {e: [] for e in arrivals}          # tracks queued for the lane this epoch
    lane_wait = {e: [] for e in arrivals}

    for e in range(epochs):
        for t in arrivals.get(e, []):
            t.age_h = 0.0
            lane[e].append(t)
        # carry over any track that still has quota but missed the lane
        for pe in range(max(0, e - 3), e):
            for t in lane_wait.get(pe, []):
                if cold_quota.get(t.tid, 0) > 0 and t not in lane[e]:
                    lane[e].append(t)

        pool = [t for t in tracks if t.plays > 0] + [t for t in tracks if t.plays == 0][:400]

        for _ in range(req_per_epoch):
            exploit = sorted(pool, key=lambda t: t.score(), reverse=True)[:SLATE]
            picks = list(exploit)

            # cold-start lane: new tracks get guaranteed slots first
            lane_picks = [t for t in lane[e] if cold_quota.get(t.tid, 0) > 0][:COLD_LANE_SLOTS]
            for t in lane_picks:
                cold_quota[t.tid] -= 1
            picks = lane_picks + picks[:SLATE - len(lane_picks)]

            # exploration: low-exposure tracks beyond the lane
            n_explore = int(round(SLATE * eps))
            if n_explore:
                underexposed = [t for t in pool if t.plays < alpha and t not in picks]
                underexposed.sort(key=lambda t: t.plays)
                cand = underexposed[:max(n_explore * 5, n_explore)]
                if cand:
                    picks = picks[:SLATE - n_explore] + rng.sample(
                        cand, min(n_explore, len(cand)))

            # promotion lane: reserved disclosed slots
            if promo:
                promoted = [t for t in pool if t.promoted and t not in picks]
                picks = promoted[:promo] + picks[:SLATE - promo]

            for t in picks[:SLATE]:
                serve(t, rng)
                served_quality.append(t.q)
                if t.tid in new_ids and t.tid not in discovery:
                    discovery[t.tid] = e
        for t in lane[e]:
            if cold_quota.get(t.tid, 0) > 0:
                lane_wait[e].append(t)
        for t in tracks:
            t.age_h += 1.0

    return tracks, arrivals, discovery, served_quality, new_ids


def pct(x):
    return f"{x:.1%}"


def main():
    print("=" * 78)
    print("IGNITION ENGINE — config")
    print("=" * 78)
    for k, v in [("slate", SLATE), ("epsilon", EPS_START), ("promo budget", PROMO_BUDGET),
                 ("alpha", ALPHA), ("prior_q", PRIOR_Q), ("half-life (h)", HALF_LIFE_H),
                 ("quality gate", GATE_Q)]:
        print(f"  {k:<16} = {v}")

    print()
    print("=" * 78)
    print("1. DISCOVERY vs EXPLORATION BUDGET")
    print("   How many new tracks get served, and how fast?")
    print("=" * 78)
    print(f"  {'epsilon':>8} | {'new served':>11} | {'good served':>12} | {'mean wait':>10} | {'feed quality':>13}")
    for eps in (0.0, 0.05, 0.10, 0.20, 0.30):
        _, arrivals, disc, sq, new_ids = run(eps=eps)
        good = [t for t in arrivals_good(arrivals) if t.tid in disc]
        waits = [disc[t.tid] for t in arrivals_good(arrivals) if t.tid in disc]
        mw = sum(waits) / len(waits) if waits else float("nan")
        print(f"  {eps:>8.2f} | {len(disc):>11} | {len(good):>12} | "
              f"{mw:>9.1f}h | {sum(sq) / len(sq):>13.3f}")

    print()
    print("=" * 78)
    print("2. THE COST OF PROMOTION SLOTS")
    print("   Each reserved slot is an organic slot not served.")
    print("=" * 78)
    print(f"  {'promo slots':>11} | {'feed quality':>13} | {'new served':>11} | {'organic share':>14}")
    for promo in (0, 1, 2, 3):
        _, arrivals, disc, sq, new_ids = run(promo=promo)
        org_share = (SLATE - promo) / SLATE
        print(f"  {promo:>11} | {sum(sq) / len(sq):>13.3f} | {len(disc):>11} | {org_share:>13.0%}")

    print()
    print("=" * 78)
    print("3. COLD-START CONFIDENCE: how many plays before the estimate is trustworthy")
    print("   Shrunk estimate vs true quality; alpha is YOUR prior weight.")
    print("=" * 78)
    print(f"  {'plays':>7} | {'shrunk (q=.80)':>14} | {'shrunk (q=.50)':>14} | {'gap':>7}")
    for n in (10, 25, 50, 115, 200, 430, 1000):
        a = shrink(0.80, n)
        b = shrink(0.50, n)
        print(f"  {n:>7} | {a:>14.3f} | {b:>14.3f} | {a - b:>7.3f}")
    print()
    print(f"  At alpha={ALPHA:.0f}, a track needs ~{ALPHA * (GATE_Q - PRIOR_Q) / (1 - GATE_Q):.0f} "
          f"distinct plays before a perfect track can clear {GATE_Q}.")
    print("  Below that, discovery allocation carries it — not fabricated play counts.")

    print()
    print("=" * 78)
    print("4. RECOMMENDED CONFIG")
    print("=" * 78)
    rows = [
        ("exploration epsilon", "0.10", "1-2 slots/request to low-exposure tracks"),
        ("promotion budget", "1", "<=8% of slate; disclosed in UI"),
        ("alpha (prior weight)", f"{ALPHA:.0f}", "tune to your catalogue size"),
        ("quality gate", f"{GATE_Q:.2f}", "earns durable organic reach"),
        ("freshness half-life", f"{HALF_LIFE_H:.0f}h", "velocity without a burst signal"),
        ("abuse detector", "yours", "measures manipulation, not promotion"),
    ]
    for a, b, c in rows:
        print(f"  {a:<22} | {b:<8} | {c}")


def arrivals_good(arrivals, thresh=0.65):
    out = []
    for e in arrivals:
        for t in arrivals[e]:
            if t.q >= thresh:
                out.append(t)
    return out


if __name__ == "__main__":
    main()

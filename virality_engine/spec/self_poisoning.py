#!/usr/bin/env python3
"""Does organizing your own real users into pods help you?

Tests the proposal against the platform's OWN recommender. When you operate the
platform, injected engagement is not "boosting" - it is a false label written
into your training signal. This measures what that does to your product.

Setup mirrors ignition_engine.py: quality is estimated by honest shrinkage from
observed completions, and the feed ranks by that estimate.

    python3 scripts/research/self_poisoning.py
"""
import random

ALPHA = 100.0
PRIOR_Q = 0.45
SLATE = 12
N_TRACKS = 300
N_USERS = 5_000
ROUNDS = 60


class Track:
    __slots__ = ("tid", "q", "plays", "completions", "injected_plays")

    def __init__(self, tid, q):
        self.tid = tid
        self.q = q
        self.plays = 0
        self.completions = 0.0
        self.injected_plays = 0

    @property
    def est_q(self):
        return (self.completions + PRIOR_Q * ALPHA) / (self.plays + ALPHA)


def make_catalogue(seed=5):
    rng = random.Random(seed)
    return [Track(i, rng.betavariate(4.5, 4.5)) for i in range(N_TRACKS)]


def run(pod_size=0, pod_target=None, rounds=ROUNDS, seed=9):
    """pod_size accounts all 'engage' pod_target. Their completion is fabricated."""
    rng = random.Random(seed)
    tracks = make_catalogue()
    target = None
    if pod_target is not None:
        # target is a genuinely weak track, chosen for the pod to promote
        weak = sorted(tracks, key=lambda t: t.q)[:20]
        target = weak[pod_target % len(weak)]

    served_q = []
    for _ in range(rounds):
        pool = sorted(tracks, key=lambda t: t.est_q, reverse=True)[:SLATE * 3]
        slate = pool[:SLATE]
        for t in slate:
            t.plays += 1
            if rng.random() < t.q:
                t.completions += 1.0
                served_q.append(t.q)
            else:
                served_q.append(0.0)

        # pod injection: fake completions on the target, all in one round
        if pod_size and target is not None:
            for _ in range(pod_size):
                target.plays += 1
                target.completions += 1.0        # fabricated completion
                target.injected_plays += 1

    return tracks, target, served_q


def feed_quality(served_q):
    return sum(served_q) / len(served_q) if served_q else 0.0


def main():
    print("=" * 78)
    print("DOES A POD STRUCTURE WORK ON YOUR OWN PLATFORM?")
    print("=" * 78)
    print(f"  catalogue={N_TRACKS}  users={N_USERS}  rounds={ROUNDS}")
    print(f"  quality estimated by shrinkage (alpha={ALPHA:.0f}, prior={PRIOR_Q})")
    print()

    # baseline: no pod
    tracks_b, target_b, q_b = run(pod_size=0)
    base_feed = feed_quality(q_b)
    print("BASELINE (no pod)")
    print(f"  mean served quality = {base_feed:.3f}")
    top_b = sorted(tracks_b, key=lambda t: t.est_q, reverse=True)[:5]
    print(f"  top-5 est_q         = {[round(t.est_q, 3) for t in top_b]}")
    print()

    # with a pod pushing a weak track
    print("WITH POD INJECTION (pod of 100 accounts faking completions)")
    print(f"  {'pod size':>9} | {'target true q':>13} | {'target est_q':>12} | {'feed quality':>12} | {'vs base':>8}")
    for pod in (0, 50, 100, 300, 1000, 5000):
        tracks, target, qs = run(pod_size=pod, pod_target=3)
        fq = feed_quality(qs)
        tq = target.est_q if target else 0.0
        ttrue = target.q if target else 0.0
        print(f"  {pod:>9} | {ttrue:>13.3f} | {tq:>12.3f} | {fq:>12.3f} | {fq - base_feed:>+8.3f}")

    print()
    print("=" * 78)
    print("WHAT HAPPENS TO YOUR OWN RANKING SIGNAL")
    print("=" * 78)
    tracks, target, qs = run(pod_size=1000, pod_target=3)
    ranked = sorted(tracks, key=lambda t: t.est_q, reverse=True)
    pos = next(i + 1 for i, t in enumerate(ranked) if t is target)
    print(f"  target true quality     = {target.q:.3f}  (deliberately weak)")
    print(f"  target est_q after pod  = {target.est_q:.3f}")
    print(f"  target rank by est_q    = #{pos} of {N_TRACKS}")
    print(f"  real completions        = {target.plays - target.injected_plays}")
    print(f"  fabricated completions  = {target.injected_plays}")
    print()
    print("  Your recommender now believes a weak track is strong, because you")
    print("  wrote false labels into the only signal it learns from.")

    print()
    print("=" * 78)
    print("THE STRUCTURAL PROBLEM")
    print("=" * 78)
    rows = [
        ("You control serving", "so you can place the track directly - no pods needed"),
        ("Your recommender trains on engagement", "injected engagement is a false label"),
        ("False labels persist", "the model keeps serving the wrong thing"),
        ("Your users are real people", "organizing them is a decision made about them, not by them"),
        ("You would be your own adversary", "the abuse detector is yours to build"),
    ]
    for a, b in rows:
        print(f"  {a:<38} | {b}")

    print()
    print("  Net: the pod produces a worse feed for your users, a less accurate")
    print("  model for you, and no capability you did not already have. The")
    print("  cold-start lane already delivers what the pod was for.")


if __name__ == "__main__":
    main()

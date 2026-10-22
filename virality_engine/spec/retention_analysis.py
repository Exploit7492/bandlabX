#!/usr/bin/env python3
"""Retention analyser for a single post, from the tracker fields.

Uses only fields the client already sends (APK-EVIDENCE.md §2):
    MediaDurationTrackerRequest.duration            total length, seconds
    MediaDurationTrackerRequest.playStartedPosition where the listener began
    MediaDurationTrackerRequest.lastPlayedPosition  where they stopped
    MediaDurationTrackerRequest.actualPlayedDuration

Completion is the quantity the ranking gate measures (VITALITY-ENGINE.md §5), so a drop-off
profile is the one lever that moves a track across rungs. Stdlib only.

Run with a CSV of sessions (one per line: start,last,seconds) or with no argument to use a
built-in synthetic profile:

    python3 scripts/research/retention_analysis.py sessions.csv
    python3 scripts/research/retention_analysis.py
"""
import csv
import sys
from math import erf, sqrt

ALPHA = 200.0          # shrinkage prior weight (design estimate)
PRIOR_COMP = 0.45
GATE_COMP = 0.65
GATE_SHARE = 0.008


def shrunken(p, n, q, a=ALPHA):
    """Shrinkage: (p*n + q*a)/(n+a). See VITALITY-ENGINE.md §4."""
    return (p * n + q * a) / (n + a)


def completion_for(session, duration):
    """Fraction of the track a single session consumed."""
    start, last, played = session
    if duration <= 0:
        return 0.0
    span = max(0.0, last - start)
    # trust the position span; fall back to reported seconds
    consumed = span if span > 0 else played
    return min(1.0, consumed / duration)


def load_sessions(path=None):
    """Return (duration, [ (start, last, played), ... ])."""
    if path is None:
        duration = 150.0  # 2:30 hip-hop track
        # synthetic profile: a strong hook, a dropout at the second verse
        rows = []
        for i in range(400):
            if i < 60:      # skipped in the first 10s
                rows.append((0.0, 9.0 + i % 3, 9.0))
            elif i < 210:   # finished
                rows.append((0.0, duration - (i % 5), duration - (i % 5)))
            elif i < 300:   # lost at the second verse (~60-90s in)
                rows.append((0.0, 65.0 + (i % 20), 70.0))
            else:           # partial, mid
                rows.append((2.0, 95.0 + (i % 25), 95.0))
        return duration, rows

    duration = None
    sessions = []
    with open(path, newline="") as fh:
        for row in csv.DictReader(fh):
            if duration is None:
                duration = float(row.get("duration", 150.0))
            sessions.append((float(row["start"]), float(row["last"]),
                             float(row.get("seconds", 0) or 0)))
    return duration, sessions


def histogram(sessions, duration, bins=10):
    """Drop-off histogram: where in the track listeners stop."""
    counts = [0] * bins
    for s in sessions:
        frac = completion_for(s, duration)
        idx = min(bins - 1, int(frac * bins))
        counts[idx] += 1
    return counts


def analyse(duration, sessions, reach=None):
    n = len(sessions)
    completions = [completion_for(s, duration) for s in sessions]
    raw = sum(completions) / n if n else 0.0
    shrunk = shrunken(raw, n, PRIOR_COMP)
    cleared = shrunk >= GATE_COMP

    print("=" * 74)
    print("RETENTION ANALYSIS")
    print("=" * 74)
    print(f"  track length            : {duration:.0f}s")
    print(f"  sessions                : {n}")
    print(f"  raw completion          : {raw:.3f}")
    print(f"  shrunken completion     : {shrunk:.3f}   (alpha={ALPHA:.0f}, prior={PRIOR_COMP})")
    print(f"  gate                    : {GATE_COMP:.2f}")
    print(f"  clears gate?            : {'YES' if cleared else 'no'}")
    if not cleared:
        gap = GATE_COMP - shrunk
        print(f"  shortfall               : {gap:.3f}")
        # completion needed for the shrunk estimate to clear, at this n
        needed = (GATE_COMP * (n + ALPHA) - PRIOR_COMP * ALPHA) / n
        print(f"  raw completion needed   : {needed:.3f}")

    print()
    print("  drop-off by tenth of the track")
    hist = histogram(sessions, duration)
    for i, c in enumerate(hist):
        lo, hi = i * duration / 10, (i + 1) * duration / 10
        bar = "#" * int(40 * c / max(hist)) if max(hist) else ""
        print(f"    {lo:>5.0f}-{hi:>5.0f}s | {c:>5} | {bar}")

    if reach:
        print()
        print(f"  at organic reach n={reach}:")
        s2 = shrunken(raw, reach, PRIOR_COMP)
        print(f"    shrunken completion   : {s2:.3f}   -> {'clears' if s2 >= GATE_COMP else 'does not clear'}")

    return raw, shrunk, cleared


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else None
    duration, sessions = load_sessions(path)
    analyse(duration, sessions, reach=430)

    print()
    print("=" * 74)
    print("ESTIMATED 24h TRAJECTORY (design estimates; see VITALITY-ENGINE.md §5)")
    print("=" * 74)
    print(f"  {'raw completion':>15} | {'explore?':>9} | {'before':>9} | {'after':>9} | {'24h':>9}")
    for q in (0.40, 0.50, 0.55, 0.60, 0.65, 0.70):
        ok = q >= GATE_COMP
        before = 2250
        after = 10000 if ok else 0
        print(f"  {q:>15.2f} | {('YES' if ok else 'no'):>9} | {before:>9,} | {after:>9,} | {before + after:>9,}")
    print()
    print("  Estimates only. 'before' is the pre-explore ladder (rungs 0-2);")
    print("  'after' is the explore window. All values are model outputs, not data.")


if __name__ == "__main__":
    main()

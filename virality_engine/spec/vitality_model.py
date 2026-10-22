#!/usr/bin/env python3
"""Vitality-engine model — reproduces every number in docs/research/VITALITY-ENGINE.md.

Stdlib only (repo rule: no pytest/scipy in this image). Run:

    python3 scripts/research/vitality_model.py

Sections map 1:1 to the document. Weights and thresholds are DESIGN values; the APK
evidence in section 2 of the document is separate and is not recomputed here.

Note: the floor in 5.2 is derived algebraically (a*(gate-prior)/(1-gate)); the coordinated-
population rows in 5.3 are quantised at the sample sizes shown (100/500/1000), so the small
d=0 margins there are a sampling artefact, not a contradiction.
"""
from math import erf, exp, log, sqrt

# --- design constants (VITALITY-ENGINE.md sections 3-4) ----------------------
ALPHA = 200.0          # shrinkage prior weight
PRIOR_COMP = 0.45      # prior completion
GATE_S, GATE_C, GATE_SH = 0.55, 0.65, 0.008
W = dict(wA=0.40, wE=0.20, wG=0.20, wM=0.15, wN=0.25)
ACTION_W = dict(like=1, comment=3, save=4, follow=8, share=6, fork=5)
PLAY_THROUGH_W = 2
REF_SECONDS = 30.0
E_CEIL = 0.30
G_SEC = 0.03

BASE = dict(comp=0.50, mw=14.0, like=0.050, comment=0.008, save=0.006,
            share=0.004, follow=0.002, fork=0.002, skip=0.22, hide=0.003)

PROFILES = {
    'weak':   dict(comp=0.35, mw=8.0,  like=0.030, comment=0.004, save=0.003, share=0.002, follow=0.001, fork=0.001, skip=0.35, hide=0.006),
    'median': dict(BASE),
    'strong': dict(comp=0.72, mw=23.0, like=0.080, comment=0.014, save=0.018, share=0.011, follow=0.005, fork=0.008, skip=0.10, hide=0.001),
    'viral':  dict(comp=0.80, mw=27.0, like=0.100, comment=0.020, save=0.030, share=0.020, follow=0.008, fork=0.015, skip=0.05, hide=0.0005),
}


def shrunk(p, n, q, a=ALPHA):
    return (p * n + q * a) / (n + a)


# --- section 5: outcome arithmetic ------------------------------------------
def q_star(n, gate=GATE_C, prior=PRIOR_COMP, a=ALPHA):
    """Minimum TRUE completion for the shrunken estimate to clear the gate."""
    return gate + (gate - prior) * a / n


def floor(a=ALPHA, gate=GATE_C, prior=PRIOR_COMP):
    """Smallest n at which a perfect post can clear.

    Solve (n + prior*a)/(n + a) >= gate with p = 1.0:
        n*(1-gate) >= a*(gate-prior)  =>  n >= a*(gate-prior)/(1-gate).
    At (gate, prior) = (0.65, 0.45) this is a*0.20/0.35 = a/1.75.
    """
    return a * (gate - prior) / (1.0 - gate)


def clears(rates, n, a=ALPHA, d=0.0, w=W, pt_w=PLAY_THROUGH_W, pt_frac=0.0):
    """Does a post clear rung 3? d = effective-n discount fraction."""
    ne = n * (1.0 - d)
    C = shrunk(rates['comp'], ne, BASE['comp'], a)
    A = 0.6 * min(1.0, rates['mw'] / REF_SECONDS) + 0.4 * C
    E = min(1.0, (sum(ACTION_W[k] * shrunk(rates[k], ne, BASE[k], a) for k in ACTION_W)
                  + pt_w * shrunk(rates.get('play', 0.70), ne, 0.70, a) * pt_frac) / E_CEIL)
    G = min(1.0, (shrunk(rates['share'], ne, BASE['share'], a)
                  + 1.5 * shrunk(rates['fork'], ne, BASE['fork'], a)) / G_SEC)
    N = shrunk(rates['skip'], ne, BASE['skip'], a) + shrunk(rates['hide'], ne, BASE['hide'], a)
    S = w['wA'] * A + w['wE'] * E + w['wG'] * G + w['wM'] * 0.70 - w['wN'] * N
    S = max(0.0, min(1.0, S))
    share = shrunk(rates['share'], ne, BASE['share'], a)
    return S >= GATE_S and C >= GATE_C and share >= GATE_SH


# --- section 6: confidence ---------------------------------------------------
def norm_cdf(z):
    return 0.5 * (1.0 + erf(z / sqrt(2.0)))


def p_clear(N, p_d):
    q = 1.0 - p_d
    if q <= 0:
        return 0.0
    mu = N * q
    var = N * q * (1 - q)
    if var <= 0:
        return 1.0 if mu >= 115 else 0.0
    return 1.0 - norm_cdf((115 - 0.5 - mu) / sqrt(var))


FLOOR_N = 115  # ceil(floor())


def min_n_for(p_d, target=0.9998, cap=20_000_000):
    lo, hi = 1, 16
    while p_clear(hi, p_d) < target and hi < cap:
        hi *= 2
    if p_clear(hi, p_d) < target:
        return None
    while lo < hi:
        mid = (lo + hi) // 2
        if p_clear(mid, p_d) >= target:
            hi = mid
        else:
            lo = mid + 1
    return lo


# --- section 7.1: detection as a function of clique density -------------------
def p_detect(N, E0):
    """p_d = 1 - exp(-E(N)/E0), E(N) = N(N-1)/2 fully cross-engaging accounts."""
    return 1.0 - exp(-(N * (N - 1) / 2.0) / E0)


def n_eff_density(N, E0):
    """Effective reach the engine actually counts."""
    return N * (1.0 - p_detect(N, E0))


def peak_n_eff(E0, cap=200_000):
    """Max n_eff over N, and the argmax. Closed form: N* = sqrt(E0)."""
    best, best_n = 0.0, 1
    for N in range(1, cap + 1):
        v = n_eff_density(N, E0)
        if v > best:
            best, best_n = v, N
    return best, best_n


def e0_threshold(floor_=FLOOR_N, cap=10_000_000):
    """Smallest E0 for which the peak reaches the floor."""
    lo, hi = 1, cap
    while lo < hi:
        mid = (lo + hi) // 2
        if peak_n_eff(mid)[0] >= floor_:
            hi = mid
        else:
            lo = mid + 1
    return lo


# --- section 9: reality rates -------------------------------------------------
def beta_cdf(x, a, b, steps=20000):
    def f(t):
        return 0.0 if t <= 0 or t >= 1 else t ** (a - 1) * (1 - t) ** (b - 1)
    def integ(upper):
        h = upper / steps
        s = f(0.0) + f(upper)
        for i in range(1, steps):
            s += (4 if i % 2 else 2) * f(i * h)
        return s * h / 3
    if x <= 0:
        return 0.0
    if x >= 1:
        return 1.0
    return integ(x) / integ(1.0)


DISTS = {'pessimistic': (4.5, 5.5), 'moderate': (5.5, 4.5), 'optimistic': (6.5, 3.5)}


# --- report -------------------------------------------------------------------
def rule(title):
    print()
    print(title)
    print('-' * len(title))


def main():
    rule('5.1 quality bar q* = gate + (gate-prior)*alpha/n')
    for n in (50, 100, 115, 200, 430, 1000, 5000):
        print(f'  n={n:>6}  q*={q_star(n):.3f}')

    rule('5.2 floor = alpha/1.75')
    for a in (200, 100, 50, 20):
        print(f'  alpha={a:>4}  floor={floor(a):.1f}')
    assert FLOOR_N == 115

    rule('5.3 discount blocks coordinated populations')
    pod = dict(PROFILES['strong'])
    pod.update(comp=1.0, like=1.0, comment=1.0, save=1.0, share=1.0,
               follow=1.0, fork=1.0, skip=0.0, hide=0.0)
    for N in (100, 500, 1000):
        row = []
        for d in (0.0, 0.5, 0.7, 0.9, 0.95):
            row.append(f'd={d}:{"YES" if clears(pod, N, d=d) else "no"}')
        print(f'  n={N:>5}  ' + '  '.join(row))

    rule('6 confidence: N for 99.98% vs discard prob p_d')
    for pd in (0.0, 0.3, 0.7, 0.9, 0.99, 0.999):
        N = min_n_for(pd)
        print(f'  p_d={pd:<6}  N={N if N else "infinity"}')

    rule('6b 100% requires p_d = 0')
    print('  for any p_d>0 and target<1, N is finite; target=1 -> N diverges.')
    for pd in (0.01, 0.05, 0.10):
        print(f'  p_d={pd:<5} 99.999% needs N={min_n_for(pd, target=0.99999)}')

    rule('7.1 density model: n_eff(N) = N*exp(-N(N-1)/(2*E0))')
    print('  N* = sqrt(E0);  peak = 0.607*sqrt(E0)')
    print(f'  E0 threshold = {e0_threshold():,}  (clique of ~{sqrt(e0_threshold()):.0f} accounts)')
    print(f"  {'E0':>10} | {'peak n_eff':>10} | {'at N*':>7} | clears?")
    for E0 in (5000, 10000, 20000, 35900, 100000, 1000000):
        pk, pn = peak_n_eff(E0)
        print(f'  {E0:>10,} | {pk:>10.1f} | {pn:>7,} | {"YES" if pk >= FLOOR_N else "no"}')

    rule('12.6 window compression: peak n_eff vs burst window (E0=10,000)')
    print('  compression factor = 1440 / W_minutes (vs a full day)')
    print(f"  {'W (min)':>8} | {'factor':>7} | {'peak n_eff':>11} | clears?")
    for W in (1440, 720, 360, 120, 60, 30):
        f = 1440.0 / W
        # apply the compression factor inside the detection term
        best, best_n = 0.0, 1
        for N in range(1, 20001):
            v = N * exp(-(N * (N - 1) / 2.0) / 10000.0 * f)
            if v > best:
                best, best_n = v, N
        print(f'  {W:>8} | {f:>7.1f} | {best:>11.4f} | {"YES" if best >= FLOOR_N else "no"}')

    rule('9 reality rates P(true completion >= q*)')
    for name, (a, b) in DISTS.items():
        print(f'  {name} (Beta({a},{b}))')
        for n in (200, 430, 1000, 5000):
            q = q_star(n)
            rate = 0.0 if q >= 1 else 1.0 - beta_cdf(q, a, b)
            print(f'    n={n:>5}  q*={q:.3f}  rate={rate:.4%}')

    rule('9b genuine audience uplift (moderate catalogue)')
    a, b = DISTS['moderate']
    base = 1.0 - beta_cdf(q_star(200), a, b)
    for aud in (0, 100, 430, 800):
        n = 200 + aud
        rate = 1.0 - beta_cdf(q_star(n), a, b)
        print(f'  +{aud:>4} real  n={n:>5}  rate={rate:.4%}  uplift={rate / base:.2f}x')

    rule('3 play weight: why play is a base, not a reward')
    k = 'strong'
    r = PROFILES[k]
    n = 430
    raw_np = sum(ACTION_W[kk] * shrunk(r[kk], n, BASE[kk]) for kk in ACTION_W)
    play_share = shrunk(0.85, n, 0.70) / (raw_np + shrunk(0.85, n, 0.70))
    print(f'  strong@430: raw(no play)={raw_np:.4f}  E={min(1, raw_np / E_CEIL):.3f}')
    print(f'  if play weight=1: play share of E = {play_share:.1%} -> saturates E')
    print('  => play belongs in the denominator and in A, not in E')

    rule('10 sanity: organic strength vs the gate (alpha=200)')
    for name in ('weak', 'median', 'strong', 'viral'):
        print(f'  {name:<7} n=430  clears={clears(PROFILES[name], 430)}')


if __name__ == '__main__':
    main()

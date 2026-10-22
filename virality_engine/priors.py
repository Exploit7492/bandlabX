"""Probability primitives for the virality engine.

Everything here is pure-stdlib so the engine has no hard third-party
dependency. The core object is a Beta posterior, because every quantity the
engine reasons about is a bounded rate (a proportion): completion rate, share
rate, referral conversion, and so on.

Why Beta: rates are proportions, and the Beta distribution is the conjugate
prior for a Bernoulli/binomial rate. That gives closed-form posterior updates
and honest small-sample behaviour, which is exactly what a cold-start
promotion system needs.
"""

from __future__ import annotations

import math
import random
from dataclasses import dataclass
from typing import List, Sequence, Tuple

_EPS = 1e-12


def _randn(rng: random.Random) -> float:
    """Standard normal via Box-Muller."""
    u1 = rng.random()
    while u1 <= _EPS:
        u1 = rng.random()
    u2 = rng.random()
    return math.sqrt(-2.0 * math.log(u1)) * math.cos(2.0 * math.pi * u2)


def sample_gamma(shape: float, rng: random.Random, scale: float = 1.0) -> float:
    """Marsaglia-Tsang gamma sampler.

    Beta(a, b) is then Gamma(a, 1) / (Gamma(a, 1) + Gamma(b, 1)), which lets us
    draw exact Beta samples without SciPy.
    """
    if shape <= 0.0:
        raise ValueError(f"gamma shape must be > 0, got {shape}")

    if shape < 1.0:
        # Boost: Gamma(a) = Gamma(a + 1) * U^(1/a)
        u = rng.random()
        while u <= _EPS:
            u = rng.random()
        return sample_gamma(shape + 1.0, rng, scale) * (u ** (1.0 / shape))

    d = shape - 1.0 / 3.0
    c = 1.0 / math.sqrt(9.0 * d)
    while True:
        x = _randn(rng)
        v = 1.0 + c * x
        if v <= 0.0:
            continue
        v = v * v * v
        u = rng.random()
        if u < 1.0 - 0.0331 * (x ** 4):
            return d * v * scale
        if math.log(u) < 0.5 * x * x + d * (1.0 - v + math.log(v)):
            return d * v * scale


def sample_beta(alpha: float, beta: float, rng: random.Random) -> float:
    """Draw one sample from Beta(alpha, beta)."""
    x = sample_gamma(alpha, rng)
    y = sample_gamma(beta, rng)
    total = x + y
    if total <= _EPS:
        return alpha / (alpha + beta)
    return x / total


def quantile(sorted_or_unsorted: Sequence[float], q: float) -> float:
    """Linear-interpolated quantile. Accepts any sequence; sorts internally."""
    if not sorted_or_unsorted:
        raise ValueError("quantile of empty sequence")
    s = sorted(sorted_or_unsorted)
    if len(s) == 1:
        return s[0]
    pos = q * (len(s) - 1)
    lo = int(math.floor(pos))
    hi = int(math.ceil(pos))
    if lo == hi:
        return s[lo]
    frac = pos - lo
    return s[lo] * (1.0 - frac) + s[hi] * frac


def wilson_interval(successes: float, trials: float, z: float = 1.96) -> Tuple[float, float]:
    """Wilson score interval for a binomial proportion.

    Used as a sanity check alongside the Beta credible interval. The Wilson
    bound is the standard frequentist answer to "this rate looks good but the
    sample is tiny", and it never escapes [0, 1] the way the normal
    approximation does.
    """
    if trials <= 0:
        return 0.0, 1.0
    p = successes / trials
    denom = 1.0 + z * z / trials
    center = p + z * z / (2.0 * trials)
    margin = z * math.sqrt(p * (1.0 - p) / trials + z * z / (4.0 * trials * trials))
    lo = (center - margin) / denom
    hi = (center + margin) / denom
    return max(0.0, min(1.0, lo)), max(0.0, min(1.0, hi))


@dataclass
class BetaPosterior:
    """A Beta(alpha, beta) belief over a bounded rate."""

    alpha: float
    beta: float

    def __post_init__(self) -> None:
        if self.alpha <= 0.0 or self.beta <= 0.0:
            raise ValueError("Beta parameters must be positive")

    @property
    def mean(self) -> float:
        return self.alpha / (self.alpha + self.beta)

    @property
    def variance(self) -> float:
        s = self.alpha + self.beta
        return (self.alpha * self.beta) / (s * s * (s + 1.0))

    @property
    def std(self) -> float:
        return math.sqrt(self.variance)

    @property
    def concentration(self) -> float:
        """alpha + beta: how many pseudo-observations this belief carries."""
        return self.alpha + self.beta

    def sample(self, rng: random.Random) -> float:
        return sample_beta(self.alpha, self.beta, rng)

    def credible_interval(
        self,
        rng: random.Random,
        q_lo: float = 0.05,
        q_hi: float = 0.95,
        n: int = 2000,
    ) -> Tuple[float, float]:
        draws = [self.sample(rng) for _ in range(n)]
        return quantile(draws, q_lo), quantile(draws, q_hi)


def update(prior: BetaPosterior, successes: float, trials: float) -> BetaPosterior:
    """Conjugate Beta-Bernoulli update."""
    successes = max(0.0, min(successes, trials))
    failures = max(0.0, trials - successes)
    return BetaPosterior(prior.alpha + successes, prior.beta + failures)


def blend_with_simulation(
    base: BetaPosterior,
    simulated_rate: float,
    kappa: float,
) -> BetaPosterior:
    """Fold a simulated rate into a base prior as `kappa` pseudo-observations.

    This is how MiroFish enters the model. A simulation is weak evidence about
    real behaviour, so `kappa` should be small relative to the volume of real
    engagement data. Calibration (`mirofish_bridge.Calibrator`) is what sets it.
    """
    rate = max(0.0, min(1.0, simulated_rate))
    concentration = base.concentration + kappa
    mean = (base.alpha + kappa * rate) / concentration
    return BetaPosterior(mean * concentration, (1.0 - mean) * concentration)

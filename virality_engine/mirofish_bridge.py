"""MiroFish bridge: turn a simulation into a calibrated prior.

MiroFish simulates how agents react to a track. That is genuinely useful for
cold start, because at upload time we have no real engagement data and MiroFish
is the only signal we have. But a simulation is a *model of* behaviour, not
behaviour, so its output must never be trusted as if it were real impressions.

The discipline that makes this safe:

1. MiroFish output enters as a PRIOR, never as an observation. It is folded in
   with a small `kappa` (pseudo-observation count), so a handful of real
   impressions overrides it quickly.
2. `kappa` is not guessed. It is fitted by comparing simulated rates against
   realised rates on tracks that have already run, which is what `Calibrator`
   does.
3. MiroFish is only consulted for cold tracks. For a track with 50k real
   impressions, real data dominates and a simulation is wasted compute.

Grounding in the actual MiroFish code
-------------------------------------
The upstream pipeline (see `oasis_profile_generator.py`,
`simulation_config_generator.py`, `report_agent.py`) produces, per run:

  - `reddit_profiles.json` / `twitter_profiles.csv` : the agent personas
  - `report/verdict.json`                           : prediction, confidence,
                                                      key_dynamics, signals

`verdict.json` is the machine-readable output and the correct thing to parse
here. Personas are *inputs* to the simulation, not outputs to score tracks
with. It is worth being explicit about that, because "use the personas to log
into the platform" is a tempting misreading of what MiroFish produces: personas
are simulated characters with a `bio` and a `persona` string, and they carry no
credentials and drive no browser.
"""

from __future__ import annotations

import json
import math
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Sequence, Tuple

from .priors import BetaPosterior, blend_with_simulation

# --------------------------------------------------------------------------
# Reading MiroFish run artifacts
# --------------------------------------------------------------------------


@dataclass
class MiroFishVerdict:
    """Parsed subset of a MiroFish `report/verdict.json`."""

    prediction: str
    confidence: float                  # MiroFish's own [0,1] confidence
    simulated_rate: Optional[float]    # our mapping into an engagement rate
    key_dynamics: List[str]
    signals: List[str]
    raw: Dict[str, object]


# Mapping from MiroFish's qualitative prediction to a target engagement rate.
# These anchors are placeholders to be refitted on your own catalogue; they
# encode only the ordering, which is the part that is safe to assume a priori.
PREDICTION_RATE_ANCHORS: Dict[str, float] = {
    "breakout": 0.30,
    "viral": 0.30,
    "strong": 0.20,
    "promising": 0.20,
    "moderate": 0.12,
    "mixed": 0.12,
    "niche": 0.08,
    "weak": 0.05,
    "flop": 0.03,
}


def _coerce_float(value: object, default: float = 0.0) -> float:
    try:
        return float(value)  # type: ignore[arg-type]
    except (TypeError, ValueError):
        return default


def _extract_prediction_label(payload: Dict[str, object]) -> str:
    """Pull a qualitative label out of whichever field MiroFish populated."""
    for key in ("prediction", "verdict", "label", "outcome", "category"):
        value = payload.get(key)
        if isinstance(value, str) and value.strip():
            return value.strip().lower()
        if isinstance(value, dict):
            for sub in ("label", "value", "category", "prediction"):
                sub_value = value.get(sub)
                if isinstance(sub_value, str) and sub_value.strip():
                    return sub_value.strip().lower()
    return "moderate"


def _label_to_rate(label: str) -> float:
    """Map a qualitative label to a rate by its *last* matching anchor.

    Position, not length, is the right rule here. In English the head word of
    these phrases carries the severity and comes last: "moderately strong" is
    strong, "very weak" is weak, "slightly promising" is promising. Matching by
    longest anchor instead picks "moderate" out of "moderately strong", which
    is simply the wrong reading.
    """
    best_rate = PREDICTION_RATE_ANCHORS["moderate"]
    best_pos = -1
    for anchor, rate in PREDICTION_RATE_ANCHORS.items():
        pos = label.rfind(anchor)
        if pos > best_pos:
            best_pos = pos
            best_rate = rate
    return best_rate


def parse_verdict(path: Path) -> MiroFishVerdict:
    """Read a MiroFish `verdict.json` and map it to a rate we can use.

    If MiroFish emitted an explicit numeric rate we use it directly; otherwise
    we fall back to the qualitative label anchors. Confidence is applied as a
    pull toward the neutral prior, so a low-confidence simulation barely moves
    the belief.
    """
    payload = json.loads(Path(path).read_text(encoding="utf-8"))

    label = _extract_prediction_label(payload)
    confidence = _coerce_float(
        payload.get("confidence", payload.get("score", 0.5)), 0.5
    )
    confidence = max(0.0, min(1.0, confidence))

    explicit = None
    for key in ("rate", "predicted_rate", "engagement_rate"):
        if key in payload:
            explicit = _coerce_float(payload[key], default=float("nan"))
            if not math.isnan(explicit):
                break
    if explicit is None or math.isnan(explicit):
        rate = _label_to_rate(label)
    else:
        rate = max(0.0, min(1.0, explicit))

    # Shrink toward neutral by confidence: a 50%-confident simulation should not
    # move the prior as far as a 95%-confident one.
    neutral = 0.10
    rate = neutral + (rate - neutral) * confidence

    def _as_list(value: object) -> List[str]:
        if isinstance(value, list):
            return [str(v) for v in value]
        if isinstance(value, str):
            return [value]
        return []

    return MiroFishVerdict(
        prediction=label,
        confidence=confidence,
        simulated_rate=rate,
        key_dynamics=_as_list(payload.get("key_dynamics")),
        signals=_as_list(payload.get("signals")),
        raw=payload,
    )


# --------------------------------------------------------------------------
# Calibration: how much to trust MiroFish
# --------------------------------------------------------------------------


@dataclass
class CalibrationResult:
    kappa: float
    n: int
    simulated_mean: float
    realised_mean: float
    bias: float            # simulated - realised
    mae: float
    pearson_r: float


def _pearson(xs: Sequence[float], ys: Sequence[float]) -> float:
    n = len(xs)
    if n < 2:
        return 0.0
    mx = sum(xs) / n
    my = sum(ys) / n
    num = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    dx = math.sqrt(sum((x - mx) ** 2 for x in xs))
    dy = math.sqrt(sum((y - my) ** 2 for y in ys))
    if dx <= 1e-12 or dy <= 1e-12:
        return 0.0
    return num / (dx * dy)


def calibrate(
    simulated: Sequence[float],
    realised: Sequence[float],
    *,
    kappa_max: float = 40.0,
) -> CalibrationResult:
    """Fit `kappa` from simulated vs. realised rates on already-run tracks.

    kappa = kappa_max * max(0, pearson_r) * (1 - normalised_bias)

    The reasoning: MiroFish earns the right to influence the prior to the
    extent that its predictions *rank* tracks correctly (correlation) and are
    *unbiased* in level. A simulation that ranks well but is systematically
    optimistic gets a discount, because a biased prior pushes every track in
    the same direction and does no useful work.

    With pearson_r = 0.6 and no bias, kappa = 40 * 0.6 = 24. Against
    PRIOR_STRENGTH = 8 that is a strong but not overwhelming prior; 500 real
    impressions still dominate it. With r = 0.1, kappa = 4, and the simulation
    is nearly ignored.
    """
    if len(simulated) != len(realised):
        raise ValueError("simulated and realised must be the same length")
    n = len(simulated)
    if n == 0:
        return CalibrationResult(0.0, 0, 0.0, 0.0, 0.0, 0.0, 0.0)

    sim_mean = sum(simulated) / n
    real_mean = sum(realised) / n
    bias = sim_mean - real_mean
    mae = sum(abs(s - r) for s, r in zip(simulated, realised)) / n
    r = _pearson(list(simulated), list(realised))

    scale = max(1e-6, real_mean) if real_mean > 0 else 1.0
    normalised_bias = min(1.0, abs(bias) / scale)
    kappa = kappa_max * max(0.0, r) * (1.0 - normalised_bias)

    return CalibrationResult(
        kappa=kappa,
        n=n,
        simulated_mean=sim_mean,
        realised_mean=real_mean,
        bias=bias,
        mae=mae,
        pearson_r=r,
    )


class Calibrator:
    """Accumulates (simulated, realised) pairs and exposes the current kappa.

    Wire this up so that every promoted track eventually reports its realised
    rate back here. kappa then self-corrects as the catalogue grows, which
    removes the need to hand-tune it.
    """

    def __init__(self, kappa_max: float = 40.0) -> None:
        self._simulated: List[float] = []
        self._realised: List[float] = []
        self.kappa_max = kappa_max

    def record(self, simulated_rate: float, realised_rate: float) -> None:
        self._simulated.append(float(simulated_rate))
        self._realised.append(float(realised_rate))

    def result(self) -> CalibrationResult:
        return calibrate(self._simulated, self._realised, kappa_max=self.kappa_max)

    @property
    def kappa(self) -> float:
        return self.result().kappa


# --------------------------------------------------------------------------
# Integration surface
# --------------------------------------------------------------------------


def mirofish_prior_adjustment(
    base: BetaPosterior,
    verdict_path: Optional[Path],
    calibrator: Calibrator,
    *,
    only_for_cold: bool = True,
    observed_impressions: float = 0.0,
    cold_threshold: float = 500.0,
) -> BetaPosterior:
    """Apply a MiroFish verdict to a base prior, if it is worth applying.

    Returns `base` unchanged when:
      - no verdict is available, or
      - the track is already warm and `only_for_cold` is set, or
      - the calibrator says kappa is ~0 (MiroFish is not predicting usefully).

    The guard on observed impressions is the important one operationally: it
    stops you paying for simulations on tracks that already have real data.
    """
    if verdict_path is None or not Path(verdict_path).exists():
        return base
    if only_for_cold and observed_impressions >= cold_threshold:
        return base

    kappa = calibrator.kappa
    if kappa <= 1e-6:
        return base

    verdict = parse_verdict(verdict_path)
    if verdict.simulated_rate is None:
        return base
    return blend_with_simulation(base, verdict.simulated_rate, kappa)

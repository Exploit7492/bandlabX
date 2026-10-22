"""Music virality engine: cold-start promotion allocation.

Public surface:
    priors            - Beta/Bernoulli probability primitives
    engine            - prior model, scoring, allocation, offline simulator
    mirofish_bridge   - calibrated use of MiroFish simulations as priors
"""

from .engine import (
    ENGAGEMENT_WEIGHTS,
    GATE_Q,
    PRIOR_Q,
    MIN_IMPRESSIONS_FOR_RATE,
    NEGATIVE_WEIGHTS,
    PRIOR_STRENGTH,
    Allocation,
    AllocationPolicy,
    SCORE_WEIGHTS,
    SimulatedTrack,
    TrackFeatures,
    TrackObservation,
    TrackState,
    allocate,
    apply_observation,
    build_prior,
    clears_gate,
    cold_start_rate,
    engagement_rate,
    gate_floor,
    fatigue_penalty,
    promotion_lift,
    quality_signal,
    shrunk_completion,
    simulate_rounds,
    virality_score,
)
from .mirofish_bridge import (
    CalibrationResult,
    Calibrator,
    MiroFishVerdict,
    calibrate,
    mirofish_prior_adjustment,
    parse_verdict,
)
from .priors import BetaPosterior, blend_with_simulation, update, wilson_interval

__all__ = [
    "ENGAGEMENT_WEIGHTS",
    "GATE_Q",
    "PRIOR_Q",
    "MIN_IMPRESSIONS_FOR_RATE",
    "NEGATIVE_WEIGHTS",
    "PRIOR_STRENGTH",
    "Allocation",
    "AllocationPolicy",
    "SCORE_WEIGHTS",
    "SimulatedTrack",
    "TrackFeatures",
    "TrackObservation",
    "TrackState",
    "allocate",
    "apply_observation",
    "build_prior",
    "clears_gate",
    "cold_start_rate",
    "engagement_rate",
    "gate_floor",
    "fatigue_penalty",
    "promotion_lift",
    "quality_signal",
    "shrunk_completion",
    "simulate_rounds",
    "virality_score",
    "CalibrationResult",
    "Calibrator",
    "MiroFishVerdict",
    "calibrate",
    "mirofish_prior_adjustment",
    "parse_verdict",
    "BetaPosterior",
    "blend_with_simulation",
    "update",
    "wilson_interval",
]

__version__ = "0.1.0"

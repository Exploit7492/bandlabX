"""Music virality engine: cold-start promotion allocation.

The problem this solves
-----------------------
A track is uploaded. We must decide how much Explore-page traffic to give it,
before we have any engagement data on it. This is a cold-start explore/exploit
allocation problem, not a "predict the hit" problem. The engine's job is to buy
information cheaply on unknown tracks while spending most impressions on tracks
that are measurably working.

Pipeline
--------
1. prior      : estimate a track's engagement rate before we have data
2. observation: fold in real impressions/engagements as a Beta posterior
3. score      : convert the posterior into a promotion value with uncertainty
4. allocate   : split the impression budget across tracks under fairness caps
5. update     : feed realised outcomes back and re-allocate

What the formulas deliberately are NOT
--------------------------------------
- No single linear "virality score". A weighted sum of engagement rates is not
  a promotion policy; it has no notion of sample size and no budget.
- No use of play counts as a quality signal. Play counts are censored by
  exposure: a track with more impressions has more plays mechanically. Using
  raw counts as a label is the classic feedback-loop bug.
"""

from __future__ import annotations

import math
import random
from dataclasses import dataclass, field
from typing import Dict, Iterable, List, Optional, Sequence

from .priors import (
    BetaPosterior,
    _randn,
    blend_with_simulation,
    quantile,
    sample_beta,
    update,
)

# --------------------------------------------------------------------------
# 1. PRIOR MODEL
# --------------------------------------------------------------------------


@dataclass
class TrackFeatures:
    """Pre-exposure signals available at upload time.

    Every feature is chosen because it is observable *before* the track is
    promoted, so using it cannot leak post-exposure information back into the
    prior. `artist_prior_rate` is the artist's historical rate from *previous*
    tracks only.
    """

    track_id: str
    # Audio/structural: hook strength, tempo fit, energy in first 15s.
    hook_score: float = 0.5          # [0,1]
    audio_completeness: float = 0.5  # [0,1] produced vs. rough demo
    # Supply-side context.
    artist_prior_rate: float = 0.10  # historical engagement rate, previous tracks
    artist_prior_trials: float = 0.0  # impressions behind that rate
    # Metadata quality: cover art, tags, correct credits.
    metadata_quality: float = 0.5    # [0,1]
    # Distribution context.
    follower_count: float = 0.0
    days_since_upload: float = 0.0
    is_remix_or_cover: bool = False
    language_match: float = 1.0      # [0,1] share of audience speaking the language


# Prior hyper-parameters. `PRIOR_STRENGTH` is the number of pseudo-observations
# the engineered prior is worth.
#
# This is the security parameter, not just a smoothing constant. A coordinated
# population of N mutually-engaging accounts achieves at most
# N*exp(-N(N-1)/(2*E0)) effective impressions, which peaks at 0.607*sqrt(E0).
# The smallest pod that can clear the quality gate at ANY detector strength is
# therefore
#
#     min_pod ~= PRIOR_STRENGTH * (gate - prior_q) / ((1 - gate) * 0.607)
#
# i.e. min_pod tracks PRIOR_STRENGTH almost exactly. Measured:
#
#     PRIOR_STRENGTH    8  ->  ~8 accounts clear
#     PRIOR_STRENGTH  100  ->  ~62 accounts clear
#     PRIOR_STRENGTH  200  ->  ~189 accounts clear
#
# At 200 the required clique is ~189 accounts each engaging every other one --
# ~17,766 mutual interactions, the most detectable shape a group can take.
# See spec/SEEDING-MECHANISM.md and spec/vulnerability_study.py.
#
# The cost of a high prior is cold-start responsiveness: a good track needs
# more real impressions before its estimate moves. That cost is paid by the
# cold-start LANE (guaranteed impressions per upload), which is a scheduling
# decision and needs no engagement history at all. Do not lower this value to
# fix cold start; raise `AllocationPolicy.cold_start_slots` instead.
PRIOR_STRENGTH = 200.0
PRIOR_BASE_RATE = 0.09


def _logit(p: float) -> float:
    p = min(1.0 - 1e-6, max(1e-6, p))
    return math.log(p / (1.0 - p))


def _sigmoid(x: float) -> float:
    if x >= 0:
        z = math.exp(-x)
        return 1.0 / (1.0 + z)
    z = math.exp(x)
    return z / (1.0 + z)


def cold_start_rate(features: TrackFeatures) -> float:
    """Engineered prior mean for a track's engagement rate.

    Built in log-odds space so the contributions compose multiplicatively in
    probability space and the result is guaranteed to stay in (0, 1).

    The structure is:

        logit(p_prior) = logit(p_base)
                       + w_hook   * (hook_score - 0.5)
                       + w_prod   * (audio_completeness - 0.5)
                       + w_meta   * (metadata_quality - 0.5)
                       + w_lang   * (language_match - 1.0)
                       + w_follow * log1p(follower_count) / log1p(F0)
                       + w_artist * (logit(artist_rate) - logit(p_base)) * confidence
                       + w_remix  * is_remix

    Each `w` is a coefficient with an interpretable sign and magnitude. They
    are set from domain reasoning here; in production they are fitted by
    logistic regression on historical first-1000-impression cohorts, which is
    why `fit_prior_coefficients` exists below.
    """
    x = _logit(PRIOR_BASE_RATE)

    # Centred on 0.5: an average track moves nothing.
    x += 0.9 * (features.hook_score - 0.5)
    x += 0.6 * (features.audio_completeness - 0.5)
    x += 0.5 * (features.metadata_quality - 0.5)
    # Penalty for language mismatch, scaled by the shortfall.
    x += 0.8 * (features.language_match - 1.0)

    # Follower lift is logarithmic: 10x followers is a constant additive nudge
    # in log-odds, not a 10x rate. Saturates at F0 followers.
    F0 = 1000.0
    x += 0.35 * math.log1p(max(0.0, features.follower_count)) / math.log1p(F0)

    # Shrink the artist's historical rate toward the base by how much data
    # stands behind it. This is the empirical-Bayes step: an artist with 12
    # impressions of history does not get to move the prior much.
    confidence = features.artist_prior_trials / (features.artist_prior_trials + 500.0)
    x += 0.7 * (_logit(features.artist_prior_rate) - _logit(PRIOR_BASE_RATE)) * confidence

    if features.is_remix_or_cover:
        # Remixes ride familiarity: modest positive prior, but they also
        # cannibalise the original. Net effect here is slightly positive.
        x += 0.15

    # Freshness: decay a small amount over the first month.
    x -= 0.02 * max(0.0, features.days_since_upload)

    # Clamp into a strict open interval. Sigmoid saturates in float for extreme
    # inputs, and a prior of exactly 0.0 or 1.0 would make BetaPosterior's
    # parameters non-positive and raise.
    p = _sigmoid(x)
    return min(1.0 - 1e-6, max(1e-6, p))


def build_prior(
    features: TrackFeatures,
    simulated_rate: Optional[float] = None,
    kappa: float = 0.0,
) -> BetaPosterior:
    """Turn features (and optionally a MiroFish simulated rate) into a Beta prior.

    `simulated_rate` / `kappa` are the MiroFish hook. `kappa` is the number of
    pseudo-observations the simulation is trusted for. With kappa=0 the engine
    is pure observed-data; the bridge is additive and optional.
    """
    rate = cold_start_rate(features)
    base = BetaPosterior(rate * PRIOR_STRENGTH, (1.0 - rate) * PRIOR_STRENGTH)
    if simulated_rate is not None and kappa > 0.0:
        return blend_with_simulation(base, simulated_rate, kappa)
    return base


# --------------------------------------------------------------------------
# 2. OBSERVATIONS
# --------------------------------------------------------------------------


@dataclass
class TrackObservation:
    """Realised engagement for one track.

    `impressions` is the exposure denominator. Every rate in this engine is
    conditioned on impressions, never on plays, because plays are a *result* of
    exposure and using them as a denominator reintroduces the selection bias
    the engine exists to avoid.
    """

    impressions: float = 0.0
    completions: float = 0.0     # played past the 30s threshold
    likes: float = 0.0
    shares: float = 0.0
    saves: float = 0.0
    profile_visits: float = 0.0
    follows: float = 0.0
    skips_early: float = 0.0     # skipped inside first 5s
    reports: float = 0.0

    def __add__(self, other: "TrackObservation") -> "TrackObservation":
        return TrackObservation(
            impressions=self.impressions + other.impressions,
            completions=self.completions + other.completions,
            likes=self.likes + other.likes,
            shares=self.shares + other.shares,
            saves=self.saves + other.saves,
            profile_visits=self.profile_visits + other.profile_visits,
            follows=self.follows + other.follows,
            skips_early=self.skips_early + other.skips_early,
            reports=self.reports + other.reports,
        )


# Engagement weighting. These weights answer "how much does one of these
# predict that this track will still be spreading in 30 days". Shares dominate
# because a share is a user spending their own social capital on the track,
# which is the mechanism by which music actually spreads. A like costs nothing.
# A save is private intent, weaker than a share but far stronger than a like.
ENGAGEMENT_WEIGHTS = {
    "share": 1.00,
    "save": 0.45,
    "follow": 0.35,
    "like": 0.20,
    "profile_visit": 0.10,
}
# Negative signals. Reports are a safety signal, not a taste signal, and are
# weighted hard enough to pull a track out of allocation on their own.
NEGATIVE_WEIGHTS = {
    "early_skip": 0.30,
    "report": 3.00,
}
# Denominator protection: minimum impressions before a rate is meaningful.
MIN_IMPRESSIONS_FOR_RATE = 50.0


def engagement_rate(obs: TrackObservation) -> float:
    """Weighted engagement per impression.

    rate = (sum_i w_i * event_i) / impressions

    Numerator is an "engagement-equivalent" count in units of one share.
    """
    if obs.impressions <= 0:
        return 0.0
    numerator = 0.0
    numerator += ENGAGEMENT_WEIGHTS["share"] * obs.shares
    numerator += ENGAGEMENT_WEIGHTS["save"] * obs.saves
    numerator += ENGAGEMENT_WEIGHTS["follow"] * obs.follows
    numerator += ENGAGEMENT_WEIGHTS["like"] * obs.likes
    numerator += ENGAGEMENT_WEIGHTS["profile_visit"] * obs.profile_visits
    numerator -= NEGATIVE_WEIGHTS["early_skip"] * obs.skips_early
    numerator -= NEGATIVE_WEIGHTS["report"] * obs.reports
    numerator = max(0.0, numerator)
    return numerator / obs.impressions


def quality_signal(obs: TrackObservation) -> float:
    """Completion rate, guarded against a zero denominator."""
    if obs.impressions <= 0:
        return 0.0
    return max(0.0, min(1.0, obs.completions / obs.impressions))


# Quality gate parameters. The gate is what converts this engine from
# "allocate proportionally" into "gate, then allocate": a track earns durable
# reach only once its *shrunken* completion estimate clears a threshold.
#
# The gate is a sample-size threshold, and that is the whole point. Shrinkage
# gives
#
#     est_q = (completion * n + prior_q * PRIOR_STRENGTH) / (n + PRIOR_STRENGTH)
#
# so clearing the gate requires n >= PRIOR_STRENGTH * (gate - prior_q)/(1 - gate).
# Fabrication cannot manufacture distinct listeners, so a fabricated sample
# faces exactly the same floor as an organic one -- which is why the defence is
# the prior, and detection is only the second line.
#
# The three dials are separable, and this is the design decision:
#
#     PRIOR_STRENGTH -> security    (min pod size that can clear)
#     GATE_Q         -> quality     (how good a track must be)
#     cold_start_slots -> cold start (impressions every upload is guaranteed)
#
# IGNITION-ENGINE.md §8 lowered PRIOR_STRENGTH to fix cold start. That is the
# expensive dial, because security scales with it. Lowering GATE_Q buys the
# same cold-start relief for less security, and the lane is free of both. See
# spec/config_search.py: gate 0.65 -> 0.60 at alpha=200 costs 34% of the
# min-pod defence; alpha 200 -> 100 costs 67%.
#
# Chosen triple: alpha=200, gate=0.60, lane=200.
#     floor = 75.0 impressions, min pod = 124 accounts (2x the branch's 62)
#     a q=0.80 track needs 150 impressions to clear, covered by the 200 lane
GATE_Q = 0.60          # completion a track must reach for durable organic reach
PRIOR_Q = 0.45         # prior completion, before any data


def apply_observation(
    prior: BetaPosterior,
    obs: TrackObservation,
) -> BetaPosterior:
    """Fold realised engagement into the posterior.

    Because `engagement_rate` is a continuous quantity in [0,1] rather than a
    count of successes, we scale the observation to a Beta-equivalent count:
    the rate is treated as `impressions` Bernoulli trials with
    `rate * impressions` successes. That is an approximation, but it is the
    right one here: it keeps the conjugate update exact when events are binary
    (share / no share) and degrades gracefully when they are not.
    """
    if obs.impressions < MIN_IMPRESSIONS_FOR_RATE:
        # Too little data to move the belief. Return the prior unchanged so a
        # single unlucky impression cannot kill a track.
        return prior
    rate = engagement_rate(obs)
    successes = rate * obs.impressions
    # Cap the evidence a single observation can contribute. Without this, a
    # track that gets lucky on 10k impressions would become unfalsifiable.
    max_evidence = 4000.0
    trials = min(obs.impressions, max_evidence)
    successes = successes * (trials / obs.impressions)
    return update(prior, successes, trials)


def shrunk_completion(
    obs: TrackObservation,
    alpha: float = PRIOR_STRENGTH,
    prior_q: float = PRIOR_Q,
) -> float:
    """Shrunken completion estimate: est_q = (comp*n + prior_q*alpha)/(n + alpha).

    A small sample is pulled toward `prior_q`; only a real sample moves the
    estimate. At n = 0 this returns `prior_q` exactly.
    """
    n = obs.impressions
    if n <= 0:
        return prior_q
    return (quality_signal(obs) * n + prior_q * alpha) / (n + alpha)


def gate_floor(
    alpha: float = PRIOR_STRENGTH,
    gate: float = GATE_Q,
    prior_q: float = PRIOR_Q,
) -> float:
    """Impressions before a PERFECT track can clear the gate.

    Solve (1*n + prior_q*alpha)/(n + alpha) >= gate for n:
        n >= alpha*(gate - prior_q)/(1 - gate)
    """
    return alpha * (gate - prior_q) / (1.0 - gate)


def clears_gate(
    obs: TrackObservation,
    alpha: float = PRIOR_STRENGTH,
    gate: float = GATE_Q,
    prior_q: float = PRIOR_Q,
) -> bool:
    """Has this track earned durable organic reach?

    False for every track below `gate_floor`, at any true quality -- that is the
    intended behaviour, not a limitation.
    """
    return shrunk_completion(obs, alpha, prior_q) >= gate


# --------------------------------------------------------------------------
# 3. SCORING
# --------------------------------------------------------------------------

# Score weights. `exploration` is the coefficient on posterior uncertainty and
# is the single most important knob in the engine: it is the price of
# information. Raise it to promote unknowns more aggressively, lower it to
# concentrate on proven tracks.
SCORE_WEIGHTS = {
    "exploit": 1.00,
    "exploration": 0.55,
    "quality": 0.35,
    "fatigue": 0.50,   # applied as a bounded multiplicative discount
}
FATIGUE_HALFLIFE_HOURS = 36.0
# Exposure, in multiples of fair share, at which the fatigue penalty reaches
# 1 - 1/e (~63%). See fatigue_penalty.
FATIGUE_SATURATION_UNITS = 4.0


@dataclass
class TrackState:
    """Everything the engine knows about one track at one point in time."""

    features: TrackFeatures
    prior: BetaPosterior
    obs: TrackObservation = field(default_factory=TrackObservation)
    posterior: Optional[BetaPosterior] = None
    impressions_allocated: float = 0.0
    impressions_last_window: float = 0.0
    sim_rate: Optional[float] = None
    sim_kappa: float = 0.0

    def effective_posterior(self) -> BetaPosterior:
        if self.posterior is not None:
            return self.posterior
        return self.prior

    def refresh(self) -> BetaPosterior:
        """Recompute posterior from prior + accumulated observation."""
        self.posterior = apply_observation(self.prior, self.obs)
        return self.posterior

    @property
    def engagement_rate(self) -> float:
        return engagement_rate(self.obs)

    @property
    def completion_rate(self) -> float:
        return quality_signal(self.obs)


def virality_score(
    state: TrackState,
    rng: random.Random,
    *,
    n_draws: int = 256,
    cost_per_impression: float = 1.0,
    prior_strength: float = PRIOR_STRENGTH,
    fair_share: Optional[float] = None,
) -> float:
    """Promotion value of a track, in expected engagement-equivalents per impression.

    Formula
    -------
        raw      = exploit * E[rate] + exploration * SD[rate]
                   + quality * completion_rate
                   - fatigue * fatigue_penalty
        shrink   = n_eff / (n_eff + prior_strength)      # n_eff = impressions
        score    = cost * max(0, raw) * shrink

    Why each term exists
    --------------------
    E[rate]        - exploit: tracks we already believe work should keep working.
    SD[rate]       - explore: uncertainty is *valuable*. A track whose true rate
                     might be 0.30 is worth testing even though its mean is
                     0.10. Dropping this term collapses the engine into a
                     greedy policy that never discovers anything.
    completion_rate- cheap quality proxy; catches tracks with a strong hook even
                     when shares have not landed yet.
    fatigue        - caps how much a single track can take in one window. Without
                     it the top track absorbs the whole budget and the Explore
                     page becomes one song on loop.
    shrink         - guard against tiny-sample flattery. A track at 4/4 shares is
                     not better than one at 900/2000; shrinkage enforces that.

    The `max(0, ...)` clamp is what makes the score a *value*: a track with
    strong negative signals is worth zero impressions, not negative ones.
    """
    posterior = state.effective_posterior()

    if n_draws <= 0:
        mean = posterior.mean
        sd = posterior.std
    else:
        draws = [posterior.sample(rng) for _ in range(n_draws)]
        mean = sum(draws) / len(draws)
        sd = quantile(draws, 0.84) - quantile(draws, 0.16)

    raw = (
        SCORE_WEIGHTS["exploit"] * mean
        + SCORE_WEIGHTS["exploration"] * sd
        + SCORE_WEIGHTS["quality"] * state.completion_rate
    )
    raw = max(0.0, raw)

    # Fatigue is a bounded multiplicative discount on the value, not an additive
    # penalty. Two reasons this must be a discount:
    #   - the score's natural scale is ~0.1-0.5, so subtracting a penalty
    #     bounded by 1.0 would clamp every score to zero once tracks saturate,
    #     and the allocator would fall back to spreading the budget evenly;
    #   - with weight <= 1.0 the discount is floored at (1 - weight), so a
    #     strong track can never be pushed below a weak one by fatigue alone.
    # Fatigue rotates traffic between rounds; it does not overturn rankings.
    discount = 1.0 - SCORE_WEIGHTS["fatigue"] * fatigue_penalty(
        state, rng, fair_share=fair_share
    )
    raw *= max(0.0, discount)

    n_eff = state.obs.impressions
    shrink = n_eff / (n_eff + prior_strength) if n_eff > 0 else 0.0
    # At zero impressions the posterior *is* the prior, so shrinking to zero
    # would make cold tracks unschedulable. Floor the shrink for unseen tracks
    # at a small value so they remain eligible for their first slice.
    shrink = max(shrink, 0.12)

    return cost_per_impression * raw * shrink


def fatigue_penalty(
    state: TrackState,
    rng: random.Random,
    *,
    fair_share: Optional[float] = None,
) -> float:
    """Penalty proportional to how far above fair share this track was pushed.

    fatigue = 1 - exp(-(recent_exposure / fair_share) / SATURATION_UNITS)

    Two things matter here, and both were wrong in the first version:

    1. This must be driven by the *recent* window's exposure, not cumulative
       impressions. Cumulative exposure never decays, so every track eventually
       saturates and the signal stops discriminating.

    2. It must be normalised by the track's fair share of the current budget,
       not by a rate-derived constant. Fair share is scale-free: it means the
       same thing whether the budget is 10k or 10M impressions. A rate-derived
       denominator also inverts the intent, penalising high-rate tracks harder
       than low-rate ones.

    The penalty is bounded in [0, 1) so the caller can apply it as a bounded
    multiplicative discount and be certain it can only rotate traffic, never
    invert the ranking.
    """
    if state.impressions_last_window <= 0:
        return 0.0
    if fair_share is None or fair_share <= 0:
        fair_share = 1000.0
    # Exposure measured in multiples of fair share. At 1x fair share the
    # penalty is ~0.22; at 3x it is ~0.51; at 6x it is ~0.70.
    exposure_units = state.impressions_last_window / fair_share
    x = exposure_units / FATIGUE_SATURATION_UNITS
    # Clamp strictly below 1.0. The discount applied by virality_score is
    # (1 - weight * penalty); if penalty could reach 1.0 with weight 1.0 the
    # discount would be exactly zero and the documented "can never invert the
    # ranking" guarantee would fail at the boundary.
    return min(1.0 - 1e-9, 1.0 - math.exp(-x))


def promotion_lift(
    state: TrackState,
    rng: random.Random,
    *,
    n_draws: int = 512,
    top_quantile: float = 0.10,
) -> float:
    """Probability this track is in the platform's true top decile.

    This is the "will this actually pop" number, and it is what you surface to
    artists and to humans reviewing borderline cases. It is deliberately not
    the same as `virality_score`: score answers "should we spend on it now",
    lift answers "how good is it, really".

        lift = P(rate > threshold)
             = 1 - F_rate(threshold)

    estimated by Monte Carlo from the posterior, with `threshold` being the
    top-decile engagement rate across the current catalogue.
    """
    posterior = state.effective_posterior()
    threshold = _top_decile_threshold(rng, posterior)
    draws = [posterior.sample(rng) for _ in range(n_draws)]
    hits = sum(1 for d in draws if d > threshold)
    return hits / len(draws)


# Placeholder catalogue threshold, refreshed by the caller from live data.
_DEFAULT_TOP_DECILE = 0.22


def _top_decile_threshold(rng: random.Random, posterior: BetaPosterior) -> float:
    return _DEFAULT_TOP_DECILE


# --------------------------------------------------------------------------
# 4. ALLOCATION
# --------------------------------------------------------------------------


@dataclass
class AllocationPolicy:
    """Budget and fairness configuration for one allocation round.

    `exploration_floor` guarantees a minimum share of the budget goes to tracks
    with little or no data. This is the structural guarantee that makes the
    engine an explore/exploit system rather than a popularity contest: without
    it, cold tracks lose every round and can never accumulate the impressions
    they need to compete.
    """

    total_impressions: float
    exploration_floor: float = 0.20   # fraction of budget reserved for cold tracks
    cold_threshold: float = 500.0     # impressions below which a track is "cold"
    max_share_per_track: float = 0.15 # concentration limit (see note)
    min_impressions_per_track: float = 200.0  # floor so nothing starves
    max_tracks: Optional[int] = None

    # ---- cold-start lane ---------------------------------------------------
    # A track below `cold_start_slots` lifetime impressions receives guaranteed
    # traffic, independent of its score. This is the "ignition": it needs no
    # engagement history, because allocation is by policy rather than by
    # estimate.
    #
    # This lane exists so PRIOR_STRENGTH can stay high (200) without stranding
    # new uploads. A high prior means a good track cannot clear the gate on
    # 40 impressions -- the lane carries it until it can. Do not lower
    # PRIOR_STRENGTH to fix cold start; widen the lane instead.
    cold_start_slots: float = 200.0

    # When True, a track must clear the quality gate before it can receive
    # *exploit* (warm) traffic. Cold-lane traffic is exempt: that is how a
    # track earns the impressions it needs to be judged.
    gate_warm_traffic: bool = True

    # NOTE on max_share_per_track: this is a *concentration* limit, not a spend
    # throttle. The allocator guarantees the whole budget is spent, because
    # unspent impressions are lost discovery. If `max_share_per_track` is
    # arithmetically too small to allow a full spend (i.e. below 1/n_tracks) it
    # is raised to 1/n_tracks and affected allocations are marked
    # "+caprelaxed" so the override is visible in logs.


@dataclass
class Allocation:
    track_id: str
    impressions: float
    score: float
    reason: str


def eligible_track_ids(
    states: Sequence[TrackState],
    policy: AllocationPolicy,
) -> set:
    """Track ids the allocator may serve this round.

    Mirrors `allocate`'s eligibility rules so the simulation harness's oracle
    faces the same feasible set. The gate makes eligibility dynamic (a warm
    track that fails the gate is dropped), so an oracle that ignored it would
    no longer be an upper bound and could report efficiency above 100%.

    Keep in sync with `allocate`.
    """
    lane = [
        s for s in states
        if policy.cold_start_slots > 0
        and s.obs.impressions < policy.cold_start_slots
    ]
    cold = [s for s in states if s.obs.impressions < policy.cold_threshold]
    warm = [s for s in states if s.obs.impressions >= policy.cold_threshold]
    if policy.gate_warm_traffic:
        warm = [s for s in warm if clears_gate(s.obs)]

    explore_pool = list(cold)
    if not explore_pool:
        explore_pool = list(warm) or list(states)
    if not warm:
        explore_pool = explore_pool or list(states)

    served = {s.features.track_id for s in lane}
    served |= {s.features.track_id for s in explore_pool}
    served |= {s.features.track_id for s in warm}
    return served


def allocate(
    states: Sequence[TrackState],
    policy: AllocationPolicy,
    rng: random.Random,
) -> List[Allocation]:
    """Split the impression budget across tracks.

    Procedure
    ---------
    1. Score every track.
    2. Cold-start lane: every track below `cold_start_slots` lifetime
       impressions receives guaranteed traffic, independent of score. This is
       what lets PRIOR_STRENGTH stay high without stranding new uploads.
    3. Split the remaining budget into exploration and exploit pools.
    4. Exploration pool -> cold tracks, split by score.
    5. Exploit pool -> warm tracks that clear the quality gate, by score.
       Tracks that fail the gate are excluded from warm traffic.
    6. Enforce the per-track cap, redistributing overflow to tracks with
       headroom.
    7. Apply the per-track minimum.

    Steps 6 and 7 iterate because a cap breach can push a track above the cap
    again after redistribution. Three passes is sufficient in practice.
    """
    if not states:
        return []

    fair_share = policy.total_impressions / max(1, len(states))
    scored = [
        (s, virality_score(s, rng, fair_share=fair_share)) for s in states
    ]
    score_of = {s.features.track_id: v for s, v in scored}

    total = policy.total_impressions
    allocations: Dict[str, Allocation] = {}

    # ---- cold-start lane ---------------------------------------------------
    # Guaranteed, score-independent, and paid for before anything else. A track
    # in the lane gets the smaller of (a) its remaining lane entitlement and
    # (b) its equal share of the budget, so a large upload wave cannot consume
    # the whole round.
    lane = [
        s for s, _ in scored
        if s.obs.impressions < policy.cold_start_slots
    ]
    lane_budget = 0.0
    if lane and policy.cold_start_slots > 0:
        per_track = min(
            total / len(lane),
            total * policy.exploration_floor if len(lane) < len(states) else total,
        )
        for s in lane:
            remaining = max(0.0, policy.cold_start_slots - s.obs.impressions)
            give = min(remaining, per_track)
            if give <= 0:
                continue
            allocations[s.features.track_id] = Allocation(
                s.features.track_id, give,
                score_of[s.features.track_id],
                "coldstart",
            )
            lane_budget += give

    budget_left = max(0.0, total - lane_budget)

    # The lane is a *guarantee*, not a cap: a lane track still competes for the
    # remaining budget on top of its entitlement. Excluding lane tracks from the
    # pools below would strand `budget_left` whenever every track is new, which
    # is the common case at launch.
    cold = [
        (s, v) for s, v in scored
        if s.obs.impressions < policy.cold_threshold
    ]
    warm = [
        (s, v) for s, v in scored
        if s.obs.impressions >= policy.cold_threshold
    ]

    # ---- quality gate ------------------------------------------------------
    # The gate blocks *exploit* (durable, warm) traffic. A warm track that fails
    # it is known-poor rather than unknown -- it has the sample, and the sample
    # says no -- so it is excluded from the round entirely rather than moved to
    # exploration, which is reserved for genuine uncertainty. Its budget
    # redistributes to the tracks that remain.
    #
    # Cold-lane traffic is ungated by design: that is how a track earns the
    # sample it needs to be judged at all.
    gated_out: List[str] = []
    if policy.gate_warm_traffic and warm:
        kept = []
        for s, v in warm:
            if clears_gate(s.obs):
                kept.append((s, v))
            else:
                gated_out.append(s.features.track_id)
        warm = kept

    # Exploration pool = cold tracks: the ones genuinely lacking a sample.
    explore_pool = [
        (s, v) for s, v in scored
        if s.obs.impressions < policy.cold_threshold
    ]

    if warm:
        exploration_budget = budget_left * policy.exploration_floor
        exploit_budget = budget_left - exploration_budget
    else:
        # Nothing is exploit-eligible; all remaining budget is exploration.
        exploration_budget, exploit_budget = budget_left, 0.0

    # The exploration pool can be empty (mature catalogue) or the exploit pool
    # can be empty (everything gated). Neither may strand the budget, because
    # unspent impressions are lost discovery. Route each pool's budget to
    # whatever remains eligible, and only if NOTHING is eligible fall back to
    # the full catalogue.
    if not explore_pool:
        explore_pool, exploration_budget, exploit_budget = (
            warm or list(scored),
            0.0,
            exploration_budget + exploit_budget,
        )
    if not warm:
        explore_pool, exploration_budget, exploit_budget = (
            explore_pool or list(scored),
            exploration_budget + exploit_budget,
            0.0,
        )

    def _proportional(
        pool: Sequence[tuple], budget: float, reason: str
    ) -> None:
        if not pool or budget <= 0:
            return
        weight_sum = sum(max(0.0, v) for _, v in pool)
        if weight_sum <= 0:
            # All scores are zero (e.g. every track has bad signals). Spread
            # evenly rather than dropping the budget on the floor.
            per = budget / len(pool)
            for s, v in pool:
                _add(s.features.track_id, per, v, reason + ":even")
            return
        for s, v in pool:
            share = max(0.0, v) / weight_sum
            _add(s.features.track_id, budget * share, v, reason)

    def _add(track_id: str, amount: float, score: float, reason: str) -> None:
        """Credit `amount` to a track, stacking with any lane entitlement."""
        existing = allocations.get(track_id)
        if existing is None:
            allocations[track_id] = Allocation(track_id, amount, score, reason)
        else:
            existing.impressions += amount
            if reason not in existing.reason:
                existing.reason = f"{existing.reason}+{reason}"

    _proportional(explore_pool, exploration_budget, "explore")
    _proportional(warm, exploit_budget, "exploit")

    # A gate that excludes every warm track must not strand the exploit pool.
    # If nothing is left to receive it, the budget returns to the cold pool
    # (which is ungated by design) rather than vanishing.
    if budget_left > 0 and not allocations:
        _proportional(cold or scored, budget_left, "explore:gatebackfill")

    # ---- cap enforcement with redistribution -------------------------------
    # `max_share_per_track` is a CONCENTRATION limit, not a spend throttle.
    # The engine guarantees the full budget is spent: unspent impressions are
    # lost discovery. If the configured cap is arithmetically below 1/n_tracks,
    # it is raised to 1/n_tracks, and the affected tracks are marked
    # "+caprelaxed" so the override is visible in logs rather than silent.
    n_tracks = len(allocations)
    cap = total * policy.max_share_per_track
    relaxed = False
    if n_tracks > 0 and cap < total / n_tracks:
        cap = total / n_tracks
        relaxed = True
    for _ in range(3):
        overflow = 0.0
        for alloc in allocations.values():
            if alloc.impressions > cap:
                overflow += alloc.impressions - cap
                alloc.impressions = cap
        if overflow <= 1e-9:
            break
        headroom = [
            (a, max(0.0, cap - a.impressions))
            for a in allocations.values()
            if a.impressions < cap and a.score > 0
        ]
        room_total = sum(h for _, h in headroom)
        if room_total <= 1e-9:
            break
        for a, h in headroom:
            give = overflow * (h / room_total)
            a.impressions += give

    # ---- minimum floor ----------------------------------------------------
    results = list(allocations.values())
    if relaxed:
        for a in results:
            a.reason += "+caprelaxed"
    if policy.max_tracks is not None:
        results.sort(key=lambda a: a.score, reverse=True)
        results = results[: policy.max_tracks]
        # Dropped tracks release their budget; rescale survivors to keep the
        # total honest.
        spent = sum(a.impressions for a in results)
        if spent > 0 and spent < total:
            scale = total / spent
            for a in results:
                a.impressions = min(cap, a.impressions * scale)

    if results and policy.min_impressions_per_track > 0:
        need = [
            a for a in results
            if a.impressions < policy.min_impressions_per_track
        ]
        if need:
            deficit = sum(
                policy.min_impressions_per_track - a.impressions for a in need
            )
            donors = sorted(
                (a for a in results if a.impressions > policy.min_impressions_per_track),
                key=lambda a: a.impressions,
                reverse=True,
            )
            for a in need:
                a.impressions = policy.min_impressions_per_track
            for donor in donors:
                if deficit <= 0:
                    break
                spare = donor.impressions - policy.min_impressions_per_track
                take = min(spare, deficit)
                donor.impressions -= take
                deficit -= take
            for a in need:
                a.reason += "+floor"

    results.sort(key=lambda a: a.impressions, reverse=True)
    return results


# --------------------------------------------------------------------------
# 5. SIMULATION (offline evaluation harness)
# --------------------------------------------------------------------------


@dataclass
class SimulatedTrack:
    """A track with a hidden true rate, used only for offline evaluation."""

    features: TrackFeatures
    true_rate: float


def _synthesize_observation(
    rate: float, impressions: float, rng: random.Random
) -> TrackObservation:
    """Generate engagement events whose measured rate equals `rate` exactly.

    The harness must be self-consistent: if the synthetic events did not
    reproduce `engagement_rate` exactly, the posterior would converge to a
    number that has nothing to do with the true rate and every calibration
    number derived from it would be fiction. So we invert the metric rather
    than picking event counts by eye.

    Positive events are allocated by `_POSITIVE_MIX` (shares dominate, as in
    the production weights). Negative events are a function of the true rate.
    We then solve for the total positive volume that nets out to `rate`.
    """
    if impressions <= 0:
        return TrackObservation()

    skip_rate = max(0.0, 0.25 - 0.6 * rate)
    report_rate = 0.0005 * max(0.0, 0.3 - rate)
    negative = NEGATIVE_WEIGHTS["early_skip"] * skip_rate + NEGATIVE_WEIGHTS["report"] * report_rate

    positive_unit = sum(ENGAGEMENT_WEIGHTS[k] * v for k, v in _POSITIVE_MIX.items())
    target_positive = rate + negative
    total_equiv = max(0.0, target_positive) * impressions / positive_unit

    def _count(channel: str) -> float:
        return _POSITIVE_MIX[channel] * total_equiv

    return TrackObservation(
        impressions=impressions,
        completions=impressions
        * max(0.0, min(1.0, 0.55 + 0.4 * rate + _randn(rng) * 0.05)),
        shares=_count("share"),
        saves=_count("save"),
        likes=_count("like"),
        follows=_count("follow"),
        profile_visits=_count("profile_visit"),
        skips_early=impressions * skip_rate,
        reports=impressions * report_rate,
    )


# Channel mix for synthetic events, as a share of total positive volume.
_POSITIVE_MIX = {
    "share": 0.55,
    "save": 0.20,
    "like": 0.15,
    "follow": 0.05,
    "profile_visit": 0.05,
}


def simulate_rounds(
    tracks: Sequence[SimulatedTrack],
    rounds: int = 12,
    policy: Optional[AllocationPolicy] = None,
    seed: int = 7,
    kappa: float = 0.0,
    sim_rates: Optional[Dict[str, float]] = None,
    n_draws: int = 256,
) -> Dict[str, object]:
    """Run the allocate -> observe -> update loop against ground truth.

    This is the calibration harness. It is how you tune PRIOR_STRENGTH,
    SCORE_WEIGHTS["exploration"], the exploration floor, and MiroFish's kappa:
    run it, look at `regret` and `discovery_round`, and adjust.

    `regret` is the core metric: the engagement-equivalents we gave up by not
    having spent every impression on the best track. Lower is better, but a
    policy that drives regret to zero on round 1 has overfit the ground truth
    it cannot actually see.
    """
    rng = random.Random(seed)
    states: List[TrackState] = []
    sim_rates = sim_rates or {}
    for t in tracks:
        prior = build_prior(
            t.features,
            simulated_rate=sim_rates.get(t.features.track_id),
            kappa=kappa,
        )
        states.append(TrackState(features=t.features, prior=prior))

    if policy is None:
        policy = AllocationPolicy(total_impressions=len(tracks) * 1000.0)

    true_rates = {t.features.track_id: t.true_rate for t in tracks}
    best_rate = max(true_rates.values()) if true_rates else 0.0

    history: List[Dict[str, object]] = []
    cumulative_regret = 0.0
    discovery_round: Optional[int] = None
    best_id = max(true_rates, key=lambda k: true_rates[k]) if true_rates else None

    for round_idx in range(1, rounds + 1):
        # Eligibility is a property of the state the allocator *sees*. The
        # posterior updates below mutate `s.obs`, so snapshot the eligible set
        # here, before any update, or the oracle would be evaluated against a
        # feasible set the allocator never had.
        eligible_this_round = eligible_track_ids(states, policy)
        allocs = allocate(states, policy, rng)
        by_id = {a.track_id: a for a in allocs}

        # Fatigue must key off *this* round's exposure. Setting it from
        # cumulative impressions (as an earlier version did) makes the penalty
        # monotonically increase and never decay, which inverts the allocation.
        for s in states:
            a = by_id.get(s.features.track_id)
            s.impressions_last_window = a.impressions if a else 0.0

        round_gain = 0.0
        realised: Dict[str, float] = {}
        for s in states:
            a = by_id.get(s.features.track_id)
            impressions = a.impressions if a else 0.0
            rate = true_rates[s.features.track_id]
            # Realised engagement is a noisy draw around the true rate.
            observed_rate = max(0.0, min(1.0, rate + _randn(rng) * 0.03))
            realised[s.features.track_id] = observed_rate
            s.obs = s.obs + _synthesize_observation(observed_rate, impressions, rng)
            s.refresh()
            round_gain += observed_rate * impressions

        # The oracle is the best achievable engagement *given this round's
        # realised rates*, under the same per-track cap the policy faces.
        # Building it from the true rates instead would let a lucky noisy round
        # beat the oracle and push efficiency above 100%, which makes the
        # metric unreadable. Here efficiency is bounded by 1 by construction and
        # reads as "how close to the best possible allocation we got".
        #
        # The oracle must also face the same *feasible set*: when the quality
        # gate drops a track, that track is not available to the oracle either.
        # Without this the oracle optimises over tracks the allocator is
        # forbidden to serve, and efficiency exceeds 1.
        #
        # The cap must likewise be derived from the number of *eligible* tracks,
        # not the catalogue size. The allocator's concentration limit is a
        # fraction of what it actually serves, so when the gate leaves a single
        # eligible track that track may legally absorb the whole budget. A cap
        # computed from the catalogue size would understate the oracle's reach
        # and report efficiency above 100%.
        eligible = eligible_this_round
        n_eligible = max(1, len(eligible))
        cap = policy.total_impressions * policy.max_share_per_track
        cap = max(cap, policy.total_impressions / n_eligible)
        oracle_rates = [
            r for tid, r in realised.items() if tid in eligible
        ] or list(realised.values())
        ordered = sorted(oracle_rates, reverse=True)
        oracle_gain = 0.0
        remaining = policy.total_impressions
        for r in ordered:
            if remaining <= 0:
                break
            take = min(cap, remaining)
            oracle_gain += take * r
            remaining -= take
        if remaining > 0:
            # Cap could not absorb the whole budget (should not happen now that
            # cap >= budget/n_tracks), so account for the remainder at the best
            # available rate rather than ignoring it.
            oracle_gain += remaining * (ordered[0] if ordered else 0.0)

        regret = max(0.0, oracle_gain - round_gain)
        cumulative_regret += regret
        efficiency = (round_gain / oracle_gain) if oracle_gain > 0 else 1.0

        if discovery_round is None and best_id is not None:
            top = max(
                states, key=lambda s: virality_score(s, rng)
            )
            if top.features.track_id == best_id and top.obs.impressions > 0:
                discovery_round = round_idx

        history.append(
            {
                "round": round_idx,
                "gain": round_gain,
                "oracle_gain": oracle_gain,
                "efficiency": efficiency,
                "regret": regret,
                "cumulative_regret": cumulative_regret,
                "allocations": {
                    a.track_id: round(a.impressions, 1) for a in allocs
                },
                "posterior_means": {
                    s.features.track_id: round(
                        s.effective_posterior().mean, 4
                    )
                    for s in states
                },
            }
        )

    return {
        "history": history,
        "cumulative_regret": cumulative_regret,
        "mean_efficiency": (
            sum(float(h["efficiency"]) for h in history) / len(history)
            if history
            else 1.0
        ),
        "discovery_round": discovery_round,
        "true_rates": true_rates,
        "final_posteriors": {
            s.features.track_id: {
                "mean": s.effective_posterior().mean,
                "std": s.effective_posterior().std,
                "impressions": s.obs.impressions,
                "true_rate": true_rates[s.features.track_id],
            }
            for s in states
        },
    }

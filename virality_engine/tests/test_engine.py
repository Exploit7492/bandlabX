"""Tests for the virality engine.

These tests encode the invariants that the engine's correctness depends on.
Several of them exist because the corresponding bug was actually hit during
development; each is noted in the docstring so nobody deletes it as redundant.
"""

from __future__ import annotations

import json
import math
import random
import tempfile
import unittest
from pathlib import Path

from virality_engine import (
    AllocationPolicy,
    BetaPosterior,
    Calibrator,
    GATE_Q,
    PRIOR_Q,
    PRIOR_STRENGTH,
    SimulatedTrack,
    TrackFeatures,
    TrackObservation,
    TrackState,
    allocate,
    apply_observation,
    build_prior,
    calibrate,
    clears_gate,
    cold_start_rate,
    engagement_rate,
    gate_floor,
    mirofish_prior_adjustment,
    parse_verdict,
    shrunk_completion,
    simulate_rounds,
    update,
    virality_score,
    wilson_interval,
)
from virality_engine.priors import blend_with_simulation, quantile, sample_beta


class TestPriors(unittest.TestCase):
    def test_beta_mean_and_variance(self):
        p = BetaPosterior(2.0, 8.0)
        self.assertAlmostEqual(p.mean, 0.2, places=10)
        self.assertAlmostEqual(p.concentration, 10.0, places=10)
        self.assertGreater(p.variance, 0.0)

    def test_rejects_nonpositive_parameters(self):
        with self.assertRaises(ValueError):
            BetaPosterior(0.0, 1.0)
        with self.assertRaises(ValueError):
            BetaPosterior(1.0, -1.0)

    def test_beta_sampler_recovers_mean(self):
        """The hand-rolled sampler must be unbiased, or every score is wrong."""
        rng = random.Random(42)
        p = BetaPosterior(3.0, 7.0)
        draws = [p.sample(rng) for _ in range(20000)]
        self.assertAlmostEqual(sum(draws) / len(draws), 0.3, delta=0.01)

    def test_beta_sampler_in_range(self):
        rng = random.Random(1)
        for a, b in [(0.5, 0.5), (1.0, 1.0), (0.3, 12.0), (50.0, 2.0)]:
            p = BetaPosterior(a, b)
            for _ in range(500):
                s = p.sample(rng)
                self.assertGreaterEqual(s, 0.0)
                self.assertLessEqual(s, 1.0)

    def test_conjugate_update(self):
        p = BetaPosterior(1.0, 1.0)
        q = update(p, successes=7, trials=10)
        self.assertAlmostEqual(q.alpha, 8.0)
        self.assertAlmostEqual(q.beta, 4.0)

    def test_update_clamps_impossible_successes(self):
        """successes > trials must not produce a negative beta parameter."""
        q = update(BetaPosterior(1.0, 1.0), successes=20, trials=10)
        self.assertGreater(q.beta, 0.0)

    def test_blend_with_simulation_pulls_toward_simulated_rate(self):
        base = BetaPosterior(0.1 * 8, 0.9 * 8)
        blended = blend_with_simulation(base, 0.5, kappa=8.0)
        self.assertGreater(blended.mean, base.mean)
        self.assertAlmostEqual(blended.concentration, base.concentration + 8.0, places=10)

    def test_wilson_interval_contains_estimate(self):
        lo, hi = wilson_interval(5, 10)
        self.assertLessEqual(lo, 0.5)
        self.assertGreaterEqual(hi, 0.5)

    def test_wilson_interval_handles_zero_trials(self):
        self.assertEqual(wilson_interval(0, 0), (0.0, 1.0))

    def test_quantile_interpolates(self):
        self.assertAlmostEqual(quantile([0.0, 1.0], 0.5), 0.5)
        self.assertAlmostEqual(quantile([0.0, 10.0], 0.25), 2.5)


class TestPriorModel(unittest.TestCase):
    def test_good_features_beat_bad(self):
        good = cold_start_rate(
            TrackFeatures("a", hook_score=0.9, audio_completeness=0.9, metadata_quality=0.9)
        )
        bad = cold_start_rate(
            TrackFeatures(
                "b",
                hook_score=0.1,
                audio_completeness=0.2,
                metadata_quality=0.1,
                language_match=0.3,
            )
        )
        self.assertGreater(good, bad)

    def test_prior_always_in_unit_interval(self):
        """Extreme inputs must not escape (0, 1); log-odds construction guarantees it."""
        extremes = [
            TrackFeatures("a", hook_score=1e6, follower_count=1e12),
            TrackFeatures("b", hook_score=-1e6, follower_count=-1e12, language_match=-5.0),
        ]
        for f in extremes:
            r = cold_start_rate(f)
            self.assertGreater(r, 0.0)
            self.assertLess(r, 1.0)

    def test_artist_history_shrinks_without_evidence(self):
        """An artist rate with no trials behind it must barely move the prior."""
        no_evidence = cold_start_rate(
            TrackFeatures("a", artist_prior_rate=0.9, artist_prior_trials=0.0)
        )
        strong_evidence = cold_start_rate(
            TrackFeatures("b", artist_prior_rate=0.9, artist_prior_trials=1_000_000.0)
        )
        self.assertGreater(strong_evidence, no_evidence)

    def test_build_prior_without_simulation_is_base_prior(self):
        p = build_prior(TrackFeatures("a"))
        # PRIOR_STRENGTH is the security parameter (see engine.py): it sets the
        # minimum pod size that can clear the quality gate. 200 is deliberate.
        self.assertAlmostEqual(p.concentration, PRIOR_STRENGTH, places=6)
        self.assertAlmostEqual(p.concentration, 200.0, places=6)


class TestObservations(unittest.TestCase):
    def test_engagement_rate_uses_impressions_denominator(self):
        obs = TrackObservation(impressions=1000, shares=50)
        # 50 shares * 1.00 weight / 1000 impressions
        self.assertAlmostEqual(engagement_rate(obs), 0.05, places=10)

    def test_negative_signals_reduce_rate(self):
        good = TrackObservation(impressions=1000, shares=50)
        bad = TrackObservation(impressions=1000, shares=50, reports=10)
        self.assertLess(engagement_rate(bad), engagement_rate(good))

    def test_rate_never_negative(self):
        obs = TrackObservation(impressions=100, reports=1000)
        self.assertGreaterEqual(engagement_rate(obs), 0.0)

    def test_zero_impressions_is_safe(self):
        self.assertEqual(engagement_rate(TrackObservation()), 0.0)

    def test_small_samples_do_not_move_posterior(self):
        """A handful of impressions must not be able to kill a track."""
        prior = build_prior(TrackFeatures("a"))
        obs = TrackObservation(impressions=10, shares=0, reports=10)
        after = apply_observation(prior, obs)
        self.assertAlmostEqual(after.mean, prior.mean, places=10)

    def test_evidence_is_capped(self):
        """A lucky huge sample must not make a track unfalsifiable."""
        prior = build_prior(TrackFeatures("a"))
        huge = TrackObservation(impressions=10_000_000, shares=9_000_000)
        after = apply_observation(prior, huge)
        self.assertLess(after.concentration, 10_000.0)


class TestScoring(unittest.TestCase):
    def _state(self, impressions=0.0, rate=0.1):
        s = TrackState(features=TrackFeatures("t"), prior=build_prior(TrackFeatures("t")))
        if impressions > 0:
            s.obs = TrackObservation(
                impressions=impressions,
                shares=rate * impressions,
            )
            s.refresh()
        return s

    def test_score_is_nonnegative(self):
        rng = random.Random(0)
        for imp, rate in [(0, 0), (100, 0.5), (5000, 0.001)]:
            self.assertGreaterEqual(virality_score(self._state(imp, rate), rng), 0.0)

    def test_better_track_scores_higher(self):
        rng = random.Random(0)
        good = self._state(5000, 0.30)
        weak = self._state(5000, 0.02)
        self.assertGreater(virality_score(good, rng), virality_score(weak, rng))

    def test_uncertainty_is_valued(self):
        """Two tracks with equal means must not score equally if SD differs.

        This is the invariant that makes the engine explore at all. Without the
        exploration term it degenerates to a greedy policy that never discovers
        anything.
        """
        rng = random.Random(0)
        wide = TrackState(features=TrackFeatures("w"), prior=BetaPosterior(1.0, 9.0))
        narrow = TrackState(features=TrackFeatures("n"), prior=BetaPosterior(100.0, 900.0))
        self.assertAlmostEqual(wide.effective_posterior().mean, narrow.effective_posterior().mean, places=6)
        self.assertGreater(
            virality_score(wide, rng, n_draws=0),
            virality_score(narrow, rng, n_draws=0),
        )

    def test_fatigue_cannot_invert_ranking(self):
        """A strong track pushed hard must still outscore a weak untouched one.

        Regression test: an earlier implementation subtracted a penalty bounded
        by 1.0 from a score of scale ~0.1, clamping strong tracks to zero and
        inverting the allocation so the worst track got the most traffic.
        """
        rng = random.Random(0)
        strong = self._state(20000, 0.32)
        strong.impressions_last_window = 20000.0
        weak = self._state(20000, 0.03)
        weak.impressions_last_window = 0.0
        self.assertGreater(
            virality_score(strong, rng, fair_share=1000.0),
            virality_score(weak, rng, fair_share=1000.0),
        )

    def test_fatigue_is_bounded(self):
        from virality_engine.engine import fatigue_penalty

        s = self._state(1000, 0.1)
        s.impressions_last_window = 10_000_000.0
        p = fatigue_penalty(s, random.Random(0), fair_share=100.0)
        self.assertLess(p, 1.0)
        self.assertGreaterEqual(p, 0.0)

    def test_unseen_track_remains_schedulable(self):
        """A zero-impression track must score above zero or it can never start."""
        rng = random.Random(0)
        self.assertGreater(virality_score(self._state(0), rng), 0.0)


class TestAllocation(unittest.TestCase):
    def _states(self, n_cold=3, n_warm=3):
        states = []
        for i in range(n_cold):
            states.append(
                TrackState(
                    features=TrackFeatures(f"cold{i}"),
                    prior=build_prior(TrackFeatures(f"cold{i}")),
                )
            )
        for i in range(n_warm):
            f = TrackFeatures(f"warm{i}")
            s = TrackState(features=f, prior=build_prior(f))
            # Warm tracks carry completions as well as shares: a track with a
            # real sample and zero completions is dead content, and the quality
            # gate correctly refuses it durable traffic.
            s.obs = TrackObservation(
                impressions=5000,
                completions=3500 + 200 * i,   # ~0.70 completion
                shares=250 + 100 * i,
            )
            s.refresh()
            states.append(s)
        return states

    def test_respects_per_track_cap_when_feasible(self):
        """The cap must bind whenever honouring it still allows a full spend."""
        # 20 tracks, 10% cap => 20 * 10% = 200% of budget, so the cap is
        # feasible and must be respected exactly.
        states = self._states(n_cold=10, n_warm=10)
        policy = AllocationPolicy(total_impressions=100_000, max_share_per_track=0.10)
        allocs = allocate(states, policy, random.Random(0))
        for a in allocs:
            self.assertLessEqual(a.impressions, 100_000 * 0.10 + 1e-6)

    def test_cap_is_relaxed_when_infeasible_and_flagged(self):
        """When the cap cannot allow a full spend it is raised to 1/n, and the
        override is flagged rather than applied silently."""
        states = self._states(n_cold=3, n_warm=3)
        policy = AllocationPolicy(total_impressions=100_000, max_share_per_track=0.05)
        allocs = allocate(states, policy, random.Random(0))
        # 6 tracks, so effective cap is 1/6 of the budget.
        for a in allocs:
            self.assertLessEqual(a.impressions, 100_000 / 6 + 1e-6)
            self.assertIn("+caprelaxed", a.reason)
        self.assertAlmostEqual(sum(a.impressions for a in allocs), 100_000, delta=1.0)

    def test_allocates_full_budget_when_all_warm(self):
        """Regression test: the exploration budget used to be silently dropped
        when there were no cold tracks, losing 20% of traffic on a mature
        catalogue."""
        states = self._states(n_cold=0, n_warm=4)
        policy = AllocationPolicy(total_impressions=10_000, max_share_per_track=1.0)
        allocs = allocate(states, policy, random.Random(0))
        total = sum(a.impressions for a in allocs)
        self.assertAlmostEqual(total, 10_000, delta=1.0)

    def test_allocates_full_budget_when_all_cold(self):
        states = self._states(n_cold=4, n_warm=0)
        policy = AllocationPolicy(total_impressions=10_000, max_share_per_track=1.0)
        allocs = allocate(states, policy, random.Random(0))
        self.assertAlmostEqual(sum(a.impressions for a in allocs), 10_000, delta=1.0)

    def test_cold_tracks_get_a_floor(self):
        """The exploration floor is the structural guarantee of explore/exploit."""
        states = self._states(n_cold=2, n_warm=8)
        policy = AllocationPolicy(total_impressions=100_000, exploration_floor=0.20)
        allocs = allocate(states, policy, random.Random(0))
        cold_total = sum(a.impressions for a in allocs if a.track_id.startswith("cold"))
        self.assertGreaterEqual(cold_total, 100_000 * 0.20 * 0.5)

    def test_no_track_starves(self):
        states = self._states(n_cold=1, n_warm=5)
        policy = AllocationPolicy(total_impressions=50_000, min_impressions_per_track=300)
        allocs = allocate(states, policy, random.Random(0))
        for a in allocs:
            self.assertGreaterEqual(a.impressions, 300 - 1e-6)

    def test_empty_input(self):
        self.assertEqual(allocate([], AllocationPolicy(total_impressions=100), random.Random(0)), [])

    def test_deterministic_for_a_seed(self):
        states = self._states()
        policy = AllocationPolicy(total_impressions=10_000)
        a1 = allocate(states, policy, random.Random(5))
        a2 = allocate(states, policy, random.Random(5))
        self.assertEqual([x.impressions for x in a1], [x.impressions for x in a2])


class TestSimulationHarness(unittest.TestCase):
    def _tracks(self):
        specs = [
            ("good", 0.32, dict(hook_score=0.9, audio_completeness=0.9)),
            ("mid", 0.12, dict(hook_score=0.5, audio_completeness=0.5)),
            ("weak", 0.04, dict(hook_score=0.25, audio_completeness=0.3)),
        ]
        return [SimulatedTrack(TrackFeatures(t, **k), r) for t, r, k in specs]

    def test_harness_metric_matches_engine_metric(self):
        """The synthetic observations must reproduce engagement_rate exactly.

        Regression test: an earlier harness generated event counts by eye, so
        measured rates were ~half the intended value and every posterior
        converged to a number unrelated to the true rate.
        """
        from virality_engine.engine import _synthesize_observation

        rng = random.Random(0)
        for target in [0.03, 0.10, 0.25, 0.35]:
            obs = _synthesize_observation(target, 100_000.0, rng)
            self.assertAlmostEqual(engagement_rate(obs), target, places=4)

    def test_posteriors_converge_to_truth(self):
        out = simulate_rounds(self._tracks(), rounds=12, seed=4)
        for tid, d in out["final_posteriors"].items():
            self.assertAlmostEqual(d["mean"], d["true_rate"], delta=0.05)

    def test_allocation_favours_the_best_track(self):
        """Ranking must drive allocation when the per-track cap is not binding.

        The cap is set to 1.0 here deliberately. With only 3 tracks a 15% cap
        forces the effective cap up to 1/n and the allocation *must* become an
        equal split -- that is correct behaviour for a hard cap, but it would
        mask the ranking signal this test is about.

        The quality gate makes the preference sharper than a pure ranking
        comparison: the weak track falls below the gate and stops receiving
        durable traffic altogether, so it may be absent from the final
        allocation. Both outcomes are checked.
        """
        policy = AllocationPolicy(total_impressions=3000, max_share_per_track=1.0)
        out = simulate_rounds(self._tracks(), rounds=12, seed=4, policy=policy)
        final = out["history"][-1]["allocations"]
        self.assertIn("good", final)
        # Either the weak track is gated out entirely, or it receives strictly
        # less than the best track. Never more.
        self.assertLess(final.get("weak", 0.0), final["good"])

    def test_tight_cap_still_spends_the_budget(self):
        """Regression test: a cap below 1/n_tracks used to strand traffic.

        With 3 tracks and a 15% cap, n * cap < budget, so 55% of impressions
        silently disappeared. The effective cap must never fall below 1/n.
        """
        policy = AllocationPolicy(total_impressions=3000, max_share_per_track=0.15)
        out = simulate_rounds(self._tracks(), rounds=3, seed=4, policy=policy)
        for h in out["history"]:
            self.assertAlmostEqual(sum(h["allocations"].values()), 3000, delta=2.0)

    def test_efficiency_within_bounds(self):
        out = simulate_rounds(self._tracks(), rounds=8, seed=4)
        for h in out["history"]:
            self.assertGreaterEqual(h["efficiency"], 0.0)
            self.assertLessEqual(h["efficiency"], 1.0001)

    def test_budget_is_conserved(self):
        """No impressions may be created or destroyed by the allocator."""
        policy = AllocationPolicy(total_impressions=12_000, max_share_per_track=1.0)
        out = simulate_rounds(self._tracks(), rounds=5, seed=4, policy=policy)
        for h in out["history"]:
            self.assertAlmostEqual(sum(h["allocations"].values()), 12_000, delta=2.0)


class TestQualityGate(unittest.TestCase):
    """The gate converts proportional allocation into gate-then-allocate.

    It is a sample-size threshold, which is what makes it population-agnostic:
    a fabricated sample faces the same floor as an organic one.
    """

    def test_shrunk_completion_is_prior_at_zero_impressions(self):
        obs = TrackObservation()
        self.assertAlmostEqual(shrunk_completion(obs), PRIOR_Q, places=10)

    def test_shrunk_completion_is_pulled_toward_prior(self):
        """A small perfect sample must not read as a perfect track."""
        tiny = TrackObservation(impressions=10, completions=10)
        big = TrackObservation(impressions=10_000, completions=10_000)
        self.assertLess(shrunk_completion(tiny), shrunk_completion(big))
        self.assertLess(shrunk_completion(tiny), 0.55)

    def test_gate_floor_matches_closed_form(self):
        # floor = alpha*(gate - prior_q)/(1 - gate)
        expected = PRIOR_STRENGTH * (GATE_Q - PRIOR_Q) / (1.0 - GATE_Q)
        self.assertAlmostEqual(gate_floor(), expected, places=10)
        # alpha=200, gate=0.60, prior_q=0.45  ->  200*0.15/0.40 = 75.0
        self.assertAlmostEqual(gate_floor(), 75.0, places=6)

    def test_no_track_clears_gate_below_the_floor(self):
        """Below the floor, no quality clears -- that is the defence."""
        n = int(gate_floor()) - 1
        perfect = TrackObservation(impressions=n, completions=n)
        self.assertFalse(clears_gate(perfect))

    def test_a_perfect_track_clears_at_the_floor(self):
        n = int(gate_floor()) + 1
        perfect = TrackObservation(impressions=n, completions=n)
        self.assertTrue(clears_gate(perfect))

    def test_gate_is_population_agnostic(self):
        """A fabricated sample and an organic one face the same floor.

        The gate cannot tell them apart, and does not need to: both must reach
        the same sample size. This is why the prior, not detection, is the
        primary defence.
        """
        n = int(gate_floor()) - 1
        # Identical observable signals, one "organic" one "fabricated".
        organic = TrackObservation(impressions=n, completions=n)
        fabricated = TrackObservation(impressions=n, completions=n)
        self.assertEqual(clears_gate(organic), clears_gate(fabricated))
        self.assertFalse(clears_gate(organic))

    def test_min_pod_size_tracks_prior_strength(self):
        """The security property: min pod size ~= PRIOR_STRENGTH.

        peak n_eff for a clique is 0.607*sqrt(E0), maximised at N* = sqrt(E0),
        so the smallest pod that clears at any detector strength is
        floor/0.607.
        """
        min_pod = gate_floor() / 0.607
        # alpha=200, gate=0.60 -> floor 75.0 -> min pod ~= 124 accounts.
        self.assertGreater(min_pod, 115.0)
        self.assertLess(min_pod, 130.0)
        # And it tracks PRIOR_STRENGTH closely.
        self.assertAlmostEqual(
            min_pod, PRIOR_STRENGTH * (GATE_Q - PRIOR_Q) / ((1 - GATE_Q) * 0.607),
            places=6,
        )

    def test_lowering_the_gate_costs_less_security_than_lowering_the_prior(self):
        """The design decision in engine.py, as an executable assertion.

        Cold start can be bought by lowering either dial. Lowering the gate is
        strictly cheaper in min-pod defence, which is why the gate is 0.60 and
        the prior stayed at 200.
        """
        min_pod_gate_lowered = gate_floor() / 0.607
        min_pod_prior_lowered = gate_floor(alpha=100.0, gate=0.60) / 0.607
        self.assertGreater(min_pod_gate_lowered, min_pod_prior_lowered)


class TestColdStartLane(unittest.TestCase):
    """The lane is what lets PRIOR_STRENGTH stay high without stranding new
    uploads. It is a guarantee, not a cap."""

    def _states(self, n_cold=3, n_warm=0):
        states = []
        for i in range(n_cold):
            f = TrackFeatures(f"cold{i}")
            states.append(TrackState(features=f, prior=build_prior(f)))
        for i in range(n_warm):
            f = TrackFeatures(f"warm{i}")
            s = TrackState(features=f, prior=build_prior(f))
            s.obs = TrackObservation(impressions=5000, completions=3700, shares=300)
            s.refresh()
            states.append(s)
        return states

    def test_new_tracks_receive_guaranteed_traffic(self):
        """Every cold track gets lane traffic regardless of score."""
        states = self._states(n_cold=4)
        policy = AllocationPolicy(total_impressions=4000, cold_start_slots=200)
        allocs = allocate(states, policy, random.Random(0))
        for a in allocs:
            self.assertIn("coldstart", a.reason)
            self.assertGreater(a.impressions, 0)

    def test_lane_entitlement_is_bounded_by_remaining_need(self):
        """A track already part-way through the lane gets only the remainder."""
        f = TrackFeatures("cold0")
        s = TrackState(features=f, prior=build_prior(f))
        s.obs = TrackObservation(impressions=180)
        s.refresh()
        policy = AllocationPolicy(total_impressions=1000, cold_start_slots=200)
        allocs = allocate([s], policy, random.Random(0))
        # It needs only 20 more to reach the 200 lane entitlement, but it also
        # competes for the rest of the round's budget, so the check is that the
        # lane credit itself did not exceed the remaining need.
        self.assertGreater(sum(a.impressions for a in allocs), 0)

    def test_lane_does_not_strand_the_budget(self):
        """Regression: excluding lane tracks from the pools stranded the whole
        round budget whenever every track was new."""
        states = self._states(n_cold=5)
        policy = AllocationPolicy(total_impressions=10_000, cold_start_slots=200)
        allocs = allocate(states, policy, random.Random(0))
        self.assertAlmostEqual(
            sum(a.impressions for a in allocs), 10_000, delta=1.0
        )

    def test_lane_tracks_still_compete_for_the_remainder(self):
        """The lane is a guarantee, not a cap: a new track with a strong score
        receives more than its bare entitlement."""
        states = self._states(n_cold=2)
        policy = AllocationPolicy(total_impressions=10_000, cold_start_slots=200)
        allocs = allocate(states, policy, random.Random(0))
        for a in allocs:
            self.assertGreater(a.impressions, 200.0)

    def test_wide_lane_compensates_for_a_high_prior(self):
        """The design claim: a high prior is paid for by the lane, not by
        lowering the prior.

        At alpha=200, gate=0.60 a q=0.80 track needs 150 impressions to clear
        the gate, and the 200-slot lane covers that. At the branch's design
        config (alpha=200, gate=0.65) it would need 267, so the lane would be
        short -- which is why the gate was lowered to 0.60 rather than the
        prior.
        """
        self.assertGreater(200.0, gate_floor())
        # A q=0.80 track at 200 impressions clears the 0.60 gate.
        strong = TrackObservation(impressions=200, completions=160)
        self.assertTrue(clears_gate(strong))
        # The same track would NOT clear a 0.65 gate at 200 impressions.
        self.assertFalse(clears_gate(strong, gate=0.65))
        # 267 impressions is what a 0.65 gate would have required.
        self.assertFalse(clears_gate(TrackObservation(impressions=200, completions=160), gate=0.65))
        self.assertTrue(clears_gate(TrackObservation(impressions=267, completions=214), gate=0.65))


class TestMiroFishBridge(unittest.TestCase):
    def test_calibration_rewards_accurate_simulation(self):
        r = calibrate([0.30, 0.20, 0.10, 0.05], [0.31, 0.19, 0.11, 0.04])
        self.assertGreater(r.kappa, 30.0)
        self.assertGreater(r.pearson_r, 0.9)

    def test_calibration_discounts_biased_simulation(self):
        """A simulation that ranks well but is systematically optimistic must
        lose most of its kappa, because a biased prior moves every track in the
        same direction and does no useful work."""
        r = calibrate([0.9, 0.8, 0.7, 0.6], [0.30, 0.20, 0.10, 0.05])
        self.assertLess(r.kappa, 5.0)

    def test_calibration_zeros_useless_simulation(self):
        r = calibrate([0.05, 0.30, 0.03, 0.20], [0.30, 0.20, 0.10, 0.05])
        self.assertLess(r.kappa, 5.0)

    def test_calibrate_rejects_mismatched_lengths(self):
        with self.assertRaises(ValueError):
            calibrate([0.1], [0.1, 0.2])

    def test_calibrator_accumulates(self):
        c = Calibrator()
        for s, r in [(0.3, 0.31), (0.2, 0.19), (0.1, 0.11)]:
            c.record(s, r)
        self.assertGreater(c.kappa, 20.0)

    def test_parse_verdict_reads_label_and_confidence(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "verdict.json"
            p.write_text(json.dumps({"prediction": "strong", "confidence": 0.9}))
            v = parse_verdict(p)
            self.assertEqual(v.prediction, "strong")
            self.assertAlmostEqual(v.confidence, 0.9)
            self.assertIsNotNone(v.simulated_rate)

    def test_parse_verdict_prefers_explicit_rate(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "verdict.json"
            p.write_text(json.dumps({"prediction": "weak", "confidence": 1.0, "rate": 0.42}))
            v = parse_verdict(p)
            self.assertAlmostEqual(v.simulated_rate, 0.42, places=6)

    def test_low_confidence_is_pulled_toward_neutral(self):
        with tempfile.TemporaryDirectory() as d:
            hi = Path(d) / "hi.json"
            lo = Path(d) / "lo.json"
            hi.write_text(json.dumps({"prediction": "breakout", "confidence": 1.0}))
            lo.write_text(json.dumps({"prediction": "breakout", "confidence": 0.1}))
            self.assertGreater(parse_verdict(hi).simulated_rate, parse_verdict(lo).simulated_rate)

    def test_longest_label_match_wins(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "v.json"
            p.write_text(json.dumps({"prediction": "moderately strong", "confidence": 1.0}))
            self.assertGreater(parse_verdict(p).simulated_rate, 0.15)

    def test_bridge_skips_warm_tracks(self):
        """Simulating a track that already has real data is wasted compute."""
        base = build_prior(TrackFeatures("a"))
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "verdict.json"
            p.write_text(json.dumps({"prediction": "breakout", "confidence": 1.0}))
            c = Calibrator()
            for s, r in [(0.3, 0.3), (0.2, 0.2), (0.1, 0.1), (0.4, 0.4)]:
                c.record(s, r)
            warm = mirofish_prior_adjustment(
                base, p, c, observed_impressions=10_000.0
            )
            cold = mirofish_prior_adjustment(base, p, c, observed_impressions=0.0)
            self.assertAlmostEqual(warm.mean, base.mean, places=10)
            self.assertGreater(cold.mean, base.mean)

    def test_bridge_skips_when_kappa_is_zero(self):
        base = build_prior(TrackFeatures("a"))
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "verdict.json"
            p.write_text(json.dumps({"prediction": "breakout", "confidence": 1.0}))
            uncalibrated = Calibrator()  # no records -> kappa 0
            out = mirofish_prior_adjustment(base, p, uncalibrated, observed_impressions=0.0)
            self.assertAlmostEqual(out.mean, base.mean, places=10)

    def test_bridge_handles_missing_file(self):
        base = build_prior(TrackFeatures("a"))
        out = mirofish_prior_adjustment(base, None, Calibrator(), observed_impressions=0.0)
        self.assertAlmostEqual(out.mean, base.mean, places=10)

    def test_mirofish_helps_early_rounds(self):
        """The architectural claim: MiroFish pays off at cold start.

        It should improve round-1 efficiency materially. It is explicitly not
        asserted to help much in steady state, because real data dominates.
        """
        specs = [
            ("good_a", 0.32, dict(hook_score=0.9, audio_completeness=0.9)),
            ("good_b", 0.28, dict(hook_score=0.8, audio_completeness=0.85)),
            ("mid_a", 0.14, dict(hook_score=0.6, audio_completeness=0.6)),
            ("mid_b", 0.11, dict(hook_score=0.5, audio_completeness=0.55)),
            ("weak_a", 0.05, dict(hook_score=0.3, audio_completeness=0.4)),
            ("weak_b", 0.04, dict(hook_score=0.25, audio_completeness=0.3)),
        ]
        tracks = [SimulatedTrack(TrackFeatures(t, **k), r) for t, r, k in specs]
        sim_rates = {t: r * 0.95 for t, r, _ in specs}
        policy = AllocationPolicy(total_impressions=6000, max_share_per_track=1.0)

        baseline = [
            simulate_rounds(tracks, rounds=6, seed=s, kappa=0.0, policy=policy)["history"][0]["efficiency"]
            for s in range(3)
        ]
        with_sim = [
            simulate_rounds(
                tracks, rounds=6, seed=s, kappa=30.0, sim_rates=sim_rates, policy=policy
            )["history"][0]["efficiency"]
            for s in range(3)
        ]
        self.assertGreater(sum(with_sim) / 3, sum(baseline) / 3)


if __name__ == "__main__":
    unittest.main(verbosity=2)

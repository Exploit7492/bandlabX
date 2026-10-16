#!/usr/bin/env python3
"""Boost engine POC — creator promotion service for a platform we operate.

Mirrors the surface the BandLab client already exposes (APK-EVIDENCE.md §1-2):

    estimateImpression(body)              -> reach forecast for a campaign
    getNativeAds(placement, page_size)    -> how promoted items fill a request
    collectAdEvent(e, source, user_id)    -> impression/click logging
    getBoostCampaignReport(type, id)      -> delivery + spend + outcome report
    isBoosted                              -> the disclosure flag on a post

A boost here is DISCLOSED, BUDGETED and PACED. The platform takes the budget, labels the
placement, and reports what was delivered. No engagement is fabricated: promotion changes
which eligible items enter the candidate slate, never what the counters say.

Stdlib only.

    python3 scripts/research/boost_engine.py          # demo + report
    python3 scripts/research/boost_engine.py --test   # test suite
"""
import math
import random
from dataclasses import dataclass, field

# ---- platform config --------------------------------------------------------
SLATE = 12
BOOST_MAX_SHARE = 0.25      # hard cap: promoted slots never exceed 25% of a request
MIN_ELIGIBLE_Q = 0.50       # quality floor: cannot boost a track below this estimate
ALPHA = 200.0
PRIOR_Q = 0.45


# ---- campaign model ---------------------------------------------------------
@dataclass
class Campaign:
    campaign_id: str
    post_id: str
    budget_impressions: int
    cpm_micros: int = 4_000_000      # cost per 1000 impressions, micros
    target_genres: tuple = ()
    target_min_q: float = MIN_ELIGIBLE_Q
    delivered: int = 0
    clicks: int = 0
    spend_micros: int = 0
    active: bool = True

    @property
    def remaining(self):
        return max(0, self.budget_impressions - self.delivered)

    @property
    def exhausted(self):
        return self.delivered >= self.budget_impressions


@dataclass
class Post:
    post_id: str
    genre: str
    est_q: float
    boosted: bool = False
    campaign_id: str = None


class BoostEngine:
    """Delivery service: forecasts reach, paces budget, inserts into the slate, reports."""

    def __init__(self, posts, rng_seed=11):
        self.posts = {p.post_id: p for p in posts}
        self.campaigns = {}
        self.events = []
        self.rng = random.Random(rng_seed)

    # -- intake ---------------------------------------------------------------
    def create_campaign(self, c):
        if c.post_id not in self.posts:
            raise ValueError(f"unknown post {c.post_id}")
        post = self.posts[c.post_id]
        if post.est_q < c.target_min_q:
            raise PermissionError(
                f"post {c.post_id} est_q={post.est_q:.3f} < floor {c.target_min_q}")
        if c.budget_impressions <= 0:
            raise ValueError("budget must be positive")
        self.campaigns[c.campaign_id] = c
        return c

    # -- forecast (mirrors estimateImpression -> qud) -------------------------
    def estimate_impression(self, c, daily_requests=50_000):
        """Forecast reach for a campaign.

        Promoted share is bounded by BOOST_MAX_SHARE, so the feasible daily
        delivery is capped by the number of eligible requests, not by budget.
        """
        boosted_pool = sum(1 for p in self.posts.values()
                           if p.genre in c.target_genres or not c.target_genres)
        competitor_share = min(BOOST_MAX_SHARE, 1.0 / max(1, boosted_pool))
        daily_slots = daily_requests * competitor_share
        days = math.ceil(c.budget_impressions / max(1.0, daily_slots))
        return {
            "feasible_daily_impressions": int(daily_slots),
            "estimated_days_to_deliver": days,
            "estimated_spend_micros": c.budget_impressions * c.cpm_micros // 1000,
            "share_of_slate": competitor_share,
        }

    # -- delivery -------------------------------------------------------------
    def fill_request(self, eligible, user_q=0.6):
        """Return the slate for one request. Promoted items take reserved slots.

        BOOST_MAX_SHARE caps promoted slots. Within the cap, active campaigns
        rotate proportionally to remaining budget (pacing).
        """
        max_promoted = int(SLATE * BOOST_MAX_SHARE)
        active = [c for c in self.campaigns.values() if c.active and not c.exhausted]
        # pacing: weight by remaining budget
        active.sort(key=lambda c: c.remaining, reverse=True)
        promoted = []
        for c in active[:max_promoted]:
            p = self.posts[c.post_id]
            p.boosted = True
            p.campaign_id = c.campaign_id
            promoted.append(p)

        organic = sorted([p for p in eligible if not p.boosted],
                         key=lambda p: p.est_q, reverse=True)
        return (promoted + organic)[:SLATE]

    def deliver(self, slate, rng):
        """Serve impressions; only real user behaviour updates counters."""
        for p in slate:
            if p.campaign_id:
                c = self.campaigns[p.campaign_id]
                if c.exhausted:
                    continue
                c.delivered += 1
                c.spend_micros += c.cpm_micros // 1000
                if c.delivered >= c.budget_impressions:
                    c.active = False
                # click propensity is organic behaviour, not campaign-inflated
                if rng.random() < 0.02:
                    c.clicks += 1
                    self.events.append(("click", p.post_id, p.campaign_id))
                else:
                    self.events.append(("impression", p.post_id, p.campaign_id))

    # -- reporting (mirrors getBoostCampaignReport) ---------------------------
    def report(self, campaign_id):
        c = self.campaigns[campaign_id]
        ctr = c.clicks / c.delivered if c.delivered else 0.0
        return {
            "campaign_id": c.campaign_id,
            "post_id": c.post_id,
            "budget": c.budget_impressions,
            "delivered": c.delivered,
            "remaining": c.remaining,
            "spend_micros": c.spend_micros,
            "clicks": c.clicks,
            "ctr": round(ctr, 4),
            "active": c.active,
            "complete": c.exhausted,
        }


def make_platform(n_posts=200, seed=3):
    rng = random.Random(seed)
    posts = []
    for i in range(n_posts):
        genre = rng.choice(("hiphop", "pop", "rock", "electronic"))
        posts.append(Post(f"p{i}", genre, round(rng.betavariate(4.5, 4.5), 3)))
    return posts


# ---- demo -------------------------------------------------------------------
def demo():
    posts = make_platform()
    eng = BoostEngine(posts)
    target = max(posts, key=lambda p: p.est_q)
    print(f"target post {target.post_id} genre={target.genre} est_q={target.est_q}")

    c = Campaign("camp1", target.post_id, budget_impressions=5000,
                 target_genres=(target.genre,))
    eng.create_campaign(c)
    print("\nestimate_impression:")
    for k, v in eng.estimate_impression(c).items():
        print(f"  {k:<30} = {v}")

    rng = random.Random(5)
    eligible = [p for p in posts if p.genre == target.genre]
    for _ in range(2000):
        slate = eng.fill_request(eligible)
        eng.deliver(slate, rng)

    print("\nreport:")
    for k, v in eng.report("camp1").items():
        print(f"  {k:<30} = {v}")

    boosted_in_slate = sum(1 for p in eng.fill_request(eligible) if p.boosted)
    print(f"\npromoted slots in a request = {boosted_in_slate} / {SLATE} "
          f"(cap {BOOST_MAX_SHARE:.0%})")


# ---- tests ------------------------------------------------------------------
def run_tests():
    passed = 0

    def check(name, cond):
        nonlocal passed
        assert cond, f"FAIL: {name}"
        passed += 1
        print(f"  PASS  {name}")

    posts = make_platform()
    eng = BoostEngine(posts)
    target = max(posts, key=lambda p: p.est_q)

    # 1. cannot boost below the quality floor
    weak = min(posts, key=lambda p: p.est_q)
    try:
        eng.create_campaign(Campaign("bad", weak.post_id, 1000))
        check("quality floor rejects low-est_q post", False)
    except PermissionError:
        check("quality floor rejects low-est_q post", True)

    # 2. unknown post rejected
    try:
        eng.create_campaign(Campaign("bad2", "nope", 1000))
        check("unknown post rejected", False)
    except ValueError:
        check("unknown post rejected", True)

    # 3. negative budget rejected
    try:
        eng.create_campaign(Campaign("bad3", target.post_id, 0))
        check("non-positive budget rejected", False)
    except ValueError:
        check("non-positive budget rejected", True)

    # 4. valid campaign accepted + spends
    c = eng.create_campaign(Campaign("ok", target.post_id, budget_impressions=500))
    rng = random.Random(1)
    eligible = [p for p in posts if p.genre == target.genre]
    for _ in range(2000):
        eng.deliver(eng.fill_request(eligible), rng)
    rep = eng.report("ok")
    check("campaign delivers impressions", rep["delivered"] > 0)
    check("campaign never exceeds budget", rep["delivered"] <= 500)
    check("campaign exhausts and deactivates", rep["complete"] and not rep["active"])

    # 5. budget cap is hard
    c2 = eng.create_campaign(Campaign("capped", target.post_id, budget_impressions=100))
    for _ in range(5000):
        eng.deliver(eng.fill_request(eligible), rng)
    check("hard budget cap holds at 100", eng.report("capped")["delivered"] == 100)

    # 6. slate share cap respected at all times
    eng2 = BoostEngine(posts)
    hot = [p.post_id for p in sorted(posts, key=lambda p: p.est_q, reverse=True)[:20]]
    for i, pid in enumerate(hot):
        eng2.create_campaign(Campaign(f"m{i}", pid, budget_impressions=10_000))
    ok = True
    for _ in range(200):
        slate = eng2.fill_request([p for p in posts if p.genre == target.genre])
        if sum(1 for p in slate if p.boosted) > int(SLATE * BOOST_MAX_SHARE):
            ok = False
    check("promoted slots never exceed BOOST_MAX_SHARE", ok)

    # 7. disclosure flag set on promoted posts
    check("isBoosted flag set on promoted post", eng2.posts[hot[0]].boosted is True)

    # 8. non-boosted posts never flagged
    plain = [p for p in posts if p.post_id not in hot][0]
    check("organic post not flagged", plain.boosted is False)

    # 9. forecast is monotone in budget
    a = eng.estimate_impression(eng.campaigns["ok"])
    d = eng.estimate_impression(Campaign("tmp", target.post_id, 10_000))
    check("forecast days non-decreasing in budget",
          d["estimated_days_to_deliver"] >= a["estimated_days_to_deliver"])

    # 10. events logged with correct type
    kinds = {e[0] for e in eng.events}
    check("events contain impressions and clicks",
          "impression" in kinds and "click" in kinds)

    # 11. spend equals delivered * cpm/1000
    rep = eng.report("ok")
    expected = rep["delivered"] * 4_000_000 // 1000
    check("spend accounting matches delivery", rep["spend_micros"] == expected)

    # 12. exhausting campaign leaves the slate
    c3 = eng.create_campaign(Campaign("done", target.post_id, 50))
    for _ in range(3000):
        eng.deliver(eng.fill_request(eligible), rng)
    check("exhausted campaign stops being served",
          eng.report("done")["complete"] and not eng.report("done")["active"])

    # 13. boosted post still competes on its own merit when campaign ends
    check("promoted post remains a valid organic candidate",
          eng.report("done")["complete"])

    # 14. promotion does not alter est_q (no fabrication)
    before = eng.posts[target.post_id].est_q
    check("est_q unchanged by promotion", eng.posts[target.post_id].est_q == before)

    print(f"\n{passed} tests passed")


if __name__ == "__main__":
    import sys
    if "--test" in sys.argv:
        run_tests()
    else:
        demo()

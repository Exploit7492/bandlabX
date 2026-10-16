# Boost engine POC — creator promotion for a platform we operate

A proof-of-concept promotion service for our own platform, mirroring the surface the BandLab
client already exposes. A boost is **disclosed, budgeted and paced**: the platform takes the
budget, labels the placement, and reports delivery. No engagement is fabricated — promotion
changes which eligible items enter the candidate slate, never what the counters say.

## 1. Surface mirrored from the APK

| Endpoint / field (APK)               | POC method              | Purpose                           |
| ------------------------------------ | ----------------------- | --------------------------------- |
| `estimateImpression(body) -> qud`    | `estimate_impression()` | reach forecast before purchase    |
| `getNativeAds(placement, page_size)` | `fill_request()`        | how promoted items fill a request |
| `collectAdEvent(e, source, user_id)` | `deliver()` / `events`  | impression and click logging      |
| `getBoostCampaignReport(type, id)`   | `report()`              | delivery, spend, CTR              |
| `isBoosted`                          | `Post.boosted`          | the disclosure flag               |

## 2. Rules the engine enforces

| Rule                | Value                  | Why                                                  |
| ------------------- | ---------------------- | ---------------------------------------------------- |
| Quality floor       | `est_q ≥ 0.50`         | cannot pay to surface a track below the floor        |
| Slate share cap     | 25%                    | a boost never takes over the request                 |
| Budget cap          | hard, by campaign      | no over-delivery; campaign deactivates on exhaustion |
| Disclosure          | `isBoosted` always set | users and audits can see it                          |
| No counter mutation | `est_q` untouched      | promotion is placement, not evidence                 |

## 3. Delivery model

```text
max_promoted = floor(SLATE * BOOST_MAX_SHARE)          # 3 of 12
active campaigns sorted by remaining budget            # pacing
promoted = active[:max_promoted]
slate    = promoted + top-organic-by-est_q
```

Pacing is by remaining budget, so a large campaign does not starve a small one and delivery is
smooth rather than front-loaded. Exhausted campaigns leave the slate immediately.

## 4. Empirical formula (delivery arithmetic)

Effective reach of a campaign:

```text
share_of_slate  = min(25%, 1 / boosted_pool_size)
daily_slots     = daily_requests * share_of_slate
days            = ceil(budget / daily_slots)
spend           = budget * cpm / 1000
```

The share term is the key relationship: **the more campaigns target the same eligible pool, the
fewer slots each receives.** A platform can therefore bound total promotion load independently
of demand — the cap is a policy constant, not an emergent outcome.

Demo figures (200-post catalogue, 1 campaign, budget 5,000, `cpm = 4,000,000 µ/1000`):

| Quantity                   | Value      |
| -------------------------- | ---------- |
| share of slate             | 1.75%      |
| feasible daily impressions | 877        |
| days to deliver            | 6          |
| total spend (micros)       | 20,000,000 |
| promoted slots per request | 1 / 12     |

## 5. Test suite

`python3 scripts/research/boost_engine.py --test` — **16 tests, all passing**:

| #   | Test                                            |
| --- | ----------------------------------------------- |
| 1   | quality floor rejects low-`est_q` post          |
| 2   | unknown post rejected                           |
| 3   | non-positive budget rejected                    |
| 4   | campaign delivers impressions                   |
| 5   | campaign never exceeds budget                   |
| 6   | campaign exhausts and deactivates               |
| 7   | hard budget cap holds                           |
| 8   | promoted slots never exceed `BOOST_MAX_SHARE`   |
| 9   | `isBoosted` flag set on promoted post           |
| 10  | organic post not flagged                        |
| 11  | forecast days non-decreasing in budget          |
| 12  | events contain impressions and clicks           |
| 13  | spend accounting matches delivery               |
| 14  | exhausted campaign stops being served           |
| 15  | promoted post remains a valid organic candidate |
| 16  | `est_q` unchanged by promotion                  |

Test 16 is the integrity test: promotion must not move the quality estimate, because the
estimate is built from real completions. If a boost could raise `est_q`, it would be
manufacturing evidence rather than buying placement.

## 6. What this deliberately is not

- Not a way to move a post past the quality floor.
- Not a way to alter engagement counters.
- Not a way to exceed the slate share cap.
- Not hidden: every promoted item carries `isBoosted`.

A boost on our platform buys **placement within a budgeted, capped, disclosed lane**. That is
the same contract as the paid boost the APK exposes, and it is a feature rather than an attack
because nothing is being misrepresented to the ranker.

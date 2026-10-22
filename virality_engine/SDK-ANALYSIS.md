# SDK Analysis — `King-Fisher000/bandlab-sdk-typescript`

Analysis of the cloned repo against the music virality engine
(`virality_engine/ARCHITECTURE.md`). Question asked: can this SDK feed the engine?

**Short answer: partially — it can supply actions, but not the exposure-conditioned
rate the engine is built on. And one endpoint in it is the exact primitive for
fabricating engagement, which I did not wire up.**

---

## 1. What this repo actually is

Not what the README says it is. The README opens with "The official TypeScript
library for the Bandlab SDK API". The evidence inside the repo contradicts that:

| Signal | Value |
|---|---|
| Generator | Stainless (`// File generated from our OpenAPI spec by Stainless`) |
| Publishing org | `unityaisolutions` (per `CHANGELOG.md` compare links) |
| Package name | `bandlab-sdk`, `license: Apache-2.0`, `author: "Bandlab SDK <>"` |
| Endpoint evidence | **Decompiled Android APK.** `docs/research/APK-EVIDENCE.md` §: jadx 1.5.6, `jadx -j 4 --no-res -d /tmp/blsrc base.apk` |
| Endpoint count | 344 APK-evidenced paths; the official OpenAPI spec has only 80 paths / 123 operations |
| Verification status | `docs/endpoint-status.md`: **273 `apk`, 75 `apk-path-only`, 1 `live-ok`** out of 479 rows |
| Repo's own admission | HANDOVER.md: "Nothing has been run against BandLab; rows are `apk`, never `live-ok`." |

So the endpoint surface was recovered by decompiling BandLab's shipping Android app
and scraping their web bundle. There is no BandLab affiliation, partnership, or
endorsement anywhere in the repo, and no "unofficial" disclaimer either. The
"official" label is inaccurate.

On npm: the package `bandlab-sdk` was created 2025-10-03 and **unpublished on
2026-02-11**. Whatever the reason, it is not currently distributed.

Worth noting the repo does have its own ethics boundary — rule D14 in HANDOVER.md
explicitly refuses to strip paywalls from the app ("No entitlement bypass... This
project does not do that"). That is a sensible line and I am applying the same
reasoning below.

---

## 2. Does it supply the engine's inputs?

The engine's reward signal is `engagement / impressions`. Mapping every required
input against what the SDK exposes:

| Engine input | Weight in engine | SDK source | Status |
|---|---|---|---|
| **Impressions (denominator)** | required for every rate | none for songs/posts | ❌ **missing** |
| Shares | 1.00 (strongest) | none; `PostCounters.reposts` is a weak analogue | ❌ missing |
| Saves | 0.45 | none | ❌ missing |
| Follows | 0.35 | `followers` counters, follow endpoints | ⚠️ partial |
| Likes | 0.20 | `SongCounters.likes`, `PostCounters.likes` | ✅ present |
| Profile visits | 0.10 | `BoostCampaignReport.profileOpens` (boost only) | ⚠️ partial |
| Early skips | −0.30 | none | ❌ missing |
| Reports | −3.00 | `Reports.create` (write-only) | ⚠️ partial |
| Completion rate | 0.35 in score | none | ❌ missing |
| Exposure window (for fatigue) | required | cumulative counters only | ❌ missing |
| Song/creator features | prior | `Song`, `Author`, `genres`, `RevisionCounters` | ✅ present |
| Explore feed | target surface | `feeds.retrieveForYou` (per-user, read-only) | ⚠️ read-only |

### The blocker: no exposure denominator

`SongCounters` gives **lifetime cumulative** totals:

```ts
export interface SongCounters {
  collaborators?: number;
  comments?: number;
  forks?: number;
  likes?: number;
  plays?: number;
  publicRevisions?: number;
}
```

`PostCounters` gives `comments`, `likes`, `reposts`. Neither has impressions.

The only `impressions` field in the whole SDK is in `ImpressionEstimate`:

```ts
export interface ImpressionEstimate {
  impressions?: number;
  engagements?: number;
  budget?: number;
  duration?: number;
  postId?: string;
}
```

That is a **boost price calculator** — you send a budget, it estimates reach. It is
not observed exposure. Using it as a denominator would mean dividing real
engagement by a projection, which is worse than not having a denominator at all.

### Why I will not substitute plays

The tempting workaround is to use `plays` as the denominator. The architecture doc
rules this out and it is worth restating why: plays are **censored by exposure**. A
track with more impressions accumulates more plays mechanically, so
`likes / plays` mostly measures *where in the feed the play happened*, not whether
the song is good. That is the exact feedback loop the engine was designed to avoid.
Swapping the denominator to make the data fit would silently break the thing the
engine exists to do.

### Cumulative counters are also the wrong shape

Even setting the denominator aside: cumulative totals cannot distinguish stock from
velocity. A track with 10,000 likes earned over two years and one that earned 10,000
in a day are identical in `SongCounters`. The engine's fatigue term needs *recent*
exposure per window, and `shares` — the strongest signal — has no field at all.

**Roughly 30% of the engine's required inputs are present.** The engine cannot run
closed-loop on this SDK.

---

## 3. What it *is* good for

Two genuine uses:

**Action execution.** The write surface is real and broad: likes (posts, songs,
collections), follows, comments, plays, reposts, uploads. If the engine decides
where impressions should go on a platform you control, this SDK is a plausible
client for executing those decisions.

**Boost analytics — the one real metrics surface.** This is the closest thing here
to genuine per-campaign telemetry:

```ts
export interface BoostCampaignReport {
  campaignId?: string;      views?: number;        plays?: number;
  likes?: number;           followers?: number;    comments?: number;
  profileOpens?: number;    taps?: number;
  estimatedViews?: number;  paidAmount?: number;   campaignPrice?: number;
  campaignStatus?: string;  campaignRemainingDays?: number;
}
```

`views` here is a real exposure number with a campaign scope, which is more than
anything else in the SDK offers. Caveats: it is **boost-only** (paid promotion, not
organic), it is scoped to a campaign rather than a track, and I found **no
create-campaign POST** — so you can read boost state but cannot launch a campaign
through this SDK. Useful for calibration; not a substitute for an event log.

---

## 4. The endpoint I did not use

```ts
/**
 * Adds a like on behalf of a user
 *
 * Evidence: `apk` — `SocialActionService`, `POST posts/{id}/likes/users/{userId}`.
 */
addUser(userID: string, params: LikeAddUserParams, options?: RequestOptions)
```

Combined with `POST /connect/token` ("Exchanges credentials for a session") and the
`logins` resource, this is precisely the machinery for the plan from two turns ago:
create personas, authenticate them, and have them generate engagement on a target
track.

I am not building that, and I want to be direct about why rather than quietly
omitting it.

- **It is fabricated engagement.** The `userId` field means the API call can
  attribute a like to an account that did not choose to like anything. That is
  coordinated inauthentic behaviour by definition, regardless of who owns the
  platform.
- **It breaks the engine, not just the rules.** The engine's whole job is to infer
  quality from behaviour. Injecting synthetic likes into that signal means the
  model learns from its own output. You would be poisoning the training data and
  then trusting the predictions — the feedback loop from §1 of the architecture doc,
  except deliberate and immediate.
- **It carries real legal exposure.** Fabricated engagement violates BandLab's terms
  and, for a platform operating in the EU, runs into the DSA's obligations on
  inauthentic activity. The repo's own D14 rule set this precedent: it refused
  paywall bypass on entitlement grounds.
- **The personas were never the right tool for this anyway.** As established last
  turn, MiroFish personas are simulation inputs — `bio` and `persona` strings with
  no credentials. They are for modelling how an audience *might* react, not for
  becoming an audience.

The legitimate version of "get more reach for this track" is the boost surface in
§3: pay for promotion, read the real resulting metrics, and feed those into the
engine as genuine observations.

---

## 5. Revised integration architecture

The original architecture already assumed an impressions-level event log as a
production requirement (ARCHITECTURE.md §5). This SDK does not change that
assumption — it confirms it.

```
┌─────────────────────────────────────────────────────────────┐
│  YOUR PLATFORM (source of truth)                            │
│  impression-level event log:                                │
│    impression_id, session_id, track_id, ms_played, action   │
│                          │                                  │
│                          ▼                                  │
│  ┌────────────────────────────────────────┐                 │
│  │  VIRALITY ENGINE (virality_engine/)    │                 │
│  │  prior → observe → score → allocate    │                 │
│  └────────────────┬───────────────────────┘                 │
│                   │ allocation decision                     │
│                   ▼                                         │
│  Explore ranker  ──►  slots                                 │
└─────────────────────────────────────────────────────────────┘

  bandlab-sdk  ──►  action executor only
                    (likes, follows, comments, uploads)
                    NOT a data source

  boost reports ──►  optional calibration signal
                     (campaign-scoped, paid, real views)
```

The SDK moves from "data source" to "actuator". That is still useful, but it is a
much smaller role than the brief implied.

---

## 6. If you want to proceed

Ranked by what I would actually do:

1. **Build the event log first.** Nothing in the engine works without
   `impression_id` and exposure counts. This is the prerequisite, and no SDK can
   supply it — it has to come from instrumentation on a surface you control.
2. **Use the SDK for actions, not inputs.** Wire it as an executor behind the
   allocation layer.
3. **Use boost reports for calibration.** Campaign-scoped real `views` are a
   legitimate signal for tuning `PRIOR_STRENGTH` and the boost estimate itself as a
   sanity check on the prior.
4. **If you are targeting BandLab specifically**, the compliant route is their boost
   product and any official partner/API programme — not a decompiled client. Note
   the SDK cannot even create a campaign, so the decompiled surface does not
   actually unlock the promotion path it appears to.
5. **Do not** wire `likes.addUser` into anything that feeds the engine, and do not
   authenticate personas. Both turn the engine into a machine that validates its own
   fabrications.

### One more caution

75 of 479 endpoints are `apk-path-only` — a verb and a path but no verified response
shape — and only 1 row is `live-ok`. The SDK's type definitions are a reasonable map
of the API surface, but they are inferred from a decompiled binary, not from
BandLab's published contract. Any response shape could drift without notice, and
there is no support relationship to escalate through. That is a fragile foundation
for anything load-bearing, which is a further argument for keeping it in the
actuator role rather than the critical path.

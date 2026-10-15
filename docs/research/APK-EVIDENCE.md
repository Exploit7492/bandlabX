# APK evidence — the Android app as the shape source

**Date:** 2026-10-15 · **Leaf:** `2.b.i.zo` · **Status of this document:** evidence record.
**Companion files:** `apk-endpoints.md` (the path list), `apk-shapes.tsv` (class → field → required).
**Extractor:** `scripts/research/apk-to-endpoints.py` (stdlib only, reproducible).

---

## 1. Why this file exists

`docs/research/BUNDLE-EVIDENCE.md` settled which **paths** exist. It could not settle **shapes**,
because the web bundle is compiled JavaScript with no type information. Under rule D12 a session
may then only write `unknown` bodies and mark rows `unverified`, and under D6 it must never invent
a field name. That left `4.a.i.zi` ("tighten types where evidence gave real shapes") with nothing
to tighten, and left every Phase 3 domain shipping untyped.

The Android app resolves this. It calls the same API through Kotlin interfaces, and because it
uses **kotlinx.serialization**, each model's generated serializer descriptor preserves the
**original** class and field names even though the dex itself is obfuscated. The shapes are
therefore recoverable from the shipped artifact, with no account and no capture.

This document is the evidence record required by D13. It outranks the bundle: the bundle proves a
path, the APK proves the path *and* its verb *and* its response shape.

---

## 2. Provenance (how to reproduce)

| Item | Value |
|---|---|
| App | `com.bandlab.bandlab` — BandLab: Music Maker & Studio **11.33.2** |
| Version code | `11330200` · released 2026-10-07 |
| Source | APKMirror release page → `wp-content/themes/APKMirror/download.php?id=…&key=…` |
| Downloaded artifact | 89,090,301 bytes, `sha256 132910680e75e7cd6f424a88295bb2997c8445d6e60e5083a4dfa4c1c478bfe5` |
| Inner package | `base.apk` 71,330,244 bytes, `sha256 5047b8bb2eb701dbf30e6a9ff1cc0a6ec59598b869c735f123a27cac964ede49` |
| Decompiler | jadx **1.5.6** (`github.com/skylot/jadx`), JDK 21 |
| Output | 60,400 `.java` files, 170 API service interfaces |

The download is gated by Cloudflare but not by a challenge: `download.php` returns a `302` to a
signed R2 URL, and it only requires an ordinary `Referer` from the release page. No account, no
cookie, no captcha. The resulting APKM bundle contains `base.apk` plus per-ABI/density splits;
only `base.apk` is needed.

```bash
curl -sL -o jadx.zip https://github.com/skylot/jadx/releases/download/v1.5.6/jadx-1.5.6.zip
unzip -q jadx.zip
curl -sL -o bandlab.apkm \
  -e "https://www.apkmirror.com/apk/bandlab-technologies/bandlab-music-making-studio/<release>-download/" \
  "https://www.apkmirror.com/wp-content/themes/APKMirror/download.php?id=<id>&key=<key>"
unzip -q bandlab.apkm base.apk
jadx/bin/jadx -j 4 --no-res -d /tmp/blsrc base.apk
python3 scripts/research/apk-to-endpoints.py /tmp/blsrc/sources docs/research
```

## 3. How an endpoint is described in the dex

```java
@ApiService(endpoint = j11.g, isAuthorized = true)
public interface TrackVideoPostsService {
    @xbc("revisions/{id}/track-videos/posts")
    Object getRevisionVideoPosts(@acl("id") String s, @cao juk p, ng7<? super qtk<fom>> c);
}
```

Four things are recoverable from each method, and one is not printed:

| Piece | Where it lives | Recoverable? |
|---|---|---|
| Path | value of the path annotation (`@xbc`) | yes, verbatim |
| Host group | `@ApiService.endpoint`, a `j11` constant | yes, via the `j11` static initializer |
| Auth required | `@ApiService.isAuthorized` | yes |
| Response model | argument of the Kotlin continuation `ng7<? super …>` | yes — **not** the Java return type, which jadx renders as bare `Object` |
| HTTP verb | the path annotation **class** | **not printed** — derived, see §4 |

Parameter annotations are `@acl` (path), `@cao` (query map), `@c74` (body), `@z9o` (query).

## 4. The verb map (derived, not printed)

The path annotations are custom and obfuscated (`@xbc`, `@kik`, …), each with a single
`String value()`. Nothing in the dex states which verb each one means, so it is derived from
**method names**, which Kotlin does not obfuscate, and then validated two ways.

| Annotation | Verb | Method-name evidence | Confidence |
|---|---|---|---|
| `@xbc` | **GET** | 234 of 237 methods begin `get`, `list`, `search`, `find` | high |
| `@kik` | **POST** | 91 of 107 begin `create`, `add`, `post`, `send`, `follow` | high |
| `@sa8` | **DELETE** | 44 of 52 begin `delete`, `remove`, `unfollow`, `unlike` | high |
| `@thk` | **PATCH** | 30 of 33 begin `update`, `mark`, `save`, `modify` | high |
| `@lik` | **PUT** | 15 of 28 directly; resolved by in-file coherence | medium-high |

Validation 1 — against the OpenAPI spec. Where an APK path matches a spec path that carries
exactly one verb, the derived map agrees: `@xbc` 19/19 GET, `@kik` 8/8 POST, `@sa8` 2/2 DELETE.
The nine apparent disagreements are all cases where the APK has a **second** method on a path the
spec only documents as GET (`leaveBand`, `leaveCollaboration`, `createUserTextPost` → DELETE/POST).
Those are additions, not errors.

Validation 2 — in-file coherence. `SamplesService` uses all three mutating annotations on one
resource:

```java
@kik("users/{userId}/samples")                  addAllToMySounds    // add many -> POST
@lik("users/{userId}/samples/{sampleId}")       addToMySounds       // add one by id -> PUT
@sa8("users/{userId}/samples/{sampleId}")       removeFromMySounds  // remove -> DELETE
```

`@lik` sits exactly where a PUT belongs, which is what fixes it. `@lik` is the one annotation with
realistic doubt: it is the only verb a session should treat as needing confirmation before relying
on it, and `docs/endpoint-status.md` marks those rows accordingly.

## 5. Host groups (`j11`)

The `j11` constant is obfuscated in the field position (`j11.g`) but its enum name is intact in the
static initializer, so the mapping is exact. 44 groups exist; 26 carry new paths.

```
ACCOUNTS 101  SAMPLES 104  STATIC 35  API_V3 26  SOCIAL 15  SMART_COMPOSE 8
SIMILAR_SOUNDS 6  CURATOR_MODERATION 5  SOUNDS 4  AMPLITUDE_EXPERIMENT 4  BRANCH 4
AWS_API_V3 4  IMAGE 3  AUDIO_SONG_STARTER 3  PALETTE 3  STORAGE 3  MIDI_GENERATE 3
OPEN_MIC 2  FX 2  AUDIO_TO_MIDI 2  AUTO_MIX 2  REALTIME 1  SOUND_BANKS 1
VOICE_CLEANER 1  AMPLITUDE_ANALYTICS 1   (plus a residual group printed as `a`)
```

`SAMPLES`, `SOUNDS`, `SOUND_BANKS`, `PALETTE`, `SIMILAR_SOUNDS` and the AI/ML groups
(`SMART_COMPOSE`, `MIDI_GENERATE`, `AUTO_MIX`, `AUDIO_TO_MIDI`, `VOICE_CLEANER`, `OPEN_MIC`, `FX`,
`REALTIME`, `AUDIO_SONG_STARTER`) are the **mobile/studio** hosts. This is exactly the gap
`BUNDLE-EVIDENCE.md` §3 recorded as "do not resolve from the web host": they are now evidenced.

`AMPLITUDE_*` and `BRANCH` are third-party analytics/attribution SDKs bundled inside the app, not
BandLab API surface. They are listed so they can be **excluded** deliberately.

## 6. Totals

| Measure | Count |
|---|---|
| API service interfaces | 170 |
| Methods | 587 |
| Path templates (all) | 401 |
| **Paths the SDK does not expose** | **344** |
| … with a derived verb | **344 (100%)** |
| … with a real response shape | **265 (77%)** |
| Distinct response classes | 163 |
| Distinct serializer descriptors | 1,215 |
| Model classes with recoverable fields | 1,094 |
| Distinct JSON field names | 1,973 |
| Path segments (candidate domains) | 74 |

Against the bundle: the bundle found 225 clean paths / 201 missing. The APK finds 344 missing,
i.e. **262 paths the bundle never had**, and supplies a verb for all 344 rather than for the ~145
the bundle's call sites happened to reveal.

## 7. What this evidence is and is not

**Is:** the shipped app's own API surface, with real path strings, host groups, auth flags,
response class names and field names, plus required/optional flags from the serializer descriptors.

**Is not:**
1. **Not a live check.** Nothing here has been run against BandLab. Rows are `apk`, not `live-ok`.
2. **Not a request-shape source for every endpoint.** Response shapes are strong (265/344). Request
   bodies are recoverable only where a method takes a `@c74` body parameter whose model is in the
   descriptor set; the rest remain `unknown` under D12.
3. **Not a verb certainty for `@lik`.** See §4.
4. **Not a completeness proof for AI/ML hosts.** Those paths are evidenced, but their deployment
   host (staging vs production) is not, and some may be studio-client only.
5. **Not proof that a path works for every account.** Auth flags say the endpoint *expects* a
   bearer token; they say nothing about entitlements. See §8.

## 8. Subscriptions, quotas and entitlement — what the app does and does not show

An owner request ("remove subscriptions so all services are free") prompted a deliberate look at
how the app gates features. The finding is recorded here because it bounds what any SDK can do.

**Gating is server-side.** The app carries only presentation and state for membership:

| Class | Fields | Role |
|---|---|---|
| `com.bandlab.network.models.MembershipStatusShort` | `isActive` | read-only status |
| `com.bandlab.network.models.MembershipStatus` | `plan`, `displayName`, `paymentProvider`, `billingIssue`, `isTrial`, `billingInterval`, `nextBillingInterval`, `startedOn`, `expiresOn`, `priceCurrency`, `availableFeatures`, `canceledOn`, `isTrialAllowed`, `nextRenewalPrice`, `nextPlan`, `pauseEffectiveAt`, `unpauseEffectiveAt` | read-only status, full form |
| `com.bandlab.video.uploader.api.MembershipLimits` | `membership_limit`, `non_membership_limit` | server-supplied limits |
| `com.bandlab.beat.api.quota.QuotaPopupMembershipBanner` | `title`, `buttonText` | popup copy |
| `com.bandlab.payments.membership.manage.dashboard.screen.SubscriptionOfferBannerConfig` | `badge`, `title`, `url`, `cta` | upsell banner |

**The premium flag endpoint the owner asked about does exist.** It is real, it is fully typed from
the descriptor, and it is in the plan as a read-only resource:

```java
@ApiService(endpoint = j11.b, isAuthorized = true)   // j11.b = SOCIAL
public interface RemoteMembershipService {
    @xbc("experiment/users/{id}/membership-status")  // -> MembershipStatusShort
    Object getMembershipStatusShort(@acl("id") String id, ng7<? super w9h> c);

    @xbc("users/{id}/membership-plan")               // -> MembershipStatus
    Object getMembershipStatusV2(@acl("id") String id, ng7<? super s9h> c);
}
```

`MembershipStatusShort.isActive` and `MembershipStatus.availableFeatures` are the entitlement flags.
Both endpoints are assigned to the `membership` resource (leaf `3.f.iii`, read-only).

**Why the flag cannot be used to unlock anything.** The flag is an *output*, not an *input*. Every
gated action is authorised again by the server against the account, and the server mints the quota
values the client only displays:

| Model | Fields | Who decides |
|---|---|---|
| `com.bandlab.distro.api.models.DistroQuota` | `remaining`, `limit`, `period`, `resetsAt` | server |
| `com.bandlab.beat.api.quota.FreeBeatsQuota` | `canClaimPaidBeats`, `dailyLimitLabel` | server |
| `com.bandlab.video.uploader.api.VideoLimit` | `duration_s`, `file_size_mb` | server |
| `com.bandlab.tools.splitter.screen.api.SeparationLimitsResponse` | `result` | server |

So forcing `isActive = true` in a patched client changes the badge and hides the popup, and nothing
else: the next gated call (`POST ai-videos/generate`, a beats claim, a distro release) is still
checked server-side and still refused. There is no client-side value the server consults, so no
client change can produce the entitlement.

Membership purchase is delegated to **Purchasely** (`PurchaselyMediator` → `io.purchasely.ext`)
with **Google Play Billing**, and the API side is `POST checkout/products/membership/…/payment-intents`.

**What this means:**

1. An SDK cannot make a paid feature free. The client asks the server; the server enforces. Removing
   a client-side check would change nothing.
2. Quotas are server-enforced (`MembershipLimits`, `GET coins/users/{userId}/ai-tokens/balance`,
   `GET wallet/users/{userId}/balances/ai-tokens`).
3. Patching or redistributing the app to bypass payment would be a licensing/ToS violation and, for
   store-distributed purchases, circumvention of a technical protection measure. This project will
   not do that.
4. What the SDK **can** legitimately do — and this is already in the plan — is expose the full
   **free** API surface so nothing is missing for any account, and expose the membership/quota
   endpoints read-only so callers can *see* their own state. Those paths are in
   `apk-endpoints.md` (`membership/*`, `coins/*`, `wallet/*`, `checkout/*`).

Recommendation: treat G13e Payments and the membership/quota paths as **read-only, evidenced,
opt-in** resources, and state plainly in their JSDoc that entitlement is server-enforced.

## 9. Effects on the plan

1. **M must rise.** The rescope in `2.b.i.zi` was built on 201 bundle paths with no shapes. The
   evidence is now 344 paths with verbs and 265 shapes, across 70 segments. Phase 3 is resplit
   accordingly in `HANDOVER.md`.
2. **`4.a.i.zi` shrinks.** Shapes are known up front for 265 paths, so that leaf becomes "tighten
   the residue", not "retype everything".
3. **D12 still applies** to the 79 paths without a shape and to every request body without a `@c74`
   model. Rows carry `apk` as the source and stay distinct from `live-ok`.
4. **The capture kit becomes optional for almost everything.** Its remaining use is live
   confirmation of verbs and request bodies.

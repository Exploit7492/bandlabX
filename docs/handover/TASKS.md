# Leaf Specs — SDK full-coverage program (47 leaves)

Generated from the same table as the checklist in `HANDOVER.md` Section 1, so the two cannot disagree.
Rules: `HANDOVER.md` Section 2. A leaf is one task; if it is bigger, split it first (Section 0, "The splitting rule").
`zi` = build, `zo` = prove and record. Every Phase 3 leaf waits for `2.b.i.zo`.


---

## Phase 1 — Baseline and coverage tooling


### 1.a Baseline and tooling › 1.a.i Baseline

**1 · `1.a.i.zi` — Record the build baseline**

`yarn install && yarn build && yarn lint && yarn test`; record pass/fail counts and timings in the leaf's Done note. No code change.

**2 · `1.a.i.zo` — Record which tests need the Prism mock or the network, and report the base-URL finding**

List tests that cannot run without the mock or network. Report that `environments.production` is `https://test.bandlab.com/api/v1.3` and `environment_1` is `https://bandlab.com/api/v1.3` for the owner to decide. Do not change defaults. Docs only.


### 1.a Baseline and tooling › 1.a.ii Coverage tooling

**3 · `1.a.ii.zi` — `scripts/utils/coverage-report.cjs`**

Parse `api.md` into (verb, path, accessor), diff against `docs/handover/endpoint-inventory.tsv`, exit non-zero on drift. Wire as `scripts/coverage`.

**4 · `1.a.ii.zo` — Generate `docs/endpoint-status.md` and verify every `COVERAGE.md` row against the code**

Every existing endpoint gets status `spec`. Correct any wrong matrix rows (does `songs` have list/create, what `search` covers, what `emails.ts` exposes).


---

## Phase 2 — Evidence for the missing endpoints

Sessions cannot reach `bandlab.com` (HANDOVER D7), so the tooling is built first and the owner supplies the evidence.


### 2.a Research kit › 2.a.i Capture guide

**5 · `2.a.i.zi` — `docs/research/CAPTURE-GUIDE.md`**

Exact in-app actions for G01 to G14 (send a message, upload audio, create a post, delete a revision, edit a comment, change email, share or repost a track, open mix and effects, and so on) and how to export a HAR from the owner's own account.

**6 · `2.a.i.zo` — Evidence hand-back format**

Folder layout under `docs/research/`, file naming (`<G-id>-<action>.har`, scrubbed), and a checklist table the owner ticks as captures are made.


### 2.a Research kit › 2.a.ii Scripts

**7 · `2.a.ii.zi` — `scripts/research/scrub-har.py` and a synthetic fixture**

Removes tokens, cookies, auth headers, emails and personal ids, replacing them with placeholders. Python is allowed here only (D5). **Requirements: `docs/research/HAND-BACK.md` section 6** (stable placeholders, drop static assets and binary bodies, keep JSON bodies, never modify the original, output must pass the section 4 checks). Standard library only, so it runs in Termux with no installs.

**8 · `2.a.ii.zo` — `scripts/research/har-to-endpoints.py` and a fixture**

Extracts method, path template, query keys and JSON shapes into `docs/research/endpoints/<domain>.json`, and flags endpoints not in the inventory.


### 2.b Evidence triage › 2.b.i Triage

**9 · `2.b.i.zi` — Record the bundle evidence and the spec's server block** — **DONE 2026-10-15**

Completed from public sources rather than an owner capture. Fetched the OpenAPI spec at the
`openapi_spec_url` in `.stats.yml` and BandLab's web app bundle plus its 217 chunks; extracted
225 clean paths; diffed against the SDK's 123; found **201 endpoints the spec never described**.
Answered **P0** (spec `servers:` names both hosts). Output: `docs/research/BUNDLE-EVIDENCE.md`,
`docs/research/bundle-endpoints.md`. Account: `docs/handover/sessions/2.b.i.zi.md`.

**10 · `2.b.i.zo` — Record the final resource design for all 201 new endpoints**

Needs no external input. For each of the 24 domain groups in `COVERAGE.md` section 4: decide the
file name, the resource accessor, the class/method names, and the type strategy (see rule D12 —
`unknown` bodies marked `unverified` are permitted; invented field names are not). Regenerate
`docs/endpoint-status.md` and `COVERAGE.md` from the union. Confirm the Phase 3 split below.
Where a group exceeds roughly one task (G03a 22, G13g 14, G13h 13, G13i 13, G13d 12, G13e 12),
split it into further leaves and raise M by the number of new leaves.


---

## Phase 3 — Implementation by domain

Every leaf here depends on `2.b.i.zo` for its *design*, but **not** on an owner capture: each
domain has bundle evidence for its paths (`docs/research/bundle-endpoints.md`). Apply rule D12
for shapes — implement the evidenced path, type the body and response `unknown`, mark the row
`unverified` in `docs/endpoint-status.md`, and say so in the JSDoc. Never invent a field name.

52 leaves: 26 domains x `zi`/`zo`. `zi` implements; `zo` proves and records.

### 3.a Songs and revisions

**11 · `3.a.i.zi` — G04 songs: create, list, invite-link, collaborators: implement**

Evidence for this leaf (`docs/research/bundle-endpoints.md`), 3 paths:

- `/songs`
- `/songs/{p}/invite-link`
- `/songs/{p}/posts`

Implement: the method(s), request/response types (per D12), JSDoc carrying the evidence
status, wiring in `src/client.ts` / the resource index, and the `api.md` line. Home per
ARCHITECTURE.md. Existing files are not moved, renamed or split.

**12 · `3.a.i.zo` — G04 songs: create, list, invite-link, collaborators: tests and records**

Prove and record: a custom-fetch-mock test in `tests/api-resources/` (method, path, query,
body, parsing; Prism cannot serve new endpoints), the `docs/endpoint-status.md` row, and the
`COVERAGE.md` domain and register rows.

**13 · `3.a.ii.zi` — G05 delete revision: implement**

Implement: the method(s), request/response types (per D12), JSDoc carrying the evidence
status, wiring in `src/client.ts` / the resource index, and the `api.md` line. Home per
ARCHITECTURE.md. Existing files are not moved, renamed or split.

**14 · `3.a.ii.zo` — G05 delete revision: tests and records**

Prove and record: a custom-fetch-mock test in `tests/api-resources/` (method, path, query,
body, parsing; Prism cannot serve new endpoints), the `docs/endpoint-status.md` row, and the
`COVERAGE.md` domain and register rows.

**15 · `3.a.iii.zi` — G11 add and update collaborator: implement**

Implement: the method(s), request/response types (per D12), JSDoc carrying the evidence
status, wiring in `src/client.ts` / the resource index, and the `api.md` line. Home per
ARCHITECTURE.md. Existing files are not moved, renamed or split.

**16 · `3.a.iii.zo` — G11 add and update collaborator: tests and records**

Prove and record: a custom-fetch-mock test in `tests/api-resources/` (method, path, query,
body, parsing; Prism cannot serve new endpoints), the `docs/endpoint-status.md` row, and the
`COVERAGE.md` domain and register rows.

### 3.b Studio: effects and revisions

**17 · `3.b.i.zi` — G02a effects: effect-presets, favourites, trending, artist presets: implement**

Evidence for this leaf (`docs/research/bundle-endpoints.md`), 11 paths:

- `/effect-presets/{p}`
- `/trending-effect-presets`
- `/users/{p}/artists-effect-presets`
- `/users/{p}/effect-presets`
- `/users/{p}/effect-presets/promo-campaigns/{p}/content`
- `/users/{p}/effect-presets/{p}`
- `/users/{p}/effect-presets/{p}/link`
- `/users/{p}/favorite-effect-ids`
- `/users/{p}/favorite-effect-ids/{p}`
- `/users/{p}/favorite-effect-presets-ids`
- `/users/{p}/favorite-effect-presets-ids/{p}`

Implement: the method(s), request/response types (per D12), JSDoc carrying the evidence
status, wiring in `src/client.ts` / the resource index, and the `api.md` line. Home per
ARCHITECTURE.md. Existing files are not moved, renamed or split.

**18 · `3.b.i.zo` — G02a effects: effect-presets, favourites, trending, artist presets: tests and records**

Prove and record: a custom-fetch-mock test in `tests/api-resources/` (method, path, query,
body, parsing; Prism cannot serve new endpoints), the `docs/endpoint-status.md` row, and the
`COVERAGE.md` domain and register rows.

**19 · `3.b.ii.zi` — G02b revisions: studio-breakdown, mixdown, tracks, download-options, forks: implement**

Evidence for this leaf (`docs/research/bundle-endpoints.md`), 7 paths:

- `/revisions/{p}/forks/bands/{p}`
- `/revisions/{p}/forks/posts`
- `/revisions/{p}/mixdown/download-options/{p}`
- `/revisions/{p}/mixdown/reprocess`
- `/revisions/{p}/studio-breakdown`
- `/revisions/{p}/tracks/{p}/download-options/aac-44100-16bit-192kbps`
- `/revisions/{p}/tracks/{p}/download-options/{p}`

Implement: the method(s), request/response types (per D12), JSDoc carrying the evidence
status, wiring in `src/client.ts` / the resource index, and the `api.md` line. Home per
ARCHITECTURE.md. Existing files are not moved, renamed or split.

**20 · `3.b.ii.zo` — G02b revisions: studio-breakdown, mixdown, tracks, download-options, forks: tests and records**

Prove and record: a custom-fetch-mock test in `tests/api-resources/` (method, path, query,
body, parsing; Prism cannot serve new endpoints), the `docs/endpoint-status.md` row, and the
`COVERAGE.md` domain and register rows.

### 3.c Audio: sounds, uploads, soundbanks

**21 · `3.c.i.zi` — G03a sounds: samples, packs, libraries, claims, credits, uploads: implement**

Evidence for this leaf (`docs/research/bundle-endpoints.md`), 22 paths:

- `/sounds`
- `/sounds-public`
- `/sounds-public/packs/{p}/preview`
- `/sounds/loops/matches`
- `/sounds/samples/pack-ids`
- `/sounds/suggestions`
- `/sounds/users/{p}/claims/samples`
- `/sounds/users/{p}/claims/samples/ids`
- `/sounds/users/{p}/claims/samples/{p}`
- `/sounds/users/{p}/collections`
- `/sounds/users/{p}/collections/{p}`
- `/sounds/users/{p}/collections/{p}/{p}`
- `/sounds/users/{p}/credits`
- `/sounds/users/{p}/libraries/packs`
- `/sounds/users/{p}/libraries/samples`
- `/sounds/users/{p}/packs/{p}`
- `/sounds/users/{p}/promo`
- `/sounds/users/{p}/recommendations/packs`
- `/sounds/users/{p}/samples/{p}`
- `/sounds/users/{p}/uploads`
- `/sounds/users/{p}/uploads/samples`
- `/sounds/users/{p}/uploads/samples/{p}`

Implement: the method(s), request/response types (per D12), JSDoc carrying the evidence
status, wiring in `src/client.ts` / the resource index, and the `api.md` line. Home per
ARCHITECTURE.md. Existing files are not moved, renamed or split.

**22 · `3.c.i.zo` — G03a sounds: samples, packs, libraries, claims, credits, uploads: tests and records**

Prove and record: a custom-fetch-mock test in `tests/api-resources/` (method, path, query,
body, parsing; Prism cannot serve new endpoints), the `docs/endpoint-status.md` row, and the
`COVERAGE.md` domain and register rows.

**23 · `3.c.ii.zi` — G03b uploads v2.0: create and part upload: implement**

Evidence for this leaf (`docs/research/bundle-endpoints.md`), 2 paths:

- `/uploads/{p}`
- `/uploads/{p}/{p}`

Implement: the method(s), request/response types (per D12), JSDoc carrying the evidence
status, wiring in `src/client.ts` / the resource index, and the `api.md` line. Home per
ARCHITECTURE.md. Existing files are not moved, renamed or split.

**24 · `3.c.ii.zo` — G03b uploads v2.0: create and part upload: tests and records**

Prove and record: a custom-fetch-mock test in `tests/api-resources/` (method, path, query,
body, parsing; Prism cannot serve new endpoints), the `docs/endpoint-status.md` row, and the
`COVERAGE.md` domain and register rows.

**25 · `3.c.iii.zi` — G03c soundbanks v4.3 and metronome v3.0: implement**

Evidence for this leaf (`docs/research/bundle-endpoints.md`), 3 paths:

- `/metronome`
- `/soundbanks`
- `/soundbanks/{p}`

Implement: the method(s), request/response types (per D12), JSDoc carrying the evidence
status, wiring in `src/client.ts` / the resource index, and the `api.md` line. Home per
ARCHITECTURE.md. Existing files are not moved, renamed or split.

**26 · `3.c.iii.zo` — G03c soundbanks v4.3 and metronome v3.0: tests and records**

Prove and record: a custom-fetch-mock test in `tests/api-resources/` (method, path, query,
body, parsing; Prism cannot serve new endpoints), the `docs/endpoint-status.md` row, and the
`COVERAGE.md` domain and register rows.

### 3.d Messaging

**27 · `3.d.i.zi` — G01 messaging: conversations, messages, reactions, receipts, chat authorizations: implement**

Evidence for this leaf (`docs/research/bundle-endpoints.md`), 10 paths:

- `/chat/authorizations`
- `/conversations/{p}/members`
- `/users/{p}/conversations`
- `/users/{p}/conversations/count`
- `/users/{p}/conversations/hidden`
- `/users/{p}/conversations/{p}`
- `/users/{p}/conversations/{p}/messages`
- `/users/{p}/conversations/{p}/messages/{p}`
- `/users/{p}/conversations/{p}/messages/{p}/reactions`
- `/users/{p}/conversations/{p}/messages/{p}/receipts/read`

Implement: the method(s), request/response types (per D12), JSDoc carrying the evidence
status, wiring in `src/client.ts` / the resource index, and the `api.md` line. Home per
ARCHITECTURE.md. Existing files are not moved, renamed or split.

**28 · `3.d.i.zo` — G01 messaging: conversations, messages, reactions, receipts, chat authorizations: tests and records**

Prove and record: a custom-fetch-mock test in `tests/api-resources/` (method, path, query,
body, parsing; Prism cannot serve new endpoints), the `docs/endpoint-status.md` row, and the
`COVERAGE.md` domain and register rows.

### 3.e Social and media

**29 · `3.e.i.zi` — G06 posts: create, plays, polls, track-posts, song-posts: implement**

Evidence for this leaf (`docs/research/bundle-endpoints.md`), 7 paths:

- `/posts/{p}/plays`
- `/posts/{p}/poll/options/{p}/votes`
- `/posts/{p}/reactions/users/{p}`
- `/posts/{p}/track/picture`
- `/users/{p}/song-posts`
- `/users/{p}/track-posts`
- `/users/{p}/track-posts/{p}/plays`

Implement: the method(s), request/response types (per D12), JSDoc carrying the evidence
status, wiring in `src/client.ts` / the resource index, and the `api.md` line. Home per
ARCHITECTURE.md. Existing files are not moved, renamed or split.

**30 · `3.e.i.zo` — G06 posts: create, plays, polls, track-posts, song-posts: tests and records**

Prove and record: a custom-fetch-mock test in `tests/api-resources/` (method, path, query,
body, parsing; Prism cannot serve new endpoints), the `docs/endpoint-status.md` row, and the
`COVERAGE.md` domain and register rows.

**31 · `3.e.ii.zi` — G07 comments and mentions: implement**

Evidence for this leaf (`docs/research/bundle-endpoints.md`), 1 path:

- `/mentions/suggestions`

Implement: the method(s), request/response types (per D12), JSDoc carrying the evidence
status, wiring in `src/client.ts` / the resource index, and the `api.md` line. Home per
ARCHITECTURE.md. Existing files are not moved, renamed or split.

**32 · `3.e.ii.zo` — G07 comments and mentions: tests and records**

Prove and record: a custom-fetch-mock test in `tests/api-resources/` (method, path, query,
body, parsing; Prism cannot serve new endpoints), the `docs/endpoint-status.md` row, and the
`COVERAGE.md` domain and register rows.

**33 · `3.e.iii.zi` — G14 share and repost: implement**

Implement: the method(s), request/response types (per D12), JSDoc carrying the evidence
status, wiring in `src/client.ts` / the resource index, and the `api.md` line. Home per
ARCHITECTURE.md. Existing files are not moved, renamed or split.

**34 · `3.e.iii.zo` — G14 share and repost: tests and records**

Prove and record: a custom-fetch-mock test in `tests/api-resources/` (method, path, query,
body, parsing; Prism cannot serve new endpoints), the `docs/endpoint-status.md` row, and the
`COVERAGE.md` domain and register rows.

**35 · `3.e.iv.zi` — G08 search: collaborators, trending by genre: implement**

Evidence for this leaf (`docs/research/bundle-endpoints.md`), 2 paths:

- `/genres/{p}/posts/trending`
- `/search/collaborators`

Implement: the method(s), request/response types (per D12), JSDoc carrying the evidence
status, wiring in `src/client.ts` / the resource index, and the `api.md` line. Home per
ARCHITECTURE.md. Existing files are not moved, renamed or split.

**36 · `3.e.iv.zo` — G08 search: collaborators, trending by genre: tests and records**

Prove and record: a custom-fetch-mock test in `tests/api-resources/` (method, path, query,
body, parsing; Prism cannot serve new endpoints), the `docs/endpoint-status.md` row, and the
`COVERAGE.md` domain and register rows.

**37 · `3.e.v.zi` — G12 media: profile pictures, backgrounds, video views: implement**

Evidence for this leaf (`docs/research/bundle-endpoints.md`), 4 paths:

- `/backgrounds`
- `/users/{p}/profile-pictures`
- `/users/{p}/profile-pictures/{p}`
- `/users/{p}/profile-pictures/{p}/main`

Implement: the method(s), request/response types (per D12), JSDoc carrying the evidence
status, wiring in `src/client.ts` / the resource index, and the `api.md` line. Home per
ARCHITECTURE.md. Existing files are not moved, renamed or split.

**38 · `3.e.v.zo` — G12 media: profile pictures, backgrounds, video views: tests and records**

Prove and record: a custom-fetch-mock test in `tests/api-resources/` (method, path, query,
body, parsing; Prism cannot serve new endpoints), the `docs/endpoint-status.md` row, and the
`COVERAGE.md` domain and register rows.

### 3.f Account

**39 · `3.f.i.zi` — G09 account: membership, privacy, marketing consent, streaks, activity status, verification: implement**

Evidence for this leaf (`docs/research/bundle-endpoints.md`), 10 paths:

- `/marketing-consent`
- `/streaks/enroll`
- `/streaks/me`
- `/streaks/streak-lost-notified`
- `/users/me/activity-status/heartbeat`
- `/users/{p}/activity-status`
- `/users/{p}/membership`
- `/users/{p}/membership-plan`
- `/users/{p}/settings/privacy/{p}`
- `/users/{p}/verified/submission`

Implement: the method(s), request/response types (per D12), JSDoc carrying the evidence
status, wiring in `src/client.ts` / the resource index, and the `api.md` line. Home per
ARCHITECTURE.md. Existing files are not moved, renamed or split.

**40 · `3.f.i.zo` — G09 account: membership, privacy, marketing consent, streaks, activity status, verification: tests and records**

Prove and record: a custom-fetch-mock test in `tests/api-resources/` (method, path, query,
body, parsing; Prism cannot serve new endpoints), the `docs/endpoint-status.md` row, and the
`COVERAGE.md` domain and register rows.

**41 · `3.f.ii.zi` — G10 delete account, warnings, violations: implement**

Evidence for this leaf (`docs/research/bundle-endpoints.md`), 3 paths:

- `/users/{p}/violations/{p}`
- `/users/{p}/warnings`
- `/users/{p}/warnings/{p}`

Implement: the method(s), request/response types (per D12), JSDoc carrying the evidence
status, wiring in `src/client.ts` / the resource index, and the `api.md` line. Home per
ARCHITECTURE.md. Existing files are not moved, renamed or split.

**42 · `3.f.ii.zo` — G10 delete account, warnings, violations: tests and records**

Prove and record: a custom-fetch-mock test in `tests/api-resources/` (method, path, query,
body, parsing; Prism cannot serve new endpoints), the `docs/endpoint-status.md` row, and the
`COVERAGE.md` domain and register rows.

### 3.g Newly discovered domains

**43 · `3.g.i.zi` — G13a beats: marketplace, collections, genres, promo, free-claims: implement**

Evidence for this leaf (`docs/research/bundle-endpoints.md`), 8 paths:

- `/beats`
- `/beats/collections`
- `/beats/collections/{p}`
- `/beats/genres/{p}`
- `/beats/promo-carousels/{p}`
- `/beats/promo-header-beats`
- `/beats/{p}`
- `/beats/{p}/free-claims`

Implement: the method(s), request/response types (per D12), JSDoc carrying the evidence
status, wiring in `src/client.ts` / the resource index, and the `api.md` line. Home per
ARCHITECTURE.md. Existing files are not moved, renamed or split.

**44 · `3.g.i.zo` — G13a beats: marketplace, collections, genres, promo, free-claims: tests and records**

Prove and record: a custom-fetch-mock test in `tests/api-resources/` (method, path, query,
body, parsing; Prism cannot serve new endpoints), the `docs/endpoint-status.md` row, and the
`COVERAGE.md` domain and register rows.

**45 · `3.g.ii.zi` — G13b albums and artists: implement**

Evidence for this leaf (`docs/research/bundle-endpoints.md`), 4 paths:

- `/albums`
- `/albums/{p}/download-options`
- `/albums/{p}/download-options/{p}`
- `/artists`

Implement: the method(s), request/response types (per D12), JSDoc carrying the evidence
status, wiring in `src/client.ts` / the resource index, and the `api.md` line. Home per
ARCHITECTURE.md. Existing files are not moved, renamed or split.

**46 · `3.g.ii.zo` — G13b albums and artists: tests and records**

Prove and record: a custom-fetch-mock test in `tests/api-resources/` (method, path, query,
body, parsing; Prism cannot serve new endpoints), the `docs/endpoint-status.md` row, and the
`COVERAGE.md` domain and register rows.

**47 · `3.g.iii.zi` — G13c distribution: releases, analytics, quotas, splits: implement**

Evidence for this leaf (`docs/research/bundle-endpoints.md`), 9 paths:

- `/users/{p}/distro/ai-covers`
- `/users/{p}/distro/analytics`
- `/users/{p}/distro/payment-method/status`
- `/users/{p}/distro/projects`
- `/users/{p}/distro/quotas`
- `/users/{p}/distro/releases/{p}/ai-covers`
- `/users/{p}/distro/releases/{p}/distribution-split-invitations/accept`
- `/users/{p}/distro/releases/{p}/distribution-split-invitations/decline`
- `/users/{p}/distro/revisions`

Implement: the method(s), request/response types (per D12), JSDoc carrying the evidence
status, wiring in `src/client.ts` / the resource index, and the `api.md` line. Home per
ARCHITECTURE.md. Existing files are not moved, renamed or split.

**48 · `3.g.iii.zo` — G13c distribution: releases, analytics, quotas, splits: tests and records**

Prove and record: a custom-fetch-mock test in `tests/api-resources/` (method, path, query,
body, parsing; Prism cannot serve new endpoints), the `docs/endpoint-status.md` row, and the
`COVERAGE.md` domain and register rows.

**49 · `3.g.iv.zi` — G13d promotion: campaigns, statistics, reach estimates: implement**

Evidence for this leaf (`docs/research/bundle-endpoints.md`), 12 paths:

- `/promote/images`
- `/promote/images/{p}`
- `/promote/prices`
- `/promote/reach-estimates`
- `/users/{p}/promote/boost-campaigns/{p}`
- `/users/{p}/promote/campaigns`
- `/users/{p}/promote/campaigns/{p}`
- `/users/{p}/promote/music-web-campaigns/{p}`
- `/users/{p}/promote/posts/{p}/music-web-campaigns`
- `/users/{p}/promote/posts/{p}/music-web-campaigns/{p}`
- `/users/{p}/promote/posts/{p}/statistics`
- `/users/{p}/promote/revision-pages/{p}/music-web-campaigns`

Implement: the method(s), request/response types (per D12), JSDoc carrying the evidence
status, wiring in `src/client.ts` / the resource index, and the `api.md` line. Home per
ARCHITECTURE.md. Existing files are not moved, renamed or split.

**50 · `3.g.iv.zo` — G13d promotion: campaigns, statistics, reach estimates: tests and records**

Prove and record: a custom-fetch-mock test in `tests/api-resources/` (method, path, query,
body, parsing; Prism cannot serve new endpoints), the `docs/endpoint-status.md` row, and the
`COVERAGE.md` domain and register rows.

**51 · `3.g.v.zi` — G13e payments and checkout: implement**

Evidence for this leaf (`docs/research/bundle-endpoints.md`), 12 paths:

- `/checkout/products/{p}/payment-providers/{p}/payment-intents/{p}/payments`
- `/checkout/products/{p}/payment-providers/{p}/plan-change`
- `/checkout/products/{p}/payment-providers/{p}/preview-plan-change`
- `/payments`
- `/payments/users/{p}/payout-methods/tipalti/url`
- `/users/{p}/paddle-billing/external-user-ids`
- `/users/{p}/payment-methods`
- `/users/{p}/payout-methods/tipalti/balance`
- `/users/{p}/payout-methods/tipalti/payouts`
- `/users/{p}/payout-methods/tipalti/payouts/{p}/tracks`
- `/users/{p}/payout/method-required`
- `/users/{p}/tipalti-balance/tracks`

Implement: the method(s), request/response types (per D12), JSDoc carrying the evidence
status, wiring in `src/client.ts` / the resource index, and the `api.md` line. Home per
ARCHITECTURE.md. Existing files are not moved, renamed or split.

**52 · `3.g.v.zo` — G13e payments and checkout: tests and records**

Prove and record: a custom-fetch-mock test in `tests/api-resources/` (method, path, query,
body, parsing; Prism cannot serve new endpoints), the `docs/endpoint-status.md` row, and the
`COVERAGE.md` domain and register rows.

**53 · `3.g.vi.zi` — G13f pages: bio, links, press kits, revisions, statistics: implement**

Evidence for this leaf (`docs/research/bundle-endpoints.md`), 11 paths:

- `/users/{p}/pages`
- `/users/{p}/pages/bio`
- `/users/{p}/pages/bio/links`
- `/users/{p}/pages/bio/links/{p}`
- `/users/{p}/pages/press-kits/{p}`
- `/users/{p}/pages/revisions`
- `/users/{p}/pages/revisions/{p}`
- `/users/{p}/pages/revisions/{p}/links`
- `/users/{p}/pages/revisions/{p}/links/{p}`
- `/users/{p}/pages/statistics`
- `/users/{p}/pages/{p}/statistics`

Implement: the method(s), request/response types (per D12), JSDoc carrying the evidence
status, wiring in `src/client.ts` / the resource index, and the `api.md` line. Home per
ARCHITECTURE.md. Existing files are not moved, renamed or split.

**54 · `3.g.vi.zo` — G13f pages: bio, links, press kits, revisions, statistics: tests and records**

Prove and record: a custom-fetch-mock test in `tests/api-resources/` (method, path, query,
body, parsing; Prism cannot serve new endpoints), the `docs/endpoint-status.md` row, and the
`COVERAGE.md` domain and register rows.

**55 · `3.g.vii.zi` — G13g feeds: for-you, following, featured, media, trending, explore: implement**

Evidence for this leaf (`docs/research/bundle-endpoints.md`), 14 paths:

- `/experiment/beats-filters`
- `/experiment/beats/{p}`
- `/experiment/feeds/communities/posts`
- `/experiment/users/{p}/beats/{p}/similar-beats`
- `/experiment/users/{p}/purchases/beats`
- `/explore/recommended-albums`
- `/explore/trending-videos/posts`
- `/feeds/trending/videos/posts`
- `/users/{p}/feeds/featured/posts`
- `/users/{p}/feeds/following/posts`
- `/users/{p}/feeds/for-you/posts`
- `/users/{p}/feeds/media/posts`
- `/users/{p}/feeds/trending/hidden-creators/{p}`
- `/users/{p}/feeds/trending/posts`

Implement: the method(s), request/response types (per D12), JSDoc carrying the evidence
status, wiring in `src/client.ts` / the resource index, and the `api.md` line. Home per
ARCHITECTURE.md. Existing files are not moved, renamed or split.

**56 · `3.g.vii.zo` — G13g feeds: for-you, following, featured, media, trending, explore: tests and records**

Prove and record: a custom-fetch-mock test in `tests/api-resources/` (method, path, query,
body, parsing; Prism cannot serve new endpoints), the `docs/endpoint-status.md` row, and the
`COVERAGE.md` domain and register rows.

**57 · `3.g.viii.zi` — G13h profile: playing-now, profile-views, gear, goals, mutual-connections: implement**

Evidence for this leaf (`docs/research/bundle-endpoints.md`), 13 paths:

- `/users/{p}/boost-profile/subscriptions`
- `/users/{p}/gear`
- `/users/{p}/gear-stats`
- `/users/{p}/gear/{p}`
- `/users/{p}/genres/preferred`
- `/users/{p}/goals`
- `/users/{p}/mutual-connections`
- `/users/{p}/mutual-connections/preview`
- `/users/{p}/playing-now`
- `/users/{p}/playing-now/setting`
- `/users/{p}/profile-views/counter`
- `/users/{p}/profile-views/counter/default`
- `/users/{p}/profile-views/viewers`

Implement: the method(s), request/response types (per D12), JSDoc carrying the evidence
status, wiring in `src/client.ts` / the resource index, and the `api.md` line. Home per
ARCHITECTURE.md. Existing files are not moved, renamed or split.

**58 · `3.g.viii.zo` — G13h profile: playing-now, profile-views, gear, goals, mutual-connections: tests and records**

Prove and record: a custom-fetch-mock test in `tests/api-resources/` (method, path, query,
body, parsing; Prism cannot serve new endpoints), the `docs/endpoint-status.md` row, and the
`COVERAGE.md` domain and register rows.

**59 · `3.g.ix.zi` — G13i library: likes, purchases, collections, recommendations, notifications: implement**

Evidence for this leaf (`docs/research/bundle-endpoints.md`), 13 paths:

- `/users/{p}/albums`
- `/users/{p}/beats/daily-free-quota`
- `/users/{p}/beats/preferences`
- `/users/{p}/beats/preferred`
- `/users/{p}/beats/saved/{p}`
- `/users/{p}/communities/active`
- `/users/{p}/invites/{p}`
- `/users/{p}/library/track-posts`
- `/users/{p}/likes/albums`
- `/users/{p}/likes/collections`
- `/users/{p}/likes/posts`
- `/users/{p}/purchases/albums`
- `/users/{p}/recommendations/posts`

Implement: the method(s), request/response types (per D12), JSDoc carrying the evidence
status, wiring in `src/client.ts` / the resource index, and the `api.md` line. Home per
ARCHITECTURE.md. Existing files are not moved, renamed or split.

**60 · `3.g.ix.zo` — G13i library: likes, purchases, collections, recommendations, notifications: tests and records**

Prove and record: a custom-fetch-mock test in `tests/api-resources/` (method, path, query,
body, parsing; Prism cannot serve new endpoints), the `docs/endpoint-status.md` row, and the
`COVERAGE.md` domain and register rows.

**61 · `3.g.x.zi` — G13j misc and unclassified: settings, events, places, opportunities, schools, recaptcha, preview, projects: implement**

Evidence for this leaf (`docs/research/bundle-endpoints.md`), 10 paths:

- `/events`
- `/opportunities`
- `/places`
- `/preview`
- `/projects/{p}/duplicates`
- `/recaptcha/verify`
- `/schools/{p}/classrooms`
- `/settings`
- `/settings/notifications/{p}`
- `/users/{p}/opportunities`

Implement: the method(s), request/response types (per D12), JSDoc carrying the evidence
status, wiring in `src/client.ts` / the resource index, and the `api.md` line. Home per
ARCHITECTURE.md. Existing files are not moved, renamed or split.

**62 · `3.g.x.zo` — G13j misc and unclassified: settings, events, places, opportunities, schools, recaptcha, preview, projects: tests and records**

Prove and record: a custom-fetch-mock test in `tests/api-resources/` (method, path, query,
body, parsing; Prism cannot serve new endpoints), the `docs/endpoint-status.md` row, and the
`COVERAGE.md` domain and register rows.


## Phase 4 — Consistency and final audit


### 4.a Finish › 4.a.i Types and docs

**37 · `4.a.i.zi` — Tighten types where captures gave real shapes**

Replace loose types with the captured shapes; keep every existing type compatible.

**38 · `4.a.i.zo` — JSDoc statuses, naming consistency, `api.md` complete**

Every new method documented the same way as its neighbours; `api.md` lists every method.


### 4.a Finish › 4.a.ii README and audit

**39 · `4.a.ii.zi` — README: new resources and one example per new domain**

Short, runnable-looking examples; no claim that an endpoint is live-verified unless the owner confirmed it.

**40 · `4.a.ii.zo` — Final coverage audit**

Regenerate `endpoint-status.md`; every endpoint has a status; every domain row in `COVERAGE.md` is Covered or `missing`/`blocked` with a reason.


---

## Phase 5 — Container image on GHCR (if possible)

The SDK is a library, so the image is a runtime and base image that bundles the built SDK. It is not a service. **Feasibility, checked in 0.a.ii.zo:** the sandbox has no container runtime, and `ghcr.io` and Docker Hub both answer 403 from it, so a session can write the files but cannot build, push or test an image. GitHub Actions on the owner's fork does that. Until `5.b.ii.zi`, every Phase 5 leaf is *written, NOT built or run*. The registry host is `ghcr.io` (lowercase image name: `ghcr.io/zapier-codes/bandlab-sdk-typescript`).


### 5.a Image definition › 5.a.i Dockerfile

**41 · `5.a.i.zi` — Multi-stage `Dockerfile` and `.dockerignore`**

Build stage: Node 20, `yarn install --frozen-lockfile --ignore-scripts`, `./scripts/build` (the `prepare` hook is skipped on purpose). Final stage: Node slim with the `dist/` package installed. No tokens or `.env` copied in.

**42 · `5.a.i.zo` — `scripts/container-smoke`**

`docker run`s the image and checks the SDK loads and lists its resources. Written for the owner or CI to run; not run by sessions.


### 5.a Image definition › 5.a.ii Runtime contract

**43 · `5.a.ii.zi` — README container section**

How to run, `BANDLAB_SDK_BEARER_TOKEN` supplied at runtime only and never baked in, `NODE_PATH` use, how to use the image as a base.

**44 · `5.a.ii.zo` — Default command**

Prints the SDK version and resource names and exits 0, so `docker run <image>` is a smoke test.


### 5.b Publish to GHCR › 5.b.i Workflow

**45 · `5.b.i.zi` — `.github/workflows/container.yml`**

Build and push `ghcr.io/zapier-codes/bandlab-sdk-typescript` on pushes to `main` and `v*` tags, `linux/amd64` and `linux/arm64`, tags `latest`, `sha-<short>` and semver, `org.opencontainers.image.source` label, `packages: write` through `GITHUB_TOKEN`. Existing workflows untouched.

**46 · `5.b.i.zo` — Owner steps document**

Enable Actions on the fork, set package visibility, confirm the package is linked to the repo, `docker pull` command. Action versions are written from memory and must be checked on first run.


### 5.b Publish to GHCR › 5.b.ii First publish

**47 · `5.b.ii.zi` — Owner confirms the first CI run published the image and it pulls and runs** — **owner's leaf**

**The owner's leaf.** Tracked here for visibility; a session records the owner's confirmation or the failure log.


---

## Recipe reminders for Phase 3 leaves
- Home for new code: `ARCHITECTURE.md`. Sub-resources of a folder resource go in that folder; new top-level resources are new files in `src/resources/`; flat files are never converted into folders.
- Evidence first (D6). A leaf with no evidence for its item is not implemented; set `[~]` and name the evidence needed under BLOCKERS.
- `yarn build`, `yarn lint` and `./node_modules/.bin/jest` must match or beat the `1.a.i.zi` baseline (build 0; lint 0 with 1 known warning; jest 217 passed, 185 skipped, 0 failed). `yarn test` cannot run in the sandbox; see `PROTOCOL.md`.

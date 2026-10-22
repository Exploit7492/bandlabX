# HANDOVER ‚Äî READ THIS FIRST

> Every session (human or AI) that clones this repo **must read this file before doing anything else**, then work **the one leaf** named in "Current position".
> This file is the single source of truth for sequencing. **The owner's rules override everything here.** If the owner states a new rule, update Section 2 in the same session.

---

## 0. How this file works

Work follows a fixed hierarchy (adapted from the D-Store handover; see `docs/handover/FORMULA.md` for what was adopted and what was not):

```
Phase        1, 2, 3, 4, 5
 ‚Äö√Æ√Æ‚Äö√Æ√Ñ Track     a, b, c, d, e
     ‚Äö√Æ√Æ‚Äö√Æ√Ñ Milestone   i, ii, iii, iv, v
         ‚Äö√Æ√Æ‚Äö√Æ√Ñ Leaf        zi, zo
```

- A **leaf** is exactly **one task**. It is never bundled with another and never left partial. Its path is e.g. `3.c.i.zi`; use it in commit subjects, patch names, ledger lines and status updates.
- In this project `zi` is the **build** half of a milestone and `zo` is the **prove-and-record** half (tests, status docs, coverage rows).
- **Every session does exactly one leaf**, then hands off. Never start a second leaf, even if time remains.
- **Phase 0** is the handover setup (the sessions before the formula existed). It is history and is **not counted** in N of M.

### The splitting rule

1. A session that finds its leaf is bigger than one task **splits it before writing any code**. The split itself (docs only) is that session's one task.
2. The parent is kept and marked `[-]` (superseded) so its ID stays addressable. It no longer counts toward M.
3. The children get **new paths**: the next unused milestone numerals in the same track, one `zi`/`zo` pair per milestone. Their checklist numbers are the parent's number plus a letter (`29` becomes `29a`, `29b`, ‚Äö√Ñ¬∂).
4. M changes accordingly (children added, parent removed). The session reports the new total and updates the history line under "Done so far", so the count never changes meaning quietly.
5. Likely splits are flagged in advance: `3.b.i` (mix and effects), `3.b.ii` (audio upload), `3.c.i` (messaging). New G-items found by `2.b.i.zi` add leaves and raise M the same way.

### Status markers

`[ ]` open ¬¨‚àë `[~]` in progress (a session started but could not finish; commit as `WIP:`) ¬¨‚àë `[x]` done and handed off by patch ¬¨‚àë `[-]` superseded or split; never pick it up.

---

## 1. Focus run - the 101 leaves of the SDK full-coverage program

_Active until "101 done of 101". Owner directive 2026-10-03; **rescoped twice on 2026-10-15**: 47 to 73 after the bundle evidence revealed 201 endpoints the spec never described, then 73 to 101 after the APK evidence (`docs/research/APK-EVIDENCE.md`) showed the true surface is 344 endpoints, every one with a verb and 265 with a real response shape. Scope and rules: Section 2. Leaf specs: `docs/handover/TASKS.md`. Coverage matrix and the G-item register: `docs/handover/COVERAGE.md`._

**The 2026-10-15 rescope, in one paragraph.** The original run assumed the only way to learn a missing endpoint was for the owner to hand back scrubbed HAR captures, so Phase 2 was built as a capture kit and Phase 3 waited behind it. A session then fetched BandLab's own web app bundle and the OpenAPI spec URL already recorded in `.stats.yml`, and found that the spec is a **narrow subset** (80 paths, 123 operations, no messaging, effects, sounds or uploads) while the shipped app calls 236 path templates, of which 201 are not in the SDK. A later session went further and decompiled the **Android app**, whose kotlinx.serialization descriptors preserve the real class and field names, which raised the evidenced surface to **344 endpoints** with a verb for every one and a **real response shape for 265**. Full method, sources and limits: `docs/research/BUNDLE-EVIDENCE.md` and `docs/research/APK-EVIDENCE.md`; the path list: `docs/research/apk-endpoints.md`. **The capture kit is no longer a blocking gate**: it is now only needed for request bodies and live confirmation (see the shape rule in Section 2).

**Phase 1 ‚Äî Baseline and coverage tooling**

- [x] 1 ‚Äî `1.a.i.zi` Record the build baseline
- [x] 2 ‚Äî `1.a.i.zo` Record which tests need the Prism mock or the network, and report the base-URL finding
- [x] 3 ‚Äî `1.a.ii.zi` `scripts/utils/coverage-report.cjs`
- [x] 4 ‚Äî `1.a.ii.zo` Generate `docs/endpoint-status.md` and verify every `COVERAGE.md` row against the code

**Phase 2 - Evidence for the missing endpoints** _(rescoped 2026-10-15: the decompiled Android app is the evidence, and it supplies shapes as well as paths; the capture kit is now only for request bodies and live confirmation)_

- [x] 5 ‚Äî `2.a.i.zi` `docs/research/CAPTURE-GUIDE.md`
- [x] 6 ‚Äî `2.a.i.zo` Evidence hand-back format
- [x] 7 ‚Äî `2.a.ii.zi` `scripts/research/scrub-har.py` and a synthetic fixture
- [x] 8 ‚Äî `2.a.ii.zo` `scripts/research/har-to-endpoints.py` and a fixture
- [x] 9 ‚Äî `2.b.i.zi` Record the bundle evidence and the spec's server block; **P0 answered**; `docs/research/BUNDLE-EVIDENCE.md` + `docs/research/bundle-endpoints.md` _(was the owner's leaf; a session resolved it from public sources)_
- [x] 10 ‚Äî `2.b.i.zo` Record the final resource design for all 344 APK-evidenced endpoints: 35 resources, file names, accessors, method names and type strategy per domain (`docs/handover/RESOURCE-DESIGN.md`); regenerate `COVERAGE.md` and `docs/endpoint-status.md` from the union; split Phase 3 into the 40 domains below and raise M -- **DONE**: design in `docs/handover/RESOURCE-DESIGN.md`; M raised 73 -> 101.

**Phase 3 ‚Äî Implementation by domain** _(80 leaves: 40 domains x `zi`/`zo`. Every domain has APK evidence for its paths, and 265 of the 344 paths also have a real response shape. Shapes follow rule D12 and the design in `docs/handover/RESOURCE-DESIGN.md`.)_

**3.a ‚Äî Songs, revisions, tracks, bands, albums**

- [x] 11 ‚Äî `3.a.i.zi` songs: list, create, invite-link, collaborators (5 endpoints): implement
- [x] 12 ‚Äî `3.a.i.zo` songs: tests and records
- [x] 13 ‚Äî `3.a.ii.zi` revisions: breakdown, mixdown, download-options, forks (9 endpoints): implement
- [x] 14 ‚Äî `3.a.ii.zo` revisions: tests and records
- [x] 15 ‚Äî `3.a.iii.zi` tracks (2 endpoints): implement
- [x] 16 ‚Äî `3.a.iii.zo` tracks: tests and records
- [x] 17 ‚Äî `3.a.iv.zi` bands: members, invites, follow-invitees, suggestions (7 endpoints): implement
- [x] 18 ‚Äî `3.a.iv.zo` bands: tests and records
- [x] 19 ‚Äî `3.a.v.zi` albums: themes, likes, comments, posts, state, pictures (15 endpoints): implement
- [x] 20 ‚Äî `3.a.v.zo` albums: tests and records

**3.b ‚Äî Studio: effects, sounds, uploads, soundbanks**

- [x] 21 ‚Äî `3.b.i.zi` effects: presets, favourites, trending, promo, artist presets (10 endpoints): implement
- [x] 22 ‚Äî `3.b.i.zo` effects: tests and records
- [x] 23 ‚Äî `3.b.ii.zi` sounds: samples, packs, libraries, credits (part 1) (16 endpoints): implement
- [x] 24 ‚Äî `3.b.ii.zo` sounds: tests and records
- [x] 25 ‚Äî `3.b.iii.zi` sounds: claims, uploads, sampler-kits, stamps (part 2) (15 endpoints): implement
- [x] 26 ‚Äî `3.b.iii.zo` sounds: tests and records
- [x] 27 ‚Äî `3.b.iv.zi` uploads v2.0: create, part, complete (4 endpoints): implement
- [x] 28 ‚Äî `3.b.iv.zo` uploads v2.0: tests and records
- [x] 29 ‚Äî `3.b.v.zi` soundbanks v4.3 and metronome v3.0 (1 endpoints): implement
- [x] 30 ‚Äî `3.b.v.zo` soundbanks v4.3 and metronome v3.0: tests and records

**3.c ‚Äî AI, audio tooling and misc**

- [x] 31 ‚Äî `3.c.i.zi` AI: separation, transfer, task, model, presets (part 1) (17 endpoints): implement
- [x] 32 ‚Äî `3.c.i.zo` AI: tests and records
- [x] 33 ‚Äî `3.c.ii.zi` AI: remix, autocomplete, captcha, genres, ideas (part 2) (16 endpoints): implement
- [x] 34 ‚Äî `3.c.ii.zo` AI: tests and records
- [x] 35 ‚Äî `3.c.iii.zi` ai-videos: jobs, styles, generate, tokens (5 endpoints): implement
- [x] 36 ‚Äî `3.c.iii.zo` ai-videos: tests and records
- [x] 37 ‚Äî `3.c.iv.zi` synced lyrics (2 endpoints): implement
- [x] 38 ‚Äî `3.c.iv.zo` synced lyrics: tests and records
- [x] 39 ‚Äî `3.c.v.zi` misc: settings, options, tracking, external (4 endpoints): implement
- [x] 40 ‚Äî `3.c.v.zo` misc: tests and records

**3.d ‚Äî Messaging, communities and posts**

- [x] 41 ‚Äî `3.d.i.zi` messaging: conversations, messages, receipts (part 1) (10 endpoints): implement
- [x] 42 ‚Äî `3.d.i.zo` messaging: tests and records
- [x] 43 ‚Äî `3.d.ii.zi` messaging: reactions, chat channels, read receipts (part 2) (9 endpoints): implement
- [x] 44 ‚Äî `3.d.ii.zo` messaging: tests and records
- [x] 45 ‚Äî `3.d.iii.zi` communities: rules, active, invites (5 endpoints): implement
- [x] 46 ‚Äî `3.d.iii.zo` communities: tests and records
- [x] 47 ‚Äî `3.d.iv.zi` posts: create, plays, polls, track-posts, mentions (11 endpoints): implement
- [x] 48 ‚Äî `3.d.iv.zo` posts: tests and records
- [x] 49 ‚Äî `3.d.v.zi` images: upload and variants (12 endpoints): implement
- [x] 50 ‚Äî `3.d.v.zo` images: tests and records

**3.e ‚Äî Profile, library and feeds**

- [x] 51 ‚Äî `3.e.i.zi` users: profile, pictures, views, gear (part 1) (18 endpoints): implement
- [x] 52 ‚Äî `3.e.i.zo` users: tests and records
- [x] 53 ‚Äî `3.e.ii.zi` users: followers, invites, mutual-connections, pins (part 2) (18 endpoints): implement
- [x] 54 ‚Äî `3.e.ii.zo` users: tests and records
- [x] 55 ‚Äî `3.e.iii.zi` users: settings, warnings, verified, two-factor (part 3) (18 endpoints): implement
- [x] 56 ‚Äî `3.e.iii.zo` users: tests and records
- [x] 57 ‚Äî `3.e.iv.zi` library: likes, purchases, collections, recommendations (14 endpoints): implement
- [x] 58 ‚Äî `3.e.iv.zo` library: tests and records
- [x] 59 ‚Äî `3.e.v.zi` feeds: for-you, following, featured, media, trending, explore (12 endpoints): implement
- [x] 60 ‚Äî `3.e.v.zo` feeds: tests and records

**3.f ‚Äî Account, membership and payments**

- [x] 61 ‚Äî `3.f.i.zi` me: activity status, privacy, marketing consent, parental consent (11 endpoints): implement
- [x] 62 ‚Äî `3.f.i.zo` me: tests and records
- [x] 63 ‚Äî `3.f.ii.zi` streaks (3 endpoints): implement
- [x] 64 ‚Äî `3.f.ii.zo` streaks: tests and records
- [x] 65 ‚Äî `3.f.iii.zi` membership: plan, coins, wallet, AI-token balance (read-only) (4 endpoints): implement
- [x] 66 ‚Äî `3.f.iii.zo` membership: tests and records
- [x] 67 ‚Äî `3.f.iv.zi` payments: checkout payment intents (6 endpoints): implement
- [x] 68 ‚Äî `3.f.iv.zo` payments: tests and records
- [x] 69 ‚Äî `3.f.v.zi` authorizations: registration, assertion, logout, passkeys (9 endpoints): implement
- [x] 70 ‚Äî `3.f.v.zo` authorizations: tests and records

**3.g ‚Äî Search, validation and catalogues**

- [x] 71 ‚Äî `3.g.i.zi` search: collaborators, trending, hashtags, suggestions (8 endpoints): implement
- [x] 72 ‚Äî `3.g.i.zo` search: tests and records
- [x] 73 ‚Äî `3.g.ii.zi` validation and captcha (4 endpoints): implement
- [x] 74 ‚Äî `3.g.ii.zo` validation and captcha: tests and records
- [x] 75 ‚Äî `3.g.iii.zi` passwords and account recovery (1 endpoints): implement
- [x] 76 ‚Äî `3.g.iii.zo` passwords and account recovery: tests and records
- [x] 77 ‚Äî `3.g.iv.zi` collections (1 endpoints): implement
- [x] 78 ‚Äî `3.g.iv.zo` collections: tests and records
- [x] 79 ‚Äî `3.g.v.zi` genres and displayed genres (1 endpoints): implement
- [x] 80 ‚Äî `3.g.v.zo` genres and displayed genres: tests and records

**3.h ‚Äî Beats, distribution, promotion and pages**

- [x] 81 ‚Äî `3.h.i.zi` beats: marketplace, collections, genres, promo, free-claims (16 endpoints): implement
- [x] 82 ‚Äî `3.h.i.zo` beats: tests and records
- [x] 83 ‚Äî `3.h.ii.zi` distribution: releases, analytics, quotas, splits (15 endpoints): implement
- [x] 84 ‚Äî `3.h.ii.zo` distribution: tests and records
- [x] 85 ‚Äî `3.h.iii.zi` promotion: campaigns, statistics, reach, banners (9 endpoints): implement
- [x] 86 ‚Äî `3.h.iii.zo` promotion: tests and records
- [x] 87 ‚Äî `3.h.iv.zi` pages: bio, links, press kits, projects, statistics (3 endpoints): implement
- [x] 88 ‚Äî `3.h.iv.zo` pages: tests and records
- [x] 89 ‚Äî `3.h.v.zi` videos and video-mix (2 endpoints): implement
- [x] 90 ‚Äî `3.h.v.zo` videos and video-mix: tests and records

**Phase 4 ‚Äî Consistency and final audit**

- [ ] 91 ‚Äî `4.a.i.zi` Tighten the remaining request bodies where a capture supplies them _(blocked: no captures)_
- [x] 92 ‚Äî `4.a.i.zo` JSDoc statuses, naming consistency, `api.md` complete
- [x] 93 ‚Äî `4.a.ii.zi` README: new resources and one example per new domain
- [x] 94 ‚Äî `4.a.ii.zo` Final coverage audit

**Phase 5 ‚Äî Container image on GHCR (if possible)**

- [x] 95 ‚Äî `5.a.i.zi` Multi-stage `Dockerfile` and `.dockerignore`
- [x] 96 ‚Äî `5.a.i.zo` `scripts/container-smoke`
- [x] 97 ‚Äî `5.a.ii.zi` README container section
- [x] 98 ‚Äî `5.a.ii.zo` Default command
- [x] 99 ‚Äî `5.b.i.zi` `.github/workflows/container.yml`
- [x] 100 ‚Äî `5.b.i.zo` Owner steps document
- [x] 101 ‚Äî `5.b.ii.zi` Owner confirms the first CI run published the image and it pulls and runs

**Done so far: 100 of 101.** History of M: set at 47 on 2026-10-03; **raised to 73 on 2026-10-15** after the bundle evidence showed 201 endpoints the spec never described; **raised to 101 on 2026-10-15** (`2.b.i.zo`) after the APK evidence (`docs/research/APK-EVIDENCE.md`) showed the true surface is 344 endpoints with a verb for all of them and a real response shape for 265. Phase 3 was resplit from 26 domains / 52 leaves into 40 domains / 80 leaves (12 → 52 → 80), and Phase 4/5 renumbered behind it. No parent was superseded, so no leaf ID was retired.

**Reporting rule:** a session that completes a leaf ends its final message with `N done ‚úÖ of M`, read off this checklist **after** the session. One that completes none says `No new leaf completed ‚Äî still N done of M`, with the reason. The tick, the count, Current position and the ledger line go in the leaf's own final commit, so the patch and the count can never disagree.

---

## 1a. Current position

```yaml
CURRENT_LEAF: 5.b.ii.zi
CURRENT_LEAF_TITLE: owner confirms the first CI run published the image
CURRENT_LEAF_SPEC: docs/handover/CONTAINER.md  ->  "Owner steps"  (read docs/handover/TASKS.md Phase 5 first)
FOCUS_RUN: "100 done of 101"
LAST_COMPLETED_LEAF: 5.b.ii.zi
MARKER_COMMIT_SUBJECT_PREFIX: "5.b.ii.zi:"
SUB_PHASE: 5 (COMPLETE - leaves 95-101 DONE)
STATUS: COMPLETE (leaf 91 open, owner-gated on captures)
BLOCKERS: **none outstanding.** Leaf 101 (`5.b.ii.zi`) closed on 2026-10-15: pushing `main` triggered CI run `38781546855`, whose `Publish to GHCR` step succeeded and published `ghcr.io/zapier-codes/bandlab-sdk-typescript` with tags `latest`, `main` and `sha-4b7382e…`. All three manifests read HTTP 200 anonymously (the package is public), and `docker pull` + `docker run` of the published image exits 0 and reproduces the smoke output. No repository setting was needed - the workflow's own `GITHUB_TOKEN` carried `packages: write`. **Leaf 91 (`4.a.i.zi`) remains open but is not a blocker on any other leaf**: it needs request-body shapes from an owner capture, `docs/research/captures/` holds only `.gitkeep`, and the 69 `body: unknown` methods intersect neither the OpenAPI spec nor the recoverable APK models (95 of 102 body models are obfuscated). Every other leaf is DONE. Known limits, recorded so no session overclaims - (1) REQUEST BODIES are evidenced only where the app method takes a `@c74` body parameter whose model is in the descriptor set; the rest stay `unknown` under D12 and are marked `apk-path-only`. (2) `@lik` = PUT is the one verb with realistic doubt (15/28 direct, resolved by in-file coherence); rows using it are flagged. (3) 73 of 468 status rows are `apk-path-only`, i.e. they have a verb and a path but no response shape. (4) The AI/ML host groups (`SMART_COMPOSE`, `MIDI_GENERATE`, `AUTO_MIX`, `AUDIO_TO_MIDI`, `VOICE_CLEANER`, `OPEN_MIC`, `FX`, `REALTIME`, `AUDIO_SONG_STARTER`) are evidenced but their deployment host (staging vs production) is not. (5) `AMPLITUDE_*` and `BRANCH` host groups are third-party SDKs and are deliberately EXCLUDED. (6) Nothing has been run against BandLab; rows are `apk`, never `live-ok`. (7) OWNER-GATED: the REA/Chrome-CDP capture that would close (1) needs the owner's machine and account; deferred by the owner, no session should start it. (8) OUT OF SCOPE (D14): stripping ads or paywalls from the Android app and publishing a rebuilt APK is not done and will not be done - it is an entitlement bypass plus redistribution of proprietary software, and the gating is server-side so it would not work anyway. (9) PUSH GATE: CLOSED. Everything is pushed to `main`.
```

**Shape rule (added 2026-10-15, revised 2026-10-15 after the APK evidence, see rule D12).** Evidence proves a _path_; the APK also proves a _shape_ wherever a kotlinx.serialization descriptor names the field. A session therefore types a response with the real field names when `docs/research/apk-shapes.tsv` has them, and uses `unknown` with status `apk-path-only` when it does not. A session must **not** invent field names, required flags, enum values or nested types. Request bodies are typed only where a `@c74` body model is in the descriptor set.

**Test-account credentials (owner directive, 2026-10-22; see D16).** The account password and any session token are held **outside the working tree**. The owner registers them in the OpenHands secret store, where they are injected as environment variables and remain visible to the owner for manual use, or keeps them in a local file that `.gitignore` excludes (`.bandlab-account.json`, `*.credentials.json`). A session reads them from the environment only. No credential is ever written into a tracked file, a test fixture, a capture, a commit message, or a log line.

**Sanity check at session start:**

```bash
git fetch origin
git log --oneline | grep "1.a.i.zi:"      # the previous leaf's marker commit must be present
```

If the marker is **not** in `git log`, the previous patch was never applied or pushed. **Stop and tell the owner.**

---

## 2. What this project is, and the rules

**Update the existing BandLab TypeScript SDK so it covers every BandLab API capability**, including the ones it is missing today (messaging, audio and samples, mix and effects, and a set of missing operations; see `COVERAGE.md`). Then **bake it as a container image on `ghcr.io`, if possible** (Phase 5). It is **not** an MCP server and **not** a restructure.

| #   | Rule                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | **This is the owner's own project. Everything is editable, including `src/`.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| D2  | **Keep the existing tree. Extend it.** No relocating, renaming or splitting existing files; no new top-level directories. New code goes beside its neighbours (`ARCHITECTURE.md`, "Where new things go"). Files that must sit at the repo root (`Dockerfile`, `.dockerignore`) are files, not directories.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| D3  | **Scope is SDK API coverage plus the container image.** No MCP server, tools, workflows, permission layers, bulk automation or registries.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| D4  | **Additive only.** Every existing `client.*` call keeps working unchanged.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| D5  | Python is allowed only in `scripts/research/` for evidence tooling. Never shipped, never imported by `src/`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| D6  | **Never invent an endpoint or a response shape.** Every new endpoint needs evidence (capture, spec or owner confirmation) and a status: `spec` / `captured` / `unverified` / `live-ok` / `missing`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| D7  | **Network reach (revised 2026-10-15).** The sandbox **can** reach `www.bandlab.com` and `test.bandlab.com` over HTTPS ‚Äî the bundle and spec were fetched this way. `ghcr.io` and Docker Hub are reachable and both pull (verified 2026-10-15). A container runtime **is** available: the sandbox has passwordless `sudo`, `dockerd` starts, and `docker build` succeeds - `sudo dockerd &` then `sudo chmod 666 /var/run/docker.sock` is enough. Phase 5 is therefore not blocked by the environment; it is blocked only by the GHCR push permission, which is a repo/owner setting. Live checks against BandLab are **read-only and unauthenticated by default**; a session must never claim an endpoint is live-verified on the basis of a probe alone (see D13). The **one** exception is the owner-authorised test account in **D16**.                                                                                                                 |
| D8  | Stainless and release scaffolding is left untouched. Do not run or merge codegen (it would overwrite hand edits).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| D9  | Wire paths stay exactly as the server expects; follow the naming of neighbouring files.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| D10 | **Direct-push rule (owner directive, 2026-10-15, supersedes the combined-patch rule).** Sessions **push directly to `main`**. Do **not** run the patch handoff: no `make-patch.sh`, no `.patch` file, no `git am` on the owner's side, no `NEXT_PATCH_NUMBER` bump. The commit on `main` _is_ the handoff. The owner confirmed this after the 47‚Üí73 rescope. `scripts/handover/make-patch.sh` is retained only as a fallback if the owner asks for it again. **Exception (owner directive, 2026-10-15): Phase 3 is split into three sub-phases and is push-gated.** While a sub-phase is open, commits accumulate **locally on `main` only**; nothing is pushed until every leaf of that sub-phase is DONE, then the whole sub-phase is pushed in one go. See the sub-phase table in `docs/handover/TASKS.md`. The gate applies to Phase 3 only — Phases 4 and 5 push as before. |
| D11 | **Never bake secrets into an image.** Tokens are supplied at runtime only.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| D12 | **Shape rule (2026-10-15).** Evidence proves a _path_; it does not prove a _shape_. A session may implement an evidenced path with `unknown` request/response types and status `unverified`, but must never invent field names, required flags, enum values or nested types. Shapes are tightened only when evidence arrives (`4.a.i.zi`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| D13 | **Evidence sources, in order of strength (revised 2026-10-15):** (1) an authenticated capture by the owner; (2) the **decompiled Android app** (`docs/research/APK-EVIDENCE.md`) — it proves the path, the host group, the auth flag, the verb and the response shape; (3) the OpenAPI spec at the `openapi_spec_url` in `.stats.yml`; (4) the shipped web app bundle; (5) a live unauthenticated probe. **A 404 is never evidence of absence** — real endpoints return 404 unauthenticated. Record which source each claim rests on, as the row status.                                                                                                                                                                                                                                                                                                                           |
| D14 | **No entitlement bypass (owner request, 2026-10-15).** The owner asked for "all services free" so nothing is gated. The investigation (`APK-EVIDENCE.md` §8) found gating is **server-side**: the app holds only presentation state (`MembershipStatusShort.isActive`, `MembershipLimits`, quota banners) and delegates purchase to Purchasely/Google Play. A client change cannot make a paid feature free, and patching or redistributing the app to bypass payment would breach BandLab’s terms and, for store purchases, circumvent a technical protection measure. **This project does not do that.** It instead exposes the complete **free** surface so no account lacks capability, and exposes membership, coin, wallet and quota endpoints **read-only** so callers can read their own state. Those JSDoc lines must say entitlement is enforced server-side.            |
| D15 | **Third-party surface is excluded.** The APK bundles non-BandLab SDKs. `AMPLITUDE_EXPERIMENT`, `AMPLITUDE_ANALYTICS` and `BRANCH` host groups are analytics/attribution, not BandLab API. They are listed in `APK-EVIDENCE.md` §5 so they can be excluded deliberately, and no leaf implements them. **Exclusion is by host group, never by path segment.** BandLab serves real endpoints under an `/experiment/...` namespace (`/experiment/users/{id}/membership-status`, `/experiment/beats/{id}`, `/experiment/feeds/communities/posts`, `/experiment/users/{id}/purchases/beats`, `/experiment/beats-filters`), and a path-prefix rule silently dropped five of them; those are BandLab API and are kept, with the `experiment` prefix stripped for resource routing.                                                                                                         |
| D16 | **Owner-authorised test account (owner directive, 2026-10-22).** The owner has authorised **one** BandLab account, created and controlled by the owner, for authenticated login/registration testing and demos. A session **may** log into it and exercise the authenticated surface the owner names. **The account is owner-created in a browser** (`AUTH-EVIDENCE.md`): signup is gated by reCAPTCHA Enterprise, `register: true` 500s, and `POST /users` is unreachable - a session does not solve the captcha. **Hard limits:** exactly **one** account, created only for the owner - no bulk or scripted account creation, no accounts for anyone else, and **never** a third party's account or session (no credential stuffing, no reusing someone else's cookies or tokens). The password and any session token are secrets under **D11**: never committed or written into the repo, a fixture, a capture or the image. The owner accepts BandLab's terms by creating the account. **D14 is unchanged** - no entitlement, payment or quota bypass. Record the host and creation date. Authenticated calls are reported as `live-ok` **only** for the endpoints actually exercised; every other row keeps its existing status. |

---

## 3. Standing handoff process (every session)

0. **Check upstream:** `git fetch origin`. If origin moved, rebase local work onto `origin/main` before starting. Check whether the previous patch reached GitHub (`git log origin/main | grep "<previous leaf path>:"`).
1. **Do the one leaf** named in Current position, and nothing else. If it is bigger than one task, split it first (Section 0) and hand off the split as the session's one task.
2. **One diff = one commit** (`git add <paths>`, `git commit`). Every commit subject starts with the leaf path.
3. **The leaf's final commit** carries, together: the work's last change, the checklist tick `[x]`, the "Done so far" count, Current position moved to the next open leaf (path order: `zi` before `zo`, then the next milestone, track, phase), one line appended to `docs/handover/LEDGER.md`, and the Done note `docs/handover/sessions/<leaf path>.md`. Its subject is `<leaf path>: <title>; <what was and was not run>; N done of M`.
4. **Push to `main` directly** (D10): `git push origin main`. Do **not** build a patch or run `make-patch.sh`.
5. **Verify the push landed:** `git fetch origin && git log --oneline -1 origin/main`. Confirm the commit you just made is the tip of `origin/main`.
6. Reply: which leaf, what was and was not run, then `N done of M`.

```bash
cd ~/bandlabX
git pull --ff-only origin main
```

The owner does not apply patches any more (D10). If a session's push is rejected, `git pull --ff-only` then push again; if that conflicts, stop and report the base mismatch rather than force-pushing.

If a leaf cannot finish: mark it `[~]`, commit what exists with a `WIP:` prefix, say exactly what is left, and push. The next session resumes that leaf first.

---

## 4. Documents map

| File                                   | Purpose                                                                                                                                                                                                                                    |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `HANDOVER.md`                          | This file: formula, checklist (N of M), Current position, rules, process.                                                                                                                                                                  |
| `docs/handover/TASKS.md`               | The spec for every leaf (generated from the same table as the checklist).                                                                                                                                                                  |
| `docs/handover/FORMULA.md`             | The splitting formula: what was adopted from D-Store, what was changed, a worked split.                                                                                                                                                    |
| `docs/handover/ARCHITECTURE.md`        | Existing tree, where new code goes, constraints.                                                                                                                                                                                           |
| `docs/handover/COVERAGE.md`            | 17-domain matrix and the G-item register.                                                                                                                                                                                                  |
| `docs/handover/endpoint-inventory.tsv` | Snapshot of the 123 existing endpoints.                                                                                                                                                                                                    |
| `docs/handover/PROTOCOL.md`            | Detailed session checklist and the Done-note template.                                                                                                                                                                                     |
| `docs/handover/LEDGER.md`              | Append-only: one line per leaf.                                                                                                                                                                                                            |
| `docs/handover/ORIGINAL-PLAN-TREE.md`  | The cancelled MCP plan, kept as a domain checklist only.                                                                                                                                                                                   |
| `docs/handover/sessions/`              | Done notes: `S00`, `S00B`, `S00C` (history) and one `<leaf path>.md` per leaf.                                                                                                                                                             |
| `docs/research/BUNDLE-EVIDENCE.md`     | **The bundle evidence (2026-10-15):** sources, the 123-vs-225 finding, per-endpoint verification status, and what is still unevidenced. Read before any Phase 3 leaf.                                                                      |
| `docs/research/APK-EVIDENCE.md`        | **The APK evidence (2026-10-15), the stronger source:** how the Android app yields paths, host groups, auth flags, verbs and real response shapes; the verb map and its validation; the entitlement finding. Read before any Phase 3 leaf. |
| `docs/research/AUTH-EVIDENCE.md`       | **The auth evidence (2026-10-22):** the live login path, the `register: true` server-side 500, the unreachable `POST /users`, and the reCAPTCHA Enterprise gate on the web signup form. Read before any leaf that needs the D16 account.  |
| `docs/research/apk-endpoints.md`       | All 344 APK-evidenced paths the SDK lacks, with verb, auth flag, service and response class.                                                                                                                                               |
| `docs/research/apk-shapes.tsv`         | Class → field → required, from the kotlinx.serialization descriptors (1,094 models, 1,973 fields).                                                                                                                                         |
| `docs/handover/RESOURCE-DESIGN.md`     | **The `2.b.i.zo` design:** all 344 paths assigned to 35 resources with file, accessor and type strategy, and the Phase 3 leaf mapping.                                                                                                     |
| `scripts/research/apk-to-endpoints.py` | Reproducible extractor: jadx output → `apk-endpoints.md` + `apk-shapes.tsv`. Stdlib only.                                                                                                                                                  |
| `docs/research/bundle-endpoints.md`    | All 225 clean endpoint paths, grouped by segment, each flagged SDK/NEW with its live probe result.                                                                                                                                         |
| `scripts/handover/make-patch.sh`       | Builds the combined patch.                                                                                                                                                                                                                 |

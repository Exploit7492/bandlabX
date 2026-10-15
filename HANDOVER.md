# HANDOVER — READ THIS FIRST

> Every session (human or AI) that clones this repo **must read this file before doing anything else**, then work **the one leaf** named in "Current position".
> This file is the single source of truth for sequencing. **The owner's rules override everything here.** If the owner states a new rule, update Section 2 in the same session.

---

## 0. How this file works

Work follows a fixed hierarchy (adapted from the D-Store handover; see `docs/handover/FORMULA.md` for what was adopted and what was not):

```
Phase        1, 2, 3, 4, 5
 ‚îî‚îÄ Track     a, b, c, d, e
     ‚îî‚îÄ Milestone   i, ii, iii, iv, v
         ‚îî‚îÄ Leaf        zi, zo
```

- A **leaf** is exactly **one task**. It is never bundled with another and never left partial. Its path is e.g. `3.c.i.zi`; use it in commit subjects, patch names, ledger lines and status updates.
- In this project `zi` is the **build** half of a milestone and `zo` is the **prove-and-record** half (tests, status docs, coverage rows).
- **Every session does exactly one leaf**, then hands off. Never start a second leaf, even if time remains.
- **Phase 0** is the handover setup (the sessions before the formula existed). It is history and is **not counted** in N of M.

### The splitting rule
1. A session that finds its leaf is bigger than one task **splits it before writing any code**. The split itself (docs only) is that session's one task.
2. The parent is kept and marked `[-]` (superseded) so its ID stays addressable. It no longer counts toward M.
3. The children get **new paths**: the next unused milestone numerals in the same track, one `zi`/`zo` pair per milestone. Their checklist numbers are the parent's number plus a letter (`29` becomes `29a`, `29b`, ‚Ä¶).
4. M changes accordingly (children added, parent removed). The session reports the new total and updates the history line under "Done so far", so the count never changes meaning quietly.
5. Likely splits are flagged in advance: `3.b.i` (mix and effects), `3.b.ii` (audio upload), `3.c.i` (messaging). New G-items found by `2.b.i.zi` add leaves and raise M the same way.

### Status markers
`[ ]` open ¬∑ `[~]` in progress (a session started but could not finish; commit as `WIP:`) ¬∑ `[x]` done and handed off by patch ¬∑ `[-]` superseded or split; never pick it up.

---

## 1. Focus run — the 82 leaves of the SDK full-coverage program

*Active until "82 done ✅ of 82". Owner directive 2026-10-03; **rescoped 2026-10-15** from 47 to 82 leaves after the bundle evidence (below) revealed 201 endpoints the spec never described. Scope and rules: Section 2. Leaf specs: `docs/handover/TASKS.md`. Coverage matrix and the G-item register: `docs/handover/COVERAGE.md`.*

**The 2026-10-15 rescope, in one paragraph.** The original run assumed the only way to learn a
missing endpoint was for the owner to hand back scrubbed HAR captures, so Phase 2 was built as a
capture kit and Phase 3 waited behind it. A session then fetched BandLab's own web app bundle and
the OpenAPI spec URL already recorded in `.stats.yml`, and found that the spec is a **narrow
subset** — 80 paths, 123 operations, with no messaging, effects, sounds or uploads at all —
while the shipped app calls **236 path templates / 225 clean paths**, of which **201 are not in
the SDK**. The evidence was publicly available the whole time. Full method, sources and the
limits of the evidence: `docs/research/BUNDLE-EVIDENCE.md`; the path list:
`docs/research/bundle-endpoints.md`. **The capture kit is no longer a blocking gate**: it is now
only needed for the one thing the bundle cannot supply, which is typed request/response *shapes*
(see the shape rule in Section 2).


**Phase 1 — Baseline and coverage tooling**

- [x] 1 — `1.a.i.zi` Record the build baseline
- [x] 2 — `1.a.i.zo` Record which tests need the Prism mock or the network, and report the base-URL finding
- [x] 3 — `1.a.ii.zi` `scripts/utils/coverage-report.cjs`
- [x] 4 — `1.a.ii.zo` Generate `docs/endpoint-status.md` and verify every `COVERAGE.md` row against the code

**Phase 2 — Evidence for the missing endpoints** *(rescoped 2026-10-15: the bundle is the evidence; the capture kit is now only for shapes)*

- [x] 5 — `2.a.i.zi` `docs/research/CAPTURE-GUIDE.md`
- [x] 6 — `2.a.i.zo` Evidence hand-back format
- [x] 7 — `2.a.ii.zi` `scripts/research/scrub-har.py` and a synthetic fixture
- [x] 8 — `2.a.ii.zo` `scripts/research/har-to-endpoints.py` and a fixture
- [x] 9 — `2.b.i.zi` Record the bundle evidence and the spec's server block; **P0 answered**; `docs/research/BUNDLE-EVIDENCE.md` + `docs/research/bundle-endpoints.md` *(was the owner's leaf; a session resolved it from public sources)*
- [ ] 10 — `2.b.i.zo` Record the final resource design for all 201 new endpoints: file names, accessors, methods and type strategy per domain; regenerate `COVERAGE.md` and `docs/endpoint-status.md` from the union; split Phase 3 into the leaves below

**Phase 3 — Implementation by domain** *(52 leaves: 26 domains √ó `zi`/`zo`. Every domain has bundle evidence for its paths; shapes follow the shape rule in Section 2.)*

**3.a — Songs, revisions, collaborators**

- [ ] 11 — `3.a.i.zi` G04 songs: create, list, invite-link, collaborators (3 new endpoints): implement
- [ ] 12 — `3.a.i.zo` G04 songs: tests and records
- [ ] 13 — `3.a.ii.zi` G05 delete revision: implement
- [ ] 14 — `3.a.ii.zo` G05 delete revision: tests and records
- [ ] 15 — `3.a.iii.zi` G11 add and update collaborator: implement
- [ ] 16 — `3.a.iii.zo` G11 add and update collaborator: tests and records

**3.b — Studio: effects and revisions**

- [ ] 17 — `3.b.i.zi` G02a effects: effect-presets, favourites, trending, artist presets (11 endpoints, likely split): implement
- [ ] 18 — `3.b.i.zo` G02a effects: tests and records
- [ ] 19 — `3.b.ii.zi` G02b revisions: studio-breakdown, mixdown, tracks, download-options, forks (7 endpoints): implement
- [ ] 20 — `3.b.ii.zo` G02b revisions: tests and records

**3.c — Audio: sounds, uploads, soundbanks**

- [ ] 21 — `3.c.i.zi` G03a sounds: samples, packs, libraries, claims, credits, uploads (22 endpoints, **must split**): implement
- [ ] 22 — `3.c.i.zo` G03a sounds: tests and records
- [ ] 23 — `3.c.ii.zi` G03b uploads v2.0: create, part (2 endpoints): implement
- [ ] 24 — `3.c.ii.zo` G03b uploads: tests and records
- [ ] 25 — `3.c.iii.zi` G03c soundbanks v4.3 + metronome v3.0 (3 endpoints): implement
- [ ] 26 — `3.c.iii.zo` G03c soundbanks: tests and records

**3.d — Messaging**

- [ ] 27 — `3.d.i.zi` G01 messaging: conversations, messages, reactions, receipts, chat authorizations (10 endpoints, **must split**): implement
- [ ] 28 — `3.d.i.zo` G01 messaging: tests and records

**3.e — Social and media**

- [ ] 29 — `3.e.i.zi` G06 posts: create, plays, polls, track-posts, song-posts, feeds (7 endpoints): implement
- [ ] 30 — `3.e.i.zo` G06 posts: tests and records
- [ ] 31 — `3.e.ii.zi` G07 comments and mentions (1 endpoint): implement
- [ ] 32 — `3.e.ii.zo` G07 comments: tests and records
- [ ] 33 — `3.e.iii.zi` G14 share and repost: implement
- [ ] 34 — `3.e.iii.zo` G14 share and repost: tests and records
- [ ] 35 — `3.e.iv.zi` G08 search: collaborators, trending by genre (2 endpoints): implement
- [ ] 36 — `3.e.iv.zo` G08 search: tests and records
- [ ] 37 — `3.e.v.zi` G12 media: profile pictures, backgrounds, video views (4 endpoints): implement
- [ ] 38 — `3.e.v.zo` G12 media: tests and records

**3.f — Account**

- [ ] 39 — `3.f.i.zi` G09 account: membership, privacy settings, marketing consent, streaks, activity status, verification (10 endpoints): implement
- [ ] 40 — `3.f.i.zo` G09 account: tests and records
- [ ] 41 — `3.f.ii.zi` G10 delete account, warnings, violations (3 endpoints; JSDoc marks deletes destructive): implement
- [ ] 42 — `3.f.ii.zo` G10 account: tests and records

**3.g — Newly discovered domains** *(none of these were in the original 47-leaf plan)*

- [ ] 43 — `3.g.i.zi` G13a beats: marketplace, collections, genres, promo, free-claims (8 endpoints): implement
- [ ] 44 — `3.g.i.zo` G13a beats: tests and records
- [ ] 45 — `3.g.ii.zi` G13b albums and artists (4 endpoints): implement
- [ ] 46 — `3.g.ii.zo` G13b albums: tests and records
- [ ] 47 — `3.g.iii.zi` G13c distribution: releases, analytics, quotas, splits (9 endpoints): implement
- [ ] 48 — `3.g.iii.zo` G13c distribution: tests and records
- [ ] 49 — `3.g.iv.zi` G13d promotion: campaigns, statistics, reach estimates (12 endpoints): implement
- [ ] 50 — `3.g.iv.zo` G13d promotion: tests and records
- [ ] 51 — `3.g.v.zi` G13e payments and checkout: payment methods, payouts, plan change (12 endpoints): implement
- [ ] 52 — `3.g.v.zo` G13e payments: tests and records
- [ ] 53 — `3.g.vi.zi` G13f pages: bio, links, press kits, revisions, statistics (11 endpoints): implement
- [ ] 54 — `3.g.vi.zo` G13f pages: tests and records
- [ ] 55 — `3.g.vii.zi` G13g feeds: for-you, following, featured, media, trending, explore (14 endpoints, **must split**): implement
- [ ] 56 — `3.g.vii.zo` G13g feeds: tests and records
- [ ] 57 — `3.g.viii.zi` G13h profile: playing-now, profile-views, gear, goals, mutual-connections (13 endpoints, **must split**): implement
- [ ] 58 — `3.g.viii.zo` G13h profile: tests and records
- [ ] 59 — `3.g.ix.zi` G13i library: likes, purchases, collections, recommendations, notifications (13 endpoints, **must split**): implement
- [ ] 60 — `3.g.ix.zo` G13i library: tests and records
- [ ] 61 — `3.g.x.zi` G13j misc + unclassified: settings, events, places, opportunities, schools, recaptcha, preview, projects, gears, options (20 endpoints): implement
- [ ] 62 — `3.g.x.zo` G13j misc: tests and records

**Phase 4 — Consistency and final audit**

- [ ] 63 — `4.a.i.zi` Tighten types where evidence gave real shapes
- [ ] 64 — `4.a.i.zo` JSDoc statuses, naming consistency, `api.md` complete
- [ ] 65 — `4.a.ii.zi` README: new resources and one example per new domain
- [ ] 66 — `4.a.ii.zo` Final coverage audit

**Phase 5 — Container image on GHCR (if possible)**

- [ ] 67 — `5.a.i.zi` Multi-stage `Dockerfile` and `.dockerignore`
- [ ] 68 — `5.a.i.zo` `scripts/container-smoke`
- [ ] 69 — `5.a.ii.zi` README container section
- [ ] 70 — `5.a.ii.zo` Default command
- [ ] 71 — `5.b.i.zi` `.github/workflows/container.yml`
- [ ] 72 — `5.b.i.zo` Owner steps document
- [ ] 73 — `5.b.ii.zi` Owner confirms the first CI run published the image and it pulls and runs *(owner's leaf)*

**Done so far: 9 of 73.** History of M: set at 47 on 2026-10-03; **raised to 73 on 2026-10-15** — leaf 9 (`2.b.i.zi`) completed from public evidence, and Phase 3 was resplit from 12 gaps into 26 domains (12 ‚Üí 52 leaves) and Phase 4/5 renumbered, because the bundle evidence showed 201 endpoints the spec never described. No parent was superseded, so no leaf ID was retired.

**Reporting rule:** a session that completes a leaf ends its final message with `N done ✅ of M`, read off this checklist **after** the session. One that completes none says `No new leaf completed — still N done of M`, with the reason. The tick, the count, Current position and the ledger line go in the leaf's own final commit, so the patch and the count can never disagree.

---

## 1a. Current position

```yaml
CURRENT_LEAF: 2.b.i.zo
CURRENT_LEAF_TITLE: Record the final resource design for all 201 new endpoints
CURRENT_LEAF_SPEC: docs/handover/TASKS.md  ->  "2.b.i.zo"  (read docs/research/BUNDLE-EVIDENCE.md and sessions/2.b.i.zi.md first)
FOCUS_RUN: "9 done of 73"
LAST_COMPLETED_LEAF: 2.b.i.zi
MARKER_COMMIT_SUBJECT_PREFIX: "2.b.i.zi:"
STATUS: READY
BLOCKERS: none that stop work. `2.b.i.zo` is the design leaf and needs no external input. Known limits, recorded so no session overclaims - (1) request/response SHAPES for the 201 new endpoints are NOT evidenced; source maps are 404, so the bundle yields paths and some methods but no types. Apply the shape rule in Section 2: implement the path with `unknown` bodies and status `unverified`, then tighten in 4.a.i.zi, OR wait for an owner capture for that domain. (2) 24 of 53 probed endpoints returned 404, which is inconclusive and must not be read as absence - see BUNDLE-EVIDENCE.md section 3. (3) The `v2.0` uploads, `v3.0` sounds and `v4.3` soundbanks routes do not resolve from the web host; they are mobile/studio-client routes. (4) P0 is ANSWERED: spec servers are `test.bandlab.com/api/v1.3` (test) and `bandlab.com/api/v1.3` (production); the SDK default already matches the first. The owner may still choose to change the default - that is a product decision, not an evidence gap. (5) 5.b.ii.zi remains the owner's leaf.
```

**Shape rule (added 2026-10-15, see rule D12 in Section 2).** The bundle proves a path exists; it does not prove the request or response shape. A session may therefore add a method whose body and response types are `unknown`, marked `unverified` in `docs/endpoint-status.md`, provided it says so in the JSDoc and the Done note. A session must **not** invent field names, required flags, enum values or nested types. Shapes are tightened only when evidence arrives.

**Sanity check at session start:**
```bash
git fetch origin
git log --oneline | grep "1.a.i.zi:"      # the previous leaf's marker commit must be present
```
If the marker is **not** in `git log`, the previous patch was never applied or pushed. **Stop and tell the owner.**

---

## 2. What this project is, and the rules

**Update the existing BandLab TypeScript SDK so it covers every BandLab API capability**, including the ones it is missing today (messaging, audio and samples, mix and effects, and a set of missing operations; see `COVERAGE.md`). Then **bake it as a container image on `ghcr.io`, if possible** (Phase 5). It is **not** an MCP server and **not** a restructure.

| # | Rule |
|---|------|
| D1 | **This is the owner's own project. Everything is editable, including `src/`.** |
| D2 | **Keep the existing tree. Extend it.** No relocating, renaming or splitting existing files; no new top-level directories. New code goes beside its neighbours (`ARCHITECTURE.md`, "Where new things go"). Files that must sit at the repo root (`Dockerfile`, `.dockerignore`) are files, not directories. |
| D3 | **Scope is SDK API coverage plus the container image.** No MCP server, tools, workflows, permission layers, bulk automation or registries. |
| D4 | **Additive only.** Every existing `client.*` call keeps working unchanged. |
| D5 | Python is allowed only in `scripts/research/` for evidence tooling. Never shipped, never imported by `src/`. |
| D6 | **Never invent an endpoint or a response shape.** Every new endpoint needs evidence (capture, spec or owner confirmation) and a status: `spec` / `captured` / `unverified` / `live-ok` / `missing`. |
| D7 | **Network reach (revised 2026-10-15).** The sandbox **can** reach `www.bandlab.com` and `test.bandlab.com` over HTTPS — the bundle and spec were fetched this way. `ghcr.io` and Docker Hub are still untested, and there is no container runtime without sudo. Live checks against BandLab should still be read-only and unauthenticated; a session must never claim an endpoint is live-verified on the basis of a probe alone (see D13). |
| D8 | Stainless and release scaffolding is left untouched. Do not run or merge codegen (it would overwrite hand edits). |
| D9 | Wire paths stay exactly as the server expects; follow the naming of neighbouring files. |
| D10 | **Direct-push rule (owner directive, 2026-10-15, supersedes the combined-patch rule).** Sessions **push directly to `main`**. Do **not** run the patch handoff: no `make-patch.sh`, no `.patch` file, no `git am` on the owner's side, no `NEXT_PATCH_NUMBER` bump. The commit on `main` *is* the handoff. The owner confirmed this after the 47→73 rescope. `scripts/handover/make-patch.sh` is retained only as a fallback if the owner asks for it again. |
| D11 | **Never bake secrets into an image.** Tokens are supplied at runtime only. |
| D12 | **Shape rule (2026-10-15).** Evidence proves a *path*; it does not prove a *shape*. A session may implement an evidenced path with `unknown` request/response types and status `unverified`, but must never invent field names, required flags, enum values or nested types. Shapes are tightened only when evidence arrives (`4.a.i.zi`). |
| D13 | **Evidence sources, in order of strength (2026-10-15):** (1) an authenticated capture by the owner; (2) the OpenAPI spec at the `openapi_spec_url` in `.stats.yml`; (3) the shipped web app bundle and its chunks; (4) a live unauthenticated probe. **A 404 is never evidence of absence** — real endpoints return 404 unauthenticated. Record which source each claim rests on. |

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
cd ~/bandlab-sdk-typescript
git pull --ff-only origin main
```
The owner does not apply patches any more (D10). If a session's push is rejected, `git pull --ff-only` then push again; if that conflicts, stop and report the base mismatch rather than force-pushing.

If a leaf cannot finish: mark it `[~]`, commit what exists with a `WIP:` prefix, say exactly what is left, and push. The next session resumes that leaf first.

---

## 4. Documents map

| File | Purpose |
|------|---------|
| `HANDOVER.md` | This file: formula, checklist (N of M), Current position, rules, process. |
| `docs/handover/TASKS.md` | The spec for every leaf (generated from the same table as the checklist). |
| `docs/handover/FORMULA.md` | The splitting formula: what was adopted from D-Store, what was changed, a worked split. |
| `docs/handover/ARCHITECTURE.md` | Existing tree, where new code goes, constraints. |
| `docs/handover/COVERAGE.md` | 17-domain matrix and the G-item register. |
| `docs/handover/endpoint-inventory.tsv` | Snapshot of the 123 existing endpoints. |
| `docs/handover/PROTOCOL.md` | Detailed session checklist and the Done-note template. |
| `docs/handover/LEDGER.md` | Append-only: one line per leaf. |
| `docs/handover/ORIGINAL-PLAN-TREE.md` | The cancelled MCP plan, kept as a domain checklist only. |
| `docs/handover/sessions/` | Done notes: `S00`, `S00B`, `S00C` (history) and one `<leaf path>.md` per leaf. |
| `docs/research/BUNDLE-EVIDENCE.md` | **The bundle evidence (2026-10-15):** sources, the 123-vs-225 finding, per-endpoint verification status, and what is still unevidenced. Read before any Phase 3 leaf. |
| `docs/research/bundle-endpoints.md` | All 225 clean endpoint paths, grouped by segment, each flagged SDK/NEW with its live probe result. |
| `scripts/handover/make-patch.sh` | Builds the combined patch. |

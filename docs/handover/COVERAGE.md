# Coverage Matrix and Missing-Capability Register

> **Rescoped 2026-10-15.** The original matrix below was built by searching the SDK's own code and
> the OpenAPI spec, and it concluded that 2 domains were Missing and 8 Partial. That conclusion was
> correct about the SDK but **wrong about BandLab**: the spec is a narrow subset (80 paths, 123
> operations) that contains no messaging, effects, sounds or uploads at all. The shipped web app
> bundle calls **236 path templates / 225 clean paths**, of which **201 are not in the SDK**.
> Method and limits: `docs/research/BUNDLE-EVIDENCE.md`. Path list: `docs/research/bundle-endpoints.md`.
> The matrix in section 1 is kept as the historical record; section 4 is the live target.

Source of truth for what the SDK covers. Baseline inventory (123 methods, snapshot of `api.md`): `endpoint-inventory.tsv`
(columns: HTTP verb, path, resource accessor). `1.a.ii.zi` builds a script that regenerates and diffs it.

Status vocabulary for endpoints (tracked in `docs/endpoint-status.md` from `1.a.ii.zo`):
`spec` (in the original OpenAPI spec) · `captured` (seen in a real request capture) · `unverified` (inferred, no evidence yet) · `live-ok` (owner ran it successfully) · `missing`.

## 1. Domain matrix (the 17 domains)

Verified against the code in `1.a.ii.zo`. **7 Covered · 8 Partial · 2 Missing.** Method names are the real SDK method names.

| # | Domain | Status | Existing accessors | What is missing |
|---|--------|--------|--------------------|-----------------|
| 01 | Account & Identity | Partial | `me` (retrieve, update), `passwords` (sendRestoreEmail, reset, change), `emails.confirmations` (confirm, resend), `logins` (list, create, update, delete), `users.createAccessKey`, `authorizations.createSessionKey`, `push.registrations` (create, delete), `settings.notifications.{email,push}` (retrieve, update) | dedicated change-email endpoint (but `me.update` has an `email` field, see G09) · delete-account |
| 02 | Users & Artists | Covered | `users` (retrieve, listBands, listCollections, listCommunities, listPosts, listSongs), `users.contacts` (listBands, listUsers), `users.recommendations` (listUsers), `users.blocks.users` (list, add, remove) | — |
| 03 | Search & Discovery | Partial | `search` (globalSearch, searchUsers, searchSongs, searchBands, searchCollections), `genres`, `skills`, `labels`, `badges` (list each) | search posts |
| 04 | Songs | Partial | `songs` (retrieve, update, delete, listPosts), `songs.revisions` (list, forks), `songs.collaborators`, `songs.invites`; songs are listed only per owner (`users.listSongs`, `bands.listSongs`) | create song (may be `POST /revisions`, see G04) · global song list |
| 05 | Projects & Revisions | Partial | `revisions` (create, retrieve, update, addPlay), `songs.revisions` (list, forks) | delete revision |
| 06 | Production / Mix / Effects | **Partial (types only)** | no dedicated endpoints. The `Revision` type (from the spec) carries `tracks`, `samples`, `auxChannels` (each with `effects`: `slug`, `bypass`, `params`), `mixdown`, `mastering`, `key`, so part of the project structure can be read and written through `revisions.retrieve/update/create`. Untested. | dedicated track, effect and mix endpoints (none seen); typed effect `params` (it is `unknown`) |
| 07 | Audio / Samples / Uploads | **Missing** | none (`AudioSample` is only `{id, name, status}`; `src/core/uploads.ts` handles generic file bodies) | audio upload, sample upload/get, audio metadata |
| 08 | Collaborators | Partial | `songs.collaborators` (list, remove) | add/update collaborator (only `songs.invites.sendInvites` exists; confirm) |
| 09 | Posts / Social | Partial | `posts` (list, retrieve, update, delete), `posts.comments` (list, create, delete), `posts.likes` (list, create, delete), `images.createPost`, `videos.createPost`, `communities.posts` (list, create) | create post (generic) · get/update comment · share / repost a track (G14) |
| 10 | Followers / Following | Covered | `users.followers` (list, add, remove), `users.following` (list, listPosts), `users.blocks.users` | — |
| 11 | Messaging | **Missing** | none | conversations, messages, send, history |
| 12 | Bands | Covered | `bands` (create, retrieve, update, delete, listPosts, listSongs), `bands.members` (list, retrieve, update, remove), `bands.invites` (list, send) | — |
| 13 | Communities | Covered | `communities` (create, retrieve, update, delete), `.members` (list, retrieve, update, delete), `.invites` (list, send), `.posts` (list, create) | — |
| 14 | Collections | Covered | `collections` (create, retrieve, update, delete), `.posts` (add, retrieve, updatePosition, remove), `.likes` (list, add, remove) | — |
| 15 | Notifications | Covered | `users.notifications` (list, count, listFollowing, update, updateAll), `settings.notifications.*` | — |
| 16 | Invitations | Covered | `invites` (retrieve, send, accept, delete), `users.invites`, `songs.invites`, `bands.invites`, `communities.invites` | — |
| 17 | Media / Metadata / Dev | Partial | `images.createPost`, `videos` (createPost, addView), `validation.validate`, `versions` (retrieve, validate), `reports.create`, `feedback.create` | get/upload image & video media |

### What "verified" means here
- The code has exactly **123** `this._client.<verb>(...)` calls in `src/resources`, and `api.md` has exactly **123** rows. Every call matches a row and every row matches a call (verb and path, parameters normalised); nothing is in one and not the other.
- Every documented method exists in its documented source file (123 of 123).
- Absence claims were checked by searching every `api.md` path and every resource file name for message / conversation / chat / inbox, effect / mix / automation / midi / master / track, audio / sample / loop / upload, repost / share / reshare, and account-deletion terms. No path matches; the only file-name hit is `shared.ts` (for "share"), which is a types file.
- **Limit:** absence from the SDK means absence from the OpenAPI spec the SDK was generated from. It is not proof that BandLab lacks the endpoint.

## 2. Missing-capability register  (each needs evidence before implementation)

| ID | Capability | Domain | Likely home | Evidence status |
|----|-----------|--------|-------------|-----------------|
| G01 | Messaging (conversations, messages, send, history) | 11 | new `src/resources/messaging.ts` (+ sub-resources if needed) | none (confirmed absent in `1.a.ii.zo`) |
| G02 | Mix / effects / tracks / track settings / project structure | 06 | new `src/resources/` file(s); extend the `Revision` types in `revisions.ts` | partial hint: the `Revision` type carries `tracks`, `samples`, `auxChannels.effects`, `mixdown`, `mastering` (spec types, untested); no dedicated endpoint seen |
| G03 | Audio upload, sample upload/get, audio metadata | 07 | new `src/resources/audio.ts`, `samples.ts` | none (confirmed absent) |
| G04 | Create song (may be `POST /revisions`); list songs | 04 | `songs/songs.ts` / `revisions.ts` | partial hint: `revisions.create` takes a `song` object (`SongSummary`), so a song may be created by creating its first revision; unconfirmed. No `POST /songs` exists. |
| G05 | Delete revision | 05 | `revisions.ts` | none (confirmed: no `DELETE /revisions/...`) |
| G06 | Create post (generic) | 09 | `posts/posts.ts` | none. Post creation exists only through `images.createPost`, `videos.createPost` and `communities.posts.create`; bands have `listPosts` but no create. |
| G07 | Get / update single comment | 09 | `posts/comments.ts` | none (confirmed: comments have list, create, delete only) |
| G08 | Search posts | 03 | `search.ts` | none (confirmed: no `/search/posts`) |
| G09 | Change email | 01 | `me.ts` (already has the field) / `emails/emails.ts` | partial hint: `me.update` (`PATCH /me`) accepts an `email` field in the spec types, so changing email may already work through it; `emails` has no methods of its own. Needs a capture of how the app does it. |
| G10 | Delete account | 01 | `me.ts` or new | none (confirmed absent) |
| G11 | Add / update collaborator | 08 | `songs/collaborators.ts` | partial hint: `songs.invites.sendInvites` |
| G12 | Image / video get + upload | 17 | `images.ts`, `videos.ts` | none (confirmed: only `createPost` / `addView` exist) |
| G13 | Unknown extras BandLab exposes that nobody listed (reposts, playlists, studio projects, etc.) | — | decided by research | n/a — discovered in `2.b.i.zi` |
| G14 | Share / repost a track (added in `0.a.ii.zo` after the owner asked about engagement) | 09 | `posts/posts.ts` or a new sub-resource | none (confirmed: no path or resource file matches share / repost / reshare) |

"none" means no request/response shape has been seen. Sessions must not guess shapes. A "partial hint" is a lead from the spec's own types, not evidence that the server accepts it.

## 3. Escape hatch for anything not yet modelled
`client.get|post|patch|put|delete(path, opts)` already exist on `BandlabSDK`. Research scripts and unverified experiments use these,
so no endpoint is ever blocked by the SDK itself.
## 4. Live target after the 2026-10-15 bundle evidence

Every path below is evidenced by the shipped BandLab web app (`docs/research/bundle-endpoints.md`). **Shapes are not evidenced** — see rule D12. Totals: 201 new endpoints across 24 groups, on top of the SDK's existing 123 (union 281 path templates, 324 operations once methods are settled).

| Group | Leaf | New endpoints | Proposed file | Contents |
|-------|------|---------------|---------------|----------|
| G01 Messaging | `3.d.i` | 10 | `src/resources/messaging/` | conversations, messages, reactions, receipts, chat authorizations |
| G02a Effects | `3.b.i` | 11 | `src/resources/effects.ts` | effect-presets, favourites, trending, artist presets |
| G02b Studio | `3.b.ii` | 7 | `src/resources/revisions.ts` (extend) | studio-breakdown, mixdown, tracks, download-options, forks |
| G03a Sounds | `3.c.i` | 22 | `src/resources/sounds/` | samples, packs, libraries, claims, credits, uploads — 22 endpoints, must split |
| G03b Uploads | `3.c.ii` | 2 | `src/resources/uploads.ts` | v2.0 create + part upload |
| G03c Soundbanks | `3.c.iii` | 3 | `src/resources/soundbanks.ts` | v4.3 soundbanks + v3.0 metronome |
| G04 Songs | `3.a.i` | 3 | `src/resources/songs/songs.ts` (extend) | create, list, invite-link, collaborators |
| G06 Posts | `3.e.i` | 7 | `src/resources/posts/posts.ts` (extend) | create, plays, polls, track-posts, song-posts |
| G07 Comments | `3.e.ii` | 1 | `src/resources/posts/comments.ts` (extend) | mentions/suggestions |
| G08 Search | `3.e.iv` | 2 | `src/resources/search.ts` (extend) | collaborators, trending by genre |
| G09 Account | `3.f.i` | 10 | `src/resources/me.ts` (extend) | membership, privacy, marketing consent, streaks, activity status, verification |
| G10 Account | `3.f.ii` | 3 | `src/resources/me.ts` (extend) | delete account, warnings, violations |
| G12 Media | `3.e.v` | 4 | `src/resources/users.ts` (extend) | profile pictures, backgrounds, video views |
| G13a Beats | `3.g.i` | 8 | `src/resources/beats.ts` | marketplace, collections, genres, promo, free-claims |
| G13b Albums | `3.g.ii` | 4 | `src/resources/albums.ts` | albums, artists |
| G13c Distribution | `3.g.iii` | 9 | `src/resources/distro.ts` | releases, analytics, quotas, distribution splits |
| G13d Promotion | `3.g.iv` | 12 | `src/resources/promote.ts` | campaigns, statistics, reach estimates |
| G13e Payments | `3.g.v` | 12 | `src/resources/payments.ts` | payment methods, payouts, checkout, plan change |
| G13f Pages | `3.g.vi` | 11 | `src/resources/pages.ts` | bio, links, press kits, revisions, statistics |
| G13g Feeds | `3.g.vii` | 14 | `src/resources/feeds.ts` | for-you, following, featured, media, trending, explore |
| G13h Profile | `3.g.viii` | 13 | `src/resources/users.ts` (extend) | playing-now, profile-views, gear, goals, mutual-connections |
| G13i Library | `3.g.ix` | 13 | `src/resources/users.ts` (extend) | likes, purchases, collections, recommendations, notifications |
| G13j Misc | `3.g.x` | 10 | `src/resources/misc.ts` | settings, events, places, opportunities, schools, recaptcha, preview, projects |
| G13z Unclassified | `3.g.x` | 10 | assign in `2.b.i.zo` | residual paths not yet assigned to a domain |
| **Total** | | **201** | | |

### 4.1 Methods recovered from call sites

145 method+path pairs were recovered from the bundle (77 GET, 35 POST, 16 DELETE, 10 PUT, 7 PATCH). The remaining paths are path-only, so their verb is `unverified` until a capture arrives. A session must not assume REST convention fills the gap — `POST /songs` returned 404 while `GET /songs/{id}/invite-link` returned 403, so verbs genuinely differ from the obvious guess.

### 4.2 What is still blocked

| Item | Status | Unblock route |
|------|--------|---------------|
| Request/response shapes for the 201 new endpoints | **blocked** | Owner capture per domain, or implement untyped per D12 |
| Verbs for the ~80 path-only endpoints | **partially blocked** | Owner capture; D12 allows `unverified` |
| `v2.0` uploads / `v3.0` sounds / `v4.3` soundbanks behaviour | **blocked** | These do not resolve from the web host; need a mobile/studio capture |
| P0 base host | **resolved** | Spec servers block: test + production hosts both recorded |
| G04 create song verb | **unconfirmed** | `POST /songs` gave 404; needs a capture |

Nothing above stops `2.b.i.zo` (the design leaf) or any `zi` leaf from starting under D12.

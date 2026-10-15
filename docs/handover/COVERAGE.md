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
## 4. Live target after the 2026-10-15 APK evidence

`docs/research/APK-EVIDENCE.md` supersedes the bundle as the evidence source (rule D13). The
decompiled Android app proves **344 BandLab paths the SDK does not expose**, a verb for **all 344**,
and a real response shape for **265**. The bundle's 201 was a subset: the APK adds 262 paths it never
had and supplies verbs for the rest.

The full resource assignment, with file, accessor and type strategy per path, is
`docs/handover/RESOURCE-DESIGN.md`. Summary:

| Resource | File | Endpoints | Typed |
|----------|------|-----------|-------|
| `users` | `src/resources/users.ts (extend)` | 53 | 41 |
| `sounds` | `src/resources/sounds/` | 30 | 26 |
| `ai` | `src/resources/ai/` | 30 | 22 |
| `messaging` | `src/resources/messaging/` | 19 | 14 |
| `beats` | `src/resources/beats.ts` | 16 | 13 |
| `albums` | `src/resources/albums.ts` | 15 | 8 |
| `library` | `src/resources/library.ts` | 15 | 13 |
| `distro` | `src/resources/distro.ts` | 15 | 12 |
| `feeds` | `src/resources/feeds.ts` | 13 | 12 |
| `images` | `src/resources/images.ts (extend)` | 12 | 12 |
| `posts` | `src/resources/posts/ (extend)` | 11 | 4 |
| `me` | `src/resources/me.ts (extend)` | 11 | 5 |
| `effects` | `src/resources/effects.ts` | 10 | 7 |
| `revisions` | `src/resources/revisions.ts (extend)` | 9 | 7 |
| `promote` | `src/resources/promote.ts` | 9 | 8 |
| `search` | `src/resources/search.ts (extend)` | 8 | 7 |
| `bands` | `src/resources/bands/ (extend)` | 7 | 5 |
| `membership` | `src/resources/membership.ts` | 6 | 5 |
| `payments` | `src/resources/payments.ts` | 6 | 5 |
| `aiVideos` | `src/resources/ai-videos.ts` | 5 | 4 |
| `songs` | `src/resources/songs/ (extend)` | 5 | 4 |
| `communities` | `src/resources/communities/ (extend)` | 5 | 4 |
| `misc` | `src/resources/misc.ts` | 5 | 3 |
| `authorizations` | `src/resources/authorizations.ts (extend)` | 5 | 4 |
| `validation` | `src/resources/validation.ts (extend)` | 4 | 4 |
| `uploads` | `src/resources/uploads.ts` | 4 | 3 |
| `pages` | `src/resources/pages.ts` | 3 | 3 |
| `streaks` | `src/resources/streaks.ts` | 3 | 1 |
| `syncedLyrics` | `src/resources/synced-lyrics.ts` | 2 | 2 |
| `videos` | `src/resources/videos.ts (extend)` | 2 | 2 |
| `tracks` | `src/resources/tracks.ts` | 2 | 2 |
| `collections` | `src/resources/collections/ (extend)` | 1 | 1 |
| `soundbanks` | `src/resources/soundbanks.ts` | 1 | 1 |
| `passwords` | `src/resources/passwords.ts (extend)` | 1 | 0 |
| `genres` | `src/resources/genres.ts (extend)` | 1 | 1 |
| **Total** | | **344** | **265** |

35 resources: 14 extend an existing file, 21 are new. Union with the SDK's existing 123 endpoints
is 467 operations.

### 4.1 Methods recovered

The APK gives a verb for every path: 344 of 344. Distribution is in
`docs/research/apk-endpoints.md`. The verb map is derived from method names and validated against
the spec and by in-file coherence; `@lik` = PUT is the one entry with realistic doubt
(`APK-EVIDENCE.md` §4).

### 4.2 What is still open

| Item | Status | Unblock route |
|------|--------|---------------|
| Request bodies for ~half the endpoints | **partially open** | typed where a `@c74` body model is in the descriptor set; the rest take `unknown` under D12, or an owner capture |
| Response shape for 79 of 344 paths | **open** | owner capture, or leave `apk-path-only` |
| `@lik` = PUT confirmation | **open** | owner capture or a live probe |
| AI/ML host deployment (staging vs production) | **open** | owner confirmation |
| Entitlement / subscriptions | **not applicable** | server-side by design; rule D14 |

Nothing here stops any Phase 3 leaf: each implements the evidenced path and marks the row
`apk` or `apk-path-only`.

### 4.3 Third-party surface

Exclusion is **by host group, never by path segment** (rule D15). The `AMPLITUDE_EXPERIMENT`,
`AMPLITUDE_ANALYTICS` and `BRANCH` hosts are third-party analytics/attribution SDKs bundled in the
app, not BandLab API: 9 paths, excluded deliberately. An earlier path-prefix rule also dropped
BandLab's own `/experiment/...` namespace by mistake; those five paths are BandLab API and are
kept, with the `experiment` prefix stripped for resource routing.

### 4.4 Subscriptions

The owner asked for all services to be free. Gating is server-side; a client cannot remove it, and
bypassing payment would breach BandLab's terms. Rule D14 records the decision and the legitimate
alternative: expose the full free surface, and expose membership, coin, wallet and quota endpoints
read-only so callers can read their own state. Details: `APK-EVIDENCE.md` §8.

# Resource design — the 344 evidenced endpoints

**Leaf:** `2.b.i.zo` · **Date:** 2026-10-15 · **Evidence:** `docs/research/APK-EVIDENCE.md`

This is the design that Phase 3 implements. Every path in `docs/research/apk-endpoints.md`
is assigned to exactly one SDK resource, with its target file and accessor. No path is left
unassigned, and no resource invents an endpoint.

## 1. Conventions

The existing tree is extended, never restructured (rule D2). New code follows its neighbours:

- A resource with one file is `src/resources/<name>.ts` and exports a class named for the file,
  following `src/resources/badges.ts`, `src/resources/genres.ts`.
- A resource with several files is a directory with an `index.ts` re-exporting the parts,
  following `src/resources/songs/` and `src/resources/posts/`.
- Every resource gains one accessor on the client, added to the existing accessor block in
  `src/client.ts`. Existing accessors are untouched (rule D4).
- Method names are verb-first and mirror the app method where it is informative
  (`getRevisionVideoPosts` → `listRevisionVideoPosts`).
- Types: where the APK gave a shape (§6 of the evidence), the response is typed with real field
  names. Where it did not, the response is `unknown` and the row is `apk-path-only`. Rule D12
  still forbids inventing a field, an enum or a required flag.
- Every method carries a JSDoc line naming its evidence source and status, so `api.md` and
  `docs/endpoint-status.md` can be checked against it.

Statuses used for new rows: `apk` (path, verb and shape from the decompile),
`apk-path-only` (path and verb only), `live-ok` (owner ran it). `unverified` is retired for
APK-backed rows, because the APK *is* evidence.

## 2. Resource assignment

| # | Resource | File | Endpoints | Typed | Verbs |
|---|---|---|---|---|---|
| 1 | `users` | `src/resources/users.ts (extend)` | 53 | 41 | DELETE, GET, PATCH, POST, PUT |
| 2 | `sounds` | `src/resources/sounds/` | 30 | 26 | DELETE, GET, POST, PUT |
| 3 | `ai` | `src/resources/ai/` | 30 | 22 | DELETE, GET, POST |
| 4 | `messaging` | `src/resources/messaging/` | 19 | 14 | DELETE, GET, POST, PUT |
| 5 | `beats` | `src/resources/beats.ts` | 16 | 13 | GET, POST, PUT |
| 6 | `albums` | `src/resources/albums.ts` | 15 | 8 | DELETE, GET, POST, PUT |
| 7 | `library` | `src/resources/library.ts` | 15 | 13 | DELETE, GET, POST, PUT |
| 8 | `distro` | `src/resources/distro.ts` | 15 | 12 | GET, POST, PUT |
| 9 | `feeds` | `src/resources/feeds.ts` | 13 | 12 | GET, PUT |
| 10 | `images` | `src/resources/images.ts (extend)` | 12 | 12 | POST |
| 11 | `posts` | `src/resources/posts/ (extend)` | 11 | 4 | DELETE, GET, POST, PUT |
| 12 | `me` | `src/resources/me.ts (extend)` | 11 | 5 | GET, PATCH, POST |
| 13 | `effects` | `src/resources/effects.ts` | 10 | 7 | DELETE, GET, PATCH, POST |
| 14 | `revisions` | `src/resources/revisions.ts (extend)` | 9 | 7 | GET, PATCH, POST |
| 15 | `promote` | `src/resources/promote.ts` | 9 | 8 | GET |
| 16 | `search` | `src/resources/search.ts (extend)` | 8 | 7 | GET, POST |
| 17 | `bands` | `src/resources/bands/ (extend)` | 7 | 5 | GET, POST |
| 18 | `membership` | `src/resources/membership.ts` | 6 | 5 | GET, POST |
| 19 | `payments` | `src/resources/payments.ts` | 6 | 5 | POST |
| 20 | `aiVideos` | `src/resources/ai-videos.ts` | 5 | 4 | GET, POST |
| 21 | `songs` | `src/resources/songs/ (extend)` | 5 | 4 | GET, POST |
| 22 | `communities` | `src/resources/communities/ (extend)` | 5 | 4 | GET, POST |
| 23 | `misc` | `src/resources/misc.ts` | 5 | 3 | GET, POST |
| 24 | `authorizations` | `src/resources/authorizations.ts (extend)` | 5 | 4 | GET, POST |
| 25 | `validation` | `src/resources/validation.ts (extend)` | 4 | 4 | GET |
| 26 | `uploads` | `src/resources/uploads.ts` | 4 | 3 | POST, PUT |
| 27 | `pages` | `src/resources/pages.ts` | 3 | 3 | GET, POST |
| 28 | `streaks` | `src/resources/streaks.ts` | 3 | 1 | GET, POST |
| 29 | `syncedLyrics` | `src/resources/synced-lyrics.ts` | 2 | 2 | GET |
| 30 | `videos` | `src/resources/videos.ts (extend)` | 2 | 2 | GET |
| 31 | `tracks` | `src/resources/tracks.ts` | 2 | 2 | GET |
| 32 | `collections` | `src/resources/collections/ (extend)` | 1 | 1 | GET |
| 33 | `soundbanks` | `src/resources/soundbanks.ts` | 1 | 1 | GET |
| 34 | `passwords` | `src/resources/passwords.ts (extend)` | 1 | 0 | POST |
| 35 | `genres` | `src/resources/genres.ts (extend)` | 1 | 1 | GET |
| — | *excluded* | Amplitude and Branch SDK hosts, excluded by host (`AMPLITUDE_EXPERIMENT`, `AMPLITUDE_ANALYTICS`, `BRANCH`) — third-party, not BandLab API | 9 | 0 | GET, POST |
| | | **Total** | **344** | **265** | |

The 35 resources sit beside the 25 existing accessors; 14 extend a file that already exists
(`users.ts`, `posts/`, `revisions.ts`, `me.ts`, `search.ts`, `songs/`, `bands/`, `albums.ts`,
`images.ts`, `communities/`, `validation.ts`, `collections/`, `genres.ts`, `passwords.ts`), and
21 are new files or directories.

## 3. Phase 3 leaf mapping

A leaf is one task. Resources of about nine endpoints or fewer get one leaf; the four larger
ones are split so no leaf exceeds roughly twenty endpoints. Each leaf has a `zi` (implement)
and a `zo` (prove and record) half, as the formula requires.

| Resource | Endpoints | Leaves |
|---|---|---|
| `users` | 53 | 3 (`i`, `ii`, `iii`) |
| `sounds` | 30 | 2 (`vi`, `vii`) |
| `ai` | 30 | 2 (`iv`, `v`) |
| `messaging` | 19 | 2 (`viii`, `ix`) |
| `beats` | 16 | 1 |
| `albums` | 15 | 1 |
| `library` | 15 | 1 |
| `distro` | 15 | 1 |
| `feeds` | 13 | 1 |
| `images` | 12 | 1 |
| `posts` | 11 | 1 |
| `me` | 11 | 1 |
| `effects` | 10 | 1 |
| `revisions` | 9 | 1 |
| `promote` | 9 | 1 |
| `search` | 8 | 1 |
| `bands` | 7 | 1 |
| `membership` | 6 | 1 |
| `payments` | 6 | 1 |
| `aiVideos` | 5 | 1 |
| `songs` | 5 | 1 |
| `communities` | 5 | 1 |
| `misc` | 5 | 1 |
| `authorizations` | 5 | 1 |
| `validation` | 4 | 1 |
| `uploads` | 4 | 1 |
| `pages` | 3 | 1 |
| `streaks` | 3 | 1 |
| `syncedLyrics` | 2 | 1 |
| `videos` | 2 | 1 |
| `tracks` | 2 | 1 |
| `collections` | 1 | 1 |
| `soundbanks` | 1 | 1 |
| `passwords` | 1 | 1 |
| `genres` | 1 | 1 |

Totals: **40 `zi` leaves + 40 `zo` leaves = 80 Phase 3 leaves**, carrying 344 endpoints.
That is 4.4 endpoints per leaf, close to the original plan's 3.9 (52 leaves for 201 paths),
so the granularity is unchanged — only the count moved, because the evidence is larger.

## 4. What changed from the pre-APK design

| Aspect | Bundle-only plan | APK-backed design |
|---|---|---|
| Evidenced paths | 201 | **344** |
| Paths with a known verb | ~145 (from call sites) | **344 (100%)** |
| Paths with a typed response | 0 | **265 (77%)** |
| `unverified` rows expected | most of Phase 3 | only the 81 path-only rows |
| `4.a.i.zi` scope | retype everything | tighten the residue |
| Phase 3 leaves | 52 | 80 |

## 5. Boundaries this design respects

1. **No invented shapes.** A typed row means the serializer descriptor named the field. The
   evidence is recorded in `docs/research/apk-shapes.tsv`.
2. **No entitlement bypass.** Membership and quota endpoints are designed read-only.
   Entitlement is enforced server-side; see §8 of the evidence document.
3. **No third-party surface.** `AMPLITUDE_*` and `BRANCH` host groups are excluded deliberately.
4. **No live claims.** Every row is `apk` or `apk-path-only` until the owner runs it.

## 6. Request bodies

Response shapes are strong. Request bodies are recoverable only where the app method takes a
`@c74` body parameter whose model appears in the descriptor set; those are typed. The remainder
take `unknown` under D12 and are listed as `apk-path-only` in the per-domain leaf specs. This is
the one place a capture would still add value, and it is why the capture kit is retained.

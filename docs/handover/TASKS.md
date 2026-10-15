# Leaf Specs - SDK full-coverage program (101 leaves)

Generated from the same table as the checklist in `HANDOVER.md` Section 1, so the two cannot
disagree. Rules: `HANDOVER.md` Section 2. A leaf is one task; if it is bigger, split it first.
`zi` = build, `zo` = prove and record.

Phase 3 leaf specs below are generated from `docs/handover/RESOURCE-DESIGN.md` and
`docs/research/apk-endpoints.md`. Evidence for every path is in `docs/research/APK-EVIDENCE.md`.

---

## Phase 1 - Baseline and coverage tooling

### 1.a Baseline and tooling

**1 - `1.a.i.zi` - Record the build baseline** *(DONE)*

**2 - `1.a.i.zo` - Record which tests need the mock or the network** *(DONE)*

**3 - `1.a.ii.zi` - `scripts/utils/coverage-report.cjs`** *(DONE)*

**4 - `1.a.ii.zo` - Generate `docs/endpoint-status.md`** *(DONE)*

---

## Phase 2 - Evidence for the missing endpoints

**5 - `2.a.i.zi` - Capture guide** *(DONE)*

**6 - `2.a.i.zo` - Evidence hand-back format** *(DONE)*

**7 - `2.a.ii.zi` - `scripts/research/scrub-har.py`** *(DONE)*

**8 - `2.a.ii.zo` - `scripts/research/har-to-endpoints.py`** *(DONE)*

**9 - `2.b.i.zi` - Record the bundle evidence; P0 answered** *(DONE)*

**10 - `2.b.i.zo` - Record the final resource design** *(DONE)*

Evidence: `docs/research/APK-EVIDENCE.md` (344 BandLab paths, 344 verbs, 265 shapes, 35 resources; 9 third-party paths excluded by host).
Design: `docs/handover/RESOURCE-DESIGN.md`. M raised 73 -> 101. Next leaf: `3.a.i.zi`.

### Phase 3 progress

| Leaf | Domain | Status |
|---|---|---|
| `3.a.i.zi` | songs: forks, invite-link, invites, posts | DONE |
| `3.a.i.zo` | songs: tests and records | DONE (landed with `zi`) |
| `3.a.ii.zi` | revisions: breakdown, mixdown, download-options, forks | NEXT |

---

## Phase 3 - Implementation by domain

Every leaf here has APK evidence for its paths. Where `docs/research/apk-shapes.tsv` names the
response fields, type them; otherwise use `unknown` and mark the row `apk-path-only` (rule D12).
Never invent a field name. Each `zi` leaf: the methods, request/response types, JSDoc carrying the
evidence status, wiring in `src/client.ts` and the resource index, and the `api.md` line. Each
`zo` leaf: a custom-fetch-mock test in `tests/api-resources/`, the `docs/endpoint-status.md` row,
and the `COVERAGE.md` rows. Home per `ARCHITECTURE.md`; existing files are not moved or split.

### 3.a.i - songs: list, create, invite-link, collaborators

**11 - `3.a.i.zi` - songs: list, create, invite-link, collaborators: implement** *(DONE)*

Evidence for this leaf (`docs/research/apk-endpoints.md`), 5 path(s), file `src/resources/songs/ (extend)`:

- `POST songs/forks` -> `com.bandlab.revision.objects.Song`
- `GET songs/{id}/invite-link` -> `com.bandlab.song.api.InviteLink`
- `POST songs/{id}/invites` -> `(no shape)`
- `GET songs/{id}/invites?accepted=false` -> `com.bandlab.invite.api.Invite`
- `GET songs/{id}/posts` -> `com.bandlab.post.objects.Post`

**12 - `3.a.i.zo` - songs: list, create, invite-link, collaborators: tests and records**

Implemented in `3.a.i.zi` (both halves landed together, since the path fix needed a test in the same
change). Outcome: `songs.forks`, `songs.retrieveInviteLink` added; `songs.invites.listInvites` typed
with `Invite`/`InviteListResponse`; `listPosts` and both `invites` methods moved from the singular
`/song/...` route to the evidenced `/songs/...` route. See `sessions/3.a.i.zi.md`.
`docs/endpoint-status.md` and `COVERAGE.md` rows for this domain are updated.
Next leaf: `3.a.ii.zi`.

### 3.a.ii - revisions: breakdown, mixdown, download-options, forks

**13 - `3.a.ii.zi` - revisions: breakdown, mixdown, download-options, forks: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 9 path(s), file `src/resources/revisions.ts (extend)`:

- `PATCH contour/{projectID}/{regionID}/{activeSampleID}` -> `(no shape)`
- `GET revisions/{id}/artist` -> `com.bandlab.common.models.Artist`
- `GET revisions/{id}/forks/posts` -> `com.bandlab.post.objects.Post`
- `GET revisions/{id}/likes/users` -> `com.bandlab.user.models.User`
- `POST revisions/{id}/mixdown/reprocess` -> `(no shape)`
- `GET revisions/{id}/sharings` -> `com.bandlab.revision.objects.SharedKey`
- `GET revisions/{id}/studio-breakdown` -> `com.bandlab.track.rewind.screen.TrackRewindBreakdown`
- `GET revisions/{id}/track-videos/posts` -> `com.bandlab.post.objects.Post`
- `GET revisions/{id}?format=m4a` -> `com.bandlab.audio.downloader.api.SampleUri`

**14 - `3.a.ii.zo` - revisions: breakdown, mixdown, download-options, forks: tests and records**

### 3.a.iii - tracks

**15 - `3.a.iii.zi` - tracks: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 2 path(s), file `src/resources/tracks.ts`:

- `GET tracks/{id}/artist` -> `com.bandlab.common.models.Artist`
- `GET tracks/{id}?format=m4a` -> `com.bandlab.audio.downloader.api.SampleUri`

**16 - `3.a.iii.zo` - tracks: tests and records**

### 3.a.iv - bands: members, invites, follow-invitees, suggestions

**17 - `3.a.iv.zi` - bands: members, invites, follow-invitees, suggestions: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 7 path(s), file `src/resources/bands/ (extend)`:

- `GET bands/suggested` -> `com.bandlab.band.api.suggested.SuggestedBand`
- `GET bands/{bandId}/members/{userId}/follow-invitees` -> `com.bandlab.user.models.User`
- `POST bands/{bandId}/pins/posts/{postId}` -> `(no shape)`
- `GET bands/{id}/followers` -> `com.bandlab.user.models.User`
- `POST bands/{id}/followers/{userId}` -> `(no shape)`
- `GET bands/{id}/invites?accepted=false` -> `com.bandlab.invite.api.Invite`
- `GET bands/{id}/videos/posts` -> `com.bandlab.post.objects.Post`

**18 - `3.a.iv.zo` - bands: members, invites, follow-invitees, suggestions: tests and records**

### 3.a.v - albums: themes, likes, comments, posts, state, pictures

**19 - `3.a.v.zi` - albums: themes, likes, comments, posts, state, pictures: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 15 path(s), file `src/resources/albums.ts`:

- `POST albums/` -> `com.bandlab.post.objects.Album`
- `GET albums/themes` -> `com.bandlab.post.objects.AlbumTheme`
- `GET albums/{albumId}` -> `com.bandlab.post.objects.Album`
- `GET albums/{albumId}/comments/{commentId}/likes/users` -> `com.bandlab.user.models.User`
- `GET albums/{albumId}/likes/users` -> `com.bandlab.user.models.User`
- `POST albums/{albumId}/likes/users/{userId}` -> `(no shape)`
- `PUT albums/{albumId}/picture` -> `(no shape)`
- `POST albums/{albumId}/posts` -> `com.bandlab.post.objects.Post`
- `POST albums/{albumId}/posts/{postId}` -> `(no shape)`
- `PUT albums/{albumId}/posts/{postId}/order` -> `(no shape)`
- `PUT albums/{albumId}/state` -> `(no shape)`
- `GET albums/{id}/comments` -> `com.bandlab.comment.model.Comment`
- `DELETE albums/{id}/comments/{commentId}` -> `(no shape)`
- `POST albums/{id}/comments/{commentId}/likes/users/{userId}` -> `(no shape)`
- `GET artists` -> `com.bandlab.user.models.InspiredArtist`

**20 - `3.a.v.zo` - albums: themes, likes, comments, posts, state, pictures: tests and records**

### 3.b.i - effects: presets, favourites, trending, promo, artist presets

**21 - `3.b.i.zi` - effects: presets, favourites, trending, promo, artist presets: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 10 path(s), file `src/resources/effects.ts`:

- `GET effect-presets/{linkToken}` -> `com.bandlab.mixeditor.presets.effects.domain.api.preset.UnSavedPreset`
- `POST users/{userId}/effect-presets` -> `com.bandlab.mixeditor.presets.effects.domain.api.preset.SavedPreset`
- `GET users/{userId}/effect-presets/promo-campaigns/{campaignId}/content` -> `com.bandlab.mixeditor.presets.effects.domain.api.preset.RemotePreset`
- `PATCH users/{userId}/effect-presets/{presetId}` -> `com.bandlab.mixeditor.presets.effects.domain.api.preset.SavedPreset`
- `DELETE users/{userId}/effect-presets/{presetId}/link` -> `com.bandlab.mixeditor.presets.effects.domain.api.preset.SavedPreset`
- `GET users/{userId}/favorite-effect-ids` -> `com.bandlab.mixeditor.presets.services.FavoriteEffectResponse`
- `POST users/{userId}/favorite-effect-ids/{effectId}` -> `(no shape)`
- `GET users/{userId}/favorite-effect-presets-ids` -> `(no shape)`
- `POST users/{userId}/favorite-effect-presets-ids/{presetId}` -> `(no shape)`
- `GET users/{userId}/trending-effect-presets` -> `com.bandlab.mixeditor.presets.effects.domain.api.preset.RemotePreset`

**22 - `3.b.i.zo` - effects: presets, favourites, trending, promo, artist presets: tests and records**

### 3.b.ii - sounds: samples, packs, libraries, credits

**23 - `3.b.ii.zi` - sounds: samples, packs, libraries, credits: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 15 path(s), file `src/resources/sounds/`:

- `POST /v4/separation` -> `com.bandlab.tools.splitter.screen.api.SeparationStatusResponse`
- `GET instruments` -> `com.bandlab.mixeditor.palette.impl.model.PaletteInstrument`
- `GET loops/matches` -> `com.bandlab.sounds.rest.model.LoopMatchDto`
- `GET packs` -> `com.bandlab.loop.api.manager.models.LoopPack`
- `GET packs/filters` -> `com.bandlab.loop.api.manager.models.LoopsFilter`
- `GET samples` -> `com.bandlab.loop.api.manager.models.LoopSample`
- `GET samples/filters` -> `com.bandlab.mixeditor.library.filters.api.FilterDto`
- `POST samples/pack-ids` -> `com.bandlab.sounds.rest.model.SamplePackIdDto`
- `PUT samples/{id}` -> `com.bandlab.sync.services.impl.StorageObject`
- `GET samples/{id}?format=m4a` -> `com.bandlab.audio.downloader.api.SampleUri`
- `GET samples/{id}?format=mid` -> `com.bandlab.audio.downloader.api.SampleUri`
- `GET stamps/{stamp}/revision` -> `com.bandlab.revision.objects.Revision`
- `POST users/{userId}/claims/samples` -> `com.bandlab.sounds.credits.impl.service.CreditsResponse`
- `GET users/{userId}/claims/samples/ids` -> `com.bandlab.sounds.credits.impl.service.ClaimedSampleIdsResponse`
- `PUT users/{userId}/claims/samples/{sampleId}` -> `com.bandlab.sounds.credits.impl.service.CreditsResponse`

**24 - `3.b.ii.zo` - sounds: samples, packs, libraries, credits: tests and records**

### 3.b.iii - sounds: claims, uploads, sampler-kits, stamps

**25 - `3.b.iii.zi` - sounds: claims, uploads, sampler-kits, stamps: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 15 path(s), file `src/resources/sounds/`:

- `GET users/{userId}/credits` -> `com.bandlab.sounds.credits.impl.service.CreditsResponse`
- `GET users/{userId}/libraries/packs` -> `com.bandlab.sounds.rest.model.MySoundsLibraryResponse`
- `GET users/{userId}/libraries/samples` -> `com.bandlab.sounds.rest.model.MySoundsLibraryResponse`
- `GET users/{userId}/packs` -> `com.bandlab.mixeditor.library.sounds.api.service.SoundsPackDto`
- `PUT users/{userId}/packs/{packId}` -> `(no shape)`
- `POST users/{userId}/sampler-kits` -> `com.bandlab.mixeditor.library.sampler.impl.service.SamplerKitDTO`
- `PUT users/{userId}/sampler-kits/{samplerKitId}` -> `com.bandlab.mixeditor.library.sampler.impl.service.SamplerKitDTO`
- `GET users/{userId}/samples` -> `com.bandlab.sounds.rest.model.SoundsSampleDto`
- `PUT users/{userId}/samples/{sampleId}` -> `(no shape)`
- `GET users/{userId}/uploads` -> `com.bandlab.mixeditor.library.sounds.mysounds.uploads.screen.model.SampleStorageInfoDto`
- `POST users/{userId}/uploads/samples` -> `com.bandlab.mixeditor.library.sounds.mysounds.uploads.screen.model.CreateUploadUrlResponse`
- `DELETE users/{userId}/uploads/samples/{sampleId}` -> `(no shape)`
- `GET v3/ideas` -> `com.bandlab.song.starter.domain.impl.IdeasResponseModel`
- `GET v3/native` -> `com.bandlab.boost.api.NativeAds`
- `GET v3/video` -> `(no shape)`

**26 - `3.b.iii.zo` - sounds: claims, uploads, sampler-kits, stamps: tests and records**

### 3.b.iv - uploads v2.0: create, part, complete

**27 - `3.b.iv.zi` - uploads v2.0: create, part, complete: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 4 path(s), file `src/resources/uploads.ts`:

- `POST upload` -> `com.bandlab.tools.spatial.screen.worker.api.SpatialStudioUploadResponse`
- `POST upload/{projectID}/{regionID}/{activeSampleID}` -> `(no shape)`
- `POST uploads/videos` -> `com.bandlab.video.uploader.api.FileUploadSession`
- `PUT uploads/videos/{uploadId}` -> `com.bandlab.video.uploader.impl.UploadMedia`

**28 - `3.b.iv.zo` - uploads v2.0: create, part, complete: tests and records**

### 3.b.v - soundbanks v4.3 and metronome v3.0

**29 - `3.b.v.zi` - soundbanks v4.3 and metronome v3.0: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 1 path(s), file `src/resources/soundbanks.ts`:

- `GET soundbanks` -> `com.bandlab.soundbanks.manager.SoundBanksLibrary`

**30 - `3.b.v.zo` - soundbanks v4.3 and metronome v3.0: tests and records**

### 3.c.i - AI: separation, transfer, task, model, presets

**31 - `3.c.i.zi` - AI: separation, transfer, task, model, presets: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 15 path(s), file `src/resources/ai/`:

- `GET /v1/daily_limits` -> `com.bandlab.tools.splitter.screen.api.SeparationLimitsResponse`
- `GET /v1/model/{modelId}/{version}/{feature} ` -> `(no shape)`
- `DELETE /v1/separation` -> `(no shape)`
- `GET /v1/separation/prediction` -> `com.bandlab.tools.splitter.screen.api.SeparationStatusResponse`
- `POST /v1/separation/sample` -> `com.bandlab.tools.splitter.screen.api.ForwardResultResponse`
- `GET /v1/separation/status` -> `com.bandlab.tools.splitter.screen.api.SeparationProgressResponse`
- `GET preview` -> `com.bandlab.network.models.Link`
- `POST task` -> `com.bandlab.mixeditor.palette.impl.service.PaletteStackTaskDto`
- `GET task/{id}` -> `com.bandlab.mixeditor.palette.impl.service.PaletteStackTaskDto`
- `GET task/{id}/download` -> `com.bandlab.mixeditor.palette.impl.service.PaletteStackTaskResultDto`
- `GET v0/similar` -> `(no shape)`
- `POST v1/autocomplete` -> `(no shape)`
- `POST v1/check_captcha` -> `(no shape)`
- `GET v1/displayed_genres` -> `com.bandlab.song.starter.domain.impl.GenreResponseModel`
- `GET v1/genres` -> `com.bandlab.audio.controller.autoMix.AutoMixGenresDto`

**32 - `3.c.i.zo` - AI: separation, transfer, task, model, presets: tests and records**

### 3.c.ii - AI: remix, autocomplete, captcha, genres, ideas

**33 - `3.c.ii.zi` - AI: remix, autocomplete, captcha, genres, ideas: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 15 path(s), file `src/resources/ai/`:

- `GET v1/ideas` -> `com.bandlab.song.starter.domain.impl.IdeasResponseModel`
- `GET v1/instruction-suggestions` -> `com.bandlab.audio.controller.autoMix.AutoMixPromptExamplesDto`
- `GET v1/models` -> `com.bandlab.mixeditor.ai.tools.harmonizer.impl.HarmonizerVoiceDto`
- `GET v1/presets` -> `com.bandlab.mixeditor.ai.tools.harmonizer.impl.HarmonizerPresetDto`
- `GET v1/previews` -> `com.bandlab.song.starter.root.impl.SongExamplesDTO`
- `GET v1/prompts` -> `com.bandlab.song.starter.audio.screen.controller.PromptsDTO`
- `POST v1/remix` -> `(no shape)`
- `POST v1/task` -> `com.bandlab.remote.task.processor.api.TaskStatusDTO`
- `GET v1/task/{id}` -> `com.bandlab.remote.task.processor.api.TaskStatusDTO`
- `GET v1/task/{id}/download` -> `com.bandlab.audio.controller.autoMix.AutoMixResultDto`
- `POST v1/transfer` -> `com.bandlab.remote.task.processor.api.TaskStatusDTO`
- `GET v1/transfer/{id}` -> `com.bandlab.remote.task.processor.api.TaskStatusDTO`
- `GET v1/transfer/{id}/download` -> `(no shape)`
- `GET v2/models` -> `com.bandlab.song.starter.root.impl.GetModelsDTO`
- `GET v2/report/bandlab_user/{id}` -> `(no shape)`

**34 - `3.c.ii.zo` - AI: remix, autocomplete, captcha, genres, ideas: tests and records**

### 3.c.iii - ai-videos: jobs, styles, generate, tokens

**35 - `3.c.iii.zi` - ai-videos: jobs, styles, generate, tokens: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 5 path(s), file `src/resources/ai-videos.ts`:

- `GET ai-videos/ai-tokens/price` -> `com.bandlab.ai.video.api.model.VideoGenerationCost`
- `POST ai-videos/generate` -> `(no shape)`
- `GET ai-videos/jobs` -> `com.bandlab.ai.video.api.model.VideoGenerationJob`
- `GET ai-videos/styles` -> `com.bandlab.ai.video.api.model.VisualStyleListResult`
- `GET ai-videos/updates` -> `com.bandlab.ai.video.api.model.VideoGenerationUnseenUpdates`

**36 - `3.c.iii.zo` - ai-videos: jobs, styles, generate, tokens: tests and records**

### 3.c.iv - synced lyrics

**37 - `3.c.iv.zi` - synced lyrics: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 2 path(s), file `src/resources/synced-lyrics.ts`:

- `GET synced-lyrics/ai-tokens/price` -> `com.bandlab.videomixer.lyric.api.SyncedLyricPrice`
- `GET synced-lyrics/{postId}` -> `com.bandlab.videomixer.lyric.api.SyncedLyricResponse`

**38 - `3.c.iv.zo` - synced lyrics: tests and records**

### 3.c.v - misc: settings, options, tracking, external

**39 - `3.c.v.zi` - misc: settings, options, tracking, external: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 5 path(s), file `src/resources/misc.ts`:

- `POST chat/authorizations` -> `com.bandlab.chat.objects.ChatWebSocketsUrl`
- `GET experiment/beats-filters` -> `com.bandlab.beat.api.BeatsFilters`
- `GET options` -> `(no shape)`
- `GET social-links` -> `com.bandlab.social.links.api.api.SocialLink`
- `POST tracking/v2/collect` -> `(no shape)`

**40 - `3.c.v.zo` - misc: settings, options, tracking, external: tests and records**

### 3.d.i - messaging: conversations, messages, receipts

**41 - `3.d.i.zi` - messaging: conversations, messages, receipts: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 10 path(s), file `src/resources/messaging/`:

- `POST conversations/{conversationId}/attachments/initialize-upload` -> `com.bandlab.chat.objects.ChatMediaInitUploadResponse`
- `PUT conversations/{conversationId}/attachments/{attachmentId}/complete-upload` -> `(no shape)`
- `GET conversations/{conversationId}/attachments/{attachmentId}/upload-state` -> `com.bandlab.video.uploader.api.FileUploadSession`
- `POST conversations/{conversationId}/blocks/members/{memberId}` -> `(no shape)`
- `GET conversations/{conversationId}/members` -> `com.bandlab.chat.objects.ChatMember`
- `GET conversations/{conversationId}/members/{memberId}` -> `com.bandlab.chat.objects.ChatMember`
- `GET users/{currentUserId}/chat/channels/{channelId}` -> `com.bandlab.chat.objects.Conversation`
- `GET users/{currentUserId}/chat/channels/{channelId}/messages` -> `com.bandlab.chat.objects.ChatMessage`
- `GET users/{currentUserId}/conversations` -> `com.bandlab.chat.objects.Conversation`
- `GET users/{currentUserId}/conversations/count?isAccepted=false` -> `com.bandlab.chat.objects.ChatCount`

**42 - `3.d.i.zo` - messaging: conversations, messages, receipts: tests and records**

### 3.d.ii - messaging: reactions, chat channels, read receipts

**43 - `3.d.ii.zi` - messaging: reactions, chat channels, read receipts: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 9 path(s), file `src/resources/messaging/`:

- `GET users/{currentUserId}/conversations/count?isRead=false` -> `com.bandlab.chat.objects.ChatCount`
- `GET users/{currentUserId}/conversations/hidden` -> `com.bandlab.chat.objects.Conversation`
- `GET users/{currentUserId}/conversations/{conversationId}` -> `com.bandlab.chat.objects.Conversation`
- `GET users/{currentUserId}/conversations/{conversationId}/messages` -> `com.bandlab.chat.objects.ChatMessage`
- `DELETE users/{currentUserId}/conversations/{conversationId}/messages/{messageId}` -> `(no shape)`
- `GET users/{currentUserId}/conversations/{conversationId}/messages/{messageId}/reactions` -> `com.bandlab.chat.objects.MemberReactionDTO`
- `POST users/{currentUserId}/conversations/{conversationId}/messages/{messageId}/receipts/read` -> `(no shape)`
- `GET users/{currentUserId}/conversations/{conversationId}/read-receipts` -> `com.bandlab.chat.objects.MemberReadTimeDTO`
- `DELETE users/{currentUserId}/conversations?isAccepted=false` -> `(no shape)`

**44 - `3.d.ii.zo` - messaging: reactions, chat channels, read receipts: tests and records**

### 3.d.iii - communities: rules, active, invites

**45 - `3.d.iii.zi` - communities: rules, active, invites: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 5 path(s), file `src/resources/communities/ (extend)`:

- `GET communities/trending` -> `com.bandlab.community.api.Community`
- `POST communities/{communityId}/pins/posts/{postId}` -> `(no shape)`
- `POST communities/{communityId}/posts` -> `com.bandlab.post.objects.Post`
- `GET communities/{communityId}/rules` -> `com.bandlab.communities.objects.CommunityRules`
- `GET communities/{id}/invites` -> `com.bandlab.community.api.Community.Invite`

**46 - `3.d.iii.zo` - communities: rules, active, invites: tests and records**

### 3.d.iv - posts: create, plays, polls, track-posts, mentions

**47 - `3.d.iv.zi` - posts: create, plays, polls, track-posts, mentions: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 11 path(s), file `src/resources/posts/ (extend)`:

- `GET mentions/suggestions` -> `com.bandlab.user.models.User`
- `POST posts/{id}/comments/{commentId}/likes/users/{userId}` -> `(no shape)`
- `GET posts/{id}/likes/users` -> `com.bandlab.user.models.User`
- `POST posts/{id}/likes/users/{userId}` -> `(no shape)`
- `GET posts/{id}/lyrics` -> `(no shape)`
- `POST posts/{id}/plays` -> `(no shape)`
- `GET posts/{id}/reactions/users` -> `com.bandlab.post.objects.PostReactionUser`
- `POST posts/{id}/reactions/users/{userId}` -> `(no shape)`
- `GET posts/{postId}/comments/{commentId}/likes/users` -> `com.bandlab.user.models.User`
- `DELETE posts/{postId}/poll/options/{optionId}/votes` -> `(no shape)`
- `PUT posts/{postId}/track/picture` -> `(no shape)`

**48 - `3.d.iv.zo` - posts: create, plays, polls, track-posts, mentions: tests and records**

### 3.d.v - images: upload and variants

**49 - `3.d.v.zi` - images: upload and variants: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 12 path(s), file `src/resources/images.ts (extend)`:

- `POST images/albums` -> `com.bandlab.common.models.PictureResponse`
- `POST images/bandBackgrounds` -> `com.bandlab.common.models.PictureResponse`
- `POST images/bands` -> `com.bandlab.common.models.PictureResponse`
- `POST images/collections` -> `com.bandlab.common.models.PictureResponse`
- `POST images/communities` -> `com.bandlab.common.models.PictureResponse`
- `POST images/distroReleases` -> `com.bandlab.common.models.PictureResponse`
- `POST images/effect-presets` -> `com.bandlab.common.models.PictureResponse`
- `POST images/posts` -> `com.bandlab.video.uploader.impl.UploadMedia`
- `POST images/songs` -> `com.bandlab.common.models.PictureResponse`
- `POST images/tracks` -> `com.bandlab.common.models.PictureResponse`
- `POST images/userBackgrounds` -> `com.bandlab.bandlab.data.PictureResponse`
- `POST images/users` -> `com.bandlab.bandlab.data.PictureResponse`

**50 - `3.d.v.zo` - images: upload and variants: tests and records**

### 3.e.i - users: profile, pictures, views, gear

**51 - `3.e.i.zi` - users: profile, pictures, views, gear: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 18 path(s), file `src/resources/users.ts (extend)`:

- `GET backgrounds` -> `com.bandlab.write.post.background.api.WritePostBackground`
- `GET blacklists/passwords` -> `(no shape)`
- `GET gears` -> `com.bandlab.user.gear.api.Gear`
- `POST users` -> `com.bandlab.auth.models.Session`
- `POST users/parental-consent/check` -> `com.bandlab.auth.models.ParentalConsentCheckResponse`
- `GET users/suggested` -> `com.bandlab.user.models.User`
- `POST users/two-factor-requests/email` -> `com.bandlab.auth.models.TwoFactorSendCodeResponse`
- `POST users/two-factor-verifications/email` -> `com.bandlab.auth.models.Session`
- `POST users/v3/estimate` -> `com.bandlab.boost.estimate.api.ImpressionEstimate`
- `GET users/v3/report/bandlab_profile/{userId}` -> `com.bandlab.boost.api.BoostCampaignReport`
- `GET users/v3/report/{type}/{id}` -> `com.bandlab.boost.api.BoostCampaignReport`
- `GET users/v4/campaigns` -> `com.bandlab.boost.history.screen.api.BoostCampaign`
- `GET users/{id}/achievements` -> `(no shape)`
- `GET users/{id}/band-followings` -> `com.bandlab.bandlab.data.network.objects.Band`
- `GET users/{id}/collaboration-preferences` -> `(no shape)`
- `GET users/{id}/counters` -> `com.bandlab.user.models.UserCounters`
- `GET users/{id}/followers/count` -> `com.bandlab.social.actions.models.FollowRequestsCount`
- `PATCH users/{id}/followers/{followerId}` -> `(no shape)`

**52 - `3.e.i.zo` - users: profile, pictures, views, gear: tests and records**

### 3.e.ii - users: followers, invites, mutual-connections, pins

**53 - `3.e.ii.zi` - users: followers, invites, mutual-connections, pins: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 18 path(s), file `src/resources/users.ts (extend)`:

- `GET users/{id}/gear` -> `com.bandlab.user.gear.api.Gear`
- `GET users/{id}/gear-stats` -> `com.bandlab.user.gear.api.GearStats`
- `POST users/{id}/gear/{gearId}` -> `(no shape)`
- `GET users/{id}/genres/preferred` -> `(no shape)`
- `GET users/{id}/invites?types=band;song;community` -> `com.bandlab.invite.api.Invite`
- `GET users/{id}/mutual-connections` -> `com.bandlab.user.models.User`
- `GET users/{id}/mutual-connections/preview` -> `com.bandlab.user.models.User`
- `PATCH users/{id}/notifications/invites` -> `(no shape)`
- `GET users/{id}/playing-now` -> `com.bandlab.user.profile.api.model.PlayingNowStatus`
- `GET users/{id}/playing-now/setting` -> `com.bandlab.bandlab.data.SharePlayback`
- `GET users/{id}/profile-header` -> `com.bandlab.user.profile.api.model.UserHeader`
- `GET users/{id}/profile-views/counter` -> `com.bandlab.user.profile.viewers.api.ProfileViewsCountResponse`
- `GET users/{id}/profile-views/counter/default` -> `com.bandlab.user.profile.viewers.api.ProfileViewsCountResponse`
- `GET users/{id}/profile-views/viewers` -> `com.bandlab.user.profile.viewers.api.model.ProfileViewersUser`
- `GET users/{id}/profile/recommendations/artists` -> `com.bandlab.user.models.User`
- `GET users/{id}/recent-activity` -> `com.bandlab.user.models.UserRecentActivity`
- `GET users/{id}/recommended-collaborators` -> `com.bandlab.user.models.User`
- `GET users/{id}/search/recommendations/artists` -> `com.bandlab.user.models.User`

**54 - `3.e.ii.zo` - users: followers, invites, mutual-connections, pins: tests and records**

### 3.e.iii - users: settings, warnings, verified, two-factor

**55 - `3.e.iii.zi` - users: settings, warnings, verified, two-factor: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 17 path(s), file `src/resources/users.ts (extend)`:

- `GET users/{id}/top-track-posts` -> `com.bandlab.post.objects.Post`
- `GET users/{userId}/albums` -> `com.bandlab.post.objects.Album`
- `GET users/{userId}/artist-stats/{period}` -> `com.bandlab.artist.api.network.ArtistStat`
- `GET users/{userId}/artists-effect-presets` -> `com.bandlab.mixeditor.presets.effects.domain.api.preset.RemotePreset`
- `GET users/{userId}/communities/active` -> `com.bandlab.community.api.Community`
- `GET users/{userId}/highlighted-tracks` -> `com.bandlab.post.objects.Post`
- `PUT users/{userId}/invites/{inviteCode}` -> `com.bandlab.invite.link.collaborator.screen.InviteLinkCollabRepository.JoinAsCollaboratorResponse`
- `POST users/{userId}/latency-corrections` -> `com.bandlab.latency.api.LatencyCorrectionRecommendation`
- `POST users/{userId}/latency-measurements` -> `(no shape)`
- `GET users/{userId}/onboarding/recommendations/artists` -> `com.bandlab.user.models.User`
- `GET users/{userId}/profile-pictures` -> `com.bandlab.user.profile.pictures.api.ProfilePicture`
- `DELETE users/{userId}/profile-pictures/{pictureId}` -> `(no shape)`
- `PUT users/{userId}/profile-pictures/{pictureId}/main` -> `(no shape)`
- `GET users/{userId}/track-posts` -> `com.bandlab.post.objects.Post`
- `POST users/{userId}/track-posts/{postId}/plays` -> `(no shape)`
- `POST users/{userId}/video-posts/{postId}/plays` -> `(no shape)`
- `GET users/{userId}/videos/posts` -> `com.bandlab.post.objects.Post`

**56 - `3.e.iii.zo` - users: settings, warnings, verified, two-factor: tests and records**

### 3.e.iv - library: likes, purchases, collections, recommendations

**57 - `3.e.iv.zi` - library: likes, purchases, collections, recommendations: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 15 path(s), file `src/resources/library.ts`:

- `GET experiment/users/{userId}/purchases/beats` -> `com.bandlab.common.models.beat.Beat`
- `GET users/{id}/likes/collections` -> `com.bandlab.playlist.api.PlaylistCollection`
- `GET users/{id}/likes/posts` -> `com.bandlab.post.objects.Post`
- `GET users/{id}/recommendations/follow-back/artists` -> `com.bandlab.user.models.User`
- `GET users/{id}/recommendations/track-posts` -> `com.bandlab.post.objects.Post`
- `PUT users/{userId}/collections/{collectionId}` -> `com.bandlab.mixeditor.library.sounds.mysounds.collections.screen.model.CollectionDto`
- `PUT users/{userId}/collections/{collectionId}/{sampleId}` -> `com.bandlab.mixeditor.library.sounds.mysounds.collections.screen.model.CollectionDto`
- `GET users/{userId}/library/track-posts` -> `com.bandlab.post.objects.Post`
- `GET users/{userId}/likes/albums` -> `com.bandlab.post.objects.Album`
- `GET users/{userId}/pins/posts` -> `com.bandlab.post.objects.Post`
- `POST users/{userId}/pins/posts/{postId}` -> `(no shape)`
- `DELETE users/{userId}/playback-history/posts/{postId}` -> `(no shape)`
- `GET users/{userId}/posts-playback-history` -> `com.bandlab.playback.history.screen.model.PlaybackHistory`
- `GET users/{userId}/purchases/albums` -> `com.bandlab.post.objects.Album`
- `GET users/{userId}/recommendations/packs` -> `com.bandlab.mixeditor.library.sounds.api.service.SoundsPacksDto`

**58 - `3.e.iv.zo` - library: likes, purchases, collections, recommendations: tests and records**

### 3.e.v - feeds: for-you, following, featured, media, trending, explore

**59 - `3.e.v.zi` - feeds: for-you, following, featured, media, trending, explore: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 13 path(s), file `src/resources/feeds.ts`:

- `GET experiment/feeds/communities/posts` -> `com.bandlab.post.objects.Post`
- `GET explore/featured-bands` -> `com.bandlab.bandlab.data.network.objects.Band`
- `GET explore/multipadsampler/sections` -> `com.bandlab.mixeditor.library.sampler.impl.service.SamplerKitDTO`
- `GET explore/recommended-albums` -> `com.bandlab.post.objects.Album`
- `GET explore/trending-videos/posts` -> `com.bandlab.post.objects.Post`
- `GET explore/{features}/sections` -> `com.bandlab.loop.api.manager.models.Section`
- `GET feeds/trending/videos/posts` -> `com.bandlab.post.objects.Post`
- `GET recommendations/posts` -> `com.bandlab.post.objects.Post`
- `GET users/{id}/feeds/following/posts` -> `com.bandlab.post.objects.Post`
- `GET users/{id}/feeds/media/posts` -> `com.bandlab.post.objects.Post`
- `PUT users/{id}/feeds/trending/hidden-creators/{creator_id}` -> `(no shape)`
- `GET users/{id}/feeds/trending/posts` -> `com.bandlab.post.objects.Post`
- `GET users/{userId}/feeds/for-you/posts` -> `com.bandlab.post.objects.Post`

**60 - `3.e.v.zo` - feeds: for-you, following, featured, media, trending, explore: tests and records**

### 3.f.i - me: activity status, privacy, marketing consent, parental consent

**61 - `3.f.i.zi` - me: activity status, privacy, marketing consent, parental consent: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 11 path(s), file `src/resources/me.ts (extend)`:

- `POST marketing-consent` -> `(no shape)`
- `GET me/ftue` -> `com.bandlab.user.models.FirstTimeUXFlags`
- `POST me/ftue/set-inspired-by` -> `(no shape)`
- `POST me/ftue/used-studio` -> `(no shape)`
- `POST parental-consent` -> `(no shape)`
- `POST users/me/activity-status/heartbeat` -> `(no shape)`
- `GET users/{id}/activity-status` -> `com.bandlab.common.models.ActivityStatus`
- `GET users/{id}/settings/privacy/profile-views` -> `com.bandlab.user.profile.viewers.api.ProfileIncognitoStatusResponse`
- `GET users/{id}/warnings` -> `com.bandlab.user.models.UserWarnings`
- `GET users/{userId}/verified/submission` -> `com.bandlab.bl.verified.api.model.BlVerifiedResponse`
- `PATCH users/{user_id}/warnings/{id}` -> `(no shape)`

**62 - `3.f.i.zo` - me: activity status, privacy, marketing consent, parental consent: tests and records**

### 3.f.ii - streaks

**63 - `3.f.ii.zi` - streaks: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 3 path(s), file `src/resources/streaks.ts`:

- `POST streaks/enroll` -> `(no shape)`
- `GET streaks/me` -> `com.bandlab.feed.streaks.api.FeedStreaksData`
- `POST streaks/streak-lost-notified` -> `(no shape)`

**64 - `3.f.ii.zo` - streaks: tests and records**

### 3.f.iii - membership: plan, coins, wallet, AI-token balance (read-only)

**65 - `3.f.iii.zi` - membership: plan, coins, wallet, AI-token balance (read-only): implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 6 path(s), file `src/resources/membership.ts`:

- `GET coins/users/{userId}/ai-tokens/balance` -> `com.bandlab.song.starter.root.impl.tokens.TokensBalanceDTO`
- `GET experiment/users/{id}/membership-status` -> `com.bandlab.network.models.MembershipStatusShort`
- `GET membership/surveys/{id}` -> `com.bandlab.payments.membership.manage.cancellation.screen.service.SurveyQuestion`
- `POST membership/surveys/{id}/answers` -> `(no shape)`
- `GET users/{id}/membership-plan` -> `com.bandlab.network.models.MembershipStatus`
- `GET wallet/users/{userId}/balances/ai-tokens` -> `com.bandlab.payments.ai.token.api.model.AiTokenBalance`

**66 - `3.f.iii.zo` - membership: plan, coins, wallet, AI-token balance (read-only): tests and records**

### 3.f.iv - payments: checkout payment intents

**67 - `3.f.iv.zi` - payments: checkout payment intents: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 6 path(s), file `src/resources/payments.ts`:

- `POST checkout/products/beats/payment-providers/google-play-store/payment-intents` -> `com.bandlab.billing.api.PaymentIntent`
- `POST checkout/products/boost-profile/payment-providers/google-play-store/payment-intents` -> `com.bandlab.billing.api.PaymentIntent`
- `POST checkout/products/boost/payment-providers/google-play-store/payment-intents` -> `com.bandlab.billing.api.PaymentIntent`
- `POST checkout/products/membership/payment-providers/google-play-store/payment-intents` -> `com.bandlab.billing.google.play.subs.SubsPurchaseStamp`
- `POST checkout/products/membership/payment-providers/google-play-store/payment-intents/{paymentIntentId}/payment-confirmations` -> `com.bandlab.network.models.MembershipStatus`
- `POST checkout/products/{product}/payment-providers/google-play-store/payment-intents/{paymentIntentId}/payment-confirmations` -> `(no shape)`

**68 - `3.f.iv.zo` - payments: checkout payment intents: tests and records**

### 3.f.v - authorizations: registration, assertion, logout, passkeys

**69 - `3.f.v.zi` - authorizations: registration, assertion, logout, passkeys: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 5 path(s), file `src/resources/authorizations.ts (extend)`:

- `GET authorization/two-factor-methods` -> `com.bandlab.auth.models.TwoFactorAuthEmailResponse`
- `POST authorization/two-factor-requests/email` -> `com.bandlab.auth.models.TwoFactorSendCodeResponse`
- `POST connect/token` -> `com.bandlab.auth.models.Session`
- `GET external/token` -> `com.bandlab.auth.models.NonceToken`
- `POST logout` -> `(no shape)`

**70 - `3.f.v.zo` - authorizations: registration, assertion, logout, passkeys: tests and records**

### 3.g.i - search: collaborators, trending, hashtags, suggestions

**71 - `3.g.i.zi` - search: collaborators, trending, hashtags, suggestions: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 8 path(s), file `src/resources/search.ts (extend)`:

- `POST grouping/users/{userId}/tokens` -> `(no shape)`
- `GET hashtags/{name}/posts` -> `com.bandlab.post.objects.Post`
- `GET places?type=cities` -> `com.bandlab.collaborators.search.location.api.SearchLocationResult`
- `GET search/albums` -> `com.bandlab.post.objects.Album`
- `GET search/communities` -> `com.bandlab.community.api.Community`
- `GET search/tags` -> `com.bandlab.hashtag.api.Hashtag`
- `GET suggestions` -> `com.bandlab.mixeditor.library.search.screen.service.model.SearchSuggestionDto`
- `GET tags` -> `com.bandlab.hashtag.api.Hashtag`

**72 - `3.g.i.zo` - search: collaborators, trending, hashtags, suggestions: tests and records**

### 3.g.ii - validation and captcha

**73 - `3.g.ii.zi` - validation and captcha: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 4 path(s), file `src/resources/validation.ts (extend)`:

- `GET validation/band` -> `com.bandlab.network.models.auth.Availability`
- `GET validation/community` -> `com.bandlab.network.models.auth.Availability`
- `GET validation/distro` -> `com.bandlab.distro.api.models.FieldValidationResponse`
- `GET validation/user` -> `com.bandlab.network.models.auth.Availability`

**74 - `3.g.ii.zo` - validation and captcha: tests and records**

### 3.g.iii - passwords and account recovery

**75 - `3.g.iii.zi` - passwords and account recovery: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 1 path(s), file `src/resources/passwords.ts (extend)`:

- `POST passwords/reset` -> `(no shape)`

**76 - `3.g.iii.zo` - passwords and account recovery: tests and records**

### 3.g.iv - collections

**77 - `3.g.iv.zi` - collections: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 1 path(s), file `src/resources/collections/ (extend)`:

- `GET collections/{id}/likes/users` -> `com.bandlab.user.models.User`

**78 - `3.g.iv.zo` - collections: tests and records**

### 3.g.v - genres and displayed genres

**79 - `3.g.v.zi` - genres and displayed genres: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 1 path(s), file `src/resources/genres.ts (extend)`:

- `GET genres/{genreId}/posts/trending` -> `com.bandlab.post.objects.Post`

**80 - `3.g.v.zo` - genres and displayed genres: tests and records**

### 3.h.i - beats: marketplace, collections, genres, promo, free-claims

**81 - `3.h.i.zi` - beats: marketplace, collections, genres, promo, free-claims: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 16 path(s), file `src/resources/beats.ts`:

- `GET beats` -> `com.bandlab.common.models.beat.Beat`
- `GET beats/collections` -> `com.bandlab.beat.collections.api.BeatsCollection`
- `GET beats/collections/{collectionId}` -> `com.bandlab.beat.collections.api.BeatsCollection`
- `GET beats/free-beats` -> `com.bandlab.common.models.beat.Beat`
- `GET beats/genres/{genreId}` -> `com.bandlab.common.models.beat.Beat`
- `GET beats/limited-beats` -> `com.bandlab.common.models.beat.Beat`
- `GET beats/members-only-beats` -> `com.bandlab.common.models.beat.Beat`
- `GET beats/promo-carousels/{promoCampaignId}` -> `com.bandlab.common.models.beat.Beat`
- `GET beats/promo-header-beats` -> `com.bandlab.common.models.beat.Beat`
- `POST beats/{beatId}/free-claims` -> `(no shape)`
- `GET experiment/beats/{beatId}` -> `com.bandlab.common.models.beat.Beat`
- `GET users/{userId}/beats/daily-free-quota` -> `com.bandlab.beat.api.quota.FreeBeatsQuota`
- `PUT users/{userId}/beats/played/{beatId}` -> `(no shape)`
- `GET users/{userId}/beats/preferences` -> `com.bandlab.beat.api.UserPreferences`
- `GET users/{userId}/beats/preferred` -> `com.bandlab.common.models.beat.Beat`
- `PUT users/{userId}/beats/saved/{beatId}` -> `(no shape)`

**82 - `3.h.i.zo` - beats: marketplace, collections, genres, promo, free-claims: tests and records**

### 3.h.ii - distribution: releases, analytics, quotas, splits

**83 - `3.h.ii.zi` - distribution: releases, analytics, quotas, splits: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 15 path(s), file `src/resources/distro.ts`:

- `GET users/{userId}/distro` -> `(no shape)`
- `GET users/{userId}/distro/ai-covers` -> `com.bandlab.distro.generate.cover.api.models.AiGalleryItem`
- `GET users/{userId}/distro/artist-profiles` -> `com.bandlab.distro.api.models.ArtistProfiles`
- `GET users/{userId}/distro/form-options` -> `com.bandlab.distro.api.models.FormOptions`
- `GET users/{userId}/distro/projects` -> `com.bandlab.distro.api.models.DistroProject`
- `GET users/{userId}/distro/quotas` -> `com.bandlab.distro.api.models.DistroQuotas`
- `POST users/{userId}/distro/releases` -> `com.bandlab.distro.api.models.CreateReleaseDetailsResponse`
- `GET users/{userId}/distro/releases/{releaseId}` -> `com.bandlab.distro.api.models.ReleaseDetails`
- `POST users/{userId}/distro/releases/{releaseId}/ai-covers` -> `com.bandlab.distro.generate.cover.api.models.GenerateCoversResponse`
- `POST users/{userId}/distro/releases/{releaseId}/ai-covers/{pictureId}` -> `(no shape)`
- `PUT users/{userId}/distro/releases/{releaseId}/cover-art` -> `com.bandlab.distro.api.models.UpdateReleaseCoverArtResponse`
- `PUT users/{userId}/distro/releases/{releaseId}/songs` -> `com.bandlab.distro.api.models.UpdatedReleaseSongs`
- `PUT users/{userId}/distro/releases/{releaseId}/state` -> `(no shape)`
- `GET users/{userId}/distro/revisions` -> `com.bandlab.distro.api.models.UserRevisions`
- `POST users/{userId}/distro/uploads` -> `com.bandlab.distro.api.models.InitiateUploadResponse`

**84 - `3.h.ii.zo` - distribution: releases, analytics, quotas, splits: tests and records**

### 3.h.iii - promotion: campaigns, statistics, reach, banners

**85 - `3.h.iii.zi` - promotion: campaigns, statistics, reach, banners: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 9 path(s), file `src/resources/promote.ts`:

- `GET beats-promo-banners` -> `com.bandlab.beat.tab.screen.api.BeatsMemPromo`
- `GET populated-opportunities-banners` -> `com.bandlab.artist.dashboard.api.OpportunitiesBanner`
- `GET users/{userId}/boost-credits` -> `com.bandlab.boost.api.BoostCredits`
- `GET users/{userId}/fan-reach/fans/{initiatorId}` -> `com.bandlab.artist.fan.reach.api.SubscriberState`
- `GET users/{userId}/payout-methods/tipalti/balance` -> `(no shape)`
- `GET users/{userId}/payout/method-required` -> `com.bandlab.payments.api.UserPayoutMethodRequired`
- `GET users/{userId}/promo` -> `com.bandlab.mixeditor.library.sounds.promo.impl.service.PackSectionsDto`
- `GET users/{userId}/promo-campaigns` -> `com.bandlab.mixeditor.presets.services.FxPromoCampaign`
- `GET users/{userId}/promo-campaigns?type=BeatsCarousel` -> `com.bandlab.beat.api.AvailablePromoCarousel`

**86 - `3.h.iii.zo` - promotion: campaigns, statistics, reach, banners: tests and records**

### 3.h.iv - pages: bio, links, press kits, projects, statistics

**87 - `3.h.iv.zi` - pages: bio, links, press kits, projects, statistics: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 3 path(s), file `src/resources/pages.ts`:

- `POST projects/{id}/duplicates` -> `com.bandlab.song.duplicate.DuplicateSongResponse`
- `GET users/{id}/pages/bio` -> `com.bandlab.user.profile.find.me.on.api.BioPage`
- `GET users/{id}/pages/bio/state` -> `com.bandlab.user.profile.find.me.on.api.BioPageState`

**88 - `3.h.iv.zo` - pages: bio, links, press kits, projects, statistics: tests and records**

### 3.h.v - videos and video-mix

**89 - `3.h.v.zi` - videos and video-mix: implement**

Evidence for this leaf (`docs/research/apk-endpoints.md`), 2 path(s), file `src/resources/videos.ts (extend)`:

- `GET video-mix/stickers` -> `com.bandlab.videomixer.sticker.api.StickerListResponse`
- `GET videos/{id}?resolution=Standard` -> `com.bandlab.videomixer.service.utils.VideoFile`

**90 - `3.h.v.zo` - videos and video-mix: tests and records**

---

## Phase 4 - Consistency and final audit

**91 - `4.a.i.zi` - Tighten the remaining request bodies where a capture supplies them**

**92 - `4.a.i.zo` - JSDoc statuses, naming consistency, `api.md` complete**

**93 - `4.a.ii.zi` - README: new resources and one example per new domain**

**94 - `4.a.ii.zo` - Final coverage audit**

---

## Phase 5 - Container image on GHCR (if possible)

**95 - `5.a.i.zi` - Multi-stage `Dockerfile` and `.dockerignore`**

**96 - `5.a.i.zo` - `scripts/container-smoke`**

**97 - `5.a.ii.zi` - README container section**

**98 - `5.a.ii.zo` - Default command**

**99 - `5.b.i.zi` - `.github/workflows/container.yml`**

**100 - `5.b.i.zo` - Owner steps document**

**101 - `5.b.ii.zi` - Owner confirms the first CI run published the image** *(owner's leaf)*

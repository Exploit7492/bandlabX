# Endpoint inventory — extracted from the live BandLab web app bundle

Source: `https://www.bandlab.com/web-app/scripts/CYjIzzub.js` (main bundle, 1,947,947 bytes)
plus 217 lazy-loaded chunk files referenced by it, fetched from
`https://www.bandlab.com/web-app/scripts/<name>.js`.

Method: `scripts`-side extraction only — no guessing, no fabrication. Every path below
appears verbatim in BandLab's own shipped client. Template params are normalised to `{p}`.

Distinct endpoint paths: **225** across 4 API versions.

Legend: `SDK` = already covered by the SDK's 123 endpoints · `NEW` = not in the SDK ·
`probe` = HTTP status from an unauthenticated live request against `test.bandlab.com`
(401/400/200/403 = route exists; 404 = inconclusive, see note at the end).

## albums (3)

| API  | Path                               | In SDK | probe |
| ---- | ---------------------------------- | ------ | ----- |
| v1.3 | `/albums`                          | NEW    | 404   |
| v1.3 | `/albums/{p}/download-options`     | NEW    |       |
| v1.3 | `/albums/{p}/download-options/{p}` | NEW    |       |

## artists (1)

| API  | Path       | In SDK | probe |
| ---- | ---------- | ------ | ----- |
| v1.3 | `/artists` | NEW    | 500   |

## backgrounds (1)

| API  | Path           | In SDK | probe |
| ---- | -------------- | ------ | ----- |
| v1.3 | `/backgrounds` | NEW    |       |

## bands (4)

| API  | Path                 | In SDK | probe |
| ---- | -------------------- | ------ | ----- |
| v1.3 | `/bands`             | SDK    |       |
| v1.3 | `/bands/{p}/members` | SDK    |       |
| v1.3 | `/bands/{p}/posts`   | SDK    |       |
| v1.3 | `/bands/{p}/songs`   | SDK    |       |

## beats (8)

| API  | Path                         | In SDK | probe |
| ---- | ---------------------------- | ------ | ----- |
| v1.3 | `/beats`                     | NEW    | 200   |
| v1.3 | `/beats/collections`         | NEW    | 200   |
| v1.3 | `/beats/collections/{p}`     | NEW    |       |
| v1.3 | `/beats/genres/{p}`          | NEW    |       |
| v1.3 | `/beats/promo-carousels/{p}` | NEW    |       |
| v1.3 | `/beats/promo-header-beats`  | NEW    |       |
| v1.3 | `/beats/{p}`                 | NEW    |       |
| v1.3 | `/beats/{p}/free-claims`     | NEW    |       |

## chat (1)

| API  | Path                   | In SDK | probe |
| ---- | ---------------------- | ------ | ----- |
| v1.3 | `/chat/authorizations` | NEW    | 401   |

## checkout (3)

| API  | Path                                                                        | In SDK | probe |
| ---- | --------------------------------------------------------------------------- | ------ | ----- |
| v1.3 | `/checkout/products/{p}/payment-providers/{p}/payment-intents/{p}/payments` | NEW    |       |
| v1.3 | `/checkout/products/{p}/payment-providers/{p}/plan-change`                  | NEW    |       |
| v1.3 | `/checkout/products/{p}/payment-providers/{p}/preview-plan-change`          | NEW    |       |

## collections (1)

| API  | Path           | In SDK | probe |
| ---- | -------------- | ------ | ----- |
| v1.3 | `/collections` | SDK    |       |

## communities (3)

| API  | Path                       | In SDK | probe |
| ---- | -------------------------- | ------ | ----- |
| v1.3 | `/communities`             | SDK    |       |
| v1.3 | `/communities/{p}/members` | SDK    |       |
| v1.3 | `/communities/{p}/posts`   | NEW    |       |

## conversations (1)

| API  | Path                         | In SDK | probe |
| ---- | ---------------------------- | ------ | ----- |
| v1.3 | `/conversations/{p}/members` | NEW    | 200   |

## effect-presets (1)

| API  | Path                  | In SDK | probe |
| ---- | --------------------- | ------ | ----- |
| v1.3 | `/effect-presets/{p}` | NEW    | 400   |

## events (1)

| API  | Path      | In SDK | probe |
| ---- | --------- | ------ | ----- |
| v1.3 | `/events` | NEW    | 404   |

## experiment (5)

| API  | Path                                            | In SDK | probe |
| ---- | ----------------------------------------------- | ------ | ----- |
| v1.3 | `/experiment/beats-filters`                     | NEW    |       |
| v1.3 | `/experiment/beats/{p}`                         | NEW    |       |
| v1.3 | `/experiment/feeds/communities/posts`           | NEW    |       |
| v1.3 | `/experiment/users/{p}/beats/{p}/similar-beats` | NEW    |       |
| v1.3 | `/experiment/users/{p}/purchases/beats`         | NEW    |       |

## explore (2)

| API  | Path                             | In SDK | probe |
| ---- | -------------------------------- | ------ | ----- |
| v1.3 | `/explore/recommended-albums`    | NEW    |       |
| v1.3 | `/explore/trending-videos/posts` | NEW    |       |

## feeds (1)

| API  | Path                           | In SDK | probe |
| ---- | ------------------------------ | ------ | ----- |
| v1.3 | `/feeds/trending/videos/posts` | NEW    |       |

## gears (1)

| API  | Path     | In SDK | probe |
| ---- | -------- | ------ | ----- |
| v1.3 | `/gears` | NEW    | 404   |

## genres (1)

| API  | Path                         | In SDK | probe |
| ---- | ---------------------------- | ------ | ----- |
| v1.3 | `/genres/{p}/posts/trending` | NEW    | 200   |

## invites (1)

| API  | Path       | In SDK | probe |
| ---- | ---------- | ------ | ----- |
| v1.3 | `/invites` | SDK    |       |

## labels (1)

| API  | Path      | In SDK | probe |
| ---- | --------- | ------ | ----- |
| v1.3 | `/labels` | SDK    |       |

## logins (1)

| API  | Path      | In SDK | probe |
| ---- | --------- | ------ | ----- |
| v1.3 | `/logins` | SDK    |       |

## marketing-consent (1)

| API  | Path                 | In SDK | probe |
| ---- | -------------------- | ------ | ----- |
| v1.3 | `/marketing-consent` | NEW    | 404   |

## mentions (1)

| API  | Path                    | In SDK | probe |
| ---- | ----------------------- | ------ | ----- |
| v1.3 | `/mentions/suggestions` | NEW    | 401   |

## metronome (1)

| API  | Path         | In SDK | probe |
| ---- | ------------ | ------ | ----- |
| v3.0 | `/metronome` | NEW    | 404   |

## opportunities (1)

| API  | Path             | In SDK | probe |
| ---- | ---------------- | ------ | ----- |
| v1.3 | `/opportunities` | NEW    | 200   |

## options (1)

| API  | Path       | In SDK | probe |
| ---- | ---------- | ------ | ----- |
| v2.0 | `/options` | NEW    |       |

## passwords (1)

| API  | Path         | In SDK | probe |
| ---- | ------------ | ------ | ----- |
| v1.3 | `/passwords` | SDK    |       |

## payments (2)

| API  | Path                                             | In SDK | probe |
| ---- | ------------------------------------------------ | ------ | ----- |
| v1.3 | `/payments`                                      | NEW    |       |
| v1.3 | `/payments/users/{p}/payout-methods/tipalti/url` | NEW    |       |

## places (1)

| API  | Path      | In SDK | probe |
| ---- | --------- | ------ | ----- |
| v1.3 | `/places` | NEW    | 401   |

## posts (6)

| API  | Path                                | In SDK | probe |
| ---- | ----------------------------------- | ------ | ----- |
| v1.3 | `/posts`                            | SDK    | 404   |
| v1.3 | `/posts/{p}`                        | SDK    |       |
| v1.3 | `/posts/{p}/plays`                  | NEW    | 404   |
| v1.3 | `/posts/{p}/poll/options/{p}/votes` | NEW    | 404   |
| v1.3 | `/posts/{p}/reactions/users/{p}`    | NEW    |       |
| v1.3 | `/posts/{p}/track/picture`          | NEW    |       |

## preview (1)

| API  | Path       | In SDK | probe |
| ---- | ---------- | ------ | ----- |
| v1.3 | `/preview` | NEW    | 400   |

## projects (1)

| API  | Path                       | In SDK | probe |
| ---- | -------------------------- | ------ | ----- |
| v1.3 | `/projects/{p}/duplicates` | NEW    |       |

## promote (4)

| API  | Path                       | In SDK | probe |
| ---- | -------------------------- | ------ | ----- |
| v1.3 | `/promote/images`          | NEW    |       |
| v1.3 | `/promote/images/{p}`      | NEW    |       |
| v1.3 | `/promote/prices`          | NEW    |       |
| v1.3 | `/promote/reach-estimates` | NEW    |       |

## recaptcha (1)

| API  | Path                | In SDK | probe |
| ---- | ------------------- | ------ | ----- |
| v1.3 | `/recaptcha/verify` | NEW    |       |

## recommendations (1)

| API  | Path                     | In SDK | probe |
| ---- | ------------------------ | ------ | ----- |
| v1.3 | `/recommendations/users` | NEW    |       |

## revisions (8)

| API  | Path                                                                 | In SDK | probe |
| ---- | -------------------------------------------------------------------- | ------ | ----- |
| v1.3 | `/revisions`                                                         | SDK    |       |
| v1.3 | `/revisions/{p}/forks/bands/{p}`                                     | NEW    |       |
| v1.3 | `/revisions/{p}/forks/posts`                                         | NEW    |       |
| v1.3 | `/revisions/{p}/mixdown/download-options/{p}`                        | NEW    |       |
| v1.3 | `/revisions/{p}/mixdown/reprocess`                                   | NEW    | 401   |
| v1.3 | `/revisions/{p}/studio-breakdown`                                    | NEW    | 404   |
| v1.3 | `/revisions/{p}/tracks/{p}/download-options/aac-44100-16bit-192kbps` | NEW    |       |
| v1.3 | `/revisions/{p}/tracks/{p}/download-options/{p}`                     | NEW    | 401   |

## schools (1)

| API  | Path                      | In SDK | probe |
| ---- | ------------------------- | ------ | ----- |
| v1.3 | `/schools/{p}/classrooms` | NEW    |       |

## search (2)

| API  | Path                    | In SDK | probe |
| ---- | ----------------------- | ------ | ----- |
| v1.3 | `/search`               | SDK    |       |
| v1.3 | `/search/collaborators` | NEW    | 401   |

## settings (2)

| API  | Path                          | In SDK | probe |
| ---- | ----------------------------- | ------ | ----- |
| v1.3 | `/settings`                   | NEW    |       |
| v1.3 | `/settings/notifications/{p}` | NEW    |       |

## songs (4)

| API  | Path                       | In SDK | probe |
| ---- | -------------------------- | ------ | ----- |
| v1.3 | `/songs`                   | NEW    | 404   |
| v1.3 | `/songs/{p}/collaborators` | SDK    | 404   |
| v1.3 | `/songs/{p}/invite-link`   | NEW    | 403   |
| v1.3 | `/songs/{p}/posts`         | NEW    |       |

## soundbanks (2)

| API  | Path              | In SDK | probe |
| ---- | ----------------- | ------ | ----- |
| v4.3 | `/soundbanks`     | NEW    | 404   |
| v4.3 | `/soundbanks/{p}` | NEW    |       |

## sounds (20)

| API  | Path                                      | In SDK | probe |
| ---- | ----------------------------------------- | ------ | ----- |
| v3.0 | `/sounds`                                 | NEW    | 404   |
| v3.0 | `/sounds/loops/matches`                   | NEW    | 404   |
| v3.0 | `/sounds/samples/pack-ids`                | NEW    |       |
| v3.0 | `/sounds/suggestions`                     | NEW    | 404   |
| v3.0 | `/sounds/users/{p}/claims/samples`        | NEW    |       |
| v3.0 | `/sounds/users/{p}/claims/samples/ids`    | NEW    |       |
| v3.0 | `/sounds/users/{p}/claims/samples/{p}`    | NEW    |       |
| v3.0 | `/sounds/users/{p}/collections`           | NEW    |       |
| v3.0 | `/sounds/users/{p}/collections/{p}`       | NEW    |       |
| v3.0 | `/sounds/users/{p}/collections/{p}/{p}`   | NEW    |       |
| v3.0 | `/sounds/users/{p}/credits`               | NEW    |       |
| v3.0 | `/sounds/users/{p}/libraries/packs`       | NEW    |       |
| v3.0 | `/sounds/users/{p}/libraries/samples`     | NEW    | 404   |
| v3.0 | `/sounds/users/{p}/packs/{p}`             | NEW    |       |
| v3.0 | `/sounds/users/{p}/promo`                 | NEW    |       |
| v3.0 | `/sounds/users/{p}/recommendations/packs` | NEW    |       |
| v3.0 | `/sounds/users/{p}/samples/{p}`           | NEW    |       |
| v3.0 | `/sounds/users/{p}/uploads`               | NEW    | 404   |
| v3.0 | `/sounds/users/{p}/uploads/samples`       | NEW    | 404   |
| v3.0 | `/sounds/users/{p}/uploads/samples/{p}`   | NEW    |       |

## sounds-public (2)

| API  | Path                               | In SDK | probe |
| ---- | ---------------------------------- | ------ | ----- |
| v3.0 | `/sounds-public`                   | NEW    | 404   |
| v3.0 | `/sounds-public/packs/{p}/preview` | NEW    |       |

## streaks (3)

| API  | Path                            | In SDK | probe |
| ---- | ------------------------------- | ------ | ----- |
| v1.3 | `/streaks/enroll`               | NEW    |       |
| v1.3 | `/streaks/me`                   | NEW    | 404   |
| v1.3 | `/streaks/streak-lost-notified` | NEW    |       |

## trending-effect-presets (1)

| API  | Path                       | In SDK | probe |
| ---- | -------------------------- | ------ | ----- |
| v1.3 | `/trending-effect-presets` | NEW    | 200   |

## uploads (2)

| API  | Path               | In SDK | probe |
| ---- | ------------------ | ------ | ----- |
| v2.0 | `/uploads/{p}`     | NEW    | 404   |
| v2.0 | `/uploads/{p}/{p}` | NEW    |       |

## users (112)

| API  | Path                                                                    | In SDK | probe |
| ---- | ----------------------------------------------------------------------- | ------ | ----- |
| v1.3 | `/users`                                                                | NEW    |       |
| v1.3 | `/users/me/activity-status/heartbeat`                                   | NEW    |       |
| v1.3 | `/users/{p}`                                                            | SDK    |       |
| v1.3 | `/users/{p}/activity-status`                                            | NEW    |       |
| v1.3 | `/users/{p}/albums`                                                     | NEW    |       |
| v1.3 | `/users/{p}/artists-effect-presets`                                     | NEW    |       |
| v1.3 | `/users/{p}/beats/daily-free-quota`                                     | NEW    |       |
| v1.3 | `/users/{p}/beats/preferences`                                          | NEW    |       |
| v1.3 | `/users/{p}/beats/preferred`                                            | NEW    |       |
| v1.3 | `/users/{p}/beats/saved/{p}`                                            | NEW    |       |
| v1.3 | `/users/{p}/boost-profile/subscriptions`                                | NEW    |       |
| v1.3 | `/users/{p}/collections`                                                | SDK    |       |
| v1.3 | `/users/{p}/communities`                                                | SDK    |       |
| v1.3 | `/users/{p}/communities/active`                                         | NEW    |       |
| v1.3 | `/users/{p}/conversations`                                              | NEW    | 401   |
| v1.3 | `/users/{p}/conversations/count`                                        | NEW    | 401   |
| v1.3 | `/users/{p}/conversations/hidden`                                       | NEW    |       |
| v1.3 | `/users/{p}/conversations/{p}`                                          | NEW    |       |
| v1.3 | `/users/{p}/conversations/{p}/messages`                                 | NEW    | 401   |
| v1.3 | `/users/{p}/conversations/{p}/messages/{p}`                             | NEW    |       |
| v1.3 | `/users/{p}/conversations/{p}/messages/{p}/reactions`                   | NEW    |       |
| v1.3 | `/users/{p}/conversations/{p}/messages/{p}/receipts/read`               | NEW    |       |
| v1.3 | `/users/{p}/distro/ai-covers`                                           | NEW    |       |
| v1.3 | `/users/{p}/distro/analytics`                                           | NEW    |       |
| v1.3 | `/users/{p}/distro/payment-method/status`                               | NEW    |       |
| v1.3 | `/users/{p}/distro/projects`                                            | NEW    |       |
| v1.3 | `/users/{p}/distro/quotas`                                              | NEW    |       |
| v1.3 | `/users/{p}/distro/releases/{p}/ai-covers`                              | NEW    |       |
| v1.3 | `/users/{p}/distro/releases/{p}/distribution-split-invitations/accept`  | NEW    |       |
| v1.3 | `/users/{p}/distro/releases/{p}/distribution-split-invitations/decline` | NEW    |       |
| v1.3 | `/users/{p}/distro/revisions`                                           | NEW    |       |
| v1.3 | `/users/{p}/effect-presets`                                             | NEW    | 401   |
| v1.3 | `/users/{p}/effect-presets/promo-campaigns/{p}/content`                 | NEW    |       |
| v1.3 | `/users/{p}/effect-presets/{p}`                                         | NEW    |       |
| v1.3 | `/users/{p}/effect-presets/{p}/link`                                    | NEW    |       |
| v1.3 | `/users/{p}/favorite-effect-ids`                                        | NEW    |       |
| v1.3 | `/users/{p}/favorite-effect-ids/{p}`                                    | NEW    |       |
| v1.3 | `/users/{p}/favorite-effect-presets-ids`                                | NEW    | 401   |
| v1.3 | `/users/{p}/favorite-effect-presets-ids/{p}`                            | NEW    |       |
| v1.3 | `/users/{p}/feeds/featured/posts`                                       | NEW    |       |
| v1.3 | `/users/{p}/feeds/following/posts`                                      | NEW    |       |
| v1.3 | `/users/{p}/feeds/for-you/posts`                                        | NEW    | 401   |
| v1.3 | `/users/{p}/feeds/media/posts`                                          | NEW    |       |
| v1.3 | `/users/{p}/feeds/trending/hidden-creators/{p}`                         | NEW    |       |
| v1.3 | `/users/{p}/feeds/trending/posts`                                       | NEW    |       |
| v1.3 | `/users/{p}/followers/count`                                            | NEW    |       |
| v1.3 | `/users/{p}/gear`                                                       | NEW    |       |
| v1.3 | `/users/{p}/gear-stats`                                                 | NEW    | 404   |
| v1.3 | `/users/{p}/gear/{p}`                                                   | NEW    |       |
| v1.3 | `/users/{p}/genres/preferred`                                           | NEW    |       |
| v1.3 | `/users/{p}/goals`                                                      | NEW    |       |
| v1.3 | `/users/{p}/invites/{p}`                                                | NEW    |       |
| v1.3 | `/users/{p}/library/track-posts`                                        | NEW    |       |
| v1.3 | `/users/{p}/likes/albums`                                               | NEW    |       |
| v1.3 | `/users/{p}/likes/collections`                                          | NEW    |       |
| v1.3 | `/users/{p}/likes/posts`                                                | NEW    |       |
| v1.3 | `/users/{p}/membership`                                                 | NEW    | 401   |
| v1.3 | `/users/{p}/membership-plan`                                            | NEW    |       |
| v1.3 | `/users/{p}/mutual-connections`                                         | NEW    |       |
| v1.3 | `/users/{p}/mutual-connections/preview`                                 | NEW    |       |
| v1.3 | `/users/{p}/notifications`                                              | SDK    |       |
| v1.3 | `/users/{p}/opportunities`                                              | NEW    |       |
| v1.3 | `/users/{p}/paddle-billing/external-user-ids`                           | NEW    |       |
| v1.3 | `/users/{p}/pages`                                                      | NEW    | 401   |
| v1.3 | `/users/{p}/pages/bio`                                                  | NEW    |       |
| v1.3 | `/users/{p}/pages/bio/links`                                            | NEW    |       |
| v1.3 | `/users/{p}/pages/bio/links/{p}`                                        | NEW    |       |
| v1.3 | `/users/{p}/pages/press-kits/{p}`                                       | NEW    |       |
| v1.3 | `/users/{p}/pages/revisions`                                            | NEW    |       |
| v1.3 | `/users/{p}/pages/revisions/{p}`                                        | NEW    |       |
| v1.3 | `/users/{p}/pages/revisions/{p}/links`                                  | NEW    |       |
| v1.3 | `/users/{p}/pages/revisions/{p}/links/{p}`                              | NEW    |       |
| v1.3 | `/users/{p}/pages/statistics`                                           | NEW    |       |
| v1.3 | `/users/{p}/pages/{p}/statistics`                                       | NEW    |       |
| v1.3 | `/users/{p}/payment-methods`                                            | NEW    |       |
| v1.3 | `/users/{p}/payout-methods/tipalti/balance`                             | NEW    |       |
| v1.3 | `/users/{p}/payout-methods/tipalti/payouts`                             | NEW    |       |
| v1.3 | `/users/{p}/payout-methods/tipalti/payouts/{p}/tracks`                  | NEW    |       |
| v1.3 | `/users/{p}/payout/method-required`                                     | NEW    |       |
| v1.3 | `/users/{p}/playing-now`                                                | NEW    | 204   |
| v1.3 | `/users/{p}/playing-now/setting`                                        | NEW    |       |
| v1.3 | `/users/{p}/posts`                                                      | SDK    |       |
| v1.3 | `/users/{p}/profile-pictures`                                           | NEW    | 500   |
| v1.3 | `/users/{p}/profile-pictures/{p}`                                       | NEW    |       |
| v1.3 | `/users/{p}/profile-pictures/{p}/main`                                  | NEW    |       |
| v1.3 | `/users/{p}/profile-views/counter`                                      | NEW    | 401   |
| v1.3 | `/users/{p}/profile-views/counter/default`                              | NEW    |       |
| v1.3 | `/users/{p}/profile-views/viewers`                                      | NEW    |       |
| v1.3 | `/users/{p}/promo-campaigns`                                            | NEW    |       |
| v1.3 | `/users/{p}/promote/boost-campaigns/{p}`                                | NEW    |       |
| v1.3 | `/users/{p}/promote/campaigns`                                          | NEW    |       |
| v1.3 | `/users/{p}/promote/campaigns/{p}`                                      | NEW    |       |
| v1.3 | `/users/{p}/promote/music-web-campaigns/{p}`                            | NEW    |       |
| v1.3 | `/users/{p}/promote/posts/{p}/music-web-campaigns`                      | NEW    |       |
| v1.3 | `/users/{p}/promote/posts/{p}/music-web-campaigns/{p}`                  | NEW    |       |
| v1.3 | `/users/{p}/promote/posts/{p}/statistics`                               | NEW    |       |
| v1.3 | `/users/{p}/promote/revision-pages/{p}/music-web-campaigns`             | NEW    |       |
| v1.3 | `/users/{p}/purchases/albums`                                           | NEW    |       |
| v1.3 | `/users/{p}/recommendations/posts`                                      | NEW    |       |
| v1.3 | `/users/{p}/settings/privacy/{p}`                                       | NEW    | 404   |
| v1.3 | `/users/{p}/song-posts`                                                 | NEW    |       |
| v1.3 | `/users/{p}/songs`                                                      | SDK    |       |
| v1.3 | `/users/{p}/tipalti-balance/tracks`                                     | NEW    |       |
| v1.3 | `/users/{p}/track-posts`                                                | NEW    | 200   |
| v1.3 | `/users/{p}/track-posts/{p}/plays`                                      | NEW    |       |
| v1.3 | `/users/{p}/trending-effect-presets`                                    | NEW    |       |
| v1.3 | `/users/{p}/verified/submission`                                        | NEW    |       |
| v1.3 | `/users/{p}/video-posts/{p}/plays`                                      | NEW    |       |
| v1.3 | `/users/{p}/violations/{p}`                                             | NEW    |       |
| v1.3 | `/users/{p}/warnings`                                                   | NEW    |       |
| v1.3 | `/users/{p}/warnings/{p}`                                               | NEW    |       |
| v1.3 | `/users/{p}/{p}`                                                        | NEW    |       |

## validation (1)

| API  | Path              | In SDK | probe |
| ---- | ----------------- | ------ | ----- |
| v1.3 | `/validation/{p}` | SDK    |       |

## videos (1)

| API  | Path                | In SDK | probe |
| ---- | ------------------- | ------ | ----- |
| v1.3 | `/videos/{p}/views` | SDK    | 404   |

## Note on the live probes

404 is **not** evidence of absence: several endpoints known to exist (for example
`/badges`, `/validation`, `/reports`, `/bands/{id}`) also return 404 unauthenticated.
Endpoints returning 401 need a bearer token; the `v2.0` upload, `v3.0` sounds and
`v4.3` soundbanks routes are reachable only from the mobile/studio client and return
404 from this host. Treat the bundle as the evidence, and the probe as a cross-check.

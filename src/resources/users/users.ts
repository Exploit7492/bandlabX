// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as GenresAPI from '../genres';
import * as MeAPI from '../me';
import * as SkillsAPI from '../skills';
import * as AlbumsAPI from '../albums';
import * as BandsAPI from '../bands/bands';
import * as CommunitiesAPI from '../communities/communities';
import * as EffectsAPI from '../effects';
import * as PostsAPI from '../posts/posts';
import * as ContactsAPI from './contacts';
import {
  ContactListBandsParams,
  ContactListBandsResponse,
  ContactListUsersParams,
  Contacts,
} from './contacts';
import * as FollowersAPI from './followers';
import { FollowerListParams, Followers, Paging, UserList } from './followers';
import * as FollowingAPI from './following';
import { Following, FollowingListParams, FollowingListPostsParams } from './following';
import * as InvitesAPI from './invites';
import { InviteList, InviteListParams, InviteSendParams, Invites } from './invites';
import * as NotificationsAPI from './notifications';
import {
  NotificationCountResponse,
  NotificationList,
  NotificationListFollowingParams,
  NotificationListParams,
  NotificationPatch,
  NotificationUpdateAllParams,
  NotificationUpdateParams,
  Notifications,
} from './notifications';
import * as RecommendationsAPI from './recommendations';
import { RecommendationListUsersParams, Recommendations } from './recommendations';
import * as BlocksAPI from './blocks/blocks';
import { Blocks } from './blocks/blocks';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Users extends APIResource {
  followers: FollowersAPI.Followers = new FollowersAPI.Followers(this._client);
  following: FollowingAPI.Following = new FollowingAPI.Following(this._client);
  invites: InvitesAPI.Invites = new InvitesAPI.Invites(this._client);
  notifications: NotificationsAPI.Notifications = new NotificationsAPI.Notifications(this._client);
  recommendations: RecommendationsAPI.Recommendations = new RecommendationsAPI.Recommendations(this._client);
  contacts: ContactsAPI.Contacts = new ContactsAPI.Contacts(this._client);
  blocks: BlocksAPI.Blocks = new BlocksAPI.Blocks(this._client);

  /**
   * Returns a single user
   */
  retrieve(userID: string, options?: RequestOptions): APIPromise<UserRetrieveResponse> {
    return this._client.get(path`/users/${userID}`, options);
  }

  /**
   * Registers a user
   *
   * Evidence: `apk` — `AuthService`, `POST users`. Response typed from
   * `com.bandlab.auth.models.Session`.
   */
  create(body: UserCreateParams, options?: RequestOptions): APIPromise<Session> {
    return this._client.post('/users', { body, ...options });
  }

  /**
   * Checks a parental-consent code
   *
   * Evidence: `apk` — `AuthService`, `POST users/parental-consent/check`. Response typed from
   * `com.bandlab.auth.models.ParentalConsentCheckResponse`.
   */
  checkParentalConsent(body: unknown, options?: RequestOptions): APIPromise<ParentalConsentCheckResponse> {
    return this._client.post('/users/parental-consent/check', { body, ...options });
  }

  /**
   * Sends a two-factor code by email
   *
   * Evidence: `apk` — `AuthService`, `POST users/two-factor-requests/email`. Response typed from
   * `com.bandlab.auth.models.TwoFactorSendCodeResponse`.
   */
  createTwoFactorRequest(body: unknown, options?: RequestOptions): APIPromise<TwoFactorSendCodeResponse> {
    return this._client.post('/users/two-factor-requests/email', { body, ...options });
  }

  /**
   * Verifies a two-factor code sent by email
   *
   * Evidence: `apk` — `AuthService`, `POST users/two-factor-verifications/email`. Response typed
   * from `com.bandlab.auth.models.Session`.
   */
  createTwoFactorVerification(body: unknown, options?: RequestOptions): APIPromise<Session> {
    return this._client.post('/users/two-factor-verifications/email', { body, ...options });
  }

  /**
   * Lists all available gear
   *
   * Evidence: `apk` — `GearService`, `GET gears`. Response typed from
   * `com.bandlab.user.gear.api.Gear`.
   */
  listGear(
    query: UserListGearParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<GearList> {
    return this._client.get('/gears', { query, ...options });
  }

  /**
   * Returns password blacklist status
   *
   * Evidence: `apk` — `AuthService`, `GET blacklists/passwords`. No APK response shape.
   */
  listPasswordBlacklists(
    query: UserListPasswordBlacklistsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<unknown> {
    return this._client.get('/blacklists/passwords', { query, ...options });
  }

  /**
   * Estimates the reach of a boost
   *
   * Evidence: `apk` — `NativeAdsService`, `POST users/v3/estimate`. Response typed from
   * `com.bandlab.boost.estimate.api.ImpressionEstimate`.
   */
  estimateImpressions(body: unknown, options?: RequestOptions): APIPromise<ImpressionEstimate> {
    return this._client.post('/users/v3/estimate', { body, ...options });
  }

  /**
   * Returns the boost report for a BandLab profile
   *
   * Evidence: `apk` — `NativeAdsService`, `GET users/v3/report/bandlab_profile/{userId}`. Response
   * typed from `com.bandlab.boost.api.BoostCampaignReport`.
   */
  retrieveBandlabProfileBoostReport(
    userID: string,
    options?: RequestOptions,
  ): APIPromise<BoostCampaignReport> {
    return this._client.get(path`/users/v3/report/bandlab_profile/${userID}`, options);
  }

  /**
   * Returns a boost report by type
   *
   * Evidence: `apk` — `NativeAdsService`, `GET users/v3/report/{type}/{id}`. Response typed from
   * `com.bandlab.boost.api.BoostCampaignReport`.
   */
  retrieveBoostReport(
    id: string,
    params: UserRetrieveBoostReportParams,
    options?: RequestOptions,
  ): APIPromise<BoostCampaignReport> {
    const { type } = params;
    return this._client.get(path`/users/v3/report/${type}/${id}`, options);
  }

  /**
   * Lists a user's boost campaigns
   *
   * Evidence: `apk` — `BoostCampaignService`, `GET users/v4/campaigns`. Response typed from
   * `com.bandlab.boost.history.screen.api.BoostCampaign`.
   */
  listBoostCampaigns(
    query: UserListBoostCampaignsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<BoostCampaignList> {
    return this._client.get('/users/v4/campaigns', { query, ...options });
  }

  /**
   * Generates one-time access key
   */
  createAccessKey(userID: string, options?: RequestOptions): APIPromise<UserCreateAccessKeyResponse> {
    return this._client.post(path`/users/${userID}/keys`, options);
  }

  /**
   * Returns a list of bands
   */
  listBands(
    userID: string,
    query: UserListBandsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<BandsAPI.Band> {
    return this._client.get(path`/users/${userID}/bands`, { query, ...options });
  }

  /**
   * Returns a list of collections
   */
  listCollections(
    userID: string,
    query: UserListCollectionsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<CollectionList> {
    return this._client.get(path`/users/${userID}/collections`, { query, ...options });
  }

  /**
   * Returns a list of bands
   */
  listCommunities(
    userID: string,
    query: UserListCommunitiesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UserListCommunitiesResponse> {
    return this._client.get(path`/users/${userID}/communities`, { query, ...options });
  }

  /**
   * Returns a list of posts
   */
  listPosts(
    userID: string,
    query: UserListPostsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PostsAPI.PostList> {
    return this._client.get(path`/users/${userID}/posts`, { query, ...options });
  }

  /**
   * Returns a list of songs
   */
  listSongs(
    userID: string,
    query: UserListSongsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SongList> {
    return this._client.get(path`/users/${userID}/songs`, { query, ...options });
  }

  /**
   * Returns the available write-post backgrounds
   *
   * Evidence: `apk` — `WritePostBgService`, `GET backgrounds`. Response typed from
   * `com.bandlab.write.post.background.api.WritePostBackground`.
   */
  listBackgrounds(
    query: UserListBackgroundsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<BackgroundList> {
    return this._client.get('/backgrounds', { query, ...options });
  }

  /**
   * Returns a user's counters
   *
   * Evidence: `apk` — `UserService`, `GET users/{id}/counters`. Response typed from
   * `com.bandlab.user.models.UserCounters`.
   */
  retrieveCounters(userID: string, options?: RequestOptions): APIPromise<UsersUserCounters> {
    return this._client.get(path`/users/${userID}/counters`, options);
  }

  /**
   * Returns a user's follow-request count
   *
   * Evidence: `apk` — `SocialActionService`, `GET users/{id}/followers/count`. Response typed from
   * `com.bandlab.social.actions.models.FollowRequestsCount`.
   */
  retrieveFollowerCount(userID: string, options?: RequestOptions): APIPromise<FollowRequestsCount> {
    return this._client.get(path`/users/${userID}/followers/count`, options);
  }

  /**
   * Updates a follower
   *
   * Evidence: `apk` — `SocialActionService`, `PATCH users/{id}/followers/{followerId}`.
   */
  updateFollower(
    followerID: string,
    params: UserUpdateFollowerParams,
    options?: RequestOptions,
  ): APIPromise<void> {
    const { id, ...body } = params;
    return this._client.patch(path`/users/${id}/followers/${followerID}`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns a user's achievements
   *
   * Evidence: `apk` — `UserService`, `GET users/{id}/achievements`. No response shape is in the
   * descriptor set, so the response is `unknown` under rule D12.
   */
  listAchievements(userID: string, options?: RequestOptions): APIPromise<unknown> {
    return this._client.get(path`/users/${userID}/achievements`, options);
  }

  /**
   * Returns the bands a user follows
   *
   * Evidence: `apk` — `BandService`, `GET users/{id}/band-followings`. Response typed from
   * `com.bandlab.bandlab.data.network.objects.Band`.
   */
  listBandFollowings(userID: string, options?: RequestOptions): APIPromise<BandFollowingsList> {
    return this._client.get(path`/users/${userID}/band-followings`, options);
  }

  /**
   * Returns a user's collaboration preferences
   *
   * Evidence: `apk` — `UserService`, `GET users/{id}/collaboration-preferences`. No response shape
   * is in the descriptor set, so the response is `unknown` under rule D12.
   */
  retrieveCollaborationPreferences(userID: string, options?: RequestOptions): APIPromise<unknown> {
    return this._client.get(path`/users/${userID}/collaboration-preferences`, options);
  }

  /**
   * Returns suggested users to follow
   *
   * Evidence: `apk` — `FindFriendsService`, `GET users/suggested`. Response typed from
   * `com.bandlab.user.models.User`.
   */
  listSuggested(
    query: UserListSuggestedParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UserProfileList> {
    return this._client.get('/users/suggested', { query, ...options });
  }

  /**
   * Returns a user's gear
   *
   * Evidence: `apk` — `GearService`, `GET users/{id}/gear`. Response typed from
   * `com.bandlab.user.gear.api.Gear`.
   */
  retrieveGear(userID: string, options?: RequestOptions): APIPromise<Gear> {
    return this._client.get(path`/users/${userID}/gear`, options);
  }

  /**
   * Returns a user's gear stats
   *
   * Evidence: `apk` — `GearService`, `GET users/{id}/gear-stats`. Response typed from
   * `com.bandlab.user.gear.api.GearStats`.
   */
  retrieveGearStats(userID: string, options?: RequestOptions): APIPromise<GearStats> {
    return this._client.get(path`/users/${userID}/gear-stats`, options);
  }

  /**
   * Adds a gear item to a user
   *
   * Evidence: `apk` — `GearService`, `POST users/{id}/gear/{gearId}`.
   */
  addGear(gearID: string, params: UserAddGearParams, options?: RequestOptions): APIPromise<void> {
    const { id, ...body } = params;
    return this._client.post(path`/users/${id}/gear/${gearID}`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns a user's preferred genres
   *
   * Evidence: `apk` — `UserService`, `GET users/{id}/genres/preferred`. No response shape is in the
   * descriptor set, so the response is `unknown` under rule D12.
   */
  listPreferredGenres(userID: string, options?: RequestOptions): APIPromise<unknown> {
    return this._client.get(path`/users/${userID}/genres/preferred`, options);
  }

  /**
   * Returns a user's invites
   *
   * Evidence: `apk` — `InviteService`, `GET users/{id}/invites?types=band;song;community`. Response
   * typed from `com.bandlab.invite.api.Invite`.
   */
  listInvites(
    userID: string,
    query: UserListInvitesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<InvitesAPI.InviteList> {
    return this._client.get(path`/users/${userID}/invites`, { query, ...options });
  }

  /**
   * Returns a user's mutual connections
   *
   * Evidence: `apk` — `ProfileRecommendationsService`, `GET users/{id}/mutual-connections`. Response
   * typed from `com.bandlab.user.models.User`.
   */
  listMutualConnections(
    userID: string,
    query: UserListMutualConnectionsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UserProfileList> {
    return this._client.get(path`/users/${userID}/mutual-connections`, { query, ...options });
  }

  /**
   * Returns a preview of a user's mutual connections
   *
   * Evidence: `apk` — `ProfileRecommendationsService`,
   * `GET users/{id}/mutual-connections/preview`. Response typed from `com.bandlab.user.models.User`.
   */
  previewMutualConnections(
    userID: string,
    query: UserListMutualConnectionsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UserProfileList> {
    return this._client.get(path`/users/${userID}/mutual-connections/preview`, { query, ...options });
  }

  /**
   * Marks invite notifications as read
   *
   * Evidence: `apk` — `InviteService`, `PATCH users/{id}/notifications/invites`.
   */
  updateInviteNotifications(userID: string, body: unknown, options?: RequestOptions): APIPromise<void> {
    return this._client.patch(path`/users/${userID}/notifications/invites`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns what a user is playing now
   *
   * Evidence: `apk` — `UserService`, `GET users/{id}/playing-now`. Response typed from
   * `com.bandlab.user.profile.api.model.PlayingNowStatus`.
   */
  retrievePlayingNow(userID: string, options?: RequestOptions): APIPromise<PlayingNowStatus> {
    return this._client.get(path`/users/${userID}/playing-now`, options);
  }

  /**
   * Returns a user's playing-now sharing setting
   *
   * Evidence: `apk` — `SharePlaybackService`, `GET users/{id}/playing-now/setting`. Response typed
   * from `com.bandlab.bandlab.data.SharePlayback`.
   */
  retrievePlayingNowSetting(userID: string, options?: RequestOptions): APIPromise<SharePlayback> {
    return this._client.get(path`/users/${userID}/playing-now/setting`, options);
  }

  /**
   * Returns a user's profile header
   *
   * Evidence: `apk` — `UserAwsService`, `GET users/{id}/profile-header`. Response typed from
   * `com.bandlab.user.profile.api.model.UserHeader`.
   */
  retrieveProfileHeader(userID: string, options?: RequestOptions): APIPromise<UserHeader> {
    return this._client.get(path`/users/${userID}/profile-header`, options);
  }

  /**
   * Returns a user's profile-view count
   *
   * Evidence: `apk` — `ProfileViewersService`, `GET users/{id}/profile-views/counter`. Response
   * typed from `com.bandlab.user.profile.viewers.api.ProfileViewsCountResponse`.
   */
  retrieveProfileViewCount(userID: string, options?: RequestOptions): APIPromise<ProfileViewsCountResponse> {
    return this._client.get(path`/users/${userID}/profile-views/counter`, options);
  }

  /**
   * Returns a user's default profile-view count
   *
   * Evidence: `apk` — `ProfileViewersService`, `GET users/{id}/profile-views/counter/default`.
   * Response typed from `com.bandlab.user.profile.viewers.api.ProfileViewsCountResponse`.
   */
  retrieveDefaultProfileViewCount(
    userID: string,
    options?: RequestOptions,
  ): APIPromise<ProfileViewsCountResponse> {
    return this._client.get(path`/users/${userID}/profile-views/counter/default`, options);
  }

  /**
   * Returns the viewers of a user's profile
   *
   * Evidence: `apk` — `ProfileViewersService`, `GET users/{id}/profile-views/viewers`. Response
   * typed from `com.bandlab.user.profile.viewers.api.model.ProfileViewersUser`.
   */
  listProfileViewers(
    userID: string,
    query: UserListProfileViewersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ProfileViewersUserList> {
    return this._client.get(path`/users/${userID}/profile-views/viewers`, { query, ...options });
  }

  /**
   * Returns artist recommendations for a user's profile
   *
   * Evidence: `apk` — `ProfileRecommendationsService`,
   * `GET users/{id}/profile/recommendations/artists`. Response typed from
   * `com.bandlab.user.models.User`.
   */
  listProfileRecommendedArtists(
    userID: string,
    query: UserListProfileRecommendedArtistsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UserProfileList> {
    return this._client.get(path`/users/${userID}/profile/recommendations/artists`, { query, ...options });
  }

  /**
   * Returns a user's recent activity
   *
   * Evidence: `apk` — `UserService`, `GET users/{id}/recent-activity`. Response typed from
   * `com.bandlab.user.models.UserRecentActivity`.
   */
  listRecentActivity(
    userID: string,
    query: UserListRecentActivityParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UserRecentActivityList> {
    return this._client.get(path`/users/${userID}/recent-activity`, { query, ...options });
  }

  /**
   * Returns artists a user should follow back
   *
   * Evidence: `apk` — `ProfileFollowBackRecommendationsService`,
   * `GET users/{id}/recommendations/follow-back/artists`. Response typed from
   * `com.bandlab.user.models.User`.
   */
  listFollowBackArtists(
    userID: string,
    query: UserListFollowBackArtistsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UserProfileList> {
    return this._client.get(path`/users/${userID}/recommendations/follow-back/artists`, {
      query,
      ...options,
    });
  }

  /**
   * Returns recommended collaborators for a user
   *
   * Evidence: `apk` — `UserService`, `GET users/{id}/recommended-collaborators`. Response typed from
   * `com.bandlab.user.models.User`.
   */
  listRecommendedCollaborators(
    userID: string,
    query: UserListRecommendedCollaboratorsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UserProfileList> {
    return this._client.get(path`/users/${userID}/recommended-collaborators`, { query, ...options });
  }

  /**
   * Returns artist recommendations for a user's search screen
   *
   * Evidence: `apk` — `UserService`, `GET users/{id}/search/recommendations/artists`. Response typed
   * from `com.bandlab.user.models.User`.
   */
  listSearchRecommendedArtists(
    userID: string,
    query: UserListSearchRecommendedArtistsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UserProfileList> {
    return this._client.get(path`/users/${userID}/search/recommendations/artists`, { query, ...options });
  }

  /**
   * Returns a user's top track posts
   *
   * Evidence: `apk` — `PostsService`, `GET users/{id}/top-track-posts`. Response typed from
   * `com.bandlab.post.objects.Post`.
   */
  listTopTrackPosts(
    userID: string,
    query: UserListTopTrackPostsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PostsAPI.PostList> {
    return this._client.get(path`/users/${userID}/top-track-posts`, { query, ...options });
  }

  /**
   * Returns a user's albums
   *
   * Evidence: `apk` — `AlbumsService`, `GET users/{userId}/albums`. Response typed from
   * `com.bandlab.post.objects.Album`.
   */
  listAlbums(
    userID: string,
    query: UserListAlbumsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<AlbumsAPI.AlbumList> {
    return this._client.get(path`/users/${userID}/albums`, { query, ...options });
  }

  /**
   * Returns a user's artist stats for a period
   *
   * Evidence: `apk` — `ArtistStatService`, `GET users/{userId}/artist-stats/{period}`. Response
   * typed from `com.bandlab.artist.api.network.ArtistStat`.
   */
  retrieveArtistStats(
    period: string,
    params: UserRetrieveArtistStatsParams,
    options?: RequestOptions,
  ): APIPromise<ArtistStat> {
    const { userId } = params;
    return this._client.get(path`/users/${userId}/artist-stats/${period}`, options);
  }

  /**
   * Returns a user's artists effect presets
   *
   * Evidence: `apk` — `ArtistPresetsService`, `GET users/{userId}/artists-effect-presets`. Response
   * typed from `com.bandlab.mixeditor.presets.effects.domain.api.preset.RemotePreset`.
   */
  listArtistsEffectPresets(
    userID: string,
    query: UserListArtistsEffectPresetsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<EffectsAPI.RemotePresetList> {
    return this._client.get(path`/users/${userID}/artists-effect-presets`, { query, ...options });
  }

  /**
   * Returns the communities a user is active in
   *
   * Evidence: `apk` — `CommunitiesService`, `GET users/{userId}/communities/active`. Response typed
   * from `com.bandlab.community.api.Community`.
   */
  listActiveCommunities(
    userID: string,
    query: UserListActiveCommunitiesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<CommunitiesAPI.CommunityList> {
    return this._client.get(path`/users/${userID}/communities/active`, { query, ...options });
  }

  /**
   * Returns a user's highlighted tracks
   *
   * Evidence: `apk` — `TracksService`, `GET users/{userId}/highlighted-tracks`. Response typed from
   * `com.bandlab.post.objects.Post`.
   */
  listHighlightedTracks(
    userID: string,
    query: UserListHighlightedTracksParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PostsAPI.PostList> {
    return this._client.get(path`/users/${userID}/highlighted-tracks`, { query, ...options });
  }

  /**
   * Joins a user as a collaborator through an invite link
   *
   * Evidence: `apk` — `InviteLinkCollabRepository$InviteLinkCollaboratorService`,
   * `PUT users/{userId}/invites/{inviteCode}`. Response typed from
   * `com.bandlab.invite.link.collaborator.screen.InviteLinkCollabRepository.JoinAsCollaboratorResponse`.
   */
  joinAsCollaborator(
    inviteCode: string,
    params: UserJoinAsCollaboratorParams,
    options?: RequestOptions,
  ): APIPromise<JoinAsCollaboratorResponse> {
    const { userId, ...body } = params;
    return this._client.put(path`/users/${userId}/invites/${inviteCode}`, { body, ...options });
  }

  /**
   * Records a latency correction
   *
   * Evidence: `apk` — `LatencyService`, `POST users/{userId}/latency-corrections`. Response typed
   * from `com.bandlab.latency.api.LatencyCorrectionRecommendation`.
   */
  createLatencyCorrection(
    userID: string,
    body: unknown,
    options?: RequestOptions,
  ): APIPromise<LatencyCorrectionRecommendation> {
    return this._client.post(path`/users/${userID}/latency-corrections`, { body, ...options });
  }

  /**
   * Records a latency measurement
   *
   * Evidence: `apk` — `LatencyService`, `POST users/{userId}/latency-measurements`.
   */
  createLatencyMeasurement(userID: string, body: unknown, options?: RequestOptions): APIPromise<void> {
    return this._client.post(path`/users/${userID}/latency-measurements`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns onboarding artist recommendations for a user
   *
   * Evidence: `apk` — `FindFriendsService`, `GET users/{userId}/onboarding/recommendations/artists`.
   * Response typed from `com.bandlab.user.models.User`.
   */
  listOnboardingRecommendedArtists(
    userID: string,
    query: UserListOnboardingRecommendedArtistsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UserProfileList> {
    return this._client.get(path`/users/${userID}/onboarding/recommendations/artists`, { query, ...options });
  }

  /**
   * Returns a user's profile pictures
   *
   * Evidence: `apk` — `ProfilePicturesService`, `GET users/{userId}/profile-pictures`. Response
   * typed from `com.bandlab.user.profile.pictures.api.ProfilePicture`.
   */
  listProfilePictures(
    userID: string,
    query: UserListProfilePicturesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ProfilePictureList> {
    return this._client.get(path`/users/${userID}/profile-pictures`, { query, ...options });
  }

  /**
   * Deletes a user's profile picture
   *
   * Evidence: `apk` — `ProfilePicturesService`, `DELETE users/{userId}/profile-pictures/{pictureId}`.
   */
  deleteProfilePicture(
    pictureID: string,
    params: UserDeleteProfilePictureParams,
    options?: RequestOptions,
  ): APIPromise<void> {
    const { userId } = params;
    return this._client.delete(path`/users/${userId}/profile-pictures/${pictureID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Sets a user's main profile picture
   *
   * Evidence: `apk` — `ProfilePicturesService`, `PUT users/{userId}/profile-pictures/{pictureId}/main`.
   */
  setMainProfilePicture(
    pictureID: string,
    params: UserSetMainProfilePictureParams,
    options?: RequestOptions,
  ): APIPromise<void> {
    const { userId } = params;
    return this._client.put(path`/users/${userId}/profile-pictures/${pictureID}/main`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns a user's track posts
   *
   * Evidence: `apk` — `TracksService`, `GET users/{userId}/track-posts`. Response typed from
   * `com.bandlab.post.objects.Post`.
   */
  listTrackPosts(
    userID: string,
    query: UserListTrackPostsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PostsAPI.PostList> {
    return this._client.get(path`/users/${userID}/track-posts`, { query, ...options });
  }

  /**
   * Records a play on a user's track post
   *
   * Evidence: `apk` — `PostsService`, `POST users/{userId}/track-posts/{postId}/plays`.
   */
  playTrackPost(postID: string, params: UserPlayTrackPostParams, options?: RequestOptions): APIPromise<void> {
    const { userId, ...body } = params;
    return this._client.post(path`/users/${userId}/track-posts/${postID}/plays`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Records a play on a user's video post
   *
   * Evidence: `apk` — `PostsService`, `POST users/{userId}/video-posts/{postId}/plays`.
   */
  playVideoPost(postID: string, params: UserPlayVideoPostParams, options?: RequestOptions): APIPromise<void> {
    const { userId, ...body } = params;
    return this._client.post(path`/users/${userId}/video-posts/${postID}/plays`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns a user's video posts
   *
   * Evidence: `apk` — `FeedVideoService`, `GET users/{userId}/videos/posts`. Response typed from
   * `com.bandlab.post.objects.Post`.
   */
  listVideoPosts(
    userID: string,
    query: UserListVideoPostsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PostsAPI.PostList> {
    return this._client.get(path`/users/${userID}/videos/posts`, { query, ...options });
  }
}

export interface CollectionList {
  data?: Array<unknown>;

  paging?: FollowersAPI.Paging;
}

export interface SongList {
  data?: Array<unknown>;

  paging?: FollowersAPI.Paging;
}

/**
 * Successful operation
 */
export interface UserRetrieveResponse {
  id?: string;

  about?: string;

  badges?: Array<string>;

  counters?: MeAPI.UserCounters;

  createdOn?: string;

  genres?: Array<GenresAPI.Genre>;

  isTippable?: boolean;

  isVerified?: boolean;

  location?: MeAPI.Location;

  name?: string;

  picture?: MeAPI.Picture;

  skills?: Array<SkillsAPI.Skill>;

  username?: string;
}

/**
 * Successful operation
 */
export interface UserCreateAccessKeyResponse {
  key?: string;
}

/**
 * Successful operation
 */
export interface UserListCommunitiesResponse {
  data?: Array<unknown>;

  paging?: FollowersAPI.Paging;
}

export interface UserListBandsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface UserListCollectionsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface UserListCommunitiesParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface UserListPostsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface UserListSongsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

Users.Followers = Followers;
Users.Following = Following;
Users.Invites = Invites;
Users.Notifications = Notifications;
Users.Recommendations = Recommendations;
Users.Contacts = Contacts;
Users.Blocks = Blocks;

/**
 * Evidence: `apk` — `com.bandlab.user.models.UserCounters`.
 */
export interface UsersUserCounters {
  followers?: number;

  following?: number;

  bands?: number;

  collections?: number;

  plays?: number;

  notifications?: number;

  bandInvites?: number;

  songInvites?: number;

  communityInvites?: number;

  profilePictures?: number;

  unreadInviteNotifications?: number;

  unreadYouNotifications?: number;

  bandFollowings?: number;
}

/**
 * Evidence: `apk` — `com.bandlab.social.actions.models.FollowRequestsCount`.
 */
export interface FollowRequestsCount {
  count?: number;
}

/**
 * Evidence: `apk` — `com.bandlab.bandlab.data.network.objects.Band`.
 */
export interface Band {
  id?: string;

  username?: string;

  about?: string;

  genres?: unknown;

  location?: unknown;

  isMember?: boolean;

  picture?: unknown;

  members?: unknown;

  counters?: unknown;

  status?: string;

  invite?: unknown;

  conversationId?: string;

  backgroundPictureId?: string;

  backgroundPicture?: unknown;

  backgroundPictureColor?: string;

  role?: string;

  commentCreateGroup?: unknown;

  isOpen?: boolean;

  followingState?: string;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.bandlab.data.network.objects.Band`.
 */
export interface BandFollowingsList {
  data?: Array<Band>;

  paging?: FollowersAPI.Paging;
}

/**
 * Evidence: `apk` — `com.bandlab.user.gear.api.Gear`.
 */
export interface Gear {
  id?: string;

  brand?: string;

  picture?: unknown;
}

/**
 * Evidence: `apk` — `com.bandlab.user.gear.api.GearStats`.
 */
export interface GearStats {
  hasGear?: boolean;
}

/**
 * Evidence: `apk` — `com.bandlab.user.profile.api.model.PlayingNowStatus`.
 */
export interface PlayingNowStatus {
  post?: unknown;

  isCurrentlyPlaying?: boolean;
}

/**
 * Evidence: `apk` — `com.bandlab.bandlab.data.SharePlayback`.
 */
export interface SharePlayback {
  playingNowAccessGroup?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.user.profile.api.model.UserHeader`.
 */
export interface UserHeader {
  user?: unknown;

  activityStatus?: unknown;

  playingNowStatus?: unknown;

  hasTracks?: boolean;

  hasGear?: boolean;

  verifiedSubmission?: unknown;

  expandConnections?: boolean;

  mutualConnections?: unknown;

  bioPage?: unknown;

  fanReach?: unknown;

  isFromCache?: boolean;
}

/**
 * Evidence: `apk` — `com.bandlab.user.profile.viewers.api.ProfileViewsCountResponse`.
 */
export interface ProfileViewsCountResponse {
  count?: number;
}

/**
 * Evidence: `apk` — `com.bandlab.user.profile.viewers.api.model.ProfileViewersUser`.
 */
export interface ProfileViewersUser {
  id?: string;

  followingState?: string;

  picture?: unknown;

  username?: string;

  genres?: unknown;

  skills?: unknown;

  isVerified?: boolean;

  isPrivate?: boolean;
}

/**
 * Evidence: `apk` — paged wrapper around
 * `com.bandlab.user.profile.viewers.api.model.ProfileViewersUser`.
 */
export interface ProfileViewersUserList {
  data?: Array<ProfileViewersUser>;

  paging?: FollowersAPI.Paging;
}

/**
 * Evidence: `apk` — `com.bandlab.user.models.UserRecentActivity`.
 */
export interface UserRecentActivity {
  postId?: string;

  userName?: string;

  textPreview?: string;

  activityType?: string;

  postCreatorName?: string;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.user.models.UserRecentActivity`.
 */
export interface UserRecentActivityList {
  data?: Array<UserRecentActivity>;

  paging?: FollowersAPI.Paging;
}

/**
 * Evidence: `apk` — `com.bandlab.user.models.User`.
 */
export interface UserProfile {
  id?: string;

  username?: string;

  about?: string;

  picture?: unknown;

  isVerified?: boolean;

  isPrivate?: boolean;

  genres?: unknown;

  skills?: unknown;

  followingState?: string;

  counters?: UsersUserCounters;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.user.models.User`.
 */
export interface UserProfileList {
  data?: Array<UserProfile>;

  paging?: FollowersAPI.Paging;
}

/**
 * Evidence: `apk` — `com.bandlab.artist.api.network.ArtistStat`.
 */
export interface ArtistStat {
  total?: number;

  delta?: number;
}

/**
 * Evidence: `apk` — `com.bandlab.latency.api.LatencyCorrectionRecommendation`.
 */
export interface LatencyCorrectionRecommendation {
  isDefault?: boolean;

  routings?: unknown;
}

/**
 * Evidence: `apk` — `com.bandlab.user.profile.pictures.api.ProfilePicture`.
 */
export interface ProfilePicture {
  pictureId?: string;

  originalUrl?: string;
}

/**
 * Evidence: `apk` — paged wrapper around
 * `com.bandlab.user.profile.pictures.api.ProfilePicture`.
 */
export interface ProfilePictureList {
  data?: Array<ProfilePicture>;

  paging?: FollowersAPI.Paging;
}

/**
 * Evidence: `apk` —
 * `com.bandlab.invite.link.collaborator.screen.InviteLinkCollabRepository.JoinAsCollaboratorResponse`.
 */
export interface JoinAsCollaboratorResponse {
  song?: unknown;
}

export interface UserUpdateFollowerParams {
  id: string;

  [key: string]: unknown;
}

export interface UserAddGearParams {
  id: string;

  [key: string]: unknown;
}

export interface UserListSuggestedParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface UserListInvitesParams {
  types?: string;

  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface UserListMutualConnectionsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface UserListProfileViewersParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface UserListProfileRecommendedArtistsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface UserListRecentActivityParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface UserListFollowBackArtistsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface UserListRecommendedCollaboratorsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface UserListSearchRecommendedArtistsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface UserListTopTrackPostsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface UserListAlbumsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface UserRetrieveArtistStatsParams {
  userId: string;
}

export interface UserListArtistsEffectPresetsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface UserListActiveCommunitiesParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface UserListHighlightedTracksParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface UserJoinAsCollaboratorParams {
  userId: string;

  [key: string]: unknown;
}

export interface UserListOnboardingRecommendedArtistsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface UserListProfilePicturesParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface UserDeleteProfilePictureParams {
  userId: string;
}

export interface UserSetMainProfilePictureParams {
  userId: string;
}

export interface UserListTrackPostsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface UserPlayTrackPostParams {
  userId: string;

  [key: string]: unknown;
}

export interface UserPlayVideoPostParams {
  userId: string;

  [key: string]: unknown;
}

export interface UserListVideoPostsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

/**
 * Evidence: `apk` — `com.bandlab.write.post.background.api.WritePostBackground`.
 */
export interface Background {
  id?: string;

  type?: string;

  color?: string;

  picture?: unknown;
}

/**
 * Evidence: `apk` — paged wrapper around
 * `com.bandlab.write.post.background.api.WritePostBackground`.
 */
export interface BackgroundList {
  data?: Array<Background>;
}

export interface UserListBackgroundsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

/**
 * Evidence: `apk` — `com.bandlab.auth.models.Session`.
 */
export interface Session {
  access_token?: string;

  expires_in?: number;

  token_type?: string;

  refresh_token?: string;

  scope?: string;

  wasRegistered?: boolean;

  user_id?: string;

  id_token?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.auth.models.ParentalConsentCheckResponse`.
 */
export interface ParentalConsentCheckResponse {
  status?: string;

  parentEmail?: string;

  access_token?: string;

  refresh_token?: string;

  token_type?: string;

  expires_in?: number;

  user_id?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.auth.models.TwoFactorSendCodeResponse`.
 */
export interface TwoFactorSendCodeResponse {
  authenticityToken?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.boost.estimate.api.ImpressionEstimate`.
 */
export interface ImpressionEstimate {
  impressions?: number;

  impressionsString?: string;

  boostDiscountCampaign?: unknown;

  engagements?: number;

  type?: string;

  budget?: number;

  duration?: number;

  postId?: string;

  postType?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.boost.api.BoostCampaignReport`.
 */
export interface BoostCampaignReport {
  boostAgain?: boolean;

  campaignId?: string;

  campaignPrice?: number;

  campaignStatus?: string;

  campaignRemainingDays?: number;

  comments?: number;

  createdAt?: string;

  estimatedViews?: number;

  followers?: number;

  likes?: number;

  paidAmount?: number;

  plays?: number;

  taps?: number;

  views?: number;

  profileOpens?: number;

  creativePostType?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.boost.history.screen.api.BoostCampaign`.
 */
export interface BoostCampaign {
  id?: string;

  postId?: string;

  picture?: unknown;

  postType?: string;

  startDate?: string;

  title?: string;

  bandId?: string;

  type?: string;

  status?: string;

  paidAmount?: number;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.boost.history.screen.api.BoostCampaign`.
 */
export interface BoostCampaignList {
  data?: Array<BoostCampaign>;

  paging?: FollowersAPI.Paging;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.user.gear.api.Gear`.
 */
export interface GearList {
  data?: Array<Gear>;

  paging?: FollowersAPI.Paging;
}

export interface UserCreateParams {
  [key: string]: unknown;
}

export interface UserListGearParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface UserListPasswordBlacklistsParams {
  [key: string]: unknown;
}

export interface UserRetrieveBoostReportParams {
  type: string;
}

export interface UserListBoostCampaignsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export declare namespace Users {
  export {
    type CollectionList as CollectionList,
    type SongList as SongList,
    type UserRetrieveResponse as UserRetrieveResponse,
    type UserCreateAccessKeyResponse as UserCreateAccessKeyResponse,
    type UserListCommunitiesResponse as UserListCommunitiesResponse,
    type UserListBandsParams as UserListBandsParams,
    type UserListCollectionsParams as UserListCollectionsParams,
    type UserListCommunitiesParams as UserListCommunitiesParams,
    type UserListPostsParams as UserListPostsParams,
    type UserListSongsParams as UserListSongsParams,
    type UsersUserCounters as UsersUserCounters,
    type FollowRequestsCount as FollowRequestsCount,
    type Band as Band,
    type BandFollowingsList as BandFollowingsList,
    type Gear as Gear,
    type GearStats as GearStats,
    type PlayingNowStatus as PlayingNowStatus,
    type SharePlayback as SharePlayback,
    type UserHeader as UserHeader,
    type ProfileViewsCountResponse as ProfileViewsCountResponse,
    type ProfileViewersUser as ProfileViewersUser,
    type ProfileViewersUserList as ProfileViewersUserList,
    type UserRecentActivity as UserRecentActivity,
    type UserRecentActivityList as UserRecentActivityList,
    type UserProfile as UserProfile,
    type UserProfileList as UserProfileList,
    type ArtistStat as ArtistStat,
    type LatencyCorrectionRecommendation as LatencyCorrectionRecommendation,
    type ProfilePicture as ProfilePicture,
    type ProfilePictureList as ProfilePictureList,
    type JoinAsCollaboratorResponse as JoinAsCollaboratorResponse,
    type UserUpdateFollowerParams as UserUpdateFollowerParams,
    type UserAddGearParams as UserAddGearParams,
    type UserListSuggestedParams as UserListSuggestedParams,
    type UserListInvitesParams as UserListInvitesParams,
    type UserListMutualConnectionsParams as UserListMutualConnectionsParams,
    type UserListProfileViewersParams as UserListProfileViewersParams,
    type UserListProfileRecommendedArtistsParams as UserListProfileRecommendedArtistsParams,
    type UserListRecentActivityParams as UserListRecentActivityParams,
    type UserListFollowBackArtistsParams as UserListFollowBackArtistsParams,
    type UserListRecommendedCollaboratorsParams as UserListRecommendedCollaboratorsParams,
    type UserListSearchRecommendedArtistsParams as UserListSearchRecommendedArtistsParams,
    type UserListTopTrackPostsParams as UserListTopTrackPostsParams,
    type UserListAlbumsParams as UserListAlbumsParams,
    type UserRetrieveArtistStatsParams as UserRetrieveArtistStatsParams,
    type UserListArtistsEffectPresetsParams as UserListArtistsEffectPresetsParams,
    type UserListActiveCommunitiesParams as UserListActiveCommunitiesParams,
    type UserListHighlightedTracksParams as UserListHighlightedTracksParams,
    type UserJoinAsCollaboratorParams as UserJoinAsCollaboratorParams,
    type UserListOnboardingRecommendedArtistsParams as UserListOnboardingRecommendedArtistsParams,
    type UserListProfilePicturesParams as UserListProfilePicturesParams,
    type UserDeleteProfilePictureParams as UserDeleteProfilePictureParams,
    type UserSetMainProfilePictureParams as UserSetMainProfilePictureParams,
    type UserListTrackPostsParams as UserListTrackPostsParams,
    type UserPlayTrackPostParams as UserPlayTrackPostParams,
    type UserPlayVideoPostParams as UserPlayVideoPostParams,
    type UserListVideoPostsParams as UserListVideoPostsParams,
    type Session as Session,
    type ParentalConsentCheckResponse as ParentalConsentCheckResponse,
    type TwoFactorSendCodeResponse as TwoFactorSendCodeResponse,
    type ImpressionEstimate as ImpressionEstimate,
    type BoostCampaignReport as BoostCampaignReport,
    type BoostCampaign as BoostCampaign,
    type BoostCampaignList as BoostCampaignList,
    type GearList as GearList,
    type UserCreateParams as UserCreateParams,
    type UserListGearParams as UserListGearParams,
    type UserListPasswordBlacklistsParams as UserListPasswordBlacklistsParams,
    type UserRetrieveBoostReportParams as UserRetrieveBoostReportParams,
    type UserListBoostCampaignsParams as UserListBoostCampaignsParams,
  };

  export {
    Followers as Followers,
    type Paging as Paging,
    type UserList as UserList,
    type FollowerListParams as FollowerListParams,
  };

  export {
    Following as Following,
    type FollowingListParams as FollowingListParams,
    type FollowingListPostsParams as FollowingListPostsParams,
  };

  export {
    Invites as Invites,
    type InviteList as InviteList,
    type InviteListParams as InviteListParams,
    type InviteSendParams as InviteSendParams,
  };

  export {
    Notifications as Notifications,
    type NotificationList as NotificationList,
    type NotificationPatch as NotificationPatch,
    type NotificationCountResponse as NotificationCountResponse,
    type NotificationUpdateParams as NotificationUpdateParams,
    type NotificationListParams as NotificationListParams,
    type NotificationListFollowingParams as NotificationListFollowingParams,
    type NotificationUpdateAllParams as NotificationUpdateAllParams,
  };

  export {
    Recommendations as Recommendations,
    type RecommendationListUsersParams as RecommendationListUsersParams,
  };

  export {
    Contacts as Contacts,
    type ContactListBandsResponse as ContactListBandsResponse,
    type ContactListBandsParams as ContactListBandsParams,
    type ContactListUsersParams as ContactListUsersParams,
  };

  export { Blocks as Blocks };
}

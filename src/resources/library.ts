// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as AlbumsAPI from './albums';
import * as PostsAPI from './posts/posts';
import * as FollowersAPI from './users/followers';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Library extends APIResource {
  /**
   * Returns a user's liked collections
   *
   * Evidence: `apk` — `PlaylistsService`, `GET users/{id}/likes/collections`. Response typed from
   * `com.bandlab.playlist.api.PlaylistCollection`.
   */
  listLikedCollections(
    userID: string,
    query: LibraryListLikedCollectionsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PlaylistCollectionList> {
    return this._client.get(path`/users/${userID}/likes/collections`, { query, ...options });
  }

  /**
   * Returns a user's liked posts
   *
   * Evidence: `apk` — `PostsService`, `GET users/{id}/likes/posts`. Response typed from
   * `com.bandlab.post.objects.Post`.
   */
  listLikedPosts(
    userID: string,
    query: LibraryListLikedPostsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PostsAPI.PostList> {
    return this._client.get(path`/users/${userID}/likes/posts`, { query, ...options });
  }

  /**
   * Returns a user's liked albums
   *
   * Evidence: `apk` — `AlbumsService`, `GET users/{userId}/likes/albums`. Response typed from
   * `com.bandlab.post.objects.Album`.
   */
  listLikedAlbums(
    userID: string,
    query: LibraryListLikedAlbumsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<AlbumsAPI.AlbumList> {
    return this._client.get(path`/users/${userID}/likes/albums`, { query, ...options });
  }

  /**
   * Returns a user's purchased albums
   *
   * Evidence: `apk` — `AlbumsService`, `GET users/{userId}/purchases/albums`. Response typed from
   * `com.bandlab.post.objects.Album`.
   */
  listPurchasedAlbums(
    userID: string,
    query: LibraryListPurchasedAlbumsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<AlbumsAPI.AlbumList> {
    return this._client.get(path`/users/${userID}/purchases/albums`, { query, ...options });
  }

  /**
   * Returns a user's purchased beats
   *
   * Evidence: `apk` — `BeatsService`, `GET experiment/users/{userId}/purchases/beats`. Response
   * typed from `com.bandlab.common.models.beat.Beat`.
   */
  listPurchasedBeats(
    userID: string,
    query: LibraryListPurchasedBeatsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<BeatList> {
    return this._client.get(path`/experiment/users/${userID}/purchases/beats`, { query, ...options });
  }

  /**
   * Returns a user's library track posts
   *
   * Evidence: `apk` — `TracksService`, `GET users/{userId}/library/track-posts`. Response typed from
   * `com.bandlab.post.objects.Post`.
   */
  listTrackPosts(
    userID: string,
    query: LibraryListTrackPostsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PostsAPI.PostList> {
    return this._client.get(path`/users/${userID}/library/track-posts`, { query, ...options });
  }

  /**
   * Returns a user's pinned posts
   *
   * Evidence: `apk` — `PinnedPostsService`, `GET users/{userId}/pins/posts`. Response typed from
   * `com.bandlab.post.objects.Post`.
   */
  listPinnedPosts(
    userID: string,
    query: LibraryListPinnedPostsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PostsAPI.PostList> {
    return this._client.get(path`/users/${userID}/pins/posts`, { query, ...options });
  }

  /**
   * Pins a post
   *
   * Evidence: `apk` — `PinnedPostsService`, `POST users/{userId}/pins/posts/{postId}`.
   */
  pinPost(postID: string, params: LibraryPinPostParams, options?: RequestOptions): APIPromise<void> {
    const { userId } = params;
    return this._client.post(path`/users/${userId}/pins/posts/${postID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns a user's playback history
   *
   * Evidence: `apk` — `PlaybackHistoryService`, `GET users/{userId}/posts-playback-history`.
   * Response typed from `com.bandlab.playback.history.screen.model.PlaybackHistory`.
   */
  listPlaybackHistory(
    userID: string,
    query: LibraryListPlaybackHistoryParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PlaybackHistoryList> {
    return this._client.get(path`/users/${userID}/posts-playback-history`, { query, ...options });
  }

  /**
   * Removes a post from a user's playback history
   *
   * Evidence: `apk` — `PlaybackHistoryService`,
   * `DELETE users/{userId}/playback-history/posts/{postId}`.
   */
  deletePlaybackHistory(
    postID: string,
    params: LibraryDeletePlaybackHistoryParams,
    options?: RequestOptions,
  ): APIPromise<void> {
    const { userId } = params;
    return this._client.delete(path`/users/${userId}/playback-history/posts/${postID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns track-post recommendations for a user
   *
   * Evidence: `apk` — `PostsService`, `GET users/{id}/recommendations/track-posts`. Response typed
   * from `com.bandlab.post.objects.Post`.
   */
  listRecommendedTrackPosts(
    userID: string,
    query: LibraryListRecommendedTrackPostsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PostsAPI.PostList> {
    return this._client.get(path`/users/${userID}/recommendations/track-posts`, { query, ...options });
  }

  /**
   * Returns artist recommendations to follow back
   *
   * Evidence: `apk` — `ProfileFollowBackRecommendationsService`,
   * `GET users/{id}/recommendations/follow-back/artists`. Response typed from
   * `com.bandlab.user.models.User`.
   */
  listRecommendedArtists(
    userID: string,
    query: LibraryListRecommendedArtistsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<RecommendedArtistList> {
    return this._client.get(path`/users/${userID}/recommendations/follow-back/artists`, {
      query,
      ...options,
    });
  }

  /**
   * Returns sound-pack recommendations for a user
   *
   * Evidence: `apk` — `SoundsPromoService`, `GET users/{userId}/recommendations/packs`. Response
   * typed from `com.bandlab.mixeditor.library.sounds.api.service.SoundsPacksDto`.
   */
  listRecommendedPacks(
    userID: string,
    query: LibraryListRecommendedPacksParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SoundsPacksDto> {
    return this._client.get(path`/users/${userID}/recommendations/packs`, { query, ...options });
  }

  /**
   * Adds a sample to a collection
   *
   * Evidence: `apk` — `MySoundsCollectionsService`,
   * `PUT users/{userId}/collections/{collectionId}/{sampleId}`. Response typed from
   * `com.bandlab.mixeditor.library.sounds.mysounds.collections.screen.model.CollectionDto`.
   */
  addSampleToCollection(
    collectionID: string,
    params: LibraryAddSampleToCollectionParams,
    options?: RequestOptions,
  ): APIPromise<CollectionDto> {
    const { userId, sampleId, ...body } = params;
    return this._client.put(path`/users/${userId}/collections/${collectionID}/${sampleId}`, {
      body,
      ...options,
    });
  }

  /**
   * Updates a user's sounds collection
   *
   * Evidence: `apk` — `MySoundsCollectionsService`, `PUT users/{userId}/collections/{collectionId}`.
   * Response typed from
   * `com.bandlab.mixeditor.library.sounds.mysounds.collections.screen.model.CollectionDto`.
   */
  updateCollection(
    collectionID: string,
    params: LibraryUpdateCollectionParams,
    options?: RequestOptions,
  ): APIPromise<CollectionDto> {
    const { userId, ...body } = params;
    return this._client.put(path`/users/${userId}/collections/${collectionID}`, { body, ...options });
  }
}

/**
 * Evidence: `apk` — `com.bandlab.common.models.beat.Beat`.
 */
export interface Beat {
  id?: string;

  title?: string;

  duration?: number;

  picture?: unknown;

  isFree?: boolean;

  price?: number;

  genreId?: string;

  creator?: unknown;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.common.models.beat.Beat`.
 */
export interface BeatList {
  data?: Array<Beat>;

  paging?: FollowersAPI.Paging;
}

/**
 * Evidence: `apk` —
 * `com.bandlab.mixeditor.library.sounds.mysounds.collections.screen.model.CollectionDto`.
 */
export interface CollectionDto {
  collectionId?: string;

  displayName?: string;

  thumbnailUrl?: string;

  idsCount?: number;

  createdAt?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.playback.history.screen.model.PlaybackHistory`.
 */
export interface PlaybackHistory {
  playedOn?: string;

  post?: unknown;
}

/**
 * Evidence: `apk` — paged wrapper around
 * `com.bandlab.playback.history.screen.model.PlaybackHistory`.
 */
export interface PlaybackHistoryList {
  data?: Array<PlaybackHistory>;

  paging?: FollowersAPI.Paging;
}

/**
 * Evidence: `apk` — `com.bandlab.playlist.api.PlaylistCollection`.
 */
export interface PlaylistCollection {
  id?: string;

  creator?: unknown;

  isPublic?: boolean;

  picture?: unknown;

  posts?: unknown;

  createdOn?: string;

  isLiked?: boolean;

  counters?: unknown;

  lastUpdatedOn?: string;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.playlist.api.PlaylistCollection`.
 */
export interface PlaylistCollectionList {
  data?: Array<PlaylistCollection>;

  paging?: FollowersAPI.Paging;
}

/**
 * Evidence: `apk` — `com.bandlab.user.models.User`.
 */
export interface RecommendedArtist {
  id?: string;

  username?: string;

  picture?: unknown;

  isVerified?: boolean;

  followingState?: string;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.user.models.User`.
 */
export interface RecommendedArtistList {
  data?: Array<RecommendedArtist>;

  paging?: FollowersAPI.Paging;
}

/**
 * Evidence: `apk` — `com.bandlab.mixeditor.library.sounds.api.service.SoundsPacksDto`.
 */
export interface SoundsPacksDto {
  data?: unknown;
}

export interface LibraryListLikedCollectionsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface LibraryListLikedPostsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface LibraryListLikedAlbumsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface LibraryListPurchasedAlbumsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface LibraryListPurchasedBeatsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface LibraryListTrackPostsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface LibraryListPinnedPostsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface LibraryPinPostParams {
  userId: string;
}

export interface LibraryListPlaybackHistoryParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface LibraryDeletePlaybackHistoryParams {
  userId: string;
}

export interface LibraryListRecommendedTrackPostsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface LibraryListRecommendedArtistsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface LibraryListRecommendedPacksParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface LibraryAddSampleToCollectionParams {
  userId: string;

  sampleId: string;

  [key: string]: unknown;
}

export interface LibraryUpdateCollectionParams {
  userId: string;

  [key: string]: unknown;
}

export declare namespace Library {
  export {
    type Beat as Beat,
    type BeatList as BeatList,
    type CollectionDto as CollectionDto,
    type PlaybackHistory as PlaybackHistory,
    type PlaybackHistoryList as PlaybackHistoryList,
    type PlaylistCollection as PlaylistCollection,
    type PlaylistCollectionList as PlaylistCollectionList,
    type RecommendedArtist as RecommendedArtist,
    type RecommendedArtistList as RecommendedArtistList,
    type SoundsPacksDto as SoundsPacksDto,
    type LibraryListLikedCollectionsParams as LibraryListLikedCollectionsParams,
    type LibraryListLikedPostsParams as LibraryListLikedPostsParams,
    type LibraryListLikedAlbumsParams as LibraryListLikedAlbumsParams,
    type LibraryListPurchasedAlbumsParams as LibraryListPurchasedAlbumsParams,
    type LibraryListPurchasedBeatsParams as LibraryListPurchasedBeatsParams,
    type LibraryListTrackPostsParams as LibraryListTrackPostsParams,
    type LibraryListPinnedPostsParams as LibraryListPinnedPostsParams,
    type LibraryPinPostParams as LibraryPinPostParams,
    type LibraryListPlaybackHistoryParams as LibraryListPlaybackHistoryParams,
    type LibraryDeletePlaybackHistoryParams as LibraryDeletePlaybackHistoryParams,
    type LibraryListRecommendedTrackPostsParams as LibraryListRecommendedTrackPostsParams,
    type LibraryListRecommendedArtistsParams as LibraryListRecommendedArtistsParams,
    type LibraryListRecommendedPacksParams as LibraryListRecommendedPacksParams,
    type LibraryAddSampleToCollectionParams as LibraryAddSampleToCollectionParams,
    type LibraryUpdateCollectionParams as LibraryUpdateCollectionParams,
  };
}

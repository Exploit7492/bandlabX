// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as AlbumsAPI from './albums';
import * as PostsAPI from './posts/posts';
import * as FollowersAPI from './users/followers';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Feeds extends APIResource {
  /**
   * Returns a user's for-you feed
   *
   * Evidence: `apk` — `PostsService`, `GET users/{userId}/feeds/for-you/posts`. Response typed from
   * `com.bandlab.post.objects.Post`.
   */
  retrieveForYou(
    userID: string,
    query: FeedRetrieveForYouParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PostsAPI.PostList> {
    return this._client.get(path`/users/${userID}/feeds/for-you/posts`, { query, ...options });
  }

  /**
   * Returns a user's following feed
   *
   * Evidence: `apk` — `PostsService`, `GET users/{id}/feeds/following/posts`. Response typed from
   * `com.bandlab.post.objects.Post`.
   */
  listFollowing(
    userID: string,
    query: FeedListFollowingParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PostsAPI.PostList> {
    return this._client.get(path`/users/${userID}/feeds/following/posts`, { query, ...options });
  }

  /**
   * Returns a user's media feed
   *
   * Evidence: `apk` — `PostsService`, `GET users/{id}/feeds/media/posts`. Response typed from
   * `com.bandlab.post.objects.Post`.
   */
  listMedia(
    userID: string,
    query: FeedListMediaParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PostsAPI.PostList> {
    return this._client.get(path`/users/${userID}/feeds/media/posts`, { query, ...options });
  }

  /**
   * Returns a user's trending feed
   *
   * Evidence: `apk` — `PostsService`, `GET users/{id}/feeds/trending/posts`. Response typed from
   * `com.bandlab.post.objects.Post`.
   */
  listTrending(
    userID: string,
    query: FeedListTrendingParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PostsAPI.PostList> {
    return this._client.get(path`/users/${userID}/feeds/trending/posts`, { query, ...options });
  }

  /**
   * Hides a creator from a user's trending feed
   *
   * Evidence: `apk` — `PostsService`, `PUT users/{id}/feeds/trending/hidden-creators/{creator_id}`.
   */
  hideTrendingCreator(
    creatorID: string,
    params: FeedHideTrendingCreatorParams,
    options?: RequestOptions,
  ): APIPromise<void> {
    const { id } = params;
    return this._client.put(path`/users/${id}/feeds/trending/hidden-creators/${creatorID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns the community feed
   *
   * Evidence: `apk` — `PostsService`, `GET experiment/feeds/communities/posts`. Response typed from
   * `com.bandlab.post.objects.Post`. The `/experiment/` prefix is kept: BandLab serves real
   * endpoints under it (rule D15).
   */
  listCommunities(
    query: FeedListCommunitiesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PostsAPI.PostList> {
    return this._client.get('/experiment/feeds/communities/posts', { query, ...options });
  }

  /**
   * Returns the trending video feed
   *
   * Evidence: `apk` — `PostsService`, `GET feeds/trending/videos/posts`. Response typed from
   * `com.bandlab.post.objects.Post`.
   */
  listTrendingVideos(
    query: FeedListTrendingVideosParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PostsAPI.PostList> {
    return this._client.get('/feeds/trending/videos/posts', { query, ...options });
  }

  /**
   * Returns recommended posts
   *
   * Evidence: `apk` — `PostsService`, `GET recommendations/posts`. Response typed from
   * `com.bandlab.post.objects.Post`.
   */
  listRecommendedPosts(
    query: FeedListRecommendedPostsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PostsAPI.PostList> {
    return this._client.get('/recommendations/posts', { query, ...options });
  }

  /**
   * Returns featured bands
   *
   * Evidence: `apk` — `BandService`, `GET explore/featured-bands`. Response typed from
   * `com.bandlab.bandlab.data.network.objects.Band`.
   */
  listFeaturedBands(
    query: FeedListFeaturedBandsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<FeaturedBandList> {
    return this._client.get('/explore/featured-bands', { query, ...options });
  }

  /**
   * Returns recommended albums
   *
   * Evidence: `apk` — `AlbumsService`, `GET explore/recommended-albums`. Response typed from
   * `com.bandlab.post.objects.Album`.
   */
  listRecommendedAlbums(
    query: FeedListRecommendedAlbumsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<AlbumsAPI.AlbumList> {
    return this._client.get('/explore/recommended-albums', { query, ...options });
  }

  /**
   * Returns trending video posts for explore
   *
   * Evidence: `apk` — `ExploreService`, `GET explore/trending-videos/posts`. Response typed from
   * `com.bandlab.post.objects.Post`.
   */
  listExploreTrendingVideos(
    query: FeedListExploreTrendingVideosParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PostsAPI.PostList> {
    return this._client.get('/explore/trending-videos/posts', { query, ...options });
  }

  /**
   * Returns curated sampler sections
   *
   * Evidence: `apk` — `CuratedKitsService`, `GET explore/multipadsampler/sections`. Response typed
   * from `com.bandlab.mixeditor.library.sampler.impl.service.SamplerKitDTO`.
   */
  listSamplerSections(
    query: FeedListSamplerSectionsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SamplerKitDTOList> {
    return this._client.get('/explore/multipadsampler/sections', { query, ...options });
  }

  /**
   * Returns explore sections
   *
   * Evidence: `apk` — `LoopPacksService`, `GET explore/{features}/sections`. Response typed from
   * `com.bandlab.loop.api.manager.models.Section`.
   */
  listSections(
    features: string,
    query: FeedListSectionsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SectionList> {
    return this._client.get(path`/explore/${features}/sections`, { query, ...options });
  }
}

/**
 * Evidence: `apk` — `com.bandlab.bandlab.data.network.objects.Band`.
 */
export interface FeaturedBand {
  id?: string;

  username?: string;

  about?: string;

  picture?: unknown;

  isMember?: boolean;

  followingState?: string;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.bandlab.data.network.objects.Band`.
 */
export interface FeaturedBandList {
  data?: Array<FeaturedBand>;

  paging?: FollowersAPI.Paging;
}

/**
 * Evidence: `apk` — `com.bandlab.mixeditor.library.sampler.impl.service.SamplerKitDTO`.
 */
export interface SamplerKitDTO {
  id?: string;

  originalSamplerKitId?: string;

  displayName?: string;

  audioUrl?: string;

  imageUrl?: string;

  type?: string;

  kit?: unknown;

  sampleIds?: unknown;

  samples?: unknown;

  features?: unknown;

  modifiedOn?: string;

  updatedAt?: string;

  tempo?: number;

  key?: string;
}

/**
 * Evidence: `apk` — paged wrapper around
 * `com.bandlab.mixeditor.library.sampler.impl.service.SamplerKitDTO`.
 */
export interface SamplerKitDTOList {
  data?: Array<SamplerKitDTO>;

  paging?: FollowersAPI.Paging;
}

/**
 * Evidence: `apk` — `com.bandlab.loop.api.manager.models.Section`.
 */
export interface Section {
  title?: string;

  displayType?: string;

  collections?: unknown;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.loop.api.manager.models.Section`.
 */
export interface SectionList {
  data?: Array<Section>;

  paging?: FollowersAPI.Paging;
}

export interface FeedRetrieveForYouParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface FeedListFollowingParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface FeedListMediaParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface FeedListTrendingParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface FeedHideTrendingCreatorParams {
  id: string;
}

export interface FeedListCommunitiesParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface FeedListTrendingVideosParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface FeedListRecommendedPostsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface FeedListFeaturedBandsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface FeedListRecommendedAlbumsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface FeedListExploreTrendingVideosParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface FeedListSamplerSectionsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface FeedListSectionsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export declare namespace Feeds {
  export {
    type FeaturedBand as FeaturedBand,
    type FeaturedBandList as FeaturedBandList,
    type SamplerKitDTO as SamplerKitDTO,
    type SamplerKitDTOList as SamplerKitDTOList,
    type Section as Section,
    type SectionList as SectionList,
    type FeedRetrieveForYouParams as FeedRetrieveForYouParams,
    type FeedListFollowingParams as FeedListFollowingParams,
    type FeedListMediaParams as FeedListMediaParams,
    type FeedListTrendingParams as FeedListTrendingParams,
    type FeedHideTrendingCreatorParams as FeedHideTrendingCreatorParams,
    type FeedListCommunitiesParams as FeedListCommunitiesParams,
    type FeedListTrendingVideosParams as FeedListTrendingVideosParams,
    type FeedListRecommendedPostsParams as FeedListRecommendedPostsParams,
    type FeedListFeaturedBandsParams as FeedListFeaturedBandsParams,
    type FeedListRecommendedAlbumsParams as FeedListRecommendedAlbumsParams,
    type FeedListExploreTrendingVideosParams as FeedListExploreTrendingVideosParams,
    type FeedListSamplerSectionsParams as FeedListSamplerSectionsParams,
    type FeedListSectionsParams as FeedListSectionsParams,
  };
}

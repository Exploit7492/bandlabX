// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as FollowersAPI from './users/followers';
import * as UsersAPI from './users/users';
import * as PostsAPI from './posts/posts';
import * as AlbumsAPI from './albums';
import * as CommunitiesAPI from './communities/communities';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Search extends APIResource {
  /**
   * Search global
   */
  globalSearch(
    query: SearchGlobalSearchParams,
    options?: RequestOptions,
  ): APIPromise<SearchGlobalSearchResponse> {
    return this._client.get('/search', { query, ...options });
  }

  /**
   * Search users
   */
  searchBands(
    query: SearchSearchBandsParams,
    options?: RequestOptions,
  ): APIPromise<SearchSearchBandsResponse> {
    return this._client.get('/search/bands', { query, ...options });
  }

  /**
   * Search users
   */
  searchCollections(
    query: SearchSearchCollectionsParams,
    options?: RequestOptions,
  ): APIPromise<UsersAPI.CollectionList> {
    return this._client.get('/search/collections', { query, ...options });
  }

  /**
   * Search users
   */
  searchSongs(query: SearchSearchSongsParams, options?: RequestOptions): APIPromise<UsersAPI.SongList> {
    return this._client.get('/search/songs', { query, ...options });
  }

  /**
   * Search users
   */
  searchUsers(query: SearchSearchUsersParams, options?: RequestOptions): APIPromise<FollowersAPI.UserList> {
    return this._client.get('/search/users', { query, ...options });
  }

  /**
   * Records a search grouping token for a user
   *
   * Evidence: `apk` — `GroupingService`, `POST grouping/users/{userId}/tokens`. No APK response
   * shape.
   */
  createGroupingToken(userID: string, body: unknown, options?: RequestOptions): APIPromise<void> {
    return this._client.post(path`/grouping/users/${userID}/tokens`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Lists posts for a hashtag
   *
   * Evidence: `apk` — `HashtagService`, `GET hashtags/{name}/posts`. Response typed from
   * `com.bandlab.post.objects.Post`.
   */
  listHashtagPosts(
    name: string,
    query: SearchListHashtagPostsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PostsAPI.PostList> {
    return this._client.get(path`/hashtags/${name}/posts`, { query, ...options });
  }

  /**
   * Searches places
   *
   * Evidence: `apk` — `CollaboratorsSearchService`, `GET places?type=cities`. Response typed from
   * `com.bandlab.collaborators.search.location.api.SearchLocationResult`.
   */
  listPlaces(
    query: SearchListPlacesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SearchLocationResultList> {
    return this._client.get('/places', { query, ...options });
  }

  /**
   * Searches albums
   *
   * Evidence: `apk` — `SearchService`, `GET search/albums`. Response typed from
   * `com.bandlab.post.objects.Album`.
   */
  searchAlbums(query: SearchSearchAlbumsParams, options?: RequestOptions): APIPromise<AlbumsAPI.AlbumList> {
    return this._client.get('/search/albums', { query, ...options });
  }

  /**
   * Searches communities
   *
   * Evidence: `apk` — `SearchService`, `GET search/communities`. Response typed from
   * `com.bandlab.community.api.Community`.
   */
  searchCommunities(
    query: SearchSearchCommunitiesParams,
    options?: RequestOptions,
  ): APIPromise<CommunitiesAPI.CommunityList> {
    return this._client.get('/search/communities', { query, ...options });
  }

  /**
   * Searches hashtags
   *
   * Evidence: `apk` — `HashtagService`, `GET search/tags`. Response typed from
   * `com.bandlab.hashtag.api.Hashtag`.
   */
  searchTags(query: SearchSearchTagsParams, options?: RequestOptions): APIPromise<HashtagList> {
    return this._client.get('/search/tags', { query, ...options });
  }

  /**
   * Lists search suggestions
   *
   * Evidence: `apk` — `SearchSuggestionService`, `GET suggestions`. Response typed from
   * `com.bandlab.mixeditor.library.search.screen.service.model.SearchSuggestionDto`.
   */
  listSuggestions(
    query: SearchListSuggestionsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SearchSuggestionDtoList> {
    return this._client.get('/suggestions', { query, ...options });
  }

  /**
   * Lists trending hashtags
   *
   * Evidence: `apk` — `HashtagService`, `GET tags`. Response typed from
   * `com.bandlab.hashtag.api.Hashtag`.
   */
  listTags(
    query: SearchListTagsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<HashtagList> {
    return this._client.get('/tags', { query, ...options });
  }
}

/**
 * Evidence: `apk` — `com.bandlab.collaborators.search.location.api.SearchLocationResult`.
 */
export interface SearchLocationResult {
  id?: string;
}

/**
 * Evidence: `apk` — paged wrapper around
 * `com.bandlab.collaborators.search.location.api.SearchLocationResult`.
 */
export interface SearchLocationResultList {
  data?: Array<SearchLocationResult>;

  paging?: FollowersAPI.Paging;
}

/**
 * Evidence: `apk` — `com.bandlab.hashtag.api.Hashtag`.
 */
export interface Hashtag {
  id?: string;

  counters?: unknown;

  posts?: unknown;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.hashtag.api.Hashtag`.
 */
export interface HashtagList {
  data?: Array<Hashtag>;

  paging?: FollowersAPI.Paging;
}

/**
 * Evidence: `apk` — `com.bandlab.mixeditor.library.search.screen.service.model.SearchSuggestionDto`.
 */
export interface SearchSuggestionDto {
  keyword?: string;

  slug?: string;

  type?: string;
}

/**
 * Evidence: `apk` — paged wrapper around
 * `com.bandlab.mixeditor.library.search.screen.service.model.SearchSuggestionDto`.
 */
export interface SearchSuggestionDtoList {
  data?: Array<SearchSuggestionDto>;

  paging?: FollowersAPI.Paging;
}

export interface SearchListHashtagPostsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface SearchListPlacesParams {
  type?: string;
}

export interface SearchSearchAlbumsParams {
  q?: string;

  query?: string;

  limit?: number;

  offset?: number;
}

export interface SearchSearchCommunitiesParams {
  q?: string;

  query?: string;

  limit?: number;

  offset?: number;
}

export interface SearchSearchTagsParams {
  q?: string;

  query?: string;

  limit?: number;

  offset?: number;
}

export interface SearchListSuggestionsParams {
  q?: string;

  query?: string;

  limit?: number;

  offset?: number;
}

export interface SearchListTagsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

/**
 * Successful operation
 */
export interface SearchGlobalSearchResponse {
  data?: Array<unknown>;

  paging?: FollowersAPI.Paging;
}

/**
 * Successful operation
 */
export interface SearchSearchBandsResponse {
  data?: Array<unknown>;

  paging?: FollowersAPI.Paging;
}

export interface SearchGlobalSearchParams {
  query: string;

  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface SearchSearchBandsParams {
  query: string;

  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface SearchSearchCollectionsParams {
  query: string;

  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface SearchSearchSongsParams {
  query: string;

  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface SearchSearchUsersParams {
  query: string;

  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export declare namespace Search {
  export {
    type SearchGlobalSearchResponse as SearchGlobalSearchResponse,
    type SearchSearchBandsResponse as SearchSearchBandsResponse,
    type SearchGlobalSearchParams as SearchGlobalSearchParams,
    type SearchSearchBandsParams as SearchSearchBandsParams,
    type SearchSearchCollectionsParams as SearchSearchCollectionsParams,
    type SearchSearchSongsParams as SearchSearchSongsParams,
    type SearchSearchUsersParams as SearchSearchUsersParams,
    type SearchLocationResult as SearchLocationResult,
    type SearchLocationResultList as SearchLocationResultList,
    type Hashtag as Hashtag,
    type HashtagList as HashtagList,
    type SearchSuggestionDto as SearchSuggestionDto,
    type SearchSuggestionDtoList as SearchSuggestionDtoList,
    type SearchListHashtagPostsParams as SearchListHashtagPostsParams,
    type SearchListPlacesParams as SearchListPlacesParams,
    type SearchSearchAlbumsParams as SearchSearchAlbumsParams,
    type SearchSearchCommunitiesParams as SearchSearchCommunitiesParams,
    type SearchSearchTagsParams as SearchSearchTagsParams,
    type SearchListSuggestionsParams as SearchListSuggestionsParams,
    type SearchListTagsParams as SearchListTagsParams,
  };
}

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as MeAPI from './me';
import * as BandsAPI from './bands/bands';
import * as FollowersAPI from './users/followers';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Albums extends APIResource {
  /**
   * Creates an album
   *
   * Evidence: `apk` — `AlbumsService`, `POST albums/`. The request body model is not in the
   * app's descriptor set, so the body is `unknown` under rule D12.
   */
  create(body: unknown, options?: RequestOptions): APIPromise<Album> {
    return this._client.post('/albums', { body, ...options });
  }

  /**
   * Returns a single album
   *
   * Evidence: `apk` — `AlbumsService`, `GET albums/{albumId}`. Response typed from
   * `com.bandlab.post.objects.Album`.
   */
  retrieve(albumID: string, options?: RequestOptions): APIPromise<Album> {
    return this._client.get(path`/albums/${albumID}`, options);
  }

  /**
   * Returns the album themes
   *
   * Evidence: `apk` — `AlbumsService`, `GET albums/themes`. Response typed from
   * `com.bandlab.post.objects.AlbumTheme`.
   */
  listThemes(options?: RequestOptions): APIPromise<AlbumThemeList> {
    return this._client.get('/albums/themes', options);
  }

  /**
   * Returns the artists that can be added to an album
   *
   * Evidence: `apk` — `AddArtistService`, `GET artists`. Response typed from
   * `com.bandlab.user.models.InspiredArtist`.
   */
  listArtists(
    query: AlbumListArtistsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<InspiredArtistList> {
    return this._client.get('/artists', { query, ...options });
  }

  /**
   * Updates an album's picture
   *
   * Evidence: `apk` — `AlbumsService`, `PUT albums/{albumId}/picture`. The request body model
   * is not in the descriptor set, so the body is `unknown` under rule D12.
   */
  updatePicture(albumID: string, body: unknown, options?: RequestOptions): APIPromise<void> {
    return this._client.put(path`/albums/${albumID}/picture`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Updates an album's state
   *
   * Evidence: `apk` — `AlbumsService`, `PUT albums/{albumId}/state`. The request body model is
   * not in the descriptor set, so the body is `unknown` under rule D12.
   */
  updateState(albumID: string, body: unknown, options?: RequestOptions): APIPromise<void> {
    return this._client.put(path`/albums/${albumID}/state`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Adds a user's like to an album
   *
   * Evidence: `apk` — `AlbumsService`, `POST albums/{albumId}/likes/users/{userId}`.
   */
  addLike(albumID: string, userID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.post(path`/albums/${albumID}/likes/users/${userID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns the users who liked an album
   *
   * Evidence: `apk` — `AlbumsService`, `GET albums/{albumId}/likes/users`. The response element
   * is `com.bandlab.user.models.User`.
   */
  listLikesUsers(
    albumID: string,
    query: AlbumListLikesUsersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UserSummaryList> {
    return this._client.get(path`/albums/${albumID}/likes/users`, { query, ...options });
  }

  /**
   * Adds a post to an album
   *
   * Evidence: `apk` — `AlbumsService`, `POST albums/{albumId}/posts`. The response element is
   * `com.bandlab.post.objects.Post`.
   */
  createPost(albumID: string, body: unknown, options?: RequestOptions): APIPromise<AlbumPost> {
    return this._client.post(path`/albums/${albumID}/posts`, { body, ...options });
  }

  /**
   * Adds an existing post to an album
   *
   * Evidence: `apk` — `AlbumsService`, `POST albums/{albumId}/posts/{postId}`.
   */
  addPost(albumID: string, postID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.post(path`/albums/${albumID}/posts/${postID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Updates the position of a post in an album
   *
   * Evidence: `apk` — `AlbumsService`, `PUT albums/{albumId}/posts/{postId}/order`.
   */
  updatePostOrder(
    albumID: string,
    postID: string,
    body: unknown,
    options?: RequestOptions,
  ): APIPromise<void> {
    return this._client.put(path`/albums/${albumID}/posts/${postID}/order`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns an album's comments
   *
   * Evidence: `apk` — `AlbumCommentsService`, `GET albums/{id}/comments`. The response element
   * is `com.bandlab.comment.model.Comment`.
   */
  listComments(
    albumID: string,
    query: AlbumListCommentsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<AlbumCommentList> {
    return this._client.get(path`/albums/${albumID}/comments`, { query, ...options });
  }

  /**
   * Deletes an album comment
   *
   * Evidence: `apk` — `AlbumCommentsService`, `DELETE albums/{id}/comments/{commentId}`.
   */
  deleteComment(albumID: string, commentID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/albums/${albumID}/comments/${commentID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns the users who liked an album comment
   *
   * Evidence: `apk` — `CommentsLikesService`,
   * `GET albums/{albumId}/comments/{commentId}/likes/users`. The response element is
   * `com.bandlab.user.models.User`.
   */
  listCommentLikesUsers(
    albumID: string,
    commentID: string,
    query: AlbumListCommentLikesUsersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UserSummaryList> {
    return this._client.get(path`/albums/${albumID}/comments/${commentID}/likes/users`, {
      query,
      ...options,
    });
  }

  /**
   * Adds a user's like to an album comment
   *
   * Evidence: `apk` — `AlbumCommentsService`,
   * `POST albums/{id}/comments/{commentId}/likes/users/{userId}`.
   */
  addCommentLike(
    albumID: string,
    commentID: string,
    userID: string,
    options?: RequestOptions,
  ): APIPromise<void> {
    return this._client.post(path`/albums/${albumID}/comments/${commentID}/likes/users/${userID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

/**
 * Evidence: `apk` — `com.bandlab.post.objects.Album`.
 */
export interface Album {
  id?: string;

  artist?: unknown;

  counters?: AlbumCounters;

  creator?: BandsAPI.Creator;

  genreId?: string;

  isAutoRepostEnabled?: boolean;

  isCommentingAllowed?: boolean;

  isLiked?: boolean;

  isPurchased?: boolean;

  isReleaseScheduled?: boolean;

  permissions?: unknown;

  picture?: MeAPI.Picture;

  posts?: Array<unknown>;

  releaseDate?: string;

  state?: string;

  supporters?: Array<unknown>;

  theme?: unknown;

  themeId?: string;

  type?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.post.objects.Album.Counters`.
 */
export interface AlbumCounters {
  comments?: number;

  likes?: number;

  posts?: number;
}

/**
 * Evidence: `apk` — `com.bandlab.post.objects.AlbumTheme`.
 */
export interface AlbumTheme {
  id?: string;

  colors?: Array<unknown>;

  images?: AlbumTheme.Images;
}

export namespace AlbumTheme {
  export interface Images {
    header?: unknown;
  }
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.post.objects.Album`.
 */
export interface AlbumList {
  data?: Array<Album>;

  paging?: unknown;
}

/**
 * Evidence: `apk` — `com.bandlab.comment.model.Comment`.
 */
export interface AlbumComment {
  id?: string;

  canDelete?: boolean;

  counters?: unknown;

  createdOn?: string;

  creator?: unknown;

  isCreatedByPostCreator?: boolean;

  isLiked?: boolean;

  isLikedByPostCreator?: boolean;

  parentId?: string;

  permissions?: unknown;
}

/**
 * Evidence: `apk` — `com.bandlab.user.models.InspiredArtist`.
 */
export interface InspiredArtist {
  id?: string;

  picture?: MeAPI.Picture;
}

/**
 * Evidence: `apk` — `com.bandlab.post.objects.Post`. Only the fields this resource needs are
 * typed; the rest of the post shape belongs to `posts/`.
 */
export interface AlbumPost {
  id?: string;

  caption?: string;

  createdOn?: string;

  creator?: unknown;

  isExplicit?: boolean;

  state?: string;

  type?: string;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.post.objects.AlbumTheme`.
 */
export interface AlbumThemeList {
  data?: Array<AlbumTheme>;

  paging?: FollowersAPI.Paging;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.user.models.InspiredArtist`.
 */
export interface InspiredArtistList {
  data?: Array<InspiredArtist>;

  paging?: FollowersAPI.Paging;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.user.models.User`.
 */
export interface UserSummaryList {
  data?: Array<unknown>;

  paging?: FollowersAPI.Paging;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.comment.model.Comment`.
 */
export interface AlbumCommentList {
  data?: Array<AlbumComment>;

  paging?: FollowersAPI.Paging;
}

export interface AlbumListArtistsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface AlbumListLikesUsersParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface AlbumListCommentsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface AlbumListCommentLikesUsersParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export declare namespace Albums {
  export {
    type Album as Album,
    type AlbumComment as AlbumComment,
    type AlbumCommentList as AlbumCommentList,
    type AlbumCounters as AlbumCounters,
    type AlbumList as AlbumList,
    type AlbumListArtistsParams as AlbumListArtistsParams,
    type AlbumListCommentLikesUsersParams as AlbumListCommentLikesUsersParams,
    type AlbumListCommentsParams as AlbumListCommentsParams,
    type AlbumListLikesUsersParams as AlbumListLikesUsersParams,
    type AlbumPost as AlbumPost,
    type AlbumTheme as AlbumTheme,
    type AlbumThemeList as AlbumThemeList,
    type InspiredArtist as InspiredArtist,
    type InspiredArtistList as InspiredArtistList,
    type UserSummaryList as UserSummaryList,
  };
}

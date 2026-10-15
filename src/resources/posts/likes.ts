// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as LikesAPI from '../collections/likes';
import * as FollowersAPI from '../users/followers';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Likes extends APIResource {
  /**
   * Add a like
   */
  create(postID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.post(path`/posts/${postID}/likes`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns list of users
   */
  list(
    postID: string,
    query: LikeListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<LikesAPI.UserSummaryList> {
    return this._client.get(path`/posts/${postID}/likes`, { query, ...options });
  }

  /**
   * Removes a like
   */
  delete(postID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/posts/${postID}/likes`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Adds a like on behalf of a user
   *
   * Evidence: `apk` — `SocialActionService`, `POST posts/{id}/likes/users/{userId}`.
   */
  addUser(userID: string, params: LikeAddUserParams, options?: RequestOptions): APIPromise<void> {
    const { postId } = params;
    return this._client.post(path`/posts/${postId}/likes/users/${userID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns the users who liked a post
   *
   * Evidence: `apk` — `PostsService`, `GET posts/{id}/likes/users`. Response typed from
   * `com.bandlab.user.models.User`.
   */
  listUsers(
    postID: string,
    query: LikeListUsersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<LikeUserList> {
    return this._client.get(path`/posts/${postID}/likes/users`, { query, ...options });
  }
}

export interface LikeListParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface LikeAddUserParams {
  postId: string;
}

/**
 * Evidence: `apk` — `com.bandlab.user.models.User`.
 */
export interface LikeUser {
  id?: string;

  username?: string;

  picture?: unknown;

  isVerified?: boolean;

  followingState?: string;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.user.models.User`.
 */
export interface LikeUserList {
  data?: Array<LikeUser>;

  paging?: FollowersAPI.Paging;
}

export interface LikeListUsersParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export declare namespace Likes {
  export {
    type LikeListParams as LikeListParams,
    type LikeAddUserParams as LikeAddUserParams,
    type LikeUser as LikeUser,
    type LikeUserList as LikeUserList,
    type LikeListUsersParams as LikeListUsersParams,
  };
}

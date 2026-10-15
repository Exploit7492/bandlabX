// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as FollowersAPI from '../users/followers';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Likes extends APIResource {
  /**
   * Returns list of users
   *
   * @example
   * ```ts
   * const userSummaryList = await client.collections.likes.list(
   *   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   * );
   * ```
   */
  list(
    collectionID: string,
    query: LikeListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UserSummaryList> {
    return this._client.get(path`/collections/${collectionID}/likes`, { query, ...options });
  }

  /**
   * Add a like
   *
   * @example
   * ```ts
   * await client.collections.likes.add(
   *   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   * );
   * ```
   */
  add(collectionID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.post(path`/collections/${collectionID}/likes`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Removes a like
   *
   * @example
   * ```ts
   * await client.collections.likes.remove(
   *   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   * );
   * ```
   */
  remove(collectionID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/collections/${collectionID}/likes`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns the users who liked a collection
   *
   * Evidence: `apk` — `CollectionsService`, `GET collections/{id}/likes/users`. Response typed from
   * `com.bandlab.user.models.User`.
   */
  listUsers(
    collectionID: string,
    query: LikeListUsersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UserSummaryList> {
    return this._client.get(path`/collections/${collectionID}/likes/users`, { query, ...options });
  }
}

export interface UserSummaryList {
  data?: Array<unknown>;

  paging?: FollowersAPI.Paging;
}

export interface LikeListParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface LikeListUsersParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export declare namespace Likes {
  export {
    type UserSummaryList as UserSummaryList,
    type LikeListParams as LikeListParams,
    type LikeListUsersParams as LikeListUsersParams,
  };
}

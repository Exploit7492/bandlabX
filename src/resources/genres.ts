// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as PostsAPI from './posts/posts';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Genres extends APIResource {
  /**
   * Returns all genres
   */
  list(options?: RequestOptions): APIPromise<GenreListResponse> {
    return this._client.get('/genres', options);
  }

  /**
   * Lists trending posts for a genre
   *
   * Evidence: `apk` — `GenresService`, `GET genres/{genreId}/posts/trending`. Response typed from
   * `com.bandlab.post.objects.Post`.
   */
  listTrendingPosts(
    genreID: string,
    query: GenreListTrendingPostsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PostsAPI.PostList> {
    return this._client.get(path`/genres/${genreID}/posts/trending`, { query, ...options });
  }
}

export interface GenreListTrendingPostsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface Genre {
  id?: string;

  name?: string;
}

/**
 * Successful operation
 */
export type GenreListResponse = Array<Genre>;

export declare namespace Genres {
  export {
    type Genre as Genre,
    type GenreListResponse as GenreListResponse,
    type GenreListTrendingPostsParams as GenreListTrendingPostsParams,
  };
}

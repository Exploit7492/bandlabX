// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import * as BandsAPI from '../bands/bands';
import * as PostsAPI from '../collections/posts';
import * as CommentsAPI from '../posts/comments';
import * as PostsPostsAPI from '../posts/posts';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Posts extends APIResource {
  /**
   * Create a text post
   *
   * Evidence: `apk` — `WritePostService`, `POST communities/{communityId}/posts`. The SDK called
   * the singular `/community/...` route, which the server does not serve: a probe returns the
   * framework 404 page for `/community/...` while `/communities/...` binds `CommunityId`
   * (`400 The value '...' is not valid for CommunityId`).
   */
  create(communityID: string, body: PostCreateParams, options?: RequestOptions): APIPromise<PostsAPI.Post> {
    return this._client.post(path`/communities/${communityID}/posts`, { body, ...options });
  }

  /**
   * Returns a list of posts
   *
   * Evidence: `apk` — `GET communities/{communityId}/posts`. The SDK called the singular
   * `/community/...` route, which the server does not serve.
   */
  list(
    communityID: string,
    query: PostListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PostsPostsAPI.PostList> {
    return this._client.get(path`/communities/${communityID}/posts`, { query, ...options });
  }
}

export interface PostCreateParams {
  id?: string;

  caption?: string;

  clientId?: PostsAPI.ClientID;

  comments?: Array<CommentsAPI.Comment>;

  counters?: Shared.PostCounters;

  createdOn?: string;

  creator?: BandsAPI.Creator;

  image?: Shared.ImageSample;

  message?: string;

  revision?: Shared.RevisionSummary;

  type?: 'Revision' | 'Image' | 'Video' | 'Text';

  video?: Shared.VideoSample;
}

export interface PostListParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export declare namespace Posts {
  export { type PostCreateParams as PostCreateParams, type PostListParams as PostListParams };
}

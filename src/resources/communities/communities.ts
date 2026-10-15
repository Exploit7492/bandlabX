// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as MeAPI from '../me';
import * as BandsAPI from '../bands/bands';
import * as InvitesAPI from './invites';
import { InviteListParams, InviteSendParams, Invites } from './invites';
import * as MembersAPI from './members';
import {
  MemberDeleteParams,
  MemberListParams,
  MemberRetrieveParams,
  MemberUpdateParams,
  Members,
} from './members';
import * as PostsAPI from './posts';
import { PostCreateParams, PostListParams, Posts } from './posts';
import * as FollowersAPI from '../users/followers';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Communities extends APIResource {
  members: MembersAPI.Members = new MembersAPI.Members(this._client);
  posts: PostsAPI.Posts = new PostsAPI.Posts(this._client);
  invites: InvitesAPI.Invites = new InvitesAPI.Invites(this._client);

  /**
   * Create a new community
   *
   * @example
   * ```ts
   * const community = await client.communities.create({
   *   name: 'name',
   * });
   * ```
   */
  create(body: CommunityCreateParams, options?: RequestOptions): APIPromise<Community> {
    return this._client.post('/communities', { body, ...options });
  }

  /**
   * Returns a single community
   *
   * @example
   * ```ts
   * const community = await client.communities.retrieve(
   *   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   * );
   * ```
   */
  retrieve(communityID: string, options?: RequestOptions): APIPromise<Community> {
    return this._client.get(path`/communities/${communityID}`, options);
  }

  /**
   * Updates a community
   *
   * @example
   * ```ts
   * const community = await client.communities.update(
   *   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   *   { name: 'name' },
   * );
   * ```
   */
  update(communityID: string, body: CommunityUpdateParams, options?: RequestOptions): APIPromise<Community> {
    return this._client.patch(path`/communities/${communityID}`, { body, ...options });
  }

  /**
   * Deletes a community
   *
   * @example
   * ```ts
   * await client.communities.delete(
   *   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   * );
   * ```
   */
  delete(communityID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/communities/${communityID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns the trending communities
   *
   * Evidence: `apk` — `CommunitiesService`, `GET communities/trending`. Response typed from
   * `com.bandlab.community.api.Community`.
   */
  listTrending(
    query: CommunityListTrendingParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<CommunityList> {
    return this._client.get('/communities/trending', { query, ...options });
  }

  /**
   * Returns a community's rules
   *
   * Evidence: `apk` — `CommunityRulesService`, `GET communities/{communityId}/rules`. Response
   * typed from `com.bandlab.communities.objects.CommunityRules`.
   */
  listRules(communityID: string, options?: RequestOptions): APIPromise<CommunityRules> {
    return this._client.get(path`/communities/${communityID}/rules`, options);
  }

  /**
   * Pins a post to a community
   *
   * Evidence: `apk` — `PinnedPostsService`, `POST communities/{communityId}/pins/posts/{postId}`.
   */
  pinPost(postID: string, params: CommunityPinPostParams, options?: RequestOptions): APIPromise<void> {
    const { communityId } = params;
    return this._client.post(path`/communities/${communityId}/pins/posts/${postID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface Community {
  name: string;

  id?: string;

  about?: string;

  counters?: CommunityCounters;

  createdOn?: string;

  creator?: BandsAPI.Creator;

  isCommentsEnabled?: boolean;

  members?: Array<BandsAPI.GroupMemberSummary>;

  picture?: MeAPI.Picture;

  type?: Type;

  username?: string;
}

export interface CommunityCounters {
  members?: number;
}

export type Type = 'Public' | 'Private' | 'Closed';

export interface CommunityCreateParams {
  name: string;

  id?: string;

  about?: string;

  counters?: CommunityCounters;

  createdOn?: string;

  creator?: BandsAPI.Creator;

  isCommentsEnabled?: boolean;

  members?: Array<BandsAPI.GroupMemberSummary>;

  picture?: MeAPI.Picture;

  type?: Type;

  username?: string;
}

export interface CommunityUpdateParams {
  name: string;

  id?: string;

  about?: string;

  counters?: CommunityCounters;

  createdOn?: string;

  creator?: BandsAPI.Creator;

  isCommentsEnabled?: boolean;

  members?: Array<BandsAPI.GroupMemberSummary>;

  picture?: MeAPI.Picture;

  type?: Type;

  username?: string;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.community.api.Community`.
 */
export interface CommunityList {
  data?: Array<Community>;

  paging?: FollowersAPI.Paging;
}

/**
 * Evidence: `apk` — `com.bandlab.communities.objects.CommunityRules`.
 */
export interface CommunityRules {
  rules?: Array<unknown>;
}

export interface CommunityListTrendingParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface CommunityPinPostParams {
  communityId: string;
}

Communities.Members = Members;
Communities.Posts = Posts;
Communities.Invites = Invites;

export declare namespace Communities {
  export {
    type Community as Community,
    type CommunityCounters as CommunityCounters,
    type CommunityList as CommunityList,
    type CommunityRules as CommunityRules,
    type CommunityListTrendingParams as CommunityListTrendingParams,
    type CommunityPinPostParams as CommunityPinPostParams,
    type Type as Type,
    type CommunityCreateParams as CommunityCreateParams,
    type CommunityUpdateParams as CommunityUpdateParams,
  };

  export {
    Members as Members,
    type MemberRetrieveParams as MemberRetrieveParams,
    type MemberUpdateParams as MemberUpdateParams,
    type MemberListParams as MemberListParams,
    type MemberDeleteParams as MemberDeleteParams,
  };

  export { Posts as Posts, type PostCreateParams as PostCreateParams, type PostListParams as PostListParams };

  export {
    Invites as Invites,
    type InviteListParams as InviteListParams,
    type InviteSendParams as InviteSendParams,
  };
}

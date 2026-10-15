// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as GenresAPI from '../genres';
import * as MeAPI from '../me';
import * as InvitesAPI from './invites';
import { InviteListParams, InviteSendParams, Invites } from './invites';
import * as MembersAPI from './members';
import {
  GroupMember,
  GroupMemberList,
  MemberListParams,
  MemberRemoveParams,
  MemberRetrieveParams,
  MemberUpdateParams,
  Members,
} from './members';
import * as PostsAPI from '../posts/posts';
import * as UsersAPI from '../users/users';
import * as FollowersAPI from '../users/followers';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Bands extends APIResource {
  members: MembersAPI.Members = new MembersAPI.Members(this._client);
  invites: InvitesAPI.Invites = new InvitesAPI.Invites(this._client);

  /**
   * Create a new band
   *
   * @example
   * ```ts
   * const band = await client.bands.create({ name: 'name' });
   * ```
   */
  create(body: BandCreateParams, options?: RequestOptions): APIPromise<Band> {
    return this._client.post('/bands', { body, ...options });
  }

  /**
   * Returns a single band
   *
   * @example
   * ```ts
   * const band = await client.bands.retrieve(
   *   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   * );
   * ```
   */
  retrieve(bandID: string, options?: RequestOptions): APIPromise<Band> {
    return this._client.get(path`/bands/${bandID}`, options);
  }

  /**
   * Updates a band
   *
   * @example
   * ```ts
   * const band = await client.bands.update(
   *   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   *   { name: 'name' },
   * );
   * ```
   */
  update(bandID: string, body: BandUpdateParams, options?: RequestOptions): APIPromise<Band> {
    return this._client.patch(path`/bands/${bandID}`, { body, ...options });
  }

  /**
   * Deletes a band
   *
   * @example
   * ```ts
   * await client.bands.delete(
   *   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   * );
   * ```
   */
  delete(bandID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/bands/${bandID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns a list of posts
   *
   * @example
   * ```ts
   * const postList = await client.bands.listPosts(
   *   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   * );
   * ```
   */
  listPosts(
    bandID: string,
    query: BandListPostsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PostsAPI.PostList> {
    return this._client.get(path`/bands/${bandID}/posts`, { query, ...options });
  }

  /**
   * Returns a list of songs
   *
   * @example
   * ```ts
   * const songList = await client.bands.listSongs(
   *   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   * );
   * ```
   */
  listSongs(
    bandID: string,
    query: BandListSongsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UsersAPI.SongList> {
    return this._client.get(path`/bands/${bandID}/songs`, { query, ...options });
  }

  /**
   * Returns suggested bands
   *
   * Evidence: `apk` — `BandService`, `GET bands/suggested`. The response element is
   * `com.bandlab.band.api.suggested.SuggestedBand`.
   */
  listSuggested(
    query: BandListSuggestedParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SuggestedBandList> {
    return this._client.get('/bands/suggested', { query, ...options });
  }

  /**
   * Returns a band's followers
   *
   * Evidence: `apk` — `BandService`, `GET bands/{id}/followers`. The response element is
   * `com.bandlab.user.models.User`.
   */
  listFollowers(
    bandID: string,
    query: BandListFollowersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<FollowersAPI.UserList> {
    return this._client.get(path`/bands/${bandID}/followers`, { query, ...options });
  }

  /**
   * Adds a follower to a band
   *
   * Evidence: `apk` — `SocialActionService`, `POST bands/{id}/followers/{userId}`.
   */
  addFollower(bandID: string, userID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.post(path`/bands/${bandID}/followers/${userID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns a band member's follow invitees
   *
   * Evidence: `apk` — `InviteToBandService`,
   * `GET bands/{bandId}/members/{userId}/follow-invitees`. The response element is
   * `com.bandlab.user.models.User`.
   */
  listMemberFollowInvitees(
    userID: string,
    params: BandListMemberFollowInviteesParams,
    options?: RequestOptions,
  ): APIPromise<FollowersAPI.UserList> {
    const { bandId, ...query } = params;
    return this._client.get(path`/bands/${bandId}/members/${userID}/follow-invitees`, {
      query,
      ...options,
    });
  }

  /**
   * Pins a post to a band
   *
   * Evidence: `apk` — `PinnedPostsService`, `POST bands/{bandId}/pins/posts/{postId}`.
   */
  pinPost(postID: string, params: BandPinPostParams, options?: RequestOptions): APIPromise<void> {
    const { bandId } = params;
    return this._client.post(path`/bands/${bandId}/pins/posts/${postID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns a band's video posts
   *
   * Evidence: `apk` — `PostsService`, `GET bands/{id}/videos/posts`. The response element is
   * `com.bandlab.post.objects.Post`.
   */
  listVideoPosts(
    bandID: string,
    query: BandListVideoPostsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PostsAPI.PostList> {
    return this._client.get(path`/bands/${bandID}/videos/posts`, { query, ...options });
  }
}

export interface Band {
  name: string;

  id?: string;

  about?: string;

  conversationId?: string;

  counters?: BandCounters;

  createdOn?: string;

  creator?: Creator;

  genres?: Array<GenresAPI.Genre>;

  isOpen?: boolean;

  members?: Array<GroupMemberSummary>;

  picture?: MeAPI.Picture;

  username?: string;
}

export interface BandCounters {
  members?: number;
}

export interface Creator {
  id?: string;

  isVerified?: boolean;

  name?: string;

  picture?: MeAPI.Picture;

  username?: string;
}

export interface GroupMemberSummary {
  id?: string;

  name?: string;

  username?: string;
}

export interface BandCreateParams {
  name: string;

  id?: string;

  about?: string;

  conversationId?: string;

  counters?: BandCounters;

  createdOn?: string;

  creator?: Creator;

  genres?: Array<GenresAPI.Genre>;

  isOpen?: boolean;

  members?: Array<GroupMemberSummary>;

  picture?: MeAPI.Picture;

  username?: string;
}

export interface BandUpdateParams {
  name: string;

  id?: string;

  about?: string;

  conversationId?: string;

  counters?: BandCounters;

  createdOn?: string;

  creator?: Creator;

  genres?: Array<GenresAPI.Genre>;

  isOpen?: boolean;

  members?: Array<GroupMemberSummary>;

  picture?: MeAPI.Picture;

  username?: string;
}

export interface BandListPostsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface BandListSongsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

/**
 * Evidence: `apk` — `com.bandlab.band.api.suggested.SuggestedBand`.
 */
export interface SuggestedBand {
  id?: string;

  counters?: unknown;

  followingState?: string;

  picture?: MeAPI.Picture;

  userName?: string;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.band.api.suggested.SuggestedBand`.
 */
export interface SuggestedBandList {
  data?: Array<SuggestedBand>;

  paging?: FollowersAPI.Paging;
}

export interface BandListSuggestedParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface BandListFollowersParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface BandListVideoPostsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface BandListMemberFollowInviteesParams {
  /**
   * Path param:
   */
  bandId: string;

  /**
   * Query param:
   */
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface BandPinPostParams {
  bandId: string;
}

Bands.Members = Members;
Bands.Invites = Invites;

export declare namespace Bands {
  export {
    type Band as Band,
    type BandCounters as BandCounters,
    type Creator as Creator,
    type GroupMemberSummary as GroupMemberSummary,
    type BandCreateParams as BandCreateParams,
    type BandUpdateParams as BandUpdateParams,
    type BandListPostsParams as BandListPostsParams,
    type BandListSongsParams as BandListSongsParams,
    type BandListSuggestedParams as BandListSuggestedParams,
    type BandListFollowersParams as BandListFollowersParams,
    type BandListMemberFollowInviteesParams as BandListMemberFollowInviteesParams,
    type BandListVideoPostsParams as BandListVideoPostsParams,
    type BandPinPostParams as BandPinPostParams,
    type SuggestedBand as SuggestedBand,
    type SuggestedBandList as SuggestedBandList,
  };

  export {
    Members as Members,
    type GroupMember as GroupMember,
    type GroupMemberList as GroupMemberList,
    type MemberRetrieveParams as MemberRetrieveParams,
    type MemberUpdateParams as MemberUpdateParams,
    type MemberListParams as MemberListParams,
    type MemberRemoveParams as MemberRemoveParams,
  };

  export {
    Invites as Invites,
    type InviteListParams as InviteListParams,
    type InviteSendParams as InviteSendParams,
  };
}

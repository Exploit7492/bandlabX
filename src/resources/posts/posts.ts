// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as MeAPI from '../me';
import * as BandsAPI from '../bands/bands';
import * as CommunitiesAPI from '../communities/communities';
import * as CommentsAPI from './comments';
import {
  Comment,
  CommentCreateParams,
  CommentDeleteParams,
  CommentListParams,
  CommentListResponse,
  Comments,
} from './comments';
import * as LikesAPI from './likes';
import { LikeListParams, Likes } from './likes';
import * as SongsAPI from '../songs/songs';
import * as FollowersAPI from '../users/followers';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Posts extends APIResource {
  comments: CommentsAPI.Comments = new CommentsAPI.Comments(this._client);
  likes: LikesAPI.Likes = new LikesAPI.Likes(this._client);
  reactions: Reactions = new Reactions(this._client);
  polls: Polls = new Polls(this._client);
  mentions: Mentions = new Mentions(this._client);

  /**
   * Returns a single post
   */
  retrieve(postID: string, options?: RequestOptions): APIPromise<Invite> {
    return this._client.get(path`/posts/${postID}`, options);
  }

  /**
   * Updates a post
   */
  update(postID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.patch(path`/posts/${postID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Get a list of posts
   */
  list(query: PostListParams | null | undefined = {}, options?: RequestOptions): APIPromise<PostList> {
    return this._client.get('/posts', { query, ...options });
  }

  /**
   * Deletes a post
   */
  delete(postID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/posts/${postID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Records a play on a post
   *
   * Evidence: `apk` — `SocialActionService`, `POST posts/{id}/plays`.
   */
  play(postID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.post(path`/posts/${postID}/plays`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns the lyrics attached to a post
   *
   * Evidence: `apk` — `RemoteSongService`, `GET posts/{id}/lyrics`. No response shape is in the
   * descriptor set, so the response is `unknown` under rule D12.
   */
  retrieveLyrics(postID: string, options?: RequestOptions): APIPromise<unknown> {
    return this._client.get(path`/posts/${postID}/lyrics`, options);
  }

  /**
   * Updates a track post's picture
   *
   * Evidence: `apk` — `TracksService`, `PUT posts/{postId}/track/picture`. The request body model
   * is not in the descriptor set, so the body is `unknown` under rule D12.
   */
  updateTrackPicture(postID: string, body: unknown, options?: RequestOptions): APIPromise<void> {
    return this._client.put(path`/posts/${postID}/track/picture`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export class Reactions extends APIResource {
  /**
   * Returns the users who reacted to a post
   *
   * Evidence: `apk` — `PostsService`, `GET posts/{id}/reactions/users`. Response typed from
   * `com.bandlab.post.objects.PostReactionUser`.
   */
  listUsers(
    postID: string,
    query: ReactionListUsersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PostReactionUserList> {
    return this._client.get(path`/posts/${postID}/reactions/users`, { query, ...options });
  }

  /**
   * Adds a user's reaction to a post
   *
   * Evidence: `apk` — `SocialActionService`, `POST posts/{id}/reactions/users/{userId}`.
   */
  addUser(userID: string, params: ReactionAddUserParams, options?: RequestOptions): APIPromise<void> {
    const { postId } = params;
    return this._client.post(path`/posts/${postId}/reactions/users/${userID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export class Mentions extends APIResource {
  /**
   * Returns mention suggestions
   *
   * Evidence: `apk` — `MentionService`, `GET mentions/suggestions`. Response typed from
   * `com.bandlab.user.models.User`.
   */
  listSuggestions(
    query: MentionListSuggestionsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UserList> {
    return this._client.get('/mentions/suggestions', { query, ...options });
  }
}

export class Polls extends APIResource {
  /**
   * Removes a vote from a poll option
   *
   * Evidence: `apk` — `PollService`, `DELETE posts/{postId}/poll/options/{optionId}/votes`.
   */
  removeVote(optionID: string, params: PollRemoveVoteParams, options?: RequestOptions): APIPromise<void> {
    const { postId } = params;
    return this._client.delete(path`/posts/${postId}/poll/options/${optionID}/votes`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface Invite {
  message: string;

  id?: string;

  band?: Invite.Band;

  community?: Invite.Community;

  createdOn?: string;

  email?: string;

  isUserRequest?: boolean;

  sender?: UserSummary;

  song?: SongSummary;

  text?: string;

  type?:
    | 'RequestToBand'
    | 'RequestToSong'
    | 'RequestToCommunity'
    | 'InviteToBand'
    | 'InviteToSong'
    | 'InviteToCommunity'
    | 'ExternalInviteToBand'
    | 'ExternalInviteToSong'
    | 'ExternalInviteToBandLab';

  user?: UserSummary;
}

export namespace Invite {
  export interface Band {
    id?: string;

    counters?: BandsAPI.BandCounters;

    name?: string;

    picture?: MeAPI.Picture;

    username?: string;
  }

  export interface Community {
    id?: string;

    about?: string;

    counters?: CommunitiesAPI.CommunityCounters;

    createdOn?: string;

    name?: string;

    picture?: MeAPI.Picture;

    type?: CommunitiesAPI.Type;

    username?: string;
  }
}

export interface PostList {
  data?: Array<unknown>;

  paging?: FollowersAPI.Paging;
}

export interface SongSummary {
  id?: string;

  author?: SongsAPI.Author;

  counters?: SongsAPI.SongCounters;

  createdOn?: string;

  description?: string;

  isFork?: boolean;

  isForkable?: boolean;

  isPublic?: boolean;

  name?: string;

  original?: SongsAPI.SongOriginal;

  picture?: MeAPI.Picture;

  slug?: string;
}

export interface UserSummary {
  id?: string;

  counters?: MeAPI.UserCounters;

  isVerified?: boolean;

  name?: string;

  picture?: MeAPI.Picture;

  username?: string;
}

export interface PostListParams {
  after?: string;

  before?: string;

  forkable?: boolean;

  genres?: string;

  limit?: number;

  offset?: number;

  sort?: 'recent' | 'popular' | 'inspiring';

  spotlights?: string;

  tag?: string;

  types?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.post.objects.PostReactionUser`.
 */
export interface PostReactionUser {
  id?: string;

  username?: string;

  picture?: unknown;

  isVerified?: boolean;

  followingState?: string;

  isPrivate?: boolean;

  reaction?: string;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.post.objects.PostReactionUser`.
 */
export interface PostReactionUserList {
  data?: Array<PostReactionUser>;

  paging?: FollowersAPI.Paging;
}

export interface ReactionListUsersParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface ReactionAddUserParams {
  postId: string;
}

export interface PollRemoveVoteParams {
  postId: string;
}

export interface MentionListSuggestionsParams {
  query?: string;

  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.user.models.User`.
 */
export interface UserList {
  data?: Array<UserSummary>;

  paging?: FollowersAPI.Paging;
}

Posts.Comments = Comments;
Posts.Likes = Likes;
Posts.Reactions = Reactions;
Posts.Polls = Polls;
Posts.Mentions = Mentions;

export declare namespace Posts {
  export {
    type Invite as Invite,
    type PostList as PostList,
    type PostReactionUser as PostReactionUser,
    type PostReactionUserList as PostReactionUserList,
    type SongSummary as SongSummary,
    type UserList as UserList,
    type UserSummary as UserSummary,
    type PostListParams as PostListParams,
    type ReactionListUsersParams as ReactionListUsersParams,
    type ReactionAddUserParams as ReactionAddUserParams,
    type PollRemoveVoteParams as PollRemoveVoteParams,
    type MentionListSuggestionsParams as MentionListSuggestionsParams,
  };

  export {
    Comments as Comments,
    type Comment as Comment,
    type CommentListResponse as CommentListResponse,
    type CommentCreateParams as CommentCreateParams,
    type CommentListParams as CommentListParams,
    type CommentDeleteParams as CommentDeleteParams,
  };

  export { Likes as Likes, type LikeListParams as LikeListParams };

  export { Reactions as Reactions, Polls as Polls, Mentions as Mentions };
}

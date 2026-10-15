// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as MeAPI from '../me';
import * as BandsAPI from '../bands/bands';
import * as PostsAPI from '../posts/posts';
import * as CollaboratorsAPI from './collaborators';
import {
  CollaboratorListParams,
  CollaboratorListResponse,
  CollaboratorRemoveParams,
  Collaborators,
} from './collaborators';
import * as InvitesAPI from './invites';
import { InviteListInvitesParams, InviteSendInvitesParams, Invites } from './invites';
import * as RevisionsAPI from './revisions';
import { RevisionForksParams, RevisionListParams, RevisionListResponse, Revisions } from './revisions';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Songs extends APIResource {
  collaborators: CollaboratorsAPI.Collaborators = new CollaboratorsAPI.Collaborators(this._client);
  revisions: RevisionsAPI.Revisions = new RevisionsAPI.Revisions(this._client);
  invites: InvitesAPI.Invites = new InvitesAPI.Invites(this._client);

  /**
   * Returns a single song
   */
  retrieve(songID: string, options?: RequestOptions): APIPromise<Song> {
    return this._client.get(path`/songs/${songID}`, options);
  }

  /**
   * Updates a song
   */
  update(songID: string, body: SongUpdateParams, options?: RequestOptions): APIPromise<Song> {
    return this._client.patch(path`/songs/${songID}`, { body, ...options });
  }

  /**
   * Deletes a song
   */
  delete(songID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/songs/${songID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns a list of posts
   *
   * Evidence: `apk` — `RemoteSongService.getRevisionPosts`, `songs/{id}/posts`. The APK, the
   * live route probe and the model-binding error all use the plural `/songs/...`; the previous
   * singular `/song/...` returned the framework 404 page.
   */
  listPosts(
    songID: string,
    query: SongListPostsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PostsAPI.PostList> {
    return this._client.get(path`/songs/${songID}/posts`, { query, ...options });
  }

  /**
   * Fork a song
   *
   * Evidence: `apk` — `SongForkService.forkSong`, `POST songs/forks`. The body model is
   * obfuscated in the app (`vrb`), so the request body is `unknown` under rule D12.
   */
  forks(body: unknown, options?: RequestOptions): APIPromise<Song> {
    return this._client.post('/songs/forks', { body, ...options });
  }

  /**
   * Returns a song's invite link
   *
   * Evidence: `apk` — `RemoteSongService.getInviteLink`, `GET songs/{id}/invite-link`.
   * Entitlement to create an invite link is enforced server-side.
   */
  retrieveInviteLink(songID: string, options?: RequestOptions): APIPromise<InviteLink> {
    return this._client.get(path`/songs/${songID}/invite-link`, options);
  }
}

/**
 * Evidence: `apk` — `com.bandlab.song.api.InviteLink`.
 */
export interface InviteLink {
  inviteLink?: string;
}

export interface Author {
  id?: string;

  conversationId?: string;

  name?: string;

  type?: 'User' | 'Band';

  username?: string;
}

export interface Song {
  name: string;

  id?: string;

  author?: Author;

  collaborators?: Array<Song.Collaborator>;

  counters?: SongCounters;

  createdOn?: string;

  creator?: BandsAPI.Creator;

  description?: string;

  isFork?: boolean;

  isForkable?: boolean;

  isPublic?: boolean;

  modifiedOn?: string;

  original?: SongOriginal;

  picture?: MeAPI.Picture;

  slug?: string;
}

export namespace Song {
  export interface Collaborator {
    id?: string;

    counters?: MeAPI.UserCounters;

    name?: string;

    picture?: MeAPI.Picture;

    username?: string;
  }
}

export interface SongCounters {
  collaborators?: number;

  comments?: number;

  forks?: number;

  likes?: number;

  plays?: number;

  publicRevisions?: number;
}

export interface SongOriginal {
  creatorName?: string;

  name?: string;

  picture?: MeAPI.Picture;

  revisionId?: string;

  songId?: string;
}

export interface SongUpdateParams {
  name: string;

  id?: string;

  author?: Author;

  collaborators?: Array<SongUpdateParams.Collaborator>;

  counters?: SongCounters;

  createdOn?: string;

  creator?: BandsAPI.Creator;

  description?: string;

  isFork?: boolean;

  isForkable?: boolean;

  isPublic?: boolean;

  modifiedOn?: string;

  original?: SongOriginal;

  picture?: MeAPI.Picture;

  slug?: string;
}

export namespace SongUpdateParams {
  export interface Collaborator {
    id?: string;

    counters?: MeAPI.UserCounters;

    name?: string;

    picture?: MeAPI.Picture;

    username?: string;
  }
}

export interface SongListPostsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

Songs.Collaborators = Collaborators;
Songs.Revisions = Revisions;
Songs.Invites = Invites;

export declare namespace Songs {
  export {
    type Author as Author,
    type Song as Song,
    type SongCounters as SongCounters,
    type SongOriginal as SongOriginal,
    type InviteLink as InviteLink,
    type SongUpdateParams as SongUpdateParams,
    type SongListPostsParams as SongListPostsParams,
  };

  export {
    Collaborators as Collaborators,
    type CollaboratorListResponse as CollaboratorListResponse,
    type CollaboratorListParams as CollaboratorListParams,
    type CollaboratorRemoveParams as CollaboratorRemoveParams,
  };

  export {
    Revisions as Revisions,
    type RevisionListResponse as RevisionListResponse,
    type RevisionListParams as RevisionListParams,
    type RevisionForksParams as RevisionForksParams,
  };

  export {
    Invites as Invites,
    type InviteListInvitesParams as InviteListInvitesParams,
    type InviteSendInvitesParams as InviteSendInvitesParams,
  };
}

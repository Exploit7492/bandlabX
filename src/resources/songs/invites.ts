// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as FollowersAPI from '../users/followers';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Invites extends APIResource {
  /**
   * Returns a list of invites
   *
   * Evidence: `apk` — `InviteService.getSongInvites`, `GET songs/{id}/invites?accepted=false`.
   * The response is typed from `com.bandlab.invite.api.Invite`. The previous singular
   * `/song/...` route returned the framework 404 page.
   */
  listInvites(
    songID: string,
    query: InviteListInvitesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<InviteListResponse> {
    return this._client.get(path`/songs/${songID}/invites`, { query, ...options });
  }

  /**
   * Send invites
   *
   * Evidence: `apk` — `InviteToSongService.sendInvite`, `POST songs/{id}/invites`.
   */
  sendInvites(songID: string, body: InviteSendInvitesParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post(path`/songs/${songID}/invites`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

/**
 * Evidence: `apk` — `com.bandlab.invite.api.Invite`. Nested objects are left `unknown` because
 * the app's descriptor gives the field names but not their types.
 */
export interface Invite {
  band?: unknown;

  community?: unknown;

  createdOn?: string;

  email?: string;

  inviteId?: string;

  inviteStatus?: string;

  inviter?: string;

  inviterId?: string;

  sender?: unknown;

  song?: unknown;

  text?: string;

  type?: string;

  user?: unknown;

  userStatus?: string;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.invite.api.Invite`.
 */
export interface InviteListResponse {
  data?: Array<Invite>;

  paging?: FollowersAPI.Paging;
}

export interface InviteListInvitesParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface InviteSendInvitesParams {
  emails?: Array<string>;

  message?: string;

  userIds?: Array<string>;
}

export declare namespace Invites {
  export {
    type Invite as Invite,
    type InviteListResponse as InviteListResponse,
    type InviteListInvitesParams as InviteListInvitesParams,
    type InviteSendInvitesParams as InviteSendInvitesParams,
  };
}

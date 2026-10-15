// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as SongsInvitesAPI from '../songs/invites';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Invites extends APIResource {
  /**
   * Returns a list of invites
   *
   * Evidence: `apk` — `InviteService`, `GET bands/{id}/invites?accepted=false`. The response is
   * typed from `com.bandlab.invite.api.Invite` (the same shape the songs invites list uses).
   *
   * @example
   * ```ts
   * const inviteList = await client.bands.invites.list(
   *   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   * );
   * ```
   */
  list(
    bandID: string,
    query: InviteListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<InviteListResponse> {
    return this._client.get(path`/bands/${bandID}/invites`, { query, ...options });
  }

  /**
   * Send invites
   *
   * @example
   * ```ts
   * await client.bands.invites.send('bandId');
   * ```
   */
  send(bandID: string, body: InviteSendParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post(path`/bands/${bandID}/invites`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface InviteListParams {
  /**
   * The app sends `false` to list invites that are still pending.
   */
  accepted?: boolean;

  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface InviteSendParams {
  emails?: Array<string>;

  message?: string;

  userIds?: Array<string>;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.invite.api.Invite`. Reuses the songs
 * invites shape so the two lists cannot drift.
 */
export type InviteListResponse = SongsInvitesAPI.InviteListResponse;

export declare namespace Invites {
  export {
    type InviteListParams as InviteListParams,
    type InviteListResponse as InviteListResponse,
    type InviteSendParams as InviteSendParams,
  };
}

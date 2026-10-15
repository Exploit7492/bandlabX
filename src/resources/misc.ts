// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Misc extends APIResource {
  /**
   * Creates a chat websocket authorization
   *
   * Evidence: `apk` — `ChatWebSocketsAuthService`, `POST chat/authorizations`. Response typed
   * from `com.bandlab.chat.objects.ChatWebSocketsUrl`.
   */
  createChatAuthorization(body: unknown, options?: RequestOptions): APIPromise<ChatWebSocketsUrl> {
    return this._client.post('/chat/authorizations', { body, ...options });
  }

  /**
   * Returns the beats filters
   *
   * Evidence: `apk` — `BeatsService`, `GET experiment/beats-filters`. Response typed from
   * `com.bandlab.beat.api.BeatsFilters`. This is a BandLab path under `/experiment/...`; only
   * the third-party analytics hosts are excluded, not the path prefix.
   */
  retrieveBeatsFilters(options?: RequestOptions): APIPromise<BeatsFilters> {
    return this._client.get('/experiment/beats-filters', options);
  }

  /**
   * Returns the client options
   *
   * Evidence: `apk` — `OptionsService`, `GET options`. The app gives no response shape for this
   * path, so it is `unknown` under rule D12.
   */
  retrieveOptions(options?: RequestOptions): APIPromise<unknown> {
    return this._client.get('/options', options);
  }

  /**
   * Returns the social links
   *
   * Evidence: `apk` — `SocialLinkService`, `GET social-links`. The response element is
   * `com.bandlab.social.links.api.api.SocialLink`.
   */
  listSocialLinks(
    query: MiscListSocialLinksParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SocialLinkList> {
    return this._client.get('/social-links', { query, ...options });
  }

  /**
   * Collects tracking events
   *
   * Evidence: `apk` — `NativeAdsService`, `POST tracking/v2/collect`. The app gives no response
   * shape for this path, so it is `unknown` under rule D12.
   */
  collectTracking(body: unknown, options?: RequestOptions): APIPromise<unknown> {
    return this._client.post('/tracking/v2/collect', { body, ...options });
  }
}

/**
 * Evidence: `apk` — `com.bandlab.chat.objects.ChatWebSocketsUrl`.
 */
export interface ChatWebSocketsUrl {
  webSocketsUrl?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.beat.api.BeatsFilters`.
 */
export interface BeatsFilters {
  genres?: Array<unknown>;

  keys?: BeatsFilters.KeyGroups;

  maxBpm?: number;

  minBpm?: number;
}

export namespace BeatsFilters {
  export interface KeyGroups {
    majs?: Array<string>;

    mins?: Array<string>;
  }
}

/**
 * Evidence: `apk` — `com.bandlab.social.links.api.api.SocialLink`.
 */
export interface SocialLink {
  id?: string;

  iconUrl?: string;

  title?: string;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.social.links.api.api.SocialLink`.
 */
export interface SocialLinkList {
  data?: Array<SocialLink>;

  paging?: unknown;
}

export interface MiscListSocialLinksParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export declare namespace Misc {
  export {
    type BeatsFilters as BeatsFilters,
    type ChatWebSocketsUrl as ChatWebSocketsUrl,
    type MiscListSocialLinksParams as MiscListSocialLinksParams,
    type SocialLink as SocialLink,
    type SocialLinkList as SocialLinkList,
  };
}

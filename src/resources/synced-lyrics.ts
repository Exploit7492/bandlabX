// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class SyncedLyrics extends APIResource {
  /**
   * Returns the price of a synced-lyric token
   *
   * Evidence: `apk` — `SyncedLyricService`, `GET synced-lyrics/ai-tokens/price`. Response typed
   * from `com.bandlab.videomixer.lyric.api.SyncedLyricPrice`.
   */
  retrieveTokenPrice(options?: RequestOptions): APIPromise<SyncedLyricPrice> {
    return this._client.get('/synced-lyrics/ai-tokens/price', options);
  }

  /**
   * Returns the synced lyrics for a post
   *
   * Evidence: `apk` — `SyncedLyricService`, `GET synced-lyrics/{postId}`. Response typed from
   * `com.bandlab.videomixer.lyric.api.SyncedLyricResponse`.
   */
  retrieve(postID: string, options?: RequestOptions): APIPromise<SyncedLyricResponse> {
    return this._client.get(path`/synced-lyrics/${postID}`, options);
  }
}

/**
 * Evidence: `apk` — `com.bandlab.videomixer.lyric.api.SyncedLyricPrice`.
 */
export interface SyncedLyricPrice {
  amount?: number;
}

/**
 * Evidence: `apk` — `com.bandlab.videomixer.lyric.api.Lyrics`.
 */
export interface SyncedLyricsLyrics {
  lines?: Array<SyncedLyricsLyrics.Line>;
}

export namespace SyncedLyricsLyrics {
  export interface Line {
    endTime?: number;

    startTime?: number;

    text?: string;
  }
}

/**
 * Evidence: `apk` — `com.bandlab.videomixer.lyric.api.SyncedLyricResponse`.
 */
export interface SyncedLyricResponse {
  lyrics?: SyncedLyricsLyrics;

  postId?: string;

  status?: string;
}

export declare namespace SyncedLyrics {
  export {
    type SyncedLyricsLyrics as SyncedLyricsLyrics,
    type SyncedLyricPrice as SyncedLyricPrice,
    type SyncedLyricResponse as SyncedLyricResponse,
  };
}

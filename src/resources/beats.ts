// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as FollowersAPI from './users/followers';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Beats extends APIResource {
  /**
   * Lists beats from the marketplace
   *
   * Evidence: `apk` — `BeatsService`, `GET beats`. Response typed from
   * `com.bandlab.common.models.beat.Beat`.
   */
  list(query: BeatListParams | null | undefined = {}, options?: RequestOptions): APIPromise<BeatList> {
    return this._client.get('/beats', { query, ...options });
  }

  /**
   * Lists beat collections
   *
   * Evidence: `apk` — `BeatsCollectionsService`, `GET beats/collections`. Response typed from
   * `com.bandlab.beat.collections.api.BeatsCollection`.
   */
  listCollections(
    query: BeatListCollectionsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<BeatsCollectionList> {
    return this._client.get('/beats/collections', { query, ...options });
  }

  /**
   * Returns a beat collection
   *
   * Evidence: `apk` — `BeatsCollectionsService`, `GET beats/collections/{collectionId}`. Response
   * typed from `com.bandlab.beat.collections.api.BeatsCollection`.
   */
  retrieveCollection(collectionID: string, options?: RequestOptions): APIPromise<BeatsCollection> {
    return this._client.get(path`/beats/collections/${collectionID}`, options);
  }

  /**
   * Lists free beats
   *
   * Evidence: `apk` — `BeatsService`, `GET beats/free-beats`. Response typed from
   * `com.bandlab.common.models.beat.Beat`.
   */
  listFree(
    query: BeatListFreeParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<BeatList> {
    return this._client.get('/beats/free-beats', { query, ...options });
  }

  /**
   * Lists beats for a genre
   *
   * Evidence: `apk` — `BeatsService`, `GET beats/genres/{genreId}`. Response typed from
   * `com.bandlab.common.models.beat.Beat`.
   */
  listByGenre(
    genreID: string,
    query: BeatListByGenreParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<BeatList> {
    return this._client.get(path`/beats/genres/${genreID}`, { query, ...options });
  }

  /**
   * Lists limited beats
   *
   * Evidence: `apk` — `BeatsService`, `GET beats/limited-beats`. Response typed from
   * `com.bandlab.common.models.beat.Beat`.
   */
  listLimited(
    query: BeatListLimitedParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<BeatList> {
    return this._client.get('/beats/limited-beats', { query, ...options });
  }

  /**
   * Lists members-only beats
   *
   * Evidence: `apk` — `BeatsService`, `GET beats/members-only-beats`. Response typed from
   * `com.bandlab.common.models.beat.Beat`.
   */
  listMembersOnly(
    query: BeatListMembersOnlyParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<BeatList> {
    return this._client.get('/beats/members-only-beats', { query, ...options });
  }

  /**
   * Lists beats for a promo carousel
   *
   * Evidence: `apk` — `BeatsService`, `GET beats/promo-carousels/{promoCampaignId}`. Response typed
   * from `com.bandlab.common.models.beat.Beat`.
   */
  listPromoCarousel(
    promoCampaignID: string,
    query: BeatListPromoCarouselParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<BeatList> {
    return this._client.get(path`/beats/promo-carousels/${promoCampaignID}`, { query, ...options });
  }

  /**
   * Lists the beats shown in the promo header
   *
   * Evidence: `apk` — `BeatsService`, `GET beats/promo-header-beats`. Response typed from
   * `com.bandlab.common.models.beat.Beat`.
   */
  listPromoHeader(
    query: BeatListPromoHeaderParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<BeatList> {
    return this._client.get('/beats/promo-header-beats', { query, ...options });
  }

  /**
   * Claims a free beat
   *
   * Evidence: `apk` — `BeatsService`, `POST beats/{beatId}/free-claims`. No APK response shape.
   */
  claimFree(beatID: string, body: unknown, options?: RequestOptions): APIPromise<void> {
    return this._client.post(path`/beats/${beatID}/free-claims`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns a beat (experiment namespace)
   *
   * Evidence: `apk` — `BeatsService`, `GET experiment/beats/{beatId}`. Response typed from
   * `com.bandlab.common.models.beat.Beat`.
   */
  retrieve(beatID: string, options?: RequestOptions): APIPromise<Beat> {
    return this._client.get(path`/experiment/beats/${beatID}`, options);
  }

  /**
   * Returns a user's daily free-beat quota
   *
   * Evidence: `apk` — `BeatsQuotaService`, `GET users/{userId}/beats/daily-free-quota`. Response
   * typed from `com.bandlab.beat.api.quota.FreeBeatsQuota`.
   */
  retrieveDailyFreeQuota(userID: string, options?: RequestOptions): APIPromise<FreeBeatsQuota> {
    return this._client.get(path`/users/${userID}/beats/daily-free-quota`, options);
  }

  /**
   * Marks a beat as played for a user
   *
   * Evidence: `apk` — `BeatsService`, `PUT users/{userId}/beats/played/{beatId}`. No APK response
   * shape.
   */
  markPlayed(beatID: string, params: BeatMarkPlayedParams, options?: RequestOptions): APIPromise<void> {
    const { userId, ...body } = params;
    return this._client.put(path`/users/${userId}/beats/played/${beatID}`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns a user's beat preferences
   *
   * Evidence: `apk` — `BeatsService`, `GET users/{userId}/beats/preferences`. Response typed from
   * `com.bandlab.beat.api.UserPreferences`.
   */
  retrievePreferences(userID: string, options?: RequestOptions): APIPromise<BeatUserPreferences> {
    return this._client.get(path`/users/${userID}/beats/preferences`, options);
  }

  /**
   * Lists a user's preferred beats
   *
   * Evidence: `apk` — `BeatsService`, `GET users/{userId}/beats/preferred`. Response typed from
   * `com.bandlab.common.models.beat.Beat`.
   */
  listPreferred(
    userID: string,
    query: BeatListPreferredParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<BeatList> {
    return this._client.get(path`/users/${userID}/beats/preferred`, { query, ...options });
  }

  /**
   * Saves a beat for a user
   *
   * Evidence: `apk` — `BeatsService`, `PUT users/{userId}/beats/saved/{beatId}`. No APK response
   * shape.
   */
  save(beatID: string, params: BeatSaveParams, options?: RequestOptions): APIPromise<void> {
    const { userId, ...body } = params;
    return this._client.put(path`/users/${userId}/beats/saved/${beatID}`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

/**
 * Evidence: `apk` — `com.bandlab.common.models.beat.Beat`.
 */
export interface Beat {
  id?: string;

  creatorName?: string;

  genre?: string;

  genreId?: string;

  bpm?: number;

  audioUrl?: string;

  duration?: number;

  audioPreviewUrl?: string;

  previewDuration?: number;

  picture?: unknown;

  isPurchased?: boolean;

  licenseUrl?: string;

  previewWaveform?: unknown;

  waveform?: unknown;

  key?: string;

  curatedHashtag?: string;

  curatedColor?: string;

  curatorName?: string;

  curatorDescription?: string;

  paymentProviderPriceIds?: unknown;

  sale?: unknown;

  saleLimitation?: unknown;

  backgroundPicture?: unknown;

  isSaved?: boolean;

  sampleId?: string;

  spatialAudioUrl?: string;

  spatialAudioPreviewUrl?: string;

  isMembersOnly?: boolean;

  hasStems?: boolean;

  stemsUrl?: string;

  stemsSamples?: unknown;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.common.models.beat.Beat`.
 */
export interface BeatList {
  data?: Array<Beat>;

  paging?: FollowersAPI.Paging;
}

/**
 * Evidence: `apk` — `com.bandlab.beat.collections.api.BeatsCollection`.
 */
export interface BeatsCollection {
  id?: string;

  picture?: unknown;

  beatsCount?: number;

  beats?: Array<Beat>;

  hasBeatsOnSale?: boolean;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.beat.collections.api.BeatsCollection`.
 */
export interface BeatsCollectionList {
  data?: Array<BeatsCollection>;

  paging?: FollowersAPI.Paging;
}

/**
 * Evidence: `apk` — `com.bandlab.beat.api.quota.FreeBeatsQuota`.
 */
export interface FreeBeatsQuota {
  canClaimPaidBeats?: boolean;

  quotaPopup?: unknown;

  purchasePopupLabel?: string;

  dailyLimitLabel?: string;

  trendingBanner?: unknown;
}

/**
 * Evidence: `apk` — `com.bandlab.beat.api.UserPreferences`.
 */
export interface BeatUserPreferences {
  favorites?: unknown;
}

export interface BeatListParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface BeatListCollectionsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface BeatListFreeParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface BeatListByGenreParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface BeatListLimitedParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface BeatListMembersOnlyParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface BeatListPromoCarouselParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface BeatListPromoHeaderParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface BeatMarkPlayedParams {
  userId: string;

  [key: string]: unknown;
}

export interface BeatListPreferredParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface BeatSaveParams {
  userId: string;

  [key: string]: unknown;
}

export declare namespace Beats {
  export {
    type Beat as Beat,
    type BeatList as BeatList,
    type BeatsCollection as BeatsCollection,
    type BeatsCollectionList as BeatsCollectionList,
    type FreeBeatsQuota as FreeBeatsQuota,
    type BeatUserPreferences as BeatUserPreferences,
    type BeatListParams as BeatListParams,
    type BeatListCollectionsParams as BeatListCollectionsParams,
    type BeatListFreeParams as BeatListFreeParams,
    type BeatListByGenreParams as BeatListByGenreParams,
    type BeatListLimitedParams as BeatListLimitedParams,
    type BeatListMembersOnlyParams as BeatListMembersOnlyParams,
    type BeatListPromoCarouselParams as BeatListPromoCarouselParams,
    type BeatListPromoHeaderParams as BeatListPromoHeaderParams,
    type BeatMarkPlayedParams as BeatMarkPlayedParams,
    type BeatListPreferredParams as BeatListPreferredParams,
    type BeatSaveParams as BeatSaveParams,
  };
}

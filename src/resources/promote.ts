// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Promote extends APIResource {
  /**
   * Returns the beats promo banners
   *
   * Evidence: `apk` — `BeatsTabService`, `GET beats-promo-banners`. Response typed from
   * `com.bandlab.beat.tab.screen.api.BeatsMemPromo`.
   */
  listBeatsPromoBanners(
    query: PromoteListBeatsPromoBannersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<BeatsMemPromoList> {
    return this._client.get('/beats-promo-banners', { query, ...options });
  }

  /**
   * Returns the artist-dashboard opportunity banners
   *
   * Evidence: `apk` — `ArtistDashboardService`, `GET populated-opportunities-banners`. Response typed
   * from `com.bandlab.artist.dashboard.api.OpportunitiesBanner`.
   */
  listOpportunitiesBanners(
    query: PromoteListOpportunitiesBannersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<OpportunitiesBannerList> {
    return this._client.get('/populated-opportunities-banners', { query, ...options });
  }

  /**
   * Returns a user's boost credits
   *
   * Evidence: `apk` — `BoostService`, `GET users/{userId}/boost-credits`. Response typed from
   * `com.bandlab.boost.api.BoostCredits`.
   */
  retrieveBoostCredits(userID: string, options?: RequestOptions): APIPromise<BoostCredits> {
    return this._client.get(path`/users/${userID}/boost-credits`, options);
  }

  /**
   * Returns the fan-reach state of a fan
   *
   * Evidence: `apk` — `FanReachService`, `GET users/{userId}/fan-reach/fans/{initiatorId}`. Response
   * typed from `com.bandlab.artist.fan.reach.api.SubscriberState`.
   */
  retrieveFanReach(
    initiatorID: string,
    params: PromoteRetrieveFanReachParams,
    options?: RequestOptions,
  ): APIPromise<SubscriberState> {
    const { userId } = params;
    return this._client.get(path`/users/${userId}/fan-reach/fans/${initiatorID}`, options);
  }

  /**
   * Returns the Tipalti payout balance
   *
   * Evidence: `apk` — `PayoutService`, `GET users/{userId}/payout-methods/tipalti/balance`. No APK
   * response shape.
   */
  retrievePayoutBalance(userID: string, options?: RequestOptions): APIPromise<unknown> {
    return this._client.get(path`/users/${userID}/payout-methods/tipalti/balance`, options);
  }

  /**
   * Returns whether a payout method is required
   *
   * Evidence: `apk` — `PayoutService`, `GET users/{userId}/payout/method-required`. Response typed
   * from `com.bandlab.payments.api.UserPayoutMethodRequired`.
   */
  retrievePayoutMethodRequired(
    userID: string,
    options?: RequestOptions,
  ): APIPromise<UserPayoutMethodRequired> {
    return this._client.get(path`/users/${userID}/payout/method-required`, options);
  }

  /**
   * Returns a user's sound-pack promos
   *
   * Evidence: `apk` — `SoundsPromoService`, `GET users/{userId}/promo`. Response typed from
   * `com.bandlab.mixeditor.library.sounds.promo.impl.service.PackSectionsDto`.
   */
  retrievePromo(
    userID: string,
    query: PromoteRetrievePromoParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PackSectionsDto> {
    return this._client.get(path`/users/${userID}/promo`, { query, ...options });
  }

  /**
   * Returns a user's FX promo campaigns
   *
   * Evidence: `apk` — `PresetsPromoService`, `GET users/{userId}/promo-campaigns`. Response typed
   * from `com.bandlab.mixeditor.presets.services.FxPromoCampaign`.
   */
  listPromoCampaigns(
    userID: string,
    query: PromoteListPromoCampaignsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<FxPromoCampaignList> {
    return this._client.get(path`/users/${userID}/promo-campaigns`, { query, ...options });
  }

  /**
   * Returns the beats-carousel promo campaigns
   *
   * Evidence: `apk` — `BeatsPromoService`, `GET users/{userId}/promo-campaigns?type=BeatsCarousel`.
   * Response typed from `com.bandlab.beat.api.AvailablePromoCarousel`.
   */
  listBeatsCarouselCampaigns(
    userID: string,
    options?: RequestOptions,
  ): APIPromise<AvailablePromoCarouselList> {
    return this._client.get(path`/users/${userID}/promo-campaigns`, {
      query: { type: 'BeatsCarousel' },
      ...options,
    });
  }
}

/**
 * Evidence: `apk` — `com.bandlab.beat.tab.screen.api.BeatsMemPromo`.
 */
export interface BeatsMemPromo {
  id?: string;

  position?: number;

  promoCampaignId?: string;

  title?: string;

  subtitle?: string;

  buttonTitle?: string;

  pictureUrl?: string;

  pictureFallbackUrl?: string;

  paywall?: unknown;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.beat.tab.screen.api.BeatsMemPromo`.
 */
export interface BeatsMemPromoList {
  data?: Array<BeatsMemPromo>;

  paging?: unknown;
}

/**
 * Evidence: `apk` — `com.bandlab.artist.dashboard.api.OpportunitiesBanner`.
 */
export interface OpportunitiesBanner {
  id?: string;

  title?: string;

  link?: string;

  picture?: unknown;
}

/**
 * Evidence: `apk` — paged wrapper around
 * `com.bandlab.artist.dashboard.api.OpportunitiesBanner`.
 */
export interface OpportunitiesBannerList {
  data?: Array<OpportunitiesBanner>;

  paging?: unknown;
}

/**
 * Evidence: `apk` — `com.bandlab.boost.api.BoostCredits`.
 */
export interface BoostCredits {
  creditsCount?: number;

  isCreditsSupported?: boolean;

  isTierUpgradable?: boolean;
}

/**
 * Evidence: `apk` — `com.bandlab.artist.fan.reach.api.SubscriberState`.
 */
export interface SubscriberState {
  isFan?: boolean;

  permissions?: unknown;
}

/**
 * Evidence: `apk` — `com.bandlab.payments.api.UserPayoutMethodRequired`.
 */
export interface UserPayoutMethodRequired {
  status?: string;

  payoutMethod?: unknown;
}

/**
 * Evidence: `apk` — `com.bandlab.mixeditor.library.sounds.promo.impl.service.PackSectionsDto`.
 */
export interface PackSectionsDto {
  data?: unknown;
}

/**
 * Evidence: `apk` — `com.bandlab.mixeditor.presets.services.FxPromoCampaign`.
 */
export interface FxPromoCampaign {
  id?: string;

  fxPresets?: unknown;
}

/**
 * Evidence: `apk` — paged wrapper around
 * `com.bandlab.mixeditor.presets.services.FxPromoCampaign`.
 */
export interface FxPromoCampaignList {
  data?: Array<FxPromoCampaign>;

  paging?: unknown;
}

/**
 * Evidence: `apk` — `com.bandlab.beat.api.AvailablePromoCarousel`.
 */
export interface AvailablePromoCarousel {
  id?: string;

  beatsCarousel?: unknown;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.beat.api.AvailablePromoCarousel`.
 */
export interface AvailablePromoCarouselList {
  data?: Array<AvailablePromoCarousel>;

  paging?: unknown;
}

export interface PromoteListBeatsPromoBannersParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface PromoteListOpportunitiesBannersParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface PromoteRetrieveFanReachParams {
  userId: string;
}

export interface PromoteRetrievePromoParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface PromoteListPromoCampaignsParams {
  type?: string;
}

export declare namespace Promote {
  export {
    type BeatsMemPromo as BeatsMemPromo,
    type BeatsMemPromoList as BeatsMemPromoList,
    type OpportunitiesBanner as OpportunitiesBanner,
    type OpportunitiesBannerList as OpportunitiesBannerList,
    type BoostCredits as BoostCredits,
    type SubscriberState as SubscriberState,
    type UserPayoutMethodRequired as UserPayoutMethodRequired,
    type PackSectionsDto as PackSectionsDto,
    type FxPromoCampaign as FxPromoCampaign,
    type FxPromoCampaignList as FxPromoCampaignList,
    type AvailablePromoCarousel as AvailablePromoCarousel,
    type AvailablePromoCarouselList as AvailablePromoCarouselList,
    type PromoteListBeatsPromoBannersParams as PromoteListBeatsPromoBannersParams,
    type PromoteListOpportunitiesBannersParams as PromoteListOpportunitiesBannersParams,
    type PromoteRetrieveFanReachParams as PromoteRetrieveFanReachParams,
    type PromoteRetrievePromoParams as PromoteRetrievePromoParams,
    type PromoteListPromoCampaignsParams as PromoteListPromoCampaignsParams,
  };
}

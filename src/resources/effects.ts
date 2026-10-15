// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as MeAPI from './me';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Effects extends APIResource {
  /**
   * Returns an unsaved effect preset by link token
   *
   * Evidence: `apk` — `UnsavedPresetService`, `GET effect-presets/{linkToken}`. Response typed
   * from `com.bandlab.mixeditor.presets.effects.domain.api.preset.UnSavedPreset`.
   */
  retrievePresetByLink(linkToken: string, options?: RequestOptions): APIPromise<UnSavedPreset> {
    return this._client.get(path`/effect-presets/${linkToken}`, options);
  }

  /**
   * Creates a saved effect preset
   *
   * Evidence: `apk` — `SavedPresetsService`, `POST users/{userId}/effect-presets`. Response
   * typed from `com.bandlab.mixeditor.presets.effects.domain.api.preset.SavedPreset`.
   */
  createPreset(userID: string, body: unknown, options?: RequestOptions): APIPromise<SavedPreset> {
    return this._client.post(path`/users/${userID}/effect-presets`, { body, ...options });
  }

  /**
   * Updates a saved effect preset
   *
   * Evidence: `apk` — `SavedPresetsService`, `PATCH users/{userId}/effect-presets/{presetId}`.
   * Response typed from `com.bandlab.mixeditor.presets.effects.domain.api.preset.SavedPreset`.
   */
  updatePreset(
    presetID: string,
    params: EffectUpdatePresetParams,
    options?: RequestOptions,
  ): APIPromise<SavedPreset> {
    const { userId, body } = params;
    return this._client.patch(path`/users/${userId}/effect-presets/${presetID}`, { body, ...options });
  }

  /**
   * Removes the share link from a saved effect preset
   *
   * Evidence: `apk` — `SharedPresetsService`,
   * `DELETE users/{userId}/effect-presets/{presetId}/link`. Response typed from
   * `com.bandlab.mixeditor.presets.effects.domain.api.preset.SavedPreset`.
   */
  deletePresetLink(
    presetID: string,
    params: EffectDeletePresetLinkParams,
    options?: RequestOptions,
  ): APIPromise<SavedPreset> {
    const { userId } = params;
    return this._client.delete(path`/users/${userId}/effect-presets/${presetID}/link`, options);
  }

  /**
   * Returns a promo campaign's effect preset content
   *
   * Evidence: `apk` — `FxPromoPresetsService`,
   * `GET users/{userId}/effect-presets/promo-campaigns/{campaignId}/content`. Response typed
   * from `com.bandlab.mixeditor.presets.effects.domain.api.preset.RemotePreset`.
   */
  retrievePromoPreset(
    campaignID: string,
    params: EffectRetrievePromoPresetParams,
    options?: RequestOptions,
  ): APIPromise<RemotePreset> {
    const { userId } = params;
    return this._client.get(
      path`/users/${userId}/effect-presets/promo-campaigns/${campaignID}/content`,
      options,
    );
  }

  /**
   * Returns the user's trending effect presets
   *
   * Evidence: `apk` — `TrendingPresetsService`, `GET users/{userId}/trending-effect-presets`.
   * The response element is
   * `com.bandlab.mixeditor.presets.effects.domain.api.preset.RemotePreset`.
   */
  listTrendingPresets(
    userID: string,
    query: EffectListTrendingPresetsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<RemotePresetList> {
    return this._client.get(path`/users/${userID}/trending-effect-presets`, { query, ...options });
  }

  /**
   * Returns the user's favorite effect ids
   *
   * Evidence: `apk` — `FavoriteEffectsService`, `GET users/{userId}/favorite-effect-ids`. The
   * response element is `com.bandlab.mixeditor.presets.services.FavoriteEffectResponse`.
   */
  listFavoriteEffects(
    userID: string,
    query: EffectListFavoriteEffectsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<FavoriteEffectList> {
    return this._client.get(path`/users/${userID}/favorite-effect-ids`, { query, ...options });
  }

  /**
   * Adds an effect to the user's favorites
   *
   * Evidence: `apk` — `FavoriteEffectsService`, `POST users/{userId}/favorite-effect-ids/{effectId}`.
   */
  addFavoriteEffect(userID: string, effectID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.post(path`/users/${userID}/favorite-effect-ids/${effectID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns the user's favorite effect preset ids
   *
   * Evidence: `apk` — `FavoritePresetsService`, `GET users/{userId}/favorite-effect-presets-ids`.
   * The app gives no response shape for this path, so it is `unknown` under rule D12.
   */
  listFavoritePresets(
    userID: string,
    query: EffectListFavoritePresetsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<unknown> {
    return this._client.get(path`/users/${userID}/favorite-effect-presets-ids`, { query, ...options });
  }

  /**
   * Adds an effect preset to the user's favorites
   *
   * Evidence: `apk` — `FavoritePresetsService`,
   * `POST users/{userId}/favorite-effect-presets-ids/{presetId}`.
   */
  addFavoritePreset(userID: string, presetID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.post(path`/users/${userID}/favorite-effect-presets-ids/${presetID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

/**
 * Evidence: `apk` —
 * `com.bandlab.mixeditor.presets.effects.domain.api.preset.UnSavedPreset`.
 */
export interface UnSavedPreset {
  id?: string;

  attributors?: Array<PresetAttributor>;

  displayName?: string;

  effects?: Array<unknown>;

  link?: unknown;

  modifiedOn?: string;

  originalPresetId?: string;

  picture?: MeAPI.Picture;

  savedFromPresetId?: string;
}

/**
 * Evidence: `apk` —
 * `com.bandlab.mixeditor.presets.effects.domain.api.preset.SavedPreset`.
 */
export interface SavedPreset {
  id?: string;

  attributors?: Array<PresetAttributor>;

  displayName?: string;

  effects?: Array<unknown>;

  link?: unknown;

  modifiedOn?: string;

  originalPresetId?: string;

  picture?: MeAPI.Picture;

  savedFromPresetId?: string;
}

/**
 * Evidence: `apk` —
 * `com.bandlab.mixeditor.presets.effects.domain.api.preset.RemotePreset`.
 */
export interface RemotePreset {
  id?: string;

  attributors?: Array<PresetAttributor>;

  displayName?: string;

  effects?: Array<unknown>;

  isNew?: boolean;

  link?: unknown;

  modifiedOn?: string;

  originalPresetId?: string;

  picture?: MeAPI.Picture;

  savedFromPresetId?: string;

  savedPresetId?: string;
}

/**
 * Evidence: `apk` —
 * `com.bandlab.mixeditor.presets.effects.domain.api.preset.PresetAttributor`.
 */
export interface PresetAttributor {
  timeStamp?: string;

  userId?: string;

  username?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.mixeditor.presets.services.FavoriteEffectResponse`.
 */
export interface FavoriteEffect {
  id?: string;

  favoritedOn?: string;
}

/**
 * Evidence: `apk` — paged wrapper around
 * `com.bandlab.mixeditor.presets.effects.domain.api.preset.RemotePreset`.
 */
export interface RemotePresetList {
  data?: Array<RemotePreset>;

  paging?: unknown;
}

/**
 * Evidence: `apk` — paged wrapper around
 * `com.bandlab.mixeditor.presets.services.FavoriteEffectResponse`.
 */
export interface FavoriteEffectList {
  data?: Array<FavoriteEffect>;

  paging?: unknown;
}

export interface EffectUpdatePresetParams {
  userId: string;

  body: unknown;
}

export interface EffectDeletePresetLinkParams {
  userId: string;
}

export interface EffectRetrievePromoPresetParams {
  userId: string;
}

export interface EffectListTrendingPresetsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface EffectListFavoriteEffectsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface EffectListFavoritePresetsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export declare namespace Effects {
  export {
    type EffectDeletePresetLinkParams as EffectDeletePresetLinkParams,
    type EffectListFavoriteEffectsParams as EffectListFavoriteEffectsParams,
    type EffectListFavoritePresetsParams as EffectListFavoritePresetsParams,
    type EffectListTrendingPresetsParams as EffectListTrendingPresetsParams,
    type EffectRetrievePromoPresetParams as EffectRetrievePromoPresetParams,
    type EffectUpdatePresetParams as EffectUpdatePresetParams,
    type FavoriteEffect as FavoriteEffect,
    type FavoriteEffectList as FavoriteEffectList,
    type PresetAttributor as PresetAttributor,
    type RemotePreset as RemotePreset,
    type RemotePresetList as RemotePresetList,
    type SavedPreset as SavedPreset,
    type UnSavedPreset as UnSavedPreset,
  };
}

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as GenresAPI from './genres';
import * as SkillsAPI from './skills';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Me extends APIResource {
  /**
   * Returns a profile of current user
   *
   * @example
   * ```ts
   * const profile = await client.me.retrieve();
   * ```
   */
  retrieve(options?: RequestOptions): APIPromise<Profile> {
    return this._client.get('/me', options);
  }

  /**
   * Updates a profile of current user
   *
   * @example
   * ```ts
   * const profile = await client.me.update();
   * ```
   */
  update(body: MeUpdateParams, options?: RequestOptions): APIPromise<Profile> {
    return this._client.patch('/me', { body, ...options });
  }

  /**
   * Records marketing consent for the current user
   *
   * Evidence: `apk` — `MeService`, `POST marketing-consent`. No APK response shape.
   */
  createMarketingConsent(body: unknown, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/marketing-consent', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns the current user's first-time UX flags
   *
   * Evidence: `apk` — `MeService`, `GET me/ftue`. Response typed from
   * `com.bandlab.user.models.FirstTimeUXFlags`.
   */
  retrieveFtue(options?: RequestOptions): APIPromise<FirstTimeUXFlags> {
    return this._client.get('/me/ftue', options);
  }

  /**
   * Marks the "set inspired by" first-time UX step as done
   *
   * Evidence: `apk` — `MeService`, `POST me/ftue/set-inspired-by`. No APK response shape.
   */
  setFtueInspiredBy(body: unknown, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/me/ftue/set-inspired-by', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Marks the "used studio" first-time UX step as done
   *
   * Evidence: `apk` — `MeService`, `POST me/ftue/used-studio`. No APK response shape.
   */
  setFtueUsedStudio(body: unknown, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/me/ftue/used-studio', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Records parental consent for the current user
   *
   * Evidence: `apk` — `MeService`, `POST parental-consent`. No APK response shape.
   */
  createParentalConsent(body: unknown, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/parental-consent', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Sends an activity-status heartbeat for the current user
   *
   * Evidence: `apk` — `ActivityStatusService`, `POST users/me/activity-status/heartbeat`. No APK
   * response shape.
   */
  sendActivityHeartbeat(body: unknown, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/users/me/activity-status/heartbeat', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns a user's activity status
   *
   * Evidence: `apk` — `ActivityStatusService`, `GET users/{id}/activity-status`. Response typed
   * from `com.bandlab.common.models.ActivityStatus`.
   */
  retrieveActivityStatus(userID: string, options?: RequestOptions): APIPromise<ActivityStatus> {
    return this._client.get(path`/users/${userID}/activity-status`, options);
  }

  /**
   * Returns the profile-views privacy setting
   *
   * Evidence: `apk` — `ProfileViewersService`, `GET users/{id}/settings/privacy/profile-views`.
   * Response typed from `com.bandlab.user.profile.viewers.api.ProfileIncognitoStatusResponse`.
   */
  retrieveProfileViewsPrivacy(
    userID: string,
    options?: RequestOptions,
  ): APIPromise<ProfileIncognitoStatusResponse> {
    return this._client.get(path`/users/${userID}/settings/privacy/profile-views`, options);
  }

  /**
   * Returns a user's warnings
   *
   * Evidence: `apk` — `UserWarningsService`, `GET users/{id}/warnings`. Response typed from
   * `com.bandlab.user.models.UserWarnings`.
   */
  listWarnings(userID: string, options?: RequestOptions): APIPromise<UserWarnings> {
    return this._client.get(path`/users/${userID}/warnings`, options);
  }

  /**
   * Updates a user warning
   *
   * Evidence: `apk` — `UserWarningsService`, `PATCH users/{user_id}/warnings/{id}`. No APK response
   * shape.
   */
  updateWarning(
    warningID: string,
    params: MeUpdateWarningParams,
    options?: RequestOptions,
  ): APIPromise<void> {
    const { user_id, ...body } = params;
    return this._client.patch(path`/users/${user_id}/warnings/${warningID}`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns a user's verified submission
   *
   * Evidence: `apk` — `BlVerifiedService`, `GET users/{userId}/verified/submission`. Response typed
   * from `com.bandlab.bl.verified.api.model.BlVerifiedResponse`.
   */
  retrieveVerifiedSubmission(userID: string, options?: RequestOptions): APIPromise<BlVerifiedResponse> {
    return this._client.get(path`/users/${userID}/verified/submission`, options);
  }
}

/**
 * Evidence: `apk` — `com.bandlab.user.models.FirstTimeUXFlags`.
 */
export interface FirstTimeUXFlags {
  confirmedEmail?: boolean;

  createdSong?: boolean;

  createdBand?: boolean;

  setPicture?: boolean;

  setCustomUsername?: boolean;

  setSkills?: boolean;

  setGenres?: boolean;

  setInspiredBy?: boolean;

  usedStudio?: boolean;
}

/**
 * Evidence: `apk` — `com.bandlab.common.models.ActivityStatus`.
 */
export interface ActivityStatus {
  userId?: string;

  activityStatus?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.user.profile.viewers.api.ProfileIncognitoStatusResponse`.
 */
export interface ProfileIncognitoStatusResponse {
  isIncognitoEnabled?: boolean;
}

/**
 * Evidence: `apk` — `com.bandlab.user.models.UserWarnings`.
 */
export interface UserWarnings {
  newWarningsCount?: number;

  userWarnings?: unknown;
}

/**
 * Evidence: `apk` — `com.bandlab.bl.verified.api.model.BlVerifiedResponse`.
 */
export interface BlVerifiedResponse {
  artistName?: string;

  category?: string;

  legalName?: string;

  status?: string;

  userName?: string;
}

export interface MeUpdateWarningParams {
  user_id: string;

  [key: string]: unknown;
}

export interface GeoCoordinate {
  latitude?: number;

  longitude?: number;
}

export interface Location {
  city?: string;

  Coordinates?: GeoCoordinate;

  country?: string;
}

export interface Picture {
  isDefault?: boolean;

  l?: string;

  m?: string;

  s?: string;

  url?: string;
}

export interface Profile {
  id?: string;

  about?: string;

  badges?: Array<string>;

  birthday?: string;

  counters?: UserCounters;

  createdOn?: string;

  email?: string;

  ftue?: Profile.Ftue;

  gender?: 'Male' | 'Female' | 'Other';

  genres?: Array<GenresAPI.Genre>;

  hasPassword?: boolean;

  isBetaUser?: boolean;

  isEmailConfirmed?: boolean;

  isNewbie?: boolean;

  isSocial?: boolean;

  isTippable?: boolean;

  isVerified?: boolean;

  location?: Location;

  name?: string;

  picture?: Picture;

  skills?: Array<SkillsAPI.Skill>;

  username?: string;
}

export namespace Profile {
  export interface Ftue {
    confirmedEmail?: boolean;

    createdBand?: boolean;

    createdSong?: boolean;

    setCustomUsername?: boolean;

    setGenres?: boolean;

    setPicture?: boolean;

    setSkills?: boolean;
  }
}

export interface UserCounters {
  bands?: number;

  collections?: number;

  followers?: number;

  following?: number;
}

export interface MeUpdateParams {
  id?: string;

  about?: string;

  badges?: Array<string>;

  birthday?: string;

  counters?: UserCounters;

  createdOn?: string;

  email?: string;

  ftue?: MeUpdateParams.Ftue;

  gender?: 'Male' | 'Female' | 'Other';

  genres?: Array<GenresAPI.Genre>;

  hasPassword?: boolean;

  isBetaUser?: boolean;

  isEmailConfirmed?: boolean;

  isNewbie?: boolean;

  isSocial?: boolean;

  isTippable?: boolean;

  isVerified?: boolean;

  location?: Location;

  name?: string;

  picture?: Picture;

  skills?: Array<SkillsAPI.Skill>;

  username?: string;
}

export namespace MeUpdateParams {
  export interface Ftue {
    confirmedEmail?: boolean;

    createdBand?: boolean;

    createdSong?: boolean;

    setCustomUsername?: boolean;

    setGenres?: boolean;

    setPicture?: boolean;

    setSkills?: boolean;
  }
}

export declare namespace Me {
  export {
    type GeoCoordinate as GeoCoordinate,
    type Location as Location,
    type Picture as Picture,
    type Profile as Profile,
    type UserCounters as UserCounters,
    type MeUpdateParams as MeUpdateParams,
    type FirstTimeUXFlags as FirstTimeUXFlags,
    type ActivityStatus as ActivityStatus,
    type ProfileIncognitoStatusResponse as ProfileIncognitoStatusResponse,
    type UserWarnings as UserWarnings,
    type BlVerifiedResponse as BlVerifiedResponse,
    type MeUpdateWarningParams as MeUpdateWarningParams,
  };
}

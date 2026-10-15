// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as FollowersAPI from './users/followers';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Distro extends APIResource {
  /**
   * Returns a user's distribution overview
   *
   * Evidence: `apk` — `DistroService`, `GET users/{userId}/distro`. No APK response shape.
   */
  retrieveOverview(userID: string, options?: RequestOptions): APIPromise<unknown> {
    return this._client.get(path`/users/${userID}/distro`, options);
  }

  /**
   * Lists a user's AI-generated covers
   *
   * Evidence: `apk` — `DistroAiCoverService`, `GET users/{userId}/distro/ai-covers`. Response typed
   * from `com.bandlab.distro.generate.cover.api.models.AiGalleryItem`.
   */
  listAiCovers(
    userID: string,
    query: DistroListAiCoversParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<AiGalleryItemList> {
    return this._client.get(path`/users/${userID}/distro/ai-covers`, { query, ...options });
  }

  /**
   * Returns a user's distro artist profiles
   *
   * Evidence: `apk` — `DistroService`, `GET users/{userId}/distro/artist-profiles`. Response typed
   * from `com.bandlab.distro.api.models.ArtistProfiles`.
   */
  retrieveArtistProfiles(userID: string, options?: RequestOptions): APIPromise<ArtistProfiles> {
    return this._client.get(path`/users/${userID}/distro/artist-profiles`, options);
  }

  /**
   * Returns the distro release form options
   *
   * Evidence: `apk` — `DistroService`, `GET users/{userId}/distro/form-options`. Response typed from
   * `com.bandlab.distro.api.models.FormOptions`.
   */
  retrieveFormOptions(userID: string, options?: RequestOptions): APIPromise<FormOptions> {
    return this._client.get(path`/users/${userID}/distro/form-options`, options);
  }

  /**
   * Lists a user's distro projects
   *
   * Evidence: `apk` — `DistroService`, `GET users/{userId}/distro/projects`. Response typed from
   * `com.bandlab.distro.api.models.DistroProject`.
   */
  listProjects(
    userID: string,
    query: DistroListProjectsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<DistroProjectList> {
    return this._client.get(path`/users/${userID}/distro/projects`, { query, ...options });
  }

  /**
   * Returns a user's distro quotas
   *
   * Evidence: `apk` — `DistroService`, `GET users/{userId}/distro/quotas`. Response typed from
   * `com.bandlab.distro.api.models.DistroQuotas`.
   */
  retrieveQuotas(userID: string, options?: RequestOptions): APIPromise<DistroQuotas> {
    return this._client.get(path`/users/${userID}/distro/quotas`, options);
  }

  /**
   * Creates a distro release
   *
   * Evidence: `apk` — `DistroService`, `POST users/{userId}/distro/releases`. Response typed from
   * `com.bandlab.distro.api.models.CreateReleaseDetailsResponse`.
   */
  createRelease(
    userID: string,
    body: unknown,
    options?: RequestOptions,
  ): APIPromise<CreateReleaseDetailsResponse> {
    return this._client.post(path`/users/${userID}/distro/releases`, { body, ...options });
  }

  /**
   * Returns a distro release
   *
   * Evidence: `apk` — `DistroService`, `GET users/{userId}/distro/releases/{releaseId}`. Response
   * typed from `com.bandlab.distro.api.models.ReleaseDetails`.
   */
  retrieveRelease(
    releaseID: string,
    params: DistroRetrieveReleaseParams,
    options?: RequestOptions,
  ): APIPromise<ReleaseDetails> {
    const { userId } = params;
    return this._client.get(path`/users/${userId}/distro/releases/${releaseID}`, options);
  }

  /**
   * Generates AI covers for a release
   *
   * Evidence: `apk` — `DistroAiCoverService`,
   * `POST users/{userId}/distro/releases/{releaseId}/ai-covers`. Response typed from
   * `com.bandlab.distro.generate.cover.api.models.GenerateCoversResponse`.
   */
  generateAiCovers(
    releaseID: string,
    params: DistroGenerateAiCoversParams,
    options?: RequestOptions,
  ): APIPromise<GenerateCoversResponse> {
    const { userId, ...body } = params;
    return this._client.post(path`/users/${userId}/distro/releases/${releaseID}/ai-covers`, {
      body,
      ...options,
    });
  }

  /**
   * Selects an AI cover for a release
   *
   * Evidence: `apk` — `DistroAiCoverService`,
   * `POST users/{userId}/distro/releases/{releaseId}/ai-covers/{pictureId}`. No APK response shape.
   */
  selectAiCover(
    pictureID: string,
    params: DistroSelectAiCoverParams,
    options?: RequestOptions,
  ): APIPromise<void> {
    const { userId, releaseId, ...body } = params;
    return this._client.post(path`/users/${userId}/distro/releases/${releaseId}/ai-covers/${pictureID}`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Updates a release cover art
   *
   * Evidence: `apk` — `DistroService`, `PUT users/{userId}/distro/releases/{releaseId}/cover-art`.
   * Response typed from `com.bandlab.distro.api.models.UpdateReleaseCoverArtResponse`.
   */
  updateCoverArt(
    releaseID: string,
    params: DistroUpdateCoverArtParams,
    options?: RequestOptions,
  ): APIPromise<UpdateReleaseCoverArtResponse> {
    const { userId, ...body } = params;
    return this._client.put(path`/users/${userId}/distro/releases/${releaseID}/cover-art`, {
      body,
      ...options,
    });
  }

  /**
   * Updates the songs on a release
   *
   * Evidence: `apk` — `DistroService`, `PUT users/{userId}/distro/releases/{releaseId}/songs`.
   * Response typed from `com.bandlab.distro.api.models.UpdatedReleaseSongs`.
   */
  updateSongs(
    releaseID: string,
    params: DistroUpdateSongsParams,
    options?: RequestOptions,
  ): APIPromise<UpdatedReleaseSongs> {
    const { userId, ...body } = params;
    return this._client.put(path`/users/${userId}/distro/releases/${releaseID}/songs`, {
      body,
      ...options,
    });
  }

  /**
   * Updates a release state
   *
   * Evidence: `apk` — `DistroService`, `PUT users/{userId}/distro/releases/{releaseId}/state`. No
   * APK response shape.
   */
  updateReleaseState(
    releaseID: string,
    params: DistroUpdateReleaseStateParams,
    options?: RequestOptions,
  ): APIPromise<void> {
    const { userId, ...body } = params;
    return this._client.put(path`/users/${userId}/distro/releases/${releaseID}/state`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns a user's distro revisions
   *
   * Evidence: `apk` — `DistroService`, `GET users/{userId}/distro/revisions`. Response typed from
   * `com.bandlab.distro.api.models.UserRevisions`.
   */
  listRevisions(userID: string, options?: RequestOptions): APIPromise<UserRevisions> {
    return this._client.get(path`/users/${userID}/distro/revisions`, options);
  }

  /**
   * Initiates a distro upload
   *
   * Evidence: `apk` — `DistroService`, `POST users/{userId}/distro/uploads`. Response typed from
   * `com.bandlab.distro.api.models.InitiateUploadResponse`.
   */
  createUpload(userID: string, body: unknown, options?: RequestOptions): APIPromise<InitiateUploadResponse> {
    return this._client.post(path`/users/${userID}/distro/uploads`, { body, ...options });
  }
}

/**
 * Evidence: `apk` — `com.bandlab.distro.generate.cover.api.models.AiGalleryItem`.
 */
export interface AiGalleryItem {
  id?: string;

  releaseId?: string;

  picture?: unknown;
}

/**
 * Evidence: `apk` — paged wrapper around
 * `com.bandlab.distro.generate.cover.api.models.AiGalleryItem`.
 */
export interface AiGalleryItemList {
  data?: Array<AiGalleryItem>;

  paging?: FollowersAPI.Paging;
}

/**
 * Evidence: `apk` — `com.bandlab.distro.api.models.ArtistProfiles`.
 */
export interface ArtistProfiles {
  artist?: unknown;
}

/**
 * Evidence: `apk` — `com.bandlab.distro.api.models.FormOptions`.
 */
export interface FormOptions {
  contributorRoles?: unknown;

  coverArtStyles?: unknown;

  genres?: unknown;

  instruments?: unknown;

  productionRoles?: unknown;

  availableReleaseDates?: unknown;

  versionTypes?: unknown;
}

/**
 * Evidence: `apk` — `com.bandlab.distro.api.models.DistroProject`.
 */
export interface DistroProject {
  title?: string;

  isPublic?: boolean;

  isFork?: boolean;

  hasCollaborators?: boolean;

  creator?: unknown;

  picture?: unknown;

  revision?: unknown;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.distro.api.models.DistroProject`.
 */
export interface DistroProjectList {
  data?: Array<DistroProject>;

  paging?: FollowersAPI.Paging;
}

/**
 * Evidence: `apk` — `com.bandlab.distro.api.models.DistroQuotas`.
 */
export interface DistroQuotas {
  createAiCover?: unknown;
}

/**
 * Evidence: `apk` — `com.bandlab.distro.api.models.CreateReleaseDetailsResponse`.
 */
export interface CreateReleaseDetailsResponse {
  id?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.distro.api.models.ReleaseDetails`.
 */
export interface ReleaseDetails {
  releaseId?: string;

  artist?: unknown;

  assets?: unknown;

  attachments?: unknown;

  genre?: unknown;

  label?: unknown;

  picture?: unknown;

  hasAiCover?: boolean;

  aiCoversGeneratedCount?: number;

  releaseDate?: string;

  releaseTitle?: string;

  version?: string;

  state?: string;

  upc?: string;

  errors?: unknown;

  rejectedReasons?: unknown;

  coverArtViolations?: unknown;

  isEditable?: boolean;

  type?: string;

  liveLinks?: unknown;

  hasScheduledReleaseDate?: boolean;

  useFreeSlot?: boolean;

  hasFreeDistributionSlot?: boolean;

  acknowledgements?: unknown;

  originalReleaseDate?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.distro.generate.cover.api.models.GenerateCoversResponse`.
 */
export interface GenerateCoversResponse {
  releaseId?: string;

  covers?: unknown;
}

/**
 * Evidence: `apk` — `com.bandlab.distro.api.models.UpdateReleaseCoverArtResponse`.
 */
export interface UpdateReleaseCoverArtResponse {
  picture?: unknown;

  upscaledPicture?: unknown;

  upscaleAttemptsLeft?: number;

  coverArtViolations?: unknown;
}

/**
 * Evidence: `apk` — `com.bandlab.distro.api.models.UpdatedReleaseSongs`.
 */
export interface UpdatedReleaseSongs {
  id?: string;

  type?: string;

  version?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.distro.api.models.UserRevisions`.
 */
export interface UserRevisions {
  revisionId?: string;

  hasFreeDistributionSlot?: boolean;

  freeDistributionSlotSource?: string;

  releases?: unknown;
}

/**
 * Evidence: `apk` — `com.bandlab.distro.api.models.InitiateUploadResponse`.
 */
export interface InitiateUploadResponse {
  files?: unknown;
}

export interface DistroListAiCoversParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface DistroListProjectsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface DistroRetrieveReleaseParams {
  userId: string;
}

export interface DistroGenerateAiCoversParams {
  userId: string;

  [key: string]: unknown;
}

export interface DistroSelectAiCoverParams {
  userId: string;

  releaseId: string;

  [key: string]: unknown;
}

export interface DistroUpdateCoverArtParams {
  userId: string;

  [key: string]: unknown;
}

export interface DistroUpdateSongsParams {
  userId: string;

  [key: string]: unknown;
}

export interface DistroUpdateReleaseStateParams {
  userId: string;

  [key: string]: unknown;
}

export declare namespace Distro {
  export {
    type AiGalleryItem as AiGalleryItem,
    type AiGalleryItemList as AiGalleryItemList,
    type ArtistProfiles as ArtistProfiles,
    type FormOptions as FormOptions,
    type DistroProject as DistroProject,
    type DistroProjectList as DistroProjectList,
    type DistroQuotas as DistroQuotas,
    type CreateReleaseDetailsResponse as CreateReleaseDetailsResponse,
    type ReleaseDetails as ReleaseDetails,
    type GenerateCoversResponse as GenerateCoversResponse,
    type UpdateReleaseCoverArtResponse as UpdateReleaseCoverArtResponse,
    type UpdatedReleaseSongs as UpdatedReleaseSongs,
    type UserRevisions as UserRevisions,
    type InitiateUploadResponse as InitiateUploadResponse,
    type DistroListAiCoversParams as DistroListAiCoversParams,
    type DistroListProjectsParams as DistroListProjectsParams,
    type DistroRetrieveReleaseParams as DistroRetrieveReleaseParams,
    type DistroGenerateAiCoversParams as DistroGenerateAiCoversParams,
    type DistroSelectAiCoverParams as DistroSelectAiCoverParams,
    type DistroUpdateCoverArtParams as DistroUpdateCoverArtParams,
    type DistroUpdateSongsParams as DistroUpdateSongsParams,
    type DistroUpdateReleaseStateParams as DistroUpdateReleaseStateParams,
  };
}

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as RevisionsAPI from '../revisions';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Sounds extends APIResource {
  /**
   * Starts a stem separation task
   *
   * Evidence: `apk` — `SplitterApi`, `POST /v4/separation`. Response typed from
   * `com.bandlab.tools.splitter.screen.api.SeparationStatusResponse`.
   */
  createSeparation(body: unknown, options?: RequestOptions): APIPromise<SeparationStatusResponse> {
    return this._client.post('/v4/separation', { body, ...options });
  }

  /**
   * Returns the palette instruments
   *
   * Evidence: `apk` — `PaletteService`, `GET instruments`. The response element is
   * `com.bandlab.mixeditor.palette.impl.model.PaletteInstrument`.
   */
  listInstruments(
    query: SoundListInstrumentsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PaletteInstrumentList> {
    return this._client.get('/instruments', { query, ...options });
  }

  /**
   * Returns loop matches
   *
   * Evidence: `apk` — `LoopMatchesService`, `GET loops/matches`. The response element is
   * `com.bandlab.sounds.rest.model.LoopMatchDto`.
   */
  listLoopMatches(
    query: SoundListLoopMatchesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<LoopMatchList> {
    return this._client.get('/loops/matches', { query, ...options });
  }

  /**
   * Returns loop packs
   *
   * Evidence: `apk` — `LoopPacksService`, `GET packs`. The response element is
   * `com.bandlab.loop.api.manager.models.LoopPack`.
   */
  listPacks(
    query: SoundListPacksParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<LoopPackList> {
    return this._client.get('/packs', { query, ...options });
  }

  /**
   * Returns the loop pack filters
   *
   * Evidence: `apk` — `LoopPacksService`, `GET packs/filters`. The response element is
   * `com.bandlab.loop.api.manager.models.LoopsFilter`.
   */
  listPackFilters(
    query: SoundListPackFiltersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<LoopsFilterList> {
    return this._client.get('/packs/filters', { query, ...options });
  }

  /**
   * Returns loop samples
   *
   * Evidence: `apk` — `LoopPacksService`, `GET samples`. The response element is
   * `com.bandlab.loop.api.manager.models.LoopSample`.
   */
  listSamples(
    query: SoundListSamplesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<LoopSampleList> {
    return this._client.get('/samples', { query, ...options });
  }

  /**
   * Returns the sample filters
   *
   * Evidence: `apk` — `FilterService`, `GET samples/filters`. The response element is
   * `com.bandlab.mixeditor.library.filters.api.FilterDto`.
   */
  listSampleFilters(
    query: SoundListSampleFiltersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<FilterDtoList> {
    return this._client.get('/samples/filters', { query, ...options });
  }

  /**
   * Resolves pack ids for a set of samples
   *
   * Evidence: `apk` — `SamplesService`, `POST samples/pack-ids`. Response typed from
   * `com.bandlab.sounds.rest.model.SamplePackIdDto`.
   */
  resolveSamplePackIDs(body: unknown, options?: RequestOptions): APIPromise<SamplePackIdDtoList> {
    return this._client.post('/samples/pack-ids', { body, ...options });
  }

  /**
   * Updates a sample
   *
   * Evidence: `apk` — `PreludeUploadUrlService`, `PUT samples/{id}`. Response typed from
   * `com.bandlab.sync.services.impl.StorageObject`.
   */
  updateSample(sampleID: string, body: unknown, options?: RequestOptions): APIPromise<StorageObject> {
    return this._client.put(path`/samples/${sampleID}`, { body, ...options });
  }

  /**
   * Returns a download URI for a sample's audio
   *
   * Evidence: `apk` — `RemoteAudioUriService`, `GET samples/{id}?format=m4a`. Response typed
   * from `com.bandlab.audio.downloader.api.SampleUri`. This and the `mid` variant share their
   * route and are told apart by the `format` query parameter.
   */
  retrieveSampleDownload(
    sampleID: string,
    query: SoundRetrieveSampleDownloadParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<RevisionsAPI.SampleUri> {
    return this._client.get(path`/samples/${sampleID}`, { query, ...options });
  }

  /**
   * Returns a MIDI download URI for a sample
   *
   * Evidence: `apk` — `RemoteAudioUriService`, `GET samples/{id}?format=mid`. Response typed
   * from `com.bandlab.audio.downloader.api.SampleUri`.
   */
  retrieveSampleMIDIDownload(
    sampleID: string,
    query: SoundRetrieveSampleMIDIDownloadParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<RevisionsAPI.SampleUri> {
    return this._client.get(path`/samples/${sampleID}`, { query, ...options });
  }

  /**
   * Restores a revision from a stamp
   *
   * Evidence: `apk` — `RevisionRestorerService`, `GET stamps/{stamp}/revision`. Response typed
   * from `com.bandlab.revision.objects.Revision`.
   */
  retrieveStampRevision(stamp: string, options?: RequestOptions): APIPromise<RevisionsAPI.Revision> {
    return this._client.get(path`/stamps/${stamp}/revision`, options);
  }

  /**
   * Claims samples for a user
   *
   * Evidence: `apk` — `CreditsService`, `POST users/{userId}/claims/samples`. Response typed
   * from `com.bandlab.sounds.credits.impl.service.CreditsResponse`.
   */
  claimSamples(userID: string, body: unknown, options?: RequestOptions): APIPromise<CreditsResponse> {
    return this._client.post(path`/users/${userID}/claims/samples`, { body, ...options });
  }

  /**
   * Returns the ids of a user's claimed samples
   *
   * Evidence: `apk` — `CreditsService`, `GET users/{userId}/claims/samples/ids`. Response typed
   * from `com.bandlab.sounds.credits.impl.service.ClaimedSampleIdsResponse`.
   */
  listClaimedSampleIDs(
    userID: string,
    query: SoundListClaimedSampleIDsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ClaimedSampleIdsResponse> {
    return this._client.get(path`/users/${userID}/claims/samples/ids`, { query, ...options });
  }

  /**
   * Claims a single sample for a user
   *
   * Evidence: `apk` — `CreditsService`, `PUT users/{userId}/claims/samples/{sampleId}`. Response
   * typed from `com.bandlab.sounds.credits.impl.service.CreditsResponse`.
   */
  claimSample(
    sampleID: string,
    params: SoundClaimSampleParams,
    options?: RequestOptions,
  ): APIPromise<CreditsResponse> {
    const { userId } = params;
    return this._client.put(path`/users/${userId}/claims/samples/${sampleID}`, options);
  }

  /**
   * Returns a user's sound credits
   *
   * Evidence: `apk` — `CreditsService`, `GET users/{userId}/credits`. Response typed from
   * `com.bandlab.sounds.credits.impl.service.CreditsResponse`.
   */
  retrieveCredits(userID: string, options?: RequestOptions): APIPromise<CreditsResponse> {
    return this._client.get(path`/users/${userID}/credits`, options);
  }

  /**
   * Returns a user's pack library
   *
   * Evidence: `apk` — `PacksService`, `GET users/{userId}/libraries/packs`. Response typed from
   * `com.bandlab.sounds.rest.model.MySoundsLibraryResponse`.
   */
  listLibraryPacks(
    userID: string,
    query: SoundListLibraryPacksParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<MySoundsLibraryResponse> {
    return this._client.get(path`/users/${userID}/libraries/packs`, { query, ...options });
  }

  /**
   * Returns a user's sample library
   *
   * Evidence: `apk` — `SamplesService`, `GET users/{userId}/libraries/samples`. Response typed
   * from `com.bandlab.sounds.rest.model.MySoundsLibraryResponse`.
   */
  listLibrarySamples(
    userID: string,
    query: SoundListLibrarySamplesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<MySoundsLibraryResponse> {
    return this._client.get(path`/users/${userID}/libraries/samples`, { query, ...options });
  }

  /**
   * Returns a user's sound packs
   *
   * Evidence: `apk` — `PacksService`, `GET users/{userId}/packs`. The response element is
   * `com.bandlab.mixeditor.library.sounds.api.service.SoundsPackDto`.
   */
  listUserPacks(
    userID: string,
    query: SoundListUserPacksParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SoundsPackDtoList> {
    return this._client.get(path`/users/${userID}/packs`, { query, ...options });
  }

  /**
   * Updates one of a user's sound packs
   *
   * Evidence: `apk` — `PacksService`, `PUT users/{userId}/packs/{packId}`.
   */
  updateUserPack(
    packID: string,
    params: SoundUpdateUserPackParams,
    options?: RequestOptions,
  ): APIPromise<void> {
    const { userId, body } = params;
    return this._client.put(path`/users/${userId}/packs/${packID}`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Creates a sampler kit
   *
   * Evidence: `apk` — `UserKitsService`, `POST users/{userId}/sampler-kits`. Response typed from
   * `com.bandlab.mixeditor.library.sampler.impl.service.SamplerKitDTO`.
   */
  createSamplerKit(userID: string, body: unknown, options?: RequestOptions): APIPromise<SamplerKitDTO> {
    return this._client.post(path`/users/${userID}/sampler-kits`, { body, ...options });
  }

  /**
   * Updates a sampler kit
   *
   * Evidence: `apk` — `UserKitsService`, `PUT users/{userId}/sampler-kits/{samplerKitId}`.
   * Response typed from `com.bandlab.mixeditor.library.sampler.impl.service.SamplerKitDTO`.
   */
  updateSamplerKit(
    samplerKitID: string,
    params: SoundUpdateSamplerKitParams,
    options?: RequestOptions,
  ): APIPromise<SamplerKitDTO> {
    const { userId, body } = params;
    return this._client.put(path`/users/${userId}/sampler-kits/${samplerKitID}`, { body, ...options });
  }

  /**
   * Returns a user's samples
   *
   * Evidence: `apk` — `SamplesService`, `GET users/{userId}/samples`. The response element is
   * `com.bandlab.sounds.rest.model.SoundsSampleDto`.
   */
  listUserSamples(
    userID: string,
    query: SoundListUserSamplesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SoundsSampleDtoList> {
    return this._client.get(path`/users/${userID}/samples`, { query, ...options });
  }

  /**
   * Updates one of a user's samples
   *
   * Evidence: `apk` — `SamplesService`, `PUT users/{userId}/samples/{sampleId}`.
   */
  updateUserSample(
    sampleID: string,
    params: SoundUpdateUserSampleParams,
    options?: RequestOptions,
  ): APIPromise<void> {
    const { userId, body } = params;
    return this._client.put(path`/users/${userId}/samples/${sampleID}`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns a user's upload storage information
   *
   * Evidence: `apk` — `MySoundsUploadsService`, `GET users/{userId}/uploads`. Response typed
   * from
   * `com.bandlab.mixeditor.library.sounds.mysounds.uploads.screen.model.SampleStorageInfoDto`.
   */
  retrieveUploadStorage(userID: string, options?: RequestOptions): APIPromise<SampleStorageInfoDto> {
    return this._client.get(path`/users/${userID}/uploads`, options);
  }

  /**
   * Creates an upload URL for a sample
   *
   * Evidence: `apk` — `MySoundsUploadsService`, `POST users/{userId}/uploads/samples`. Response
   * typed from
   * `com.bandlab.mixeditor.library.sounds.mysounds.uploads.screen.model.CreateUploadUrlResponse`.
   */
  createUploadURL(
    userID: string,
    body: unknown,
    options?: RequestOptions,
  ): APIPromise<CreateUploadUrlResponse> {
    return this._client.post(path`/users/${userID}/uploads/samples`, { body, ...options });
  }

  /**
   * Deletes an uploaded sample
   *
   * Evidence: `apk` — `MySoundsUploadsService`,
   * `DELETE users/{userId}/uploads/samples/{sampleId}`.
   */
  deleteUpload(
    sampleID: string,
    params: SoundDeleteUploadParams,
    options?: RequestOptions,
  ): APIPromise<void> {
    const { userId } = params;
    return this._client.delete(path`/users/${userId}/uploads/samples/${sampleID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns song starter ideas
   *
   * Evidence: `apk` — `MidiSongStarterService`, `GET v3/ideas`. Response typed from
   * `com.bandlab.song.starter.domain.impl.IdeasResponseModel`.
   */
  listIdeas(
    query: SoundListIdeasParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<IdeasResponseModel> {
    return this._client.get('/v3/ideas', { query, ...options });
  }

  /**
   * Returns native ad placements
   *
   * Evidence: `apk` — `NativeAdsService`, `GET v3/native`. Response typed from
   * `com.bandlab.boost.api.NativeAds`.
   */
  retrieveNativeAds(
    query: SoundRetrieveNativeAdsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<NativeAds> {
    return this._client.get('/v3/native', { query, ...options });
  }

  /**
   * Returns the vast video ad payload
   *
   * Evidence: `apk` — `VastService`, `GET v3/video`. The app gives no response shape for this
   * path, so it is `unknown` under rule D12.
   */
  retrieveVideoAd(
    query: SoundRetrieveVideoAdParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<unknown> {
    return this._client.get('/v3/video', { query, ...options });
  }
}

/**
 * Evidence: `apk` — `com.bandlab.tools.splitter.screen.api.SeparationStatusResponse`.
 */
export interface SeparationStatusResponse {
  result?: unknown;
}

/**
 * Evidence: `apk` — `com.bandlab.tools.splitter.screen.api.SeparationLimitsResponse`.
 */
export interface SeparationLimitsResponse {
  result?: unknown;
}

/**
 * Evidence: `apk` — `com.bandlab.tools.splitter.screen.api.ForwardResultResponse`.
 */
export interface ForwardResultResponse {
  result?: unknown;
}

/**
 * Evidence: `apk` — `com.bandlab.tools.splitter.screen.api.SeparationProgressResponse`.
 */
export interface SeparationProgressResponse {
  result?: unknown;
}

/**
 * Evidence: `apk` — `com.bandlab.mixeditor.palette.impl.model.PaletteInstrument`.
 */
export interface PaletteInstrument {
  id?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.sounds.rest.model.LoopMatchDto`.
 */
export interface LoopMatch {
  bpm?: number;

  genre?: string;

  instrument?: string;

  key?: string;

  uuid?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.loop.api.manager.models.LoopPack`.
 */
export interface LoopPack {
  id?: string;

  archiveUrl?: string;

  audioUrl?: string;

  characters?: Array<string>;

  creator?: unknown;

  features?: unknown;

  genres?: Array<string>;

  imageUrl?: string;

  instrumentId?: string;

  packSlug?: string;

  samplesCount?: number;

  updatedAt?: string;

  waveform?: unknown;
}

/**
 * Evidence: `apk` — `com.bandlab.loop.api.manager.models.LoopsFilter`.
 */
export interface LoopsFilter {
  count?: number;

  iconUrl?: string;

  id?: string;

  range?: FilterRange;

  subfilters?: Array<unknown>;

  type?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.loop.api.manager.models.FilterRange`.
 */
export interface FilterRange {
  maxValue?: number;

  minValue?: number;

  step?: number;
}

/**
 * Evidence: `apk` — `com.bandlab.loop.api.manager.models.LoopSample`.
 */
export interface LoopSample {
  id?: string;

  audioUrl?: string;

  characters?: Array<string>;

  duration?: number;

  features?: unknown;

  genres?: Array<string>;

  imageUrl?: string;

  instrumentId?: string;

  packSlug?: string;

  sampleId?: string;

  updatedAt?: string;

  waveform?: unknown;
}

/**
 * Evidence: `apk` — `com.bandlab.mixeditor.library.filters.api.FilterDto`.
 */
export interface FilterDto {
  count?: number;

  iconUrl?: string;

  id?: string;

  subfilters?: Array<unknown>;

  type?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.sounds.rest.model.SamplePackIdDto`.
 */
export interface SamplePackIdDto {
  packSlug?: string;

  sampleId?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.sync.services.impl.StorageObject`.
 */
export interface StorageObject {
  expiryDate?: string;

  format?: string;

  id?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.sounds.credits.impl.service.CreditsResponse`.
 */
export interface CreditsResponse {
  creditsLeft?: number;

  isUnlimited?: boolean;

  modal?: CreditsResponse.Modal;
}

export namespace CreditsResponse {
  export interface Modal {
    shouldShowUpgradeButton?: boolean;

    subtitle?: string;

    title?: string;
  }
}

/**
 * Evidence: `apk` — `com.bandlab.sounds.credits.impl.service.ClaimedSampleIdsResponse`.
 */
export interface ClaimedSampleIdsResponse {
  ids?: Array<string>;

  idsCount?: number;
}

/**
 * Evidence: `apk` — `com.bandlab.sounds.rest.model.MySoundsLibraryResponse`.
 */
export interface MySoundsLibraryResponse {
  data?: Array<unknown>;
}

/**
 * Evidence: `apk` — `com.bandlab.mixeditor.library.sounds.api.service.SoundsPackDto`.
 */
export interface SoundsPackDto {
  id?: string;

  audioUrl?: string;

  creator?: unknown;

  genres?: Array<string>;

  imageUrl?: string;

  isFree?: boolean;

  packId?: string;

  releaseDate?: string;

  samplesCount?: number;
}

/**
 * Evidence: `apk` — `com.bandlab.mixeditor.library.sampler.impl.service.SamplerKitDTO`.
 */
export interface SamplerKitDTO {
  id?: string;

  audioUrl?: string;

  displayName?: string;

  features?: unknown;

  imageUrl?: string;

  key?: string;

  kit?: unknown;

  modifiedOn?: string;

  originalSamplerKitId?: string;

  sampleIds?: Array<string>;

  samples?: Array<unknown>;

  tempo?: number;

  type?: string;

  updatedAt?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.sounds.rest.model.SoundsSampleDto`.
 */
export interface SoundsSampleDto {
  id?: string;

  audioUrl?: string;

  canUsePalette?: boolean;

  characters?: Array<string>;

  duration?: number;

  features?: unknown;

  genres?: Array<string>;

  imageUrl?: string;

  instrumentId?: string;

  isFree?: boolean;

  packId?: string;

  packSlug?: string;

  paletteGenre?: string;

  previewAudioUrl?: string;

  releaseDate?: string;

  sampleId?: string;

  waveform?: unknown;
}

/**
 * Evidence: `apk` —
 * `com.bandlab.mixeditor.library.sounds.mysounds.uploads.screen.model.SampleStorageInfoDto`.
 */
export interface SampleStorageInfoDto {
  maxStorage?: number;

  samples?: Array<unknown>;

  storageLeft?: number;

  storageUsed?: number;
}

/**
 * Evidence: `apk` —
 * `com.bandlab.mixeditor.library.sounds.mysounds.uploads.screen.model.CreateUploadUrlResponse`.
 */
export interface CreateUploadUrlResponse {
  contentType?: string;

  expiryDate?: string;

  id?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.song.starter.domain.impl.IdeasResponseModel`.
 */
export interface IdeasResponseModel {
  character?: unknown;

  vibes?: unknown;
}

/**
 * Evidence: `apk` — `com.bandlab.boost.api.NativeAds`.
 */
export interface NativeAds {
  ads?: Array<unknown>;
}

/**
 * Evidence: `apk` — paged wrapper around
 * `com.bandlab.mixeditor.palette.impl.model.PaletteInstrument`.
 */
export interface PaletteInstrumentList {
  data?: Array<PaletteInstrument>;

  paging?: unknown;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.sounds.rest.model.LoopMatchDto`.
 */
export interface LoopMatchList {
  data?: Array<LoopMatch>;

  paging?: unknown;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.loop.api.manager.models.LoopPack`.
 */
export interface LoopPackList {
  data?: Array<LoopPack>;

  paging?: unknown;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.loop.api.manager.models.LoopsFilter`.
 */
export interface LoopsFilterList {
  data?: Array<LoopsFilter>;

  paging?: unknown;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.loop.api.manager.models.LoopSample`.
 */
export interface LoopSampleList {
  data?: Array<LoopSample>;

  paging?: unknown;
}

/**
 * Evidence: `apk` — paged wrapper around
 * `com.bandlab.mixeditor.library.filters.api.FilterDto`.
 */
export interface FilterDtoList {
  data?: Array<FilterDto>;

  paging?: unknown;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.sounds.rest.model.SamplePackIdDto`.
 */
export interface SamplePackIdDtoList {
  data?: Array<SamplePackIdDto>;

  paging?: unknown;
}

/**
 * Evidence: `apk` — paged wrapper around
 * `com.bandlab.mixeditor.library.sounds.api.service.SoundsPackDto`.
 */
export interface SoundsPackDtoList {
  data?: Array<SoundsPackDto>;

  paging?: unknown;
}

/**
 * Evidence: `apk` — paged wrapper around `com.bandlab.sounds.rest.model.SoundsSampleDto`.
 */
export interface SoundsSampleDtoList {
  data?: Array<SoundsSampleDto>;

  paging?: unknown;
}

export interface SoundRetrieveSampleDownloadParams {
  /**
   * The app sends `m4a`.
   */
  format?: string;
}

export interface SoundRetrieveSampleMIDIDownloadParams {
  /**
   * The app sends `mid`.
   */
  format?: string;
}

export interface SoundListInstrumentsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface SoundListLoopMatchesParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface SoundListPacksParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface SoundListPackFiltersParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface SoundListSamplesParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface SoundListSampleFiltersParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface SoundListClaimedSampleIDsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface SoundClaimSampleParams {
  userId: string;
}

export interface SoundListLibraryPacksParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface SoundListLibrarySamplesParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface SoundListUserPacksParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface SoundUpdateUserPackParams {
  userId: string;

  body: unknown;
}

export interface SoundUpdateSamplerKitParams {
  userId: string;

  body: unknown;
}

export interface SoundListUserSamplesParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface SoundUpdateUserSampleParams {
  userId: string;

  body: unknown;
}

export interface SoundDeleteUploadParams {
  userId: string;
}

export interface SoundListIdeasParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface SoundRetrieveNativeAdsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface SoundRetrieveVideoAdParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export declare namespace Sounds {
  export {
    type ClaimedSampleIdsResponse as ClaimedSampleIdsResponse,
    type CreateUploadUrlResponse as CreateUploadUrlResponse,
    type CreditsResponse as CreditsResponse,
    type FilterDto as FilterDto,
    type FilterDtoList as FilterDtoList,
    type FilterRange as FilterRange,
    type ForwardResultResponse as ForwardResultResponse,
    type IdeasResponseModel as IdeasResponseModel,
    type LoopMatch as LoopMatch,
    type LoopMatchList as LoopMatchList,
    type LoopPack as LoopPack,
    type LoopPackList as LoopPackList,
    type LoopSample as LoopSample,
    type LoopSampleList as LoopSampleList,
    type LoopsFilter as LoopsFilter,
    type LoopsFilterList as LoopsFilterList,
    type MySoundsLibraryResponse as MySoundsLibraryResponse,
    type NativeAds as NativeAds,
    type PaletteInstrument as PaletteInstrument,
    type PaletteInstrumentList as PaletteInstrumentList,
    type SamplePackIdDto as SamplePackIdDto,
    type SamplePackIdDtoList as SamplePackIdDtoList,
    type SampleStorageInfoDto as SampleStorageInfoDto,
    type SamplerKitDTO as SamplerKitDTO,
    type SeparationLimitsResponse as SeparationLimitsResponse,
    type SeparationProgressResponse as SeparationProgressResponse,
    type SeparationStatusResponse as SeparationStatusResponse,
    type SoundClaimSampleParams as SoundClaimSampleParams,
    type SoundDeleteUploadParams as SoundDeleteUploadParams,
    type SoundListClaimedSampleIDsParams as SoundListClaimedSampleIDsParams,
    type SoundListIdeasParams as SoundListIdeasParams,
    type SoundListInstrumentsParams as SoundListInstrumentsParams,
    type SoundListLibraryPacksParams as SoundListLibraryPacksParams,
    type SoundListLibrarySamplesParams as SoundListLibrarySamplesParams,
    type SoundListLoopMatchesParams as SoundListLoopMatchesParams,
    type SoundListPackFiltersParams as SoundListPackFiltersParams,
    type SoundListPacksParams as SoundListPacksParams,
    type SoundListSampleFiltersParams as SoundListSampleFiltersParams,
    type SoundListSamplesParams as SoundListSamplesParams,
    type SoundListUserPacksParams as SoundListUserPacksParams,
    type SoundListUserSamplesParams as SoundListUserSamplesParams,
    type SoundRetrieveNativeAdsParams as SoundRetrieveNativeAdsParams,
    type SoundRetrieveSampleDownloadParams as SoundRetrieveSampleDownloadParams,
    type SoundRetrieveSampleMIDIDownloadParams as SoundRetrieveSampleMIDIDownloadParams,
    type SoundRetrieveVideoAdParams as SoundRetrieveVideoAdParams,
    type SoundUpdateSamplerKitParams as SoundUpdateSamplerKitParams,
    type SoundUpdateUserPackParams as SoundUpdateUserPackParams,
    type SoundUpdateUserSampleParams as SoundUpdateUserSampleParams,
    type SoundsPackDto as SoundsPackDto,
    type SoundsPackDtoList as SoundsPackDtoList,
    type SoundsSampleDto as SoundsSampleDto,
    type SoundsSampleDtoList as SoundsSampleDtoList,
    type StorageObject as StorageObject,
  };
}

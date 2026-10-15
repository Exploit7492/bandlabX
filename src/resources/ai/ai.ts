// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as SoundsAPI from '../sounds/sounds';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class AI extends APIResource {
  /**
   * Returns the separation daily limits
   *
   * Evidence: `apk` — `SplitterApi`, `GET /v1/daily_limits`. Response typed from
   * `com.bandlab.tools.splitter.screen.api.SeparationLimitsResponse`.
   */
  retrieveDailyLimits(options?: RequestOptions): APIPromise<SoundsAPI.SeparationLimitsResponse> {
    return this._client.get('/v1/daily_limits', options);
  }

  /**
   * Returns a model artifact
   *
   * Evidence: `apk` — `MlModelArtifactService`, `GET /v1/model/{modelId}/{version}/{feature}`.
   * The app gives no response shape for this path, so it is `unknown` under rule D12.
   */
  retrieveModel(
    feature: string,
    params: AIRetrieveModelParams,
    options?: RequestOptions,
  ): APIPromise<unknown> {
    const { modelId, version } = params;
    return this._client.get(path`/v1/model/${modelId}/${version}/${feature}`, options);
  }

  /**
   * Deletes the current separation
   *
   * Evidence: `apk` — `SplitterApi`, `DELETE /v1/separation`.
   */
  deleteSeparation(options?: RequestOptions): APIPromise<void> {
    return this._client.delete('/v1/separation', {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns a separation prediction
   *
   * Evidence: `apk` — `SplitterApi`, `GET /v1/separation/prediction`. Response typed from
   * `com.bandlab.tools.splitter.screen.api.SeparationStatusResponse`.
   */
  retrieveSeparationPrediction(options?: RequestOptions): APIPromise<SoundsAPI.SeparationStatusResponse> {
    return this._client.get('/v1/separation/prediction', options);
  }

  /**
   * Submits a separation sample
   *
   * Evidence: `apk` — `SplitterApi`, `POST /v1/separation/sample`. Response typed from
   * `com.bandlab.tools.splitter.screen.api.ForwardResultResponse`.
   */
  createSeparationSample(
    body: unknown,
    options?: RequestOptions,
  ): APIPromise<SoundsAPI.ForwardResultResponse> {
    return this._client.post('/v1/separation/sample', { body, ...options });
  }

  /**
   * Returns the separation status
   *
   * Evidence: `apk` — `SplitterApi`, `GET /v1/separation/status`. Response typed from
   * `com.bandlab.tools.splitter.screen.api.SeparationProgressResponse`.
   */
  retrieveSeparationStatus(options?: RequestOptions): APIPromise<SoundsAPI.SeparationProgressResponse> {
    return this._client.get('/v1/separation/status', options);
  }

  /**
   * Returns a link preview
   *
   * Evidence: `apk` — `WritePostService`, `GET preview`. Response typed from
   * `com.bandlab.network.models.Link`.
   */
  retrievePreview(
    query: AIRetrievePreviewParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Link> {
    return this._client.get('/preview', { query, ...options });
  }

  /**
   * Starts a palette stack task
   *
   * Evidence: `apk` — `PaletteService`, `POST task`. Response typed from
   * `com.bandlab.mixeditor.palette.impl.service.PaletteStackTaskDto`.
   */
  createTask(body: unknown, options?: RequestOptions): APIPromise<PaletteStackTaskDto> {
    return this._client.post('/task', { body, ...options });
  }

  /**
   * Returns a palette stack task
   *
   * Evidence: `apk` — `PaletteService`, `GET task/{id}`. Response typed from
   * `com.bandlab.mixeditor.palette.impl.service.PaletteStackTaskDto`.
   */
  retrieveTask(taskID: string, options?: RequestOptions): APIPromise<PaletteStackTaskDto> {
    return this._client.get(path`/task/${taskID}`, options);
  }

  /**
   * Returns a palette stack task's result
   *
   * Evidence: `apk` — `PaletteService`, `GET task/{id}/download`. Response typed from
   * `com.bandlab.mixeditor.palette.impl.service.PaletteStackTaskResultDto`.
   */
  retrieveTaskResult(taskID: string, options?: RequestOptions): APIPromise<PaletteStackTaskResultDto> {
    return this._client.get(path`/task/${taskID}/download`, options);
  }

  /**
   * Returns similar sounds
   *
   * Evidence: `apk` — `SimilarSoundsService`, `GET v0/similar`. The app gives no response shape
   * for this path, so it is `unknown` under rule D12.
   */
  listSimilarSounds(
    query: AIListSimilarSoundsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<unknown> {
    return this._client.get('/v0/similar', { query, ...options });
  }

  /**
   * Autocompletes a prompt
   *
   * Evidence: `apk` — `SmartComposeService`, `POST v1/autocomplete`. The app gives no response
   * shape for this path, so it is `unknown` under rule D12.
   */
  autocomplete(body: unknown, options?: RequestOptions): APIPromise<unknown> {
    return this._client.post('/v1/autocomplete', { body, ...options });
  }

  /**
   * Checks a captcha response
   *
   * Evidence: `apk` — `MidiSongStarterService`, `POST v1/check_captcha`. The app gives no
   * response shape for this path, so it is `unknown` under rule D12.
   */
  checkCaptcha(body: unknown, options?: RequestOptions): APIPromise<unknown> {
    return this._client.post('/v1/check_captcha', { body, ...options });
  }

  /**
   * Returns the displayed genres
   *
   * Evidence: `apk` — `MidiSongStarterService`, `GET v1/displayed_genres`. Response typed from
   * `com.bandlab.song.starter.domain.impl.GenreResponseModel`.
   */
  listDisplayedGenres(
    query: AIListDisplayedGenresParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<GenreResponseModelList> {
    return this._client.get('/v1/displayed_genres', { query, ...options });
  }

  /**
   * Returns the auto-mix genres
   *
   * Evidence: `apk` — `AutoMixService`, `GET v1/genres`. Response typed from
   * `com.bandlab.audio.controller.autoMix.AutoMixGenresDto`.
   */
  listGenres(
    query: AIListGenresParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<AutoMixGenresDto> {
    return this._client.get('/v1/genres', { query, ...options });
  }

  /**
   * Returns song starter ideas
   *
   * Evidence: `apk` — `MidiSongStarterService`, `GET v1/ideas`. Response typed from
   * `com.bandlab.song.starter.domain.impl.IdeasResponseModel`.
   */
  listIdeas(
    query: AIListIdeasParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SoundsAPI.IdeasResponseModel> {
    return this._client.get('/v1/ideas', { query, ...options });
  }

  /**
   * Returns auto-mix instruction suggestions
   *
   * Evidence: `apk` — `AutoMixService`, `GET v1/instruction-suggestions`. Response typed from
   * `com.bandlab.audio.controller.autoMix.AutoMixPromptExamplesDto`.
   */
  listInstructionSuggestions(
    query: AIListInstructionSuggestionsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<AutoMixPromptExamplesDto> {
    return this._client.get('/v1/instruction-suggestions', { query, ...options });
  }

  /**
   * Returns the harmonizer voices
   *
   * Evidence: `apk` — `HarmonizerService`, `GET v1/models`. The response element is
   * `com.bandlab.mixeditor.ai.tools.harmonizer.impl.HarmonizerVoiceDto`.
   */
  listModels(
    query: AIListModelsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<HarmonizerVoiceDtoList> {
    return this._client.get('/v1/models', { query, ...options });
  }

  /**
   * Returns the harmonizer presets
   *
   * Evidence: `apk` — `HarmonizerService`, `GET v1/presets`. The response element is
   * `com.bandlab.mixeditor.ai.tools.harmonizer.impl.HarmonizerPresetDto`.
   */
  listPresets(
    query: AIListPresetsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<HarmonizerPresetDtoList> {
    return this._client.get('/v1/presets', { query, ...options });
  }

  /**
   * Returns the song starter previews
   *
   * Evidence: `apk` — `SongStarterService`, `GET v1/previews`. Response typed from
   * `com.bandlab.song.starter.root.impl.SongExamplesDTO`.
   */
  listPreviews(
    query: AIListPreviewsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SongExamplesDTO> {
    return this._client.get('/v1/previews', { query, ...options });
  }

  /**
   * Returns the audio song starter prompts
   *
   * Evidence: `apk` — `AudioSongStarterService`, `GET v1/prompts`. Response typed from
   * `com.bandlab.song.starter.audio.screen.controller.PromptsDTO`.
   */
  listPrompts(
    query: AIListPromptsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PromptsDTO> {
    return this._client.get('/v1/prompts', { query, ...options });
  }

  /**
   * Starts a remix
   *
   * Evidence: `apk` — `SmartComposeService`, `POST v1/remix`. The app gives no response shape
   * for this path, so it is `unknown` under rule D12.
   */
  createRemix(body: unknown, options?: RequestOptions): APIPromise<unknown> {
    return this._client.post('/v1/remix', { body, ...options });
  }

  /**
   * Starts a similar-sounds task
   *
   * Evidence: `apk` — `SimilarSoundsTaskService`, `POST v1/task`. Response typed from
   * `com.bandlab.remote.task.processor.api.TaskStatusDTO`.
   */
  createAITask(body: unknown, options?: RequestOptions): APIPromise<TaskStatusDTO> {
    return this._client.post('/v1/task', { body, ...options });
  }

  /**
   * Returns a similar-sounds task
   *
   * Evidence: `apk` — `SimilarSoundsTaskService`, `GET v1/task/{id}`. Response typed from
   * `com.bandlab.remote.task.processor.api.TaskStatusDTO`.
   */
  retrieveAITask(taskID: string, options?: RequestOptions): APIPromise<TaskStatusDTO> {
    return this._client.get(path`/v1/task/${taskID}`, options);
  }

  /**
   * Returns a similar-sounds task's result
   *
   * Evidence: `apk` — `AutoMixService`, `GET v1/task/{id}/download`. Response typed from
   * `com.bandlab.audio.controller.autoMix.AutoMixResultDto`.
   */
  retrieveAITaskResult(taskID: string, options?: RequestOptions): APIPromise<AutoMixResultDto> {
    return this._client.get(path`/v1/task/${taskID}/download`, options);
  }

  /**
   * Starts a voice transfer
   *
   * Evidence: `apk` — `VoiceChangerService`, `POST v1/transfer`. Response typed from
   * `com.bandlab.remote.task.processor.api.TaskStatusDTO`.
   */
  createTransfer(body: unknown, options?: RequestOptions): APIPromise<TaskStatusDTO> {
    return this._client.post('/v1/transfer', { body, ...options });
  }

  /**
   * Returns a voice transfer
   *
   * Evidence: `apk` — `VoiceChangerService`, `GET v1/transfer/{id}`. Response typed from
   * `com.bandlab.remote.task.processor.api.TaskStatusDTO`.
   */
  retrieveTransfer(transferID: string, options?: RequestOptions): APIPromise<TaskStatusDTO> {
    return this._client.get(path`/v1/transfer/${transferID}`, options);
  }

  /**
   * Returns a voice transfer's result
   *
   * Evidence: `apk` — `VoiceChangerService`, `GET v1/transfer/{id}/download`. The app gives no
   * response shape for this path, so it is `unknown` under rule D12.
   */
  retrieveTransferDownload(transferID: string, options?: RequestOptions): APIPromise<unknown> {
    return this._client.get(path`/v1/transfer/${transferID}/download`, options);
  }

  /**
   * Returns the song starter models
   *
   * Evidence: `apk` — `SongStarterService`, `GET v2/models`. Response typed from
   * `com.bandlab.song.starter.root.impl.GetModelsDTO`.
   */
  listV2Models(
    query: AIListV2ModelsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<GetModelsDTO> {
    return this._client.get('/v2/models', { query, ...options });
  }

  /**
   * Reports a BandLab user
   *
   * Evidence: `apk` — `NativeAdsService`, `GET v2/report/bandlab_user/{id}`. The app gives no
   * response shape for this path, so it is `unknown` under rule D12.
   */
  reportBandlabUser(userID: string, options?: RequestOptions): APIPromise<unknown> {
    return this._client.get(path`/v2/report/bandlab_user/${userID}`, options);
  }
}

/**
 * Evidence: `apk` — `com.bandlab.network.models.Link`.
 */
export interface Link {
  image?: unknown;

  title?: string;

  url?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.mixeditor.palette.impl.service.PaletteStackTaskDto`.
 */
export interface PaletteStackTaskDto {
  error?: unknown;

  status?: string;

  taskId?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.mixeditor.palette.impl.service.PaletteStackTaskResultDto`.
 */
export interface PaletteStackTaskResultDto {
  bpm?: number;

  key?: string;

  samples?: Array<unknown>;
}

/**
 * Evidence: `apk` — `com.bandlab.song.starter.domain.impl.GenreResponseModel`.
 */
export interface GenreResponseModel {
  display_name?: string;

  icon_file_path?: string;

  id?: string;

  is_selected?: boolean;
}

/**
 * Evidence: `apk` — `com.bandlab.audio.controller.autoMix.AutoMixGenresDto`.
 */
export interface AutoMixGenresDto {
  genres?: Array<unknown>;
}

/**
 * Evidence: `apk` — `com.bandlab.audio.controller.autoMix.AutoMixPromptExamplesDto`.
 */
export interface AutoMixPromptExamplesDto {
  suggestions?: Array<string>;
}

/**
 * Evidence: `apk` — `com.bandlab.audio.controller.autoMix.AutoMixResultDto`.
 */
export interface AutoMixResultDto {
  explanation?: string;

  panning?: Array<unknown>;

  volumesDb?: Array<unknown>;
}

/**
 * Evidence: `apk` — `com.bandlab.mixeditor.ai.tools.harmonizer.impl.HarmonizerVoiceDto`.
 */
export interface HarmonizerVoiceDto {
  id?: string;

  pictureUrl?: string;

  showAsNew?: boolean;
}

/**
 * Evidence: `apk` — `com.bandlab.mixeditor.ai.tools.harmonizer.impl.HarmonizerPresetDto`.
 */
export interface HarmonizerPresetDto {
  id?: string;

  tracks?: Array<HarmonizerPresetDto.TrackDto>;
}

export namespace HarmonizerPresetDto {
  export interface TrackDto {
    interval_semitone?: number;

    model_id?: string;

    offset_ms?: number;

    pan?: number;

    volume?: number;
  }
}

/**
 * Evidence: `apk` — `com.bandlab.song.starter.root.impl.SongExamplesDTO`.
 */
export interface SongExamplesDTO {
  previews?: Array<SongExamplesDTO.Preview>;
}

export namespace SongExamplesDTO {
  export interface Preview {
    audioUrl?: string;

    genreID?: string;

    genres?: Array<unknown>;

    id?: string;

    imageUrl?: string;

    model?: string;

    prompt?: string;

    songTitle?: string;
  }
}

/**
 * Evidence: `apk` — `com.bandlab.song.starter.audio.screen.controller.PromptsDTO`.
 */
export interface PromptsDTO {
  prompts?: Array<string>;
}

/**
 * Evidence: `apk` — `com.bandlab.remote.task.processor.api.TaskStatusDTO`.
 */
export interface TaskStatusDTO {
  error?: unknown;

  progress?: number;

  status?: string;

  taskId?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.song.starter.root.impl.GetModelsDTO`.
 */
export interface GetModelsDTO {
  models?: Array<GetModelsDTO.Model>;
}

export namespace GetModelsDTO {
  export interface Model {
    displayName?: string;

    id?: string;

    prices?: Array<Model.Price>;

    tag?: string;

    version?: string;
  }

  export namespace Model {
    export interface Price {
      durationId?: string;

      label?: string;
    }
  }
}

/**
 * Evidence: `apk` — paged wrapper around
 * `com.bandlab.mixeditor.ai.tools.harmonizer.impl.HarmonizerVoiceDto`.
 */
export interface HarmonizerVoiceDtoList {
  data?: Array<HarmonizerVoiceDto>;

  paging?: unknown;
}

/**
 * Evidence: `apk` — paged wrapper around
 * `com.bandlab.mixeditor.ai.tools.harmonizer.impl.HarmonizerPresetDto`.
 */
export interface HarmonizerPresetDtoList {
  data?: Array<HarmonizerPresetDto>;

  paging?: unknown;
}

/**
 * Evidence: `apk` — paged wrapper around
 * `com.bandlab.song.starter.domain.impl.GenreResponseModel`.
 */
export interface GenreResponseModelList {
  data?: Array<GenreResponseModel>;

  paging?: unknown;
}

export interface AIRetrieveModelParams {
  modelId: string;

  version: string;
}

export interface AIRetrievePreviewParams {
  url?: string;
}

export interface AIListSimilarSoundsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface AIListDisplayedGenresParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface AIListGenresParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface AIListIdeasParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface AIListInstructionSuggestionsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface AIListModelsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface AIListPresetsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface AIListPreviewsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface AIListPromptsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface AIListV2ModelsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export declare namespace AI {
  export {
    type AIListDisplayedGenresParams as AIListDisplayedGenresParams,
    type AIListGenresParams as AIListGenresParams,
    type AIListIdeasParams as AIListIdeasParams,
    type AIListInstructionSuggestionsParams as AIListInstructionSuggestionsParams,
    type AIListModelsParams as AIListModelsParams,
    type AIListPresetsParams as AIListPresetsParams,
    type AIListPreviewsParams as AIListPreviewsParams,
    type AIListPromptsParams as AIListPromptsParams,
    type AIListSimilarSoundsParams as AIListSimilarSoundsParams,
    type AIListV2ModelsParams as AIListV2ModelsParams,
    type AIRetrieveModelParams as AIRetrieveModelParams,
    type AIRetrievePreviewParams as AIRetrievePreviewParams,
    type AutoMixGenresDto as AutoMixGenresDto,
    type AutoMixPromptExamplesDto as AutoMixPromptExamplesDto,
    type AutoMixResultDto as AutoMixResultDto,
    type GenreResponseModel as GenreResponseModel,
    type GenreResponseModelList as GenreResponseModelList,
    type GetModelsDTO as GetModelsDTO,
    type HarmonizerPresetDto as HarmonizerPresetDto,
    type HarmonizerPresetDtoList as HarmonizerPresetDtoList,
    type HarmonizerVoiceDto as HarmonizerVoiceDto,
    type HarmonizerVoiceDtoList as HarmonizerVoiceDtoList,
    type Link as Link,
    type PaletteStackTaskDto as PaletteStackTaskDto,
    type PaletteStackTaskResultDto as PaletteStackTaskResultDto,
    type PromptsDTO as PromptsDTO,
    type SongExamplesDTO as SongExamplesDTO,
    type TaskStatusDTO as TaskStatusDTO,
  };
}

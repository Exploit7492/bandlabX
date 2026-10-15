// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as MeAPI from './me';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class AIVideos extends APIResource {
  /**
   * Returns the price of an AI video token
   *
   * Evidence: `apk` — `AiVideosService`, `GET ai-videos/ai-tokens/price`. Response typed from
   * `com.bandlab.ai.video.api.model.VideoGenerationCost`.
   */
  retrieveTokenPrice(options?: RequestOptions): APIPromise<VideoGenerationCost> {
    return this._client.get('/ai-videos/ai-tokens/price', options);
  }

  /**
   * Starts an AI video generation
   *
   * Evidence: `apk` — `AiVideosService`, `POST ai-videos/generate`. The app gives no response
   * shape for this path, so it is `unknown` under rule D12.
   */
  generate(body: unknown, options?: RequestOptions): APIPromise<unknown> {
    return this._client.post('/ai-videos/generate', { body, ...options });
  }

  /**
   * Returns the AI video generation jobs
   *
   * Evidence: `apk` — `AiVideosService`, `GET ai-videos/jobs`. The response element is
   * `com.bandlab.ai.video.api.model.VideoGenerationJob`.
   */
  listJobs(
    query: AIVideoListJobsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<VideoGenerationJobList> {
    return this._client.get('/ai-videos/jobs', { query, ...options });
  }

  /**
   * Returns the visual styles
   *
   * Evidence: `apk` — `AiVideosService`, `GET ai-videos/styles`. Response typed from
   * `com.bandlab.ai.video.api.model.VisualStyleListResult`.
   */
  listStyles(
    query: AIVideoListStylesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<VisualStyleListResult> {
    return this._client.get('/ai-videos/styles', { query, ...options });
  }

  /**
   * Returns the unseen AI video updates
   *
   * Evidence: `apk` — `AiVideosService`, `GET ai-videos/updates`. Response typed from
   * `com.bandlab.ai.video.api.model.VideoGenerationUnseenUpdates`.
   */
  listUpdates(
    query: AIVideoListUpdatesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<VideoGenerationUnseenUpdates> {
    return this._client.get('/ai-videos/updates', { query, ...options });
  }
}

/**
 * Evidence: `apk` — `com.bandlab.ai.video.api.model.VideoGenerationCost`.
 */
export interface VideoGenerationCost {
  amount?: number;
}

/**
 * Evidence: `apk` — `com.bandlab.ai.video.api.model.VideoGenerationJob`.
 */
export interface VideoGenerationJob {
  jobId?: string;

  status?: string;

  track?: VideoGenerationJob.Track;

  triggeredAt?: string;

  updatedAt?: string;

  videoId?: string;

  videoThumbnailUrl?: string;

  videoUrl?: string;

  visualStyleId?: string;
}

export namespace VideoGenerationJob {
  export interface Track {
    picture?: MeAPI.Picture;

    postId?: string;
  }
}

/**
 * Evidence: `apk` — `com.bandlab.ai.video.api.model.VisualStyle`.
 */
export interface VisualStyle {
  demoVideoUrl?: string;

  id?: string;

  picture?: MeAPI.Picture;
}

/**
 * Evidence: `apk` — `com.bandlab.ai.video.api.model.VisualStyleListResult`.
 */
export interface VisualStyleListResult {
  items?: Array<VisualStyle>;
}

/**
 * Evidence: `apk` — `com.bandlab.ai.video.api.model.VideoGenerationUnseenUpdates`.
 */
export interface VideoGenerationUnseenUpdates {
  hasUnseenUpdates?: boolean;
}

/**
 * Evidence: `apk` — paged wrapper around
 * `com.bandlab.ai.video.api.model.VideoGenerationJob`.
 */
export interface VideoGenerationJobList {
  data?: Array<VideoGenerationJob>;

  paging?: unknown;
}

export interface AIVideoListJobsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface AIVideoListStylesParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface AIVideoListUpdatesParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export declare namespace AIVideos {
  export {
    type AIVideoListJobsParams as AIVideoListJobsParams,
    type AIVideoListStylesParams as AIVideoListStylesParams,
    type AIVideoListUpdatesParams as AIVideoListUpdatesParams,
    type VideoGenerationCost as VideoGenerationCost,
    type VideoGenerationJob as VideoGenerationJob,
    type VideoGenerationJobList as VideoGenerationJobList,
    type VideoGenerationUnseenUpdates as VideoGenerationUnseenUpdates,
    type VisualStyle as VisualStyle,
    type VisualStyleListResult as VisualStyleListResult,
  };
}

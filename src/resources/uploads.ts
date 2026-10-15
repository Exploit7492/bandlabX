// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Uploads extends APIResource {
  /**
   * Uploads a Spatial Studio project
   *
   * Evidence: `apk` — `SpatialStudioService`, `POST upload`. Response typed from
   * `com.bandlab.tools.spatial.screen.worker.api.SpatialStudioUploadResponse`.
   */
  createSpatialProject(body: unknown, options?: RequestOptions): APIPromise<SpatialStudioUploadResponse> {
    return this._client.post('/upload', { body, ...options });
  }

  /**
   * Uploads an auto-pitch sample for a project region
   *
   * Evidence: `apk` — `AiPitchService`, `POST upload/{projectID}/{regionID}/{activeSampleID}`.
   * The app gives no response shape for this path, so it is `unknown` under rule D12.
   */
  createProjectSample(
    activeSampleID: string,
    params: UploadCreateProjectSampleParams,
    options?: RequestOptions,
  ): APIPromise<unknown> {
    const { projectID, regionID, body } = params;
    return this._client.post(path`/upload/${projectID}/${regionID}/${activeSampleID}`, {
      body,
      ...options,
    });
  }

  /**
   * Creates a video upload session
   *
   * Evidence: `apk` — `ShoutsService`, `POST uploads/videos`. Response typed from
   * `com.bandlab.video.uploader.api.FileUploadSession`.
   */
  createVideoSession(body: unknown, options?: RequestOptions): APIPromise<FileUploadSession> {
    return this._client.post('/uploads/videos', { body, ...options });
  }

  /**
   * Completes a video upload part
   *
   * Evidence: `apk` — `ShoutsService`, `PUT uploads/videos/{uploadId}`. Response typed from
   * `com.bandlab.video.uploader.impl.UploadMedia`.
   */
  completeVideoUpload(uploadID: string, body: unknown, options?: RequestOptions): APIPromise<UploadMedia> {
    return this._client.put(path`/uploads/videos/${uploadID}`, { body, ...options });
  }
}

/**
 * Evidence: `apk` — `com.bandlab.tools.spatial.screen.worker.api.SpatialStudioUploadResponse`.
 */
export interface SpatialStudioUploadResponse {
  download_url?: string;

  success?: boolean;
}

/**
 * Evidence: `apk` — `com.bandlab.video.uploader.api.FileUploadSession`.
 */
export interface FileUploadSession {
  id?: string;

  parts?: Array<FileUploadPart>;

  previewUploadUrl?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.video.uploader.api.FileUploadPart`.
 */
export interface FileUploadPart {
  id?: string;

  sizeInBytes?: number;

  state?: string;

  url?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.video.uploader.impl.UploadMedia`.
 */
export interface UploadMedia {
  id?: string;

  previewUrl?: string;
}

export interface UploadCreateProjectSampleParams {
  projectID: string;

  regionID: string;

  body: unknown;
}

export declare namespace Uploads {
  export {
    type FileUploadPart as FileUploadPart,
    type FileUploadSession as FileUploadSession,
    type SpatialStudioUploadResponse as SpatialStudioUploadResponse,
    type UploadCreateProjectSampleParams as UploadCreateProjectSampleParams,
    type UploadMedia as UploadMedia,
  };
}

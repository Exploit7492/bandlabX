// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as Shared from './shared';
import * as BandsAPI from './bands/bands';
import * as PostsAPI from './collections/posts';
import * as CommentsAPI from './posts/comments';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Images extends APIResource {
  /**
   * Create a image post
   *
   * @example
   * ```ts
   * const post = await client.images.createPost(
   *   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   * );
   * ```
   */
  createPost(
    imageID: string,
    body: ImageCreatePostParams,
    options?: RequestOptions,
  ): APIPromise<PostsAPI.Post> {
    return this._client.post(path`/images/${imageID}/posts`, { body, ...options });
  }

  /**
   * Uploads an album picture
   *
   * Evidence: `apk` — `AlbumsImageService`, `POST images/albums`. Response typed from
   * `com.bandlab.common.models.PictureResponse`.
   */
  createAlbum(body: unknown, options?: RequestOptions): APIPromise<PictureResponse> {
    return this._client.post('/images/albums', { body, ...options });
  }

  /**
   * Uploads a band background picture
   *
   * Evidence: `apk` — `BandImageService`, `POST images/bandBackgrounds`. Response typed from
   * `com.bandlab.common.models.PictureResponse`.
   */
  createBandBackground(body: unknown, options?: RequestOptions): APIPromise<PictureResponse> {
    return this._client.post('/images/bandBackgrounds', { body, ...options });
  }

  /**
   * Uploads a band picture
   *
   * Evidence: `apk` — `BandImageService`, `POST images/bands`. Response typed from
   * `com.bandlab.common.models.PictureResponse`.
   */
  createBand(body: unknown, options?: RequestOptions): APIPromise<PictureResponse> {
    return this._client.post('/images/bands', { body, ...options });
  }

  /**
   * Uploads a collection picture
   *
   * Evidence: `apk` — `CollectionsImageService`, `POST images/collections`. Response typed from
   * `com.bandlab.common.models.PictureResponse`.
   */
  createCollection(body: unknown, options?: RequestOptions): APIPromise<PictureResponse> {
    return this._client.post('/images/collections', { body, ...options });
  }

  /**
   * Uploads a community picture
   *
   * Evidence: `apk` — `CommunitiesImageService`, `POST images/communities`. Response typed from
   * `com.bandlab.common.models.PictureResponse`.
   */
  createCommunity(body: unknown, options?: RequestOptions): APIPromise<PictureResponse> {
    return this._client.post('/images/communities', { body, ...options });
  }

  /**
   * Uploads a distribution release picture
   *
   * Evidence: `apk` — `DistroImageService`, `POST images/distroReleases`. Response typed from
   * `com.bandlab.common.models.PictureResponse`.
   */
  createDistroRelease(body: unknown, options?: RequestOptions): APIPromise<PictureResponse> {
    return this._client.post('/images/distroReleases', { body, ...options });
  }

  /**
   * Uploads an effect preset picture
   *
   * Evidence: `apk` — `PresetPictureUploadService`, `POST images/effect-presets`. Response typed
   * from `com.bandlab.common.models.PictureResponse`.
   */
  createEffectPreset(body: unknown, options?: RequestOptions): APIPromise<PictureResponse> {
    return this._client.post('/images/effect-presets', { body, ...options });
  }

  /**
   * Uploads a shout (image post) media
   *
   * Evidence: `apk` — `ShoutsService`, `POST images/posts`. Response typed from
   * `com.bandlab.video.uploader.impl.UploadMedia`.
   */
  createShout(body: unknown, options?: RequestOptions): APIPromise<UploadMedia> {
    return this._client.post('/images/posts', { body, ...options });
  }

  /**
   * Uploads a song picture
   *
   * Evidence: `apk` — `RemoteSongImageService`, `POST images/songs`. Response typed from
   * `com.bandlab.common.models.PictureResponse`.
   */
  createSong(body: unknown, options?: RequestOptions): APIPromise<PictureResponse> {
    return this._client.post('/images/songs', { body, ...options });
  }

  /**
   * Uploads a track picture
   *
   * Evidence: `apk` — `TrackImageService`, `POST images/tracks`. Response typed from
   * `com.bandlab.common.models.PictureResponse`.
   */
  createTrack(body: unknown, options?: RequestOptions): APIPromise<PictureResponse> {
    return this._client.post('/images/tracks', { body, ...options });
  }

  /**
   * Uploads the current user's background picture
   *
   * Evidence: `apk` — `MyProfileImageService`, `POST images/userBackgrounds`. Response typed from
   * `com.bandlab.bandlab.data.PictureResponse`.
   */
  createUserBackground(body: unknown, options?: RequestOptions): APIPromise<UserPictureResponse> {
    return this._client.post('/images/userBackgrounds', { body, ...options });
  }

  /**
   * Uploads the current user's profile picture
   *
   * Evidence: `apk` — `MyProfileImageService`, `POST images/users`. Response typed from
   * `com.bandlab.bandlab.data.PictureResponse`.
   */
  createUser(body: unknown, options?: RequestOptions): APIPromise<UserPictureResponse> {
    return this._client.post('/images/users', { body, ...options });
  }
}

/**
 * Evidence: `apk` — `com.bandlab.common.models.PictureResponse`.
 */
export interface PictureResponse {
  id?: string;

  url?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.bandlab.data.PictureResponse`.
 */
export interface UserPictureResponse {
  id?: string;

  url?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.video.uploader.impl.UploadMedia`.
 */
export interface UploadMedia {
  id?: string;

  previewUrl?: string;
}

export interface ImageCreatePostParams {
  id?: string;

  caption?: string;

  clientId?: PostsAPI.ClientID;

  comments?: Array<CommentsAPI.Comment>;

  counters?: Shared.PostCounters;

  createdOn?: string;

  creator?: BandsAPI.Creator;

  image?: Shared.ImageSample;

  message?: string;

  revision?: Shared.RevisionSummary;

  type?: 'Revision' | 'Image' | 'Video' | 'Text';

  video?: Shared.VideoSample;
}

export declare namespace Images {
  export {
    type ImageCreatePostParams as ImageCreatePostParams,
    type PictureResponse as PictureResponse,
    type UploadMedia as UploadMedia,
    type UserPictureResponse as UserPictureResponse,
  };
}

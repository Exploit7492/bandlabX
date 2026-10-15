// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as RevisionsAPI from './revisions';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Tracks extends APIResource {
  /**
   * Returns the artist of a track
   *
   * Evidence: `apk` — `ArtistService`, `GET tracks/{id}/artist`. Response typed from
   * `com.bandlab.common.models.Artist`.
   */
  retrieveArtist(trackID: string, options?: RequestOptions): APIPromise<RevisionsAPI.Artist> {
    return this._client.get(path`/tracks/${trackID}/artist`, options);
  }

  /**
   * Returns a download URI for a track's audio
   *
   * Evidence: `apk` — `RemoteAudioUriService`, `GET tracks/{id}?format=m4a`. The app sends
   * `format=m4a`; the response is `com.bandlab.audio.downloader.api.SampleUri`.
   */
  retrieveDownload(
    trackID: string,
    query: TrackRetrieveDownloadParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<RevisionsAPI.SampleUri> {
    return this._client.get(path`/tracks/${trackID}`, { query, ...options });
  }
}

export interface TrackRetrieveDownloadParams {
  /**
   * The app sends `m4a`; other values are not evidenced.
   */
  format?: string;
}

export declare namespace Tracks {
  export { type TrackRetrieveDownloadParams as TrackRetrieveDownloadParams };
}

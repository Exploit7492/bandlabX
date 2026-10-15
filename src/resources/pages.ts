// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Pages extends APIResource {
  /**
   * Duplicates a project
   *
   * Evidence: `apk` — `SongDuplicateService`, `POST projects/{id}/duplicates`. Response typed from
   * `com.bandlab.song.duplicate.DuplicateSongResponse`.
   */
  duplicateProject(
    projectID: string,
    body: unknown,
    options?: RequestOptions,
  ): APIPromise<DuplicateSongResponse> {
    return this._client.post(path`/projects/${projectID}/duplicates`, { body, ...options });
  }

  /**
   * Returns a user's bio page
   *
   * Evidence: `apk` — `FindMeOnService`, `GET users/{id}/pages/bio`. Response typed from
   * `com.bandlab.user.profile.find.me.on.api.BioPage`.
   */
  retrieveBio(userID: string, options?: RequestOptions): APIPromise<BioPage> {
    return this._client.get(path`/users/${userID}/pages/bio`, options);
  }

  /**
   * Returns a user's bio page state
   *
   * Evidence: `apk` — `FindMeOnService`, `GET users/{id}/pages/bio/state`. Response typed from
   * `com.bandlab.user.profile.find.me.on.api.BioPageState`.
   */
  retrieveBioState(userID: string, options?: RequestOptions): APIPromise<BioPageState> {
    return this._client.get(path`/users/${userID}/pages/bio/state`, options);
  }
}

/**
 * Evidence: `apk` — `com.bandlab.song.duplicate.DuplicateSongResponse`.
 */
export interface DuplicateSongResponse {
  id?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.user.profile.find.me.on.api.BioPage`.
 */
export interface BioPage {
  isPublic?: boolean;

  picture?: unknown;
}

/**
 * Evidence: `apk` — `com.bandlab.user.profile.find.me.on.api.BioPageState`.
 */
export interface BioPageState {
  initiatorHasBio?: boolean;

  userHasBio?: boolean;

  userPicture?: unknown;
}

export declare namespace Pages {
  export {
    type DuplicateSongResponse as DuplicateSongResponse,
    type BioPage as BioPage,
    type BioPageState as BioPageState,
  };
}

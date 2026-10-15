// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Soundbanks extends APIResource {
  /**
   * Returns the soundbank library
   *
   * Evidence: `apk` — `SoundBanksService`, `GET soundbanks`. Response typed from
   * `com.bandlab.soundbanks.manager.SoundBanksLibrary`.
   */
  list(options?: RequestOptions): APIPromise<SoundBanksLibrary> {
    return this._client.get('/soundbanks', options);
  }
}

/**
 * Evidence: `apk` — `com.bandlab.soundbanks.manager.SoundBanksLibrary`.
 */
export interface SoundBanksLibrary {
  categories?: Array<unknown>;

  collections?: Array<unknown>;

  explore?: unknown;

  programChangeToSoundbank?: unknown;

  soundbankToProgramChange?: unknown;

  soundbanks?: Array<unknown>;
}

export declare namespace Soundbanks {
  export { type SoundBanksLibrary as SoundBanksLibrary };
}

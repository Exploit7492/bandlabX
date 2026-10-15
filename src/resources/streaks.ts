// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';

export class Streaks extends APIResource {
  /**
   * Enrolls the current user in the streaks program
   *
   * Evidence: `apk` — `FeedStreaksService`, `POST streaks/enroll`. No APK response shape.
   */
  enroll(body: unknown, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/streaks/enroll', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns the current user's streak
   *
   * Evidence: `apk` — `FeedStreaksService`, `GET streaks/me`. Response typed from
   * `com.bandlab.feed.streaks.api.FeedStreaksData`.
   */
  retrieve(options?: RequestOptions): APIPromise<FeedStreaksData> {
    return this._client.get('/streaks/me', options);
  }

  /**
   * Marks the streak-lost notification as sent
   *
   * Evidence: `apk` — `FeedStreaksService`, `POST streaks/streak-lost-notified`. No APK response
   * shape.
   */
  markLostNotified(body: unknown, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/streaks/streak-lost-notified', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

/**
 * Evidence: `apk` — `com.bandlab.feed.streaks.api.FeedStreaksData`.
 */
export interface FeedStreaksData {
  enrolled?: boolean;

  streakCounter?: number;

  currentWeek?: number;

  hasStreakHistory?: boolean;

  streakActive?: boolean;

  streakLostLastWeek?: boolean;

  streakLostNotified?: boolean;
}

export declare namespace Streaks {
  export { type FeedStreaksData as FeedStreaksData };
}

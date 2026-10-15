// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';

export class Passwords extends APIResource {
  /**
   * Changes password
   */
  change(body: PasswordChangeParams, options?: RequestOptions): APIPromise<void> {
    return this._client.put('/passwords', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Resets password
   */
  reset(body: PasswordResetParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/passwords', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Sends restore password email
   */
  sendRestoreEmail(params: PasswordSendRestoreEmailParams, options?: RequestOptions): APIPromise<void> {
    const { email } = params;
    return this._client.delete('/passwords', {
      query: { email },
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Resets a password from an emailed code
   *
   * Evidence: `apk` — `AuthManagementService`, `POST passwords/reset`. No APK response shape.
   */
  resetPassword(body: PasswordResetPasswordParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/passwords/reset', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface PasswordChangeParams {
  newPassword?: string;

  oldPassword?: string;
}

export interface PasswordResetParams {
  code?: string;

  newPassword?: string;

  userId?: string;
}

export interface PasswordSendRestoreEmailParams {
  email: string;
}

export interface PasswordResetPasswordParams {
  code?: string;

  newPassword?: string;

  userId?: string;
}

export declare namespace Passwords {
  export {
    type PasswordChangeParams as PasswordChangeParams,
    type PasswordResetParams as PasswordResetParams,
    type PasswordSendRestoreEmailParams as PasswordSendRestoreEmailParams,
    type PasswordResetPasswordParams as PasswordResetPasswordParams,
  };
}

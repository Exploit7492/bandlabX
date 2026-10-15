// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';

export class Authorizations extends APIResource {
  /**
   * Generates a session key
   *
   * @example
   * ```ts
   * const response =
   *   await client.authorizations.createSessionKey();
   * ```
   */
  createSessionKey(
    body: AuthorizationCreateSessionKeyParams,
    options?: RequestOptions,
  ): APIPromise<AuthorizationCreateSessionKeyResponse> {
    return this._client.post('/authorizations', { body, ...options });
  }

  /**
   * Lists the two-factor methods available to a user
   *
   * Evidence: `apk` — `AuthService`, `GET authorization/two-factor-methods`. Response typed from
   * `com.bandlab.auth.models.TwoFactorAuthEmailResponse`.
   */
  listTwoFactorMethods(
    query: AuthorizationListTwoFactorMethodsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<TwoFactorAuthEmailResponse> {
    return this._client.get('/authorization/two-factor-methods', { query, ...options });
  }

  /**
   * Sends a two-factor code by email
   *
   * Evidence: `apk` — `AuthService`, `POST authorization/two-factor-requests/email`. Response typed
   * from `com.bandlab.auth.models.TwoFactorSendCodeResponse`.
   */
  createTwoFactorRequest(body: unknown, options?: RequestOptions): APIPromise<TwoFactorSendCodeResponse> {
    return this._client.post('/authorization/two-factor-requests/email', { body, ...options });
  }

  /**
   * Exchanges credentials for a session
   *
   * Evidence: `apk` — `AuthService`, `POST connect/token`. Response typed from
   * `com.bandlab.auth.models.Session`.
   */
  createToken(body: unknown, options?: RequestOptions): APIPromise<Session> {
    return this._client.post('/connect/token', { body, ...options });
  }

  /**
   * Returns an external nonce token
   *
   * Evidence: `apk` — `AuthService`, `GET external/token`. Response typed from
   * `com.bandlab.auth.models.NonceToken`.
   */
  retrieveExternalToken(
    query: AuthorizationRetrieveExternalTokenParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<NonceToken> {
    return this._client.get('/external/token', { query, ...options });
  }

  /**
   * Logs the current session out
   *
   * Evidence: `apk` — `AuthService`, `POST logout`. No APK response shape.
   */
  logout(body: unknown, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/logout', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

/**
 * Evidence: `apk` — `com.bandlab.auth.models.TwoFactorAuthEmailResponse`.
 */
export interface TwoFactorAuthEmailResponse {
  email?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.auth.models.TwoFactorSendCodeResponse`.
 */
export interface TwoFactorSendCodeResponse {
  authenticityToken?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.auth.models.Session`.
 */
export interface Session {
  access_token?: string;

  expires_in?: number;

  token_type?: string;

  refresh_token?: string;

  scope?: string;

  wasRegistered?: boolean;

  user_id?: string;

  id_token?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.auth.models.NonceToken`.
 */
export interface NonceToken {
  token?: string;
}

export interface AuthorizationListTwoFactorMethodsParams {
  [key: string]: unknown;
}

export interface AuthorizationRetrieveExternalTokenParams {
  [key: string]: unknown;
}

export type Provider = 'Password' | 'Key' | 'Token' | 'Google' | 'Facebook' | 'Twitter' | 'Soundcloud';

/**
 * Successful operation
 */
export interface AuthorizationCreateSessionKeyResponse {
  expireDate?: string;

  provider?: Provider;

  refreshToken?: string;

  sessionKey?: string;

  wasRegistered?: boolean;
}

export interface AuthorizationCreateSessionKeyParams {
  accessToken?: string;

  email?: string;

  key?: string;

  login?: string;

  name?: string;

  password?: string;

  provider?: Provider;

  referral?: string;

  refreshToken?: string;

  register?: boolean;

  rememberMe?: boolean;

  username?: string;
}

export declare namespace Authorizations {
  export {
    type Provider as Provider,
    type AuthorizationCreateSessionKeyResponse as AuthorizationCreateSessionKeyResponse,
    type AuthorizationCreateSessionKeyParams as AuthorizationCreateSessionKeyParams,
    type TwoFactorAuthEmailResponse as TwoFactorAuthEmailResponse,
    type TwoFactorSendCodeResponse as TwoFactorSendCodeResponse,
    type Session as Session,
    type NonceToken as NonceToken,
    type AuthorizationListTwoFactorMethodsParams as AuthorizationListTwoFactorMethodsParams,
    type AuthorizationRetrieveExternalTokenParams as AuthorizationRetrieveExternalTokenParams,
  };
}

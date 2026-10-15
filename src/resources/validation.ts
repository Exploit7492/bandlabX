// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Validation extends APIResource {
  /**
   * Validates the user fields
   */
  validate(
    entityType: 'user' | 'band' | 'song',
    query: ValidationValidateParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ValidationValidateResponse> {
    return this._client.get(path`/validation/${entityType}`, { query, ...options });
  }

  /**
   * Validates a community name
   *
   * Evidence: `apk` — `CommunitiesService`, `GET validation/community`. Response typed from
   * `com.bandlab.network.models.auth.Availability`.
   */
  validateCommunity(
    query: ValidationValidateParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ValidationValidateResponse> {
    return this._client.get('/validation/community', { query, ...options });
  }

  /**
   * Validates distro release fields
   *
   * Evidence: `apk` — `DistroService`, `GET validation/distro`. Response typed from
   * `com.bandlab.distro.api.models.FieldValidationResponse`.
   */
  validateDistro(
    query: ValidationValidateParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<FieldValidationResponse> {
    return this._client.get('/validation/distro', { query, ...options });
  }
}

/**
 * Evidence: `apk` — `com.bandlab.distro.api.models.FieldValidationResponse`.
 */
export interface FieldValidationResponse {
  isValid?: boolean;

  errorMessage?: string;
}

/**
 * Successful operation
 */
export interface ValidationValidateResponse {
  isAvailable?: boolean;

  isValid?: boolean;
}

export interface ValidationValidateParams {
  name?: string;

  username?: string;
}

export declare namespace Validation {
  export {
    type ValidationValidateResponse as ValidationValidateResponse,
    type ValidationValidateParams as ValidationValidateParams,
    type FieldValidationResponse as FieldValidationResponse,
  };
}

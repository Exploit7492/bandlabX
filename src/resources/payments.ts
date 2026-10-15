// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';
import { MembershipStatus } from './membership';

export class Payments extends APIResource {
  /**
   * Creates a payment intent for a beat purchase
   *
   * Evidence: `apk` — `CheckoutService`,
   * `POST checkout/products/beats/payment-providers/google-play-store/payment-intents`. Response
   * typed from `com.bandlab.billing.api.PaymentIntent`.
   */
  createBeatPaymentIntent(body: unknown, options?: RequestOptions): APIPromise<PaymentIntent> {
    return this._client.post('/checkout/products/beats/payment-providers/google-play-store/payment-intents', {
      body,
      ...options,
    });
  }

  /**
   * Creates a payment intent for a profile boost
   *
   * Evidence: `apk` — `CheckoutService`,
   * `POST checkout/products/boost-profile/payment-providers/google-play-store/payment-intents`.
   * Response typed from `com.bandlab.billing.api.PaymentIntent`.
   */
  createBoostProfilePaymentIntent(body: unknown, options?: RequestOptions): APIPromise<PaymentIntent> {
    return this._client.post(
      '/checkout/products/boost-profile/payment-providers/google-play-store/payment-intents',
      { body, ...options },
    );
  }

  /**
   * Creates a payment intent for a post boost
   *
   * Evidence: `apk` — `CheckoutService`,
   * `POST checkout/products/boost/payment-providers/google-play-store/payment-intents`. Response
   * typed from `com.bandlab.billing.api.PaymentIntent`.
   */
  createBoostPaymentIntent(body: unknown, options?: RequestOptions): APIPromise<PaymentIntent> {
    return this._client.post('/checkout/products/boost/payment-providers/google-play-store/payment-intents', {
      body,
      ...options,
    });
  }

  /**
   * Creates a payment intent for a membership purchase
   *
   * Evidence: `apk` — `CheckoutService`,
   * `POST checkout/products/membership/payment-providers/google-play-store/payment-intents`.
   * Response typed from `com.bandlab.billing.google.play.subs.SubsPurchaseStamp`.
   */
  createMembershipPaymentIntent(body: unknown, options?: RequestOptions): APIPromise<SubsPurchaseStamp> {
    return this._client.post(
      '/checkout/products/membership/payment-providers/google-play-store/payment-intents',
      { body, ...options },
    );
  }

  /**
   * Confirms a membership payment intent
   *
   * Evidence: `apk` — `CheckoutService`,
   * `POST checkout/products/membership/payment-providers/google-play-store/payment-intents/{paymentIntentId}/payment-confirmations`.
   * Response typed from `com.bandlab.network.models.MembershipStatus`.
   */
  confirmMembershipPayment(
    paymentIntentID: string,
    body: unknown,
    options?: RequestOptions,
  ): APIPromise<MembershipStatus> {
    return this._client.post(
      path`/checkout/products/membership/payment-providers/google-play-store/payment-intents/${paymentIntentID}/payment-confirmations`,
      { body, ...options },
    );
  }

  /**
   * Confirms a payment intent for any product
   *
   * Evidence: `apk` — `CheckoutService`,
   * `POST checkout/products/{product}/payment-providers/google-play-store/payment-intents/{paymentIntentId}/payment-confirmations`.
   * No APK response shape.
   */
  confirmPayment(
    paymentIntentID: string,
    params: PaymentConfirmParams,
    options?: RequestOptions,
  ): APIPromise<void> {
    const { product, ...body } = params;
    return this._client.post(
      path`/checkout/products/${product}/payment-providers/google-play-store/payment-intents/${paymentIntentID}/payment-confirmations`,
      {
        body,
        ...options,
        headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
      },
    );
  }
}

/**
 * Evidence: `apk` — `com.bandlab.billing.api.PaymentIntent`.
 */
export interface PaymentIntent {
  id?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.billing.google.play.subs.SubsPurchaseStamp`.
 */
export interface SubsPurchaseStamp {
  id?: string;

  isTrial?: boolean;

  replacementMode?: string;
}

export interface PaymentConfirmParams {
  product: string;

  [key: string]: unknown;
}

export declare namespace Payments {
  export {
    type PaymentIntent as PaymentIntent,
    type SubsPurchaseStamp as SubsPurchaseStamp,
    type PaymentConfirmParams as PaymentConfirmParams,
  };
}

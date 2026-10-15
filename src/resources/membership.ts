// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Membership extends APIResource {
  /**
   * Returns a user's AI-token balance (coins service)
   *
   * Evidence: `apk` — `CoinsService`, `GET coins/users/{userId}/ai-tokens/balance`. Response typed
   * from `com.bandlab.song.starter.root.impl.tokens.TokensBalanceDTO`.
   */
  retrieveCoinsTokenBalance(userID: string, options?: RequestOptions): APIPromise<TokensBalanceDTO> {
    return this._client.get(path`/coins/users/${userID}/ai-tokens/balance`, options);
  }

  /**
   * Returns a user's membership status
   *
   * Evidence: `apk` — `MembershipService`, `GET experiment/users/{id}/membership-status`. Response
   * typed from `com.bandlab.network.models.MembershipStatusShort`.
   */
  retrieveStatus(userID: string, options?: RequestOptions): APIPromise<MembershipStatusShort> {
    return this._client.get(path`/experiment/users/${userID}/membership-status`, options);
  }

  /**
   * Returns a membership cancellation survey
   *
   * Evidence: `apk` — `MembershipSurveyService`, `GET membership/surveys/{id}`. Response typed from
   * `com.bandlab.payments.membership.manage.cancellation.screen.service.SurveyQuestion`.
   */
  retrieveSurvey(surveyID: string, options?: RequestOptions): APIPromise<SurveyQuestion> {
    return this._client.get(path`/membership/surveys/${surveyID}`, options);
  }

  /**
   * Submits answers to a membership cancellation survey
   *
   * Evidence: `apk` — `MembershipSurveyService`, `POST membership/surveys/{id}/answers`. No APK
   * response shape.
   */
  submitSurveyAnswers(surveyID: string, body: unknown, options?: RequestOptions): APIPromise<void> {
    return this._client.post(path`/membership/surveys/${surveyID}/answers`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns a user's membership plan
   *
   * Evidence: `apk` — `MembershipService`, `GET users/{id}/membership-plan`. Response typed from
   * `com.bandlab.network.models.MembershipStatus`.
   */
  retrievePlan(userID: string, options?: RequestOptions): APIPromise<MembershipStatus> {
    return this._client.get(path`/users/${userID}/membership-plan`, options);
  }

  /**
   * Returns a user's wallet AI-token balance
   *
   * Evidence: `apk` — `WalletService`, `GET wallet/users/{userId}/balances/ai-tokens`. Response
   * typed from `com.bandlab.payments.ai.token.api.model.AiTokenBalance`.
   */
  retrieveWalletTokenBalance(userID: string, options?: RequestOptions): APIPromise<AiTokenBalance> {
    return this._client.get(path`/wallet/users/${userID}/balances/ai-tokens`, options);
  }
}

/**
 * Evidence: `apk` — `com.bandlab.song.starter.root.impl.tokens.TokensBalanceDTO`.
 */
export interface TokensBalanceDTO {
  allTokens?: number;

  isAllTokensBalanceLow?: boolean;
}

/**
 * Evidence: `apk` — `com.bandlab.network.models.MembershipStatusShort`.
 */
export interface MembershipStatusShort {
  isActive?: boolean;
}

/**
 * Evidence: `apk` —
 * `com.bandlab.payments.membership.manage.cancellation.screen.service.SurveyQuestion`.
 */
export interface SurveyQuestion {
  question?: string;

  answerOptions?: unknown;
}

/**
 * Evidence: `apk` — `com.bandlab.network.models.MembershipStatus`.
 */
export interface MembershipStatus {
  plan?: string;

  displayName?: string;

  paymentProvider?: string;

  billingIssue?: unknown;

  isTrial?: boolean;

  billingInterval?: string;

  nextBillingInterval?: string;

  startedOn?: string;

  expiresOn?: string;

  priceCurrency?: string;

  availableFeatures?: Array<string>;

  canceledOn?: string;

  isTrialAllowed?: boolean;

  nextRenewalPrice?: number;

  nextPlan?: string;

  pauseEffectiveAt?: string;

  unpauseEffectiveAt?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.payments.ai.token.api.model.AiTokenBalance`.
 */
export interface AiTokenBalance {
  total?: number;

  available?: number;

  held?: number;
}

export declare namespace Membership {
  export {
    type TokensBalanceDTO as TokensBalanceDTO,
    type MembershipStatusShort as MembershipStatusShort,
    type SurveyQuestion as SurveyQuestion,
    type MembershipStatus as MembershipStatus,
    type AiTokenBalance as AiTokenBalance,
  };
}

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as MeAPI from './me';
import * as GenresAPI from './genres';
import * as BandsAPI from './bands/bands';
import * as PostsAPI from './collections/posts';
import * as LikesAPI from './collections/likes';
import * as PostsPostsAPI from './posts/posts';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Revisions extends APIResource {
  /**
   * Create a new revision
   *
   * @example
   * ```ts
   * const revision = await client.revisions.create();
   * ```
   */
  create(body: RevisionCreateParams, options?: RequestOptions): APIPromise<Revision> {
    return this._client.post('/revisions', { body, ...options });
  }

  /**
   * Returns a single revision
   *
   * @example
   * ```ts
   * const revision = await client.revisions.retrieve(
   *   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   * );
   * ```
   */
  retrieve(revisionID: string, options?: RequestOptions): APIPromise<Revision> {
    return this._client.get(path`/revisions/${revisionID}`, options);
  }

  /**
   * Updates a revision
   *
   * @example
   * ```ts
   * const revision = await client.revisions.update(
   *   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   * );
   * ```
   */
  update(revisionID: string, body: RevisionUpdateParams, options?: RequestOptions): APIPromise<Revision> {
    return this._client.patch(path`/revisions/${revisionID}`, { body, ...options });
  }

  /**
   * Add a play
   *
   * @example
   * ```ts
   * await client.revisions.addPlay(
   *   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   * );
   * ```
   */
  addPlay(revisionID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.post(path`/revisions/${revisionID}/plays`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns the artist of a revision
   *
   * Evidence: `apk` — `ArtistService`, `GET revisions/{id}/artist`. Response typed from
   * `com.bandlab.common.models.Artist`.
   */
  retrieveArtist(revisionID: string, options?: RequestOptions): APIPromise<Artist> {
    return this._client.get(path`/revisions/${revisionID}/artist`, options);
  }

  /**
   * Returns the posts that fork this revision
   *
   * Evidence: `apk` — `PostsService`, `GET revisions/{id}/forks/posts`. The app method is
   * `getRevisionForksPosts`; the response element is `com.bandlab.post.objects.Post`.
   */
  listForksPosts(
    revisionID: string,
    query: RevisionListForksPostsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PostsPostsAPI.PostList> {
    return this._client.get(path`/revisions/${revisionID}/forks/posts`, { query, ...options });
  }

  /**
   * Returns the users who liked a revision
   *
   * Evidence: `apk` — `RemoteLightRevisionService`, `GET revisions/{id}/likes/users`. The
   * response element is `com.bandlab.user.models.User`.
   */
  listLikesUsers(
    revisionID: string,
    query: RevisionListLikesUsersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<LikesAPI.UserSummaryList> {
    return this._client.get(path`/revisions/${revisionID}/likes/users`, { query, ...options });
  }

  /**
   * Returns the share keys of a revision
   *
   * Evidence: `apk` — `RevisionSharedKeyService`, `GET revisions/{id}/sharings`. Response
   * typed from `com.bandlab.revision.objects.SharedKey`.
   */
  retrieveSharings(revisionID: string, options?: RequestOptions): APIPromise<SharedKey> {
    return this._client.get(path`/revisions/${revisionID}/sharings`, options);
  }

  /**
   * Returns the studio breakdown of a revision
   *
   * Evidence: `apk` — `TrackRewindService`, `GET revisions/{id}/studio-breakdown`. Response
   * typed from `com.bandlab.track.rewind.screen.TrackRewindBreakdown`.
   */
  retrieveStudioBreakdown(revisionID: string, options?: RequestOptions): APIPromise<TrackRewindBreakdown> {
    return this._client.get(path`/revisions/${revisionID}/studio-breakdown`, options);
  }

  /**
   * Returns the video posts of a revision
   *
   * Evidence: `apk` — `TrackVideoPostsService.getRevisionVideoPosts`,
   * `GET revisions/{id}/track-videos/posts`. The response element is
   * `com.bandlab.post.objects.Post`.
   */
  listTrackVideoPosts(
    revisionID: string,
    query: RevisionListTrackVideoPostsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PostsPostsAPI.PostList> {
    return this._client.get(path`/revisions/${revisionID}/track-videos/posts`, { query, ...options });
  }

  /**
   * Returns a download URI for a revision's audio
   *
   * Evidence: `apk` — `RemoteAudioUriService`, `GET revisions/{id}?format=m4a`. The app sends
   * `format=m4a`; the response is `com.bandlab.audio.downloader.api.SampleUri`. This shares its
   * route with `retrieve`, so the two are told apart by the `format` query parameter.
   */
  retrieveDownload(
    revisionID: string,
    query: RevisionRetrieveDownloadParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SampleUri> {
    return this._client.get(path`/revisions/${revisionID}`, { query, ...options });
  }

  /**
   * Reprocesses a revision's mixdown
   *
   * Evidence: `apk` — `TrackMixdownService`, `POST revisions/{id}/mixdown/reprocess`. The
   * request body model is obfuscated in the app, so the body is `unknown` under rule D12.
   */
  reprocessMixdown(revisionID: string, body: unknown, options?: RequestOptions): APIPromise<void> {
    return this._client.post(path`/revisions/${revisionID}/mixdown/reprocess`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Updates an auto-pitch contour region
   *
   * Evidence: `apk` — `AiPitchService`, `PATCH contour/{projectID}/{regionID}/{activeSampleID}`.
   * The route sits at the top level rather than under `/revisions`, but the resource design
   * assigns it to this leaf. The request body model is obfuscated, so it is `unknown` under
   * rule D12.
   */
  updateContour(
    activeSampleID: string,
    params: RevisionUpdateContourParams,
    options?: RequestOptions,
  ): APIPromise<void> {
    const { projectID, regionID, body } = params;
    return this._client.patch(path`/contour/${projectID}/${regionID}/${activeSampleID}`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

/**
 * Evidence: `apk` — `com.bandlab.common.models.Artist`. The app marks `id` and `username` as
 * required; fields stay optional here to match the rest of this file.
 */
export interface Artist {
  id?: string;

  about?: string;

  activityStatus?: string;

  city?: string;

  collaborationStatus?: string;

  conversationId?: string;

  counters?: Artist.Counter;

  country?: string;

  followingState?: string;

  isIncognitoEnabled?: boolean;

  isPrivate?: boolean;

  isTippable?: boolean;

  isVerified?: boolean;

  links?: Array<unknown>;

  picture?: MeAPI.Picture;

  username?: string;
}

export namespace Artist {
  export interface Counter {
    totalVideoPlays?: number;
  }
}

/**
 * Evidence: `apk` — `com.bandlab.audio.downloader.api.SampleUri`.
 */
export interface SampleUri {
  expiryDate?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.revision.objects.SharedKey`.
 */
export interface SharedKey {
  sharedKey?: string;
}

/**
 * Evidence: `apk` — `com.bandlab.track.rewind.screen.TrackRewindBreakdown`. Nested objects the
 * app does not describe field-by-field stay `unknown` under rule D12.
 */
export interface TrackRewindBreakdown {
  autoPitches?: Array<unknown>;

  band?: unknown;

  beats?: Array<unknown>;

  postId?: string;

  setup?: TrackRewindBreakdown.Setup;

  sounds?: Array<unknown>;

  track?: TrackRewindBreakdown.Track;

  trackPost?: unknown;
}

export namespace TrackRewindBreakdown {
  export interface AutoPitch {
    intensity?: number;

    isPremium?: boolean;

    slug?: string;
  }

  export interface Mastering {
    intensity?: number;

    isPremium?: boolean;

    slug?: string;
  }

  export interface Setup {
    bpm?: number;

    key?: string;

    mastering?: TrackRewindBreakdown.Mastering;

    timeSignature?: string;
  }

  export interface Track {
    creator?: unknown;

    isExplicit?: boolean;

    picture?: MeAPI.Picture;
  }
}

export interface RevisionListForksPostsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface RevisionListLikesUsersParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface RevisionListTrackVideoPostsParams {
  after?: string;

  before?: string;

  limit?: number;

  offset?: number;
}

export interface RevisionRetrieveDownloadParams {
  /**
   * The app sends `m4a`; other values are not evidenced.
   */
  format?: string;
}

export interface RevisionUpdateContourParams {
  projectID: string;

  regionID: string;

  body: unknown;
}

export interface AudioSample {
  id?: string;

  name?: string;

  status?: PostsAPI.Status;
}

export interface Mastering {
  drySampleId?: string;

  preset?: string;
}

export interface Revision {
  id?: string;

  auxChannels?: Array<Revision.AuxChannel>;

  clientId?: PostsAPI.ClientID;

  counters?: RevisionCounters;

  createdOn?: string;

  creator?: BandsAPI.Creator;

  description?: string;

  genres?: Array<GenresAPI.Genre>;

  isFork?: boolean;

  isPublic?: boolean;

  key?: string;

  mastering?: Mastering;

  mixdown?: AudioSample;

  modifiedOn?: string;

  parentId?: string;

  postId?: string;

  samples?: Array<AudioSample>;

  song?: PostsPostsAPI.SongSummary;

  stamp?: string;

  tracks?: Array<AudioSample>;
}

export namespace Revision {
  export interface AuxChannel {
    id?: string;

    effects?: Array<AuxChannel.Effect>;

    preset?: string;

    returnLevel?: number;
  }

  export namespace AuxChannel {
    export interface Effect {
      bypass?: boolean;

      params?: unknown;

      slug?: string;
    }
  }
}

export interface RevisionCounters {
  comments?: number;

  forks?: number;

  likes?: number;

  plays?: number;
}

export interface RevisionCreateParams {
  id?: string;

  auxChannels?: Array<RevisionCreateParams.AuxChannel>;

  clientId?: PostsAPI.ClientID;

  counters?: RevisionCounters;

  createdOn?: string;

  creator?: BandsAPI.Creator;

  description?: string;

  genres?: Array<GenresAPI.Genre>;

  isFork?: boolean;

  isPublic?: boolean;

  key?: string;

  mastering?: Mastering;

  mixdown?: AudioSample;

  modifiedOn?: string;

  parentId?: string;

  postId?: string;

  samples?: Array<AudioSample>;

  song?: PostsPostsAPI.SongSummary;

  stamp?: string;

  tracks?: Array<AudioSample>;
}

export namespace RevisionCreateParams {
  export interface AuxChannel {
    id?: string;

    effects?: Array<AuxChannel.Effect>;

    preset?: string;

    returnLevel?: number;
  }

  export namespace AuxChannel {
    export interface Effect {
      bypass?: boolean;

      params?: unknown;

      slug?: string;
    }
  }
}

export interface RevisionUpdateParams {
  id?: string;

  auxChannels?: Array<RevisionUpdateParams.AuxChannel>;

  clientId?: PostsAPI.ClientID;

  counters?: RevisionCounters;

  createdOn?: string;

  creator?: BandsAPI.Creator;

  description?: string;

  genres?: Array<GenresAPI.Genre>;

  isFork?: boolean;

  isPublic?: boolean;

  key?: string;

  mastering?: Mastering;

  mixdown?: AudioSample;

  modifiedOn?: string;

  parentId?: string;

  postId?: string;

  samples?: Array<AudioSample>;

  song?: PostsPostsAPI.SongSummary;

  stamp?: string;

  tracks?: Array<AudioSample>;
}

export namespace RevisionUpdateParams {
  export interface AuxChannel {
    id?: string;

    effects?: Array<AuxChannel.Effect>;

    preset?: string;

    returnLevel?: number;
  }

  export namespace AuxChannel {
    export interface Effect {
      bypass?: boolean;

      params?: unknown;

      slug?: string;
    }
  }
}

export declare namespace Revisions {
  export {
    type Artist as Artist,
    type AudioSample as AudioSample,
    type Mastering as Mastering,
    type Revision as Revision,
    type RevisionCounters as RevisionCounters,
    type RevisionCreateParams as RevisionCreateParams,
    type RevisionListForksPostsParams as RevisionListForksPostsParams,
    type RevisionListLikesUsersParams as RevisionListLikesUsersParams,
    type RevisionListTrackVideoPostsParams as RevisionListTrackVideoPostsParams,
    type RevisionRetrieveDownloadParams as RevisionRetrieveDownloadParams,
    type RevisionUpdateContourParams as RevisionUpdateContourParams,
    type RevisionUpdateParams as RevisionUpdateParams,
    type SampleUri as SampleUri,
    type SharedKey as SharedKey,
    type TrackRewindBreakdown as TrackRewindBreakdown,
  };
}

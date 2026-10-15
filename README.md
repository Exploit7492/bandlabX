# Bandlab SDK TypeScript API Library

[![NPM version](<https://img.shields.io/npm/v/bandlab-sdk.svg?label=npm%20(stable)>)](https://npmjs.org/package/bandlab-sdk) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/bandlab-sdk)

This library provides convenient access to the Bandlab SDK REST API from server-side TypeScript or JavaScript.

The full API of this library can be found in [api.md](api.md).

It is generated with [Stainless](https://www.stainless.com/).

## Installation

```sh
npm install bandlab-sdk
```

## Usage

The full API of this library can be found in [api.md](api.md).

<!-- prettier-ignore -->
```js
import BandlabSDK from 'bandlab-sdk';

const client = new BandlabSDK({
  bearerToken: process.env['BANDLAB_SDK_BEARER_TOKEN'], // This is the default and can be omitted
  environment: 'environment_1', // defaults to 'production'
});

const response = await client.validation.validate('user');

console.log(response.isValid);
```

### Request & Response types

This library includes TypeScript definitions for all request params and response fields. You may import and use them like so:

<!-- prettier-ignore -->
```ts
import BandlabSDK from 'bandlab-sdk';

const client = new BandlabSDK({
  bearerToken: process.env['BANDLAB_SDK_BEARER_TOKEN'], // This is the default and can be omitted
  environment: 'environment_1', // defaults to 'production'
});

const response: BandlabSDK.ValidationValidateResponse = await client.validation.validate('user');
```

Documentation for each method, request param, and response field are available in docstrings and will appear on hover in most modern editors.

## Handling errors

When the library is unable to connect to the API,
or if the API returns a non-success status code (i.e., 4xx or 5xx response),
a subclass of `APIError` will be thrown:

<!-- prettier-ignore -->
```ts
const response = await client.validation.validate('user').catch(async (err) => {
  if (err instanceof BandlabSDK.APIError) {
    console.log(err.status); // 400
    console.log(err.name); // BadRequestError
    console.log(err.headers); // {server: 'nginx', ...}
  } else {
    throw err;
  }
});
```

Error codes are as follows:

| Status Code | Error Type                 |
| ----------- | -------------------------- |
| 400         | `BadRequestError`          |
| 401         | `AuthenticationError`      |
| 403         | `PermissionDeniedError`    |
| 404         | `NotFoundError`            |
| 422         | `UnprocessableEntityError` |
| 429         | `RateLimitError`           |
| >=500       | `InternalServerError`      |
| N/A         | `APIConnectionError`       |

### Retries

Certain errors will be automatically retried 2 times by default, with a short exponential backoff.
Connection errors (for example, due to a network connectivity problem), 408 Request Timeout, 409 Conflict,
429 Rate Limit, and >=500 Internal errors will all be retried by default.

You can use the `maxRetries` option to configure or disable this:

<!-- prettier-ignore -->
```js
// Configure the default for all requests:
const client = new BandlabSDK({
  maxRetries: 0, // default is 2
});

// Or, configure per-request:
await client.validation.validate('user', {
  maxRetries: 5,
});
```

### Timeouts

Requests time out after 1 minute by default. You can configure this with a `timeout` option:

<!-- prettier-ignore -->
```ts
// Configure the default for all requests:
const client = new BandlabSDK({
  timeout: 20 * 1000, // 20 seconds (default is 1 minute)
});

// Override per-request:
await client.validation.validate('user', {
  timeout: 5 * 1000,
});
```

On timeout, an `APIConnectionTimeoutError` is thrown.

Note that requests which time out will be [retried twice by default](#retries).

## Advanced Usage

### Accessing raw Response data (e.g., headers)

The "raw" `Response` returned by `fetch()` can be accessed through the `.asResponse()` method on the `APIPromise` type that all methods return.
This method returns as soon as the headers for a successful response are received and does not consume the response body, so you are free to write custom parsing or streaming logic.

You can also use the `.withResponse()` method to get the raw `Response` along with the parsed data.
Unlike `.asResponse()` this method consumes the body, returning once it is parsed.

<!-- prettier-ignore -->
```ts
const client = new BandlabSDK();

const response = await client.validation.validate('user').asResponse();
console.log(response.headers.get('X-My-Header'));
console.log(response.statusText); // access the underlying Response object

const { data: response, response: raw } = await client.validation.validate('user').withResponse();
console.log(raw.headers.get('X-My-Header'));
console.log(response.isValid);
```

### Logging

> [!IMPORTANT]
> All log messages are intended for debugging only. The format and content of log messages
> may change between releases.

#### Log levels

The log level can be configured in two ways:

1. Via the `BANDLAB_SDK_LOG` environment variable
2. Using the `logLevel` client option (overrides the environment variable if set)

```ts
import BandlabSDK from 'bandlab-sdk';

const client = new BandlabSDK({
  logLevel: 'debug', // Show all log messages
});
```

Available log levels, from most to least verbose:

- `'debug'` - Show debug messages, info, warnings, and errors
- `'info'` - Show info messages, warnings, and errors
- `'warn'` - Show warnings and errors (default)
- `'error'` - Show only errors
- `'off'` - Disable all logging

At the `'debug'` level, all HTTP requests and responses are logged, including headers and bodies.
Some authentication-related headers are redacted, but sensitive data in request and response bodies
may still be visible.

#### Custom logger

By default, this library logs to `globalThis.console`. You can also provide a custom logger.
Most logging libraries are supported, including [pino](https://www.npmjs.com/package/pino), [winston](https://www.npmjs.com/package/winston), [bunyan](https://www.npmjs.com/package/bunyan), [consola](https://www.npmjs.com/package/consola), [signale](https://www.npmjs.com/package/signale), and [@std/log](https://jsr.io/@std/log). If your logger doesn't work, please open an issue.

When providing a custom logger, the `logLevel` option still controls which messages are emitted, messages
below the configured level will not be sent to your logger.

```ts
import BandlabSDK from 'bandlab-sdk';
import pino from 'pino';

const logger = pino();

const client = new BandlabSDK({
  logger: logger.child({ name: 'BandlabSDK' }),
  logLevel: 'debug', // Send all messages to pino, allowing it to filter
});
```

### Making custom/undocumented requests

This library is typed for convenient access to the documented API. If you need to access undocumented
endpoints, params, or response properties, the library can still be used.

#### Undocumented endpoints

To make requests to undocumented endpoints, you can use `client.get`, `client.post`, and other HTTP verbs.
Options on the client, such as retries, will be respected when making these requests.

```ts
await client.post('/some/path', {
  body: { some_prop: 'foo' },
  query: { some_query_arg: 'bar' },
});
```

#### Undocumented request params

To make requests using undocumented parameters, you may use `// @ts-expect-error` on the undocumented
parameter. This library doesn't validate at runtime that the request matches the type, so any extra values you
send will be sent as-is.

```ts
client.validation.validate({
  // ...
  // @ts-expect-error baz is not yet public
  baz: 'undocumented option',
});
```

For requests with the `GET` verb, any extra params will be in the query, all other requests will send the
extra param in the body.

If you want to explicitly send an extra argument, you can do so with the `query`, `body`, and `headers` request
options.

#### Undocumented response properties

To access undocumented response properties, you may access the response object with `// @ts-expect-error` on
the response object, or cast the response object to the requisite type. Like the request params, we do not
validate or strip extra properties from the response from the API.

### Customizing the fetch client

By default, this library expects a global `fetch` function is defined.

If you want to use a different `fetch` function, you can either polyfill the global:

```ts
import fetch from 'my-fetch';

globalThis.fetch = fetch;
```

Or pass it to the client:

```ts
import BandlabSDK from 'bandlab-sdk';
import fetch from 'my-fetch';

const client = new BandlabSDK({ fetch });
```

### Fetch options

If you want to set custom `fetch` options without overriding the `fetch` function, you can provide a `fetchOptions` object when instantiating the client or making a request. (Request-specific options override client options.)

```ts
import BandlabSDK from 'bandlab-sdk';

const client = new BandlabSDK({
  fetchOptions: {
    // `RequestInit` options
  },
});
```

#### Configuring proxies

To modify proxy behavior, you can provide custom `fetchOptions` that add runtime-specific proxy
options to requests:

<img src="https://raw.githubusercontent.com/stainless-api/sdk-assets/refs/heads/main/node.svg" align="top" width="18" height="21"> **Node** <sup>[[docs](https://github.com/nodejs/undici/blob/main/docs/docs/api/ProxyAgent.md#example---proxyagent-with-fetch)]</sup>

```ts
import BandlabSDK from 'bandlab-sdk';
import * as undici from 'undici';

const proxyAgent = new undici.ProxyAgent('http://localhost:8888');
const client = new BandlabSDK({
  fetchOptions: {
    dispatcher: proxyAgent,
  },
});
```

<img src="https://raw.githubusercontent.com/stainless-api/sdk-assets/refs/heads/main/bun.svg" align="top" width="18" height="21"> **Bun** <sup>[[docs](https://bun.sh/guides/http/proxy)]</sup>

```ts
import BandlabSDK from 'bandlab-sdk';

const client = new BandlabSDK({
  fetchOptions: {
    proxy: 'http://localhost:8888',
  },
});
```

<img src="https://raw.githubusercontent.com/stainless-api/sdk-assets/refs/heads/main/deno.svg" align="top" width="18" height="21"> **Deno** <sup>[[docs](https://docs.deno.com/api/deno/~/Deno.createHttpClient)]</sup>

```ts
import BandlabSDK from 'npm:bandlab-sdk';

const httpClient = Deno.createHttpClient({ proxy: { url: 'http://localhost:8888' } });
const client = new BandlabSDK({
  fetchOptions: {
    client: httpClient,
  },
});
```

## Frequently Asked Questions

## Semantic versioning

This package generally follows [SemVer](https://semver.org/spec/v2.0.0.html) conventions, though certain backwards-incompatible changes may be released as minor versions:

1. Changes that only affect static types, without breaking runtime behavior.
2. Changes to library internals which are technically public but not intended or documented for external use. _(Please open a GitHub issue to let us know if you are relying on such internals.)_
3. Changes that we do not expect to impact the vast majority of users in practice.

We take backwards-compatibility seriously and work hard to ensure you can rely on a smooth upgrade experience.

We are keen for your feedback; please open an [issue](https://www.github.com/unityaisolutions/bandlab-sdk-typescript/issues) with questions, bugs, or suggestions.

## Requirements

TypeScript >= 4.9 is supported.

The following runtimes are supported:

- Web browsers (Up-to-date Chrome, Firefox, Safari, Edge, and more)
- Node.js 20 LTS or later ([non-EOL](https://endoflife.date/nodejs)) versions.
- Deno v1.28.0 or higher.
- Bun 1.0 or later.
- Cloudflare Workers.
- Vercel Edge Runtime.
- Jest 28 or greater with the `"node"` environment (`"jsdom"` is not supported at this time).
- Nitro v2.6 or greater.

Note that React Native is not supported at this time.

If you are interested in other runtime environments, please open or upvote an issue on GitHub.

## Container image

A prebuilt image is published to GitHub Container Registry:

```bash
docker run --rm ghcr.io/zapier-codes/bandlab-sdk-typescript:latest
```

The SDK has no runtime dependencies, so the image carries the compiled package only — no
`node_modules`, no toolchain. It is not a server: its default command loads the SDK from the image
and asserts that a call reaches the right URL, so a successful run prints:

```
bandlab-sdk container smoke OK (17 exports)
  http://127.0.0.1:9/validation/user
  http://127.0.0.1:9/users/some-user
```

To build it yourself and run the same check:

```bash
./scripts/container-smoke
```

See [`docs/handover/CONTAINER.md`](./docs/handover/CONTAINER.md) for the build stages, the image
layout, and how publishing works. The image is published by
[`.github/workflows/container.yml`](./.github/workflows/container.yml) on every push to `main` and
on `v*` tags, with tags `latest`, `main` and `sha-<commit>`.

## Contributing

See [the contributing documentation](./CONTRIBUTING.md).

<!-- BEGIN GENERATED RESOURCES -->

## Resources

Every top-level resource on the client. Each links into [api.md](api.md), which lists
the full method set.

| Resource                | Endpoints | Docs                                    |
| ----------------------- | --------- | --------------------------------------- |
| `client.users`          | 79        | [Users](api.md#users)                   |
| `client.ai`             | 30        | [AI](api.md#ai)                         |
| `client.sounds`         | 30        | [Sounds](api.md#sounds)                 |
| `client.posts`          | 21        | [Posts](api.md#posts)                   |
| `client.bands`          | 18        | [Bands](api.md#bands)                   |
| `client.messaging`      | 18        | [Messaging](api.md#messaging)           |
| `client.search`         | 17        | [Search](api.md#search)                 |
| `client.beats`          | 16        | [Beats](api.md#beats)                   |
| `client.albums`         | 15        | [Albums](api.md#albums)                 |
| `client.communities`    | 15        | [Communities](api.md#communities)       |
| `client.distro`         | 15        | [Distro](api.md#distro)                 |
| `client.library`        | 15        | [Library](api.md#library)               |
| `client.collections`    | 14        | [Collections](api.md#collections)       |
| `client.feeds`          | 13        | [Feeds](api.md#feeds)                   |
| `client.images`         | 13        | [Images](api.md#images)                 |
| `client.me`             | 13        | [Me](api.md#me)                         |
| `client.revisions`      | 13        | [Revisions](api.md#revisions)           |
| `client.songs`          | 12        | [Songs](api.md#songs)                   |
| `client.effects`        | 10        | [Effects](api.md#effects)               |
| `client.promote`        | 9         | [Promote](api.md#promote)               |
| `client.authorizations` | 6         | [Authorizations](api.md#authorizations) |
| `client.membership`     | 6         | [Membership](api.md#membership)         |
| `client.passwords`      | 6         | [Passwords](api.md#passwords)           |
| `client.payments`       | 6         | [Payments](api.md#payments)             |
| `client.aiVideos`       | 5         | [AI Videos](api.md#ai-videos)           |
| `client.misc`           | 5         | [Misc](api.md#misc)                     |
| `client.videos`         | 5         | [Videos](api.md#videos)                 |
| `client.invites`        | 4         | [Invites](api.md#invites)               |
| `client.logins`         | 4         | [Logins](api.md#logins)                 |
| `client.settings`       | 4         | [Settings](api.md#settings)             |
| `client.uploads`        | 4         | [Uploads](api.md#uploads)               |
| `client.pages`          | 3         | [Pages](api.md#pages)                   |
| `client.streaks`        | 3         | [Streaks](api.md#streaks)               |
| `client.validation`     | 3         | [Validation](api.md#validation)         |
| `client.emails`         | 2         | [Emails](api.md#emails)                 |
| `client.genres`         | 2         | [Genres](api.md#genres)                 |
| `client.push`           | 2         | [Push](api.md#push)                     |
| `client.syncedLyrics`   | 2         | [Synced Lyrics](api.md#synced-lyrics)   |
| `client.tracks`         | 2         | [Tracks](api.md#tracks)                 |
| `client.versions`       | 2         | [Versions](api.md#versions)             |
| `client.badges`         | 1         | [Badges](api.md#badges)                 |
| `client.feedback`       | 1         | [Feedback](api.md#feedback)             |
| `client.labels`         | 1         | [Labels](api.md#labels)                 |
| `client.reports`        | 1         | [Reports](api.md#reports)               |
| `client.skills`         | 1         | [Skills](api.md#skills)                 |
| `client.soundbanks`     | 1         | [Soundbanks](api.md#soundbanks)         |

### Examples

One call per domain. Each example prefers a read (`GET`); a resource with no read endpoint
shows its first call instead.

```ts
// users
const result = await client.users.retrieve('user-id');
```

```ts
// users.blocks.users
const result = await client.users.blocks.users.list('user-id', {});
```

```ts
// users.contacts
const result = await client.users.contacts.listBands('user-id', {});
```

```ts
// users.followers
const result = await client.users.followers.list('user-id', {});
```

```ts
// users.following
const result = await client.users.following.list('user-id', {});
```

```ts
// users.invites
const result = await client.users.invites.list('user-id', {});
```

```ts
// users.notifications
const result = await client.users.notifications.list('user-id', {});
```

```ts
// users.recommendations
const result = await client.users.recommendations.listUsers('user-id', {});
```

```ts
// ai
const result = await client.ai.retrieveDailyLimits();
```

```ts
// sounds
const result = await client.sounds.listInstruments({});
```

```ts
// posts
const result = await client.posts.list({});
```

```ts
// posts.comments
const result = await client.posts.comments.list('post-id', {});
```

```ts
// posts.likes
const result = await client.posts.likes.list('post-id', {});
```

```ts
// posts.mentions
const result = await client.posts.mentions.listSuggestions({});
```

```ts
// posts.polls
const result = await client.posts.polls.removeVote('option-id', {});
```

```ts
// posts.reactions
const result = await client.posts.reactions.listUsers('post-id', {});
```

```ts
// bands
const result = await client.bands.retrieve('band-id');
```

```ts
// bands.invites
const result = await client.bands.invites.list('band-id', {});
```

```ts
// bands.members
const result = await client.bands.members.list('band-id', {});
```

```ts
// messaging.channels
const result = await client.messaging.channels.retrieve('channel-id', {});
```

```ts
// messaging.conversations
const result = await client.messaging.conversations.list('current-user-id', {});
```

```ts
// messaging.conversations.attachments
const result = await client.messaging.conversations.attachments.retrieveUploadState('attachment-id', {});
```

```ts
// messaging.conversations.blocks
const result = await client.messaging.conversations.blocks.blockMember('member-id', {});
```

```ts
// messaging.conversations.members
const result = await client.messaging.conversations.members.list('conversation-id');
```

```ts
// messaging.conversations.messages
const result = await client.messaging.conversations.messages.list('conversation-id', {});
```

```ts
// messaging.conversations.readReceipts
const result = await client.messaging.conversations.readReceipts.list('conversation-id', {});
```

```ts
// search
const result = await client.search.globalSearch({});
```

```ts
// beats
const result = await client.beats.list({});
```

```ts
// albums
const result = await client.albums.retrieve('album-id');
```

```ts
// communities
const result = await client.communities.retrieve('community-id');
```

```ts
// communities.invites
const result = await client.communities.invites.list('community-id', {});
```

```ts
// communities.members
const result = await client.communities.members.list('community-id', {});
```

```ts
// communities.posts
const result = await client.communities.posts.list('community-id', {});
```

```ts
// distro
const result = await client.distro.retrieveOverview('user-id');
```

```ts
// library
const result = await client.library.listLikedCollections('user-id', {});
```

```ts
// collections
const result = await client.collections.retrieve('collection-id');
```

```ts
// collections.likes
const result = await client.collections.likes.list('collection-id', {});
```

```ts
// collections.posts
const result = await client.collections.posts.retrieve('post-id', {});
```

```ts
// feeds
const result = await client.feeds.retrieveForYou('user-id', {});
```

```ts
// images
const result = await client.images.createPost('image-id', {});
```

```ts
// me
const result = await client.me.retrieve();
```

```ts
// revisions
const result = await client.revisions.retrieve('revision-id');
```

```ts
// songs
const result = await client.songs.retrieve('song-id');
```

```ts
// songs.collaborators
const result = await client.songs.collaborators.list('song-id', {});
```

```ts
// songs.invites
const result = await client.songs.invites.listInvites('song-id', {});
```

```ts
// songs.revisions
const result = await client.songs.revisions.list('song-id', {});
```

```ts
// effects
const result = await client.effects.retrievePresetByLink('link-token');
```

```ts
// promote
const result = await client.promote.listBeatsPromoBanners({});
```

```ts
// authorizations
const result = await client.authorizations.listTwoFactorMethods({});
```

```ts
// membership
const result = await client.membership.retrieveCoinsTokenBalance('user-id');
```

```ts
// passwords
const result = await client.passwords.change({});
```

```ts
// payments
const result = await client.payments.createBeatPaymentIntent({});
```

```ts
// aiVideos
const result = await client.aiVideos.retrieveTokenPrice();
```

```ts
// misc
const result = await client.misc.retrieveBeatsFilters();
```

```ts
// videos
const result = await client.videos.retrieve('video-id', {});
```

```ts
// invites
const result = await client.invites.retrieve('invite-id');
```

```ts
// logins
const result = await client.logins.list();
```

```ts
// settings.notifications.email
const result = await client.settings.notifications.email.retrieve();
```

```ts
// settings.notifications.push
const result = await client.settings.notifications.push.retrieve();
```

```ts
// uploads
const result = await client.uploads.createSpatialProject({});
```

```ts
// pages
const result = await client.pages.retrieveBio('user-id');
```

```ts
// streaks
const result = await client.streaks.retrieve();
```

```ts
// validation
const result = await client.validation.validate('user', {});
```

```ts
// emails.confirmations
const result = await client.emails.confirmations.confirm({});
```

```ts
// genres
const result = await client.genres.list();
```

```ts
// push.registrations
const result = await client.push.registrations.create({});
```

```ts
// syncedLyrics
const result = await client.syncedLyrics.retrieve('post-id');
```

```ts
// tracks
const result = await client.tracks.retrieveArtist('track-id');
```

```ts
// versions
const result = await client.versions.retrieve('client-id');
```

```ts
// badges
const result = await client.badges.list();
```

```ts
// feedback
const result = await client.feedback.create({});
```

```ts
// labels
const result = await client.labels.list();
```

```ts
// reports
const result = await client.reports.create({});
```

```ts
// skills
const result = await client.skills.list();
```

```ts
// soundbanks
const result = await client.soundbanks.list();
```

<!-- END GENERATED RESOURCES -->

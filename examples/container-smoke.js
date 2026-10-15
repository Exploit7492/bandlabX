// Smoke check for the published image. Proves the built SDK loads from the image and that a call
// reaches the right URL, without touching the network: `fetch` is stubbed, so this runs anywhere.
//
// `scripts/container-smoke` runs it inside the image, and the image's default command is this file.
// It is the container equivalent of the evidence tests in `tests/api-resources/**`, which assert the
// URL that actually reaches `fetch`.

const assert = require('node:assert');

const BandlabSDK = require('bandlab-sdk');

const calls = [];

globalThis.fetch = async (input) => {
  calls.push(typeof input === 'string' ? input : input.url);
  return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
};

(async () => {
  const client = new BandlabSDK({ bearerToken: 'container-smoke', baseURL: 'http://127.0.0.1:9' });

  await client.validation.validate('user', {}).catch(() => undefined);
  await client.users.retrieve('some-user').catch(() => undefined);

  assert.ok(calls.length >= 2, `expected 2 requests, saw ${calls.length}`);
  assert.ok(calls[0].includes('/validation/user'), `unexpected first URL: ${calls[0]}`);
  assert.ok(calls[1].includes('/users/some-user'), `unexpected second URL: ${calls[1]}`);

  console.log(`bandlab-sdk container smoke OK (${Object.keys(BandlabSDK).length} exports)`);
  console.log(`  ${calls[0]}`);
  console.log(`  ${calls[1]}`);
})().catch((err) => {
  console.error('bandlab-sdk container smoke FAILED');
  console.error(err);
  process.exit(1);
});

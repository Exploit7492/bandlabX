// Evidence-backed request-path tests for the revisions leaf (3.a.ii.zi).
//
// Each test calls the resource method and inspects the URL that actually reaches `fetch`, so the
// assertions pin the paths recorded in docs/research/apk-endpoints.md. Two of them cover the
// route collision on `/revisions/{id}`: `retrieve` and `retrieveDownload` share a path and are
// told apart by the `format` query parameter, which is exactly what the app does.

import BandlabSDK from 'bandlab-sdk';

const REVISION_ID = '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e';

function makeClient(): BandlabSDK {
  return new BandlabSDK({ bearerToken: 'My Bearer Token', baseURL: 'http://127.0.0.1:4010' });
}

/** Run `fn`, capture the URL of the first request, and answer it with a stub response. */
async function captureURL(fn: (c: BandlabSDK) => Promise<unknown>): Promise<string> {
  const calls: string[] = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async (input: any) => {
    calls.push(typeof input === 'string' ? input : input?.url ?? String(input));
    return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
  }) as typeof fetch;
  try {
    await fn(makeClient()).catch(() => undefined);
  } finally {
    globalThis.fetch = realFetch;
  }
  if (!calls.length) throw new Error('no request was issued');
  return calls[0]!;
}

describe('revisions paths match the APK evidence', () => {
  test('retrieveArtist targets /revisions/{id}/artist', async () => {
    const url = await captureURL((c) => c.revisions.retrieveArtist(REVISION_ID));
    expect(url).toContain(`/revisions/${REVISION_ID}/artist`);
  });

  test('listForksPosts targets /revisions/{id}/forks/posts', async () => {
    const url = await captureURL((c) => c.revisions.listForksPosts(REVISION_ID));
    expect(url).toContain(`/revisions/${REVISION_ID}/forks/posts`);
  });

  test('listLikesUsers targets /revisions/{id}/likes/users', async () => {
    const url = await captureURL((c) => c.revisions.listLikesUsers(REVISION_ID));
    expect(url).toContain(`/revisions/${REVISION_ID}/likes/users`);
  });

  test('retrieveSharings targets /revisions/{id}/sharings', async () => {
    const url = await captureURL((c) => c.revisions.retrieveSharings(REVISION_ID));
    expect(url).toContain(`/revisions/${REVISION_ID}/sharings`);
  });

  test('retrieveStudioBreakdown targets /revisions/{id}/studio-breakdown', async () => {
    const url = await captureURL((c) => c.revisions.retrieveStudioBreakdown(REVISION_ID));
    expect(url).toContain(`/revisions/${REVISION_ID}/studio-breakdown`);
  });

  test('listTrackVideoPosts targets /revisions/{id}/track-videos/posts', async () => {
    const url = await captureURL((c) => c.revisions.listTrackVideoPosts(REVISION_ID));
    expect(url).toContain(`/revisions/${REVISION_ID}/track-videos/posts`);
  });

  test('reprocessMixdown posts to /revisions/{id}/mixdown/reprocess', async () => {
    const url = await captureURL((c) => c.revisions.reprocessMixdown(REVISION_ID, {}));
    expect(url).toContain(`/revisions/${REVISION_ID}/mixdown/reprocess`);
  });

  test('updateContour patches /contour/{projectID}/{regionID}/{activeSampleID}', async () => {
    const url = await captureURL((c) =>
      c.revisions.updateContour('sample-1', { projectID: 'proj-1', regionID: 'region-1', body: {} }),
    );
    expect(url).toContain('/contour/proj-1/region-1/sample-1');
  });

  test('retrieve and retrieveDownload share /revisions/{id} and differ by format', async () => {
    const plain = await captureURL((c) => c.revisions.retrieve(REVISION_ID));
    expect(plain).toContain(`/revisions/${REVISION_ID}`);
    expect(plain).not.toContain('format=');

    const download = await captureURL((c) => c.revisions.retrieveDownload(REVISION_ID, { format: 'm4a' }));
    expect(download).toContain(`/revisions/${REVISION_ID}`);
    expect(download).toContain('format=m4a');
  });
});

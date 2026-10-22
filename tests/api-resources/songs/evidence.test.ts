// Evidence-backed request-path tests for the songs leaf (3.a.i.zi).
//
// These are real assertions, not Prism stubs: each one calls the resource method and inspects the
// URL that actually reaches `fetch`. They pin the 2026-10-15 fix where `songs.listPosts` and
// `songs.invites` used the singular `/song/...` route, which the live API answers with the
// framework 404 page. The APK, the route probe and the model-binding error all use `/songs/...`.

import BandlabSDK from 'bandlabx';

const SONG_ID = '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e';

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

describe('songs paths use the evidenced plural /songs route', () => {
  test('listPosts targets /songs/{id}/posts', async () => {
    const url = await captureURL((c) => c.songs.listPosts(SONG_ID));
    expect(url).toContain(`/songs/${SONG_ID}/posts`);
  });

  test('invites.listInvites targets /songs/{id}/invites', async () => {
    const url = await captureURL((c) => c.songs.invites.listInvites(SONG_ID));
    expect(url).toContain(`/songs/${SONG_ID}/invites`);
  });

  test('invites.sendInvites targets /songs/{id}/invites', async () => {
    const url = await captureURL((c) => c.songs.invites.sendInvites(SONG_ID, { emails: ['a@b.c'] }));
    expect(url).toContain(`/songs/${SONG_ID}/invites`);
  });

  test('retrieveInviteLink targets /songs/{id}/invite-link', async () => {
    const url = await captureURL((c) => c.songs.retrieveInviteLink(SONG_ID));
    expect(url).toContain(`/songs/${SONG_ID}/invite-link`);
  });

  test('forks posts to /songs/forks', async () => {
    const url = await captureURL((c) => c.songs.forks({}));
    expect(url).toContain('/songs/forks');
  });

  test('no songs method builds a singular /song/ path', async () => {
    const urls = [];
    urls.push(await captureURL((c) => c.songs.listPosts(SONG_ID)));
    urls.push(await captureURL((c) => c.songs.invites.listInvites(SONG_ID)));
    urls.push(await captureURL((c) => c.songs.retrieveInviteLink(SONG_ID)));
    for (const url of urls) {
      expect(url).not.toMatch(/\/song\//);
    }
  });
});

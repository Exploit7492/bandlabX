// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import BandlabSDK from 'bandlabx';

const client = new BandlabSDK({
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource collaborators', () => {
  // Prism tests are disabled
  test.skip('list: only required params', async () => {
    const responsePromise = client.songs.collaborators.list('songId', {
      communityId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('list: required and optional params', async () => {
    const response = await client.songs.collaborators.list('songId', {
      communityId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      after: 'after',
      before: 'before',
      limit: 0,
      offset: 0,
    });
  });

  // Prism tests are disabled
  test.skip('remove: only required params', async () => {
    const responsePromise = client.songs.collaborators.remove('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      songId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('remove: required and optional params', async () => {
    const response = await client.songs.collaborators.remove('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      songId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
    });
  });
});

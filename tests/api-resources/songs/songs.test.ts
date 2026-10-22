// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import BandlabSDK from 'bandlabx';

const client = new BandlabSDK({
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource songs', () => {
  // Prism tests are disabled
  test.skip('retrieve', async () => {
    const responsePromise = client.songs.retrieve('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('update: only required params', async () => {
    const responsePromise = client.songs.update('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', { name: 'name' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('update: required and optional params', async () => {
    const response = await client.songs.update('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      name: 'name',
      id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      author: {
        id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
        conversationId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
        name: 'name',
        type: 'User',
        username: 'username',
      },
      collaborators: [
        {
          id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
          counters: { bands: 0, collections: 0, followers: 0, following: 0 },
          name: 'name',
          picture: { isDefault: true, l: 'l', m: 'm', s: 's', url: 'url' },
          username: 'username',
        },
      ],
      counters: { collaborators: 0, comments: 0, forks: 0, likes: 0, plays: 0, publicRevisions: 0 },
      createdOn: '2019-12-27T18:11:19.117Z',
      creator: {
        id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
        isVerified: true,
        name: 'name',
        picture: { isDefault: true, l: 'l', m: 'm', s: 's', url: 'url' },
        username: 'username',
      },
      description: 'description',
      isFork: true,
      isForkable: true,
      isPublic: true,
      modifiedOn: '2019-12-27T18:11:19.117Z',
      original: {
        creatorName: 'creatorName',
        name: 'name',
        picture: { isDefault: true, l: 'l', m: 'm', s: 's', url: 'url' },
        revisionId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
        songId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      },
      picture: { isDefault: true, l: 'l', m: 'm', s: 's', url: 'url' },
      slug: 'slug',
    });
  });

  // Prism tests are disabled
  test.skip('delete', async () => {
    const responsePromise = client.songs.delete('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('listPosts', async () => {
    const responsePromise = client.songs.listPosts('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('listPosts: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.songs.listPosts(
        '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
        { after: 'after', before: 'before', limit: 0, offset: 0 },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(BandlabSDK.NotFoundError);
  });
});

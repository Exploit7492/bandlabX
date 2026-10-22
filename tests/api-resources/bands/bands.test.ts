// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import BandlabSDK from 'bandlabx';

const client = new BandlabSDK({
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource bands', () => {
  // Prism tests are disabled
  test.skip('create: only required params', async () => {
    const responsePromise = client.bands.create({ name: 'name' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('create: required and optional params', async () => {
    const response = await client.bands.create({
      name: 'name',
      id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      about: 'about',
      conversationId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      counters: { members: 0 },
      createdOn: '2019-12-27T18:11:19.117Z',
      creator: {
        id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
        isVerified: true,
        name: 'name',
        picture: { isDefault: true, l: 'l', m: 'm', s: 's', url: 'url' },
        username: 'username',
      },
      genres: [{ id: 'id', name: 'name' }],
      isOpen: true,
      members: [{ id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', name: 'name', username: 'username' }],
      picture: { isDefault: true, l: 'l', m: 'm', s: 's', url: 'url' },
      username: 'username',
    });
  });

  // Prism tests are disabled
  test.skip('retrieve', async () => {
    const responsePromise = client.bands.retrieve('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e');
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
    const responsePromise = client.bands.update('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', { name: 'name' });
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
    const response = await client.bands.update('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      name: 'name',
      id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      about: 'about',
      conversationId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      counters: { members: 0 },
      createdOn: '2019-12-27T18:11:19.117Z',
      creator: {
        id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
        isVerified: true,
        name: 'name',
        picture: { isDefault: true, l: 'l', m: 'm', s: 's', url: 'url' },
        username: 'username',
      },
      genres: [{ id: 'id', name: 'name' }],
      isOpen: true,
      members: [{ id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', name: 'name', username: 'username' }],
      picture: { isDefault: true, l: 'l', m: 'm', s: 's', url: 'url' },
      username: 'username',
    });
  });

  // Prism tests are disabled
  test.skip('delete', async () => {
    const responsePromise = client.bands.delete('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e');
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
    const responsePromise = client.bands.listPosts('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e');
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
      client.bands.listPosts(
        '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
        { after: 'after', before: 'before', limit: 0, offset: 0 },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(BandlabSDK.NotFoundError);
  });

  // Prism tests are disabled
  test.skip('listSongs', async () => {
    const responsePromise = client.bands.listSongs('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('listSongs: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.bands.listSongs(
        '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
        { after: 'after', before: 'before', limit: 0, offset: 0 },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(BandlabSDK.NotFoundError);
  });
});

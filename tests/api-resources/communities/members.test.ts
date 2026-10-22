// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import BandlabSDK from 'bandlabx';

const client = new BandlabSDK({
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource members', () => {
  // Prism tests are disabled
  test.skip('retrieve: only required params', async () => {
    const responsePromise = client.communities.members.retrieve('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
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
  test.skip('retrieve: required and optional params', async () => {
    const response = await client.communities.members.retrieve('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      communityId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
    });
  });

  // Prism tests are disabled
  test.skip('update: only required params', async () => {
    const responsePromise = client.communities.members.update('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
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
  test.skip('update: required and optional params', async () => {
    const response = await client.communities.members.update('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      communityId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      about: 'about',
      badges: ['string'],
      counters: { bands: 0, collections: 0, followers: 0, following: 0 },
      createdOn: '2019-12-27T18:11:19.117Z',
      genres: [{ id: 'id', name: 'name' }],
      isTippable: true,
      isVerified: true,
      location: { city: 'city', Coordinates: { latitude: 0, longitude: 0 }, country: 'country' },
      name: 'name',
      picture: { isDefault: true, l: 'l', m: 'm', s: 's', url: 'url' },
      role: 'None',
      skills: [{ id: 'id', name: 'name' }],
      username: 'username',
    });
  });

  // Prism tests are disabled
  test.skip('list', async () => {
    const responsePromise = client.communities.members.list('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('list: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.communities.members.list(
        '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
        { after: 'after', before: 'before', limit: 0, offset: 0 },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(BandlabSDK.NotFoundError);
  });

  // Prism tests are disabled
  test.skip('delete: only required params', async () => {
    const responsePromise = client.communities.members.delete('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
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
  test.skip('delete: required and optional params', async () => {
    const response = await client.communities.members.delete('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      communityId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
    });
  });
});

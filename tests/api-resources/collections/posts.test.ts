// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import BandlabSDK from 'bandlabx';

const client = new BandlabSDK({
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource posts', () => {
  // Prism tests are disabled
  test.skip('retrieve: only required params', async () => {
    const responsePromise = client.collections.posts.retrieve('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      collectionId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
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
    const response = await client.collections.posts.retrieve('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      collectionId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
    });
  });

  // Prism tests are disabled
  test.skip('add: only required params', async () => {
    const responsePromise = client.collections.posts.add('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      collectionId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
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
  test.skip('add: required and optional params', async () => {
    const response = await client.collections.posts.add('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      collectionId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
    });
  });

  // Prism tests are disabled
  test.skip('remove: only required params', async () => {
    const responsePromise = client.collections.posts.remove('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      collectionId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
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
    const response = await client.collections.posts.remove('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      collectionId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
    });
  });

  // Prism tests are disabled
  test.skip('updatePosition: only required params', async () => {
    const responsePromise = client.collections.posts.updatePosition('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      collectionId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
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
  test.skip('updatePosition: required and optional params', async () => {
    const response = await client.collections.posts.updatePosition('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      collectionId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      order: 0,
    });
  });
});

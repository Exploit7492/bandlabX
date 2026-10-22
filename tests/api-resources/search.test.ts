// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import BandlabSDK from 'bandlabx';

const client = new BandlabSDK({
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource search', () => {
  // Prism tests are disabled
  test.skip('globalSearch: only required params', async () => {
    const responsePromise = client.search.globalSearch({ query: 'query' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('globalSearch: required and optional params', async () => {
    const response = await client.search.globalSearch({
      query: 'query',
      after: 'after',
      before: 'before',
      limit: 0,
      offset: 0,
    });
  });

  // Prism tests are disabled
  test.skip('searchBands: only required params', async () => {
    const responsePromise = client.search.searchBands({ query: 'query' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('searchBands: required and optional params', async () => {
    const response = await client.search.searchBands({
      query: 'query',
      after: 'after',
      before: 'before',
      limit: 0,
      offset: 0,
    });
  });

  // Prism tests are disabled
  test.skip('searchCollections: only required params', async () => {
    const responsePromise = client.search.searchCollections({ query: 'query' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('searchCollections: required and optional params', async () => {
    const response = await client.search.searchCollections({
      query: 'query',
      after: 'after',
      before: 'before',
      limit: 0,
      offset: 0,
    });
  });

  // Prism tests are disabled
  test.skip('searchSongs: only required params', async () => {
    const responsePromise = client.search.searchSongs({ query: 'query' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('searchSongs: required and optional params', async () => {
    const response = await client.search.searchSongs({
      query: 'query',
      after: 'after',
      before: 'before',
      limit: 0,
      offset: 0,
    });
  });

  // Prism tests are disabled
  test.skip('searchUsers: only required params', async () => {
    const responsePromise = client.search.searchUsers({ query: 'query' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('searchUsers: required and optional params', async () => {
    const response = await client.search.searchUsers({
      query: 'query',
      after: 'after',
      before: 'before',
      limit: 0,
      offset: 0,
    });
  });
});

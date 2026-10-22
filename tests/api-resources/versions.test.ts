// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import BandlabSDK from 'bandlabx';

const client = new BandlabSDK({
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource versions', () => {
  // Prism tests are disabled
  test.skip('retrieve', async () => {
    const responsePromise = client.versions.retrieve('clientId');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('validate: only required params', async () => {
    const responsePromise = client.versions.validate('version', {
      clientId: 'clientId',
      clientVersion: 'clientVersion',
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
  test.skip('validate: required and optional params', async () => {
    const response = await client.versions.validate('version', {
      clientId: 'clientId',
      clientVersion: 'clientVersion',
    });
  });
});

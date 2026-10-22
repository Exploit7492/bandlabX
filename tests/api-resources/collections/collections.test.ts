// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import BandlabSDK from 'bandlabx';

const client = new BandlabSDK({
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource collections', () => {
  // Prism tests are disabled
  test.skip('create: only required params', async () => {
    const responsePromise = client.collections.create({ name: 'name' });
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
    const response = await client.collections.create({
      name: 'name',
      id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      counters: { items: 0, likes: 0 },
      createdOn: '2019-12-27T18:11:19.117Z',
      creator: {
        id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
        isVerified: true,
        name: 'name',
        picture: { isDefault: true, l: 'l', m: 'm', s: 's', url: 'url' },
        username: 'username',
      },
      description: 'description',
      isPublic: true,
      lastUpdatedOn: '2019-12-27T18:11:19.117Z',
      picture: { isDefault: true, l: 'l', m: 'm', s: 's', url: 'url' },
      posts: [
        {
          id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
          caption: 'caption',
          clientId: 'Angular',
          comments: [
            {
              id: 0,
              content: 'content',
              createdOn: '2019-12-27T18:11:19.117Z',
              creator: {
                id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
                isVerified: true,
                name: 'name',
                picture: { isDefault: true, l: 'l', m: 'm', s: 's', url: 'url' },
                username: 'username',
              },
              timestamp: 0,
            },
          ],
          counters: { comments: 0, likes: 0, reposts: 0 },
          createdOn: '2019-12-27T18:11:19.117Z',
          creator: {
            id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
            isVerified: true,
            name: 'name',
            picture: { isDefault: true, l: 'l', m: 'm', s: 's', url: 'url' },
            username: 'username',
          },
          image: {
            id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
            counters: { likes: 0 },
            picture: { isDefault: true, l: 'l', m: 'm', s: 's', url: 'url' },
          },
          message: 'message',
          revision: {
            id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
            clientId: 'Angular',
            counters: { comments: 0, forks: 0, likes: 0, plays: 0 },
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
            isPublic: true,
            lyrics: { content: 'content' },
            mixdown: { id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', name: 'name', status: 'Empty' },
            parentId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
            postId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
            stamp: 'stamp',
          },
          type: 'Revision',
          video: {
            id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
            counters: { likes: 0, views: 0 },
            duration: 0,
            picture: { isDefault: true, l: 'l', m: 'm', s: 's', url: 'url' },
            status: 'Empty',
          },
        },
      ],
      type: 'Playlist',
    });
  });

  // Prism tests are disabled
  test.skip('retrieve', async () => {
    const responsePromise = client.collections.retrieve('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e');
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
    const responsePromise = client.collections.update('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      name: 'name',
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
    const response = await client.collections.update('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      name: 'name',
      id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      counters: { items: 0, likes: 0 },
      createdOn: '2019-12-27T18:11:19.117Z',
      creator: {
        id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
        isVerified: true,
        name: 'name',
        picture: { isDefault: true, l: 'l', m: 'm', s: 's', url: 'url' },
        username: 'username',
      },
      description: 'description',
      isPublic: true,
      lastUpdatedOn: '2019-12-27T18:11:19.117Z',
      picture: { isDefault: true, l: 'l', m: 'm', s: 's', url: 'url' },
      posts: [
        {
          id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
          caption: 'caption',
          clientId: 'Angular',
          comments: [
            {
              id: 0,
              content: 'content',
              createdOn: '2019-12-27T18:11:19.117Z',
              creator: {
                id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
                isVerified: true,
                name: 'name',
                picture: { isDefault: true, l: 'l', m: 'm', s: 's', url: 'url' },
                username: 'username',
              },
              timestamp: 0,
            },
          ],
          counters: { comments: 0, likes: 0, reposts: 0 },
          createdOn: '2019-12-27T18:11:19.117Z',
          creator: {
            id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
            isVerified: true,
            name: 'name',
            picture: { isDefault: true, l: 'l', m: 'm', s: 's', url: 'url' },
            username: 'username',
          },
          image: {
            id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
            counters: { likes: 0 },
            picture: { isDefault: true, l: 'l', m: 'm', s: 's', url: 'url' },
          },
          message: 'message',
          revision: {
            id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
            clientId: 'Angular',
            counters: { comments: 0, forks: 0, likes: 0, plays: 0 },
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
            isPublic: true,
            lyrics: { content: 'content' },
            mixdown: { id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', name: 'name', status: 'Empty' },
            parentId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
            postId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
            stamp: 'stamp',
          },
          type: 'Revision',
          video: {
            id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
            counters: { likes: 0, views: 0 },
            duration: 0,
            picture: { isDefault: true, l: 'l', m: 'm', s: 's', url: 'url' },
            status: 'Empty',
          },
        },
      ],
      type: 'Playlist',
    });
  });

  // Prism tests are disabled
  test.skip('delete', async () => {
    const responsePromise = client.collections.delete('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});

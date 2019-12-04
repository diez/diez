const requestMock = {
  get: (params: any, callback: any) => {
    callback(null, {status: 200}, 'this is the response');
  },
  post: (params: any, callback: any) => {
    callback(null, {status: 200}, 'this is the response');
  },
  put: (params: any, callback: any) => {
    callback(null, {status: 200}, 'this is the response');
  },
  del: (params: any, callback: any) => {
    callback(null, {status: 200}, 'this is the response');
  },
};

jest.doMock('request', () => requestMock);
jest.spyOn(requestMock, 'get');
jest.spyOn(requestMock, 'post');
jest.spyOn(requestMock, 'put');
jest.spyOn(requestMock, 'del');

import {del, get, post, put} from '../src/transport';

describe('transport', () => {
  describe('#get', () => {
    test('performs a promisified GET request', async () => {
      const resp = await get({url: 'http://foo.bar'});
      expect(requestMock.get).toHaveBeenCalled();
      expect(resp.body).toBe('this is the response');
    });
  });

  describe('#post', () => {
    test('performs a promisified POST request', async () => {
      const resp = await post({url: 'http://foo.bar'});
      expect(requestMock.get).toHaveBeenCalled();
      expect(resp.body).toBe('this is the response');
    });
  });

  describe('#put', () => {
    test('performs a promisified PUT request', async () => {
      const resp = await put({url: 'http://foo.bar'});
      expect(requestMock.get).toHaveBeenCalled();
      expect(resp.body).toBe('this is the response');
    });
  });

  describe('#delete', () => {
    test('performs a promisified DELETE request', async () => {
      const resp = await del({url: 'http://foo.bar'});
      expect(requestMock.get).toHaveBeenCalled();
      expect(resp.body).toBe('this is the response');
    });
  });
});

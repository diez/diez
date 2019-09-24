const mockFetch = jest.fn();
jest.doMock('node-fetch', () => mockFetch);

import {downloadStream} from '../src/utils';

afterEach(() => {
  mockFetch.mockReset();
});

describe('downloadStream', () => {
  test('basic functionality', async () => {
    mockFetch.mockResolvedValue({
      body: 'foobar',
    });
    const result = await downloadStream('https://cdn.diez.org/somefile.tgz');
    expect(result).toBe('foobar');
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith('https://cdn.diez.org/somefile.tgz');
  });
});

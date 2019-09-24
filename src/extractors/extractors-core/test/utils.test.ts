import {findPlugins} from '@diez/cli-core';
import {
  performExtraction,
} from '../src/utils';
import TestExtractor = require('./TestExtractor');

describe('utils', () => {
  test('perform extraction', async () => {
    const config = (await findPlugins()).get('.')!;
    config.providers = {
      extractors: [
        './test/TestExtractor',
      ],
    };

    TestExtractor.mockExport
      .mockImplementationOnce(() => {
        throw new Error('DoNotRetryMe!');
      })
      .mockImplementationOnce(() => {
        throw new Error('RetryMe!');
      })
      .mockImplementation(() => Promise.resolve());

    // Our test extractor only handles sources of 'foo'.
    expect(performExtraction({
      source: '!foo',
      assets: 'assets',
      code: 'code',
    }, 'projectRoot')).rejects.toThrow();

    // Here we have a valid source, but our test extractor throws an unretriable error.
    expect(performExtraction({
      source: 'foo',
      assets: 'assets',
      code: 'code',
    }, 'projectRoot')).rejects.toThrow();

    // This call should succeed.
    await performExtraction({
      source: 'foo',
      assets: 'assets',
      code: 'code',
    }, 'projectRoot');

    expect(TestExtractor.mockExport).toHaveBeenCalledWith(
      {
        source: 'foo',
        assets: 'assets',
        code: 'code',
      },
      'projectRoot',
      expect.anything(),
      'bar',
    );
  });
});

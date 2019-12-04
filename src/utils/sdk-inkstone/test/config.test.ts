import {inkstoneConfig, setConfig} from '../src/config';

describe('config', () => {
  describe('inkstoneConfig', () => {
    test('provides a default value for baseUrl', () => {
      expect(inkstoneConfig.baseUrl).toBeDefined();
    });
  });

  describe('setConfig', () => {
    test('replaces existing values with new ones', () => {
      setConfig({baseUrl: 'https://foo.bar'});
      expect(inkstoneConfig.baseUrl).toBe('https://foo.bar');
    });

    test('sets new valid values', () => {
      setConfig({authToken: 'xxxxx'});
      expect(inkstoneConfig.authToken).toBe('xxxxx');
    });
  });
});

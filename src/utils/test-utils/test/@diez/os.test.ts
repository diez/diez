import {homedir as realHomedir} from 'os';
import {cleanupMockOsData, mockOsData, mockOsFactory} from '../../src/mocks/os';

const {platform, homedir} = mockOsFactory();

describe('os mock', () => {
  test('basic functionality', async () => {
    mockOsData.platform = 'foobar';
    expect(platform()).toBe('foobar');
    cleanupMockOsData();
    expect(platform()).toBe('linux');
    expect(homedir()).not.toBe(realHomedir());
  });
});

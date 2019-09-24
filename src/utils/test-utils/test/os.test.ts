import {cleanupMockOsData, mockOsData} from '../src/mocks/os';

describe('os mock', () => {
  test('basic functionality', () => {
    expect(mockOsData.platform).toBe('linux');
    mockOsData.platform = 'windows-vista';
    cleanupMockOsData();
    expect(mockOsData.platform).toBe('linux');
  });
});

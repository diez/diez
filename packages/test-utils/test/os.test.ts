import {cleanupMockOsData, mockOsData} from '../src/utils';

describe('os mock', () => {
  test('basic functionality', () => {
    expect(mockOsData.platform).toBe('linux');
    mockOsData.platform = 'windows-vista';
    cleanupMockOsData();
    expect(mockOsData.platform).toBe('linux');
  });
});

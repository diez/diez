import {platform} from 'os';

/**
 * Provides a mock directory format for the mock filesystem.
 */
export interface MockDirectory {
  [key: string]: string | MockDirectory;
}

/**
 * Mock filesystem.
 */
export const mockFileSystem: MockDirectory = {};

/**
 * Resets the mock filesystem to initial state.
 */
export const cleanupMockFileSystem = () => {
  for (const key in mockFileSystem) {
    delete mockFileSystem[key];
  }
};

/**
 * Factory for our mock exec singleton.
 */
export const mockExec = (typeof jest === 'undefined' ? () => {} : jest.fn()) as jest.Mock;

/**
 * Resets the mock command data to initial state.
 */
export const cleanupMockCommandData = () => {
  mockExec.mockReset();
};

/**
 * Tracks mock platform data.
 */
export const mockOsData = {
  platform: 'linux',
};

/**
 * Resets the mock platform data to initial state.
 */
export const cleanupMockOsData = () => {
  mockOsData.platform = platform();
};

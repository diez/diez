import {platform} from 'os';

export interface MockDirectory {
  [key: string]: string|MockDirectory;
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
 * Tracks executed commands.
 */
export const mockExecutedCommands: string[] = [];

/**
 * Tracks mock command data.
 */
export const mockCommandData = {
  forceFail: false,
  stdout: '',
};

/**
 * Resets the mock command data to initial state.
 */
export const cleanupMockCommandData = () => {
  mockCommandData.forceFail = false;
  mockCommandData.stdout = '';
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

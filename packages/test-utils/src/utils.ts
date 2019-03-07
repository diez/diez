export interface MockDirectory {
  [key: string]: string|MockDirectory;
}

/**
 * Mock filesystem.
 */
export const mockFileSystem: MockDirectory = {};

/**
 * Reset the mock filesystem to initial state.
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
 * Reset the mock command data to initial state.
 */
export const cleanupMockCommandData = () => {
  mockCommandData.forceFail = false;
  mockCommandData.stdout = '';
};

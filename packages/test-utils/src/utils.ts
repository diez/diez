/**
 * Provides a mock directory format for the mock filesystem.
 */
export interface MockDirectory {
  [key: string]: string | MockDirectory;
}

/**
 * Factory for a fresh tracked mock.
 *
 * @internal
 */
const getMock = () => (typeof jest === 'undefined' ? () => {} : jest.fn()) as jest.Mock;

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
export const mockExec = getMock();

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
  mockOsData.platform = 'linux';
};

/**
 * Assigns a mock to a property on an object, and returns both the mock and a method to restore it.
 */
export const assignMock = (original: any, property: string, value: any = getMock()) => {
  const prototype = Object.getOwnPropertyDescriptor(original, property);
  Object.defineProperty(original, property, {value});
  return {
    mock: value,
    restore: () => {
      Object.defineProperty(original, property, prototype || {});
    },
  };
};

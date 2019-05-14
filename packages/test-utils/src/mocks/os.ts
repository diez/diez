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
 * Module mock factory.
 */
export const mockOsFactory = () => {
  const original = jest.requireActual('os');
  return {
    ...original,
    platform () {
      return mockOsData.platform;
    },
    homedir () {
      return original.tmpdir();
    },
  };
};

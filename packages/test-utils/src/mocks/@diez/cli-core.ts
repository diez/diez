/**
 * A mock singleton for `execAsync` in `@diez/cli-core`.
 */
export const mockExec = jest.fn();

/**
 * Resets the mock command data to initial state.
 */
export const cleanupMockCommandData = () => {
  mockExec.mockReset();
};

/**
 * Module mock factory.
 */
export const mockCliCoreFactory = () => ({
  ...jest.requireActual('@diez/cli-core'),
  execAsync: mockExec,
  findOpenPort () {
    return Promise.resolve(9001);
  },
});

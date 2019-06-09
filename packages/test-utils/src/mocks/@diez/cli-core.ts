/**
 * A mock singleton for `execAsync` in `@diez/cli-core`.
 */
export const mockExec = jest.fn();

/**
 * A mock singleton for `canRunCommand` in `@diez/cli-core`.
 */
export const mockCanRunCommand = jest.fn();

/**
 * A mock singleton for `exitTrap` in `@diez/cli-core`.
 */
export const mockExitTrap = jest.fn();

/**
 * A mock singleton for `socketTrap` in `@diez/cli-core`.
 */
export const mockSocketTrap = jest.fn();

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
  exitTrap: mockExitTrap,
  socketTrap: mockSocketTrap,
  canRunCommand: mockCanRunCommand,
  findOpenPort () {
    return Promise.resolve(9001);
  },
});

/**
 * A mock singleton for `execAsync` in `@diez/cli-core`.
 */
export const mockExec = jest.fn();

/**
 * A mock singleton for `canRunCommand` in `@diez/cli-core`.
 */
export const mockCanRunCommand = jest.fn();

/**
 * A mock singleton for `locateBinaryMacOS` in `@diez/cli-core`.
 */
export const mockLocateBinaryMacOS = jest.fn();

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
  mockCanRunCommand.mockReset();
};

/**
 * A mock singleton for `shouldUseYarn` in `@diez/cli-core`.
 */
export const mockShouldUseYarn = jest.fn();

/**
 * A mock singleton for `packageManager` in `@diez/cli-core`.
 */
export const mockPackageManagerInstance = {
  binary: 'yarn',
  exec: jest.fn(() => new Promise((resolve) => resolve({}))),
  installAllDependencies: jest.fn(() => new Promise((resolve) => resolve({}))),
};

/**
 * A mock singleton for `Log.error` in `@diez/cli-core`.
 */
export const mockLogError = jest.fn();

/**
 * A mock singleton for `Log.code` in `@diez/cli-core`.
 */
export const mockLogCode = jest.fn();

/**
 * A mock singleton for `Log.info` in `@diez/cli-core`.
 */
export const mockLogInfo = jest.fn();

/**
 * A mock singleton for `Log.comment` in `@diez/cli-core`.
 */
export const mockLogComment = jest.fn();

/**
 * A mock singleton for `Log.infoTitle` in `@diez/cli-core`.
 */
export const mockLogInfoTitle = jest.fn();

/**
 * A mock singleton for `Log.warning` in `@diez/cli-core`.
 */
export const mockLogWarning = jest.fn();

/**
 * A mock singleton for `Log.warningOnce` in `@diez/cli-core`.
 */
export const mockLogWarningOnce = jest.fn();

/**
 * Module mock factory.
 */
export const mockCliCoreFactory = () => ({
  ...jest.requireActual('@diez/cli-core'),
  execAsync: mockExec,
  exitTrap: mockExitTrap,
  socketTrap: mockSocketTrap,
  canRunCommand: mockCanRunCommand,
  locateBinaryMacOS: mockLocateBinaryMacOS,
  shouldUseYarn: mockShouldUseYarn,
  Log: {
    error: mockLogError,
    code: mockLogCode,
    info: mockLogInfo,
    comment: mockLogComment,
    infoTitle: mockLogInfoTitle,
    warning: mockLogWarning,
    warningOnce: mockLogWarningOnce,
  },
  findOpenPort () {
    return Promise.resolve(9001);
  },
  getPackageManager () {
    return Promise.resolve(mockPackageManagerInstance);
  },
});

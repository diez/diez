import {assignMock} from '@diez/test-utils';

const mockEmitDiagnostics = jest.fn().mockResolvedValue(undefined);
const mockEnableAnalytics = jest.fn();
const mockDisableAnalytics = jest.fn();
jest.doMock('@diez/storage', () => ({
  Registry: {
    get (key: string) {
      switch (key) {
        case 'analyticsEnabled':
          return false;
        case 'uuid':
          return 'user-1';
        default:
          throw new Error(`Unexpected key: ${key}`);
      }
    },
  },
  emitDiagnostics: mockEmitDiagnostics,
  enableAnalytics: mockEnableAnalytics,
  disableAnalytics: mockDisableAnalytics,
}));

import {ModuleWrappedCliAction} from '../src';
import {run} from '../src/cli';
import {loadAction as loadAnalyticsAction} from '../src/commands/analytics';
import {diezVersion} from '../src/utils';

beforeEach(() => {
  process.env.DIEZ_DO_NOT_TRACK = 'indeed';
  assignMock(process, 'exit');
});

afterEach(() => {
  mockEmitDiagnostics.mockReset();
  mockEnableAnalytics.mockReset();
  mockDisableAnalytics.mockReset();
});

describe('cli.analytics', () => {
  test('analytics ping - on', async () => {
    delete process.env.DIEZ_DO_NOT_TRACK;
    // Make sure we make it through here without crashing.
    mockEmitDiagnostics.mockRejectedValueOnce('ahoy');
    await run();
    expect(mockEmitDiagnostics).toHaveBeenCalledTimes(1);
    expect(mockEmitDiagnostics).toHaveBeenCalledWith('activity', diezVersion);
  });

  test('analytics ping - off', async () => {
    await run();
    expect(mockEmitDiagnostics).toHaveBeenCalledTimes(0);
  });

  test('analytics <on|off> command', async () => {
    const analyticsAction = (await loadAnalyticsAction() as ModuleWrappedCliAction).default;
    await analyticsAction({}, 'on');
    expect(mockEnableAnalytics).toHaveBeenCalledTimes(1);
    expect(mockDisableAnalytics).toHaveBeenCalledTimes(0);
    await analyticsAction({}, 'off');
    expect(mockEnableAnalytics).toHaveBeenCalledTimes(1);
    expect(mockDisableAnalytics).toHaveBeenCalledTimes(1);
    await expect(analyticsAction({}, 'medium')).rejects.toThrow();
    expect(mockEnableAnalytics).toHaveBeenCalledTimes(1);
    expect(mockDisableAnalytics).toHaveBeenCalledTimes(1);
  });
});

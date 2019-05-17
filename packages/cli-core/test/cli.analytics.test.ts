import {assignMock} from '@diez/test-utils';

const mockEmitDiagnostics = jest.fn();
const mockEnableAnalytics = jest.fn();
const mockDisableAnalytics = jest.fn();
jest.doMock('@diez/storage', () => ({
  Registry: {
    get () {
      return true;
    },
  },
  emitDiagnostics: mockEmitDiagnostics,
  enableAnalytics: mockEnableAnalytics,
  disableAnalytics: mockDisableAnalytics,
}));

import {run} from '../src/cli';
import {action as analyticsAction} from '../src/commands/analytics';
import {diezVersion} from '../src/utils';

beforeEach(() => {
  assignMock(process, 'exit');
});

jest.mock('package-json');

describe('cli.analytics', () => {
  test('analytics ping', async () => {
    await run();
    expect(mockEmitDiagnostics).toHaveBeenCalledTimes(1);
    expect(mockEmitDiagnostics).toHaveBeenCalledWith('activity', diezVersion);
  });

  test('analytics <on|off> command', async () => {
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

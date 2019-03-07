import {exec} from '../src/__mocks__/child_process';
import {cleanupMockCommandData, mockCommandData, mockExecutedCommands} from '../src/utils';

afterEach(cleanupMockCommandData);

describe('child_process mock', () => {
  test('exec', () => {
    exec('foo', (error, stdout) => {
      expect(mockExecutedCommands).toEqual(['foo']);
      expect(error).toBeUndefined();
      expect(stdout).toBe('');
    });
  });

  test('exec with forced failure', () => {
    mockCommandData.forceFail = true;
    exec('bar', (error, stdout) => {
      expect(mockExecutedCommands).toEqual(['foo']);
      expect(error).toBeDefined();
      expect(stdout).toBeUndefined();
    });
  });

  test('exec with stdout', () => {
    mockCommandData.stdout = 'bat';
    exec('baz', (error, stdout) => {
      expect(mockExecutedCommands).toEqual(['foo', 'baz']);
      expect(error).toBeUndefined();
      expect(stdout).toBe('bat');
    });
  });
});

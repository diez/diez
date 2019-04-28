import {assignMock} from '../src/utils';

describe('mock helpers', () => {
  test('assignMock', () => {
    const originalExit = process.exit;
    const {mock, restore} = assignMock(process, 'exit');
    expect(process.exit).not.toBe(originalExit);
    // This shouldn't actually exit!
    process.exit(1);
    expect(mock).toHaveBeenCalledWith(1);
    restore();
    expect(process.exit).toBe(originalExit);
  });
});

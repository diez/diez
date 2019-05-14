import {mockCliCoreFactory, mockExec} from '../../src/mocks/@diez/cli-core';

const {execAsync, findOpenPort} = mockCliCoreFactory();

describe('@diez/cli-core mock', () => {
  test('basic functionality', async () => {
    execAsync('foobar');
    expect(mockExec).toHaveBeenCalledTimes(1);
    expect(mockExec).toHaveBeenCalledWith('foobar');
    expect(await findOpenPort()).toBe(9001);
  });
});

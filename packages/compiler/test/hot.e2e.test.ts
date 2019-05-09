import {createProgramForFixture, TestTargetCompiler} from './helpers';

jest.mock('webpack-hot-middleware', () => () => {});
jest.mock('webpack-dev-middleware', () => () => {});
jest.mock('express', () => {
  jest.genMockFromModule('express');
  const app = {
    set: () => {},
    get: () => {},
    use: () => {},
    engine: () => {},
    listen: () => {},
  };

  const factory = () => app;
  factory.static = () => {};
  return factory;
});

describe('hot server', () => {
  test('e2e', async () => {
    // This test actually starts a hot TypeScript server, ensuring the steps we take to start the hot server are safe.
    const program = await createProgramForFixture('Filtered', '/dev/null', true);
    const compiler = new TestTargetCompiler(program, '/dev/null');
    await compiler.start();
    program.close();
    expect(compiler.mockWriteHotUrlMutex).toHaveBeenCalled();
  });
});

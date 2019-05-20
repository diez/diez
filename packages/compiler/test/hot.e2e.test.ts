import {writeFileSync} from 'fs-extra';
import {join} from 'path';
import {CompilerEvent} from '../src';
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
  test('hot e2e', async () => {
    // This test actually starts a hot TypeScript server, ensuring the steps we take to start the hot server are safe.
    const program = await createProgramForFixture('Filtered', true);

    return new Promise((resolve) => {
      program.once(CompilerEvent.Compiled, async () => {
        const compiler = new TestTargetCompiler(program);
        await compiler.start();
        expect(compiler.mockWriteHotUrlMutex).toHaveBeenCalled();

        // Wait for next failure.
        program.once(CompilerEvent.Error, () => {
          // Wait for next success.
          program.once(CompilerEvent.Compiled, () => {
            program.close();
            resolve();
          });

          // Write valid TypeScript to the project root.
          writeFileSync(
            join(program.projectRoot, 'src', 'index.ts'),
            'const diez = 10;',
          );
        });

        // Write invalid TypeScript to the project root.
        writeFileSync(
          join(program.projectRoot, 'src', 'index.ts'),
          'const diez = √100;',
        );
      });

      program.watch();
    });
  });
});

import {CompilerOptions, projectCache, ProjectParser} from '@diez/compiler-core';
import {DocsCompiler} from '@diez/targets';
// import {Target} from '@diez/engine';
import {copySync, existsSync, readFileSync, removeSync, writeFileSync} from 'fs-extra';
import {join} from 'path';

const workspaceExamplesRoot = join(__dirname, '..', '..', '..', 'examples');
const fixturesRoot = join(__dirname, 'fixtures');

/**
 * `docs-template-app` root directory.
 */
export const docsAppRoot = join(__dirname, '..');

/**
 * The location of the stub project.
 */
export const stubProjectRoot = join(workspaceExamplesRoot, '.stub', 'docs-template-app-tests');

/**
 * The build output location for the stub project.
 */
export const buildRoot = join(stubProjectRoot, 'build', 'docs');

/**
 * The location of e2e tests.
 */
export const e2ePath = join(__dirname, 'e2e');

/**
 * The location of compiled e2e tests.
 */
export const e2eLibPath = join(e2ePath, 'lib');

/**
 * Retrieves a golden root for a fixture and platform.
 */
export const getGeneratedFixturesRoot = (fixture: string) => join(fixturesRoot, 'auto-generated', fixture);

/**
 * Generates a program for the specified fixture and target.
 */
const createProgramForFixture = async (fixture: string, target: any, options?: Partial<CompilerOptions>) => {
  projectCache.clear();
  removeSync(join(stubProjectRoot, 'assets'));

  writeFileSync(
    join(stubProjectRoot, 'src', 'index.ts'),
    readFileSync(join(fixturesRoot, fixture, `${fixture}.ts`)),
  );

  if (existsSync(join(fixturesRoot, fixture, 'assets'))) {
    copySync(join(fixturesRoot, fixture, 'assets'), join(stubProjectRoot, 'assets'));
  }

  const program = new ProjectParser(stubProjectRoot, {target, sdkVersion: '10.10.10', ...options});
  await program.run();
  return program;
};

/**
 * Creates Docs output for a fixture.
 */
export const createDocsCompilerForFixture = async (fixture: string): Promise<DocsCompiler> => {
  const program = await createProgramForFixture(fixture, 'docs');
  const compiler = new DocsCompiler(program);
  return compiler;
};

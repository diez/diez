import {CompilerOptions, Constructor, projectCache, ProjectParser} from '@diez/compiler-core';
import {Target} from '@diez/engine';
import {AndroidCompiler, IosCompiler, WebCompiler} from '@diez/targets';
import {copySync, existsSync, readdirSync, readFileSync, removeSync, writeFileSync} from 'fs-extra';
import {join} from 'path';

const workspaceExamplesRoot = join(__dirname, '..', '..', '..', '..', 'examples');
const fixturesRoot = join(__dirname, 'fixtures');

/**
 * The location of the stub project.
 */
export const stubProjectRoot = join(workspaceExamplesRoot, '.stub', 'stdlib-tests');

/**
 * The build output location for the stub project.
 */
export const buildRoot = join(stubProjectRoot, 'build');

/**
 * Retrieves a golden root for a fixture and platform.
 */
export const getGoldenRoot = (fixture: string) => join(__dirname, 'goldens', fixture);

/**
 * Gets all fixtures by name.
 */
export const getFixtures = () => readdirSync(fixturesRoot);

/**
 * Retrieves an instance of a fixture component.
 */
export const getFixtureComponentDeclaration = async (fixture: string) => {
  const {[fixture]: constructor} = await import(join(fixturesRoot, fixture, fixture));
  return constructor as Constructor;
};

/**
 * Generates a parser for the specified fixture and target.
 */
const createParserForFixture = async (fixture: string, target: Target, options?: Partial<CompilerOptions>) => {
  projectCache.clear();
  removeSync(join(stubProjectRoot, 'assets'));

  writeFileSync(
    join(stubProjectRoot, 'src', 'index.ts'),
    readFileSync(join(fixturesRoot, fixture, `${fixture}.ts`)),
  );

  if (existsSync(join(fixturesRoot, fixture, 'assets'))) {
    copySync(join(fixturesRoot, fixture, 'assets'), join(stubProjectRoot, 'assets'));
  }

  const parser = new ProjectParser(stubProjectRoot, {target, sdkVersion: '10.10.10', ...options});
  await parser.run();
  return parser;
};

/**
 * Creates iOS output for a fixture.
 */
export const createIosCompilerForFixture = async (fixture: string): Promise<IosCompiler> => {
  const parser = await createParserForFixture(fixture, Target.Ios, {cocoapods: true, carthage: true});
  const compiler = new IosCompiler(parser);
  compiler.clear();
  return compiler;
};

/**
 * Creates Android output for a fixture.
 */
export const createAndroidCompilerForFixture = async (fixture: string): Promise<AndroidCompiler> => {
  const parser = await createParserForFixture(fixture, Target.Android);
  const compiler = new AndroidCompiler(parser);
  compiler.clear();
  return compiler;
};

/**
 * Creates Web output for a fixture.
 */
export const createWebCompilerForFixture = async (fixture: string): Promise<WebCompiler> => {
  const parser = await createParserForFixture(fixture, Target.Web);
  const compiler = new WebCompiler(parser);
  compiler.clear();
  return compiler;
};

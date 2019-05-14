import {CompilerOptions, Program, projectCache} from '@diez/compiler';
import {ConcreteComponentType} from '@diez/engine';
import {getTempFileName} from '@diez/storage';
import {copySync, ensureDirSync, existsSync, readdirSync, readFileSync, removeSync, writeFileSync} from 'fs-extra';
import {join} from 'path';
import {AndroidCompiler} from '../src/targets/android.handler';
import {IosCompiler} from '../src/targets/ios.handler';
import {WebCompiler} from '../src/targets/web.handler';

const workspaceExamplesRoot = join(__dirname, '..', '..', '..', 'examples');
const fixturesRoot = join(__dirname, 'fixtures');
const stubProjectRoot = join(workspaceExamplesRoot, 'stub');

/**
 * Retrieves a golden root for a fixture and platform.
 */
export const getGoldenRoot = (fixture: string, target: string) => join(__dirname, 'goldens', `${fixture}-${target}`);

/**
 * Gets all fixtures by name.
 */
export const getFixtures = () => readdirSync(fixturesRoot);

/**
 * Retrieves an instance of a fixture component.
 */
export const getFixtureComponentDeclaration = async (fixture: string) => {
  const {[fixture]: constructor} = await import(join(fixturesRoot, fixture, fixture));
  return constructor as ConcreteComponentType;
};

/**
 * Generates a program for the specified fixture and target.
 *
 * @internal
 */
const createProgramForFixture = async (fixture: string, target: string, options?: Partial<CompilerOptions>) => {
  projectCache.clear();
  removeSync(join(stubProjectRoot, 'assets'));

  writeFileSync(
    join(stubProjectRoot, 'src', 'index.ts'),
    readFileSync(join(fixturesRoot, fixture, `${fixture}.ts`)),
  );

  if (existsSync(join(fixturesRoot, fixture, 'assets'))) {
    copySync(join(fixturesRoot, fixture, 'assets'), join(stubProjectRoot, 'assets'));
  }

  const destination = getTempFileName();
  ensureDirSync(destination);
  const program = new Program(stubProjectRoot, {target, outputPath: destination, ...options});
  await program.start();
  // Turn on dev mode after the fact so we don't start a dev server.
  program.options.devMode = true;
  return program;
};

/**
 * Creates iOS output for a fixture.
 */
export const createIosCompilerForFixture = async (
  fixture: string,
  sdkRootIn?: string,
): Promise<IosCompiler> => {
  const program = await createProgramForFixture(fixture, 'ios', {cocoapods: true, carthage: true});
  const sdkRoot = sdkRootIn || join(program.options.outputPath, 'Diez');
  const compiler = new IosCompiler(program, sdkRoot);
  compiler.clear();
  return compiler;
};

/**
 * Creates Android output for a fixture.
 */
export const createAndroidCompilerForFixture = async (
  fixture: string,
  sdkRootIn?: string,
): Promise<AndroidCompiler> => {
  const program = await createProgramForFixture(fixture, 'android');
  const sdkRoot = sdkRootIn || join(program.options.outputPath, 'diez');
  const compiler = new AndroidCompiler(program, sdkRoot);
  compiler.clear();
  return compiler;
};

/**
 * Creates Web output for a fixture.
 */
export const createWebCompilerForFixture = async (
  fixture: string,
  sdkRootIn?: string,
): Promise<WebCompiler> => {
  const program = await createProgramForFixture(fixture, 'web');
  const sdkRoot = sdkRootIn || join(program.options.outputPath, 'diez');
  const compiler = new WebCompiler(program, sdkRoot);
  compiler.clear();
  return compiler;
};

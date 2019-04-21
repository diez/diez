import {Compiler, CompilerProgram, createProject} from '@diez/compiler';
import {ConcreteComponentType} from '@diez/engine';
import {copySync, ensureDirSync, existsSync, readdirSync, readFileSync, removeSync, writeFileSync} from 'fs-extra';
import {join} from 'path';
import {AndroidCompiler} from '../src/targets/android.handler';
import {IosCompiler} from '../src/targets/ios.handler';
import {getTempFileName} from '../src/utils';

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
 * Generates a program for the specified fixtures.
 */
export const createProgramForFixture = async (fixture: string) => {
  if (!existsSync(stubProjectRoot)) {
    await createProject('stub', workspaceExamplesRoot);
  }

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
  const program = new Compiler(stubProjectRoot, destination);
  // Turn on dev mode after the fact so we don't start a dev server.
  program.devMode = true;
  return program;
};

/**
 * Creates iOS output for a fixture.
 */
export const createIosCompilerForFixture = async (
  fixture: string,
  programIn?: CompilerProgram,
  sdkRootIn?: string,
): Promise<IosCompiler> => {
  const program = programIn || await createProgramForFixture(fixture);
  const sdkRoot = sdkRootIn || join(program.destinationPath, 'Diez');
  const compiler = new IosCompiler(program, sdkRoot);
  compiler.clear();
  return compiler;
};

/**
 * Creates Android output for a fixture.
 */
export const createAndroidCompilerForFixture = async (
  fixture: string,
  programIn?: CompilerProgram,
  sdkRootIn?: string,
): Promise<AndroidCompiler> => {
  const program = programIn || await createProgramForFixture(fixture);
  const sdkRoot = sdkRootIn || join(program.destinationPath, 'diez');
  const compiler = new AndroidCompiler(program, sdkRoot);
  compiler.clear();
  return compiler;
};

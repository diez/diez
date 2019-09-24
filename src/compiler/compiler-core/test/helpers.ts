import {Target} from '@diez/engine';
import {readdirSync, readFileSync, writeFileSync} from 'fs-extra';
import {join} from 'path';
import {PropertyType, TargetBinding, TargetComponentProperty, TargetComponentSpec, TargetOutput} from '../src/api';
import {Compiler, ProjectParser} from '../src/compiler';

/**
 * The root for workspace examples.
 */
export const workspaceExamplesRoot = join(__dirname, '..', '..', '..', '..', 'examples');

/**
 * Where the stub project is located.
 */
export const stubProjectRoot = join(workspaceExamplesRoot, '.stub', 'compiler-tests');

const fixturesRoot = join(__dirname, 'fixtures');

/**
 * Gets all fixtures by name.
 */
export const getFixtures = () => readdirSync(fixturesRoot);

/**
 * Generates a program for the specified fixtures.
 */
export const createProgramForFixture = async (fixture: string, hot = false) => {
  writeFileSync(
    join(stubProjectRoot, 'src', 'index.ts'),
    readFileSync(join(fixturesRoot, fixture, `${fixture}.ts`)),
  );

  const program = new ProjectParser(stubProjectRoot, {sdkVersion: '10.10.10', target: 'test' as Target}, hot);

  if (!hot) {
    await program.run();
  }

  return program;
};

/**
 * A test compiler.
 */
export class TestCompiler extends Compiler<TargetOutput, TargetBinding> {
  protected async validateOptions () {
    // Noop.
    return;
  }

  staticRoot = 'static';
  hotComponent = join(__dirname, 'mock-hot-component.ts');
  moduleName = 'module-name';

  async hostname () {
    return 'foo.bar';
  }

  protected createOutput (sdkRoot: string, projectName: string): TargetOutput {
    return {
      sdkRoot,
      projectName,
      processedComponents: new Map(),
      dependencies: new Set(),
      assetBindings: new Map(),
    };
  }

  protected collectComponentProperties (
    allProperties: (TargetComponentProperty | undefined)[]): TargetComponentProperty | undefined {
    const properties = allProperties as TargetComponentProperty[];
    return {
      type: `Array<${properties[0].type}>`,
      initializer: `[${properties.map((property) => property.initializer).join(', ')}]`,
      depth: properties[0].depth + 1,
      isPrimitive: false,
    };
  }

  protected getInitializer (spec: TargetComponentSpec): string {
    const propertyInitializers: string[] = [];
    for (const name in spec.properties) {
      propertyInitializers.push(spec.properties[name].initializer);
    }

    return `${spec.componentName}(${propertyInitializers.join(', ')})`;
  }

  protected getPrimitive (type: PropertyType, instance: any) {
    return {
      type,
      initializer: instance.toString(),
      depth: 0,
      isPrimitive: true,
    };
  }

  printUsageInstructionsMock = jest.fn();
  printUsageInstructions () {
    this.printUsageInstructionsMock();
  }

  clearMock = jest.fn();
  clear () {
    this.clearMock();
  }

  writeSdkMock = jest.fn();
  writeSdk () {
    this.writeSdkMock();
    return Promise.resolve();
  }
}

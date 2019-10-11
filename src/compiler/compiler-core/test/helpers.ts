import {Target} from '@diez/engine';
import {readdirSync, readFileSync, writeFileSync} from 'fs-extra';
import {join} from 'path';
import {DiezType, Property, TargetBinding, TargetDiezComponent, TargetOutput, TargetProperty} from '../src/api';
import {Compiler} from '../src/compiler';
import {ProjectParser} from '../src/parser';

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
export const createParserForFixture = async (fixture: string, hot = false) => {
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
    parent: Property,
    allProperties: (TargetProperty | undefined)[]): TargetProperty | undefined {
    const properties = allProperties as TargetProperty[];
    return {
      ...properties[0],
      type: `Array<${parent.type}>`,
      initializer: `[${properties.map((property) => property.initializer).join(', ')}]`,
    };
  }

  protected getInitializer (targetComponent: TargetDiezComponent): string {
    const propertyInitializers: string[] = [];
    for (const property of targetComponent.properties) {
      propertyInitializers.push(property.initializer);
    }

    return `${targetComponent.type}(${propertyInitializers.join(', ')})`;
  }

  protected getPrimitiveName (type: DiezType) {
    return type.toString();
  }

  protected getPrimitiveInitializer (type: DiezType, instance: any) {
    return instance.toString();
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

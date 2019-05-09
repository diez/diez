import {readdirSync, readFileSync, writeFileSync} from 'fs-extra';
import {join} from 'path';
import {PropertyType, TargetBinding, TargetComponentProperty, TargetComponentSpec, TargetOutput} from '../src/api';
import {Program, TargetCompiler} from '../src/compiler';

/**
 * The root for workspace examples.
 */
export const workspaceExamplesRoot = join(__dirname, '..', '..', '..', 'examples');

const fixturesRoot = join(__dirname, 'fixtures');
const stubProjectRoot = join(workspaceExamplesRoot, 'stub');

/**
 * Gets all fixtures by name.
 */
export const getFixtures = () => readdirSync(fixturesRoot);

/**
 * Generates a program for the specified fixtures.
 */
export const createProgramForFixture = async (fixture: string, outputPath = '/dev/null', devMode = false) => {
  writeFileSync(
    join(stubProjectRoot, 'src', 'index.ts'),
    readFileSync(join(fixturesRoot, fixture, `${fixture}.ts`)),
  );

  return new Program(stubProjectRoot, {outputPath, devMode, target: 'test'});
};

/**
 * A test target compiler.
 */
export class TestTargetCompiler extends TargetCompiler<TargetOutput, TargetBinding> {
  protected async validateOptions () {
    // Noop.
    return;
  }

  mockWriteHotUrlMutex = jest.fn();
  protected writeHotUrlMutex (hostname: string, devPort: number) {
    this.mockWriteHotUrlMutex(hostname, devPort);
  }

  staticRoot = 'static';
  hotComponent = 'hot-component';

  async hostname () {
    return 'foo.bar';
  }

  protected mergeBindingToOutput (binding: TargetBinding): void {
    for (const source in binding.sources) {
      this.output.sources.add(source);
    }
  }

  protected createOutput (sdkRoot: string): TargetOutput {
    return {
      sdkRoot,
      processedComponents: new Map(),
      sources: new Set(),
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
      updateable: properties[0].updateable,
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
      updateable: false,
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
  writeSdk (hostname?: string | undefined, devPort?: number | undefined) {
    this.writeSdkMock(hostname, devPort);
    return Promise.resolve();
  }
}

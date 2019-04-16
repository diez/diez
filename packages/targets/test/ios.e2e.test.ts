import {registerExpectations} from '@diez/test-utils';
import {ensureDirSync} from 'fs-extra';
import {join} from 'path';
import {IosOutput, processComponentInstance, writeSdk} from '../src/targets/ios.handler';
import {getTempFileName} from '../src/utils';
import {PrimitivesComponent, primitivesComponentMap} from './fixtures/primitives';

registerExpectations();

describe('index', () => {
  test('primitives', async () => {
    const output: IosOutput = {
      processedComponents: new Set(),
      imports: new Set(),
      sources: new Set(),
      dependencies: new Set(),
      assetBindings: new Map(),
    };

    expect(await processComponentInstance(
      new PrimitivesComponent(), '', 'PrimitivesComponent', output, primitivesComponentMap)).toBe(true);
    expect(Array.from(output.processedComponents)).toEqual(['PrimitivesComponent']);
    expect(output.imports.size).toBe(0);
    expect(output.dependencies.size).toBe(0);

    const sdkRoot = getTempFileName();
    const staticRoot = join(sdkRoot, 'static');
    ensureDirSync(sdkRoot);
    writeSdk(output, sdkRoot, staticRoot, true, 'foo.bar', 9001);
    expect(sdkRoot).toMatchDirectory(join(__dirname, 'goldens', 'primitives-ios'));
  });
});

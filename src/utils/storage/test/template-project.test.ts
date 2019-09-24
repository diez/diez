import {registerExpectations} from '@diez/test-utils';
import {join} from 'path';
import {getTempFileName, outputTemplatePackage} from '../src/utils';

registerExpectations();

describe('outputTemplatePackage', () => {
  test('basic functionality', async () => {
    const template = join(__dirname, 'fixtures', 'template');
    const golden = join(__dirname, 'goldens', 'template');
    const output = getTempFileName();
    await outputTemplatePackage(template, output, {foo: 'diez', woof: 'doggo', number: 10}, new Set(['skipme.txt']));
    expect(output).toMatchDirectory(golden);
  });
});

import {registerExpectations} from '@diez/test-utils';
import {join} from 'path';
import {getTempFileName, outputTemplatePackage} from '../src/utils';

registerExpectations();

describe('outputTemplatePackage', () => {
  test('basic functionality', () => {
    const template = join(__dirname, 'fixtures', 'template');
    const golden = join(__dirname, 'goldens', 'template');
    const output = getTempFileName();
    outputTemplatePackage(template, output, {foo: 'diez', number: 10}, new Set(['skipme.txt']));
    expect(output).toMatchDirectory(golden);
  });
});

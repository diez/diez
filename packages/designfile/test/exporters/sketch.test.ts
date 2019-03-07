// @ts-ignore
import {cleanupMockCommandData, cleanupMockFileSystem, mockCommandData,
  mockExecutedCommands} from '@livedesigner/test-utils';
import {writeFile} from 'fs-extra';
import os from 'os';
import {SketchExporter} from '../../src/exporters/sketch';

jest.mock('fs-extra');
jest.mock('child_process');

// TODO: mock this.
os.platform = () => 'darwin';

const sketchtoolPath = '/Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool';
beforeEach(() => {
  // TODO: we should actually use jest mock functions here.
  mockCommandData.stdout = '/Applications/Sketch.app';
  writeFile(sketchtoolPath, '');
});
afterEach(() => {
  cleanupMockFileSystem();
  cleanupMockCommandData();
});

const sketch = SketchExporter.create();

describe('Sketch', () => {
  describe('#canParse', () => {
    test('returns `false` if the file does not look like a Sketch file', async () => {
      await writeFile('test.ai', '');
      expect(await SketchExporter.canParse('test.ai')).toBe(false);
      await writeFile('test.sketchster', '');
      expect(await SketchExporter.canParse('test.sketchster')).toBe(false);
    });

    test('returns `false` if the file looks like an illustrator file but doesn\'t exist', async () => {
      expect(await SketchExporter.canParse('test.sketch')).toBe(false);
    });

    test('returns `true` if the file does look like a Sketch file', async () => {
      await writeFile('test.sketch', '');
      expect(await SketchExporter.canParse('test.sketch')).toBe(true);
      await writeFile('my/awesome/path/test.sketch', '');
      expect(await SketchExporter.canParse('my/awesome/path/test.sketch')).toBe(true);
      await writeFile('/.haiku/cuboid.sketch  ', '');
      expect(await SketchExporter.canParse('/.haiku/cuboid.sketch  ')).toBe(true);
    });
  });

  describe('#exportSVG', () => {
    test('executes sketchtools commands on export', async () => {
      await writeFile('test.sketch', '');
      await sketch.exportSVG('test.sketch', 'outdir', () => {});
      expect(mockExecutedCommands.length).toBe(3);
      expect(mockExecutedCommands[0]).toBe('mdfind kMDItemCFBundleIdentifier=com.bohemiancoding.sketch3');
      expect(mockExecutedCommands[1]).toBe(
        `${sketchtoolPath} export --format=svg --output=outdir/slices slices test.sketch`);
      expect(mockExecutedCommands[2]).toBe(
        `${sketchtoolPath} export --format=svg --output=outdir/artboards artboards test.sketch`);
    });

    test('returns false if the file provided cannot be parsed by this module', async () => {
      await writeFile('test.ai', '');
      await expect(sketch.exportSVG('test.ai', 'out', () => {})).rejects.toThrow('Invalid source file.');
      await writeFile('test.sketchster', '');
      await expect(sketch.exportSVG('test.sketchster', 'out', () => {})).rejects.toThrow('Invalid source file.');
    });

    test('throws an error if there is an error running the export commands', async () => {
      mockCommandData.forceFail = true;
      await writeFile('test.sketch', '');
      await expect(sketch.exportSVG('test.sketch', 'out', () => {})).rejects.toBeDefined();
    });
  });
});

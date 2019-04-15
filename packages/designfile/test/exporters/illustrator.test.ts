import {cleanupMockCommandData, cleanupMockFileSystem, mockExec, mockFileSystem} from '@diez/test-utils';
import {writeFile} from 'fs-extra';
import {IllustratorExporter, illustratorExportScript} from '../../src/exporters/illustrator';

const illustrator = IllustratorExporter.create();

afterEach(() => {
  cleanupMockFileSystem();
  cleanupMockCommandData();
});

jest.mock('fs-extra');
jest.mock('@diez/cli');
jest.mock('path');

describe('Illustrator', () => {
  describe('#canParse', () => {
    test('returns `false` if the file does not look like an Illustrator file', async () => {
      await writeFile('test.sketch', '');
      expect(await IllustratorExporter.canParse('test.sketch')).toBe(false);
      await writeFile('test.aiam', '');
      expect(await IllustratorExporter.canParse('test.aiam')).toBe(false);
    });

    test('returns `false` if the file looks like an illustrator file but doesn\'t exist', async () => {
      expect(await IllustratorExporter.canParse('test.ai')).toBe(false);
    });

    test('returns `true` if the file does look like an Illustrator file', async () => {
      await writeFile('test.ai', '');
      expect(await IllustratorExporter.canParse('test.ai')).toBe(true);
      await writeFile('my/awesome/path/test.ai', '');
      expect(await IllustratorExporter.canParse('my/awesome/path/test.ai')).toBe(true);
    });
  });

  describe('#exportSVG', () => {
    test('creates an Illustrator scripts and runs it to export assets from an Illustrator file', async () => {
      await writeFile('test.ai', '');
      await illustrator.exportSVG('test.ai', 'outdir', () => {});
      expect(mockExec).toHaveBeenCalledTimes(2);
      expect(mockExec).toHaveBeenNthCalledWith(1, 'open -g -b com.adobe.Illustrator test.ai');
      expect(mockFileSystem.outdir).toBe('FOLDER');
      expect(mockFileSystem['outdir/artboards']).toBe('FOLDER');
      expect(mockFileSystem[Object.keys(mockFileSystem)[3]])
        .toBe(illustratorExportScript.replace('DEST_PATH', 'outdir/artboards').replace('SOURCE_PATH', 'test.ai'));
    });

    test('throws an error if is not able to parse the file', async () => {
      await writeFile('test.sketch', '');
      await expect(illustrator.exportSVG('test.sketch', 'out/dir', () => {})).rejects.toThrow('Invalid source file.');
      await writeFile('test.aiam', '');
      await expect(illustrator.exportSVG('test.aiam', 'out/dir', () => {})).rejects.toThrow('Invalid source file.');
    });

    test('throws an error if there is an error running the export commands', async () => {
      mockExec.mockImplementationOnce(() => {
        throw new Error('Whoops!');
      });
      await writeFile('test.ai', '');
      await expect(illustrator.exportSVG('test.ai', 'out', () => {})).rejects.toThrow();
    });
  });
});

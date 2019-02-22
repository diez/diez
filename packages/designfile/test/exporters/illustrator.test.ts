// @ts-ignore
import {__disableForceFail, __enableForceFail, __executedCommands} from 'child_process';
// @ts-ignore
import {__cleanup, __fileSystem} from 'fs-extra';
import {illustrator, ILLUSTRATOR_EXPORT_SCRIPT} from '../../src/exporters/illustrator';

beforeEach(() => {
  __cleanup();
});

jest.mock('fs-extra');
jest.mock('child_process');

describe('Illustrator', () => {
  describe('#canParse', () => {
    test('returns `false` if the file does not look like an Illustrator file', () => {
      expect(illustrator.canParse('test.sketch')).toBe(false);
      expect(illustrator.canParse('test.aiam')).toBe(false);
    });

    test('returns `true` if the file does look like an Illustrator file', () => {
      expect(illustrator.canParse('test.ai')).toBe(true);
      expect(illustrator.canParse('my/awesome/path/test.ai')).toBe(true);
    });
  });

  describe('#exportSVG', () => {
    test('creates an Illustrator scripts and runs it to export assets from an Illustrator file', async () => {
      await illustrator.exportSVG('test.ai', 'outdir', () => {});
      expect(__executedCommands.length).toBe(2);
      expect(__executedCommands[0]).toContain('test.ai');
      expect(__fileSystem.outdir).toBe('FOLDER');
      expect(__fileSystem['outdir/artboards']).toBe('FOLDER');
      expect(__fileSystem[Object.keys(__fileSystem)[2]])
        .toBe(ILLUSTRATOR_EXPORT_SCRIPT.replace('DEST_PATH', 'outdir/artboards').replace('SOURCE_PATH', 'test.ai'));
    });

    test('throws an error if is not able to parse the file', async () => {
      await expect(illustrator.exportSVG('test.sketch', 'out/dir', () => {})).rejects.toThrow('Invalid source file.');
      await expect(illustrator.exportSVG('test.aiam', 'out/dir', () => {})).rejects.toThrow('Invalid source file.');
    });

    test('throws an error if there is an error running the export commands', async () => {
      __enableForceFail();
      await expect(illustrator.exportSVG('test.ai', 'out', () => {})).rejects.toBeDefined();
      __disableForceFail();
    });
  });
});

// @ts-ignore
import {__disableForceFail, __enableForceFail, __executedCommands} from 'child_process';
// @ts-ignore
import {__fileSystem} from 'fs-extra';
import {sketch} from '../../src/exporters/sketch';

jest.mock('fs-extra');
jest.mock('child_process');

describe('Sketch', () => {
  describe('#canParse', () => {
    test('returns `false` if the file does not look like a Sketch file', () => {
      expect(sketch.canParse('test.ai')).toBe(false);
      expect(sketch.canParse('test.sketchster')).toBe(false);
    });

    test('returns `true` if the file does look like a Sketch file', () => {
      expect(sketch.canParse('test.sketch')).toBe(true);
      expect(sketch.canParse('my/awesome/path/test.sketch')).toBe(true);
      expect(sketch.canParse('/.haiku/cuboid.sketch  ')).toBe(true);
    });
  });

  describe('#exportSVG', () => {
    test('executes sketchtools commands on export', async () => {
      await sketch.exportSVG('test.sketch', 'outdir');
      expect(__executedCommands.length).toBe(2);
      expect(__executedCommands.every((command: string) => command.includes('sketchtool'))).toBe(true);
    });

    test('returns false if the file provided cannot be parsed by this module', async () => {
      await expect(sketch.exportSVG('test.ai', 'out')).rejects.toThrow('Invalid source file.');
      await expect(sketch.exportSVG('test.sketchster', 'out')).rejects.toThrow('Invalid source file.');
    });

    test('throws an error if there is an error running the export commands', async () => {
      __enableForceFail();
      await expect(sketch.exportSVG('test.sketch', 'out')).rejects.toBeDefined();
      __disableForceFail();
    });
  });
});

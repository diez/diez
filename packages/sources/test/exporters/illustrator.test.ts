import {cleanupMockCommandData, cleanupMockFileSystem, mockCliCoreFactory, mockExec, mockFileSystem, mockFsExtraFactory} from '@diez/test-utils';
jest.doMock('fs-extra', mockFsExtraFactory);
jest.doMock('@diez/cli-core', mockCliCoreFactory);

import {writeFile} from 'fs-extra';
import {IllustratorExporter, illustratorExportScript} from '../../src/exporters/illustrator';

const illustrator = IllustratorExporter.create();

afterEach(() => {
  cleanupMockFileSystem();
  cleanupMockCommandData();
});

jest.mock('path', () => ({
  ...jest.requireActual('path'),
  resolve (dir: string) {
    return dir;
  },
}));

describe('Illustrator', () => {
  describe('canParse', () => {
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

  describe('export', () => {
    test('creates an Illustrator scripts and runs it to export assets from an Illustrator file', async () => {
      await writeFile('test.ai', '');
      await illustrator.export(
        {
          source: 'test.ai',
          assets: 'out',
          code: 'noop',
        },
        'noop',
      );
      expect(mockExec).toHaveBeenCalledTimes(2);
      expect(mockExec).toHaveBeenNthCalledWith(1, 'open -g -b com.adobe.Illustrator test.ai');
      expect(mockFileSystem['out/Test.ai.contents']).toBe('FOLDER');
      expect(mockFileSystem['out/Test.ai.contents/artboards']).toBe('FOLDER');
      expect(mockFileSystem[Object.keys(mockFileSystem)[4]])
        .toBe(illustratorExportScript.replace(
          'DEST_PATH',
          'out/Test.ai.contents/artboards',
        ).replace('SOURCE_PATH', 'test.ai'));
    });

    test('throws an error if is not able to parse the file', async () => {
      await writeFile('test.sketch', '');
      await expect(
        illustrator.export({source: 'test.sketch', assets: 'out/dir', code: 'noop'}, 'noop'),
      ).rejects.toThrow('Invalid source file');
      await writeFile('test.aiam', '');
      await expect(
        illustrator.export({source: 'test.aiam', assets: 'out/dir', code: 'noop'}, 'noop'),
      ).rejects.toThrow('Invalid source file');
    });

    test('throws an error if there is an error running the export commands', async () => {
      mockExec.mockImplementationOnce(() => {
        throw new Error('Whoops!');
      });
      await writeFile('test.ai', '');
      await expect(
        illustrator.export({source: 'test.jai', assets: 'out', code: 'noop'}, 'noop'),
      ).rejects.toThrow();
    });
  });
});

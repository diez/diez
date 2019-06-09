import {
  cleanupMockCommandData,
  cleanupMockFileSystem,
  cleanupMockOsData,
  mockCliCoreFactory,
  mockCodegen,
  mockExec,
  mockFsExtraFactory,
  mockGenerationFactory,
  mockLocateFont,
  mockOsData,
  mockOsFactory,
} from '@diez/test-utils';
jest.doMock('@diez/cli-core', mockCliCoreFactory);
jest.doMock('@diez/generation', mockGenerationFactory);
jest.doMock('os', mockOsFactory);
jest.doMock('fs-extra', mockFsExtraFactory);

import {writeFile} from 'fs-extra';
import {SketchExporter} from '../../src/exporters/sketch';

const sketchtoolPath = '/Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool';
beforeEach(() => {
  mockExec.mockImplementation((command: string) => {
    if (command.startsWith('mdfind')) {
      return Promise.resolve('/Applications/Sketch.app');
    }

    if (command.includes('dump')) {
      return Promise.resolve(JSON.stringify({
        assets: {
          colorAssets: [
            {
              name: 'Red',
              color: {
                value: '#ff0000',
              },
            },
          ],
          gradientAssets: [],
          imageCollection: [],
        },
        layerTextStyles: {
          objects: [
            {
              name: 'Heading 1',
              value: {
                textStyle: {
                  MSAttributedStringColorAttribute: {
                    value: '#333333',
                  },
                  NSFont: {
                    attributes: {
                      NSFontNameAttribute: 'Foobar-BoldItalic',
                      NSFontSizeAttribute: 20,
                    },
                    family: 'Foobar',
                  },
                },
              },
            },
          ],
        },
        pages: [
          {
            ['<class>']: 'MSPage',
            exportOptions: {exportFormats: [{}]},
            frame: {width: 1920, height: 1080},
            name: 'Page 1',
            layers: [{
              ['<class>']: 'MSArtboardGroup',
              exportOptions: {exportFormats: [{}]},
              frame: {width: 1920, height: 1080},
              name: 'Artboard',
              layers: [
                {
                  ['<class>']: 'Sliced Rectangle',
                  exportOptions: {exportFormats: [{}]},
                  frame: {width: 640, height: 480},
                  name: 'Slice One',
                },
                {
                  ['<class>']: 'Unsliced Rectangle',
                  exportOptions: {exportFormats: []},
                  frame: {width: 640, height: 480},
                  name: 'Slice Two',
                },
              ],
            }],
          },
        ],
      }));
    }

    mockLocateFont.mockResolvedValue({
      name: 'Foobar-BoldItalic',
      family: 'Foobar',
      path: '/path/to/Foobar-BoldItalic.ttf',
      style: 'Bold Italic',
    });

    return Promise.resolve('');
  });
  mockOsData.platform = 'darwin';
  writeFile(sketchtoolPath, '');
});
afterEach(() => {
  cleanupMockFileSystem();
  cleanupMockCommandData();
  cleanupMockOsData();
  mockCodegen.mockReset();
  mockLocateFont.mockReset();
});

jest.mock('fontkit', () => ({
  openSync: () => ({}),
}));
const sketch = SketchExporter.create();

describe('Sketch', () => {
  describe('canParse', () => {
    test('returns `false` if the file does not look like a Sketch file', async () => {
      await writeFile('test.ai', '');
      expect(await SketchExporter.canParse('test.ai')).toBe(false);
      await writeFile('test.sketchster', '');
      expect(await SketchExporter.canParse('test.sketchster')).toBe(false);
    });

    test('returns `false` if the file looks like a Sketch file but doesn\'t exist', async () => {
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

  describe('export', () => {
    test('executes sketchtools commands on export', async () => {
      await writeFile('test.sketch', '');
      await sketch.export({source: 'test.sketch', assets: 'out', code: 'src'}, '.');
      expect(mockExec).toHaveBeenCalledTimes(3);
      expect(mockExec).toHaveBeenNthCalledWith(1,
        'mdfind kMDItemCFBundleIdentifier=com.bohemiancoding.sketch3');
      expect(mockExec).toHaveBeenNthCalledWith(2, `${sketchtoolPath} dump test.sketch`, expect.anything());
      expect(mockExec).toHaveBeenNthCalledWith(3,
        `${sketchtoolPath} export --format=png --scales=1,2,3,4 --output=out/Test.sketch.contents/slices slices test.sketch`);
      expect(mockCodegen).toHaveBeenCalled();
      expect(mockCodegen).toHaveBeenCalledWith({
        assets: new Map([[
          'slices', new Map([[
            'Slice One', {
              width: 640,
              height: 480,
              src: 'out/Test.sketch.contents/slices/Slice One.png',
            },
          ]]),
        ]]),
        assetsDirectory: 'out/Test.sketch.contents',
        colors: [{initializer: 'Color.rgba(255, 0, 0, 1)', name: 'Red'}],
        designSystemName: 'Test',
        filename: 'src/Test.sketch.ts',
        fonts: new Map([['Foobar', new Map([['BoldItalic', {name: 'Foobar-BoldItalic', path: '/path/to/Foobar-BoldItalic.ttf'}]])]]),
        projectRoot: '.',
        typographs: [
          {
            initializer: 'new Typograph({color: Color.rgba(51, 51, 51, 1), font: TestFonts.Foobar.BoldItalic, fontSize: 20})',
            name: 'Heading 1',
          },
        ],
      });
      expect(mockLocateFont).toHaveBeenCalledWith('Foobar', {name: 'Foobar-BoldItalic'});
    });

    test('returns false if the file provided cannot be parsed by this module', async () => {
      await writeFile('test.ai', '');
      await expect(
        sketch.export({source: 'test.ai', assets: 'out', code: 'noop'}, 'noop'),
      ).rejects.toThrow('Invalid source file');
      await writeFile('test.sketchster', '');
      await expect(
        sketch.export({source: 'test.sketchster', assets: 'out', code: 'noop'}, 'noop'),
      ).rejects.toThrow('Invalid source file');
    });

    test('throws an error if not on mac', async () => {
      mockOsData.platform = 'win32';
      await writeFile('test.sketch', '');
      await expect(
        sketch.export({source: 'test.sketch', assets: 'out', code: 'noop'}, 'noop'),
      ).rejects.toThrow();
    });

    test('throws an error if there is an error running the export commands', async () => {
      mockExec.mockImplementationOnce(() => {
        throw new Error('Whoops!');
      });
      await writeFile('test.sketch', '');
      await expect(
        sketch.export({source: 'test.sketch', assets: 'out', code: 'noop'}, 'noop'),
      ).rejects.toThrow();
    });
  });
});

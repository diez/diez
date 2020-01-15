import {
  mockCliCoreFactory,
  mockCodegen,
  mockFsExtraFactory,
  mockGenerationFactory,
  mockLocateFont,
  mockOsFactory,
} from '@diez/test-utils';
jest.doMock('fs-extra', mockFsExtraFactory);
jest.doMock('@diez/generation', mockGenerationFactory);
jest.doMock('os', mockOsFactory);
jest.doMock('@diez/cli-core', mockCliCoreFactory);
const mockDecompress = jest.fn(() => {
  return [{
    data: {
      toString () {
        return mockData;
      },
    },
  }];
});

jest.mock('fontkit', () => ({
  openSync: () => ({}),
}));

jest.doMock('decompress', () => {
  return mockDecompress;
});

import xd from '../../src/extractors/xd';

const mockData = JSON.stringify(require('../fixtures/xd/sample-file.json'));
const xdExtractor = xd.create();
import {writeFile} from 'fs-extra';

describe('XdExtractor', () => {
  describe('canParse', () => {
    test('returns `false` if the file does not look like an XD file', async () => {
      await writeFile('test.ai', '');
      expect(await xd.canParse('test.ai')).toBe(false);
      await writeFile('test.sketchster', '');
      expect(await xd.canParse('test.sketchster')).toBe(false);
    });

    test('returns `false` if the file looks like an XD file but doesn\'t exist', async () => {
      expect(await xd.canParse('test.xd')).toBe(false);
    });

    test('returns `true` if the file does look like an XD file', async () => {
      await writeFile('test.xd', '');
      expect(await xd.canParse('test.xd')).toBe(true);
      await writeFile('my/awesome/path/test.xd', '');
      expect(await xd.canParse('my/awesome/path/test.xd')).toBe(true);
      await writeFile('/.haiku/cuboid.xd  ', '');
      expect(await xd.canParse('/.haiku/cuboid.xd  ')).toBe(true);
    });
  });

  describe('export', () => {
    test('extracts tokens from a valid file', async () => {
      await writeFile('test.xd', '');
      mockLocateFont.mockResolvedValueOnce({
        name: 'Foobar-BoldItalic',
        family: 'Foobar',
        path: '/path/to/Foobar-BoldItalic.ttf',
        style: 'Bold Italic',
      });
      await xdExtractor.export({source: 'test.xd', assets: 'out', code: 'src'}, '.');
      expect(mockCodegen).toHaveBeenCalled();
      expect(mockCodegen).toHaveBeenCalledWith({
        assets: new Map(),
        assetsDirectory: 'out/Test.xd.contents',
        colors: [{initializer: 'Color.rgba(112, 112, 112, 1)', name: 'DaFunk'}],
        gradients: [{
          name: 'OneMoreTime',
          initializer: 'new LinearGradient({stops: [GradientStop.make(0, Color.rgba(0, 15, 12, 0.14901960784313725)), GradientStop.make(0, Color.rgba(13, 54, 79, 0.14901960784313725)), GradientStop.make(0.256157994270325, Color.rgba(18, 68, 103, 0.14901960784313725)), GradientStop.make(0.438423991203308, Color.rgba(31, 105, 167, 0.14901960784313725)), GradientStop.make(0.783250987529755, Color.rgba(37, 93, 199, 0.14901960784313725)), GradientStop.make(1, Color.rgba(20, 128, 107, 0.14901960784313725))], start: Point2D.make(0, 0), end: Point2D.make(1, 1)})',
        }],
        shadows: [],
        designLanguageName: 'Test',
        filename: 'src/Test.xd.ts',
        fonts: new Map([['Foobar', new Map([['BoldItalic', {name: 'Foobar-BoldItalic', path: '/path/to/Foobar-BoldItalic.ttf'}]])]]),
        projectRoot: '.',
        typographs: [
          {
            initializer: 'new Typograph({fontSize: 22, letterSpacing: 196, lineHeight: 0, color: Color.rgba(112, 112, 112, 1), font: testFonts.Foobar.BoldItalic})',
            name: 'Foobar',
          },
          {
            initializer: 'new Typograph({fontSize: 33, letterSpacing: 196, lineHeight: 0, color: Color.rgba(112, 112, 112, 1), font: new Font({name: "InaiMathi-Bold"})})',
            name: 'GetLucky',
          },
        ],
      });
    });

    test('returns false if the file provided cannot be parsed by this module', async () => {
      await writeFile('test.ai', '');
      await expect(
        xdExtractor.export({source: 'test.ai', assets: 'out', code: 'noop'}, 'noop'),
      ).rejects.toThrow('Invalid source file');
      await writeFile('test.xdis', '');
      await expect(
        xdExtractor.export({source: 'test.xdis', assets: 'out', code: 'noop'}, 'noop'),
      ).rejects.toThrow('Invalid source file');
    });

    test('throws an error if the file cant be parsed', async () => {
      mockDecompress.mockReturnValueOnce([
        {
          data: {
            toString () {
              return 'invalidjson';
            },
          },
        },
      ]);

      await writeFile('test.xd', '');
      await expect(
        xdExtractor.export({source: 'test.xd', assets: 'out', code: 'noop'}, 'noop'),
      ).rejects.toThrow();
    });

    test('returns an empty design language if the file can be parsed but does not look valid', async () => {
      mockDecompress.mockReturnValueOnce([
        {
          data: {
            toString () {
              return '{"manifest": {"resources": {"meta": {}}}}';
            },
          },
        },
      ]);

      await writeFile('test.xd', '');
      await xdExtractor.export({source: 'test.xd', assets: 'out', code: 'src'}, '.');
      expect(mockCodegen).toHaveBeenCalledWith(
        {
          assets: new Map(),
          assetsDirectory: 'out/Test.xd.contents',
          colors: [],
          designLanguageName: 'Test',
          filename: 'src/Test.xd.ts',
          fonts: new Map(),
          gradients: [],
          projectRoot: '.',
          shadows: [],
          typographs: [],
        },
      );
    });
  });
});

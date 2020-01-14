import {
  mockCliCoreFactory,
  mockCodegen,
  mockFsExtraFactory,
  mockGenerationFactory,
  mockOsFactory,
} from '@diez/test-utils';
jest.doMock('fs-extra', mockFsExtraFactory);
jest.doMock('@diez/generation', mockGenerationFactory);
jest.doMock('os', mockOsFactory);
jest.doMock('@diez/cli-core', mockCliCoreFactory);

import xd from '../../src/extractors/xd';

const mockData = JSON.stringify(require('../fixtures/xd/sample-file.json'));
const xdExtractor = xd.create();
import {writeFile} from 'fs-extra';

jest.mock('decompress', () => {
  return () => {
    return [{
      data: {
        toString () {
          return mockData;
        },
      },
    }];
  };
});

describe('XdExtractor', () => {
  // describe('canParse', () => {
  //   test('returns `false` if the file does not look like an XD file', async () => {
  //     await writeFile('test.ai', '');
  //     expect(await xd.canParse('test.ai')).toBe(false);
  //     await writeFile('test.sketchster', '');
  //     expect(await xd.canParse('test.sketchster')).toBe(false);
  //   });

  //   test('returns `false` if the file looks like an XD file but doesn\'t exist', async () => {
  //     expect(await xd.canParse('test.xd')).toBe(false);
  //   });

  //   test('returns `true` if the file does look like an XD file', async () => {
  //     await writeFile('test.xd', '');
  //     expect(await xd.canParse('test.xd')).toBe(true);
  //     await writeFile('my/awesome/path/test.xd', '');
  //     expect(await xd.canParse('my/awesome/path/test.xd')).toBe(true);
  //     await writeFile('/.haiku/cuboid.xd  ', '');
  //     expect(await xd.canParse('/.haiku/cuboid.xd  ')).toBe(true);
  //   });
  // });

  describe('export', () => {
    test('', async () => {
      await writeFile('test.xd', '');
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
        fonts: new Map(),
        projectRoot: '.',
        typographs: [
          {
            initializer: 'new Typograph({fontSize: 33, letterSpacing: 196, lineHeight: 0, color: Color.rgba(112, 112, 112, 1), font: new Font({name: "InaiMathi-Bold"})})',
            name: 'GetLucky',
          },
        ],
      });
    });
  });
});

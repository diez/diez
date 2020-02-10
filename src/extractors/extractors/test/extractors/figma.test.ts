import {
  cleanupMockFileSystem,
  mockCodegen,
  mockFileSystem,
  mockFsExtraFactory,
  mockGenerationFactory,
  mockLocateFont,
} from '@diez/test-utils';
jest.doMock('fs-extra', mockFsExtraFactory);
jest.doMock('@diez/generation', mockGenerationFactory);

const mockRequest = jest.fn();
jest.doMock('request', () => mockRequest);

const mockGetFigmaAccessToken = jest.fn();
jest.doMock('../../src/utils.network', () => ({
  ...jest.requireActual('../../src/utils.network'),
  getFigmaAccessToken: mockGetFigmaAccessToken,
}));

const downloadStreamMock = jest.fn();
const mockRegistryGet = jest.fn();
const mockRegistrySet = jest.fn();
const mockRegistryDelete = jest.fn();
jest.doMock('@diez/storage', () => ({
  ...jest.requireActual('@diez/storage'),
  downloadStream: downloadStreamMock,
  Registry: {
    get: mockRegistryGet,
    set: mockRegistrySet,
    delete: mockRegistryDelete,
  },
}));

import {UnauthorizedRequestException} from '@diez/cli-core';
import {Readable} from 'stream';
/* tslint:disable */
import FigmaExtractor from '../../src/extractors/figma';

const figma = FigmaExtractor.create('mock-token');

afterEach(cleanupMockFileSystem);

const mockAbbreviatedResponse = {
  name: 'Hello',
  document: {
    children: [{
      id: '',
      name: '',
    }],
  },
};

const mockFullResponse = {
  name: 'Hello',
  document: {
    children: [{
      // Legacy component format matches against ID.
      id: 'legacyComponent',
      name: '',
      absoluteBoundingBox: {
        width: 1920,
        height: 1080,
      },
      children: [
        {
          id: '',
          name: '',
          // Modern component format matches against component ID.
          componentId: 'component',
          absoluteBoundingBox: {
            width: 640,
            height: 480,
          },
        },
        {
          id: '',
          name: '',
          fills: [{
            type: 'SOLID',
            color: {
              r: 0.03921568627451,
              g: 0.03921568627451,
              b: 0.03921568627451,
              a: 1,
            },
          }],
          styles: {
            fill: 'color',
          },
          children: [
            {
              id: '',
              name: '',
              fills: [{
                type: 'SOLID',
                color: {
                  r: 0.392156862745098,
                  g: 0.392156862745098,
                  b: 0.392156862745098,
                  a: 1,
                },
              }],
              style: {
                fontFamily: 'Foobar',
                fontPostScriptName: 'Foobar-BoldItalic',
                fontSize: 9001,
                letterSpacing: 0.4824822,
                lineHeightPx: 11,
              },
              styles: {
                text: 'text',
              },
            },
            {
              id: '',
              name: '',
              fills: [{
                type: 'GRADIENT_LINEAR',
                gradientHandlePositions: [
                  {
                    x: 2.220446049250313e-16,
                    y: 1.6653345369377348e-16,
                  },
                  {
                    x: 1.0000000000000002,
                    y: 1.0000000000000002,
                  },
                  {
                    x: -0.4999999999999998,
                    y: 0.4302501568324906,
                  },
                ],
                gradientStops: [
                  {
                    color:{
                      r: 1,
                      g: 0,
                      b: 0,
                      a: 1,
                    },
                    position: 0,
                  },
                  {
                    color: {
                      r: 0.679999828338623,
                      g: 0,
                      b: 1,
                      a: 1,
                    },
                    position: 1,
                  },
                ],
              }],
              style: {
                fontFamily: 'Foobar',
                fontPostScriptName: 'Foobar-BoldItalic',
                fontSize: 9001,
                letterSpacing: 0.2222,
                lineHeightPx: 1010,
              },
              styles: {
                text: 'gradientText',
              },
            },
          ],
        },
        {
          id: '',
          name: '',
          fills: [{
            type: 'SOLID',
            color: {
              r: 0.03921568627451,
              g: 0.03921568627451,
              b: 0.03921568627451,
              a: 0.5,
            },
          }],
          styles: {
            fill: 'colorWithAlpha',
          },
          children: [],
        },
        {
          id: '',
          name: '',
          fills: [{
            type: 'GRADIENT_LINEAR',
            gradientHandlePositions: [
              {
                x: 2.220446049250313e-16,
                y: 1.6653345369377348e-16,
              },
              {
                x: 1.0000000000000002,
                y: 1.0000000000000002,
              },
              {
                x: -0.4999999999999998,
                y: 0.4302501568324906,
              },
            ],
            gradientStops: [
              {
                color:{
                  r: 1,
                  g: 0,
                  b: 0,
                  a: 1,
                },
                position: 0,
              },
              {
                color: {
                  r: 0.679999828338623,
                  g: 0,
                  b: 1,
                  a: 1,
                },
                position: 1,
              },
            ],
          }],
          effects: [{
            type: 'DROP_SHADOW',
            color: {
              r: 0,
              g: 0,
              b: 0.062745101749897,
              a: 0.4099999964237213,
            },
            offset: {
              x: 0,
              y: 1,
            },
            radius: 16,
          }],
          styles: {
            effect: 'dropShadow',
            fill: 'linearGradient',
          },
        },
        {
          id: '',
          name: '',
          fills: [{
            type: 'unrecognized',
          }],
          styles: {
            fill: 'unrecognizedFill',
          },
        },
      ],
    }],
  },
  components: {
    legacyComponent: {
      name: 'Legacy Team Component',
    },
    component: {
      name: 'Team Component',
    },
  },
  styles: {
    color: {
      name: 'Diez Black',
      styleType: 'FILL',
    },
    colorWithAlpha: {
      name: 'Diez Black With Alpha',
      styleType: 'FILL',
    },
    dropShadow: {
      name: 'Diez Drop Shadow',
      styleType: 'EFFECT',
    },
    linearGradient: {
      name: 'Diez Red To Purple',
      styleType: 'FILL',
    },
    unrecognizedFill: {
      name: 'Unrecognized Fill',
      styleType: 'FILL',
    },
    text: {
      name: 'Foobar Typograph',
      styleType: 'TEXT',
    },
    gradientText: {
      name: 'Gradient Typograph',
      styleType: 'TEXT',
    },
  },
};

jest.mock('fontkit', () => ({
  openSync: () => ({}),
}));

describe('Figma', () => {
  describe('canParse', () => {
    test('returns `false` if the file does not look like a Figma file', async () => {
      expect(await FigmaExtractor.canParse('test.sketch')).toBe(false);
      expect(await FigmaExtractor.canParse('http://something.com/file/key/name')).toBe(false);
    });

    test('returns `true` if the file does look like a Figma file', async () => {
      expect(await FigmaExtractor.canParse('http://figma.com/file/key/name')).toBe(true);
      expect(await FigmaExtractor.canParse('http://figma.com/file/key')).toBe(true);
    });
  });

  describe('export', () => {
    test('exports assets as expected from a Figma URL', async () => {
      mockRequest.mockImplementationOnce((_: any, callback: any) => callback(
        undefined,
        {statusCode: 200},
        mockAbbreviatedResponse,
      ));

      // Ensure no crash on empty document.
      await figma.export(
        {
          source: 'http://figma.com/file/key/name',
          assets: 'out',
          code: 'src',
        },
        '.',
      );

      mockRequest.mockReset();

      mockRequest.mockImplementation(({uri}: {uri: string}, callback: any) => {
        switch (uri) {
          case 'https://api.figma.com/v1/files/key':
            return callback(undefined, {statusCode: 200}, mockFullResponse);
          case 'https://api.figma.com/v1/images/key?format=png&ids=legacyComponent%2Ccomponent&scale=1':
          case 'https://api.figma.com/v1/images/key?format=png&ids=legacyComponent%2Ccomponent&scale=2':
          case 'https://api.figma.com/v1/images/key?format=png&ids=legacyComponent%2Ccomponent&scale=3':
          case 'https://api.figma.com/v1/images/key?format=png&ids=legacyComponent%2Ccomponent&scale=4':
            return callback(undefined, {statusCode: 200}, {
              images: {
                component: uri.charAt(uri.length - 1),
              },
            });
          default:
            throw new Error(`Unexpected uri: ${uri}`);
        }
      });

      mockLocateFont.mockResolvedValue({
        name: 'Foobar-BoldItalic',
        family: 'Foobar',
        path: '/path/to/Foobar-BoldItalic.ttf',
        style: 'Bold Italic',
      });

      downloadStreamMock.mockImplementation((scale: string) => {
        const stream = new Readable();
        stream._read = () => {};
        stream.push(`asset @${scale}x`);
        stream.push(null);
        return Promise.resolve(stream);
      });

      await figma.export(
        {
          source: 'http://figma.com/file/key/name',
          assets: 'out',
          code: 'src',
        },
        '.',
      );

      expect(mockRequest).toHaveBeenNthCalledWith(
        1,
        {
          headers: {Authorization: 'Bearer mock-token'},
          json: true,
          uri: 'https://api.figma.com/v1/files/key',
        },
        expect.anything(),
      );

      expect(mockRequest).toHaveBeenNthCalledWith(
        2,
        {
          headers: {Authorization: 'Bearer mock-token'},
          json: true,
          uri: 'https://api.figma.com/v1/images/key?format=png&ids=legacyComponent%2Ccomponent&scale=1',
        },
        expect.anything(),
      );

      expect(mockRequest).toHaveBeenNthCalledWith(
        3,
        {
          headers: {Authorization: 'Bearer mock-token'},
          json: true,
          uri: 'https://api.figma.com/v1/images/key?format=png&ids=legacyComponent%2Ccomponent&scale=2',
        },
        expect.anything(),
      );

      expect(mockRequest).toHaveBeenNthCalledWith(
        4,
        {
          headers: {Authorization: 'Bearer mock-token'},
          json: true,
          uri: 'https://api.figma.com/v1/images/key?format=png&ids=legacyComponent%2Ccomponent&scale=3',
        },
        expect.anything(),
      );

      expect(mockRequest).toHaveBeenNthCalledWith(
        5,
        {
          headers: {Authorization: 'Bearer mock-token'},
          json: true,
          uri: 'https://api.figma.com/v1/images/key?format=png&ids=legacyComponent%2Ccomponent&scale=4',
        },
        expect.anything(),
      );

      expect(mockCodegen).toHaveBeenCalledWith({
        assets: new Map([[
          'components',
          new Map([
            [
              'LegacyTeamComponent',
              {width: 1920, height: 1080, src: 'out/Hello.figma.contents/components/LegacyTeamComponent.png'},
            ],
            [
              'TeamComponent',
              {width: 640, height: 480, src: 'out/Hello.figma.contents/components/TeamComponent.png'},
            ],
          ]),
        ]]),
        assetsDirectory: 'out/Hello.figma.contents',
        colors: [
          {
            initializer: 'Color.rgba(10, 10, 10, 1)',
            name: 'Diez Black',
          },
          {
            initializer: 'Color.rgba(10, 10, 10, 0.5)',
            name: 'Diez Black With Alpha',
          },
        ],
        gradients: [
          {
            initializer: 'new LinearGradient({stops: [GradientStop.make(0, Color.rgba(255, 0, 0, 1)), GradientStop.make(1, Color.rgba(173, 0, 255, 1))], start: Point2D.make(0, 0), end: Point2D.make(1, 1)})',
            name: 'Diez Red To Purple',
          },
        ],
        designLanguageName: 'Hello',
        filename: 'src/Hello.figma.ts',
        fonts: new Map([[
          'Foobar',
          new Map([['BoldItalic', {name: 'Foobar-BoldItalic', path: '/path/to/Foobar-BoldItalic.ttf'}]]),
        ]]),
        projectRoot: '.',
        shadows: [
          {
            initializer: 'new DropShadow({offset: Point2D.make(0, 1), radius: 16, color: Color.rgba(0, 0, 16, 0.4099999964237213)})',
            name: 'Diez Drop Shadow',
          },
        ],
        typographs: [
          {
            name: 'Foobar Typograph',
            initializer:
              'new Typograph({letterSpacing: 0.4824822, fontSize: 9001, lineHeight: 11, color: Color.rgba(100, 100, 100, 1), font: helloFonts.Foobar.BoldItalic})',
          },
          {
            name: 'Gradient Typograph',
            initializer: 'new Typograph({letterSpacing: 0.2222, fontSize: 9001, lineHeight: 1010, color: Color.rgba(255, 0, 0, 1), font: helloFonts.Foobar.BoldItalic})',
          },
        ],
      });

      process.nextTick(() => {
        expect(mockFileSystem['out/Hello.figma.contents/components/TeamComponent.png']).toBe('asset @1x');
        expect(mockFileSystem['out/Hello.figma.contents/components/TeamComponent@2x.png']).toBe('asset @2x');
        expect(mockFileSystem['out/Hello.figma.contents/components/TeamComponent@3x.png']).toBe('asset @3x');
        expect(mockFileSystem['out/Hello.figma.contents/components/TeamComponent@4x.png']).toBe('asset @4x');
      });
    });

    test('throws errors if unable to parse', async () => {
      await expect(figma.export({source: 'www.google.com', assets: 'out', code: 'noop'}, 'noop')).rejects.toThrow();
      await expect(FigmaExtractor.create().export(

        {
          source: 'http://figma.com/file/key/name',
          assets: 'out',
          code: 'noop',
        },
        'noop',
      )).rejects.toThrow();
    });

    test('configuration', async () => {
      const constructorArgs: string[] = [];
      mockGetFigmaAccessToken.mockImplementationOnce(() => 'access-token');
      await FigmaExtractor.configure(constructorArgs);
      expect(constructorArgs).toEqual(['access-token']);
      expect(mockRegistryGet).toHaveBeenCalledWith('figmaAccessToken');
      expect(mockRegistrySet).toHaveBeenCalledWith({figmaAccessToken: 'access-token'});
    });

    test('error retry', async () => {
      expect(await FigmaExtractor.shouldRetryError(new Error())).toBe(false);
      expect(mockRegistryDelete).not.toHaveBeenCalled();
      expect(await FigmaExtractor.shouldRetryError(new UnauthorizedRequestException())).toBe(true);
      expect(mockRegistryDelete).toHaveBeenCalledWith('figmaAccessToken');
    });
  });
});

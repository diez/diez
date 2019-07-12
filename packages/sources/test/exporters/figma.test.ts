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

const downloadStreamMock = jest.fn();
jest.doMock('@diez/storage', () => ({
  ...jest.requireActual('@diez/storage'),
  downloadStream: downloadStreamMock,
}));

import {Readable} from 'stream';
import {FigmaExporter, FigmaFile, FigmaPaintType} from '../../src/exporters/figma';

const figma = FigmaExporter.create('mock-token');

afterEach(cleanupMockFileSystem);

const mockAbbreviatedResponse: FigmaFile = {
  name: 'Hello',
  document: {
    children: [{
      id: '',
      name: '',
    }],
  },
};

const mockFullResponse: FigmaFile = {
  name: 'Hello',
  document: {
    children: [{
      id: 'component',
      name: '',
      absoluteBoundingBox: {
        width: 1920,
        height: 1080,
      },
      children: [
        {
          id: '',
          name: '',
          fills: [{
            type: FigmaPaintType.Solid,
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
                type: FigmaPaintType.Solid,
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
              },
              styles: {
                text: 'text',
              },
            },
            {
              id: '',
              name: '',
              fills: [{
                type: FigmaPaintType.GradientLinear,
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
            type: FigmaPaintType.GradientLinear,
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
          styles: {
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
    component: {
      name: 'Team Component',
    },
  },
  styles: {
    color: {
      name: 'Diez Black',
      styleType: 'FILL',
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
      expect(await FigmaExporter.canParse('test.sketch')).toBe(false);
      expect(await FigmaExporter.canParse('http://something.com/file/key/name')).toBe(false);
    });

    test('returns `true` if the file does look like a Figma file', async () => {
      expect(await FigmaExporter.canParse('http://figma.com/file/key/name')).toBe(true);
      expect(await FigmaExporter.canParse('http://figma.com/file/key')).toBe(true);
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
          case 'https://api.figma.com/v1/images/key?format=png&ids=component&scale=1':
          case 'https://api.figma.com/v1/images/key?format=png&ids=component&scale=2':
          case 'https://api.figma.com/v1/images/key?format=png&ids=component&scale=3':
          case 'https://api.figma.com/v1/images/key?format=png&ids=component&scale=4':
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
          uri: 'https://api.figma.com/v1/images/key?format=png&ids=component&scale=1',
        },
        expect.anything(),
      );

      expect(mockRequest).toHaveBeenNthCalledWith(
        3,
        {
          headers: {Authorization: 'Bearer mock-token'},
          json: true,
          uri: 'https://api.figma.com/v1/images/key?format=png&ids=component&scale=2',
        },
        expect.anything(),
      );

      expect(mockRequest).toHaveBeenNthCalledWith(
        4,
        {
          headers: {Authorization: 'Bearer mock-token'},
          json: true,
          uri: 'https://api.figma.com/v1/images/key?format=png&ids=component&scale=3',
        },
        expect.anything(),
      );

      expect(mockRequest).toHaveBeenNthCalledWith(
        5,
        {
          headers: {Authorization: 'Bearer mock-token'},
          json: true,
          uri: 'https://api.figma.com/v1/images/key?format=png&ids=component&scale=4',
        },
        expect.anything(),
      );

      expect(mockCodegen).toHaveBeenCalledWith({
        assets: new Map([[
          'components',
          new Map([[
            'TeamComponent',
            {width: 1920, height: 1080, src: 'out/Hello.figma.contents/components/TeamComponent.png'},
          ]]),
        ]]),
        assetsDirectory: 'out/Hello.figma.contents',
        colors: [
          {
            initializer: 'Color.rgba(10, 10, 10, 1)',
            name: 'Diez Black',
          },
        ],
        gradients: [
          {
            initializer: 'new LinearGradient({stops: [GradientStop.make(0.000000, Color.rgba(255, 0, 0, 1)), GradientStop.make(1.000000, Color.rgba(173, 0, 255, 1))], start: Point2D.make(0.000000, 0.000000), end: Point2D.make(1.000000, 1.000000)})',
            name: 'Diez Red To Purple',
          },
        ],
        designSystemName: 'Hello',
        filename: 'src/Hello.figma.ts',
        fonts: new Map([[
          'Foobar',
          new Map([['BoldItalic', {name: 'Foobar-BoldItalic', path: '/path/to/Foobar-BoldItalic.ttf'}]]),
        ]]),
        projectRoot: '.',
        typographs: [
          {
            name: 'Foobar Typograph',
            initializer:
              'new Typograph({color: Color.rgba(100, 100, 100, 1), font: HelloFonts.Foobar.BoldItalic, fontSize: 9001})',
          },
          {
            name: 'Gradient Typograph',
            initializer: 'new Typograph({color: Color.rgba(255, 0, 0, 1), font: HelloFonts.Foobar.BoldItalic, fontSize: 9001})',
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
      await expect(FigmaExporter.create().export(

        {
          source: 'http://figma.com/file/key/name',
          assets: 'out',
          code: 'noop',
        },
        'noop',
      )).rejects.toThrow();
    });
  });
});

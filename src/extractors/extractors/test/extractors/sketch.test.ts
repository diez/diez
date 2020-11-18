import {
  cleanupMockCommandData,
  cleanupMockFileSystem,
  cleanupMockOsData,
  mockCliCoreFactory,
  mockCodegen,
  mockExec,
  mockFsExtraFactory,
  mockGenerationFactory,
  mockLocateBinaryMacOS,
  mockLocateFont,
  mockOsData,
  mockOsFactory,
} from '@diez/test-utils';
jest.doMock('@diez/cli-core', mockCliCoreFactory);
jest.doMock('@diez/generation', mockGenerationFactory);
jest.doMock('os', mockOsFactory);
jest.doMock('fs-extra', mockFsExtraFactory);

import {ExtractableAssetType} from '@diez/generation';
import {writeFile} from 'fs-extra';
import SketchExtractor from '../../src/extractors/sketch';

const sketchtoolPath = '/Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool';
beforeEach(() => {
  mockLocateBinaryMacOS.mockResolvedValue('/Applications/Sketch.app');
  mockExec.mockImplementation((command: string) => {
    if (command.includes('dump')) {
      return Promise.resolve(JSON.stringify(MockDump));
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
const sketch = SketchExtractor.create();

describe('Sketch', () => {
  describe('canParse', () => {
    test('returns `false` if the file does not look like a Sketch file', async () => {
      await writeFile('test.ai', '');
      expect(await SketchExtractor.canParse('test.ai')).toBe(false);
      await writeFile('test.sketchster', '');
      expect(await SketchExtractor.canParse('test.sketchster')).toBe(false);
    });

    test('returns `false` if the file looks like a Sketch file but doesn\'t exist', async () => {
      expect(await SketchExtractor.canParse('test.sketch')).toBe(false);
    });

    test('returns `true` if the file does look like a Sketch file', async () => {
      await writeFile('test.sketch', '');
      expect(await SketchExtractor.canParse('test.sketch')).toBe(true);
      await writeFile('my/awesome/path/test.sketch', '');
      expect(await SketchExtractor.canParse('my/awesome/path/test.sketch')).toBe(true);
      await writeFile('/.haiku/cuboid.sketch  ', '');
      expect(await SketchExtractor.canParse('/.haiku/cuboid.sketch  ')).toBe(true);
    });
  });

  describe('export', () => {
    test('executes sketchtools commands on export', async () => {
      await writeFile('test.sketch', '');
      await sketch.export({source: 'test.sketch', assets: 'out', code: 'src'}, '.');
      expect(mockLocateBinaryMacOS).toHaveBeenCalledWith('com.bohemiancoding.sketch3');
      expect(mockExec).toHaveBeenCalledTimes(2);
      expect(mockExec).toHaveBeenNthCalledWith(1, `${sketchtoolPath} dump test.sketch`, expect.anything());
      expect(mockExec).toHaveBeenNthCalledWith(2,
        `${sketchtoolPath} export --format=png --scales=1,2,3,4 --output=out/Test.sketch.contents/images slices test.sketch`);
      expect(mockCodegen).toHaveBeenCalled();
      expect(mockCodegen).toHaveBeenCalledWith({
        assets: new Map([[
          ExtractableAssetType.Slice, new Map([[
            'Slice One', {
              width: 640,
              height: 480,
              src: 'out/Test.sketch.contents/images/Slice One.png',
            },
          ]]),
        ]]),
        assetsDirectory: 'out/Test.sketch.contents',
        colors: [
          {initializer: 'Color.rgba(255, 0, 0, 1)', name: 'Red'},
          {initializer: 'Color.rgba(0, 0, 0, 1)', name: 'black100'}],
        gradients: [{
          name: 'Pink To Orange',
          initializer: 'new LinearGradient({stops: [GradientStop.make(0, Color.rgba(255, 63, 112, 1)), GradientStop.make(1, Color.rgba(255, 154, 58, 1))], start: Point2D.make(0.256905282720629, -0.052988346280542), end: Point2D.make(0.912005467655469, 1.039424344240629)})',
        }],
        shadows: [
          {
            name: 'Card Style Drop Shadow',
            initializer: 'new DropShadow({offset: Point2D.make(0, 2), radius: 30, color: Color.rgba(255, 63, 112, 0.7)})',
          },
        ],
        designLanguageName: 'Test',
        filename: 'src/Test.sketch.ts',
        fonts: new Map([['Foobar', new Map([['BoldItalic', {name: 'Foobar-BoldItalic', path: '/path/to/Foobar-BoldItalic.ttf'}]])]]),
        projectRoot: '.',
        typographs: [
          {
            initializer: 'new Typograph({fontSize: 20, letterSpacing: 0, lineHeight: 22, alignment: TextAlignment.Center, color: Color.rgba(51, 51, 51, 1), font: testFonts.Foobar.BoldItalic})',
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

//dump file as of sketch 69.2
const MockDump = {
  "<class>": "MSDocumentData",
  "assets": {
    "<class>": "MSAssetCollection",
    "colorAssets": [
      {
        "color": {
          "value": "#ff0000"
        },
        "name": "Red"
      }
    ],
    "exportPresets": [
    ],
    "gradientAssets": [
      {
        "gradient": {
          "from": {
            "x": 0.2569052827206286,
            "y": -0.05298834628054177
          },
          "gradientType": 0,
          "stops": [
            {
              "color": {
                "value": "#ff3f70"
              },
              "position": 0
            },
            {
              "color": {
                "value": "#ff9a3a"
              },
              "position": 1
            }
          ],
          "to": {
            "x": 0.9120054676554693,
            "y": 1.0394243442406286
          }
        },
        "name": "Pink To Orange"
      },
      {
        "gradient": {
          "gradientType": 9999
        },
        "name": "Unrecognized Gradient"
      }
    ],
    "imageCollection": {
      "<class>": "MSImageCollection",
      "images": [
      ]
    },
    "images": [
    ],
    "objectID": "8335E990-AA26-4590-BA60-FA4E6CF48661"
  },
  "colorSpace": 0,
  "currentPageIndex": 0,
  "fontReferences": [
  ],
  "foreignLayerStyles": [
  ],
  "foreignSwatches": [
  ],
  "foreignSymbols": [
  ],
  "foreignTextStyles": [
  ],
  "layerStyles": {
    "<class>": "MSSharedStyleContainer",
    "objectID": "168A5A4B-D616-403B-9E96-F06A1E2BEB10",
    "objects":  [
      {
        "name": "Card Style",
        "value": {
          "shadows": [
            {
              "blurRadius": 30,
              "color": {
                "value": "rgba(255,63,112,0.70)"
              },
              "isEnabled": 1,
              "offsetX": 0,
              "offsetY": 2
            }
          ]
        }
      }
    ]
  },
  "layerSymbols": {
    "<class>": "MSSymbolContainer",
    "objectID": "77F091C0-4AAB-4A80-B636-BBC84CAE04F5",
    "objects": [
    ]
  },
  "layerTextStyles": {
    "<class>": "MSSharedTextStyleContainer",
    "objectID": "7CFD9958-C4BB-4D7A-B695-453B245D8775",
    "objects": [
      {
        "name": "Heading 1",
        "value": {
          "textStyle": {
            "MSAttributedStringColorAttribute": {
              "value": "#333333"
            },
            "NSFont": {
              "attributes": {
                "NSFontNameAttribute": "Foobar-BoldItalic",
                "NSFontSizeAttribute": 20
              },
              "family": "Foobar"
            },
            "NSKern": 0,
            "NSParagraphStyle": {
              "style": {
                "alignment": 2,
                "maximumLineHeight": 22
              }
            }
          }
        }
      }
    ]
  },
  "objectID": "B5E44FBE-6ADC-4038-B3D8-E4B95456786B",
  "pages": [
    {
      "<class>": "MSPage",
      "booleanOperation": -1,
      "clippingMaskMode": 0,
      "exportOptions": {
        "<class>": "MSExportOptions",
        "exportFormats": [
        ],
        "includedLayerIds": [
        ],
        "layerOptions": 0,
        "shouldTrim": 0
      },
      "frame": {
        "<class>": "MSRect",
        "constrainProportions": 1,
        "height": 0,
        "width": 0,
        "x": 0,
        "y": 0
      },
      "groupLayout": {
        "<class>": "MSFreeformGroupLayout"
      },
      "hasClickThrough": 1,
      "hasClippingMask": 0,
      "horizontalRulerData": {
        "<class>": "MSRulerData",
        "base": 0,
        "guides": [
        ]
      },
      "includeInCloudUpload": 1,
      "isFixedToViewport": 0,
      "isFlippedHorizontal": 0,
      "isFlippedVertical": 0,
      "isLocked": 0,
      "isVisible": 1,
      "layerListExpandedType": 0,
      "layers": [
        {
          "<class>": "MSArtboardGroup",
          "exportOptions": {
            "exportFormats": [
              {
              }
            ]
          },
          "frame": {
            "height": 1080,
            "width": 1920
          },
          "layers": [
            {
              "<class>": "Sliced Rectangle",
              "exportOptions": {
                "exportFormats": [
                  {
                  }
                ]
              },
              "frame": {
                "height": 480,
                "width": 640
              },
              "name": "Slice One"
            },
            {
              "<class>": "Unsliced Rectangle",
              "exportOptions": {
                "exportFormats": [
                ]
              },
              "frame": {
                "height": 480,
                "width": 640
              },
              "name": "Slice Two"
            }
          ],
          "name": "Artboard"
        },
        {
          "<class>": "MSOvalShape",
          "booleanOperation": -1,
          "clippingMaskMode": 0,
          "edited": 0,
          "exportOptions": {
            "<class>": "MSExportOptions",
            "exportFormats": [
            ],
            "includedLayerIds": [
            ],
            "layerOptions": 0,
            "shouldTrim": 0
          },
          "frame": {
            "<class>": "MSRect",
            "constrainProportions": 0,
            "height": 50,
            "width": 50,
            "x": 116,
            "y": 98
          },
          "hasClippingMask": 0,
          "isClosed": 1,
          "isFixedToViewport": 0,
          "isFlippedHorizontal": 0,
          "isFlippedVertical": 0,
          "isLocked": 0,
          "isVisible": 1,
          "layerListExpandedType": 0,
          "name": "Oval",
          "nameIsFixed": 0,
          "objectID": "ADE4609D-1DEC-4F75-BE15-FD633A98B766",
          "pointRadiusBehaviour": 1,
          "points": [
            {
              "<class>": "MSCurvePoint",
              "cornerRadius": 0,
              "curveFrom": {
                "x": 0.7761423749,
                "y": 1
              },
              "curveMode": 2,
              "curveTo": {
                "x": 0.2238576251,
                "y": 1
              },
              "hasCurveFrom": 1,
              "hasCurveTo": 1,
              "point": {
                "x": 0.5,
                "y": 1
              }
            },
            {
              "<class>": "MSCurvePoint",
              "cornerRadius": 0,
              "curveFrom": {
                "x": 1,
                "y": 0.2238576251
              },
              "curveMode": 2,
              "curveTo": {
                "x": 1,
                "y": 0.7761423749
              },
              "hasCurveFrom": 1,
              "hasCurveTo": 1,
              "point": {
                "x": 1,
                "y": 0.5
              }
            },
            {
              "<class>": "MSCurvePoint",
              "cornerRadius": 0,
              "curveFrom": {
                "x": 0.2238576251,
                "y": 0
              },
              "curveMode": 2,
              "curveTo": {
                "x": 0.7761423749,
                "y": 0
              },
              "hasCurveFrom": 1,
              "hasCurveTo": 1,
              "point": {
                "x": 0.5,
                "y": 0
              }
            },
            {
              "<class>": "MSCurvePoint",
              "cornerRadius": 0,
              "curveFrom": {
                "x": 0,
                "y": 0.7761423749
              },
              "curveMode": 2,
              "curveTo": {
                "x": 0,
                "y": 0.2238576251
              },
              "hasCurveFrom": 1,
              "hasCurveTo": 1,
              "point": {
                "x": 0,
                "y": 0.5
              }
            }
          ],
          "resizingConstraint": 63,
          "resizingType": 0,
          "rotation": 0,
          "shouldBreakMaskChain": 0,
          "style": {
            "<class>": "MSStyle",
            "blur": {
              "<class>": "MSStyleBlur",
              "center": {
                "x": 0.5,
                "y": 0.5
              },
              "isEnabled": 0,
              "motionAngle": 0,
              "radius": 10,
              "saturation": 1,
              "type": 0
            },
            "borderOptions": {
              "<class>": "MSStyleBorderOptions",
              "dashPattern": [
              ],
              "isEnabled": 1,
              "lineCapStyle": 0,
              "lineJoinStyle": 0
            },
            "borders": [
            ],
            "colorControls": {
              "<class>": "MSStyleColorControls",
              "brightness": 0,
              "contrast": 1,
              "hue": 0,
              "isEnabled": 0,
              "saturation": 1
            },
            "contextSettings": {
              "<class>": "MSGraphicsContextSettings",
              "blendMode": 0,
              "opacity": 1
            },
            "endMarkerType": 0,
            "fills": [
              {
                "<class>": "MSStyleFill",
                "color": {
                  "<class>": "MSColor",
                  "value": "#B71919"
                },
                "contextSettings": {
                  "<class>": "MSGraphicsContextSettings",
                  "blendMode": 0,
                  "opacity": 1
                },
                "fillType": 0,
                "gradient": {
                  "<class>": "MSGradient",
                  "elipseLength": 0,
                  "from": {
                    "x": 0.5,
                    "y": 0
                  },
                  "gradientType": 0,
                  "stops": [
                    {
                      "<class>": "MSGradientStop",
                      "color": {
                        "<class>": "MSColor",
                        "value": "#FFFFFF"
                      },
                      "position": 0
                    },
                    {
                      "<class>": "MSGradientStop",
                      "color": {
                        "<class>": "MSColor",
                        "value": "#000000"
                      },
                      "position": 1
                    }
                  ],
                  "to": {
                    "x": 0.5,
                    "y": 1
                  }
                },
                "isEnabled": 1,
                "noiseIndex": 0,
                "noiseIntensity": 0,
                "patternFillType": 1,
                "patternTileScale": 1
              }
            ],
            "innerShadows": [
            ],
            "miterLimit": 10,
            "objectID": "3610B108-A33B-4D47-8573-136786A59785",
            "shadows": [
            ],
            "startMarkerType": 0,
            "windingRule": 1
          }
        }
      ],
      "name": "Page 1",
      "nameIsFixed": 1,
      "objectID": "B9118184-189B-44AE-A58B-4323495BC701",
      "resizingConstraint": 63,
      "resizingType": 0,
      "rotation": 0,
      "shouldBreakMaskChain": 0,
      "style": {
        "<class>": "MSStyle",
        "blur": {
          "<class>": "MSStyleBlur",
          "center": {
            "x": 0.5,
            "y": 0.5
          },
          "isEnabled": 0,
          "motionAngle": 0,
          "radius": 10,
          "saturation": 1,
          "type": 0
        },
        "borderOptions": {
          "<class>": "MSStyleBorderOptions",
          "dashPattern": [
          ],
          "isEnabled": 1,
          "lineCapStyle": 0,
          "lineJoinStyle": 0
        },
        "borders": [
        ],
        "colorControls": {
          "<class>": "MSStyleColorControls",
          "brightness": 0,
          "contrast": 1,
          "hue": 0,
          "isEnabled": 0,
          "saturation": 1
        },
        "contextSettings": {
          "<class>": "MSGraphicsContextSettings",
          "blendMode": 0,
          "opacity": 1
        },
        "endMarkerType": 0,
        "fills": [
        ],
        "innerShadows": [
        ],
        "miterLimit": 10,
        "objectID": "3383F41C-80E8-41AB-9BBE-7474E56AAF59",
        "shadows": [
        ],
        "startMarkerType": 0,
        "windingRule": 1
      },
      "verticalRulerData": {
        "<class>": "MSRulerData",
        "base": 0,
        "guides": [
        ]
      }
    }
  ],
  "patchInfo": {
    "<class>": "MSPatchInfo"
  },
  "sharedSwatches": {
    "<class>": "SketchModel.MSSwatchContainer",
    "objectID": "763A430D-C4C5-4E67-880F-C7FDDF496595",
    "objects": [
      {
        "<class>": "MSSwatch",
        "name": "black100",
        "objectID": "93726977-DEC0-45D3-83D2-08BA3AA4BB67",
        "value": {
          "<class>": "MSColor",
          "value": "#000000"
        }
      }
    ]
  },
  "workspaceItems": [
  ]
};

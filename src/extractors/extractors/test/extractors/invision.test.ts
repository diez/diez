/* tslint:disable:import-name */
import {
  mockCodegen,
  mockFsExtraFactory,
  mockGenerationFactory,
} from '@diez/test-utils';
jest.doMock('fs-extra', mockFsExtraFactory);
jest.doMock('@diez/generation', mockGenerationFactory);

jest.mock('fontkit', () => ({
  openSync: () => ({}),
}));

jest.doMock('../../src/utils.network', () => ({
  ...jest.requireActual('../../src/utils.network'),
  performGetRequest: () => {
    return {
      list: {
        name: 'Test',
        colors: [
          {
            name: 'Palette',
            colors: [
              {
                name: 'Red',
                value: '#ff0000',
              },
            ],
          },
        ],
      },
    };
  },
}));

import InVisionExtractor from '../../src/extractors/invision';


afterEach(() => {
  mockCodegen.mockReset();
});

const invision = InVisionExtractor.create();

describe('InvisionExtractor', () => {
  test('canParse', async () => {
    expect(await InVisionExtractor.canParse('really not a URL')).toBe(false);
    expect(await InVisionExtractor.canParse('https://www.google.com')).toBe(
      false,
    );
    expect(
      await InVisionExtractor.canParse(
        'https://projects.invisionapp.com?exportFormat=lookup',
      ),
    ).toBe(false);
    expect(
      await InVisionExtractor.canParse(
        'https://projects.invisionapp.com?exportFormat=list',
      ),
    ).toBe(false);
    expect(
      await InVisionExtractor.canParse(
        'https://projects.invisionapp.com?exportFormat=list&key=foobar',
      ),
    ).toBe(false);
    expect(
      await InVisionExtractor.canParse(
        'https://projects.invisionapp.com/style-data.json?exportFormat=list&key=foobar',
      ),
    ).toBe(true);
  });

  describe('export', () => {
    test('exports from InVision DSM', async () => {
      await invision.export(
        {
          source:
            'projects.invisionapp.com/style-data.json?exportFormat=list&key=foobar',
          assets: 'out',
          code: 'src',
        },
        '.',
      );
      expect(mockCodegen).toHaveBeenCalledWith({
        assets: new Map(),
        assetsDirectory: 'out/Test.invision.contents',
        colors: [{initializer: 'Color.rgba(255, 0, 0, 1)', name: 'Red'}],
        gradients: [],
        shadows: [],
        fonts: new Map(),
        designLanguageName: 'Test',
        filename: 'src/Test.invision.ts',
        projectRoot: '.',
        typographs: [],
      });
    });
  });
});

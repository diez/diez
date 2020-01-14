import {cleanupMockCommandData, cleanupMockOsData, mockCliCoreFactory, mockExec, mockOsData, mockOsFactory} from '@diez/test-utils';
jest.doMock('os', mockOsFactory);
jest.doMock('@diez/cli-core', mockCliCoreFactory);

import {getTypographInitializer, locateFont} from '../src/typograph';

afterEach(() => {
  cleanupMockCommandData();
  cleanupMockOsData();
});

describe('typograph', () => {
  test('macOS font location', async () => {
    mockOsData.platform = 'darwin';
    mockExec.mockResolvedValue(JSON.stringify([]));
    expect(await locateFont('', {})).toBeUndefined();

    mockExec.mockRejectedValueOnce(true);
    expect(await locateFont('', {})).toBeUndefined();

    const nullFont = {name: '', style: '', path: ''};
    mockExec.mockResolvedValue(JSON.stringify([nullFont]));
    expect(await locateFont('nil', {style: 'normal'})).toEqual(nullFont);
    expect(await locateFont('nil', {style: 'italic'})).toEqual(nullFont);

    mockExec.mockResolvedValue(JSON.stringify([
      {
        name : 'Poppins-Regular',
        style : 'Regular',
        path : '\/path\/to\/Poppins-Regular.ttf',
      },
      {
        name : 'Poppins-Italic',
        style : 'Italic',
        path : '\/path\/to\/Poppins-Italic.ttf',
      },
    ]));

    expect(await locateFont('', {style: 'italic'})).toEqual({
      name: 'Poppins-Italic',
      path: '/path/to/Poppins-Italic.ttf',
      style: 'Italic',
    });

    expect(await locateFont('', {style: 'normal'})).toEqual({
      name: 'Poppins-Regular',
      path: '/path/to/Poppins-Regular.ttf',
      style: 'Regular',
    });

    expect(await locateFont('', {name: 'Poppins-Regular'})).toEqual({
      name: 'Poppins-Regular',
      path: '/path/to/Poppins-Regular.ttf',
      style: 'Regular',
    });

    expect(await locateFont('', {name: 'Poppins-Nonexistent'})).toEqual({
      name: 'Poppins-Regular',
      path: '/path/to/Poppins-Regular.ttf',
      style: 'Regular',
    });

    // Trigger cache lookup.
    expect(await locateFont('', {name: 'Poppins-Nonexistent'})).toEqual({
      name: 'Poppins-Regular',
      path: '/path/to/Poppins-Regular.ttf',
      style: 'Regular',
    });
  });

  test('non-macOS font location', async () => {
    mockOsData.platform = 'linux';
    expect(await locateFont('', {})).toBeUndefined();
  });

  test('typograph initializer', () => {
    expect(getTypographInitializer('DesignLanguage', undefined, 'Foobar-Regular', {fontSize: 20, color: 'new Color()'})).toBe(
      'new Typograph({fontSize: 20, color: new Color(), font: new Font({name: "Foobar-Regular"})})',
    );
    expect(getTypographInitializer(
      'DesignLanguage',
      {
        family: 'Foobar',
        style: 'Regular',
        name: 'Foobar-Regular',
        path: '/path/to/Foobar-Regular.ttf',
      },
      'Foobar-Regular',
      {
        fontSize: 20,
        letterSpacing: 33,
        lineHeight: 12,
        alignment: 'TextAlignment.Center',
      },
    )).toBe(
      'new Typograph({fontSize: 20, letterSpacing: 33, lineHeight: 12, alignment: TextAlignment.Center, font: designLanguageFonts.Foobar.Regular})',
    );
  });
});

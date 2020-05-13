import {fetchGoogleFontsFromApi} from '../../scripts/commands/generate-google-fonts.action';
import {GoogleFontCollection} from '../../scripts/utils';

const apiKey = 'xxxxxxxxx';
const requestLibMock = jest.fn(async () => {
  return {body: {items: []}};
});

describe('getGoogleFontCollection', () => {
  test('loadAction', async () => {
    await fetchGoogleFontsFromApi({apiKey, requestLib: requestLibMock});
    expect(requestLibMock).toHaveBeenCalledWith(expect.objectContaining({url: expect.stringContaining(apiKey)}));
  });
});

describe('GoogleFontCollection', () => {
  test('generates a typescript file from a given collection', () => {
    const creator = new GoogleFontCollection();
    creator.set('My Font Family', '900italic');
    creator.set('My Font Family', 'regular');
    const out = creator.generateTypescriptFile();
    expect(out).toMatch("MyFontFamilyBlack900Italic: Font.googleWebFont('My Font Family', {weight: 900, style: FontStyle.Italic}),");
    expect(out).toMatch("MyFontFamilyRegular400: Font.googleWebFont('My Font Family', {weight: 400, style: FontStyle.Normal})");
  });
});

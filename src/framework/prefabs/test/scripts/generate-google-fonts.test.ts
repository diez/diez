import {getGoogleFontCollection} from '../../scripts/commands/generate-google-fonts.action';
import {GoogleFontCollectionCreator} from '../../scripts/utils';

const apiKey = 'xxxxxxxxx';
const requestLibMock = jest.fn(async () => {
  return {body: {items: []}};
});

describe('getGoogleFontCollection', () => {
  test('loadAction', async () => {
    await getGoogleFontCollection({apiKey, requestLib: requestLibMock});
    expect(requestLibMock).toHaveBeenCalledWith(expect.objectContaining({url: expect.stringContaining(apiKey)}));
  });
});

describe('GoogleFontCollectionCreator', () => {
  test('generates a typescript file from a given collection', () => {
    const creator = new GoogleFontCollectionCreator();
    creator.set('My Font Family', '900italic');
    creator.set('My Font Family', 'regular');
    const out = creator.generateTypescriptFile();
    expect(out).toMatch("MyFontFamilyBlack900Italic: Font.googleWebFont('My Font Family', {weight: 900, style: FontStyle.Italic}),");
    expect(out).toMatch("MyFontFamilyRegular400: Font.googleWebFont('My Font Family', {weight: 400, style: FontStyle.Normal})");
  });
});

import {CliAction} from '@diez/cli-core';
import {writeFile} from 'fs-extra';
import {join} from 'path';
import phin from 'phin';
import {GoogleFontCollection} from '../utils';

interface GoogleFontsFamily {
  family: string;
  variants: string[];
}

interface GoogleFontsCollection {
  items: GoogleFontsFamily[];
}

type RequestLib = (options: {url: string, parse?: 'json'}) => Promise<{body: GoogleFontsCollection}>;

/**
 * Fetch all fonts available in Google Fonts via their Developer API.
 */
export const fetchGoogleFontsFromApi = async (apiKey: string, requestLib = phin as RequestLib) => {
  const response = await requestLib({
    url: `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`,
    parse: 'json',
  });

  return response.body.items;
};

interface GenerateGoogleFontsParams {
  apiKey: string;
}

const generateGoogleFontsAction: CliAction = async ({apiKey}: GenerateGoogleFontsParams) => {
  const availableFonts = await fetchGoogleFontsFromApi(apiKey);
  const collection = new GoogleFontCollection();

  for (const {family, variants} of availableFonts) {
    for (const variant of variants) {
      collection.set(family, variant);
    }
  }

  await writeFile(join('src', 'resources', 'web-google-fonts.ts'), collection.toTypeScriptEnum());
};

export default generateGoogleFontsAction;

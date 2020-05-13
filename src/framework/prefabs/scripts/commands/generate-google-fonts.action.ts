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

interface FetchGoogleFontsFromApiParams {
  apiKey: string;
  requestLib? (options: {url: string, parse?: string}): Promise<{body: GoogleFontsCollection}>;
}

/**
 * Fetch all fonts available in Google Fonts via their Developer API.
 */
export const fetchGoogleFontsFromApi = async ({apiKey, requestLib = phin}: FetchGoogleFontsFromApiParams) => {
  const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`;
  const {body} = await requestLib({url, parse: 'json'});
  return body.items;
};

interface GenerateGoogleFontsParams {
  apiKey: string;
}

const generateGoogleFontsAction: CliAction = async ({apiKey}: GenerateGoogleFontsParams) => {
  const googleFontsResponse = await fetchGoogleFontsFromApi({apiKey});
  const collection = new GoogleFontCollection();

  for (const {family, variants} of googleFontsResponse) {
    for (const variant of variants) {
      collection.set(family, variant);
    }
  }

  await writeFile(join('src', 'resources', 'web-google-fonts.ts'), collection.generateTypescriptFile());
};

export default generateGoogleFontsAction;

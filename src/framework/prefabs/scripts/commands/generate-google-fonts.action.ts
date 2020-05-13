import {CliAction} from '@diez/cli-core';
import {writeFile} from 'fs-extra';
import {join} from 'path';
import phin from 'phin';
import {GoogleFontCollectionCreator} from '../utils';

interface GenerateGoogleFontsParams {
  apiKey: string;
}

interface GoogleFontsFamily {
  family: string;
  variants: string[];
}

interface GoogleFontsCollection {
  items: GoogleFontsFamily[];
}

interface GoogleFontsResponse {
  body: GoogleFontsCollection;
}

interface GetGoogleFontCollectionParams {
  apiKey: string;
  requestLib? ({url, parse}: {url: string, parse: string}): Promise<GoogleFontsResponse>;
}

/**
 * TODO
 */
export const getGoogleFontCollection = async ({apiKey, requestLib = phin}: GetGoogleFontCollectionParams) => {
  const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`;
  const {body} = await requestLib({url, parse: 'json'});
  return body.items;
};

const googleFontsAction: CliAction = async ({apiKey}: GenerateGoogleFontsParams) => {
  const googleFontsResponse = await getGoogleFontCollection({apiKey});
  const creator = new GoogleFontCollectionCreator();

  for (const {family, variants} of googleFontsResponse) {
    for (const variant of variants) {
      creator.set(family, variant);
    }
  }

  await writeFile(join('src', 'resources', 'web-google-fonts.ts'), creator.generateTypescriptFile());
};

export default googleFontsAction;

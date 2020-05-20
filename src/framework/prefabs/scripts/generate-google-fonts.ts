import {generateGoogleFontsAction} from './internal/helpers';

if (!process.argv[2]) {
  throw new Error('Please provide your Google Developer API key.');
}

generateGoogleFontsAction({apiKey: process.argv[2]});

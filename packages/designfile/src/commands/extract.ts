import {CliCommandProvider} from '@livedesigner/cli';
import {extractAction as action} from './extract.action';

const provider: CliCommandProvider = {
  action,
  name: 'extract',
  description: 'Extracts SVG assets from an input design file. Sketch, Illustrator, and Figma files are supported.',
};

export = provider;

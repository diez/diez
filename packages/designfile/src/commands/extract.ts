import {provideCommand} from '@livedesigner/cli';
import {extractAction} from './extract.action';

export = provideCommand(
  'extract',
  'Extracts SVG assets from an input design file. Sketch, Illustrator, and Figma files are supported.',
  extractAction,
);

import {info, success} from '@livedesigner/cli';
import {Registry} from '@livedesigner/storage';
import {prompt} from 'enquirer';
import {ExporterFactory} from '../exporters';
import {FigmaExporter, getFigmaAccessToken} from '../exporters/figma';
import {IllustratorExporter} from '../exporters/illustrator';
import {SketchExporter} from '../exporters/sketch';

const findFactory = async (source: string): Promise<ExporterFactory> => {
  for (const factory of [FigmaExporter, IllustratorExporter, SketchExporter]) {
    if (await factory.canParse(source)) {
      return factory;
    }
  }

  throw new Error('Unable to find appropriate exporter for that design file.');
};

interface Answers {
  designFile: string;
  outputDirectory: string;
  figmaToken: string;
}

export const extractAction = async () => {
  const {designFile, outputDirectory} = await prompt<Answers>([
    {
      type: 'input',
      name: 'designFile',
      message: 'Enter a design file for SVG asset extraction.\n\nYou may use a local filesystem ' +
        'path for Sketch and Illustrator files, or a remote Figma URL for Figma files.\n',
      required: true,
    },
    {
      type: 'input',
      name: 'outputDirectory',
      message: 'Enter an output directory.',
      required: true,
      initial: process.cwd(),
    },
  ]);
  const constructorArgs: string[] = [];
  const factory = await findFactory(designFile);
  if (factory === FigmaExporter) {
    let figmaAccessToken = await Registry.get('figmaAccessToken');
    if (!figmaAccessToken) {
      info('Figma authentication required.');
      figmaAccessToken = await getFigmaAccessToken();
      await Registry.set('figmaAccessToken', figmaAccessToken);
    }
    // TODO: clean up Figma access token in the event of expired, invalid, or revoked token.
    constructorArgs.push(figmaAccessToken as string);
  }

  const exporter = factory.create(...constructorArgs);
  await exporter.exportSVG(designFile, outputDirectory, info);
  success(`Design files were extracted to ${outputDirectory}.`);
};

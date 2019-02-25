import {info, provideCommand, success} from '@livedesigner/cli';
import {prompt} from 'enquirer';
import {ExporterFactory} from '../exporters';
import {FigmaExporter} from '../exporters/figma';
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

export = provideCommand(
  'extract',
  'Extract SVG assets from an input design file. Sketch, Illustrator, and Figma files are supported.',
  async () => {
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
      const {figmaToken} = await prompt<Answers>([
        {
          type: 'input',
          name: 'figmaToken',
          message: 'Enter your Figma access token.',
          required: true,
        },
      ]);
      constructorArgs.push(figmaToken);
    }

    const exporter = factory.create(...constructorArgs);
    // TODO: handle Figma token.
    await exporter.exportSVG(designFile, outputDirectory, info);
    success(`Design files were extracted to ${outputDirectory}.`);
  },
);

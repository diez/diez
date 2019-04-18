import {info, success, warning, UnauthorizedRequestException} from '@diez/cli';
import {Registry} from '@diez/storage';
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
  figmaToken?: string;
}

const performExtraction = async (answers: Answers) => {
  const constructorArgs: string[] = [];
  const factory = await findFactory(answers.designFile);
  if (factory === FigmaExporter) {
    let figmaAccessToken = await Registry.get('figmaAccessToken');
    if (!figmaAccessToken) {
      info('Figma authentication required.');
      figmaAccessToken = await getFigmaAccessToken();
      await Registry.set('figmaAccessToken', figmaAccessToken);
    }
    constructorArgs.push(figmaAccessToken as string);
  }

  try {
    const exporter = factory.create(...constructorArgs);
    await exporter.exportSVG(answers.designFile, answers.outputDirectory, {progress: info, error: warning});
  } catch (error) {
    if (error instanceof UnauthorizedRequestException) {
      await Registry.delete('figmaAccessToken');
      await performExtraction(answers);
    } else {
      throw error;
    }
  }
};

export const extractAction = async () => {
  const {designFile, outputDirectory} = await prompt<Answers>([
    {
      type: 'input',
      name: 'designFile',
      message: `Enter a design file for SVG asset extraction.

You may use a local filesystem path for Sketch and Illustrator files, or a remote Figma URL for Figma files.
`,
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

  await performExtraction({designFile, outputDirectory});

  success(`Design files were extracted to ${outputDirectory}.`);
};

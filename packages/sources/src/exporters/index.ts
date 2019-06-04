import {info, UnauthorizedRequestException, warning} from '@diez/cli-core';
import {Registry} from '@diez/storage';
import {ExporterFactory, ExporterInput} from '../api';
import {FigmaExporter, getFigmaAccessToken} from '../exporters/figma';
import {IllustratorExporter} from '../exporters/illustrator';
import {InVisionExporter} from '../exporters/invision';
import {SketchExporter} from '../exporters/sketch';

/**
 * Locates the correct factory for a given source.
 * @internal
 */
const findFactory = async (source: string): Promise<ExporterFactory> => {
  for (const factory of [FigmaExporter, IllustratorExporter, SketchExporter, InVisionExporter]) {
    if (await factory.canParse(source)) {
      return factory;
    }
  }

  throw new Error(`Unable to find appropriate exporter for ${source}.`);
};

/**
 * Performs extraction for a bespoke ExporterInput.
 */
export const performExtraction = async (
  input: ExporterInput,
  projectRoot: string,
) => {
  const constructorArgs: string[] = [];
  const factory = await findFactory(input.source);
  if (factory === FigmaExporter) {
    let figmaAccessToken = await Registry.get('figmaAccessToken');
    if (!figmaAccessToken) {
      info('Figma authentication required.');
      figmaAccessToken = await getFigmaAccessToken();
      await Registry.set({figmaAccessToken});
    }
    constructorArgs.push(figmaAccessToken as string);
  }

  try {
    const exporter = factory.create(...constructorArgs);
    await exporter.export(input, projectRoot, {progress: info, error: warning});
  } catch (error) {
    if (error instanceof UnauthorizedRequestException) {
      await Registry.delete('figmaAccessToken');
      await performExtraction(input, projectRoot);
    } else {
      throw error;
    }
  }
};

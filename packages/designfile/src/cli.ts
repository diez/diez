import {fatalError, info, provideCommand, success} from '@livedesigner/cli';
import {ExporterFactory} from './exporters';
import {FigmaExporter} from './exporters/figma';
import {IllustratorExporter} from './exporters/illustrator';
import {SketchExporter} from './exporters/sketch';

const findFactory = async (source: string): Promise<ExporterFactory> => {
  for (const factory of [FigmaExporter, IllustratorExporter, SketchExporter]) {
    if (await factory.canParse(source)) {
      return factory;
    }
  }

  throw new Error('Unable to find appropriate exporter for that design file.');
};

export default provideCommand(
  'extract <designFile> <outputDirectory>',
  'Extract SVG assets from an input design file. Sketch, Illustrator, and Figma files are supported.',
  async (designFile: string, outputDirectory: string) => {
    try {
      const factory = await findFactory(designFile);
      const exporter = factory.create();
      // TODO: handle Figma token.
      await exporter.exportSVG(designFile, outputDirectory, info);
      success(`Design files were extracted to ${outputDirectory}.`);
    } catch (error) {
      fatalError(error.message);
    }
  },
);

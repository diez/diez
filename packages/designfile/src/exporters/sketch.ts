import {execAsync, isMacOS} from '@diez/cli';
import {pathExists} from 'fs-extra';
import {extname, join} from 'path';
import {Exporter, ExporterFactory, ProgressReporter} from '.';
import {createFolders, escapeShell, fixGammaOfPNGFiles, locateBinaryMacOS} from '../helpers/ioUtils';

const enum ValidType {
  Slice,
  Artboard,
}

const folders = new Map<ValidType, string>([
  [ValidType.Slice, 'slices'],
  [ValidType.Artboard, 'artboards'],
]);

const sketchExtension = '.sketch';

/**
 *
 * @param sketchtoolPath path to the `sketchtool` executable
 * @param source Sketch file from where to export
 * @param folder output folder
 */
const runExportCommand = async (sketchtoolPath: string, source: string, folder: string, out: string) => {
  const output = escapeShell(join(out, folder));
  const command = `${sketchtoolPath} export --format=svg --output=${output} ${folder} ${escapeShell(source)}`;

  await execAsync(command);
  return true;
};

// tslint:disable-next-line:variable-name
export const SketchExporter: ExporterFactory = class implements Exporter {
  /**
   * ExporterFactory interface method.
   */
  static create () {
    return new this();
  }

  /**
   * ExporterFactory interface method.
   * Returns a boolean indicating if the source provided can be opened in Sketch and parsed by this module.
   */
  static async canParse (source: string) {
    const fileExists = await pathExists(source);
    return fileExists && extname(source.trim()) === sketchExtension;
  }

  /**
   * Exports SVG contents from the given `source` into the `out` folder.
   *
   * @param source from where to extract the SVG
   * @param out directory to put the SVG
   */
  async exportSVG (source: string, out: string, onProgress: ProgressReporter = console.log) {
    if (!await SketchExporter.canParse(source)) {
      throw new Error('Invalid source file.');
    }

    if (!isMacOS()) {
      throw new Error('Sketch export is only supported on macOS');
    }

    const sketchPath = await locateBinaryMacOS('com.bohemiancoding.sketch3');
    const parserCliPath = `${sketchPath}/Contents/Resources/sketchtool/bin/sketchtool`;
    if (!sketchPath || !await pathExists(parserCliPath)) {
      throw new Error('Unable to locate Sketch installation.');
    }

    onProgress('Creating necessary folders.');
    await createFolders(out, folders);
    onProgress('Running sketchtool export commands.');
    await runExportCommand(parserCliPath, source, folders.get(ValidType.Slice)!, out);
    await runExportCommand(parserCliPath, source, folders.get(ValidType.Artboard)!, out);

    // Now loop through all of the outputs and fix the gamma value which leads to opacitation inconsistencies
    // between browsers
    onProgress('Fixing gamma of png files.');
    await fixGammaOfPNGFiles(out);
  }
};

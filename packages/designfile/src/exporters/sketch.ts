import {exec} from 'child_process';
import {pathExists} from 'fs-extra';
import {extname, join} from 'path';
import {Exportable, ProgressReporter} from '.';
import {createFolders, escapeShell, fixGammaOfPNGFiles} from '../helpers/ioUtils';

const enum ValidType {
  Slice,
  Artboard,
}

const folders = new Map<ValidType, string>([
  [ValidType.Slice, 'slices'],
  [ValidType.Artboard, 'artboards'],
]);

const SKETCH_EXTENSION = '.sketch';
export const PARSER_CLI_PATH = '/Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool';

/**
 *
 * @param sketchtoolPath path to the `sketchtool` executable
 * @param source Sketch file from where to export
 * @param folder output folder
 */
const runExportCommand = async (sketchtoolPath: string, source: string, folder: string, out: string) => {
  const output = escapeShell(join(out, folder));
  const command = `${sketchtoolPath} export --format=svg --output=${output} ${folder} ${escapeShell(source)}`;

  return new Promise((resolve, reject) => {
    exec(command, (error) => {
      if (error) {
        return reject(error);
      }

      resolve(true);
    });
  });
};

export const sketch: Exportable = {
  /**
   * Returns a boolean indicating if the source provided can be opened in Sketch and parsed by this module.
   */
  async canParse (source: string) {
    const fileExists = await pathExists(source);
    return fileExists && extname(source.trim()) === SKETCH_EXTENSION;
  },

  /**
   * Exports SVG contents from the given `source` into the `out` folder.
   *
   * @param source from where to extract the SVG
   * @param out directory to put the SVG
   */
  async exportSVG (source: string, out: string, onProgress: ProgressReporter) {
    if (!await this.canParse(source)) {
      throw new Error('Invalid source file.');
    }

    if (!await pathExists(PARSER_CLI_PATH)) {
      throw new Error('The file provided can\'t be opened in Sketch.');
    }

    onProgress('Creating necessary folders.');
    await createFolders(out, folders);
    onProgress('Running sketchtool export commands.');
    await runExportCommand(PARSER_CLI_PATH, source, folders.get(ValidType.Slice)!, out);
    await runExportCommand(PARSER_CLI_PATH, source, folders.get(ValidType.Artboard)!, out);

    // Now loop through all of the outputs and fix the gamma value which leads to opacitation inconsistencies
    // between browsers
    onProgress('Fixing gamma of png files.');
    await fixGammaOfPNGFiles(out);
  },
};

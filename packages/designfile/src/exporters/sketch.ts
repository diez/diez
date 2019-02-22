import child_process from 'child_process';
import fsExtra from 'fs-extra';
import path from 'path';
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
const PARSER_CLI_PATH = '/Contents/Resources/sketchtool/bin/sketchtool';
const INSTALL_PATH = '/Applications/Sketch.app';

/**
 *
 * @param sketchtoolPath path to the `sketchtool` executable
 * @param source Sketch file from where to export
 * @param folder output folder
 */
const runExportCommand = async (sketchtoolPath: string, source: string, folder: string, out: string) => {
  const output = escapeShell(path.join(out, folder));
  const command = `${sketchtoolPath} export --format=svg --output=${output} ${folder} ${escapeShell(source)}`;

  return new Promise((resolve, reject) => {
    child_process.exec(command, (error) => {
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
  canParse (source: string) {
    return path.extname(source.trim()) === SKETCH_EXTENSION;
  },

  /**
   * Exports SVG contents from the given `source` into the `out` folder.
   *
   * @param source from where to extract the SVG
   * @param out directory to put the SVG
   */
  async exportSVG (source: string, out: string, onProgress: ProgressReporter) {
    const sketchtoolPath = INSTALL_PATH + PARSER_CLI_PATH;

    if (!this.canParse(source)) {
      throw new Error('Invalid source file.');
    }

    if (!fsExtra.existsSync(sketchtoolPath)) {
      throw new Error('The file provided can\'t be opened in Sketch.');
    }

    onProgress('Creating necessary folders.');
    await createFolders(out, folders);
    onProgress('Running sketchtool export commands.');
    await runExportCommand(sketchtoolPath, source, folders.get(ValidType.Slice)!, out);
    await runExportCommand(sketchtoolPath, source, folders.get(ValidType.Artboard)!, out);

    // Now loop through all of the outputs and fix the gamma value which leads to opacitation inconsistencies
    // between browsers
    onProgress('Fixing gamma of png files.');
    await fixGammaOfPNGFiles(out);
  },
};

import {exec} from 'child_process';
import {pathExists, writeFile} from 'fs-extra';
import {extname, join, resolve} from 'path';
import {Exporter, ExporterFactory, ProgressReporter} from '.';
import {createFolders, generateRandomFilePath} from '../helpers/ioUtils';

const illustratorExtension = '.ai';

const enum ValidType {
  Artboard,
}

const folders = new Map<ValidType, string>([
  [ValidType.Artboard, 'artboards'],
]);

/**
 * This template script runs inside Illustrator and perform the export of the
 * artboards as SVG files.
 *
 * Full documentation of Illustrator scripting can be found [in the official reference][1].
 *
 * note: this script needs to be dynamically defined because the DEST_PATH
 * string changes from import to import.
 *
 * [1]: https://adobe.ly/2GHpjEa
 */
export const illustratorExportScript = `
  if (app.documents.length > 0) {
    var exportOptions = new ExportOptionsSVG()
    var type = ExportType.SVG
    var dest = 'DEST_PATH'
    var sourcePath = 'SOURCE_PATH'
    var fileSpec = new File(dest)

    // Try open/focus on the file to export
    app.open(new File(sourcePath))

    var srcFile = app.activeDocument.fullName;

    // Export options can be further customized, check out the documentation.
    exportOptions.embedRasterImages = true
    exportOptions.embedAllFonts = false
    exportOptions.cssProperties = SVGCSSPropertyLocation.PRESENTATIONATTRIBUTES
    exportOptions.fontSubsetting = SVGFontSubsetting.None
    exportOptions.documentEncoding = SVGDocumentEncoding.UTF8
    exportOptions.saveMultipleArtboards = true

    // Export all artboards in the current document
    app.activeDocument.exportFile(fileSpec, type, exportOptions)

    // Unfortunately exporting artboards sets the exported file as the current
    // active document, so we need to close it, and open the original ai file
    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    app.open(srcFile);
  }
`;

/**
 * Opens a file in Illustrator
 *
 * @param file path to the file to be opened by Illustrator
 */
const openIllustratorFile = async (file: string) => {
  return new Promise<boolean>((resolvePromise, rejectPromise) => {
    exec(`open -g -b com.adobe.Illustrator ${file}`, (error) => {
      if (error) {
        return rejectPromise(false);
      }

      resolvePromise(true);
    });
  });
};

/**
 * Generate a string containing an Illustrator (jsx) script to export Artboards.
 *
 * @param outdir directory to export the assets
 * @param source illustrator source file
 */
const generateScript = (outdir: string, source: string) => {
  return illustratorExportScript
    .replace('DEST_PATH', resolve(outdir))
    .replace('SOURCE_PATH', resolve(source));
};

// tslint:disable-next-line:variable-name
export const IllustratorExporter: ExporterFactory = class implements Exporter {
  /**
   * ExporterFactory interface method.
   */
  static create () {
    return new this();
  }

  /**
   * ExporterFactory interface method.
   * Returns a boolean indicating if the source provided can be opened in Illustrator and parsed by this module.
   */
  static async canParse (source: string) {
    const fileExists = await pathExists(source);
    return Boolean(fileExists) && extname(source.trim()) === illustratorExtension;
  }

  /**
   * Exports SVG contents from the given `source` into the `out` folder.
   *
   * @param source from where to extract the SVG
   * @param out directory to put the SVG
   */
  async exportSVG (source: string, out: string, onProgress: ProgressReporter = console.log) {
    if (!await IllustratorExporter.canParse(source)) {
      throw new Error('Invalid source file.');
    }

    onProgress('Creating necessary folders.');
    await createFolders(out, folders);
    const exportScriptPath = generateRandomFilePath('jsx');
    const outdir = join(out, folders.get(ValidType.Artboard)!);
    const exportScriptContents = generateScript(outdir, source);
    onProgress('Running export script.');
    await writeFile(exportScriptPath, exportScriptContents);
    await openIllustratorFile(source);
    await openIllustratorFile(exportScriptPath);
  }
};

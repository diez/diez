import child_process from 'child_process';
import fsExtra from 'fs-extra';
import path from 'path';
import {Exportable} from '.';
import {createFolders, generateRandomFilePath} from '../helpers/ioUtils';

const ILLUSTRATOR_EXTENSION = '.ai';

enum VALID_TYPES {
  ARTBOARD,
}

const FOLDERS = {
  [VALID_TYPES.ARTBOARD]: 'artboards',
};

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
export const ILLUSTRATOR_EXPORT_SCRIPT = `
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
  return new Promise<boolean>((resolve, reject) => {
    child_process.exec(`open -g -b com.adobe.Illustrator ${file}`, (error) => {
      if (error) {
        return reject(false);
      }

      resolve(true);
    });
  });
};

export const illustrator: Exportable = {
  /**
   * Returns a boolean indicating if the source provided can be opened in Illustrator and parsed by this module.
   */
  canParse (source: string) {
    return path.extname(source.trim()) === ILLUSTRATOR_EXTENSION;
  },

  /**
   * Exports SVG contents from the given `source` into the `out` folder.
   *
   * @param source from where to extract the SVG
   * @param out directory to put the SVG
   */
  async exportSVG (source: string, out: string) {
    if (!this.canParse(source)) {
      throw new Error('Invalid source file.');
    }

    await createFolders(out, FOLDERS);
    const exportScriptPath = generateRandomFilePath('jsx');
    const outdir = path.join(out, FOLDERS[VALID_TYPES.ARTBOARD]);
    const exportScriptContents = ILLUSTRATOR_EXPORT_SCRIPT.replace('DEST_PATH', outdir).replace('SOURCE_PATH', source);
    await fsExtra.writeFile(exportScriptPath, exportScriptContents);
    await openIllustratorFile(source);
    await openIllustratorFile(exportScriptPath);
  },
};

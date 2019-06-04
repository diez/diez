import {execAsync} from '@diez/cli-core';
import {AssetFolder, pascalCase} from '@diez/generation';
import {pathExists, writeFile} from 'fs-extra';
import {basename, extname, join, resolve} from 'path';
import {Exporter, ExporterFactory, ExporterInput} from '../api';
import {cliReporters, createFolders, generateRandomFilePath} from '../utils';

const illustratorExtension = '.ai';

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
 * @ignore
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
  await execAsync(`open -g -b com.adobe.Illustrator ${file}`);
  return true;
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

class IllustratorExporterImplementation implements Exporter {
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
   * Exports assets from Illustrator.
   */
  async export (
    {source, assets}: ExporterInput,
    projectRoot: string,
    reporters = cliReporters,
  ) {
    if (!await IllustratorExporter.canParse(source)) {
      throw new Error('Invalid source file');
    }

    const componentName = pascalCase(basename(source, '.ai'));
    const assetName = `${componentName}.ai`;
    const out = join(assets, `${assetName}.contents`);

    reporters.progress('Creating necessary folders.');
    await createFolders(out, [AssetFolder.Artboard]);
    const exportScriptPath = generateRandomFilePath('jsx');
    const outdir = join(out, AssetFolder.Artboard);
    const exportScriptContents = generateScript(outdir, source);
    reporters.progress('Running export script.');
    await writeFile(exportScriptPath, exportScriptContents);
    await openIllustratorFile(source);
    await openIllustratorFile(exportScriptPath);
  }
}

/**
 * The Illustrator exporter.
 */
export const IllustratorExporter: ExporterFactory = IllustratorExporterImplementation;

import {execAsync, isMacOS, warning} from '@diez/cli-core';
import {
  codegenDesignSystem,
  createDesignSystemSpec,
  getColorInitializer,
  locateFont,
  pascalCase,
} from '@diez/generation';
import {pathExists} from 'fs-extra';
import {basename, extname, join} from 'path';
import {Exporter, ExporterFactory, ExporterInput} from '../api';
import {cliReporters, createFolders, escapeShell, fixGammaOfSVGs, locateBinaryMacOS} from '../utils';

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
 * @param sketchtoolPath path to the `sketchtool` executable
 * @param source Sketch file from where to export
 * @param folder output folder
 */
const runExportCommand = (sketchtoolPath: string, source: string, folder: string, out: string) => {
  const output = escapeShell(join(out, folder));
  const command = `${sketchtoolPath} export --format=svg --output=${output} ${folder} ${escapeShell(source)}`;

  return execAsync(command);
};

interface SketchColorAsset {
  name: string;
  color: {
    value: string;
  };
}

interface SketchAssets {
  colorAssets: SketchColorAsset[];
  // TODO: support gradients.
  gradientAssets: never[];
  // TODO: support images.
  imageCollection: never[];
}

interface SketchSharedTextStyle {
  name: string;
  value: {
    textStyle: {
      MSAttributedStringColorAttribute: {
        value: string;
      };
      NSFont: {
        attributes: {
          NSFontNameAttribute: string;
          NSFontSizeAttribute: number;
        };
        family: string;
      };
    };
  };
}

interface SketchDump {
  assets: SketchAssets;
  layerTextStyles: {
    objects: SketchSharedTextStyle[];
  };
}

class SketchExporterImplementation implements Exporter {
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
   * Exports assets from Sketch files.
   */
  async export (
    {source, assets, code}: ExporterInput,
    projectRoot: string,
    reporters = cliReporters,
  ) {
    if (!await SketchExporter.canParse(source)) {
      throw new Error('Invalid source file');
    }

    if (!isMacOS()) {
      throw new Error('Sketch export is only supported on macOS');
    }

    const sketchPath = await locateBinaryMacOS('com.bohemiancoding.sketch3');
    const parserCliPath = `${sketchPath}/Contents/Resources/sketchtool/bin/sketchtool`;
    if (!sketchPath || !await pathExists(parserCliPath)) {
      throw new Error('Unable to locate Sketch installation');
    }

    const designSystemName = pascalCase(basename(source, '.sketch'));
    const assetName = `${designSystemName}.sketch`;
    const assetsDirectory = join(assets, `${assetName}.contents`);

    reporters.progress(`Creating necessary folders for ${assetName}`);
    await createFolders(assetsDirectory, folders);
    reporters.progress(`Running sketchtool export commands for ${assetName}`);
    const [dump] = await Promise.all([
      execAsync(`${parserCliPath} dump ${source}`),
      runExportCommand(parserCliPath, source, folders.get(ValidType.Slice)!, assetsDirectory),
      runExportCommand(parserCliPath, source, folders.get(ValidType.Artboard)!, assetsDirectory),
    ]);
    reporters.progress(`Extracting design tokens for ${assetName}`);
    const output = JSON.parse(dump) as SketchDump;
    const codegenSpec = createDesignSystemSpec(
      designSystemName,
      assetsDirectory,
      join(code, `${assetName}.ts`),
      projectRoot,
    );

    for (const {name, color: {value}} of output.assets.colorAssets) {
      codegenSpec.colors.push({
        name,
        initializer: getColorInitializer(value),
      });
    }

    for (const {name, value: {textStyle}} of output.layerTextStyles.objects) {
      const fontSize = textStyle.NSFont.attributes.NSFontSizeAttribute;
      const candidateFont = await locateFont(
        textStyle.NSFont.family,
        {name: textStyle.NSFont.attributes.NSFontNameAttribute},
      );
      if (candidateFont) {
        codegenSpec.fontRegistry.add(candidateFont.path);
      } else {
        warning(`Unable to locate system font assets for ${textStyle.NSFont.attributes.NSFontNameAttribute}.`);
      }

      const fontName = candidateFont ? candidateFont.name : textStyle.NSFont.attributes.NSFontNameAttribute;
      codegenSpec.fontNames.add(fontName);
      codegenSpec.textStyles.push({
        name,
        initializer: `new TextStyle({color: ${getColorInitializer(textStyle.MSAttributedStringColorAttribute.value)}, fontName: "${fontName}", fontSize: ${fontSize}})`,
      });
    }

    // Now loop through all of the outputs and fix the gamma value which leads to opacitation inconsistencies
    // between browsers.
    reporters.progress(`Fixing gamma for ${assetName}`);
    await Promise.all([
      fixGammaOfSVGs(assetsDirectory),
      codegenDesignSystem(codegenSpec),
    ]);
  }
}

/**
 * The Sketch exporter.
 */
export const SketchExporter: ExporterFactory = SketchExporterImplementation;

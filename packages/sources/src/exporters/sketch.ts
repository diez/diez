import {execAsync, isMacOS, warning} from '@diez/cli-core';
import {
  AssetFolder,
  codegenDesignSystem,
  createDesignSystemSpec,
  GeneratedAssets,
  getColorInitializer,
  getTypographInitializer,
  locateFont,
  pascalCase,
  registerAsset,
} from '@diez/generation';
import {pathExists} from 'fs-extra';
import {basename, extname, join, relative} from 'path';
import {Exporter, ExporterFactory, ExporterInput} from '../api';
import {cliReporters, createFolders, escapeShell, locateBinaryMacOS} from '../utils';

const sketchExtension = '.sketch';

/**
 * @param sketchtoolPath path to the `sketchtool` executable
 * @param source Sketch file from where to export
 * @param folder output folder
 */
const runExportCommand = (sketchtoolPath: string, source: string, folder: string, out: string) => {
  const output = escapeShell(join(out, folder));
  const command =
    `${sketchtoolPath} export --format=png --scales=1,2,3,4 --output=${output} ${folder} ${escapeShell(source)}`;

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

interface SketchSharedTypograph {
  name: string;
  value: {
    textStyle: {
      MSAttributedStringColorAttribute?: {
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

interface SketchLayer {
  ['<class>']: string;
  exportOptions: {
    exportFormats: {}[];
  };
  layers?: SketchLayer[];
  frame: {
    width: number;
    height: number;
  };
  name: string;
}

interface SketchDump {
  assets: SketchAssets;
  layerTextStyles: {
    objects: SketchSharedTypograph[];
  };
  pages: SketchLayer[];
}

const isClassOfSlice = (classType: string) =>
  classType !== 'MSArtboardGroup' && classType !== 'MSPage';

const populateAssets = (assetsDirectory: string, layers: SketchLayer[], extractedAssets: GeneratedAssets) => {
  for (const layer of layers) {
    if (layer.exportOptions.exportFormats.length && isClassOfSlice(layer['<class>'])) {
      registerAsset(
        {
          src: join(assetsDirectory, AssetFolder.Slice, `${layer.name}.png`),
          width: layer.frame.width,
          height: layer.frame.height,
        },
        AssetFolder.Slice,
        extractedAssets,
      );
    }

    if (layer.layers) {
      populateAssets(assetsDirectory, layer.layers, extractedAssets);
    }
  }
};

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
    await createFolders(assetsDirectory, [AssetFolder.Slice, AssetFolder.Artboard]);
    reporters.progress(`Running sketchtool export commands for ${assetName}`);
    const [rawDump] = await Promise.all([
      execAsync(`${parserCliPath} dump ${source}`, {maxBuffer: 48 * (1 << 20)}),
      runExportCommand(parserCliPath, source, AssetFolder.Slice, assetsDirectory),
    ]);

    reporters.progress(`Extracting design tokens for ${assetName}`);
    const dump = JSON.parse(rawDump) as SketchDump;
    const codegenSpec = createDesignSystemSpec(
      designSystemName,
      assetsDirectory,
      join(code, `${assetName}.ts`),
      projectRoot,
    );

    populateAssets(relative(projectRoot, assetsDirectory), dump.pages, codegenSpec.assets);

    for (const {name, color: {value}} of dump.assets.colorAssets) {
      codegenSpec.colors.push({
        name,
        initializer: getColorInitializer(value),
      });
    }

    for (const {name, value: {textStyle}} of dump.layerTextStyles.objects) {
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
      codegenSpec.typographs.push({
        name,
        initializer: getTypographInitializer(
          fontName,
          fontSize,
          textStyle.MSAttributedStringColorAttribute ? textStyle.MSAttributedStringColorAttribute.value : undefined,
        ),
      });
    }

    return codegenDesignSystem(codegenSpec);
  }
}

/**
 * The Sketch exporter.
 */
export const SketchExporter: ExporterFactory = SketchExporterImplementation;

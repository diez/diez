import {execAsync, isMacOS, locateBinaryMacOS, Log} from '@diez/cli-core';
import {Extractor, ExtractorInput} from '@diez/extractors-core';
import {
  AssetFolder,
  codegenDesignLanguage,
  CodegenDesignLanguage,
  createDesignLanguageSpec,
  GeneratedAssets,
  getColorInitializer,
  getDropShadowInitializer,
  getLinearGradientInitializer,
  getTypographInitializer,
  locateFont,
  pascalCase,
  registerAsset,
  registerFont,
} from '@diez/generation';
import {pathExists} from 'fs-extra';
import {basename, extname, join, relative} from 'path';
import {cliReporters, createFolders, escapeShell} from '../utils';

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

interface SketchColor {
  value: string;
}

interface SketchColorAsset {
  name: string;
  color: SketchColor;
}

interface SketchPoint {
  x: number;
  y: number;
}

interface SketchGradientStop {
  position: number;
  color: SketchColor;
}

const enum SketchGradientType {
  Linear = 0,
}

interface SketchLinearGradient {
  gradientType: SketchGradientType.Linear;
  from: SketchPoint;
  to: SketchPoint;
  stops: SketchGradientStop[];
}

type SketchGradient = SketchLinearGradient | {gradientType: unknown};

const isSketchLinearGradient = (gradient: SketchGradient): gradient is SketchLinearGradient => {
  return gradient.gradientType === SketchGradientType.Linear;
};

interface SketchGradientAsset {
  name: string;
  gradient: SketchGradient;
}

interface SketchAssets {
  colorAssets: SketchColorAsset[];
  gradientAssets: SketchGradientAsset[];
  // TODO: support images.
  imageCollection: never[];
}

interface SketchSharedTypograph {
  name: string;
  value: {
    textStyle: {
      NSKern: number;
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
      NSParagraphStyle: {
        style: {
          alignment: number;
          maximumLineHeight: number;
        },
      }

    };
  };
}

interface SketchDropShadow {
  offsetX: number;
  offsetY: number;
  blurRadius: number;
  color: SketchColor;
}

interface SketchSharedLayerStyle {
  name: string;
  value: {
    shadows: SketchDropShadow[];
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
  layerStyles: {
    objects: SketchSharedLayerStyle[];
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

const getLinearGradientInitializerForSketchGradient = (gradient: SketchLinearGradient) => {
  const stops = gradient.stops.map((stop) => {
    return {
      position: stop.position,
      colorInitializer: getColorInitializer(stop.color.value),
    };
  });
  return getLinearGradientInitializer(stops, gradient.from, gradient.to);
};

const populateInitializerForSketchGradient = (gradient: SketchGradient, name: string, spec: CodegenDesignLanguage) => {
  if (isSketchLinearGradient(gradient)) {
    spec.gradients.push({
      name,
      initializer: getLinearGradientInitializerForSketchGradient(gradient),
    });
    return;
  }
};

const mapNSTextAlignment = (aligment: number) => {
  switch (aligment) {
    case 0:
      return 'TextAlignment.Left';
    case 1:
      return 'TextAlignment.Right';
    case 2:
      return 'TextAlignment.Center';
    case 4:
      return 'TextAlignment.Natural';
    default:
      return undefined;
  }
};

class SketchExtractor implements Extractor {
  /**
   * ExtractorFactory interface method.
   */
  static create () {
    return new this();
  }

  /**
   * ExtractorFactory interface method.
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
    {source, assets, code}: ExtractorInput,
    projectRoot: string,
    reporters = cliReporters,
  ) {
    if (!await SketchExtractor.canParse(source)) {
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

    const designLanguageName = pascalCase(basename(source, '.sketch'));
    const assetName = `${designLanguageName}.sketch`;
    const assetsDirectory = join(assets, `${assetName}.contents`);

    reporters.progress(`Creating necessary folders for ${assetName}`);
    await createFolders(assetsDirectory, [AssetFolder.Slice]);
    reporters.progress(`Running sketchtool export commands for ${assetName}`);
    const [rawDump] = await Promise.all([
      execAsync(`${parserCliPath} dump ${source}`, {maxBuffer: 48 * (1 << 20)}),
      runExportCommand(parserCliPath, source, AssetFolder.Slice, assetsDirectory),
    ]);

    reporters.progress(`Extracting design tokens for ${assetName}`);
    const dump = JSON.parse(rawDump) as SketchDump;
    const codegenSpec = createDesignLanguageSpec(
      designLanguageName,
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

    for (const gradient of dump.assets.gradientAssets) {
      populateInitializerForSketchGradient(gradient.gradient, gradient.name, codegenSpec);
    }

    for (const style of dump.layerStyles.objects.filter((object) => object.value.shadows.length)) {
      const shadow = style.value.shadows[0]!;
      const initializer = getDropShadowInitializer({
        colorInitializer: getColorInitializer(shadow.color.value),
        offset: {
          x: shadow.offsetX,
          y: shadow.offsetY,
        },
        radius: shadow.blurRadius,
      });
      codegenSpec.shadows.push({
        initializer,
        name: `${style.name} Drop Shadow`,
      });
    }

    for (const {name, value: {textStyle}} of dump.layerTextStyles.objects) {
      const fontSize = textStyle.NSFont.attributes.NSFontSizeAttribute;
      const letterSpacing = textStyle.NSKern;
      const lineHeight = textStyle.NSParagraphStyle.style.maximumLineHeight;
      const alignment = mapNSTextAlignment(textStyle.NSParagraphStyle.style.alignment);
      const candidateFont = await locateFont(
        textStyle.NSFont.family,
        {name: textStyle.NSFont.attributes.NSFontNameAttribute},
      );
      if (candidateFont) {
        await registerFont(candidateFont, codegenSpec.fonts);
      } else {
        Log.warning(`Unable to locate system font assets for ${textStyle.NSFont.attributes.NSFontNameAttribute}.`);
      }

      codegenSpec.typographs.push({
        name,
        initializer: getTypographInitializer(
          codegenSpec.designLanguageName,
          candidateFont,
          textStyle.NSFont.attributes.NSFontNameAttribute,
          {
            fontSize,
            letterSpacing,
            lineHeight,
            alignment,
            color: textStyle.MSAttributedStringColorAttribute ?
              getColorInitializer(textStyle.MSAttributedStringColorAttribute.value) :
              undefined,
          },
        ),
      });
    }

    return codegenDesignLanguage(codegenSpec);
  }
}

export = SketchExtractor;

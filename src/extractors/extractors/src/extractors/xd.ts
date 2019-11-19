import {execAsync, Log} from '@diez/cli-core';
import {Extractor, ExtractorInput} from '@diez/extractors-core';
import {
  AssetFolder,
  codegenDesignSystem,
  CodegenDesignSystem,
  createDesignSystemSpec,
  getTypographInitializer,
  locateFont,
  pascalCase,
  registerFont,
} from '@diez/generation';
import {getTempFileName} from '@diez/storage';
import {ensureDirSync, pathExists, readJsonSync} from 'fs-extra';
import {basename, extname, join} from 'path';
import {cliReporters, createFolders} from '../utils';

const xdExtension = '.xd';

interface XdColorValue {
  mode: 'RGB';
  value: {
    r: number;
    g: number;
    b: number;
  };
}

interface XdColorRepresentation {
  type: 'application/vnd.adobe.xdcolor+json' | 'unknown';
  content: XdColorValue;
}

interface XdColor {
  type: 'application/vnd.adobe.element.color+dcx' | 'unknown';
  name: string;
  representations: XdColorRepresentation[];
}

interface XdCharacterStyleRepresentation {
  type: 'application/vnd.adobe.characterstyle+json' | 'unknown';
  content: {
    fontFamily: string;
    fontStyle: string;
    fontSize: number;
    fontColor: XdColorValue;
  };
}

interface XdCharacterStyle {
  type: 'application/vnd.adobe.element.characterstyle+dcx' | 'unknown';
  name: string;
  representations: XdCharacterStyleRepresentation[];
}

type XdElement = XdColor | XdCharacterStyle | {type: 'unknown'};

interface XdManifest {
  resources?: {
    meta?: {
      ux?: {
        documentLibrary?: {
          elements: Iterable<XdElement>;
        },
      },
    },
  };
}

const assimilateColor = (codegenSpec: CodegenDesignSystem, element: XdColor) => {
  const representation = element.representations[0];
  if (!representation || representation.type !== 'application/vnd.adobe.xdcolor+json') {
    return;
  }

  const {r, g, b} = representation.content.value;
  codegenSpec.colors.push({
    name: element.name,
    initializer: `Color.rgb(${r}, ${g}, ${b})`,
  });
};

const assimilateCharacterStyle = async (codegenSpec: CodegenDesignSystem, element: XdCharacterStyle) => {
  const representation = element.representations[0];
  if (!representation || representation.type !== 'application/vnd.adobe.characterstyle+json') {
    return;
  }

  const {fontFamily, fontStyle, fontSize, fontColor: {value: {r, g, b}}} = representation.content;
  // Really "likely name"…#fixme
  const name = `${fontFamily}-${fontStyle}`;
  const candidateFont = await locateFont(
    fontFamily,
    {name},
  );
  if (candidateFont) {
    await registerFont(candidateFont, codegenSpec.fonts);
  } else {
    Log.warning(`Unable to locate system font assets for family ${fontFamily} and style ${fontStyle}.`);
  }

  codegenSpec.typographs.push({
    name: element.name,
    initializer: getTypographInitializer(
      codegenSpec.designSystemName,
      candidateFont,
      name,
      fontSize,
      `rgb(${r}, ${g}, ${b})`,
    ),
  });
};

const parseManifest = async (codegenSpec: CodegenDesignSystem, manifest?: XdManifest) => {
  if (
    !manifest || !manifest.resources || !manifest.resources.meta ||
    !manifest.resources.meta.ux || !manifest.resources.meta.ux.documentLibrary) {
    return;
  }

  for (const element of manifest.resources.meta.ux.documentLibrary.elements) {
    if (element.type === 'application/vnd.adobe.element.color+dcx') {
      assimilateColor(codegenSpec, element);
      continue;
    }

    if (element.type === 'application/vnd.adobe.element.characterstyle+dcx') {
      await assimilateCharacterStyle(codegenSpec, element);
      continue;
    }
  }
};

class XdExtractor implements Extractor {
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
    return fileExists && extname(source.trim()) === xdExtension;
  }

  /**
   * Exports assets from Sketch files.
   */
  async export (
    {source, assets, code}: ExtractorInput,
    projectRoot: string,
    reporters = cliReporters,
  ) {
    if (!await XdExtractor.canParse(source)) {
      throw new Error('Invalid source file');
    }

    const designSystemName = pascalCase(basename(source, '.xd'));
    const assetName = `${designSystemName}.xd`;
    const assetsDirectory = join(assets, `${assetName}.contents`);

    reporters.progress(`Creating necessary folders for ${assetName}...`);
    await createFolders(assetsDirectory, [AssetFolder.Slice]);
    reporters.progress(`Extracting design system from ${assetName}...`);
    const contentsDirectory = getTempFileName();
    ensureDirSync(contentsDirectory);
    await execAsync(`unzip ${source} -d ${contentsDirectory}`);

    reporters.progress(`Parsing design tokens from ${assetName}...`);

    const manifestPath = join(contentsDirectory, 'resources', 'graphics', 'graphicContent.agc');
    const manifestJson = readJsonSync(manifestPath) as XdManifest;

    const codegenSpec = createDesignSystemSpec(
      designSystemName,
      assetsDirectory,
      join(code, `${assetName}.ts`),
      projectRoot,
    );

    await parseManifest(codegenSpec, manifestJson);

    return codegenDesignSystem(codegenSpec);
  }
}

export = XdExtractor;

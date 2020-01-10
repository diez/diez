import {Log, UnauthorizedRequestException} from '@diez/cli-core';
import {Extractor, ExtractorInput} from '@diez/extractors-core';
import {
  AssetFolder,
  codegenDesignLanguage,
  CodegenDesignLanguage,
  createDesignLanguageSpec,
  getDropShadowInitializer,
  getLinearGradientInitializer,
  getTypographInitializer,
  locateFont,
  pascalCase,
  registerAsset,
  registerFont,
  UniqueNameResolver,
} from '@diez/generation';
import {downloadStream, Registry} from '@diez/storage';
import {createWriteStream} from 'fs-extra';
import {join, relative} from 'path';
import {parse, URLSearchParams} from 'url';
import {OAuthable} from '../api';
import {chunk, cliReporters, createFolders} from '../utils';
import {
  getFigmaAccessToken,
  performGetRequestWithBearerToken,
} from '../utils.network';

const figmaHost = 'figma.com';
const apiBase = 'https://api.figma.com/v1';

const figmaDefaultFilename = 'Untitled';
const importBatchSize = 100;

const enum FigmaType {
  Slice = 'SLICE',
  Group = 'GROUP',
  Frame = 'FRAME',
  Component = 'COMPONENT',
}

const folders = new Map<FigmaType, AssetFolder>([
  [FigmaType.Component, AssetFolder.Component],
]);

/**
 * Describes a Figma paint type retrieved from the Figma API.
 * @ignore
 */
const enum FigmaPaintType {
  Solid = 'SOLID',
  GradientLinear = 'GRADIENT_LINEAR',
}

interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface FigmaColorStop {
  position: number;
  color: FigmaColor;
}

interface FigmaLinearGradient {
  type: FigmaPaintType.GradientLinear;
  gradientHandlePositions: FigmaVector[];
  gradientStops: FigmaColorStop[];
}

interface FigmaSolid {
  type: FigmaPaintType.Solid;
  color: FigmaColor;
  opacity: number;
}

type FigmaPaint = FigmaSolid | FigmaLinearGradient | {type: unknown};

const isFigmaLinearGradient = (paint: FigmaPaint): paint is FigmaLinearGradient => {
  return paint.type === FigmaPaintType.GradientLinear;
};

const isFigmaSolid = (paint: FigmaPaint): paint is FigmaSolid => {
  return paint.type === FigmaPaintType.Solid;
};

/**
 * Describes a Figma effect type retrieved from the Figma API.
 * @ignore
 */
const enum FigmaEffectType {
  DropShadow = 'DROP_SHADOW',
}

interface FigmaVector {
  x: number;
  y: number;
}

interface FigmaDropShadow {
  type: FigmaEffectType.DropShadow;
  color: FigmaColor;
  offset: FigmaVector;
  radius: number;
}

type FigmaEffect = FigmaDropShadow | {type: unknown};

const isFigmaDropShadow = (effect: FigmaEffect): effect is FigmaDropShadow => {
  return effect.type === FigmaEffectType.DropShadow;
};

interface FigmaTextStyle {
  fontFamily: string;
  fontPostScriptName: string;
  fontSize: number;
}

interface FigmaDimensions {
  width: number;
  height: number;
}

interface FigmaNode {
  id: string;
  componentId?: string;
  name: string;
  children?: FigmaNode[];
  absoluteBoundingBox?: FigmaDimensions;
  effects?: FigmaEffect[];
  fills?: FigmaPaint[];
  style?: FigmaTextStyle;
  styles?: {
    effect?: string;
    fill?: string;
    text?: string;
  };
}

interface FigmaFile {
  name: string;
  document: {
    children: FigmaNode[];
  };
  styles?: {
    [id: string]: {
      name: string;
      styleType: 'FILL' | 'TEXT' | 'EFFECT';
    };
  };
  components?: {
    [id: string]: {
      name: string;
    };
  };
}

interface FigmaImageResponse {
  err: null|string;
  images: FigmaImagesURL;
}

interface FigmaImagesURL {
  [id: string]: string;
}

/**
 * Parses a Figma URL and returns an object describing the project, if the URL is invalid or can't be parsed
 * returns `null`.
 * @param rawUrl a Figma project URL
 */
const parseProjectURL = (rawUrl: string) => {
  const parsedUrl = parse(rawUrl);

  if (parsedUrl && parsedUrl.pathname && parsedUrl.host && parsedUrl.host.endsWith(figmaHost)) {
    const paths = parsedUrl.pathname.split('/');
    return {id: paths[2] || '', name: paths[3] || figmaDefaultFilename};
  }

  return null;
};

/**
 * Fetch document info from the Figma API
 *
 * @param id ID of the Figma document
 */
const fetchFile = (id: string, authToken: string): Promise<FigmaFile> => {
  return performGetRequestWithBearerToken<FigmaFile>(`${apiBase}/files/${id}`, authToken);
};

interface AssetDownloadParams {
  scale: string;
  ids: string;
}

const downloadAssets = async (
  filenameMap: Map<string, string>,
  assetsDirectory: string,
  fileId: string,
  authToken: string,
) => {
  if (!filenameMap.size) {
    Log.info('This Figma file does not contain any images (designated as Figma Components).');
    return;
  }

  Log.info('Retrieving component URLs from the Figma API...');
  const componentIds = chunk(Array.from(filenameMap.keys()), importBatchSize);
  const downloadParams: AssetDownloadParams[] = [];
  const scales = ['1', '2', '3', '4'];
  for (const scale of scales) {
    for (const chunkedIds of componentIds) {
      downloadParams.push({scale, ids: chunkedIds.join(',')});
    }
  }
  const resolvedUrlMap = new Map<string, Map<string, string>>(scales.map((scale) => [scale, new Map()]));
  await Promise.all(downloadParams.map(async ({scale, ids}) => {
    const params = new URLSearchParams([
      ['format', 'png'],
      ['ids', ids],
      ['scale', scale],
    ]);
    const urlMap = resolvedUrlMap.get(scale)!;

    const {images} = await performGetRequestWithBearerToken<FigmaImageResponse>(
      `${apiBase}/images/${fileId}?${params.toString()}`, authToken);
    for (const [id, url] of Object.entries(images)) {
      urlMap.set(id, url);
    }
  }));

  const streams: Promise<void>[] = [];
  for (const [scale, urls] of resolvedUrlMap) {
    for (const [id, url] of urls) {
      const filename = `${filenameMap.get(id)!}${scale !== '1' ? `@${scale}x` : ''}.png`;
      Log.info(`Downloading asset ${filename} from the Figma CDN...`);
      streams.push(downloadStream(url).then((stream) => {
        stream.pipe(createWriteStream(join(assetsDirectory, AssetFolder.Component, filename)));
      }));
    }
  }

  return Promise.all(streams);
};

const getDropShadowInitializerFromFigma = (shadow: FigmaDropShadow) =>
  getDropShadowInitializer({
    offset: shadow.offset,
    radius: shadow.radius,
    colorInitializer: getColorInitializerFromFigma(shadow.color),
  });

const populateInitializerForFigmaEffect = (effect: FigmaEffect, name: string, spec: CodegenDesignLanguage) => {
  if (isFigmaDropShadow(effect)) {
    spec.shadows.push({
      name,
      initializer: getDropShadowInitializerFromFigma(effect),
    });
    return;
  }
};

const getColorInitializerFromFigma = ({r, g, b, a}: FigmaColor) =>
`Color.rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;

const getSolidInitializerFromFigma = (solid: FigmaSolid) =>
  getColorInitializerFromFigma({...solid.color, a: solid.opacity ? solid.opacity : solid.color.a});

const getLinearGradientInitializerFromFigma = (gradient: FigmaLinearGradient) => {
  const stops = gradient.gradientStops.map((stop) => {
    return {
      position: stop.position,
      colorInitializer: getColorInitializerFromFigma(stop.color),
    };
  });
  return getLinearGradientInitializer(stops, gradient.gradientHandlePositions[0], gradient.gradientHandlePositions[1]);
};

const populateInitializerForFigmaPaint = (paint: FigmaPaint, name: string, spec: CodegenDesignLanguage) => {
  if (isFigmaSolid(paint)) {
    spec.colors.push({
      name,
      initializer: getSolidInitializerFromFigma(paint),
    });
    return;
  }

  if (isFigmaLinearGradient(paint)) {
    spec.gradients.push({
      name,
      initializer: getLinearGradientInitializerFromFigma(paint),
    });
    return;
  }
};

const getInitializerForTypographColorFromFigma = (node: FigmaNode) => {
  const fill = node.fills && node.fills[0];
  if (!fill) {
    return undefined;
  }

  if (isFigmaSolid(fill)) {
    return getSolidInitializerFromFigma(fill);
  }

  if (isFigmaLinearGradient(fill) && fill.gradientStops[0]) {
    Log.warning(`A linear gradient fill was found on the "${node.name}" text style which is not supported. The gradient's first stop color will be used instead.`);
    return getColorInitializerFromFigma(fill.gradientStops[0].color);
  }

  Log.warning(`An unsupported Text Style fill was found on ${node.name}. The default color will be used instead.`);
  return undefined;
};

const processFigmaNode = async (
  spec: CodegenDesignLanguage,
  effects: Map<string, string>,
  fills: Map<string, string>,
  typographs: Map<string, string>,
  components: Set<string>,
  componentDimensions: Map<string, FigmaDimensions>,
  node: FigmaNode,
) => {
  if (!fills.size && !effects.size && !typographs.size && !components.size) {
    return;
  }

  if (node.styles) {
    if (effects.size && node.styles.effect && effects.has(node.styles.effect) && node.effects && node.effects.length) {
      populateInitializerForFigmaEffect(node.effects[0], effects.get(node.styles.effect)!, spec);
      effects.delete(node.styles.effect);
    }

    if (fills.size && node.styles.fill && fills.has(node.styles.fill) && node.fills && node.fills.length) {
      populateInitializerForFigmaPaint(node.fills[0], fills.get(node.styles.fill)!, spec);
      fills.delete(node.styles.fill);
    }

    if (typographs.size && node.styles.text && typographs.has(node.styles.text) && node.style) {
      const candidateFont = await locateFont(
        node.style.fontFamily,
        {name: node.style.fontPostScriptName},
      );
      if (candidateFont) {
        await registerFont(candidateFont, spec.fonts);
      } else {
        Log.warning(`Unable to locate system font assets for ${node.style.fontFamily}.`);
      }

      spec.typographs.push({
        name: typographs.get(node.styles.text)!,
        initializer: getTypographInitializer(
          spec.designLanguageName,
          candidateFont,
          node.style.fontPostScriptName,
          {
            fontSize: node.style.fontSize,
            color: getInitializerForTypographColorFromFigma(node),
          },
        ),
      });
      typographs.delete(node.styles.text);
    }
  }

  if (components.has(node.id) && node.absoluteBoundingBox) {
    componentDimensions.set(node.id, node.absoluteBoundingBox);
    components.delete(node.id);
  } else if (node.componentId && components.has(node.componentId) && node.absoluteBoundingBox) {
    componentDimensions.set(node.componentId, node.absoluteBoundingBox);
    components.delete(node.componentId);
  }

  if (node.children) {
    for (const childNode of node.children) {
      await processFigmaNode(spec, effects, fills, typographs, components, componentDimensions, childNode);
    }
  }
};

const parseFigmaFile = async (
  spec: CodegenDesignLanguage,
  filenameMap: Map<string, string>,
  assetsDirectory: string,
  file: FigmaFile,
) => {
  // Build lookup tables for colors, fills, and components. As we discover color and fill definitions,
  // we can delete them from the lookup table.
  const styles = Object.entries(file.styles || {});
  const fills = new Map(styles.filter(
    ([_, {styleType}]) => styleType === 'FILL').map(([id, {name}]) => [id, name]));
  const effects = new Map(styles.filter(
    ([_, {styleType}]) => styleType === 'EFFECT').map(([id, {name}]) => [id, name]));
  const typographs = new Map(styles.filter(
    ([_, {styleType}]) => styleType === 'TEXT').map(([id, {name}]) => [id, name]));
  const components = new Set(filenameMap.keys());
  const componentDimensions = new Map<string, FigmaDimensions>();
  for (const node of file.document.children) {
    await processFigmaNode(spec, effects, fills, typographs, components, componentDimensions, node);
  }

  for (const [id, filename] of filenameMap) {
    const dimensions = componentDimensions.get(id) || {width: 0, height: 0};
    registerAsset(
      {
        ...dimensions,
        src: join(assetsDirectory, AssetFolder.Component, `${filename}.png`),
      },
      AssetFolder.Component,
      spec.assets,
    );
  }
};

class FigmaExtractor implements Extractor, OAuthable {
  /**
   * [[ExtractorFactory]] interface method.
   *
   * To configure this extractor, we must provide a valid Figma access token as a constructor parameter.
   * @param token
   */
  static async configure (constructorArgs: string[]) {
    let figmaAccessToken = await Registry.get('figmaAccessToken');
    if (!figmaAccessToken) {
      Log.info('Figma authentication required.');
      figmaAccessToken = await getFigmaAccessToken();
      await Registry.set({figmaAccessToken});
    }
    constructorArgs.push(figmaAccessToken as string);
  }

  /**
   * [[ExtractorFactory]] interface method.
   *
   * We expect to receive an [[UnauthorizedRequestException]] when the access token is missing or invalid.
   * Thus, these errors should be retriable after we delete the Figma access token.
   */
  static async shouldRetryError (error: Error) {
    if (error instanceof UnauthorizedRequestException) {
      await Registry.delete('figmaAccessToken');
      return true;
    }

    return false;
  }

  /**
   * [[ExtractorFactory]] interface method. Instantiates a Figma extractor with a provided token.
   * @param token
   */
  static create (token?: string) {
    return new this(token);
  }

  /**
   * Returns a boolean indicating if the source provided looks like a Figma file or a project URL.
   */
  static async canParse (source: string) {
    return parseProjectURL(source) !== null;
  }

  constructor (public token = '') {}

  /**
   * Exports assets from Figma.
   */
  async export (
    {source, assets, code}: ExtractorInput,
    projectRoot: string,
    reporters = cliReporters,
  ) {
    if (!this.token) {
      throw new Error(
        'Figma requires a token in order to perform the export. Please set one (`figma.token = token`) and try again',
      );
    }

    const projectData = parseProjectURL(source);
    if (!projectData) {
      throw new Error('Invalid source file');
    }

    reporters.progress('Fetching information from Figma.');
    const file = await fetchFile(projectData.id, this.token);
    const designLanguageName = pascalCase(file.name);
    const assetName = `${designLanguageName}.figma`;
    const assetsDirectory = join(assets, `${assetName}.contents`);

    reporters.progress(`Creating necessary folders for ${assetName}`);
    await createFolders(assetsDirectory, folders.values());

    const codegenSpec = createDesignLanguageSpec(
      designLanguageName,
      assetsDirectory,
      join(code, `${assetName}.ts`),
      projectRoot,
    );

    const resolver = new UniqueNameResolver();
    const filenameMap = new Map(Object.entries(file.components || {}).map(
      ([id, {name}]) => [id, resolver.getComponentName(name)]));
    await parseFigmaFile(codegenSpec, filenameMap, relative(projectRoot, assetsDirectory), file);
    return Promise.all([
      downloadAssets(filenameMap, assetsDirectory, projectData.id, this.token),
      codegenDesignLanguage(codegenSpec),
    ]);
  }
}

export = FigmaExtractor;

import {findOpenPort} from '@diez/cli-core';
import {pascalCase, UniqueNameResolver} from '@diez/generation';
import {join} from 'path';
import {parse, URLSearchParams} from 'url';
import {v4} from 'uuid';
import {Exporter, ExporterFactory, ExporterInput, OAuthable} from '../api';
import {chunk, cliReporters, createFolders, sanitizeFileName} from '../utils';
import {
  downloadFile,
  getOAuthCodeFromBrowser,
  performGetRequest,
  performGetRequestWithBearerToken,
} from '../utils.network';

const figmaHost = 'figma.com';
const figmaUrl = 'https://www.figma.com';
const apiBase = 'https://api.figma.com/v1';
const figmaPorts = [46572, 48735, 7826, 44495, 21902];

const figmaDefaultFilename = 'Untitled';
const importBatchSize = 100;

/**
 * We may want to consider allowing users of this library to use a different Figma app than the one we provide.
 */
const defaultFigmaClientId = 'dVkwfl8RBD91688fwCq9Da';
const defaultTokenExchangeUrl = 'https://figma-token-exchange.haiku.ai';

const enum ValidType {
  Slice = 'SLICE',
  Group = 'GROUP',
  Frame = 'FRAME',
  Component = 'COMPONENT',
}

const folders = new Map<ValidType, string>([
  [ValidType.Slice, 'slices'],
  [ValidType.Group, 'groups'],
  [ValidType.Component, 'groups'],
  [ValidType.Frame, 'frames'],
]);

interface FigmaNode {
  exportSettings?: string[];
  name: string;
  type: ValidType;
  id: string;
  children: FigmaNode[];
  svg: string;
  svgURL: string;
}

interface FigmaProject {
  name: string;
  lastModified: string;
  thumbnailURL: string;
  version: string;
  document: FigmaNode;
}

interface FigmaImageResponse {
  err: null|string;
  images: FigmaImagesURL;
}

interface FigmaImagesURL {
  [key: string]: string;
}

/**
 * Fetches SVG contents form the Figma API for a given set of FigmaNode elements.
 * @param elements elements to fetch SVG contents from the API
 */
const getSVGContents = (elements: FigmaNode[], outFolder: string) => {
  return Promise.all(
    elements.map(async (element) => {
      try {
        if (element.svgURL) {
          await downloadFile(
            element.svgURL,
            join(
              outFolder,
              (folders.get(element.type) || folders.get(ValidType.Slice))!,
              sanitizeFileName(`${element.name}.svg`),
            ),
          );
        }
      } catch (error) {
        throw new Error(`Error importing ${element.name}: ${error}`);
      }
    }),
  );
};

/**
 * Maps an array of elements into an array of elements with links to their
 * SVG representation in the cloud via the Figma API
 *
 * @param elements elements to get the SVG links from
 * @param id ID of the Figma file
 */
export const getSVGLinks = async (elements: FigmaNode[], id: string, authToken: string) => {
  const ids = chunk(elements.map((element) => element.id), importBatchSize);

  if (ids[0].length === 0) {
    throw new Error(
      'It looks like the Figma document you imported doesn\'t have any exportable elements. ' +
        'Try adding some and re-syncing.',
    );
  }

  const chunkedResponse = await Promise.all(ids.map(async (idsChunk) => {
    const params = new URLSearchParams([
      ['format', 'svg'],
      ['ids', idsChunk.join(',')],
      ['svg_include_id', 'true'],
    ]);

    const {images} = await performGetRequestWithBearerToken<FigmaImageResponse>(
      `${apiBase}/images/${id}?${params.toString()}`,
      authToken,
    );

    return images;
  }));

  const imageResponse: FigmaImagesURL = Object.assign({}, ...chunkedResponse);

  return elements.map((element) => {
    return Object.assign(element, {svgURL: imageResponse[element.id]}) as FigmaNode;
  });
};

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
const fetchFile = (id: string, authToken: string): Promise<FigmaProject> => {
  return performGetRequestWithBearerToken<FigmaProject>(`${apiBase}/files/${id}`, authToken);
};

/**
 *  Find nodes that contain any of the types defined in `VALID_TYPES`
 *
 * @param iter a iterable that retrieves `FigmaNode`s
 * @param docId id of the Figma document
 * @param nameResolver helper to determine unique names
 */
const findExportableNodes = (iter: FigmaNode[], docId: string, nameResolver: UniqueNameResolver): FigmaNode[] => {
  const result: FigmaNode[] = [];

  for (const item of iter) {
    if (folders.has(item.type) || (item.exportSettings && item.exportSettings.length > 0)) {
      result.push({
        ...item,
        id: item.id,
        name: nameResolver.getAssetName(item.name),
        type: item.type,
      });
    }

    if (item.children) {
      result.push(...findExportableNodes(item.children, docId, nameResolver));
    }
  }

  return result;
};

/**
 * Implements the OAuth token dance for Figma and resolves a useful access token.
 */
export const getFigmaAccessToken = async (): Promise<string> => {
  const port = await findOpenPort(figmaPorts);
  const state = v4();
  const redirectUri = `http://localhost:${port}`;
  const authParams = new URLSearchParams([
      ['client_id', defaultFigmaClientId],
      ['redirect_uri', redirectUri],
      ['scope', 'file_read'],
      ['state', state],
      ['response_type', 'code'],
  ]);
  const authUrl = `${figmaUrl}/oauth?${authParams.toString()}`;
  const {code, state: checkState} = await getOAuthCodeFromBrowser(authUrl, port);
  if (state !== checkState) {
    throw new Error('Security exception!');
  }

  const tokenExchangeParams = new URLSearchParams([
      ['code', code],
      ['redirect_uri', redirectUri],
  ]);
  const {access_token} = await performGetRequest<{access_token: string}>(
    `${defaultTokenExchangeUrl}?${tokenExchangeParams.toString()}`,
    );

  return access_token;
};

class FigmaExporterImplementation implements Exporter, OAuthable {
  /**
   * ExporterFactory interface method.
   * @param token
   */
  static create (token?: string) {
    return new this(token);
  }

  /**
   * ExporterFactory interface method.
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
    {source, assets}: ExporterInput,
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
    const componentName = pascalCase(file.name);
    const assetName = `${componentName}.figma`;
    const out = join(assets, `${assetName}.contents`);
    await createFolders(out, folders);
    const elements = await findExportableNodes(file.document.children, projectData.id, new UniqueNameResolver());
    reporters.progress(`Fetching SVG elements from Figma for ${assetName}`);
    const elementsWithLinks = await getSVGLinks(elements, projectData.id, this.token);
    reporters.progress(`Downloading SVG elements for ${assetName}`);
    await getSVGContents(elementsWithLinks, out);
  }
}

/**
 * The Figma exporter.
 */
export const FigmaExporter: ExporterFactory = FigmaExporterImplementation;

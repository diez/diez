import path from 'path';
import url from 'url';
import {Exportable, OAutheable} from '.';
import {createFolders, sanitizeFileName} from '../helpers/ioUtils';
import {downloadFile, performGetRequestWithBearerToken} from '../helpers/request';
import {UniqueNameResolver} from '../helpers/uniqueNameResolver';

const FIGMA_HOST = 'figma.com';
const API_BASE = 'https://api.figma.com/v1/';
const IS_FIGMA_FILE_RE = /\.figma$/;
const FIGMA_DEFAULT_FILENAME = 'Untitled';
const MAX_ITEMS_TO_IMPORT = 100;
let token = '';

enum VALID_TYPES {
  SLICE,
  GROUP,
  FRAME,
  COMPONENT,
}

const FOLDERS: {[key: string]: string} = {
  [VALID_TYPES.SLICE]: 'slices/',
  [VALID_TYPES.GROUP]: 'groups/',
  [VALID_TYPES.COMPONENT]: 'groups/',
  [VALID_TYPES.FRAME]: 'frames/',
};

export interface FigmaNode {
  exportSettings?: string[];
  name: string;
  type: VALID_TYPES;
  id: string;
  children: FigmaNode[];
  svg: string;
  svgURL: string;
}

export interface FigmaProject {
  name: string;
  lastModified: string;
  thumbnailURL: string;
  version: string;
  document: FigmaNode;
}

export interface FigmaImageResponse {
  err: null|string;
  images: {[key: string]: string};
}

/**
 * Fetches SVG contents form the Figma API for a given set of FigmaNode elements.
 * @param elements elements to fetch SVG contents from the API
 */
const getSVGContents = (elements: FigmaNode[], outFolder: string) => {
  return Promise.all(
    elements.map(async (element) => {
      const folderType = VALID_TYPES[element.type] ? VALID_TYPES[element.type] : VALID_TYPES.SLICE;

      try {
        if (element.svgURL) {
          await downloadFile(
            element.svgURL,
            path.join(
              outFolder,
              FOLDERS[folderType],
              sanitizeFileName(`${element.name}.svg`),
            ),
          );
        }
      } catch (error) {
        console.log('Error importing', element.name, error);
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
  let ids = elements.map((element) => element.id);

  if (ids.length === 0) {
    throw new Error(
      "It looks like the Figma document you imported doesn't have any exportable elements." +
        'Try adding some and re-syncing.',
    );
  }

  // TODO: instead of limiting the max number of items to import, import them in batches
  if (ids.length > MAX_ITEMS_TO_IMPORT) {
    ids = ids.slice(0, MAX_ITEMS_TO_IMPORT);
  }

  const params = new url.URLSearchParams([['format', 'svg'], ['ids', ids.join(',')], ['svg_include_id', 'true']]);

  const svgLinks = await performGetRequestWithBearerToken<FigmaImageResponse>(
    `${API_BASE}images/${id}?${params.toString()}`,
    token,
  );

  return elements.map((element) => {
    return Object.assign(element, {svgURL: svgLinks.images[element.id]}) as FigmaNode;
  });
};

/**
 * Parses a Figma URL and returns an object describing the project, if the URL is invalid or can't be parsed
 * returns `null`.
 * @param rawURL a Figma project URL
 */
const parseProjectURL = (rawURL: string) => {
  const parsedURL = url.parse(rawURL);

  if (parsedURL && parsedURL.pathname && parsedURL.host && parsedURL.host.includes(FIGMA_HOST)) {
    const paths = parsedURL.pathname.split('/');
    return {id: paths[2] || '', name: paths[3] || FIGMA_DEFAULT_FILENAME};
  }

  return null;
};

/**
 * Fetch document info from the Figma API
 *
 * @param id ID of the Figma document
 */
const fetchFile = (id: string, authToken: string): Promise<FigmaProject> => {
  return performGetRequestWithBearerToken<FigmaProject>(`${API_BASE}files/${id}`, authToken);
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
    if (VALID_TYPES[item.type] || (item.exportSettings && item.exportSettings.length > 0)) {
      result.push({
        ...item,
        id: item.id,
        name: nameResolver.get(item.name),
        type: item.type,
      });
    }

    if (item.children) {
      result.push(...findExportableNodes(item.children, docId, nameResolver));
    }
  }

  return result;
};

export const figma: Exportable & OAutheable = {
  /**
   * Exports SVG contents from the given `source` into the `out` folder.
   *
   * @param source from where to extract the SVG
   * @param out directory to put the SVG
   */
  async exportSVG (source: string, out: string) {
    const projectData = parseProjectURL(source);

    if (!projectData) {
      throw new Error('Error parsing data from the provided URL. Please make sure it is a valid Figma project URL.');
    }

    if (!this.token) {
      throw new Error(
        'Figma requires a token in order to perform the export. Please set one (`figma.token = token`) and try again',
      );
    }

    const file = await fetchFile(projectData.id, this.token);
    await createFolders(out, FOLDERS);
    const elements = await findExportableNodes(file.document.children, projectData.id, new UniqueNameResolver());
    const elementsWithLinks = await getSVGLinks(elements, projectData.id, this.token);
    await getSVGContents(elementsWithLinks, out);
  },

  /**
   * Returns a boolean indicating if the source provided looks like a Figma file or a project URL.
   */
  canParse (source: string) {
    return Boolean((source && source.match(IS_FIGMA_FILE_RE)) || parseProjectURL(source));
  },

  get token () {
    return token;
  },

  set token (newToken: string) {
    token = newToken;
  },
};

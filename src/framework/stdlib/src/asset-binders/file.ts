import {AssetBinder, TargetOutput} from '@diez/compiler-core';
import {File, FileType, Font, Image} from '@diez/prefabs';
// Note: we are careful to import the full module so we can monkey-patch it in our test harness.
import fontkit from 'fontkit';
import {extname, join} from 'path';
import {getFileContentsPath} from '../utils';

const requireFileTypeForChild = (instance: File, fileType: FileType, type: any) => {
  if (instance.host && instance.host instanceof type && instance.type !== fileType) {
    throw new Error(`${instance.host.constructor.name} file ${instance.src} does not specify file type ${fileType}.`);
  }
};

const isFontCollection = (candidate: fontkit.FontkitFont | fontkit.FontkitFontCollection | null):
  candidate is fontkit.FontkitFontCollection =>
    candidate !== null && candidate.constructor.name === 'TrueTypeCollection';

const validateFontFile = (fontFile: File, projectRoot: string) => {
  requireFileTypeForChild(fontFile, FileType.Font, Font);

  // We only support .ttf and .otf files.
  const extension = extname(fontFile.src);
  if (extension !== '.ttf' && extension !== '.otf') {
    throw new Error(`Invalid font file type: ${extension}. Only .ttf and .otf are supported.`);
  }

  const font = fontFile.host as Font;
  if (!font || !(font instanceof Font)) {
    return;
  }

  if (!font.name) {
    throw new Error(`The font file at ${fontFile.src} has no associated name.`);
  }

  const fontResource = fontkit.openSync(join(projectRoot, fontFile.src));
  if (isFontCollection(fontResource)) {
    throw new Error(`Font file ${fontFile.src} is a font collection, not a single font.`);
  }

  if (!fontResource || fontResource.postscriptName !== font.name) {
    throw new Error(`Font file ${fontFile.src} does not include a font named ${font.name}.`);
  }
};

/**
 * An simple "copy asset" binder for the File prefab.
 */
export const fileAssetBinder: AssetBinder<
  File,
  Pick<TargetOutput, 'assetBindings'>
> = async (instance, {projectRoot}, {assetBindings}) => {
    // Validate correct types for hosted components.
  requireFileTypeForChild(instance, FileType.Image, Image);

  if (instance.type === FileType.Font) {
    if (!instance.src) {
      // Fonts are uniquely allowed to not define a source.
      return;
    }

    validateFontFile(instance, projectRoot);
  }

  assetBindings.set(
    instance.src,
    {
      contents: await getFileContentsPath(join(projectRoot, instance.src), instance.type),
      copy: true,
    },
  );
};

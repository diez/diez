import {Log} from '@diez/cli-core';
import {Extractor, ExtractorInput} from '@diez/extractors-core';
import {
  codegenDesignLanguage,
  createDesignLanguageSpec,
  getColorInitializer,
  getTypographInitializer,
  locateFont,
  pascalCase,
  registerFont,
} from '@diez/generation';
import {removeSync} from 'fs-extra';
import {join} from 'path';
import {URL} from 'url';
import {cliReporters} from '../utils';
import {performGetRequest} from '../utils.network';

interface InVisionColor {
  name: string;
  value: string;
}

interface InVisionPalette {
  name: string;
  colors: InVisionColor[];
}

interface InVisionFontVariant {
  fontStyle: string;
  fontWeight: number | string;
}

interface InVisionFont {
  name: string;
  family: string;
  variants: InVisionFontVariant[];
}

interface InVisionTypeStyle {
  name: string;
  fontSize: string;
  lineHeight: string;
  textAlign: string;
  color?: string;
  letterSpacing: string;
  fontStyle: string;
  fontWeight: string;
  fontFamily: string;
  backgroundColor?: string;
}

interface InvisionDesignSystemList {
  list?: {
    name?: string;
    organization?: string;
    colors?: InVisionPalette[];
    fonts?: InVisionFont[];
    typeStyles?: InVisionTypeStyle[];
  };
}

const isValidInVisionUrl = (rawUrl: string) => {
  try {
    const parsedUrl = new URL(rawUrl);
    return (
      parsedUrl.host === 'projects.invisionapp.com' &&
      parsedUrl.searchParams.get('exportFormat') === 'list' &&
      parsedUrl.searchParams.has('key') &&
      parsedUrl.pathname.endsWith('style-data.json')
    );
  } catch (error) {
    return false;
  }
};

class InVisionExtractor implements Extractor {
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
    return isValidInVisionUrl(source);
  }

  /**
   * Exports assets from InVision DSM.
   */
  async export (
    {source, assets, code}: ExtractorInput,
    projectRoot: string,
    reporters = cliReporters,
  ) {
    reporters.progress('Fetching design system spec from InVision...');
    const {list: spec} = await performGetRequest<InvisionDesignSystemList>(
      source,
    );
    if (!spec) {
      throw new Error(
        'Unable to parse design system metadata from InVision...',
      );
    }

    const designSystemName = pascalCase(spec.name || 'Invision Design System');

    const assetName = `${designSystemName}.invision`;

    const assetsDirectory = join(assets, `${assetName}.contents`);
    removeSync(assetsDirectory);
    const codegenSpec = createDesignLanguageSpec(
      designSystemName,
      assetsDirectory,
      join(code, `${assetName}.ts`),
      projectRoot,
    );

    if (spec.colors) {
      for (const palette of spec.colors) {
        for (const color of palette.colors) {
          codegenSpec.colors.push({
            name: color.name,
            initializer: getColorInitializer(color.value),
          });
        }
      }
    }

    if (spec.typeStyles && spec.typeStyles.length) {
      for (const typeStyle of spec.typeStyles) {
        const fontSize = parseInt(typeStyle.fontSize, 10);
        const candidateFont = await locateFont(typeStyle.fontFamily, {
          style: typeStyle.fontStyle,
        });
        if (candidateFont) {
          await registerFont(candidateFont, codegenSpec.fonts);
        } else {
          Log.warning(
            `Unable to locate system font assets for ${typeStyle.fontFamily}.`,
          );
        }

        codegenSpec.typographs.push({
          name: typeStyle.name,
          initializer: getTypographInitializer(
            codegenSpec.designLanguageName,
            candidateFont,
            typeStyle.fontFamily.replace(' ', '-'),
            {
              fontSize,
              color: getColorInitializer(typeStyle.color || '#000'),
            },
          ),
        });
      }
    }

    await codegenDesignLanguage(codegenSpec);
  }
}

/**
 * The InVision extractor.
 */
export = InVisionExtractor;

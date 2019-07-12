import {canRunCommand, execAsync, Log} from '@diez/cli-core';
import {getProject} from '@diez/compiler';
import {getTempFileName} from '@diez/storage';
import {pascalCase} from 'change-case';
import {FontkitFont, FontkitFontCollection, openSync} from 'fontkit';
import {copySync, ensureDirSync, readdirSync} from 'fs-extra';
import {basename, extname, join, parse, relative} from 'path';
import {ObjectLiteralExpression, VariableDeclarationKind} from 'ts-morph';
import {AssetFolder, CodegenDesignSystem, GeneratedAsset, GeneratedAssets, GeneratedFont, GeneratedFonts} from './api';

const camelCase = (name: string) => {
  const propertyNamePascal = pascalCase(name, undefined, true);
  return propertyNamePascal.charAt(0).toLowerCase() + propertyNamePascal.slice(1);
};

/**
 * A helper class for resolving unique group/slice/artboard names from potentially duplicative sets.
 * @ignore
 */
export class UniqueNameResolver {
  private readonly componentResolver = new Map<string, number>();
  private readonly propertyResolver = new Map<string, number>();

  getComponentName (name: string) {
    const componentName = pascalCase(name, undefined, true);
    if (!this.componentResolver.has(componentName)) {
      this.componentResolver.set(componentName, 0);
      return componentName;
    }

    const counter = this.componentResolver.get(componentName)! + 1;
    this.componentResolver.set(componentName, counter);
    return `${componentName}${counter}`;
  }

  getPropertyName (name: string, className: string) {
    const propertyName = camelCase(name);
    const lookupKey = `${className}:${propertyName}`;
    if (!this.propertyResolver.has(lookupKey)) {
      this.propertyResolver.set(lookupKey, 0);
      return propertyName;
    }

    const counter = this.propertyResolver.get(lookupKey)! + 1;
    this.propertyResolver.set(lookupKey, counter);
    return `${propertyName}${counter}`;
  }
}

/**
 * @ignore
 */
export {pascalCase};

/**
 * Generates a fresh design system spec.
 */
export const createDesignSystemSpec = (
  designSystemName: string,
  assetsDirectory: string,
  filename: string,
  projectRoot: string,
): CodegenDesignSystem => ({
  assetsDirectory,
  designSystemName,
  filename,
  projectRoot,
  colors: [],
  gradients: [],
  typographs: [],
  fonts: new Map(),
  assets: new Map(),
});

/**
 * Registers an asset belonging to a given asset folder in a collection.
 */
export const registerAsset = (asset: GeneratedAsset, folder: AssetFolder, collection: GeneratedAssets) => {
  const {name} = parse(asset.src);
  if (collection.has(folder)) {
    collection.get(folder)!.set(name, asset);
    return;
  }

  collection.set(folder, new Map([[name, asset]]));
};

const isFontCollection = (candidate: FontkitFont | FontkitFontCollection | null):
  candidate is FontkitFontCollection => candidate !== null && candidate.constructor.name === 'TrueTypeCollection';

/**
 * Returns a nullable path to TrueType (.ttf) or OpenType (.otf) font file given a path to a font resource
 * containing a font definition for a provided font name.
 *
 * In case the font path provided is a collection (.ttc) font file, the method will attempt to use the Adobe Font
 * Development Kit for OpenType tool for extracting TTC to TTF (`otc2otf`) in order to deliver usable font assets for
 * all possible platforms.
 */
const getFontPath = async (path: string, fontName: string): Promise<string | undefined> => {
  const fontResourceOrCollection = openSync(path);
  if (!isFontCollection(fontResourceOrCollection)) {
    return path;
  }

  const fontResource = fontResourceOrCollection.getFont(fontName);
  if (fontResource === null) {
    throw new Error(`The font collection at ${path} does not include a font named ${fontName}.`);
  }

  if (!await canRunCommand('which otc2otf')) {
    Log.warningOnce(`The Adobe Font Development Kit for OpenType is required to extract fonts from font collections.

See installation instructions here: https://github.com/adobe-type-tools/afdko#installation.`);
    Log.warningOnce(`The font at ${path} cannot be used.`);
    return undefined;
  }

  const workingDirectory = getTempFileName();
  const ttcLocation = join(workingDirectory, basename(path));
  ensureDirSync(workingDirectory);
  copySync(path, ttcLocation);

  Log.info(`Extracting font ${fontName} from TrueType collection font at ${path}.`);
  await execAsync(`otc2otf ${ttcLocation}`);
  for (const filename of readdirSync(workingDirectory)) {
    if (filename === `${fontName}.ttf` || filename === `${fontName}.otf`) {
      return join(workingDirectory, filename);
    }
  }

  return undefined;
};

/**
 * Registers an asset belonging to a given asset folder in a collection.
 */
export const registerFont = async (font: GeneratedFont, collection: GeneratedFonts) => {
  const family = pascalCase(font.family);
  if (!collection.has(family)) {
    collection.set(family, new Map());
  }

  collection.get(family)!.set(
    pascalCase(font.style), {name: font.name, path: await getFontPath(font.path, font.name)});
};

/**
 * Generates source code for a design system.
 */
export const codegenDesignSystem = async (spec: CodegenDesignSystem) => {
  spec.designSystemName = pascalCase(spec.designSystemName);
  const {assetsDirectory, designSystemName, projectRoot} = spec;
  const localResolver = new UniqueNameResolver();
  const project = getProject(projectRoot);
  const sourceFile = project.createSourceFile(spec.filename, '', {overwrite: true});

  const engineImports = new Set(['Component']);
  const designSystemImports = new Set<string>();
  const paletteName = localResolver.getComponentName(`${designSystemName} Palette`);
  const colorsName = localResolver.getComponentName(`${designSystemName} Colors`);
  const gradientsName = localResolver.getComponentName(`${designSystemName} Gradients`);
  const typographsName = localResolver.getComponentName(`${designSystemName} Typographs`);

  const hasColors = spec.colors.length > 0;
  const hasGradients = spec.gradients.length > 0;
  const hasPalette = hasColors || hasGradients;

  if (hasPalette) {
    if (hasColors) {
      engineImports.add('property');
      designSystemImports.add('Color');
      sourceFile.addClass({
        name: colorsName,
        extends: 'Component',
        properties: spec.colors.map(({name, initializer}) => {
          const colorName = localResolver.getPropertyName(name || 'Untitled Color', colorsName);
          return {
            initializer,
            name: colorName,
            decorators: [{name: 'property'}],
          };
        }),
      });
    }

    if (hasGradients) {
      engineImports.add('property');
      designSystemImports.add('LinearGradient');
      designSystemImports.add('Color');
      designSystemImports.add('GradientStop');
      designSystemImports.add('Point2D');
      sourceFile.addClass({
        name: gradientsName,
        extends: 'Component',
        properties: spec.gradients.map(({name, initializer}) => {
          const gradientName = localResolver.getPropertyName(name || 'Untitled Linear Gradient', gradientsName);
          return {
            initializer,
            name: gradientName,
            decorators: [{name: 'property'}],
          };
        }),
      });
    }

    engineImports.add('property');
    const palette = sourceFile.addClass({
      name: paletteName,
      extends: 'Component',
    });

    if (hasColors) {
      palette.addProperty({
        initializer: `new ${colorsName}()`,
        name: localResolver.getPropertyName('Colors', paletteName),
        decorators: [{name: 'property'}],
      });
    }

    if (hasGradients) {
      palette.addProperty({
        initializer: `new ${gradientsName}()`,
        name: localResolver.getPropertyName('Gradients', paletteName),
        decorators: [{name: 'property'}],
      });
    }
  }

  if (spec.typographs.length) {
    engineImports.add('property');
    designSystemImports.add('Color');
    designSystemImports.add('Typograph');
    sourceFile.addClass({
      name: typographsName,
      extends: 'Component',
      properties: spec.typographs.map(({name, initializer}) => {
        const typographName = localResolver.getPropertyName(
          name || 'Untitled Typograph',
          typographsName,
        );
        return {
          initializer,
          name: typographName,
          decorators: [{name: 'property'}],
        };
      }),
    });
  }

  for (const [folder, assetsMap] of spec.assets) {
    designSystemImports.add('Image');
    designSystemImports.add('File');
    const filesClass = sourceFile.addClass({
      name: pascalCase(`${spec.designSystemName} ${folder} Files`),
      isExported: true,
    });

    const imagesClass = sourceFile.addClass({
      name: pascalCase(`${spec.designSystemName} ${folder}`),
      isExported: true,
    });

    for (const [name, asset] of assetsMap) {
      const assetName = pascalCase(name);
      const parsedSrc = parse(asset.src);
      filesClass.addProperties([
        {
          name: assetName,
          isStatic: true,
          initializer: `new File({src: "${asset.src}"})`,
        },
        ...[2, 3, 4].map((multiplier) => ({
          name: `${assetName}${multiplier}x`,
          isStatic: true,
          initializer: `new File({src: "${parsedSrc.dir}/${parsedSrc.name}@${multiplier}x${parsedSrc.ext}"})`,
        })),
      ]);
      imagesClass.addProperty({
        name: assetName,
        isStatic: true,
        initializer: `Image.responsive("${asset.src}", ${asset.width}, ${asset.height})`,
      });
    }
  }

  if (spec.fonts.size) {
    designSystemImports.add('Font');
    const fontDirectory = join(assetsDirectory, 'fonts');
    ensureDirSync(fontDirectory);
    const fontsExpression = sourceFile.addVariableStatement({
      declarationKind: VariableDeclarationKind.Const,
      isExported: true,
      declarations: [{
        name: `${designSystemName}Fonts`,
        initializer: '{}',
      }],
    }).getDeclarations()[0].getInitializer() as ObjectLiteralExpression;

    for (const [family, styles] of spec.fonts) {
      const familyExpression = fontsExpression.addPropertyAssignment({
        name: family,
        initializer: '{}',
      }).getInitializer() as ObjectLiteralExpression;
      for (const [style, {name, path}] of styles) {
        if (!path) {
          familyExpression.addPropertyAssignment({
            name: style,
            initializer: `new Font({name: "${name}"})`,
          });
          continue;
        }
        const destination = join(fontDirectory, `${name}${extname(path)}`);
        copySync(path, destination);
        familyExpression.addPropertyAssignment({
          name: style,
          initializer: `Font.fromFile("${relative(projectRoot, destination)}")`,
        });
      }
    }
  }

  const componentName = `${designSystemName}DesignSystem`;
  const exportedClassDeclaration = sourceFile.addClass({
    isExported: true,
    name: componentName,
    extends: 'Component',
  });

  if (hasPalette) {
    exportedClassDeclaration.addProperty({
      name: 'palette',
      decorators: [{name: 'property'}],
      initializer: `new ${paletteName}()`,
    });
  }

  if (spec.typographs.length) {
    designSystemImports.add('Font');
    exportedClassDeclaration.addProperty({
      name: 'typographs',
      decorators: [{name: 'property'}],
      initializer: `new ${typographsName}()`,
    });
  }

  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: camelCase(componentName),
      initializer: `new ${componentName}()`,
    }],
    isExported: true,
  });

  if (designSystemImports.size) {
    sourceFile.addImportDeclaration({
      moduleSpecifier: '@diez/prefabs',
      namedImports: Array.from(designSystemImports).sort().map((name) => ({name})),
    });
  }

  sourceFile.addImportDeclaration({
    moduleSpecifier: '@diez/engine',
    namedImports: Array.from(engineImports).sort().map((name) => ({name})),
  });

  return sourceFile.save();
};

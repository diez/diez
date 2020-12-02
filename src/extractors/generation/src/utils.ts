import {canRunCommand, diezVersion, execAsync, Log} from '@diez/cli-core';
import {getProject} from '@diez/compiler-core';
import {getTempFileName} from '@diez/storage';
import {pascalCase} from 'change-case';
import {FontkitFont, FontkitFontCollection, openSync} from 'fontkit';
import {copySync, ensureDirSync, readdirSync} from 'fs-extra';
import {basename, extname, join, parse, relative} from 'path';
import {CodeBlockWriter, ObjectLiteralExpression, SourceFile, VariableDeclarationKind, WriterFunctionOrValue, Writers} from 'ts-morph';
import {AssetFolder, AssetFolderByAssetType, CodegenDesignLanguage, CodegenEntity, ExtractableAssetType, GeneratedAsset, GeneratedAssets, GeneratedFont, GeneratedFonts} from './api';
import {regexES3ReservedWord, regexIdentifierNameES5, regexIdentifierNameES6, regexNumber, regexZeroWidth} from './regexes';

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
      return quoteInvalidPropertyName(propertyName);
    }

    const counter = this.propertyResolver.get(lookupKey)! + 1;
    this.propertyResolver.set(lookupKey, counter);
    return quoteInvalidPropertyName(`${propertyName}${counter}`);
  }
}

/**
 * @ignore
 */
export {pascalCase};

/**
 * Generates a fresh design language spec.
 */
export const createDesignLanguageSpec = (
  designLanguageName: string,
  assetsDirectory: string,
  filename: string,
  projectRoot: string,
): CodegenDesignLanguage => ({
  assetsDirectory,
  designLanguageName,
  filename,
  projectRoot,
  colors: [],
  gradients: [],
  shadows: [],
  typographs: [],
  fonts: new Map(),
  assets: new Map(),
});

/**
 * Registers an asset belonging to a given asset folder in a collection.
 */
export const registerAsset = (asset: GeneratedAsset, folder: ExtractableAssetType, collection: GeneratedAssets) => {
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
 * Reduce a collection of codegen entities to a single object that has the entity name as the key and the initializer
 * as a value.
 */
const reduceEntitiesToObject = (collection: CodegenEntity[], scope: string, resolver: UniqueNameResolver, kind: string) => {
  return collection.reduce<{[key: string]: WriterFunctionOrValue}>((acc, {name, initializer}) => {
    const safeName = resolver.getPropertyName(name || `Untitled ${kind}`, scope);
    acc[safeName] = initializer;
    return acc;
  }, {});
};

const newLine = (writer: CodeBlockWriter) => {
  writer.newLine();
};

const deprecatedComment = (newDeclarationName: string) => `
/**
 * This is provided for backward compatibility, please use \`${newDeclarationName}\` instead.
 * @deprecated
 */
`;

/**
 * Ensures that paths with explicit back-slashes are forced into forward-slashes
 */
const windowsPathSanitize = (path: string) => {
  return unescape(escape(path).replace(/%5C/g, '/'));
};

/**
 * Returns a valid writable object initializer.
 */
const entitiesToWritableObject = (collection: CodegenEntity[], scope: string, resolver: UniqueNameResolver, kind: string) => {
  return Writers.object(reduceEntitiesToObject(collection, scope, resolver, kind));
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
 * Generates source code for a design language.
 */
export const codegenDesignLanguage = async (spec: CodegenDesignLanguage) => {
  spec.designLanguageName = pascalCase(spec.designLanguageName);
  const {assetsDirectory, designLanguageName, projectRoot} = spec;
  const localResolver = new UniqueNameResolver();
  const project = getProject(projectRoot);
  const sourceFile = project.createSourceFile(spec.filename, '', {overwrite: true});

  const designLanguageImports = new Set<string>();
  const colorsName = camelCase(localResolver.getComponentName(`${designLanguageName} Colors`));
  const gradientsName = camelCase(localResolver.getComponentName(`${designLanguageName} Gradients`));
  const shadowsName = camelCase(localResolver.getComponentName(`${designLanguageName} Shadows`));
  const typographsName = camelCase(localResolver.getComponentName(`${designLanguageName} Typography`));

  const hasColors = spec.colors.length > 0;
  const hasGradients = spec.gradients.length > 0;
  const hasShadows = spec.shadows.length > 0;
  const hasTypographs = spec.typographs.length > 0;

  if (hasColors) {
    designLanguageImports.add('Color');
    sourceFile.addVariableStatement({
      leadingTrivia: newLine,
      declarationKind: VariableDeclarationKind.Const,
      declarations: [{
        name: colorsName,
        initializer: entitiesToWritableObject(spec.colors, colorsName, localResolver, 'Color'),
      }],
    });
  }

  if (hasGradients) {
    designLanguageImports.add('LinearGradient');
    designLanguageImports.add('Color');
    designLanguageImports.add('GradientStop');
    designLanguageImports.add('Point2D');
    sourceFile.addVariableStatement({
      leadingTrivia: newLine,
      declarationKind: VariableDeclarationKind.Const,
      declarations: [{
        name: gradientsName,
        initializer: entitiesToWritableObject(spec.gradients, gradientsName, localResolver, 'LinearGradient'),
      }],
    });
  }

  if (hasShadows) {
    designLanguageImports.add('Color');
    designLanguageImports.add('Point2D');
    designLanguageImports.add('DropShadow');
    sourceFile.addVariableStatement({
      leadingTrivia: newLine,
      declarationKind: VariableDeclarationKind.Const,
      declarations: [{
        name: shadowsName,
        initializer: entitiesToWritableObject(spec.shadows, shadowsName, localResolver, 'Shadow'),
      }],
    });
  }

  if (spec.fonts.size) {
    designLanguageImports.add('Font');
    const fontDirectory = join(assetsDirectory, 'fonts');
    ensureDirSync(fontDirectory);
    const fontsExpression = sourceFile.addVariableStatement({
      leadingTrivia: newLine,
      declarationKind: VariableDeclarationKind.Const,
      isExported: true,
      declarations: [{
        name: camelCase(`${designLanguageName}Fonts`),
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

  if (hasTypographs) {
    designLanguageImports.add('Color');
    designLanguageImports.add('Typograph');
    designLanguageImports.add('TextAlignment');
    sourceFile.addVariableStatement({
      leadingTrivia: newLine,
      declarationKind: VariableDeclarationKind.Const,
      declarations: [{
        name: typographsName,
        initializer: entitiesToWritableObject(spec.typographs, typographsName, localResolver, 'Typograph'),
      }],
    });
  }

  for (const [folder, assetsMap] of spec.assets) {
    designLanguageImports.add('Image');
    designLanguageImports.add('File');

    const files: any = {};
    const images: any = {};

    for (const [name, asset] of assetsMap) {
      const assetName = camelCase(name);
      const sanitizedSrc = windowsPathSanitize(asset.src);

      const sanitizedAssetName = quoteInvalidPropertyName(assetName);

      files[sanitizedAssetName] = `new File({src: "${sanitizedSrc}"})`;
      // const parsedSrc = parse(sanitizedSrc);
      // [2, 3, 4].forEach((multiplier) => {
      //   const baseName = windowsPathSanitize(join(parsedSrc.dir, parsedSrc.name));
      //   files[quoteInvalidPropertyName(`${assetName}${multiplier}x`)] = `new File({src: "${baseName}@${multiplier}x${parsedSrc.ext}"})`;
      // });

      images[sanitizedAssetName] = `Image.responsive("${sanitizedSrc}", ${asset.width}, ${asset.height})`;
    }

    const filesName = camelCase(`${spec.designLanguageName} ${assetFolders[folder]} Files`);
    const imagesName = camelCase(`${spec.designLanguageName} ${assetFolders[folder]}`);

    sourceFile.addVariableStatement({
      isExported: true,
      leadingTrivia: newLine,
      declarationKind: VariableDeclarationKind.Const,
      declarations: [{
        name: filesName,
        initializer: Writers.object(files),
      }],
    });

    /**
     * Add backwards-compatibility variable declaration for image files.
     * TODO: remove in next major release
     */
    sourceFile.addVariableStatement({
      isExported: true,
      leadingTrivia: deprecatedComment(filesName),
      declarationKind: VariableDeclarationKind.Const,
      declarations: [{
        name: camelCase(`${spec.designLanguageName} ${deprecatedAssetFolders[folder]} Files`),
        initializer: filesName,
      }],
    });

    sourceFile.addVariableStatement({
      isExported: true,
      leadingTrivia: newLine,
      declarationKind: VariableDeclarationKind.Const,
      declarations: [{
        name: imagesName,
        initializer: Writers.object(images),
      }],
    });

    /**
     * Add backwards-compatibility variable declaration for images.
     * TODO: remove in next major release
     */
    sourceFile.addVariableStatement({
      isExported: true,
      leadingTrivia: deprecatedComment(imagesName),
      declarationKind: VariableDeclarationKind.Const,
      declarations: [{
        name: camelCase(`${spec.designLanguageName} ${deprecatedAssetFolders[folder]}`),
        initializer: imagesName,
      }],
    });
  }

  const componentName = `${designLanguageName}Tokens`;
  const exportedInitializer: {[key: string]: any} = {};

  if (hasColors) {
    exportedInitializer.colors = colorsName;
  }

  if (hasGradients) {
    exportedInitializer.gradients = gradientsName;
  }

  if (hasShadows) {
    exportedInitializer.shadows = shadowsName;
  }

  if (hasTypographs) {
    designLanguageImports.add('Font');
    exportedInitializer.typography = typographsName;
  }

  sourceFile.addVariableStatement({
    isExported: true,
    leadingTrivia: newLine,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: camelCase(componentName),
      initializer: Writers.object(exportedInitializer),
    }],
  });

  if (designLanguageImports.size) {
    sourceFile.addImportDeclaration({
      moduleSpecifier: '@diez/prefabs',
      namedImports: Array.from(designLanguageImports).sort().map((name) => ({name})),
    });
  }

  addCommentHeader(sourceFile);
  cleanUnusedImports(sourceFile);
  sourceFile.formatText();
  return sourceFile.save();
};

const addCommentHeader = (sourceFile: SourceFile) => {
  sourceFile.insertStatements(0, `/**
 * This code was generated by Diez version ${diezVersion}.
 * Changes to this file may cause incorrect behavior and will be lost if the code is regenerated.
 */
`);
};

const cleanUnusedImports = (sourceFile: SourceFile) => {
  let lastWidth: number;

  do {
    lastWidth = sourceFile.getFullWidth();
    sourceFile.fixUnusedIdentifiers();
  } while (lastWidth !== sourceFile.getFullWidth());
};

/**
 * Rounds the number to the provided number of decimal points.
 */
export const roundFloat = (value: number, decimals: number = 15) =>
  Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);

/**
 * Converts a record containing primitives into a string representing JavaScript source code.
 */
export const objectToSource = (obj: Record<string, string|number|undefined>) => {
  const values = [];
  for (const key in obj) {
    values.push(`${key}: ${obj[key]}`);
  }
  return `{${values.join(', ')}}`;
};

/**
 * Checks if a string is a numeric literal by comparing the value as a string with the value as a number
 */
const isNumericLiteral = (value: string) => {
  const valueAsNumber = Number(value);
  return regexNumber.test(value) && !isNaN(valueAsNumber);
};

/**
 * Returns the actual value of a escaped string sequence.
 *
 * @example valueAsUnescapedString('\u0061') => 'a'
 */
const valueAsUnescapedString = (value: string): string => {
  return value.replace(/\\u([a-fA-F0-9]{4})|\\u\{([0-9a-fA-F]{1,})\}/g, ($0, $1, $2) => {
    const codePoint = parseInt($2 || $1, 16);
    // If it’s a surrogate…
    if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
      // Return a character that is never valid in an identifier.
      // This prevents the surrogate from pairing with another.
      return '\0';
    }

    return String.fromCodePoint(codePoint);
  });
};

/**
 * Checks if a value is an invalid ES5 identifier.
 */
const isInvalidEs5Identifier = (identifier: string) => {
  return !regexIdentifierNameES5.test(
    // Only Unicode escapes are allowed in ES5 identifiers.
    identifier.replace(/\\u([a-fA-F0-9]{4})/g, ($0, $1) => String.fromCodePoint(parseInt($1, 16))),
  );
};

/**
 * Returns the provided string surrounded with single quotes if is not a valid JavaScript identifier.
 *
 * @example quoteInvalidPropertyName('valid') => 'valid';
 * @example quoteInvalidPropertyName('00invalid') => '\'00invalid\'';
 */
export const quoteInvalidPropertyName = (name: string): string => {
  let needsQuotes = true;

  const nameAsUnescapedString = valueAsUnescapedString(name);
  const nameIsIdentifierNameES6 = regexIdentifierNameES6.test(nameAsUnescapedString);
  const nameIsNumericLiteral = isNumericLiteral(name);

  if (nameIsIdentifierNameES6) {
    needsQuotes = isInvalidEs5Identifier(name) || regexES3ReservedWord.test(nameAsUnescapedString) || regexZeroWidth.test(nameAsUnescapedString);
  } else if (nameIsNumericLiteral) {
    needsQuotes = false;
  }

  return needsQuotes ? `'${name}'` : name;
};

/**
 * Defines the folder where each asset type should be extracted.
 * @ignore
 */
export const assetFolders: AssetFolderByAssetType = {
  [ExtractableAssetType.Slice]: AssetFolder.Image,
  [ExtractableAssetType.Component]: AssetFolder.Image,
};

/**
 * Deprecated folder definitions for where each asset type should be extracted.
 * @ignore
 * @deprecated since version 10.4.0
 */
export const deprecatedAssetFolders: AssetFolderByAssetType = {
  [ExtractableAssetType.Slice]: AssetFolder.Slice,
  [ExtractableAssetType.Component]: AssetFolder.Component,
};

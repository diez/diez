import {getProject} from '@diez/compiler';
import {copySync, ensureDirSync} from 'fs-extra';
import pascalCase from 'pascal-case';
import {basename, join, parse, relative} from 'path';
import {VariableDeclarationKind} from 'ts-morph';
import {AssetFolder, CodegenDesignSystem, GeneratedAsset, GeneratedAssets} from './api';

const camelCase = (name: string) => {
  const propertyNamePascal = pascalCase(name, undefined, true);
  return propertyNamePascal.charAt(0).toLowerCase() + propertyNamePascal.slice(1);
};

/**
 * A helper class for resolving unique group/slice/artboard names from potentially duplicative sets.
 * @ignore
 */
export class UniqueNameResolver {
  private readonly assetResolver = new Map<string, number>();
  private readonly componentResolver = new Map<string, number>();
  private readonly propertyResolver = new Map<string, number>();

  getAssetName (name: string) {
    if (!this.assetResolver.has(name)) {
      this.assetResolver.set(name, 0);
      return name;
    }

    const counter = this.assetResolver.get(name)! + 1;
    this.assetResolver.set(name, counter);
    return `${name} Copy ${counter}`;
  }

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
  typographs: [],
  fontRegistry: new Set(),
  fontNames: new Set(),
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
  const typographsName = localResolver.getComponentName(`${designSystemName} Typographs`);

  if (spec.colors.length) {
    engineImports.add('property');
    designSystemImports.add('Color');
    sourceFile.addClass({
      name: paletteName,
      extends: 'Component',
      properties: spec.colors.map(({name, initializer}) => {
        const colorName = localResolver.getPropertyName(name || 'Untitled Color', paletteName);
        return {
          initializer,
          name: colorName,
          decorators: [{name: 'property'}],
        };
      }),
    });
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
          initializer: `new File({"src": "${asset.src}"})`,
        },
        ...[2, 3, 4].map((multiplier) => ({
          name: `${assetName}${multiplier}x`,
          isStatic: true,
          initializer: `new File({"src": "${parsedSrc.dir}/${parsedSrc.name}@${multiplier}x${parsedSrc.ext}"})`,
        })),
      ]);
      imagesClass.addProperty({
        name: assetName,
        isStatic: true,
        initializer: `Image.responsive("${asset.src}", ${asset.width}, ${asset.height})`,
      });
    }
  }

  if (spec.fontNames.size) {
    sourceFile.addEnum({
      name: `${designSystemName}Fonts`,
      isExported: true,
      members: Array.from(spec.fontNames).sort().map((value) => ({
        value,
        name: pascalCase(value),
      })),
    });
  }

  const componentName = `${designSystemName}DesignSystem`;
  const exportedClassDeclaration = sourceFile.addClass({
    isExported: true,
    name: componentName,
    extends: 'Component',
  });

  if (spec.fontRegistry.size) {
    designSystemImports.add('FontRegistry');
    const fontDirectory = join(assetsDirectory, 'fonts');
    ensureDirSync(fontDirectory);
    const fontFiles: string[] = [];
    for (const file of spec.fontRegistry) {
      const destination = join(fontDirectory, basename(file));
      copySync(file, destination);
      fontFiles.push(relative(projectRoot, destination));
    }

    exportedClassDeclaration.addProperty({
      name: 'fonts',
      decorators: [{name: 'property'}],
      initializer: `FontRegistry.fromFiles(${fontFiles.map((src) => `"${src}"`).join(', ')})`,
    });
  }

  if (spec.colors.length) {
    exportedClassDeclaration.addProperty({
      name: 'palette',
      decorators: [{name: 'property'}],
      initializer: `new ${paletteName}()`,
    });
  }

  if (spec.typographs.length) {
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

import {Format, Log} from '@diez/cli-core';
import {
  Compiler,
  CompilerTargetHandler,
  DiezComponent,
  DiezType,
  getAssemblerFactory,
  MaybeNestedArray,
  PrimitiveType,
  Property,
  TargetDiezComponent,
  TargetProperty,
} from '@diez/compiler-core';
import {Target} from '@diez/engine';
import {getTempFileName, outputTemplatePackage} from '@diez/storage';
import {ensureDirSync, readFileSync, writeFileSync, writeJsonSync} from 'fs-extra';
import {compile, registerHelper} from 'handlebars';
import {v4} from 'internal-ip';
import {join} from 'path';
import {getUnitedStyleSheetVariables, joinToKebabCase, sourcesPath, webComponentListHelper} from '../utils';
import {RuleList, StyleTokens, StyleVariableToken, WebBinding, WebDependency, WebOutput} from './web.api';

/**
 * The root location for source files.
 */
const coreWeb = join(sourcesPath, 'web');

/**
 * Merges a new dependency to the existing set of dependencies.
 */
const mergeDependency = (dependencies: Set<WebDependency>, newDependency: WebDependency) => {
  for (const dependency of dependencies) {
    if (dependency.packageJson.name === newDependency.packageJson.name) {
      // TODO: check for conflicts.
      return;
    }
  }

  dependencies.add(newDependency);
};

const newlineBuffer = Buffer.from('\n');

/**
 * A compiler for web targets.
 * @ignore
 */
export class WebCompiler extends Compiler<WebOutput, WebBinding> {
  /**
   * @abstract
   */
  protected async validateOptions () {
    // Noop.
  }

  /**
   * @abstract
   */
  async hostname () {
    return await v4();
  }

  /**
   * @abstract
   */
  get moduleName () {
    return `diez-${this.output.projectName}`;
  }

  /**
   * @abstract
   */
  get hotComponent () {
    return require.resolve('@diez/targets/lib/targets/web.component');
  }

  /**
   * @abstract
   */
  protected collectComponentProperties (
    parent: Property,
    allProperties: (TargetProperty | undefined)[],
  ): TargetProperty | undefined {
    const properties = allProperties.filter((property) => property !== undefined) as TargetProperty[];
    const reference = properties[0];
    if (!reference) {
      const name = parent.isComponent ? parent.type : this.getPrimitiveName(parent.type);
      if (!name) {
        return;
      }

      return {
        ...parent,
        type: `${name}[]`,
        initializer: '[]',
      };
    }

    return {
      ...reference,
      type: `${reference.type}[]`,
      initializer: `[${properties.map((property) => property.initializer).join(', ')}]`,
    };
  }

  /**
   * @abstract
   */
  protected getInitializer (targetComponent: TargetDiezComponent): string {
    const propertyInitializers: string[] = [];
    for (const property of targetComponent.properties) {
      propertyInitializers.push(`${property.name}: ${property.initializer}`);
    }

    return `{${propertyInitializers.join(', ')}}`;
  }

  /**
   * @abstract
   */
  protected getPrimitiveName (type: DiezType): string | undefined {
    switch (type) {
      case PrimitiveType.String:
        return 'string';
      case PrimitiveType.Float:
      case PrimitiveType.Number:
      case PrimitiveType.Int:
        return 'number';
      case PrimitiveType.Boolean:
        return 'boolean';
      default:
        return undefined;
    }
  }

  /**
   * @abstract
   */
  protected getPrimitiveInitializer (type: DiezType, instance: any): string | undefined {
    switch (type) {
      case PrimitiveType.String:
        return `"${instance}"`;
      case PrimitiveType.Float:
      case PrimitiveType.Number:
      case PrimitiveType.Int:
      case PrimitiveType.Boolean:
        return instance.toString();
      default:
        return undefined;
    }
  }

  /**
   * Updates the output based on the contents of the binding.
   */
  private mergeBindingToOutput (binding: WebBinding): void {
    for (const bindingSource of binding.sources) {
      this.output.sources.add(bindingSource);
    }

    if (binding.declarations) {
      for (const declaration of binding.declarations) {
        this.output.declarations.add(declaration);
      }
    }

    if (binding.dependencies) {
      for (const dependency of binding.dependencies) {
        mergeDependency(this.output.dependencies, dependency);
      }
    }
  }

  /**
   * @abstract
   */
  protected createOutput (sdkRoot: string, projectName: string) {
    return {
      sdkRoot,
      projectName,
      processedComponents: new Map(),
      sources: new Set<string>(),
      declarations: new Set<string>(),
      declarationImports: new Set<string>(),
      dependencies: new Set<WebDependency>(),
      assetBindings: new Map(),
      resources: new Map(),
      serializedTree: {},
      styleSheet: {
        variables: new Map(),
        font: new RuleList(),
        styles: new RuleList(),
        mediaQueries: new Map(),
      },
    };
  }

  /**
   * @abstract
   */
  get staticRoot () {
    return join(this.output.sdkRoot, 'static');
  }

  /**
   * @abstract
   */
  printUsageInstructions () {
    const diez = Format.code('Diez');
    const component = Array.from(this.parser.rootComponentNames)[0];
    const styleVarName = this.output.styleSheet.variables.keys().next().value;

    Log.info(`Diez package compiled to ${this.output.sdkRoot}.\n`);

    Log.info(`You can depend on ${diez} in ${Format.code('package.json')}:`);
    Log.code(`{
  "dependencies": {
    "${this.moduleName}": "*"
  }
}
`);

    Log.info(`You can use the variables and classes defined by ${diez} in your CSS or Sass styles.
  CSS:  ${Format.code(`rule: var(--${styleVarName});`)}
  Sass: ${Format.code(`rule: \$${styleVarName};`)}\n`);

    Log.info(`You can also use ${diez} with JavaScript to bootstrap any of the components defined in your project.`);

    Log.code(`new Diez(${component}).attach((component) => {
  // ...
});
`);
  }

  /**
   * @abstract
   */
  clear () {
    this.output.sources.clear();
    this.output.declarations.clear();
    this.output.processedComponents.clear();
    this.output.dependencies.clear();
    this.output.assetBindings.clear();
    this.output.styleSheet.variables.clear();
    this.output.styleSheet.styles.clear();
    this.output.serializedTree = {};
  }

  protected async processComponentProperty (
    property: Property,
    instance: MaybeNestedArray<any>,
    serializedInstance: MaybeNestedArray<any>,
    component: DiezComponent,
  ) {
    if (component.isRootComponent) {
      const rootComponentType = component.type.toString();

      if (!this.output.serializedTree[rootComponentType]) {
        this.output.serializedTree[rootComponentType] = {};
      }

      this.output.serializedTree[rootComponentType][property.name] = serializedInstance;
    }

    return super.processComponentProperty(property, instance, serializedInstance, component);
  }

  private getStyleTokens (): StyleTokens {
    const numberVariables = new Set<string>();
    for (const [componentName, component] of this.output.processedComponents) {
      for (const property of component.properties) {
        const propertyType = property.type.toString();
        // TODO: this shouldn't be necessary with a good and general design for "resource boundaries".
        if (!['number', 'string', 'boolean'].includes(propertyType) || component.binding) {
          continue;
        }

        if (
          componentName === 'Fill' ||
          componentName === 'Font' ||
          componentName === 'GradientStop' ||
          componentName === 'Point2D' ||
          componentName === 'Size2D'
        ) {
          continue;
        }

        const variableName = joinToKebabCase(componentName, property.name);
        this.output.styleSheet.variables.set(variableName, property.initializer);

        if (propertyType === 'number') {
          numberVariables.add(variableName);
        }
      }
    }

    const styleVariables: StyleVariableToken[] = [];
    this.output.styleSheet.variables.forEach((value, name) => {
      styleVariables.push({name, value});

      if (numberVariables.has(name)) {
        styleVariables.push(...getUnitedStyleSheetVariables(name, value));
      }
    });

    const mediaQueries: StyleVariableToken[] = [];
    this.output.styleSheet.mediaQueries.forEach((value, name) => {
      mediaQueries.push({name, value});
    });

    return {
      styleVariables,
      mediaQueries,
      styleFonts: this.output.styleSheet.font.serialize(),
      styleSheets: this.output.styleSheet.styles.serialize(),
      resources: [...this.output.resources.values()].map((resource) => resource.url),
    };
  }

  private writeStyleSdk (lang: 'scss' | 'css', tokens: StyleTokens) {
    const template = readFileSync(join(coreWeb, `styles.${lang}.handlebars`)).toString();
    const staticRoot = this.parser.hot ? this.hotStaticRoot : this.staticRoot;
    ensureDirSync(staticRoot);
    writeFileSync(join(staticRoot, `styles.${lang}`), compile(template)(tokens));
  }

  private writeJsonSdk (tokens: any) {
    const staticRoot = this.parser.hot ? this.hotStaticRoot : this.staticRoot;
    ensureDirSync(staticRoot);
    writeJsonSync(join(staticRoot, 'tree.json'), tokens, {spaces: 2});
  }

  writeAssets () {
    super.writeAssets();
    const styleTokens = this.getStyleTokens();
    this.writeStyleSdk('css', styleTokens);
    this.writeStyleSdk('scss', styleTokens);
    this.writeJsonSdk(this.output.serializedTree);
  }

  /**
   * Generates a source file comprised of all sources concatenated together.
   */
  private generateSource (): Buffer {
    const sources: Buffer[] = [];
    for (const source of this.output.sources) {
      sources.push(readFileSync(source), newlineBuffer);
    }

    return Buffer.concat(sources);
  }

  /**
   * Generates a declaration file comprised of all declarations concatenated together.
   */
  private generateDeclaration (): Buffer {
    const declarations = Array.from(this.output.declarationImports).map(
      (declarationImport) => Buffer.from(declarationImport));
    for (const declaration of this.output.declarations) {
      declarations.push(readFileSync(declaration), newlineBuffer);
    }

    return Buffer.concat(declarations);
  }

  async writeSdk () {
    const componentTemplate = readFileSync(join(coreWeb, 'js.component.handlebars')).toString();
    const es6InteropTemplate = readFileSync(join(coreWeb, 'js.es6Interop.handlebars')).toString();
    const declarationTemplate = readFileSync(join(coreWeb, 'js.declaration.handlebars')).toString();

    const builder = await getAssemblerFactory<WebOutput>(Target.Web);
    const assembler = builder(this.output);
    await assembler.addCoreFiles();
    const es6Interop = new Set<string>();

    // Register our list helper for producing list outputs.
    registerHelper('list', webComponentListHelper);
    for (const [type, {binding, ...targetComponent}] of this.output.processedComponents) {
      // For each fixed, replace it with its simple constructor.
      for (const property of Object.values(targetComponent.properties)) {
        if (
          property.originalType && this.parser.getComponentForTypeOrThrow(property.originalType).isFixedComponent) {
          property.initializer = '{}';
        }
      }

      const sourceFilename = getTempFileName();
      this.output.sources.add(sourceFilename);
      writeFileSync(
        sourceFilename,
        compile(componentTemplate)({
          ...targetComponent,
          fixed: targetComponent.isRootComponent || this.parser.getComponentForTypeOrThrow(type).isFixedComponent,
        }),
      );

      es6Interop.add(targetComponent.type.toString());

      if (binding) {
        this.mergeBindingToOutput(binding);
      }

      if (binding && binding.declarations && binding.declarations.length) {
        continue;
      }

      const declarationFilename = getTempFileName();
      this.output.declarations.add(declarationFilename);
      writeFileSync(
        declarationFilename,
        compile(declarationTemplate)(targetComponent),
      );
    }

    const tokens = {
      moduleName: this.moduleName,
      sdkVersion: this.parser.options.sdkVersion,
      dependencies: Array.from(this.output.dependencies),
    };

    this.writeAssets();
    return Promise.all([
      assembler.writeFile(
        join(this.output.sdkRoot, 'index.js'),
        this.generateSource(),
      ),
      assembler.writeFile(
        join(this.output.sdkRoot, 'index.d.ts'),
        this.generateDeclaration(),
      ),
      assembler.writeFile(
        join(this.output.sdkRoot, 'wrapper.mjs'),
        compile(es6InteropTemplate)({modules: Array.from(es6Interop), main: 'DiezModule'}),
      ),
      outputTemplatePackage(join(coreWeb, 'sdk'), this.output.sdkRoot, tokens),
    ]);
  }
}

/**
 * Handles web target compilation.
 * @ignore
 */
export const webHandler: CompilerTargetHandler = async (program) => {
  return new WebCompiler(program).start();
};

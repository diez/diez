import {diezVersion, Log} from '@diez/cli-core';
import {
  DiezComponent,
  DiezType,
  getBinding,
  getTargets,
  inferProjectName,
  isConstructible,
  loadComponentModule,
  MaybeNestedArray,
  Parser,
  PrimitiveType,
  Property,
  PropertyDescription,
  UsageExample,
  UsageExampleTree,
} from '@diez/compiler-core';
import {serialize} from '@diez/engine';
import {copy, ensureDir, outputFile, readFileSync, remove, writeJson} from 'fs-extra';
import {dirname, join} from 'path';
import {handlebars, highlight, markdown} from '../utils/format';
import {buildIndex} from '../utils/search';
import {DocsTargetSpec, ParsedExampleTree, DocsOutput} from './docs.api';

/**
 * Compiler for docs.
 */
export class DocsCompiler {
  output: DocsOutput;

  constructor (readonly parser: Parser) {
    const projectName = inferProjectName(parser.projectRoot);
    this.output = this.createOutput(
      join(parser.projectRoot, 'build', `diez-${projectName}-${parser.options.target}`),
      projectName,
    );

    if (parser.hot) {
      throw new Error('Docs cannot be built in hot mode.');
    }
  }

  private createOutput (sdkRoot: string, projectName: string) {
    return {
      projectName,
      sdkRoot,
      assetBindings: new Map(),
    }
  }

  async start () {
    await this.writeAssets(await this.getTrees());
  }

  private async getTrees () {
    const componentModule = await loadComponentModule(this.parser.emitRoot);
    const trees: DocsTargetSpec[] = [];

    for (const componentName of this.parser.rootComponentNames) {
      const {symbolName} = this.parser.getMetadataForTypeOrThrow(componentName);
      const maybeConstructor = componentModule[symbolName];
      if (!maybeConstructor) {
        Log.info(`Unable to resolve component instance from ${this.parser.projectRoot}: ${componentName}.`);
        continue;
      }

      const componentInstance = isConstructible(maybeConstructor) ? new maybeConstructor() : maybeConstructor;
      const tree = await this.processComponentInstance(
        componentInstance,
        componentName,
        ['/'],
        componentName.toString(),
      );

      if (tree) {
        trees.push(tree);
      }
    }

    return trees;
  }

  /**
   * Recursively processes a component instance and all its properties.
   */
  private processComponentInstance = async (
    instance: any,
    type: DiezType,
    parentId: string[],
    name: string,
    instanceDescription?: PropertyDescription,
  ) => {
    const component = this.parser.components.get(type);
    if (!component) {
      Log.info(`Unable to find component definition for ${type}!`);
      return;
    }

    const serializedData = serialize(instance);
    const binding = await getBinding<any>(this.parser.options.target, component.sourceModule || '.', type);
    const id = parentId.concat(name || '');
    const examples = await this.getExamples(component.sourceModule || '.', type, instance, name, id);

    const spec: DocsTargetSpec = {
      type,
      name,
      examples,
      id: join(...id),
      comments: {
        type: markdown(component.description.body),
        instance: instanceDescription ? markdown(instanceDescription.body) : undefined,
      },
      properties: {},
      value: {},
      isPrimitive: false,
    };

    if (binding) {
      const serializedBinding = Object.assign({}, binding);

      if (binding.assetsBinder) {
        await binding.assetsBinder(
          instance, this.parser, {assetBindings: this.output.assetBindings}, component, instance);
      }

      spec.binding = serializedBinding;
    }

    for (const property of component.properties) {
      const propertySpec = await this.processComponentProperty(
        property,
        instance[property.name],
        serializedData[property.name],
        component,
        id,
      );
      if (propertySpec) {
        spec.properties[property.name] = propertySpec;
      }
    }

    return spec;
  };

  private async getExamples (
    source: string,
    type: DiezType,
    instance: DiezComponent,
    name: string,
    path: string[],
  ) {
    const targets = await getTargets();
    const result: ParsedExampleTree = {};

    for (const [, target] of targets) {
      const binding = await getBinding<any>(target.name, source, type);
      if (binding && binding.examples) {
        result[target.name] = this.parseUsageTree(binding.examples, instance, name, path);
      }
    }

    return result;
  }

  private parseUsageExample (example: UsageExample[], instance: DiezComponent, name: string, path: string[]) {
    const examples = [];

    for (const usageExample of example as UsageExample[]) {
      const snippets = [];
      for (const snippet of usageExample.snippets) {
        const compilerData = {
          instance,
          name,
          path,
          projectName: inferProjectName(this.parser.projectRoot),
          rootType: path[1],
        };
        const data = Object.assign({}, compilerData, snippet.data);
        const normalizedLang = snippet.lang.toLowerCase().replace('-', '');

        let template: string = '';

        if ('template' in snippet) {
          template = snippet.template;
        }

        if ('templatePath' in snippet) {
          template = readFileSync(snippet.templatePath).toString();
        }

        const compiledTemplate = handlebars(template, data, {helpers: snippet.helpers});

        snippets.push({
          lang: snippet.lang,
          snippet: highlight(compiledTemplate, normalizedLang),
        });
      }

      examples.push({
        snippets,
        example: usageExample.example || '',
        comment: markdown(usageExample.comment || ''),
      });
    }

    return examples;
  }

  private parseUsageTree (example: UsageExampleTree, instance: DiezComponent, name: string, path: string[]) {
    const result: ParsedExampleTree = {};

    if (Array.isArray(example)) {
      return this.parseUsageExample(example, instance, name, path);
    }

    for (const key in example) {
      if (Array.isArray(example[key])) {
        result[key] = this.parseUsageExample(example[key] as UsageExample[], instance, name, path);
      } else {
        result[key] = this.parseUsageTree(example[key] as UsageExampleTree, instance, name, path);
      }

    }

    return result;
  }

  /**
   * Recursively processes a component property.
   */
  private processComponentProperty = async (
    property: Property,
    instance: MaybeNestedArray<any>,
    serializedInstance: MaybeNestedArray<any>,
    targetComponent: DiezComponent,
    id: string[],
  ): Promise<DocsTargetSpec | undefined> => {
    if (Array.isArray(instance)) {
      if (!property.depth) {
        // This should never happen.
        targetComponent.warnings.ambiguousTypes.add(property.name);
        return;
      }

      const result: DocsTargetSpec = {
        id: join(...id),
        name: property.name,
        type: property.type.toString(),
        properties: {},
        isPrimitive: false,
        value: [],
        comments: {
          instance: markdown(property.description.body),
        },
      };

      for (let index = 0; index < instance.length; index++) {
        const child = instance[index];
        result.value.push(await this.processComponentProperty(
          property,
          child,
          serializedInstance[index],
          targetComponent,
          id,
        ));
      }

      return result;
    }

    if (property.isComponent) {
      const componentSpec = await this.processComponentInstance(
        instance,
        property.type,
        id,
        property.name,
        property.description,
      );

      if (!componentSpec) {
        targetComponent.warnings.ambiguousTypes.add(property.name);
        return;
      }

      return componentSpec;
    }

    return {
      id: `${join(...id)}#${property.name}`,
      name: property.name,
      type: PrimitiveType[property.type as number],
      comments: {
        instance: markdown(property.description.body),
      },
      properties: {},
      isPrimitive: true,
      value: serializedInstance,
    };
  };

  private async writeAssets (trees: DocsTargetSpec[]) {
    const searchIndex = buildIndex(trees);

    await remove(this.output.sdkRoot);
    await ensureDir(this.output.sdkRoot);
    await writeJson(join(this.output.sdkRoot, 'tree.json'), trees, {spaces: 2});
    await writeJson(join(this.output.sdkRoot, 'searchIndex.json'), searchIndex);
    await writeJson(
      join(this.output.sdkRoot, 'package.json'),
      {
        name: `diez-${inferProjectName(this.parser.projectRoot)}-docs`,
        version: this.parser.options.sdkVersion,
        dependencies: {
          '@diez/docs-template-app': `^${diezVersion}`,
        },
        scripts: {
          build: 'docs-app build',
          start: 'docs-app start',
        },
      },
      {spaces: 2},
    );

    for (const [path, binding] of this.output.assetBindings) {
      const outputPath = join(this.output.sdkRoot, path);
      await ensureDir(dirname(outputPath));
      if (binding.copy) {
        await copy(binding.contents as string, outputPath);
        continue;
      }

      await outputFile(outputPath, binding.contents);
    }
  }

  clear () {
    this.output.assetBindings.clear();
  }
}

/**
 * Handles docs compilation.
 */
export const docsHandler = async (parser: Parser) => {
  return new DocsCompiler(parser).start();
};

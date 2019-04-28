import {code, execAsync, info, inlineCodeSnippet, isMacOS, warning} from '@diez/cli';
import {
  CompilerTargetHandler,
  getTempFileName,
  PrimitiveType,
  PropertyType,
  TargetCompiler,
  TargetComponentProperty,
  TargetComponentSpec,
} from '@diez/compiler';
import {outputTemplatePackage} from '@diez/storage';
import {readFileSync, writeFileSync} from 'fs-extra';
import {compile} from 'handlebars';
import {v4} from 'internal-ip';
import {join} from 'path';
import {sourcesPath} from '../utils';
import {IosBinding, IosDependency, IosOutput} from './ios.api';

/**
 * The root location for source files.
 *
 * @internal
 */
const coreIos = join(sourcesPath, 'ios');

/**
 * Merges a new dependency to the existing set of dependencies.
 *
 * @internal
 */
const mergeDependency = (dependencies: Set<IosDependency>, newDependency: IosDependency) => {
  for (const dependency of dependencies) {
    if (dependency.cocoapods.name === newDependency.cocoapods.name) {
      // TODO: check for conflicts.
      return;
    }
  }

  dependencies.add(newDependency);
};

/**
 * A compiler for iOS targets.
 * @ignore
 */
export class IosCompiler extends TargetCompiler<IosOutput, IosBinding> {
  /**
   * @abstract
   */
  async hostname () {
    try {
      return `${await execAsync('scutil --get LocalHostName')}.local`;
    } catch (_) {
      return await v4();
    }
  }

  /**
   * @abstract
   */
  get hotComponent () {
    return require.resolve('@diez/targets/lib/targets/ios.component');
  }

  /**
   * Reducer for array component properties.
   *
   * Retypes `String` as `[String]` and consolidates initializers.
   *
   * @abstract
   */
  protected collectComponentProperties (allProperties: (TargetComponentProperty | undefined)[]) {
    const properties = allProperties.filter((property) => property !== undefined) as TargetComponentProperty[];
    const reference = properties[0];
    if (!reference) {
      return;
    }

    return {
      type: `[${reference.type}]`,
      initializer: `[${properties.map((property) => property.initializer).join(', ')}]`,
      updateable: reference.updateable,
    };
  }

  /**
   * Retrieves an initializer based on a spec.
   *
   * Via recursion, produces output like `ComponentType(fieldName: "fileValue", child: ChildType())`.
   *
   * @abstract
   */
  protected getInitializer (spec: TargetComponentSpec<TargetComponentProperty>): string {
    const propertyInitializers: string[] = [];
    for (const name in spec.properties) {
      propertyInitializers.push(`${name}: ${spec.properties[name].initializer}`);
    }
    return `${spec.componentName}(${propertyInitializers.join(', ')})`;
  }

  /**
   * @abstract
   */
  protected getPrimitive (type: PropertyType, instance: any): TargetComponentProperty | undefined {
    switch (type) {
      case PrimitiveType.String:
        return {
          type: 'String',
          initializer: `"${instance}"`,
          updateable: false,
        };
      case PrimitiveType.Float:
      case PrimitiveType.Number:
        return {
          type: 'CGFloat',
          initializer: instance.toString(),
          updateable: false,
        };
      case PrimitiveType.Int:
        return {
          type: 'Int',
          initializer: instance.toString(),
          updateable: false,
        };
      case PrimitiveType.Boolean:
        return {
          type: 'Bool',
          initializer: instance.toString(),
          updateable: false,
        };
      default:
        warning(`Unknown non-component primitive value: ${instance.toString()} with type ${type}`);
        return;
    }
  }
  /**
   * @abstract
   */
  protected mergeBindingToOutput (binding: IosBinding): void {
    for (const bindingImport of binding.imports) {
      this.output.imports.add(bindingImport);
    }

    for (const bindingSource of binding.sources) {
      this.output.sources.add(bindingSource);
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
  protected createOutput (sdkRoot: string) {
    return {
      sdkRoot,
      processedComponents: new Map(),
      imports: new Set(['Foundation', 'WebKit']),
      sources: new Set([
        join(coreIos, 'core', 'Diez.swift'),
        join(coreIos, 'core', 'Environment.swift'),
        join(coreIos, 'core', 'Bundle+Environment.swift'),
        join(coreIos, 'core', 'Serialization.swift'),
        join(coreIos, 'core', 'ReflectedCustomStringConvertible.swift'),
      ]),
      dependencies: new Set(),
      assetBindings: new Map(),
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
    info(`Diez SDK installed locally at ${join(this.program.projectRoot, 'Diez')}.\n`);

    // TODO: Check if the target is actually using CocoaPods; locate Podfile if they are.
    // TODO: Offer to add dependency to CocoaPods for the user, but don't force them to accept.
    // Check if they already have a pod dependency.
    info(`You can depend on the Diez SDK in your ${inlineCodeSnippet('Podfile')} like so:`);
    code('pod \'Diez\', :path => \'./Diez\'\n');
    info(`Don't forget to run ${inlineCodeSnippet('pod install')} after updating your CocoaPods dependencies!\n`);

    // TODO: Check if the target is actually using Swift.
    info(`You can use ${inlineCodeSnippet('Diez')} to bootstrap any of the components defined in your project.\n`);
    info('For example:');
    // TODO: Move this into a template.
    // TODO: components with bindings should yield their own documentation.
    code(`import UIKit
import Diez

class ViewController: UIViewController {
    private lazy var diez = Diez<${this.program.localComponentNames[0]}>(view: view)

    override func viewDidLoad() {
        super.viewDidLoad()
        diez.attach { [weak self] component in
            // ...
        }
    }
}
  `);
  }

  /**
   * @abstract
   */
  clear () {
    this.output.imports.clear();
    this.output.sources.clear();
    this.output.processedComponents.clear();
    this.output.dependencies.clear();
    this.output.assetBindings.clear();
  }

  /**
   * @abstract
   */
  async writeSdk (hostname?: string, devPort?: number) {
    // Pass through to take note of our singletons.
    const singletons = new Set<PropertyType>();
    for (const [type, {instances, binding}] of this.output.processedComponents) {
      // If a binding is provided, it's safe to assume we don't want to treat this object as a singleton, even if it is.
      if (instances.size === 1 && !binding) {
        singletons.add(type);
      }
    }

    const hasStaticAssets = this.output.assetBindings.size > 0;
    if (hasStaticAssets) {
      this.output.sources.add(join(coreIos, 'core', 'Bundle+Static.swift'));
    }

    const componentTemplate = readFileSync(join(coreIos, 'ios.component.handlebars')).toString();
    for (const [type, {spec, binding}] of this.output.processedComponents) {
      if (binding && binding.skipGeneration) {
        this.mergeBindingToOutput(binding);
        continue;
      }

      // For each singleton, replace it with its simple constructor.
      for (const property of Object.values(spec.properties)) {
        if (singletons.has(property.type)) {
          property.initializer = `${property.type}()`;
        }
      }

      const filename = getTempFileName();
      this.output.sources.add(filename);
      writeFileSync(
        filename,
        compile(componentTemplate)({
          ...spec,
          singleton: spec.public || singletons.has(type),
          hasProperties: Object.keys(spec.properties).length > 0,
        }),
      );

      if (binding) {
        this.mergeBindingToOutput(binding);
      }
    }

    const tokens = {
      devPort,
      hostname,
      hasStaticAssets,
      devMode: this.program.devMode,
      dependencies: Array.from(this.output.dependencies),
      imports: Array.from(this.output.imports),
      sources: Array.from(this.output.sources).map((source) => readFileSync(source).toString()),
    };

    this.writeAssets();
    outputTemplatePackage(join(coreIos, 'sdk'), this.output.sdkRoot, tokens);
  }
}

/**
 * Handles iOS target compilation.
 * @ignore
 */
export const iosHandler: CompilerTargetHandler = async (program) => {
  if (!isMacOS()) {
    throw new Error('--target ios can only be built on macOS.');
  }

  await new IosCompiler(program, join(program.destinationPath, 'Diez')).start();
};

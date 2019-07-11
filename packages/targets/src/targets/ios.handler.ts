import {canRunCommand, execAsync, Format, isMacOS, Log} from '@diez/cli-core';
import {
  CompilerTargetHandler,
  PrimitiveType,
  PropertyType,
  TargetCompiler,
  TargetComponentProperty,
  TargetComponentSpec,
} from '@diez/compiler';
import {getTempFileName, outputTemplatePackage} from '@diez/storage';
import {pascalCase} from 'change-case';
import {copySync, ensureDirSync, readFileSync, writeFileSync} from 'fs-extra';
import {compile} from 'handlebars';
import {v4} from 'internal-ip';
import {join, relative} from 'path';
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

    if (dependency.carthage.name === newDependency.carthage.name) {
      // TODO: check for conflicts.
      return;
    }
  }

  dependencies.add(newDependency);
};

const xcodegenInstallationMessage = (message: string) => `${message}

You can install XcodeGen using HomeBrew:

  brew install xcodegen

See https://github.com/yonaskolb/XcodeGen#installing for all installation options.`;

/**
 * A compiler for iOS targets.
 * @ignore
 */
export class IosCompiler extends TargetCompiler<IosOutput, IosBinding> {
  /**
   * @abstract
   */
  protected async validateOptions () {
    if (this.program.hot) {
      // No need for validation if we're running hot.
      return;
    }

    const hasXcodeGen = await canRunCommand('xcodegen --help');

    if (hasXcodeGen) {
      // Nothing special is needed if XcodeGen is already installed.
      return;
    }

    if (this.program.options.carthage) {
      throw new Error(xcodegenInstallationMessage(
        '--carthage requires XcodeGen in order to generate an Xcode project.'));
    } else if (!this.program.options.cocoapods) {
      throw new Error(xcodegenInstallationMessage(
        '--target=ios without --cocoapods requires XcodeGen in order to generate an Xcode project.'));
    }
  }

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
  get moduleName () {
    return pascalCase(`diez-${this.output.projectName}`);
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
      isPrimitive: reference.isPrimitive,
      depth: reference.depth,
    };
  }

  /**
   * Retrieves an initializer based on a spec.
   *
   * Via recursion, produces output like `ComponentType(fieldName: "fileValue", child: ChildType())`.
   *
   * @abstract
   */
  protected getInitializer (spec: TargetComponentSpec): string {
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
          isPrimitive: true,
          depth: 0,
        };
      case PrimitiveType.Float:
      case PrimitiveType.Number:
        return {
          type: 'CGFloat',
          initializer: instance.toString(),
          isPrimitive: true,
          depth: 0,
        };
      case PrimitiveType.Int:
        return {
          type: 'Int',
          initializer: instance.toString(),
          isPrimitive: true,
          depth: 0,
        };
      case PrimitiveType.Boolean:
        return {
          type: 'Bool',
          initializer: instance.toString(),
          isPrimitive: true,
          depth: 0,
        };
      default:
        Log.warning(`Unknown non-component primitive value: ${instance.toString()} with type ${type}`);
        return;
    }
  }

  /**
   * Returns the root path in the temp directory where the module's source files should be copied to.
   *
   * All sources will be copied here in the appropriate directory structure before being copied to the destination.
   */
  private get sourcesRoot () {
    return join(this.output.temporaryRoot, 'Sources', this.moduleName);
  }

  /**
   * Updates the output based on the contents of the binding.
   */
  private mergeBindingToOutput (binding: IosBinding): void {
    const sourcesRoot = this.sourcesRoot;

    for (const bindingSource of binding.sources) {
      const relativePath = relative(join(coreIos, 'bindings'), bindingSource);
      const destination = join(sourcesRoot, 'Bindings', relativePath);
      copySync(bindingSource, destination);
      this.output.sources.add(destination);
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
      sources: new Set([]),
      dependencies: new Set<IosDependency>(),
      assetBindings: new Map(),
      bundleIdPrefix: `org.diez.${pascalCase(projectName)}`,
      temporaryRoot: getTempFileName(),
    };
  }

  /**
   * @abstract
   */
  get staticRoot () {
    return join(this.output.sdkRoot, 'Sources', 'Static');
  }

  /**
   * @abstract
   */
  printUsageInstructions () {
    Log.info(`Diez SDK installed locally at ${this.output.sdkRoot}.\n`);

    if (this.program.options.cocoapods) {
      Log.info(`You can depend on the Diez SDK in your ${Format.code('Podfile')} during development like so:`);
      Log.code(`pod '${this.moduleName}', :path => '${this.output.sdkRoot}'\n`);
      Log.info(`Don't forget to run ${Format.code('pod install')} after updating your CocoaPods dependencies!\n`);
    }

    if (this.program.options.carthage) {
      Log.info('You can depend on the Diez SDK in your application by hosting the generated SDK on GitHub and updating ');
      Log.info(`your ${Format.code('Cartfile')} like so:`);
      Log.code(`github "organization/${this.moduleName}" "master"\n`);
      Log.info(`where ${Format.code(`organization/${this.moduleName}`)} is your generated SDK's GitHub repository.`);
      Log.info(`Don't forget to run ${Format.code('carthage update')} after updating your Cartfile!\n`);
    }

    // TODO: Check if the target is actually using Swift.
    Log.info(`You can use ${Format.code('Diez')} to bootstrap any of the components defined in your project.\n`);
    Log.info('For example:');
    // TODO: Move this into a template.
    // TODO: components with bindings should yield their own documentation.
    Log.code(`import UIKit
import ${this.moduleName}

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
    this.output.sources.clear();
    this.output.processedComponents.clear();
    this.output.dependencies.clear();
    this.output.assetBindings.clear();
  }

  /**
   * Retrieves a contextual blacklist based on options.
   */
  private get blacklist () {
    const blacklist = new Set<string>();

    if (!this.program.options.cocoapods) {
      // No need for Diez.podspec unless the user has requested CocoaPods support.
      blacklist.add('Diez.podspec');
    }

    if (!this.program.options.carthage) {
      // No need for Cartfile unless the user has requested Carthage support.
      blacklist.add('Cartfile');

      if (this.program.options.cocoapods) {
        // No need for project generation at all if the user has requested CocoaPods support.
        blacklist.add('project.yml');
      }
    }

    return blacklist;
  }

  /**
   * Copies the provided core files into the temp directory before adding them to the list of output sources.
   *
   * @param filenames The core filenames to add to the output's sources.
   */
  private addCoreSources (filenames: string[]) {
    const sourceCore = join(coreIos, 'core');
    const sourcesRoot = this.sourcesRoot;

    for (const filename of filenames) {
      const source = join(sourceCore, filename);
      const destination = join(sourcesRoot, 'Core', filename);
      copySync(source, destination);
      this.output.sources.add(destination);
    }
  }

  /**
   * @abstract
   */
  async writeSdk () {
    // Pass through to take note of our singletons.
    const singletons = new Set<PropertyType>();
    for (const [type, {instances, binding}] of this.output.processedComponents) {
      // If a binding is provided, it's safe to assume we don't want to treat this object as a singleton, even if it is.
      if (instances.size === 1 && !binding) {
        singletons.add(type);
      }
    }

    const coreSourceFilenames = [
      'Diez.swift',
      'Environment.swift',
      'Bundle+Environment.swift',
      'ReflectedCustomStringConvertible.swift',
    ];

    const hasStaticAssets = this.output.assetBindings.size > 0;
    if (hasStaticAssets) {
      coreSourceFilenames.push('Bundle+Static.swift');
    }

    this.addCoreSources(coreSourceFilenames);

    const componentsFolder = join(this.sourcesRoot, 'Components');
    ensureDirSync(componentsFolder);
    const componentTemplate = readFileSync(join(coreIos, 'ios.component.handlebars')).toString();
    for (const [type, {spec, binding}] of this.output.processedComponents) {
      // For each singleton, replace it with its simple constructor.
      for (const property of Object.values(spec.properties)) {
        if (singletons.has(property.type)) {
          property.initializer = `${property.type}()`;
        }
      }

      const filename = join(componentsFolder, `${spec.componentName.toString()}.swift`);
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

    const hasDependencies =  this.output.dependencies.size > 0;
    const hasDependenciesOrStaticAssets =  hasDependencies || hasStaticAssets;

    const assetBindingKeys = Array.from(this.output.assetBindings.keys());
    const assetCatalogPaths: Set<string> = new Set();
    const assetFolderPaths: Set<string> = new Set();
    for (const path of assetBindingKeys) {
      const root = path.split('/')[0];
      const staticRoot = join('Sources', 'Static', root);
      if (root.endsWith('.xcassets')) {
        assetCatalogPaths.add(staticRoot);
      } else {
        assetFolderPaths.add(staticRoot);
      }
    }

    const tokens = {
      hasDependenciesOrStaticAssets,
      hasStaticAssets,
      sdkVersion: this.program.options.sdkVersion,
      moduleName: this.moduleName,
      assetCatalogPaths: Array.from(assetCatalogPaths),
      assetFolderPaths: Array.from(assetFolderPaths),
      bundleIdPrefix: this.output.bundleIdPrefix,
      dependencies: Array.from(this.output.dependencies),
    };

    this.writeAssets();

    await outputTemplatePackage(join(coreIos, 'sdk'), this.output.sdkRoot, tokens, this.blacklist);

    for (const source of this.output.sources) {
      // Since all source files are copied to the temp directory before being added as output, all files should be
      // copied relative to the temp directory.
      const relativePath = relative(this.output.temporaryRoot, source);
      const destination = join(this.output.sdkRoot, relativePath);
      copySync(source, destination);
    }

    // Always generate a project when the user has not opted in to CocoaPods support, or when the user has explicitly
    // opted in to Carthage support.
    if (!this.program.options.cocoapods || this.program.options.carthage) {
      await execAsync('xcodegen generate', {cwd: this.output.sdkRoot});
    }
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

  return new IosCompiler(program).start();
};

import {canRunCommand, execAsync, Format, isMacOS, Log} from '@diez/cli-core';
import {
  Assembler,
  Compiler,
  CompilerTargetHandler,
  DiezType,
  getAssemblerFactory,
  PrimitiveType,
  Property,
  TargetDiezComponent,
  TargetProperty,
} from '@diez/compiler-core';
import {Target} from '@diez/engine';
import {outputTemplatePackage} from '@diez/storage';
import {pascalCase} from 'change-case';
import {readFileSync} from 'fs-extra';
import {compile, registerHelper} from 'handlebars';
import {v4} from 'internal-ip';
import jsdocToMarkdown from 'jsdoc-to-markdown';
import {basename, join} from 'path';
import {sourcesPath, safeSwiftIdentifier} from '../utils';
import {IosBinding, IosDependency, IosOutput} from './ios.api';
/**
 * The root location for source files.
 */
const coreIos = join(sourcesPath, Target.Ios);

/**
 * Merges a new dependency to the existing set of dependencies.
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
export class IosCompiler extends Compiler<IosOutput, IosBinding> {
  /**
   * @abstract
   */
  protected async validateOptions () {
    if (this.parser.hot) {
      // No need for validation if we're running hot.
      return;
    }

    const hasXcodeGen = await canRunCommand('xcodegen --help');

    if (hasXcodeGen) {
      // Nothing special is needed if XcodeGen is already installed.
      return;
    }

    if (this.parser.options.carthage) {
      throw new Error(xcodegenInstallationMessage(
        '--carthage requires XcodeGen in order to generate an Xcode project.'));
    } else if (!this.parser.options.cocoapods) {
      throw new Error(xcodegenInstallationMessage(
        '--target=ios without --cocoapods requires XcodeGen in order to generate an Xcode project.'));
    }
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
  protected collectComponentProperties (
    parent: Property,
    allProperties: (TargetProperty | undefined)[],
  ) {
    const properties = allProperties.filter((property) => property !== undefined) as TargetProperty[];
    const reference = properties[0];
    if (!reference) {
      const name = parent.isComponent ? parent.type : this.getPrimitiveName(parent.type);
      if (!name) {
        return;
      }

      return {
        ...parent,
        type: `[${name}]`,
        initializer: '[]',
      };
    }

    return {
      ...reference,
      type: `[${reference.type}]`,
      initializer: `[${properties.map((property) => property.initializer).join(', ')}]`,
    };
  }

  /**
   * Retrieves an initializer based on a spec.
   *
   * Via recursion, produces output like `ComponentType(fieldName: "fileValue", child: ChildType())`.
   *
   * @abstract
   */
  protected getInitializer (targetComponent: TargetDiezComponent): string {
    const propertyInitializers: string[] = [];
    for (const property of targetComponent.properties) {
      propertyInitializers.push(`${property.name}: ${property.initializer}`);
    }
    return `${targetComponent.type}(${propertyInitializers.join(', ')})`;
  }

  /**
   * @abstract
   */
  protected getPrimitiveName (type: DiezType): string | undefined {
    switch (type) {
      case PrimitiveType.String:
        return 'String';
      case PrimitiveType.Float:
      case PrimitiveType.Number:
        return 'CGFloat';
      case PrimitiveType.Int:
        return 'Int';
      case PrimitiveType.Boolean:
        return 'Bool';
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
  private async mergeBindingToOutput (binding: IosBinding, assembler: Assembler<IosOutput>) {
    for (const bindingSource of binding.sources) {
      const destination = join(this.output.sourcesRoot, 'Bindings', basename(bindingSource));
      await assembler.copyFile(bindingSource, destination);
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
    const pascalProject = pascalCase(projectName);
    return {
      sdkRoot,
      projectName,
      processedComponents: new Map(),
      sources: new Set([]),
      dependencies: new Set<IosDependency>(),
      assetBindings: new Map(),
      bundleIdPrefix: `org.diez.${pascalProject}`,
      // The root path in the temp directory where the module's source files should be copied to.
      // All sources will be copied here in the appropriate directory structure before being copied to the destination.
      sourcesRoot: join(sdkRoot, 'Sources', `Diez${pascalProject}`),
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

    if (this.parser.options.cocoapods) {
      Log.info(`You can depend on the Diez SDK in your ${Format.code('Podfile')} during development like so:`);
      Log.code(`pod '${this.moduleName}', :path => '${this.output.sdkRoot}'\n`);
      Log.info(`Don't forget to run ${Format.code('pod install')} after updating your CocoaPods dependencies!\n`);
    }

    if (this.parser.options.carthage) {
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
    private lazy var diez = Diez<${Array.from(this.parser.rootComponentNames)[0]}>(view: view)

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

    if (!this.parser.options.cocoapods) {
      // No need for Diez.podspec unless the user has requested CocoaPods support.
      blacklist.add('Diez.podspec');
    }

    if (!this.parser.options.carthage) {
      // No need for Cartfile unless the user has requested Carthage support.
      blacklist.add('Cartfile');

      if (this.parser.options.cocoapods) {
        // No need for project generation at all if the user has requested CocoaPods support.
        blacklist.add('project.yml');
      }
    }

    return blacklist;
  }

  /**
   * @abstract
   */
  async writeSdk () {
    const builder = await getAssemblerFactory<IosOutput>(Target.Ios);
    const assembler = builder(this.output);
    await assembler.addCoreFiles();
    const hasStaticAssets = this.output.assetBindings.size > 0;

    registerHelper('safeSwiftIdentifier', safeSwiftIdentifier);

    const componentsFolder = join(this.output.sourcesRoot, 'Components');
    const componentTemplate = readFileSync(join(coreIos, 'ios.component.handlebars')).toString();
    for (const [type, {binding, ...targetComponent}] of this.output.processedComponents) {
      // For each fixed, replace it with its simple constructor.
      if (targetComponent.description.body) {
        targetComponent.description.body = await jsdocToMarkdown.render({
          source: `/** ${targetComponent.description.body} */`,
        });
      }

      for (const property of Object.values(targetComponent.properties)) {
        if (
          property.originalType && this.parser.getComponentForTypeOrThrow(property.originalType).isFixedComponent) {
          property.initializer = `${property.type}()`;
        }
      }

      const filename = join(componentsFolder, `${targetComponent.type.toString()}.swift`);
      await assembler.writeFile(
        filename,
        compile(componentTemplate)({
          ...targetComponent,
          fixed: targetComponent.isRootComponent || this.parser.getComponentForTypeOrThrow(type).isFixedComponent,
          hasProperties: Object.keys(targetComponent.properties).length > 0,
        }),
      );

      if (binding) {
        await this.mergeBindingToOutput(binding, assembler);
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
      sdkVersion: this.parser.options.sdkVersion,
      moduleName: this.moduleName,
      assetCatalogPaths: Array.from(assetCatalogPaths),
      assetFolderPaths: Array.from(assetFolderPaths),
      bundleIdPrefix: this.output.bundleIdPrefix,
      dependencies: Array.from(this.output.dependencies),
    };

    this.writeAssets();

    await outputTemplatePackage(join(coreIos, 'sdk'), this.output.sdkRoot, tokens, this.blacklist);

    // Always generate a project when the user has not opted in to CocoaPods support, or when the user has explicitly
    // opted in to Carthage support.
    if (!this.parser.options.cocoapods || this.parser.options.carthage) {
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

import {CompilerProgram} from '@diez/compiler';
import {Component} from '@diez/engine';
import {AssetBinder, AssetBinding} from '../api';

/**
 * Describes an iOS third party dependency.
 */
export interface IosDependency {
  cocoapods: {
    name: string;
    versionConstraint: string;
  };
  /**
   * @todo Define the shape of Carthage dependencies.
   */
  carthage: {};
  /**
   * @todo Define the shape of vanilla dependencies.
   */
  vanilla: {};
}

/**
 * Describes an iOS binding.
 */
export interface IosBinding<T extends Component> {
  imports: string[];
  sources: string[];
  updateable: boolean;
  dependencies?: IosDependency[];
  initializer? (instance: T): string;
  assetsBinder?: AssetBinder<T>;
}

/**
 * Specifies an iOS component property.
 */
export interface IosComponentProperty {
  type: string;
  initializer: string;
  updateable: boolean;
}

/**
 * Specifies an iOS component.
 */
export interface IosComponentSpec {
  componentName: string;
  properties: {[name: string]: IosComponentProperty};
}

/**
 * Describes the complete output for a transpiled iOS target.
 */
export interface IosOutput {
  program: CompilerProgram;
  processedComponents: Set<string>;
  imports: Set<string>;
  sources: Set<string>;
  dependencies: Set<IosDependency>;
  assetBindings: Map<string, AssetBinding>;
}

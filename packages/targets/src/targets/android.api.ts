import {CompilerProgram} from '@diez/compiler';
import {Component} from '@diez/engine';
import {AssetBinder, AssetBinding} from '../api';

/**
 * Describes an Android third party dependency.
 */
export interface AndroidDependency {
  /**
   * @todo Define the shape of Carthage dependencies.
   */
  gradle: {};
}

/**
 * Describes an Android binding.
 */
export interface AndroidBinding<T extends Component> {
  imports: string[];
  sources: string[];
  adapters?: string[];
  qualifier?: string;
  dependencies?: AndroidDependency[];
  initializer? (instance: T): string;
  assetsBinder?: AssetBinder<T>;
}

/**
 * Specifies an Android component property.
 */
export interface AndroidComponentProperty {
  type: string;
  initializer: string;
  updateable: boolean;
}

/**
 * Specifies an Android component.
 */
export interface AndroidComponentSpec {
  componentName: string;
  properties: {[name: string]: AndroidComponentProperty};
  adapters?: string[];
}

/**
 * Describes the complete output for a transpiled Android target.
 */
export interface AndroidOutput {
  program: CompilerProgram;
  processedComponents: Set<string>;
  imports: Set<string>;
  sources: Set<string>;
  dependencies: Set<AndroidDependency>;
  assetBindings: Map<string, AssetBinding>;
}

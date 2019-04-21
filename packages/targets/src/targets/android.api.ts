import {AssetBinder, TargetComponentSpec, TargetOutput} from '@diez/compiler';
import {Component} from '@diez/engine';

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
export interface AndroidBinding<T extends Component = any> {
  sources: string[];
  adapters?: string[];
  qualifier?: string;
  dependencies?: AndroidDependency[];
  initializer? (instance: T): string;
  assetsBinder?: AssetBinder<T>;
}

/**
 * Specifies an Android component.
 */
export interface AndroidComponentSpec extends TargetComponentSpec {
  adapters?: string[];
}

/**
 * Describes the complete output for a transpiled Android target.
 */
export interface AndroidOutput extends TargetOutput<AndroidDependency, AndroidBinding, AndroidComponentSpec> {}

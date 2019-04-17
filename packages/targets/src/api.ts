import {Component} from '@diez/engine';

/**
 * Provides a generic compile-time asset binding.
 */
export interface AssetBinding {
  contents: string | Buffer;
  copy?: boolean;
}

/**
 * Provides 0 or more bindings from a component instance.
 */
export type AssetBinder<T extends Component> = (
  instance: T,
  projectRoot: string,
  bindings: Map<string, AssetBinding>,
) => Promise<void>;

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

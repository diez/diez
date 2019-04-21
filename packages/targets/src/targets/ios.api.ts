import {AssetBinder, PropertyType, TargetOutput} from '@diez/compiler';
import {Component} from '@diez/engine';

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
export interface IosBinding<T extends Component = any> {
  imports: string[];
  sources: string[];
  skipGeneration?: boolean;
  dependencies?: IosDependency[];
  assetsBinder?: AssetBinder<T>;
}

/**
 * Specifies an iOS component property.
 */
export interface IosComponentProperty {
  type: PropertyType;
  updateable: boolean;
  initializer: string;
}

/**
 * Specifies an iOS component.
 */
export interface IosComponentSpec {
  componentName: PropertyType;
  properties: {[name: string]: IosComponentProperty};
  public: boolean;
}

/**
 * Describes the complete output for a transpiled iOS target.
 */
export interface IosOutput extends TargetOutput<IosDependency, IosBinding> {}

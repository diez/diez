import {PropertyType, TargetBinding, TargetOutput} from '@diez/compiler';
import {Component} from '@diez/engine';

declare module '@diez/compiler/types/api' {
  /**
   * Extends CompilerOptions for iOS.
   */
  export interface CompilerOptions {
    cocoapods?: boolean;
    carthage?: boolean;
  }
}

/**
 * Describes an iOS third party dependency.
 */
export interface IosDependency {
  cocoapods: {
    name: string;
    versionConstraint: string;
  };
  carthage: {
    name: string;
    github: string;
    versionConstraint: string;
  };
}

/**
 * Describes an iOS binding.
 */
export interface IosBinding<T extends Component = Component> extends TargetBinding<T, IosOutput> {
  dependencies?: IosDependency[];
}

/**
 * Specifies an iOS component property.
 */
export interface IosComponentProperty {
  type: PropertyType;
  updatable: boolean;
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
export interface IosOutput extends TargetOutput<IosDependency, IosBinding> {
  bundleIdPrefix: string;

  /**
   * A temporary directory used as an intermediary copy step when writing the SDK.
   */
  temporaryRoot: string;
}

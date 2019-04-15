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
export interface IosBinding {
  imports: string[];
  sources: string[];
  updateable: boolean;
  dependencies?: IosDependency[];
  initializer? (instance: any): string;
}

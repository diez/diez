import {Component} from '@livedesigner/engine';

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
 * Describes an iOS prefab.
 */
export interface IosPrefab {
  imports: string[];
  sources: string[];
  updateable: boolean;
  dependencies?: IosDependency[];
  initializer? (instance: any): string;
}

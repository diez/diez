import {TargetBinding, TargetOutput} from '@diez/compiler-core';
import {Prefab} from '@diez/engine';

declare module '@diez/compiler-core/types/api' {
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
export interface IosBinding<T extends Prefab<{}> = Prefab<{}>> extends TargetBinding<T, IosOutput> {
  dependencies?: IosDependency[];
}

/**
 * Describes the complete output for a transpiled iOS target.
 */
export interface IosOutput extends TargetOutput<IosDependency, IosBinding> {
  bundleIdPrefix: string;
  sources: Set<string>;
  /**
   * The destination for source files in our SDK.
   */
  sourcesRoot: string;
}

/**
 * Valid iOS languages.
 */
export enum IosLanguages {
  Swift = 'Swift',
  ObjectiveC = 'Objective-C',
}

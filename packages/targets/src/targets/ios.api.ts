import {TargetBinding, TargetOutput} from '@diez/compiler';
import {Prefab} from '@diez/engine';

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
   * A temporary directory used as an intermediary copy step when writing the SDK.
   */
  temporaryRoot: string;
}

import {AssetBinder, TargetOutput} from '@diez/compiler';
import {Component} from '@diez/engine';

/**
 * Describes an Android third party dependency.
 */
export interface AndroidDependency {
  gradle: {
    name: string;
    minVersion: string;
    source: string;
  };
}

/**
 * Describes an Android binding.
 */
export interface AndroidBinding<T extends Component = any> {
  sources: string[];
  skipGeneration?: boolean;
  dependencies?: AndroidDependency[];
  assetsBinder?: AssetBinder<T>;
}

/**
 * Describes the complete output for a transpiled Android target.
 */
export interface AndroidOutput extends TargetOutput<AndroidDependency, AndroidBinding> {
  files: Map<string, string>;
}

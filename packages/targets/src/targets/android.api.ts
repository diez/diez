import {AssetBinding, TargetBinding, TargetOutput} from '@diez/compiler';
import {Prefab} from '@diez/engine';

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
export interface AndroidBinding<T extends Prefab<{}> = Prefab<{}>> extends TargetBinding<T, AndroidOutput> {
  dependencies?: AndroidDependency[];
}

/**
 * Describes the complete output for a transpiled Android target.
 */
export interface AndroidOutput extends TargetOutput<AndroidDependency, AndroidBinding> {
  packageName: string;
  resources: Map<string, Map<string, AssetBinding>>;

  /**
   * Where we should place source code files.
   */
  packageRoot: string;
}

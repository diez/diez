import {AssetBinder, TargetOutput} from '@diez/compiler';
import {Component} from '@diez/engine';

/**
 * Describes an Web third party dependency.
 */
export interface WebDependency {
  packageJson: {
    name: string;
    versionConstraint: string;
  };
}

/**
 * Describes an Web binding.
 */
export interface WebBinding<T extends Component = any> {
  sources: string[];
  declarations?: string[];
  skipGeneration?: boolean;
  dependencies?: WebDependency[];
  assetsBinder?: AssetBinder<T, WebOutput>;
}

/**
 * Describes the complete output for a transpiled Web target.
 */
export interface WebOutput extends TargetOutput<WebDependency, WebBinding> {
  declarations: Set<string>;
}

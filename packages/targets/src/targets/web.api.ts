import {TargetBinding, TargetOutput} from '@diez/compiler';
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
export interface WebBinding<T extends Component = Component> extends TargetBinding<T, WebOutput> {
  declarations?: string[];
  dependencies?: WebDependency[];
}

/**
 * Describes the complete output for a transpiled Web target.
 */
export interface WebOutput extends TargetOutput<WebDependency, WebBinding> {
  declarations: Set<string>;
  declarationImports: Set<string>;
}

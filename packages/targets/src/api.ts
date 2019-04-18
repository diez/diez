import {Component} from '@diez/engine';

/**
 * Provides a generic compile-time asset binding.
 */
export interface AssetBinding {
  contents: string | Buffer;
  copy?: boolean;
}

/**
 * Provides 0 or more bindings from a component instance.
 */
export type AssetBinder<T extends Component> = (
  instance: T,
  projectRoot: string,
  bindings: Map<string, AssetBinding>,
) => Promise<void>;

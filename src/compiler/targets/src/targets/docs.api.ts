import {AssetBinder, AssetBindings, DiezType, TargetOutput} from '@diez/compiler-core';
import {Prefab} from '@diez/engine';

/**
 * Describes a serialized collection of properties.
 */
export type DocsPropertySpec<T> = {
  [K in keyof T]: DocsTargetSpec<T[K]>;
};

/**
 * Describes a snippet of code after being parsed by the compiler.
 */
export interface ParsedSnippet {
  lang: string;
  snippet: string;
}

/**
 * Describes an usage example after being parsed by the compiler.
 */
export interface ParsedExample {
  example: string;
  snippets: ParsedSnippet[];
}

/**
 * Describes a serialized collection of properties.
 */
export interface ParsedExampleTree {
  [key: string]: ParsedExampleTree | ParsedExample[];
}

/**
 * Describes a serialized component tree.
 */
export interface DocsTargetSpec<T = {[key: string]: any}> {
  id: string;
  name: string;
  type: DiezType;
  binding?: DocsBinding;
  properties: DocsPropertySpec<T>;
  isPrimitive: boolean;
  value: T;
  comments?: {
    type?: string;
    instance?: string;
  };
  examples?: ParsedExampleTree;
}

/**
 * Describes a Docs binding.
 */
export interface DocsBinding<T extends Prefab<{}> = Prefab<{}>> {
  templates: DocsTemplateDeclaration;
  assetsBinder?: AssetBinder<T, DocsOutput>;
}

type DocsTemplateDeclaration = {
  [key in TemplateTypes]?: string;
};

/**
 * Describes all the template types that a binding may provide.
 *
 * note: this is intentionally a `type` and not an `enum` so we can do a type import
 * in the consuming Vue app, preventing problems with webpack.
 */
export type TemplateTypes = 'item' | 'detail' | 'icon';

export interface DocsOutput extends Pick<TargetOutput, 'projectName' | 'sdkRoot'> {
  assetBindings: AssetBindings;
}

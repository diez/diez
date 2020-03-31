import {Component as VueComponent} from 'vue';
type DocsTargetSpec = import('@diez/targets').DocsTargetSpec;

/**
 * A Grid item.
 */
export interface GridItem {
  template: VueComponent;
  component: DocsTargetSpec;
}

/**
 * A collection of [GridItem]s.
 */
export interface GridCollection {
  component: DocsTargetSpec;
  values: GridItem[];
  collections: GridCollection[];
}

/**
 * Collection of values describing an item.
 */
export interface ItemDetails { [key: string]: string; }

/**
 * Describes a [[DocsTargetSpec]] with a Vue template attached.
 */
type TemplatedSpec = DocsTargetSpec & {template?: () => Promise<any>};

/**
 * [[TemplatedSpec]] elements mapped by component type.
 */
export interface ComponentTypesMap {
  [key: string]: TemplatedSpec[];
}

/**
 * Describes a reference.
 */
export interface DocsReference {
  idPath: string[];
  link: string;
}

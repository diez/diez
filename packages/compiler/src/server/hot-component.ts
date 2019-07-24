declare global {
  interface Window {
    componentName: string;
    component: object;
    __resourceQuery: string;
  }
}

// Shim in a resource query indicating a shorter timeout before reconnecting.
window.__resourceQuery = '?timeout=1000';

import {Patcher, serialize} from '@diez/engine';
import {subscribe} from 'webpack-hot-middleware/client';

// Mirrored in ../api.ts, but required at runtime in the web.
type Constructor = new () => object;

// Mirrored in ../utils.ts, but required at runtime in the web.
const isConstructible = (maybeConstructible: any): maybeConstructible is Constructor =>
  maybeConstructible.prototype !== undefined && maybeConstructible.prototype.constructor instanceof Function;

subscribe((message) => {
  if (message.reload) {
    window.location.reload(true);
  }
});

const getComponentDefinition = async (): Promise<object | Constructor> => {
  const componentFile = await import(`${'@'}`) as any;
  return componentFile[window.componentName];
};

const loadComponent = async () => {
  const maybeConstructor = await getComponentDefinition();
  return window.component = (isConstructible(maybeConstructor) ? new maybeConstructor() : maybeConstructor);
};

/**
 * Activates a hot component with the provided patcher.
 */
export const activate = async (patcher: Patcher) => {
  const component = await loadComponent();
  patcher(serialize(component));
};

declare global {
  interface Window {
    componentName: string;
    component: ConcreteComponent;
    __resourceQuery: string;
  }
}

// Shim in a resource query indicating a shorter timeout before reconnecting.
window.__resourceQuery = '?timeout=1000';

import {ConcreteComponent, ConcreteComponentType, Patcher} from '@diez/engine';
import {subscribe} from 'webpack-hot-middleware/client';
subscribe((message) => {
  if (message.reload) {
    window.location.reload(true);
  }
});

const getComponentDefinition = async (): Promise<ConcreteComponentType> => {
  const componentFile = await import(`${'@'}`) as any;
  return componentFile[window.componentName];
};

const loadComponent = async () => {
  const constructor = await getComponentDefinition();
  return window.component = new constructor();
};

/**
 * Activates a hot component with the provided patcher.
 */
export const activate = async (patcher: Patcher) => {
  const component = await loadComponent();
  component.dirty();
  component.tick(Date.now(), patcher);
};

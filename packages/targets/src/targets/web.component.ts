import {ConcreteComponentType} from '@diez/engine';

interface WebWindow extends Window {
  componentName: string;
}

const adaptedWindow = window as WebWindow;

const getComponentDefinition = async (): Promise<ConcreteComponentType> => {
  const componentFile = await import(`${'@'}`) as any;
  return componentFile[adaptedWindow.componentName];
};

if (module.hot) {
  module.hot.accept();
}

(async () => {
  const constructor = await getComponentDefinition();
  const component = new constructor();
  component.dirty();
  component.tick(
    Date.now(),
    (payload) => adaptedWindow.parent.postMessage(JSON.stringify(payload), '*'),
  );
})();

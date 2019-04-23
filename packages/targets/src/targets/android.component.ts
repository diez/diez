import {ConcreteComponentType, Patcher} from '@diez/engine';

interface AndroidWindow extends Window {
  puente: {
    patch: Patcher;
  };
  componentName: string;
}

const adaptedWindow = window as AndroidWindow;

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
    (payload) => adaptedWindow.puente.patch(JSON.stringify(payload)),
  );
})();

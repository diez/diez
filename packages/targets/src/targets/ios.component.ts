import {ConcreteComponentType, Patcher} from '@diez/engine';

interface IOSWindow extends Window {
  webkit: {
    messageHandlers: {
      patch: {
        postMessage: Patcher;
      },
    },
  };
  componentName: string;
}

const adaptedWindow = window as IOSWindow;

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
    (payload) => adaptedWindow.webkit.messageHandlers.patch.postMessage(JSON.stringify(payload)),
  );
})();

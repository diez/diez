import {ConcreteComponent, ConcreteComponentType, Patcher} from '@diez/engine';

interface IOSWindow extends Window {
  webkit: {
    messageHandlers: {
      patch: {
        postMessage: Patcher;
      },
    },
  };
  tick (time: number): void;
  trigger (name: string, payload?: any): void;
  componentName: string;
  component: ConcreteComponent;
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
  adaptedWindow.component = new constructor();
  adaptedWindow.component.dirty();
})();

const patcher: Patcher = (payload: any) =>
  adaptedWindow.webkit.messageHandlers.patch.postMessage(JSON.stringify(payload));

adaptedWindow.tick = (time) => adaptedWindow.component && adaptedWindow.component.tick(time, patcher);

adaptedWindow.trigger = (name, payload) => adaptedWindow.component && adaptedWindow.component.trigger(name, payload);

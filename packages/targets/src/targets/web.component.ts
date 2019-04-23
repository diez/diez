import {ConcreteComponent, ConcreteComponentType, Patcher} from '@diez/engine';

interface WebWindow extends Window {
  tick (time: number): void;
  trigger (name: string, payload?: any): void;
  componentName: string;
  component: ConcreteComponent;
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
  adaptedWindow.component = new constructor();
  adaptedWindow.component.dirty();
})();

// TODO: specify an exact target origin?
const patcher: Patcher = (payload: any) => {
  return adaptedWindow.parent.postMessage(JSON.stringify(payload), '*');
};

adaptedWindow.tick = (time) => adaptedWindow.component && adaptedWindow.component.tick(time, patcher);

adaptedWindow.trigger = (name, payload) => adaptedWindow.component && adaptedWindow.component.trigger(name, payload);

adaptedWindow.addEventListener('message', (message) => {
  if (message.data) {
    adaptedWindow.tick(message.data);
  }
});

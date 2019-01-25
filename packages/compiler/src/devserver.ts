/* tslint:disable:no-var-requires */
let {component} = require('../playground/MyStateBag.ts');

interface AdaptedWindow extends Window {
  tick (time: number): void;
  trigger (name: string, payload?: any): void;
  component: typeof component;
}

const adaptedWindow = window as AdaptedWindow;

if (module.hot) {
  module.hot.accept(['../playground/MyStateBag.ts'], () => {
    component = require('../playground/MyStateBag.ts').component;
    adaptedWindow.component = component;
    component.doPatch = true;
  });
}

adaptedWindow.tick = (time) => component.tick(time);
adaptedWindow.trigger = (name, payload) => component.trigger(name, payload);
adaptedWindow.component = component;

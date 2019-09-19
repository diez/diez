import {Patcher} from '@diez/engine';

declare global {
  interface Window {
    puente: {
      patch: Patcher;
    };
  }
}

if (module.hot) {
  module.hot.accept();
}

// tslint:disable-next-line: no-var-requires
require('@diez/compiler-core/lib/server/hot-component').activate(
  (payload: any) => window.puente.patch(JSON.stringify(payload)));

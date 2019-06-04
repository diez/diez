import {Patcher} from '@diez/engine';

declare global {
  interface Window {
    webkit: {
      messageHandlers: {
        patch: {
          postMessage: Patcher;
        },
      },
    };
  }
}

if (module.hot) {
  module.hot.accept();
}

// tslint:disable-next-line: no-var-requires
require('@diez/compiler/lib/server/hot-component').activate(
  (payload: any) => window.webkit.messageHandlers.patch.postMessage(JSON.stringify(payload)));

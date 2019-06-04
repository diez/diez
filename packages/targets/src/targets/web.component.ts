if (module.hot) {
  module.hot.accept();
}

// tslint:disable-next-line: no-var-requires
require('@diez/compiler/lib/server/hot-component').activate(
  (payload: any) => window.parent.postMessage(JSON.stringify(payload), '*'));

if (module.hot) {
  module.hot.accept();
}

// tslint:disable-next-line: no-var-requires
require('@diez/compiler-core/lib/server/hot-component').activate(
  (payload: any) => window.parent.postMessage(JSON.stringify(payload), '*'));

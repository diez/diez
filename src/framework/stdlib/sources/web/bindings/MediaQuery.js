const {queriesToCss} = require('@diez/web-sdk-common');

Object.defineProperties(MediaQuery.prototype, {
  query: {
    get () {
      return queriesToCss(this);
    },
  },
});

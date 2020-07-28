const {queryToCss} = require('@diez/web-sdk-common');

Object.defineProperties(MediaQuery.prototype, {
  mediaQuery: {
    get () {
      return queryToCss(this);
    },
  },
});

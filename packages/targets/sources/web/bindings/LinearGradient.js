const {linearGradientToCss} = require('@diez/web-sdk-common');

Object.defineProperties(LinearGradient.prototype, {
  linearGradient: {
    get () {
      return linearGradientToCss(this);
    },
  },
  backgroundImageStyle: {
    get () {
      return {
        backgroundImage: this.linearGradient,
      };
    },
  },
  backgroundStyle: {
    get () {
      return {
        background: this.linearGradient,
      };
    },
  },
});

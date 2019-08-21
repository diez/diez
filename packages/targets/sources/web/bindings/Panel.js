const {fillToBackgroundCss} = require('@diez/web-sdk-common');

Object.defineProperties(Panel.prototype, {
  style: {
    get () {
      return {
        background: fillToBackgroundCss(this.background),
        boxShadow: this.dropShadow.boxShadow,
        borderRadius: `${this.cornerRadius}px`,
      };
    },
  },
});

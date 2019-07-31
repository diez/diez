const {dropShadowToCss, dropShadowToFilterCss} = require('@diez/web-sdk-common');

Object.defineProperties(DropShadow.prototype, {
  boxShadow: {
    get () {
      return dropShadowToCss(this);
    },
  },
  textShadow: {
    get () {
      return dropShadowToCss(this);
    },
  },
  filter: {
    get () {
      return dropShadowToFilterCss(this);
    },
  },
  boxShadowStyle: {
    get () {
      return {
        boxShadow: this.boxShadow,
      };
    },
  },
  textShadowStyle: {
    get () {
      return {
        textShadow: this.textShadow,
      };
    },
  },
  filterStyle: {
    get () {
      return {
        filter: this.filter,
      };
    },
  },
});

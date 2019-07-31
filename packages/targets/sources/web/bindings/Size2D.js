Object.defineProperties(Size2D.prototype, {
  widthCss: {
    get () {
      return `${this.width}px`;
    },
  },
  heightCss: {
    get () {
      return `${this.height}px`;
    },
  },
  style: {
    get () {
      return {
        width: this.widthCss,
        height: this.heightCss,
      };
    },
  },
  backgroundSizeCss: {
    get () {
      return `${this.widthCss} ${this.heightCss}`;
    },
  },
  backgroundSizeStyle: {
    get () {
      return {
        backgroundSize: this.backgroundSizeCss,
      };
    },
  },
});

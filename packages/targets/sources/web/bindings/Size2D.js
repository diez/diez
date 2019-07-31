Object.defineProperties(Size2D.prototype, {
  style: {
    get () {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`,
      };
    },
  },
  backgroundSizeStyle: {
    get () {
      return {
        backgroundSize: `${this.style.width} ${this.style.height}`,
      };
    },
  },
});

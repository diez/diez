Object.defineProperties(Color.prototype, {
  color: {
    get () {
      return `hsla(${this.h * 360}, ${this.s * 100}%, ${this.l * 100}%, ${this.a})`;
    },
  },
  colorStyle: {
    get () {
      return {
        color: this.color,
      };
    },
  },
  backgroundColorStyle: {
    get () {
      return {
        backgroundColor: this.color,
      };
    },
  },
  borderColorStyle: {
    get () {
      return {
        borderColor: this.color,
      };
    },
  },
  outlineColorStyle: {
    get () {
      return {
        outlineColor: this.color,
      };
    },
  },
});

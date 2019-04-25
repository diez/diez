Object.defineProperties(TextStyle.prototype, {
  css: {
    get () {
      return {
        fontFamily: this.fontName,
        fontSize: `${this.fontSize}px`,
        color: this.color.toString(),
      };
    },
  },
});

TextStyle.prototype.applyStyle = function (ref) {
  const css = this.css;
  ref.style.fontFamily = css.fontFamily;
  ref.style.fontSize = css.fontSize;
  ref.style.color = css.color;
};

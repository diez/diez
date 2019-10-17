const {fontToCss, FontFormats, textAlignmentToCss, textDecorationsToCss} = require('@diez/web-sdk-common');

let styleSheet;
let cache;

const registerFont = (font) => {
  if (!styleSheet || !cache) {
    const styleEl = document.createElement('style');
    document.head.appendChild(styleEl);
    styleSheet = styleEl.sheet;
    cache = new Set();
  }

  if (cache.has(font.file.src)) {
    return;
  }

  const format = font.file.src.split('.').pop();
  const rule = `
@font-face {
  font-family: '${font.name}';
  font-weight: ${font.weight};
  font-style: ${font.style};
  src: local('${font.name}'), url(${font.file.url}) format('${FontFormats[format] || format}');
}`;
  styleSheet.insertRule(rule);
  cache.add(font.file.src);
};

Object.defineProperties(Typograph.prototype, {
  fontFamily: {
    get () {
      registerFont(this.font);
      return fontToCss(this.font);
    },
  },
  style: {
    get () {
      const style = {
        fontFamily: this.fontFamily,
        fontWeight: this.font.fontWeight,
        fontStyle: this.font.fontStyle,
        fontSize: `${this.fontSize}px`,
        color: this.color.color,
        letterSpacing: `${this.letterSpacing}px`,
        textAlign: textAlignmentToCss(this.alignment),
        textDecoration: textDecorationsToCss(this.decoration),
      };
      if (this.lineHeight !== -1) {
        style.lineHeight = `${this.lineHeight}px`;
      }
      return style;
    },
  },
});

Typograph.prototype.applyStyle = function (ref) {
  const style = this.style;
  ref.style.fontFamily = style.fontFamily;
  ref.style.fontWeight = style.fontWeight;
  ref.style.fontStyle = style.fontStyle;
  ref.style.fontSize = style.fontSize;
  ref.style.color = style.color;
  ref.style.lineHeight = style.lineHeight;
  ref.style.letterSpacing = style.letterSpacing;
  ref.style.textAlign = style.textAlign;
};

diezHTMLExtensions.push(() => {
  HTMLElement.prototype.applyTypograph = (typograph) => {
    typograph.applyStyle(this);
  };
});

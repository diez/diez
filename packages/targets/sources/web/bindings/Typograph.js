const FontFormats = {
  eot: 'embedded-opentype',
  woff: 'woff',
  woff2: 'woff2',
  otf: 'opentype',
  ttf: 'truetype',
  svg: 'svg',
};

const keywords = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'math', 'emoji', 'fangsong'];

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
      const fontFamilies = [];

      if (this.font.name) {
        fontFamilies.push(this.font.name);
      }

      fontFamilies.push(...this.font.fallbacks);

      // Generic family names are keywords and must not be quoted.
      const sanitizedFonts = fontFamilies.map((font) =>
        keywords.includes(font) ? font : `"${font}"`,
      );

      return sanitizedFonts.join();
    },
  },
  style: {
    get () {
      return {
        fontFamily: this.fontFamily,
        fontWeight: this.font.fontWeight,
        fontStyle: this.font.fontStyle,
        fontSize: `${this.fontSize}px`,
        color: this.color.color,
      };
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
};

diezHTMLExtensions.push(() => {
  HTMLElement.prototype.applyTypograph = (typograph) => {
    typograph.applyStyle(this);
  };
});

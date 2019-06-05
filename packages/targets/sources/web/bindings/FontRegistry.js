const FontFormats = {
  eot: 'embedded-opentype',
  woff: 'woff',
  woff2: 'woff2',
  ttf: 'truetype',
  svg: 'svg',
};

FontRegistry.prototype.registerFonts = function () {
  if (!this.styleSheet || !this.cache) {
    const styleEl = document.createElement('style');
    document.head.appendChild(styleEl);
    this.styleSheet = styleEl.sheet; // @internal
    this.cache = new Set(); // @internal
  }

  for (const file of this.files) {
    if (this.cache.has(file.src)) {
      continue;
    }

    const parsedFile = file.src.split('/').pop();
    if (parsedFile) {
      const [name, format] = parsedFile.split('.');
      const rule = `
        @font-face {
          font-family: '${name}';
          src: local('${name}'), url(${file.url}) format('${FontFormats[format] || format}');
        }`;

      this.styleSheet.insertRule(rule);
    }
    this.cache.add(file.src);
  }
};

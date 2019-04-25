Object.defineProperties(SVG.prototype, {
  file: {
    get () {
      return new File({src: this.src});
    },
  },
  url: {
    get () {
      return this.file.url;
    },
  },
});

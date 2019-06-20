Object.defineProperties(Image.prototype, {
  url: {
    get () {
      switch (Math.ceil(window.devicePixelRatio)) {
        case 1:
          return this.file.url;
        case 2:
          return this.file2x.url;
        case 3:
          return this.file3x.url;
        default:
          return this.file2x.url;
      }
    },
  },
  urlCss: {
    get () {
      return `url("${this.url}")`;
    },
  },
  backgroundImageStyle: {
    get () {
      return {
        backgroundImage: this.urlCss,
      };
    },
  },
});

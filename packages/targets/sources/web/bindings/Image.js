Object.defineProperties(Image.prototype, {
  url: {
    get () {
      switch (Math.ceil(window.devicePixelRatio)) {
        case 1:
          return this.file1x.url;
        case 2:
          return this.file2x.url;
        case 3:
          return this.file3x.url;
        default:
          return this.file2x.url;
      }
    },
  },
});

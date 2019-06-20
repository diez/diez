Object.defineProperties(File.prototype, {
  url: {
    get () {
      return `${Environment.serverUrl}/${this.src}`;
    },
  },
  urlCss: {
    get () {
      return `url("${this.url}")`;
    },
  },
});

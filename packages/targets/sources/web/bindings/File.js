class File {
  constructor({src}) {
    this.src = src;
  }

  update (payload) {
    if (!payload) {
      return;
    }

    this.src = payload.src;
  }
}

Object.defineProperties(File.prototype, {
  url: {
    get () {
      if (Environment.isDevelopment) {
        return `${Environment.serverUrl}${this.src}`;
      }

      // TODO: figure out how this should actually work.
      return this.src;
    },
  },
});

module.exports.File = File;

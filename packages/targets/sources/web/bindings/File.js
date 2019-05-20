class File {
  constructor ({src}) {
    this.src = src;
  }

  update (payload) {
    if (!payload) {
      return this;
    }

    this.src = payload.src;

    return this;
  }
}

Object.defineProperties(File.prototype, {
  url: {
    get () {
      return `${Environment.serverUrl}/${this.src}`;
    },
  },
});

module.exports.File = File;

Object.defineProperty(File.prototype, 'url', {
  get () {
    if (Environment.isDevelopment) {
      return `${Environment.serverUrl}${this.src}`;
    }

    // TODO: figure out how this should actually work.
    return this.src;
  },
});

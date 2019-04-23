// This can be entirely generated in real life.
export class SVG {
  constructor ({src} = {src: ''}) {
    this.src = src;
  }

  update (payload) {
    if (!payload) {
      return;
    }

    if (payload.src !== undefined) {
      this.src = payload.src;
    }
  }
}

Object.defineProperty(SVG.prototype, 'file', {
  get () {
    return new File({src: this.src});
  },
});

Object.defineProperty(SVG.prototype, 'url', {
  get () {
    return this.file.url;
  },
});

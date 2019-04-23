export class Image {
  constructor ({file, width, height} = {file: {}, width: 0, height: 0}) {
    this.file = file;
    this.width = width;
    this.height = height;
  }

  update (payload) {
    if (!payload) {
      return;
    }

    this.file.update(payload.file);
  }
}

Object.defineProperty(Image.prototype, 'url', {
  get () {
    return this.file.url;
  },
});

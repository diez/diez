import {Environment} from '../../Environment';

export class File {
  constructor ({src} = {src: ''}) {
    this.src = src;
  }

  update (payload) {
    if (!payload) {
      return;
    }

    if (payload.src !== undefined) {
      this.src = src;
    }
  }
}

Object.defineProperty(File.prototype, 'url', {
  get () {
    if (Environment.isDevelopment) {
      return `${Environment.serverUrl}${this.src}`;
    }

    // TODO: figure out how this should actually work.
    return this.src;
  },
});

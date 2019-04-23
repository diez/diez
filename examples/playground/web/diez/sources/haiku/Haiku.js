import {File} from '../file/File';

export class Haiku {
  constructor ({component} = {component: ''}) {
    this.component = component;
  }

  update (payload) {
    if (!payload) {
      return;
    }

    if (payload.component !== undefined) {
      this.component = payload.component;
    }
  }
}

Object.defineProperty(Haiku.prototype, 'file', {
  get () {
    return new File({src: `haiku/${this.component}.html`});
  },
});

Object.defineProperty(Haiku.prototype, 'url', {
  get () {
    return this.file.url;
  },
});

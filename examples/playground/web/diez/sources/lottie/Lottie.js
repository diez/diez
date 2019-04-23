import {File} from '../file/File';

export class Lottie {
  constructor ({file} = {file: {}}) {
    this.file = new File(file);
  }

  update (payload) {
    if (!payload) {
      return;
    }

    this.file.update(payload.file);
  }
}

// TODO: extend.

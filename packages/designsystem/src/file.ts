import {Component, property} from '@livedesigner/engine';
import {basename, dirname, extname} from 'path';

export interface FileState {
  src: string;
}

/**
 * Encodes a file source for serialization and other purposes.
 */
export const encodeFileSource = (src: string) => src.split('/').map(encodeURIComponent).join('/');

/**
 * TODO.
 *
 * @noinheritdoc
 */
export class File extends Component<FileState> {
  @property src: string = '';

  get basename () {
    return basename(this.src);
  }

  get extension () {
    return extname(this.src).slice(1);
  }

  get directory () {
    return dirname(this.src);
  }

  serialize () {
    return {
      src: encodeFileSource(this.src),
    };
  }
}

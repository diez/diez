import {Component, property} from '@diez/engine';

/**
 * File state.
 * @ignore
 */
export interface FileState {
  src: string;
}

/**
 * Provides a container for referencing local assets, which can be bridged by target compilers to embed images, SVGs,
 * and more. This component is used internally by [[Image]], [[FontRegistry]], and [[SVG]].
 *
 * Usage: `@property file = new File({src: 'assets/images/file.jpg'});`.
 *
 * @noinheritdoc
 */
export class File extends Component<FileState> {
  @property src: string = '';

  /**
   * @ignore
   */
  serialize () {
    return {
      src: encodeURI(this.src),
    };
  }
}

import {Component, property} from '@diez/engine';

/**
 * The type of a file resource.
 */
export enum FileType {
  Raw = 'raw',
  Image = 'image',
  Font = 'font',
}

/**
 * File state.
 * @ignore
 */
export interface FileState {
  src: string;
  type: FileType;
}

/**
 * Provides a container for referencing local assets, which can be bridged by target compilers to embed images, SVGs,
 * and more. This component is used internally by [[Image]] and [[FontRegistry]].
 *
 * Usage: `@property file = new File({src: 'assets/images/file.jpg'});`.
 *
 * @noinheritdoc
 */
export class File extends Component<FileState> {
  @property src = '';

  @property type = FileType.Raw;

  /**
   * @ignore
   */
  serialize () {
    return {
      src: encodeURI(this.src),
      type: this.type,
    };
  }
}

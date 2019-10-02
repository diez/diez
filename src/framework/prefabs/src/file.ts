import {prefab} from '@diez/engine';

/**
 * The type of a file resource.
 */
export const enum FileType {
  Raw = 'raw',
  Image = 'image',
  Font = 'font',
}

/**
 * File data.
 */
export interface FileData {
  src: string;
  type: FileType;
}

/**
 * Provides a container for referencing local assets, which can be bridged by compilers to embed images, SVGs,
 * and more. This component is used internally by [[Image]] and [[Font]].
 *
 * The compiler may enforce certain restrictions on the `type` of a `File` instance.
 *
 * Usage: `file = new File({src: 'assets/images/file.jpg', type: FileType.Image});`.
 *
 * @noinheritdoc
 */
export class File extends prefab<FileData>() {
  defaults = {
    src: '',
    type: FileType.Raw,
  };

  protected sanitize (data: FileData) {
    return {
      src: encodeURI(data.src),
      type: data.type,
    };
  }
}

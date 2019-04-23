import {Component, Integer, property} from '@diez/engine';
import {encodeFileSource, File} from './file';

export interface ImageState {
  file1x: File;
  file2x: File;
  file3x: File;
  width: number;
  height: number;
}

/**
 * TODO.
 *
 * @noinheritdoc
 */
export class Image extends Component<ImageState> {
  static responsive (basename: string, extension: string, width: number = 0, height: number = 0) {
    return new Image({
      width,
      height,
      file1x: new File({src: `${basename}.${extension}`}),
      file2x: new File({src: `${basename}@2x.${extension}`}),
      file3x: new File({src: `${basename}@3x.${extension}`}),
    });
  }

  @property file1x = new File();

  @property file2x = new File();

  @property file3x = new File();

  @property width: Integer = 0;

  @property height: Integer = 0;

  serialize () {
    return {
      file1x: this.file1x.serialize(),
      file2x: this.file2x.serialize(),
      file3x: this.file3x.serialize(),
      width: Math.round(this.width),
      height: Math.round(this.height),
    };
  }
}

export interface SVGState {
  src: string;
}

/**
 * TODO.
 *
 * @noinheritdoc
 */
export class SVG extends Component<SVGState> {
  @property src = '';

  serialize () {
    return {
      src: encodeFileSource(this.src),
    };
  }
}

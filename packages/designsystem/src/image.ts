import {Component, property} from '@diez/engine';
import {encodeFileSource, File} from './file';

export interface ImageState {
  file: File;
  width: number;
  height: number;
  scale: number;
}

/**
 * TODO.
 *
 * @noinheritdoc
 */
export class Image extends Component<ImageState> {
  static scaled (src: string, scale: number, width = 0, height = 0) {
    return new Image({
      scale,
      width,
      height,
      file: new File({src}),
    });
  }

  @property file = new File();

  @property width = 0;

  @property height = 0;

  @property scale = 1;
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

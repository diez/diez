import {Component, property} from '@diez/engine';
import {File} from './file';

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

  @property file: File = new File();

  @property width: number = 0;

  @property height: number = 0;

  @property scale: number = 1;
}

export interface SVGState {
  file: File;
}

/**
 * TODO.
 *
 * @noinheritdoc
 */
export class SVG extends Component<SVGState> {
  @property file: File = new File();
}

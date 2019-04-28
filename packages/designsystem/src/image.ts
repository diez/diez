import {Component, Integer, property} from '@diez/engine';
import {File} from './file';

/**
 * Responsive image state.
 * @ignore
 */
export interface ImageState {
  file1x: File;
  file2x: File;
  file3x: File;
  width: number;
  height: number;
}

/**
 * Provides an abstraction for raster images. With bindings, this component can embed images in multiple platforms in
 * accordance with best practices. Images should provide pixel ratios for standard, retina@2x, and retina@3x devices.
 *
 * @noinheritdoc
 */
export class Image extends Component<ImageState> {
  /**
   * Yields a responsive image according to the convention that files should be located in the same directory using the
   * same filename prefix. For example:
   *
   * ```
   * assets/
   * ├── filename.png
   * ├── filename@2x.png
   * └── filename@3x.png
   * ```
   *
   * can be specified with:
   *
   * `@property image = Image.responsive('assets/filename', 'png');`
   */
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

  /**
   * @ignore
   */
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

/**
 * SVG state.
 * @ignore
 */
export interface SVGState {
  src: string;
}

/**
 * Provides an abstraction for SVG vector images. With bindings, this component can embed SVGs in multiple platforms.
 *
 * @noinheritdoc
 */
export class SVG extends Component<SVGState> {
  @property src = '';

  serialize () {
    return {
      src: encodeURI(this.src),
    };
  }
}

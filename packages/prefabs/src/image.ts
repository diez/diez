import {Component, Integer, property, Target} from '@diez/engine';
import {File, FileType} from './file';

/**
 * Responsive image state.
 * @ignore
 */
export interface ImageState {
  file: File;
  file2x: File;
  file3x: File;
  file4x: File;
  width: number;
  height: number;
}

/**
 * Provides an abstraction for raster images. With bindings, this component can embed images in multiple platforms in
 * accordance with best practices. Images should provide pixel ratios for standard, @2x, @3x, and @4x with conventional
 * file naming. The availability of retina resolutions is expected to be a compile-time concern, and the "src" of the
 * image is expected to exist and provide an image with the specified dimensions.
 *
 * @noinheritdoc
 */
export class Image extends Component<ImageState> {
  /**
   * Yields a raster image according to the convention that files should be located in the same directory using the
   * same filename prefix. For example:
   *
   * ```
   * assets/
   * ├── filename.png
   * ├── filename@2x.png
   * └── filename@3x.png
   * └── filename@4x.png
   * ```
   *
   * can be specified with:
   *
   * `@property image = Image.responsive('assets/filename.png', 640, 480);`
   */
  static responsive (src: string, width: number = 0, height: number = 0) {
    const pathComponents = src.split('/');
    const filename = pathComponents.pop() || '';
    const extensionLocation = filename.lastIndexOf('.');
    const dir = pathComponents.join('/');
    const name = filename.slice(0, extensionLocation);
    const ext = filename.slice(extensionLocation);
    return new Image({
      width,
      height,
      file: new File({src, type: FileType.Image}),
      file2x: new File({src: `${dir}/${name}@2x${ext}`, type: FileType.Image}),
      file3x: new File({src: `${dir}/${name}@3x${ext}`, type: FileType.Image}),
      file4x: new File({src: `${dir}/${name}@4x${ext}`, type: FileType.Image}),
    });
  }

  @property file = new File({type: FileType.Image});

  @property file2x = new File({type: FileType.Image});

  @property file3x = new File({type: FileType.Image});

  @property({targets: [Target.Android]}) file4x = new File({type: FileType.Image});

  @property width: Integer = 0;

  @property height: Integer = 0;

  /**
   * @ignore
   */
  serialize () {
    return {
      ...super.serialize(),
      width: Math.round(this.width),
      height: Math.round(this.height),
    };
  }
}

import {prefab, Target} from '@diez/engine';
import {File, FileType} from './file';
import {Size2D} from './size2d';

/**
 * Responsive image data.
 */
export interface ImageData {
  file: File;
  file2x: File;
  file3x: File;
  file4x: File;
  fileSvg?: File;
  size: Size2D;
}

enum SupportedImageExtensions {
  Png = 'png',
  Svg = 'svg',
}

const getImageFileData = (src: string) => {
  const pathComponents = src.split('/');
  const filename = pathComponents.pop() || '';
  const extensionLocation = filename.lastIndexOf('.');
  const dir = pathComponents.join('/');
  const name = filename.slice(0, extensionLocation);
  const extension = filename.slice(extensionLocation + 1);

  return {
    dir,
    name,
    extension,
  };
};

/**
 * Provides an abstraction for raster images. With bindings, this component can embed images in multiple platforms in
 * accordance with best practices. Images should provide pixel ratios for standard, @2x, @3x, and @4x with conventional
 * file naming. The availability of retina resolutions is expected to be a compile-time concern, and the "src" of the
 * image is expected to exist and provide an image with the specified dimensions.
 *
 * @noinheritdoc
 */
export class Image extends prefab<ImageData>() {
  /**
   * Yields a raster image according to the convention that files should be located in the same directory using the
   * same filename prefix. For example:
   *
   * ```
   * assets/
   * ├── filename.png
   * ├── filename@2x.png
   * ├── filename@3x.png
   * ├── filename@4x.png
   * └── filename.svg
   * ```
   *
   * can be specified with:
   *
   * `image = Image.responsive('assets/filename.png', 640, 480);`
   */
  static responsive (src: string, width: number = 0, height: number = 0) {
    const {dir, name, extension} = getImageFileData(src);

    const data: Partial<ImageData> = {
      file: new File({src, type: FileType.Image}),
      size: Size2D.make(width, height),
      file2x: new File({src: `${dir}/${name}@2x.${SupportedImageExtensions.Png}`, type: FileType.Image}),
      file3x: new File({src: `${dir}/${name}@3x.${SupportedImageExtensions.Png}`, type: FileType.Image}),
      file4x: new File({src: `${dir}/${name}@4x.${SupportedImageExtensions.Png}`, type: FileType.Image}),
    };

    if (extension === SupportedImageExtensions.Svg) {
      data.fileSvg = new File({src: `${dir}/${name}.${SupportedImageExtensions.Svg}`, type: FileType.Image});
    }

    return new Image(data);
  }

  defaults = {
    file: new File({type: FileType.Image}),
    file2x: new File({type: FileType.Image}),
    file3x: new File({type: FileType.Image}),
    file4x: new File({type: FileType.Image}),
    size: Size2D.make(0, 0),
  };

  options = {
    file4x: {
      targets: [Target.Android],
    },
    fileSvg: {
      targets: [Target.Web],
    },
  };

  toPresentableValue () {
    return `${this.file.src} ${this.size.toPresentableValue()}`;
  }
}

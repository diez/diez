export declare class Image {
  /**
   * The URL of the `Image`
   */
  url: string;
  /**
   * The CSS URL of the `Image`.
   * @example
   * url("/path/to/image.jpg")
   */
  urlCss: string;
  /**
   * CSS declarations for the `background-image` CSS property.
   */
  backgroundImageStyle: {backgroundImage: string};
}

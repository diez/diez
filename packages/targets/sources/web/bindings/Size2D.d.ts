export declare class Size2D {
  /**
   * The width of the size.
   */
  width: number;
  /**
   * The height of the size.
   */
  height: number;
  /**
   * The CSS `width` value.
   * @example
   * 400px
   */
  widthCss: string;
  /**
   * The CSS `height` value.
   * @example
   * 300px
   */
  heightCss: string;
  /**
   * CSS declarations for the `width` and `height` CSS properties.
   */
  style: {width: string, height: string};
  /**
   * The CSS `background-size` value.
   * @example
   * 400px 300px
   */
  backgroundSizeCss: string;
  /**
   * CSS declarations for the `background-size` CSS property.
   */
  backgroundSizeStyle: {backgroundSize: string};
}

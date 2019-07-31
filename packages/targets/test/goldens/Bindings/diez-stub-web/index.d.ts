export declare class File {
  /**
   * The URL of the `File`
   */
  url: string;
  /**
   * The CSS URL of the `File`.
   * @example
   * url("/path/to/file")
   */
  urlCss: string;
}

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

export declare class Lottie {
  /**
   * Mounts a `Lottie` animation on the given element.
   */
  mount(ref: any): void;
}

declare global {
  interface HTMLElement {
    /**
     * Mounts a Lottie animation on the element.
     *
     * You *must* have called `Diez.applyHTMLExtensions()` at least once to use this method.
     */
    mountLottie(lottieComponent: Lottie): void;
  }
}

export declare class Font {
  file: File;
  name: string;
  fallbacks: string[];
  weight: number;
  style: string;
}

export declare class Color {
  /**
   * The raw color, suitable for usage in CSS and HTML.
   */
  color: string;
  /**
   * CSS declarations for the `color` CSS property.
   */
  colorStyle: {color: string};
  /**
   * CSS declarations for the `background-color` CSS property.
   */
  backgroundColorStyle: {backgroundColor: string};
  /**
   * CSS declarations for the `border-color` CSS property.
   */
  borderColorStyle: {borderColor: string};
  /**
   * CSS declarations for the `outline-color` CSS property.
   */
  outlineColorStyle: {outlineColor: string};
}

export declare class Typograph {
  /**
   * An `Object` with CSS values for this `Typograph`.
   */
  style: {color: string, fontSize: string, fontFamily: string, fontWeight: number, fontStyle: string};
  /**
   * Applies the `Typograph` CSS styles to the given HTMLElement.
   */
  applyStyle(ref: HTMLElement): void;
}

declare global {
  interface HTMLElement {
    /**
     * Applies a Diez Typograph definition to the element.
     *
     * You *must* have called `Diez.applyHTMLExtensions()` at least once to use this method.
     */
    applyTypograph(typograph: Typograph): void;
  }
}

export declare class GradientStop {
  position: number;
  color: Color;
}

export declare class Point2D {
  x: number;
  y: number;
}

export declare class LinearGradient {
  /**
   * The CSS linear-gradient represntation of the `LinearGradient`.
   * @example
   * linear-gradient(45deg, hsla(0, 0%, 100%, 1) 0%, hsla(0, 0%, 0%, 1) 100%)
   */
  linearGradient: string;
  /**
   * CSS declarations for the `background-image` CSS property.
   */
  backgroundImageStyle: {backgroundImage: string};
  /**
   * CSS declarations for the `background` CSS property.
   */
  backgroundStyle: {background: string};
}

export declare class Bindings extends StateBag {
  image: Image;
  lottie: Lottie;
  typograph: Typograph;
  linearGradient: LinearGradient;
  point: Point2D;
  size: Size2D;
}


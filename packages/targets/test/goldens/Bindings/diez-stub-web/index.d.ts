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
  style: {color: string, fontSize: string, fontFamily: string};
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

export declare class Bindings extends StateBag {
  image: Image;
  lottie: Lottie;
  typograph: Typograph;
}


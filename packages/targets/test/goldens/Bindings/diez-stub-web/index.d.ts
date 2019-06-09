export declare class File {
  url: string;
}

export declare class Image {
  url: string;
}

export declare class Lottie {
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
  toString(): string;
}

export declare class Typograph {
  css: {color: string, fontSize: string, fontFamily: string};
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


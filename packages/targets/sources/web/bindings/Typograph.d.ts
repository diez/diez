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

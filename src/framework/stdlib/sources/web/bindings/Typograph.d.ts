export declare class Typograph {
  /**
   * An `Object` with CSS values for this `Typograph`.
   */
  style: {
    color: string,
    fontSize: string,
    fontFamily: string,
    fontWeight: number,
    fontStyle: string,
    lineHeight?: string,
    letterSpacing: number,
    textAlign: "start" | "left" | "right" | "center",
    textDecoration: string,
  };
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

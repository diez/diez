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

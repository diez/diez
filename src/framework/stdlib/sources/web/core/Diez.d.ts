export declare class RootComponent {}

export declare class Diez<T extends RootComponent> {
  constructor (baseClass: new () => T);
  readonly component: T;
  static applyHTMLExtensions(): void;
  attach(subscriber: (component: T) => void): void;
}

export declare class StateBag {}

export declare class Diez<T extends StateBag> {
  constructor (baseClass: new () => T);
  readonly component: T;
  static applyHTMLExtensions(): void;
  attach(subscriber: (component: T) => void): void;
}

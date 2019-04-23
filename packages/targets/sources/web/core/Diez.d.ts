export declare class StateBag {}

export declare class Diez<T extends StateBag> {
  constructor (baseClass: new () => T);
  attach(subscriber: (component: T) => void): void;
}

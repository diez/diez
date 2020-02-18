export declare class ChildComponent {
  purr(): void;
}

export declare class EmptyComponent {
}

export declare class Primitives extends RootComponent {
  number: number;
  integer: number;
  float: number;
  string: string;
  boolean: boolean;
  integers: number[][];
  strings: string[][][];
  emptyList: string[];
  child: ChildComponent;
  childs: ChildComponent[][];
  emptyChild: EmptyComponent;
  referred: number;
}


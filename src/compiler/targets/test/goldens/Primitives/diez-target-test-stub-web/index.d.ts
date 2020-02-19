export declare class ChildComponent {
  purr(): void;
}

export declare class EmptyComponent {
}

/**
 * Test object comment
 *
 */
export declare class Primitives extends RootComponent {
  /**
   * Test property comment
   *
   * 10
   */
  number: number;
  /**
   * 10
   */
  integer: number;
  /**
   * 10
   */
  float: number;
  /**
   * ten
   */
  string: string;
  /**
   * true
   */
  boolean: boolean;
  /**
   * 1
   */
  integers: number[][];
  /**
   * 6
   */
  strings: string[][][];
  emptyList: string[];
  /**
   * - diez: `10`
   */
  child: ChildComponent;
  /**
   * - diez: `10`
   */
  childs: ChildComponent[][];
  emptyChild: EmptyComponent;
  /**
   * References too!
   *
   * `References.myRef` ( 10 )
   */
  referred: number;
}


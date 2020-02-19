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
   * [[1,2],[3,4],[5]]
   */
  integers: number[][];
  /**
   * [[[6],[7]],[[8],[9]],[[10]]]
   */
  strings: string[][][];
  /**
   * []
   */
  emptyList: string[];
  /**
   * - diez: `10`
   */
  child: ChildComponent;
  /**
   * [[]]
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


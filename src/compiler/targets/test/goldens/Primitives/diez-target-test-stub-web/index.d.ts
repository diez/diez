export declare class ChildComponent {
  purr(): void;
}

export declare class EmptyComponent {
}

/**
 * A component encapsulating color, including alpha transparency.
 * 
 * You can use the provided static constructors [[Color.rgb]], [[Color.rgba]], [[Color.hsl]], [[Color.hsla]], and
 * [[Color.hex]] to conveniently create color primitives using familiar patterns for color specification.
 *
 */
export declare class Color {
  /**
   * Provides simple hue-saturation-lightness-alpha color data.
   *
   * 0
   */
  h: number;
  /**
   * Provides simple hue-saturation-lightness-alpha color data.
   *
   * 0
   */
  s: number;
  /**
   * Provides simple hue-saturation-lightness-alpha color data.
   *
   * 0
   */
  l: number;
  /**
   * Provides simple hue-saturation-lightness-alpha color data.
   *
   * 1
   */
  a: number;
}

export declare class NestedPrefabComponent {
  /**
   * 1
   */
  diez: number;
  /**
   * - diez: `2`
   */
  child: ChildComponent;
  /**
   * hsla(0, 0, 0, 1)
   */
  color: Color;
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
   * - diez: `1`
   * - child: ``
   * - color: `hsla(0, 0, 0, 1)`
   */
  nestedPrefabs: NestedPrefabComponent;
  /**
   * - diez: `1`
   * - child: ``
   * - color: `hsla(0, 1, 0.4, 1)`
   */
  nestedPrefabsWithOverride: NestedPrefabComponent;
  /**
   * References too!
   *
   * `References.myRef` ( 10 )
   */
  referred: number;
}


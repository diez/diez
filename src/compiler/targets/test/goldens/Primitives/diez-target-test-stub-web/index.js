class ChildComponent {
  constructor({
    diez
  }) {
    /**
     * 10
     */
    this.diez = diez;
  }
}


module.exports.ChildComponent = ChildComponent;

ChildComponent.prototype.purr = () => {};

class EmptyComponent {
  constructor({
  } = {}) {
  }
}


module.exports.EmptyComponent = EmptyComponent;

/**
 * A component encapsulating color, including alpha transparency.
 * 
 * You can use the provided static constructors [[Color.rgb]], [[Color.rgba]], [[Color.hsl]], [[Color.hsla]], and
 * [[Color.hex]] to conveniently create color primitives using familiar patterns for color specification.
 *
 */
class Color {
  constructor({
    h,
    s,
    l,
    a
  }) {
    /**
     * Provides simple hue-saturation-lightness-alpha color data.
     *
     * 0
     */
    this.h = h;
    /**
     * Provides simple hue-saturation-lightness-alpha color data.
     *
     * 0
     */
    this.s = s;
    /**
     * Provides simple hue-saturation-lightness-alpha color data.
     *
     * 0
     */
    this.l = l;
    /**
     * Provides simple hue-saturation-lightness-alpha color data.
     *
     * 1
     */
    this.a = a;
  }
}


module.exports.Color = Color;

class NestedPrefabComponent {
  constructor({
    diez,
    child,
    color
  }) {
    /**
     * 1
     */
    this.diez = diez;
    /**
     * - diez: `2`
     */
    this.child = new ChildComponent(child);
    /**
     * hsla(0, 0, 0, 1)
     */
    this.color = new Color(color);
  }
}


module.exports.NestedPrefabComponent = NestedPrefabComponent;

/**
 * Test object comment
 *
 */
class Primitives {
  constructor({
    number = 10,
    integer = 10,
    float = 10,
    string = "ten",
    boolean = true,
    integers = [[1, 2], [3, 4], [5]],
    strings = [[["6"], ["7"]], [["8"], ["9"]], [["10"]]],
    emptyList = [],
    child = {diez: 10},
    childs = [[{diez: 10}]],
    emptyChild = {},
    nestedPrefabs = {diez: 1, child: {diez: 2}, color: {h: 0, s: 0, l: 0, a: 1}},
    nestedPrefabsWithOverride = {diez: 1, child: {diez: 2}, color: {h: 0, s: 1, l: 0.403921568627451, a: 1}},
    referred = 10
  } = {}) {
    /**
     * Test property comment
     *
     * 10
     */
    this.number = number;
    /**
     * 10
     */
    this.integer = integer;
    /**
     * 10
     */
    this.float = float;
    /**
     * ten
     */
    this.string = string;
    /**
     * true
     */
    this.boolean = boolean;
    /**
     * [[1,2],[3,4],[5]]
     */
    this.integers = integers;
    /**
     * [[[6],[7]],[[8],[9]],[[10]]]
     */
    this.strings = strings;
    /**
     * []
     */
    this.emptyList = emptyList;
    /**
     * - diez: `10`
     */
    this.child = new ChildComponent(child);
    this.childs = childs.map((value1) => value1.map((value2) => new ChildComponent(value2)));
    this.emptyChild = new EmptyComponent(emptyChild);
    /**
     * - diez: `1`
     * - child: ``
     * - color: `hsla(0, 0, 0, 1)`
     */
    this.nestedPrefabs = new NestedPrefabComponent(nestedPrefabs);
    /**
     * - diez: `1`
     * - child: ``
     * - color: `hsla(0, 1, 0.4, 1)`
     */
    this.nestedPrefabsWithOverride = new NestedPrefabComponent(nestedPrefabsWithOverride);
    /**
     * References too!
     *
     * `References.myRef` ( 10 )
     */
    this.referred = referred;
  }
}

Object.defineProperty(Primitives, 'name', {value: 'Primitives'});

module.exports.Primitives = Primitives;


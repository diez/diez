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
     * 1
     */
    this.integers = integers;
    /**
     * 6
     */
    this.strings = strings;
    this.emptyList = emptyList;
    /**
     * diez: 10
     */
    this.child = new ChildComponent(child);
    this.childs = childs.map((value1) => value1.map((value2) => new ChildComponent(value2)));
    this.emptyChild = new EmptyComponent(emptyChild);
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


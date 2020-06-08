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
    referred = 10,
    quoted = "quoted",
    _class = "reserved word",
    _10diez = "starts with number",
    diEz = "contains invalid characters",
    _10Diez = "mix of invalid and numbers"
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
     * References too!
     *
     * `References.myRef` ( 10 )
     */
    this.referred = referred;
    /**
     * quoted
     */
    this.quoted = quoted;
    /**
     * reserved word
     */
    this._class = _class;
    /**
     * starts with number
     */
    this._10diez = _10diez;
    /**
     * contains invalid characters
     */
    this.diEz = diEz;
    /**
     * mix of invalid and numbers
     */
    this._10Diez = _10Diez;
  }
}

Object.defineProperty(Primitives, 'name', {value: 'Primitives'});

module.exports.Primitives = Primitives;


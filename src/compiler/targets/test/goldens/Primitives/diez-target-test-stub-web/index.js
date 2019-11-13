class ChildComponent {
  constructor({
    diez
  }) {
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
Test object comment
**/
class Primitives {
  constructor({
  /**
  Test property comment
  **/
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
    emptyChild = {}
  } = {}) {
  /**
  Test property comment
  **/
    this.number = number;
    this.integer = integer;
    this.float = float;
    this.string = string;
    this.boolean = boolean;
    this.integers = integers;
    this.strings = strings;
    this.emptyList = emptyList;
    this.child = new ChildComponent(child);
    this.childs = childs.map((value1) => value1.map((value2) => new ChildComponent(value2)));
    this.emptyChild = new EmptyComponent(emptyChild);
  }
}

Object.defineProperty(Primitives, 'name', {value: 'Primitives'});

module.exports.Primitives = Primitives;


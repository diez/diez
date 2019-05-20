const Environment = {
  serverUrl: process.env.DIEZ_SERVER_URL,
  isHot: process.env.DIEZ_IS_HOT,
};

module.exports = {};

class ChildComponent {
  constructor () {
    this.diez = 10;
  }

  update (payload) {
    if (!payload) {
      return this;
    }

    this.diez = payload.diez;

    return this;
  }
}


module.exports.ChildComponent = ChildComponent;

class EmptyComponent {
  constructor () {
  }

  update (payload) {
    if (!payload) {
      return this;
    }


    return this;
  }
}


module.exports.EmptyComponent = EmptyComponent;

class Primitives {
  constructor () {
    this.number = 10;
    this.integer = 10;
    this.float = 10;
    this.string = "ten";
    this.boolean = true;
    this.integers = [[1, 2], [3, 4], [5]];
    this.strings = [[["6"], ["7"]], [["8"], ["9"]], [["10"]]];
    this.child = new ChildComponent();
    this.emptyChild = new EmptyComponent();
  }

  update (payload) {
    if (!payload) {
      return this;
    }

    this.number = payload.number;
    this.integer = payload.integer;
    this.float = payload.float;
    this.string = payload.string;
    this.boolean = payload.boolean;
    this.integers = payload.integers;
    this.strings = payload.strings;
    this.child = Object.assign(Object.create(Object.getPrototypeOf(this.child)), this.child.update(payload.child));
    this.emptyChild = Object.assign(Object.create(Object.getPrototypeOf(this.emptyChild)), this.emptyChild.update(payload.emptyChild));

    return this;
  }
}

Primitives.name = 'Primitives';

module.exports.Primitives = Primitives;


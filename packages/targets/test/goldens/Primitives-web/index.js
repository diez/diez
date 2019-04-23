const Environment = {
  serverUrl: 'http://foo.bar:9001/',
  isDevelopment: true,
};

module.exports = {};

class ChildComponent {
  constructor() {
    this.diez = 10;
  }

  update (payload) {
    if (!payload) {
      return;
    }

    this.diez = payload.diez;
  }
}


module.exports.ChildComponent = ChildComponent;

class Primitives {
  constructor() {
    this.number = 10;
    this.integer = 10;
    this.float = 10;
    this.string = "ten";
    this.boolean = true;
    this.integers = [[1, 2], [3, 4], [5]];
    this.strings = [[["6"], ["7"]], [["8"], ["9"]], [["10"]]];
    this.child = new ChildComponent();
  }

  update (payload) {
    if (!payload) {
      return;
    }

    this.number = payload.number;
    this.integer = payload.integer;
    this.float = payload.float;
    this.string = payload.string;
    this.boolean = payload.boolean;
    this.integers = payload.integers;
    this.strings = payload.strings;
    this.child.update(payload.child);
  }
}

Primitives.name = 'Primitives';

module.exports.Primitives = Primitives;


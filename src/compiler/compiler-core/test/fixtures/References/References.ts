import {prefab} from '@diez/engine';

interface GrandchildData {
  foo: string;
}

class Grandchild extends prefab<GrandchildData>() {
  defaults = {
    foo: 'foo',
  };
}

interface ChildData {
  grandchild: Grandchild;
  foo: string;
}

class Child extends prefab<ChildData>() {
  defaults = {
    grandchild: new Grandchild(),
    foo: 'foo',
  };
}

export class Strings {
  bar = 'bar';
  baz = 'baz';
  bat = 'bat';
}

export class Children {
  bat = new Child();
}

const strings = new Strings();
const children = new Children();

export class References {
  bar = new Child({
    grandchild: new Grandchild({
      foo: strings.bar,
    }),
    foo: strings.bar,
  });

  baz = new Child({
    grandchild: new Grandchild({
      foo: strings.baz,
    }),
    foo: strings.baz,
  });

  bat = children.bat;
}

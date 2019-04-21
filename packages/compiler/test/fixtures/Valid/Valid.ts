import {Component, Float, Integer, property} from '@diez/engine';

enum StringEnum {
  Foo = 'Foo',
  Bar = 'Bar',
}

enum NumberEnum {
  Foo,
  Bar,
}

enum HeterogeneousEnum {
  Foo = 'Foo',
  Bar = 1,
  Baz = 'Bat',
}

class GrandchildComponent extends Component {
  @property diez = 'diez';
}

class ChildComponent extends Component {
  @property grandchild = new GrandchildComponent();
}

class NotAComponent {
  ignoreMe = true;
}

export class Valid extends Component {
  // Primitive types.
  @property int: Integer = 10;
  @property number = 10;
  @property float: Float = 10.0;
  @property string = 'ten';
  @property boolean = !!10;

  // Homogenous enums should compile with the correct type.
  @property stringEnum = StringEnum.Foo;
  @property numberEnum = NumberEnum.Bar;

  // Child components should be processed on the parse.
  @property child = new ChildComponent();

  // This noncomponent should be safely skipped.
  @property badChild = new NotAComponent();

  // Heterogenous enums are incompatible with the type system, and are banned, as are other properties with ambiguous
  // types.
  @property invalidEnum = HeterogeneousEnum.Baz;
  @property unknown: unknown = 10;
  @property any: any = 10;
  @property union: number | string = 10;

  // These valid list types have uniform depth of a supported type.
  @property validListDepth1 = [10, 10, 10, 10];
  @property validListDepth2 = [['10', '10'], ['10', '10']];

  // This list type has uniform depth, but of an underlying union.
  @property invalidListUniformDepth = [10, '10'];

  // This list type has uniform types, but inconsistent depth.
  @property invalidListUniformType = [10, [10]];
}

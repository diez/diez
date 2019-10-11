import {Float, Integer} from '@diez/engine';

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

class GrandchildComponent {
  diez = 'diez';
}

class ChildComponent {
  grandchild = new GrandchildComponent();
}

/**
 * This is a mock JSDoc comment on a class.
 */
export class Valid {
  // Private and protected members should be ignored.
  private five = 5;
  protected cinco = 5.0;

  // Primitive types.
  int: Integer = this.five + this.cinco;
  number = 10;
  float: Float = 10.0;
  /**
   * This is a mock JSDoc
   * _multiline comment_.
   */
  string = 'ten';
  /**
   * This is a mock JSDoc comment on a property.
   */
  boolean = !!10;

  // Homogenous enums should compile with the correct type.
  stringEnum = StringEnum.Foo;
  numberEnum = NumberEnum.Bar;

  // Child components should be processed on the parse.
  child = new ChildComponent();

  // This noncomponent should be safely skipped.
  badChild = {
    ignoreMe: true,
  };

  // Heterogenous enums are incompatible with the type system, and are banned, as are other properties with ambiguous
  // types.
  invalidEnum = HeterogeneousEnum.Baz;
  unknown: unknown = 10;
  any: any = 10;
  union: number | string = 10;

  // These valid list types have uniform depth of a supported type.
  validListDepth1 = [10, 10, 10, 10];
  validListDepth2 = [['10', '10'], ['10', '10']];

  // Ensure empty lists are generated
  emptyList: string[] = [];

  // This list type has uniform depth, but of an underlying union.
  invalidListUniformDepth = [10, '10'];

  // This list type has uniform types, but inconsistent depth.
  invalidListUniformType = [10, [10]];
}

import {Float, Integer, prefab} from '@diez/engine';
import {Color} from '@diez/prefabs';

interface ChildComponentData {
  diez: number;
}

class ChildComponent extends prefab<ChildComponentData>() {
  defaults = {
    diez: 0,
  };
}

interface NestedPrefabComponentData {
  diez: number;
  child: ChildComponent;
  color: Color;
}

class NestedPrefabComponent extends prefab<NestedPrefabComponentData>() {
  defaults = {
    diez: 0,
    child: new ChildComponent(),
    color: Color.hex('#fff'),
  };
}

const colorBlack = Color.hex('#000');
const colorRed = Color.hex('#CE0000');

const child = new ChildComponent({
  diez: 2,
});

const nestedPrefabComponent = new NestedPrefabComponent({
  child,
  diez: 1,
  color: colorBlack,
});

const nestedPrefabComponentWithRedColor = new NestedPrefabComponent({
  child,
  diez: 1,
  color: colorRed,
});

class EmptyComponent {}

const references = {
  myRef: 10,
};

enum TEST_ENUM {
  VALUE_1,
  VALUE_2,
  VALUE_3,
}

enum TEST_ENUM_STRING {
  VALUE_1= 'VALUE_1',
  VALUE_2= 'VALUE_2',
  VALUE_3= 'VALUE_3',
}

/**
 * Test object comment
 */
export const primitives = {
  /**
   * Test property comment
   */
  number: 10,
  integer: 10 as Integer,
  float: 10.0 as Float,
  string: 'ten',
  boolean: !!10,

  // Lists of consistent depth and typing should carry through without issue.
  integers: [[1, 2], [3, 4], [5]],
  strings: [[['6'], ['7']], [['8'], ['9']], [['10']]],
  emptyList: [] as string[],

  // This child component should override the default value.
  child: new ChildComponent({diez: 10}),

  // Lists of components should also succeed.
  childs: [[new ChildComponent({diez: 10})]],

  emptyChild: new EmptyComponent(),

  // simple nested object
  nested: {
    propNumber: 10,
    propPrefab: new ChildComponent({diez: 10}),
  },

  nestedPrefabs: nestedPrefabComponent,
  nestedPrefabsWithOverride: nestedPrefabComponentWithRedColor,

  // nested object with litteral string as property key
  nestedStringProp: {
    'prop string': 10,
  },

  // nested object with enum as property keys
  nestedEnumProp: {
    [TEST_ENUM.VALUE_1]: 10,
    [TEST_ENUM_STRING.VALUE_1]: 10,
  },

  /**
   * References too!
   */
  referred: references.myRef,
};

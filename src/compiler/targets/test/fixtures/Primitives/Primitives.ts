import {Float, Integer, prefab} from '@diez/engine';

interface ChildComponentData {
  diez: number;
}

class ChildComponent extends prefab<ChildComponentData>() {
  defaults = {
    diez: 0,
  };
}

class EmptyComponent {}

export const primitives = {
  number: 10,
  integer: 10 as Integer,
  float: 10.0 as Float,
  string: 'ten',
  boolean: !!10,

  // Lists of consistent depth and typing should carry through without issue.
  integers: [[1, 2], [3, 4], [5]],
  strings: [[['6'], ['7']], [['8'], ['9']], [['10']]],

  // This child component should override the default value.
  child: new ChildComponent({diez: 10}),

  // Lists of components should also succeed.
  childs: [[new ChildComponent({diez: 10})]],

  emptyChild: new EmptyComponent(),
};

import {Component, Float, Integer, property} from '@diez/engine';

interface ChildComponentState {
  diez: number;
}

class ChildComponent extends Component<ChildComponentState> {
  @property diez = 0;
}

class EmptyComponent extends Component {}

export class Primitives extends Component {
  @property number = 10;
  @property integer: Integer = 10;
  @property float: Float = 10.0;
  @property string = 'ten';
  @property boolean = !!10;

  // Lists of consistent depth and typing should carry through without issue.
  @property integers = [[1, 2], [3, 4], [5]];
  @property strings = [[['6'], ['7']], [['8'], ['9']], [['10']]];

  // This child component should override the default value.
  @property child = new ChildComponent({diez: 10});

  @property emptyChild = new EmptyComponent();
}

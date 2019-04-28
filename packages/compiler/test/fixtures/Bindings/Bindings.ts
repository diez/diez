import {Component, property} from '@diez/engine';

export class BoundComponent extends Component {}

export class Bindings extends Component {
  @property bound = new BoundComponent();
}

import {Component, property} from '@diez/engine';

export class Filtered extends Component {
  @property({targets: ['not-test']}) excludeMe = false;
  @property includeMe = true;
  @property({targets: ['test']}) includeUs = [true, true, true];
}

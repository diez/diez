import {Component, property, Target} from '@diez/engine';

export class Filtered extends Component {
  @property({targets: ['not-test' as Target]}) excludeMe = false;
  @property includeMe = true;
  @property({targets: ['test' as Target]}) includeUs = [true, true, true];
}

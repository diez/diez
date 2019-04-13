import {Component, property} from '@livedesigner/engine';
import {ReportModelMock} from './mocks';

/**
 * The model mocks for Poodle Surf.
 */
export class ModelMocks extends Component {
  @property report = new ReportModelMock();
}

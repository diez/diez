import {Component, property} from '@livedesigner/engine';

interface EdgeInsetsState {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * Provides inset to be used for layout margins, etc.
 */
export class EdgeInsets extends Component<EdgeInsetsState> {
  @property top = 0;
  @property bottom = 0;
  @property left = 0;
  @property right = 0;
}

import {Color} from '@livedesigner/color';
import {Component, property} from '@livedesigner/engine';
import {File} from '@livedesigner/file';

export interface FontRegistryState {
  files: File[];
}

export class FontRegistry extends Component<FontRegistryState> {
  @property files: File[] = [];
}

export interface TextStyleState<T> {
  font: T;
  fontSize: number;
  color: Color;
}

export class TextStyle<T> extends Component<TextStyleState<T>> {
  @property font = 'Helvetica' as unknown as T;
  @property fontSize = 12;
  @property color: Color = Color.hsla(0, 0, 0, 1);
}

import {Component, property} from '@livedesigner/engine';
import {Color} from './color';
import {File} from './file';

export interface FontRegistryState {
  files: File[];
}

export class FontRegistry extends Component<FontRegistryState> {
  @property files: File[] = [];

  static fromFiles (...files: string[]) {
    return new this({
      files: files.map((src) => new File({src})),
    });
  }
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

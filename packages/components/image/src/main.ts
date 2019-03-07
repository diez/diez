import {Component, property} from '@livedesigner/engine';
import {File} from '@livedesigner/file';

export interface ImageState {
  file: File;
  width: number;
  height: number;
  scale: number;
}

export class Image extends Component<ImageState> {
  @property file: File = new File();

  @property width: number = 0;

  @property height: number = 0;

  @property scale: number = 1;
}

export interface SVGState {
  file: File;
}

export class SVG extends Component<SVGState> {
  @property file: File = new File();
}

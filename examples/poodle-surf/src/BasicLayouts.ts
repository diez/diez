import {Image, TextStyle} from '@livedesigner/designsystem';
import {Component, property} from '@livedesigner/engine';

interface ImagePanelState {
  text: string;
  textStyle: TextStyle;
  image: Image;
  spacing: number;
}

/**
 * Provides a component for horizontal image labels.
 */
export class ImagePanel extends Component<ImagePanelState> {
  @property text = '';
  @property textStyle = new TextStyle();
  @property image = new Image();
  @property spacing = 0;
}

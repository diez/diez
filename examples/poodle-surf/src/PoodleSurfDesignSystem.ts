import {Color, IOSFonts, TextStyle} from '@livedesigner/designsystem';
import {Component, property} from '@livedesigner/engine';
import {SimpleGradient} from './SimpleGradient';

class PoodleSurfPalette extends Component {
  @property white = Color.rgba(255, 255, 255, 1);
  @property black = Color.rgba(0, 0, 0, 1);
  @property whiteBlackGradient = new SimpleGradient({
    startColor: this.white,
    endColor: this.black,
    startPointX: 0.5,
    startPointY: 0,
    endPointX: 0.5,
    endPointY: 1,
  });
}

/**
 * @internal
 */
const palette = new PoodleSurfPalette();

class TextStyles extends Component {
  @property someTextStyle = new TextStyle({
    font: IOSFonts.Helvetica,
    fontSize: 50,
    color: palette.white,
  });
}

/**
 * The design system for Poodle Surf.
 */
export class PoodleSurfDesignSystem extends Component {
  @property palette = palette;
  @property textStyles = new TextStyles();
}

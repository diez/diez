import {Color, Image, IOSFonts, TextStyle} from '@livedesigner/designsystem';
import {Component, property} from '@livedesigner/engine';
import {ImagePanel} from './BasicLayouts';
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

class Panels extends Component {
  @property titleView = new ImagePanel({
    text: 'PITTED',
    textStyle: new TextStyle({
      font: IOSFonts.HelveticaBold,
      fontSize: 20,
    }),
    image: Image.scaled('/assets/images/icon.png', 3),
    spacing: 10,
  });
}

/**
 * The design system for Poodle Surf.
 */
export class PoodleSurfDesignSystem extends Component {
  @property palette = palette;
  @property textStyles = new TextStyles();
  @property panels = new Panels();
}

import {Color, Image, IOSFonts, TextStyle} from '@livedesigner/designsystem';
import {Component, property} from '@livedesigner/engine';
import {ImagePanel} from './BasicLayouts';
import {EdgeInsets} from './EdgeInsets';
import {SimpleGradient} from './SimpleGradient';

class Palette extends Component {
  @property pink = Color.rgba(255, 63, 112, 1);
  @property orange = Color.rgba(255, 154, 58, 1);
  @property white = Color.rgba(255, 255, 255, 1);
  @property black = Color.rgba(0, 0, 0, 1);
  @property gradient = new SimpleGradient({
    startColor: this.pink,
    endColor: this.orange,
    startPointX: 0,
    startPointY: 0,
    endPointX: 1,
    endPointY: 1,
  });
}

/**
 * @internal
 */
const palette = new Palette();

class LayoutValues extends Component {
  @property defaultMargin = 20;
  @property compactMargin = 15;
  @property looseMargin = 30;
}

/**
 * @internal
 */
const layoutValues = new LayoutValues();

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
      color: palette.white,
    }),
    image: Image.scaled('/assets/images/icon.png', 3),
    spacing: 10,
  });
}

class ReportDesign extends Component {
  @property backgroundColor = palette.white;
  @property contentLayoutMargins = new EdgeInsets({
    top: layoutValues.defaultMargin,
    bottom: layoutValues.defaultMargin,
    left: layoutValues.defaultMargin,
    right: layoutValues.defaultMargin,
  });
  @property contentSpacing = layoutValues.defaultMargin;
}

/**
 * The design system for Poodle Surf.
 */
export class PoodleSurfDesignSystem extends Component {
  @property palette = palette;
  @property textStyles = new TextStyles();
  @property panels = new Panels();
  @property report = new ReportDesign();
}

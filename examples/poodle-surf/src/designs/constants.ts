import {Color, IOSFonts, TextStyle} from '@livedesigner/designsystem';
import {Component, property} from '@livedesigner/engine';
import {SimpleGradient} from './components/SimpleGradient';

class Palette extends Component {
  @property pink = Color.rgba(255, 63, 112, 1);
  @property orange = Color.rgba(255, 154, 58, 1);
  @property blue = Color.rgba(120, 207, 253, 1);
  @property white = Color.rgba(255, 255, 255, 1);
  @property whiteA40 = Color.rgba(255, 255, 255, 0.4);
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

class TextStyles extends Component {
  @property headerTitle = new TextStyle({
    font: FontNames.defaultBold,
    fontSize: FontSizes.title,
    color: palette.black,
  });
  @property headerCaption = new TextStyle({
    font: FontNames.default,
    fontSize: FontSizes.caption,
    color: palette.black,
  });
  @property cardTitle = new TextStyle({
    font: FontNames.default,
    fontSize: FontSizes.cardTitle,
    color: palette.white,
  });
  @property value = new TextStyle({
    font: FontNames.default,
    fontSize: FontSizes.value,
    color: palette.white,
  });
  @property unit = new TextStyle({
    font: FontNames.default,
    fontSize: FontSizes.unit,
    color: palette.white,
  });
  @property caption = new TextStyle({
    font: FontNames.default,
    fontSize: FontSizes.caption,
    color: palette.white,
  });
  @property captionHeader = new TextStyle({
    font: FontNames.defaultBold,
    fontSize: FontSizes.caption,
    color: palette.white,
  });
}

/**
 * Provides shared layout values used throughout the design system.
 */
export enum LayoutValues {
  defaultMargin = 20,
  compactMargin = 15,
  looseMargin = 30,
  defaultSpacing = 10,
  compactSpacing = 5,
}

/**
 * Provides shared font defaults.
 */
export enum FontNames {
  default = IOSFonts.Helvetica,
  defaultBold = IOSFonts.HelveticaBold,
}

/**
 * Provides shared font sizes.
 */
export enum FontSizes {
  title = 20,
  cardTitle = 14,
  caption = 12,
  value = 30,
  unit = 16,
}

/**
 * A palette singleton, used throughout the design system.
 */
export const palette = new Palette();

/**
 * A TextStyles singleton, used throughout the design system.
 */
export const textStyles = new TextStyles();

import {Color, Image, IOSFonts, TextStyle} from '@livedesigner/designsystem';
import {Component, property} from '@livedesigner/engine';
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
  @property defaultSpacing = 10;
  @property compactSpacing = 5;
}

/**
 * @internal
 */
const layoutValues = new LayoutValues();

class FontNames extends Component {
  @property default = IOSFonts.Helvetica;
  @property defaultBold = IOSFonts.HelveticaBold;
}

/**
 * @internal
 */
const fontNames = new FontNames();

class FontSizes extends Component {
  @property title = 20;
  @property caption = 12;
  @property value = 30;
  @property unit = 16;
}

/**
 * @internal
 */
const fontSizes = new FontSizes();

class TextStyles extends Component {
  @property headerTitle = new TextStyle({
    font: fontNames.defaultBold,
    fontSize: fontSizes.title,
    color: palette.black,
  });
  @property headerCaption = new TextStyle({
    font: fontNames.default,
    fontSize: fontSizes.caption,
    color: palette.black,
  });
  @property value = new TextStyle({
    font: fontNames.default,
    fontSize: fontSizes.value,
    color: palette.white,
  });
  @property caption = new TextStyle({
    font: fontNames.default,
    fontSize: fontSizes.caption,
    color: palette.white,
  })
  @property captionHeader = new TextStyle({
    font: fontNames.defaultBold,
    fontSize: fontSizes.caption,
    color: palette.white,
  })
}

/**
 * @internal
 */
const textStyles = new TextStyles();

class LocationImageDesign extends Component {
  @property strokeWidth = 3;
  @property strokeGradient = palette.gradient;
  @property widthAndHeight = 106;
}

class HeaderDesign extends Component {
  @property regionLabel = textStyles.headerTitle;
  @property placeLabel = textStyles.headerCaption;
  @property mapPinIcon = Image.scaled('/assets/images/Map Pin@3x.png', 3);
  @property locationImage = new LocationImageDesign();
  @property bannerHeight = 149;
  @property labelsLayoutMargin = new EdgeInsets({
    top: layoutValues.compactMargin,
    bottom: layoutValues.compactMargin,
    left: layoutValues.defaultMargin,
    right: layoutValues.defaultMargin,
  });
  @property pinIconToLabelSpacing = layoutValues.defaultSpacing;
  @property labelsSpacing = layoutValues.compactSpacing;
}

class TemperatureDesign extends Component {
  @property textStyle = textStyles.value;
  @property icon = Image.scaled('/assets/images/Thermometer@3x.png', 3);
  @property iconSpacing = layoutValues.defaultSpacing;
}

class WetsuitDesign extends Component {
  @property headerText = 'Recommended';
  @property headerTextStyle = textStyles.captionHeader;
  @property valueTextStyle = textStyles.caption;
  @property labelSpacing = layoutValues.compactSpacing;
  @property iconSpacing = layoutValues.defaultSpacing;
}

class WaterTemperatureCardDesign extends Component {
  @property title = 'Water temperature';
  @property gradient = palette.gradient;
  @property horizontalSpacing = layoutValues.defaultMargin;
  @property temperature = new TemperatureDesign();
  @property wetsuit = new WetsuitDesign();
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
  @property header = new HeaderDesign();
  @property waterTemperatureCard = new WaterTemperatureCardDesign();
}

/**
 * The design system for Poodle Surf.
 */
export class PoodleSurfDesignSystem extends Component {
  @property palette = palette;
  @property textStyles = textStyles;
  @property report = new ReportDesign();
}

import {Image} from '@diez/designsystem';
import {Component, Float, property} from '@diez/engine';
import {ImageNames} from './assets';
import {EdgeInsets} from './components/EdgeInsets';
import {SimpleGradient} from './components/SimpleGradient';
import {LayoutValues, palette, textStyles} from './constants';

class LocationImageDesign extends Component {
  @property strokeWidth = 3;
  @property strokeGradient = palette.gradient;
  @property widthAndHeight = 106;
}

class HeaderDesign extends Component {
  @property regionLabel = textStyles.headerTitle;
  @property placeLabel = textStyles.headerCaption;
  @property mapPinIcon = Image.scaled(ImageNames.MapPin, 3);
  @property locationImage = new LocationImageDesign();
  @property bannerHeight = 149;
  @property labelsLayoutMargin = EdgeInsets.simple(
    LayoutValues.compactMargin,
    LayoutValues.defaultMargin,
  );
  @property pinIconToLabelSpacing = LayoutValues.defaultSpacing;
  @property labelsSpacing = LayoutValues.compactSpacing;
}

class TemperatureDesign extends Component {
  @property textStyle = textStyles.value;
  @property icon = Image.scaled(ImageNames.Thermometer, 3);
  @property iconSpacing = LayoutValues.defaultSpacing;
}

class WetsuitDesign extends Component {
  @property headerText = 'Recommended';
  @property headerTextStyle = textStyles.captionHeader;
  @property valueTextStyle = textStyles.caption;
  @property labelSpacing = LayoutValues.compactSpacing;
  @property iconSpacing = LayoutValues.defaultSpacing;
}

class WaterTemperatureCardDesign extends Component {
  @property title = 'Water temperature';
  @property titleTextStyle = textStyles.cardTitle;
  @property gradient = palette.gradient;
  @property horizontalSpacing = LayoutValues.defaultMargin;
  @property temperature = new TemperatureDesign();
  @property wetsuit = new WetsuitDesign();
}

class SharedDayPartDesign extends Component {
  @property valueTextStyle = textStyles.value;
  @property unitTextStyle = textStyles.unit;
  @property timeTextStyle = textStyles.caption;
  @property valueUnitSpacing = LayoutValues.compactSpacing;
  @property layoutMargins = new EdgeInsets();
}

interface ForecastCardDesignState {
  title: string;
  unit: string;
  gradient: SimpleGradient;
  dayPart: SharedDayPartDesign;
  dayPartsHorizontalSpacing: number;
  dayPartVerticalSpacing: number;
  separatorWidth: number;
  separatorColor: number;
  valueUnitMargins: EdgeInsets;
}

class ForecastCardDesign extends Component<ForecastCardDesignState> {
  @property title = '';
  @property titleTextStyle = textStyles.cardTitle;
  @property unit = '';
  @property gradient = palette.gradient;
  @property dayPart = new SharedDayPartDesign();
  @property dayPartsHorizontalSpacing = LayoutValues.defaultMargin;
  @property dayPartVerticalSpacing = LayoutValues.looseMargin;
  @property separatorWidth = 1;
  @property separatorColor = palette.whiteA40;
  @property valueUnitMargins = new EdgeInsets();
}

/**
 * The report design.
 */
export class ReportDesign extends Component {
  @property backgroundColor = palette.white;
  @property contentLayoutMargins = EdgeInsets.simple(LayoutValues.defaultMargin);
  @property contentSpacing = LayoutValues.defaultMargin;
  @property header = new HeaderDesign();
  @property waterTemperature = new WaterTemperatureCardDesign();
  @property wind = new ForecastCardDesign({
    title: 'Wind',
    unit: 'mph',
    dayPartVerticalSpacing: LayoutValues.defaultSpacing,
    valueUnitMargins: new EdgeInsets({
      top: LayoutValues.defaultMargin,
    }),
  });
  @property swell = new ForecastCardDesign({
    title: 'Swell',
    unit: 'ft',
  });
  @property tide = new ForecastCardDesign({
    title: 'Tide',
    unit: 'ft',
  });
}

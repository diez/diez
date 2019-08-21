import {Color, DropShadow, LinearGradient, Panel, Size2D, Typograph, Fill} from '@diez/prefabs';
import {prefab} from '@diez/engine';
import {PoodleSurfSlices} from './PoodleSurf.sketch';
import {EdgeInsets} from './components/EdgeInsets';
import {LayoutValues, palette, shadows, typographs} from './constants';

class LocationImageDesign {
  strokeWidth = 3;
  strokeGradient = palette.contentBackground;
  widthAndHeight = 106;
}

class HeaderDesign {
  regionLabel = typographs.headerTitle;
  placeLabel = typographs.headerCaption;
  mapPinIcon = PoodleSurfSlices.MapPin;
  locationImage = new LocationImageDesign();
  bannerHeight = 149;
  labelsLayoutMargin = EdgeInsets.simple(
    LayoutValues.CompactMargin,
    LayoutValues.DefaultMargin,
  );
  pinIconToLabelSpacing = LayoutValues.DefaultSpacing;
  labelsSpacing = LayoutValues.CompactSpacing;
}

interface SharedCardDesignData {
  title: string;
  titleTypograph: Typograph;
  titleContentSpacing: number;
  layoutMargins: EdgeInsets;
  panel: Panel;
}

class SharedCardDesign extends prefab<SharedCardDesignData>() {
  defaults = {
    title: '',
    titleTypograph: typographs.cardTitle,
    titleContentSpacing: LayoutValues.DefaultMargin,
    layoutMargins: new EdgeInsets({
      top: LayoutValues.DefaultMargin,
      bottom: LayoutValues.LooseMargin,
      left: LayoutValues.DefaultMargin,
      right: LayoutValues.DefaultMargin,
    }),
    panel: new Panel({
      cornerRadius: 8,
      dropShadow: shadows.card,
      elevation: 12,
      background: Fill.linearGradient(palette.contentBackground),
    }),
  };
}

class TemperatureDesign {
  typograph = typographs.value;
  icon = PoodleSurfSlices.Thermometer;
  iconSpacing = LayoutValues.DefaultSpacing;
}

class WetsuitDesign {
  headerText = 'Recommended';
  headerTypograph = typographs.captionHeader;
  valueTypograph = typographs.caption;
  labelSpacing = LayoutValues.CompactSpacing;
  iconSpacing = LayoutValues.DefaultSpacing;
  icon = PoodleSurfSlices.Gear;
}

class WaterTemperatureCardDesign {
  shared = new SharedCardDesign({
    title: 'Water temperature',
  });
  horizontalSpacing = LayoutValues.DefaultMargin;
  temperature = new TemperatureDesign();
  wetsuit = new WetsuitDesign();
}

const DayPartIconSize = 78;

class DayPartDesign {
  valueTypograph = typographs.value;
  unitTypograph = typographs.unit;
  timeTypograph = typographs.caption;
  valueUnitSpacing = LayoutValues.CompactSpacing;
  layoutMargins = new EdgeInsets();
  iconSize = Size2D.make(DayPartIconSize, DayPartIconSize);
}

interface ForecastCardDesignData {
  shared: SharedCardDesign;
  dayPart: DayPartDesign;
  unit: string;
  dayPartsHorizontalSpacing: number;
  dayPartVerticalSpacing: number;
  separatorWidth: number;
  separatorColor: Color;
  valueUnitMargins: EdgeInsets;
}

class ForecastCardDesign extends prefab<ForecastCardDesignData>() {
  defaults = {
    shared: new SharedCardDesign(),
    dayPart: new DayPartDesign(),
    unit: '',
    dayPartsHorizontalSpacing: LayoutValues.DefaultMargin,
    dayPartVerticalSpacing: LayoutValues.LooseMargin,
    separatorWidth: 1,
    separatorColor: palette.separator,
    valueUnitMargins: new EdgeInsets(),
  };
}

/**
 * The report design.
 */
export class ReportDesign {
  backgroundColor = palette.background;
  contentLayoutMargins = EdgeInsets.simple(LayoutValues.DefaultMargin);
  contentSpacing = LayoutValues.DefaultMargin;
  header = new HeaderDesign();
  waterTemperature = new WaterTemperatureCardDesign();
  wind = new ForecastCardDesign({
    shared: new SharedCardDesign({
      title: 'Wind',
    }),
    unit: 'mph',
    dayPartVerticalSpacing: LayoutValues.DefaultSpacing,
    valueUnitMargins: new EdgeInsets({
      top: LayoutValues.DefaultMargin,
    }),
  });
  swell = new ForecastCardDesign({
    shared: new SharedCardDesign({
      title: 'Swell',
    }),
    unit: 'ft',
  });
  tide = new ForecastCardDesign({
    shared: new SharedCardDesign({
      title: 'Tide',
    }),
    unit: 'ft',
  });
}

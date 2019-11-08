import {Color, Panel, Size2D, Typograph, Fill} from '@diez/prefabs';
import {prefab} from '@diez/engine';
import {poodleSurfSlices} from './PoodleSurf.sketch';
import {EdgeInsets} from './components/EdgeInsets';
import {LayoutValues, palette, shadows, typographs} from './constants';

const locationImageDesign = {
  strokeWidth: 3,
  strokeGradient: palette.contentBackground,
  widthAndHeight: 106,
}

const headerDesign = {
  regionLabel: typographs.headerTitle,
  placeLabel: typographs.headerCaption,
  mapPinIcon: poodleSurfSlices.mapPin,
  locationImage: locationImageDesign,
  bannerHeight: 149,
  labelsLayoutMargin: EdgeInsets.simple(
    LayoutValues.CompactMargin,
    LayoutValues.DefaultMargin,
  ),
  pinIconToLabelSpacing: LayoutValues.DefaultSpacing,
  labelsSpacing: LayoutValues.CompactSpacing,
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

const temperatureDesign = {
  typograph: typographs.value,
  icon: poodleSurfSlices.thermometer,
  iconSpacing: LayoutValues.DefaultSpacing,
}

const wetsuitDesign = {
  headerText: 'Recommended',
  headerTypograph: typographs.captionHeader,
  valueTypograph: typographs.caption,
  labelSpacing: LayoutValues.CompactSpacing,
  iconSpacing: LayoutValues.DefaultSpacing,
  icon: poodleSurfSlices.gear,
}

const waterTemperatureCardDesign = {
  shared: new SharedCardDesign({
    title: 'Water temperature',
  }),
  horizontalSpacing: LayoutValues.DefaultMargin,
  temperature: temperatureDesign,
  wetsuit: wetsuitDesign,
}

const dayPartIconSize = 78;

const dayPartDesign = {
  valueTypograph: typographs.value,
  unitTypograph: typographs.unit,
  timeTypograph: typographs.caption,
  valueUnitSpacing: LayoutValues.CompactSpacing,
  layoutMargins: new EdgeInsets(),
  iconSize: Size2D.make(dayPartIconSize, dayPartIconSize),
}

interface ForecastCardDesignData {
  shared: SharedCardDesign;
  dayPart: typeof dayPartDesign;
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
    dayPart: dayPartDesign,
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
export const reportDesign = {
  backgroundColor: palette.background,
  contentLayoutMargins: EdgeInsets.simple(LayoutValues.DefaultMargin),
  contentSpacing: LayoutValues.DefaultMargin,
  header: headerDesign,
  waterTemperature: waterTemperatureCardDesign,
  wind: new ForecastCardDesign({
    shared: new SharedCardDesign({
      title: 'Wind',
    }),
    unit: 'mph',
    dayPartVerticalSpacing: LayoutValues.DefaultSpacing,
    valueUnitMargins: new EdgeInsets({
      top: LayoutValues.DefaultMargin,
    }),
  }),
  swell: new ForecastCardDesign({
    shared: new SharedCardDesign({
      title: 'Swell',
    }),
    unit: 'ft',
  }),
  tide: new ForecastCardDesign({
    shared: new SharedCardDesign({
      title: 'Tide',
    }),
    unit: 'ft',
  }),
}

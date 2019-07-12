import {Typograph, Font} from '@diez/prefabs';
import {Component, property} from '@diez/engine';
import {poodleSurfDesignSystem} from './PoodleSurf.sketch';

/**
 * A palette singleton, used throughout the design system.
 */
export const {palette} = poodleSurfDesignSystem;

/**
 * A registry of all of the design's fonts.
 */
const Fonts = {
  Nunito: {
    Regular: Font.fromFile('assets/fonts/Nunito-Regular.ttf'),
    Black: Font.fromFile('assets/fonts/Nunito-Black.ttf'),
    Bold: Font.fromFile('assets/fonts/Nunito-Bold.ttf'),
    ExtraBold: Font.fromFile('assets/fonts/Nunito-ExtraBold.ttf'),
    ExtraLight: Font.fromFile('assets/fonts/Nunito-ExtraLight.ttf'),
    Light: Font.fromFile('assets/fonts/Nunito-Light.ttf'),
    Medium: Font.fromFile('assets/fonts/Nunito-Medium.ttf'),
    SemiBold: Font.fromFile('assets/fonts/Nunito-SemiBold.ttf'),
  },
};

enum FontSizes {
  Title = 20,
  CardTitle = 14,
  Caption = 12,
  Value = 30,
  Unit = 16,
}

class Typographs extends Component {
  @property headerTitle = new Typograph({
    font: Fonts.Nunito.Bold,
    fontSize: FontSizes.Title,
    color: palette.colors.black,
  });
  @property headerCaption = new Typograph({
    font: Fonts.Nunito.Regular,
    fontSize: FontSizes.Caption,
    color: palette.colors.black,
  });
  @property cardTitle = new Typograph({
    font: Fonts.Nunito.Regular,
    fontSize: FontSizes.CardTitle,
    color: palette.colors.white,
  });
  @property value = new Typograph({
    font: Fonts.Nunito.Regular,
    fontSize: FontSizes.Value,
    color: palette.colors.white,
  });
  @property unit = new Typograph({
    font: Fonts.Nunito.Regular,
    fontSize: FontSizes.Unit,
    color: palette.colors.white,
  });
  @property caption = new Typograph({
    font: Fonts.Nunito.Regular,
    fontSize: FontSizes.Caption,
    color: palette.colors.white,
  });
  @property captionHeader = new Typograph({
    font: Fonts.Nunito.Bold,
    fontSize: FontSizes.Caption,
    color: palette.colors.white,
  });
}

/**
 * Provides shared layout values used throughout the design system.
 */
export enum LayoutValues {
  DefaultMargin = 20,
  CompactMargin = 15,
  LooseMargin = 30,
  DefaultSpacing = 10,
  CompactSpacing = 5,
}

/**
 * A Typographs singleton, used throughout the design system.
 */
export const typographs = new Typographs();

import {Font, LinearGradient, Toward, Typograph} from '@diez/prefabs';
import {Component, property} from '@diez/engine';
import {poodleSurfTokens} from './PoodleSurf.sketch';

class Palette extends Component {
  @property foreground = poodleSurfTokens.colors.black;
  @property background = poodleSurfTokens.colors.white;
  @property loadingBackground = poodleSurfTokens.colors.blue;
  @property primary = poodleSurfTokens.colors.pink;
  @property secondary = poodleSurfTokens.colors.orange;
  @property separator = poodleSurfTokens.colors.whiteA40;
  @property contentForeground = poodleSurfTokens.colors.white;
  @property contentBackground = LinearGradient.make(Toward.BottomRight, this.primary, this.secondary);
}

/**
 * A palette singleton, used throughout the design system.
 */
export const palette = new Palette();

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
    color: palette.foreground,
  });
  @property headerCaption = new Typograph({
    font: Fonts.Nunito.Regular,
    fontSize: FontSizes.Caption,
    color: palette.foreground,
  });
  @property cardTitle = new Typograph({
    font: Fonts.Nunito.Regular,
    fontSize: FontSizes.CardTitle,
    color: palette.contentForeground,
  });
  @property value = new Typograph({
    font: Fonts.Nunito.Regular,
    fontSize: FontSizes.Value,
    color: palette.contentForeground,
  });
  @property unit = new Typograph({
    font: Fonts.Nunito.Regular,
    fontSize: FontSizes.Unit,
    color: palette.contentForeground,
  });
  @property caption = new Typograph({
    font: Fonts.Nunito.Regular,
    fontSize: FontSizes.Caption,
    color: palette.contentForeground,
  });
  @property captionHeader = new Typograph({
    font: Fonts.Nunito.Bold,
    fontSize: FontSizes.Caption,
    color: palette.contentForeground,
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

import {Font, IOSTextStyle, LinearGradient, Toward, Typograph, TextAlignment} from '@diez/prefabs';
import {poodleSurfTokens} from './PoodleSurf.sketch';

const primary = poodleSurfTokens.colors.blue;
const secondary = poodleSurfTokens.colors.orange;

/**
 * A palette singleton, used throughout the design language.
 */
export const palette = {
  primary,
  secondary,
  foreground: poodleSurfTokens.colors.black,
  background: poodleSurfTokens.colors.white,
  loadingBackground: poodleSurfTokens.colors.blue,
  separator: poodleSurfTokens.colors.whiteA40,
  contentForeground: poodleSurfTokens.colors.white,
  contentBackground: LinearGradient.make(Toward.BottomRight, primary, secondary),
}

export const shadows = {
  card: poodleSurfTokens.shadows.cardStyleDropShadow,
};

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

export const typographs = {
  headerTitle: new Typograph({
    font: Fonts.Nunito.Bold,
    fontSize: FontSizes.Title,
    color: palette.foreground,
    iosTextStyle: IOSTextStyle.Title1,
    alignment: TextAlignment.Center,
  }),
  headerCaption: new Typograph({
    font: Fonts.Nunito.Regular,
    fontSize: FontSizes.Caption,
    color: palette.foreground,
    iosTextStyle: IOSTextStyle.Caption1,
  }),
  cardTitle: new Typograph({
    font: Fonts.Nunito.Regular,
    fontSize: FontSizes.CardTitle,
    color: palette.contentForeground,
    iosTextStyle: IOSTextStyle.Title2,
    shouldScale: true,
  }),
  value: new Typograph({
    font: Fonts.Nunito.Regular,
    fontSize: FontSizes.Value,
    color: palette.contentForeground,
    iosTextStyle: IOSTextStyle.Headline,
    alignment: TextAlignment.Center,
  }),
  unit: new Typograph({
    font: Fonts.Nunito.Regular,
    fontSize: FontSizes.Unit,
    color: palette.contentForeground,
    iosTextStyle: IOSTextStyle.Subheadline,
    alignment: TextAlignment.Center,
  }),
  caption: new Typograph({
    font: Fonts.Nunito.Regular,
    fontSize: FontSizes.Caption,
    color: palette.contentForeground,
    iosTextStyle: IOSTextStyle.Caption2,
    alignment: TextAlignment.Center,
  }),
  captionHeader: new Typograph({
    font: Fonts.Nunito.Bold,
    fontSize: FontSizes.Caption,
    color: palette.contentForeground,
    iosTextStyle: IOSTextStyle.Caption2,
  }),
}

/**
 * Provides shared layout values used throughout the design language.
 */
export enum LayoutValues {
  DefaultMargin = 20,
  CompactMargin = 15,
  LooseMargin = 30,
  DefaultSpacing = 10,
  CompactSpacing = 5,
}

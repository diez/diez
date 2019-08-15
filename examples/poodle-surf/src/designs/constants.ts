import {Font, IOSTextStyle, LinearGradient, Toward, Typograph} from '@diez/prefabs';
import {poodleSurfTokens} from './PoodleSurf.sketch';

class Palette {
  foreground = poodleSurfTokens.colors.black;
  background = poodleSurfTokens.colors.white;
  loadingBackground = poodleSurfTokens.colors.blue;
  primary = poodleSurfTokens.colors.pink;
  secondary = poodleSurfTokens.colors.orange;
  separator = poodleSurfTokens.colors.whiteA40;
  contentForeground = poodleSurfTokens.colors.white;
  contentBackground = LinearGradient.make(Toward.BottomRight, this.primary, this.secondary);
}

/**
 * A palette singleton, used throughout the design system.
 */
export const palette = new Palette();

class Shadows {
  card = poodleSurfTokens.shadows.cardStyleDropShadow;
}

export const shadows = new Shadows();

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

class Typographs {
  headerTitle = new Typograph({
    font: Fonts.Nunito.Bold,
    fontSize: FontSizes.Title,
    color: palette.foreground,
    iosTextStyle: IOSTextStyle.Title1,
  });
  headerCaption = new Typograph({
    font: Fonts.Nunito.Regular,
    fontSize: FontSizes.Caption,
    color: palette.foreground,
    iosTextStyle: IOSTextStyle.Caption1,
  });
  cardTitle = new Typograph({
    font: Fonts.Nunito.Regular,
    fontSize: FontSizes.CardTitle,
    color: palette.contentForeground,
    iosTextStyle: IOSTextStyle.Title2,
  });
  value = new Typograph({
    font: Fonts.Nunito.Regular,
    fontSize: FontSizes.Value,
    color: palette.contentForeground,
    iosTextStyle: IOSTextStyle.Headline,
  });
  unit = new Typograph({
    font: Fonts.Nunito.Regular,
    fontSize: FontSizes.Unit,
    color: palette.contentForeground,
    iosTextStyle: IOSTextStyle.Subheadline,
  });
  caption = new Typograph({
    font: Fonts.Nunito.Regular,
    fontSize: FontSizes.Caption,
    color: palette.contentForeground,
    iosTextStyle: IOSTextStyle.Caption2,
  });
  captionHeader = new Typograph({
    font: Fonts.Nunito.Bold,
    fontSize: FontSizes.Caption,
    color: palette.contentForeground,
    iosTextStyle: IOSTextStyle.Caption2,
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

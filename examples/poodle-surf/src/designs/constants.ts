import {Color, IOSFonts, Typograph, FontRegistry} from '@diez/prefabs';
import {Component, property} from '@diez/engine';
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

enum FontNames {
  Nunito ='Nunito-Regular',
  NunitoBlack ='Nunito-Black',
  NunitoBold ='Nunito-Bold',
  NunitoExtraBold ='Nunito-ExtraBold',
  NunitoExtraLight ='Nunito-ExtraLight',
  NunitoLight ='Nunito-Light',
  NunitoMedium ='Nunito-Medium',
  NunitoSemiBold ='Nunito-SemiBold',
}

enum FontRoles {
  Default = FontNames.Nunito,
  DefaultBold = FontNames.NunitoBold,
}

enum FontSizes {
  Title = 20,
  CardTitle = 14,
  Caption = 12,
  Value = 30,
  Unit = 16,
}

class Typographs extends Component {
  @property headerTitle = new Typograph({
    fontName: FontRoles.DefaultBold,
    fontSize: FontSizes.Title,
    color: palette.black,
  });
  @property headerCaption = new Typograph({
    fontName: FontRoles.Default,
    fontSize: FontSizes.Caption,
    color: palette.black,
  });
  @property cardTitle = new Typograph({
    fontName: FontRoles.Default,
    fontSize: FontSizes.CardTitle,
    color: palette.white,
  });
  @property value = new Typograph({
    fontName: FontRoles.Default,
    fontSize: FontSizes.Value,
    color: palette.white,
  });
  @property unit = new Typograph({
    fontName: FontRoles.Default,
    fontSize: FontSizes.Unit,
    color: palette.white,
  });
  @property caption = new Typograph({
    fontName: FontRoles.Default,
    fontSize: FontSizes.Caption,
    color: palette.white,
  });
  @property captionHeader = new Typograph({
    fontName: FontRoles.DefaultBold,
    fontSize: FontSizes.Caption,
    color: palette.white,
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
 * A registry of all of the design's fonts.
 */
export const fontRegistry = FontRegistry.fromFiles(
  'assets/fonts/Nunito-Black.ttf',
  'assets/fonts/Nunito-Bold.ttf',
  'assets/fonts/Nunito-ExtraBold.ttf',
  'assets/fonts/Nunito-ExtraLight.ttf',
  'assets/fonts/Nunito-Light.ttf',
  'assets/fonts/Nunito-Medium.ttf',
  'assets/fonts/Nunito-Regular.ttf',
  'assets/fonts/Nunito-SemiBold.ttf',
);

/**
 * A palette singleton, used throughout the design system.
 */
export const palette = new Palette();

/**
 * A Typographs singleton, used throughout the design system.
 */
export const typographs = new Typographs();

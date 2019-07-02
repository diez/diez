import {Color, Typograph, Font} from '@diez/prefabs';
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
    color: palette.black,
  });
  @property headerCaption = new Typograph({
    font: Fonts.Nunito.Regular,
    fontSize: FontSizes.Caption,
    color: palette.black,
  });
  @property cardTitle = new Typograph({
    font: Fonts.Nunito.Regular,
    fontSize: FontSizes.CardTitle,
    color: palette.white,
  });
  @property value = new Typograph({
    font: Fonts.Nunito.Regular,
    fontSize: FontSizes.Value,
    color: palette.white,
  });
  @property unit = new Typograph({
    font: Fonts.Nunito.Regular,
    fontSize: FontSizes.Unit,
    color: palette.white,
  });
  @property caption = new Typograph({
    font: Fonts.Nunito.Regular,
    fontSize: FontSizes.Caption,
    color: palette.white,
  });
  @property captionHeader = new Typograph({
    font: Fonts.Nunito.Bold,
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
 * A palette singleton, used throughout the design system.
 */
export const palette = new Palette();

/**
 * A Typographs singleton, used throughout the design system.
 */
export const typographs = new Typographs();

import {Color, Image, Lottie, Typograph, Font} from '@diez/prefabs';
import {Component, property} from '@diez/engine';
import {Margin} from './components/Margin';

/**
 * You can collect anything inside a Diez component. Design tokens labeled with @property will be
 * made available in the SDKs transpiled with Diez. Everything else is purely internal.
 */
class Palette extends Component {
  private lightener = 0.2;

  @property white = Color.hex('#FFFFFF');
  @property black = Color.hex('#000010');
  @property purple = Color.rgb(86, 35, 238);
  @property lightPurple = this.purple.lighten(this.lightener);
}

/**
 * Sometimes, it's helpful to keep a copy of a component instance you intend to reuse while defining
 * higher-level components in your design system.
 *
 * For example, you can use this instance of the `Palette` component to build your typographs.
 */
const palette = new Palette();

/**
 * You can reference properties from other components.
 */
class Colors extends Component {
  @property lightBackground = palette.white;
  @property darkBackground = palette.black;
  @property text = palette.black;
  @property caption = palette.purple;
}

const colors = new Colors();

/**
 * All of rich language features of TypeScript are at your disposal; for example, you can define an
 * object to keep track of your fonts.
 */
const Fonts = {
  SourceSansPro: {
    Regular: Font.fromFile('assets/SourceSansPro-Regular.ttf'),
  },
}

/**
 * Typographs encapsulate type styles with support for a specific font, font size, and color.
 * More typograph properties are coming soon.
 */
class Typographs extends Component {
  @property heading1 = new Typograph({
    font: Fonts.SourceSansPro.Regular,
    fontSize: 24,
    color: colors.text,
  });

  @property caption = new Typograph({
    font: Fonts.SourceSansPro.Regular,
    fontSize: 14,
    color: colors.caption,
  });
}

/**
 * In addition to colors and typographs, you can also collect other types of design system
 * primitives in components as well — such as images, icons & animations.
 */
class Images extends Component {
  @property logo = Image.responsive('assets/logo.png', 52, 48);
  @property masthead = Image.responsive('assets/masthead.png', 208, 88);
}

/**
 * You can even collect your own custom components.
 */
class LayoutValues extends Component {
  @property spacingSmall = 5;
  @property spacingMedium = 25;
  @property spacingLarge = 40;
  @property contentMargin = new Margin({
    top: this.spacingLarge,
    left: this.spacingMedium,
    right: this.spacingMedium,
    bottom: this.spacingMedium
  });
}

/**
 * You can also define strings.
 */
class Strings extends Component {
  @property title = 'Diez';
  @property caption = 'Keep your designs in sync with code.';
}

/**
 * When you `export` a component, it will become available in your SDK.
 */
export class DesignSystem extends Component {
  @property colors = colors;
  @property typographs = new Typographs();
  @property images = new Images();
  @property layoutValues = new LayoutValues();
  @property strings = new Strings();
  @property loadingAnimation = Lottie.fromJson('assets/loadingAnimation.json');
}

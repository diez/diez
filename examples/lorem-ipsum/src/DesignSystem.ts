import {Color, FontRegistry, Image, Lottie, Typograph} from '@diez/prefabs';
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
 * All of rich language features of TypeScript are at your disposal; for example, you can use an
 * enum to keep track of your font names. `@diez/prefabs` already provides enums for the
 * built-in fonts for iOS and Android.
 */
enum FontNames {
  SourceSansPro = 'SourceSansPro-Regular',
}

/**
 * You can use the special FontRegistry component to load and activate your custom fonts from
 * TTF files.
 */
class Typographs extends Component {
  @property fontRegistry = FontRegistry.fromFiles('assets/SourceSansPro-Regular.ttf');

  @property heading1 = new Typograph({
    fontName: FontNames.SourceSansPro,
    fontSize: 24,
    color: colors.text,
  });

  @property caption = new Typograph({
    fontName: FontNames.SourceSansPro,
    fontSize: 14,
    color: colors.caption,
  });
}

/**
 * In addition to colors and typographs, you can also collect other types of design system
 * primitives in components as well — such as images, icons & animations.
 */
class Images extends Component {
  @property logo = Image.responsive('assets/logo.png');
  @property masthead = Image.responsive('assets/masthead.png');
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

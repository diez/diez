import {Color, FontRegistry, Image, Lottie, TextStyle} from '@diez/prefabs';
import {Component, property} from '@diez/engine';
import {Margin} from './custom-components/Margin';

/**
 * You can collect anything inside a Diez component. Design tokens labeled with @property will be
 * made available in the SDKs transpiled with Diez. Everything else is purely internal.
 */
class Palette extends Component {
  private lightener = 0.2;

  @property black = Color.rgb(8, 8, 12);
  @property pink500 = Color.rgb(255, 63, 112);
  @property pink400 = this.pink500.lighten(this.lightener);
}

/**
 * Sometimes, it's helpful to keep a copy of a component instance you intend to reuse while defining
 * higher-level components in your design system.
 *
 * For example, you can use this instance of the `Palette` component to build your text styles.
 */
const palette = new Palette();

/**
 * All of rich language features of TypeScript are at your disposal; for example, you can use an
 * enum to keep track of your font names. `@diez/prefabs` already provides enums for the
 * built-in fonts for iOS and Android.
 */
enum MyFonts {
  BalooRegular = 'Baloo-Regular',
}

/**
 * You can use the special FontRegistry component to load and activate your custom fonts from
 * TTF files.
 */
class TextStyles extends Component {
  @property fontRegistry = FontRegistry.fromFiles('assets/Baloo-Regular.ttf');

  @property heading1 = new TextStyle({
    fontSize: 24,
    color: palette.black,
  });

  @property heading2 = new TextStyle({
    fontSize: 20,
    color: palette.black,
  });

  @property caption = new TextStyle({
    fontName: MyFonts.BalooRegular,
    fontSize: 14,
    color: palette.pink500,
  });
}

/**
* In addition to colors and text styles, you can also collect other types of design system
* primitives in components as well — such as images, icons & animations.
*/
class Images extends Component {
  @property logo = Image.responsive('assets/logo', 'png');
  @property masthead = Image.responsive('assets/masthead', 'png');
}

/**
 * You can even collect your own custom components.
 */
class Margins extends Component {
  @property header = Margin.simple(20);
  @property body = new Margin({top: 10, left: 40, right: 40, bottom: 80});
}

/**
 * When you `export` a component, it will become available in your SDK.
 */
export class LoremIpsumDesignSystem extends Component {
  @property palette = palette;
  @property textStyles = new TextStyles();
  @property images = new Images();
  @property loadingAnimation = Lottie.fromJson('assets/loadingAnimation.json');
}

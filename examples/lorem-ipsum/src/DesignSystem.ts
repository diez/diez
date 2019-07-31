import {Color, DropShadow, Image, Lottie, Toward, Typograph, Font, LinearGradient, Point2D} from '@diez/prefabs';
import {Margin} from './components/Margin';

/**
 * You can collect anything inside a Diez component. Design tokens specified as public
 * properties will be made available in the SDKs transpiled with Diez. Everything
 * else is purely internal.
 */
class Colors {
  private lightener = 0.2;

  white = Color.hex('#FFFFFF');
  black = Color.hex('#000010');
  purple = Color.rgb(86, 35, 238);
  darkPurple = Color.rgb(22, 11, 54);
  lightPurple = this.purple.lighten(this.lightener);
}

/**
 * Sometimes, it's helpful to keep a copy of a component instance you intend to
 * reuse while defining higher-level components in your design system.
 *
 * For example, you can use this instance of the `Palette` component to design your
 * typography.
 */
const colors = new Colors();

/**
 * You can reference properties from other components.
 */
class Palette {
  background = colors.black;
  contentBackground = colors.white;
  text = colors.black;
  caption = colors.purple;
  headerBackground = LinearGradient.make(Toward.Bottom, colors.darkPurple, colors.black);
}

const palette = new Palette();

/**
 * All of rich language features of TypeScript are at your disposal; for example,
 * you can define an object to keep track of your fonts.
 */
const Fonts = {
  SourceSansPro: {
    Regular: Font.fromFile('assets/SourceSansPro-Regular.ttf'),
  },
}

/**
 * Typographs encapsulate type styles with support for a specific font, font size,
 * and color. More typograph properties are coming soon.
 */
class Typography {
  heading1 = new Typograph({
    font: Fonts.SourceSansPro.Regular,
    fontSize: 24,
    color: palette.text,
  });

  body = new Typograph({
    font: Fonts.SourceSansPro.Regular,
    fontSize: 18,
    color: palette.text,
  });

  caption = new Typograph({
    font: Fonts.SourceSansPro.Regular,
    fontSize: 14,
    color: palette.caption,
  });
}

/**
 * In addition to colors and typography, you can also collect other types of
 * design system primitives in components as well — such as images, icons &
 * animations.
 */
class Images {
  logo = Image.responsive('assets/logo.png', 52, 48);
  masthead = Image.responsive('assets/masthead.png', 208, 88);
}

/**
 * You can even collect your own custom components.
 */
class LayoutValues {
  spacingSmall = 5;
  spacingMedium = 25;
  spacingLarge = 40;
  contentMargin = new Margin({
    top: this.spacingLarge,
    left: this.spacingMedium,
    right: this.spacingMedium,
    bottom: this.spacingMedium
  });
}

/**
 * You can also define strings.
 */
class Strings {
  title = 'Diez';
  caption = 'Keep your designs in sync with code';
  helper = 'Modify the contents of “src/DesignSystem.ts” (relative to the root of the Diez project) to see changes to the design system in real time.';
}

class Shadows {
  logo = new DropShadow({
    offset: Point2D.make(0, 1),
    radius: 16,
    color: colors.black.fade(0.59),
  });
}

/**
 * Note how this component is exported from `index.ts`. Diez compiles these
 * exported components for your apps' codebases.
 *
 * For example:
 *   - If you run `yarn start web`, Diez will create a Node package called
 *     `diez-lorem-ipsum-web`. Look for `App.jsx` inside `examples/web` to see
 *     how you can use Diez in a web codebase.
 *   - If you run `yarn start ios`, Diez will create a CocoaPods dependency
 *     called `DiezLoremIpsum`. Look for `ViewController.swift` inside
 *     `examples/ios` to see how you can use Diez in an iOS codebase.
 *   - If you run `yarn start android`, Diez will create an Android library.
 *     Look for `MainActivity.kt` inside `examples/android` to see how you can
 *     use Diez in an Android codebase.
 */
export class DesignSystem {
  palette = palette;
  typography = new Typography();
  images = new Images();
  layoutValues = new LayoutValues();
  strings = new Strings();
  loadingAnimation = Lottie.fromJson('assets/loadingAnimation.json', false);
  shadows = new Shadows();
}

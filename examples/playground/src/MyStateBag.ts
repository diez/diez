import {Color, File, FontRegistry, Haiku, Image, IOSFonts, Lottie, Palette, SVG, TextStyle} from '@diez/designsystem';
import {Component, expression, Integer, method, property, shared} from '@diez/engine';
import {easeInOutExpo} from 'just-curves';

class MyPalette extends Component<Palette> {
  @shared helloRValue!: number;
  @property hello = expression<Color>((helloRValue: number) => Color.rgba(helloRValue, 0, 0, 1));
}

export class MyStateBag extends Component {
  @property palette = new MyPalette();

  @property helloRValue = 255;

  private name = 'Diez';

  @property text = `Hello ${this.name}`;

  @property numbers: Integer[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Try changing this to `assets/images/diez`!
  @property image = Image.responsive('assets/images/haiku', 'jpg');

  @property svg = new SVG({src: 'assets/images/rat.svg'});

  @property lottie = new Lottie({
    file: new File({src: 'assets/lottie/loading-pizza.json'}),
  });

  // Makes Android fonts available on iOS.
  @property fontRegistry = FontRegistry.fromFiles(
    'assets/fonts/Roboto-Black.ttf',
    'assets/fonts/Roboto-BlackItalic.ttf',
    'assets/fonts/Roboto-Bold.ttf',
    'assets/fonts/Roboto-BoldItalic.ttf',
    'assets/fonts/Roboto-Italic.ttf',
    'assets/fonts/Roboto-Light.ttf',
    'assets/fonts/Roboto-LightItalic.ttf',
    'assets/fonts/Roboto-Medium.ttf',
    'assets/fonts/Roboto-MediumItalic.ttf',
    'assets/fonts/Roboto-Regular.ttf',
    'assets/fonts/Roboto-Thin.ttf',
    'assets/fonts/Roboto-ThinItalic.ttf',
  );

  @property textStyle = new TextStyle({
    fontName: IOSFonts.Helvetica,
    fontSize: 50,
    color: this.palette.hello,
  });

  @property haiku = new Haiku({
    component: '@haiku/taylor-testthang',
  });

  @method async tap () {
    await this.palette.hello.tween(
      {h: 0.3},
      // Default curve is linear!
      {duration: 5000},
    );
    await this.palette.hello.tween(
      // You can tween multiple values at once!
      {h: 0.9, l: 0.5},
      {
        duration: 5000,
        // You can specify any pure function (number) -> number as a curve!
        curve: easeInOutExpo,
      },
    );
    await this.palette.tween(
      // You can tween an entire component instead of its inner state!
      {hello: Color.rgba(255, 0, 0, 1)},
      {duration: 5000},
    );
  }
}

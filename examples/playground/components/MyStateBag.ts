import {Color, File, FontRegistry, Haiku, Image, IOSFonts, Lottie, Palette, SVG, TextStyle} from '@livedesigner/designsystem';
import {Component, method, property} from '@livedesigner/engine';
import {easeInOutExpo} from 'just-curves';

class MyPalette extends Component<Palette> {
  @property hello = Color.rgba(255, 0, 0, 1);
}

export class MyStateBag extends Component {
  @property palette: MyPalette = new MyPalette();

  @property name: string = 'Diez';

  @property copy = `Hello ${this.name}`;

  @property image = new Image({
    file: new File({
      // Try changing this to diez.jpg!
      src: '/assets/images/haiku.jpg',
    }),
    width: 246,
    height: 246,
    scale: 3,
  });

  @property svg = new SVG({
    file: new File({src: '/assets/images/rat.svg.html'}),
  });

  @property lottie = new Lottie({
    file: new File({src: '/assets/lottie/loading-pizza.json'}),
  });

  // Makes Android fonts available on iOS.
  @property fontRegistry = FontRegistry.fromFiles(
    '/assets/fonts/Roboto-Black.ttf',
    '/assets/fonts/Roboto-BlackItalic.ttf',
    '/assets/fonts/Roboto-Bold.ttf',
    '/assets/fonts/Roboto-BoldItalic.ttf',
    '/assets/fonts/Roboto-Italic.ttf',
    '/assets/fonts/Roboto-Light.ttf',
    '/assets/fonts/Roboto-LightItalic.ttf',
    '/assets/fonts/Roboto-Medium.ttf',
    '/assets/fonts/Roboto-MediumItalic.ttf',
    '/assets/fonts/Roboto-Regular.ttf',
    '/assets/fonts/Roboto-Thin.ttf',
    '/assets/fonts/Roboto-ThinItalic.ttf',
  );

  @property textStyle = new TextStyle({
    font: IOSFonts.Helvetica,
    fontSize: 50,
    color: this.palette.hello,
  });

  @property haiku = new Haiku({
    file: new File({src: '/assets/haiku/animator.html'}),
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

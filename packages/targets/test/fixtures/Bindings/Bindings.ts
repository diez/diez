import {Color, FontRegistry, Haiku, Image, IOSFonts, Lottie, SVG, TextStyle} from '@diez/designsystem';
import {Component, property} from '@diez/engine';

export class Bindings extends Component {
  @property image = Image.scaled('assets/image with spaces.jpg', 3, 246, 246);

  @property svg = new SVG({src: 'assets/image.svg'});

  @property lottie = Lottie.fromJson('assets/lottie.json');

  @property fontRegistry = FontRegistry.fromFiles(
    'assets/SomeFont.ttf',
  );

  @property textStyle = new TextStyle({
    fontName: IOSFonts.Helvetica,
    fontSize: 50,
    color: Color.hex('#ff0'),
  });

  @property haiku = new Haiku({
    component: 'haiku-component',
  });
}

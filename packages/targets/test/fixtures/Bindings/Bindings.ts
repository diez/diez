import {Color, FontRegistry, Haiku, Image, IOSFonts, Lottie, SVG, Typograph} from '@diez/prefabs';
import {Component, property} from '@diez/engine';

export class Bindings extends Component {
  @property image = Image.responsive('assets/image with spaces', 'jpg', 246, 246);

  @property svg = new SVG({src: 'assets/image.svg'});

  @property lottie = Lottie.fromJson('assets/lottie.json');

  @property fontRegistry = FontRegistry.fromFiles(
    'assets/SomeFont.ttf',
  );

  @property typograph = new Typograph({
    fontName: IOSFonts.Helvetica,
    fontSize: 50,
    color: Color.hex('#ff0'),
  });

  @property haiku = new Haiku({
    component: 'haiku-component',
  });
}

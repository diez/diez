import {Component, property} from '@diez/engine';
import {Color, FontRegistry, Image, IOSFonts, Lottie, Typograph} from '@diez/prefabs';

export class Bindings extends Component {
  @property image = Image.responsive('assets/image with spaces.jpg', 246, 246);

  @property lottie = Lottie.fromJson('assets/lottie.json');

  @property fontRegistry = FontRegistry.fromFiles(
    'assets/SomeFont.ttf',
  );

  @property typograph = new Typograph({
    fontName: IOSFonts.Helvetica,
    fontSize: 50,
    color: Color.hex('#ff0'),
  });
}

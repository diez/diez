import {Component, property} from '@diez/engine';
import {Color, Font, Image, Lottie, Typograph} from '@diez/prefabs';

export class Bindings extends Component {
  @property image = Image.responsive('assets/image with spaces.jpg', 246, 246);

  @property lottie = Lottie.fromJson('assets/lottie.json');

  @property typograph = new Typograph({
    font: Font.fromFile('assets/SomeFont.ttf'),
    fontSize: 50,
    color: Color.hex('#ff0'),
  });
}

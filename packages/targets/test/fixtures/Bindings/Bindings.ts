import {Component, property} from '@diez/engine';
import {Color, File, FileType, Font, Image, Lottie, Typograph} from '@diez/prefabs';

export class Bindings extends Component {
  @property image = Image.responsive('assets/image with spaces.jpg', 246, 246);

  @property lottie = Lottie.fromJson('assets/lottie.json');

  @property typograph = new Typograph({
    font: new Font({
      name: 'SomeFont',
      file: new File({src: 'assets/SomeFont.ttf', type: FileType.Font}),
      weight: 700,
      fallbacks: ['Verdana', 'serif'],
    }),
    fontSize: 50,
    color: Color.hex('#ff0'),
  });
}

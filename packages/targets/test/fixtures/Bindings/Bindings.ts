import {Component, property} from '@diez/engine';
import {Color, File, FileType, Font, Image, LinearGradient, Lottie, Point2D, Typograph} from '@diez/prefabs';

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

  @property linearGradient = LinearGradient.simpleHorizontal(Color.rgb(255, 0, 0), Color.rgb(0, 0, 255));

  @property point = Point2D.make(0.5, 0.5);
}

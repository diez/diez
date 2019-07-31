import {
  Color,
  File,
  FileType,
  Font,
  Image,
  LinearGradient,
  Lottie,
  Point2D,
  Size2D,
  Toward,
  Typograph
} from '@diez/prefabs';

export class Bindings {
  image = Image.responsive('assets/image with spaces.jpg', 246, 246);

  lottie = Lottie.fromJson('assets/lottie.json');

  typograph = new Typograph({
    font: new Font({
      name: 'SomeFont',
      file: new File({src: 'assets/SomeFont.ttf', type: FileType.Font}),
      weight: 700,
      fallbacks: ['Verdana', 'serif'],
    }),
    fontSize: 50,
    color: Color.hex('#ff0'),
  });

  linearGradient = LinearGradient.make(Toward.Right, Color.rgb(255, 0, 0), Color.rgb(0, 0, 255));

  point = Point2D.make(0.5, 0.5);

  size = Size2D.make(400, 300);
}

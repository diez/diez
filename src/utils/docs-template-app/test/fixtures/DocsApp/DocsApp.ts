import {
  Color,
  DropShadow,
  File,
  Fill,
  Image,
  LinearGradient,
  Lottie,
  Panel,
  Point2D,
  Size2D,
  Toward,
} from '@diez/prefabs';

class Palette {
  primary = new Color();
  secondary = new Color();
}

const palette = new Palette();

/**
 * This is a class-level comment in MyDesign.
 */
class MyDesign {
  /**
   * This is a property-level comment in MyDesign.size.
   */
  size = Size2D.make(400, 300);
  panel = new Panel({
    cornerRadius: 5,
    background: Fill.color(palette.primary),
    dropShadow: new DropShadow({
      offset: Point2D.make(2, 3),
      radius: 4,
      color: Color.rgb(255, 0, 0),
    }),
    elevation: 6,
  });
}

const myDesign = new MyDesign();

/**
 * This is a class-level comment in DocsApp.
 */
export class DocsApp {
  palette = palette;
  /**
   * This is a property-level comment in DocsApp.myDesign.
   */
  myDesign = myDesign;
  image = Image.responsive('assets/image with spaces.jpg', 246, 246);
  lottie = Lottie.fromJson('assets/lottie.json');
  linearGradient = LinearGradient.make(Toward.Right, Color.rgb(255, 0, 0), Color.rgb(0, 0, 255));
  point = Point2D.make(0.5, 0.5);
  fill = Fill.color(Color.rgb(255, 0, 0));
  file = new File({src: 'assets/SomeFile.txt'});
  shadow = new DropShadow({
    offset: Point2D.make(1, 2),
    radius: 3,
    color: Color.rgba(0, 255, 0, 0.5),
  });
  rawText = 'this is raw text';
  rawNumber = 2;
  rawBoolean = true;
}

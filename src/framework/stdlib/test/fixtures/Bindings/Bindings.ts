import {
  Color,
  DropShadow,
  File,
  FileType,
  Fill,
  Font,
  GoogleWebFonts,
  Image,
  LinearGradient,
  Lottie,
  Panel,
  Point2D,
  Size2D,
  TextDecoration,
  Toward,
  Typograph,
} from '@diez/prefabs';

const someFont = new Font({
  name: 'SomeFont',
  file: new File({src: 'assets/SomeFont.ttf', type: FileType.Font}),
  weight: 700,
  fallbacks: ['Verdana', 'serif'],
});

const references = {
  referencedColor: Color.hex('#101010'),
};

export const bindings = {
  image: Image.responsive('assets/image with spaces.jpg', 246, 246),

  missingImage: Image.responsive('assets/unexistent-image-fallback-test.jpg'),

  lottie: Lottie.fromJson('assets/lottie.json'),

  typograph: new Typograph({
    font: someFont,
    fontSize: 50,
    color: Color.hex('#ff0'),
  }),

  tallTypograph: new Typograph({
    font: someFont,
    fontSize: 50,
    lineHeight: 100,
    letterSpacing: 10,
    decoration: [TextDecoration.Underline, TextDecoration.Strikethrough],
  }),

  googleFontsTypograph: new Typograph({
    font: GoogleWebFonts.YesteryearRegular400,
    fontSize: 15,
    color: Color.hex('#C0FFEE'),
  }),

  linearGradient: LinearGradient.make(Toward.Right, Color.rgb(255, 0, 0), Color.rgb(0, 0, 255)),

  point: Point2D.make(0.5, 0.5),

  size: Size2D.make(400, 300),

  shadow: new DropShadow({
    offset: Point2D.make(1, 2),
    radius: 3,
    color: Color.rgba(0, 255, 0, 0.5),
  }),

  fill: Fill.color(Color.rgb(255, 0, 0)),

  panel: new Panel({
    cornerRadius: 5,
    background: Fill.color(Color.rgb(0, 0, 255)),
    dropShadow: new DropShadow({
      offset: Point2D.make(2, 3),
      radius: 4,
      color: Color.rgb(255, 0, 0),
    }),
    elevation: 6,
  }),

  color: new Color(),

  file: new File({src: 'assets/SomeFile.txt'}),

  /**
   * Referenced color value
   */
  referencedColor: references.referencedColor,
};

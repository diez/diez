import {Component, property} from '@diez/engine';
import {Color, Font, Typograph, FontStyle} from '@diez/prefabs';

const baseColors = {
  purple: Color.hex('#5623EE'),
  mauve: Color.hex('#A494D3'),
  white: Color.hex('#fff'),
  gray100: Color.hex('#FBFAFD'),
  gray400: Color.hex('#F6F5FB'),
  gray700: Color.hex('#EAE6F6'),
  gray900: Color.hex('#79738F'),
  black: Color.hex('#000010'),
}

class Palette extends Component {
  @property purple = baseColors.purple;
  @property mauve = baseColors.mauve;
  @property mauve700 = baseColors.mauve.darken(0.20);
  @property white = baseColors.white;
  @property gray100 = baseColors.gray100;
  @property gray400 = baseColors.gray400;
  @property gray700 = baseColors.gray700;
  @property gray900 = baseColors.gray900;
  @property black = baseColors.black;
  @property primary = baseColors.purple;
  @property secondary = baseColors.mauve;
  @property cardInsetShadow = baseColors.gray100;
  @property cardColor = baseColors.gray400;
  @property cardShadow = baseColors.gray700;
}

class Spacing extends Component {
  @property xxs = 2;
  @property xs = 4;
  @property sm = 8;
  @property md = 12;
  @property lg = 18;
  @property xl = 24;
  @property xxl = 32;
  @property xxxl = 44;
}

class Sizing extends Component {
  @property xxs = 60;
  @property xs = 100;
  @property sm = 200;
  @property md = 300;
  @property lg = 500;
  @property xl = 640;
  @property xxl = 860;
  @property xxxl = 1300;
}

class BorderRadius extends Component {
  @property card = 7;
  @property button = 4;
}

/**
 * A registry of all of the design's fonts.
 */
const Fonts = {
  SourceCodePro: {
    Regular: new Font({name: 'Source Code Pro', style: FontStyle.Normal, weight: 400, fallbacks: ['monospace']}),
    Black: new Font({name: 'Source Code Pro', style: FontStyle.Normal, weight: 700, fallbacks: ['monospace']}),
  },
  SourceSansPro: {
    Regular: new Font({name: 'Source Sans Pro', style: FontStyle.Normal, weight: 400}),
    Italic: new Font({name: 'Source Sans Pro', style: FontStyle.Italic, weight: 400}),
    Black: new Font({name: 'Source Sans Pro', style: FontStyle.Normal, weight: 700}),
  }
};

class Typography extends Component {
  @property headingOne = new Typograph({
    font: Fonts.SourceSansPro.Black,
    fontSize: 64,
    color: palette.black,
  });
  @property headingTwo = new Typograph({
    font: Fonts.SourceSansPro.Black,
    fontSize: 48,
    color: palette.black,
  });
  @property headingThree = new Typograph({
    font: Fonts.SourceSansPro.Regular,
    fontSize: 32,
    color: palette.black,
  });
  @property headingFour = new Typograph({
    font: Fonts.SourceSansPro.Black,
    fontSize: 23,
    color: palette.black,
  });
  @property copy = new Typograph({
    font: Fonts.SourceSansPro.Regular,
    fontSize: 16,
    color: palette.black,
  });
  @property nav = new Typograph({
    font: Fonts.SourceSansPro.Regular,
    fontSize: 20,
    color: palette.black,
  });
  @property link = new Typograph({
    font: Fonts.SourceSansPro.Black,
    fontSize: 20,
    color: palette.primary,
  });
  @property button = new Typograph({
    font: Fonts.SourceCodePro.Black,
    fontSize: 20,
    color: palette.primary,
  });
  @property logo = new Typograph({
    font: Fonts.SourceCodePro.Black,
    fontSize: 30,
    color: palette.black,
  });
  @property code = new Typograph({
    font: Fonts.SourceCodePro.Regular,
    fontSize: 16,
  });
  @property codeLarge = new Typograph({
    font: Fonts.SourceCodePro.Regular,
    fontSize: 18,
  });
  @property codeSmall = new Typograph({
    font: Fonts.SourceCodePro.Regular,
    fontSize: 15,
  });
  @property subcategory = new Typograph({
    font: Fonts.SourceSansPro.Black,
    fontSize: 16,
    color: palette.black,
  })
}

export const palette = new Palette();
export const spacing = new Spacing();
export const sizing = new Sizing();
export const borderRadius = new BorderRadius();
export const typography = new Typography();

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

class Palette {
  purple = baseColors.purple;
  mauve = baseColors.mauve;
  mauve700 = baseColors.mauve.darken(0.20);
  white = baseColors.white;
  gray100 = baseColors.gray100;
  gray400 = baseColors.gray400;
  gray700 = baseColors.gray700;
  gray900 = baseColors.gray900;
  black = baseColors.black;
  primary = baseColors.purple;
  secondary = baseColors.mauve;
  cardInsetShadow = baseColors.gray100;
  cardColor = baseColors.gray400;
  cardShadow = baseColors.gray700;
}

class Spacing {
  xxs = 2;
  xs = 4;
  sm = 8;
  md = 12;
  lg = 18;
  xl = 24;
  xxl = 32;
  xxxl = 44;
}

class Sizing {
  xxs = 60;
  xs = 100;
  sm = 200;
  md = 300;
  lg = 500;
  xl = 640;
  xxl = 860;
  xxxl = 1300;
}

class BorderRadius {
  card = 7;
  button = 4;
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

class Typography {
  headingOne = new Typograph({
    font: Fonts.SourceSansPro.Black,
    fontSize: 64,
    color: palette.black,
  });
  headingTwo = new Typograph({
    font: Fonts.SourceSansPro.Black,
    fontSize: 48,
    color: palette.black,
  });
  headingThree = new Typograph({
    font: Fonts.SourceSansPro.Regular,
    fontSize: 32,
    color: palette.black,
  });
  headingFour = new Typograph({
    font: Fonts.SourceSansPro.Black,
    fontSize: 23,
    color: palette.black,
  });
  copy = new Typograph({
    font: Fonts.SourceSansPro.Regular,
    fontSize: 16,
    color: palette.black,
  });
  nav = new Typograph({
    font: Fonts.SourceSansPro.Regular,
    fontSize: 20,
    color: palette.black,
  });
  link = new Typograph({
    font: Fonts.SourceSansPro.Black,
    fontSize: 20,
    color: palette.primary,
  });
  button = new Typograph({
    font: Fonts.SourceCodePro.Black,
    fontSize: 20,
    color: palette.primary,
  });
  logo = new Typograph({
    font: Fonts.SourceCodePro.Black,
    fontSize: 30,
    color: palette.black,
  });
  code = new Typograph({
    font: Fonts.SourceCodePro.Regular,
    fontSize: 16,
  });
  codeLarge = new Typograph({
    font: Fonts.SourceCodePro.Regular,
    fontSize: 18,
  });
  codeSmall = new Typograph({
    font: Fonts.SourceCodePro.Regular,
    fontSize: 15,
  });
}

export const palette = new Palette();
export const spacing = new Spacing();
export const sizing = new Sizing();
export const borderRadius = new BorderRadius();
export const typography = new Typography();

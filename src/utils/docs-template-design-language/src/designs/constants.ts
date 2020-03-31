import {Color, DropShadow, Fill, Font, FontStyle, Point2D, Typograph} from '@diez/prefabs';

class Colors {
  babyPurple = Color.hex('#EAE8F6');
  purple = Color.hex('#B6A7DE');
  electricViolet = Color.hex('#5623EE');
  mauve = Color.hex('#A494D3');
  white = Color.hex('#fff');
  gray100 = Color.hex('#FBFAFD');
  gray400 = Color.hex('#F7F6FA');
  gray500 = Color.hex('#EAEAED');
  gray700 = Color.hex('#D8D8D8');
  gray800 = Color.hex('#79738F');
  gray900 = Color.hex('#484262');
  black = Color.hex('#000010');
}

const baseColors = new Colors();

class Palette {
  electricViolet =  baseColors.electricViolet;
  primary = baseColors.purple;
  primaryFill = baseColors.white;
  secondaryFill = baseColors.gray400;
  secondary = baseColors.babyPurple;
  contrastFill = baseColors.gray900;
  subtleFill = baseColors.gray400.darken(0.04);
  primaryBorder = baseColors.gray500;
  primaryBorderAccent = baseColors.gray700;
  primaryText = baseColors.black;
  contrastText = baseColors.gray900.darken(.25);
  secondaryText = baseColors.gray900;
  tertiaryText = baseColors.gray800;
}

/**
 * A palette singleton, used throughout the design language.
 */
export const palette = new Palette();

class Fills {
  primary = new Fill({color: palette.primaryFill});
  secondary = new Fill({color: palette.secondaryFill});
  subtle = new Fill({color: palette.subtleFill});
  contrast = new Fill({color: palette.contrastFill});
}

/**
 * Collection of fills.
 */
export const fills = new Fills();

class Spacings {
  xxs = 2;
  xs = 4;
  sm = 8;
  md = 12;
  lg = 18;
  xl = 24;
  xxl = 32;
  xxxl = 44;
}

/**
 * Singleton containing commonly used values for spacing elements.
 */
export const spacings = new Spacings();

class Sizings {
  xxs = 15;
  xs = 30;
  sm = 70;
  md = 90;
  lg = 180;
  xl = 360;
  xxl = 860;
  xxxl = 1300;
}

/**
 * Singleton containing commonly used values for sizing elements.
 */
export const sizings = new Sizings();

class Animations {
  hover = '120ms ease-out';
}

/**
 * Singleton containing commonly used animation timing values.
 */
export const animations = new Animations();

class Shadows {
  base = new DropShadow({
    offset: Point2D.make(0, 2),
    radius: 10,
    color: baseColors.black.fade(0.75),
  });

  popover = new DropShadow({
    offset: Point2D.make(0, 4),
    radius: 21,
    color: baseColors.gray900.fade(0.75),
  });

  transparent = new DropShadow({color: new Color({a: 0})});
}

/**
 * Singleton containing shadows.
 */
export const shadows = new Shadows();

class Fonts {
  SourceCodePro = {
    Regular: new Font({name: 'Source Code Pro', style: FontStyle.Normal, weight: 400, fallbacks: ['monospace']}),
    Black: new Font({name: 'Source Code Pro', style: FontStyle.Normal, weight: 700, fallbacks: ['monospace']}),
  };
  SourceSansPro = {
    Regular: new Font({name: 'Source Sans Pro', style: FontStyle.Normal, weight: 400}),
    Italic: new Font({name: 'Source Sans Pro', style: FontStyle.Italic, weight: 400}),
    Black: new Font({name: 'Source Sans Pro', style: FontStyle.Normal, weight: 700}),
  };
}

const fonts = new Fonts();

class FontSizes {
  xxxl = 42;
  xxl = 30;
  xl = 23;
  lg = 16;
  md = 14;
  sm = 12;
}

const fontSizes = new FontSizes();

class Typography {
  headingOne = new Typograph({
    font: fonts.SourceSansPro.Regular,
    fontSize: fontSizes.xxxl,
    color: palette.primaryText,
  });
  headingTwo = new Typograph({
    font: fonts.SourceSansPro.Regular,
    fontSize: fontSizes.xxl,
    color: palette.primaryText,
  });
  headingThree = new Typograph({
    font: fonts.SourceSansPro.Black,
    fontSize: fontSizes.xl,
    color: palette.primaryText,
  });
  headingFour = new Typograph({
    font: fonts.SourceSansPro.Black,
    fontSize: fontSizes.lg,
    color: palette.primaryText,
  });
  copy = new Typograph({
    font: fonts.SourceSansPro.Regular,
    fontSize: fontSizes.lg,
    color: palette.primaryText,
  });
  link = new Typograph({
    font: fonts.SourceSansPro.Black,
    fontSize: fontSizes.lg,
    color: palette.primary,
  });
  code = new Typograph({
    font: fonts.SourceCodePro.Regular,
    fontSize: fontSizes.lg,
  });
  copyItalic = new Typograph({
    font: fonts.SourceSansPro.Italic,
    fontSize: fontSizes.lg,
    color: palette.tertiaryText,
  });
  button = new Typograph({
    font: fonts.SourceCodePro.Black,
    fontSize: fontSizes.md,
    color: palette.primary,
  });
  mediumBlack = new Typograph({
    font: fonts.SourceSansPro.Black,
    fontSize: fontSizes.md,
    color: palette.secondaryText,
  });
  small = new Typograph({
    font: fonts.SourceSansPro.Black,
    fontSize: fontSizes.sm,
    color: palette.secondaryText,
  });
}

/**
 * Singleton with typography definitions.
 */
export const typography = new Typography();

class CornerRadii {
  base = 4;
}

/**
 * Singleton containing standard corner radius values.
 */
export const cornerRadii = new CornerRadii();

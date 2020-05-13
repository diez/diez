import {prefab, Target} from '@diez/engine';
import {Color} from './color';
import {Font} from './font';

/**
 * An enumeration of the supported iOS `UIFont.TextStyle`s.
 */
export const enum IOSTextStyle {
  Body = 'body',
  Callout = 'callout',
  Caption1 = 'caption1',
  Caption2 = 'caption2',
  Footnote = 'footnote',
  Headline = 'headline',
  Subheadline = 'subheadline',
  LargeTitle = 'largeTitle',
  Title1 = 'title1',
  Title2 = 'title2',
  Title3 = 'title3',
}

/**
 * An enumeration of text alignment types.
 */
export const enum TextAlignment {
  /**
   * Aligns according to the system's default for the current language.
   */
  Natural = 'natural',
  Left = 'left',
  Right = 'right',
  Center = 'center',
}

/**
 * An enumerated list of text decorations.
 */
export const enum TextDecoration {
  Underline = 'underline',
  Strikethrough = 'strikethrough',
}

/**
 * Typograph data.
 */
export interface TypographData {
  /**
   * The `Font` of the `Typograph`.
   */
  font: Font;
  /**
   * Negative values will be sanatized to `0`.
   */
  fontSize: number;
  /**
   * The `Color` of the `Typograph`.
   */
  color: Color;
  /**
   * The iOS `UIFont.TextStyle` of the `Typograph` (iOS only).
   */
  iosTextStyle: IOSTextStyle;
  /**
   * Indicates whether the `Typograph` should scale with the system's accessibility settings (iOS and Android only).
   */
  shouldScale: boolean;
  /**
   * The desired line height in density independent pixels.
   *
   * A value of `-1` will be treated as if the value is not set.
   *
   * Negative values (other than `-1`) will be sanatized to `0`.
   *
   * This value will be scaled according to `shouldScale`.
   *
   * TODO: Use optionality on `lineHeight` instead when it is supported by the compiler.
   */
  lineHeight: number;
  /**
   * The amount to increase/decrease the spacing between letters in density independent pixels.
   *
   * This value will be scaled according to `shouldScale`.
   */
  letterSpacing: number;
  /**
   * The alignment of the text.
   */
  alignment: TextAlignment;
  /**
   * A list of `TextDecoration`s to apply to the `Typograph`.
   */
  decoration: TextDecoration[];
}

/**
 * Describes a typograph including specification of a font name (understood to specify both a font face and a font
 * weight) as well as a font size in device-local units and a font color.
 *
 * @noinheritdoc
 */
export class Typograph extends prefab<TypographData>() {
  defaults = {
    font: new Font(),
    fontSize: 12,
    color: Color.hsla(0, 0, 0, 1),
    iosTextStyle: IOSTextStyle.Body,
    shouldScale: false,
    lineHeight: -1,
    letterSpacing: 0,
    alignment: TextAlignment.Natural,
    decoration: [],
  };

  options = {
    iosTextStyle: {targets: [Target.Ios]},
    shouldScale: {targets: [Target.Ios, Target.Android]},
  };

  sanitize (data: TypographData) {
    if (data.lineHeight < 0 && data.lineHeight !== -1) {
      data.lineHeight = 0;
    }

    if (data.fontSize < 0) {
      data.fontSize = 0;
    }

    return data;
  }
}

export * from './resources/android-fonts';
export * from './resources/ios-fonts';
export * from './resources/web-google-fonts';

import {prefab, Target} from '@diez/engine';
import {Color} from './color';
import {File, FileType} from './file';

/**
 * Valid face forms for `@font-face` declarations in web.
 */
export const enum FontStyle {
  Normal = 'normal',
  Italic = 'italic',
}

const inferNameFromPath = (src: string) => {
  const pathComponents = src.split('/');
  const filename = pathComponents.pop() || '';
  return filename.slice(0, filename.lastIndexOf('.'));
};

/**
 * Font data.
 */
export interface FontData {
  /**
   * The font file containing the font's definition. Due to target limitations, the file _must_ be a TrueType file
   * with a `.ttf` extension or an OpenType file with an `.otf` extension.
   */
  file: File;
  /**
   * The exact, correct PostScript name of the font.
   */
  name: string;
  /**
   * An array of fallback fonts (web only).
   */
  fallbacks: string[];
  /**
   * The weight or boldness of the font (web only).
   */
  weight: number;
  /**
   * The font style (web only).
   */
  style: FontStyle;
}

/**
 * A representation of a font resource, with a reference to a [[File]] containing a TTF or OTF font file.
 * @noinheritdoc
 */
export class Font extends prefab<FontData>() {
  defaults = {
    file: new File({type: FileType.Font}),
    name: '',
    fallbacks: ['sans-serif'],
    weight: 400,
    style: FontStyle.Normal,
  };

  options = {
    fallbacks: {targets: [Target.Web]},
    weight: {targets: [Target.Web]},
    style: {targets: [Target.Web]},
  };

  /**
   * Creates a Font component from a source file and its PostScript name.
   *
   * @param src - The relative path of the font file.
   * @param postscriptName - The correct PostScript name of the font contained by the font file. If blank, it is assumed
   *   the correct name is assumed to be the base name of the file minus its extension.
   */
  static fromFile (src: string, postscriptName?: string) {
    const name = (postscriptName === undefined) ? inferNameFromPath(src) : postscriptName;

    return new this({name, file: new File({src, type: FileType.Font})});
  }
}

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
 * Typograph data.
 */
export interface TypographData {
  font: Font;
  /**
   * Negative values will be sanatized to `0`.
   */
  fontSize: number;
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

/**
 * As a convenience, this enumeration provides the names of all the core fonts supported on iOS.
 */
export const IOSFonts = {
  AcademyEngravedLetPlain: new Font({name: 'AcademyEngravedLetPlain'}),
  AlNile: new Font({name: 'AlNile'}),
  AlNileBold: new Font({name: 'AlNile-Bold'}),
  AmericanTypewriter: new Font({name: 'AmericanTypewriter'}),
  AmericanTypewriterBold: new Font({name: 'AmericanTypewriter-Bold'}),
  AmericanTypewriterCondensed: new Font({name: 'AmericanTypewriter-Condensed'}),
  AmericanTypewriterCondensedBold: new Font({name: 'AmericanTypewriter-CondensedBold'}),
  AmericanTypewriterCondensedLight: new Font({name: 'AmericanTypewriter-CondensedLight'}),
  AmericanTypewriterLight: new Font({name: 'AmericanTypewriter-Light'}),
  AmericanTypewriterSemibold: new Font({name: 'AmericanTypewriter-Semibold'}),
  AppleColorEmoji: new Font({name: 'AppleColorEmoji'}),
  AppleSDGothicNeoBold: new Font({name: 'AppleSDGothicNeo-Bold'}),
  AppleSDGothicNeoLight: new Font({name: 'AppleSDGothicNeo-Light'}),
  AppleSDGothicNeoMedium: new Font({name: 'AppleSDGothicNeo-Medium'}),
  AppleSDGothicNeoRegular: new Font({name: 'AppleSDGothicNeo-Regular'}),
  AppleSDGothicNeoSemiBold: new Font({name: 'AppleSDGothicNeo-SemiBold'}),
  AppleSDGothicNeoThin: new Font({name: 'AppleSDGothicNeo-Thin'}),
  AppleSDGothicNeoUltraLight: new Font({name: 'AppleSDGothicNeo-UltraLight'}),
  ArialBoldItalicMT: new Font({name: 'Arial-BoldItalicMT'}),
  ArialBoldMT: new Font({name: 'Arial-BoldMT'}),
  ArialHebrew: new Font({name: 'ArialHebrew'}),
  ArialHebrewBold: new Font({name: 'ArialHebrew-Bold'}),
  ArialHebrewLight: new Font({name: 'ArialHebrew-Light'}),
  ArialItalicMT: new Font({name: 'Arial-ItalicMT'}),
  ArialMT: new Font({name: 'ArialMT'}),
  ArialRoundedMTBold: new Font({name: 'ArialRoundedMTBold'}),
  AvenirBlack: new Font({name: 'Avenir-Black'}),
  AvenirBlackOblique: new Font({name: 'Avenir-BlackOblique'}),
  AvenirBook: new Font({name: 'Avenir-Book'}),
  AvenirBookOblique: new Font({name: 'Avenir-BookOblique'}),
  AvenirHeavy: new Font({name: 'Avenir-Heavy'}),
  AvenirHeavyOblique: new Font({name: 'Avenir-HeavyOblique'}),
  AvenirLight: new Font({name: 'Avenir-Light'}),
  AvenirLightOblique: new Font({name: 'Avenir-LightOblique'}),
  AvenirMedium: new Font({name: 'Avenir-Medium'}),
  AvenirMediumOblique: new Font({name: 'Avenir-MediumOblique'}),
  AvenirNextBold: new Font({name: 'AvenirNext-Bold'}),
  AvenirNextBoldItalic: new Font({name: 'AvenirNext-BoldItalic'}),
  AvenirNextCondensedBold: new Font({name: 'AvenirNextCondensed-Bold'}),
  AvenirNextCondensedBoldItalic: new Font({name: 'AvenirNextCondensed-BoldItalic'}),
  AvenirNextCondensedDemiBold: new Font({name: 'AvenirNextCondensed-DemiBold'}),
  AvenirNextCondensedDemiBoldItalic: new Font({name: 'AvenirNextCondensed-DemiBoldItalic'}),
  AvenirNextCondensedHeavy: new Font({name: 'AvenirNextCondensed-Heavy'}),
  AvenirNextCondensedHeavyItalic: new Font({name: 'AvenirNextCondensed-HeavyItalic'}),
  AvenirNextCondensedItalic: new Font({name: 'AvenirNextCondensed-Italic'}),
  AvenirNextCondensedMedium: new Font({name: 'AvenirNextCondensed-Medium'}),
  AvenirNextCondensedMediumItalic: new Font({name: 'AvenirNextCondensed-MediumItalic'}),
  AvenirNextCondensedRegular: new Font({name: 'AvenirNextCondensed-Regular'}),
  AvenirNextCondensedUltraLight: new Font({name: 'AvenirNextCondensed-UltraLight'}),
  AvenirNextCondensedUltraLightItalic: new Font({name: 'AvenirNextCondensed-UltraLightItalic'}),
  AvenirNextDemiBold: new Font({name: 'AvenirNext-DemiBold'}),
  AvenirNextDemiBoldItalic: new Font({name: 'AvenirNext-DemiBoldItalic'}),
  AvenirNextHeavy: new Font({name: 'AvenirNext-Heavy'}),
  AvenirNextHeavyItalic: new Font({name: 'AvenirNext-HeavyItalic'}),
  AvenirNextItalic: new Font({name: 'AvenirNext-Italic'}),
  AvenirNextMedium: new Font({name: 'AvenirNext-Medium'}),
  AvenirNextMediumItalic: new Font({name: 'AvenirNext-MediumItalic'}),
  AvenirNextRegular: new Font({name: 'AvenirNext-Regular'}),
  AvenirNextUltraLight: new Font({name: 'AvenirNext-UltraLight'}),
  AvenirNextUltraLightItalic: new Font({name: 'AvenirNext-UltraLightItalic'}),
  AvenirOblique: new Font({name: 'Avenir-Oblique'}),
  AvenirRoman: new Font({name: 'Avenir-Roman'}),
  Baskerville: new Font({name: 'Baskerville'}),
  BaskervilleBold: new Font({name: 'Baskerville-Bold'}),
  BaskervilleBoldItalic: new Font({name: 'Baskerville-BoldItalic'}),
  BaskervilleItalic: new Font({name: 'Baskerville-Italic'}),
  BaskervilleSemiBold: new Font({name: 'Baskerville-SemiBold'}),
  BaskervilleSemiBoldItalic: new Font({name: 'Baskerville-SemiBoldItalic'}),
  BodoniOrnamentsITCTT: new Font({name: 'BodoniOrnamentsITCTT'}),
  BodoniSvtyTwoITCTTBold: new Font({name: 'BodoniSvtyTwoITCTT-Bold'}),
  BodoniSvtyTwoITCTTBook: new Font({name: 'BodoniSvtyTwoITCTT-Book'}),
  BodoniSvtyTwoITCTTBookIta: new Font({name: 'BodoniSvtyTwoITCTT-BookIta'}),
  BodoniSvtyTwoOSITCTTBold: new Font({name: 'BodoniSvtyTwoOSITCTT-Bold'}),
  BodoniSvtyTwoOSITCTTBook: new Font({name: 'BodoniSvtyTwoOSITCTT-Book'}),
  BodoniSvtyTwoOSITCTTBookIt: new Font({name: 'BodoniSvtyTwoOSITCTT-BookIt'}),
  BodoniSvtyTwoSCITCTTBook: new Font({name: 'BodoniSvtyTwoSCITCTT-Book'}),
  BradleyHandITCTTBold: new Font({name: 'BradleyHandITCTT-Bold'}),
  ChalkboardSEBold: new Font({name: 'ChalkboardSE-Bold'}),
  ChalkboardSELight: new Font({name: 'ChalkboardSE-Light'}),
  ChalkboardSERegular: new Font({name: 'ChalkboardSE-Regular'}),
  Chalkduster: new Font({name: 'Chalkduster'}),
  CharterBlack: new Font({name: 'Charter-Black'}),
  CharterBlackItalic: new Font({name: 'Charter-BlackItalic'}),
  CharterBold: new Font({name: 'Charter-Bold'}),
  CharterBoldItalic: new Font({name: 'Charter-BoldItalic'}),
  CharterItalic: new Font({name: 'Charter-Italic'}),
  CharterRoman: new Font({name: 'Charter-Roman'}),
  Cochin: new Font({name: 'Cochin'}),
  CochinBold: new Font({name: 'Cochin-Bold'}),
  CochinBoldItalic: new Font({name: 'Cochin-BoldItalic'}),
  CochinItalic: new Font({name: 'Cochin-Italic'}),
  Copperplate: new Font({name: 'Copperplate'}),
  CopperplateBold: new Font({name: 'Copperplate-Bold'}),
  CopperplateLight: new Font({name: 'Copperplate-Light'}),
  Courier: new Font({name: 'Courier'}),
  CourierBold: new Font({name: 'Courier-Bold'}),
  CourierBoldOblique: new Font({name: 'Courier-BoldOblique'}),
  CourierNewPSBoldItalicMT: new Font({name: 'CourierNewPS-BoldItalicMT'}),
  CourierNewPSBoldMT: new Font({name: 'CourierNewPS-BoldMT'}),
  CourierNewPSItalicMT: new Font({name: 'CourierNewPS-ItalicMT'}),
  CourierNewPSMT: new Font({name: 'CourierNewPSMT'}),
  CourierOblique: new Font({name: 'Courier-Oblique'}),
  Damascus: new Font({name: 'Damascus'}),
  DamascusBold: new Font({name: 'DamascusBold'}),
  DamascusLight: new Font({name: 'DamascusLight'}),
  DamascusMedium: new Font({name: 'DamascusMedium'}),
  DamascusSemiBold: new Font({name: 'DamascusSemiBold'}),
  DevanagariSangamMN: new Font({name: 'DevanagariSangamMN'}),
  DevanagariSangamMNBold: new Font({name: 'DevanagariSangamMN-Bold'}),
  Didot: new Font({name: 'Didot'}),
  DidotBold: new Font({name: 'Didot-Bold'}),
  DidotItalic: new Font({name: 'Didot-Italic'}),
  DINAlternateBold: new Font({name: 'DINAlternate-Bold'}),
  DINCondensedBold: new Font({name: 'DINCondensed-Bold'}),
  DiwanMishafi: new Font({name: 'DiwanMishafi'}),
  EuphemiaUCAS: new Font({name: 'EuphemiaUCAS'}),
  EuphemiaUCASBold: new Font({name: 'EuphemiaUCAS-Bold'}),
  EuphemiaUCASItalic: new Font({name: 'EuphemiaUCAS-Italic'}),
  Farah: new Font({name: 'Farah'}),
  FuturaBold: new Font({name: 'Futura-Bold'}),
  FuturaCondensedExtraBold: new Font({name: 'Futura-CondensedExtraBold'}),
  FuturaCondensedMedium: new Font({name: 'Futura-CondensedMedium'}),
  FuturaMedium: new Font({name: 'Futura-Medium'}),
  FuturaMediumItalic: new Font({name: 'Futura-MediumItalic'}),
  GeezaPro: new Font({name: 'GeezaPro'}),
  GeezaProBold: new Font({name: 'GeezaPro-Bold'}),
  Georgia: new Font({name: 'Georgia'}),
  GeorgiaBold: new Font({name: 'Georgia-Bold'}),
  GeorgiaBoldItalic: new Font({name: 'Georgia-BoldItalic'}),
  GeorgiaItalic: new Font({name: 'Georgia-Italic'}),
  GillSans: new Font({name: 'GillSans'}),
  GillSansBold: new Font({name: 'GillSans-Bold'}),
  GillSansBoldItalic: new Font({name: 'GillSans-BoldItalic'}),
  GillSansItalic: new Font({name: 'GillSans-Italic'}),
  GillSansLight: new Font({name: 'GillSans-Light'}),
  GillSansLightItalic: new Font({name: 'GillSans-LightItalic'}),
  GillSansSemiBold: new Font({name: 'GillSans-SemiBold'}),
  GillSansSemiBoldItalic: new Font({name: 'GillSans-SemiBoldItalic'}),
  GillSansUltraBold: new Font({name: 'GillSans-UltraBold'}),
  GujaratiSangamMN: new Font({name: 'GujaratiSangamMN'}),
  GujaratiSangamMNBold: new Font({name: 'GujaratiSangamMN-Bold'}),
  GurmukhiMN: new Font({name: 'GurmukhiMN'}),
  GurmukhiMNBold: new Font({name: 'GurmukhiMN-Bold'}),
  Helvetica: new Font({name: 'Helvetica'}),
  HelveticaBold: new Font({name: 'Helvetica-Bold'}),
  HelveticaBoldOblique: new Font({name: 'Helvetica-BoldOblique'}),
  HelveticaLight: new Font({name: 'Helvetica-Light'}),
  HelveticaLightOblique: new Font({name: 'Helvetica-LightOblique'}),
  HelveticaNeue: new Font({name: 'HelveticaNeue'}),
  HelveticaNeueBold: new Font({name: 'HelveticaNeue-Bold'}),
  HelveticaNeueBoldItalic: new Font({name: 'HelveticaNeue-BoldItalic'}),
  HelveticaNeueCondensedBlack: new Font({name: 'HelveticaNeue-CondensedBlack'}),
  HelveticaNeueCondensedBold: new Font({name: 'HelveticaNeue-CondensedBold'}),
  HelveticaNeueItalic: new Font({name: 'HelveticaNeue-Italic'}),
  HelveticaNeueLight: new Font({name: 'HelveticaNeue-Light'}),
  HelveticaNeueLightItalic: new Font({name: 'HelveticaNeue-LightItalic'}),
  HelveticaNeueMedium: new Font({name: 'HelveticaNeue-Medium'}),
  HelveticaNeueMediumItalic: new Font({name: 'HelveticaNeue-MediumItalic'}),
  HelveticaNeueThin: new Font({name: 'HelveticaNeue-Thin'}),
  HelveticaNeueThinItalic: new Font({name: 'HelveticaNeue-ThinItalic'}),
  HelveticaNeueUltraLight: new Font({name: 'HelveticaNeue-UltraLight'}),
  HelveticaNeueUltraLightItalic: new Font({name: 'HelveticaNeue-UltraLightItalic'}),
  HelveticaOblique: new Font({name: 'Helvetica-Oblique'}),
  HiraginoSansW3: new Font({name: 'HiraginoSans-W3'}),
  HiraginoSansW6: new Font({name: 'HiraginoSans-W6'}),
  HiraMaruProNW4: new Font({name: 'HiraMaruProN-W4'}),
  HiraMinProNW3: new Font({name: 'HiraMinProN-W3'}),
  HiraMinProNW6: new Font({name: 'HiraMinProN-W6'}),
  HoeflerTextBlack: new Font({name: 'HoeflerText-Black'}),
  HoeflerTextBlackItalic: new Font({name: 'HoeflerText-BlackItalic'}),
  HoeflerTextItalic: new Font({name: 'HoeflerText-Italic'}),
  HoeflerTextRegular: new Font({name: 'HoeflerText-Regular'}),
  Kailasa: new Font({name: 'Kailasa'}),
  KailasaBold: new Font({name: 'Kailasa-Bold'}),
  KannadaSangamMN: new Font({name: 'KannadaSangamMN'}),
  KannadaSangamMNBold: new Font({name: 'KannadaSangamMN-Bold'}),
  KefaRegular: new Font({name: 'Kefa-Regular'}),
  KhmerSangamMN: new Font({name: 'KhmerSangamMN'}),
  KohinoorBanglaLight: new Font({name: 'KohinoorBangla-Light'}),
  KohinoorBanglaRegular: new Font({name: 'KohinoorBangla-Regular'}),
  KohinoorBanglaSemibold: new Font({name: 'KohinoorBangla-Semibold'}),
  KohinoorDevanagariLight: new Font({name: 'KohinoorDevanagari-Light'}),
  KohinoorDevanagariRegular: new Font({name: 'KohinoorDevanagari-Regular'}),
  KohinoorDevanagariSemibold: new Font({name: 'KohinoorDevanagari-Semibold'}),
  KohinoorTeluguLight: new Font({name: 'KohinoorTelugu-Light'}),
  KohinoorTeluguMedium: new Font({name: 'KohinoorTelugu-Medium'}),
  KohinoorTeluguRegular: new Font({name: 'KohinoorTelugu-Regular'}),
  LaoSangamMN: new Font({name: 'LaoSangamMN'}),
  MalayalamSangamMN: new Font({name: 'MalayalamSangamMN'}),
  MalayalamSangamMNBold: new Font({name: 'MalayalamSangamMN-Bold'}),
  MarkerFeltThin: new Font({name: 'MarkerFelt-Thin'}),
  MarkerFeltWide: new Font({name: 'MarkerFelt-Wide'}),
  MenloBold: new Font({name: 'Menlo-Bold'}),
  MenloBoldItalic: new Font({name: 'Menlo-BoldItalic'}),
  MenloItalic: new Font({name: 'Menlo-Italic'}),
  MenloRegular: new Font({name: 'Menlo-Regular'}),
  MyanmarSangamMN: new Font({name: 'MyanmarSangamMN'}),
  MyanmarSangamMNBold: new Font({name: 'MyanmarSangamMN-Bold'}),
  NoteworthyBold: new Font({name: 'Noteworthy-Bold'}),
  NoteworthyLight: new Font({name: 'Noteworthy-Light'}),
  NotoNastaliqUrdu: new Font({name: 'NotoNastaliqUrdu'}),
  NotoSansChakmaRegular: new Font({name: 'NotoSansChakma-Regular'}),
  OptimaBold: new Font({name: 'Optima-Bold'}),
  OptimaBoldItalic: new Font({name: 'Optima-BoldItalic'}),
  OptimaExtraBlack: new Font({name: 'Optima-ExtraBlack'}),
  OptimaItalic: new Font({name: 'Optima-Italic'}),
  OptimaRegular: new Font({name: 'Optima-Regular'}),
  OriyaSangamMN: new Font({name: 'OriyaSangamMN'}),
  OriyaSangamMNBold: new Font({name: 'OriyaSangamMN-Bold'}),
  PalatinoBold: new Font({name: 'Palatino-Bold'}),
  PalatinoBoldItalic: new Font({name: 'Palatino-BoldItalic'}),
  PalatinoItalic: new Font({name: 'Palatino-Italic'}),
  PalatinoRoman: new Font({name: 'Palatino-Roman'}),
  Papyrus: new Font({name: 'Papyrus'}),
  PapyrusCondensed: new Font({name: 'Papyrus-Condensed'}),
  PartyLetPlain: new Font({name: 'PartyLetPlain'}),
  PingFangHKLight: new Font({name: 'PingFangHK-Light'}),
  PingFangHKMedium: new Font({name: 'PingFangHK-Medium'}),
  PingFangHKRegular: new Font({name: 'PingFangHK-Regular'}),
  PingFangHKSemibold: new Font({name: 'PingFangHK-Semibold'}),
  PingFangHKThin: new Font({name: 'PingFangHK-Thin'}),
  PingFangHKUltralight: new Font({name: 'PingFangHK-Ultralight'}),
  PingFangSCLight: new Font({name: 'PingFangSC-Light'}),
  PingFangSCMedium: new Font({name: 'PingFangSC-Medium'}),
  PingFangSCRegular: new Font({name: 'PingFangSC-Regular'}),
  PingFangSCSemibold: new Font({name: 'PingFangSC-Semibold'}),
  PingFangSCThin: new Font({name: 'PingFangSC-Thin'}),
  PingFangSCUltralight: new Font({name: 'PingFangSC-Ultralight'}),
  PingFangTCLight: new Font({name: 'PingFangTC-Light'}),
  PingFangTCMedium: new Font({name: 'PingFangTC-Medium'}),
  PingFangTCRegular: new Font({name: 'PingFangTC-Regular'}),
  PingFangTCSemibold: new Font({name: 'PingFangTC-Semibold'}),
  PingFangTCThin: new Font({name: 'PingFangTC-Thin'}),
  PingFangTCUltralight: new Font({name: 'PingFangTC-Ultralight'}),
  RockwellBold: new Font({name: 'Rockwell-Bold'}),
  RockwellBoldItalic: new Font({name: 'Rockwell-BoldItalic'}),
  RockwellItalic: new Font({name: 'Rockwell-Italic'}),
  RockwellRegular: new Font({name: 'Rockwell-Regular'}),
  SavoyeLetPlain: new Font({name: 'SavoyeLetPlain'}),
  SinhalaSangamMN: new Font({name: 'SinhalaSangamMN'}),
  SinhalaSangamMNBold: new Font({name: 'SinhalaSangamMN-Bold'}),
  SnellRoundhand: new Font({name: 'SnellRoundhand'}),
  SnellRoundhandBlack: new Font({name: 'SnellRoundhand-Black'}),
  SnellRoundhandBold: new Font({name: 'SnellRoundhand-Bold'}),
  Symbol: new Font({name: 'Symbol'}),
  TamilSangamMN: new Font({name: 'TamilSangamMN'}),
  TamilSangamMNBold: new Font({name: 'TamilSangamMN-Bold'}),
  Thonburi: new Font({name: 'Thonburi'}),
  ThonburiBold: new Font({name: 'Thonburi-Bold'}),
  ThonburiLight: new Font({name: 'Thonburi-Light'}),
  TimesNewRomanPSBoldItalicMT: new Font({name: 'TimesNewRomanPS-BoldItalicMT'}),
  TimesNewRomanPSBoldMT: new Font({name: 'TimesNewRomanPS-BoldMT'}),
  TimesNewRomanPSItalicMT: new Font({name: 'TimesNewRomanPS-ItalicMT'}),
  TimesNewRomanPSMT: new Font({name: 'TimesNewRomanPSMT'}),
  TrebuchetBoldItalic: new Font({name: 'Trebuchet-BoldItalic'}),
  TrebuchetMS: new Font({name: 'TrebuchetMS'}),
  TrebuchetMSBold: new Font({name: 'TrebuchetMS-Bold'}),
  TrebuchetMSItalic: new Font({name: 'TrebuchetMS-Italic'}),
  Verdana: new Font({name: 'Verdana'}),
  VerdanaBold: new Font({name: 'Verdana-Bold'}),
  VerdanaBoldItalic: new Font({name: 'Verdana-BoldItalic'}),
  VerdanaItalic: new Font({name: 'Verdana-Italic'}),
  ZapfDingbatsITC: new Font({name: 'ZapfDingbatsITC'}),
  Zapfino: new Font({name: 'Zapfino'}),
};

/**
 * As a convenience, this enumeration provides the names of all the core fonts supported on Android.
 */
export const AndroidFonts = {
  CarroisGothicSCRegular: new Font({name: 'CarroisGothicSC-Regular'}),
  ComingSoon: new Font({name: 'ComingSoon'}),
  CutiveMono: new Font({name: 'CutiveMono'}),
  DancingScriptBold: new Font({name: 'DancingScript-Bold'}),
  DancingScriptRegular: new Font({name: 'DancingScript-Regular'}),
  DroidSansMono: new Font({name: 'DroidSansMono'}),
  NotoSerifBold: new Font({name: 'NotoSerif-Bold'}),
  NotoSerifBoldItalic: new Font({name: 'NotoSerif-BoldItalic'}),
  NotoSerifItalic: new Font({name: 'NotoSerif-Italic'}),
  NotoSerifRegular: new Font({name: 'NotoSerif-Regular'}),
  RobotoBlack: new Font({name: 'Roboto-Black'}),
  RobotoBlackItalic: new Font({name: 'Roboto-BlackItalic'}),
  RobotoBold: new Font({name: 'Roboto-Bold'}),
  RobotoBoldItalic: new Font({name: 'Roboto-BoldItalic'}),
  RobotoCondensedBold: new Font({name: 'RobotoCondensed-Bold'}),
  RobotoCondensedBoldItalic: new Font({name: 'RobotoCondensed-BoldItalic'}),
  RobotoCondensedItalic: new Font({name: 'RobotoCondensed-Italic'}),
  RobotoCondensedLight: new Font({name: 'RobotoCondensed-Light'}),
  RobotoCondensedLightItalic: new Font({name: 'RobotoCondensed-LightItalic'}),
  RobotoCondensedMedium: new Font({name: 'RobotoCondensed-Medium'}),
  RobotoCondensedMediumItalic: new Font({name: 'RobotoCondensed-MediumItalic'}),
  RobotoCondensedRegular: new Font({name: 'RobotoCondensed-Regular'}),
  RobotoItalic: new Font({name: 'Roboto-Italic'}),
  RobotoLight: new Font({name: 'Roboto-Light'}),
  RobotoLightItalic: new Font({name: 'Roboto-LightItalic'}),
  RobotoMedium: new Font({name: 'Roboto-Medium'}),
  RobotoMediumItalic: new Font({name: 'Roboto-MediumItalic'}),
  RobotoRegular: new Font({name: 'Roboto-Regular'}),
  RobotoThin: new Font({name: 'Roboto-Thin'}),
  RobotoThinItalic: new Font({name: 'Roboto-ThinItalic'}),
};

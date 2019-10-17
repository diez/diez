import {Color, IOSTextStyle, Font, Typograph, TextDecoration} from '@diez/prefabs';

const Fonts = {
  Nunito: {
    Regular: Font.fromFile('assets/fonts/Nunito-Regular.ttf'),
    Black: Font.fromFile('assets/fonts/Nunito-Black.ttf'),
    BlackItalic: Font.fromFile('assets/fonts/Nunito-BlackItalic.ttf'),
    Bold: Font.fromFile('assets/fonts/Nunito-Bold.ttf'),
    BoldItalic: Font.fromFile('assets/fonts/Nunito-BoldItalic.ttf'),
    ExtraBold: Font.fromFile('assets/fonts/Nunito-ExtraBold.ttf'),
    ExtraBoldItalic: Font.fromFile('assets/fonts/Nunito-ExtraBoldItalic.ttf'),
    ExtraLight: Font.fromFile('assets/fonts/Nunito-ExtraLight.ttf'),
    ExtraLightItalic: Font.fromFile('assets/fonts/Nunito-ExtraLightItalic.ttf'),
    Italic: Font.fromFile('assets/fonts/Nunito-Italic.ttf'),
    Light: Font.fromFile('assets/fonts/Nunito-Light.ttf'),
    LightItalic: Font.fromFile('assets/fonts/Nunito-LightItalic.ttf'),
    Medium: Font.fromFile('assets/fonts/Nunito-Medium.ttf'),
    SemiBold: Font.fromFile('assets/fonts/Nunito-SemiBold.ttf'),
    SemiBoldItalic: Font.fromFile('assets/fonts/Nunito-SemiBoldItalic.ttf'),
  },
};

export class Typography {
  basic = new Typograph({
    font: Fonts.Nunito.Bold,
    fontSize: 20,
    color: Color.rgb(0, 50, 50),
    iosTextStyle: IOSTextStyle.Title2,
  });
  tallLineHeight = new Typograph({
    font: Fonts.Nunito.Regular,
    fontSize: 16,
    color: Color.rgb(0, 125, 0),
    iosTextStyle: IOSTextStyle.Body,
    lineHeight: 60,
    decoration: [TextDecoration.Underline, TextDecoration.Strikethrough]
  });
  navigationTitle = new Typograph({
    font: Fonts.Nunito.Bold,
    fontSize: 24,
    color: Color.rgb(0, 200, 200),
    iosTextStyle: IOSTextStyle.Title1,
    letterSpacing: 18,
  });
  buttonPressed = new Typograph({
    font: Fonts.Nunito.ExtraLight,
    fontSize: 12,
    color: Color.rgb(0, 150, 150),
    iosTextStyle: IOSTextStyle.Caption1
  });
  fonts = [
    Fonts.Nunito.Regular,
    Fonts.Nunito.Black,
    Fonts.Nunito.BlackItalic,
    Fonts.Nunito.Bold,
    Fonts.Nunito.BoldItalic,
    Fonts.Nunito.ExtraBold,
    Fonts.Nunito.ExtraBoldItalic,
    Fonts.Nunito.ExtraLight,
    Fonts.Nunito.ExtraLightItalic,
    Fonts.Nunito.Italic,
    Fonts.Nunito.Light,
    Fonts.Nunito.LightItalic,
    Fonts.Nunito.Medium,
    Fonts.Nunito.SemiBold,
    Fonts.Nunito.SemiBoldItalic,
  ];
}

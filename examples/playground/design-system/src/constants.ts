import {Color, IOSTextStyle, Font, Typograph} from '@diez/prefabs';

const Fonts = {
  Nunito: {
    Regular: Font.fromFile('assets/fonts/Nunito-Regular.ttf'),
    Black: Font.fromFile('assets/fonts/Nunito-Black.ttf'),
    Bold: Font.fromFile('assets/fonts/Nunito-Bold.ttf'),
    ExtraBold: Font.fromFile('assets/fonts/Nunito-ExtraBold.ttf'),
    ExtraLight: Font.fromFile('assets/fonts/Nunito-ExtraLight.ttf'),
    Light: Font.fromFile('assets/fonts/Nunito-Light.ttf'),
    Medium: Font.fromFile('assets/fonts/Nunito-Medium.ttf'),
    SemiBold: Font.fromFile('assets/fonts/Nunito-SemiBold.ttf'),
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
    color: Color.rgb(0, 50, 50),
    iosTextStyle: IOSTextStyle.Body,
    lineHeight: 60,
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
}

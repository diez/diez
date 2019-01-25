import {Color, Palette} from '@livedesigner/color';
import {Component, expression, method, property} from '@livedesigner/engine';
import {File} from '@livedesigner/file';
import {Haiku} from '@livedesigner/haiku';
import {Image} from '@livedesigner/image';
import {FontRegistry, TextStyle} from '@livedesigner/typography';
import {easeInOutExpo} from 'just-curves';

import {Fonts} from './fonts';

class MyPalette extends Component<Palette> {
  @property hello = Color.rgba(255, 0, 0, 1);
}

export interface MyStateShape {
  palette: MyPalette;
  name: string; // Explicit
  copy: string; // Expression
  image: Image;
  fontRegistry: FontRegistry;
  textStyle: TextStyle<Fonts>;
  haiku: Haiku;
}

class MyStateBag extends Component<MyStateShape> {
  @property palette: MyPalette = new MyPalette();

  @property name: string = 'Diez';

  @property copy = expression<string>(
    (name: string) => `Hello ${name}`,
  );

  @property image = new Image({
    file: new File({
      // Try changing this to diez.jpg!
      src: '/assets/images/haiku.jpg',
    }),
    width: 246,
    height: 246,
    scale: 3,
  });

  @property fontRegistry = new FontRegistry({
    files: [
      new File({src: '/assets/fonts/Roboto-Black.ttf'}),
      new File({src: '/assets/fonts/Roboto-BlackItalic.ttf'}),
      new File({src: '/assets/fonts/Roboto-Bold.ttf'}),
      new File({src: '/assets/fonts/Roboto-BoldItalic.ttf'}),
      new File({src: '/assets/fonts/Roboto-Italic.ttf'}),
      new File({src: '/assets/fonts/Roboto-Light.ttf'}),
      new File({src: '/assets/fonts/Roboto-LightItalic.ttf'}),
      new File({src: '/assets/fonts/Roboto-Medium.ttf'}),
      new File({src: '/assets/fonts/Roboto-MediumItalic.ttf'}),
      new File({src: '/assets/fonts/Roboto-Regular.ttf'}),
      new File({src: '/assets/fonts/Roboto-Thin.ttf'}),
      new File({src: '/assets/fonts/Roboto-ThinItalic.ttf'}),
    ],
  });

  @property textStyle = new TextStyle<Fonts>({
    font: Fonts.Helvetica,
    fontSize: 50,
    // Note: the only reason this works without an expression is side effects from using the default
    // MyPalette constructor. This indicates we're actually mutating the prototype on patches. Maybe
    // that's okay, but probably not.
    color: this.palette.hello,
  });

  @property haiku = new Haiku({
    file: new File({src: '/assets/haiku/animator.html'}),
  });

  @method async tap () {
    await this.palette.hello.tween(
      {h: 0.3},
      // Default curve is linear!
      {duration: 5000},
    );
    await this.palette.hello.tween(
      // You can tween multiple values at once!
      {h: 0.9, l: 0.5},
      {
        duration: 5000,
        // You can specify any pure function (number) -> number as a curve!
        curve: easeInOutExpo,
      },
    );
    await this.palette.tween(
      // You can tween an entire component instead of its inner state!
      {hello: Color.rgba(255, 0, 0, 1)},
      {duration: 5000},
    );
  }
}

export const component = new MyStateBag();

import {ComponentFactory} from '@haiku/core/lib/HaikuContext';

export declare class File {
  url: string;
}

export declare class Image {
  url: string;
}

export declare class SVG {
  url: string;
}

export declare class Lottie {
  mount(ref: any): void;
}

export declare class FontRegistry {}

export declare class Color {
  toString(): string;
}

export declare class TextStyle {
  css: {color: string, fontSize: string, fontFamily: string};
  applyStyle(ref: HTMLElement): void;
}

export declare class HaikuComponent {
  adapter: ComponentFactory;
  mount(ref: any): void;
}

export declare class Bindings extends StateBag {
  image: Image;
  svg: SVG;
  lottie: Lottie;
  fontRegistry: FontRegistry;
  textStyle: TextStyle;
  haiku: HaikuComponent;
}


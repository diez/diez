export declare class File {
  url: string;
}

export declare class Image {
  file: File;
  width: number;
  height: number;
  scale: number;
}

export declare class SVG {
  src: string;
}

export declare class Lottie {
  file: File;
}

export declare class FontRegistry {
  files: File[];
}

export declare class Color {
  toString(): string;
}

export declare class TextStyle {
  css: {color: string, fontSize: string, fontFamily: string};
  applyStyle(ref: HTMLElement): void;
}

export declare class Haiku {
  component: string;
}

export declare class Bindings extends StateBag {
  image: Image;
  svg: SVG;
  lottie: Lottie;
  fontRegistry: FontRegistry;
  textStyle: TextStyle;
  haiku: Haiku;
}


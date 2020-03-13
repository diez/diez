declare module 'split-grid' {
  export = Split;

  // tslint:disable-next-line
  function Split (
    options?: Split.Options,
  ): Split.Instance;

  namespace Split {
    interface GutterDeclaration {
      track: number;
      element: Element;
    }

    interface SizesDeclaration {
      [track: number]: number;
    }

    interface Options {
      columnGutters?: GutterDeclaration[];
      rowGutters?: GutterDeclaration[];
      minSize?: number;
      columnMinSize?: number;
      rowMinSize?: number;
      columnMinSizes?: SizesDeclaration;
      rowMinSizes?: SizesDeclaration;
      snapOffset?: number;
      columnSnapOffset?: number;
      rowSnapOffset?: number;
      dragInterval?: number;
      onDragEnd?: (direction: 'row' | 'column', track: number) => void;
    }

    interface Instance {
      addColumnGutter (element: HTMLElement, track: number): void;
      addRowGutter (element: HTMLElement, track: number): void;
      removeColumnGutter (track: number, immediate?: true): void;
      removeRowGutter (track: number, immediate?: true): void;
      destroy (immediate?: true): void;
    }
  }


}

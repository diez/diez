import { Color, FontRegistry, Typograph } from "@diez/prefabs";
import { Component, property } from "@diez/engine";

class MyDesignSystemPalette extends Component {
    @property
    untitledColor = 2;
    @property
    someColor = 3;
}

class MyDesignSystemTypographs extends Component {
    @property
    untitledTypograph = 0;
    @property
    someTypograph = 1;
}

export enum MyDesignSystemFonts {
    SomeFontBoldItalic = "SomeFont-BoldItalic"
}

export class MyDesignSystemDesignSystem extends Component {
    @property
    fonts = FontRegistry.fromFiles("assets/fonts/font.ttf");
    @property
    palette = new MyDesignSystemPalette();
    @property
    typographs = new MyDesignSystemTypographs();
}

export const myDesignSystemDesignSystem = new MyDesignSystemDesignSystem();

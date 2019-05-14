import { Color, FontRegistry, TextStyle } from "@diez/prefabs";
import { Component, property } from "@diez/engine";

class MyDesignSystemPalette extends Component {
    @property
    untitledColor = 2;
    @property
    someColor = 3;
}

class MyDesignSystemTextStyles extends Component {
    @property
    untitledTextStyle = 0;
    @property
    someTextStyle = 1;
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
    textStyles = new MyDesignSystemTextStyles();
}

export const myDesignSystemDesignSystem = new MyDesignSystemDesignSystem();

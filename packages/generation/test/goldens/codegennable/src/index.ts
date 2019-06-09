import { Color, File, Font, Image, Typograph } from "@diez/prefabs";
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

export class MyDesignSystemSlicesFiles {
    static Foobar = new File({"src": "assets/blah/Foobar.png"});
    static Foobar2x = new File({"src": "assets/blah/Foobar@2x.png"});
    static Foobar3x = new File({"src": "assets/blah/Foobar@3x.png"});
    static Foobar4x = new File({"src": "assets/blah/Foobar@4x.png"});
    static Bazbat = new File({"src": "assets/blah/Bazbat.png"});
    static Bazbat2x = new File({"src": "assets/blah/Bazbat@2x.png"});
    static Bazbat3x = new File({"src": "assets/blah/Bazbat@3x.png"});
    static Bazbat4x = new File({"src": "assets/blah/Bazbat@4x.png"});
}

export class MyDesignSystemSlices {
    static Foobar = Image.responsive("assets/blah/Foobar.png", 640, 480);
    static Bazbat = Image.responsive("assets/blah/Bazbat.png", 320, 240);
}

export const MyDesignSystemFonts = {
    SomeFont: {
        BoldItalic: Font.fromFile("assets/fonts/SomeFont-BoldItalic.ttf"),
        ExtraMedium: Font.fromFile("assets/fonts/SomeFont-ExtraMedium.ttf")
    }
};

export class MyDesignSystemDesignSystem extends Component {
    @property
    palette = new MyDesignSystemPalette();
    @property
    typographs = new MyDesignSystemTypographs();
}

export const myDesignSystemDesignSystem = new MyDesignSystemDesignSystem();

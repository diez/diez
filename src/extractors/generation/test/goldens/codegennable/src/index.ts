import { Color, DropShadow, File, Font, GradientStop, Image, LinearGradient, Point2D, Typograph } from "@diez/prefabs";

const myDesignSystemColors = {
    untitledColor: 2,
    someColor: 3
};

const myDesignSystemGradients = {
    untitledColor: 4,
    someGradient: 5
};

const myDesignSystemShadows = {
    untitledColor: 6,
    someShadow: 7
};

export const myDesignSystemFonts = {
    SomeFont: {
        BoldItalic: Font.fromFile("assets/fonts/SomeFont-BoldItalic.ttf"),
        ExtraMedium: Font.fromFile("assets/fonts/SomeFont-ExtraMedium.ttf")
    }
};

const myDesignSystemTypography = {
    untitledColor: 0,
    someTypograph: 1
};

export const myDesignSystemSlicesFiles = {
    foobar: new File({ src: "assets/blah/Foobar.png" }),
    foobar2x: new File({ src: "assets/blah/Foobar@2x.png" }),
    foobar3x: new File({ src: "assets/blah/Foobar@3x.png" }),
    foobar4x: new File({ src: "assets/blah/Foobar@4x.png" }),
    bazbat: new File({ src: "assets/blah/Bazbat.png" }),
    bazbat2x: new File({ src: "assets/blah/Bazbat@2x.png" }),
    bazbat3x: new File({ src: "assets/blah/Bazbat@3x.png" }),
    bazbat4x: new File({ src: "assets/blah/Bazbat@4x.png" })
};

export const myDesignSystemSlices = {
    foobar: Image.responsive("assets/blah/Foobar.png", 640, 480),
    bazbat: Image.responsive("assets/blah/Bazbat.png", 320, 240)
};

export const myDesignSystemTokens = {
    colors: myDesignSystemColors,
    gradients: myDesignSystemGradients,
    shadows: myDesignSystemShadows,
    typography: myDesignSystemTypography
};

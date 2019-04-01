import Foundation

public final class MyPalette : NSObject, StateBag {
    public var hello: Color

    public init(_ listener: Method?) {
        hello = Color(hue: 0, hslSaturation: 1, lightness: 0.5, alpha: 1)
    }

    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        // TODO: We should be able to patch instead of replacing here.
        // Is it possible to update UIColors?
        hello = try container.decode(Color.self, forKey: .hello)
    }
}

public final class MyStateBag : NSObject, StateBag {
    public var palette: MyPalette
    public var copy: String
    public var image: Image
    public var fontRegistry: FontRegistry
    public var textStyle: TextStyle
    public var haiku: Haiku
    public var svg: SVG
    public var lottie: Lottie
    var listener: Method? = nil

    private enum CodingKeys: String, CodingKey {
        case palette
        case copy
        case image
        case fontRegistry
        case textStyle
        case haiku
        case svg
        case lottie
    }

    public init(_ listenerIn: Method?) {
        fontRegistry = FontRegistry(withFiles: [
            File(withSrc: "/assets/fonts/Roboto-Black.ttf"),
            File(withSrc: "/assets/fonts/Roboto-BlackItalic.ttf"),
            File(withSrc: "/assets/fonts/Roboto-Bold.ttf"),
            File(withSrc: "/assets/fonts/Roboto-BoldItalic.ttf"),
            File(withSrc: "/assets/fonts/Roboto-Italic.ttf"),
            File(withSrc: "/assets/fonts/Roboto-Light.ttf"),
            File(withSrc: "/assets/fonts/Roboto-LightItalic.ttf"),
            File(withSrc: "/assets/fonts/Roboto-Medium.ttf"),
            File(withSrc: "/assets/fonts/Roboto-MediumItalic.ttf"),
            File(withSrc: "/assets/fonts/Roboto-Regular.ttf"),
            File(withSrc: "/assets/fonts/Roboto-Thin.ttf"),
            File(withSrc: "/assets/fonts/Roboto-ThinItalic.ttf"),
        ])
        palette = MyPalette(listener)
        copy = "Hello Diez"
        image = Image(withFile: File(withSrc: "/assets/images/haiku.jpg"), withWidth: 246, withHeight: 246, withScale: 3)
        textStyle = TextStyle(
            withFont: "Helvetica",
            withFontSize: 50,
            withColor: Color(hue: 0, hslSaturation: 1, lightness: 0.5, alpha: 1)
        )
        listener = listenerIn
        haiku = Haiku(withFile: File(withSrc: "/assets/haiku/animator.html"))
        svg = SVG(withFile: File(withSrc: "/assets/images/rat.svg.html"))
        lottie = Lottie(withFile: File(withSrc: "/assets/lottie/loading-pizza.json"))
    }

    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        try? container.update(&palette, forKey: .palette)
        try? container.update(&image, forKey: .image)
        try? container.update(&textStyle, forKey: .textStyle)
        try? container.update(&svg, forKey: .svg)
        try? container.update(&haiku, forKey: .haiku)
        try? container.update(&lottie, forKey: .lottie)
        copy = try container.decode(String.self, forKey: .copy)
    }

    public func tap() {
        if (listener == nil) {
            return
        }

        listener!("tap", nil)
    }
}

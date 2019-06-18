private var registeredFonts: Set<String> = []

private func registerFont(_ font: Font) {
    if font.file.src == "" || registeredFonts.contains(font.file.src) {
        return
    }

    registeredFonts.insert(font.file.src)

    guard
        let url = font.file.url,
        let data = try? Data(contentsOf: url) as CFData,
        let dataProvider = CGDataProvider(data: data),
        let cgFont = CGFont(dataProvider) else {
            return
    }

    CTFontManagerRegisterGraphicsFont(cgFont, nil)
}

extension Typograph {
    /**
     The `UIFont` of the `Typograph`.

     - Note: If the font fails to load this will fallback to the `UIFont.systemFont(ofSize:)`.
     */
    @objc public var uiFont: UIFont {
        registerFont(font)
        guard let font = UIFont(name: font.name, size: fontSize) else {
            return UIFont.systemFont(ofSize: fontSize)
        }

        return font
    }
}

public extension UILabel {
    @objc(dez_applyTypograph:)
    func apply(_ typograph: Typograph) {
        font = typograph.uiFont
        textColor = typograph.color.uiColor
    }
}

public extension UITextView {
    @objc(dez_applyTypograph:)
    func apply(_ typograph: Typograph) {
        font = typograph.uiFont
        textColor = typograph.color.uiColor
    }
}

public extension UITextField {
    @objc(dez_applyTypograph:)
    func apply(_ typograph: Typograph) {
        font = typograph.uiFont
        textColor = typograph.color.uiColor
    }
}

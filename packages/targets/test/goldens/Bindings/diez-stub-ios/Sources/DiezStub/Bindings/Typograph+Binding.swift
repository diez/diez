import UIKit

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

     This uses the `UIFont(name:size)` initializer and may return nil as a result.
     */
    @objc
    public var uiFont: UIFont? {
        registerFont(font)

        return UIFont(name: font.name, size: fontSize)
    }
}

extension UILabel {
    /**
     Applies the provided `Typograph` to the receiver.
     */
    @objc(dez_applyTypograph:)
    public func apply(_ typograph: Typograph) {
        font = typograph.uiFont
        textColor = typograph.color.uiColor
    }
}

extension UITextView {
    /**
     Applies the provided `Typograph` to the receiver.
     */
    @objc(dez_applyTypograph:)
    public func apply(_ typograph: Typograph) {
        font = typograph.uiFont
        textColor = typograph.color.uiColor
    }
}

extension UITextField {
    /**
     Applies the provided `Typograph` to the receiver.
     */
    @objc(dez_applyTypograph:)
    public func apply(_ typograph: Typograph) {
        font = typograph.uiFont
        textColor = typograph.color.uiColor
    }
}

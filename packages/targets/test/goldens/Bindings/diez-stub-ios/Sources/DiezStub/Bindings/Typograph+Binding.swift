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
    
    /**
     `NSAttributedString` attributes of the `Typograph`.
     */
    @objc
    public var attributedStringAttributes: [NSAttributedString.Key: Any] {
        var attributes: [NSAttributedString.Key: Any] = [
            .foregroundColor: color.uiColor,
        ]
        
        if let font = uiFont {
            attributes[.font] = font
        }
        
        return attributes
    }
    
    /**
     Constructs an `NSAttributedString` decorating the provided `String`.
     */
    @objc
    public func attributedString(decorating string: String) -> NSAttributedString {
        return NSAttributedString(string: string, typograph: self)
    }
}

extension NSAttributedString {
    /**
     Initializes an `NSAttributedString` with the provided string and `Typograph`.
     */
    @objc
    public convenience init(string: String, typograph: Typograph) {
        self.init(string: string, attributes: typograph.attributedStringAttributes)
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

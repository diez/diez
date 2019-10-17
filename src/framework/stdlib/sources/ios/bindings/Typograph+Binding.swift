import UIKit

private var registeredFonts: Set<String> = []

/**
 Registers the provided font.

 - Note: This registration occurs automatically when applying a `Typograph`. You should only call this manually if you'd like to utilize `Font` without going through `Typograph`, or if you'd like to register fonts that are not referenced direclty by a `Typograph` (e.g. if you want a `TextView` to be capable toggling the bold-ness of text but only reference the bold font face in your exported Diez project).
 */
public func registerFont(_ font: Font) {
    if font.file.src == "" || registeredFonts.contains(font.file.src) {
        return
    }

    registeredFonts.insert(font.file.src)

    guard
        let url = font.file.url,
        let dataProvider = CGDataProvider(url: url as CFURL),
        let cgFont = CGFont(dataProvider) else {
            return
    }

    CTFontManagerRegisterGraphicsFont(cgFont, nil)
}

extension Typograph {
    /**
     The `UIFont` of the `Typograph`.

     Iff `shouldScale` is `true`, the font will be scaled according to `UIFontMetric`s Dynamic Type scaling system with the `Typograph`s `iosTextStyle` value.

     This uses the `UIFont(name:size)` initializer and may return nil as a result.
     */
    @objc
    public var uiFont: UIFont? {
        return uiFont(for: nil)
    }

    /**
     The `UIFont` of the `Typograph`.

     Iff `shouldScale` is `true`, the font will be scaled according to `UIFontMetric`s Dynamic Type scaling system with the `Typograph`s `iosTextStyle` value and the provided `UITraitCollection`.

     This uses the `UIFont(name:size)` initializer and may return nil as a result.
     */
    @objc(uiFontWithTraitCollection:)
    public func uiFont(for traitCollection: UITraitCollection? = nil) -> UIFont? {
        return UIFont.from(typograph: self, traitCollection: traitCollection)
    }

    /**
    - Tag: Typograph.attributedStringAttributes

     `NSAttributedString` attributes for the `Typograph`.

     - Note: If a `lineHeight` is provided, these attributes will provide a `.baselineOffset` which can break baseline alignment when used directly in `UIKit` views. To prevent this behavior, use [Typograph.attributedStringAttributesWith(...)](x-source-tag://Typograph.attributedStringAttributesWith) instead, or use one of the provided view subclasses to apply the `Typograph`.
     */
    @objc
    public var attributedStringAttributes: [NSAttributedString.Key: Any] {
        return attributedStringAttributesWith()
    }

    /**
     - Tag: Typograph.attributedStringAttributesWith

     `NSAttributedString` attributes for the `Typograph`.

     - Note: If `preventBaselineOffset` is `false` (the default), these attributes will provide a `.baselineOffset` which can break baseline alignment when used directly in `UIKit` views. To prevent this behavior, set `preventBaselineOffset` and/or `preventLineHeightAdjustment` to `true`, or use one of the provided view subclasses to apply the `Typograph`.

     - Parameter preventLineHeightAdjustment: If true, prevents the `.paragraphStyle`'s `minimumLineHeight` and `maximumLineHeight` from being set.
     - Parameter preventBaselineOffset: If true, prevents the baselineOffset from being set on the attributed string. When false, the offset is adjusted so that the text appears centered within the lineHeight, rather than bottom aligned (the default behavior) to match design tools and web layout.
     */
    @objc(attributedStringAttributesWithTraitCollection:preventLineHeightAdjustment:preventBaselineOffset:)
    public func attributedStringAttributesWith(
        traitCollection: UITraitCollection? = nil,
        preventLineHeightAdjustment: Bool = false,
        preventBaselineOffset: Bool = false
    ) -> [NSAttributedString.Key: Any] {
        let color = UIColor(color: self.color)
        var attributes: [NSAttributedString.Key: Any] = [
            .foregroundColor: color,
            .baselineOffset: 0,
            .kern: scaledLetterSpacing,
        ]

        if decoration.contains("underline") {
            attributes[.underlineStyle] = NSUnderlineStyle.single.rawValue
        }

        if decoration.contains("strikethrough") {
            attributes[.strikethroughStyle] = NSUnderlineStyle.single.rawValue
        }

        let paragraphStyle = NSMutableParagraphStyle()
        if let lineHeight = scaledLineHeight, !preventLineHeightAdjustment {
            paragraphStyle.minimumLineHeight = lineHeight
            paragraphStyle.maximumLineHeight = lineHeight
            if !preventBaselineOffset {
                attributes[.baselineOffset] = baselineOffset
            }
        }

        paragraphStyle.alignment = nsTextAlignment

        attributes[.paragraphStyle] = paragraphStyle

        if let font = UIFont.from(typograph: self, traitCollection: traitCollection) {
            attributes[.font] = font
        }

        return attributes
    }

    /**
     Constructs an `NSAttributedString` decorating the provided `String`.
     */
    @objc(attributedStringDecoratingString:withTraitCollection:)
    public func attributedString(decorating string: String, withTraitCollection traitCollection: UITraitCollection? = nil) -> NSAttributedString {
        return NSAttributedString(string: string, typograph: self, traitCollection: traitCollection)
    }

    /**
     The `UIFont.TextStyle` for the `Typograph`.
     */
    @objc
    public var uiFontTextStyle: UIFont.TextStyle {
        switch iosTextStyle {
        case "body": return .body
        case "callout": return .callout
        case "caption1": return .caption1
        case "caption2": return .caption2
        case "footnote": return .footnote
        case "headline": return .headline
        case "subheadline": return .subheadline
        case "largeTitle": return .largeTitle
        case "title1": return .title1
        case "title2": return .title2
        case "title3": return .title3
        default: return .body
        }
    }

    /**
     The `NSTextAlignment` for the `Typograph`.
     */
    @objc
    public var nsTextAlignment: NSTextAlignment {
        switch alignment {
        case "natural": return .natural
        case "left": return .left
        case "right": return .right
        case "center": return .center
        default: return .natural
        }
    }

    /**
     The line height scaled using `UIFontMetrics` for the `uiFontTextStyle`. This value is `nil` if the `lineHeight` is `nil`.

     This value will be scaled based on the user's dynamic type settings if `shouldScale` is true.
     */
    public var scaledLineHeight: CGFloat? {
        guard lineHeight != -1 else {
            return nil
        }

        guard shouldScale else {
            return lineHeight
        }

        // Note: This scaled value will not dynamically update as the dynamic type settings change.
        return UIFontMetrics(forTextStyle: uiFontTextStyle).scaledValue(for: lineHeight)
    }

    /**
     The letter spacing scaled using `UIFontMetrics` for the `uiFontTextStyle`.

     This value will be scaled based on the user's dynamic type settings if `shouldScale` is true.
     */
    @objc
    public var scaledLetterSpacing: CGFloat {
        guard shouldScale else {
            return letterSpacing
        }

        // Note: This scaled value will not dynamically update as the dynamic type settings change.
        return UIFontMetrics(forTextStyle: uiFontTextStyle).scaledValue(for: letterSpacing)
    }

    /**
     The line height scaled using `UIFontMetrics` for the `uiFontTextStyle`. This value is `nil` if the `lineHeight` is `nil`.

     This value will be scaled based on the user's dynamic type settings if `shouldScale` is true.
     */
    @objc
    var scaledLineHeightNumber: NSNumber? {
        guard let scaledLineHeight = scaledLineHeight else {
            return nil
        }

        return NSNumber(value: Double(scaledLineHeight))
    }

    /**
     The amount that the baseline should be offset in attributed string attributes. This corresponds to the `NSAttributedString.Key.baselineOffset` value of the attributed string attributes.

     The baseline will be offset when a `lineHeight` is provided in order to center the text within the line. By default, iOS renders the text such that it's aligned with the bottom of the view.

     This value will be `0` if the `lineHeight` is `-1` (unset) or the `uiFont` is `nil`.

     This value will be scaled based on the user's dynamic type settings if `shouldScale` is `true`.
     */
    @objc
    public var baselineOffset: CGFloat {
        guard let adjustedLineHeight = scaledLineHeight, let uiFont = uiFont else {
            return 0
        }

        let center = adjustedLineHeight / 2
        let offset = uiFont.ascender - (uiFont.lineHeight / 2)
        return center - offset
    }

    /**
     Edge insets that can be used to compensate for the `baselineOffset` so that the text appears centered within the lines instead of having the text pinned to the bottom of the line (the system default behavior in `UIKit`).
     */
    @objc
    public var baselineOffsetCompensationEdgeInsets: UIEdgeInsets {
        return UIEdgeInsets(top: -baselineOffset, left: 0, bottom: baselineOffset, right: 0)
    }
}

extension UIFont {
    /**
     Constructs a `UIFont` with the provided `Typograph`.

     - Note: Some of the properties of the `Typograph` are not considered when constructing the `UIFont` (e.g. `.color`), so the resulting `UIFont` does not represent the complete `Typograph`.
     */
    @objc(dez_fontWithTypograph:traitCollection:)
    public static func from(typograph: Typograph, traitCollection: UITraitCollection? = nil) -> UIFont? {
        registerFont(typograph.font)

        guard let font = UIFont(name: typograph.font.name, size: typograph.fontSize) else {
            return nil
        }

        guard typograph.shouldScale else {
            return font
        }

        let metrics = UIFontMetrics(forTextStyle: typograph.uiFontTextStyle)
        return metrics.scaledFont(for: font, compatibleWith: traitCollection)
    }
}

extension NSAttributedString {
    /**
     - Tag: NSAttributedString.init

     Initializes an `NSAttributedString` with the provided string and `Typograph`.

     - See [Typograph.attributedStringAttributes](x-source-tag://Typograph.attributedStringAttributes).
     */
    @objc(dez_initWithString:typograph:)
    public convenience init(string: String, typograph: Typograph) {
        self.init(string: string, attributes: typograph.attributedStringAttributesWith())
    }

    /**
     - Tag: NSAttributedString.initAdvanced

     Initializes an `NSAttributedString` with the provided `Typograph`.

     - See [Typograph.attributedStringAttributesWith(...)](x-source-tag://Typograph.attributedStringAttributesWith).
     */
    @objc(dez_initWithString:typograph:traitCollection:preventLineHeightAdjustment:preventBaselineOffset:)
    public convenience init(
        string: String,
        typograph: Typograph,
        traitCollection: UITraitCollection? = nil,
        preventLineHeightAdjustment: Bool = false,
        preventBaselineOffset: Bool = false
    ) {
        let attributes = typograph.attributedStringAttributesWith(
            traitCollection: traitCollection,
            preventBaselineOffset: preventBaselineOffset
        )
        self.init(string: string, attributes: attributes)
    }
}

extension UINavigationBar {
    /**
     Applies the provided `Tyopgraph` to the `UINavigationBar`'s `titleTextAttributes`.

     - Note: This does not apply the `Typograph`'s `lineHeight`.
     */
    @objc(dez_applyTitleAttributesWithTypograph:traitCollection:)
    public func applyTitleAttributesWith(typograph: Typograph, traitCollection: UITraitCollection? = nil) {
        titleTextAttributes = typograph.attributedStringAttributesWith(
            traitCollection: traitCollection,
            preventLineHeightAdjustment: true,
            preventBaselineOffset: true
        )
    }
}

extension UISegmentedControl {
    /**
     Applies the provided `Tyopgraph` to the `UISegmentedControl`'s title text attributes for the provided state.

     - Note: This does not apply the `Typograph`'s `lineHeight`.
     */
    @objc(dez_applyTitleAttributesWithTypograph:forState:traitCollection:)
    public func applyTitleAttributes(
        with typograph: Typograph,
        for state: UIControl.State,
        traitCollection: UITraitCollection? = nil
    ) {
        let attributes = typograph.attributedStringAttributesWith(
            traitCollection: traitCollection,
            preventLineHeightAdjustment: true,
            preventBaselineOffset: true
        )
        setTitleTextAttributes(attributes, for: state)
    }
}

extension UIBarItem {
    /**
     Applies the provided `Tyopgraph` to the `UIBarButtonItem`'s title text attributes for the provided state.

     - Note: This does not apply the `Typograph`'s `lineHeight`.
     */
    @objc(dez_applyTitleAttributesWithTypograph:forState:traitCollection:)
    public func applyTitleAttributes(
        with typograph: Typograph,
        for state: UIControl.State,
        traitCollection: UITraitCollection? = nil
    ) {
        let attributes = typograph.attributedStringAttributesWith(
            traitCollection: traitCollection,
            preventLineHeightAdjustment: true,
            preventBaselineOffset: true
        )
        setTitleTextAttributes(attributes, for: state)
    }
}

private struct TextDecoration: OptionSet {
    let rawValue: Int

    static let none = TextDecoration(rawValue: 0)
    static let underline = TextDecoration(rawValue: 1 << 0)
    static let strikethrough = TextDecoration(rawValue: 1 << 1)
}

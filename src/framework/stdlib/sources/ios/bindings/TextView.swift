import UIKit

/**
 A view that wraps `UITextView` which allows a `Typograph` to be applied to the text view.
 */
@objc(DEZTextView)
public class TextView: WrappedView {
    /**
     The underlying `UITextView`.

     Access to this property is only exposed as an "escape hatch". Interact with `Label` instead when possible.
     */
    @objc
    public let uiTextView = UITextView()

    /**
     Sets the `UITextView`'s `text` property with the most recently applied `Typograph`.
     */
    @objc
    public var text: String? {
        get { return uiTextView.text }
        set {
            let attributedText: NSAttributedString? = {
                guard let newValue = newValue else {
                    return nil
                }

                return NSAttributedString(string: newValue)
            }()

            uiTextView._apply(typograph, withAttributedText: attributedText, preventBaselineOffset: true)
        }
    }

    /**
     Sets the `UITextView`'s `attributedText` property with the most recently applied `Typograph`.
     */
    @objc
    public var attributedText: NSAttributedString? {
        get { return uiTextView.attributedText }
        set { uiTextView._apply(typograph, withAttributedText: newValue, preventBaselineOffset: true) }
    }

    /**
     A proxy for  `UITextView`'s `isScrollEnabled` property.
     */
    @objc
    public var isScrollEnabled: Bool {
        get { return uiTextView.isScrollEnabled }
        set { uiTextView.isScrollEnabled = newValue }
    }

    /**
     The most recently applied `Typograph`, or `nil` if one has not been applied.
     */
    @objc
    public var typograph: Typograph? { return _typograph }

    override var underlyingView: UIView {
        return uiTextView
    }

    private var _typograph: Typograph?

    /**
     Applies the provided `Typograph` to the receiver.
     */
    @objc(applyTypograph:withTraitCollection:)
    public func apply(_ typograph: Typograph, withTraitCollection traitCollection: UITraitCollection? = nil) {
        self._typograph = typograph

        uiTextView._apply(
            typograph,
            withAttributedText: attributedText,
            traitCollection: traitCollection,
            preventBaselineOffset: true
        )
        verticalOffset = typograph.baselineOffset
    }

    override func setup() {
        super.setup()

        uiTextView.backgroundColor = .clear
        uiTextView.textContainerInset = .zero
        uiTextView.textContainer.lineFragmentPadding = 0
    }
}

extension UITextView {
    func _apply(
        _ typograph: Typograph?,
        withAttributedText text: NSAttributedString?,
        traitCollection: UITraitCollection? = nil,
        preventLineHeightAdjustment: Bool = false,
        preventBaselineOffset: Bool = false
    ) {
        guard let typograph = typograph else {
            self.attributedText = textStorage(from: text)
            return
        }

        font = UIFont.from(typograph: typograph, traitCollection: traitCollection)
        textColor = UIColor(color: typograph.color)
        adjustsFontForContentSizeCategory = typograph.shouldScale

        guard let attributedText = text else {
            self.attributedText = nil
            return
        }

        guard attributedText.length > 0 else {
            self.attributedText = textStorage(from: text)
            return
        }

        let range = NSRange(location: 0, length: attributedText.length)
        let inputAttributes = attributedText.attributes(at: 0, longestEffectiveRange: nil, in: range)
        let typographAttributes = typograph.attributedStringAttributesWith(
            traitCollection: traitCollection,
            preventLineHeightAdjustment: preventLineHeightAdjustment,
            preventBaselineOffset: preventBaselineOffset
        )
        let attributes = inputAttributes.merging(typographAttributes, uniquingKeysWith: { $1 })

        let attributedString = NSAttributedString(string: attributedText.string, attributes: attributes)
        self.attributedText = textStorage(from: attributedString)
    }

    // Wrapping the string in NSTextStorage seeems to resolve an issue where `NSOriginalFont` would be added to the attributed string attributes.
    // See https://stackoverflow.com/a/32177149
    private func textStorage(from attributedString: NSAttributedString?) -> NSTextStorage? {
        guard let attributedString = attributedString else {
            return nil
        }

        return NSTextStorage(attributedString: attributedString)
    }
}

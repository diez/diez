import UIKit

/**
 A view that wraps `UILabel` which allows a `Typograph` to be applied to the label.
 */
@objc(DEZLabel)
public class Label: WrappedView {
    /**
     The underlying `UILabel`.

     Access to this property is only exposed as an "escape hatch". Interact with `Label` instead when possible.
     */
    @objc
    public let uiLabel = UILabel()

    /**
     Sets the `UILabel`'s `text` property with the most recently applied `Typograph`.
     */
    @objc
    public var text: String? {
        get { return uiLabel.text }
        set {
            let attributedText: NSAttributedString? = {
                guard let newValue = newValue else {
                    return nil
                }

                return NSAttributedString(string: newValue)
            }()

            uiLabel._apply(
                typograph,
                withAttributedText: attributedText,
                preventLineHeightAdjustment: false,
                preventBaselineOffset: true
            )
        }
    }

    /**
     Sets the `UILabel`'s `attributedText` property with the most recently applied `Typograph`.
     */
    @objc
    public var attributedText: NSAttributedString? {
        get { return uiLabel.attributedText }
        set {
            uiLabel._apply(
                typograph,
                withAttributedText: newValue,
                preventLineHeightAdjustment: false,
                preventBaselineOffset: true
            )
        }
    }

    /**
     A proxy for `UILabel`'s `numberOfLines` property.
     */
    @objc
    public var numberOfLines: Int {
        get { return uiLabel.numberOfLines }
        set { uiLabel.numberOfLines = newValue }
    }

    /**
     The most recently applied `Typograph`, or `nil` if one has not been applied.
     */
    @objc
    public var typograph: Typograph? { return _typograph }

    override var underlyingView: UIView {
        return uiLabel
    }

    private var _typograph: Typograph?

    /**
     Applies the provided `Typograph` to the receiver.
     */
    @objc(applyTypograph:withTraitCollection:)
    public func apply(_ typograph: Typograph, withTraitCollection traitCollection: UITraitCollection? = nil) {
        self._typograph = typograph

        uiLabel._apply(
            typograph,
            withAttributedText: attributedText,
            traitCollection: traitCollection,
            preventLineHeightAdjustment: false,
            preventBaselineOffset: true
        )
        verticalOffset = typograph.baselineOffset
    }
}

extension UILabel {
    func _apply(
        _ typograph: Typograph?,
        withAttributedText text: NSAttributedString?,
        traitCollection: UITraitCollection? = nil,
        preventLineHeightAdjustment: Bool = false,
        preventBaselineOffset: Bool = true
    ) {
        guard let typograph = typograph else {
            self.attributedText = text
            return
        }

        font = UIFont.from(typograph: typograph, traitCollection: traitCollection)
        textColor = UIColor(color: typograph.color)
        adjustsFontForContentSizeCategory = typograph.shouldScale

        guard let attributedText = text else {
            self.attributedText = text
            return
        }

        guard attributedText.length > 0 else {
            self.attributedText = attributedText
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

        self.attributedText = NSAttributedString(string: attributedText.string, attributes: attributes)
    }
}

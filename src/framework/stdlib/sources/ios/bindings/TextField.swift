import UIKit

/**
 A view that wraps `UITextField` which allows a `Typograph` to be applied to the text field.
 */
@objc(DEZTextField)
public class TextField: WrappedView {
    /**
     The underlying `UITextField`.

     Access to this property is only exposed as an "escape hatch". Interact with `Label` instead when possible.
     */
    @objc
    public let uiTextField = UITextField()

    /**
     Sets the `UITextField`'s `text` property with the most recently applied `Typograph`.
     */
    @objc
    public var text: String? {
        get { return uiTextField.text }
        set {
            let attributedText: NSAttributedString? = {
                guard let newValue = newValue else {
                    return nil
                }

                return NSAttributedString(string: newValue)
            }()

            uiTextField._apply(typograph, withAttributedText: attributedText)
        }
    }

    /**
     Sets the `UITextField`'s `attributedText` property with the most recently applied `Typograph`.
     */
    @objc
    public var attributedText: NSAttributedString? {
        get { return uiTextField.attributedText }
        set { uiTextField._apply(typograph, withAttributedText: newValue) }
    }

    /**
     The most recently applied `Typograph`, or `nil` if one has not been applied.
     */
    @objc
    public var typograph: Typograph? { return _typograph }

    override var underlyingView: UIView {
        return uiTextField
    }

    open override var intrinsicContentSize: CGSize {
        return super.intrinsicContentSize
    }

    private lazy var lineHeightConstraint: NSLayoutConstraint = {
        let constraint = self.heightAnchor.constraint(equalToConstant: 0)
        constraint.priority = .defaultHigh
        return constraint
    }()

    private var _typograph: Typograph?

    /**
     Applies the provided `Typograph` to the receiver.
     */
    @objc(applyTypograph:withTraitCollection:)
    public func apply(_ typograph: Typograph, withTraitCollection traitCollection: UITraitCollection? = nil) {
        self._typograph = typograph

        uiTextField._apply(
            typograph,
            withAttributedText: attributedText,
            traitCollection: traitCollection
        )

        lineHeightConstraint.constant = typograph.scaledLineHeight ?? 0
        lineHeightConstraint.isActive = typograph.scaledLineHeight != nil
    }

    open override func sizeThatFits(_ size: CGSize) -> CGSize {
        return super.sizeThatFits(size)
    }

    open override func systemLayoutSizeFitting(_ targetSize: CGSize) -> CGSize {
        return super.systemLayoutSizeFitting(targetSize)
    }

    open override func systemLayoutSizeFitting(_ targetSize: CGSize, withHorizontalFittingPriority horizontalFittingPriority: UILayoutPriority, verticalFittingPriority: UILayoutPriority) -> CGSize {
        return super.systemLayoutSizeFitting(targetSize, withHorizontalFittingPriority: horizontalFittingPriority, verticalFittingPriority: verticalFittingPriority)
    }

    override func setup() {
        super.setup()

        uiTextField.backgroundColor = .clear
    }

    override func addUnderlyingView() {
        underlyingView.translatesAutoresizingMaskIntoConstraints = false
        addSubview(underlyingView)
        NSLayoutConstraint.activate([
            underlyingView.leadingAnchor.constraint(equalTo: leadingAnchor),
            underlyingView.trailingAnchor.constraint(equalTo: trailingAnchor),
            underlyingView.centerYAnchor.constraint(equalTo: centerYAnchor),
            underlyingView.topAnchor.constraint(greaterThanOrEqualTo: topAnchor),
            underlyingView.bottomAnchor.constraint(greaterThanOrEqualTo: bottomAnchor),
        ])
    }
}

extension UITextField {
    func _apply(
        _ typograph: Typograph?,
        withAttributedText text: NSAttributedString?,
        traitCollection: UITraitCollection? = nil
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
            preventLineHeightAdjustment: true,
            preventBaselineOffset: true
        )
        let attributes = inputAttributes.merging(typographAttributes, uniquingKeysWith: { $1 })

        self.attributedText = NSAttributedString(string: attributedText.string, attributes: attributes)
        defaultTextAttributes = attributes
    }
}

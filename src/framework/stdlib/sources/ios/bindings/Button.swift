import UIKit
/**
 A view that wraps `UIButton` which allows a `Typograph` to be applied to the button.
 */
@objc(DEZButton)
public class Button: WrappedView {
    /**
     The underlying `UIButton`.

     Access to this property is only exposed as an "escape hatch". Interact with `Button` instead when possible.
     */
    @objc
    public var uiButton: UIButton { return diezButton }

    /**
     A proxy for the `UIButton`'s `titleLabel`'s `numberOfLines` property.
     */
    @objc
    public var numberOfLines: Int {
        get { return diezButton.titleLabel?.numberOfLines ?? 0 }
        set { diezButton.titleLabel?.numberOfLines = newValue }
    }

    override var underlyingView: UIView {
        return diezButton
    }

    private let diezButton = DiezButton(type: .custom)

    /**
     Applies the provided `Typograph` to the receiver for the provided state.
     */
    @objc(applyTypograph:forState:)
    public func apply(_ typograph: Typograph, for state: UIControl.State) {
        diezButton.apply(
            typograph,
            for: state,
            withAttributedTitle: attributedTitle(for: state)
        )
    }

    /**
     Sets the provided title for the provided control state.
     */
    @objc(setTitle:forState:)
    public func setTitle(_ title: String?, for state: UIControl.State) {
        let attributedTitle: NSAttributedString? = {
            guard let title = title else {
                return nil
            }

            return NSAttributedString(string: title)
        }()

        setAttributedTitle(attributedTitle, for: state)
    }

    /**
     Gets the title for the provided control state.
     */
    @objc(titleForState:)
    public func title(for state: UIControl.State) -> String? {
        return diezButton.title(for: [state, .normal])
    }

    /**
     Sets the provided attributed title for the provided control state.
     */
    @objc(setAttributedTitle:forState:)
    public func setAttributedTitle(_ title: NSAttributedString?, for state: UIControl.State) {
        diezButton.setAttributedTitle(title, for: state)
        diezButton.updateState()
    }

    /**
     Gets the attributed title for the provided control state.
     */
    @objc(attributedTitleForState:)
    public func attributedTitle(for state: UIControl.State) -> NSAttributedString? {
        return diezButton.attributedTitle(for: state)
    }

    /**
     A proxy for the underlying `UIButton`'s `addTarget(...)` function.
     */
    @objc(addTarget:action:forControlEvents:)
    public func addTarget(_ target: Any?, action: Selector, for controlEvents: UIControl.Event) {
        diezButton.addTarget(target, action: action, for: controlEvents)
    }

    /**
     The most recently applied `Typograph` for the provided state, or `nil` if one has not been applied for the provided state.
     */
    @objc(typographForState:)
    public func typograph(for state: UIControl.State) -> Typograph? {
        return diezButton.typograph(for: state)
    }
}

class DiezButton: UIButton {
    var normalTypograph: Typograph?
    var highlightedTypograph: Typograph?
    var disabledTypograph: Typograph?
    var selectedTypograph: Typograph?
    var focusedTypograph: Typograph?
    var applicationTypograph: Typograph?
    var reservedTypograph: Typograph?

    func typograph(for state: UIControl.State) -> Typograph? {
        switch state {
        case .normal:
            return normalTypograph
        case .highlighted:
            return highlightedTypograph
        case .disabled:
            return disabledTypograph
        case .selected:
            return selectedTypograph
        case .focused:
            return focusedTypograph
        case .application:
            return applicationTypograph
        case .reserved:
            return reservedTypograph
        default:
            return nil
        }
    }

    func apply(
        _ typograph: Typograph?,
        for state: UIControl.State,
        withAttributedTitle title: NSAttributedString?
    ) {
        set(typograph: typograph, for: state)

        setAttributedTitle(title, for: state)

        updateState()
    }

    override func layoutSubviews() {
        updateState()

        super.layoutSubviews()
    }

    func updateState() {
        guard let typograph = typograph(for: state) else { return }

        _apply(typograph, for: state, withAttributedTitle: attributedTitle(for: state))
    }

    private func set(typograph: Typograph?, for state: UIControl.State) {
        switch state {
        case .normal:
            normalTypograph = typograph
        case .highlighted:
            highlightedTypograph = typograph
        case .disabled:
            disabledTypograph = typograph
        case .selected:
            selectedTypograph = typograph
        case .focused:
            focusedTypograph = typograph
        case .application:
            applicationTypograph = typograph
        case .reserved:
            reservedTypograph = typograph
        default:
            break
        }
    }

    private func _apply(
        _ typograph: Typograph,
        for state: UIControl.State,
        withAttributedTitle title: NSAttributedString?
    ) {
        titleEdgeInsets = typograph.baselineOffsetCompensationEdgeInsets

        let color = UIColor(color: typograph.color)
        setTitleColor(color, for: state)
        titleLabel?.font = UIFont.from(typograph: typograph)
        titleLabel?.adjustsFontForContentSizeCategory = typograph.shouldScale

        guard let attributedTitle = title else {
            self.setAttributedTitle(title, for: state)
            return
        }

        guard attributedTitle.length > 0 else {
            self.setAttributedTitle(attributedTitle, for: state)
            return
        }

        let range = NSRange(location: 0, length: attributedTitle.length)
        let inputAttributes = attributedTitle.attributes(at: 0, longestEffectiveRange: nil, in: range)
        let typographAttributes = typograph.attributedStringAttributesWith(
            preventLineHeightAdjustment: false,
            preventBaselineOffset: true
        )
        let attributes = inputAttributes.merging(typographAttributes, uniquingKeysWith: { $1 })

        let finalTitle = NSAttributedString(string: attributedTitle.string, attributes: attributes)
        setAttributedTitle(finalTitle, for: state)
    }
}

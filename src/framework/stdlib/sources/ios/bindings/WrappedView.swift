import UIKit

/**
 A `UIView` subclass that composes another view.

 This class can be useful when you want to proxy some state between an underyling view and an API, and/or control the layout of a view within an outter frame.

 - Note: This is intended only for internal use within the generated Diez framework.
 */
@objc(DEZWrappedView)
public class WrappedView: UIView {
    /**
     Subclasses should override this and provide the appropriate view to be wrapped.
     */
    var underlyingView: UIView {
        return UIView()
    }

    var verticalOffset: CGFloat {
        get { return bottomOffsetContstraint.constant }
        set {
            topOffsetContstraint.constant = -newValue
            bottomOffsetContstraint.constant = newValue
        }
    }

    private let underlyingViewLayoutGuide = UILayoutGuide()
    private lazy var topOffsetContstraint: NSLayoutConstraint = {
        return underlyingViewLayoutGuide.topAnchor.constraint(equalTo: topAnchor)
    }()
    private lazy var bottomOffsetContstraint: NSLayoutConstraint = {
        return bottomAnchor.constraint(equalTo: underlyingViewLayoutGuide.bottomAnchor)
    }()

    public override init(frame: CGRect) {
        super.init(frame: frame)

        setup()
    }

    required public init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)

        setup()
    }

    public override var forFirstBaselineLayout: UIView {
        return underlyingView
    }

    public override var forLastBaselineLayout: UIView {
        return underlyingView
    }

    public override func contentHuggingPriority(for axis: NSLayoutConstraint.Axis) -> UILayoutPriority {
        return underlyingView.contentHuggingPriority(for: axis)
    }

    open override func setContentHuggingPriority(_ priority: UILayoutPriority, for axis: NSLayoutConstraint.Axis) {
        underlyingView.setContentHuggingPriority(priority, for: axis)
    }

    public override func contentCompressionResistancePriority(for axis: NSLayoutConstraint.Axis) -> UILayoutPriority {
        return underlyingView.contentCompressionResistancePriority(for: axis)
    }

    open override func setContentCompressionResistancePriority(_ priority: UILayoutPriority, for axis: NSLayoutConstraint.Axis) {
        underlyingView.setContentCompressionResistancePriority(priority, for: axis)
    }

    func setup() {
        addLayoutGuide(underlyingViewLayoutGuide)
        NSLayoutConstraint.activate([
            topOffsetContstraint,
            bottomOffsetContstraint,
            underlyingViewLayoutGuide.leadingAnchor.constraint(equalTo: leadingAnchor),
            underlyingViewLayoutGuide.trailingAnchor.constraint(equalTo: trailingAnchor),
        ])

        addUnderlyingView()
    }

    func addUnderlyingView() {
        underlyingView.translatesAutoresizingMaskIntoConstraints = false
        addSubview(underlyingView)
        NSLayoutConstraint.activate([
            underlyingView.topAnchor.constraint(equalTo: underlyingViewLayoutGuide.topAnchor),
            underlyingView.bottomAnchor.constraint(equalTo: underlyingViewLayoutGuide.bottomAnchor),
            underlyingView.leadingAnchor.constraint(equalTo: underlyingViewLayoutGuide.leadingAnchor),
            underlyingView.trailingAnchor.constraint(equalTo: underlyingViewLayoutGuide.trailingAnchor),
        ])
    }

    override public static var requiresConstraintBasedLayout: Bool { return true }
}

import Foundation
import UIKit

/**
 A view that can be configured with a `Panel`.

 To add subviews to your panel, add the desired views as subviews to the view in the contentView property. Do not directly add subviews to the panel itself. The panel manages multiple layers of content, of which the content view is only one. In addition to the content view, the panel manages background views.
 */
@objc(DEZPanelView)
open class PanelView: UIView {
    /**
     The main view to which you add your panel's content.

     This view is constrainted to the receiver's `layoutMarginsGuide`.
     */
    public var contentView = UIView()

    @objc(applyPanel:)
    public func apply(_ panel: Panel) {
        applyBackground(panel.background)
        layer.apply(panel.dropShadow)
        backgroundView?.layer.cornerRadius = panel.cornerRadius
    }

    @objc(initWithPanel:)
    public convenience init(panel: Panel? = nil) {
        self.init(frame: .zero)

        guard let panel = panel else { return }

        apply(panel)
    }

    public override init(frame: CGRect) {
        super.init(frame: frame)

        setup()
    }

    required public init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)

        setup()
    }

    private var backgroundView: UIView? {
        willSet(newValue) {
            guard backgroundView != newValue else { return }

            backgroundView?.removeFromSuperview()
        }
        didSet {
            guard let backgroundView = backgroundView else { return }

            backgroundView.translatesAutoresizingMaskIntoConstraints = true
            backgroundView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
            backgroundView.frame = bounds
            insertSubview(backgroundView, at: 0)
        }
    }

    private func setup() {
        contentView.translatesAutoresizingMaskIntoConstraints = false
        addSubview(contentView)
        NSLayoutConstraint.activate([
            contentView.leadingAnchor.constraint(equalTo: layoutMarginsGuide.leadingAnchor),
            contentView.trailingAnchor.constraint(equalTo: layoutMarginsGuide.trailingAnchor),
            contentView.topAnchor.constraint(equalTo: layoutMarginsGuide.topAnchor),
            contentView.bottomAnchor.constraint(equalTo: layoutMarginsGuide.bottomAnchor),
        ])
    }

    private func applyBackground(_ fill: Fill) {
        switch fill.type {
        case "Color":
            guard let colorAppliable = backgroundView else {
                let colorView = UIView()
                colorView.apply(fill.color)
                backgroundView = colorView
                break
            }

            colorAppliable.apply(fill.color)
        case "LinearGradient":
            guard let gradientAppliable = backgroundView as? LinearGradientAppliable else {
                let gradientAppliable = LinearGradientView()
                gradientAppliable.apply(fill.linearGradient)
                backgroundView = gradientAppliable
                break
            }

            gradientAppliable.apply(fill.linearGradient)
        default:
            backgroundView?.removeFromSuperview()
            backgroundView = nil
        }
    }
}



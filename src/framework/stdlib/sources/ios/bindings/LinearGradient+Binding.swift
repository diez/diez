import UIKit

@objc
public protocol LinearGradientAppliable {
    @objc(dez_applyLinearGradient:)
    func apply(_ gradient: LinearGradient)
}

extension CAGradientLayer: LinearGradientAppliable {
    @objc(dez_applyLinearGradient:)
    public func apply(_ gradient: LinearGradient) {
        type = .axial
        colors = gradient.stops.map { UIColor(color: $0.color).cgColor }
        locations = gradient.stops.map { NSNumber(floatLiteral: Double($0.position)) }
        startPoint = gradient.start.cgPoint
        endPoint = gradient.end.cgPoint
    }
}

extension CAGradientLayer: ColorAppliable {
    public func apply(_ color: Color) {
        colors = [UIColor(color: color).cgColor, UIColor(color: color).cgColor]
        locations = [0, 1]
    }
}

@objc(DEZLinearGradientView)
open class LinearGradientView: UIView {
    var gradientLayer: CAGradientLayer { return layer as! CAGradientLayer }

    @objc(initWithGradient:)
    public init(gradient: LinearGradient? = nil) {
        super.init(frame: .zero)

        guard let gradient = gradient else { return }

        apply(gradient)
    }

    public required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }

    open override class var layerClass: AnyClass { return CAGradientLayer.self }
}

extension LinearGradientView: LinearGradientAppliable {
    @objc(dez_applyLinearGradient:)
    public func apply(_ gradient: LinearGradient) {
        gradientLayer.apply(gradient)
    }
}

// MARK - LinearGradientView: ColorAppliable
extension LinearGradientView {
    override open func apply(_ color: Color) {
        gradientLayer.apply(color)
    }
}

import QuartzCore

extension CAGradientLayer {
    @objc(dez_applyLinearGradient:)
    public func apply(_ gradient: LinearGradient) {
        type = .axial
        colors = gradient.stops.map { $0.color.uiColor.cgColor }
        locations = gradient.stops.map { NSNumber(floatLiteral: Double($0.position)) }
        startPoint = gradient.start.cgPoint
        endPoint = gradient.end.cgPoint
    }
}

import Foundation
import UIKit

extension CALayer {
    @objc(dez_applyDropShadow:)
    public func apply(_ shadow: DropShadow) {
        masksToBounds = false
        shadowOpacity = 1
        shadowOffset = CGSize(width: shadow.offset.cgPoint.x, height: shadow.offset.cgPoint.y)
        // `DropShadow`'s `radius` value is equal to twice the desired Guassian blur standard deviation.
        // `shadowRadius` expects the standard deviation value so the value must be cut in half.
        shadowRadius = shadow.radius / 2
        shadowColor = UIColor(color: shadow.color).cgColor
    }
}

import Foundation
import CoreGraphics

extension Point2D {
    @objc
    public var cgPoint: CGPoint {
        return CGPoint(x: x, y: y)
    }
}

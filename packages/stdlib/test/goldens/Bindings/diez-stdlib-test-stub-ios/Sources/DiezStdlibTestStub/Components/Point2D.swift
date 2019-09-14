import Foundation
import CoreGraphics

@objc(DEZPoint2D)
public final class Point2D: NSObject, Decodable {
    @objc public internal(set) var x: CGFloat
    @objc public internal(set) var y: CGFloat

    init(
        x: CGFloat,
        y: CGFloat
    ) {
        self.x = x
        self.y = y
    }
}

extension Point2D: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

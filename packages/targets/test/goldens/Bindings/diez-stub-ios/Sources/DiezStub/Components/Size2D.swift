import Foundation
import CoreGraphics

@objc(DEZSize2D)
public final class Size2D: NSObject, Decodable {
    @objc public internal(set) var width: CGFloat
    @objc public internal(set) var height: CGFloat

    init(
        width: CGFloat,
        height: CGFloat
    ) {
        self.width = width
        self.height = height
    }
}

extension Size2D: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

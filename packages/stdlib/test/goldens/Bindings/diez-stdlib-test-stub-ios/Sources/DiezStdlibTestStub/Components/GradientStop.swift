import Foundation
import CoreGraphics

@objc(DEZGradientStop)
public final class GradientStop: NSObject, Decodable {
    @objc public internal(set) var position: CGFloat
    @objc public internal(set) var color: Color

    init(
        position: CGFloat,
        color: Color
    ) {
        self.position = position
        self.color = color
    }
}

extension GradientStop: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

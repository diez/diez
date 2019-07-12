import Foundation
import CoreGraphics

@objc(DEZGradientStop)
public final class GradientStop: NSObject, Decodable {
    @objc public internal(set) var position: CGFloat
    @objc public internal(set) var color: Color

    convenience override init() {
        self.init(
            position: 1,
            color: Color(h: 0.6666666666666666, s: 1, l: 0.5, a: 1)
        )
    }

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

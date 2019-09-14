import Foundation
import CoreGraphics

@objc(DEZFill)
public final class Fill: NSObject, Decodable {
    @objc public internal(set) var color: Color
    @objc public internal(set) var linearGradient: LinearGradient
    @objc public internal(set) var type: String

    init(
        color: Color,
        linearGradient: LinearGradient,
        type: String
    ) {
        self.color = color
        self.linearGradient = linearGradient
        self.type = type
    }
}

extension Fill: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

import Foundation
import CoreGraphics

@objc(DEZColor)
public final class Color: NSObject, Decodable {
    @objc public internal(set) var h: CGFloat
    @objc public internal(set) var s: CGFloat
    @objc public internal(set) var l: CGFloat
    @objc public internal(set) var a: CGFloat

    init(
        h: CGFloat,
        s: CGFloat,
        l: CGFloat,
        a: CGFloat
    ) {
        self.h = h
        self.s = s
        self.l = l
        self.a = a
    }
}

extension Color: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

import Foundation
import CoreGraphics

@objc(DEZTypograph)
public final class Typograph: NSObject, Decodable {
    @objc public internal(set) var font: Font
    @objc public internal(set) var fontSize: CGFloat
    @objc public internal(set) var color: Color

    init(
        font: Font,
        fontSize: CGFloat,
        color: Color
    ) {
        self.font = font
        self.fontSize = fontSize
        self.color = color
    }
}

extension Typograph: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

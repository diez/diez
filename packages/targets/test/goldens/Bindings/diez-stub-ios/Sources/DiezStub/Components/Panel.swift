import Foundation
import CoreGraphics

@objc(DEZPanel)
public final class Panel: NSObject, Decodable {
    @objc public internal(set) var cornerRadius: CGFloat
    @objc public internal(set) var background: Fill
    @objc public internal(set) var dropShadow: DropShadow

    init(
        cornerRadius: CGFloat,
        background: Fill,
        dropShadow: DropShadow
    ) {
        self.cornerRadius = cornerRadius
        self.background = background
        self.dropShadow = dropShadow
    }
}

extension Panel: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

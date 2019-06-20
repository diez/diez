import Foundation
import CoreGraphics

@objc(DEZFile)
public final class File: NSObject, Decodable {
    @objc public internal(set) var src: String
    @objc public internal(set) var type: String

    init(
        src: String,
        type: String
    ) {
        self.src = src
        self.type = type
    }
}

extension File: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

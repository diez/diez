import Foundation
import CoreGraphics
@objc(DEZEmptyComponent)
public final class EmptyComponent: NSObject, Decodable {
    public override init() {}
}

extension EmptyComponent: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

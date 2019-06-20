import Foundation
import CoreGraphics

@objc(DEZChildComponent)
public final class ChildComponent: NSObject, Decodable {
    @objc public internal(set) var diez: CGFloat

    convenience override init() {
        self.init(
            diez: 10
        )
    }

    init(
        diez: CGFloat
    ) {
        self.diez = diez
    }
}

extension ChildComponent: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

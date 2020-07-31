import Foundation
import CoreGraphics
@objc(DEZNestedPrefabComponent)
public final class NestedPrefabComponent: NSObject, Decodable {
    /**
     * 1
     */
    @objc public internal(set) var diez: CGFloat
    /**
     * - diez: `2`
     */
    @objc public internal(set) var child: ChildComponent
    /**
     * hsla(0, 0, 0, 1)
     */
    @objc public internal(set) var color: Color

    init(
        diez: CGFloat,
        child: ChildComponent,
        color: Color
    ) {
        self.diez = diez
        self.child = child
        self.color = color
    }
}

extension NestedPrefabComponent: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

import Foundation
import UIKit
@objc(DEZPrimitives)
public final class Primitives: NSObject, RootComponent {
    /**
     * Test property comment
     *
     * 10
     */
    @objc public internal(set) var number: CGFloat
    /**
     * 10
     */
    @objc public internal(set) var integer: Int
    /**
     * 10
     */
    @objc public internal(set) var float: CGFloat
    /**
     * ten
     */
    @objc public internal(set) var string: String
    /**
     * true
     */
    @objc public internal(set) var boolean: Bool
    /**
     * [[1,2],[3,4],[5]]
     */
    @objc public internal(set) var integers: [[CGFloat]]
    /**
     * [[[6],[7]],[[8],[9]],[[10]]]
     */
    @objc public internal(set) var strings: [[[String]]]
    /**
     * []
     */
    @objc public internal(set) var emptyList: [String]
    /**
     * - diez: `10`
     */
    @objc public internal(set) var child: ChildComponent
    /**
     * [[]]
     */
    @objc public internal(set) var childs: [[ChildComponent]]
    @objc public internal(set) var emptyChild: EmptyComponent
    /**
     * - diez: `1`
     * - child: ``
     * - color: `hsla(0, 0, 0, 1)`
     */
    @objc public internal(set) var nestedPrefabs: NestedPrefabComponent
    /**
     * - diez: `1`
     * - child: ``
     * - color: `hsla(0, 1, 0.4, 1)`
     */
    @objc public internal(set) var nestedPrefabsWithOverride: NestedPrefabComponent
    /**
     * References too!
     *
     * `References.myRef` ( 10 )
     */
    @objc public internal(set) var referred: CGFloat

    convenience public override init() {
        self.init(
            number: 10,
            integer: 10,
            float: 10,
            string: "ten",
            boolean: true,
            integers: [[1, 2], [3, 4], [5]],
            strings: [[["6"], ["7"]], [["8"], ["9"]], [["10"]]],
            emptyList: [],
            child: ChildComponent(diez: 10),
            childs: [[ChildComponent(diez: 10)]],
            emptyChild: EmptyComponent(),
            nestedPrefabs: NestedPrefabComponent(diez: 1, child: ChildComponent(diez: 2), color: Color(h: 0, s: 0, l: 0, a: 1)),
            nestedPrefabsWithOverride: NestedPrefabComponent(diez: 1, child: ChildComponent(diez: 2), color: Color(h: 0, s: 1, l: 0.403921568627451, a: 1)),
            referred: 10
        )
    }

    init(
        number: CGFloat,
        integer: Int,
        float: CGFloat,
        string: String,
        boolean: Bool,
        integers: [[CGFloat]],
        strings: [[[String]]],
        emptyList: [String],
        child: ChildComponent,
        childs: [[ChildComponent]],
        emptyChild: EmptyComponent,
        nestedPrefabs: NestedPrefabComponent,
        nestedPrefabsWithOverride: NestedPrefabComponent,
        referred: CGFloat
    ) {
        self.number = number
        self.integer = integer
        self.float = float
        self.string = string
        self.boolean = boolean
        self.integers = integers
        self.strings = strings
        self.emptyList = emptyList
        self.child = child
        self.childs = childs
        self.emptyChild = emptyChild
        self.nestedPrefabs = nestedPrefabs
        self.nestedPrefabsWithOverride = nestedPrefabsWithOverride
        self.referred = referred
    }

    public static let name = "Primitives"
}

extension Primitives: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

/// This is only intended to be used by Objective-C consumers.
/// In Swift use Diez<Primitives>.
@available(swift, obsoleted: 0.0.1)
@objc(DEZDiezPrimitives)
public final class DiezBridgedPrimitives: NSObject {
    @objc public init(view: UIView) {
        diez = Diez(view: view)

        super.init()
    }

    /**
     Registers the provided block for updates to the Primitives.

     The provided closure is called synchronously when this function is called.

     If in [hot mode](x-source-tag://Diez), this closure will also be called whenever changes occur to the
     component.

     - Parameter subscriber: The block to be called when the component updates.
     */
    @objc public func attach(_ subscriber: @escaping (Primitives?, NSError?) -> Void) {
        diez.attach { result in
            switch result {
            case .success(let component):
                subscriber(component, nil)
            case .failure(let error):
                subscriber(nil, error.asNSError)
            }
        }
    }

    private let diez: Diez<Primitives>
}

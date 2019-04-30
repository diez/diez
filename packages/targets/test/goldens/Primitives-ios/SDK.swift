
@objc(DEZChildComponent)
public final class ChildComponent: NSObject, Decodable {
    @objc public var diez: CGFloat

    private enum CodingKeys: String, CodingKey {
        case diez
    }

    override init() {
        diez = 10
    }

    init(
        diez: CGFloat
    ) {
        self.diez = diez
    }
}

extension ChildComponent: Updatable {
    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        diez = try container.decode(CGFloat.self, forKey: .diez)
    }
}

extension ChildComponent: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

@objc(DEZEmptyComponent)
public final class EmptyComponent: NSObject, Decodable {
    public override init() {}
}

extension EmptyComponent: Updatable {
    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
    }
}

extension EmptyComponent: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

@objc(DEZPrimitives)
public final class Primitives: NSObject, StateBag {
    @objc public var number: CGFloat
    @objc public var integer: Int
    @objc public var float: CGFloat
    @objc public var string: String
    @objc public var boolean: Bool
    @objc public var integers: [[CGFloat]]
    @objc public var strings: [[[String]]]
    @objc public var child: ChildComponent
    @objc public var emptyChild: EmptyComponent

    private enum CodingKeys: String, CodingKey {
        case number
        case integer
        case float
        case string
        case boolean
        case integers
        case strings
        case child
        case emptyChild
    }

    public override init() {
        number = 10
        integer = 10
        float = 10
        string = "ten"
        boolean = true
        integers = [[1, 2], [3, 4], [5]]
        strings = [[["6"], ["7"]], [["8"], ["9"]], [["10"]]]
        child = ChildComponent()
        emptyChild = EmptyComponent()
    }

    init(
        number: CGFloat,
        integer: Int,
        float: CGFloat,
        string: String,
        boolean: Bool,
        integers: [[CGFloat]],
        strings: [[[String]]],
        child: ChildComponent,
        emptyChild: EmptyComponent
    ) {
        self.number = number
        self.integer = integer
        self.float = float
        self.string = string
        self.boolean = boolean
        self.integers = integers
        self.strings = strings
        self.child = child
        self.emptyChild = emptyChild
    }

    public static let name = "Primitives"
}

extension Primitives: Updatable {
    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        number = try container.decode(CGFloat.self, forKey: .number)
        integer = try container.decode(Int.self, forKey: .integer)
        float = try container.decode(CGFloat.self, forKey: .float)
        string = try container.decode(String.self, forKey: .string)
        boolean = try container.decode(Bool.self, forKey: .boolean)
        integers = try container.decode([[CGFloat]].self, forKey: .integers)
        strings = try container.decode([[[String]]].self, forKey: .strings)
        try container.update(&child, forKey: .child)
        try container.update(&emptyChild, forKey: .emptyChild)
    }
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

    @objc public func attach(_ subscriber: @escaping (Primitives) -> Void) {
        diez.attach(subscriber)
    }

    private let diez: Diez<Primitives>
}


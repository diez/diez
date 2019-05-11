
@objc(DEZChildComponent)
public final class ChildComponent: NSObject, Decodable {
    @objc public internal(set) var diez: CGFloat

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
        guard let container = try decoder.containerIfPresent(keyedBy: CodingKeys.self) else { return }
        try container.update(value: &diez, forKey: .diez)
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
        guard let container = try decoder.containerIfPresent(keyedBy: CodingKeys.self) else { return }
    }
}

extension EmptyComponent: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

@objc(DEZPrimitives)
public final class Primitives: NSObject, StateBag {
    @objc public internal(set) var number: CGFloat
    @objc public internal(set) var integer: Int
    @objc public internal(set) var float: CGFloat
    @objc public internal(set) var string: String
    @objc public internal(set) var boolean: Bool
    @objc public internal(set) var integers: [[CGFloat]]
    @objc public internal(set) var strings: [[[String]]]
    @objc public internal(set) var child: ChildComponent
    @objc public internal(set) var emptyChild: EmptyComponent

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
        guard let container = try decoder.containerIfPresent(keyedBy: CodingKeys.self) else { return }
        try container.update(value: &number, forKey: .number)
        try container.update(value: &integer, forKey: .integer)
        try container.update(value: &float, forKey: .float)
        try container.update(value: &string, forKey: .string)
        try container.update(value: &boolean, forKey: .boolean)
        try container.update(value: &integers, forKey: .integers)
        try container.update(value: &strings, forKey: .strings)
        try container.update(updatable: &child, forKey: .child)
        try container.update(updatable: &emptyChild, forKey: .emptyChild)
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

    /**
     Registers the provided block for updates to the Primitives.

     The provided closure is called synchronously when this function is called.
     
     If in [development mode](x-source-tag://Diez), this closure will also be called whenever changes occur to the
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


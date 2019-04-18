
public final class PrimitivesComponent: NSObject, StateBag {
    var listener: Method? = nil
    public var number: CGFloat
    public var string: String
    public var boolean: Bool

    private enum CodingKeys: String, CodingKey {
        case number
        case string
        case boolean
    }

    public init(_ listenerIn: Method?) {
        listener = listenerIn
        number = 10
        string = "ten"
        boolean = true
    }

    public static let name = "PrimitivesComponent"

    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        number = try container.decode(CGFloat.self, forKey: .number)
        string = try container.decode(String.self, forKey: .string)
        boolean = try container.decode(Bool.self, forKey: .boolean)
    }
}


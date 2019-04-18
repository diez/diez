public class File: NSObject, Codable {
    var src: String

    private var fullyQualifiedURLString: String {
        // TODO: when we are not in development, we should load the file from a local bundle URL.
        // This will look something like: Bundle.main.url(forResource: "index", withExtension: "html")
        // except we will be loading from the framework bundle (not main). Probably this should be handled
        // inside class Environment {...}.
        return environment.isDevelopment
            ? "\(environment.serverUrl)\(src)"
            : "TODO"
    }

    public init(src: String) {
        self.src = src
        super.init()
    }

    public var url: URL? {
        return URL(string: fullyQualifiedURLString)
    }

    public var request: URLRequest? {
        guard let url = url else {
            return nil
        }

        return URLRequest(url: url)
    }

    // TODO: update hash equality to also consider contents of the underlying file.
    public override func isEqual(_ other: Any?) -> Bool {
        guard let other = other as? File else {
            return false
        }
        return src == other.src
    }

    public override var hash: Int {
        var hasher = Hasher()
        hasher.combine(src)
        return hasher.finalize()
    }
}

extension File: Updatable {
    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        src = try container.decode(String.self, forKey: .src)
    }
}

public final class File: NSObject, Decodable {
    public var url: URL? {
        return URL(string: fullyQualifiedURLString)
    }
    public var request: URLRequest? {
        guard let url = url else {
            return nil
        }

        return URLRequest(url: url)
    }

    var src: String

    init(src: String) {
        self.src = src
        super.init()
    }

    private var fullyQualifiedURLString: String {
        // TODO: when we are not in development, we should load the file from a local bundle URL.
        // This will look something like: Bundle.main.url(forResource: "index", withExtension: "html")
        // except we will be loading from the framework bundle (not main). Probably this should be handled
        // inside class Environment {...}.
        return environment.isDevelopment
            ? "\(environment.serverUrl)\(src)"
            : "TODO"
    }
}

extension File: Updatable {
    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        src = try container.decode(String.self, forKey: .src)
    }
}

// MARK: File<Equatable>

extension File {
    public override func isEqual(_ other: Any?) -> Bool {
        guard let other = other as? File else {
            return false
        }
        // TODO: Update to also consider contents of the underlying file.
        return src == other.src
    }
}

// MARK: File<Hashable>

extension File {
    public override var hash: Int {
        // TODO: Update to also consider contents of the underlying file.
        var hasher = Hasher()
        hasher.combine(src)
        return hasher.finalize()
    }
}

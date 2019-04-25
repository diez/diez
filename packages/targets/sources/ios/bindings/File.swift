public final class File: NSObject, Decodable {
    public var src: String

    private enum CodingKeys: String, CodingKey {
        case src
    }


    init(
        src: String
    ) {
        self.src = src
    }
}

extension File: Updatable {
    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        src = try container.decode(String.self, forKey: .src)
    }
}

extension File: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

extension File {
    public var url: URL? {
        if environment.isDevelopment {
            return URL(string: "\(environment.serverUrl)\(src)")
        }

        return Bundle.diezResources?.url(forFile: self)
    }
    public var request: URLRequest? {
        guard let url = url else {
            return nil
        }

        return URLRequest(url: url)
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

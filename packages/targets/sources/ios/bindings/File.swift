public final class File: NSObject, Decodable {
    public internal(set) var src: String

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
        guard let container = try decoder.containerIfPresent(keyedBy: CodingKeys.self) else { return }
        try container.update(value: &src, forKey: .src)
    }
}

extension File: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

extension File {
    /**
     - Tag: File.url

     The `URL` of the resource the file is referencing.

     When in [hot mode](x-source-tag://Diez), this will be a `URL` to resource on the Diez server.

     When not in [hot mode](x-source-tag://Diez), this will be a `URL` pointing to the resource on the
     filesystem (within the SDK's asset bundle).

     - Note: This `URL` will only be `nil` if there is an issue parsing the `URL` when in
       [hot mode](x-source-tag://Diez). This should never be `nil` when not in
       [hot mode](x-source-tag://Diez).
     */
    public var url: URL? {
        if environment.isHot {
            let relativeURLComponents = URLComponents(string: src)
            return relativeURLComponents?.url(relativeTo: environment.serverURL)
        }

        return Bundle.diezResources?.url(forFile: self)
    }

    /**
     A `URLRequest` to the provided file.

     Uses the [url](x-source-tag://File.url) to create the request.

     - See: [url](x-source-tag://File.url)
     */
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

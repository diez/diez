public final class SVG: NSObject, Codable {
    public var url: URL? {
        return file.url
    }

    var src: String
    var file: File {
      return File(src: "\(src).html")
    }

    init(src: String) {
        self.src = src
        super.init()
    }

    private enum CodingKeys: String, CodingKey {
        case src
    }
}

extension SVG: Updatable {
    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        src = try container.decode(String.self, forKey: .src)
    }
}

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

extension WKWebView {
    public func load(_ svg: SVG) {
        guard let request = svg.file.request else {
            print("unable to load SVG URL")
            return
        }

        scrollView.isScrollEnabled = false
        isOpaque = false
        backgroundColor = .clear
        load(request)
    }
}

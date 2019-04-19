import UIKit.UIView
import WebKit

// TODO: this should also accept options.
public final class Haiku: NSObject, Decodable {
    public var url: URL? {
        return file.url
    }

    var component: String
    var file: File {
      return File(src: "haiku/\(component).html")
    }

    init(withComponent component: String) {
        self.component = component
    }

    private enum CodingKeys: String, CodingKey {
        case component
    }
}

extension Haiku: Updatable {
    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        component = try container.decode(String.self, forKey: .component)
    }
}

extension WKWebView {
    public func load(_ haiku: Haiku) {
        guard let request = haiku.file.request else {
            print("unable to load Haiku URL")
            return
        }

        scrollView.isScrollEnabled = false
        isOpaque = false
        backgroundColor = .clear
        load(request)
    }
}

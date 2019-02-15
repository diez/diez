import UIKit.UIView
import WebKit

// TODO: this should also be updatable.
// TODO: this should also accept options.
public class Haiku : NSObject, Decodable, Updatable {
    var file: File

    init(withFile file: File) {
        self.file = file
    }

    private enum CodingKeys: String, CodingKey {
        case file
    }

    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        file = try container.decode(File.self, forKey: .file)
    }

    public func embedHaiku(forView view: UIView) -> WKWebView? {
        guard let url = file.url() else {
            print("unable to load Haiku URL")
            return nil
        }

        let wk = WKWebView(frame: view.bounds)
        wk.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        wk.isOpaque = false
        wk.backgroundColor = UIColor.clear
        wk.load(URLRequest(url: url))
        view.addSubview(wk)
        return wk
    }
}

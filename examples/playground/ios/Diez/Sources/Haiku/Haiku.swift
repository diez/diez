import UIKit.UIView
import WebKit

// TODO: this should also be updatable.
// TODO: this should also accept options.
public class Haiku : NSObject, Decodable, Updatable {
    var packageName: String

    init(withPackageName packageName: String) {
        self.packageName = packageName
    }

    private func file() -> File {
      return File(withSrc: "/haiku/\(packageName)")
    }

    private enum CodingKeys: String, CodingKey {
        case packageName
    }

    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        packageName = try container.decode(String.self, forKey: .packageName)
    }

    public func embedHaiku(inView view: UIView) {
        guard let request = file().request() else {
            print("unable to load Haiku URL")
            return
        }

        // TODO: keep a weak handle to this webview and update it on updates.
        // TODO: implement a HaikuView metaclass.
        let wk = WKWebView(frame: view.bounds)
        wk.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        wk.scrollView.isScrollEnabled = false
        wk.isOpaque = false
        wk.backgroundColor = .clear
        wk.load(request)
        view.addSubview(wk)
    }
}

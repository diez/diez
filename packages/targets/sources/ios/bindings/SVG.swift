public class SVG: NSObject, Codable, Updatable {
    var src: String
    private var file: File?

    private enum CodingKeys: String, CodingKey {
        case src
    }

    init(withSrc src: String) {
        self.src = src
        self.file = File(withSrc: "\(src).html")
        super.init()
    }

    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        src = try container.decode(String.self, forKey: .src)
        file = File(withSrc: "\(src).html")
    }

    public func embedSvg(inView view: UIView) {
        guard let request = file?.request() else {
            print("unable to load SVG URL")
            return
        }

        // TODO: keep a weak handle to this webview and update it on updates.
        // TODO: implement a SVGView metaclass.
        let wk = WKWebView(frame: view.bounds)
        wk.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        wk.scrollView.isScrollEnabled = false
        wk.isOpaque = false
        wk.backgroundColor = .clear
        wk.load(request)
        view.addSubview(wk)
    }
}

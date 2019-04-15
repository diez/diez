public class SVG : NSObject, Decodable, Updatable {
    var file: File

    init(withFile file: File) {
        self.file = file
        super.init()
    }

    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        file = try container.decode(File.self, forKey: .file)
    }

    public func embedSvg(inView view: UIView) {
        guard let request = file.request() else {
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

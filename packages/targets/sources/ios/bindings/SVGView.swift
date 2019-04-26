/**
 A view responsible for rendering an SVG.
 */
public final class SVGView: UIView {
    public override init(frame: CGRect) {
        super.init(frame: frame)

        setup()
    }

    public required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)

        setup()
    }


    /**
     Loads the provided `SVG`.
     */
    public func load(_ svg: SVG) {
        // TODO: Add a parameter that allows a fade in animated and add a description of the parameter to doc comment.
        guard let request = svg.file.request else {
            print("unable to load SVG URL")
            return
        }

        // TODO: Warn user if NSAppTransportSecurity.NSAllowsLocalNetworking is not set to true in their Info.plist.

        webView.scrollView.isScrollEnabled = false
        webView.isOpaque = false
        webView.backgroundColor = .clear
        webView.load(request)
    }

    private let webView = WKWebView()

    private func setup() {
        webView.translatesAutoresizingMaskIntoConstraints = false
        addSubview(webView)
        NSLayoutConstraint.activate([
            webView.leadingAnchor.constraint(equalTo: leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: trailingAnchor),
            webView.topAnchor.constraint(equalTo: topAnchor),
            webView.bottomAnchor.constraint(equalTo: bottomAnchor),
        ])
    }

    public override class var requiresConstraintBasedLayout: Bool { return true }
}

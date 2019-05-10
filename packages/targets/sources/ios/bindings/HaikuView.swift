/**
 A view responsible for rendering a Haiku animation.
 */
@objc(DEZHaikuView)
public final class HaikuView: UIView {
    public override init(frame: CGRect) {
        super.init(frame: frame)

        setup()
    }

    public required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)

        setup()
    }

    /**
     Loads the provided `Haiku`.
     */
    @objc(loadHaiku:)
    public func load(_ haiku: Haiku) {
        // TODO: Add a parameter that allows a fade in animated and add a description of the parameter to doc comment.
        guard let request = haiku.file.request else {
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

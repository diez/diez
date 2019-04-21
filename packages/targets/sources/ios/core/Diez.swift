public typealias Method = (String, Any?) -> Void

public protocol StateBag: Decodable, Updatable {
    init()
    static var name: String { get }
}

public class Diez<T>: NSObject, WKScriptMessageHandler where T: StateBag {
    public private(set) var component: T

    public init(_ view: UIView) {
        let webView = WKWebView(frame: .zero)
        component = T()
        self.webView = webView
        super.init()

        webView.configuration.userContentController.add(self, name: "patch")
        if (environment.isDevelopment) {
            let url = URL(string: "\(environment.serverUrl)components/\(T.name)")!
            webView.load(URLRequest(url: url))
        } else if let url  = Bundle.main.url(forResource: "index", withExtension: "html") {
            webView.load(URLRequest(url: url))
        }

        view.addSubview(webView)

        let displayLink = CADisplayLink(target: self, selector: #selector(tick))
        displayLink.add(to: .current, forMode: .common)
    }

    public func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        do {
            switch (message.name) {
            case "patch":
                if let body = message.body as? String {
                    try decoder.update(&component, from: Data(body.utf8))
                    broadcast()
                }
                break
            default:
                print("unknown message: " + message.name)
            }
        } catch { print(error) }
    }

    public func attach(_ subscriber: @escaping (T) -> Void) {
        // Initially execute a synchronous call on our subscriber.
        subscriber(component)
        subscribers.append(subscriber)
    }

    private let decoder = JSONDecoder()
    private var subscribers: [(T) -> Void] = []
    private let webView: WKWebView

    private func broadcast() {
        for subscriber in subscribers {
            subscriber(component)
        }
    }

    @objc private func tick() {
        webView.evaluateJavaScript("tick(\(CACurrentMediaTime() * 1000))")
    }
}

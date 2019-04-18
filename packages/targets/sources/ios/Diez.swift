public typealias Method = (String, Any?) -> Void

public protocol StateBag: Decodable, Updatable {
    init(_ listener: Method?)
    static var name: String { get }
}

public class Diez<T>: NSObject, WKScriptMessageHandler where T: StateBag {
    public private(set) var component: T
    private let decoder = JSONDecoder()
    private var subscribers: [(T) -> Void] = []
    private let wk: WKWebView

    public init(_ view: UIView) {
        let wk = WKWebView(frame: .zero)
        component = T({(_ eventName: String, payload: Any?) in
            wk.evaluateJavaScript("trigger('\(eventName)')")
        })
        self.wk = wk
        super.init()

        wk.configuration.userContentController.add(self, name: "patch")
        if (environment.isDevelopment) {
            let url = URL(string: "\(environment.serverUrl)components/\(T.name)")!
            wk.load(URLRequest(url: url))
        } else if let url  = Bundle.main.url(forResource: "index", withExtension: "html") {
            wk.load(URLRequest(url: url))
        }

        view.addSubview(wk)

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

    private func broadcast() {
        for subscriber in subscribers {
            subscriber(component)
        }
    }

    @objc private func tick() {
        wk.evaluateJavaScript("tick(\(CACurrentMediaTime() * 1000))")
    }
}

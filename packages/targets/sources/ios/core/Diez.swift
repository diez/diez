public typealias Method = (String, Any?) -> Void

public protocol StateBag: Decodable, Updatable {
    init()
    static var name: String { get }
}

public class Diez<T>: NSObject where T: StateBag {
    public private(set) var component: T

    public init(view: UIView) {
        component = T()

        if environment.isDevelopment {
            updateObserver = UpdateObserver(view: view)
        } else {
            updateObserver = nil
        }

        super.init()

        updateObserver?.delegate = self
    }

    public func attach(_ subscriber: @escaping (T) -> Void) {
        // Initially execute a synchronous call on our subscriber.
        subscriber(component)
        subscribers.append(subscriber)
    }

    private let decoder = JSONDecoder()
    private var subscribers: [(T) -> Void] = []
    private let updateObserver: UpdateObserver<T>?

    private func broadcast() {
        for subscriber in subscribers {
            subscriber(component)
        }
    }
}

extension Diez: UpdateObserverDelegate {
    func update(with body: String) {
        do {
            try decoder.update(&component, from: Data(body.utf8))
            broadcast()
        } catch { print(error) }
    }
}

private protocol UpdateObserverDelegate: NSObject {
    func update(with body: String)
}

private class UpdateObserver<T>: NSObject, WKScriptMessageHandler where T: StateBag {
    weak var delegate: UpdateObserverDelegate?

    init(view: UIView) {
        webView = WKWebView()
        super.init()

        webView.configuration.userContentController.add(self, name: MessageName.patch.rawValue)
        let url = URL(string: "\(environment.serverUrl)components/\(T.name)")!
        webView.load(URLRequest(url: url))
        view.addSubview(webView)
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let name = MessageName(rawValue: message.name) else {
            print("unknown message: " + message.name)
            return
        }

        switch name {
        case .patch:
            if let body = message.body as? String {
                delegate?.update(with: body)
            }
        }
    }

    private enum MessageName: String {
        case patch
    }

    private let webView: WKWebView
}

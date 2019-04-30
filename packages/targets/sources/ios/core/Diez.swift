/**
 - Tag: StateBag

 A component that can be observed by a [Diez](x-source-tag://Diez) instance.
 */
public protocol StateBag: Decodable, Updatable {
    init()
    static var name: String { get }
}

/**
 - Tag: Diez

 The class responsible for registering for updates to components.

 When the value of `IS_DEVELOPMENT` is set to `YES` in the `Diez.plist` found in the SDK's generated source directory,
 Diez will run in development mode.

 When in development mode, this class will instantiate a `WKWebView` that is used to communicate with the Diez server 
 to provide component updates as they are made on the server.

 When not in development mode, no `WKWebView` is instantiated and content is only served from the resources embedded in 
 the framework.

 - Note: The presence of a `WKWebView` in development mode and the need to provide a `UIView` will be removed in the 
   future.
 */
public class Diez<T>: NSObject where T: StateBag {
    /**
     - Tag: Diez.component

     The component that is being observed.

     This property will be updated as changes are observed when in [development mode](x-source-tag://Diez).
     */
    public private(set) var component: T

    /**
     - Parameter view: When in [development mode](x-source-tag://Diez), this view will have a visually empty 
       `WKWebView` added to it in order to communicate with the Diez server. When not in [development mode]
       (x-source-tag://Diez) this value is unused.

     - Note: The presence of a `WKWebView` in [development mode](x-source-tag://Diez) and the need to provide a 
       `UIView` will be removed in a future version.
     */
    public init(view: UIView) {
        component = T()

        if environment.isDevelopment {
            // TODO: Warn user if NSAppTransportSecurity.NSAllowsLocalNetworking is not set to true in their Info.plist.
            updateObserver = UpdateObserver(view: view)
        } else {
            updateObserver = nil
        }

        super.init()

        updateObserver?.delegate = self
    }

    /**
     Registers the provided closure for updates to the [component](x-source-tag://Diez.component).

     The provided closure is called synchronously when this function is called.
     
     If in [development mode](x-source-tag://Diez), this closure will also be called whenever changes occur to the
     component.

     - Parameter subscriber: The closure to be called when the component updates.
     */
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

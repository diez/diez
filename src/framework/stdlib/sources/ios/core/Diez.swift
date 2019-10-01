import WebKit

/**
 - Tag: RootComponent

 A component that can be observed by a [Diez](x-source-tag://Diez) instance.
 */
public protocol RootComponent: Decodable {
    init()
    static var name: String { get }
}

/**
 - Tag: Diez

 The class responsible for registering for updates to components.

 When the value of `DiezIsHot` is set to `YES` in the application's `Info.plist` found in the SDK's generated source directory, Diez will run in hot mode.

 When in hot mode, this class will instantiate a `WKWebView` that is used to communicate with the Diez server to provide component updates as they are made on the server.

 When not in hot mode, no `WKWebView` is instantiated and content is only served from the resources embedded in the framework.

 - Note: The presence of a `WKWebView` in hot mode and the need to provide a `UIView` will be removed in the future.
 */
public final class Diez<T>: NSObject where T: RootComponent {
    /**
     - Parameter view: When in [hot mode](x-source-tag://Diez), this view will have a visually empty `WKWebView` added to it in order to communicate with the Diez server. When not in [hot mode] (x-source-tag://Diez) this value is unused.

     - Note: The presence of a `WKWebView` in [hot mode](x-source-tag://Diez) and the need to provide a `UIView` will be removed in a future version.
     */
    public init(view: UIView) {
        component = T()

        if environment.isHot && Bundle.main.allowsLocalNetworking {
            updateObserver = UpdateObserver(view: view)
        } else {
            updateObserver = nil
        }

        super.init()

        updateObserver?.delegate = self
    }

    /// An error that occurs when receiving updates form the design server.
    public struct AttachError: Error {
        /// The type of error that occured.
        public enum ErrorType {
            /// The context in which the decoding error occurred.
            public struct DecodingErrorContext {
                /// The name of the property that failed to decode.
                public let propertyName: String

                /// A description of what went wrong, for debugging purposes.
                public let debugDescription: String
            }

            /**
             An indication that a value could not be decoded because it was the incorrect type.

             As an associated value, this case contains the context for debugging.
             */
            case typeMismatch(DecodingErrorContext)

            /**
             An indication that the data is corrupted or otherwise invalid.

             As an associated value, this case contains the context for debugging.
             */
            case dataCorrupted(DecodingErrorContext)

            /**
             An indication that the application's Info.plist does not have NSAllowsLocalNetworking set to true under the
             NSAppTransportSecurity key.
             */
            case appTransportSecurityFailure

            /**
             An indication that an unrecognized error has occured.
             */
            case unrecognized
        }

        /// The type of error that occured.
        public let errorType: ErrorType

        /// The underlying error which caused this error, if any.
        public let underlyingError: Error?
    }

    public typealias AttachResult = Result<T, AttachError>
    public typealias AttachSubscription = (AttachResult) -> Void

    /**
     Registers the provided closure for updates to the component of type `T`.

     The provided closure is called synchronously when this function is called.

     Iff in [hot mode](x-source-tag://Diez), this closure will also be called whenever changes occur to the component.

     - Parameter subscriber: The closure to be called when the component updates.
     */
    public func attach(_ subscriber: @escaping AttachSubscription) {
        if environment.isHot && !Bundle.main.allowsLocalNetworking {
            let error = AttachError(
                errorType: .appTransportSecurityFailure,
                underlyingError: nil)
            subscriber(.failure(error))
            return;
        }

        subscriber(.success(component))

        if environment.isHot {
          subscribers.append(subscriber)
        }
    }

    private var component: T
    private let decoder = JSONDecoder()
    private var subscribers: [AttachSubscription] = []
    private let updateObserver: UpdateObserver<T>?

    private func broadcast(_ result: AttachResult) {
        for subscriber in subscribers {
            subscriber(result)
        }
    }
}

extension Diez: UpdateObserverDelegate {
    func update(with body: String) {
        let result = resultForUpdate(with: body)
        broadcast(result)
    }

    private func resultForUpdate(with body: String) -> AttachResult {
        do {
            component = try decoder.decode(T.self, from: Data(body.utf8))
            return .success(component)
        } catch {
            guard let decodingError = error as? DecodingError else {
                let attachError = AttachError(
                    errorType: .unrecognized,
                    underlyingError: error
                )
                return .failure(attachError)
            }

            let attachError = AttachError(
                errorType: AttachError.ErrorType(decodingError),
                underlyingError: error
            )
            return .failure(attachError)
        }
    }
}

private extension Diez.AttachError.ErrorType.DecodingErrorContext {
    init(context: DecodingError.Context) {
        let propertyName = context.codingPath.map { $0.stringValue }.joined(separator: ".")
        self.init(
            propertyName: propertyName,
            debugDescription: context.debugDescription
        )
    }
}

private extension Diez.AttachError.ErrorType {
    static func propertyName(from codingPath: [CodingKey]) -> String {
        return codingPath.map { $0.stringValue }.joined(separator: ".")
    }
}

private extension Diez.AttachError.ErrorType {
    init(_ underlyingError: DecodingError) {
        switch underlyingError {
        case .typeMismatch(_, let context):
            let context = DecodingErrorContext(context: context)
            self = .typeMismatch(context)
        case .valueNotFound(_, let context):
            let context = DecodingErrorContext(context: context)
            self = .typeMismatch(context)
        case .dataCorrupted(let context):
            let context = DecodingErrorContext(context: context)
            self = .dataCorrupted(context)
        case .keyNotFound:
            // This should have been caught and ignored upstream.
            self = .unrecognized
        @unknown default:
            self = .unrecognized
        }
    }
}

extension Diez.AttachError {
    var asNSError: NSError {
        let error = self as NSError
        var userInfo = error.userInfo
        userInfo[NSLocalizedDescriptionKey] = debugDescription

        return NSError(domain: error.domain, code: error.code, userInfo: userInfo)
    }
}

extension Diez.AttachError: CustomDebugStringConvertible {
    public var debugDescription: String {
        switch self.errorType {
        case .typeMismatch(let context):
            return "Type mismatch for property named \"\(context.propertyName)\": \(context.debugDescription)"
        case .dataCorrupted(let context):
            return "Data corrupted for property named: \(context.propertyName): \(context.debugDescription)"
        case .appTransportSecurityFailure:
            return """
            The NSAllowsLocalNetworking key must be set to true under NSAllowsLocalNetworking in the main bundle's Info.plist to use hot mode.
            For example:
            <key>NSAppTransportSecurity</key>
            <dict>
            <key>NSAllowsLocalNetworking</key>
            <true/>
            </dict>
            """
        case .unrecognized:
            let suffix: String = {
                guard let error = underlyingError else {
                    return "."
                }

                return ": \(error)"
            }()
            return "An unrecognized error has occured\(suffix)"
        }
    }
}

private protocol UpdateObserverDelegate: NSObject {
    func update(with body: String)
}

private final class UpdateObserver<T>: NSObject, WKScriptMessageHandler where T: RootComponent {
    weak var delegate: UpdateObserverDelegate?

    init(view: UIView) {
        webView = WKWebView()
        super.init()

        webView.configuration.userContentController.add(self, name: MessageName.patch.rawValue)
        let url = environment.serverURL
            .appendingPathComponent("components")
            .appendingPathComponent(T.name)
        webView.load(URLRequest(url: url))
        view.addSubview(webView)
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let name = MessageName(rawValue: message.name) else {
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

extension Bundle {
    var allowsLocalNetworking: Bool {
        guard
            let appTransportSecurity = Bundle.main.infoDictionary?["NSAppTransportSecurity"] as? [String: Any],
            let allowsLocalNetworking = appTransportSecurity["NSAllowsLocalNetworking"] as? Bool else {
                return false
        }

        return allowsLocalNetworking
    }
}

public class File : NSObject, Codable {
    var src: String

    private func fullyQualifiedUrl() -> String {
        // TODO: when we are not in development, we should load the file from a local bundle URL.
        // This will look something like: Bundle.main.url(forResource: "index", withExtension: "html")
        // except we will be loading from the framework bundle (not main). Probably this should be handled
        // inside class Environment {...}.
        return environment.isDevelopment
            ? "\(environment.serverUrl)\(src)"
            : "TODO"
    }

    public init(withSrc src: String) {
        self.src = src
        super.init()
    }

    public func url() -> URL? {
        return URL(string: fullyQualifiedUrl())
    }

    public func request() -> URLRequest? {
        guard let url = url() else {
            return nil
        }

        return URLRequest(url: url)
    }
}

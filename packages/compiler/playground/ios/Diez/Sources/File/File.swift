import Foundation

public class File : NSObject, Codable {
    var src: String

    public init(withSrc src: String) {
        self.src = src
        super.init()
    }

    public func url() -> URL? {
        // TODO: when we are not in development, we should load the file from a local bundle URL.
        // This will look something like: Bundle.main.url(forResource: "index", withExtension: "html")
        // except we will be loading from the framework bundle (not main). Probably this should be handled
        // inside class Environment {...}.
        let fqUrl = environment.isDevelopment
            ? "\(environment.serverUrl)\(src)"
            : "TODO"

        return URL(string: fqUrl)
    }
}

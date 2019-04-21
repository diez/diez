public class Environment: NSObject {
    fileprivate var infoDict: NSDictionary {
        get {
            if let path = Bundle(for: type(of: self)).path(forResource: "Diez", ofType: "plist") {
              return NSDictionary(contentsOfFile: path)!
            }

            fatalError("Configuration not found")
        }
    }

    var isDevelopment: Bool {
        get {
            return infoDict["IS_DEVELOPMENT"] as! Bool
        }
    }

    var serverUrl: String {
        get {
            return infoDict["SERVER_URL"] as! String
        }
    }
}

// Global singleton.
let environment = Environment()

import Foundation

public class Environment: NSObject {
    fileprivate var infoDict: [String: Any] {
        get {
            if let dict = Bundle(for: Environment.self).infoDictionary {
                return dict
            }

            fatalError("Info.plist not found")
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

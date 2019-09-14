import Foundation

final class Environment: NSObject {
    var isHot: Bool {
        let isHot = Bundle.main.infoDictionary?["DiezIsHot"] as? Bool
        return isHot ?? false
    }

    var serverURL: URL {
        guard
            let serverURLString = Bundle.main.infoDictionary?["DiezServerURL"] as? String,
            let serverURL = URL(string: serverURLString) else {
                return URL(string: "http://localhost:8080")!
        }

        return serverURL
    }
}

let environment = Environment()

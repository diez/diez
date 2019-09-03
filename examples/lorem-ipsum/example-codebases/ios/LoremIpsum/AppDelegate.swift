import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        let viewController = ViewController()

        let window = UIWindow(frame: UIScreen.main.bounds)
        window.rootViewController = viewController
        self.window = window

        window.makeKeyAndVisible()

        return true
    }
}

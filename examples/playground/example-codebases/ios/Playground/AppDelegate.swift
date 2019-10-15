import UIKit
import DiezPlayground

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    private var diez: Diez<DesignSystem>!

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        let viewController = ListViewController(title: "Examples", items: [
            typographNavigationItem
        ])
        let rootViewController = UINavigationController(rootViewController: viewController)

        let window = UIWindow(frame: UIScreen.main.bounds)
        window.rootViewController = rootViewController
        self.window = window

        window.makeKeyAndVisible()

        diez = Diez<DesignSystem>(view: rootViewController.view)
        diez.attach { result in
            guard case .success(let designSystem) = result else { return }

            designSystem.typography.fonts.forEach { registerFont($0) }
        }

        return true
    }
}

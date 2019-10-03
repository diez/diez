import UIKit

typealias ViewControllerFactory = () -> UIViewController

indirect enum NavigationItemContent {
    case viewController(ViewControllerFactory)
    case list([NavigationItem])
}

struct NavigationItem {
    let title: String
    let content: NavigationItemContent
}

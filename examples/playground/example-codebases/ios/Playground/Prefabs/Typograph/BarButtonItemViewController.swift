import UIKit
import DiezPlayground

class BarButtonItemViewController: UIViewController {
    private lazy var diez = Diez<DesignSystem>(view: view)
    let barButtonItem = UIBarButtonItem(title: "Button", style: .plain, target: nil, action: nil)

    override func viewDidLoad() {
        super.viewDidLoad()

        navigationItem.rightBarButtonItem = barButtonItem

        diez.attach { [weak self] result in
            switch result {
            case .failure(let error):
                fatalError(error.localizedDescription)
            case .success(let designSystem):
                self?.apply(designSystem)
            }
        }

        view.backgroundColor = .white
    }

    private func apply(_ designSystem: DesignSystem) {
        barButtonItem.applyTitleAttributes(with: designSystem.typography.buttonPressed, for: .normal)
        barButtonItem.applyTitleAttributes(with: designSystem.typography.navigationTitle, for: .highlighted)
    }
}

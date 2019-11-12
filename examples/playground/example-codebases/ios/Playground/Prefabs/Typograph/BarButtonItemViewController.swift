import UIKit
import DiezPlayground

class BarButtonItemViewController: UIViewController {
    private lazy var diez = Diez<DesignLanguage>(view: view)
    let barButtonItem = UIBarButtonItem(title: "Button", style: .plain, target: nil, action: nil)

    override func viewDidLoad() {
        super.viewDidLoad()

        navigationItem.rightBarButtonItem = barButtonItem

        diez.attach { [weak self] result in
            switch result {
            case .failure(let error):
                fatalError(error.localizedDescription)
            case .success(let designLanguage):
                self?.apply(designLanguage)
            }
        }

        view.backgroundColor = .white
    }

    private func apply(_ designLanguage: DesignLanguage) {
        barButtonItem.applyTitleAttributes(with: designLanguage.typography.buttonPressed, for: .normal)
        barButtonItem.applyTitleAttributes(with: designLanguage.typography.navigationTitle, for: .highlighted)
    }
}

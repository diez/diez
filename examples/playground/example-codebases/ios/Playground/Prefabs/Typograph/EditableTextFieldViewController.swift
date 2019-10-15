import UIKit
import DiezPlayground
import SnapKit

class EditableTextFieldViewController: UIViewController {
    private lazy var diez = Diez<DesignSystem>(view: view)
    private let textField = TextField()

    override func viewDidLoad() {
        super.viewDidLoad()

        textField.text = "Lorem ipsum"
        textField.uiTextField.allowsEditingTextAttributes = true

        view.addSubview(textField)
        textField.snp.makeConstraints { make in
            make.top.leading.trailing.equalTo(view.safeAreaLayoutGuide)
        }

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
        textField.apply(designSystem.typography.basic)
    }
}

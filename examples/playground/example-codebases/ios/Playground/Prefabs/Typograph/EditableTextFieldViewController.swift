import UIKit
import DiezPlayground
import SnapKit

class EditableTextFieldViewController: UIViewController {
    private lazy var diez = Diez<DesignLanguage>(view: view)
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
            case .success(let designLanguage):
                self?.apply(designLanguage)
            }
        }

        view.backgroundColor = .white
    }

    private func apply(_ designLanguage: DesignLanguage) {
        textField.apply(designLanguage.typography.basic)
    }
}

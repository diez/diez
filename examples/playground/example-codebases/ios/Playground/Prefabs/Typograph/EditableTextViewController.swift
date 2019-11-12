import UIKit
import DiezPlayground
import SnapKit

class EditableTextViewController: UIViewController {
    private lazy var diez = Diez<DesignLanguage>(view: view)
    private let textView = TextView()

    override func viewDidLoad() {
        super.viewDidLoad()

        textView.text = "Lorem ipsum"
        textView.uiTextView.allowsEditingTextAttributes = true

        view.addSubview(textView)
        textView.snp.makeConstraints { make in
            make.edges.equalTo(view.safeAreaLayoutGuide)
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
        textView.apply(designLanguage.typography.basic)
    }
}

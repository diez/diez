import UIKit
import DiezPlayground
import SnapKit

class SegmentedControlViewController: UIViewController {
    private lazy var diez = Diez<DesignLanguage>(view: view)
    private let segmentedControl = UISegmentedControl(items: [
        "One",
        "Two",
        "Three",
    ])

    override func viewDidLoad() {
        super.viewDidLoad()

        view.addSubview(segmentedControl)
        segmentedControl.snp.makeConstraints { make in
            make.top.equalTo(view.snp.topMargin)
            make.centerX.equalTo(view)
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
        segmentedControl.applyTitleAttributes(with: designLanguage.typography.basic, for: .normal)
        segmentedControl.applyTitleAttributes(with: designLanguage.typography.navigationTitle, for: .selected)
    }
}

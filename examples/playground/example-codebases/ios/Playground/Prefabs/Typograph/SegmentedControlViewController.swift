import UIKit
import DiezPlayground
import SnapKit

class SegmentedControlViewController: UIViewController {
    private lazy var diez = Diez<DesignSystem>(view: view)
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
            case .success(let designSystem):
                self?.apply(designSystem)
            }
        }

        view.backgroundColor = .white
    }

    private func apply(_ designSystem: DesignSystem) {
        segmentedControl.applyTitleAttributes(with: designSystem.typography.basic, for: .normal)
        segmentedControl.applyTitleAttributes(with: designSystem.typography.navigationTitle, for: .selected)
    }
}

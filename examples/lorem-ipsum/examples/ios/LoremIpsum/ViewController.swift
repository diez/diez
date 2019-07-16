import UIKit
import DiezLoremIpsum

class ViewController: UIViewController {
    private lazy var diez = Diez<DesignSystem>(view: view)

    override func viewDidLoad() {
        super.viewDidLoad()

        // Here we are observing hot updates to our design system.
        //
        // Since this instance of Diez was initialized as Diez<DesignSystem>, it will deliver updates to the
        // DesignSystem object described in `src/DesignSystem.ts` (relative to the root of the Diez project).
        diez.attach { [weak self] result in
            switch result {
            case .success(let designSystem):
                self?.apply(designSystem)
            case .failure(let error):
                print(error)
            }
        }
    }

    private func apply(_ designSystem: DesignSystem) {
        guard let view = self.view as? View else {
            fatalError("Unexpected view type: \(String(describing: self.view))")
        }

        view.backgroundColor = designSystem.palette.background.uiColor
        
        view.headerBackgroundView.gradientLayer.apply(designSystem.palette.headerBackground);

        if let mastheadImage = designSystem.images.masthead.uiImage {
            view.headerView.backgroundColor = UIColor(patternImage: mastheadImage)
        }

        view.iconView.image = designSystem.images.logo.uiImage

        view.contentBackgroundView.backgroundColor = designSystem.palette.contentBackground.uiColor
        let margin = designSystem.layoutValues.contentMargin
        view.contentStackView.layoutMargins = UIEdgeInsets(
            top: margin.top,
            left: margin.left,
            bottom: margin.bottom,
            right: margin.right
        )
        view.contentStackView.spacing = designSystem.layoutValues.spacingSmall

        view.titleLabel.apply(designSystem.typography.heading1)
        view.titleLabel.text = designSystem.strings.title

        view.captionLabel.apply(designSystem.typography.caption)
        view.captionLabel.text = designSystem.strings.caption

        view.animationStackView.spacing = designSystem.layoutValues.spacingMedium

        view.animationView.load(designSystem.loadingAnimation)
        view.animationLabel.apply(designSystem.typography.body)

        view.animationLabel.text = designSystem.strings.helper
    }

    init() {
        super.init(nibName: nil, bundle: nil)
    }

    override func loadView() {
        view = View()
    }

    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }

    @available(*, unavailable)
    required init?(coder aDecoder: NSCoder) { fatalError("\(#function) not implemented.") }
}

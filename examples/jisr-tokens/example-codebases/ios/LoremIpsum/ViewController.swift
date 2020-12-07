import UIKit
import DiezLoremIpsum

class ViewController: UIViewController {
    private lazy var diez = Diez<DesignLanguage>(view: view)

    override func viewDidLoad() {
        super.viewDidLoad()

        // Here we are observing hot updates to our design language.
        //
        // Since this instance of Diez was initialized as Diez<DesignLanguage>, it will deliver updates to the
        // DesignLanguage object described in `src/DesignLanguage.ts` (relative to the root of the Diez project).
        diez.attach { [weak self] result in
            switch result {
            case .success(let designLanguage):
                self?.apply(designLanguage)
            case .failure(let error):
                print(error)
            }
        }
    }

    private func apply(_ designLanguage: DesignLanguage) {
        guard let view = self.view as? View else {
            fatalError("Unexpected view type: \(String(describing: self.view))")
        }

        view.headerBackgroundView.gradientLayer.apply(designLanguage.palette.headerBackground);

        if let mastheadImage = UIImage(image: designLanguage.images.masthead) {
            view.headerView.backgroundColor = UIColor(patternImage: mastheadImage)
        }

        view.iconView.image = UIImage(image: designLanguage.images.logo)
        view.iconView.layer.apply(designLanguage.shadows.logo)

        view.contentBackgroundView.backgroundColor = UIColor(color: designLanguage.palette.contentBackground)
        let margin = designLanguage.layoutValues.contentMargin
        view.contentStackView.layoutMargins = UIEdgeInsets(
            top: margin.top,
            left: margin.left,
            bottom: margin.bottom,
            right: margin.right
        )
        view.contentStackView.spacing = designLanguage.layoutValues.spacingSmall

        view.titleLabel.apply(designLanguage.typography.heading1)
        view.titleLabel.text = designLanguage.strings.title

        view.captionLabel.apply(designLanguage.typography.caption)
        view.captionLabel.text = designLanguage.strings.caption

        view.animationStackView.spacing = designLanguage.layoutValues.spacingMedium

        view.animationView.load(designLanguage.loadingAnimation)
        view.animationLabel.apply(designLanguage.typography.body)

        view.animationLabel.text = designLanguage.strings.helper
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

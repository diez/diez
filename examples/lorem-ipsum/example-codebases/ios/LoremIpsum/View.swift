import UIKit
import Lottie
import DiezLoremIpsum

class View: UIView {
    let headerBackgroundView = GradientView()
    let headerView = UIView()
    let contentBackgroundView = UIView()
    let contentStackView = UIStackView()
    let iconView = UIImageView()
    let titleLabel = UILabel()
    let captionLabel = UILabel()
    let animationStackView = UIStackView()
    let animationView = AnimationView()
    let animationLabel = UILabel()

    override init(frame: CGRect) {
        super.init(frame: frame)

        setupLayout()
    }

    override class var requiresConstraintBasedLayout: Bool {
        return true
    }

    private let stackView = UIStackView()

    private func setupLayout() {
        setupStackView()
        addHeaderView()
        addContentStackView()
        addIconView()
    }

    private func setupStackView() {
        stackView.axis = .vertical
        stackView.translatesAutoresizingMaskIntoConstraints = false
        addSubview(stackView)
        stackView.leadingAnchor.constraint(equalTo: leadingAnchor).isActive = true
        stackView.trailingAnchor.constraint(equalTo: trailingAnchor).isActive = true
        stackView.topAnchor.constraint(equalTo: safeAreaLayoutGuide.topAnchor).isActive = true
        stackView.bottomAnchor.constraint(equalTo: bottomAnchor).isActive = true
    }

    private func addHeaderView() {
        headerBackgroundView.translatesAutoresizingMaskIntoConstraints = false
        insertSubview(headerBackgroundView, belowSubview: stackView)

        headerBackgroundView.topAnchor.constraint(equalTo: topAnchor).isActive = true
        headerBackgroundView.leadingAnchor.constraint(equalTo: leadingAnchor).isActive = true
        headerBackgroundView.trailingAnchor.constraint(equalTo: trailingAnchor).isActive = true

        stackView.addArrangedSubview(headerView)

        headerView.bottomAnchor.constraint(equalTo: headerBackgroundView.bottomAnchor).isActive = true
        headerView.heightAnchor.constraint(equalToConstant: 112).isActive = true
    }

    private func addContentStackView() {
        contentStackView.axis = .vertical
        contentStackView.isLayoutMarginsRelativeArrangement = true
        stackView.addArrangedSubview(contentStackView)

        titleLabel.numberOfLines = 0
        contentStackView.addArrangedSubview(titleLabel)

        captionLabel.numberOfLines = 0
        contentStackView.addArrangedSubview(captionLabel)

        let animationContainerView = makeAnimationContainerView()
        contentStackView.addArrangedSubview(animationContainerView)

        contentBackgroundView.translatesAutoresizingMaskIntoConstraints = false
        contentStackView.insertSubview(contentBackgroundView, at: 0)
        contentBackgroundView.leadingAnchor.constraint(equalTo: contentStackView.leadingAnchor).isActive = true
        contentBackgroundView.trailingAnchor.constraint(equalTo: contentStackView.trailingAnchor).isActive = true
        contentBackgroundView.topAnchor.constraint(equalTo: contentStackView.topAnchor).isActive = true
        contentBackgroundView.bottomAnchor.constraint(equalTo: contentStackView.bottomAnchor).isActive = true
    }

    private func makeAnimationContainerView() -> UIView {
        animationStackView.axis = .vertical

        let animationContainerView = UIView()
        animationView.widthAnchor.constraint(equalToConstant: 174).isActive = true
        animationView.heightAnchor.constraint(equalToConstant: 165).isActive = true
        animationView.translatesAutoresizingMaskIntoConstraints = false
        animationContainerView.addSubview(animationView)
        animationView.centerXAnchor.constraint(equalTo: animationContainerView.centerXAnchor).isActive = true
        animationView.topAnchor.constraint(equalTo: animationContainerView.topAnchor).isActive = true
        animationView.bottomAnchor.constraint(equalTo: animationContainerView.bottomAnchor).isActive = true
        animationStackView.addArrangedSubview(animationContainerView)

        animationLabel.numberOfLines = 0
        animationLabel.textAlignment = .center
        animationStackView.addArrangedSubview(animationLabel)

        let animationStackViewContainerView = UIView()
        animationStackView.translatesAutoresizingMaskIntoConstraints = false
        animationStackViewContainerView.addSubview(animationStackView)
        animationStackView.leadingAnchor.constraint(equalTo: animationStackViewContainerView.leadingAnchor).isActive = true
        animationStackView.trailingAnchor.constraint(equalTo: animationStackViewContainerView.trailingAnchor).isActive = true
        animationStackView.centerYAnchor.constraint(equalTo: animationStackViewContainerView.centerYAnchor).isActive = true

        return animationStackViewContainerView
    }

    private func addIconView() {
        iconView.translatesAutoresizingMaskIntoConstraints = false
        stackView.addSubview(iconView)
        iconView.centerYAnchor.constraint(equalTo: headerView.bottomAnchor).isActive = true
        iconView.leadingAnchor.constraint(equalTo: titleLabel.leadingAnchor).isActive = true
    }

    @available(*, unavailable)
    required init(coder aDecoder: NSCoder) { fatalError("\(#function) not implemented.") }
}

class GradientView: UIView {
    var gradientLayer: CAGradientLayer { return layer as! CAGradientLayer }
    override class var layerClass: AnyClass { return CAGradientLayer.self }
}

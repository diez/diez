import UIKit
import Diez
import WebKit
import Lottie

class ViewController: UIViewController {
    @IBOutlet weak var label: UILabel!
    @IBOutlet weak var animationContainer: WKWebView!
    @IBOutlet weak var ratContainer: WKWebView!
    @IBOutlet weak var lottieContainer: LOTAnimationView!

    private lazy var diez = Diez<MyStateBag>(view)

    override func viewDidLoad() {
        super.viewDidLoad()

        // Add a tap gesture recognizer that calls out to diez.
        let singleFingerTap = UITapGestureRecognizer(target: self, action: #selector(handleSingleTap))
        view.addGestureRecognizer(singleFingerTap)

        // Style our animation container. TODO: we should do this with a shadow binding!
        animationContainer.autoresizesSubviews = true
        animationContainer.layer.masksToBounds = false
        animationContainer.layer.shadowOffset = CGSize(width: -10, height: -20)
        animationContainer.layer.shadowRadius = 10
        animationContainer.layer.shadowOpacity = 1
        animationContainer.layer.shadowColor = UIColor(red: 1, green: 0, blue: 0, alpha: 0.4).cgColor

        ratContainer.autoresizesSubviews = true
        ratContainer.backgroundColor = .clear

        lottieContainer.autoresizesSubviews = true
        lottieContainer.backgroundColor = .clear

        // Subscribe to component changes.
        diez.attach { [weak self] component in
            guard let self = self else { return }

            self.label.text = "\(component.copy). \(component.numbers[10])"
            self.label.apply(component.textStyle)
            if let image = component.image.image {
                self.view.backgroundColor = UIColor(patternImage: image)
            }

            self.ratContainer.load(component.svg)
            self.animationContainer.load(component.haiku)
            self.lottieContainer.load(component.lottie)
        }
    }

    @objc func handleSingleTap() {
        // TODO: self.diez.component.tap()
    }
}

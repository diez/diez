import UIKit
import Diez
import WebKit
import Lottie

class ViewController: UIViewController {
    @IBOutlet weak var label: UILabel!
    @IBOutlet weak var haikuView: HaikuView!
    @IBOutlet weak var svgView: SVGView!
    @IBOutlet weak var lottieView: LOTAnimationView!

    private lazy var diez = Diez<MyStateBag>(view: view)

    override func viewDidLoad() {
        super.viewDidLoad()

        // Subscribe to component changes.
        diez.attach { [weak self] component in
            guard let self = self else { return }

            self.label.text = "\(component.text). \(component.numbers[10])"
            self.label.apply(component.textStyle)
            if let image = component.image.image {
                self.view.backgroundColor = UIColor(patternImage: image)
            }

            self.svgView.load(component.svg)
            self.haikuView.load(component.haiku)
            self.lottieView.load(component.lottie)
        }
    }
}

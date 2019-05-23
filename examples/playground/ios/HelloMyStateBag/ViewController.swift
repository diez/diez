import UIKit
import DiezPlayground
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
        diez.attach { [weak self] result in
            switch result {
            case .success(let component):
                self?.apply(component)
            case .failure(let error):
                print(error)
            }
        }
    }

    private func apply(_ component: MyStateBag) {
        label.text = "\(component.text). \(component.numbers[10])"
        label.apply(component.typograph)
        if let image = component.image.image {
            view.backgroundColor = UIColor(patternImage: image)
        }
        svgView.load(component.svg)
        haikuView.load(component.haiku)
        lottieView.load(component.lottie)
    }
}

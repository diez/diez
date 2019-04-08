import UIKit
import Diez

class ViewController: UIViewController {
    @IBOutlet weak var label: UILabel!
    @IBOutlet weak var animationContainer: UIView!
    @IBOutlet weak var ratContainer: UIView!
    @IBOutlet weak var lottieContainer: UIView!

    let diez = Diez<MyStateBag>()

    override func viewDidLoad() {
        super.viewDidLoad()

        // Add a tap gesture recognizer that calls out to diez.
        let singleFingerTap = UITapGestureRecognizer(target: self, action: #selector(handleSingleTap))
        view.addGestureRecognizer(singleFingerTap)

        // Style our animation container. TODO: we should do this with a shadow prefab!
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

        // TODO: allow these to update on changes in a sane way.
        diez.component.haiku.embedHaiku(inView: animationContainer)
        diez.component.svg.embedSvg(inView: ratContainer)
        diez.component.lottie.embedLottie(inView: lottieContainer)

        // Subscribe to component changes.
        diez.attach(self, subscriber: {(component: MyStateBag) in
            self.label.text = component.copy
            component.textStyle.setTextStyle(forLabel: self.label)
            self.label.sizeToFit()
            self.label.textAlignment = .center
            self.label.center = self.view.center
            component.image.setBackground(forView: self.view)
        })
    }

    @objc func handleSingleTap() {
        // TODO: self.diez.component.tap()
    }
}

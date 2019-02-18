import UIKit
import Diez

class ViewController: UIViewController {
    @IBOutlet weak var label: UILabel!
    @IBOutlet weak var animationContainer: UIView!
    @IBOutlet weak var ratContainer: UIView!
    let diez = Diez<MyStateBag>()
    // TODO: handle downstream state changes atomically.
    var embeddedViewOnce = false

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
        animationContainer.layer.shadowOpacity = 0.2

        ratContainer.autoresizesSubviews = true
        ratContainer.backgroundColor = .clear

        // Subscribe to component changes.
        diez.attach(self, subscriber: {(component: MyStateBag) in
            self.label.text = component.copy
            component.textStyle.setTextStyle(forLabel: self.label)
            self.label.sizeToFit()
            self.label.textAlignment = .center
            self.label.center = self.view.center
            component.image.setBackground(forView: self.view)
            if (!self.embeddedViewOnce) {
                self.embeddedViewOnce = true
                component.haiku.embedHaiku(inView: self.animationContainer)
                component.svg.embedSvg(inView: self.ratContainer)
            }
        })
    }

    @objc func handleSingleTap() {
        self.diez.component.tap()
    }
}

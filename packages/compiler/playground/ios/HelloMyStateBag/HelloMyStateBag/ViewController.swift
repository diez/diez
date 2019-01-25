import UIKit
import Diez

class ViewController: UIViewController {
    @IBOutlet weak var label: UILabel!
    @IBOutlet weak var animationContainer: UIView!
    let diez = Diez<MyStateBag>()
    var embeddedHaikuOnce = false

    override func viewDidLoad() {
        super.viewDidLoad()

        // Add a tap gesture recognizer that calls out to diez.
        let singleFingerTap = UITapGestureRecognizer(target: self, action: #selector(handleSingleTap))
        view.addGestureRecognizer(singleFingerTap)

        // Style our animation container. TODO: we should do this with a shadow prefab!
        animationContainer.autoresizesSubviews = true
        animationContainer.layer.masksToBounds = false;
        animationContainer.layer.shadowOffset = CGSize(width: -10, height: -20);
        animationContainer.layer.shadowRadius = 10;
        animationContainer.layer.shadowOpacity = 0.2;

        // Subscribe to component changes.
        diez.attach(self, subscriber: {(component: MyStateBag) in
            self.label.text = component.copy
            component.textStyle.setTextStyle(forLabel: self.label)
            self.label.sizeToFit()
            self.label.textAlignment = .center
            self.label.center = self.view.center
            component.image.setBackground(forView: self.view)
            if (!self.embeddedHaikuOnce) {
                if component.haiku.embedHaiku(forView: self.animationContainer) != nil {
                    self.embeddedHaikuOnce = true
                }
            }
        })
    }

    @objc func handleSingleTap() {
        self.diez.component.tap()
    }
}

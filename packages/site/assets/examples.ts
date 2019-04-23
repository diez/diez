export const Examples = {
  typescript: `class MyPalette extends Component<Palette> {
  @shared helloRValue!: number;
  @property hello = expression<Color>((helloRValue: number) => Color.rgba(helloRValue, 0, 0, 1));
}

export class MyStateBag extends Component {
  @property palette = new MyPalette();

  @property helloRValue = 255;

  private name = 'Diez';

  @property copy = \`Hello \${ this.name }\`;

  @property image = new Image({
    file: new File({
      // Try changing this to diez.jpg!
      src: '/assets/images/haiku.jpg',
    }),
    width: 246,
    height: 246,
    scale: 3,
  });

  @property svg = new SVG({
    file: new File({src: '/assets/images/rat.svg'}),
  });

  @property lottie = new Lottie({
    file: new File({src: '/assets/lottie/loading-pizza.json'}),
  });

  // Makes Android fonts available on iOS.
  @property fontRegistry = FontRegistry.fromFiles(
    '/assets/fonts/Roboto-Black.ttf',
    '/assets/fonts/Roboto-BlackItalic.ttf',
    '/assets/fonts/Roboto-Bold.ttf',
    '/assets/fonts/Roboto-BoldItalic.ttf',
    '/assets/fonts/Roboto-Italic.ttf',
    '/assets/fonts/Roboto-Light.ttf',
    '/assets/fonts/Roboto-LightItalic.ttf',
    '/assets/fonts/Roboto-Medium.ttf',
    '/assets/fonts/Roboto-MediumItalic.ttf',
    '/assets/fonts/Roboto-Regular.ttf',
    '/assets/fonts/Roboto-Thin.ttf',
    '/assets/fonts/Roboto-ThinItalic.ttf',
  );

  @property textStyle = new TextStyle({
    font: IOSFonts.Helvetica,
    fontSize: 50,
    color: this.palette.hello,
  });

  @property haiku = new Haiku({
    component: '@haiku/taylor-testthang',
  });

  @method async tap () {
    await this.palette.hello.tween(
      {h: 0.3},
      // Default curve is linear!
      {duration: 5000},
    );
    await this.palette.hello.tween(
      // You can tween multiple values at once!
      {h: 0.9, l: 0.5},
      {
        duration: 5000,
        // You can specify any pure function (number) -> number as a curve!
        curve: easeInOutExpo,
      },
    );
    await this.palette.tween(
      // You can tween an entire component instead of its inner state!
      {hello: Color.rgba(255, 0, 0, 1)},
      {duration: 5000},
    );
  }
}
  `,
  kotlin: `package ai.haiku.hellomystatebag

import ai.haiku.diez.puente.Diez
import ai.haiku.diez.components.MyStateBag
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.view.MotionEvent
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity() {
    val diez = Diez(MyStateBag())

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        diez.attach(layout, fun(component) {
            runOnUiThread {
                text.text = component.copy
                component.textStyle.setTextStyle(text)
                component.image.setBackground(view)
            }
        })
        // FIXME: Note how we must to do this *after* we've called diez.attach() at least once.
        // This is because the environment hasn't been correctly initialized yet.
        runOnUiThread {
            diez.component.haiku.embedHaiku(haikuSlot)
            diez.component.svg.embedSvg(ratSlot)
            diez.component.lottie.embedLottie(lottieSlot)
        }
    }

    override fun onTouchEvent(e: MotionEvent): Boolean {
        if (e.action == MotionEvent.ACTION_DOWN) {
            diez.component.tap()
        }
        return true
    }
}`,
  swift: `import UIKit
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
}`,
  javascript: `import {Environment} from './Environment';
import {Color} from './sources/color/Color';
import {Haiku} from './sources/haiku/Haiku';
import {Image} from './sources/image/Image';
import {FontRegistry, TextStyle} from './sources/typography/Typography';
import {Lottie} from './sources/lottie/Lottie';

export class MyPalette {
  constructor () {
    this.hello = new Color();
  }

  update (payload) {
    if (!payload) {
      return;
    }

    this.hello.update(payload.hello);
  }
}
export class MyStateBag {
  constructor () {
    this.copy = ''
    this.helloRValue = '';
    this.image = new Image();
    this.svg = new Image();
    this.palette = new MyPalette();
    this.fontRegistry = new FontRegistry();
    this.textStyle = new TextStyle();
    this.haiku = new Haiku();
    this.lottie = new Lottie();
  }

  update (payload) {
    if (!payload) {
      return;
    }

    if (payload.copy !== undefined) {
      this.copy = payload.copy;
    }
    if (payload.helloRValue !== undefined) {
      this.helloRValue = payload.helloRValue;
    }

    this.image.update(payload.image);
    this.svg.update(payload.svg);
    this.palette.update(payload.palette);
    this.textStyle.update(payload.textStyle);
    this.haiku.update(payload.haiku);
    this.lottie.update(payload.lottie);
  }
}

export class Diez {
  constructor (componentType) {
    this._iframe = document.createElement('iframe');
    this._component = new componentType();
    this.tick = this.tick.bind(this);
  }

  tick () {
    if (this._iframe.contentWindow) {
      this._iframe.contentWindow.postMessage(Date.now(), '*');
    }

    requestAnimationFrame(this.tick);
  };

  subscribe (subscriber) {
    if (this._iframe.contentWindow) {
      return;
    }

    subscriber(this._component);
    this._iframe.src = \`\${ Environment.serverUrl } /components/\${ this._component.constructor.name }\`;
    this._iframe.width = '0';
    this._iframe.height = '0';
    this._iframe.style.display = 'none';
    document.body.appendChild(this._iframe);
    window.addEventListener('message', (event) => {
      if (event.origin === Environment.serverUrl) {
        this._component.update(JSON.parse(event.data));
        subscriber(this._component);
      }
    });
    requestAnimationFrame(this.tick);
  }
}`,
}
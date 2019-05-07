export const Examples = {
  '/': {
    typescript: `import {Color, TextStyle} from '@diez/designsystem';
import {Component, property} from '@diez/engine';

class Palette extends Component {
  private lightener = 0.2;

  @property black = Color.rgb(8, 8, 12);
  @property pink500 = Color.rgb(255, 63, 112);
  @property pink400 = this.pink500.lighten(this.lightener);
}

const palette = new Palette();

class TextStyles extends Component {
  @property heading1 = new TextStyle({
    fontSize: 24,
    fontName: 'SourceCodePro-Regular',
    color: palette.black,
  });
}

export class DesignSystem extends Component {
  @property palette = palette;
  @property textStyles = new TextStyles();
}`,
    kotlin: `import org.diez.*

class MainActivity : AppCompatActivity() {

    lateinit var ds: DesignSystem

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        Diez(DesignSystem(), root).attach(fun(component) {
            runOnUiThread {
                ds = component
                onDiezUpdated()
            }
        })
    }

    private fun onDiezUpdated() {
        view.setBackgroundColor(ds.palette.pink500)
        textView.textStyle = ds.textStyles.heading1
    }
}`,
    swift: `import Diez

class ViewController: UIViewController {
    private lazy var diez = Diez<DesignSystem>(view: view)

    override func viewDidLoad() {
        super.viewDidLoad()
        diez.attach { [weak self] ds in
            self?.apply(ds)
        }
    }

    private func apply(_ ds: DesignSystem) {
        view.backgroundColor = ds.palette.pink500
        textView.textStyle = ds.textStyles.heading1
    }
}`,
    javascript: `import {DesignSystem, Diez} from 'diez';

class View extends React.PureComponent {
  constructor () {
    this.diez = new Diez(DesignSystem);
  }

  componentWillMount () {
    this.diez.attach((ds) => {
      this.setState({ds});
    });
  }

  render () {
    const {ds} = this.state;

    return (
      <div style={{backgroundColor: ds.palette.pink500}}>
        <h1 style={ds.textStyles.heading1.style}>
          Hello Diez!
        </h1>
      </div>
    );
  }
}`,
  },
};

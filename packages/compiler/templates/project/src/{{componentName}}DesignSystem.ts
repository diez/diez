import {Color, Palette} from '@livedesigner/designsystem';
import {Component, expression, property, shared} from '@livedesigner/engine';

class {{componentName}}Palette extends Component<Palette> {
  @shared pinkLightener!: number;

  @property red = Color.rgba(255, 0, 0, 0);

  @property pink = expression<Color>(() => this.red.lighten(this.pinkLightener));
}

export class {{componentName}}DesignSystem extends Component {
  @property pinkLightener = 0.25;

  @property palette = new {{componentName}}Palette();
}

import {Color} from '@livedesigner/designsystem';
import {Component, expression, property} from '@livedesigner/engine';

export interface {{componentName}}Properties {
  red: Color;
  pink: Color;
}

export class {{componentName}}Component extends Component<{{componentName}}Properties> {
  @property red: Color = Color.rgba(255, 0, 0, 0);

  @property pink = expression<Color>(
    (red: Color) => red.lighten(0.25),
  );
}

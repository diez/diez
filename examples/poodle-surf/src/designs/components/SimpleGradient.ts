import {Color} from '@diez/prefabs';
import {Component, property} from '@diez/engine';

interface SimpleGradientState {
  startColor: Color;
  endColor: Color;
  startPointX: number;
  startPointY: number;
  endPointX: number;
  endPointY: number;
}

/**
 * Provides a simple gradient with two colors.
 */
export class SimpleGradient extends Component<SimpleGradientState> {
  @property startColor = Color.rgba(0, 0, 0, 1);
  @property endColor = Color.rgba(255, 255, 255, 1);
  @property startPointX = 0;
  @property startPointY = 0;
  @property endPointX = 1;
  @property endPointY = 1;
}

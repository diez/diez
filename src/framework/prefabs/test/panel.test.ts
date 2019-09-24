import {Color} from '../src/color';
import {DropShadow} from '../src/drop-shadow';
import {Fill} from '../src/fill';
import {Panel} from '../src/panel';
import {Point2D} from '../src/point2d';

describe('Panel', () => {
  test('basic functionality', () => {
    const color = Color.hsla(0.125, 0.25, 0.5, 0.75);
    const background = Fill.color(color);
    const cornerRadius = 10;
    const dropShadow = new DropShadow({
      color: Color.hsla(0, 0.25, 0.5, 0.75),
      offset: Point2D.make(1, 2),
      radius: 3,
    });
    const elevation = 5;
    const panel = new Panel({background, cornerRadius, dropShadow, elevation});
    expect(panel.serialize()).toEqual({
      cornerRadius,
      elevation,
      background: background.serialize(),
      dropShadow: dropShadow.serialize(),
    });
  });
});

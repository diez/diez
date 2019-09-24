
import {Color, DropShadow, Point2D} from '@diez/prefabs';
import {dropShadowToCss, dropShadowToFilterCss} from '../src/css-drop-shadow';

describe('dropShadowToCss', () => {
  test('simple shadow', () => {
    const shadow = new DropShadow({
      offset: Point2D.make(1, 2),
      radius: 3,
      color: Color.hsla(0.5, 0.25, 0.75, 0.9),
    });
    expect(dropShadowToCss(shadow))
      .toBe('1px 2px 3px hsla(180, 25%, 75%, 0.9)');
  });
});

describe('dropShadowToFilterCss', () => {
  test('simple shadow', () => {
    const shadow = new DropShadow({
      offset: Point2D.make(1, 2),
      radius: 6,
      color: Color.hsla(0.5, 0.25, 0.75, 0.9),
    });
    expect(dropShadowToFilterCss(shadow))
      .toBe('drop-shadow(1px 2px 3px hsla(180, 25%, 75%, 0.9))');
  });
});

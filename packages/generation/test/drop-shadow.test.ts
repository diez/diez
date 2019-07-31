import {getDropShadowInitializer} from '../src/drop-shadow';
import {getPoint2DInitializer} from '../src/point2d';

describe('drop-shadow', () => {
  test('initializer', () => {
    const offset = {
      x: 0.1234567890,
      y: 0.1234567890,
    };
    const initializer = getDropShadowInitializer({
      offset,
      radius: 0.1234567890,
      colorInitializer: 'init',
    });
    expect(initializer).toBe(`new DropShadow({offset: ${getPoint2DInitializer(offset)}, radius: 0.123457, color: init})`);
  });
});

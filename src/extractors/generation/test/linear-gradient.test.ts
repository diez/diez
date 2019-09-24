import {getLinearGradientInitializer} from '../src/linear-gradient';

describe('linear-gradient', () => {
  test('initializer', () => {
    const start = {x: 0.1234567890, y:  0.1234567890};
    const end = {x: 1.1234567890, y: 1.1234567890};
    const stops = [
      {
        position: 0.1234567890,
        colorInitializer: 'init1',
      },
      {
        position: 1.1234567890,
        colorInitializer: 'init2',
      },
    ];
    const initializer = getLinearGradientInitializer(stops, start, end);
    expect(initializer).toBe('new LinearGradient({stops: [GradientStop.make(0.123456789, init1), GradientStop.make(1.123456789, init2)], start: Point2D.make(0.123456789, 0.123456789), end: Point2D.make(1.123456789, 1.123456789)})');
  });
});

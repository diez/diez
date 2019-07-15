import {Color, GradientStop, LinearGradient, Point2D, Toward} from '@diez/prefabs';
import {linearGradientToCss} from '../src/css-linear-gradient';

describe('linearGradientToCss', () => {
  test('simple two color', () => {
    const gradient = LinearGradient.make(Toward.Right, Color.rgb(255, 255, 255), Color.rgb(0, 0, 0));
    expect(linearGradientToCss(gradient))
      .toBe('linear-gradient(90deg, hsla(0, 0%, 100%, 1) 0%, hsla(0, 0%, 0%, 1) 100%)');
  });

  test('simple single color', () => {
    const gradient = LinearGradient.make(Toward.Right, Color.rgb(255, 255, 255));
    expect(linearGradientToCss(gradient)).toBe('linear-gradient(90deg, hsla(0, 0%, 100%, 1) 0%)');
  });

  test('simple no color provided', () => {
    const gradient = LinearGradient.make(Toward.Right);
    expect(linearGradientToCss(gradient)).toBe('linear-gradient(none)');
  });

  test('simple three colors provided', () => {
    const colors = [
      Color.rgb(255, 0, 0),
      Color.rgb(0, 255, 0),
      Color.rgb(0, 0, 255),
    ];
    const gradient = LinearGradient.make(Toward.Right, ...colors);
    expect(linearGradientToCss(gradient))
      .toBe('linear-gradient(90deg, hsla(0, 100%, 50%, 1) 0%, hsla(120, 100%, 50%, 1) 50%, hsla(240, 100%, 50%, 1) 100%)');
  });

  test('start position outside of bounds', () => {
    const gradient = new LinearGradient({
      start: Point2D.make(-0.5, 0.5),
      end: Point2D.make(0.5, 0.5),
      stops: [
        GradientStop.make(0, Color.rgb(255, 0, 0)),
        GradientStop.make(1, Color.rgb(0, 0, 255)),
      ],
    });
    expect(linearGradientToCss(gradient))
      .toBe('linear-gradient(90deg, hsla(0, 100%, 50%, 1) -50%, hsla(240, 100%, 50%, 1) 50%)');
  });

  test('end position outside of bounds', () => {
    const gradient = new LinearGradient({
      start: Point2D.make(0.5, 0.5),
      end: Point2D.make(1.5, 0.5),
      stops: [
        GradientStop.make(0, Color.rgb(255, 0, 0)),
        GradientStop.make(1, Color.rgb(0, 0, 255)),
      ],
    });
    expect(linearGradientToCss(gradient))
      .toBe('linear-gradient(90deg, hsla(0, 100%, 50%, 1) 50%, hsla(240, 100%, 50%, 1) 150%)');
  });

  test('diagonal gradient', () => {
    const gradient = new LinearGradient({
      start: Point2D.make(0, 0),
      end: Point2D.make(1, 1),
      stops: [
        GradientStop.make(0, Color.rgb(255, 0, 0)),
        GradientStop.make(1, Color.rgb(0, 0, 255)),
      ],
    });
    expect(linearGradientToCss(gradient))
      .toBe('linear-gradient(135deg, hsla(0, 100%, 50%, 1) 0%, hsla(240, 100%, 50%, 1) 100%)');
  });

  test('interesting angle gradient', () => {
    const gradient = new LinearGradient({
      start: Point2D.make(0.2, -0.1),
      end: Point2D.make(0.8, 1.1),
      stops: [
        GradientStop.make(0, Color.rgb(255, 0, 0)),
        GradientStop.make(1, Color.rgb(0, 0, 255)),
      ],
    });
    expect(linearGradientToCss(gradient))
      .toBe('linear-gradient(153deg, hsla(0, 100%, 50%, 1) 0%, hsla(240, 100%, 50%, 1) 100%)');
  });

  test('interesting angle outset gradient', () => {
    const gradient = new LinearGradient({
      start: Point2D.make(0.2, -0.5),
      end: Point2D.make(0.8, 1.5),
      stops: [
        GradientStop.make(0, Color.rgb(255, 0, 0)),
        GradientStop.make(1, Color.rgb(0, 0, 255)),
      ],
    });
    expect(linearGradientToCss(gradient))
      .toBe('linear-gradient(163deg, hsla(0, 100%, 50%, 1) -34%, hsla(240, 100%, 50%, 1) 134%)');
  });

  test('complex gradient', () => {
    const gradient = new LinearGradient({
      start: Point2D.make(0.2, 0.2),
      end: Point2D.make(0.8, 1.8),
      stops: [
        GradientStop.make(0.1, Color.rgb(255, 0, 0)),
        GradientStop.make(0.25, Color.rgb(0, 255, 0)),
        GradientStop.make(1.2, Color.rgb(0, 0, 255)),
      ],
    });
    expect(linearGradientToCss(gradient))
      .toBe('linear-gradient(159deg, hsla(0, 100%, 50%, 1) 33%, hsla(120, 100%, 50%, 1) 53%, hsla(240, 100%, 50%, 1) 179%)');
  });
});

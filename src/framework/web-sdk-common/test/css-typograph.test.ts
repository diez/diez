import {TextAlignment, TextDecoration} from '@diez/prefabs';
import {textAlignmentToCss, textDecorationsToCss} from '../src';

describe('textAlignmentToCss', () => {
  test('natrual', () => {
    expect(textAlignmentToCss(TextAlignment.Natural)).toBe('start');
  });

  test('left', () => {
    expect(textAlignmentToCss(TextAlignment.Left)).toBe('left');
  });

  test('right', () => {
    expect(textAlignmentToCss(TextAlignment.Right)).toBe('right');
  });

  test('center', () => {
    expect(textAlignmentToCss(TextAlignment.Center)).toBe('center');
  });
});

describe('textDecorationsToCss', () => {
  test('none', () => {
    expect(textDecorationsToCss([])).toBe('none');
  });

  test('underline', () => {
    expect(textDecorationsToCss([TextDecoration.Underline])).toBe('underline');
  });

  test('strikethrough', () => {
    expect(textDecorationsToCss([TextDecoration.Strikethrough])).toBe('line-through');
  });

  test('all', () => {
    const decoration = [
      TextDecoration.Strikethrough,
      TextDecoration.Underline,
    ];
    expect(textDecorationsToCss(decoration)).toBe('underline line-through');
  });

  test('more than one of each', () => {
    const decoration = [
      TextDecoration.Strikethrough,
      TextDecoration.Underline,
      TextDecoration.Underline,
      TextDecoration.Strikethrough,
    ];
    expect(textDecorationsToCss(decoration)).toBe('underline line-through');
  });
});

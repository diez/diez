import {TextAlignment} from '@diez/prefabs';
import {textAlignmentToCss} from '../src';

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

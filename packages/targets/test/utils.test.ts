import {Color} from '@diez/prefabs';
import {colorToCss, joinToKebabCase, upsertStyleGroup} from '../src/utils';

describe('colorToCss', () => {
  test('returns a string with a valid CSS <color> value from a Color prefab instance', () => {
    expect(colorToCss(new Color({h: 1, s: 1, l: 1, a: 1}))).toBe('hsla(360, 100%, 100%, 1)');
    expect(colorToCss(new Color({h: 1, s: 1, l: 1, a: 1}).fade(0.5))).toBe('hsla(360, 100%, 100%, 0.5)');
  });
});

describe('joinToKebabCase', () => {
  test('joins all arguments using kebab-case', () => {
    expect(joinToKebabCase('MyVar')).toBe('my-var');
    expect(joinToKebabCase('Parent', 'Child')).toBe('parent-child');
    expect(joinToKebabCase('Parent', 2, 'Child')).toBe('parent-2-child');
    expect(joinToKebabCase()).toBe('');
  });
});

describe('upsertStyleGroup', () => {
  const testGroup = new Map();

  test('creates a new group into the map if it does not exist', () => {
    upsertStyleGroup(testGroup, 'group-name', [['background', 'red']]);
    expect(testGroup.has('group-name')).toBeTruthy();
    expect(testGroup.get('group-name').has('background')).toBeTruthy();
    expect(testGroup.get('group-name').get('background')).toBe('red');
  });

  test('retrieves and inserts new values into the map if the provided group already exists', () => {
    upsertStyleGroup(testGroup, 'group-name', [['outline', 'brown']]);
    expect(testGroup.has('group-name')).toBeTruthy();
    expect(testGroup.get('group-name').has('background')).toBeTruthy();
    expect(testGroup.get('group-name').get('background')).toBe('red');
    expect(testGroup.get('group-name').has('outline')).toBeTruthy();
    expect(testGroup.get('group-name').get('outline')).toBe('brown');
  });

  test('applies multiple rules', () => {
    upsertStyleGroup(testGroup, 'multiple-rules', [['outline', 'brown'], ['border-radius', '4']]);
    expect(testGroup.get('multiple-rules').has('border-radius')).toBeTruthy();
    expect(testGroup.get('multiple-rules').get('border-radius')).toBe('4');
    expect(testGroup.get('multiple-rules').has('outline')).toBeTruthy();
    expect(testGroup.get('multiple-rules').get('outline')).toBe('brown');
  });
});

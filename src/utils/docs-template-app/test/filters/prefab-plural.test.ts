import {prefabPlural} from '@/filters';

describe('prefabPlural', () => {
  test('Special cases some prefabs', () => {
    expect(prefabPlural('Lottie')).toBe('Lottie Files');
    expect(prefabPlural('Size2D')).toBe('Sizes');
  });

  test('Adds the letter s to the end of the word for all other prefabs', () => {
    expect(prefabPlural('Group')).toBe('Groups');
  });
});

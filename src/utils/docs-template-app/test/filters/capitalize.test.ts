import {capitalize} from '@/filters';

describe('capitalize', () => {
  test('Capitalizes words', () => {
    expect(capitalize('hola')).toBe('Hola');
    expect(capitalize('Chau')).toBe('Chau');
  });
});

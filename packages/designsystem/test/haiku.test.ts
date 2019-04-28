import {Haiku} from '../src/haiku';

describe('haiku', () => {
  test('basic functionality', () => {
    const haiku = new Haiku({
      component: '@haiku/foo-bar',
    });
    expect(haiku.serialize()).toEqual({component: '@haiku/foo-bar'});
  });
});

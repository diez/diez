import {File} from '@livedesigner/file';
import {Haiku} from '../src';

describe('haiku', () => {
  test('basic functionality', () => {
    const haiku = new Haiku({
      file: new File({src: 'blah.html'}),
    });
    expect(haiku.serialize()).toEqual({file: {src: 'blah.html'}});
  });
});

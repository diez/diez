import {MediaQuery} from '../src/media-query';

describe('Media Query', () => {
  test('min width functionality', () => {
    const breakpoint = new MediaQuery({minWidth: 300});
    expect(breakpoint.serialize()).toEqual(expect.objectContaining({type: 'screen', minWidth: 300}));
  });
});
